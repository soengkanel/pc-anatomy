// Legacy route: /teacher → the signed-in teacher's own portal.
import { redirect } from "next/navigation";
import { getTeacher } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LegacyTeacher() {
  const t = await getTeacher();
  redirect(t ? `/${t.username}/courses` : "/");
}
