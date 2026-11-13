-- 0008_teaching_log.sql — the teacher's own record of what they have taught each
-- class (e.g. T2-S3) in each course: per chapter a status, the date, and notes.
create table if not exists public.teaching_log (
  course_id    uuid not null references public.courses(id) on delete cascade,
  class_code   text not null,
  chapter_key  text not null,
  status       text not null check (status in ('teaching', 'done')),
  taught_on    date not null default current_date,
  notes        text not null default '',
  updated_at   timestamptz not null default now(),
  primary key (course_id, class_code, chapter_key)
);
alter table public.teaching_log enable row level security;
