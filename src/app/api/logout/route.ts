import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Signs out of both portals. */
export async function POST() {
  await clearSession("student");
  await clearSession("teacher");
  return NextResponse.json({ ok: true });
}
