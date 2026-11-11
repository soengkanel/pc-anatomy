// Legacy route: /teacher/live/<code> → /{teacher}/live/<code>
import { redirect } from "next/navigation";
import { getTeacher } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LegacyTeacherLive({ params }: { params: Promise<{ code: string }> }) {
  const [{ code }, t] = [await params, await getTeacher()];
  redirect(t ? `/${t.username}/live/${code.replace(/[^A-Za-z0-9]/g, "")}` : "/");
}
