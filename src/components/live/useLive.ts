"use client";

import { useEffect, useState } from "react";

export type LiveState = {
  code: string;
  title: string;
  status: "lobby" | "question" | "reveal" | "finished";
  currentQ: number;
  total: number;
  seconds: number;
  deadline: number | null;
  question: { q: string; options: string[] } | null;
  correct: number | null;
  distribution: number[] | null;
  playerCount: number;
  answeredCount: number;
  leaderboard: { id: string; nickname: string; score: number }[];
  serverNow: number;
};

/** Subscribes to a live session over SSE. `offset` = serverTime − clientTime. */
export function useLive(code: string | null) {
  const [state, setState] = useState<LiveState | null>(null);
  const [offset, setOffset] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!code) return;
    const es = new EventSource(`/api/live/${code}/stream`);
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => {
      const d = JSON.parse(e.data) as LiveState | { error: string };
      if ("error" in d) {
        setNotFound(true);
        return;
      }
      setNotFound(false);
      setOffset(d.serverNow - Date.now());
      setState(d);
    };
    return () => es.close();
  }, [code]);

  return { state, offset, notFound, connected };
}

/** Seconds left until `deadline` (server epoch ms), ticking 4×/s. */
export function useCountdown(deadline: number | null, offset: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (deadline === null) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [deadline]);
  return deadline === null ? null : Math.max(0, Math.ceil((deadline - (now + offset)) / 1000));
}

export const OPTION_STYLES = [
  "border-rose-400/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-100",
  "border-sky-400/40 bg-sky-500/15 hover:bg-sky-500/25 text-sky-100",
  "border-amber-400/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-100",
  "border-emerald-400/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-100",
];
export const OPTION_LETTERS = ["A", "B", "C", "D"];
