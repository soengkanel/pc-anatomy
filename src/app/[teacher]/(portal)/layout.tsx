import type { Metadata } from "next";
import { TeacherShell } from "@/components/portal/TeacherShell";
import { guardTeacher } from "@/lib/teacher-guard";

export const metadata: Metadata = { title: "Teacher portal — IDIC", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TeacherLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ teacher: string }>;
}) {
  const t = await guardTeacher((await params).teacher);
  return (
    <TeacherShell username={t.username} displayName={t.displayName}>
      {children}
    </TeacherShell>
  );
}
