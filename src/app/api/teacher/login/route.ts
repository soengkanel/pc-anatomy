import { NextResponse } from "next/server";
import { err, readJson, clientIp } from "@/lib/api";
import { safeEqual, setSession, clearSession, throttled, noteFailure, clearFailures } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.TEACHER_PASSWORD;
  if (!expected) return err("Teacher access is not configured.", 503);
  const key = `teacher:${clientIp(req)}`;
  if (throttled(key)) return err("Too many attempts. Try again later.", 429);
  const b = await readJson(req);
  const pw = typeof b?.password === "string" ? b.password : "";
  if (!safeEqual(pw, expected)) {
    noteFailure(key);
    return err("Wrong password.", 401);
  }
  clearFailures(key);
  if (!(await setSession({ role: "teacher" }))) return err("Server auth is not configured.", 503);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
