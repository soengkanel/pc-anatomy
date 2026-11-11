// Route: "/" — the single sign-in page. Students and teachers use the same
// form; the server decides which portal to send them to. Already signed in?
// Skip straight to the portal. The public course catalogue lives at /home.
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/portal/LoginPage";
import { getSession, getTeacher } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in — IDIC",
  description: "Sign in to the IDIC student or teacher portal.",
};

export const dynamic = "force-dynamic";

export default async function Root({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const teacher = await getTeacher();
  if (teacher) redirect(`/${teacher.username}/courses`);
  if ((await getSession())?.role === "student") {
    redirect(next && /^\/(?![/\\])/.test(next) ? next : "/student");
  }
  return <LoginPage next={next} />;
}
