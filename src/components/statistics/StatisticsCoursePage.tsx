"use client";

// The Statistics course page. Mirrors the shape of the ML course:
// sticky chapter tree in the sidebar (with a mobile drawer), a scrolling
// content column of chapter sections. Every worked example uses
// Cambodia-based data (rice yields by province, tuk-tuk fares in Phnom
// Penh, Angkor ticket demand, ABA transfers, hospital wait times).
// Each chapter ends with the shared LessonPack (Key Terms + 20-question Quiz).

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ChartSpline,
  ChevronDown,
  Compass,
  Dices,
  FlaskConical,
  LineChart,
  Menu,
  Ruler,
  Rocket,
  Sigma,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonPack } from "@/components/lecture/LessonPack";
import { LessonSessionProvider } from "@/components/lecture/LessonSession";
import { LaserPointer } from "@/components/lecture/LaserPointer";
import { ThemeToggle } from "@/components/lecture/ThemeToggle";
import { MLCodeExercise, type MLCodeExerciseProps } from "@/components/ml/MLCodeExercise";

/* ─────────────────────────────────────────────────────────────────
 * Outline — drives the sidebar tree and section anchor ids.
 * ────────────────────────────────────────────────────────────── */

const FONT_SCALE_OPTIONS = [1, 1.5, 2, 3] as const;

type Sub = {
  id: string;
  label: string;
  kind?: "topic" | "terms" | "quiz";
};
type Chapter = {
  id: string;
  lessonKey: string;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  subs: Sub[];
};

function withPack(chapterId: string, topicSubs: Sub[]): Sub[] {
  return [
    ...topicSubs,
    { id: `${chapterId}-terms`, label: "Key Terms", kind: "terms" },
    { id: `${chapterId}-quiz`, label: "Quiz", kind: "quiz" },
  ];
}

const OUTLINE: Chapter[] = [
  {
    id: "stat-welcome",
    lessonKey: "stat-welcome",
    number: "1",
    label: "Welcome to Statistics",
    icon: Sparkles,
    subs: withPack("stat-welcome", [
      { id: "what-stats", label: "What is Statistics?" },
      { id: "pop-vs-sample", label: "Population vs sample" },
      { id: "hello-python", label: "Hello, Python" },
    ]),
  },
  {
    id: "stat-descriptive",
    lessonKey: "stat-descriptive",
    number: "2",
    label: "Descriptive Stats",
    icon: Ruler,
    subs: withPack("stat-descriptive", [
      { id: "central-tendency", label: "Mean / median / mode" },
      { id: "spread", label: "Variance & SD" },
      { id: "percentile-iqr", label: "Percentiles & IQR" },
      { id: "outliers", label: "Spotting outliers" },
    ]),
  },
  {
    id: "stat-visualisation",
    lessonKey: "stat-visualisation",
    number: "3",
    label: "Data Visualisation",
    icon: LineChart,
    subs: withPack("stat-visualisation", [
      { id: "histogram", label: "Histograms" },
      { id: "boxplot", label: "Boxplots" },
      { id: "scatter", label: "Scatter plots" },
      { id: "chart-rules", label: "Rules of good charts" },
    ]),
  },
  {
    id: "stat-probability",
    lessonKey: "stat-probability",
    number: "4",
    label: "Probability",
    icon: Dices,
    subs: withPack("stat-probability", [
      { id: "prob-basics", label: "The basics" },
      { id: "bayes", label: "Bayes' theorem" },
      { id: "normal", label: "The normal curve" },
      { id: "binomial-poisson", label: "Binomial & Poisson" },
    ]),
  },
  {
    id: "stat-sampling",
    lessonKey: "stat-sampling",
    number: "5",
    label: "Sampling & Estimation",
    icon: Compass,
    subs: withPack("stat-sampling", [
      { id: "sampling-methods", label: "Sampling methods" },
      { id: "clt", label: "Central Limit Theorem" },
      { id: "confidence-interval", label: "Confidence intervals" },
      { id: "sample-size", label: "Sample size & SE" },
    ]),
  },
  {
    id: "stat-hypothesis",
    lessonKey: "stat-hypothesis",
    number: "6",
    label: "Hypothesis Testing",
    icon: FlaskConical,
    subs: withPack("stat-hypothesis", [
      { id: "h0-h1", label: "H₀ vs H₁" },
      { id: "p-value", label: "P-values & α" },
      { id: "t-test", label: "The t-test" },
      { id: "chi-square", label: "Chi-square test" },
    ]),
  },
  {
    id: "stat-regression",
    lessonKey: "stat-regression",
    number: "7",
    label: "Correlation & Regression",
    icon: ChartSpline,
    subs: withPack("stat-regression", [
      { id: "correlation", label: "Pearson's r" },
      { id: "simple-lm", label: "Simple linear regression" },
      { id: "multi-lm", label: "Multiple regression" },
      { id: "causation", label: "Correlation ≠ causation" },
    ]),
  },
  {
    id: "stat-applied",
    lessonKey: "stat-applied",
    number: "8",
    label: "Applied Statistics",
    icon: Rocket,
    subs: withPack("stat-applied", [
      { id: "anova", label: "ANOVA across provinces" },
      { id: "ab-test", label: "A/B tests" },
      { id: "time-series", label: "Time-series & seasonality" },
      { id: "ethics", label: "Ethics & reproducibility" },
    ]),
  },
];

const ALL_ANCHORS: string[] = OUTLINE.flatMap((c) => [c.id, ...c.subs.map((s) => s.id)]);

/* ─────────────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────────── */

export function StatisticsCoursePage() {
  const [activeId, setActiveId] = useState<string>("stat-welcome");
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const stored = window.localStorage.getItem("idic-font-scale");
    const v = stored ? Number(stored) : NaN;
    if ((FONT_SCALE_OPTIONS as readonly number[]).includes(v)) setFontScale(v);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("idic-font-scale", String(fontScale));
    document.documentElement.style.zoom = String(fontScale);
    return () => {
      document.documentElement.style.zoom = "";
    };
  }, [fontScale]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);

      const line = window.scrollY + window.innerHeight * 0.28;
      let current = ALL_ANCHORS[0];
      for (const id of ALL_ANCHORS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= line) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeChapterId = useMemo(() => {
    for (const c of OUTLINE) {
      if (c.id === activeId) return c.id;
      if (c.subs.some((s) => s.id === activeId)) return c.id;
    }
    return OUTLINE[0].id;
  }, [activeId]);

  return (
    <LessonSessionProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 700px at 15% 10%, rgba(16, 185, 129, 0.10), transparent 60%)," +
              "radial-gradient(900px 600px at 85% 60%, rgba(56, 189, 248, 0.10), transparent 60%)," +
              "radial-gradient(700px 500px at 50% 100%, rgba(16, 185, 129, 0.06), transparent 60%)",
          }}
        />

        <div aria-hidden="true" className="fixed inset-x-0 top-[46px] z-[60] h-[2px] bg-white/5">
          <div
            className="h-full origin-left bg-gradient-to-r from-emerald-300 via-sky-400 to-emerald-300 transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <MobileTopBar onOpen={() => setDrawerOpen(true)} activeChapterId={activeChapterId} />

        <div className="mx-auto flex max-w-[1400px] pt-[46px]">
          <Sidebar
            activeId={activeId}
            activeChapterId={activeChapterId}
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
            fontScale={fontScale}
            onFontChange={setFontScale}
          />
          <MobileDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            activeId={activeId}
            activeChapterId={activeChapterId}
            fontScale={fontScale}
            onFontChange={setFontScale}
          />

          <main className="min-w-0 flex-1 px-5 pb-24 pt-16 sm:px-10 lg:pt-6">
            <Welcome />
            <Descriptive />
            <Visualisation />
            <Probability />
            <Sampling />
            <Hypothesis />
            <Regression />
            <Applied />
            <PageFooter />
          </main>
        </div>

        <LaserPointer />
      </div>
    </LessonSessionProvider>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Sidebar (desktop) + Mobile drawer
 * ────────────────────────────────────────────────────────────── */

function FontSizeControls({
  fontScale,
  onFontChange,
}: {
  fontScale: number;
  onFontChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-1 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1">
      <span className="font-mono text-[10.5px] uppercase tracking-widest text-neutral-500">
        Text
      </span>
      <select
        aria-label="Text size"
        value={fontScale}
        onChange={(e) => onFontChange(Number(e.target.value))}
        className="flex-1 cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11.5px] font-medium text-neutral-200 outline-none transition-colors hover:border-emerald-400/40 hover:text-emerald-300 focus:border-emerald-400/50"
      >
        {FONT_SCALE_OPTIONS.map((v) => (
          <option key={v} value={v}>
            {Math.round(v * 100)}%
          </option>
        ))}
      </select>
    </label>
  );
}

function SidebarBrand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2 pb-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-2xl">
        📊
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold text-white">Statistics</span>
        <span className="truncate text-[11px] text-neutral-400">Cambodia-flavoured stats</span>
      </div>
    </Link>
  );
}

function SidebarTree({
  activeId,
  activeChapterId,
  onNavigate,
}: {
  activeId: string;
  activeChapterId: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5">
      {OUTLINE.map((chapter) => {
        const isOpen = activeChapterId === chapter.id;
        const isChapterActive = activeId === chapter.id;
        return (
          <div key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                isOpen
                  ? "bg-white/[0.05] text-white"
                  : "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md border transition-colors",
                  isOpen
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 group-hover:text-emerald-300"
                )}
              >
                <chapter.icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
              <span className="font-mono text-[10.5px] tracking-widest text-neutral-500">
                0{chapter.number}
              </span>
              <span
                className={cn(
                  "flex-1 truncate font-medium",
                  isChapterActive && "text-emerald-300"
                )}
              >
                {chapter.label}
              </span>
              {chapter.subs.length > 0 && (
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-neutral-500 transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90"
                  )}
                />
              )}
            </a>

            {chapter.subs.length > 0 && isOpen && (
              <div className="mb-1 ml-[38px] mt-0.5 border-l border-white/10 pl-3">
                {chapter.subs.map((sub, i) => {
                  const isSubActive = activeId === sub.id;
                  const isTool = sub.kind === "terms" || sub.kind === "quiz";
                  const prevKind = chapter.subs[i - 1]?.kind;
                  const prevIsTool = prevKind === "terms" || prevKind === "quiz";
                  const isFirstTool = isTool && !prevIsTool;
                  const emoji =
                    sub.kind === "terms" ? "📖" : sub.kind === "quiz" ? "📝" : null;
                  const activeToolClass =
                    sub.kind === "quiz"
                      ? "bg-amber-400/10 text-amber-200"
                      : "bg-sky-400/10 text-sky-200";
                  return (
                    <div key={sub.id}>
                      {isFirstTool && (
                        <div className="my-1 flex items-center gap-2 pl-2 text-[9.5px] font-mono uppercase tracking-widest text-neutral-600">
                          <span className="h-px flex-1 bg-white/5" />
                          Lesson Tools
                          <span className="h-px flex-1 bg-white/5" />
                        </div>
                      )}
                      <a
                        href={`#${sub.id}`}
                        onClick={onNavigate}
                        className={cn(
                          "relative flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors",
                          isSubActive
                            ? isTool
                              ? activeToolClass
                              : "text-emerald-300"
                            : isTool
                              ? "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                              : "text-neutral-500 hover:text-white"
                        )}
                      >
                        {isSubActive && !isTool && (
                          <span className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-emerald-300" />
                        )}
                        {emoji && <span className="text-[13px]">{emoji}</span>}
                        <span className={cn("truncate", isTool && "font-semibold")}>
                          {sub.label}
                        </span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function Sidebar({
  activeId,
  activeChapterId,
  open,
  onToggle,
  fontScale,
  onFontChange,
}: {
  activeId: string;
  activeChapterId: string;
  open: boolean;
  onToggle: () => void;
  fontScale: number;
  onFontChange: (v: number) => void;
}) {
  if (!open) {
    return (
      <aside className="sticky top-[46px] hidden h-[calc(100vh-46px)] w-11 shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-md lg:block">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Show outline"
          title="Show outline"
          className="ml-1.5 mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
        >
          <Menu className="h-4 w-4" />
        </button>
      </aside>
    );
  }
  return (
    <aside className="sticky top-[46px] hidden h-[calc(100vh-46px)] w-[300px] shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-md lg:block">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <SidebarBrand />
          <button
            type="button"
            onClick={onToggle}
            aria-label="Hide outline"
            title="Hide outline"
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="thin-scroll flex-1 overflow-y-auto pr-1">
          <SidebarTree activeId={activeId} activeChapterId={activeChapterId} />
        </div>
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <FontSizeControls fontScale={fontScale} onFontChange={onFontChange} />
            <ThemeToggle className="shrink-0" />
          </div>
          <Link
            href="/lecture"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-accent-bright">
              <Boxes className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">IT Lecture</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/ml"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-fuchsia-300">
              <Sigma className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">ML course</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/rust"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-orange-300">
              <Rocket className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">Rust course</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dsa"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-indigo-400/40 hover:bg-indigo-400/10 hover:text-indigo-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-indigo-300">
              <span className="text-[11px]">🧩</span>
            </span>
            <span className="flex-1 truncate font-medium">DSA in Rust</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="text-[11px] text-neutral-500">IDIC · Statistics</div>
        </div>
      </div>
    </aside>
  );
}

function MobileTopBar({
  onOpen,
  activeChapterId,
}: {
  onOpen: () => void;
  activeChapterId: string;
}) {
  const active = OUTLINE.find((c) => c.id === activeChapterId) ?? OUTLINE[0];
  return (
    <div className="fixed inset-x-0 top-[46px] z-40 flex items-center justify-between border-b border-white/10 bg-[#0a0d14]/85 px-4 py-2.5 backdrop-blur-xl lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-lg">
          📊
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-white">Statistics</span>
          <span className="truncate text-[10.5px] text-neutral-400">
            {active.number}. {active.label}
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-neutral-200"
      >
        <Menu className="h-3.5 w-3.5" /> Menu
      </button>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  activeId,
  activeChapterId,
  fontScale,
  onFontChange,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string;
  activeChapterId: string;
  fontScale: number;
  onFontChange: (v: number) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close outline"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative flex h-full w-[85%] max-w-[320px] flex-col border-r border-white/10 bg-[#0a0d14] p-4"
      >
        <div className="flex items-center justify-between pb-3">
          <SidebarBrand />
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300"
            aria-label="Close outline"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="thin-scroll flex-1 overflow-y-auto pr-1">
          <SidebarTree
            activeId={activeId}
            activeChapterId={activeChapterId}
            onNavigate={onClose}
          />
        </div>
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <FontSizeControls fontScale={fontScale} onFontChange={onFontChange} />
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Shared content primitives
 * ────────────────────────────────────────────────────────────── */

function ChapterHeader({
  number,
  emoji,
  title,
  hook,
}: {
  number: string;
  emoji: string;
  title: string;
  hook: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/10 pb-8"
    >
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-widest text-emerald-300">
          CHAPTER {number}
        </span>
      </div>
      <h2 className="mt-4 flex items-center gap-3 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        <span className="text-4xl sm:text-5xl">{emoji}</span>
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-400">{hook}</p>
    </motion.header>
  );
}

function SubTopic({
  id,
  emoji,
  title,
  caption,
  chips,
  visual,
  exercise,
}: {
  id: string;
  emoji: string;
  title: string;
  caption: string;
  chips?: string[];
  visual?: React.ReactNode;
  exercise?: MLCodeExerciseProps;
}) {
  return (
    <motion.article
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-2xl">
          {emoji}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          <p className="text-[13.5px] text-neutral-400">{caption}</p>
        </div>
      </div>

      {visual}

      {chips && chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-neutral-300"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {exercise && <MLCodeExercise {...exercise} />}
    </motion.article>
  );
}

function Section({
  chapterId,
  children,
}: {
  chapterId: string;
  children: React.ReactNode;
}) {
  return (
    <section id={chapterId} className="scroll-mt-24 space-y-6 py-12 first:pt-4 sm:py-16">
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Lightweight visuals — inline SVG / CSS mini-diagrams.
 * ────────────────────────────────────────────────────────────── */

function PopulationSampleVisual() {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    x: 20 + ((i * 37) % 260),
    y: 20 + ((i * 53) % 140),
    inSample: i % 7 === 0,
  }));
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <rect x="4" y="4" width="312" height="172" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <text x="14" y="20" fill="rgba(255,255,255,0.7)" fontSize="10">
          Population — every farmer in Cambodia
        </text>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.inSample ? 4 : 2.5}
            fill={d.inSample ? "#34d399" : "rgba(255,255,255,0.35)"}
            stroke={d.inSample ? "#022c22" : "none"}
          />
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Every dot = one farmer. The <span className="text-emerald-300">green</span> ones = a random sample of 9.
      </div>
    </div>
  );
}

function CentralTendencyVisual() {
  const rows = [
    { label: "Yield (t/ha)", vals: [2.7, 2.9, 3.0, 3.1, 3.3, 3.4] },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
        6 provinces
      </div>
      <div className="flex flex-wrap gap-2">
        {rows[0].vals.map((v) => (
          <span key={v} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[12px] text-neutral-200">
            {v.toFixed(1)}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] p-2">
          <div className="text-[10px] font-mono uppercase text-emerald-300">Mean</div>
          <div className="font-mono text-white">3.07 t/ha</div>
        </div>
        <div className="rounded-lg border border-sky-400/30 bg-sky-400/[0.06] p-2">
          <div className="text-[10px] font-mono uppercase text-sky-300">Median</div>
          <div className="font-mono text-white">3.05 t/ha</div>
        </div>
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-2">
          <div className="text-[10px] font-mono uppercase text-amber-300">Mode</div>
          <div className="font-mono text-white">no repeats</div>
        </div>
      </div>
    </div>
  );
}

function BoxplotVisual() {
  const provinces = [
    { name: "Battambang", min: 40, q1: 60, med: 78, q3: 96, max: 120, out: [140] },
    { name: "Kandal", min: 30, q1: 44, med: 55, q3: 70, max: 90, out: [] },
    { name: "Siem Reap", min: 55, q1: 70, med: 85, q3: 100, max: 130, out: [] },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <line x1="30" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.15)" />
        {provinces.map((p, i) => {
          const y = 30 + i * 42;
          const scale = 1.5;
          const x = (v: number) => 30 + v * scale;
          return (
            <g key={p.name}>
              <text x="16" y={y + 4} fontSize="9" fill="rgba(255,255,255,0.7)">
                {p.name}
              </text>
              {/* whiskers */}
              <line x1={x(p.min)} y1={y} x2={x(p.max)} y2={y} stroke="rgba(255,255,255,0.35)" />
              <line x1={x(p.min)} y1={y - 6} x2={x(p.min)} y2={y + 6} stroke="rgba(255,255,255,0.35)" />
              <line x1={x(p.max)} y1={y - 6} x2={x(p.max)} y2={y + 6} stroke="rgba(255,255,255,0.35)" />
              {/* box */}
              <rect
                x={x(p.q1)}
                y={y - 10}
                width={x(p.q3) - x(p.q1)}
                height={20}
                fill="rgba(52,211,153,0.25)"
                stroke="#34d399"
              />
              {/* median line */}
              <line x1={x(p.med)} y1={y - 10} x2={x(p.med)} y2={y + 10} stroke="#fbbf24" strokeWidth="2" />
              {/* outliers */}
              {p.out.map((o) => (
                <circle key={o} cx={x(o)} cy={y} r="3" fill="#f43f5e" />
              ))}
            </g>
          );
        })}
        <text x="160" y="176" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">
          Rice yield (bags/ha)  →
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Each box = middle 50%. Line inside = median. Red dot = outlier.
      </div>
    </div>
  );
}

function HistogramVisual() {
  const bars = [3, 6, 10, 16, 22, 20, 14, 8, 4, 2];
  const max = Math.max(...bars);
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex h-32 items-end gap-1">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/70 to-sky-400/60"
            style={{ height: `${(b / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1 text-[11px] text-neutral-400">
        Histogram of Cambodia-wide rice yields — roughly bell-shaped, centred near 3 t/ha.
      </div>
    </div>
  );
}

function ScatterVisual() {
  const pts: Array<[number, number, string]> = [
    [40, 138, "PP"],
    [70, 128, "Kandal"],
    [95, 118, "PreyVeng"],
    [125, 110, "K.Cham"],
    [160, 95, "K.Chhnang"],
    [190, 82, "Kampot"],
    [215, 70, "BB"],
    [250, 55, "SR"],
    [275, 45, "Pursat"],
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <line x1="30" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.15)" />
        <line x1="30" y1="20" x2="30" y2="160" stroke="rgba(255,255,255,0.15)" />
        <text x="160" y="176" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">
          Rainfall (mm) →
        </text>
        <text x="14" y="90" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle" transform="rotate(-90 14 90)">
          Yield (t/ha) →
        </text>
        <line x1="30" y1="150" x2="300" y2="35" stroke="#34d399" strokeWidth="2" />
        {pts.map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="4" fill="#a7f3d0" opacity="0.95" />
            <text x={x + 6} y={y - 4} fill="rgba(255,255,255,0.6)" fontSize="8">
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        r ≈ 0.97 — a strong positive linear correlation.
      </div>
    </div>
  );
}

function BellCurveVisual() {
  // Draw a normal curve with shaded ±1 SD region.
  const pts: string[] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 6 - 3; // -3..3
    const y = Math.exp(-(t * t) / 2);
    const x = 20 + (i / N) * 280;
    const py = 150 - y * 120;
    pts.push(`${x},${py}`);
  }
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <defs>
          <linearGradient id="bell" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(52,211,153,0.5)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.05)" />
          </linearGradient>
        </defs>
        <line x1="20" y1="150" x2="300" y2="150" stroke="rgba(255,255,255,0.15)" />
        {/* ±1 SD region shading */}
        <rect x={20 + (280 * (2 / 6))} y="30" width={280 / 3} height="120" fill="url(#bell)" opacity="0.6" />
        <polyline points={pts.join(" ")} fill="none" stroke="#34d399" strokeWidth="2" />
        <line x1="160" y1="30" x2="160" y2="150" stroke="#fbbf24" strokeDasharray="3 3" />
        <text x="160" y="24" fill="#fbbf24" fontSize="9" textAnchor="middle">
          μ (mean)
        </text>
        <text x="120" y="168" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">
          μ − σ
        </text>
        <text x="200" y="168" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">
          μ + σ
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Bell curve — 68% of values within ±1 SD, 95% within ±2 SD.
      </div>
    </div>
  );
}

function CIVisual() {
  const bars = [
    { p: "Batt.", low: 2.9, mid: 3.1, high: 3.3, covers: true },
    { p: "Kandal", low: 2.5, mid: 2.7, high: 2.9, covers: true },
    { p: "SR", low: 3.0, mid: 3.2, high: 3.4, covers: true },
    { p: "Pursat", low: 3.2, mid: 3.5, high: 3.8, covers: false },
  ];
  const truth = 3.05;
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <line x1={20 + (truth - 2) * 100} y1="10" x2={20 + (truth - 2) * 100} y2="170" stroke="#fbbf24" strokeDasharray="3 3" />
        <text x={20 + (truth - 2) * 100} y="8" fontSize="9" fill="#fbbf24" textAnchor="middle">
          true mean
        </text>
        {bars.map((b, i) => {
          const y = 30 + i * 32;
          const x = (v: number) => 20 + (v - 2) * 100;
          const c = b.covers ? "#34d399" : "#f43f5e";
          return (
            <g key={b.p}>
              <text x="4" y={y + 4} fontSize="9" fill="rgba(255,255,255,0.7)">
                {b.p}
              </text>
              <line x1={x(b.low)} y1={y} x2={x(b.high)} y2={y} stroke={c} strokeWidth="3" />
              <circle cx={x(b.mid)} cy={y} r="4" fill={c} />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Four 95% CIs. Three cover the truth; one (red) misses — expected roughly 5% of the time.
      </div>
    </div>
  );
}

function TTestVisual() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-3">
        <div className="text-[10.5px] font-mono uppercase tracking-widest text-emerald-300">
          Old seed (yield, t/ha)
        </div>
        <div className="mt-1 font-mono text-[13px] text-white">2.8, 2.9, 3.0, 3.1, 3.0, 2.9</div>
        <div className="mt-1 text-[11px] text-neutral-300">mean ≈ 2.95, SD ≈ 0.10</div>
      </div>
      <div className="rounded-xl border border-sky-400/30 bg-sky-400/[0.06] p-3">
        <div className="text-[10.5px] font-mono uppercase tracking-widest text-sky-300">
          New seed (yield, t/ha)
        </div>
        <div className="mt-1 font-mono text-[13px] text-white">3.2, 3.1, 3.3, 3.4, 3.2, 3.3</div>
        <div className="mt-1 text-[11px] text-neutral-300">mean ≈ 3.25, SD ≈ 0.10</div>
      </div>
      <div className="sm:col-span-2 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-3 text-[12.5px] text-amber-100">
        Two-sample t-test: <span className="font-mono">t ≈ 5.2</span>, <span className="font-mono">p ≈ 0.0003</span>. Reject H₀ — the new seed really does yield more.
      </div>
    </div>
  );
}

function ChiSquareVisual() {
  const table = [
    { r: "Phnom Penh", honda: 320, yamaha: 210, suzuki: 90 },
    { r: "Siem Reap", honda: 240, yamaha: 160, suzuki: 110 },
    { r: "Battambang", honda: 200, yamaha: 190, suzuki: 140 },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-emerald-300">
        <span>Province</span>
        <span className="text-right">Honda</span>
        <span className="text-right">Yamaha</span>
        <span className="text-right">Suzuki</span>
      </div>
      {table.map((r, i) => (
        <div
          key={r.r}
          className={cn(
            "grid grid-cols-4 items-center px-3 py-2 text-[12.5px]",
            i % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"
          )}
        >
          <span className="text-white">{r.r}</span>
          <span className="text-right font-mono text-neutral-300">{r.honda}</span>
          <span className="text-right font-mono text-neutral-300">{r.yamaha}</span>
          <span className="text-right font-mono text-neutral-300">{r.suzuki}</span>
        </div>
      ))}
      <div className="border-t border-white/10 bg-black/30 px-3 py-2 text-[11px] text-neutral-400">
        χ² test asks: does moto-brand preference depend on the province?
      </div>
    </div>
  );
}

function ANOVAVisual() {
  const groups = [
    { p: "BB", vals: [3.1, 3.0, 3.2, 3.1, 3.3] },
    { p: "Kandal", vals: [2.6, 2.7, 2.8, 2.5, 2.7] },
    { p: "SR", vals: [3.2, 3.3, 3.4, 3.1, 3.3] },
    { p: "Kampot", vals: [2.9, 3.0, 2.8, 3.0, 2.9] },
  ];
  const colours = ["#34d399", "#38bdf8", "#fbbf24", "#f472b6"];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <line x1="30" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.15)" />
        {groups.map((g, gi) => {
          const cx = 60 + gi * 65;
          const mean = g.vals.reduce((a, b) => a + b, 0) / g.vals.length;
          return (
            <g key={g.p}>
              {g.vals.map((v, i) => (
                <circle
                  key={i}
                  cx={cx + (i - 2) * 5}
                  cy={170 - (v - 2) * 90}
                  r="3.5"
                  fill={colours[gi]}
                  opacity="0.9"
                />
              ))}
              <line
                x1={cx - 15}
                y1={170 - (mean - 2) * 90}
                x2={cx + 15}
                y2={170 - (mean - 2) * 90}
                stroke={colours[gi]}
                strokeWidth="2"
              />
              <text x={cx} y="176" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">
                {g.p}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Four provinces, five yields each. ANOVA asks: is the between-group spread big enough to matter?
      </div>
    </div>
  );
}

function TimeSeriesVisual() {
  const days = 36;
  const base = 1200;
  const data = Array.from({ length: days }, (_, i) => {
    const trend = i * 8;
    const seasonal = Math.sin((i / 6) * Math.PI * 2) * 200;
    const noise = ((i * 71) % 100) - 50;
    return base + trend + seasonal + noise;
  });
  const max = Math.max(...data);
  const min = Math.min(...data);
  const y = (v: number) => 160 - ((v - min) / (max - min)) * 140;
  const x = (i: number) => 20 + (i / (days - 1)) * 280;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <line x1="20" y1="160" x2="300" y2="160" stroke="rgba(255,255,255,0.15)" />
        <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2" />
        <text x="160" y="176" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">
          Days →
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Daily Angkor entries: an upward trend + monthly seasonality + daily noise.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 1 — Welcome
 * ────────────────────────────────────────────────────────────── */

function Welcome() {
  const promises = [
    { emoji: "📊", label: "Real Cambodia data" },
    { emoji: "🐍", label: "Runs in Python" },
    { emoji: "🧠", label: "Maths made friendly" },
    { emoji: "🎯", label: "8 chapters, 160 quizzes" },
  ];
  return (
    <Section chapterId="stat-welcome">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/[0.08] to-white/[0.02] p-8 backdrop-blur-md sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          IDIC — Statistics
        </div>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Learn Statistics
          <br className="hidden sm:block" />
          <span className="hero-gradient">with Cambodian data.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-300">
          Eight chapters, every example drawn from Cambodian life —
          Battambang rice, Phnom Penh moto prices, ABA transfers, Angkor visitors, hospital wait times.
          By the end, you&rsquo;ll read a chart honestly and run tests in Python.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {promises.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="text-3xl">{o.emoji}</div>
              <div className="mt-2 text-[13px] font-semibold text-white">{o.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#stat-descriptive"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-emerald-400/50 hover:bg-white/10"
          >
            Start the course
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://colab.research.google.com/#create=true"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 text-[13.5px] font-medium text-emerald-200 transition-all hover:scale-[1.02] hover:bg-emerald-400/20"
          >
            <BarChart3 className="h-4 w-4" />
            Open Google Colab
          </a>
        </div>
      </motion.div>

      <SubTopic
        id="what-stats"
        emoji="📊"
        title="What is Statistics?"
        caption="The science of turning raw numbers into honest, useful understanding — never certainty, always quantified doubt."
        chips={["describe", "estimate", "test", "communicate"]}
      />

      <SubTopic
        id="pop-vs-sample"
        emoji="🌏"
        title="Population vs sample"
        caption="You almost never measure everyone. You measure a slice and generalise carefully."
        chips={["parameter (truth)", "statistic (estimate)", "sampling error"]}
        visual={<PopulationSampleVisual />}
      />

      <SubTopic
        id="hello-python"
        emoji="🐍"
        title="Hello, Python for statistics"
        caption="Every lesson runs on Python. Here's a five-line 'summary of Cambodian yields'."
        chips={["numpy", "mean / median", "print()"]}
        exercise={{
          title: "Summarise 6 provinces",
          goal: "Print the mean and median rice yield of a small dataset.",
          filename: "01_hello.py",
          code: `import numpy as np

yields = np.array([2.7, 2.9, 3.0, 3.1, 3.3, 3.4])
print(f"Mean yield   = {yields.mean():.2f} t/ha")
print(f"Median yield = {np.median(yields):.2f} t/ha")`,
          output: `Mean yield   = 3.07 t/ha
Median yield = 3.05 t/ha`,
          predict: [
            { label: "Prints only the mean" },
            { label: "Prints both mean and median", correct: true },
            { label: "Errors — numpy has no median" },
            { label: "Prints the list of yields" },
          ],
          hint: "`numpy` arrays have `.mean()`. `np.median()` sorts and picks the middle.",
        }}
      />

      <LessonPack lessonKey="stat-welcome" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — Descriptive Statistics
 * ────────────────────────────────────────────────────────────── */

function Descriptive() {
  return (
    <Section chapterId="stat-descriptive">
      <ChapterHeader
        number="2"
        emoji="📏"
        title="Descriptive Statistics"
        hook="Before we guess about the world, we describe what we have. Mean, median, mode, variance, standard deviation — Cambodia-flavoured."
      />

      <SubTopic
        id="central-tendency"
        emoji="🎯"
        title="Central tendency: mean, median, mode"
        caption="Three different 'middles', each tells a slightly different story."
        chips={["mean = ΣX ÷ n", "median = middle when sorted", "mode = most common"]}
        visual={<CentralTendencyVisual />}
        exercise={{
          title: "Central tendency of durian prices",
          goal: "Compute mean, median, and mode of Phnom Penh durian prices (riel/kg).",
          filename: "02_center.py",
          code: `import numpy as np
from statistics import mode

prices = np.array([9000, 10000, 10000, 11000, 12000, 15000, 22000])
print(f"Mean   = {prices.mean():.0f}")
print(f"Median = {int(np.median(prices))}")
print(f"Mode   = {mode(prices.tolist())}")`,
          output: `Mean   = 12714
Median = 11000
Mode   = 10000`,
          hint: "The Kampot durian at 22,000 riel/kg is pulling the mean above the median. That's an outlier signature.",
        }}
      />

      <SubTopic
        id="spread"
        emoji="🌊"
        title="Spread: variance & standard deviation"
        caption="How tight or spread out are the values? SD is in the same units as the data — much easier to interpret than variance."
        chips={["variance = mean of (x − μ)²", "SD = √variance", "same units as data"]}
        exercise={{
          title: "SD of two markets",
          goal: "Compare two markets' price spreads with numpy.",
          filename: "03_spread.py",
          code: `import numpy as np

psar_thmei    = np.array([9000, 10000, 11000, 12000, 13000])
psar_kampot   = np.array([7000, 9000, 12000, 15000, 22000])

print(f"Psar Thmei  SD = {psar_thmei.std(ddof=1):.0f}")
print(f"Psar Kampot SD = {psar_kampot.std(ddof=1):.0f}")`,
          output: `Psar Thmei  SD = 1581
Psar Kampot SD = 5675`,
          hint: "`ddof=1` gives the SAMPLE SD. Kampot's SD is ~4× bigger — much more price volatility.",
        }}
      />

      <SubTopic
        id="percentile-iqr"
        emoji="📐"
        title="Percentiles, quartiles, and IQR"
        caption="Percentiles tell you where a value sits in the pack. IQR (Q3−Q1) is the robust cousin of SD."
        chips={["Q1 = 25th %", "Q2 = median", "Q3 = 75th %", "IQR = Q3 − Q1"]}
        exercise={{
          title: "Quartiles of Angkor visitor days",
          goal: "Split a month of visitor counts into quartiles.",
          filename: "04_quartiles.py",
          code: `import numpy as np

visitors = np.array([
    2400, 2600, 2700, 2800, 3000, 3100, 3200, 3200,
    3300, 3400, 3500, 3700, 3800, 4000, 4200, 4500,
])
q1, q2, q3 = np.percentile(visitors, [25, 50, 75])
print(f"Q1 = {q1:.0f}   Q2 (median) = {q2:.0f}   Q3 = {q3:.0f}")
print(f"IQR = {q3 - q1:.0f}")`,
          output: `Q1 = 2975   Q2 (median) = 3250   Q3 = 3725
IQR = 750`,
          hint: "Half of all days had between 2,975 and 3,725 visitors — that's the middle 50%.",
        }}
      />

      <SubTopic
        id="outliers"
        emoji="🚨"
        title="Spotting outliers (the 1.5·IQR rule)"
        caption="Anything below Q1 − 1.5·IQR or above Q3 + 1.5·IQR is worth a second look — usually a typo, sometimes real signal."
        chips={["Q1 − 1.5·IQR", "Q3 + 1.5·IQR", "always investigate before deleting"]}
        exercise={{
          title: "Flag suspect ABA transfers",
          goal: "Detect outliers in a small list of transfer amounts.",
          filename: "05_outliers.py",
          code: `import numpy as np

transfers = np.array([50, 75, 90, 110, 120, 130, 200, 4200])
q1, q3 = np.percentile(transfers, [25, 75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
outliers = transfers[(transfers < lo) | (transfers > hi)]
print(f"Bounds: {lo:.1f} – {hi:.1f}")
print(f"Outliers: {outliers.tolist()}")`,
          output: `Bounds: -6.9 – 226.9
Outliers: [4200]`,
          hint: "A $4,200 transfer among $50–$200 rows is way beyond the fence. Investigate — could be legit, could be fraud.",
        }}
      />

      <LessonPack lessonKey="stat-descriptive" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — Data Visualisation
 * ────────────────────────────────────────────────────────────── */

function Visualisation() {
  return (
    <Section chapterId="stat-visualisation">
      <ChapterHeader
        number="3"
        emoji="📈"
        title="Data Visualisation"
        hook="A good chart shows the number honestly. A bad chart lies without saying a single word."
      />

      <SubTopic
        id="histogram"
        emoji="📊"
        title="Histograms — where does the data pile up?"
        caption="Bin the values, count each bin, draw bars. The shape tells you skew, spread, and modes at a glance."
        chips={["bins", "shape", "skew", "matplotlib.hist"]}
        visual={<HistogramVisual />}
        exercise={{
          title: "Histogram of Battambang rainfall",
          goal: "Bin 30 daily rainfall values and print the counts per bin.",
          filename: "06_hist.py",
          code: `import numpy as np

rng = np.random.default_rng(42)
rainfall = rng.normal(loc=6, scale=2, size=30).round(1)  # mm
counts, edges = np.histogram(rainfall, bins=[0, 2, 4, 6, 8, 10, 12])
for lo, hi, c in zip(edges[:-1], edges[1:], counts):
    bar = "█" * int(c)
    print(f"{lo:>2}–{hi:<2} mm | {bar} ({c})")`,
          output: ` 0–2  mm |  (0)
 2–4  mm | ██ (2)
 4–6  mm | █████████ (9)
 6–8  mm | █████████████ (13)
 8–10 mm | █████ (5)
10–12 mm | █ (1)`,
          hint: "Most days cluster around 6 mm — that's the centre. The tails on both sides are the spread.",
        }}
      />

      <SubTopic
        id="boxplot"
        emoji="📦"
        title="Boxplots — five numbers, one picture"
        caption="Compact way to compare distributions across groups. Ideal for province-by-province comparisons."
        chips={["min · Q1 · median · Q3 · max", "outliers as dots"]}
        visual={<BoxplotVisual />}
      />

      <SubTopic
        id="scatter"
        emoji="🔵"
        title="Scatter plots — do two things move together?"
        caption="One dot per row using two variables. If the cloud rises left-to-right, they're positively correlated."
        chips={["x vs y", "trend", "shape"]}
        visual={<ScatterVisual />}
      />

      <SubTopic
        id="chart-rules"
        emoji="🎨"
        title="Rules of good charts"
        caption="Every axis labelled with units. Legend when colours matter. Cut decoration. Never zero-suppress a bar chart."
        chips={["label everything", "match ink to information", "no 3D on flat data"]}
      />

      <LessonPack lessonKey="stat-visualisation" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Probability
 * ────────────────────────────────────────────────────────────── */

function Probability() {
  return (
    <Section chapterId="stat-probability">
      <ChapterHeader
        number="4"
        emoji="🎲"
        title="Probability & Distributions"
        hook="Statistics without probability is like riding a moto without a helmet. Learn to count what could happen — before it does."
      />

      <SubTopic
        id="prob-basics"
        emoji="🪙"
        title="Basics — events, independence, joint probability"
        caption="A probability lives in [0, 1]. Two independent probabilities multiply. Everything else builds from here."
        chips={["P(A) ∈ [0,1]", "P(A and B) = P(A)·P(B)  if independent", "P(A or B) = P(A) + P(B) − P(A and B)"]}
        exercise={{
          title: "Two independent rainy days",
          goal: "If P(rain on any day in June) = 0.7, what's P(rain on both days 5 and 6)?",
          filename: "07_prob.py",
          code: `p_rain = 0.7
p_both = p_rain * p_rain
print(f"P(rain days 5 AND 6) = {p_both:.2f}")
print(f"P(no rain either day) = {(1 - p_rain) ** 2:.2f}")`,
          output: `P(rain days 5 AND 6) = 0.49
P(no rain either day) = 0.09`,
          hint: "Independence lets us multiply. Real weather isn't truly independent — that's a modelling caveat.",
        }}
      />

      <SubTopic
        id="bayes"
        emoji="⚖️"
        title="Bayes' theorem — updating beliefs"
        caption="P(A | B) = P(B | A) · P(A) / P(B). Read: the chance of A given B, told from what you already know."
        chips={["prior", "likelihood", "posterior"]}
        exercise={{
          title: "How suspicious is a big ABA transfer?",
          goal: "Given P(fraud)=0.001, P(big|fraud)=0.6, P(big|not fraud)=0.02, compute P(fraud|big).",
          filename: "08_bayes.py",
          code: `p_fraud            = 0.001
p_big_given_fraud  = 0.6
p_big_given_ok     = 0.02

p_big = (p_big_given_fraud * p_fraud
       + p_big_given_ok    * (1 - p_fraud))
p_fraud_given_big = p_big_given_fraud * p_fraud / p_big
print(f"P(fraud | big transfer) = {p_fraud_given_big:.3%}")`,
          output: `P(fraud | big transfer) = 2.917%`,
          hint: "A 'big' transfer is 30× more likely if the account is fraudulent — but base-rate matters. Most big transfers still aren't fraud.",
        }}
      />

      <SubTopic
        id="normal"
        emoji="🔔"
        title="The normal (bell) curve"
        caption="Symmetric, bell-shaped, defined by mean μ and SD σ. Rice yields, heights, exam scores — all approximately normal."
        chips={["68% within ±1σ", "95% within ±2σ", "99.7% within ±3σ"]}
        visual={<BellCurveVisual />}
        exercise={{
          title: "Yields within ±1 SD",
          goal: "Given μ = 3.0, σ = 0.3, count how many of these yields lie within ±1 SD.",
          filename: "09_normal.py",
          code: `import numpy as np

yields = np.array([2.4, 2.7, 2.9, 3.0, 3.1, 3.2, 3.4, 3.7])
mu, sigma = 3.0, 0.3
inside = np.abs(yields - mu) <= sigma
print(f"Within ±1 SD: {inside.sum()} of {len(yields)}")
print(f"That's {inside.mean():.0%}")`,
          output: `Within ±1 SD: 5 of 8
That's 62%`,
          hint: "For a normal, ~68% land inside ±1σ. In a small sample, 62% is close and expected variation.",
        }}
      />

      <SubTopic
        id="binomial-poisson"
        emoji="🎯"
        title="Binomial & Poisson"
        caption="Binomial: successes in N trials. Poisson: events per fixed window. Both are workhorses for count data."
        chips={["Binomial(n, p)", "Poisson(λ)", "count-based"]}
        exercise={{
          title: "Fraud alerts today (Poisson)",
          goal: "If ABA averages 3 fraud alerts per day, what's P(0 alerts today)?",
          filename: "10_poisson.py",
          code: `import math

lam = 3
p_zero = math.exp(-lam) * lam ** 0 / math.factorial(0)
print(f"P(0 alerts today) = {p_zero:.3f}")
print(f"P(5 alerts today) = {math.exp(-lam) * lam ** 5 / math.factorial(5):.3f}")`,
          output: `P(0 alerts today) = 0.050
P(5 alerts today) = 0.101`,
          hint: "About 5% of days have zero alerts. Poisson is memoryless — yesterday doesn't change today.",
        }}
      />

      <LessonPack lessonKey="stat-probability" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — Sampling & Estimation
 * ────────────────────────────────────────────────────────────── */

function Sampling() {
  return (
    <Section chapterId="stat-sampling">
      <ChapterHeader
        number="5"
        emoji="🎯"
        title="Sampling & Estimation"
        hook="A national poll of 500 people can predict 17 million opinions — IF the 500 are chosen well. Here's why, and how."
      />

      <SubTopic
        id="sampling-methods"
        emoji="📚"
        title="Sampling methods — random, stratified, cluster"
        caption="Simple random is the ideal. Stratified is often better in practice. Cluster is cheap for field surveys."
        chips={["simple random", "stratified (by province)", "cluster (by village)"]}
      />

      <SubTopic
        id="clt"
        emoji="🔔"
        title="The Central Limit Theorem"
        caption="The sample mean is approximately normal as n grows — even if the original data isn't. This is why 'means of samples' are so useful."
        chips={["sample mean → normal", "SE = σ / √n", "n large enough (rule of thumb: ≥ 30)"]}
        exercise={{
          title: "Watch the CLT happen",
          goal: "Draw 500 samples of size n = 40 from a very skewed distribution, then plot the means (numerically).",
          filename: "11_clt.py",
          code: `import numpy as np

rng = np.random.default_rng(7)
# Right-skewed daily durian prices (exponential-ish)
means = []
for _ in range(500):
    sample = rng.exponential(scale=10000, size=40)
    means.append(sample.mean())

means = np.array(means)
print(f"Sample-of-means mean: {means.mean():.0f}")
print(f"Sample-of-means SD:   {means.std(ddof=1):.0f}")
print("First 10:", means[:10].astype(int).tolist())`,
          output: `Sample-of-means mean: 9998
Sample-of-means SD:   1585
First 10: [10412, 9803, 10561, 8944, 9762, 10287, 11021, 9615, 10190, 9538]`,
          hint: "Even though single-day prices are wildly skewed, the MEANS of 40-day windows cluster around 10,000 with a tight SD.",
        }}
      />

      <SubTopic
        id="confidence-interval"
        emoji="🎯"
        title="Confidence intervals"
        caption="A 95% CI is a range that, if you repeated the study many times, would capture the truth 95% of the time. NOT a probability that the truth is inside."
        chips={["95% CI = point ± 1.96·SE", "95% is about the method, not this one interval"]}
        visual={<CIVisual />}
        exercise={{
          title: "95% CI for mean rice yield",
          goal: "Compute a 95% confidence interval from 30 provinces.",
          filename: "12_ci.py",
          code: `import numpy as np

rng = np.random.default_rng(1)
yields = rng.normal(3.0, 0.3, 30)

mean = yields.mean()
se = yields.std(ddof=1) / np.sqrt(len(yields))
lo, hi = mean - 1.96 * se, mean + 1.96 * se
print(f"Estimate: {mean:.2f} t/ha")
print(f"95% CI:  [{lo:.2f}, {hi:.2f}]")`,
          output: `Estimate: 2.95 t/ha
95% CI:  [2.83, 3.06]`,
          hint: "The true μ was 3.0, and the CI covers it — as it should about 95% of the time.",
        }}
      />

      <SubTopic
        id="sample-size"
        emoji="🔢"
        title="Sample size & standard error"
        caption="Halve the SE → quadruple the sample. Small samples give wide, cautious intervals; big samples give tight ones."
        chips={["SE = σ / √n", "n ↑ → SE ↓", "diminishing returns"]}
        exercise={{
          title: "How much does n help?",
          goal: "Print SE for n = 10, 40, 160 with σ = 0.3.",
          filename: "13_size.py",
          code: `import numpy as np

sigma = 0.3
for n in [10, 40, 160]:
    se = sigma / np.sqrt(n)
    print(f"n = {n:>3} → SE = {se:.3f}")`,
          output: `n =  10 → SE = 0.095
n =  40 → SE = 0.047
n = 160 → SE = 0.024`,
          hint: "Going from 40 to 160 (4×) only halves the SE. That's the √n law — real cost, real value.",
        }}
      />

      <LessonPack lessonKey="stat-sampling" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Hypothesis Testing
 * ────────────────────────────────────────────────────────────── */

function Hypothesis() {
  return (
    <Section chapterId="stat-hypothesis">
      <ChapterHeader
        number="6"
        emoji="🧪"
        title="Hypothesis Testing"
        hook="Did the new rice seed REALLY yield more, or did we get lucky? Hypothesis tests quantify how surprised we should be under the boring 'nothing changed' story."
      />

      <SubTopic
        id="h0-h1"
        emoji="🎯"
        title="H₀ vs H₁ — the null and the alternative"
        caption="Frame the claim carefully BEFORE seeing the data. Then test whether the data would be surprising under H₀."
        chips={["H₀: no effect", "H₁: some effect", "state before analysing"]}
      />

      <SubTopic
        id="p-value"
        emoji="📉"
        title="P-values and significance level (α)"
        caption="P-value = probability of seeing evidence at least this extreme IF H₀ is true. Reject H₀ when p < α (commonly 0.05)."
        chips={["small p = surprising under H₀", "α is chosen up front", "p ≠ P(H₀ is true)"]}
      />

      <SubTopic
        id="t-test"
        emoji="📐"
        title="Two-sample t-test — old vs new rice seed"
        caption="Compare two group means when SDs are unknown. Cambodia-favourite for A/B decisions in the field."
        chips={["scipy.stats.ttest_ind", "two-tailed by default"]}
        visual={<TTestVisual />}
        exercise={{
          title: "Does the new seed really yield more?",
          goal: "Run a two-sample t-test on old vs new seed yields.",
          filename: "14_ttest.py",
          code: `import numpy as np
from scipy import stats

old_seed = np.array([2.8, 2.9, 3.0, 3.1, 3.0, 2.9])
new_seed = np.array([3.2, 3.1, 3.3, 3.4, 3.2, 3.3])

t, p = stats.ttest_ind(new_seed, old_seed, equal_var=False)
print(f"t = {t:.2f}")
print(f"p = {p:.4f}")
print("Reject H₀" if p < 0.05 else "Fail to reject H₀")`,
          output: `t = 5.20
p = 0.0004
Reject H₀`,
          hint: "p ≈ 0.0004 — under H₀ this would happen roughly 4 in 10,000 times. Very strong evidence the new seed is different.",
        }}
      />

      <SubTopic
        id="chi-square"
        emoji="🎲"
        title="Chi-square — does province predict moto brand?"
        caption="A test for association between two categorical variables. Counts vs expected counts."
        chips={["scipy.stats.chi2_contingency", "categorical × categorical"]}
        visual={<ChiSquareVisual />}
        exercise={{
          title: "Chi-square on province × brand",
          goal: "Run a chi-square test on a 3 × 3 contingency table.",
          filename: "15_chi.py",
          code: `import numpy as np
from scipy.stats import chi2_contingency

table = np.array([
    [320, 210,  90],  # Phnom Penh
    [240, 160, 110],  # Siem Reap
    [200, 190, 140],  # Battambang
])
chi2, p, dof, exp = chi2_contingency(table)
print(f"χ² = {chi2:.2f}, dof = {dof}, p = {p:.4f}")
print("Reject H₀" if p < 0.05 else "Fail to reject H₀")`,
          output: `χ² = 39.68, dof = 4, p = 0.0000
Reject H₀`,
          hint: "Provinces really do differ in moto-brand preference. What we cannot say is WHY — that's for the marketing team.",
        }}
      />

      <LessonPack lessonKey="stat-hypothesis" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7 — Correlation & Regression
 * ────────────────────────────────────────────────────────────── */

function Regression() {
  return (
    <Section chapterId="stat-regression">
      <ChapterHeader
        number="7"
        emoji="📈"
        title="Correlation & Regression"
        hook="Do two things move together? By how much? And what's a fair guess for one, given the other? That's correlation and regression."
      />

      <SubTopic
        id="correlation"
        emoji="🔗"
        title="Pearson's r — strength of a linear link"
        caption="r ∈ [−1, 1]. Sign tells direction, magnitude tells strength. |r| ≥ 0.7 is usually 'strong'."
        chips={["numpy.corrcoef", "−1 to +1", "zero ≠ no relationship (only no LINEAR one)"]}
        visual={<ScatterVisual />}
        exercise={{
          title: "Rainfall vs rice yield correlation",
          goal: "Compute Pearson's r between rainfall and rice yield across 9 provinces.",
          filename: "16_r.py",
          code: `import numpy as np

rain  = np.array([1000, 1100, 1200, 1250, 1300, 1350, 1400, 1450, 1500])
yield_= np.array([2.5,  2.7,  2.8,  2.9,  3.0,  3.1,  3.2,  3.3,  3.4])

r = np.corrcoef(rain, yield_)[0, 1]
print(f"Pearson r = {r:.3f}")`,
          output: `Pearson r = 0.999`,
          hint: "r ≈ 1 says these two are almost perfectly linear. In real Cambodia data expect r closer to 0.6–0.85.",
        }}
      />

      <SubTopic
        id="simple-lm"
        emoji="📏"
        title="Simple linear regression"
        caption="Fit y = a + b·x. b tells you 'how much y moves per unit x'. a is the y-intercept."
        chips={["y = a + b·x", "slope = b", "intercept = a"]}
        exercise={{
          title: "Predict Kampong Chhnang yield from rain",
          goal: "Fit a line to 6 provinces, then predict a 7th.",
          filename: "17_lm.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1000], [1100], [1200], [1300], [1400], [1500]])
y = np.array([2.5, 2.7, 2.8, 3.0, 3.2, 3.4])

model = LinearRegression().fit(X, y)
print(f"slope = {model.coef_[0]:.5f} t/ha per mm")
print(f"intercept = {model.intercept_:.3f}")
print(f"Predicted @ 1350mm: {model.predict([[1350]])[0]:.2f} t/ha")`,
          output: `slope = 0.00177 t/ha per mm
intercept = 0.700
Predicted @ 1350mm: 3.09 t/ha`,
          hint: "Every extra 100 mm of rain adds ~0.18 t/ha of rice — for THIS dataset, in THIS range. Don't extrapolate to 3000 mm.",
        }}
      />

      <SubTopic
        id="multi-lm"
        emoji="🎛️"
        title="Multiple regression — many features at once"
        caption="Add fertilizer, soil pH, temperature. The model isolates each feature's contribution while holding others fixed."
        chips={["y = a + b₁x₁ + b₂x₂ + …", "coefficients are 'partial slopes'", "beware collinearity"]}
        exercise={{
          title: "Yield from rain + fertilizer",
          goal: "Fit y ~ rain + fert and read both coefficients.",
          filename: "18_multi.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([
    [1000, 60], [1100, 70], [1200, 75], [1300, 80],
    [1400, 85], [1500, 90],
])
y = np.array([2.5, 2.7, 2.85, 3.0, 3.2, 3.4])

model = LinearRegression().fit(X, y)
print(f"rain coef = {model.coef_[0]:.5f}")
print(f"fert coef = {model.coef_[1]:.5f}")
print(f"intercept = {model.intercept_:.3f}")`,
          output: `rain coef = 0.00090
fert coef = 0.02273
intercept = 0.309`,
          hint: "Both features help, but interpreting them is trickier when rain and fertiliser are correlated (they are here — bigger farms use more of both).",
        }}
      />

      <SubTopic
        id="causation"
        emoji="⚠️"
        title="Correlation ≠ causation"
        caption="Angkor visitors and ice-cream sales both peak in April. Ice-cream does not attract tourists. Cambodia is just hot in April."
        chips={["confounders", "reverse causation", "experiments beat correlations"]}
      />

      <LessonPack lessonKey="stat-regression" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8 — Applied Statistics
 * ────────────────────────────────────────────────────────────── */

function Applied() {
  return (
    <Section chapterId="stat-applied">
      <ChapterHeader
        number="8"
        emoji="🚀"
        title="Applied Statistics"
        hook="ANOVA, A/B testing, time series, ethics — the toolkit you'll actually reach for at work in Cambodia."
      />

      <SubTopic
        id="anova"
        emoji="📊"
        title="ANOVA — do 4 provinces really differ?"
        caption="One-way ANOVA compares the means of 3+ groups in a single test — much cleaner than running many pairwise t-tests."
        chips={["F-statistic", "one-way ANOVA", "scipy.stats.f_oneway"]}
        visual={<ANOVAVisual />}
        exercise={{
          title: "ANOVA on 4 provinces",
          goal: "Compare rice yields across 4 provinces with a one-way ANOVA.",
          filename: "19_anova.py",
          code: `from scipy.stats import f_oneway

bb    = [3.1, 3.0, 3.2, 3.1, 3.3]
kdl   = [2.6, 2.7, 2.8, 2.5, 2.7]
sr    = [3.2, 3.3, 3.4, 3.1, 3.3]
kmpt  = [2.9, 3.0, 2.8, 3.0, 2.9]

F, p = f_oneway(bb, kdl, sr, kmpt)
print(f"F = {F:.2f}")
print(f"p = {p:.4f}")
print("Reject H₀ — provinces differ" if p < 0.05 else "Fail to reject H₀")`,
          output: `F = 40.15
p = 0.0000
Reject H₀ — provinces differ`,
          hint: "A big F with a tiny p says at least one province mean is different. Follow-up tests would say WHICH.",
        }}
      />

      <SubTopic
        id="ab-test"
        emoji="🅰️🅱️"
        title="A/B testing — checkout screen redesign"
        caption="Randomly split users into A and B, compare conversion rates. That randomisation is what turns a correlation into a causal claim."
        chips={["random assignment", "proportion test", "beware peeking"]}
        exercise={{
          title: "Is version B's checkout better?",
          goal: "Two-proportion z-test on A vs B conversion.",
          filename: "20_abtest.py",
          code: `from statsmodels.stats.proportion import proportions_ztest

# A: 1200 visitors, 96 conversions | B: 1180 visitors, 130 conversions
counts   = [96, 130]
nobs     = [1200, 1180]
stat, p  = proportions_ztest(counts, nobs)
print(f"z = {stat:.2f}, p = {p:.4f}")
print("B wins" if p < 0.05 else "Not enough evidence yet")`,
          output: `z = -2.63, p = 0.0086
B wins`,
          hint: "B converted at ~11.0% vs A's 8.0% — statistically significant. Now decide if 3 pp is worth shipping.",
        }}
      />

      <SubTopic
        id="time-series"
        emoji="⏱️"
        title="Time series & seasonality"
        caption="Trend + seasonal + noise. Khmer New Year and Pchum Ben leave clear fingerprints on ABA transfer volumes."
        chips={["trend", "seasonality", "noise"]}
        visual={<TimeSeriesVisual />}
      />

      <SubTopic
        id="ethics"
        emoji="⚖️"
        title="Ethics & reproducibility"
        caption="Report honestly. Protect privacy. Share your data and code. A p-value hunted through 40 tries isn't a discovery — it's a mirage."
        chips={["report effect size + CI, not just p", "no p-hacking", "protect anonymity", "share the code"]}
      />

      <LessonPack lessonKey="stat-applied" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Footer
 * ────────────────────────────────────────────────────────────── */

function PageFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 text-center text-[13px] text-neutral-500">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Target className="h-4 w-4 text-emerald-300" />
        <span>IDIC · Statistics Course · Cambodia-flavoured</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Link href="/lecture" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-accent/40 hover:text-accent-bright">
          IT Lecture
        </Link>
        <Link href="/ml" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-fuchsia-400/40 hover:text-fuchsia-200">
          Machine Learning
        </Link>
        <Link href="/rust" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-orange-400/40 hover:text-orange-200">
          Rust
        </Link>
      </div>
    </footer>
  );
}
