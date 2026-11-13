import { NextResponse } from "next/server";
import { leaderboard } from "@/lib/leaderboard";
import { requireViewer } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireViewer();
  if (denied) return denied;
  return NextResponse.json(await leaderboard());
}
