import { NextResponse } from "next/server";
import { db, err, noDb, readJson, str } from "@/lib/api";
import { requireTeacher } from "@/lib/auth";
import { newCode, questionsFor } from "@/lib/live";
import { LESSONS } from "@/lib/lecture-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { rows } = await db.query(
    `select s.code, s.title, s.status, s.created_at,
            (select count(*) from live_players p where p.session_id = s.id)::int as players
       from live_sessions s order by s.created_at desc limit 20`,
  );
  const chapters = Object.entries(LESSONS)
    .filter(([, l]) => l.quiz.length > 0)
    .map(([key, l]) => ({ key, title: `${l.chapterTitle} (${key})`, questions: l.quiz.length }));
  return NextResponse.json({ sessions: rows, chapters });
}

export async function POST(req: Request) {
  if (!(await requireTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const b = await readJson(req);
  const chapterKey = str(b?.chapterKey, 80);
  if (!chapterKey || questionsFor(chapterKey).length === 0) return err("Unknown chapter.");
  const seconds = Math.min(120, Math.max(5, Math.floor(Number(b?.seconds) || 20)));
  const lesson = LESSONS[chapterKey];
  const title = str(b?.title, 120) ?? `${lesson.chapterTitle} — live quiz`;
  for (let i = 0; i < 5; i++) {
    try {
      const { rows } = await db.query<{ code: string }>(
        `insert into live_sessions (code, chapter_key, title, seconds_per_question)
         values ($1,$2,$3,$4) returning code`,
        [newCode(), chapterKey, title, seconds],
      );
      return NextResponse.json({ code: rows[0].code });
    } catch (e) {
      if ((e as { code?: string }).code !== "23505") throw e; // retry on code collision
    }
  }
  return err("Could not create a session. Try again.", 500);
}
