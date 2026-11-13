import { NextResponse } from "next/server";
import { db, err, noDb, readJson } from "@/lib/api";
import { normalizeClass } from "@/lib/classes";
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

/** Set a student's class (team + shift, e.g. T2-S1). */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await getTeacher())) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return err("Invalid student.");
  const raw = (await readJson(req))?.classSection;
  const classSection = typeof raw === "string" ? normalizeClass(raw) : null;
  if (!classSection) return err("Class must look like T2-S1 (Team 1–9, Shift 1–3).");
  const r = await db.query("update students set class_section = $2, updated_at = now() where id = $1", [id, classSection]);
  return r.rowCount ? NextResponse.json({ classSection }) : err("Student not found.", 404);
}
