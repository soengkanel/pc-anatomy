import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { getTeacher } from "@/lib/auth";
import { LESSONS } from "@/lib/lecture-data";
import { COURSES, courseOfKey, isCourseSlug } from "@/lib/courses";
import { normalizeClass } from "@/lib/classes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ownedCourse(teacherId: string, slug: string) {
  if (!db || !isCourseSlug(slug)) return null;
  const r = await db.query<{ id: string }>("select id from courses where slug = $1 and teacher_id = $2", [slug, teacherId]);
  return r.rows[0]?.id ?? null;
}

/** GET ?course=slug — chapters, classes, and the teacher's log for one of THEIR courses. */
export async function GET(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();

  const owned = await db.query<{ slug: string }>("select slug from courses where teacher_id = $1", [teacher.id]);
  const mine = COURSES.filter((c) => owned.rows.some((o) => o.slug === c.slug)).map((c) => ({ slug: c.slug, title: c.title }));
  const slug = new URL(req.url).searchParams.get("course") ?? mine[0]?.slug;
  if (!slug) return NextResponse.json({ courses: [], chapters: [], classes: [], log: [] });
  const courseId = await ownedCourse(teacher.id, slug);
  if (!courseId) return err("Course not found.", 404);

  const [log, classes] = await Promise.all([
    db.query<{ class_code: string; chapter_key: string; status: string; taught_on: string; notes: string }>(
      "select class_code, chapter_key, status, to_char(taught_on, 'YYYY-MM-DD') taught_on, notes from teaching_log where course_id = $1",
      [courseId],
    ),
    db.query<{ class_section: string; n: number }>("select class_section, count(*)::int n from students group by 1"),
  ]);
  const students = new Map(classes.rows.map((r) => [r.class_section, r.n]));
  const codes = new Set<string>();
  for (const k of students.keys()) if (normalizeClass(k)) codes.add(normalizeClass(k)!);
  for (const l of log.rows) codes.add(l.class_code);

  return NextResponse.json({
    courses: mine,
    course: slug,
    chapters: Object.entries(LESSONS)
      .filter(([key]) => courseOfKey(key) === slug)
      .map(([key, l]) => ({ key, number: l.chapterNumber, title: l.chapterTitle })),
    classes: [...codes].sort().map((c) => ({ code: c, students: students.get(c) ?? 0 })),
    log: log.rows.map((l) => ({ classCode: l.class_code, chapterKey: l.chapter_key, status: l.status, taughtOn: l.taught_on, notes: l.notes })),
  });
}

/** PUT { course, classCode, chapterKey, status: "none"|"teaching"|"done", taughtOn?, notes? } */
export async function PUT(req: Request) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const b = await readJson(req);
  const course = typeof b?.course === "string" ? b.course : "";
  const cls = typeof b?.classCode === "string" ? normalizeClass(b.classCode) : null;
  const chapter = typeof b?.chapterKey === "string" ? b.chapterKey : "";
  const status = b?.status;
  if (!cls) return err("Pick a class like T2-S3.");
  if (!isCourseSlug(course) || !LESSONS[chapter] || courseOfKey(chapter) !== course) return err("Unknown chapter.", 404);
  if (status !== "none" && status !== "teaching" && status !== "done") return err("Bad status.");
  const courseId = await ownedCourse(teacher.id, course);
  if (!courseId) return err("Course not found.", 404);

  if (status === "none") {
    await db.query("delete from teaching_log where course_id = $1 and class_code = $2 and chapter_key = $3", [courseId, cls, chapter]);
    return NextResponse.json({ ok: true });
  }
  const taughtOn = typeof b?.taughtOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.taughtOn) ? b.taughtOn : null;
  const notes = typeof b?.notes === "string" ? b.notes.slice(0, 2000) : "";
  await db.query(
    `insert into teaching_log (course_id, class_code, chapter_key, status, taught_on, notes)
     values ($1, $2, $3, $4, coalesce($5::date, current_date), $6)
     on conflict (course_id, class_code, chapter_key)
     do update set status = $4, taught_on = coalesce($5::date, teaching_log.taught_on), notes = $6, updated_at = now()`,
    [courseId, cls, chapter, status, taughtOn, notes],
  );
  return NextResponse.json({ ok: true });
}
