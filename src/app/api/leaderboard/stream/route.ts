import { leaderboard } from "@/lib/leaderboard";
import { sseResponse } from "@/lib/sse";
import { requireViewer } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = await requireViewer();
  if (denied) return denied;
  return sseResponse(req, leaderboard, 3000);
}
