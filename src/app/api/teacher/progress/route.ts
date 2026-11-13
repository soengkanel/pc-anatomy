import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";
import { LESSONS } from "@/lib/lecture-data";
import { COURSES, LOCKABLE_COURSES, courseOfKey, isCourseSlug } from "@/lib/courses";
import { unlockedChapters } from "@/lib/chapter-locks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Class × chapter progress for ONE of the signed-in teacher's courses.
 *   GET /api/teacher/progress?course=it-intro
 * A course the teacher doesn't own is a 404 (never another teacher's data).
 * A chapter is "done" when the student has a quiz submission for it; homework
 * is reported separately (submitted / graded) so the grid can show both.
 */
export async function GET(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();

  const owned = await db.query<{ id: string; slug: string }>(
    "select id, slug from courses where teacher_id = $1",
    [teacher.id],
  );
  const mine = COURSES.filter((c) => owned.rows.some((o) => o.slug === c.slug)).map((c) => ({ slug: c.slug, title: c.title }));
  const asked = new URL(req.url).searchParams.get("course");
  const slug = asked ?? mine[0]?.slug;
  if (!slug) return NextResponse.json({ courses: [], chapters: [], students: [] });
  if (!isCourseSlug(slug)) return err("Unknown course.", 404);
  const course = owned.rows.find((o) => o.slug === slug);
  if (!course) return err("Course not found.", 404);

  const open = LOCKABLE_COURSES.includes(slug) ? new Set(await unlockedChapters(slug)) : null;
  const chapters = Object.entries(LESSONS)
    .filter(([key]) => courseOfKey(key) === slug)
    .map(([key, l]) => ({ key, number: l.chapterNumber, title: l.chapterTitle, open: open ? open.has(key) : true }));

  const [studs, subs] = await Promise.all([
    db.query<{ id: string; student_id: string; first_name: string; last_name: string; class_section: string }>(
      "select id, student_id, first_name, last_name, class_section from students order by class_section, last_name, first_name limit 1000",
    ),
    db.query<{
      student_id: string; chapter_key: string; kind: string; status: string;
      score: number | null; max_score: number | null; teacher_score: number | null; submitted_at: string;
    }>(
      `select student_id, chapter_key, kind, status, score, max_score, teacher_score, submitted_at
         from submissions where course_id = $1`,
      [course.id],
    ),
  ]);

  type Cell = { quiz?: { score: number; max: number }; hw?: "submitted" | "graded" };
  const cells = new Map<string, Record<string, Cell>>();
  const last = new Map<string, string>();
  for (const s of subs.rows) {
    const row = cells.get(s.student_id) ?? {};
    const c = (row[s.chapter_key] ??= {});
    if (s.kind === "quiz" && s.score !== null && s.max_score) {
      // Best attempt counts.
      if (!c.quiz || s.score / s.max_score > c.quiz.score / c.quiz.max) c.quiz = { score: s.score, max: s.max_score };
    } else if (s.kind === "homework") {
      const graded = s.status !== "submitted";
      if (graded || !c.hw) c.hw = graded ? "graded" : "submitted";
    }
    cells.set(s.student_id, row);
    if (!last.get(s.student_id) || s.submitted_at > last.get(s.student_id)!) last.set(s.student_id, s.submitted_at);
  }

  return NextResponse.json({
    courses: mine,
    course: slug,
    chapters,
    students: studs.rows.map((s) => ({
      id: s.id,
      studentId: s.student_id,
      name: `${s.first_name} ${s.last_name}`,
      class: s.class_section,
      lastActive: last.get(s.id) ?? null,
      cells: cells.get(s.id) ?? {},
    })),
  });
}
