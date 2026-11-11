import { leaderboard } from "@/lib/leaderboard";
import { sseResponse } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return sseResponse(req, leaderboard, 3000);
}
