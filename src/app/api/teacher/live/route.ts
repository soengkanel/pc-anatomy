import { NextResponse } from "next/server";
import { db, err, noDb, readJson, str } from "@/lib/api";
import { getTeacher } from "@/lib/auth";
import { newCode, questionsFor } from "@/lib/live";
import { LESSONS } from "@/lib/lecture-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { rows } = await db.query(
    `select s.code, s.title, s.status, s.created_at,
            (select count(*) from live_players p where p.session_id = s.id)::int as players
       from live_sessions s where s.teacher_id = $1 order by s.created_at desc limit 20`,
    [teacher.id],
  );
  const chapters = Object.entries(LESSONS)
    .filter(([, l]) => l.quiz.length > 0)
    .map(([key, l]) => ({ key, title: `${l.chapterTitle} (${key})`, questions: l.quiz.length }));
  return NextResponse.json({ sessions: rows, chapters });
}

export async function POST(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
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
        `insert into live_sessions (code, chapter_key, title, seconds_per_question, teacher_id)
         values ($1,$2,$3,$4,$5) returning code`,
        [newCode(), chapterKey, title, seconds, teacher.id],
      );
      return NextResponse.json({ code: rows[0].code });
    } catch (e) {
      if ((e as { code?: string }).code !== "23505") throw e; // retry on code collision
    }
  }
  return err("Could not create a session. Try again.", 500);
}
