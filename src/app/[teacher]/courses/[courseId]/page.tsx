// Route: /{teacher}/courses/{course_id} — the course itself (lessons, quizzes, exercises).
// course_id is the course slug: it-intro | rust | dsa | statistics | ml.
// The page only exists under the teacher who owns the course, and only once they
// have shared it (the owner can always preview). Once shared, reading is open; submitting a quiz or homework still needs a student sign-in.
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { courseMetadata } from "@/lib/course-meta";
import { visibleOwner } from "@/lib/course-owner";
import { getTeacher, getViewAs } from "@/lib/auth";
import { unlockedChapters } from "@/lib/chapter-locks";
import { isCourseSlug } from "@/lib/courses";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ teacher: string; courseId: string }> };

async function resolve({ params }: P) {
  const { teacher, courseId } = await params;
  if (!isCourseSlug(courseId)) notFound();
  // Not shared (and viewer isn't the owner) looks exactly like a course that doesn't exist.
  const owner = await visibleOwner(courseId);
  if (!owner) notFound();
  // Right course, wrong teacher in the URL → the canonical one.
  if (owner.toLowerCase() !== teacher.toLowerCase()) redirect(`/${owner}/courses/${courseId}`);
  return { owner, slug: courseId };
}

export async function generateMetadata(p: P): Promise<Metadata> {
  const { owner, slug } = await resolve(p);
  return courseMetadata(slug, `/${owner}/courses/${slug}`);
}

export default async function CoursePage(p: P) {
  const { owner, slug } = await resolve(p);
  // Load only the course being viewed (keeps the other four out of the bundle).
  switch (slug) {
    case "it-intro": {
      const { LecturePage } = await import("@/components/lecture/LecturePage");
      // Chapters start locked; the owning teacher opens them (see lib/chapter-locks).
      // "View as student" must look exactly like the student, so no owner privileges there.
      const me = (await getViewAs()) ? null : await getTeacher();
      return (
        <LecturePage
          locks={{
            course: "it-intro",
            unlocked: await unlockedChapters("it-intro"),
            isOwner: !!me && me.username.toLowerCase() === owner.toLowerCase(),
          }}
        />
      );
    }
    case "rust": {
      const { RustCoursePage } = await import("@/components/rust/RustCoursePage");
      return <RustCoursePage />;
    }
    case "dsa": {
      const { DSACoursePage } = await import("@/components/dsa/DSACoursePage");
      return <DSACoursePage />;
    }
    case "statistics": {
      const { StatisticsCoursePage } = await import("@/components/statistics/StatisticsCoursePage");
      return <StatisticsCoursePage />;
    }
    case "ml": {
      const { MLCoursePage } = await import("@/components/ml/MLCoursePage");
      return <MLCoursePage />;
    }
  }
}
