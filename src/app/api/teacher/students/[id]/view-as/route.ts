import { NextResponse } from "next/server";
import { db, err, noDb } from "@/lib/api";
import { getTeacher, startViewAs } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

/** Start a read-only "view as student" session (teacher only, audited). */
export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const teacher = await getTeacher();
  if (!teacher) return err("Teacher sign-in required.", 401);
  if (!db) return noDb();
  const { id } = await ctx.params;
  if (!UUID.test(id)) return err("Invalid student.");
  const st = await db.query("select 1 from students where id = $1", [id]);
  if (!st.rowCount) return err("Student not found.", 404);
  await db.query("insert into impersonation_log (teacher_id, student_id) values ($1, $2)", [teacher.id, id]);
  if (!(await startViewAs(teacher.id, id))) return err("Server auth is not configured.", 503);
  return NextResponse.json({ redirect: "/student" });
}
