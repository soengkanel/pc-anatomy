import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/live/TeacherDashboard";

export const metadata: Metadata = { title: "Teacher — IDIC", robots: { index: false } };

export default function TeacherPage() {
  return <TeacherDashboard />;
}
