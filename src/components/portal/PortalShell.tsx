"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, School } from "lucide-react";

export type Tab = { id: string; label: string; href?: string };

export function PortalShell({
  kind,
  userLabel,
  tabs,
  active,
  onTab,
  onSignOut,
  signOutLabel = "Sign out",
  children,
  wide,
}: {
  kind: "student" | "teacher";
  userLabel?: string;
  tabs?: Tab[];
  active?: string;
  onTab?: (id: string) => void;
  onSignOut?: () => void;
  signOutLabel?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const Icon = kind === "teacher" ? School : GraduationCap;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0d14]/85 backdrop-blur-xl">
        <div className={`mx-auto flex items-center justify-between gap-3 px-5 py-3 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] font-bold text-white">
            <Icon className="h-4 w-4 text-violet-300" />
            IDIC {kind === "teacher" ? "Teacher" : "Student"}
          </Link>
          <div className="flex items-center gap-3 text-[12px] text-neutral-400">
            {userLabel && <span className="hidden sm:inline">{userLabel}</span>}
            {onSignOut && (
              <button onClick={onSignOut} className="inline-flex items-center gap-1 hover:text-white">
                <LogOut className="h-3.5 w-3.5" /> {signOutLabel}
              </button>
            )}
          </div>
        </div>
        {tabs && (
          <nav className={`mx-auto flex gap-1 overflow-x-auto px-4 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
            {tabs.map((t) => {
              const cls = `whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
                active === t.id
                  ? "border-violet-400 text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`;
              return t.href ? (
                <Link key={t.id} href={t.href} className={cls}>
                  {t.label}
                </Link>
              ) : (
                <button key={t.id} onClick={() => onTab?.(t.id)} className={cls}>
                  {t.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>
      <main className={`mx-auto space-y-5 px-5 pb-20 pt-6 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>{children}</main>
    </div>
  );
}

/** Returns a callback that sends the user to the shared sign-in page (session expired / signed out). */
export function useKickOut() {
  const router = useRouter();
  return useCallback(() => router.push("/"), [router]);
}

/** Keeps the active tab in the URL hash so refresh and links keep your place. */
export function hashTab(valid: string[], fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const h = window.location.hash.slice(1);
  return valid.includes(h) ? h : fallback;
}
