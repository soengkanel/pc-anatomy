"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useKickOut } from "./PortalShell";
import { Loader2, Play, Plus } from "lucide-react";
import { Card } from "@/components/live/StudentLive";

type Chapter = { key: string; title: string; questions: number };
type SessionItem = { code: string; title: string; status: string; created_at: string; players: number };

export function TeacherLiveTab() {
  const router = useRouter();
  const { teacher } = useParams<{ teacher: string }>();
  const onUnauthorized = useKickOut();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [chapterKey, setChapterKey] = useState("");
  const [seconds, setSeconds] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/teacher/live", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onUnauthorized();
      const j = await r.json();
      if (!alive) return;
      if (!r.ok) return setError(j.error ?? "Failed to load.");
      setChapters(j.chapters);
      setSessions(j.sessions);
      setChapterKey(j.chapters[0]?.key ?? "");
    });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

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
    router.push(`/${teacher}/live/${j.code}`);
  };

  return (
    <>
      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-white">
          <Plus className="h-4 w-4 text-violet-300" /> Start a live quiz
        </h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
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
        {error && <p className="mt-3 text-[13px] text-rose-300">{error}</p>}
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
                href={`/${teacher}/live/${s.code}`}
                className="shrink-0 rounded-full border border-white/15 px-3 py-1 font-mono text-[12px] text-neutral-200 hover:bg-white/10"
              >
                {s.status === "finished" ? "Results" : "Open"} · {s.code}
              </Link>
            </li>
          ))}
          {sessions.length === 0 && <li className="py-2 text-[13px] text-neutral-500">No games yet.</li>}
        </ul>
      </Card>
    </>
  );
}
