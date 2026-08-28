-- Rulează în Supabase → SQL Editor → New query → Run
-- Proiect: Bug Hunting (camp)

-- Sesiuni de joc (jurnal + scor per copil)
create table if not exists public.game_sessions (
  id text primary key,
  child_name text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  current_scene_index integer not null default 0,
  score integer not null default 0,
  bug_reports jsonb not null default '[]'::jsonb,
  attempts jsonb not null default '{}'::jsonb,
  scenes_completed jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists game_sessions_started_at_idx
  on public.game_sessions (started_at desc);

create unique index if not exists game_sessions_child_name_unique
  on public.game_sessions (lower(trim(child_name)));

alter table public.game_sessions enable row level security;

drop policy if exists "anon_all_game_sessions" on public.game_sessions;
create policy "anon_all_game_sessions"
  on public.game_sessions
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Bucket public pentru screenshot-uri (dovezi)
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do update set public = true;

drop policy if exists "anon_read_evidence" on storage.objects;
create policy "anon_read_evidence"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'evidence');

drop policy if exists "anon_insert_evidence" on storage.objects;
create policy "anon_insert_evidence"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'evidence');

drop policy if exists "anon_update_evidence" on storage.objects;
create policy "anon_update_evidence"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'evidence')
  with check (bucket_id = 'evidence');

drop policy if exists "anon_delete_evidence" on storage.objects;
create policy "anon_delete_evidence"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'evidence');
