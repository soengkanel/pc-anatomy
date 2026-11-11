import { NextResponse } from "next/server";
import { db, publicStudent, type StudentRow } from "@/lib/api";
import { getTeacher, studentContext } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const teacher = await getTeacher();
  const t = teacher ? { username: teacher.username, displayName: teacher.displayName } : null;
  const ctx = await studentContext();
  if (!ctx || !db) return NextResponse.json({ student: null, teacher: t, viewAs: null });
  const { rows } = await db.query<StudentRow>(
    "select id, student_id, first_name, last_name, class_section from students where id = $1",
    [ctx.sid],
  );
  return NextResponse.json({
    student: rows[0] ? publicStudent(rows[0]) : null,
    teacher: t,
    // Set while a teacher is looking at the portal as this student (read-only).
    viewAs: ctx.viewer ? { teacher: ctx.viewer.displayName } : null,
  });
}
