import { NextResponse } from "next/server";
import { db, err, noDb, readJson, str, publicStudent, type StudentRow } from "@/lib/api";
import { hashPin, setSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!db) return noDb();
  const b = await readJson(req);
  const studentId = str(b?.studentId);
  const firstName = str(b?.firstName);
  const lastName = str(b?.lastName);
  const classSection = str(b?.classSection);
  const pin = typeof b?.pin === "string" ? b.pin : "";
  if (!studentId || !firstName || !lastName || !classSection) {
    return err("All fields are required.");
  }
  if (!/^[A-Za-z0-9]{4,12}$/.test(pin)) {
    return err("PIN must be 4–12 letters or digits.");
  }

  const existing = await db.query<{ id: string; pin_hash: string | null }>(
    "select id, pin_hash from students where student_id = $1",
    [studentId],
  );
  if (existing.rows[0]?.pin_hash) {
    return err("This Student ID is already registered. Please sign in.", 409);
  }

  const pinHash = hashPin(pin);
  const { rows } = await db.query<StudentRow>(
    `insert into students (student_id, first_name, last_name, class_section, pin_hash, registered_at)
     values ($1,$2,$3,$4,$5, now())
     on conflict (student_id) do update
       set first_name=$2, last_name=$3, class_section=$4, pin_hash=$5,
           registered_at=now(), updated_at=now()
       where students.pin_hash is null
     returning id, student_id, first_name, last_name, class_section`,
    [studentId, firstName, lastName, classSection, pinHash],
  );
  if (!rows[0]) return err("This Student ID is already registered. Please sign in.", 409);

  if (!(await setSession({ role: "student", sid: rows[0].id }))) {
    return err("Server auth is not configured.", 503);
  }
  return NextResponse.json({ student: publicStudent(rows[0]) });
}
