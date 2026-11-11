import { NextResponse } from "next/server";
import { db, err, noDb, readJson, str, clientIp, publicStudent, type StudentRow } from "@/lib/api";
import { verifyPin, setSession, throttled, noteFailure, clearFailures } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!db) return noDb();
  const b = await readJson(req);
  const studentId = str(b?.studentId);
  const pin = typeof b?.pin === "string" ? b.pin : "";
  if (!studentId || !pin) return err("Student ID and PIN are required.");

  const key = `${clientIp(req)}:${studentId.toLowerCase()}`;
  if (throttled(key)) return err("Too many attempts. Try again in a few minutes.", 429);

  const { rows } = await db.query<StudentRow & { pin_hash: string | null }>(
    "select id, student_id, first_name, last_name, class_section, pin_hash from students where student_id = $1",
    [studentId],
  );
  const row = rows[0];
  if (!row?.pin_hash || !verifyPin(pin, row.pin_hash)) {
    noteFailure(key);
    return err("Wrong Student ID or PIN.", 401);
  }
  clearFailures(key);
  if (!(await setSession({ role: "student", sid: row.id }))) {
    return err("Server auth is not configured.", 503);
  }
  return NextResponse.json({ student: publicStudent(row) });
}
