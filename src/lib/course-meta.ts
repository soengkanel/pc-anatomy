// Page metadata for each course, keyed by course slug (the {course_id} in
// /{teacher}/courses/{course_id}).
import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { CourseMeta } from "@/lib/courses";

const META: Record<CourseMeta["slug"], { title: string; description: string; ogDescription: string }> = {
  "it-intro": {
    title: "Introduction to Information Technology — IDIC Lecture",
    description:
      "A structured lecture covering Hardware, Software, Networking, Websites, Programming, Databases, the Internet, Cyber Security, and Artificial Intelligence.",
    ogDescription: "Classroom teaching material covering the nine core topics of Information Technology.",
  },
  rust: {
    title: "Rust Programming — IDIC Course",
    description:
      "A beginner-friendly, visual-first Rust course. Ownership, structs, enums, collections, traits, and a real project — with live code exercises for every lesson.",
    ogDescription: "Learn Rust from zero: variables, ownership, structs, traits, and a real CLI project.",
  },
  dsa: {
    title: "Data Structures & Algorithms in Rust — IDIC Course",
    description:
      "A beginner-friendly, visual-first Data Structures & Algorithms course taught in Rust. Big-O, arrays, linked lists, stacks, queues, hash maps, trees, graphs, sorting, and searching — with runnable Rust exercises and Cambodian examples.",
    ogDescription:
      "Learn DSA in Rust from zero — arrays, linked lists, stacks, queues, hash maps, trees, graphs, sorting, and searching, with Cambodian examples.",
  },
  statistics: {
    title: "Statistics — IDIC Course",
    description:
      "A beginner-friendly, visual-first Statistics course taught with Cambodian data — rice yields, market prices, ABA transfers, hospital wait times. Descriptive stats, probability, sampling, hypothesis testing, correlation, regression, ANOVA, chi-square.",
    ogDescription:
      "Learn Statistics from zero with Cambodian examples: means and medians on rice yields, hypothesis tests on ABA transfers, regression on tuk-tuk fares.",
  },
  ml: {
    title: "Machine Learning — IDIC Course",
    description:
      "A beginner-friendly, visual-first Machine Learning course taught with Cambodian data — rice yields, moto prices, ABA fraud, Khmer letters. Regression, classification, neural networks, and modern ML.",
    ogDescription:
      "Learn ML from zero with Cambodian examples: regression on rice yields, classifying ABA fraud, and a taste of deep learning.",
  },
};

export function courseMetadata(slug: CourseMeta["slug"], path: string): Metadata {
  const m = META[slug];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title: m.title, description: m.ogDescription, url: absoluteUrl(path), siteName: SITE_NAME, type: "article" },
  };
}
