"use client";

// The IT Lecture page — a sidebar-driven, visual-first teaching deck for IDIC students.
// Layout: fixed left sidebar (chapter tree) + scrolling content column.
// Each subtopic leads with an animated illustration and one short, plain-English sentence.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Boxes,
  BrainCircuit,
  ChevronDown,
  Cpu,
  Download,
  Globe,
  GraduationCap,
  Layers,
  Menu,
  Network,
  Presentation,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonPack } from "@/components/lecture/LessonPack";
import { LessonSessionProvider } from "@/components/lecture/LessonSession";
import { KeyLearning } from "@/components/lecture/KeyLearning";
import { LaserPointer } from "@/components/lecture/LaserPointer";
import { ThemeToggle } from "@/components/lecture/ThemeToggle";
import { DECKS } from "@/lib/deck-data";
import { LESSONS } from "@/lib/lecture-data";
import {
  AiBrainVisual,
  EthicsVisual,
  FutureVisual,
  MLVisual,
  NeuralNetVisual,
  NLPVisual,
} from "@/components/lecture/Visuals";
import {
  FileSystemRealisticVisual,
  OSFamilyRealisticVisual,
  OSFamilyTreeVisual,
  PopularAppsRealisticVisual,
  SoftwareInstallRealisticVisual,
  SoftwareStackRealisticVisual,
} from "@/components/lecture/SoftwareVisuals";
import {
  BandwidthRealisticVisual,
  CloudRealisticVisual,
  IpMacRealisticVisual,
  NetworksRealisticVisual,
  PingTracertRealisticVisual,
  PortsRealisticVisual,
  SwitchRouterRealisticVisual,
  VpnRealisticVisual,
} from "@/components/lecture/NetworkingVisuals";
import { InternetFlowVisual } from "@/components/lecture/InternetFlowVisual";
import { OsiModelVisual } from "@/components/lecture/OsiModelVisual";
import {
  DnsRealisticVisual,
  DomainHostingRealisticVisual,
  HtmlCssRealisticVisual,
  IcannIanaRealisticVisual,
  InternetJourneyRealisticVisual,
  JsPhpRealisticVisual,
  TcpIpRealisticVisual,
  WhoisRealisticVisual,
  WordpressRealisticVisual,
} from "@/components/lecture/WebVisuals";
import {
  AttacksRealisticVisual,
  CiaTriadRealisticVisual,
  DdosRealisticVisual,
  DefensesRealisticVisual,
  HackerCardsRealisticVisual,
  HackingRealisticVisual,
  MalwareScannerRealisticVisual,
  PhishingRealisticVisual,
} from "@/components/lecture/SecurityVisuals";
import {
  BiosRealisticVisual,
  CacheRomRealisticVisual,
  MotherboardFlowVisual,
  ProcessorRealisticVisual,
  RamRealisticVisual,
  StorageRealisticVisual,
} from "@/components/lecture/HardwareVisuals";

/* ─────────────────────────────────────────────────────────────────
 * Outline — drives the sidebar tree and section anchor ids.
 * ────────────────────────────────────────────────────────────── */

// Discrete text-size presets shown in the sidebar font-size dropdown.
// Default is 100%; students can scale up to 300% for classroom display.
const FONT_SCALE_OPTIONS = [1, 1.5, 2, 3] as const;

type Sub = { id: string; label: string; kind?: "topic" | "terms" | "quiz" };
type Chapter = {
  id: string;
  /** Key into LESSONS for the LessonPack. */
  lessonKey: string;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  subs: Sub[];
};

// Every chapter ends with a Terms + Quiz sub-item so the sidebar can jump
// straight to the interactive lesson tools.
function withPack(chapterId: string, topicSubs: Sub[]): Sub[] {
  return [
    ...topicSubs,
    { id: `${chapterId}-terms`, label: "Key Terms", kind: "terms" },
    { id: `${chapterId}-quiz`, label: "Quiz", kind: "quiz" },
  ];
}

const OUTLINE: Chapter[] = [
  {
    id: "welcome",
    lessonKey: "welcome",
    number: "1",
    label: "Welcome",
    icon: GraduationCap,
    subs: withPack("welcome", []),
  },
  {
    id: "hardware",
    lessonKey: "hardware",
    number: "2",
    label: "Hardware",
    icon: Cpu,
    subs: withPack("hardware", [
      { id: "processor", label: "Processor" },
      { id: "storage", label: "Storage" },
      { id: "ram", label: "RAM" },
      { id: "cache-rom", label: "Cache & ROM" },
      { id: "cmos-bios", label: "CMOS & BIOS" },
      { id: "motherboard", label: "Motherboard" },
    ]),
  },
  {
    id: "software",
    lessonKey: "software",
    number: "3",
    label: "Software",
    icon: Layers,
    subs: withPack("software", [
      { id: "software", label: "Software" },
      { id: "operating-systems", label: "Operating Systems" },
      { id: "os-hierarchy", label: "OS Family Tree" },
      { id: "file-systems", label: "File Systems" },
      { id: "software-management", label: "Managing Apps" },
      { id: "popular-apps", label: "Apps & Games" },
    ]),
  },
  {
    id: "networking",
    lessonKey: "networking",
    number: "4",
    label: "Networking & Internet",
    icon: Network,
    subs: withPack("networking", [
      { id: "networks", label: "Networks" },
      { id: "ip-mac", label: "IP & MAC" },
      { id: "switches-routers", label: "Switches & Routers" },
      { id: "ports-protocols", label: "Ports & Protocols" },
      { id: "ping-tracert", label: "Ping & Tracert" },
      { id: "vpn", label: "VPN" },
      { id: "bandwidth", label: "Bandwidth" },
      { id: "cloud", label: "Cloud" },
      { id: "internet-flow", label: "Internet Flow · Demo" },
      { id: "osi-model", label: "OSI Model · Demo" },
    ]),
  },
  {
    id: "web",
    lessonKey: "web",
    number: "5",
    label: "Web Technology",
    icon: Globe,
    subs: withPack("web", [
      { id: "html-css", label: "HTML & CSS" },
      { id: "js-php", label: "JavaScript & PHP" },
      { id: "wordpress", label: "WordPress" },
      { id: "domains-hosting", label: "Domains & Hosting" },
      { id: "dns", label: "DNS" },
      { id: "icann-iana", label: "ICANN & IANA" },
      { id: "whois", label: "WHOIS" },
      { id: "tcp-ip", label: "TCP/IP" },
      { id: "how-internet-works", label: "How the Internet Works" },
    ]),
  },
  {
    id: "security",
    lessonKey: "security",
    number: "6",
    label: "Cybersecurity",
    icon: ShieldCheck,
    subs: withPack("security", [
      { id: "security-fundamentals", label: "Basics" },
      { id: "hacking", label: "Hacking" },
      { id: "hackers", label: "Hackers" },
      { id: "malware", label: "Malware" },
      { id: "dos", label: "DoS Attacks" },
      { id: "common-attacks", label: "Common Attacks" },
      { id: "phishing-vishing", label: "Phishing" },
      { id: "defenses", label: "Defenses" },
    ]),
  },
  {
    id: "ai",
    lessonKey: "ai",
    number: "7",
    label: "Artificial Intelligence",
    icon: BrainCircuit,
    subs: withPack("ai", [
      { id: "ai", label: "What is AI?" },
      { id: "machine-learning", label: "Machine Learning" },
      { id: "deep-learning", label: "Deep Learning" },
      { id: "nlp", label: "Language (NLP)" },
      { id: "ai-ethics", label: "AI Ethics" },
      { id: "future-of-ai", label: "The Future" },
    ]),
  },
  {
    id: "conclusion",
    lessonKey: "conclusion",
    number: "8",
    label: "Conclusion",
    icon: Award,
    subs: withPack("conclusion", []),
  },
];

const ALL_ANCHORS: string[] = OUTLINE.flatMap((c) => [c.id, ...c.subs.map((s) => s.id)]);

/* ─────────────────────────────────────────────────────────────────
 * Main page
 * ────────────────────────────────────────────────────────────── */

export function LecturePage() {
  const [activeId, setActiveId] = useState<string>("welcome");
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
    // Apply zoom to <html> so BOTH sidebar and content (including
    // fixed-width animation canvases) scale proportionally. Applying it
    // to <main> alone would clip the visuals because main's flex slot
    // stays a fixed logical width.
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
        {/* Ambient background wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 700px at 15% 10%, rgba(77, 141, 255, 0.14), transparent 60%)," +
              "radial-gradient(900px 600px at 85% 60%, rgba(125, 211, 252, 0.10), transparent 60%)," +
              "radial-gradient(700px 500px at 50% 100%, rgba(77, 141, 255, 0.08), transparent 60%)",
          }}
        />

        {/* Scroll progress bar sits just below the session clock bar */}
        <div aria-hidden="true" className="fixed inset-x-0 top-[46px] z-[60] h-[2px] bg-white/5">
          <div
            className="h-full origin-left bg-gradient-to-r from-sky-300 via-accent to-sky-300 transition-[width] duration-150"
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
            <Hardware />
            <Software />
            <Networking />
            <Web />
            <Security />
            <AI />
            <Conclusion />
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
        className="flex-1 cursor-pointer rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11.5px] font-medium text-neutral-200 outline-none transition-colors hover:border-accent/40 hover:text-accent-bright focus:border-accent/50"
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
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-accent-bright">
        <GraduationCap className="h-5 w-5" />
      </span>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold text-white">IDIC Lecture</span>
        <span className="truncate text-[11px] text-neutral-400">Computer Science &amp; IT</span>
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
                    ? "border-accent/40 bg-accent-soft text-accent-bright"
                    : "border-white/10 bg-white/[0.03] text-neutral-400 group-hover:text-accent-bright"
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
                  isChapterActive && "text-accent-bright"
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
                  const emoji = sub.kind === "terms" ? "📖" : sub.kind === "quiz" ? "📝" : null;
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
                              ? sub.kind === "quiz"
                                ? "bg-amber-400/10 text-amber-200"
                                : "bg-sky-400/10 text-sky-200"
                              : "text-accent-bright"
                            : isTool
                              ? "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                              : "text-neutral-500 hover:text-white"
                        )}
                      >
                        {isSubActive && !isTool && (
                          <span className="absolute -left-[13px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-accent-bright" />
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
          className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright ml-1.5"
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
            className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
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
            href="/explore"
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[12px] text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-accent-bright">
              <Boxes className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 truncate font-medium">Computer Anatomy · 3D</span>
            <ArrowRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="text-[11px] text-neutral-500">IDIC · Introduction to IT</div>
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
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-accent-bright">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[12px] font-semibold text-white">IDIC Lecture</span>
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

// Button that generates and downloads a lecture slide deck (PDF) for the
// current chapter. It snapshots the chapter's live `<section id={deckKey}>`
// on the /lecture page after temporarily hiding the "Key Terms" and "Quiz"
// cards, and paginates that image across landscape A4 pages — so the deck
// literally looks like the webpage. Heavy modules (jsPDF, html2canvas) load
// lazily on click.
function DeckDownloadButton({
  deckKey,
  variant = "chip",
}: {
  deckKey: string;
  /**
   * "chip" — small pill button (used in the ChapterHeader)
   * "hero" — larger CTA button (used in the Welcome / Conclusion hero cards)
   */
  variant?: "chip" | "hero";
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const onClick = async () => {
    const deck = DECKS[deckKey];
    const lesson = LESSONS[deckKey];
    if (!deck || !lesson) return;

    const section = document.getElementById(deckKey);
    if (!section) return;

    // Track everything we mutate on the live DOM so the finally block can
    // always undo it, even if the render throws mid-way.
    const originalDisplay = new Map<HTMLElement, string>();
    let captureStyle: HTMLStyleElement | null = null;

    try {
      setBusy(true);
      setProgress("Preparing…");

      // Hide the Key Terms + Quiz cards inside this chapter's section.
      section
        .querySelectorAll<HTMLElement>(
          `#${cssEscape(deckKey)}-terms, #${cssEscape(deckKey)}-quiz`,
        )
        .forEach((el) => {
          originalDisplay.set(el, el.style.display);
          el.style.display = "none";
        });

      // Framer Motion often leaves headers / articles at opacity 0 until
      // they scroll into view; force everything visible so the snapshot
      // isn't half-blank on chapters the student hasn't scrolled through.
      captureStyle = document.createElement("style");
      captureStyle.textContent = `
        main article, main header, main section {
          opacity: 1 !important;
          transform: none !important;
          visibility: visible !important;
        }
      `;
      document.head.appendChild(captureStyle);

      section.scrollIntoView({
        block: "start",
        behavior: "instant" as ScrollBehavior,
      });
      // Give layout + framer a beat to settle after the style changes.
      await new Promise((r) => setTimeout(r, 200));

      setProgress("Rendering deck…");
      const { buildDeckPdf } = await import("@/lib/deck-pdf");
      const doc = await buildDeckPdf(section, {
        lesson,
        chapterNumber: deck.chapterNumber,
        hook: deck.hook,
        onProgress: (current, total) =>
          setProgress(`Rendering slide ${current} / ${total}…`),
      });

      const slug = lesson.chapterTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      doc.save(`IDIC-Chapter${lesson.chapterNumber}-${slug}-Deck.pdf`);
    } finally {
      originalDisplay.forEach((prev, el) => {
        el.style.display = prev;
      });
      captureStyle?.remove();
      setBusy(false);
      setProgress(null);
    }
  };

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-accent/50 hover:bg-white/10 disabled:opacity-60"
      >
        <Presentation className="h-4 w-4" />
        {busy ? (progress ?? "Preparing deck…") : "Download slide deck (PDF)"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title="Download a printable slide deck for this chapter"
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 font-mono text-[11px] tracking-widest text-accent-bright transition-colors hover:bg-accent/25 disabled:opacity-60"
    >
      <Download className="h-3 w-3" />
      {busy ? (progress ?? "Preparing…") : "Deck PDF"}
    </button>
  );
}

// Escape an id for use inside a CSS `[attr="…"]` selector. All our subtopic
// ids are lowercase letters + dashes today, but CSS.escape stays safe if
// they ever grow special characters.
function cssEscape(id: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(id);
  }
  return id.replace(/["\\]/g, "\\$&");
}

function ChapterHeader({
  number,
  emoji,
  title,
  hook,
  deckKey,
}: {
  number: string;
  emoji: string;
  title: string;
  hook: string;
  /** When set, shows a compact "Deck PDF" button next to the CHAPTER tag. */
  deckKey?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/10 pb-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-widest text-accent-bright">
          CHAPTER {number}
        </span>
        {deckKey && <DeckDownloadButton deckKey={deckKey} />}
      </div>
      <h2 className="mt-4 flex items-center gap-3 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        <span className="text-4xl sm:text-5xl">{emoji}</span>
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-neutral-400">{hook}</p>
    </motion.header>
  );
}

// Visual-first subtopic. Big illustration + tiny caption.
function SubTopic({
  id,
  emoji,
  title,
  caption,
  chips,
  visual,
}: {
  id: string;
  emoji: string;
  title: string;
  caption: string;
  chips?: string[];
  visual: React.ReactNode;
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
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-2xl">
          {emoji}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          <p className="text-[13.5px] text-neutral-400">{caption}</p>
        </div>
      </div>

      {/* Big visual */}
      {visual}

      {/* Tiny chip badges */}
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
  const objectives = [
    { emoji: "💻", label: "See inside a computer" },
    { emoji: "🌐", label: "Understand the internet" },
    { emoji: "🔒", label: "Stay safe online" },
    { emoji: "🤖", label: "Meet AI" },
  ];
  return (
    <Section chapterId="welcome">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 backdrop-blur-md sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent-bright">
          <GraduationCap className="h-3.5 w-3.5" />
          IDIC — Course
        </div>

        <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Hello, class! <br className="hidden sm:block" />
          <span className="hero-gradient">Let&rsquo;s explore tech.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-neutral-300">
          Eight chapters. Simple words. Lots of pictures. By the end, technology
          will feel less like magic and more like something you understand.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {objectives.map((o, i) => (
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
            href="#hardware"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:scale-[1.02] hover:border-accent/50 hover:bg-white/10"
          >
            Start the tour
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-5 py-2.5 text-[13.5px] font-medium text-accent-bright transition-all hover:scale-[1.02] hover:border-accent/70 hover:bg-accent/20"
          >
            <Boxes className="h-4 w-4" />
            Explore Computer Anatomy in 3D
          </Link>
          <DeckDownloadButton deckKey="welcome" variant="hero" />
        </div>
      </motion.div>

      <LessonPack lessonKey="welcome" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — Hardware
 * ────────────────────────────────────────────────────────────── */

function Hardware() {
  return (
    <Section chapterId="hardware">
      <ChapterHeader
        number="2"
        emoji="⚙️"
        title="Computer Hardware"
        hook="Hardware is anything you can touch inside a computer. Let&rsquo;s look at the parts one by one."
        deckKey="hardware"
      />

      <SubTopic
        id="processor"
        emoji="🧠"
        title="Processor"
        caption="The brain of the computer. It thinks."
        chips={["also called CPU", "billions of steps every second"]}
        visual={<ProcessorRealisticVisual />}
      />

      <SubTopic
        id="storage"
        emoji="💾"
        title="Storage"
        caption="Keeps your files, even when the power is off."
        chips={["SSD is faster", "HDD is bigger and cheaper"]}
        visual={<StorageRealisticVisual />}
      />

      <SubTopic
        id="ram"
        emoji="⚡"
        title="RAM"
        caption="Fast short-term memory. It forgets when you turn the computer off."
        chips={["holds what you&rsquo;re using now", "more RAM · smoother"]}
        visual={<RamRealisticVisual />}
      />

      <SubTopic
        id="cache-rom"
        emoji="🏎️"
        title="Cache & ROM"
        caption="Two helpers: one for speed, one for memory that never forgets."
        chips={["Cache · super fast, tiny", "ROM · always remembers"]}
        visual={<CacheRomRealisticVisual />}
      />

      <SubTopic
        id="cmos-bios"
        emoji="🔌"
        title="CMOS & BIOS"
        caption="The tiny program that wakes the computer up when you press power."
        chips={["checks every part", "then loads the system"]}
        visual={<BiosRealisticVisual />}
      />

      <SubTopic
        id="motherboard"
        emoji="🧩"
        title="Motherboard"
        caption="The big green board that connects every part together. Watch a keystroke travel from your keyboard, through the CPU, and onto the screen."
        chips={[
          "input · keyboard & mouse",
          "processing · CPU + RAM",
          "output · monitor & speaker",
        ]}
        visual={<MotherboardFlowVisual />}
      />
      <KeyLearning summaryKey="hardware" />
      <LessonPack lessonKey="hardware" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — Software
 * ────────────────────────────────────────────────────────────── */

function Software() {
  return (
    <Section chapterId="software">
      <ChapterHeader
        number="3"
        emoji="🪄"
        title="Software"
        hook="If hardware is the body, software is the thinking. It tells the machine what to do."
        deckKey="software"
      />

      <SubTopic
        id="software"
        emoji="📦"
        title="Software"
        caption="Apps run on top of the operating system. The operating system runs on top of the hardware. Three neat layers."
        chips={["Layer 3 · apps", "Layer 2 · system", "Layer 1 · machine"]}
        visual={<SoftwareStackRealisticVisual />}
      />

      <SubTopic
        id="operating-systems"
        emoji="🖥️"
        title="Operating Systems"
        caption="Every device you touch has one. Each has its own look — but they all do the same job."
        chips={["Windows · macOS · Linux", "Android · iOS on phones"]}
        visual={<OSFamilyRealisticVisual />}
      />

      <SubTopic
        id="os-hierarchy"
        emoji="🧬"
        title="OS Family Tree"
        caption="Most modern operating systems descend from UNIX (1969). Siblings share a base — that's why iOS and macOS feel similar, or Android and ChromeOS."
        chips={["UNIX → BSD → macOS/iOS", "UNIX-like → Linux → Android", "Windows NT · its own family"]}
        visual={<OSFamilyTreeVisual />}
      />

      <SubTopic
        id="file-systems"
        emoji="📁"
        title="File Systems"
        caption="Files live in folders. Folders live inside other folders. Each file has one clear home."
        chips={["folders inside folders", "each file has a place", "click to open"]}
        visual={<FileSystemRealisticVisual />}
      />

      <SubTopic
        id="software-management"
        emoji="🧰"
        title="Managing Apps"
        caption="You install an app once. Update it when a new version comes. Remove it when you don't need it."
        chips={["install from trusted store", "update often", "uninstall to save space"]}
        visual={<SoftwareInstallRealisticVisual />}
      />

      <SubTopic
        id="popular-apps"
        emoji="🧩"
        title="Popular Apps & Games"
        caption="The apps you already know. Some help you work and learn — others help you play with friends."
        chips={["Office · Word · Excel · PPT", "QuickBooks · accounting", "Roblox · PUBG · Free Fire"]}
        visual={<PopularAppsRealisticVisual />}
      />
      <KeyLearning summaryKey="software" />
      <LessonPack lessonKey="software" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Networking
 * ────────────────────────────────────────────────────────────── */

function Networking() {
  return (
    <Section chapterId="networking">
      <ChapterHeader
        number="4"
        emoji="🌐"
        title="Networking & Internet"
        hook="How computers talk to each other — from the phone in your pocket to servers on the other side of the world."
        deckKey="networking"
      />

      <SubTopic
        id="networks"
        emoji="🕸️"
        title="Networks"
        caption="Networks are grouped by how far they reach — from around your body to around the whole world."
        chips={["PAN · you", "LAN · building", "MAN · city", "WAN · the world"]}
        visual={<NetworksRealisticVisual />}
      />

      <SubTopic
        id="ip-mac"
        emoji="🆔"
        title="IP & MAC Addresses"
        caption="Your device has two IDs. The IP address changes as you move between Wi-Fi networks. The MAC address never changes."
        chips={["IP · where you are now", "MAC · built-in from the factory"]}
        visual={<IpMacRealisticVisual />}
      />

      <SubTopic
        id="switches-routers"
        emoji="🚦"
        title="Switches & Routers"
        caption="A switch links devices inside your building. A router connects your network to the wider internet."
        chips={["Switch · local traffic", "Router · connects to the internet"]}
        visual={<SwitchRouterRealisticVisual />}
      />

      <SubTopic
        id="ports-protocols"
        emoji="🚪"
        title="Ports & Protocols"
        caption="A server has many numbered doors. Different services listen on different port numbers."
        chips={["port 80 · websites", "port 443 · secure sites", "port 22 · remote login"]}
        visual={<PortsRealisticVisual />}
      />

      <SubTopic
        id="ping-tracert"
        emoji="📡"
        title="Ping & Tracert"
        caption="Two small tools every IT student should know. Ping says hello to a server. Tracert shows every stop on the way."
        chips={["ping · is it there?", "tracert · which route?"]}
        visual={<PingTracertRealisticVisual />}
      />

      <SubTopic
        id="vpn"
        emoji="🕶️"
        title="VPN"
        caption="Without a VPN, anyone in the middle can see your data. With a VPN, it&rsquo;s all encrypted."
        chips={["hides your data", "protects café Wi-Fi"]}
        visual={<VpnRealisticVisual />}
      />

      <SubTopic
        id="bandwidth"
        emoji="🚿"
        title="Bandwidth"
        caption="How much data your connection can carry per second. Measured in bits per second. Bigger number, faster feel."
        chips={["Download · get files", "Upload · send files", "Ping · reaction time"]}
        visual={<BandwidthRealisticVisual />}
      />

      <SubTopic
        id="cloud"
        emoji="☁️"
        title="Cloud Computing"
        caption="Instead of storing files on your device, you use computers rented from big datacenters spread across the world."
        chips={["Gmail · Google Docs · Netflix", "your files, anywhere"]}
        visual={<CloudRealisticVisual />}
      />

      <SubTopic
        id="internet-flow"
        emoji="🛰️"
        title="Internet Flow · Live Demo"
        caption="Press Play and watch a packet travel from your phone in Phnom Penh out to a Facebook server — and back — in about 200 milliseconds."
        chips={[
          "Home Wi-Fi · ISP · PP-IX",
          "Undersea to Singapore",
          "Click any hop for detail",
        ]}
        visual={<InternetFlowVisual />}
      />

      <SubTopic
        id="osi-model"
        emoji="📚"
        title="OSI 7-Layer Model · Live Demo"
        caption="See how a 'GET /idic.edu.kh' request is wrapped by each layer as it descends the sender's stack, crosses the wire, and is unwrapped at the receiver."
        chips={[
          "Encapsulate top → bottom",
          "Decapsulate bottom → top",
          "Click any layer for detail",
        ]}
        visual={<OsiModelVisual />}
      />
      <KeyLearning summaryKey="networking" />
      <LessonPack lessonKey="networking" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — Web Technology
 * ────────────────────────────────────────────────────────────── */

function Web() {
  return (
    <Section chapterId="web">
      <ChapterHeader
        number="5"
        emoji="🌍"
        title="Web Technology"
        hook="Websites, browsers, and everything that makes the web work."
        deckKey="web"
      />

      <SubTopic
        id="html-css"
        emoji="🎨"
        title="HTML & CSS"
        caption="HTML gives a page its structure — headings, paragraphs, images. CSS gives it colour, spacing, and style."
        chips={["HTML · structure", "CSS · style", "browser · renders"]}
        visual={<HtmlCssRealisticVisual />}
      />

      <SubTopic
        id="js-php"
        emoji="🎭"
        title="JavaScript & PHP"
        caption="JavaScript makes pages interactive right in the browser. PHP runs on the server, talks to the database, and sends HTML back."
        chips={["JavaScript · client-side", "PHP · server-side"]}
        visual={<JsPhpRealisticVisual />}
      />

      <SubTopic
        id="wordpress"
        emoji="🧱"
        title="WordPress"
        caption="A drag-and-drop dashboard for building websites. About 40% of the whole web runs on it."
        chips={["visual editor", "blocks · themes · plugins"]}
        visual={<WordpressRealisticVisual />}
      />

      <SubTopic
        id="domains-hosting"
        emoji="🏠"
        title="Domains & Hosting"
        caption="You rent a name (the domain) and a place for the files (the hosting). The domain points to the hosting server."
        chips={["domain · address", "hosting · the machine"]}
        visual={<DomainHostingRealisticVisual />}
      />

      <SubTopic
        id="dns"
        emoji="📖"
        title="DNS"
        caption="The phone book of the internet. Type a name, DNS gives back the IP address in milliseconds."
        chips={["name → IP", "cached everywhere", "22 ms typical"]}
        visual={<DnsRealisticVisual />}
      />

      <SubTopic
        id="icann-iana"
        emoji="🌐"
        title="ICANN & IANA"
        caption="A hierarchy of organisations keeps every domain name and IP address unique across the whole planet."
        chips={["ICANN oversees", "IANA assigns numbers", "13 root servers"]}
        visual={<IcannIanaRealisticVisual />}
      />

      <SubTopic
        id="whois"
        emoji="🔍"
        title="WHOIS"
        caption="A public database showing who registered a domain, when it was created, and when it expires."
        chips={["business card for domains", "run whois in a terminal"]}
        visual={<WhoisRealisticVisual />}
      />

      <SubTopic
        id="tcp-ip"
        emoji="📦"
        title="TCP/IP"
        caption="Data travels through four layers. Each layer wraps the one above it in its own header — like envelopes inside envelopes."
        chips={["Application · Transport", "Internet · Link"]}
        visual={<TcpIpRealisticVisual />}
      />

      <SubTopic
        id="how-internet-works"
        emoji="✨"
        title="How the Internet Works"
        caption="Six steps between typing a URL and seeing pixels on your screen — all in about 200 milliseconds."
        chips={["Browser → DNS → TLS", "Routers → Server → Screen"]}
        visual={<InternetJourneyRealisticVisual />}
      />
      <KeyLearning summaryKey="web" />
      <LessonPack lessonKey="web" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Cybersecurity
 * ────────────────────────────────────────────────────────────── */

function Security() {
  return (
    <Section chapterId="security">
      <ChapterHeader
        number="6"
        emoji="🛡️"
        title="Cybersecurity"
        hook="Keeping your data, your money, and your identity safe online."
        deckKey="security"
      />

      <SubTopic
        id="security-fundamentals"
        emoji="🔐"
        title="The Big 3 (CIA Triad)"
        caption="Every safe system tries to protect three things at once: keep data private, keep it true, and keep it available when you need it."
        chips={["Confidentiality", "Integrity", "Availability"]}
        visual={<CiaTriadRealisticVisual />}
      />

      <SubTopic
        id="hacking"
        emoji="⌨️"
        title="Hacking"
        caption="Finding creative ways to make a system do something new. Ethical hackers do it to fix weaknesses before criminals find them."
        chips={["scanning · nmap", "vulnerability check", "responsible disclosure"]}
        visual={<HackingRealisticVisual />}
      />

      <SubTopic
        id="hackers"
        emoji="🎩"
        title="Hackers"
        caption="Three main personas — separated not by skill but by motive. Same tools, very different goals."
        chips={["white · helper", "grey · unclear", "black · criminal"]}
        visual={<HackerCardsRealisticVisual />}
      />

      <SubTopic
        id="malware"
        emoji="🦠"
        title="Malware"
        caption="Bad software that tries to steal, spy, or lock your files. Antivirus catches most of it and puts it in quarantine."
        chips={["Trojan · Worm", "Ransomware · Spyware", "quarantine · delete"]}
        visual={<MalwareScannerRealisticVisual />}
      />

      <SubTopic
        id="dos"
        emoji="⚡"
        title="DoS & DDoS Attacks"
        caption="Attackers flood a site with millions of fake requests from thousands of hijacked machines. The site can&rsquo;t serve real users any more."
        chips={["1.2M requests/sec", "botnet · 100k+ devices", "real users locked out"]}
        visual={<DdosRealisticVisual />}
      />

      <SubTopic
        id="common-attacks"
        emoji="⚔️"
        title="Common Attacks"
        caption="Four attacks every developer must know — with the one-line defense that stops each of them."
        chips={["attack · always has a defense"]}
        visual={<AttacksRealisticVisual />}
      />

      <SubTopic
        id="phishing-vishing"
        emoji="🎣"
        title="Phishing"
        caption="Fake emails that trick you into clicking a bad link. Learn to spot the red flags: wrong sender, urgent tone, weird links."
        chips={["check the sender", "urgent = suspicious", "bit.ly = risky"]}
        visual={<PhishingRealisticVisual />}
      />

      <SubTopic
        id="defenses"
        emoji="🛡️"
        title="Defenses"
        caption="No single wall stops everything. Layer many small defenses — an attacker has to break every ring to reach you."
        chips={["password + 2FA", "encryption + firewall", "updates + backups"]}
        visual={<DefensesRealisticVisual />}
      />
      <KeyLearning summaryKey="security" />
      <LessonPack lessonKey="security" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7 — Artificial Intelligence
 * ────────────────────────────────────────────────────────────── */

function AI() {
  return (
    <Section chapterId="ai">
      <ChapterHeader
        number="7"
        emoji="🤖"
        title="Artificial Intelligence"
        hook="Machines that learn from examples. This is how ChatGPT, Google Translate, and face-unlock work."
        deckKey="ai"
      />

      <SubTopic
        id="ai"
        emoji="🧠"
        title="What is AI?"
        caption="Computers that can read, write, see, and decide — a little like a person."
        chips={["not magic", "trained from examples"]}
        visual={<AiBrainVisual />}
      />

      <SubTopic
        id="machine-learning"
        emoji="🎯"
        title="Machine Learning"
        caption="Show a computer many examples. It learns the pattern."
        chips={["show cats and dogs", "computer guesses new photos"]}
        visual={<MLVisual />}
      />

      <SubTopic
        id="deep-learning"
        emoji="🕸️"
        title="Deep Learning"
        caption="Layers and layers of tiny math cells connected like a brain."
        chips={["input → thinking → answer"]}
        visual={<NeuralNetVisual />}
      />

      <SubTopic
        id="nlp"
        emoji="💬"
        title="Language (NLP)"
        caption="Teaching AI to understand and write like a person."
        chips={["ChatGPT · Google Translate", "chatbots · voice assistants"]}
        visual={<NLPVisual />}
      />

      <SubTopic
        id="ai-ethics"
        emoji="⚖️"
        title="AI Ethics"
        caption="AI is powerful. Use it kindly, honestly, and carefully."
        chips={["don&rsquo;t share private data", "double-check its answers"]}
        visual={<EthicsVisual />}
      />

      <SubTopic
        id="future-of-ai"
        emoji="🚀"
        title="The Future"
        caption="AI is only just beginning. Your generation will shape what comes next."
        chips={["stay curious", "keep learning"]}
        visual={<FutureVisual />}
      />
      <KeyLearning summaryKey="ai" />
      <LessonPack lessonKey="ai" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8 — Conclusion
 * ────────────────────────────────────────────────────────────── */

function Conclusion() {
  const wins = [
    { emoji: "⚙️", label: "You know the parts" },
    { emoji: "🌐", label: "You know the internet" },
    { emoji: "🛡️", label: "You know how to stay safe" },
    { emoji: "🤖", label: "You met AI" },
  ];
  return (
    <Section chapterId="conclusion">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent-bright">
          <Award className="h-3.5 w-3.5" />
          You made it!
        </div>

        <h2 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Great job, class! <br className="hidden sm:block" />
          <span className="hero-gradient">You&rsquo;re now tech-smart.</span>
        </h2>

        <p className="mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-neutral-300 sm:text-base">
          You started with parts you could touch and finished with machines
          that learn. Not bad for one course.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wins.map((w, i) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
            >
              <div className="text-3xl">{w.emoji}</div>
              <div className="mt-2 text-[12.5px] font-semibold text-white">
                {w.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-accent/30 bg-accent-soft p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-accent-bright">
            <Award className="h-4 w-4" /> Certificate
          </div>
          <p className="mt-2 text-[16px] font-semibold text-white">
            🎓 This certifies that you have completed the IDIC
            Introduction to Information Technology course.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-neutral-400">
            <div>Instructor: <span className="text-white">Professor · IDIC</span></div>
            <div>Year: <span className="text-white"><ClientYear /></span></div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#welcome"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-[13.5px] font-medium text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to the top
            </a>
            <DeckDownloadButton deckKey="conclusion" variant="hero" />
          </div>
          <p className="text-[13px] italic text-neutral-400">
            &ldquo;Keep exploring. Keep asking &lsquo;how does that work?&rsquo;&rdquo;
          </p>
        </div>
      </motion.div>

      <div className="flex justify-center pt-6">
        <Sparkles className="h-6 w-6 text-accent-bright" />
      </div>

      <LessonPack lessonKey="conclusion" />
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Footer
 * ────────────────────────────────────────────────────────────── */

// Client-only year output. Rendering `new Date().getFullYear()` inline would
// hydrate a stale build-time year against the current client year and cause a
// hydration mismatch on statically prerendered pages.
function ClientYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const raf = window.requestAnimationFrame(() =>
      setYear(new Date().getFullYear())
    );
    return () => window.cancelAnimationFrame(raf);
  }, []);
  return <>{year ?? ""}</>;
}

function PageFooter() {
  return (
    <footer className="mt-8 border-t border-white/10 pt-6 text-[12.5px] text-neutral-500">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>Made for IDIC students · learn by seeing, not just reading.</div>
        <div>© <ClientYear /> · Classroom use.</div>
      </div>
    </footer>
  );
}
