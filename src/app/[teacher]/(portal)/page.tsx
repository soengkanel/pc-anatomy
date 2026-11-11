import { redirect } from "next/navigation";
import { guardTeacher } from "@/lib/teacher-guard";

export const dynamic = "force-dynamic";

export default async function TeacherHome({ params }: { params: Promise<{ teacher: string }> }) {
  const t = await guardTeacher((await params).teacher);
  redirect(`/${t.username}/courses`);
}
