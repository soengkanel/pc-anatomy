// Route: /rust
// A hands-on 8-chapter Rust course for IDIC students — each lesson pairs a
// real-life animated visual with a runnable code exercise, and ends with a
// bilingual glossary + 20-question quiz.

import type { Metadata } from "next";
import { RustCoursePage } from "@/components/rust/RustCoursePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rust Programming — IDIC Course",
  description:
    "A beginner-friendly, visual-first Rust course. Ownership, structs, enums, collections, traits, and a real project — with live code exercises for every lesson.",
  alternates: { canonical: absoluteUrl("/rust") },
  openGraph: {
    title: "Rust Programming — IDIC Course",
    description:
      "Learn Rust from zero: variables, ownership, structs, traits, and a real CLI project.",
    url: absoluteUrl("/rust"),
    siteName: SITE_NAME,
    type: "article",
  },
};

export default function RustRoute() {
  return <RustCoursePage />;
}
