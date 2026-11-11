"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKickOut } from "./PortalShell";
import { courseUrl } from "@/lib/courses";
import { BookOpen, Check, ClipboardCheck, ExternalLink, Link2, Loader2, Share2, Users } from "lucide-react";

type Course = {
  slug: string; title: string; subtitle: string; href: string;
  chapters: number; questions: number; activeStudents: number;
  quizSubmissions: number; homework: number; toGrade: number; shared: boolean;
};

export function TeacherCoursesTab() {
  const router = useRouter();
  const onUnauthorized = useKickOut();
  const [data, setData] = useState<{ teacher: { username: string; displayName: string }; totalStudents: number; courses: Course[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/teacher/courses", { cache: "no-store" }).then(async (r) => {
      if (r.status === 401) return onUnauthorized();
      const j = await r.json();
      if (!alive) return;
      if (!r.ok) return setError(j.error ?? "Could not load courses.");
      setData(j);
    });
    return () => {
      alive = false;
    };
  }, [onUnauthorized]);

  if (error) return <p className="text-[13px] text-rose-300">{error}</p>;
  if (!data) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;

  const toggleShare = async (c: Course) => {
    setBusy(c.slug);
    setError(null);
    const r = await fetch(`/api/teacher/courses/${c.slug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shared: !c.shared }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(null);
    if (!r.ok) return setError(j.error ?? "Could not update sharing.");
    setData((d) => d && { ...d, courses: d.courses.map((x) => (x.slug === c.slug ? { ...x, shared: j.shared } : x)) });
  };

  const copyLink = async (c: Course) => {
    await navigator.clipboard.writeText(`${window.location.origin}${courseUrl(data.teacher.username, c.slug)}`).catch(() => {});
    setCopied(c.slug);
    setTimeout(() => setCopied((cur) => (cur === c.slug ? null : cur)), 1500);
  };

  const sharedCount = data.courses.filter((c) => c.shared).length;
  const toGrade = data.courses.reduce((a, c) => a + c.toGrade, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">My courses</h1>
          <p className="text-[13px] text-neutral-400">
            {data.courses.length} courses · {sharedCount} shared with students · {data.totalStudents} registered students
          </p>
        </div>
        {toGrade > 0 && (
          <button
            onClick={() => router.push(`/${data.teacher.username}/submissions`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-[12.5px] font-medium text-amber-200 hover:bg-amber-400/20"
          >
            <ClipboardCheck className="h-4 w-4" /> {toGrade} homework to grade
          </button>
        )}
      </div>

      {error && <p className="text-[13px] text-rose-300">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {data.courses.map((c) => (
          <div key={c.slug} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[16px] font-semibold text-white">{c.title}</h2>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider ${
                  c.shared
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/15 bg-white/[0.04] text-neutral-400"
                }`}
              >
                {c.shared ? "Shared" : "Private"}
              </span>
            </div>
            <p className="text-[12.5px] text-neutral-400">{c.subtitle}</p>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat icon={<BookOpen className="h-3.5 w-3.5" />} label="Chapters" value={c.chapters} />
              <Stat icon={<Users className="h-3.5 w-3.5" />} label="Active students" value={c.activeStudents} />
              <Stat icon={<ClipboardCheck className="h-3.5 w-3.5" />} label="To grade" value={c.toGrade} hot={c.toGrade > 0} />
            </dl>
            <p className="mt-3 text-[11.5px] text-neutral-500">
              {c.questions} quiz questions · {c.quizSubmissions} quiz submissions · {c.homework} homework
            </p>

            <Link
              href={courseUrl(data.teacher.username, c.slug)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-500/20 px-4 py-2 text-[13px] font-semibold text-violet-100 hover:bg-violet-500/30"
            >
              Open course <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => toggleShare(c)}
                disabled={busy === c.slug}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-60 ${
                  c.shared
                    ? "border-white/15 text-neutral-300 hover:bg-white/10"
                    : "border-emerald-400/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
                }`}
              >
                {busy === c.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
                {c.shared ? "Stop sharing" : "Share course"}
              </button>
              {c.shared && (
                <button
                  onClick={() => copyLink(c)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[12.5px] text-neutral-200 hover:bg-white/10"
                >
                  {copied === c.slug ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Link2 className="h-3.5 w-3.5" />}
                  {copied === c.slug ? "Copied" : "Copy link"}
                </button>
              )}
            </div>
            {!c.shared && (
              <p className="mt-2 text-[11.5px] text-neutral-500">Only you can see this course until you share it.</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Stat({ icon, label, value, hot }: { icon: React.ReactNode; label: string; value: number; hot?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-2.5">
      <div className="flex items-center justify-center gap-1 text-[10.5px] uppercase tracking-wider text-neutral-500">
        {icon}
        {label}
      </div>
      <div className={`mt-0.5 text-xl font-bold ${hot ? "text-amber-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
