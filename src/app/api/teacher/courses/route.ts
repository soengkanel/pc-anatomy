import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";
import { LESSONS } from "@/lib/lecture-data";
import { COURSES, courseOfKey } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The signed-in teacher's own courses, with live stats. */
export async function GET() {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();

  const owned = await db.query<{ slug: string; shared: boolean }>(
    "select slug, shared from courses where teacher_id = $1",
    [teacher.id],
  );
  const mine = new Map(owned.rows.map((r) => [r.slug, r.shared]));

  const content = new Map<string, { chapters: number; questions: number }>();
  for (const [key, l] of Object.entries(LESSONS)) {
    const slug = courseOfKey(key);
    const c = content.get(slug) ?? { chapters: 0, questions: 0 };
    c.chapters++;
    c.questions += l.quiz.length;
    content.set(slug, c);
  }

  // Course is derived from the chapter key (same rule as the lesson pages).
  const [stats, totals] = await Promise.all([
    db.query<{ chapter_key: string; student_id: string; kind: string; status: string }>(
      `select s.chapter_key, s.student_id, s.kind, s.status
         from submissions s join courses c on c.id = s.course_id where c.teacher_id = $1`,
      [teacher.id],
    ),
    db.query<{ n: number }>("select count(*)::int n from students"),
  ]);
  const agg = new Map<string, { students: Set<string>; quizzes: number; homework: number; toGrade: number }>();
  for (const r of stats.rows) {
    const slug = courseOfKey(r.chapter_key);
    const a = agg.get(slug) ?? { students: new Set(), quizzes: 0, homework: 0, toGrade: 0 };
    a.students.add(r.student_id);
    if (r.kind === "quiz") a.quizzes++;
    else {
      a.homework++;
      if (r.status === "submitted") a.toGrade++;
    }
    agg.set(slug, a);
  }

  return NextResponse.json({
    teacher: { username: teacher.username, displayName: teacher.displayName },
    totalStudents: totals.rows[0].n,
    courses: COURSES.filter((c) => mine.has(c.slug)).map((c) => ({
      ...c,
      shared: mine.get(c.slug) === true,
      chapters: content.get(c.slug)?.chapters ?? 0,
      questions: content.get(c.slug)?.questions ?? 0,
      activeStudents: agg.get(c.slug)?.students.size ?? 0,
      quizSubmissions: agg.get(c.slug)?.quizzes ?? 0,
      homework: agg.get(c.slug)?.homework ?? 0,
      toGrade: agg.get(c.slug)?.toGrade ?? 0,
    })),
  });
}
