// Course catalogue shared by the teacher portal. `prefix` is how lesson keys
// are namespaced in LESSONS (the IT intro course has no prefix).
export type CourseMeta = {
  slug: "it-intro" | "rust" | "dsa" | "statistics" | "ml";
  title: string;
  subtitle: string;
  href: string;
  prefix: string | null;
};

export const COURSES: CourseMeta[] = [
  { slug: "it-intro", title: "Introduction to IT", subtitle: "For students starting from zero", href: "/lecture", prefix: null },
  { slug: "rust", title: "Rust Programming", subtitle: "Fast, safe systems programming", href: "/rust", prefix: "rust-" },
  { slug: "dsa", title: "Data Structures & Algorithms", subtitle: "Taught in Rust, with Cambodian examples", href: "/dsa", prefix: "dsa-" },
  { slug: "statistics", title: "Statistics", subtitle: "Taught with Cambodian data", href: "/statistics", prefix: "stat-" },
  { slug: "ml", title: "Machine Learning", subtitle: "Taught with Cambodian data", href: "/ml", prefix: "ml-" },
];

export const courseOfKey = (key: string): CourseMeta["slug"] =>
  COURSES.find((c) => c.prefix && key.startsWith(c.prefix))?.slug ?? "it-intro";

/** Canonical course URL: /{teacher}/courses/{course_id} (course_id = slug). */
export const courseUrl = (teacher: string, slug: string) => `/${teacher}/courses/${slug}`;

export const isCourseSlug = (s: string): s is CourseMeta["slug"] => COURSES.some((c) => c.slug === s);

/** Courses whose chapters are locked until the teacher opens them. */
export const LOCKABLE_COURSES: CourseMeta["slug"][] = ["it-intro"];
