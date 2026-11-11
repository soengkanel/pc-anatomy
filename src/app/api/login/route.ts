// One sign-in for everyone. The ID decides the portal:
//   • a teacher username (row in `teachers`) + PIN → /{username}/courses
//   • otherwise a Student ID + PIN → /student
import { NextResponse } from "next/server";
import { db, err, noDb, readJson, str, clientIp, publicStudent, type StudentRow } from "@/lib/api";
import { verifyPin, setSession, throttled, noteFailure, clearFailures } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const b = await readJson(req);
  const id = str(b?.id);
  const secret = typeof b?.secret === "string" ? b.secret : "";
  if (!id || !secret) return err("Enter your ID and PIN.");
  if (!db) return noDb();

  const key = `login:${clientIp(req)}:${id.toLowerCase()}`;
  if (throttled(key)) return err("Too many attempts. Try again in a few minutes.", 429);

  const t = await db.query<{ id: string; username: string; pin_hash: string }>(
    "select id, username, pin_hash from teachers where lower(username) = lower($1)",
    [id],
  );
  if (t.rows[0]) {
    if (!verifyPin(secret, t.rows[0].pin_hash)) {
      noteFailure(key);
      return err("Wrong ID or PIN.", 401);
    }
    clearFailures(key);
    if (!(await setSession({ role: "teacher", tid: t.rows[0].id }))) return err("Server auth is not configured.", 503);
    return NextResponse.json({ role: "teacher", redirect: `/${t.rows[0].username}/courses` });
  }

  const { rows } = await db.query<StudentRow & { pin_hash: string | null }>(
    "select id, student_id, first_name, last_name, class_section, pin_hash from students where student_id = $1",
    [id],
  );
  const row = rows[0];
  if (!row?.pin_hash || !verifyPin(secret, row.pin_hash)) {
    noteFailure(key);
    // A student whose PIN was reset by the teacher needs to register again.
    if (row && !row.pin_hash) return err("Your PIN was reset. Tap “New student? Register” and use the same Student ID to set a new PIN.", 401);
    return err("Wrong ID or PIN.", 401);
  }
  clearFailures(key);
  if (!(await setSession({ role: "student", sid: row.id }))) return err("Server auth is not configured.", 503);
  return NextResponse.json({ role: "student", redirect: "/student", student: publicStudent(row) });
}
