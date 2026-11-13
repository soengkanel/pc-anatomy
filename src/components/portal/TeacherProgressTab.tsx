"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useKickOut } from "./PortalShell";

type Cell = { quiz?: { score: number; max: number }; hw?: "submitted" | "graded" };
type Student = { id: string; studentId: string; name: string; class: string; lastActive: string | null; cells: Record<string, Cell> };
type Data = {
  courses: { slug: string; title: string }[];
  course?: string;
  chapters: { key: string; number: string; title: string; open: boolean }[];
  students: Student[];
};

const DAY = 86_400_000;
const pct = (c?: Cell) => (c?.quiz ? Math.round((c.quiz.score / c.quiz.max) * 100) : null);
const tone = (p: number) =>
  p >= 80 ? "bg-emerald-500/25 text-emerald-100" : p >= 50 ? "bg-amber-400/20 text-amber-100" : "bg-rose-500/20 text-rose-100";

export function TeacherProgressTab() {
  const onUnauthorized = useKickOut();
  const [course, setCourse] = useState<string>("");
  const [data, setData] = useState<Data | null>(null);
  const [cls, setCls] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    fetch(`/api/teacher/progress${course ? `?course=${course}` : ""}`, { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onUnauthorized();
      const j = await r.json().catch(() => ({}));
      if (!alive) return;
      if (!r.ok) return setError(j.error ?? "Could not load progress.");
      setData(j);
    });
    return () => {
      alive = false;
    };
  }, [course, onUnauthorized]);

  const classes = useMemo(() => [...new Set((data?.students ?? []).map((s) => s.class))].sort(), [data]);
  const shown = useMemo(() => (data?.students ?? []).filter((s) => !cls || s.class === cls), [data, cls]);

  // Per-class summary: completion (quiz done, over unlocked chapters) and average best-quiz score.
  const summary = useMemo(() => {
    if (!data) return [];
    const openKeys = data.chapters.filter((c) => c.open).map((c) => c.key);
    return classes.map((c) => {
      const members = data.students.filter((s) => s.class === c);
      let done = 0, sum = 0, scored = 0;
      for (const s of members) for (const k of openKeys) {
        const p = pct(s.cells[k]);
        if (p !== null) { done++; sum += p; scored++; }
      }
      const slots = members.length * openKeys.length;
      return {
        cls: c, students: members.length,
        completion: slots ? Math.round((done / slots) * 100) : 0,
        avg: scored ? Math.round(sum / scored) : null,
        idle: members.filter((s) => !s.lastActive || Date.now() - new Date(s.lastActive).getTime() > 7 * DAY).length,
      };
    });
  }, [data, classes]);

  if (error) return <p className="text-[13px] text-rose-300">{error}</p>;
  if (!data) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;
  if (data.courses.length === 0) return <p className="text-[13px] text-neutral-400">You don&rsquo;t own any courses yet.</p>;

  const openCount = data.chapters.filter((c) => c.open).length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <select value={data.course} onChange={(e) => setCourse(e.target.value)} aria-label="Course"
          className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white">
          {data.courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
        </select>
        <select value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class"
          className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white">
          <option value="">All classes</option>
          {classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-[12px] text-neutral-500">
          {openCount} of {data.chapters.length} chapters open &middot; done = quiz submitted
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => (
          <button key={s.cls} onClick={() => setCls(cls === s.cls ? "" : s.cls)}
            className={`rounded-xl border px-3 py-2.5 text-left ${cls === s.cls ? "border-violet-400/60 bg-violet-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
            <div className="font-mono text-[12.5px] text-white">{s.cls} <span className="text-neutral-500">· {s.students} students</span></div>
            <div className="mt-1 text-[12px] text-neutral-300">
              {s.completion}% done &middot; avg {s.avg === null ? "—" : `${s.avg}%`}
            </div>
            {s.idle > 0 && <div className="mt-0.5 text-[11.5px] text-amber-300">{s.idle} inactive 7+ days</div>}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-[12.5px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-widest text-neutral-500">
            <tr>
              <th className="sticky left-0 bg-neutral-950 px-3 py-2.5 text-left">Student</th>
              {data.chapters.map((c) => (
                <th key={c.key} title={`${c.number}. ${c.title}${c.open ? "" : " (locked)"}`}
                  className={`px-2 py-2.5 text-center ${c.open ? "" : "opacity-40"}`}>
                  {c.number}{!c.open && " 🔒"}
                </th>
              ))}
              <th className="px-3 py-2.5 text-left">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {shown.map((s) => {
              const idle = !s.lastActive || Date.now() - new Date(s.lastActive).getTime() > 7 * DAY;
              return (
                <tr key={s.id} className="bg-white/[0.015]">
                  <td className="sticky left-0 whitespace-nowrap bg-neutral-950 px-3 py-2 text-white">
                    {s.name} <span className="ml-1 font-mono text-[11px] text-neutral-500">{s.class}</span>
                  </td>
                  {data.chapters.map((c) => {
                    const cell = s.cells[c.key];
                    const p = pct(cell);
                    return (
                      <td key={c.key} className={`px-1 py-1.5 text-center ${c.open ? "" : "opacity-40"}`}
                        title={cell?.quiz ? `Quiz ${cell.quiz.score}/${cell.quiz.max}${cell.hw ? ` · homework ${cell.hw}` : ""}` : cell?.hw ? `Homework ${cell.hw}` : "Not started"}>
                        {p !== null ? (
                          <span className={`inline-block min-w-[2.6rem] rounded px-1.5 py-0.5 font-mono ${tone(p)}`}>
                            {p}%{cell?.hw && <span className="ml-0.5">{cell.hw === "graded" ? "✓" : "•"}</span>}
                          </span>
                        ) : cell?.hw ? (
                          <span className="text-[11px] text-sky-300">{cell.hw === "graded" ? "hw ✓" : "hw •"}</span>
                        ) : (
                          <span className="text-neutral-700">–</span>
                        )}
                      </td>
                    );
                  })}
                  <td className={`whitespace-nowrap px-3 py-2 text-[12px] ${idle ? "text-amber-300" : "text-neutral-500"}`}>
                    {s.lastActive ? new Date(s.lastActive).toLocaleDateString() : "never"}
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr><td colSpan={data.chapters.length + 2} className="px-4 py-8 text-center text-neutral-500">No students match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-neutral-500">
        Cell = best quiz score. <span className="text-neutral-300">•</span> homework submitted, <span className="text-neutral-300">✓</span> graded. Hover a cell for details.
      </p>
    </>
  );
}
