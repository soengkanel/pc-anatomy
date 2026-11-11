import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Spreadsheet formula-injection guard + RFC4180 quoting.
const cell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replaceAll('"', '""')}"`;
};
const csv = (head: string[], rows: unknown[][]) =>
  "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";

export async function GET(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const type = new URL(req.url).searchParams.get("type") === "submissions" ? "submissions" : "scores";
  let body: string;
  if (type === "scores") {
    const { rows } = await db.query(
      `select st.student_id, st.first_name, st.last_name, st.class_section,
              coalesce((select sum(b.s) from (select max(score) s from submissions where student_id=st.id and kind='quiz' and score is not null group by course_id, chapter_key) b),0) quiz_pts,
              coalesce((select sum(b.m) from (select max(max_score) m from submissions where student_id=st.id and kind='quiz' and score is not null group by course_id, chapter_key) b),0) quiz_max,
              coalesce((select sum(score) from live_players where student_id=st.id),0) live_pts,
              (select count(*) from submissions where student_id=st.id and kind='homework') homework,
              (select round(avg(teacher_score),1) from submissions where student_id=st.id and teacher_score is not null) homework_avg
         from students st order by st.class_section, st.last_name, st.first_name`,
    );
    body = csv(
      ["student_id", "first_name", "last_name", "class", "quiz_points", "quiz_max", "live_points", "homework_submitted", "homework_avg_score"],
      rows.map((r) => [r.student_id, r.first_name, r.last_name, r.class_section, r.quiz_pts, r.quiz_max, r.live_pts, r.homework, r.homework_avg]),
    );
  } else {
    const { rows } = await db.query(
      `select st.student_id, st.first_name, st.last_name, st.class_section, c.slug course,
              s.chapter_title, s.kind, s.status, s.score, s.max_score, s.teacher_score, s.submitted_at
         from submissions s join students st on st.id=s.student_id join courses c on c.id=s.course_id
        where c.teacher_id = $1
        order by s.submitted_at desc`,
      [teacher.id],
    );
    body = csv(
      ["student_id", "first_name", "last_name", "class", "course", "chapter", "kind", "status", "score", "max_score", "teacher_score", "submitted_at"],
      rows.map((r) => [r.student_id, r.first_name, r.last_name, r.class_section, r.course, r.chapter_title, r.kind, r.status, r.score, r.max_score, r.teacher_score, r.submitted_at]),
    );
  }
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="idic-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
