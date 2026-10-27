"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Boxes,
  LayoutGrid,
  Rocket,
  Rows3,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { Reveal, EASE } from "@/components/landing/ui/primitives";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

const VIEW_STORAGE_KEY = "idic:courses:view";

// The four courses currently offered on the platform.
// Order: foundational → applied.
type Course = {
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
  tagline: string;
  bullets: string[];
  status: "Available" | "New" | "In progress";
  accent: "accent" | "emerald" | "fuchsia" | "orange";
};

const COURSES: Course[] = [
  {
    href: "/lecture",
    icon: Boxes,
    label: "IT · Foundations",
    title: "Introduction to Information Technology",
    tagline:
      "The nine core topics of IT — hardware, software, networking, web, databases, security, AI — with visuals for every chapter.",
    bullets: ["9 chapters", "Bilingual key terms (KH · EN)", "20-question quiz per chapter"],
    status: "Available",
    accent: "accent",
  },
  {
    href: "/statistics",
    icon: BarChart3,
    label: "Statistics",
    title: "Statistics with Cambodian data",
    tagline:
      "Descriptive stats, probability, sampling, hypothesis tests, correlation and regression — every example uses Cambodian rice, ABA, Angkor and market data.",
    bullets: ["8 chapters", "Runnable Python exercises", "Boxplots, bell curves, CIs"],
    status: "New",
    accent: "emerald",
  },
  {
    href: "/ml",
    icon: BrainCircuit,
    label: "Machine Learning",
    title: "Machine Learning, Cambodia-flavoured",
    tagline:
      "From what ML is, to regression, classification, neural nets, LLMs and RAG — with worked examples on rice yields, moto prices and Khmer OCR.",
    bullets: ["8 chapters", "scikit-learn, pandas, numpy", "Real-life visuals per lesson"],
    status: "Available",
    accent: "fuchsia",
  },
  {
    href: "/rust",
    icon: Rocket,
    label: "Programming · Rust",
    title: "Rust Programming",
    tagline:
      "Ownership, structs, enums, collections, traits and a real CLI project — every lesson pairs an animated visual with a runnable exercise.",
    bullets: ["8 chapters", "Live code exercises", "Bilingual glossary + quiz"],
    status: "Available",
    accent: "orange",
  },
];

const ACCENT: Record<
  Course["accent"],
  {
    ring: string;
    iconBg: string;
    iconText: string;
    glow: string;
    chip: string;
    hoverBorder: string;
    linkText: string;
  }
> = {
  accent: {
    ring: "border-line",
    iconBg: "bg-accent/10 border-accent/30",
    iconText: "text-accent-bright",
    glow: "bg-[radial-gradient(400px_260px_at_20%_10%,rgba(77,141,255,0.18),transparent_60%)]",
    chip: "border-accent/40 bg-accent/10 text-accent-bright",
    hoverBorder: "hover:border-accent/50",
    linkText: "text-accent-bright",
  },
  emerald: {
    ring: "border-line",
    iconBg: "bg-emerald-400/10 border-emerald-400/30",
    iconText: "text-emerald-300",
    glow: "bg-[radial-gradient(400px_260px_at_20%_10%,rgba(16,185,129,0.18),transparent_60%)]",
    chip: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    hoverBorder: "hover:border-emerald-400/50",
    linkText: "text-emerald-300",
  },
  fuchsia: {
    ring: "border-line",
    iconBg: "bg-fuchsia-400/10 border-fuchsia-400/30",
    iconText: "text-fuchsia-300",
    glow: "bg-[radial-gradient(400px_260px_at_20%_10%,rgba(217,70,239,0.18),transparent_60%)]",
    chip: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200",
    hoverBorder: "hover:border-fuchsia-400/50",
    linkText: "text-fuchsia-300",
  },
  orange: {
    ring: "border-line",
    iconBg: "bg-orange-400/10 border-orange-400/30",
    iconText: "text-orange-300",
    glow: "bg-[radial-gradient(400px_260px_at_20%_10%,rgba(251,146,60,0.18),transparent_60%)]",
    chip: "border-orange-400/40 bg-orange-400/10 text-orange-200",
    hoverBorder: "hover:border-orange-400/50",
    linkText: "text-orange-300",
  },
};

// Courses: shows the four courses IDIC currently offers, each as
// a clickable card that opens the course page.
export function Courses() {
  const [view, setView] = useState<ViewMode>("list");

  // Hydrate the saved choice on the client so SSR always renders the default
  // ("list") and we avoid a hydration mismatch.
  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  const updateView = (v: ViewMode) => {
    setView(v);
    window.localStorage.setItem(VIEW_STORAGE_KEY, v);
  };

  return (
    <section id="courses" className="relative scroll-mt-24 px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-bright">
            IDIC Courses
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Learn IT, Stats, ML, and Rust — with Cambodian data.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Four structured courses, each with bilingual key terms, real-life visuals,
            and end-of-chapter quizzes. Free, open, and taught with examples
            students can actually recognise.
          </p>
        </Reveal>

        <div className="mt-10 flex justify-center sm:mt-12">
          <ViewToggle view={view} onChange={updateView} />
        </div>

        <div
          className={cn(
            "mt-8 grid gap-5",
            view === "grid" ? "sm:grid-cols-2" : "grid-cols-1"
          )}
        >
          {COURSES.map((course, i) => {
            const a = ACCENT[course.accent];
            const Icon = course.icon;
            return (
              <motion.div
                key={course.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              >
                {view === "grid" ? (
                  <CourseCardGrid course={course} accent={a} icon={Icon} index={i} />
                ) : (
                  <CourseCardList course={course} accent={a} icon={Icon} index={i} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Course layout"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/40 p-1 backdrop-blur-md"
    >
      <ToggleButton
        active={view === "list"}
        onClick={() => onChange("list")}
        label="List view"
        icon={Rows3}
      />
      <ToggleButton
        active={view === "grid"}
        onClick={() => onChange("grid")}
        label="Grid view"
        icon={LayoutGrid}
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-accent/15 text-accent-bright"
          : "text-muted hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {label.replace(" view", "")}
    </button>
  );
}

function CourseCardGrid({
  course,
  accent: a,
  icon: Icon,
  index,
}: {
  course: Course;
  accent: (typeof ACCENT)[Course["accent"]];
  icon: LucideIcon;
  index: number;
}) {
  return (
    <Link
      href={course.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-surface/40 p-6 backdrop-blur-md transition-all duration-300 sm:p-8",
        a.ring,
        a.hoverBorder,
        "hover:-translate-y-0.5"
      )}
    >
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", a.glow)} />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-2xl border",
            a.iconBg,
            a.iconText
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <StatusChip status={course.status} chipClass={a.chip} />
      </div>

      <p className={cn("relative mt-6 font-mono text-[11px] uppercase tracking-widest", a.linkText)}>
        {course.label}
      </p>
      <h3 className="relative mt-2 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {course.title}
      </h3>
      <p className="relative mt-3 text-pretty text-[14px] leading-relaxed text-muted">
        {course.tagline}
      </p>

      <ul className="relative mt-5 space-y-1.5">
        {course.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
            <Sparkle className={cn("mt-0.5 h-3 w-3 shrink-0", a.iconText)} strokeWidth={2} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex items-center justify-between">
        <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] font-medium", a.linkText)}>
          Open course
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
        <span className="font-mono text-[11px] tracking-widest text-muted-2">
          0{index + 1}
        </span>
      </div>
    </Link>
  );
}

function CourseCardList({
  course,
  accent: a,
  icon: Icon,
  index,
}: {
  course: Course;
  accent: (typeof ACCENT)[Course["accent"]];
  icon: LucideIcon;
  index: number;
}) {
  return (
    <Link
      href={course.href}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border bg-surface/40 p-5 backdrop-blur-md transition-all duration-300 sm:p-6",
        a.ring,
        a.hoverBorder,
        "hover:-translate-y-0.5"
      )}
    >
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", a.glow)} />

      <div className="relative flex w-full items-start gap-4 sm:items-center sm:gap-6">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border sm:h-14 sm:w-14",
            a.iconBg,
            a.iconText
          )}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className={cn("font-mono text-[11px] uppercase tracking-widest", a.linkText)}>
              {course.label}
            </p>
            <StatusChip status={course.status} chipClass={a.chip} />
          </div>
          <h3 className="mt-1.5 text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-pretty text-[13.5px] leading-relaxed text-muted sm:line-clamp-none">
            {course.tagline}
          </p>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
          <span className="font-mono text-[11px] tracking-widest text-muted-2">
            0{index + 1}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[13px] font-medium",
              a.linkText
            )}
          >
            Open
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function StatusChip({
  status,
  chipClass,
}: {
  status: Course["status"];
  chipClass: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        chipClass
      )}
    >
      {status === "New" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {status}
    </span>
  );
}
