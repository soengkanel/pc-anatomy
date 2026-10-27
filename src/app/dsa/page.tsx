// Route: /dsa
// A hands-on 8-chapter Data Structures & Algorithms course for IDIC students —
// taught with Rust. Every example uses Cambodia-based scenarios (Angkor
// ticket queues, ABA account lookups, moto delivery routes, PSAR product
// searches). Each chapter ends with a bilingual key-terms glossary and a
// 20-question quiz.

import type { Metadata } from "next";
import { DSACoursePage } from "@/components/dsa/DSACoursePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Data Structures & Algorithms in Rust — IDIC Course",
  description:
    "A beginner-friendly, visual-first Data Structures & Algorithms course taught in Rust. Big-O, arrays, linked lists, stacks, queues, hash maps, trees, graphs, sorting, and searching — with runnable Rust exercises and Cambodian examples.",
  alternates: { canonical: absoluteUrl("/dsa") },
  openGraph: {
    title: "Data Structures & Algorithms in Rust — IDIC Course",
    description:
      "Learn DSA in Rust from zero — arrays, linked lists, stacks, queues, hash maps, trees, graphs, sorting, and searching, with Cambodian examples.",
    url: absoluteUrl("/dsa"),
    siteName: SITE_NAME,
    type: "article",
  },
};

export default function DSARoute() {
  return <DSACoursePage />;
}
