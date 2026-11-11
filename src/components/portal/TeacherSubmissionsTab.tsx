"use client";

import { useCallback, useEffect, useState } from "react";
import { useKickOut } from "./PortalShell";
import { Download, Loader2, X } from "lucide-react";

type Row = {
  id: string; kind: "quiz" | "homework"; status: string; chapter_title: string; course: string;
  submitted_at: string; score: number | null; max_score: number | null; teacher_score: number | null;
  student_number: string; first_name: string; last_name: string; class_section: string;
};
type Detail = Row & { code_content: string | null; code_language: string | null; notes: string | null; teacher_notes: string | null; time_spent_seconds: number | null };

export function TeacherSubmissionsTab() {
  const onUnauthorized = useKickOut();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [cls, setCls] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (kind) p.set("kind", kind);
    if (status) p.set("status", status);
    if (cls) p.set("class", cls);
    if (q.trim()) p.set("q", q.trim());
    const r = await fetch(`/api/teacher/submissions?${p}`, { cache: "no-store" });
    if (r.status === 401) return onUnauthorized();
    const j = await r.json();
    setRows(j.submissions ?? []);
    setClasses(j.classes ?? []);
  }, [kind, status, cls, q, onUnauthorized]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  const sel = "rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white";
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student or chapter…"
          className="min-w-[180px] flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none focus:border-violet-400/60" />
        <select className={sel} value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">Quiz + homework</option><option value="quiz">Quizzes</option><option value="homework">Homework</option>
        </select>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option><option value="submitted">Needs grading</option><option value="released">Graded</option>
        </select>
        <select className={sel} value={cls} onChange={(e) => setCls(e.target.value)}>
          <option value="">All classes</option>{classes.map((c) => <option key={c}>{c}</option>)}
        </select>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not page navigation */}
        <a href="/api/teacher/export?type=submissions"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[12px] text-neutral-200 hover:bg-white/10">
          <Download className="h-3.5 w-3.5" /> CSV
        </a>
      </div>

      {!rows ? (
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-widest text-neutral-500">
              <tr><th className="px-3 py-2.5">Student</th><th className="px-3 py-2.5">Chapter</th><th className="px-3 py-2.5">Type</th>
                <th className="px-3 py-2.5 text-right">Score</th><th className="px-3 py-2.5">When</th></tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => (
                <tr key={r.id} onClick={() => r.kind === "homework" && setOpen(r.id)}
                  className={`bg-white/[0.015] ${r.kind === "homework" ? "cursor-pointer hover:bg-white/[0.05]" : ""}`}>
                  <td className="px-3 py-2 text-white">{r.first_name} {r.last_name}
                    <span className="ml-2 text-[11.5px] text-neutral-500">{r.class_section}</span></td>
                  <td className="px-3 py-2 text-neutral-300">{r.chapter_title}<span className="ml-2 text-[11px] text-neutral-500">{r.course}</span></td>
                  <td className="px-3 py-2 text-neutral-400">{r.kind}</td>
                  <td className="px-3 py-2 text-right font-mono">
                    {r.kind === "quiz" ? <span className="text-violet-200">{r.score}/{r.max_score}</span>
                      : r.status === "released" ? <span className="text-emerald-300">{r.teacher_score}</span>
                      : <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[11px] text-amber-300">Grade</span>}
                  </td>
                  <td className="px-3 py-2 text-[12px] text-neutral-500">{new Date(r.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-neutral-500">No submissions match.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {open && <GradeDialog id={open} onClose={() => setOpen(null)} onSaved={() => { setOpen(null); void load(); }} />}
    </>
  );
}

function GradeDialog({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<Detail | null>(null);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/teacher/submissions/${id}`).then((r) => r.json()).then((j: Detail) => {
      if (!alive) return;
      setD(j);
      setScore(j.teacher_score?.toString() ?? "");
      setNotes(j.teacher_notes ?? "");
    });
    return () => { alive = false; };
  }, [id]);

  const save = async () => {
    setBusy(true); setErr(null);
    const r = await fetch(`/api/teacher/submissions/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: Number(score), notes }),
    });
    setBusy(false);
    if (r.ok) onSaved(); else setErr((await r.json().catch(() => ({}))).error ?? "Could not save.");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d111a] p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-white">{d ? `${d.first_name} ${d.last_name}` : "Loading…"}</h3>
            {d && <p className="text-[12px] text-neutral-500">{d.chapter_title} · {d.student_number} · {new Date(d.submitted_at).toLocaleString()}</p>}
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        {!d ? <Loader2 className="h-5 w-5 animate-spin text-neutral-400" /> : (
          <div className="space-y-3">
            {d.notes && <p className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[12.5px] text-neutral-300">Student note: {d.notes}</p>}
            <pre className="max-h-72 overflow-auto rounded-md border border-white/10 bg-black/40 p-3 text-[12px] leading-relaxed text-neutral-200">{d.code_content}</pre>
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <label className="text-[12px] text-neutral-300">Score
                <input type="number" min={0} max={1000} value={score} onChange={(e) => setScore(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white" /></label>
              <label className="text-[12px] text-neutral-300">Feedback (student will see this)
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-[13px] text-white" /></label>
            </div>
            {err && <p className="text-[13px] text-rose-300">{err}</p>}
            <button onClick={save} disabled={busy || score === ""}
              className="rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[13px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-50">
              {busy ? "Saving…" : "Save & release to student"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
