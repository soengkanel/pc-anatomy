import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const u = new URL(req.url).searchParams;
  const where: string[] = ["c.teacher_id = $1"];
  const args: unknown[] = [teacher.id];
  const add = (sql: string, v: unknown) => {
    args.push(v);
    where.push(sql.replace("?", `$${args.length}`));
  };
  const kind = u.get("kind");
  if (kind === "quiz" || kind === "homework") add("s.kind = ?", kind);
  const status = u.get("status");
  if (status === "submitted" || status === "released") add("s.status = ?", status);
  const cls = u.get("class");
  if (cls) add("st.class_section = ?", cls);
  const q = u.get("q")?.trim();
  if (q) {
    args.push(`%${q}%`);
    const n = `$${args.length}`;
    where.push(
      `(st.student_id ilike ${n} or st.first_name ilike ${n} or st.last_name ilike ${n} or s.chapter_title ilike ${n})`,
    );
  }
  const sql = where.join(" and ");
  const { rows } = await db.query(
    `select s.id, s.kind, s.status, s.chapter_title, s.chapter_number, c.slug as course,
            s.submitted_at, s.score, s.max_score, s.teacher_score,
            st.student_id as student_number, st.first_name, st.last_name, st.class_section
       from submissions s
       join students st on st.id = s.student_id
       join courses c on c.id = s.course_id
      ${sql ? "where " + sql : ""}
      order by s.submitted_at desc limit 300`,
    args,
  );
  const classes = await db.query<{ class_section: string }>(
    "select distinct class_section from students order by 1",
  );
  return NextResponse.json({ submissions: rows, classes: classes.rows.map((r) => r.class_section) });
}
