"use client";

// A minimal, welcoming landing page: a short hello and a grid of the courses
// I teach. Each card links straight into that course (or shows "coming soon"
// when the course hasn't launched yet).

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Clock,
  Cpu,
  GraduationCap,
  Pencil,
  Rocket,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/lecture/ThemeToggle";

type CourseStatus = "available" | "coming-soon";

type Course = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  chips: string[];
  href: string;
  status: CourseStatus;
  accent: string; // gradient class for the corner glow
  icon: React.ComponentType<{ className?: string }>;
};

const COURSES: Course[] = [
  {
    id: "it",
    emoji: "💻",
    title: "Introduction to IT",
    subtitle: "For students starting from zero",
    description:
      "Eight chapters that take you from what's inside a computer, through the internet, all the way to AI. Lots of pictures, plain English, no jargon.",
    chips: ["Hardware", "Software", "Networking", "Web", "Security", "AI"],
    href: "/lecture",
    status: "available",
    accent: "from-sky-400/25 via-accent/15 to-transparent",
    icon: Cpu,
  },
  {
    id: "rust",
    emoji: "🦀",
    title: "Rust Programming",
    subtitle: "Fast, safe systems programming",
    description:
      "Eight chapters, real-life animated lessons, and hands-on code exercises. Learn ownership, structs, traits, and build a working CLI todo app.",
    chips: ["Ownership", "Traits", "Iterators", "Live exercises"],
    href: "/rust",
    status: "available",
    accent: "from-orange-400/25 via-amber-500/15 to-transparent",
    icon: Rocket,
  },
  {
    id: "ml",
    emoji: "🤖",
    title: "Machine Learning",
    subtitle: "Taught with Cambodian data",
    description:
      "Eight chapters, real Python exercises, every example built from Cambodian life — Battambang rice yields, Phnom Penh moto prices, ABA fraud, Khmer letters. From regression to neural networks.",
    chips: ["🇰🇭 Cambodia data", "Regression", "Classification", "Neural nets", "Python"],
    href: "/ml",
    status: "available",
    accent: "from-fuchsia-400/25 via-purple-500/15 to-transparent",
    icon: BrainCircuit,
  },
];

export function CoursesLanding() {
  return (
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

      <TopBar />

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Hello />
        <CourseGrid />
        <Footer />
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0a0d14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-accent-bright">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-white">
            Kanel&rsquo;s Classroom
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-full border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] text-white hover:border-accent/50 hover:bg-white/10" />
          <Link
            href="/whiteboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-all hover:border-accent/50 hover:bg-white/10"
          >
            <Pencil className="h-3.5 w-3.5" />
            Whiteboard
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-all hover:border-accent/50 hover:bg-white/10"
          >
            <UserCircle2 className="h-3.5 w-3.5" />
            About me
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Hello() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 text-center sm:mb-14"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent-bright">
        <Sparkles className="h-3.5 w-3.5" />
        Welcome
      </div>

      <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
        Hi, I&rsquo;m Kanel. <br className="hidden sm:block" />
        <span className="hero-gradient">Pick a course to start.</span>
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-neutral-400 sm:text-base">
        These are the courses I teach. Click one to jump in.
      </p>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────── */

function CourseGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
      {COURSES.map((c, i) => (
        <CourseCard key={c.id} course={c} index={i} />
      ))}
    </div>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const isAvailable = course.status === "available";
  const Icon = course.icon;

  const cardBody = (
    <>
      {/* Corner glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${course.accent} blur-3xl`}
      />

      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-3xl">
            {course.emoji}
          </div>
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-widest text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-widest text-amber-300">
              <Clock className="h-3 w-3" />
              Coming soon
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-5">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <Icon className="h-5 w-5 text-accent-bright" />
            {course.title}
          </h2>
          <p className="mt-1 text-[13.5px] text-neutral-400">{course.subtitle}</p>
        </div>

        {/* Description */}
        <p className="mt-4 text-[14.5px] leading-relaxed text-neutral-300">
          {course.description}
        </p>

        {/* Chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {course.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11.5px] text-neutral-300"
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Spacer + CTA */}
        <div className="mt-auto pt-6">
          <div
            className={
              isAvailable
                ? "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-accent px-4 py-2 text-[13px] font-medium text-white shadow-[0_6px_20px_rgba(77,141,255,0.35)] transition-all group-hover:scale-[1.02] group-hover:bg-accent-bright"
                : "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-neutral-400"
            }
          >
            {isAvailable ? (
              <>
                Enter course
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            ) : (
              <>
                Materials in progress
                <Clock className="h-3.5 w-3.5" />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const wrapperClass =
    "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {isAvailable ? (
        <Link href={course.href} className={wrapperClass + " block h-full"}>
          {cardBody}
        </Link>
      ) : (
        <div className={wrapperClass + " h-full cursor-not-allowed opacity-90"}>
          {cardBody}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-6 text-center text-[12.5px] text-neutral-500">
      Made with <span className="text-accent-bright">♥</span> for my students —
      <Link href="/profile" className="ml-1 text-neutral-300 hover:text-white">
        meet the instructor
      </Link>
      .
    </footer>
  );
}
