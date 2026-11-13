"use client";

import { usePathname, useRouter } from "next/navigation";
import { PortalShell } from "./PortalShell";

export function TeacherShell({
  username,
  displayName,
  children,
}: {
  username: string;
  displayName: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  const base = `/${username}`;
  const tabs = [
    { id: "courses", label: "My courses", href: `${base}/courses` },
    { id: "live", label: "Live games", href: `${base}/live` },
    { id: "students", label: "Students", href: `${base}/students` },
    { id: "teaching", label: "Teaching log", href: `${base}/teaching` },
    { id: "progress", label: "Progress", href: `${base}/progress` },
    { id: "submissions", label: "Submissions & grading", href: `${base}/submissions` },
    { id: "leaderboard", label: "Leaderboard", href: `${base}/leaderboard` },
  ];
  const active = tabs.find((t) => path.startsWith(t.href))?.id;

  const signOut = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <PortalShell kind="teacher" userLabel={displayName} tabs={tabs} active={active} onSignOut={signOut} wide>
      {children}
    </PortalShell>
  );
}
