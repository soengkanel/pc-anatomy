-- 0007_chapter_unlocks.sql — chapters are locked by default; a row here means
-- the owning teacher has opened that chapter for students.
create table if not exists public.chapter_unlocks (
  course_id    uuid not null references public.courses(id) on delete cascade,
  chapter_key  text not null,
  unlocked_at  timestamptz not null default now(),
  primary key (course_id, chapter_key)
);
alter table public.chapter_unlocks enable row level security;
