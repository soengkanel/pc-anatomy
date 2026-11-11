// SERVER-ONLY live-quiz engine. Questions come from LESSONS (same quiz
// bank as the self-paced chapter quizzes); the answer key never leaves the
// server until a question is revealed.
import "server-only";
import { db } from "@/lib/db";
import { LESSONS } from "@/lib/lecture-data";

export type SessionRow = {
  id: string;
  code: string;
  chapter_key: string;
  title: string;
  status: "lobby" | "question" | "reveal" | "finished";
  current_q: number;
  question_started_at: string | null;
  seconds_per_question: number;
  created_at: string;
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export const newCode = () =>
  Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");

export const questionsFor = (chapterKey: string) => LESSONS[chapterKey]?.quiz ?? [];

export async function loadSession(code: string): Promise<SessionRow | null> {
  if (!db) return null;
  const { rows } = await db.query<SessionRow>(
    "select * from live_sessions where code = $1",
    [code.toUpperCase()],
  );
  return rows[0] ?? null;
}

export const deadlineOf = (s: SessionRow): number | null =>
  s.status === "question" && s.question_started_at
    ? new Date(s.question_started_at).getTime() + s.seconds_per_question * 1000
    : null;

const cache = new Map<string, { t: number; data: LiveState }>();

export type LiveState = ReturnType<typeof buildState> extends Promise<infer T> ? T : never;

/** Public, answer-safe snapshot of a session (cached ~700 ms per code). */
export async function publicState(code: string) {
  const key = code.toUpperCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < 700) {
    return { ...hit.data, serverNow: Date.now() };
  }
  const data = await buildState(key);
  if (data) cache.set(key, { t: Date.now(), data });
  return data ? { ...data, serverNow: Date.now() } : null;
}

async function buildState(code: string) {
  const s = await loadSession(code);
  if (!s || !db) return null;
  const qs = questionsFor(s.chapter_key);
  const deadline = deadlineOf(s);
  const timeUp = deadline !== null && Date.now() > deadline;
  const phase: SessionRow["status"] = timeUp ? "reveal" : s.status;
  const q = s.current_q >= 0 ? qs[s.current_q] : undefined;

  const [players, count, answered] = await Promise.all([
    db.query<{ id: string; nickname: string; score: number }>(
      "select id, nickname, score from live_players where session_id=$1 order by score desc, joined_at asc limit 10",
      [s.id],
    ),
    db.query<{ n: string }>("select count(*) n from live_players where session_id=$1", [s.id]),
    db.query<{ n: string }>(
      "select count(*) n from live_answers where session_id=$1 and question_index=$2",
      [s.id, s.current_q],
    ),
  ]);

  let distribution: number[] | null = null;
  if (phase === "reveal" && q) {
    const d = await db.query<{ selected_option: number; n: string }>(
      "select selected_option, count(*) n from live_answers where session_id=$1 and question_index=$2 group by 1",
      [s.id, s.current_q],
    );
    distribution = [0, 0, 0, 0];
    for (const r of d.rows) distribution[r.selected_option] = Number(r.n);
  }

  return {
    code: s.code,
    title: s.title,
    status: phase, // effective phase (question flips to reveal when time is up)
    currentQ: s.current_q,
    total: qs.length,
    seconds: s.seconds_per_question,
    deadline,
    question: q && phase !== "lobby" && phase !== "finished" ? { q: q.q, options: q.options } : null,
    correct: q && (phase === "reveal" || phase === "finished") ? q.answer : null,
    distribution,
    playerCount: Number(count.rows[0].n),
    answeredCount: Number(answered.rows[0].n),
    leaderboard: players.rows,
  };
}

export function invalidate(code: string) {
  cache.delete(code.toUpperCase());
}

export const pointsFor = (responseMs: number, limitMs: number) =>
  500 + Math.round(500 * Math.max(0, 1 - responseMs / limitMs));
