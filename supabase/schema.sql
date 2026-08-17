-- JugendConnect Datenbankschema
-- Diese Datei im Supabase Dashboard unter "SQL Editor" ausführen
-- (oder per `supabase db push`, falls die Supabase CLI genutzt wird).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles: registrierte Personen (Organisatoren & Mitglieder)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null unique,
  phone text,
  birth_date date,
  role text not null default 'member' check (role in ('organizer', 'member')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- events: mehrtägige Programme (z.B. ChristmasConvention 2026)
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date not null,
  end_date date not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- event_days: einzelne Tage eines Events mit eigener Uhrzeit/Ort
-- ---------------------------------------------------------------------
create table if not exists public.event_days (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  day_label text not null,
  date date not null,
  time text not null,
  location text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- tasks: Aufgaben pro Tag, mit Zuteilung, Status & Antwort-Token
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  event_day_id uuid not null references public.event_days (id) on delete cascade,
  label text not null,
  assigned_to uuid references public.profiles (id) on delete set null,
  assigned_by uuid references public.profiles (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  decline_reason text,
  response_token uuid not null default gen_random_uuid(),
  notified_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists tasks_event_day_id_idx on public.tasks (event_day_id);
create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to);
create unique index if not exists tasks_response_token_idx on public.tasks (response_token);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_days enable row level security;
alter table public.tasks enable row level security;

-- Helper: prüft, ob der eingeloggte Auth-User ein Organisator ist
create or replace function public.is_organizer()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and role = 'organizer'
  );
$$;

-- profiles: Organisatoren dürfen alle Profile lesen; jede:r darf das eigene lesen
create policy "organizers read all profiles" on public.profiles
  for select using (public.is_organizer() or auth_user_id = auth.uid());

create policy "organizers manage profiles" on public.profiles
  for update using (public.is_organizer());

-- events / event_days / tasks: nur Organisatoren dürfen lesen & schreiben.
-- Öffentliches Erstellen von Registrierungen läuft NICHT über RLS, sondern
-- über die Server-Route /api/register mit dem Service-Role-Key.
create policy "organizers read events" on public.events
  for select using (public.is_organizer());
create policy "organizers write events" on public.events
  for insert with check (public.is_organizer());
create policy "organizers update events" on public.events
  for update using (public.is_organizer());

create policy "organizers read event_days" on public.event_days
  for select using (public.is_organizer());
create policy "organizers write event_days" on public.event_days
  for insert with check (public.is_organizer());
create policy "organizers update event_days" on public.event_days
  for update using (public.is_organizer());

create policy "organizers read tasks" on public.tasks
  for select using (public.is_organizer());
create policy "organizers write tasks" on public.tasks
  for insert with check (public.is_organizer());
create policy "organizers update tasks" on public.tasks
  for update using (public.is_organizer());

-- ---------------------------------------------------------------------
-- Ersten Organisator anlegen (nach der ersten Anmeldung per Magic Link
-- einmalig ausführen, E-Mail-Adresse anpassen):
--
-- update public.profiles set role = 'organizer' where email = 'deine@email.de';
-- ---------------------------------------------------------------------
