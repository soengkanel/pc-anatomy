import { NextResponse } from "next/server";
import { db, requireViewer } from "@/lib/api";
import { COURSES, courseUrl } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Courses the teacher has shared, with canonical URLs (title + teacher name only; nothing private). */
export async function GET() {
  const denied = await requireViewer();
  if (denied) return denied;
  const owners = db
    ? (
        await db.query<{ slug: string; username: string; display_name: string }>(
          "select c.slug, t.username, t.display_name from courses c join teachers t on t.id = c.teacher_id where c.shared",
        )
      ).rows
    : [];
  const byslug = new Map(owners.map((o) => [o.slug, o]));
  return NextResponse.json({
    courses: COURSES.flatMap((c) => {
      const o = byslug.get(c.slug);
      return o
        ? [{ slug: c.slug, title: c.title, subtitle: c.subtitle, teacher: o.display_name, url: courseUrl(o.username, c.slug) }]
        : [];
    }),
  });
}
