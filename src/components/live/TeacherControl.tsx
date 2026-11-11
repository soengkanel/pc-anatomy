"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useLive, useCountdown, OPTION_LETTERS } from "./useLive";
import { Board } from "./StudentLive";

export function TeacherControl({ code, home }: { code: string; home: string }) {
  const { state, offset, notFound } = useLive(code);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const left = useCountdown(state?.status === "question" ? state.deadline : null, offset);

  useEffect(() => {
    void fetch("/api/auth/me").then((r) => r.json()).then((j) => setAuthed(!!j.teacher));
  }, []);

  const act = async (action: "start" | "reveal" | "next" | "end") => {
    setBusy(true);
    setErr(null);
    const res = await fetch(`/api/teacher/live/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) setErr((await res.json().catch(() => ({}))).error ?? "Action failed.");
    setBusy(false);
  };

  if (notFound) return <Center>Session not found.</Center>;
  if (authed === false)
    return (
      <Center>
        <Link href="/" className="text-violet-300 underline">Sign in as teacher</Link> to control this game.
      </Center>
    );
  if (!state || authed === null) return <Center><Loader2 className="h-6 w-6 animate-spin" /></Center>;

  const btn =
    "rounded-full border border-violet-400/50 bg-violet-500/25 px-5 py-2.5 text-[14px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-50";
  const last = state.currentQ + 1 >= state.total;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-4xl space-y-5 px-6 pb-16 pt-8">
        <div className="flex items-center justify-between">
          <Link href={home} className="inline-flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[14px] text-neutral-300">
            <Users className="h-4 w-4" /> {state.playerCount} joined
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <div className="text-[13px] text-neutral-400">Join at {window.location.origin}/live with code</div>
          <div className="mt-1 font-mono text-6xl font-extrabold tracking-[0.25em] text-white">{state.code}</div>
          <div className="mt-2 text-[13px] text-neutral-500">{state.title}</div>
        </div>

        {(state.status === "question" || state.status === "reveal") && state.question && (
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between text-[13px] text-neutral-400">
              <span>Question {state.currentQ + 1} / {state.total}</span>
              {state.status === "question" ? (
                <span className="font-mono text-2xl font-bold text-white">{left}s</span>
              ) : (
                <span className="font-semibold text-emerald-300">Answer revealed</span>
              )}
            </div>
            <h2 className="text-2xl font-semibold leading-snug text-white">{state.question.q}</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {state.question.options.map((o, i) => {
                const rev = state.status === "reveal";
                const n = state.distribution?.[i] ?? 0;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-4 py-3 text-[16px] ${
                      rev
                        ? state.correct === i
                          ? "border-emerald-400/70 bg-emerald-500/20 text-emerald-100"
                          : "border-white/10 text-neutral-500"
                        : "border-white/15 text-neutral-200"
                    }`}
                  >
                    <span className="mr-2 font-mono text-neutral-400">{OPTION_LETTERS[i]}</span>
                    {o}
                    {rev && <span className="float-right font-mono text-[14px]">{n}</span>}
                  </div>
                );
              })}
            </div>
            <div className="text-[13px] text-neutral-400">
              {state.answeredCount} / {state.playerCount} answered
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {state.status === "lobby" && (
            <button className={btn} disabled={busy || state.playerCount === 0} onClick={() => act("start")}>
              Start quiz
            </button>
          )}
          {state.status === "question" && (
            <button className={btn} disabled={busy} onClick={() => act("reveal")}>Reveal answer</button>
          )}
          {(state.status === "question" || state.status === "reveal") && (
            <button className={btn} disabled={busy} onClick={() => act("next")}>
              {last ? "Finish" : "Next question"}
            </button>
          )}
          {state.status !== "finished" && state.status !== "lobby" && (
            <button
              className="text-[13px] text-rose-300 hover:text-rose-200"
              disabled={busy}
              onClick={() => confirm("End this game now?") && act("end")}
            >
              End game
            </button>
          )}
          {err && <span className="text-[13px] text-rose-300">{err}</span>}
        </div>

        {state.status !== "lobby" && (
          <div>
            <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-neutral-500">
              {state.status === "finished" ? "Final results" : "Live scoreboard"}
            </h3>
            <Board rows={state.leaderboard} big />
          </div>
        )}
      </main>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-background text-neutral-300">{children}</div>;
}
