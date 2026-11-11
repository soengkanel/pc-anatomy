import { NextResponse } from "next/server";
import { db, publicStudent, type StudentRow } from "@/lib/api";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ student: null, teacher: false });
  if (s.role === "teacher") return NextResponse.json({ student: null, teacher: true });
  if (!db) return NextResponse.json({ student: null, teacher: false });
  const { rows } = await db.query<StudentRow>(
    "select id, student_id, first_name, last_name, class_section from students where id = $1",
    [s.sid],
  );
  return NextResponse.json({
    student: rows[0] ? publicStudent(rows[0]) : null,
    teacher: false,
  });
}
