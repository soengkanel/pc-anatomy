"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useKickOut } from "./PortalShell";
import { SHIFTS, TEAMS, classCode, describeClass } from "@/lib/classes";

type Status = "teaching" | "done";
type Entry = { classCode: string; chapterKey: string; status: Status; taughtOn: string; notes: string };
type Data = {
  courses: { slug: string; title: string }[];
  course?: string;
  chapters: { key: string; number: string; title: string }[];
  classes: { code: string; students: number }[];
  log: Entry[];
};

const today = () => new Date().toISOString().slice(0, 10);
const k = (c: string, ch: string) => `${c}|${ch}`;

export function TeacherTeachingTab() {
  const onUnauthorized = useKickOut();
  const [course, setCourse] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [extra, setExtra] = useState<string[]>([]);
  const [sel, setSel] = useState<{ cls: string; ch: string } | null>(null);
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    setSel(null);
    fetch(`/api/teacher/teaching${course ? `?course=${course}` : ""}`, { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onUnauthorized();
      const j = await r.json().catch(() => ({}));
      if (!alive) return;
      if (!r.ok) return setError(j.error ?? "Could not load the teaching log.");
      setData(j);
    });
    return () => {
      alive = false;
    };
  }, [course, onUnauthorized]);

  const entries = useMemo(() => new Map((data?.log ?? []).map((e) => [k(e.classCode, e.chapterKey), e])), [data]);
  const classes = useMemo(() => {
    const codes = new Map((data?.classes ?? []).map((c) => [c.code, c.students]));
    for (const e of extra) if (!codes.has(e)) codes.set(e, 0);
    return [...codes].sort(([a], [b]) => a.localeCompare(b)).map(([code, students]) => ({ code, students }));
  }, [data, extra]);

  const pick = (cls: string, ch: string) => {
    const e = entries.get(k(cls, ch));
    setSel({ cls, ch });
    setDate(e?.taughtOn ?? today());
    setNotes(e?.notes ?? "");
    setMsg(null);
  };

  const save = async (status: "none" | Status) => {
    if (!sel || !data?.course) return;
    const r = await fetch("/api/teacher/teaching", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course: data.course, classCode: sel.cls, chapterKey: sel.ch, status, taughtOn: date, notes }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) return onUnauthorized();
    if (!r.ok) return setMsg(j.error ?? "Could not save.");
    setData((d) => {
      if (!d) return d;
      const rest = d.log.filter((e) => !(e.classCode === sel.cls && e.chapterKey === sel.ch));
      return { ...d, log: status === "none" ? rest : [...rest, { classCode: sel.cls, chapterKey: sel.ch, status, taughtOn: date, notes }] };
    });
    setMsg(status === "none" ? "Cleared." : "Saved.");
  };

  if (error) return <p className="text-[13px] text-rose-300">{error}</p>;
  if (!data) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;
  if (data.courses.length === 0) return <p className="text-[13px] text-neutral-400">You don&rsquo;t own any courses yet.</p>;

  const selChapter = sel && data.chapters.find((c) => c.key === sel.ch);
  const free = TEAMS.flatMap((t) => SHIFTS.map((s) => classCode(t, s.n))).filter((c) => !classes.some((x) => x.code === c));

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <select value={data.course} onChange={(e) => setCourse(e.target.value)} aria-label="Course"
          className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white">
          {data.courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
        </select>
        <select value="" onChange={(e) => e.target.value && setExtra((x) => [...x, e.target.value])} aria-label="Add a class"
          className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white">
          <option value="">+ Add class…</option>
          {free.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-[12px] text-neutral-500">Click a cell to record what you taught that class.</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((c) => {
          const mine = data.log.filter((e) => e.classCode === c.code);
          const done = mine.filter((e) => e.status === "done").length;
          const lastE = [...mine].sort((a, b) => b.taughtOn.localeCompare(a.taughtOn))[0];
          const lastCh = lastE && data.chapters.find((x) => x.key === lastE.chapterKey);
          return (
            <div key={c.code} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <div className="font-mono text-[12.5px] text-white">{c.code} <span className="text-neutral-500">· {c.students} students</span></div>
              <div className="mt-1 text-[12px] text-neutral-300">{done} of {data.chapters.length} chapters done</div>
              <div className="mt-0.5 text-[11.5px] text-neutral-500">
                {lastCh ? <>Last: ch {lastCh.number} · {lastE.taughtOn} ({lastE.status})</> : "Nothing taught yet"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-[12.5px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-widest text-neutral-500">
            <tr>
              <th className="sticky left-0 bg-neutral-950 px-3 py-2.5 text-left">Chapter</th>
              {classes.map((c) => <th key={c.code} title={describeClass(c.code) ?? ""} className="px-2 py-2.5 text-center font-mono">{c.code}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.chapters.map((ch) => (
              <tr key={ch.key} className="bg-white/[0.015]">
                <td className="sticky left-0 whitespace-nowrap bg-neutral-950 px-3 py-2 text-white">{ch.number}. {ch.title}</td>
                {classes.map((c) => {
                  const e = entries.get(k(c.code, ch.key));
                  const on = sel?.cls === c.code && sel.ch === ch.key;
                  return (
                    <td key={c.code} className="px-1 py-1.5 text-center">
                      <button onClick={() => pick(c.code, ch.key)} aria-label={`${c.code} ${ch.title}`}
                        className={`min-w-[4.2rem] rounded px-1.5 py-1 text-[11.5px] ${on ? "ring-2 ring-violet-400" : ""} ${
                          e?.status === "done" ? "bg-emerald-500/25 text-emerald-100"
                          : e?.status === "teaching" ? "bg-amber-400/20 text-amber-100"
                          : "text-neutral-700 hover:bg-white/10"}`}>
                        {e ? <>{e.status === "done" ? "✓" : "▶"} {e.taughtOn.slice(5)}{e.notes && " 📝"}</> : "–"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && selChapter && (
        <div className="space-y-2 rounded-2xl border border-violet-400/30 bg-violet-500/[0.06] p-4">
          <div className="text-[13px] text-white">
            <span className="font-mono">{sel.cls}</span> &middot; {selChapter.number}. {selChapter.title}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date taught"
              className="rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-[13px] text-white" />
            <button onClick={() => save("teaching")} className="rounded-full border border-amber-400/40 bg-amber-400/15 px-3 py-1.5 text-[12px] text-amber-100">▶ In progress</button>
            <button onClick={() => save("done")} className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-[12px] text-emerald-100">✓ Done</button>
            <button onClick={() => save("none")} className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-neutral-300">Clear</button>
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000}
            placeholder="Where you stopped, what to repeat next time, who was absent…"
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none focus:border-violet-400/60" />
          <p className="text-[11.5px] text-neutral-500">Pick a status to save the date and notes together.</p>
          {msg && <p className="text-[12.5px] text-emerald-200">{msg}</p>}
        </div>
      )}
    </>
  );
}
