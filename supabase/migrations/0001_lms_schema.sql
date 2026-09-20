-- IDIC LMS — minimal but complete schema for capturing quiz + homework
-- submissions.
--
-- Design goals:
--  • Every table has a surrogate uuid PK and a created_at timestamp.
--  • No auth: student identity is captured via a first-visit form (name +
--    Student ID + class). Student IDs are the natural key we upsert on.
--  • Only the server-side API writes to these tables using the service role
--    key. RLS is enabled and NO public policies are created — so any anon
--    request that somehow reaches Supabase directly is rejected.
--  • One row per submission attempt. Each answer to a quiz question is a
--    separate row in `submission_answers` so a teacher UI can slice easily.

-- ─────────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- ─────────────────────────────────────────────────────────────────
-- courses
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- 'it-intro' | 'rust'
  title       text not null,
  created_at  timestamptz not null default now()
);

-- Seed the two courses we teach.
insert into public.courses (slug, title) values
  ('it-intro', 'Introduction to Information Technology'),
  ('rust',     'Rust Programming')
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- students
-- ─────────────────────────────────────────────────────────────────
-- The teacher issues student IDs offline. We upsert on student_id, so if
-- a student clears their browser they can re-enter the same ID and their
-- history is preserved.
create table if not exists public.students (
  id             uuid primary key default gen_random_uuid(),
  student_id     text unique not null,        -- human-readable ID
  first_name     text not null,
  last_name      text not null,
  class_section  text not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists students_class_idx on public.students (class_section);

-- ─────────────────────────────────────────────────────────────────
-- submissions
-- ─────────────────────────────────────────────────────────────────
-- One row per attempt. `kind` splits multiple-choice quiz submissions from
-- free-form Rust homework code submissions.
create table if not exists public.submissions (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references public.students(id) on delete restrict,
  course_id           uuid not null references public.courses(id)  on delete restrict,

  chapter_key         text not null,           -- e.g. 'welcome-introduction', 'rust-values'
  chapter_number      text,                    -- '1'..'9' for display
  chapter_title       text,                    -- denormalised for the teacher UI

  kind                text not null check (kind in ('quiz', 'homework')),
  status              text not null default 'submitted'
                        check (status in ('submitted', 'graded', 'released')),

  started_at          timestamptz,
  submitted_at        timestamptz not null default now(),
  time_spent_seconds  integer,                 -- client-reported, not trusted for grading

  -- Quiz-only fields (nullable for homework).
  score               integer,                 -- computed on insert for quizzes
  max_score           integer,

  -- Homework-only fields (nullable for quiz).
  code_content        text,
  code_language       text default 'rust',
  notes               text,

  -- Teacher grading — filled in later via a teacher UI.
  teacher_score       integer,
  teacher_notes       text,
  graded_at           timestamptz,
  released_at         timestamptz,

  created_at          timestamptz not null default now()
);

create index if not exists submissions_student_idx  on public.submissions (student_id);
create index if not exists submissions_course_idx   on public.submissions (course_id);
create index if not exists submissions_chapter_idx  on public.submissions (course_id, chapter_key);
create index if not exists submissions_status_idx   on public.submissions (status);
create index if not exists submissions_time_idx     on public.submissions (submitted_at desc);

-- ─────────────────────────────────────────────────────────────────
-- submission_answers
-- ─────────────────────────────────────────────────────────────────
-- One row per multiple-choice question. Only used when submissions.kind = 'quiz'.
create table if not exists public.submission_answers (
  id              uuid primary key default gen_random_uuid(),
  submission_id   uuid not null references public.submissions(id) on delete cascade,
  question_index  integer not null,           -- 0-based
  selected_option integer not null,           -- 0..3 for A..D
  is_correct      boolean not null,
  created_at      timestamptz not null default now(),
  unique (submission_id, question_index)
);

create index if not exists answers_submission_idx on public.submission_answers (submission_id);

-- ─────────────────────────────────────────────────────────────────
-- Row-level security
-- ─────────────────────────────────────────────────────────────────
-- Enable RLS on every table. We do NOT create any policies here — the API
-- route uses the service role key which bypasses RLS. Any accidental
-- exposure via the anon key is safe: no reads, no writes.
alter table public.courses            enable row level security;
alter table public.students           enable row level security;
alter table public.submissions        enable row level security;
alter table public.submission_answers enable row level security;

-- ─────────────────────────────────────────────────────────────────
-- Convenience view for the teacher dashboard (built later)
-- ─────────────────────────────────────────────────────────────────
create or replace view public.submissions_with_student as
select
  s.id,
  s.kind,
  s.status,
  s.chapter_key,
  s.chapter_number,
  s.chapter_title,
  s.submitted_at,
  s.score,
  s.max_score,
  s.teacher_score,
  s.teacher_notes,
  s.released_at,
  s.code_content,
  s.notes,
  st.student_id     as student_number,
  st.first_name,
  st.last_name,
  st.class_section,
  c.slug            as course_slug,
  c.title           as course_title
from public.submissions s
join public.students    st on st.id = s.student_id
join public.courses     c  on c.id  = s.course_id;
