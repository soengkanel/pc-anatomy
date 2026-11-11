"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Play, Plus } from "lucide-react";
import { Card } from "./StudentLive";

type Chapter = { key: string; title: string; questions: number };
type SessionItem = { code: string; title: string; status: string; created_at: string; players: number };

export function TeacherDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [chapterKey, setChapterKey] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    const res = await fetch("/api/teacher/live", { cache: "no-store" });
    if (res.status === 401) return setAuthed(false);
    const j = await res.json();
    if (!res.ok) {
      setError(j.error ?? "Failed to load.");
      return setAuthed(true);
    }
    setChapters(j.chapters);
    setSessions(j.sessions);
    setChapterKey((k) => k || j.chapters[0]?.key || "");
    setAuthed(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/teacher/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Sign-in failed.");
    setPassword("");
    await load();
  };

  const create = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/teacher/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterKey, seconds }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(j.error ?? "Could not create the session.");
    router.push(`/teacher/live/${j.code}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl space-y-5 px-5 pb-16 pt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Teacher dashboard</h1>
          <Link href="/leaderboard" className="text-[13px] text-violet-300 hover:text-violet-200">
            Leaderboard →
          </Link>
        </div>

        {authed === null && <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />}

        {authed === false && (
          <Card>
            <form onSubmit={login} className="space-y-3">
              <label className="block text-[12px] font-medium text-neutral-300">Teacher password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[14px] text-white outline-none focus:border-violet-400/60"
              />
              <button className="rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[13px] font-semibold text-violet-100 hover:bg-violet-500/35">
                Sign in
              </button>
            </form>
          </Card>
        )}

        {error && (
          <div className="rounded-md border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[13px] text-rose-200">
            {error}
          </div>
        )}

        {authed && (
          <>
            <Card>
              <h2 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-white">
                <Plus className="h-4 w-4 text-violet-300" /> Start a live quiz
              </h2>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <label className="text-[12px] text-neutral-300">
                  Chapter quiz
                  <select
                    value={chapterKey}
                    onChange={(e) => setChapterKey(e.target.value)}
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white"
                  >
                    {chapters.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.title} · {c.questions} Qs
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-[12px] text-neutral-300">
                  Seconds / question
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white"
                  />
                </label>
              </div>
              <button
                onClick={create}
                disabled={busy || !chapterKey}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[13px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Create game
              </button>
            </Card>

            <Card>
              <h2 className="mb-3 text-[14px] font-semibold text-white">Recent games</h2>
              <ul className="divide-y divide-white/10">
                {sessions.map((s) => (
                  <li key={s.code} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                    <div className="min-w-0">
                      <div className="truncate text-neutral-200">{s.title}</div>
                      <div className="text-[11.5px] text-neutral-500">
                        {new Date(s.created_at).toLocaleString()} · {s.players} players · {s.status}
                      </div>
                    </div>
                    <Link
                      href={`/teacher/live/${s.code}`}
                      className="shrink-0 rounded-full border border-white/15 px-3 py-1 font-mono text-[12px] text-neutral-200 hover:bg-white/10"
                    >
                      {s.code}
                    </Link>
                  </li>
                ))}
                {sessions.length === 0 && <li className="py-2 text-[13px] text-neutral-500">No games yet.</li>}
              </ul>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
