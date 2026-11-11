-- 0005_impersonation_log.sql — audit trail for teachers using "view as student".
create table if not exists public.impersonation_log (
  id         uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  started_at timestamptz not null default now()
);
create index if not exists impersonation_log_time_idx on public.impersonation_log (started_at desc);
alter table public.impersonation_log enable row level security;
