import { publicState } from "@/lib/live";
import { sseResponse } from "@/lib/sse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  // Includes serverNow so clients can correct clock skew for the countdown.
  return sseResponse(req, async () => (await publicState(code)) ?? { error: "not_found" });
}
