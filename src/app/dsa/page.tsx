// Legacy route: /dsa → /{teacher}/courses/dsa (kept so old links and bookmarks still work).
import { notFound, redirect } from "next/navigation";
import { visibleOwner } from "@/lib/course-owner";
import { courseUrl } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function Legacy() {
  const owner = await visibleOwner("dsa");
  if (!owner) notFound(); // not shared with students yet
  redirect(courseUrl(owner, "dsa"));
}
