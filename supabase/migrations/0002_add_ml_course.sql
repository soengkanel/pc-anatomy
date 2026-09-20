-- ─────────────────────────────────────────────────────────────────
-- 0002_add_ml_course.sql
-- Adds the Machine Learning course so quiz/homework submissions from
-- the /ml route can attach to a real course_id. Idempotent — safe to
-- re-run.
-- ─────────────────────────────────────────────────────────────────

insert into public.courses (slug, title) values
  ('ml', 'Machine Learning')
on conflict (slug) do nothing;
