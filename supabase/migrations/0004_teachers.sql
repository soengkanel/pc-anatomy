-- 0004_teachers.sql — teacher accounts that own courses and live games.
-- Idempotent: safe to re-run on every deploy.

create table if not exists public.teachers (
  id           uuid primary key default gen_random_uuid(),
  username     text not null,                 -- appears in the portal URL: /{username}/courses
  display_name text not null,
  pin_hash     text not null,
  created_at   timestamptz not null default now()
);
create unique index if not exists teachers_username_lower_idx on public.teachers (lower(username));
alter table public.teachers enable row level security;

alter table public.courses       add column if not exists teacher_id uuid references public.teachers(id);
alter table public.live_sessions add column if not exists teacher_id uuid references public.teachers(id);

-- The catalogue has five courses; the original schema only seeded three.
insert into public.courses (slug, title) values
  ('dsa',        'Data Structures & Algorithms'),
  ('statistics', 'Statistics')
on conflict (slug) do nothing;
