"use client";

// A weekly assignment — the culminating project for each chapter.
// Bigger than a Challenge: a scenario + learning goals + numbered tasks
// + optional stretch goals + reference solution.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  ListChecks,
  Send,
  Sparkles,
  Timer,
} from "lucide-react";
import { HomeworkSubmitDialog } from "@/components/lms/HomeworkSubmitDialog";
import type { ChapterMeta } from "@/lib/lms";
export type WeeklyAssignment = {
  /** e.g. 3 — becomes "Week 3". */
  week: number;
  /** Short imperative title. */
  title: string;
  /** Rough completion time — displayed to help students plan. */
  estimatedTime: string;
  /** 2–4 sentence scenario / story hook. */
  scenario: string;
  /** What the student will practice by doing this. */
  learningGoals: string[];
  /** Numbered concrete deliverables. */
  tasks: string[];
  /** Optional starter code with `// TODO` markers. */
  starter?: string;
  /** What the finished program should print. */
  sampleOutput?: string;
  /** Reference solution — hidden by default. */
  solution: string;
  /** Optional bonus tasks for students who finish early. */
  stretch?: string[];
};

const RUST_PLAYGROUND = "https://play.rust-lang.org/";

function playgroundUrl(code: string): string {
  const params = new URLSearchParams({
    version: "stable",
    mode: "debug",
    edition: "2021",
    code,
  });
  return `${RUST_PLAYGROUND}?${params.toString()}`;
}

/* ─────────────────────────────────────────────────────────────── */

export function WeeklyAssignmentCard({
  assignment,
  chapterId,
  chapterNumber,
  chapterTitle,
}: {
  assignment: WeeklyAssignment;
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const chapter: ChapterMeta = {
    courseSlug: "rust",
    chapterKey: chapterId,
    chapterNumber,
    chapterTitle,
  };

  const download = async () => {
    try {
      setDownloading(true);
      const { buildHomeworkPdf } = await import("@/lib/homework-pdf");
      const doc = await buildHomeworkPdf(assignment, { chapterNumber, chapterTitle });
      const slug = assignment.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      doc.save(`IDIC-Rust-Chapter${chapterNumber}-${slug}-Homework.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.06] via-white/[0.02] to-white/[0.01]"
    >
      {/* Header */}
      <div className="border-b border-white/5 bg-white/[0.02] p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-widest text-violet-200">
            Week {assignment.week}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] text-neutral-300">
            <Timer className="h-3 w-3" />
            {assignment.estimatedTime}
          </span>
        </div>
        <h4 className="mt-3 text-lg font-semibold text-white sm:text-xl">
          {assignment.title}
        </h4>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-300">
          {assignment.scenario}
        </p>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {/* Learning goals */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            You&rsquo;ll practice
          </div>
          <div className="flex flex-wrap gap-1.5">
            {assignment.learningGoals.map((g) => (
              <span
                key={g}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-neutral-200"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            <ListChecks className="h-3.5 w-3.5 text-violet-300" />
            Tasks
          </div>
          <ol className="space-y-1.5">
            {assignment.tasks.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-neutral-200">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-violet-400/40 bg-violet-400/10 font-mono text-[10.5px] font-bold text-violet-200">
                  {i + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: taskToHtml(t) }} />
              </li>
            ))}
          </ol>
        </div>

        {/* Starter code, if any */}
        {assignment.starter && (
          <CodeBlock label="Starter" code={assignment.starter} onCopy={copy} copied={copied} />
        )}

        {/* Sample output */}
        {assignment.sampleOutput && (
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Sample output
            </div>
            <pre className="thin-scroll overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-emerald-200">
              {assignment.sampleOutput}
            </pre>
          </div>
        )}

        {/* Stretch goals */}
        {assignment.stretch && assignment.stretch.length > 0 && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3">
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-amber-200">
              🌟 Stretch goals
            </div>
            <ul className="ml-4 list-disc space-y-1 text-[12.5px] text-amber-100/90">
              {assignment.stretch.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubmitOpen(true)}
            disabled={submittedId !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1.5 text-[12px] font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/30 disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" />
            {submittedId ? "Submitted" : "Submit online"}
          </button>
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/20 px-3 py-1.5 text-[12px] font-semibold text-violet-100 transition-colors hover:bg-violet-500/30 disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Building PDF…
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download homework PDF
              </>
            )}
          </button>
          <a
            href={playgroundUrl(assignment.starter ?? "fn main() {\n    // your code here\n}\n")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1.5 text-[12px] font-medium text-orange-200 transition-colors hover:bg-orange-400/20"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Try in Playground
          </a>
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[12px] font-medium text-neutral-200 transition-colors hover:bg-white/10"
          >
            {showSolution ? (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Hide solution
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Show solution
              </>
            )}
          </button>
        </div>

        {/* Solution */}
        <AnimatePresence initial={false}>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CodeBlock
                label="Reference solution"
                code={assignment.solution}
                onCopy={copy}
                copied={copied}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HomeworkSubmitDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitted={(id) => setSubmittedId(id)}
        chapter={chapter}
        weekLabel={`Week ${assignment.week} · ${assignment.title}`}
        starter={assignment.starter}
      />
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function taskToHtml(t: string): string {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[11.5px] text-violet-200">$1</code>',
    );
}

function CodeBlock({
  label,
  code,
  onCopy,
  copied,
}: {
  label: string;
  code: string;
  onCopy: (c: string) => void;
  copied: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-widest text-neutral-400">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onCopy(code)}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center rounded px-1.5 py-0.5 text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {expanded && (
        <pre className="thin-scroll overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-neutral-100">
          {code}
        </pre>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * AssignmentSet — chapter-level wrapper with a violet header.
 * ────────────────────────────────────────────────────────────── */

export function AssignmentSet({
  chapterId,
  chapterNumber,
  chapterTitle,
  assignment,
}: {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  assignment: WeeklyAssignment;
}) {
  return (
    <motion.section
      id={`${chapterId}-assignment`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24 rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-500/[0.05] to-white/[0.01] p-5 backdrop-blur-sm sm:p-6"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/40 bg-violet-400/15 text-2xl">
          🎯
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-white sm:text-2xl">Weekly Assignment</h3>
          <p className="text-[13px] text-neutral-400">
            The chapter&rsquo;s capstone project. Click &ldquo;Download homework PDF&rdquo; to hand this out to students.
          </p>
        </div>
      </div>
      <WeeklyAssignmentCard
        assignment={assignment}
        chapterId={chapterId}
        chapterNumber={chapterNumber}
        chapterTitle={chapterTitle}
      />
    </motion.section>
  );
}
