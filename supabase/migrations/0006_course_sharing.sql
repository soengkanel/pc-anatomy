-- 0006_course_sharing.sql — a teacher chooses which of their courses students can see.
-- Courses start private; the teacher shares them from /{teacher}/courses.
alter table public.courses add column if not exists shared boolean not null default false;
