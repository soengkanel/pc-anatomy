import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { loadSession, questionsFor, pointsFor, deadlineOf, invalidate } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  if (!db) return noDb();
  const ses = await getSession();
  if (ses?.role !== "student") return err("Please sign in.", 401);
  const { code } = await ctx.params;
  const s = await loadSession(code);
  if (!s) return err("Session not found.", 404);
  if (s.status !== "question" || !s.question_started_at) return err("No question is open.", 409);

  const deadline = deadlineOf(s)!;
  const now = Date.now();
  if (now > deadline + 400) return err("Time's up!", 409);

  const option = Number((await readJson(req))?.option);
  if (!Number.isInteger(option) || option < 0 || option > 3) return err("Invalid option.");

  const q = questionsFor(s.chapter_key)[s.current_q];
  if (!q) return err("No such question.", 409);

  const pl = await db.query<{ id: string }>(
    "select id from live_players where session_id=$1 and student_id=$2",
    [s.id, ses.sid],
  );
  if (!pl.rows[0]) return err("Join the quiz first.", 403);

  const correct = q.answer === option;
  const ms = Math.max(0, now - new Date(s.question_started_at).getTime());
  const points = correct ? pointsFor(Math.min(ms, s.seconds_per_question * 1000), s.seconds_per_question * 1000) : 0;

  const client = await db.connect();
  try {
    await client.query("begin");
    const ins = await client.query(
      `insert into live_answers (session_id, player_id, question_index, selected_option, is_correct, points, response_ms)
       values ($1,$2,$3,$4,$5,$6,$7) on conflict (player_id, question_index) do nothing returning id`,
      [s.id, pl.rows[0].id, s.current_q, option, correct, points, ms],
    );
    if (ins.rowCount === 0) {
      await client.query("rollback");
      return err("You already answered this question.", 409);
    }
    await client.query("update live_players set score = score + $2 where id = $1", [pl.rows[0].id, points]);
    await client.query("commit");
  } catch (e) {
    await client.query("rollback").catch(() => {});
    console.error("live answer failed:", e);
    return err("Could not record your answer.", 500);
  } finally {
    client.release();
  }
  invalidate(code);
  return NextResponse.json({ accepted: true });
}
