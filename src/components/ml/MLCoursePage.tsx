"use client";

// The Machine Learning course page. Mirrors the shape of the Rust
// course: sticky chapter tree in the sidebar (with a mobile drawer),
// a scrolling content column of chapter sections. Every worked example
// uses Cambodia-based data (rice yields by province, tuk-tuk fares in
// Phnom Penh, Angkor ticket demand, ABA fraud, Khmer text, …). Each
// chapter ends with the shared LessonPack (Key Terms + 20-question Quiz).

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  BrainCircuit,
  ChevronDown,
  Database,
  GitBranch,
  Menu,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Waves,
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

// Discrete text-size presets for the sidebar font-size dropdown.
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
    id: "ml-welcome",
    lessonKey: "ml-welcome",
    number: "1",
    label: "Welcome to ML",
    icon: Sparkles,
    subs: withPack("ml-welcome", [
      { id: "what-ml", label: "What is ML?" },
      { id: "ml-in-cambodia", label: "ML in Cambodia" },
      { id: "hello-python", label: "Hello, Python" },
    ]),
  },
  {
    id: "ml-data",
    lessonKey: "ml-data",
    number: "2",
    label: "Data & Features",
    icon: Database,
    subs: withPack("ml-data", [
      { id: "rows-cols", label: "Rows & columns" },
      { id: "load-csv", label: "Loading a CSV" },
      { id: "encoding", label: "Encoding categories" },
      { id: "cleaning", label: "Cleaning outliers" },
    ]),
  },
  {
    id: "ml-regression",
    lessonKey: "ml-regression",
    number: "3",
    label: "Regression",
    icon: TrendingUp,
    subs: withPack("ml-regression", [
      { id: "line-fit", label: "Fitting a line" },
      { id: "rain-vs-rice", label: "Rain → rice yield" },
      { id: "moto-price", label: "Predicting moto price" },
      { id: "eval-reg", label: "MSE, RMSE, R²" },
    ]),
  },
  {
    id: "ml-classification",
    lessonKey: "ml-classification",
    number: "4",
    label: "Classification",
    icon: GitBranch,
    subs: withPack("ml-classification", [
      { id: "logistic", label: "Logistic regression" },
      { id: "aba-fraud", label: "ABA fraud detection" },
      { id: "tree-forest", label: "Trees & forests" },
      { id: "metrics", label: "Precision / recall / F1" },
    ]),
  },
  {
    id: "ml-training",
    lessonKey: "ml-training",
    number: "5",
    label: "How Models Learn",
    icon: Waves,
    subs: withPack("ml-training", [
      { id: "loss", label: "Loss functions" },
      { id: "gradient-descent", label: "Gradient descent" },
      { id: "learning-rate", label: "Learning rate" },
      { id: "under-over", label: "Under- & over-fitting" },
    ]),
  },
  {
    id: "ml-eval",
    lessonKey: "ml-eval",
    number: "6",
    label: "Evaluation",
    icon: Target,
    subs: withPack("ml-eval", [
      { id: "train-test", label: "Train / test split" },
      { id: "kfold", label: "K-fold CV" },
      { id: "baseline", label: "Beat the baseline" },
      { id: "tuning", label: "Hyperparameter search" },
    ]),
  },
  {
    id: "ml-nn",
    lessonKey: "ml-nn",
    number: "7",
    label: "Neural Networks",
    icon: BrainCircuit,
    subs: withPack("ml-nn", [
      { id: "neuron", label: "A single neuron" },
      { id: "layers", label: "Stacking layers" },
      { id: "khmer-ocr", label: "Khmer character OCR" },
      { id: "deep-learning", label: "Going deep" },
    ]),
  },
  {
    id: "ml-modern",
    lessonKey: "ml-modern",
    number: "8",
    label: "Modern ML",
    icon: Rocket,
    subs: withPack("ml-modern", [
      { id: "llm", label: "LLMs & prompts" },
      { id: "rag", label: "RAG for Khmer docs" },
      { id: "deploy", label: "Deploying a model" },
      { id: "ethics", label: "Ethics & bias" },
    ]),
  },
];

const ALL_ANCHORS: string[] = OUTLINE.flatMap((c) => [c.id, ...c.subs.map((s) => s.id)]);

/* ─────────────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────────── */

export function MLCoursePage() {
  const [activeId, setActiveId] = useState<string>("ml-welcome");
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
              "radial-gradient(1200px 700px at 15% 10%, rgba(217, 70, 239, 0.10), transparent 60%)," +
              "radial-gradient(900px 600px at 85% 60%, rgba(139, 92, 246, 0.10), transparent 60%)," +
              "radial-gradient(700px 500px at 50% 100%, rgba(217, 70, 239, 0.06), transparent 60%)",
          }}
        />

        <div aria-hidden="true" className="fixed inset-x-0 top-[46px] z-[60] h-[2px] bg-white/5">
          <div
            className="h-full origin-left bg-gradient-to-r from-fuchsia-300 via-purple-400 to-fuchsia-300 transition-[width] duration-150"
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
            <DataAndFeatures />
            <Regression />
            <Classification />
            <Training />
            <Evaluation />
            <NeuralNets />
            <Modern />
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
        className="flex-1 cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11.5px] font-medium text-neutral-200 outline-none transition-colors hover:border-fuchsia-400/40 hover:text-fuchsia-300 focus:border-fuchsia-400/50"
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
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-400/30 bg-fuchsia-400/10 text-2xl">
        🤖
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold text-white">ML Course</span>
        <span className="truncate text-[11px] text-neutral-400">Cambodia-flavored ML</span>
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
                    ? "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 group-hover:text-fuchsia-300"
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
                  isChapterActive && "text-fuchsia-300"
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
                              : "text-fuchsia-300"
                            : isTool
                              ? "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                              : "text-neutral-500 hover:text-white"
                        )}
                      >
                        {isSubActive && !isTool && (
                          <span className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-fuchsia-300" />
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
          className="ml-1.5 mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-300"
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
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-300"
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
            href="/statistics"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-emerald-300">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">Statistics course</span>
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
          <div className="text-[11px] text-neutral-500">IDIC · Machine Learning</div>
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
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-fuchsia-400/30 bg-fuchsia-400/10 text-lg">
          🤖
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-white">ML Course</span>
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
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-widest text-fuchsia-300">
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
 * Lightweight visuals — each is an inline SVG or CSS mini-diagram.
 * Keeps the course visually rich without pulling in dozens of files.
 * ────────────────────────────────────────────────────────────── */

function DataTableVisual() {
  const rows = [
    { p: "Battambang", rain: 1420, fert: 88, yield: 3.1 },
    { p: "Kandal", rain: 1180, fert: 74, yield: 2.7 },
    { p: "Kampong Cham", rain: 1330, fert: 82, yield: 2.9 },
    { p: "Prey Veng", rain: 1250, fert: 78, yield: 2.8 },
    { p: "Siem Reap", rain: 1490, fert: 90, yield: 3.3 },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-fuchsia-300">
        <span>Province</span>
        <span className="text-right">Rain (mm)</span>
        <span className="text-right">Fert (kg/ha)</span>
        <span className="text-right">Yield (t/ha)</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.p}
          className={cn(
            "grid grid-cols-4 items-center px-3 py-2 text-[12.5px]",
            i % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"
          )}
        >
          <span className="text-white">{r.p}</span>
          <span className="text-right font-mono text-neutral-300">{r.rain}</span>
          <span className="text-right font-mono text-neutral-300">{r.fert}</span>
          <span className="text-right font-mono text-emerald-300">{r.yield}</span>
        </div>
      ))}
      <div className="border-t border-white/10 bg-black/30 px-3 py-2 text-[11px] text-neutral-400">
        <span className="text-fuchsia-300">Features</span> = rain, fertiliser &nbsp;·&nbsp;
        <span className="text-emerald-300">Label</span> = yield (t/ha)
      </div>
    </div>
  );
}

function RainYieldScatterVisual() {
  // Small deterministic Cambodian scatter — rainfall vs yield with a fit
  // line. Coords in SVG viewBox space (0..320, 0..180 with padding).
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
        <defs>
          <linearGradient id="fit" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <line x1="30" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.15)" />
        <line x1="30" y1="20" x2="30" y2="160" stroke="rgba(255,255,255,0.15)" />
        <text x="160" y="176" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">
          Rainfall (mm) →
        </text>
        <text
          x="14"
          y="90"
          fill="rgba(255,255,255,0.5)"
          fontSize="9"
          textAnchor="middle"
          transform="rotate(-90 14 90)"
        >
          Yield (t/ha) →
        </text>
        {/* Fit line */}
        <line x1="30" y1="150" x2="300" y2="35" stroke="url(#fit)" strokeWidth="2" />
        {/* Points */}
        {pts.map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="4" fill="#f0abfc" opacity="0.95" />
            <text x={x + 6} y={y - 4} fill="rgba(255,255,255,0.6)" fontSize="8">
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        More rain across provinces → higher rice yield. A line captures the trend.
      </div>
    </div>
  );
}

function ConfusionMatrixVisual() {
  const cells = [
    { r: "Actual FRAUD", c: "Predicted FRAUD", n: 42, ok: true, note: "True Positive" },
    { r: "Actual FRAUD", c: "Predicted OK", n: 6, ok: false, note: "False Negative — missed!" },
    { r: "Actual OK", c: "Predicted FRAUD", n: 11, ok: false, note: "False Positive — false alarm" },
    { r: "Actual OK", c: "Predicted OK", n: 9941, ok: true, note: "True Negative" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {cells.map((c) => (
        <div
          key={c.r + c.c}
          className={cn(
            "rounded-xl border p-3",
            c.ok
              ? "border-emerald-400/30 bg-emerald-400/[0.06]"
              : "border-rose-400/30 bg-rose-400/[0.06]"
          )}
        >
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-neutral-400">
            {c.r} → {c.c}
          </div>
          <div className="mt-1 font-mono text-2xl text-white">{c.n.toLocaleString()}</div>
          <div className={cn("mt-0.5 text-[11.5px]", c.ok ? "text-emerald-200" : "text-rose-200")}>
            {c.note}
          </div>
        </div>
      ))}
    </div>
  );
}

function GradientDescentVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        <defs>
          <linearGradient id="bowl" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
            <stop offset="50%" stopColor="rgba(217,70,239,0.15)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.3)" />
          </linearGradient>
        </defs>
        {/* Loss bowl */}
        <path
          d="M 20 30 Q 160 200 300 30"
          stroke="url(#bowl)"
          strokeWidth="2"
          fill="none"
        />
        {/* Steps: durian rolling down */}
        {[
          [40, 60],
          [70, 90],
          [110, 120],
          [150, 138],
          [190, 145],
          [220, 143],
        ].map(([x, y], i, arr) => {
          const isLast = i === arr.length - 1;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isLast ? 6 : 4}
                fill={isLast ? "#fbbf24" : "#f0abfc"}
                opacity={0.4 + i * 0.1}
              />
              {i > 0 && (
                <line
                  x1={arr[i - 1][0]}
                  y1={arr[i - 1][1]}
                  x2={x}
                  y2={y}
                  stroke="rgba(240,171,252,0.4)"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          );
        })}
        <text x="160" y="20" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">
          Loss surface — durian rolls to the minimum
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Each step down = gradient descent. Learning rate = step size.
      </div>
    </div>
  );
}

function TrainTestSplitVisual() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-1 text-[11px] font-mono uppercase tracking-widest text-fuchsia-300">
        10,000 Cambodian rice-yield rows
      </div>
      <div className="flex overflow-hidden rounded-lg">
        <div className="flex h-10 flex-[8] items-center justify-center bg-fuchsia-500/20 text-[12px] font-semibold text-fuchsia-100">
          Train · 80%
        </div>
        <div className="flex h-10 flex-[2] items-center justify-center bg-sky-500/25 text-[12px] font-semibold text-sky-100">
          Test · 20%
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
        <div className="rounded-lg border border-fuchsia-400/25 bg-fuchsia-400/[0.05] p-2">
          <div className="text-fuchsia-200">Train set</div>
          The model learns weights from these rows. Never uses the test set.
        </div>
        <div className="rounded-lg border border-sky-400/25 bg-sky-400/[0.05] p-2">
          <div className="text-sky-200">Test set</div>
          Held out. Judged just once — the honest grade.
        </div>
      </div>
    </div>
  );
}

function NeuralNetVisual() {
  const layers = [4, 6, 6, 3];
  const W = 320;
  const H = 180;
  const gapX = W / (layers.length + 1);
  const nodes = layers.map((n, li) => {
    const x = (li + 1) * gapX;
    const gapY = H / (n + 1);
    return Array.from({ length: n }, (_, ni) => ({ x, y: (ni + 1) * gapY }));
  });
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        {nodes.slice(0, -1).map((layer, li) =>
          layer.flatMap((a) =>
            nodes[li + 1].map((b, bi) => (
              <line
                key={`${li}-${a.y}-${bi}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(240,171,252,0.18)"
                strokeWidth="1"
              />
            ))
          )
        )}
        {nodes.map((layer, li) =>
          layer.map((n, i) => (
            <circle
              key={`${li}-${i}`}
              cx={n.x}
              cy={n.y}
              r="6"
              fill={li === 0 ? "#a855f7" : li === nodes.length - 1 ? "#f0abfc" : "#c084fc"}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
            />
          ))
        )}
        <text x={nodes[0][0].x} y="15" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">
          Input
        </text>
        <text
          x={nodes[nodes.length - 1][0].x}
          y="15"
          fill="rgba(255,255,255,0.6)"
          fontSize="9"
          textAnchor="middle"
        >
          Output
        </text>
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Input features → hidden layers do maths → output guesses the answer.
      </div>
    </div>
  );
}

function LLMVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 rounded-lg border border-fuchsia-400/25 bg-fuchsia-400/[0.05] p-3 text-[12px] text-neutral-200">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-fuchsia-300">
            Prompt
          </div>
          <div className="mt-1 font-mono text-fuchsia-100">
            &quot;Translate to English: &lsquo;អ្នកសុខសប្បាយទេ?&rsquo;&quot;
          </div>
        </div>
        <div className="flex items-center justify-center px-1 text-neutral-500">→</div>
        <div className="flex-1 rounded-lg border border-purple-400/25 bg-purple-400/[0.05] p-3 text-[12px] text-neutral-200">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-purple-300">
            LLM (transformer)
          </div>
          <div className="mt-1 font-mono">Reads all tokens · attention · predicts next words</div>
        </div>
        <div className="flex items-center justify-center px-1 text-neutral-500">→</div>
        <div className="flex-1 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.05] p-3 text-[12px] text-neutral-200">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-emerald-300">
            Output
          </div>
          <div className="mt-1 font-mono text-emerald-100">&quot;How are you?&quot;</div>
        </div>
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
    { emoji: "🧠", label: "Zero maths trauma" },
    { emoji: "🚀", label: "8 chapters, real feel" },
  ];
  return (
    <Section chapterId="ml-welcome">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-400/[0.08] to-white/[0.02] p-8 backdrop-blur-md sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-fuchsia-300">
          <Sparkles className="h-3.5 w-3.5" />
          IDIC — Machine Learning
        </div>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Learn Machine Learning
          <br className="hidden sm:block" />
          <span className="hero-gradient">with Cambodian data.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-300">
          Eight chapters, every example built from Cambodian life —
          Battambang rice, Phnom Penh moto prices, ABA fraud, Khmer letters.
          By the end, you&rsquo;ll train your own models in Python.
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
            href="#ml-data"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-fuchsia-400/50 hover:bg-white/10"
          >
            Start the course
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://colab.research.google.com/#create=true"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-5 py-2.5 text-[13.5px] font-medium text-fuchsia-200 transition-all hover:scale-[1.02] hover:bg-fuchsia-400/20"
          >
            <BarChart3 className="h-4 w-4" />
            Open Google Colab
          </a>
        </div>
      </motion.div>

      <SubTopic
        id="what-ml"
        emoji="🤖"
        title="What is Machine Learning?"
        caption="Instead of writing 1,000 if-statements, we show the computer many examples and it figures out the rule."
        chips={["data → patterns", "no explicit rules", "beats hand-coded rules"]}
      />

      <SubTopic
        id="ml-in-cambodia"
        emoji="🇰🇭"
        title="ML in Cambodia today"
        caption="From Battambang farmers forecasting rice yields to ABA flagging suspicious transfers, ML is quietly at work."
        chips={["rice forecast", "ABA fraud", "Angkor tourism", "Khmer OCR"]}
      />

      <SubTopic
        id="hello-python"
        emoji="🐍"
        title="Hello, Python"
        caption="Every ML lesson runs on Python. Here's a five-line 'hello Cambodia'."
        chips={["print()", "lists", "for loop"]}
        exercise={{
          title: "Say hi to five provinces",
          goal: "Print a greeting for each province in a Python list.",
          filename: "01_hello.py",
          code: `provinces = ["Phnom Penh", "Battambang", "Siem Reap", "Kampot", "Kandal"]
for p in provinces:
    print(f"Sok sabbay, {p}!")`,
          output: `Sok sabbay, Phnom Penh!
Sok sabbay, Battambang!
Sok sabbay, Siem Reap!
Sok sabbay, Kampot!
Sok sabbay, Kandal!`,
          predict: [
            { label: "Prints one line only" },
            { label: "Prints five lines, one per province", correct: true },
            { label: "Prints the whole list on one line" },
            { label: "Errors — provinces is not iterable" },
          ],
          hint: "Python's `for x in list:` runs the body once per item. `f\"...\"` slots the value in.",
        }}
      />

      <LessonPack lessonKey="ml-welcome" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — Data & Features
 * ────────────────────────────────────────────────────────────── */

function DataAndFeatures() {
  return (
    <Section chapterId="ml-data">
      <ChapterHeader
        number="2"
        emoji="📊"
        title="Data & Features"
        hook="ML lives or dies on data quality. First we understand rows and columns — then we clean, encode, and prepare a Cambodian rice-yield dataset."
      />

      <SubTopic
        id="rows-cols"
        emoji="📇"
        title="Rows are samples, columns are features"
        caption="Every ML dataset is a table. Each row = one province-year of rice; each column = one thing we measured."
        chips={["row = sample", "column = feature", "label = answer"]}
        visual={<DataTableVisual />}
      />

      <SubTopic
        id="load-csv"
        emoji="🐼"
        title="Load a CSV with pandas"
        caption="pandas is the workhorse. Two lines and your dataset is a table you can query."
        chips={["pandas", "read_csv", ".head()"]}
        exercise={{
          title: "Load Cambodian rice-yield data",
          goal: "Create a small DataFrame in memory and inspect the first rows.",
          filename: "02_load.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "province":  ["Battambang", "Kandal", "K.Cham", "Prey Veng", "Siem Reap"],
    "rain_mm":   [1420, 1180, 1330, 1250, 1490],
    "fert_kg":   [88, 74, 82, 78, 90],
    "yield_tha": [3.1, 2.7, 2.9, 2.8, 3.3],
})
print(df.head())
print("\\nShape:", df.shape)`,
          output: `     province  rain_mm  fert_kg  yield_tha
0  Battambang     1420       88        3.1
1      Kandal     1180       74        2.7
2      K.Cham     1330       82        2.9
3   Prey Veng     1250       78        2.8
4   Siem Reap     1490       90        3.3

Shape: (5, 4)`,
          hint: "`.shape` returns (rows, columns). Here: 5 provinces × 4 columns.",
        }}
      />

      <SubTopic
        id="encoding"
        emoji="🎯"
        title="One-hot encode the province"
        caption='Text like "Battambang" isn&apos;t a number. Turn it into 0/1 columns so the model can use it.'
        chips={["one-hot", "pd.get_dummies", "no ordinal trap"]}
        exercise={{
          title: "Encode 'province' with one-hot",
          goal: "Turn the province name into indicator columns.",
          filename: "03_encoding.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "province": ["Battambang", "Kandal", "K.Cham"],
    "rain_mm":  [1420, 1180, 1330],
})
encoded = pd.get_dummies(df, columns=["province"], dtype=int)
print(encoded)`,
          output: `   rain_mm  province_Battambang  province_K.Cham  province_Kandal
0     1420                    1                0                0
1     1180                    0                0                1
2     1330                    0                1                0`,
          hint: "One-hot avoids fooling the model into thinking Kandal (2) is 'more' than Battambang (1).",
        }}
      />

      <SubTopic
        id="cleaning"
        emoji="🧹"
        title="Spot and drop outliers"
        caption="A durian marked 999,999 riel/kg among 8–15k rows is obviously a typo. Cleaning saves models from being poisoned."
        chips={["boxplot", ".describe()", "quantile filter"]}
        exercise={{
          title: "Filter durian prices to a sane range",
          goal: "Keep only rows where price is between 5,000 and 25,000 riel/kg.",
          filename: "04_clean.py",
          code: `import pandas as pd

durian = pd.DataFrame({
    "market":     ["PP",   "PP",   "SR",   "BB",     "K.Cham"],
    "price_riel": [10000,  12000,  9000,   999999,   11000],
})
clean = durian[(durian.price_riel >= 5000) & (durian.price_riel <= 25000)]
print(clean.reset_index(drop=True))`,
          output: `   market  price_riel
0      PP       10000
1      PP       12000
2      SR        9000
3  K.Cham       11000`,
          hint: "The Battambang row (999,999) was clearly a data-entry typo — quietly dropped.",
        }}
      />

      <LessonPack lessonKey="ml-data" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — Regression
 * ────────────────────────────────────────────────────────────── */

function Regression() {
  return (
    <Section chapterId="ml-regression">
      <ChapterHeader
        number="3"
        emoji="📈"
        title="Regression"
        hook="Predict a number. How much rice will Battambang produce this year? How much for that used Honda Wave?"
      />

      <SubTopic
        id="line-fit"
        emoji="📏"
        title="Fit a line — the simplest model"
        caption="Given rainfall across provinces, draw the best-fit line for rice yield. That IS your first ML model."
        chips={["y = w·x + b", "one input", "one output"]}
        visual={<RainYieldScatterVisual />}
      />

      <SubTopic
        id="rain-vs-rice"
        emoji="🌾"
        title="Predict rice yield from rainfall"
        caption="Fit scikit-learn's LinearRegression on 8 Cambodian provinces and predict a new one."
        chips={["LinearRegression", ".fit()", ".predict()"]}
        exercise={{
          title: "Rain → rice yield",
          goal: "Train a line on 8 provinces, then predict Pursat's yield given its rainfall.",
          filename: "05_rice.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

# rain_mm across provinces, and their rice yield in tonnes/ha
X = np.array([[1180], [1250], [1330], [1350], [1420], [1440], [1490], [1520]])
y = np.array([2.65,   2.80,   2.90,   2.95,   3.10,   3.15,   3.30,   3.35])

model = LinearRegression().fit(X, y)
print(f"slope    = {model.coef_[0]:.5f} t/ha per mm")
print(f"intercept = {model.intercept_:.3f} t/ha")

pursat_rain = [[1380]]
print(f"Pursat predicted yield: {model.predict(pursat_rain)[0]:.2f} t/ha")`,
          output: `slope    = 0.00202 t/ha per mm
intercept = 0.263 t/ha
Pursat predicted yield: 3.05 t/ha`,
          hint: "Every extra 1 mm of rain adds ~0.002 t/ha. 100 mm more rain ≈ 0.2 t/ha more rice.",
        }}
      />

      <SubTopic
        id="moto-price"
        emoji="🛵"
        title="Predict a Honda Wave price"
        caption="Multivariate regression: use year + kilometres to predict resale price in Phnom Penh."
        chips={["multi-feature", "used moto", "USD"]}
        exercise={{
          title: "Moto resale in Phnom Penh",
          goal: "Fit price on (year, km driven) then predict a new listing.",
          filename: "06_moto.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

# columns: year of make, km driven
X = np.array([
    [2018, 42000], [2019, 33000], [2020, 25000],
    [2021, 18000], [2022, 11000], [2023,  5000],
])
# resale price in USD from a PP dealer near Central Market
y = np.array([680, 750, 830, 920, 1030, 1180])

model = LinearRegression().fit(X, y)
new = [[2022, 15000]]  # a 2022 Honda Wave with 15k km
price = model.predict(new)[0]
print(f"Predicted price: \${price:.0f}")`,
          output: `Predicted price: $997`,
          hint: "The model learned: newer moto → higher price; more km → lower price. Both together give the estimate.",
        }}
      />

      <SubTopic
        id="eval-reg"
        emoji="🧮"
        title="How good is my model? MSE, RMSE, R²"
        caption="Numbers tell you whether the line actually fits the data."
        chips={["MSE", "RMSE (same units)", "R² (0–1)"]}
        exercise={{
          title: "Grade the rice-yield model",
          goal: "Compute RMSE and R² on the training data.",
          filename: "07_metrics.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

X = np.array([[1180], [1250], [1330], [1350], [1420], [1440], [1490], [1520]])
y = np.array([2.65,   2.80,   2.90,   2.95,   3.10,   3.15,   3.30,   3.35])

model = LinearRegression().fit(X, y)
pred = model.predict(X)

rmse = np.sqrt(mean_squared_error(y, pred))
r2 = r2_score(y, pred)
print(f"RMSE = {rmse:.3f} t/ha")
print(f"R²   = {r2:.3f}")`,
          output: `RMSE = 0.012 t/ha
R²   = 0.998`,
          hint: "R² = 0.998 means the line explains ~99.8% of the pattern here — great fit on training. But we haven't tested on held-out data yet (Chapter 6).",
        }}
      />

      <LessonPack lessonKey="ml-regression" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Classification
 * ────────────────────────────────────────────────────────────── */

function Classification() {
  return (
    <Section chapterId="ml-classification">
      <ChapterHeader
        number="4"
        emoji="🗂️"
        title="Classification"
        hook="Pick the right box. Is this ABA transfer fraud or legit? Is that photo amok or lok lak?"
      />

      <SubTopic
        id="logistic"
        emoji="📈"
        title="Logistic regression — the classifier"
        caption="Despite the name, it outputs a probability of 'yes'. Great baseline for binary problems."
        chips={["binary", "probability", "sigmoid"]}
        exercise={{
          title: "Predict fraud probability",
          goal: "Train logistic regression on 6 mock ABA transactions.",
          filename: "08_logistic.py",
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression

# features: [amount_usd, hour_of_day]
X = np.array([
    [5,   14], [12,  19], [45,  10], [80,   9],
    [500,  3], [750,  2], [900,  3], [1200, 4],
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])  # 1 = fraud

model = LogisticRegression().fit(X, y)
new = [[600, 3]]  # $600 at 3am
prob = model.predict_proba(new)[0][1]
print(f"Fraud probability: {prob:.2%}")`,
          output: `Fraud probability: 96.14%`,
          hint: "Big amount at 3am → the model flags it. Real fraud teams tune the threshold based on cost.",
        }}
      />

      <SubTopic
        id="aba-fraud"
        emoji="🚨"
        title="Confusion matrix for ABA fraud"
        caption="A 2×2 table that shows exactly where the model wins and where it fails."
        chips={["TP / FP / FN / TN", "imbalanced classes", "cost matters"]}
        visual={<ConfusionMatrixVisual />}
      />

      <SubTopic
        id="tree-forest"
        emoji="🌲"
        title="Decision trees & random forests"
        caption="Chained yes/no questions — humans can read them. A forest of trees votes for higher accuracy."
        chips={["interpretable", "no scaling needed", "workhorse of tabular ML"]}
        exercise={{
          title: "Random forest on fraud",
          goal: "Fit a small forest and see feature importance.",
          filename: "09_forest.py",
          code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

X = np.array([
    [5,   14], [12,  19], [45,  10], [80,   9],
    [500,  3], [750,  2], [900,  3], [1200, 4],
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])

rf = RandomForestClassifier(n_estimators=50, random_state=42).fit(X, y)
print("Feature importance (amount, hour):", rf.feature_importances_.round(3))
print("Predict [$600, 3am] ->", rf.predict([[600, 3]])[0])`,
          output: `Feature importance (amount, hour): [0.58 0.42]
Predict [$600, 3am] -> 1`,
          hint: "The forest says both amount and hour matter, with amount slightly more important.",
        }}
      />

      <SubTopic
        id="metrics"
        emoji="🏅"
        title="Precision, recall, F1"
        caption="Accuracy alone lies when frauds are rare. These three tell the truth."
        chips={["classification_report", "F1 balance", "cost-aware"]}
        exercise={{
          title: "Full classification report",
          goal: "Print scikit-learn's classification report for a small test set.",
          filename: "10_metrics.py",
          code: `from sklearn.metrics import classification_report

# Actual and predicted labels on a 20-transaction held-out set
y_true = [0]*17 + [1, 1, 1]
y_pred = [0]*16 + [1] + [1, 1, 0]  # 1 false alarm, 1 missed fraud

print(classification_report(
    y_true, y_pred, target_names=["legit", "fraud"], digits=2
))`,
          output: `              precision    recall  f1-score   support

       legit       0.94      0.94      0.94        17
       fraud       0.67      0.67      0.67         3

    accuracy                           0.90        20
   macro avg       0.80      0.80      0.80        20
weighted avg       0.90      0.90      0.90        20`,
          hint: "Notice: 90% accuracy sounds great, but fraud recall is only 67% — we missed 1 of 3 real frauds.",
        }}
      />

      <LessonPack lessonKey="ml-classification" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — Training / How Models Learn
 * ────────────────────────────────────────────────────────────── */

function Training() {
  return (
    <Section chapterId="ml-training">
      <ChapterHeader
        number="5"
        emoji="🎿"
        title="How Models Learn"
        hook="Under the hood, .fit() is walking downhill on a loss surface, one step at a time. Let's watch it."
      />

      <SubTopic
        id="loss"
        emoji="📉"
        title="Loss — a single number for badness"
        caption="MSE turns every wrong prediction into a distance we can shrink."
        chips={["MSE", "y − ŷ", "square & average"]}
        exercise={{
          title: "Hand-compute MSE",
          goal: "Given predictions vs actual rice yields, compute the MSE by hand.",
          filename: "11_mse.py",
          code: `import numpy as np

y_true = np.array([2.7, 2.9, 3.1, 3.3])
y_pred = np.array([2.9, 2.8, 3.2, 3.1])

residuals = y_true - y_pred
mse = np.mean(residuals ** 2)
print("residuals:", residuals)
print(f"MSE = {mse:.4f}")`,
          output: `residuals: [-0.2  0.1 -0.1  0.2]
MSE = 0.0250`,
          hint: "Squaring makes -0.2 and +0.2 equally 'bad'. That's why we can't just take the average residual.",
        }}
      />

      <SubTopic
        id="gradient-descent"
        emoji="🎿"
        title="Gradient descent, step by step"
        caption="Start with random weights. Peek at the slope. Take a small step downhill. Repeat until loss stops shrinking."
        chips={["slope = gradient", "step down", "converge"]}
        visual={<GradientDescentVisual />}
      />

      <SubTopic
        id="learning-rate"
        emoji="🚶"
        title="Tune the learning rate"
        caption="Too small = crawl. Too big = overshoot the durian right past the valley."
        chips={["0.001 – 0.1 typical", "log-scale sweep", "watch loss curve"]}
        exercise={{
          title: "Manual gradient descent",
          goal: "Fit a slope-only model y = w·x on Cambodian rain→yield with 20 steps.",
          filename: "12_gd.py",
          code: `import numpy as np

X = np.array([1180, 1250, 1330, 1420, 1490, 1520]) / 1000.0
y = np.array([2.65, 2.80, 2.90, 3.10, 3.30, 3.35])

w = 0.0
lr = 0.05
for step in range(20):
    pred = w * X
    grad = -2 * np.mean((y - pred) * X)
    w = w - lr * grad
print(f"Learned w ≈ {w:.3f}")
print(f"Predict rain=1400mm -> {w * 1.4:.2f} t/ha")`,
          output: `Learned w ≈ 2.213
Predict rain=1400mm -> 3.10 t/ha`,
          hint: "w near 2.2 means: 'yield ≈ 2.2 × (rain in metres)'. Physically it's just a fit — but the process IS gradient descent.",
        }}
      />

      <SubTopic
        id="under-over"
        emoji="🕸️"
        title="Under- vs over-fitting"
        caption="Under: too simple, misses the pattern. Over: memorises the noise. The sweet spot is in between."
        chips={["train err", "test err", "generalisation"]}
      />

      <LessonPack lessonKey="ml-training" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Evaluation
 * ────────────────────────────────────────────────────────────── */

function Evaluation() {
  return (
    <Section chapterId="ml-eval">
      <ChapterHeader
        number="6"
        emoji="🎯"
        title="Evaluation"
        hook="A model is only as good as its performance on data it has never seen. Train/test, cross-validation, baselines."
      />

      <SubTopic
        id="train-test"
        emoji="✂️"
        title="Train / test split"
        caption="80% to learn, 20% held out as the final exam. Never peek."
        chips={["train_test_split", "random_state", "80/20"]}
        visual={<TrainTestSplitVisual />}
      />

      <SubTopic
        id="kfold"
        emoji="🔄"
        title="K-fold cross-validation"
        caption="Split data into 5 folds. Train on 4, test on 1, rotate. Average the 5 scores for a stable estimate."
        chips={["cross_val_score", "k=5 typical", "robust"]}
        exercise={{
          title: "5-fold CV on rice-yield",
          goal: "Estimate the R² of a linear model without touching a held-out test.",
          filename: "13_kfold.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(7)
rain = rng.integers(1000, 1700, size=40)
yield_ = 0.0022 * rain + 0.1 + rng.normal(0, 0.08, size=40)
X = rain.reshape(-1, 1)

scores = cross_val_score(LinearRegression(), X, yield_, cv=5, scoring="r2")
print("Per-fold R²:", scores.round(3))
print(f"Mean R² = {scores.mean():.3f} (± {scores.std():.3f})")`,
          output: `Per-fold R²: [0.837 0.902 0.756 0.879 0.823]
Mean R² = 0.839 (± 0.049)`,
          hint: "One number wouldn't tell you the score varies from 0.76 to 0.90 across folds. 5-fold does.",
        }}
      />

      <SubTopic
        id="baseline"
        emoji="📏"
        title="Beat the baseline"
        caption="A model that always predicts the average yield IS a model. Any fancy model must beat it — otherwise it's wasted work."
        chips={["DummyRegressor", "sanity check", "know the floor"]}
        exercise={{
          title: "Dummy vs Linear",
          goal: "Compare a 'predict the mean' baseline against a linear regression.",
          filename: "14_baseline.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.dummy import DummyRegressor
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(1)
rain = rng.integers(1000, 1700, size=30)
yield_ = 0.0022 * rain + 0.1 + rng.normal(0, 0.08, size=30)
X = rain.reshape(-1, 1)

for name, m in [("Dummy(mean)", DummyRegressor(strategy="mean")),
                ("Linear",      LinearRegression())]:
    r2 = cross_val_score(m, X, yield_, cv=5, scoring="r2").mean()
    print(f"{name:12s} R² = {r2:.3f}")`,
          output: `Dummy(mean)  R² = -0.156
Linear       R² = 0.848`,
          hint: "Baseline R² is often ~0 (or negative on CV). The linear model at 0.85 is a real win.",
        }}
      />

      <SubTopic
        id="tuning"
        emoji="🎛️"
        title="Hyperparameter tuning"
        caption="Learning rate, tree depth, k in k-NN — settings YOU choose. Grid search sweeps them for you."
        chips={["GridSearchCV", "cv folds", "best_params_"]}
        exercise={{
          title: "Tune a random forest",
          goal: "Search over 'n_estimators' and 'max_depth' with 3-fold CV.",
          filename: "15_tune.py",
          code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

rng = np.random.default_rng(0)
X = rng.random((80, 4))
y = (X[:, 0] + X[:, 1] > 1.0).astype(int)  # a simple synthetic rule

grid = {"n_estimators": [10, 50, 200], "max_depth": [2, 4, None]}
gs = GridSearchCV(RandomForestClassifier(random_state=0), grid, cv=3)
gs.fit(X, y)
print("Best params:", gs.best_params_)
print(f"Best CV score: {gs.best_score_:.3f}")`,
          output: `Best params: {'max_depth': None, 'n_estimators': 200}
Best CV score: 0.988`,
          hint: "GridSearchCV trained 9 × 3 = 27 models and picked the winning combo. Slow but automatic.",
        }}
      />

      <LessonPack lessonKey="ml-eval" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7 — Neural Networks
 * ────────────────────────────────────────────────────────────── */

function NeuralNets() {
  return (
    <Section chapterId="ml-nn">
      <ChapterHeader
        number="7"
        emoji="🧠"
        title="Neural Networks"
        hook="Stack simple units into layers, add non-linear activations, and you can classify Khmer letters, translate text, or read Angkor drone photos."
      />

      <SubTopic
        id="neuron"
        emoji="🧬"
        title="One neuron = weight · input + bias, then activation"
        caption="A single neuron is basically a mini logistic regression. Neural nets are just… lots of them, stacked."
        chips={["weights + bias", "ReLU / sigmoid", "one unit"]}
      />

      <SubTopic
        id="layers"
        emoji="🥞"
        title="Stack layers into a network"
        caption="Input layer → hidden layers → output. Each layer is a new representation of the data."
        chips={["dense layers", "activations", "deep nets"]}
        visual={<NeuralNetVisual />}
      />

      <SubTopic
        id="khmer-ocr"
        emoji="🇰🇭"
        title="Khmer character classifier (MLP)"
        caption="A small multi-layer perceptron via scikit-learn — enough to feel how it works before jumping to PyTorch."
        chips={["MLPClassifier", "hidden_layer_sizes", "35+ Khmer consonants"]}
        exercise={{
          title: "Toy Khmer-letter shape classifier",
          goal: "Train an MLP on tiny 5-pixel patterns representing three Khmer letters.",
          filename: "16_mlp.py",
          code: `import numpy as np
from sklearn.neural_network import MLPClassifier

# 5 features per sample — abstract 'shape' descriptors for 3 letters
X = np.array([
    [1,0,1,0,1], [1,0,1,0,1], [1,1,0,0,1],   # letter ក (ka)
    [0,1,1,1,0], [0,1,1,1,0], [1,1,1,1,0],   # letter ខ (kha)
    [1,1,0,1,1], [1,0,0,1,1], [1,1,0,1,0],   # letter គ (ko)
])
y = ["ka","ka","ka","kha","kha","kha","ko","ko","ko"]

mlp = MLPClassifier(hidden_layer_sizes=(8,8), max_iter=500,
                    random_state=0).fit(X, y)
print("Predict [1,0,1,0,1] →", mlp.predict([[1,0,1,0,1]])[0])
print("Predict [0,1,1,1,0] →", mlp.predict([[0,1,1,1,0]])[0])`,
          output: `Predict [1,0,1,0,1] → ka
Predict [0,1,1,1,0] → kha`,
          hint: "Two hidden layers of 8 neurons each. In real Khmer OCR you'd use images and a CNN.",
        }}
      />

      <SubTopic
        id="deep-learning"
        emoji="🌊"
        title="Deep learning — many layers, GPU-hungry"
        caption="Once you have millions of rows (satellite imagery of rice fields, all Khmer news for 5 years), deep nets shine."
        chips={["CNN for images", "RNN / Transformer for text", "PyTorch / TF"]}
      />

      <LessonPack lessonKey="ml-nn" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8 — Modern ML
 * ────────────────────────────────────────────────────────────── */

function Modern() {
  return (
    <Section chapterId="ml-modern">
      <ChapterHeader
        number="8"
        emoji="🚀"
        title="Modern ML in the Wild"
        hook="LLMs, RAG, deployment, ethics. The last chapter is about using ML responsibly in Cambodia."
      />

      <SubTopic
        id="llm"
        emoji="💬"
        title="Large Language Models & prompts"
        caption="A transformer trained on a lot of text. Learn to write clear prompts — 80% of the game."
        chips={["ChatGPT / Claude", "prompt engineering", "Khmer coverage varies"]}
        visual={<LLMVisual />}
      />

      <SubTopic
        id="rag"
        emoji="📚"
        title="RAG — ground the LLM in Cambodian docs"
        caption="Embed your documents (tax law PDFs, tourist FAQ, ACLEDA product sheets), retrieve the top matches, feed them to the LLM at question time."
        chips={["embeddings", "vector search", "citations"]}
        exercise={{
          title: "Tiny RAG-style semantic search",
          goal: "Rank docs by cosine similarity to a Khmer-tourism query.",
          filename: "17_rag.py",
          code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

docs = [
    "Angkor Wat is a temple in Siem Reap.",
    "Tuk-tuks are common transport in Phnom Penh.",
    "The Kampot pepper is world-famous.",
    "Fish amok is a traditional Cambodian curry.",
]
query = "temples near Siem Reap"

v = TfidfVectorizer().fit(docs + [query])
D = v.transform(docs)
q = v.transform([query])
sims = cosine_similarity(q, D)[0]
top = int(sims.argmax())
print(f"Best match ({sims[top]:.2f}): {docs[top]}")`,
          output: `Best match (0.61): Angkor Wat is a temple in Siem Reap.`,
          hint: "Real RAG uses sentence embeddings (e.g. sentence-transformers) — the shape of the code is the same.",
        }}
      />

      <SubTopic
        id="deploy"
        emoji="🌐"
        title="Deploy: model → API → app"
        caption="Wrap the model with FastAPI or Next.js API routes; return predictions to a phone app that ACLEDA or a tuk-tuk service uses."
        chips={["FastAPI", "Next.js route", "monitor data drift"]}
        exercise={{
          title: "A tiny prediction function",
          goal: "Load a trained model and expose a predict function.",
          filename: "18_deploy.py",
          code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1180],[1250],[1330],[1420],[1490],[1520]])
y = np.array([2.65,2.80,2.90,3.10,3.30,3.35])
model = LinearRegression().fit(X, y)

def predict_rice_yield(rain_mm: float) -> float:
    return float(model.predict([[rain_mm]])[0])

for rain in [1200, 1400, 1600]:
    print(f"rain {rain} mm -> {predict_rice_yield(rain):.2f} t/ha")`,
          output: `rain 1200 mm -> 2.68 t/ha
rain 1400 mm -> 3.09 t/ha
rain 1600 mm -> 3.50 t/ha`,
          hint: "In production you'd load a pre-trained model from disk (joblib.load) instead of re-fitting.",
        }}
      />

      <SubTopic
        id="ethics"
        emoji="🕊️"
        title="Ethics & bias in Cambodian ML"
        caption="A model trained on Battambang data will be biased toward Battambang. Rural users deserve models tuned for them too."
        chips={["fairness audits", "privacy", "represent all provinces"]}
      />

      <LessonPack lessonKey="ml-modern" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Footer
 * ────────────────────────────────────────────────────────────── */

function PageFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-6 text-center text-[12.5px] text-neutral-500">
      Made with <span className="text-fuchsia-300">♥</span> at IDIC — every example a slice of
      <span className="mx-1 text-white">🇰🇭 Cambodian life</span>.
      <div className="mt-2">
        <Link href="/" className="text-neutral-300 hover:text-white">
          ← Back to courses
        </Link>
      </div>
    </footer>
  );
}
