import { publicState } from "@/lib/live";
import { sseResponse } from "@/lib/sse";
import { requireViewer } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const denied = await requireViewer();
  if (denied) return denied;
  const { code } = await ctx.params;
  // Includes serverNow so clients can correct clock skew for the countdown.
  return sseResponse(req, async () => (await publicState(code)) ?? { error: "not_found" });
}
