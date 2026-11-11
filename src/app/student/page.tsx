// Route: /student — the student portal (results, live quiz, leaderboard).
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StudentPortal } from "@/components/portal/StudentPortal";
import { studentContext } from "@/lib/auth";

export const metadata: Metadata = { title: "Student portal — IDIC", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function StudentPage() {
  if (!(await studentContext())) redirect("/?next=/student");
  return <StudentPortal />;
}
