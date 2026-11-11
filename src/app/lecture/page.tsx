// Legacy route: /lecture → /{teacher}/courses/it-intro (kept so old links and bookmarks still work).
import { notFound, redirect } from "next/navigation";
import { visibleOwner } from "@/lib/course-owner";
import { courseUrl } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function Legacy() {
  const owner = await visibleOwner("it-intro");
  if (!owner) notFound(); // not shared with students yet
  redirect(courseUrl(owner, "it-intro"));
}
