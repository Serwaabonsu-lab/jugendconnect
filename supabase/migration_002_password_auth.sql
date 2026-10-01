-- JugendConnect Migration 002: Passwort-Login, Programm-Ansicht für
-- Mitglieder.
-- Im Supabase SQL Editor einmalig ausführen.

-- ---------------------------------------------------------------------
-- Nutzer dürfen ihr eigenes Profil anlegen (nach echter Supabase-Auth-
-- Registrierung mit E-Mail + Passwort, direkt vom Client aus).
-- ---------------------------------------------------------------------
drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert with check (auth_user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Jede angemeldete Person (Mitglied oder Organisator) darf die
-- Programme (Events + Tage) einsehen, nicht nur Organisatoren.
-- Schreiben bleibt weiterhin Organisatoren vorbehalten (bestehende
-- Policies "organizers write/update events/event_days" gelten weiter).
-- ---------------------------------------------------------------------
drop policy if exists "authenticated users read events" on public.events;
create policy "authenticated users read events" on public.events
  for select using (auth.uid() is not null);

drop policy if exists "authenticated users read event_days" on public.event_days;
create policy "authenticated users read event_days" on public.event_days
  for select using (auth.uid() is not null);

-- ---------------------------------------------------------------------
-- Hinweis: Bereits vorhandene Profile aus der alten Registrierung (ohne
-- Passwort-Konto) können sich mit dem neuen Login nicht mehr anmelden,
-- da ihnen ein auth.users-Konto fehlt. Sie müssten sich einmalig neu
-- registrieren.
-- ---------------------------------------------------------------------
