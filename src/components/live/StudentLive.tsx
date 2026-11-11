"use client";

import { useEffect, useState } from "react";
import { Loader2, Trophy, Radio } from "lucide-react";
import { useLive, useCountdown, OPTION_STYLES, OPTION_LETTERS } from "./useLive";

/** Code entry + gameplay for a signed-in student (rendered inside the student portal). */
export function LiveJoin({ initialCode }: { initialCode?: string }) {
  const [codeInput, setCodeInput] = useState(initialCode ?? "");
  const [code, setCode] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ id: string; nickname: string } | null>(null);

  const join = async (c: string) => {
    setJoinError(null);
    const res = await fetch(`/api/live/${c}/join`, { method: "POST" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setJoinError(j.error ?? "Could not join.");
      return;
    }
    setPlayer({ id: j.playerId, nickname: j.nickname });
    setCode(c);
  };

  if (code && player) return <Play code={code} playerId={player.id} nickname={player.nickname} />;

  return (
    <Card>
      <h2 className="text-lg font-bold text-white">Enter the game code</h2>
      <p className="mt-1 text-[13px] text-neutral-400">Your teacher shows a 6-character code on the screen.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void join(codeInput.trim().toUpperCase());
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="ABC123"
          autoFocus
          className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-center font-mono text-2xl tracking-[0.3em] text-white outline-none focus:border-violet-400/60"
        />
        <button className="rounded-lg border border-violet-400/50 bg-violet-500/25 px-5 text-[14px] font-semibold text-violet-100 hover:bg-violet-500/35">
          Join
        </button>
      </form>
      {joinError && <p className="mt-3 text-[13px] text-rose-300">{joinError}</p>}
    </Card>
  );
}

function Play({ code, playerId, nickname }: { code: string; playerId: string; nickname: string }) {
  const { state, offset, notFound, connected } = useLive(code);
  const [picked, setPicked] = useState<{ q: number; option: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const left = useCountdown(state?.status === "question" ? state.deadline : null, offset);

  // Restore my answer for the current question after a reload.
  useEffect(() => {
    if (!state || picked?.q === state.currentQ) return;
    void fetch(`/api/live/${code}/join`, { method: "POST" })
      .then((r) => r.json())
      .then((j) => {
        if (j.myAnswer != null) setPicked({ q: state.currentQ, option: j.myAnswer });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.currentQ]);

  if (notFound) return <Card>This session no longer exists.</Card>;
  if (!state) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;

  const mine = state.leaderboard.findIndex((p) => p.id === playerId);
  const myPick = picked?.q === state.currentQ ? picked.option : null;

  const answer = async (option: number) => {
    setErr(null);
    setPicked({ q: state.currentQ, option });
    const res = await fetch(`/api/live/${code}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      if (res.status !== 409 || !/already/i.test(j.error ?? "")) {
        setPicked(null);
        setErr(j.error ?? "Could not send your answer.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-[12px] text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <Radio className={`h-3.5 w-3.5 ${connected ? "text-emerald-400" : "text-rose-400"}`} />
          {state.title}
        </span>
        <span className="font-mono">{nickname} · {code}</span>
      </div>

      {state.status === "lobby" && (
        <Card center>
          <div className="text-2xl font-bold text-white">You&rsquo;re in! 🎉</div>
          <p className="mt-2 text-[14px] text-neutral-400">
            Waiting for the teacher to start… {state.playerCount} player{state.playerCount === 1 ? "" : "s"} joined.
          </p>
        </Card>
      )}

      {(state.status === "question" || state.status === "reveal") && state.question && (
        <>
          <div className="flex items-center justify-between text-[12px] text-neutral-400">
            <span>Question {state.currentQ + 1} / {state.total}</span>
            {state.status === "question" && (
              <span className={`rounded-full border px-3 py-1 font-mono text-[14px] font-bold ${
                (left ?? 0) <= 5 ? "border-rose-400/50 text-rose-300" : "border-white/15 text-white"
              }`}>
                {left}s
              </span>
            )}
          </div>
          <Card>
            <h2 className="text-[17px] font-semibold leading-snug text-white">{state.question.q}</h2>
          </Card>
          <div className="grid gap-2.5">
            {state.question.options.map((o, i) => {
              const revealed = state.status === "reveal";
              const isCorrect = revealed && state.correct === i;
              const isMine = myPick === i;
              return (
                <button
                  key={i}
                  disabled={revealed || myPick !== null}
                  onClick={() => answer(i)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[14.5px] font-medium transition-colors disabled:cursor-default ${
                    revealed
                      ? isCorrect
                        ? "border-emerald-400/70 bg-emerald-500/25 text-emerald-100"
                        : isMine
                          ? "border-rose-400/60 bg-rose-500/20 text-rose-100"
                          : "border-white/10 bg-white/[0.02] text-neutral-500"
                      : isMine
                        ? "border-violet-400/70 bg-violet-500/25 text-white"
                        : myPick !== null
                          ? "border-white/10 bg-white/[0.02] text-neutral-500"
                          : OPTION_STYLES[i]
                  }`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-black/30 font-mono text-[12px]">
                    {OPTION_LETTERS[i]}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
          {err && <p className="text-[13px] text-rose-300">{err}</p>}
          {state.status === "question" && myPick !== null && (
            <p className="text-center text-[13px] text-neutral-400">Answer locked in — waiting for others…</p>
          )}
          {state.status === "reveal" && (
            <p className="text-center text-[14px] font-semibold">
              {myPick === null ? (
                <span className="text-neutral-400">No answer this round.</span>
              ) : myPick === state.correct ? (
                <span className="text-emerald-300">Correct! ✅</span>
              ) : (
                <span className="text-rose-300">Not quite ❌</span>
              )}
            </p>
          )}
        </>
      )}

      {state.status !== "lobby" && (
        <Card>
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest text-neutral-500">
            <Trophy className="h-3.5 w-3.5 text-amber-300" />
            {state.status === "finished" ? "Final results" : "Top 10"}
          </div>
          <Board rows={state.leaderboard} meId={playerId} />
          {mine === -1 && (
            <p className="mt-2 text-[12px] text-neutral-500">You&rsquo;re outside the top 10 — keep going!</p>
          )}
        </Card>
      )}
    </div>
  );
}

export function Board({
  rows,
  meId,
  big,
}: {
  rows: { id: string; nickname: string; score: number }[];
  meId?: string;
  big?: boolean;
}) {
  const max = Math.max(1, ...rows.map((r) => r.score));
  return (
    <ol className="space-y-1.5">
      {rows.map((r, i) => (
        <li
          key={r.id}
          className={`relative overflow-hidden rounded-lg border ${
            r.id === meId ? "border-violet-400/60" : "border-white/10"
          } bg-white/[0.03] ${big ? "px-4 py-3 text-[20px]" : "px-3 py-2 text-[13.5px]"}`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-violet-500/20 transition-[width] duration-700"
            style={{ width: `${(r.score / max) * 100}%` }}
          />
          <div className="relative flex items-center justify-between">
            <span className="text-white">
              <span className="mr-2 inline-block w-6 text-neutral-400">{i + 1}</span>
              {r.nickname}
            </span>
            <span className="font-mono font-semibold text-violet-200">{r.score}</span>
          </div>
        </li>
      ))}
      {rows.length === 0 && <li className="text-[13px] text-neutral-500">No scores yet.</li>}
    </ol>
  );
}

export function Card({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${center ? "text-center" : ""}`}>
      {children}
    </div>
  );
}
