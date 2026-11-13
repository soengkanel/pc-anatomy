"use client";

import { useEffect, useMemo, useState } from "react";
import { useKickOut } from "./PortalShell";
import { useRouter } from "next/navigation";
import { Download, Eye, KeyRound, Loader2 } from "lucide-react";
import { SHIFTS, TEAMS, classCode, describeClass, isClassCode } from "@/lib/classes";

type S = {
  id: string; student_id: string; first_name: string; last_name: string; class_section: string;
  has_pin: boolean; quiz_pts: number; quiz_max: number; submissions: number; live_pts: number;
  last_activity: string | null;
};

export function TeacherStudentsTab() {
  const onUnauthorized = useKickOut();
  const [rows, setRows] = useState<S[] | null>(null);
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    fetch("/api/teacher/students", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onUnauthorized();
      const j = await r.json();
      if (alive) setRows(j.students ?? []);
    });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

  const classes = useMemo(() => [...new Set((rows ?? []).map((r) => r.class_section))].sort(), [rows]);
  const shown = (rows ?? []).filter(
    (r) =>
      (!cls || r.class_section === cls) &&
      (!q || `${r.student_id} ${r.first_name} ${r.last_name}`.toLowerCase().includes(q.toLowerCase())),
  );

  const reset = async (s: S) => {
    if (!confirm(`Reset the PIN for ${s.first_name} ${s.last_name} (${s.student_id})?\n\nThey will re-register with the same Student ID and choose a new PIN. Their scores are kept.`)) return;
    const r = await fetch(`/api/teacher/students/${s.id}`, { method: "POST" });
    if (r.ok) {
      setRows((cur) => cur?.map((x) => (x.id === s.id ? { ...x, has_pin: false } : x)) ?? null);
      setMsg(`PIN reset for ${s.student_id}. Ask them to register again with the same ID.`);
    } else setMsg((await r.json().catch(() => ({}))).error ?? "Reset failed.");
  };

  const setClass = async (s: S, value: string) => {
    setMsg(null);
    const r = await fetch(`/api/teacher/students/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classSection: value }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) {
      setRows((cur) => cur?.map((x) => (x.id === s.id ? { ...x, class_section: j.classSection } : x)) ?? null);
      setMsg(`${s.first_name} ${s.last_name} is now in ${j.classSection}.`);
    } else setMsg(j.error ?? "Could not change the class.");
  };

  const viewAs = async (s: S) => {
    setMsg(null);
    const r = await fetch(`/api/teacher/students/${s.id}/view-as`, { method: "POST" });
    const j = await r.json().catch(() => ({}));
    if (r.ok) router.push(j.redirect ?? "/student");
    else setMsg(j.error ?? "Could not open the student view.");
  };

  if (!rows) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or ID…"
          className="min-w-[180px] flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none focus:border-violet-400/60" />
        <select value={cls} onChange={(e) => setCls(e.target.value)}
          className="rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white">
          <option value="">All classes</option>
          {classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not page navigation */}
        <a href="/api/teacher/export?type=scores"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[12px] text-neutral-200 hover:bg-white/10">
          <Download className="h-3.5 w-3.5" /> Scores CSV
        </a>
      </div>
      {msg && <p className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[12.5px] text-emerald-200">{msg}</p>}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-widest text-neutral-500">
            <tr>
              <th className="px-3 py-2.5">Student</th><th className="px-3 py-2.5">Class</th>
              <th className="px-3 py-2.5 text-right">Quiz</th><th className="px-3 py-2.5 text-right">Live</th>
              <th className="px-3 py-2.5 text-right">Subs</th><th className="px-3 py-2.5">Last active</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {shown.map((s) => (
              <tr key={s.id} className="bg-white/[0.015]">
                <td className="px-3 py-2 text-white">{s.first_name} {s.last_name}
                  <span className="ml-2 font-mono text-[11.5px] text-neutral-500">{s.student_id}</span>
                  {!s.has_pin && <span className="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10.5px] text-amber-300">PIN reset</span>}
                </td>
                <td className="px-3 py-2">
                  <select
                    value={isClassCode(s.class_section) ? s.class_section : ""}
                    onChange={(e) => setClass(s, e.target.value)}
                    title={describeClass(s.class_section) ?? "Not a team/shift class yet — pick one"}
                    aria-label={`Class for ${s.first_name} ${s.last_name}`}
                    className={`rounded-md border bg-black/40 px-2 py-1 font-mono text-[12px] outline-none focus:border-violet-400/60 ${
                      isClassCode(s.class_section) ? "border-white/10 text-neutral-200" : "border-amber-400/50 text-amber-200"
                    }`}
                  >
                    {!isClassCode(s.class_section) && (
                      <option value="" disabled>
                        {s.class_section || "—"} · set class
                      </option>
                    )}
                    {TEAMS.map((t) => (
                      <optgroup key={t} label={`Team ${t}`}>
                        {SHIFTS.map((sh) => (
                          <option key={sh.n} value={classCode(t, sh.n)}>
                            {classCode(t, sh.n)} · {sh.short} {sh.time}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right font-mono text-violet-200">{s.quiz_pts}<span className="text-neutral-500">/{s.quiz_max}</span></td>
                <td className="px-3 py-2 text-right font-mono text-amber-200">{s.live_pts}</td>
                <td className="px-3 py-2 text-right text-neutral-300">{s.submissions}</td>
                <td className="px-3 py-2 text-[12px] text-neutral-500">{s.last_activity ? new Date(s.last_activity).toLocaleDateString() : "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <button onClick={() => viewAs(s)} title="View the student portal as this student (read-only)"
                    className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-500/15 px-2.5 py-1 text-[11.5px] text-violet-100 hover:bg-violet-500/25">
                    <Eye className="h-3 w-3" /> View as
                  </button>
                  <button onClick={() => reset(s)} title="Reset PIN"
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[11.5px] text-neutral-300 hover:bg-white/10">
                    <KeyRound className="h-3 w-3" /> Reset PIN
                  </button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-500">No students match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-neutral-500">{shown.length} of {rows.length} students</p>
    </>
  );
}
