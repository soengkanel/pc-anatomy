// Route: /live — students join a teacher-run live quiz with a game code.
import type { Metadata } from "next";
import { StudentLive } from "@/components/live/StudentLive";

export const metadata: Metadata = {
  title: "Join a live quiz — IDIC",
  robots: { index: false },
};

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return <StudentLive initialCode={code?.slice(0, 6).toUpperCase()} />;
}
