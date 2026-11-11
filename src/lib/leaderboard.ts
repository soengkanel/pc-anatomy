import "server-only";
import { db } from "@/lib/db";

export async function leaderboard() {
  if (!db) return { rows: [], configured: false };
  const { rows } = await db.query(
    `with best as (
       select student_id, course_id, chapter_key, max(score) s, max(max_score) m
         from submissions where kind='quiz' and score is not null
        group by 1,2,3
     ), quiz as (
       select student_id, sum(s)::int pts, sum(m)::int maxpts, count(*)::int quizzes from best group by 1
     ), live as (
       select student_id, sum(score)::int pts, count(*)::int games from live_players group by 1
     )
     select st.first_name, left(st.last_name,1) as last_initial, st.class_section,
            coalesce(q.pts,0) quiz_pts, coalesce(q.maxpts,0) quiz_max, coalesce(q.quizzes,0) quizzes,
            coalesce(l.pts,0) live_pts, coalesce(l.games,0) games
       from students st
       left join quiz q on q.student_id = st.id
       left join live l on l.student_id = st.id
      where q.student_id is not null or l.student_id is not null
      order by quiz_pts desc, live_pts desc, st.first_name asc
      limit 50`,
  );
  return { rows, configured: true };
}
