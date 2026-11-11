// SERVER-ONLY: chapter locking. Chapters start locked; the owning teacher opens
// them with the unlock key (default 789987, override with CHAPTER_UNLOCK_KEY).
// The key is only a confirmation: unlocking also needs the owner's signed-in
// teacher session, so the key alone (it lives in a public repo) opens nothing.
import "server-only";
import { db } from "@/lib/db";
import { LOCKABLE_COURSES, courseOfKey } from "@/lib/courses";

export const unlockKey = () => process.env.CHAPTER_UNLOCK_KEY || "789987";

export async function unlockedChapters(slug: string): Promise<string[]> {
  if (!db) return [];
  const { rows } = await db.query<{ chapter_key: string }>(
    `select u.chapter_key from chapter_unlocks u join courses c on c.id = u.course_id where c.slug = $1`,
    [slug],
  );
  return rows.map((r) => r.chapter_key);
}

/** True when this chapter's course has no locking, or the teacher has opened it. */
export async function isChapterOpen(chapterKey: string): Promise<boolean> {
  const slug = courseOfKey(chapterKey);
  if (!LOCKABLE_COURSES.includes(slug)) return true;
  if (!db) return false;
  const { rowCount } = await db.query(
    `select 1 from chapter_unlocks u join courses c on c.id = u.course_id
      where c.slug = $1 and u.chapter_key = $2`,
    [slug, chapterKey],
  );
  return !!rowCount;
}
