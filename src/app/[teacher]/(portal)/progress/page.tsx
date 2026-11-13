import { TeacherProgressTab } from "@/components/portal/TeacherProgressTab";
import { guardTeacher } from "@/lib/teacher-guard";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ teacher: string }> }) {
  await guardTeacher((await params).teacher);
  return <TeacherProgressTab />;
}
