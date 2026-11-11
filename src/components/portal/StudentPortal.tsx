"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { StudentIdentityForm } from "@/components/lms/StudentIdentityForm";
import { useStudentIdentity } from "@/lib/lms-client";
import { LiveJoin, Card } from "@/components/live/StudentLive";
import { LeaderboardView } from "@/components/live/LeaderboardPage";
import { PortalShell, hashTab } from "./PortalShell";

const TABS = [
  { id: "home", label: "My results" },
  { id: "courses", label: "Courses" },
  { id: "live", label: "Join live quiz" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function StudentPortal({ initialTab = "home", initialCode }: { initialTab?: string; initialCode?: string }) {
  const router = useRouter();
  const { student, loading, viewAs, save, clear } = useStudentIdentity();
  const signOut = async () => {
    if (viewAs) {
      // Teacher looking in: leave the view, go back to the students list.
      const r = await fetch("/api/view-as/exit", { method: "POST" });
      const j = await r.json().catch(() => ({ redirect: "/" }));
      window.location.assign(j.redirect ?? "/");
      return;
    }
    await fetch("/api/auth/logout", { method: "POST" });
    clear();
    router.push("/");
    router.refresh();
  };
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const t = setTimeout(() => setTab((cur) => (initialCode ? "live" : hashTab(TABS.map((x) => x.id), cur))), 0);
    return () => clearTimeout(t);
  }, [initialCode]);

  const go = (id: string) => {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  if (loading) {
    return (
      <PortalShell kind="student">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />
      </PortalShell>
    );
  }

  if (!student) {
    return (
      <PortalShell kind="student">
        <Card>
          <h1 className="text-lg font-bold text-white">Welcome, student 👋</h1>
          <p className="mb-4 mt-1 text-[13px] text-neutral-400">
            Register once with your Student ID and a PIN, then sign in any time to see your scores
            and join live quizzes.
          </p>
          <StudentIdentityForm onSaved={save} />
        </Card>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      kind="student"
      userLabel={`${student.firstName} ${student.lastName} · ${student.classSection}`}
      tabs={TABS}
      active={tab}
      onTab={go}
      onSignOut={signOut}
      signOutLabel={viewAs ? "Exit view" : "Sign out"}
    >
      {tab === "home" && <Results name={student.firstName} />}
      {tab === "courses" && <CourseList />}
      {tab === "live" &&
        (viewAs ? (
          <Card>
            <h2 className="text-[15px] font-semibold text-white">Live quizzes</h2>
            <p className="mt-1 text-[13px] text-neutral-400">
              Joining and answering are turned off in view-only mode, so you can&rsquo;t take part in this
              student&rsquo;s name.
            </p>
          </Card>
        ) : (
          <LiveJoin initialCode={initialCode} />
        ))}
      {tab === "leaderboard" && <LeaderboardView />}
    </PortalShell>
  );
}

type Results = {
  quizzes: { chapter_key: string; title: string; num: string; course: string; best: number; max: number; attempts: number; last: string }[];
  homework: { id: string; title: string; course: string; submitted_at: string; status: string; teacher_score: number | null; teacher_notes: string | null }[];
  live: { title: string; created_at: string; score: number; rank: number; players: number }[];
};

function Results({ name }: { name: string }) {
  const [data, setData] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/student/results", { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Could not load results.");
        if (alive) setData(j);
      })
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  if (error) return <p className="text-[13px] text-rose-300">{error}</p>;
  if (!data) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;

  const pts = data.quizzes.reduce((a, q) => a + q.best, 0);
  const max = data.quizzes.reduce((a, q) => a + q.max, 0);
  const livePts = data.live.reduce((a, l) => a + l.score, 0);

  return (
    <>
      <h1 className="text-xl font-bold text-white">Hi {name}!</h1>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Quiz points" value={`${pts}`} sub={max ? `of ${max}` : "—"} />
        <Stat label="Quizzes done" value={`${data.quizzes.length}`} />
        <Stat label="Live points" value={`${livePts}`} sub={`${data.live.length} games`} />
      </div>

      <Section title="Chapter quizzes">
        {data.quizzes.map((q) => (
          <Row key={q.course + q.chapter_key} left={`${q.title}`} sub={`${q.course} · ${q.attempts} attempt${q.attempts > 1 ? "s" : ""} · ${new Date(q.last).toLocaleDateString()}`} right={`${q.best}/${q.max}`} />
        ))}
        {data.quizzes.length === 0 && <Empty>No quizzes yet. Take one at the end of any lesson.</Empty>}
      </Section>

      <Section title="Homework">
        {data.homework.map((h) => (
          <div key={h.id} className="py-2.5">
            <Row
              left={h.title}
              sub={`${h.course} · ${new Date(h.submitted_at).toLocaleDateString()}`}
              right={h.status === "released" && h.teacher_score !== null ? `${h.teacher_score}` : "Submitted"}
              dim={h.status !== "released"}
            />
            {h.teacher_notes && (
              <p className="mt-1 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[12.5px] text-neutral-300">
                Teacher: {h.teacher_notes}
              </p>
            )}
          </div>
        ))}
        {data.homework.length === 0 && <Empty>No homework submitted yet.</Empty>}
      </Section>

      <Section title="Live games">
        {data.live.map((l, i) => (
          <Row key={i} left={l.title} sub={new Date(l.created_at).toLocaleDateString()} right={`${l.score} pts · #${l.rank}/${l.players}`} />
        ))}
        {data.live.length === 0 && <Empty>You haven&rsquo;t played a live quiz yet.</Empty>}
      </Section>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-[11.5px] text-neutral-500">{sub}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="mb-1 text-[14px] font-semibold text-white">{title}</h2>
      <div className="divide-y divide-white/10">{children}</div>
    </section>
  );
}

function Row({ left, sub, right, dim }: { left: string; sub?: string; right: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
      <div className="min-w-0">
        <div className="truncate text-neutral-200">{left}</div>
        {sub && <div className="text-[11.5px] text-neutral-500">{sub}</div>}
      </div>
      <div className={`shrink-0 font-mono font-semibold ${dim ? "text-neutral-500" : "text-violet-200"}`}>{right}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-3 text-[13px] text-neutral-500">{children}</p>;
}

type CourseItem = { slug: string; title: string; subtitle: string; teacher: string; url: string };

function CourseList() {
  const [courses, setCourses] = useState<CourseItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/courses", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => alive && setCourses(j.courses ?? []))
      .catch(() => alive && setCourses([]));
    return () => {
      alive = false;
    };
  }, []);

  if (!courses) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-400" />;

  return (
    <>
      <h1 className="text-xl font-bold text-white">Courses</h1>
      <div className="grid gap-3">
        {courses.map((c) => (
          <Link
            key={c.slug}
            href={c.url}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-violet-400/40 hover:bg-white/[0.05]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-white">
                <BookOpen className="h-4 w-4 text-violet-300" />
                {c.title}
              </div>
              <div className="mt-0.5 text-[12.5px] text-neutral-400">{c.subtitle}</div>
              <div className="mt-1 text-[11.5px] text-neutral-500">Teacher: {c.teacher}</div>
            </div>
            <span className="shrink-0 text-[12px] text-violet-300 group-hover:text-violet-200">Open →</span>
          </Link>
        ))}
        {courses.length === 0 && <p className="text-[13px] text-neutral-500">Your teacher hasn&rsquo;t shared any courses yet. Check back soon.</p>}
      </div>
    </>
  );
}
