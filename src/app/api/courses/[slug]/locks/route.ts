import { NextResponse } from "next/server";
import { err } from "@/lib/api";
import { unlockedChapters } from "@/lib/chapter-locks";
import { visibleOwner } from "@/lib/course-owner";
import { LOCKABLE_COURSES, isCourseSlug } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Which chapters are open right now (the course page polls this so students see a chapter open live). */
export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!isCourseSlug(slug) || !LOCKABLE_COURSES.includes(slug) || !(await visibleOwner(slug))) {
    return err("Not found.", 404);
  }
  return NextResponse.json({ unlocked: await unlockedChapters(slug) });
}
