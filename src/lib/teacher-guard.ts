// SERVER-ONLY: page/layout guard for /{teacher}/… routes.
// Only the signed-in teacher whose username matches the URL gets in.
import "server-only";
import { notFound, redirect } from "next/navigation";
import { getTeacher, type Teacher } from "@/lib/auth";
import { db } from "@/lib/db";

export async function guardTeacher(slug: string): Promise<Teacher> {
  const t = await getTeacher();
  if (!t) {
    // Signed out. If this really is a teacher's portal URL, send them to sign in;
    // for any other URL keep the normal 404 so random paths don't leak anything.
    const known = db
      ? (await db.query("select 1 from teachers where lower(username) = lower($1)", [slug])).rowCount
      : 0;
    if (known) redirect("/");
    notFound();
  }
  // Signed in as a different teacher → their own portal, never someone else's.
  if (t.username.toLowerCase() !== slug.toLowerCase()) redirect(`/${t.username}/courses`);
  return t;
}
