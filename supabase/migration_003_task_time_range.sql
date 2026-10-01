-- JugendConnect Migration 003: Eigene Uhrzeit (von-bis) und Datum pro
-- Dienst (Aufgabe), unabhängig vom übergeordneten Tag.
-- Im Supabase SQL Editor einmalig ausführen.

alter table public.tasks
  add column if not exists date date,
  add column if not exists start_time text,
  add column if not exists end_time text;
