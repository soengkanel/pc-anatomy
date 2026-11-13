import { TeacherTeachingTab } from "@/components/portal/TeacherTeachingTab";
import { guardTeacher } from "@/lib/teacher-guard";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ teacher: string }> }) {
  await guardTeacher((await params).teacher);
  return <TeacherTeachingTab />;
}
