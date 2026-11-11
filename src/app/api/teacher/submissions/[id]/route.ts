import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return err("Invalid submission.");
  const { rows } = await db.query(
    `select s.id, s.kind, s.status, s.chapter_title, s.submitted_at, s.score, s.max_score,
            s.code_content, s.code_language, s.notes, s.teacher_score, s.teacher_notes,
            s.time_spent_seconds, st.first_name, st.last_name, st.student_id as student_number
       from submissions s join students st on st.id = s.student_id
       join courses c on c.id = s.course_id
      where s.id = $1 and c.teacher_id = $2`,
    [id, teacher.id],
  );
  return rows[0] ? NextResponse.json(rows[0]) : err("Not found.", 404);
}

/** Save a grade and release it to the student in one step. */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return err("Invalid submission.");
  const b = await readJson(req);
  const score = Number(b?.score);
  if (!Number.isFinite(score) || score < 0 || score > 1000) return err("Enter a score between 0 and 1000.");
  const notes = typeof b?.notes === "string" ? b.notes.slice(0, 4000) : "";
  const r = await db.query(
    `update submissions set teacher_score=$2, teacher_notes=$3, status='released',
            graded_at=now(), released_at=now()
      where id=$1 and kind='homework'
        and course_id in (select id from courses where teacher_id = $4)`,
    [id, Math.round(score), notes || null, teacher.id],
  );
  return r.rowCount ? NextResponse.json({ ok: true }) : err("Only homework can be graded.", 404);
}
