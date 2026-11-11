import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { getTeacher, safeEqual, throttled, noteFailure, clearFailures } from "@/lib/auth";
import { unlockKey } from "@/lib/chapter-locks";
import { LOCKABLE_COURSES, courseOfKey, isCourseSlug } from "@/lib/courses";
import { LESSONS } from "@/lib/lecture-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Open (or lock again) one chapter. Needs the owner's session AND the unlock key. */
export async function POST(req: Request, ctx: { params: Promise<{ slug: string; chapter: string }> }) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { slug, chapter } = await ctx.params;
  if (!isCourseSlug(slug) || !LOCKABLE_COURSES.includes(slug)) return err("This course has no locked chapters.", 404);
  if (!LESSONS[chapter] || courseOfKey(chapter) !== slug) return err("Unknown chapter.", 404);

  const b = await readJson(req);
  const key = typeof b?.key === "string" ? b.key : "";
  if (typeof b?.unlocked !== "boolean") return err("Say whether to open or lock the chapter.");

  const throttleKey = `unlock:${teacher.id}`;
  if (throttled(throttleKey, 5)) return err("Too many wrong keys. Try again in a few minutes.", 429);
  if (!safeEqual(key, unlockKey())) {
    noteFailure(throttleKey);
    return err("Wrong key.", 403);
  }
  clearFailures(throttleKey);

  const course = await db.query<{ id: string }>("select id from courses where slug = $1 and teacher_id = $2", [slug, teacher.id]);
  if (!course.rows[0]) return err("Course not found.", 404);
  if (b.unlocked) {
    await db.query(
      "insert into chapter_unlocks (course_id, chapter_key) values ($1, $2) on conflict do nothing",
      [course.rows[0].id, chapter],
    );
  } else {
    await db.query("delete from chapter_unlocks where course_id = $1 and chapter_key = $2", [course.rows[0].id, chapter]);
  }
  return NextResponse.json({ chapter, unlocked: b.unlocked });
}
