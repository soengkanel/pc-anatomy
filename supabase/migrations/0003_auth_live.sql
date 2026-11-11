-- 0003_auth_live.sql — student PIN auth + teacher-run live quizzes.
-- Idempotent: safe to re-run on every deploy.

alter table public.students add column if not exists pin_hash text;
alter table public.students add column if not exists registered_at timestamptz;

create table if not exists public.live_sessions (
  id                   uuid primary key default gen_random_uuid(),
  code                 text unique not null,           -- 6-char join code
  chapter_key          text not null,                  -- key into LESSONS
  title                text not null,
  status               text not null default 'lobby'
                         check (status in ('lobby','question','reveal','finished')),
  current_q            integer not null default -1,
  question_started_at  timestamptz,
  seconds_per_question integer not null default 20,
  created_at           timestamptz not null default now()
);

create table if not exists public.live_players (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.live_sessions(id) on delete cascade,
  student_id  uuid not null references public.students(id) on delete cascade,
  nickname    text not null,
  score       integer not null default 0,
  joined_at   timestamptz not null default now(),
  unique (session_id, student_id)
);

create table if not exists public.live_answers (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.live_sessions(id) on delete cascade,
  player_id       uuid not null references public.live_players(id) on delete cascade,
  question_index  integer not null,
  selected_option integer not null,
  is_correct      boolean not null,
  points          integer not null default 0,
  response_ms     integer not null,
  answered_at     timestamptz not null default now(),
  unique (player_id, question_index)
);

create index if not exists live_players_session_idx on public.live_players (session_id, score desc);
create index if not exists live_answers_session_idx on public.live_answers (session_id, question_index);

alter table public.live_sessions enable row level security;
alter table public.live_players  enable row level security;
alter table public.live_answers  enable row level security;
