import { NextResponse } from "next/server";
import { endViewAs, getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await endViewAs();
  const t = await getTeacher();
  return NextResponse.json({ redirect: t ? `/${t.username}/students` : "/" });
}
