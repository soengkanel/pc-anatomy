import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { getTeacher } from "@/lib/auth";
import { isCourseSlug } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Share a course with students (or stop sharing). Owner only. */
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { slug } = await ctx.params;
  if (!isCourseSlug(slug)) return err("Unknown course.", 404);
  const shared = (await readJson(req))?.shared;
  if (typeof shared !== "boolean") return err("Say whether to share or stop sharing.");
  const r = await db.query<{ shared: boolean }>(
    "update courses set shared = $3 where slug = $1 and teacher_id = $2 returning shared",
    [slug, teacher.id, shared],
  );
  return r.rows[0] ? NextResponse.json({ shared: r.rows[0].shared }) : err("Course not found.", 404);
}
