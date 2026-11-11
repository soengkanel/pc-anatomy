import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { studentContext } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) return noDb();
  const s = await studentContext();
  if (!s) return err("Please sign in.", 401);

  const [quizzes, homework, live] = await Promise.all([
    db.query(
      `select s.chapter_key, max(s.chapter_title) as title, max(s.chapter_number) as num,
              c.slug as course, max(s.score)::int as best, max(s.max_score)::int as max,
              count(*)::int as attempts, max(s.submitted_at) as last
         from submissions s join courses c on c.id = s.course_id
        where s.student_id = $1 and s.kind = 'quiz'
        group by s.chapter_key, c.slug order by last desc`,
      [s.sid],
    ),
    db.query(
      `select s.id, s.chapter_title as title, c.slug as course, s.submitted_at, s.status,
              case when s.status = 'released' then s.teacher_score end as teacher_score,
              case when s.status = 'released' then s.teacher_notes end as teacher_notes
         from submissions s join courses c on c.id = s.course_id
        where s.student_id = $1 and s.kind = 'homework' order by s.submitted_at desc limit 50`,
      [s.sid],
    ),
    db.query(
      `select ls.title, ls.created_at, p.score,
              (select count(*)+1 from live_players q where q.session_id = p.session_id and q.score > p.score)::int as rank,
              (select count(*) from live_players q where q.session_id = p.session_id)::int as players
         from live_players p join live_sessions ls on ls.id = p.session_id
        where p.student_id = $1 order by ls.created_at desc limit 50`,
      [s.sid],
    ),
  ]);
  return NextResponse.json({ quizzes: quizzes.rows, homework: homework.rows, live: live.rows });
}
