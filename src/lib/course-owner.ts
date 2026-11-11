// SERVER-ONLY: who owns a course, and whether the current visitor may see it.
import "server-only";
import { db } from "@/lib/db";
import { getTeacher, getViewAs } from "@/lib/auth";

export async function ownerOf(slug: string): Promise<string | null> {
  if (!db) return null;
  const { rows } = await db.query<{ username: string }>(
    "select t.username from courses c join teachers t on t.id = c.teacher_id where c.slug = $1",
    [slug],
  );
  return rows[0]?.username ?? null;
}

/**
 * The owner's username if the current visitor may see this course, else null.
 * A course is visible when the teacher has shared it, or to the owning teacher
 * (so they can preview it before sharing). Hidden courses look like they don't exist.
 * While a teacher is in "view as student" they are treated exactly like that student.
 */
export async function visibleOwner(slug: string): Promise<string | null> {
  if (!db) return null;
  const { rows } = await db.query<{ username: string; teacher_id: string; shared: boolean }>(
    "select t.username, c.teacher_id, c.shared from courses c join teachers t on t.id = c.teacher_id where c.slug = $1",
    [slug],
  );
  const c = rows[0];
  if (!c) return null;
  if (c.shared) return c.username;
  if (await getViewAs()) return null; // viewing as a student: no owner privileges
  const me = await getTeacher();
  return me && me.id === c.teacher_id ? c.username : null;
}
