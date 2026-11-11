import type { Metadata } from "next";
import { TeacherControl } from "@/components/live/TeacherControl";
import { guardTeacher } from "@/lib/teacher-guard";

export const metadata: Metadata = { title: "Live quiz — IDIC", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TeacherLivePage({
  params,
}: {
  params: Promise<{ teacher: string; code: string }>;
}) {
  const { teacher, code } = await params;
  const t = await guardTeacher(teacher);
  return <TeacherControl code={code.toUpperCase()} home={`/${t.username}/live`} />;
}
