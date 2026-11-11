import type { Metadata } from "next";
import { TeacherControl } from "@/components/live/TeacherControl";

export const metadata: Metadata = { title: "Live quiz — IDIC", robots: { index: false } };

export default async function TeacherLivePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <TeacherControl code={code.toUpperCase()} />;
}
