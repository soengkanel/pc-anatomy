import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { rows } = await db.query(
    `select st.id, st.student_id, st.first_name, st.last_name, st.class_section,
            st.registered_at, (st.pin_hash is not null) as has_pin,
            coalesce((select sum(b.s) from (select max(score) s from submissions
                        where student_id = st.id and kind='quiz' and score is not null
                        group by course_id, chapter_key) b), 0)::int as quiz_pts,
            coalesce((select sum(b.m) from (select max(max_score) m from submissions
                        where student_id = st.id and kind='quiz' and score is not null
                        group by course_id, chapter_key) b), 0)::int as quiz_max,
            (select count(*) from submissions where student_id = st.id)::int as submissions,
            coalesce((select sum(score) from live_players where student_id = st.id), 0)::int as live_pts,
            greatest(
              (select max(submitted_at) from submissions where student_id = st.id),
              (select max(joined_at) from live_players where student_id = st.id),
              st.registered_at
            ) as last_activity
       from students st
      order by st.class_section, st.last_name, st.first_name
      limit 1000`,
  );
  return NextResponse.json({ students: rows });
}
