import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

/** Reset a forgotten PIN: the student re-registers the same Student ID with a new PIN. */
export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return err("Invalid student.");
  const r = await db.query("update students set pin_hash = null where id = $1", [id]);
  return r.rowCount ? NextResponse.json({ ok: true }) : err("Student not found.", 404);
}
