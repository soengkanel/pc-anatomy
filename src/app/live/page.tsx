// Route: /live — shortcut into the student portal's "Join live quiz" tab.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StudentPortal } from "@/components/portal/StudentPortal";
import { studentContext } from "@/lib/auth";

export const metadata: Metadata = { title: "Join a live quiz — IDIC", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const clean = code?.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase();
  if (!(await studentContext())) {
    redirect(`/?next=${encodeURIComponent(clean ? `/live?code=${clean}` : "/live")}`);
  }
  return <StudentPortal initialTab="live" initialCode={clean} />;
}
