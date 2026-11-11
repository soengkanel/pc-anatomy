"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Radio, Trophy } from "lucide-react";

type Row = {
  first_name: string;
  last_initial: string;
  class_section: string;
  quiz_pts: number;
  quiz_max: number;
  quizzes: number;
  live_pts: number;
  games: number;
};

export function LeaderboardPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [live, setLive] = useState(false);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    const es = new EventSource("/api/leaderboard/stream");
    es.onopen = () => setLive(true);
    es.onerror = () => setLive(false);
    es.onmessage = (e) => {
      const d = JSON.parse(e.data) as { rows: Row[]; configured: boolean };
      setRows(d.rows);
      setConfigured(d.configured);
    };
    return () => es.close();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400">
            <Radio className={`h-3.5 w-3.5 ${live ? "text-emerald-400" : "text-neutral-600"}`} />
            {live ? "Live" : "Connecting…"}
          </span>
        </div>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold text-white">
          <Trophy className="h-6 w-6 text-amber-300" /> Leaderboard
        </h1>
        <p className="mb-6 text-[13px] text-neutral-400">
          Chapter-quiz points (best attempt per chapter) and live-game points. Updates automatically.
        </p>

        {!configured && <p className="text-[13px] text-amber-300">Scores aren&rsquo;t available yet.</p>}

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-[13.5px]">
            <thead className="bg-white/[0.04] text-left text-[11.5px] uppercase tracking-widest text-neutral-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3 text-right">Quizzes</th>
                <th className="px-4 py-3 text-right">Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows?.map((r, i) => (
                <tr key={i} className="bg-white/[0.015]">
                  <td className="px-4 py-2.5 text-neutral-400">{i + 1}</td>
                  <td className="px-4 py-2.5 text-white">
                    {r.first_name} {r.last_initial}.
                    <span className="ml-2 text-[11.5px] text-neutral-500">{r.class_section}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-violet-200">
                    {r.quiz_pts}
                    <span className="text-neutral-500">/{r.quiz_max}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-amber-200">{r.live_pts}</td>
                </tr>
              ))}
              {rows?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    No scores yet — be the first to take a quiz!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
