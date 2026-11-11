import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { writableStudent } from "@/lib/auth";
import { loadSession, invalidate } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_: Request, ctx: { params: Promise<{ code: string }> }) {
  if (!db) return noDb();
  const ses = await writableStudent();
  if ("error" in ses) return err(ses.error, ses.status);
  const { code } = await ctx.params;
  const s = await loadSession(code);
  if (!s) return err("No live quiz with that code.", 404);

  const st = await db.query<{ first_name: string; last_name: string }>(
    "select first_name, last_name from students where id=$1",
    [ses.sid],
  );
  if (!st.rows[0]) return err("Student not found.", 401);
  const nick = `${st.rows[0].first_name} ${st.rows[0].last_name.charAt(0)}.`;

  const p = await db.query<{ id: string; nickname: string; score: number }>(
    `insert into live_players (session_id, student_id, nickname) values ($1,$2,$3)
     on conflict (session_id, student_id) do update set nickname = excluded.nickname
     returning id, nickname, score`,
    [s.id, ses.sid, nick],
  );
  const mine = await db.query<{ selected_option: number }>(
    "select selected_option from live_answers where player_id=$1 and question_index=$2",
    [p.rows[0].id, s.current_q],
  );
  invalidate(code);
  return NextResponse.json({
    playerId: p.rows[0].id,
    nickname: p.rows[0].nickname,
    score: p.rows[0].score,
    myAnswer: mine.rows[0]?.selected_option ?? null,
  });
}
