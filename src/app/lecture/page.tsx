// Route: /lecture
// A one-page teaching deck for the "Introduction to Information Technology" course
// designed as classroom material for Professor's IDIC students.

import type { Metadata } from "next";
import { LecturePage } from "@/components/lecture/LecturePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Introduction to Information Technology — IDIC Lecture",
  description:
    "A structured lecture covering Hardware, Software, Networking, Websites, Programming, Databases, the Internet, Cyber Security, and Artificial Intelligence.",
  alternates: { canonical: absoluteUrl("/lecture") },
  openGraph: {
    title: "Introduction to Information Technology — IDIC Lecture",
    description:
      "Classroom teaching material covering the nine core topics of Information Technology.",
    url: absoluteUrl("/lecture"),
    siteName: SITE_NAME,
    type: "article",
  },
};

export default function LectureRoute() {
  return <LecturePage />;
}
