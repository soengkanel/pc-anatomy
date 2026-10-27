"use client";

// The Data Structures & Algorithms course page. Taught in Rust.
// Mirrors the ML/Statistics course shape: sticky chapter tree in the
// sidebar (with a mobile drawer), a scrolling content column of
// chapter sections. Cambodia-flavoured examples throughout (Angkor
// queues, ABA lookups, moto delivery routes). Each chapter ends
// with the shared LessonPack (Key Terms + 20-question Quiz).

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpDown,
  BarChart3,
  Binary,
  Boxes,
  BrainCircuit,
  ChevronDown,
  Gauge,
  Hash,
  Layers,
  Link2,
  Menu,
  Network,
  PlayCircle,
  Rocket,
  Sparkles,
  Target,
  TreePine,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonPack } from "@/components/lecture/LessonPack";
import { LessonSessionProvider } from "@/components/lecture/LessonSession";
import { LaserPointer } from "@/components/lecture/LaserPointer";
import { ThemeToggle } from "@/components/lecture/ThemeToggle";
import { CodeExercise, type CodeExerciseProps } from "@/components/rust/CodeExercise";

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
    id: "dsa-welcome",
    lessonKey: "dsa-welcome",
    number: "1",
    label: "Welcome & Big-O",
    icon: Gauge,
    subs: withPack("dsa-welcome", [
      { id: "why-dsa", label: "Why DSA?" },
      { id: "big-o", label: "Big-O intuition" },
      { id: "hello-rust", label: "Hello, Rust" },
    ]),
  },
  {
    id: "dsa-arrays",
    lessonKey: "dsa-arrays",
    number: "2",
    label: "Arrays & Vectors",
    icon: Boxes,
    subs: withPack("dsa-arrays", [
      { id: "vec-basics", label: "Vec basics" },
      { id: "indexing", label: "Indexing & slicing" },
      { id: "two-pointer", label: "Two-pointer technique" },
      { id: "cost-model", label: "Insert / remove cost" },
    ]),
  },
  {
    id: "dsa-linked",
    lessonKey: "dsa-linked",
    number: "3",
    label: "Linked Lists",
    icon: Link2,
    subs: withPack("dsa-linked", [
      { id: "node-struct", label: "Node + Option<Box>" },
      { id: "push-front", label: "Push at head — O(1)" },
      { id: "traverse", label: "Traversal" },
      { id: "when-lists", label: "When to use lists" },
    ]),
  },
  {
    id: "dsa-stacks",
    lessonKey: "dsa-stacks",
    number: "4",
    label: "Stacks & Queues",
    icon: Layers,
    subs: withPack("dsa-stacks", [
      { id: "stack-lifo", label: "Stack (LIFO)" },
      { id: "queue-fifo", label: "Queue (FIFO)" },
      { id: "balanced-parens", label: "Balanced parentheses" },
      { id: "priority-queue", label: "Priority queue" },
    ]),
  },
  {
    id: "dsa-hashmaps",
    lessonKey: "dsa-hashmaps",
    number: "5",
    label: "Hash Maps & Sets",
    icon: Hash,
    subs: withPack("dsa-hashmaps", [
      { id: "hashmap-basics", label: "HashMap basics" },
      { id: "entry-api", label: "The Entry API" },
      { id: "counting", label: "Count with a HashMap" },
      { id: "hashset", label: "HashSet & de-dup" },
    ]),
  },
  {
    id: "dsa-trees",
    lessonKey: "dsa-trees",
    number: "6",
    label: "Trees & BSTs",
    icon: TreePine,
    subs: withPack("dsa-trees", [
      { id: "tree-shape", label: "Shape of a tree" },
      { id: "bst", label: "Binary Search Tree" },
      { id: "traversals", label: "Traversals" },
      { id: "btreemap", label: "Rust's BTreeMap" },
    ]),
  },
  {
    id: "dsa-graphs",
    lessonKey: "dsa-graphs",
    number: "7",
    label: "Graphs — BFS & DFS",
    icon: Network,
    subs: withPack("dsa-graphs", [
      { id: "graph-basics", label: "Vertices & edges" },
      { id: "adjacency", label: "Adjacency list" },
      { id: "bfs", label: "BFS with VecDeque" },
      { id: "dfs", label: "DFS with recursion" },
    ]),
  },
  {
    id: "dsa-sorting",
    lessonKey: "dsa-sorting",
    number: "8",
    label: "Sorting & Searching",
    icon: ArrowUpDown,
    subs: withPack("dsa-sorting", [
      { id: "insertion-sort", label: "Insertion sort" },
      { id: "merge-quick", label: "Merge & quick sort" },
      { id: "rust-sort", label: "sort() vs sort_unstable()" },
      { id: "binary-search", label: "Binary search" },
    ]),
  },
];

const ALL_ANCHORS: string[] = OUTLINE.flatMap((c) => [c.id, ...c.subs.map((s) => s.id)]);

/* ─────────────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────────── */

export function DSACoursePage() {
  const [activeId, setActiveId] = useState<string>("dsa-welcome");
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
              "radial-gradient(1200px 700px at 15% 10%, rgba(99, 102, 241, 0.12), transparent 60%)," +
              "radial-gradient(900px 600px at 85% 60%, rgba(56, 189, 248, 0.10), transparent 60%)," +
              "radial-gradient(700px 500px at 50% 100%, rgba(99, 102, 241, 0.06), transparent 60%)",
          }}
        />

        <div aria-hidden="true" className="fixed inset-x-0 top-[46px] z-[60] h-[2px] bg-white/5">
          <div
            className="h-full origin-left bg-gradient-to-r from-indigo-300 via-sky-400 to-indigo-300 transition-[width] duration-150"
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
            <ArraysAndVectors />
            <LinkedLists />
            <StacksAndQueues />
            <HashMaps />
            <Trees />
            <Graphs />
            <SortingAndSearching />
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
        className="flex-1 cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11.5px] font-medium text-neutral-200 outline-none transition-colors hover:border-indigo-400/40 hover:text-indigo-300 focus:border-indigo-400/50"
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
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-400/10 text-2xl">
        🧩
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold text-white">DSA in Rust</span>
        <span className="truncate text-[11px] text-neutral-400">Cambodia-flavoured</span>
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
                    ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 group-hover:text-indigo-300"
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
                  isChapterActive && "text-indigo-300"
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
                              : "text-indigo-300"
                            : isTool
                              ? "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                              : "text-neutral-500 hover:text-white"
                        )}
                      >
                        {isSubActive && !isTool && (
                          <span className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-indigo-300" />
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
          className="ml-1.5 mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-indigo-400/40 hover:bg-indigo-400/10 hover:text-indigo-300"
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
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-indigo-400/40 hover:bg-indigo-400/10 hover:text-indigo-300"
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
            href="/ml"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10 hover:text-fuchsia-200"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-fuchsia-300">
              <BrainCircuit className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">ML course</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="text-[11px] text-neutral-500">IDIC · DSA in Rust</div>
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
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-400/10 text-lg">
          🧩
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-white">DSA in Rust</span>
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
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-widest text-indigo-300">
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
  exercise?: CodeExerciseProps;
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

      {exercise && <CodeExercise {...exercise} />}
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

function BigOVisual() {
  const funcs: Array<{ label: string; color: string; f: (x: number) => number }> = [
    { label: "O(1)", color: "#34d399", f: () => 5 },
    { label: "O(log n)", color: "#38bdf8", f: (x) => 20 + Math.log2(x + 1) * 8 },
    { label: "O(n)", color: "#a78bfa", f: (x) => 20 + x * 1 },
    { label: "O(n log n)", color: "#fbbf24", f: (x) => 20 + (x * Math.log2(x + 1)) * 0.15 },
    { label: "O(n²)", color: "#f43f5e", f: (x) => 20 + (x * x) * 0.006 },
  ];
  const W = 320;
  const H = 180;
  const xs = Array.from({ length: 100 }, (_, i) => i * 1.2);
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <line x1="20" y1="160" x2="310" y2="160" stroke="rgba(255,255,255,0.15)" />
        <line x1="20" y1="10" x2="20" y2="160" stroke="rgba(255,255,255,0.15)" />
        {funcs.map((fn) => {
          const pts = xs
            .map((x) => {
              const y = Math.min(155, H - fn.f(x));
              return `${20 + x * 2.5},${y}`;
            })
            .join(" ");
          return (
            <polyline
              key={fn.label}
              points={pts}
              fill="none"
              stroke={fn.color}
              strokeWidth="1.8"
              opacity="0.95"
            />
          );
        })}
        <text x="160" y="176" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">
          input size n →
        </text>
        <text x="12" y="90" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle" transform="rotate(-90 12 90)">
          cost →
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        {funcs.map((fn) => (
          <span key={fn.label} className="inline-flex items-center gap-1.5 text-neutral-300">
            <span className="inline-block h-1.5 w-4 rounded" style={{ background: fn.color }} />
            {fn.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function VecVisual() {
  const items = ["Phnom Penh", "Battambang", "Siem Reap", "Kandal", "Kampot"];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-indigo-300">
        Vec&lt;String&gt; — 5 provinces
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((v, i) => (
          <div
            key={v}
            className="flex flex-col items-center rounded-md border border-white/10 bg-white/[0.03] p-2"
          >
            <span className="font-mono text-[10px] text-neutral-500">[{i}]</span>
            <span className="mt-0.5 text-[12px] text-white">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-neutral-400">
        Contiguous memory · O(1) indexing · O(1) push at end · O(n) insert in middle.
      </div>
    </div>
  );
}

function LinkedListVisual() {
  const nodes = ["Phnom Penh", "Battambang", "Siem Reap"];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-indigo-300">
        Singly linked list — head → tail
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {nodes.map((n, i) => (
          <div key={n} className="flex items-center gap-1.5">
            <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/[0.06] px-3 py-1.5">
              <div className="text-[10px] font-mono uppercase text-indigo-300">Node</div>
              <div className="text-[12.5px] text-white">{n}</div>
            </div>
            <span className="text-indigo-300">→</span>
          </div>
        ))}
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-mono text-neutral-400">
          None
        </div>
      </div>
      <div className="mt-2 text-[11px] text-neutral-400">
        Each node owns the next via Option&lt;Box&lt;Node&gt;&gt;. O(1) push at head, O(n) to reach the k-th.
      </div>
    </div>
  );
}

function StackQueueVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-indigo-400/30 bg-indigo-400/[0.06] p-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-300">
          Stack (LIFO)
        </div>
        <div className="mt-2 flex flex-col-reverse gap-1">
          {["undo #1", "undo #2", "undo #3 (top)"].map((s, i) => (
            <div
              key={s}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[12px]",
                i === 2
                  ? "border-indigo-300/60 bg-indigo-300/20 text-indigo-100"
                  : "border-white/10 bg-white/[0.03] text-neutral-200"
              )}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-neutral-400">push / pop at the top — O(1)</div>
      </div>
      <div className="rounded-xl border border-sky-400/30 bg-sky-400/[0.06] p-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-sky-300">
          Queue (FIFO)
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="rounded-md border border-sky-300/60 bg-sky-300/20 px-2.5 py-1 text-[12px] text-sky-100">
            person A (front)
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-neutral-200">
            person B
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-neutral-200">
            person C
          </div>
        </div>
        <div className="mt-2 text-[11px] text-neutral-400">enqueue back, dequeue front — O(1)</div>
      </div>
    </div>
  );
}

function HashMapVisual() {
  const buckets = [
    { i: 0, entries: [] as string[] },
    { i: 1, entries: ["Battambang → 3.1"] },
    { i: 2, entries: [] },
    { i: 3, entries: ["Kandal → 2.7", "Kampot → 2.9"] },
    { i: 4, entries: ["Siem Reap → 3.3"] },
    { i: 5, entries: [] },
    { i: 6, entries: ["Phnom Penh → 2.4"] },
    { i: 7, entries: [] },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-indigo-300">
        HashMap&lt;String, f64&gt; — 8 buckets
      </div>
      <div className="space-y-1">
        {buckets.map((b) => (
          <div key={b.i} className="flex items-center gap-2">
            <div className="w-8 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-center font-mono text-[11px] text-neutral-400">
              {b.i}
            </div>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {b.entries.length === 0 ? (
                <span className="text-[11px] text-neutral-600">— empty —</span>
              ) : (
                b.entries.map((e) => (
                  <span
                    key={e}
                    className="rounded-md border border-indigo-400/30 bg-indigo-400/[0.06] px-2 py-0.5 font-mono text-[11px] text-indigo-100"
                  >
                    {e}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-neutral-400">
        Bucket 3 has a collision — two keys land in the same slot. Lookup is still O(1) on average.
      </div>
    </div>
  );
}

function BSTVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        {/* edges */}
        <line x1="160" y1="30" x2="100" y2="80" stroke="rgba(255,255,255,0.25)" />
        <line x1="160" y1="30" x2="220" y2="80" stroke="rgba(255,255,255,0.25)" />
        <line x1="100" y1="80" x2="60" y2="130" stroke="rgba(255,255,255,0.25)" />
        <line x1="100" y1="80" x2="130" y2="130" stroke="rgba(255,255,255,0.25)" />
        <line x1="220" y1="80" x2="260" y2="130" stroke="rgba(255,255,255,0.25)" />

        {/* nodes */}
        {[
          { cx: 160, cy: 30, v: 50 },
          { cx: 100, cy: 80, v: 25 },
          { cx: 220, cy: 80, v: 75 },
          { cx: 60, cy: 130, v: 10 },
          { cx: 130, cy: 130, v: 38 },
          { cx: 260, cy: 130, v: 90 },
        ].map((n) => (
          <g key={n.v}>
            <circle cx={n.cx} cy={n.cy} r="16" fill="#4f46e5" stroke="#a5b4fc" strokeWidth="1.5" />
            <text x={n.cx} y={n.cy + 4} fontSize="12" fill="#fff" textAnchor="middle" fontWeight="bold">
              {n.v}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        In-order traversal yields sorted: 10 · 25 · 38 · 50 · 75 · 90.
      </div>
    </div>
  );
}

function GraphVisual() {
  const nodes = [
    { id: "PP", cx: 60, cy: 100 },
    { id: "Kandal", cx: 130, cy: 60 },
    { id: "K.Cham", cx: 200, cy: 100 },
    { id: "SR", cx: 260, cy: 60 },
    { id: "BB", cx: 260, cy: 140 },
    { id: "Kampot", cx: 130, cy: 150 },
  ];
  const edges: Array<[string, string, number]> = [
    ["PP", "Kandal", 30],
    ["PP", "Kampot", 150],
    ["Kandal", "K.Cham", 100],
    ["K.Cham", "SR", 200],
    ["K.Cham", "BB", 190],
    ["SR", "BB", 60],
    ["PP", "K.Cham", 120],
  ];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <svg viewBox="0 0 320 180" className="h-auto w-full">
        {edges.map(([a, b, w]) => {
          const A = pos[a];
          const B = pos[b];
          const mx = (A.cx + B.cx) / 2;
          const my = (A.cy + B.cy) / 2;
          return (
            <g key={`${a}-${b}`}>
              <line x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy} stroke="rgba(165,180,252,0.35)" strokeWidth="1.5" />
              <text x={mx} y={my - 2} fontSize="9" fill="rgba(255,255,255,0.6)" textAnchor="middle">
                {w}km
              </text>
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r="16" fill="#4f46e5" stroke="#a5b4fc" strokeWidth="1.5" />
            <text x={n.cx} y={n.cy + 4} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="bold">
              {n.id}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 text-[11px] text-neutral-400">
        Weighted undirected graph of Cambodian provinces. Dijkstra finds shortest routes.
      </div>
    </div>
  );
}

function SortingVisual() {
  const bars = [64, 25, 12, 22, 11, 90, 45, 33, 78, 5];
  const sorted = [...bars].sort((a, b) => a - b);
  const max = Math.max(...bars);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          Before
        </div>
        <div className="mt-2 flex h-24 items-end gap-1">
          {bars.map((b, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-rose-400/60 to-rose-300/50"
              style={{ height: `${(b / max) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-indigo-400/30 bg-indigo-400/[0.06] p-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-indigo-300">
          After — sort()
        </div>
        <div className="mt-2 flex h-24 items-end gap-1">
          {sorted.map((b, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-indigo-400/70 to-sky-400/60"
              style={{ height: `${(b / max) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BinarySearchVisual() {
  const arr = [3, 8, 12, 17, 25, 31, 42, 56, 78, 91];
  const target = 31;
  // Steps for binary search of 31 in this array
  const steps = [
    { lo: 0, hi: 9, mid: 4, note: "mid = arr[4] = 25 < 31 → go right" },
    { lo: 5, hi: 9, mid: 7, note: "mid = arr[7] = 56 > 31 → go left" },
    { lo: 5, hi: 6, mid: 5, note: "mid = arr[5] = 31 ✓ found!" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-[11px] font-mono uppercase tracking-widest text-indigo-300">
        Binary search for {target} in a sorted Vec
      </div>
      <div className="space-y-1.5">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {arr.map((v, idx) => {
              const inRange = idx >= s.lo && idx <= s.hi;
              const isMid = idx === s.mid;
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded font-mono text-[11px]",
                    isMid
                      ? "border-2 border-amber-300 bg-amber-300/20 text-amber-100"
                      : inRange
                        ? "border border-indigo-400/40 bg-indigo-400/[0.08] text-indigo-100"
                        : "border border-white/5 bg-white/[0.01] text-neutral-600"
                  )}
                >
                  {v}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-0.5 text-[11px] text-neutral-400">
        {steps.map((s, i) => (
          <div key={i}>
            <span className="text-indigo-300">step {i + 1}:</span> {s.note}
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-neutral-500">
        10 elements → 3 comparisons. That's the log₂(n) magic.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 1 — Welcome
 * ────────────────────────────────────────────────────────────── */

function Welcome() {
  const promises = [
    { emoji: "🦀", label: "Written in Rust" },
    { emoji: "🇰🇭", label: "Cambodian examples" },
    { emoji: "⚡", label: "Big-O without pain" },
    { emoji: "🎯", label: "8 chapters, 160 quizzes" },
  ];
  return (
    <Section chapterId="dsa-welcome">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-400/[0.08] to-white/[0.02] p-8 backdrop-blur-md sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          IDIC — Data Structures & Algorithms
        </div>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Learn Data Structures & Algorithms
          <br className="hidden sm:block" />
          <span className="hero-gradient">the Rust way.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-300">
          Eight chapters, every algorithm shown in idiomatic Rust —
          Vec, VecDeque, HashMap, BTreeMap, Box, Option, and traits.
          Real-life Cambodian examples: Angkor ticket queues, ABA
          account lookups, moto delivery routes.
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
            href="#dsa-arrays"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-indigo-400/50 hover:bg-white/10"
          >
            Start the course
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://play.rust-lang.org/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-5 py-2.5 text-[13.5px] font-medium text-indigo-200 transition-all hover:scale-[1.02] hover:bg-indigo-400/20"
          >
            <PlayCircle className="h-4 w-4" />
            Open Rust Playground
          </a>
        </div>
      </motion.div>

      <SubTopic
        id="why-dsa"
        emoji="🧭"
        title="Why data structures and algorithms?"
        caption="Because 'it works' is not enough. The same task can run in 0.001 seconds or 1 hour depending on the structure you pick."
        chips={["scale", "cost", "reasoning"]}
      />

      <SubTopic
        id="big-o"
        emoji="📈"
        title="Big-O intuition — five curves to memorise"
        caption="Big-O is a shorthand for how cost grows with input size. Memorise these five shapes and you'll read algorithm cost at a glance."
        chips={["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"]}
        visual={<BigOVisual />}
      />

      <SubTopic
        id="hello-rust"
        emoji="🦀"
        title="Hello, Rust for DSA"
        caption="Every lesson runs in Rust. Here's a five-line warm-up."
        chips={["fn main()", "for loop", "Vec", "println!"]}
        exercise={{
          title: "Greet five provinces",
          goal: "Iterate a Vec<&str> and print a greeting per province.",
          code: `fn main() {
    let provinces = vec!["Phnom Penh", "Battambang", "Siem Reap", "Kandal", "Kampot"];
    for p in &provinces {
        println!("Sok sabbay, {}!", p);
    }
}`,
          output: `Sok sabbay, Phnom Penh!
Sok sabbay, Battambang!
Sok sabbay, Siem Reap!
Sok sabbay, Kandal!
Sok sabbay, Kampot!`,
          predict: [
            { label: "Prints one line only" },
            { label: "Prints five lines", correct: true },
            { label: "Errors — borrow checker" },
            { label: "Prints the vec once" },
          ],
          hint: "`&provinces` borrows the vec so we can keep it alive after the loop.",
        }}
      />

      <LessonPack lessonKey="dsa-welcome" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — Arrays & Vectors
 * ────────────────────────────────────────────────────────────── */

function ArraysAndVectors() {
  return (
    <Section chapterId="dsa-arrays">
      <ChapterHeader
        number="2"
        emoji="📦"
        title="Arrays & Vectors"
        hook="Vec<T> is Rust's everyday container. Learn to reach for it first, and know exactly when each operation is O(1) vs O(n)."
      />

      <SubTopic
        id="vec-basics"
        emoji="📇"
        title="Vec basics — grow and iterate"
        caption="Create, push, index. This is 90% of what you'll do day-to-day."
        chips={["Vec::new()", "vec![…]", "push / pop", "for x in &v"]}
        visual={<VecVisual />}
        exercise={{
          title: "Sum a Vec of yields",
          goal: "Total the rice yields across 6 provinces.",
          code: `fn main() {
    let yields = vec![3.1, 2.7, 2.9, 3.3, 2.8, 3.4];
    let total: f64 = yields.iter().sum();
    println!("Total yield: {:.1} t/ha", total);
    println!("Mean yield:  {:.2} t/ha", total / yields.len() as f64);
}`,
          output: `Total yield: 18.2 t/ha
Mean yield:  3.03 t/ha`,
          hint: "`.iter().sum()` needs a type annotation on the result — Rust infers f64 here from the Vec.",
        }}
      />

      <SubTopic
        id="indexing"
        emoji="🔢"
        title="Indexing and slicing"
        caption="Access one item in O(1). Take a view of several in O(1) with a slice — no copying."
        chips={["v[i]", "&v[..3]", "get(i) → Option<&T>"]}
        exercise={{
          title: "First half of a market's prices",
          goal: "Print the first three prices with a slice.",
          code: `fn main() {
    let prices = vec![10_000, 12_000, 9_500, 11_000, 13_000, 15_500];
    let first_half = &prices[..3];
    println!("First 3: {:?}", first_half);
    // .get() returns Option — safer than [] when the index may be out of range
    match prices.get(99) {
        Some(p) => println!("99 → {}", p),
        None    => println!("index 99 out of range"),
    }
}`,
          output: `First 3: [10000, 12000, 9500]
index 99 out of range`,
          hint: "Use `.get(i)` when you're not sure; it returns None instead of panicking.",
        }}
      />

      <SubTopic
        id="two-pointer"
        emoji="👉👈"
        title="Two-pointer technique"
        caption="Two indices walking through the same Vec — front/back, or fast/slow. The trick behind many O(n) solutions."
        chips={["reverse", "palindrome check", "sum pairs"]}
        exercise={{
          title: "Reverse a Vec in place",
          goal: "Swap items from both ends until the pointers meet.",
          code: `fn reverse<T>(v: &mut Vec<T>) {
    let mut i = 0;
    let mut j = v.len().saturating_sub(1);
    while i < j {
        v.swap(i, j);
        i += 1;
        j -= 1;
    }
}

fn main() {
    let mut order = vec!["first", "second", "third", "fourth"];
    reverse(&mut order);
    println!("{:?}", order);
}`,
          output: `["fourth", "third", "second", "first"]`,
          hint: "`saturating_sub(1)` avoids an integer underflow on an empty Vec (usize can't be negative).",
        }}
      />

      <SubTopic
        id="cost-model"
        emoji="⚖️"
        title="Insert / remove cost model"
        caption="push and pop at the END are O(1) amortised. Insert or remove ELSEWHERE shifts everything after — O(n)."
        chips={["push_back → O(1)", "insert(0, x) → O(n)", "remove(k) → O(n)"]}
        exercise={{
          title: "Measure the difference",
          goal: "Insert 10,000 items at the front vs at the back and print roughly how many shifts happened.",
          code: `fn main() {
    let n = 10_000;
    let mut back = Vec::with_capacity(n);
    let mut front = Vec::with_capacity(n);
    for i in 0..n {
        back.push(i);          // O(1) each
        front.insert(0, i);    // O(n) each — every push shifts everything
    }
    println!("back  len = {}", back.len());
    println!("front len = {}", front.len());
    println!("front's total shifts ≈ {}", n * (n - 1) / 2);
}`,
          output: `back  len = 10000
front len = 10000
front's total shifts ≈ 49995000`,
          hint: "Same result, but 'front' did ~50M shifts under the hood. This is why VecDeque exists for double-ended work.",
        }}
      />

      <LessonPack lessonKey="dsa-arrays" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — Linked Lists
 * ────────────────────────────────────────────────────────────── */

function LinkedLists() {
  return (
    <Section chapterId="dsa-linked">
      <ChapterHeader
        number="3"
        emoji="🔗"
        title="Linked Lists"
        hook="Rare in production Rust — but a beautiful way to internalise ownership, borrowing, and recursive types."
      />

      <SubTopic
        id="node-struct"
        emoji="🧿"
        title="A node = value + Option<Box<Node>>"
        caption="A recursive type. Box gives us heap indirection so Rust can size the struct."
        chips={["Box<T>", "Option<T>", "recursive struct"]}
        visual={<LinkedListVisual />}
        exercise={{
          title: "Define the node struct",
          goal: "Compile a minimal singly linked list node in Rust.",
          code: `struct Node<T> {
    value: T,
    next: Option<Box<Node<T>>>,
}

fn main() {
    let list = Node {
        value: "Phnom Penh",
        next: Some(Box::new(Node {
            value: "Battambang",
            next: Some(Box::new(Node {
                value: "Siem Reap",
                next: None,
            })),
        })),
    };
    println!("head = {}", list.value);
}`,
          output: `head = Phnom Penh`,
          hint: "Without Box, Rust can't compute the size of Node — it would be infinitely nested.",
        }}
      />

      <SubTopic
        id="push-front"
        emoji="🎩"
        title="Push at head — the O(1) trick"
        caption="Take the current head, wrap it in a new node, make the new node the head. That's it."
        chips={["swap head", "Option::take", "O(1)"]}
        exercise={{
          title: "Prepend to a linked list",
          goal: "Add a new head to an existing list and print the new front.",
          code: `struct Node {
    value: String,
    next: Option<Box<Node>>,
}

fn push_front(head: Option<Box<Node>>, v: &str) -> Option<Box<Node>> {
    Some(Box::new(Node {
        value: v.to_string(),
        next: head,
    }))
}

fn main() {
    let mut head: Option<Box<Node>> = None;
    head = push_front(head, "Kampot");
    head = push_front(head, "Phnom Penh");
    if let Some(n) = head {
        println!("new head = {}", n.value);
    }
}`,
          output: `new head = Phnom Penh`,
          hint: "We MOVE the old head into the new node's `next`. No cloning, no copying — the Rust way.",
        }}
      />

      <SubTopic
        id="traverse"
        emoji="🚶"
        title="Traversal — walk the chain"
        caption="Follow next pointers until you hit None. O(n) — no random access."
        chips={["while let Some", "as_ref", ".value"]}
        exercise={{
          title: "Print every value",
          goal: "Walk from head to end and print each value.",
          code: `struct Node {
    value: &'static str,
    next: Option<Box<Node>>,
}

fn main() {
    let list = Node {
        value: "PP",
        next: Some(Box::new(Node {
            value: "Kandal",
            next: Some(Box::new(Node { value: "SR", next: None })),
        })),
    };

    let mut cursor: Option<&Node> = Some(&list);
    while let Some(node) = cursor {
        print!("{} → ", node.value);
        cursor = node.next.as_deref();
    }
    println!("None");
}`,
          output: `PP → Kandal → SR → None`,
          hint: "`.as_deref()` converts Option<Box<Node>> to Option<&Node> for read-only walking.",
        }}
      />

      <SubTopic
        id="when-lists"
        emoji="🤔"
        title="When to reach for a linked list"
        caption="Not often. Vec beats it for cache. Use LinkedList<T> for undo/redo, deques with node-level pinning, and 'insert here without invalidating other iterators'."
        chips={["prefer Vec by default", "std::collections::LinkedList", "teaching ownership"]}
      />

      <LessonPack lessonKey="dsa-linked" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Stacks & Queues
 * ────────────────────────────────────────────────────────────── */

function StacksAndQueues() {
  return (
    <Section chapterId="dsa-stacks">
      <ChapterHeader
        number="4"
        emoji="📚"
        title="Stacks & Queues"
        hook="Stacks and queues are two disciplines for adding and removing items. LIFO vs FIFO — pick the right one and half the algorithm writes itself."
      />

      <SubTopic
        id="stack-lifo"
        emoji="📚"
        title="Stack (LIFO) — a Vec is enough"
        caption="Push on the top, pop from the top. Rust's Vec gives you a stack for free."
        chips={["vec.push(x)", "vec.pop() → Option<T>", "O(1)"]}
        visual={<StackQueueVisual />}
        exercise={{
          title: "Reverse a string with a stack",
          goal: "Push each char, then pop to build the reverse.",
          code: `fn main() {
    let word = "Angkor";
    let mut stack: Vec<char> = word.chars().collect();
    let mut reversed = String::new();
    while let Some(c) = stack.pop() {
        reversed.push(c);
    }
    println!("{} → {}", word, reversed);
}`,
          output: `Angkor → roknA`,
          hint: "Chars go in front-first and come out back-first — the essence of LIFO.",
        }}
      />

      <SubTopic
        id="queue-fifo"
        emoji="🚶"
        title="Queue (FIFO) — use VecDeque"
        caption="push_back / pop_front — both O(1). Never use Vec's remove(0) for a queue: it's O(n)."
        chips={["VecDeque::new()", "push_back", "pop_front → Option<T>"]}
        exercise={{
          title: "Serve Angkor ticket queue",
          goal: "Enqueue five visitors, then serve them one by one.",
          code: `use std::collections::VecDeque;

fn main() {
    let mut queue: VecDeque<&str> = VecDeque::new();
    for name in ["Sok", "Sopheak", "Dara", "Chan", "Kanha"] {
        queue.push_back(name);
    }
    while let Some(visitor) = queue.pop_front() {
        println!("serving {}", visitor);
    }
}`,
          output: `serving Sok
serving Sopheak
serving Dara
serving Chan
serving Kanha`,
          hint: "First person in line is served first — FIFO in action.",
        }}
      />

      <SubTopic
        id="balanced-parens"
        emoji="⚖️"
        title="Balanced parentheses"
        caption="A classic: use a stack to check that every opener has a matching closer, in order."
        chips={["Vec as stack", "match closers to openers", "O(n)"]}
        exercise={{
          title: "Check ( [ { … } ] )",
          goal: "Return true iff the brackets are balanced.",
          code: `fn is_balanced(s: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '[' | '{' => stack.push(c),
            ')' => if stack.pop() != Some('(') { return false; },
            ']' => if stack.pop() != Some('[') { return false; },
            '}' => if stack.pop() != Some('{') { return false; },
            _   => {}
        }
    }
    stack.is_empty()
}

fn main() {
    println!("{}", is_balanced("(a+b)[c-d]{e}"));  // true
    println!("{}", is_balanced("(a+b]"));          // false
}`,
          output: `true
false`,
          hint: "Every opener is pushed. Every closer must match the top of the stack. Empty stack at end = balanced.",
        }}
      />

      <SubTopic
        id="priority-queue"
        emoji="🎯"
        title="Priority queue — BinaryHeap"
        caption="Sometimes you need 'the biggest / smallest / most urgent' first — that's a priority queue, not a plain FIFO."
        chips={["BinaryHeap<T>", "max-heap by default", "peek / pop / push"]}
        exercise={{
          title: "Handle three ambulance calls by priority",
          goal: "Higher number = more urgent; pop the most urgent first.",
          code: `use std::collections::BinaryHeap;

fn main() {
    let mut heap: BinaryHeap<(u32, &str)> = BinaryHeap::new();
    heap.push((3, "car accident"));
    heap.push((5, "cardiac arrest"));
    heap.push((2, "sprained ankle"));

    while let Some((priority, case)) = heap.pop() {
        println!("[urgency {}] {}", priority, case);
    }
}`,
          output: `[urgency 5] cardiac arrest
[urgency 3] car accident
[urgency 2] sprained ankle`,
          hint: "Rust's BinaryHeap is a max-heap; wrap values in Reverse(_) if you want a min-heap.",
        }}
      />

      <LessonPack lessonKey="dsa-stacks" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — Hash Maps & Sets
 * ────────────────────────────────────────────────────────────── */

function HashMaps() {
  return (
    <Section chapterId="dsa-hashmaps">
      <ChapterHeader
        number="5"
        emoji="🗺️"
        title="Hash Maps & Sets"
        hook="The workhorse for 'look up by key'. Learn HashMap, HashSet, and Rust's ergonomic Entry API."
      />

      <SubTopic
        id="hashmap-basics"
        emoji="🗺️"
        title="HashMap<K, V> basics"
        caption="Insert, get, remove — all O(1) average. Requires K to implement Hash + Eq."
        chips={["insert / get", "Hash + Eq", "amortised O(1)"]}
        visual={<HashMapVisual />}
        exercise={{
          title: "Lookup province yields",
          goal: "Store province → yield, then look one up.",
          code: `use std::collections::HashMap;

fn main() {
    let mut yields: HashMap<String, f64> = HashMap::new();
    yields.insert("Battambang".into(), 3.1);
    yields.insert("Kandal".into(), 2.7);
    yields.insert("Siem Reap".into(), 3.3);

    match yields.get("Kandal") {
        Some(y) => println!("Kandal yield = {}", y),
        None    => println!("Kandal not found"),
    }
}`,
          output: `Kandal yield = 2.7`,
          hint: ".get(key) returns Option<&V>. The lifetime is tied to the map — no cloning needed.",
        }}
      />

      <SubTopic
        id="entry-api"
        emoji="🔑"
        title="The Entry API — insert-or-update"
        caption="A single lookup handles the 'if present, update; else insert' pattern."
        chips={["entry(k).or_insert(v)", "entry(k).and_modify(|x| …)"]}
        exercise={{
          title: "Sum donations per donor",
          goal: "Handle repeat donors elegantly.",
          code: `use std::collections::HashMap;

fn main() {
    let events = [("Sok", 100), ("Kanha", 50), ("Sok", 75), ("Dara", 200), ("Kanha", 25)];
    let mut totals: HashMap<&str, u32> = HashMap::new();
    for (name, amount) in events {
        *totals.entry(name).or_insert(0) += amount;
    }
    let mut all: Vec<_> = totals.into_iter().collect();
    all.sort();
    for (name, total) in all {
        println!("{}: {}", name, total);
    }
}`,
          output: `Dara: 200
Kanha: 75
Sok: 175`,
          hint: "`.or_insert(0)` returns a &mut u32 — that's why we can `*` and += straight away.",
        }}
      />

      <SubTopic
        id="counting"
        emoji="🔢"
        title="Count occurrences"
        caption="A HashMap<T, u32> is the universal counter. Words, characters, provinces — anything hashable."
        chips={["word count", "frequency table", "O(n)"]}
        exercise={{
          title: "Count province appearances",
          goal: "Given a list of transactions with a province each, count how many per province.",
          code: `use std::collections::HashMap;

fn main() {
    let tx = ["PP", "PP", "SR", "PP", "BB", "SR", "PP"];
    let mut counts: HashMap<&str, u32> = HashMap::new();
    for p in tx {
        *counts.entry(p).or_insert(0) += 1;
    }
    let mut list: Vec<_> = counts.iter().collect();
    list.sort();
    for (p, c) in list {
        println!("{}: {}", p, c);
    }
}`,
          output: `BB: 1
PP: 4
SR: 2`,
          hint: "The map's own iteration order is random per run — sort before printing.",
        }}
      />

      <SubTopic
        id="hashset"
        emoji="🧺"
        title="HashSet — unique values only"
        caption="Perfect for de-duplication. Insert returns true if it was NEW."
        chips={["HashSet<T>", ".insert(x) → bool", "de-dup a Vec"]}
        exercise={{
          title: "Unique ABA account IDs",
          goal: "Deduplicate a Vec of account IDs.",
          code: `use std::collections::HashSet;

fn main() {
    let ids = vec![101, 202, 101, 303, 202, 404, 101];
    let unique: HashSet<u32> = ids.into_iter().collect();
    let mut list: Vec<_> = unique.into_iter().collect();
    list.sort();
    println!("{:?}", list);
}`,
          output: `[101, 202, 303, 404]`,
          hint: "Collecting a Vec of hashable items straight into a HashSet is the idiomatic dedup in Rust.",
        }}
      />

      <LessonPack lessonKey="dsa-hashmaps" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Trees & BSTs
 * ────────────────────────────────────────────────────────────── */

function Trees() {
  return (
    <Section chapterId="dsa-trees">
      <ChapterHeader
        number="6"
        emoji="🌳"
        title="Trees & Binary Search Trees"
        hook="From file systems to auto-complete, trees model hierarchy. A BST adds ordering so lookups become O(log n)."
      />

      <SubTopic
        id="tree-shape"
        emoji="🌲"
        title="Anatomy of a tree"
        caption="One root, no cycles, each non-root has exactly one parent."
        chips={["root", "leaf", "depth", "height"]}
        visual={<BSTVisual />}
      />

      <SubTopic
        id="bst"
        emoji="🔎"
        title="Binary Search Tree — build & search"
        caption="Insert keeps the invariant left < node < right. Search compares, then goes one side."
        chips={["Option<Box<Node>>", "insert", "search"]}
        exercise={{
          title: "A tiny BST",
          goal: "Insert 5 keys, then check membership.",
          code: `struct Node {
    value: i32,
    left:  Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn insert(root: &mut Option<Box<Node>>, v: i32) {
    match root {
        None => *root = Some(Box::new(Node { value: v, left: None, right: None })),
        Some(n) if v < n.value => insert(&mut n.left,  v),
        Some(n) if v > n.value => insert(&mut n.right, v),
        _ => {} // duplicate — skip
    }
}

fn contains(root: &Option<Box<Node>>, v: i32) -> bool {
    match root {
        None => false,
        Some(n) if v == n.value => true,
        Some(n) if v <  n.value => contains(&n.left,  v),
        Some(n)                 => contains(&n.right, v),
    }
}

fn main() {
    let mut root: Option<Box<Node>> = None;
    for v in [50, 25, 75, 10, 38] {
        insert(&mut root, v);
    }
    println!("has 38? {}", contains(&root, 38));
    println!("has 99? {}", contains(&root, 99));
}`,
          output: `has 38? true
has 99? false`,
          hint: "Every step halves the search space — that's why balanced BST search is O(log n).",
        }}
      />

      <SubTopic
        id="traversals"
        emoji="🔢"
        title="In-order traversal"
        caption="Left → node → right. On a BST, this yields the values in SORTED order."
        chips={["pre-order", "in-order", "post-order"]}
        exercise={{
          title: "Sorted output from a BST",
          goal: "Traverse a BST in-order and collect the values.",
          code: `struct Node { value: i32, left: Option<Box<Node>>, right: Option<Box<Node>> }

fn insert(root: &mut Option<Box<Node>>, v: i32) {
    match root {
        None => *root = Some(Box::new(Node { value: v, left: None, right: None })),
        Some(n) if v < n.value => insert(&mut n.left,  v),
        Some(n) if v > n.value => insert(&mut n.right, v),
        _ => {}
    }
}

fn in_order(root: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = root {
        in_order(&n.left, out);
        out.push(n.value);
        in_order(&n.right, out);
    }
}

fn main() {
    let mut root = None;
    for v in [50, 25, 75, 10, 38, 90] { insert(&mut root, v); }
    let mut sorted = Vec::new();
    in_order(&root, &mut sorted);
    println!("{:?}", sorted);
}`,
          output: `[10, 25, 38, 50, 75, 90]`,
          hint: "In-order = sort for free — provided the tree really is a BST.",
        }}
      />

      <SubTopic
        id="btreemap"
        emoji="🌳"
        title="Reach for BTreeMap in real code"
        caption="Writing your own BST is a great exercise. In production, use BTreeMap<K, V> — it's a balanced B-tree with O(log n) operations and sorted iteration."
        chips={["BTreeMap<K,V>", "sorted keys", "range queries"]}
        exercise={{
          title: "Range query on prices",
          goal: "Get all prices between 10,000 and 15,000 riel with BTreeMap::range.",
          code: `use std::collections::BTreeMap;

fn main() {
    let mut prices: BTreeMap<u32, &str> = BTreeMap::new();
    prices.insert(8_000,  "Kampot durian");
    prices.insert(11_000, "K.Cham durian");
    prices.insert(12_500, "PP durian");
    prices.insert(15_500, "SR durian");
    prices.insert(22_000, "Pursat durian");

    for (p, name) in prices.range(10_000..=15_000) {
        println!("{} riel — {}", p, name);
    }
}`,
          output: `11000 riel — K.Cham durian
12500 riel — PP durian`,
          hint: "Range queries only make sense on a sorted structure. A HashMap can't do this in log time.",
        }}
      />

      <LessonPack lessonKey="dsa-trees" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7 — Graphs
 * ────────────────────────────────────────────────────────────── */

function Graphs() {
  return (
    <Section chapterId="dsa-graphs">
      <ChapterHeader
        number="7"
        emoji="🕸️"
        title="Graphs — BFS & DFS"
        hook="Roads between Cambodian provinces, friendships on a social app, the web itself — all graphs. Learn to model them and search them."
      />

      <SubTopic
        id="graph-basics"
        emoji="🔵🔗"
        title="Vertices and edges"
        caption="A graph = set of vertices (nodes) + set of edges (connections). Directed or not, weighted or not."
        chips={["vertex", "edge", "directed", "weighted"]}
        visual={<GraphVisual />}
      />

      <SubTopic
        id="adjacency"
        emoji="📋"
        title="Adjacency list — Vec<Vec<usize>>"
        caption="For each vertex, list its neighbours. Compact for sparse graphs; iterating a vertex's neighbours is O(deg)."
        chips={["Vec<Vec<usize>>", "sparse", "O(V + E) memory"]}
        exercise={{
          title: "Build a province graph",
          goal: "Model 6 provinces as an adjacency list, then print each vertex's neighbours.",
          code: `fn main() {
    let names = ["PP", "Kandal", "K.Cham", "SR", "BB", "Kampot"];
    // Undirected edges between name indices.
    let edges: &[(usize, usize)] = &[
        (0, 1), (0, 5), (1, 2), (2, 3), (2, 4), (3, 4), (0, 2),
    ];
    let n = names.len();
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
        adj[b].push(a);
    }
    for (i, ns) in adj.iter().enumerate() {
        let list: Vec<&str> = ns.iter().map(|&j| names[j]).collect();
        println!("{} → {:?}", names[i], list);
    }
}`,
          output: `PP → ["Kandal", "Kampot", "K.Cham"]
Kandal → ["PP", "K.Cham"]
K.Cham → ["Kandal", "SR", "BB", "PP"]
SR → ["K.Cham", "BB"]
BB → ["K.Cham", "SR"]
Kampot → ["PP"]`,
          hint: "Store names once and use usize indices everywhere — small, fast, and Rust-friendly.",
        }}
      />

      <SubTopic
        id="bfs"
        emoji="🌊"
        title="BFS — shortest path in edges"
        caption="Explore level by level using a VecDeque. Perfect for 'fewest hops' problems on unweighted graphs."
        chips={["VecDeque<usize>", "visited set", "level order"]}
        exercise={{
          title: "Fewest hops from PP to BB",
          goal: "Count the minimum number of edges from Phnom Penh (0) to Battambang (4).",
          code: `use std::collections::VecDeque;

fn main() {
    let n = 6;
    let edges: &[(usize, usize)] = &[
        (0, 1), (0, 5), (1, 2), (2, 3), (2, 4), (3, 4), (0, 2),
    ];
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
        adj[b].push(a);
    }

    let start = 0;
    let goal = 4;
    let mut dist: Vec<Option<u32>> = vec![None; n];
    let mut q: VecDeque<usize> = VecDeque::new();
    dist[start] = Some(0);
    q.push_back(start);

    while let Some(u) = q.pop_front() {
        for &v in &adj[u] {
            if dist[v].is_none() {
                dist[v] = Some(dist[u].unwrap() + 1);
                q.push_back(v);
            }
        }
    }
    println!("shortest hops PP → BB = {}", dist[goal].unwrap());
}`,
          output: `shortest hops PP → BB = 2`,
          hint: "BFS with a queue gives shortest path in edges. For distances in km, use Dijkstra.",
        }}
      />

      <SubTopic
        id="dfs"
        emoji="🕳️"
        title="DFS — go deep, then back up"
        caption="Use recursion (the call stack is your stack). Great for connectivity, cycle detection, and topological sort."
        chips={["recursion", "visited set", "back-edge"]}
        exercise={{
          title: "Reach BB from PP?",
          goal: "Return true if there's ANY path — using DFS.",
          code: `fn dfs(u: usize, goal: usize, adj: &[Vec<usize>], seen: &mut [bool]) -> bool {
    if u == goal { return true; }
    seen[u] = true;
    for &v in &adj[u] {
        if !seen[v] && dfs(v, goal, adj, seen) {
            return true;
        }
    }
    false
}

fn main() {
    let n = 6;
    let edges: &[(usize, usize)] = &[
        (0, 1), (0, 5), (1, 2), (2, 3), (2, 4), (3, 4), (0, 2),
    ];
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
        adj[b].push(a);
    }
    let mut seen = vec![false; n];
    println!("PP → BB reachable? {}", dfs(0, 4, &adj, &mut seen));
}`,
          output: `PP → BB reachable? true`,
          hint: "DFS doesn't guarantee the shortest path — only that SOME path exists.",
        }}
      />

      <LessonPack lessonKey="dsa-graphs" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8 — Sorting & Searching
 * ────────────────────────────────────────────────────────────── */

function SortingAndSearching() {
  return (
    <Section chapterId="dsa-sorting">
      <ChapterHeader
        number="8"
        emoji="🎚️"
        title="Sorting & Searching"
        hook="Ninety-nine percent of the time, `slice.sort()` is the right answer. The remaining one percent is where DSA earns its stripes."
      />

      <SubTopic
        id="insertion-sort"
        emoji="🎴"
        title="Insertion sort — small n's best friend"
        caption="Build the sorted portion one item at a time. O(n²) worst case, but blazing fast for small or nearly-sorted arrays."
        chips={["O(n²) worst", "in-place", "stable"]}
        visual={<SortingVisual />}
        exercise={{
          title: "Write insertion sort by hand",
          goal: "Sort a small Vec<i32> using insertion sort.",
          code: `fn insertion_sort(v: &mut Vec<i32>) {
    for i in 1..v.len() {
        let mut j = i;
        while j > 0 && v[j - 1] > v[j] {
            v.swap(j - 1, j);
            j -= 1;
        }
    }
}

fn main() {
    let mut a = vec![64, 25, 12, 22, 11, 90, 45, 33, 78, 5];
    insertion_sort(&mut a);
    println!("{:?}", a);
}`,
          output: `[5, 11, 12, 22, 25, 33, 45, 64, 78, 90]`,
          hint: "Each pass 'inserts' one item into the already-sorted prefix. Great teaching sort.",
        }}
      />

      <SubTopic
        id="merge-quick"
        emoji="⚡"
        title="Merge sort & quick sort — the O(n log n) heavies"
        caption="Merge is stable and predictable. Quick is faster on average and in-place. Real stdlib sorts are hybrid variants."
        chips={["divide & conquer", "O(n log n) avg", "merge = stable, quick = fast"]}
        exercise={{
          title: "Merge two sorted Vecs",
          goal: "The merge step of merge sort — merge two sorted slices in O(n).",
          code: `fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut out = Vec::with_capacity(a.len() + b.len());
    let (mut i, mut j) = (0, 0);
    while i < a.len() && j < b.len() {
        if a[i] <= b[j] { out.push(a[i]); i += 1; }
        else            { out.push(b[j]); j += 1; }
    }
    out.extend_from_slice(&a[i..]);
    out.extend_from_slice(&b[j..]);
    out
}

fn main() {
    let a = vec![1, 4, 7, 9];
    let b = vec![2, 3, 8, 10, 11];
    println!("{:?}", merge(&a, &b));
}`,
          output: `[1, 2, 3, 4, 7, 8, 9, 10, 11]`,
          hint: "Merge sort recursively splits the array in half, sorts each half, then applies exactly this merge.",
        }}
      />

      <SubTopic
        id="rust-sort"
        emoji="🦀"
        title="sort() vs sort_unstable()"
        caption="Reach for the stdlib. sort() is stable (a Timsort variant); sort_unstable() is faster and uses less memory (introsort / pdqsort)."
        chips={["slice.sort()", "slice.sort_unstable()", "sort_by / sort_by_key"]}
        exercise={{
          title: "Sort provinces by rice yield",
          goal: "Sort a Vec of (name, yield) pairs by the yield descending.",
          code: `fn main() {
    let mut data = vec![
        ("Kandal",   2.7),
        ("BB",       3.1),
        ("K.Cham",   2.9),
        ("SR",       3.3),
        ("Kampot",   2.85),
    ];
    // Descending sort by yield
    data.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    for (name, y) in &data {
        println!("{:>7} {:.2} t/ha", name, y);
    }
}`,
          output: `     SR 3.30 t/ha
     BB 3.10 t/ha
 K.Cham 2.90 t/ha
 Kampot 2.85 t/ha
 Kandal 2.70 t/ha`,
          hint: "`.partial_cmp()` on f64 returns Option<Ordering> because NaN exists. Unwrap when you know there is no NaN.",
        }}
      />

      <SubTopic
        id="binary-search"
        emoji="🎯"
        title="Binary search — the log₂(n) miracle"
        caption="On a sorted Vec, find any value in about ⌈log₂ n⌉ steps. Ten million items = 24 comparisons."
        chips={["sorted required", "O(log n)", "slice.binary_search"]}
        visual={<BinarySearchVisual />}
        exercise={{
          title: "Find or almost-find",
          goal: "Use slice::binary_search to locate — or find the insertion point.",
          code: `fn main() {
    let sorted = vec![3, 8, 12, 17, 25, 31, 42, 56, 78, 91];
    match sorted.binary_search(&31) {
        Ok(i)  => println!("found at index {}", i),
        Err(i) => println!("not found — would insert at {}", i),
    }
    match sorted.binary_search(&40) {
        Ok(i)  => println!("found at index {}", i),
        Err(i) => println!("not found — would insert at {}", i),
    }
}`,
          output: `found at index 5
not found — would insert at 6`,
          hint: "The `Err(i)` case is genuinely useful: it tells you where to insert to keep the Vec sorted.",
        }}
      />

      <LessonPack lessonKey="dsa-sorting" />
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
        <Target className="h-4 w-4 text-indigo-300" />
        <span>IDIC · Data Structures & Algorithms in Rust · Cambodia-flavoured</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Link href="/lecture" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-accent/40 hover:text-accent-bright">
          IT Lecture
        </Link>
        <Link href="/statistics" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-emerald-400/40 hover:text-emerald-200">
          Statistics
        </Link>
        <Link href="/ml" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-fuchsia-400/40 hover:text-fuchsia-200">
          Machine Learning
        </Link>
        <Link href="/rust" className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] hover:border-orange-400/40 hover:text-orange-200">
          Rust
        </Link>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-neutral-500">
        <Binary className="h-3 w-3" /> Bit by bit — one algorithm at a time.
      </div>
    </footer>
  );
}
