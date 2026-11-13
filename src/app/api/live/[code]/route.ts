import { NextResponse } from "next/server";
import { err, requireViewer } from "@/lib/api";
import { publicState } from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: Promise<{ code: string }> }) {
  const denied = await requireViewer();
  if (denied) return denied;
  const st = await publicState((await ctx.params).code);
  return st ? NextResponse.json(st) : err("Session not found.", 404);
}
