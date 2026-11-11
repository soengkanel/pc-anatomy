"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, LogIn, UserPlus } from "lucide-react";
import { StudentIdentityForm } from "@/components/lms/StudentIdentityForm";

/** Same-site relative paths only (blocks open redirects). */
const safeNext = (n?: string) => (n && /^\/(?![/\\])/.test(n) ? n : undefined);

export function LoginPage({ next }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [id, setId] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = (role: "student" | "teacher", redirect: string) => {
    const n = safeNext(next);
    // Teachers always land in their portal; students may resume where they were.
    router.push(role === "student" && n ? n : redirect);
    router.refresh();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, secret }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Sign-in failed.");
      go(j.role, j.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-10 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-[13px] font-semibold uppercase tracking-[0.25em] text-violet-300">IDIC</div>
          <h1 className="mt-2 text-2xl font-bold text-white">
            {mode === "signin" ? "Sign in" : "Create your student account"}
          </h1>
          <p className="mt-1 text-[13px] text-neutral-400">
            {mode === "signin"
              ? "Students and teachers sign in here. We'll take you to the right place."
              : "Register once with your Student ID and a PIN."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          {mode === "signin" ? (
            <form onSubmit={submit} className="space-y-4">
              <label className="flex flex-col gap-1 text-[12px]">
                <span className="font-medium text-neutral-300">Student ID or teacher username</span>
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  autoFocus
                  autoCapitalize="none"
                  autoComplete="username"
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[14px] text-white outline-none focus:border-violet-400/60"
                />
              </label>
              <label className="flex flex-col gap-1 text-[12px]">
                <span className="font-medium text-neutral-300">PIN or password</span>
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  autoComplete="current-password"
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[14px] text-white outline-none focus:border-violet-400/60"
                />
              </label>
              {error && (
                <div className="rounded-md border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[12.5px] text-rose-200">
                  {error}
                </div>
              )}
              <button
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-400/50 bg-violet-500/30 px-4 py-2.5 text-[14px] font-semibold text-violet-50 transition-colors hover:bg-violet-500/40 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                Sign in
              </button>
            </form>
          ) : (
            <StudentIdentityForm registerOnly onSaved={() => go("student", "/student")} />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px]">
          <button
            onClick={() => {
              setMode(mode === "signin" ? "register" : "signin");
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 text-violet-300 hover:text-violet-200"
          >
            <UserPlus className="h-4 w-4" />
            {mode === "signin" ? "New student? Register" : "Already registered? Sign in"}
          </button>
          <Link href="/home" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white">
            <BookOpen className="h-4 w-4" /> Browse courses
          </Link>
        </div>
      </div>
    </div>
  );
}
