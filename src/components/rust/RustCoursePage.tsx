"use client";

// The Rust course page. Mirrors the shape of the IT LecturePage:
// a chapter tree in the sidebar (with mobile drawer), a scrolling
// content column made of chapter sections. Each sub-topic pairs a
// real-life animated visual with a hands-on CodeExercise. Chapters
// end with the shared LessonPack (Key Terms + 20-question Quiz).

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Boxes,
  ChevronDown,
  Code,
  Cpu,
  FolderTree,
  Layers,
  MemoryStick,
  Menu,
  Package,
  PlayCircle,
  Rocket,
  Sparkles,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonPack } from "@/components/lecture/LessonPack";
import { LessonSessionProvider } from "@/components/lecture/LessonSession";
import { LaserPointer } from "@/components/lecture/LaserPointer";
import { ThemeToggle } from "@/components/lecture/ThemeToggle";
import { CodeExercise, type CodeExerciseProps } from "@/components/rust/CodeExercise";
import { ChallengeSet } from "@/components/rust/CodingChallenge";
import { AssignmentSet } from "@/components/rust/WeeklyAssignment";
import { RUST_CHALLENGES } from "@/lib/rust-challenges";
import { RUST_ASSIGNMENTS } from "@/lib/rust-assignments";
import {
  WhyRustVisual,
  WhereUsedVisual,
  LearningPathVisual,
  InstallVisual,
  CargoNewVisual,
  CargoRunVisual,
  CompilerTeacherVisual,
} from "@/components/rust/RustWelcomeVisuals";
import {
  VariableBoxVisual,
  ImmutableVsMutVisual,
  MutabilityInLifeVisual,
  ShoppingCartVisual,
  TrafficLightVisual,
  TypesVisual,
  IfElseVisual,
  LoopVisual,
  MatchVisual,
  GradeMatchVisual,
  RockPaperScissorsVisual,
  WeatherMatchVisual,
} from "@/components/rust/RustBasicsVisuals";
import {
  StackVsHeapVisual,
  AddressesVisual,
  CPointerBugsVisual,
  SmartPointersVisual,
  RustVsCVisual,
} from "@/components/rust/RustMemoryVisuals";
import {
  OwnershipRuleVisual,
  MoveVisual,
  CopyVisual,
  BorrowVisual,
  MutBorrowVisual,
  ScopeDropVisual,
} from "@/components/rust/RustOwnershipVisuals";
import {
  StructVisual,
  EnumVisual,
  OptionVisual,
  ResultVisual,
  MethodVisual,
} from "@/components/rust/RustDataVisuals";
import {
  VecVisual,
  StringVisual,
  HashMapVisual,
  IteratorVisual,
} from "@/components/rust/RustCollectionsVisuals";
import {
  TraitVisual,
  GenericVisual,
  ModuleVisual,
  CratesIoVisual,
} from "@/components/rust/RustTraitsVisuals";
import {
  CliTodoVisual,
  FileIOVisual,
  TestingVisual,
  WhereNextVisual,
} from "@/components/rust/RustProjectVisuals";

/* ─────────────────────────────────────────────────────────────────
 * Outline — drives the sidebar tree and section anchor ids.
 * ────────────────────────────────────────────────────────────── */

// Discrete text-size presets for the sidebar font-size dropdown.
const FONT_SCALE_OPTIONS = [1, 1.5, 2, 3] as const;

type Sub = {
  id: string;
  label: string;
  kind?: "topic" | "assignment" | "challenges" | "terms" | "quiz";
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
    { id: `${chapterId}-assignment`, label: "Weekly Assignment", kind: "assignment" },
    { id: `${chapterId}-challenges`, label: "Coding Challenges", kind: "challenges" },
    { id: `${chapterId}-terms`, label: "Key Terms", kind: "terms" },
    { id: `${chapterId}-quiz`, label: "Quiz", kind: "quiz" },
  ];
}

const OUTLINE: Chapter[] = [
  {
    id: "rust-welcome",
    lessonKey: "rust-welcome",
    number: "1",
    label: "Welcome to Rust",
    icon: Sparkles,
    subs: withPack("rust-welcome", [
      { id: "why-rust", label: "Why Rust?" },
      { id: "where-rust", label: "Where it's used" },
      { id: "your-path", label: "Your journey" },
    ]),
  },
  {
    id: "rust-first-program",
    lessonKey: "rust-first-program",
    number: "2",
    label: "Your First Program",
    icon: Terminal,
    subs: withPack("rust-first-program", [
      { id: "install", label: "Install Rust" },
      { id: "cargo-new", label: "Cargo new" },
      { id: "cargo-run", label: "Cargo run" },
      { id: "compiler-teacher", label: "The compiler helps" },
    ]),
  },
  {
    id: "rust-values",
    lessonKey: "rust-values",
    number: "3",
    label: "Values & Flow",
    icon: Code,
    subs: withPack("rust-values", [
      { id: "variables", label: "Variables" },
      { id: "mutability", label: "Mutability" },
      { id: "mutability-in-life", label: "Mutability in daily life" },
      { id: "mutability-shopping-cart", label: "Shopping cart total" },
      { id: "mutability-traffic-light", label: "Traffic light state" },
      { id: "types", label: "Types" },
      { id: "if-else", label: "if / else" },
      { id: "loops", label: "Loops" },
      { id: "match", label: "match" },
      { id: "match-grade", label: "Grading test scores" },
      { id: "match-rps", label: "Rock-paper-scissors" },
      { id: "match-weather", label: "Weather → outfit" },
    ]),
  },
  {
    id: "rust-memory",
    lessonKey: "rust-memory",
    number: "4",
    label: "Memory & Pointers",
    icon: MemoryStick,
    subs: withPack("rust-memory", [
      { id: "stack-vs-heap", label: "Stack vs Heap" },
      { id: "addresses", label: "Memory addresses" },
      { id: "c-pointer-bugs", label: "C pointer bugs" },
      { id: "smart-pointers", label: "Smart pointers" },
      { id: "rust-vs-c", label: "What Rust solves" },
    ]),
  },
  {
    id: "rust-ownership",
    lessonKey: "rust-ownership",
    number: "5",
    label: "Ownership ⭐",
    icon: Cpu,
    subs: withPack("rust-ownership", [
      { id: "ownership-rule", label: "The rule" },
      { id: "move", label: "Move" },
      { id: "copy", label: "Copy" },
      { id: "borrow", label: "Borrow" },
      { id: "mut-borrow", label: "Mutable borrow" },
      { id: "scope-drop", label: "Scope & Drop" },
    ]),
  },
  {
    id: "rust-data",
    lessonKey: "rust-data",
    number: "6",
    label: "Shaping Data",
    icon: FolderTree,
    subs: withPack("rust-data", [
      { id: "struct", label: "struct" },
      { id: "enum", label: "enum" },
      { id: "option", label: "Option" },
      { id: "result", label: "Result" },
      { id: "methods", label: "Methods" },
    ]),
  },
  {
    id: "rust-collections",
    lessonKey: "rust-collections",
    number: "7",
    label: "Collections",
    icon: Boxes,
    subs: withPack("rust-collections", [
      { id: "vec", label: "Vec" },
      { id: "strings", label: "String" },
      { id: "hashmap", label: "HashMap" },
      { id: "iterators", label: "Iterators" },
    ]),
  },
  {
    id: "rust-traits",
    lessonKey: "rust-traits",
    number: "8",
    label: "Traits & Modules",
    icon: Layers,
    subs: withPack("rust-traits", [
      { id: "traits", label: "Traits" },
      { id: "generics", label: "Generics" },
      { id: "modules", label: "Modules" },
      { id: "crates-io", label: "Crates.io" },
    ]),
  },
  {
    id: "rust-project",
    lessonKey: "rust-project",
    number: "9",
    label: "Build Real",
    icon: Rocket,
    subs: withPack("rust-project", [
      { id: "cli-todo", label: "Todo CLI" },
      { id: "file-io", label: "Save & Load" },
      { id: "testing", label: "Testing" },
      { id: "where-next", label: "Where next" },
    ]),
  },
];

const ALL_ANCHORS: string[] = OUTLINE.flatMap((c) => [c.id, ...c.subs.map((s) => s.id)]);

/* ─────────────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────────── */

export function RustCoursePage() {
  const [activeId, setActiveId] = useState<string>("rust-welcome");
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
        {/* Ambient warm-Rust wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 700px at 15% 10%, rgba(251, 146, 60, 0.10), transparent 60%)," +
              "radial-gradient(900px 600px at 85% 60%, rgba(77, 141, 255, 0.10), transparent 60%)," +
              "radial-gradient(700px 500px at 50% 100%, rgba(217, 119, 6, 0.06), transparent 60%)",
          }}
        />

        {/* Scroll progress bar sits just below the session clock bar */}
        <div aria-hidden="true" className="fixed inset-x-0 top-[46px] z-[60] h-[2px] bg-white/5">
          <div
            className="h-full origin-left bg-gradient-to-r from-orange-300 via-amber-400 to-orange-300 transition-[width] duration-150"
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
            <FirstProgram />
            <Values />
            <Memory />
            <Ownership />
            <Data />
            <Collections />
            <Traits />
            <Project />
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
        className="flex-1 cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11.5px] font-medium text-neutral-200 outline-none transition-colors hover:border-orange-400/40 hover:text-orange-200 focus:border-orange-400/50"
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
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-400/30 bg-orange-400/10 text-2xl">
        🦀
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold text-white">Rust Course</span>
        <span className="truncate text-[11px] text-neutral-400">Fast &amp; safe programming</span>
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
                    ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 group-hover:text-orange-300"
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
                  isChapterActive && "text-orange-300"
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
                  const isTool =
                    sub.kind === "terms" ||
                    sub.kind === "quiz" ||
                    sub.kind === "challenges" ||
                    sub.kind === "assignment";
                  const prevKind = chapter.subs[i - 1]?.kind;
                  const prevIsTool =
                    prevKind === "terms" ||
                    prevKind === "quiz" ||
                    prevKind === "challenges" ||
                    prevKind === "assignment";
                  const isFirstTool = isTool && !prevIsTool;
                  const emoji =
                    sub.kind === "terms"
                      ? "📖"
                      : sub.kind === "quiz"
                        ? "📝"
                        : sub.kind === "challenges"
                          ? "🧩"
                          : sub.kind === "assignment"
                            ? "🎯"
                            : null;
                  const activeToolClass =
                    sub.kind === "quiz"
                      ? "bg-amber-400/10 text-amber-200"
                      : sub.kind === "challenges"
                        ? "bg-amber-400/10 text-amber-200"
                        : sub.kind === "assignment"
                          ? "bg-violet-400/10 text-violet-200"
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
                              : "text-orange-300"
                            : isTool
                              ? "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                              : "text-neutral-500 hover:text-white"
                        )}
                      >
                        {isSubActive && !isTool && (
                          <span className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-orange-300" />
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
          className="ml-1.5 mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200"
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
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200"
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
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">IT Lecture</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="text-[11px] text-neutral-500">IDIC · Rust Programming</div>
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
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/30 bg-orange-400/10 text-lg">
          🦀
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-white">Rust Course</span>
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
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-widest text-orange-300">
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
  visual: React.ReactNode;
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
 * 1 — Welcome
 * ────────────────────────────────────────────────────────────── */

function Welcome() {
  const promises = [
    { emoji: "⚡", label: "As fast as C++" },
    { emoji: "🛡️", label: "Safer than C/C++" },
    { emoji: "🎯", label: "No null, no data races" },
    { emoji: "🌍", label: "Used everywhere" },
  ];
  return (
    <Section chapterId="rust-welcome">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-orange-400/[0.08] to-white/[0.02] p-8 backdrop-blur-md sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-orange-300">
          <Sparkles className="h-3.5 w-3.5" />
          IDIC — Rust Programming
        </div>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Learn Rust <br className="hidden sm:block" />
          <span className="hero-gradient">from zero to real.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-300">
          Eight chapters. Real-life pictures. Try-it-yourself code. By the end,
          you&rsquo;ll write real Rust programs and understand <em>why</em> Rust
          made the choices it did.
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
              <div className="mt-2 text-[13px] font-semibold text-white">
                {o.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#rust-first-program"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-orange-400/50 hover:bg-white/10"
          >
            Start the course
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="https://play.rust-lang.org/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 px-5 py-2.5 text-[13.5px] font-medium text-orange-200 transition-all hover:scale-[1.02] hover:bg-orange-400/20"
          >
            <PlayCircle className="h-4 w-4" />
            Open Playground
          </a>
        </div>
      </motion.div>

      <SubTopic
        id="why-rust"
        emoji="⚡"
        title="Why Rust?"
        caption="A language that gives you speed AND safety — no need to choose."
        chips={["fast", "safe", "no garbage collector"]}
        visual={<WhyRustVisual />}
      />

      <SubTopic
        id="where-rust"
        emoji="🌍"
        title="Where Rust is used"
        caption="Firefox, Linux, Discord, Dropbox, Cloudflare — Rust is quietly running huge parts of the internet."
        chips={["Firefox", "Linux kernel", "Discord", "AWS", "Cloudflare"]}
        visual={<WhereUsedVisual />}
      />

      <SubTopic
        id="your-path"
        emoji="🗺️"
        title="Your learning path"
        caption="Eight friendly chapters. Read left to right — one lesson at a time."
        chips={["8 chapters", "~4 hours total", "quizzes + exercises"]}
        visual={<LearningPathVisual />}
      />

      <AssignmentSet
        chapterId="rust-welcome"
        chapterNumber="1"
        chapterTitle="Welcome to Rust"
        assignment={RUST_ASSIGNMENTS["rust-welcome"]}
      />
      <ChallengeSet chapterId="rust-welcome" challenges={RUST_CHALLENGES["rust-welcome"]} />
      <LessonPack lessonKey="rust-welcome" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — First Program
 * ────────────────────────────────────────────────────────────── */

function FirstProgram() {
  return (
    <Section chapterId="rust-first-program">
      <ChapterHeader
        number="2"
        emoji="🚀"
        title="Your First Program"
        hook="Install Rust, create a project, and print your first line — all in about three minutes."
      />

      <SubTopic
        id="install"
        emoji="🧰"
        title="Install Rust with rustup"
        caption="One command in the terminal. Rustup gets you everything you need."
        chips={["rustup", "one command", "free"]}
        visual={<InstallVisual />}
        exercise={{
          title: "Check your Rust version",
          goal: "After installing, run this command in your terminal to confirm Rust is working.",
          code: `# In your terminal:
rustc --version
cargo --version`,
          output: `rustc 1.82.0 (2024-10-15)
cargo 1.82.0 (2024-10-15)`,
          hint: "If the command isn't found, close and reopen your terminal — the PATH needs to reload after install.",
        }}
      />

      <SubTopic
        id="cargo-new"
        emoji="🌱"
        title="Create a project"
        caption="`cargo new` gives you a working project in one command — folders, files, and a working hello world."
        chips={["cargo new", "src/main.rs", "Cargo.toml"]}
        visual={<CargoNewVisual />}
        exercise={{
          title: "Create your first project",
          goal: "Make a new project called `hello` and look at what Cargo created for you.",
          code: `cargo new hello
cd hello
ls`,
          output: `Cargo.toml
src`,
          hint: "The `src` folder is where your Rust code lives. Cargo.toml is the recipe card for your project.",
        }}
      />

      <SubTopic
        id="cargo-run"
        emoji="▶️"
        title="Run your program"
        caption="`cargo run` compiles AND runs, all in one step. Watch it print `Hello, world!`."
        chips={["cargo run", "auto-compile", "output on screen"]}
        visual={<CargoRunVisual />}
        exercise={{
          title: "Say hello to Rust",
          goal: "Copy this into `src/main.rs`, then run `cargo run` in the project folder.",
          code: `fn main() {
    println!("Hello, Rust!");
    println!("I'm learning at IDIC.");
}`,
          output: `Hello, Rust!
I'm learning at IDIC.`,
          predict: [
            { label: "Only prints \"Hello, Rust!\"" },
            { label: "Prints both lines" , correct: true },
            { label: "Compile error" },
            { label: "Prints \"main\"" },
          ],
          hint: "`println!` prints ONE line each time it's called. Two calls → two lines of output.",
        }}
      />

      <SubTopic
        id="compiler-teacher"
        emoji="🤖"
        title="The compiler is your teacher"
        caption="Rust errors are famous for being helpful. Read them slowly — they almost always tell you the fix."
        chips={["read the error", "check the ^^^ arrows", "try the suggestion"]}
        visual={<CompilerTeacherVisual />}
        exercise={{
          title: "Trigger a helpful error",
          goal: "Try to change an immutable variable. Rust will tell you exactly what to do.",
          code: `fn main() {
    let x = 5;
    x = 6;               // ← Rust will complain
    println!("x = {x}");
}`,
          output: `error[E0384]: cannot assign twice to immutable variable \`x\`
help: consider making this binding mutable: \`let mut x = 5\``,
          hint: "Change `let x = 5;` to `let mut x = 5;` and the error goes away.",
        }}
      />

      <AssignmentSet
        chapterId="rust-first-program"
        chapterNumber="2"
        chapterTitle="Your First Program"
        assignment={RUST_ASSIGNMENTS["rust-first-program"]}
      />
      <ChallengeSet chapterId="rust-first-program" challenges={RUST_CHALLENGES["rust-first-program"]} />
      <LessonPack lessonKey="rust-first-program" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — Values & Flow
 * ────────────────────────────────────────────────────────────── */

function Values() {
  return (
    <Section chapterId="rust-values">
      <ChapterHeader
        number="3"
        emoji="🧮"
        title="Values & Flow"
        hook="Variables hold values. `if`, `for`, `match` decide what to do with them. This chapter unlocks basic Rust."
      />

      <SubTopic
        id="variables"
        emoji="🏷️"
        title="Variables"
        caption="`let` creates a labelled box that holds a value."
        chips={["let name", "one value", "clear name"]}
        visual={<VariableBoxVisual />}
        exercise={{
          title: "Store a value with `let`",
          goal: "Save your age in a variable and print it.",
          code: `fn main() {
    let age = 24;
    let name = "Kanel";
    println!("{name} is {age} years old.");
}`,
          output: `Kanel is 24 years old.`,
          hint: "Rust uses `{name}` inside strings to slot in variable values — the modern format.",
        }}
      />

      <SubTopic
        id="mutability"
        emoji="🔐"
        title="Immutable by default"
        caption="Variables cannot change unless you write `mut`. This is the opposite of most languages — and it prevents bugs."
        chips={["let → stone tablet", "let mut → whiteboard", "safer default"]}
        visual={<ImmutableVsMutVisual />}
        exercise={{
          title: "Change a value",
          goal: "Count down from 3 by changing a mutable variable.",
          code: `fn main() {
    let mut count = 3;
    println!("Start: {count}");
    count = count - 1;
    println!("Now: {count}");
    count = 0;
    println!("Final: {count}");
}`,
          output: `Start: 3
Now: 2
Final: 0`,
          predict: [
            { label: "Compile error — you can't reassign" },
            { label: "Prints 3, 2, 0", correct: true },
            { label: "Prints 3, 3, 3" },
            { label: "Panics at runtime" },
          ],
          hint: "The `mut` keyword unlocks reassignment. Without it, line 4 would be a compile error.",
        }}
      />

      <SubTopic
        id="mutability-in-life"
        emoji="🌏"
        title="Mutability in daily life"
        caption="Some things about you are set once and never change; others change all the time. Rust asks you to declare which is which — and that clarity kills a whole class of bugs."
        chips={["birthday · fixed", "age · changes yearly", "ID number · fixed", "bank balance · changes"]}
        visual={<MutabilityInLifeVisual />}
        exercise={{
          title: "Birthday vs age",
          goal: "Your birthday is set once at birth. Your age changes every year. Model both — then try to reassign the birthday and watch Rust stop you.",
          code: `fn main() {
    let birthday = "January 5";        // set forever - no \`mut\` needed
    let mut age = 24;                  // changes every year

    println!("Born on {birthday}. Currently {age} years old.");

    age += 1;                          // happy birthday!
    println!("One year later: {age}.");

    // birthday = "March 2";            // <- try uncommenting this line
}`,
          output: `Born on January 5. Currently 24 years old.
One year later: 25.`,
          predict: [
            { label: "Compiles; reassigning birthday would be a compile error", correct: true },
            { label: "Everything works, including reassigning birthday" },
            { label: "Compile error because \`mut\` is missing from birthday" },
            { label: "Panics at runtime when age changes" },
          ],
          hint: "Uncomment the last line — Rust says `cannot assign twice to immutable variable`. You could add `mut` to make it work, but ask yourself: should a birthday really change? Rust makes you answer that question.",
        }}
      />

      <SubTopic
        id="mutability-shopping-cart"
        emoji="🛒"
        title="A running total: the shopping cart"
        caption="A grocery list grows as you shop. The receipt total climbs with every scan. Anything that accumulates is a textbook case for `let mut`."
        chips={["totals · mutable", "counters · mutable", "prices per item · immutable"]}
        visual={<ShoppingCartVisual />}
        exercise={{
          title: "Sum a cart of groceries",
          goal: "Add three items to a running total. The per-item prices don't change (immutable). The total does (mutable).",
          code: `fn main() {
    let rice_price: f64 = 2.50;        // price of one bag — fixed
    let egg_price: f64 = 3.20;
    let milk_price: f64 = 1.80;

    let mut cart_total: f64 = 0.0;     // starts empty, grows as we scan

    cart_total += rice_price;
    println!("After rice:  \${cart_total:.2}");

    cart_total += egg_price;
    println!("After eggs:  \${cart_total:.2}");

    cart_total += milk_price;
    println!("Final total: \${cart_total:.2}");
}`,
          output: `After rice:  $2.50
After eggs:  $5.70
Final total: $7.50`,
          hint: "`+=` is short for `cart_total = cart_total + x`. It only works when the variable is declared `mut`. Prices themselves stay `let` — nobody rewrites a price tag mid-checkout.",
        }}
      />

      <SubTopic
        id="mutability-traffic-light"
        emoji="🚦"
        title="State that changes over time: a traffic light"
        caption="A traffic light cycles Red → Green → Yellow → Red, all day long. The colours themselves are fixed names; which one is showing right now is not."
        chips={["current state · mutable", "colour names · immutable", "one cycle at a time"]}
        visual={<TrafficLightVisual />}
        exercise={{
          title: "Cycle through the light",
          goal: "Model one full cycle of a traffic light. `current` is a `&str` that changes; the sequence of colour names is fixed.",
          code: `fn main() {
    let mut current: &str = "Red";
    println!("Light is: {current}");

    current = "Green";
    println!("Light is: {current}");

    current = "Yellow";
    println!("Light is: {current}");

    current = "Red";
    println!("Back to: {current}");
}`,
          output: `Light is: Red
Light is: Green
Light is: Yellow
Back to: Red`,
          predict: [
            { label: "Prints all four lines in order", correct: true },
            { label: "Compile error — you can't reassign a &str" },
            { label: "Only prints the first line" },
            { label: "Prints \"Red\" four times" },
          ],
          hint: "`mut` lets you rebind the same variable to a new value of the SAME type. `current` stays a `&str` throughout — you can't switch it to a number mid-way.",
        }}
      />

      <SubTopic
        id="types"
        emoji="🎨"
        title="Types"
        caption="Numbers, decimals, true/false, and text. Rust asks the compiler to check every one."
        chips={["i32 · f64", "bool · char", "&str · String"]}
        visual={<TypesVisual />}
        exercise={{
          title: "Meet the basic types",
          goal: "Declare one of each type and print them all.",
          code: `fn main() {
    let age: i32 = 24;
    let pi: f64 = 3.14;
    let is_student: bool = true;
    let grade: char = 'A';
    let name: &str = "Kanel";

    println!("{name}, {age}, {pi}, {is_student}, {grade}");
}`,
          output: `Kanel, 24, 3.14, true, A`,
          hint: "Type annotations after `:` are usually optional — Rust can guess. But writing them makes learning clearer.",
        }}
      />

      <SubTopic
        id="if-else"
        emoji="🔀"
        title="if / else"
        caption="Pick one path or the other. In Rust, `if` is an expression — it returns a value."
        chips={["no parens needed", "returns a value", "must be same type"]}
        visual={<IfElseVisual />}
        exercise={{
          title: "Assign based on a condition",
          goal: "Print whether a number is even or odd using an `if` expression.",
          code: `fn main() {
    let n = 7;
    let kind = if n % 2 == 0 { "even" } else { "odd" };
    println!("{n} is {kind}");
}`,
          output: `7 is odd`,
          predict: [
            { label: "7 is even" },
            { label: "7 is odd", correct: true },
            { label: "Compile error" },
            { label: "Prints nothing" },
          ],
          hint: "`n % 2` gives the remainder when dividing by 2. For 7, that's 1, not 0 — so `odd` wins.",
        }}
      />

      <SubTopic
        id="loops"
        emoji="🔁"
        title="Loops"
        caption="Repeat with `loop`, `while`, or `for`. `for … in` is the friendliest."
        chips={["loop { }", "while cond { }", "for x in range { }"]}
        visual={<LoopVisual />}
        exercise={{
          title: "Sum 1 to 10",
          goal: "Add every number from 1 to 10 using a `for` loop.",
          code: `fn main() {
    let mut total = 0;
    for i in 1..=10 {
        total = total + i;
    }
    println!("Sum: {total}");
}`,
          output: `Sum: 55`,
          predict: [
            { label: "45" },
            { label: "55", correct: true },
            { label: "66" },
            { label: "100" },
          ],
          hint: "The range `1..=10` is INCLUSIVE — it goes 1, 2, 3, ..., 10. `1..10` would stop at 9.",
        }}
      />

      <SubTopic
        id="match"
        emoji="🎯"
        title="match"
        caption="A super-powered `if`. You give Rust every possible input, and it hands each one to its own branch."
        chips={["exhaustive", "returns a value", "one arm per case"]}
        visual={<MatchVisual />}
        exercise={{
          title: "Traffic light",
          goal: "Given a colour, print what a driver should do.",
          code: `fn main() {
    let light = "yellow";
    let action = match light {
        "red" => "stop",
        "yellow" => "slow down",
        "green" => "go",
        _ => "unknown light",
    };
    println!("On {light}: {action}");
}`,
          output: `On yellow: slow down`,
          hint: "The `_` at the end catches anything not listed above. Rust requires match to be exhaustive.",
        }}
      />

      <SubTopic
        id="match-grade"
        emoji="📊"
        title="Grade a test score"
        caption="A teacher doesn't check every single score by hand — she groups them into bands. `match` does the same with number ranges: 90 to 100 is an A, 80 to 89 is a B, and so on."
        chips={["number ranges", "0..=59 → F", "one line per band"]}
        visual={<GradeMatchVisual />}
        exercise={{
          title: "Score → letter grade",
          goal: "Turn a raw score into a letter grade using range patterns. Try changing `score` to see the answer change.",
          code: `fn main() {
    let score = 87;
    let grade = match score {
        90..=100 => "A",
        80..=89  => "B",
        70..=79  => "C",
        60..=69  => "D",
        0..=59   => "F",
        _        => "invalid score",
    };
    println!("Score {score} -> grade {grade}");
}`,
          output: `Score 87 -> grade B`,
          predict: [
            { label: "Score 87 -> grade B", correct: true },
            { label: "Score 87 -> grade A" },
            { label: "Compile error — you can't match numbers" },
            { label: "Score 87 -> grade invalid score" },
          ],
          hint: "`90..=100` is an INCLUSIVE range — both 90 and 100 are covered. The `_` at the bottom catches negative numbers or anything above 100. Without it, `match` wouldn't be exhaustive.",
        }}
      />

      <SubTopic
        id="match-rps"
        emoji="🎮"
        title="Rock-paper-scissors"
        caption="Two moves come in at the same time. `match` can look at a TUPLE `(you, friend)` and decide the outcome for every pairing. The `|` operator lists several patterns that share one branch."
        chips={["tuple patterns", "| = or", "9 outcomes in 4 lines"]}
        visual={<RockPaperScissorsVisual />}
        exercise={{
          title: "Who wins?",
          goal: "Match on the pair (you, friend). Group the three winning combinations on one line with `|`, the three losing ones on another.",
          code: `fn main() {
    let you = "rock";
    let friend = "scissors";

    let result = match (you, friend) {
        ("rock", "scissors")
        | ("paper", "rock")
        | ("scissors", "paper") => "You win!",

        ("scissors", "rock")
        | ("rock", "paper")
        | ("paper", "scissors") => "Friend wins!",

        ("rock", "rock")
        | ("paper", "paper")
        | ("scissors", "scissors") => "Draw!",

        _ => "Someone typed nonsense",
    };

    println!("You: {you}, Friend: {friend} -> {result}");
}`,
          output: `You: rock, Friend: scissors -> You win!`,
          predict: [
            { label: "You: rock, Friend: scissors -> You win!", correct: true },
            { label: "Friend wins!" },
            { label: "Draw!" },
            { label: "Compile error — tuples can't be matched" },
          ],
          hint: "Try swapping `you = \"paper\"` and see the answer flip. Every pair of strings maps to exactly one branch — that's what makes `match` safer than a chain of `if/else if`.",
        }}
      />

      <SubTopic
        id="match-weather"
        emoji="🌤️"
        title="Weather → what to wear"
        caption="Some inputs are known (sunny, rainy, snowy, cloudy). Others are anything the forecaster might invent tomorrow. The `_` arm is your safety net for the unknown."
        chips={["string patterns", "_ = catch-all", "always exhaustive"]}
        visual={<WeatherMatchVisual />}
        exercise={{
          title: "Get dressed for the weather",
          goal: "Suggest an outfit based on the forecast. If the forecast is a word we don't know, fall back to a sensible default.",
          code: `fn main() {
    let weather = "rainy";

    let outfit = match weather {
        "sunny"  => "sunglasses and a t-shirt",
        "rainy"  => "raincoat and boots",
        "snowy"  => "scarf and gloves",
        "cloudy" => "just a hoodie",
        _        => "check the sky yourself",
    };

    println!("It's {weather}. Bring: {outfit}.");
}`,
          output: `It's rainy. Bring: raincoat and boots.`,
          hint: "The `_` arm is REQUIRED for &str matches — there are infinitely many possible strings, so Rust needs a default. Delete the `_` line and the compiler will refuse to build.",
        }}
      />

      <AssignmentSet
        chapterId="rust-values"
        chapterNumber="3"
        chapterTitle="Values & Flow"
        assignment={RUST_ASSIGNMENTS["rust-values"]}
      />
      <ChallengeSet chapterId="rust-values" challenges={RUST_CHALLENGES["rust-values"]} />
      <LessonPack lessonKey="rust-values" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Memory & Pointers (prelude to Ownership)
 * ────────────────────────────────────────────────────────────── */

function Memory() {
  return (
    <Section chapterId="rust-memory">
      <ChapterHeader
        number="4"
        emoji="🧠"
        title="Memory & Pointers"
        hook="Before we can understand ownership, we need to understand what it&rsquo;s protecting. This chapter is how computers actually store data — and why C programs crash so often."
      />

      <SubTopic
        id="stack-vs-heap"
        emoji="📚"
        title="Stack vs Heap"
        caption="Two very different places where your program keeps data. Fast and orderly, or flexible but slower."
        chips={["stack · LIFO, fast", "heap · dynamic, flexible", "you rarely have to choose manually"]}
        visual={<StackVsHeapVisual />}
        exercise={{
          title: "See where things live",
          goal: "Numbers live on the stack. Strings live on the heap. Print their sizes.",
          code: `fn main() {
    let n: i32 = 42;                     // on the stack
    let s: String = String::from("hi");  // heap-allocated data

    println!("stack size of n: {} bytes", std::mem::size_of_val(&n));
    println!("stack size of s: {} bytes", std::mem::size_of_val(&s));
    println!("bytes of text on the heap: {}", s.len());
}`,
          output: `stack size of n: 4 bytes
stack size of s: 24 bytes    (a String is a 3-word pointer struct)
bytes of text on the heap: 2`,
          hint: "A String on the stack is just 3 fields: pointer, length, capacity. The characters live on the heap. `len()` counts the used bytes; `capacity()` is how much room was reserved.",
        }}
      />

      <SubTopic
        id="addresses"
        emoji="🏷️"
        title="Memory addresses"
        caption="Every value in RAM has a numeric address, like a house number. A pointer is just a variable that holds one."
        chips={["hex like 0x7ffe...", "&value gives its address", "{:p} prints it"]}
        visual={<AddressesVisual />}
        exercise={{
          title: "Print an address",
          goal: "Use `{:p}` to print a variable&rsquo;s memory address. Run it several times — the address changes each run (that&rsquo;s the OS at work).",
          code: `fn main() {
    let x: i32 = 42;
    let y: i32 = 99;

    println!("x = {} at {:p}", x, &x);
    println!("y = {} at {:p}", y, &y);
}`,
          output: `x = 42 at 0x7ffee4a3c2fc
y = 99 at 0x7ffee4a3c300     (yours will differ)`,
          hint: "Look at the two addresses — they&rsquo;re 4 bytes apart. That&rsquo;s because an i32 is 4 bytes wide.",
        }}
      />

      <SubTopic
        id="c-pointer-bugs"
        emoji="💀"
        title="Why C pointers are dangerous"
        caption="Three classic crashes every C programmer has shipped to production at least once."
        chips={["dangling pointers", "null dereference", "double free"]}
        visual={<CPointerBugsVisual />}
        exercise={{
          title: "The C bug Rust refuses to compile",
          goal: "Look at this C code, then look at what Rust says when you try the same idea. Rust catches the bug at COMPILE time — not at 3 AM in production.",
          code: `// This is C — do NOT put it in main.rs, it&rsquo;s just for reading.
//
// int* make_pointer() {
//     int local = 42;
//     return &local;   // 💀 returning address of a stack variable
// }                     //   that&rsquo;s about to disappear!
//
// int main() {
//     int *p = make_pointer();
//     printf("%d", *p);   // 💥 undefined behavior — could print anything
// }

// The Rust equivalent:
fn make_reference() -> &'static i32 {
    let local = 42;
    &local              // ← Rust refuses to compile this line
}

fn main() {
    let p = make_reference();
    println!("{p}");
}`,
          output: `error[E0515]: cannot return reference to local variable \`local\`
  --> src/main.rs:3:5
   |
 3 |     &local
   |     ^^^^^^ returns a reference to data owned by the current function`,
          hint: "In C, this compiles and 'works' — until it doesn't. In Rust, the borrow checker refuses to let you make this mistake.",
        }}
      />

      <SubTopic
        id="smart-pointers"
        emoji="✨"
        title="Smart pointers: Box, Rc, Arc"
        caption="Pointers that clean up after themselves. No `free()`, no leaks, no bugs."
        chips={["Box · one owner on the heap", "Rc · shared, single thread", "Arc · shared, multi-thread"]}
        visual={<SmartPointersVisual />}
        exercise={{
          title: "Put a value on the heap with Box",
          goal: "Allocate an i32 on the heap and print it. Watch how Box is cleaned up automatically when it goes out of scope.",
          code: `fn main() {
    let b = Box::new(5);           // 5 goes on the heap
    println!("via Box: {}", b);    // prints 5
    println!("value  : {}", *b);   // explicit dereference
}   // ← b is dropped here, the heap slot is freed automatically`,
          output: `via Box: 5
value  : 5`,
          predict: [
            { label: "Compile error" },
            { label: "Prints 5 twice", correct: true },
            { label: "Prints a memory address" },
            { label: "Crashes at runtime" },
          ],
          hint: "You never wrote `free(b)`. Rust does it for you at the closing `}` — deterministic, no garbage collector.",
        }}
      />

      <SubTopic
        id="rust-vs-c"
        emoji="🦀"
        title="What Rust solves"
        caption="The same class of bugs that took down years of C/C++ code — Rust turns them into compile errors."
        chips={["no dangling references", "no null dereferences", "no double-free", "no data races"]}
        visual={<RustVsCVisual />}
        exercise={{
          title: "Rust catches at compile time",
          goal: "Try to use a value after it&rsquo;s been dropped. In C this would crash at runtime; in Rust it doesn&rsquo;t compile.",
          code: `fn main() {
    let dangling: &String;
    {
        let temp = String::from("goodbye");
        dangling = &temp;
    }   // temp is dropped here!
    // dangling now points to freed memory — but Rust won&rsquo;t let us…
    println!("{dangling}");
}`,
          output: `error[E0597]: \`temp\` does not live long enough
  --> src/main.rs:5:20
   |
 5 |         dangling = &temp;
   |                    ^^^^^ borrowed value does not live long enough
 6 |     }
   |     - \`temp\` dropped here while still borrowed`,
          hint: "This exact mistake in C compiles cleanly — and then explodes in production. Rust&rsquo;s borrow checker earns its salary right here.",
        }}
      />

      <AssignmentSet
        chapterId="rust-memory"
        chapterNumber="4"
        chapterTitle="Memory & Pointers"
        assignment={RUST_ASSIGNMENTS["rust-memory"]}
      />
      <ChallengeSet chapterId="rust-memory" challenges={RUST_CHALLENGES["rust-memory"]} />
      <LessonPack lessonKey="rust-memory" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — Ownership (the star chapter)
 * ────────────────────────────────────────────────────────────── */

function Ownership() {
  return (
    <Section chapterId="rust-ownership">
      <ChapterHeader
        number="5"
        emoji="🖊️"
        title="Ownership"
        hook="This is the idea that makes Rust different. Once it clicks, everything else in Rust makes sense. Take your time here."
      />

      <SubTopic
        id="ownership-rule"
        emoji="👤"
        title="The rule: one owner"
        caption="Every value has exactly ONE owner at any moment. When the owner walks away, the value is cleaned up."
        chips={["one value", "one owner", "cleaned up automatically"]}
        visual={<OwnershipRuleVisual />}
        exercise={{
          title: "See the owner",
          goal: "This owner prints its own value.",
          code: `fn main() {
    let s = String::from("Hello");
    println!("{s}");
}   // ← s is dropped here, memory freed`,
          output: `Hello`,
          hint: "No garbage collector, no manual `free()`. Rust cleans up automatically at `}`.",
        }}
      />

      <SubTopic
        id="move"
        emoji="📦"
        title="Move — ownership transfers"
        caption="Assigning a String moves it. The old variable is retired — you can&rsquo;t use it any more."
        chips={["let b = a", "a is retired", "b is the new owner"]}
        visual={<MoveVisual />}
        exercise={{
          title: "The famous 'use of moved value' error",
          goal: "Try to use a variable after it&rsquo;s been moved. Rust catches this at COMPILE TIME.",
          code: `fn main() {
    let a = String::from("book");
    let b = a;           // ownership moves to b
    println!("{b}");     // ✓ ok
    println!("{a}");     // ✗ error: value borrowed here after move
}`,
          output: `error[E0382]: borrow of moved value: \`a\`
   |
   let a = String::from("book");
   let b = a;   -- value moved here
   println!("{a}");
                 ^ value borrowed here after move`,
          predict: [
            { label: "Prints \"book\" twice" },
            { label: "Compile error — nothing prints", correct: true },
            { label: "Prints \"book\" once, then panics" },
            { label: "Panics at runtime" },
          ],
          hint: "Rust would let you write `let b = a.clone();` — that makes an independent copy and both are usable.",
        }}
      />

      <SubTopic
        id="copy"
        emoji="🖨️"
        title="Copy — small values duplicate"
        caption="Numbers, bools, and chars are cheap to duplicate. Rust silently copies them — both variables stay usable."
        chips={["i32, f64, bool", "silent copy", "both usable"]}
        visual={<CopyVisual />}
        exercise={{
          title: "Numbers can be used twice",
          goal: "Watch how numbers behave differently from Strings.",
          code: `fn main() {
    let a = 5;
    let b = a;           // a is COPIED, not moved
    println!("a = {a}, b = {b}");    // ✓ both work!
}`,
          output: `a = 5, b = 5`,
          hint: "Types with the `Copy` trait are duplicated. Numbers, chars, booleans, and tuples of Copy types all Copy.",
        }}
      />

      <SubTopic
        id="borrow"
        emoji="📚"
        title="Borrowing (&) — read without taking"
        caption="Pass `&value` to LOOK at a value without owning it. Many people can read at once — as long as no one is writing."
        chips={["& = borrow", "many readers OK", "read-only"]}
        visual={<BorrowVisual />}
        exercise={{
          title: "Read without moving",
          goal: "Pass a String to a function by reference. The caller keeps ownership.",
          code: `fn greet(name: &str) {
    println!("Hi, {name}!");
}

fn main() {
    let s = String::from("Kanel");
    greet(&s);           // pass by REFERENCE
    println!("{s} is still here.");
}`,
          output: `Hi, Kanel!
Kanel is still here.`,
          predict: [
            { label: "Error — s was moved into greet" },
            { label: "Prints both lines", correct: true },
            { label: "Only prints \"Hi, Kanel!\"" },
            { label: "Prints \"Kanel is still here\" twice" },
          ],
          hint: "The `&` in `greet(&s)` says 'lend it — don't hand it over.' `s` stays with `main`. We use `&str` (not `&String`) so the function also accepts plain string literals.",
        }}
      />

      <SubTopic
        id="mut-borrow"
        emoji="✍️"
        title="Mutable borrow (&mut) — one writer"
        caption="If you need to CHANGE a value through a reference, use `&mut`. Rust allows only ONE mutable borrow at a time — this stops all data races."
        chips={["&mut = write access", "only one at a time", "no data races"]}
        visual={<MutBorrowVisual />}
        exercise={{
          title: "Change a String through a reference",
          goal: "Pass a mutable reference so the function can append text.",
          code: `fn add_exclamation(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut greeting = String::from("Hello");
    add_exclamation(&mut greeting);
    add_exclamation(&mut greeting);
    println!("{greeting}");
}`,
          output: `Hello!!`,
          hint: "Both `greeting` (with `let mut`) AND the reference (`&mut greeting`) must be mutable. Two locks.",
        }}
      />

      <SubTopic
        id="scope-drop"
        emoji="🎪"
        title="Scope & Drop"
        caption="A value lives from `let` until the closing `}` of its block. At `}` it&rsquo;s dropped automatically."
        chips={["no garbage collector", "no memory leaks", "no manual free"]}
        visual={<ScopeDropVisual />}
        exercise={{
          title: "See a value die",
          goal: "Try to use a variable outside its scope. Rust catches it at compile time.",
          code: `fn main() {
    {
        let cake = String::from("🎂");
        println!("Inside: {cake}");
    }   // cake dropped here

    // println!("Outside: {cake}");   // ← would be an error
    println!("Outside: (cake is gone)");
}`,
          output: `Inside: 🎂
Outside: (cake is gone)`,
          hint: "Uncomment the commented line to see the error `cannot find value \`cake\` in this scope`.",
        }}
      />

      <AssignmentSet
        chapterId="rust-ownership"
        chapterNumber="5"
        chapterTitle="Ownership"
        assignment={RUST_ASSIGNMENTS["rust-ownership"]}
      />
      <ChallengeSet chapterId="rust-ownership" challenges={RUST_CHALLENGES["rust-ownership"]} />
      <LessonPack lessonKey="rust-ownership" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Shaping Data
 * ────────────────────────────────────────────────────────────── */

function Data() {
  return (
    <Section chapterId="rust-data">
      <ChapterHeader
        number="6"
        emoji="📇"
        title="Shaping Data"
        hook="Design your own data types with `struct` and `enum`. Handle 'maybe empty' with `Option`, and 'might fail' with `Result`."
      />

      <SubTopic
        id="struct"
        emoji="🎓"
        title="struct — group named fields"
        caption="Invent your own data shape: a Student with a name, age, grade, and active flag."
        chips={["named fields", "custom types", "readable code"]}
        visual={<StructVisual />}
        exercise={{
          title: "Model a student",
          goal: "Define a Student struct and create one.",
          code: `struct Student {
    name: String,
    age: u32,
    grade: char,
}

fn main() {
    let s = Student {
        name: String::from("Kanel"),
        age: 24,
        grade: 'A',
    };
    println!("{} ({}), grade {}", s.name, s.age, s.grade);
}`,
          output: `Kanel (24), grade A`,
          hint: "Access fields with a dot: `s.name`, `s.age`. Same idea as most languages.",
        }}
      />

      <SubTopic
        id="enum"
        emoji="🚦"
        title="enum — one of many"
        caption="A value that can be ONE of several named things. Perfect for states, kinds, and choices."
        chips={["one variant at a time", "type-safe", "match to handle all"]}
        visual={<EnumVisual />}
        exercise={{
          title: "Traffic light enum",
          goal: "Define a Light enum and turn it into an action with `match`.",
          code: `enum Light { Red, Yellow, Green }

fn action(l: Light) -> &'static str {
    match l {
        Light::Red => "stop",
        Light::Yellow => "slow",
        Light::Green => "go",
    }
}

fn main() {
    println!("{}", action(Light::Green));
}`,
          output: `go`,
          hint: "Remove one arm from the `match` — Rust will refuse to compile until you cover every variant.",
        }}
      />

      <SubTopic
        id="option"
        emoji="🎁"
        title="Option — a safe null"
        caption="`Some(value)` if there's something, `None` if there's nothing. No more null-pointer bugs."
        chips={["Some(v)", "None", "safe by default"]}
        visual={<OptionVisual />}
        exercise={{
          title: "Look up something that might not exist",
          goal: "Use `.get()` on a Vec and handle both cases with `match`.",
          code: `fn main() {
    let names = vec!["Kanel", "Sopheak", "Chan"];

    match names.get(1) {
        Some(name) => println!("Found: {name}"),
        None => println!("Not there"),
    }

    match names.get(99) {
        Some(name) => println!("Found: {name}"),
        None => println!("Not there"),
    }
}`,
          output: `Found: Sopheak
Not there`,
          predict: [
            { label: "Panics at index 99" },
            { label: "Prints both messages safely", correct: true },
            { label: "Only prints Sopheak" },
            { label: "Compile error" },
          ],
          hint: "`.get()` returns `Option` — no crash on out-of-bounds. The old `names[99]` DOES crash.",
        }}
      />

      <SubTopic
        id="result"
        emoji="📮"
        title="Result — success or failure"
        caption="`Ok(value)` when it worked, `Err(reason)` when it didn't. All error handling in Rust looks like this."
        chips={["Ok(v)", "Err(e)", "no exceptions"]}
        visual={<ResultVisual />}
        exercise={{
          title: "Parse a number that might be invalid",
          goal: "Use `str::parse` and handle both outcomes.",
          code: `fn main() {
    let good: Result<i32, _> = "42".parse();
    let bad: Result<i32, _> = "hello".parse();

    match good {
        Ok(n) => println!("Got: {n}"),
        Err(e) => println!("Bad: {e}"),
    }
    match bad {
        Ok(n) => println!("Got: {n}"),
        Err(e) => println!("Bad: {e}"),
    }
}`,
          output: `Got: 42
Bad: invalid digit found in string`,
          hint: "Rust never throws exceptions. All fallible operations return `Result` — you must decide what to do.",
        }}
      />

      <SubTopic
        id="methods"
        emoji="🛠️"
        title="Methods — functions attached to types"
        caption="Give your struct behaviour with an `impl` block. `student.greet()` is a method."
        chips={["impl Type { ... }", "&self / &mut self", "student.greet()"]}
        visual={<MethodVisual />}
        exercise={{
          title: "Give Student a greet method",
          goal: "Add a method to your struct and call it.",
          code: `struct Student { name: String, age: u32 }

impl Student {
    fn greet(&self) {
        println!("Hi! I'm {} and I'm {}.", self.name, self.age);
    }
}

fn main() {
    let s = Student { name: String::from("Kanel"), age: 24 };
    s.greet();
}`,
          output: `Hi! I'm Kanel and I'm 24.`,
          hint: "`&self` says: 'lend me the struct to READ' — same as any immutable borrow.",
        }}
      />

      <AssignmentSet
        chapterId="rust-data"
        chapterNumber="6"
        chapterTitle="Shaping Data"
        assignment={RUST_ASSIGNMENTS["rust-data"]}
      />
      <ChallengeSet chapterId="rust-data" challenges={RUST_CHALLENGES["rust-data"]} />
      <LessonPack lessonKey="rust-data" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7 — Collections & Iterators
 * ────────────────────────────────────────────────────────────── */

function Collections() {
  return (
    <Section chapterId="rust-collections">
      <ChapterHeader
        number="7"
        emoji="📚"
        title="Collections & Iterators"
        hook="Growable lists (Vec), text (String), key-value lookups (HashMap), and the beautiful chain-of-methods style with iterators."
      />

      <SubTopic
        id="vec"
        emoji="📚"
        title="Vec — a growing list"
        caption="Rust&rsquo;s bread-and-butter list. Same type per item, but as many items as you want."
        chips={["vec![...]", "push / pop", "index with [i]"]}
        visual={<VecVisual />}
        exercise={{
          title: "Build a shopping list",
          goal: "Create a Vec, push a few items, and print it.",
          code: `fn main() {
    let mut list: Vec<&str> = vec!["milk", "bread"];
    list.push("eggs");
    list.push("apples");

    for item in &list {
        println!("- {item}");
    }
    println!("({} items)", list.len());
}`,
          output: `- milk
- bread
- eggs
- apples
(4 items)`,
          hint: "`for item in &list` iterates by reference — the Vec keeps ownership after the loop.",
        }}
      />

      <SubTopic
        id="strings"
        emoji="🧵"
        title="String — text you can build up"
        caption="Rust text is UTF-8, so it handles English, Khmer, emoji — anything humans write."
        chips={["String vs &str", "UTF-8", ".push_str()"]}
        visual={<StringVisual />}
        exercise={{
          title: "Build a greeting",
          goal: "Start with a String and add to it.",
          code: `fn main() {
    let mut msg = String::from("Hello");
    msg.push_str(", ");
    msg.push_str("Kanel");
    msg.push('!');
    println!("{msg}");
}`,
          output: `Hello, Kanel!`,
          hint: "`push_str` adds a `&str`. `push` adds a single `char`. Both need `let mut`.",
        }}
      />

      <SubTopic
        id="hashmap"
        emoji="📖"
        title="HashMap — a phone book"
        caption="Look up any value by its key in near-constant time."
        chips={["insert(k, v)", "get(k) → Option", "no key = None"]}
        visual={<HashMapVisual />}
        exercise={{
          title: "Look up phone numbers",
          goal: "Build a HashMap of names → phone numbers, then look one up.",
          code: `use std::collections::HashMap;

fn main() {
    let mut book: HashMap<&str, &str> = HashMap::new();
    book.insert("Kanel", "012-345-678");
    book.insert("Sopheak", "099-111-222");

    match book.get("Kanel") {
        Some(number) => println!("Kanel: {number}"),
        None => println!("Not in the book"),
    }
}`,
          output: `Kanel: 012-345-678`,
          hint: "`.get()` returns `Option<&V>` — Some or None. Rust makes you handle both.",
        }}
      />

      <SubTopic
        id="iterators"
        emoji="🎞️"
        title="Iterators — the conveyor belt"
        caption="Chain small steps to transform a collection. `.map()`, `.filter()`, `.sum()` — all zero-cost."
        chips={[".iter()", ".map(|x| ...)", ".filter(|x| ...)"]}
        visual={<IteratorVisual />}
        exercise={{
          title: "Sum the even numbers doubled",
          goal: "Take numbers 1..=5, keep the even ones, double them, add them all.",
          code: `fn main() {
    let nums = vec![1, 2, 3, 4, 5];
    let total: i32 = nums.iter()
        .filter(|x| *x % 2 == 0)
        .map(|x| x * 2)
        .sum();
    println!("Total: {total}");
}`,
          output: `Total: 12`,
          predict: [
            { label: "6" },
            { label: "12", correct: true },
            { label: "15" },
            { label: "20" },
          ],
          hint: "Even numbers: 2 and 4. Doubled: 4 and 8. Sum: 12.",
        }}
      />

      <AssignmentSet
        chapterId="rust-collections"
        chapterNumber="7"
        chapterTitle="Collections & Iterators"
        assignment={RUST_ASSIGNMENTS["rust-collections"]}
      />
      <ChallengeSet chapterId="rust-collections" challenges={RUST_CHALLENGES["rust-collections"]} />
      <LessonPack lessonKey="rust-collections" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8 — Traits & Modules
 * ────────────────────────────────────────────────────────────── */

function Traits() {
  return (
    <Section chapterId="rust-traits">
      <ChapterHeader
        number="8"
        emoji="🎫"
        title="Traits & Modules"
        hook="Traits are Rust&rsquo;s answer to interfaces — they promise behaviour. Modules organise your code. crates.io shares it with the world."
      />

      <SubTopic
        id="traits"
        emoji="🎫"
        title="Traits — a promise of ability"
        caption="A trait is a group of methods a type promises to implement. Anything that has it can be used the same way."
        chips={["trait Name { ... }", "impl Trait for Type", "duck typing, checked"]}
        visual={<TraitVisual />}
        exercise={{
          title: "Give two different types the same trait",
          goal: "Both Dog and Cat implement Greet. Same interface, different code.",
          code: `trait Greet {
    fn hello(&self) -> String;
}

struct Dog;
struct Cat;

impl Greet for Dog {
    fn hello(&self) -> String { String::from("Woof!") }
}

impl Greet for Cat {
    fn hello(&self) -> String { String::from("Meow!") }
}

fn main() {
    let d = Dog;
    let c = Cat;
    println!("{}", d.hello());
    println!("{}", c.hello());
}`,
          output: `Woof!
Meow!`,
          hint: "Now try adding `impl Greet for i32` — even a number can implement your trait!",
        }}
      />

      <SubTopic
        id="generics"
        emoji="🖼️"
        title="Generics — one function, many types"
        caption="Write a function once. It works for numbers, strings, structs — anything that fits your trait bounds."
        chips={["fn foo<T>", "T: SomeTrait", "compiler generates copies"]}
        visual={<GenericVisual />}
        exercise={{
          title: "A generic biggest()",
          goal: "One function that returns the bigger of two values, no matter the type.",
          code: `fn biggest<T: PartialOrd>(a: T, b: T) -> T {
    if a >= b { a } else { b }
}

fn main() {
    println!("{}", biggest(3, 7));
    println!("{}", biggest(9.5, 2.1));
    println!("{}", biggest("apple", "banana"));
}`,
          output: `7
9.5
banana`,
          hint: "`T: PartialOrd` means 'T is any type that can be compared with >=`. Numbers, floats, and &str all qualify.",
        }}
      />

      <SubTopic
        id="modules"
        emoji="🗂️"
        title="Modules — filing cabinet"
        caption="Group related code into named modules. `pub` marks what&rsquo;s visible outside; `use` brings it into scope."
        chips={["mod name { }", "pub", "use path::name"]}
        visual={<ModuleVisual />}
        exercise={{
          title: "Organise code with a module",
          goal: "Put math helpers in a module, expose one publicly.",
          code: `mod math {
    pub fn add(a: i32, b: i32) -> i32 { a + b }
    fn secret() -> i32 { 42 }   // private
}

fn main() {
    let sum = math::add(2, 3);
    println!("{sum}");
    // println!("{}", math::secret());  // ← would fail: not pub
}`,
          output: `5`,
          hint: "Uncomment `math::secret()` to see the compile error: `function` `secret` is private.",
        }}
      />

      <SubTopic
        id="crates-io"
        emoji="🌐"
        title="Crates.io — the community shelf"
        caption="Thousands of ready-made libraries. Add one to your project with a single command."
        chips={["cargo add name", "Cargo.toml", "instantly usable"]}
        visual={<CratesIoVisual />}
        exercise={{
          title: "Use a random-number crate",
          goal: "Add `rand` to your project, then roll a dice.",
          code: `# First, in your project folder run:
#     cargo add rand
#
# Then in src/main.rs:

use rand::Rng;

fn main() {
    let mut rng = rand::rng();
    let dice: u8 = rng.random_range(1..=6);
    println!("You rolled a {dice}!");
}`,
          output: `You rolled a 4!    (yours will vary)`,
          hint: "After `cargo add rand`, look at Cargo.toml — the dependency shows up in `[dependencies]`.",
        }}
      />

      <AssignmentSet
        chapterId="rust-traits"
        chapterNumber="8"
        chapterTitle="Traits & Modules"
        assignment={RUST_ASSIGNMENTS["rust-traits"]}
      />
      <ChallengeSet chapterId="rust-traits" challenges={RUST_CHALLENGES["rust-traits"]} />
      <LessonPack lessonKey="rust-traits" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 9 — Build Something Real
 * ────────────────────────────────────────────────────────────── */

function Project() {
  return (
    <Section chapterId="rust-project">
      <ChapterHeader
        number="9"
        emoji="🛠️"
        title="Build Something Real"
        hook="Everything so far comes together: a small command-line todo app that remembers your tasks between runs."
      />

      <SubTopic
        id="cli-todo"
        emoji="⌨️"
        title="A todo CLI"
        caption="Type commands, get results. Reads arguments from `std::env::args`."
        chips={["todo add", "todo list", "todo done"]}
        visual={<CliTodoVisual />}
        exercise={{
          title: "Read command-line args",
          goal: "Print every argument the user passed to the program.",
          code: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("You passed {} args:", args.len() - 1);
    for a in &args[1..] {
        println!("  - {a}");
    }
}`,
          output: `You passed 2 args:
  - add
  - Buy milk`,
          hint: "The first arg (args[0]) is the program's own path, so we skip it with `args[1..]`.",
        }}
      />

      <SubTopic
        id="file-io"
        emoji="💾"
        title="Save & load from a file"
        caption="`fs::write` to save, `fs::read_to_string` to load. Your tasks survive between runs."
        chips={["std::fs", "the ? operator", "handle io::Result"]}
        visual={<FileIOVisual />}
        exercise={{
          title: "Write and read back",
          goal: "Save a string to disk, then read it back.",
          code: `use std::fs;

fn main() -> std::io::Result<()> {
    fs::write("greeting.txt", "Hello, Rust!")?;
    let back = fs::read_to_string("greeting.txt")?;
    println!("Read back: {back}");
    Ok(())
}`,
          output: `Read back: Hello, Rust!`,
          hint: "The `?` at the end of each fs:: call returns the error early if something goes wrong (like a missing file).",
        }}
      />

      <SubTopic
        id="testing"
        emoji="🧪"
        title="Testing"
        caption="Rust has testing built in. Mark a function with `#[test]` and run `cargo test`."
        chips={["#[test]", "assert_eq!", "cargo test"]}
        visual={<TestingVisual />}
        exercise={{
          title: "Write your first test",
          goal: "Add a #[test] function and run `cargo test`.",
          code: `fn add(a: i32, b: i32) -> i32 { a + b }

#[test]
fn two_plus_two() {
    assert_eq!(add(2, 2), 4);
}

#[test]
fn negative_numbers() {
    assert_eq!(add(-1, -1), -2);
}`,
          output: `running 2 tests
test negative_numbers ... ok
test two_plus_two ... ok

test result: ok. 2 passed; 0 failed`,
          hint: "In Rust every project can have tests inline with the code. `cargo test` finds and runs them all.",
        }}
      />

      <SubTopic
        id="where-next"
        emoji="🚀"
        title="Where next?"
        caption="You know the core. Pick a direction — Rust has amazing libraries for every one."
        chips={["axum", "bevy", "tauri", "tokio"]}
        visual={<WhereNextVisual />}
      />

      <AssignmentSet
        chapterId="rust-project"
        chapterNumber="9"
        chapterTitle="Build Something Real"
        assignment={RUST_ASSIGNMENTS["rust-project"]}
      />
      <ChallengeSet chapterId="rust-project" challenges={RUST_CHALLENGES["rust-project"]} />
      <LessonPack lessonKey="rust-project" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-400/[0.1] to-white/[0.02] p-8 sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-orange-300">
          <Award className="h-3.5 w-3.5" />
          You made it!
        </div>

        <h2 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Welcome to the Rustacean club. <br className="hidden sm:block" />
          <span className="hero-gradient">You&rsquo;re dangerous now.</span>
        </h2>

        <p className="mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-neutral-300 sm:text-base">
          You started with a print statement and finished with a working file-backed CLI.
          The compiler taught you along the way. Keep building — the community is here to help.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#rust-welcome"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to the top
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 px-5 py-2.5 text-[13.5px] font-medium text-orange-200 transition-all hover:bg-orange-400/20"
          >
            <Package className="h-4 w-4" />
            Explore other courses
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Footer
 * ────────────────────────────────────────────────────────────── */

function PageFooter() {
  return (
    <footer className="mt-8 border-t border-white/10 pt-6 text-[12.5px] text-neutral-500">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Made for IDIC students · learn by seeing, then by doing.
          <span className="ml-2 rounded border border-orange-400/30 bg-orange-400/10 px-1.5 py-0.5 font-mono text-[10px] text-orange-200">
            <Wrench className="mr-0.5 inline h-3 w-3" />
            hands-on
          </span>
        </div>
        <div>© <ClientYear /> · Classroom use.</div>
      </div>
    </footer>
  );
}

function ClientYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year ?? ""}</>;
}
