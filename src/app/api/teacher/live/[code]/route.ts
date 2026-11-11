import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { requireTeacher } from "@/lib/auth";
import { loadSession, questionsFor, invalidate, publicState } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  if (!(await requireTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { code } = await ctx.params;
  const s = await loadSession(code);
  if (!s) return err("Session not found.", 404);
  const action = (await readJson(req))?.action;
  const total = questionsFor(s.chapter_key).length;

  if (action === "start" && s.status === "lobby") {
    await db.query(
      "update live_sessions set status='question', current_q=0, question_started_at=now() where id=$1",
      [s.id],
    );
  } else if (action === "reveal" && s.status === "question") {
    await db.query("update live_sessions set status='reveal' where id=$1", [s.id]);
  } else if (action === "next" && (s.status === "question" || s.status === "reveal")) {
    if (s.current_q + 1 >= total) {
      await db.query("update live_sessions set status='finished' where id=$1", [s.id]);
    } else {
      await db.query(
        "update live_sessions set status='question', current_q=current_q+1, question_started_at=now() where id=$1",
        [s.id],
      );
    }
  } else if (action === "end" && s.status !== "finished") {
    await db.query("update live_sessions set status='finished' where id=$1", [s.id]);
  } else {
    return err("That action isn't available right now.", 409);
  }
  invalidate(code);
  return NextResponse.json(await publicState(code));
}
