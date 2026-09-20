"use client";

// LessonPack: end-of-chapter block with a bilingual glossary
// (clickable term cards open a big teaching modal), a 20-question
// practice quiz, and a "Download PDF Exam" button.

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenCheck,
  Check,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  Info,
  Languages,
  RotateCcw,
  Send,
  Trophy,
  X as XIcon,
} from "lucide-react";
import { LESSONS, type Lesson, type Term } from "@/lib/lecture-data";
import { useLessonSession } from "@/components/lecture/LessonSession";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LmsSubmitDialog } from "@/components/lms/LmsSubmitDialog";
import type { ChapterMeta } from "@/lib/lms";

export function LessonPack({ lessonKey }: { lessonKey: keyof typeof LESSONS }) {
  const lesson = LESSONS[lessonKey];
  if (!lesson) return null;

  const termsId = `${String(lessonKey)}-terms`;
  const quizId = `${String(lessonKey)}-quiz`;
  const key = String(lessonKey);

  // Derive course slug from the lesson key. Rust and ML lessons are
  // namespaced (rust-welcome, ml-regression, …) — everything else belongs
  // to the IT introduction course.
  const courseSlug: ChapterMeta["courseSlug"] = key.startsWith("rust-")
    ? "rust"
    : key.startsWith("ml-")
      ? "ml"
      : "it-intro";

  const chapter: ChapterMeta = {
    courseSlug,
    chapterKey: key,
    chapterNumber: lesson.chapterNumber,
    chapterTitle: lesson.chapterTitle,
  };

  return (
    <div className="space-y-6">
      <Glossary lesson={lesson} anchorId={termsId} />
      <Quiz lesson={lesson} anchorId={quizId} chapter={chapter} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Glossary — clickable English ↔ Khmer term cards
 * ────────────────────────────────────────────────────────────── */

function Glossary({ lesson, anchorId }: { lesson: Lesson; anchorId: string }) {
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);
  // Collapsed by default -- students see a compact chapter footer with
  // a "Key Terms" pill and can expand it when the professor asks them to
  // review vocabulary. Reduces scroll length dramatically.
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.section
        id={anchorId}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${anchorId}-content`}
          className={cn(
            "flex w-full items-center gap-3 text-left transition-colors",
            open ? "mb-4" : ""
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-2xl">
            🈶
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Key Terms · ពាក្យសំខាន់
            </h3>
            <p className="text-[13px] text-neutral-400">
              {lesson.terms.length} terms · click to {open ? "collapse" : "expand"}
            </p>
          </div>
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-neutral-300 sm:flex">
            <Languages className="h-3.5 w-3.5" /> EN · KM
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-neutral-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={`${anchorId}-content`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lesson.terms.map((t) => (
                  <button
                    key={t.en}
                    type="button"
                    onClick={() => setActiveTerm(t)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-left transition-all hover:-translate-y-[1px] hover:border-accent/50 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/25 to-sky-500/15 text-xl">
                      {t.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-semibold text-white">
                        {t.en}
                      </div>
                      <div
                        className="mt-0.5 truncate text-[13px] text-accent-bright"
                        lang="km"
                        style={{
                          fontFamily:
                            "var(--font-noto-khmer), 'Noto Sans Khmer', 'Khmer OS Battambang', sans-serif",
                        }}
                      >
                        {t.km}
                      </div>
                    </div>
                    <Info className="h-3.5 w-3.5 shrink-0 text-neutral-500 transition-colors group-hover:text-accent-bright" />
                  </button>
                ))}
              </div>

              <p className="mt-3 text-center text-[11px] text-neutral-500">
                💡 Hover for a hint · tap for full detail with picture
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <TermModal term={activeTerm} onClose={() => setActiveTerm(null)} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * TermModal — the big teaching card
 * ────────────────────────────────────────────────────────────── */

function TermModal({ term, onClose }: { term: Term | null; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    if (!term) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [term, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!term) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [term]);

  return (
    <AnimatePresence>
      {term && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1a30] via-[#0b1428] to-[#0a0f1a] shadow-2xl"
          >
            {/* Ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 20% 20%, rgba(77,141,255,0.25), transparent 60%)," +
                  "radial-gradient(500px 250px at 90% 100%, rgba(125,211,252,0.18), transparent 60%)",
              }}
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-neutral-200 backdrop-blur transition-colors hover:bg-white/10"
            >
              <XIcon className="h-4 w-4" />
            </button>

            <div className="relative p-6 sm:p-8">
              {/* Big animated icon */}
              <motion.div
                initial={{ scale: 0.6, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-accent/30 to-sky-500/15 shadow-[0_0_60px_rgba(77,141,255,0.35)]"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl"
                >
                  {term.icon}
                </motion.div>
              </motion.div>

              {/* Term names */}
              <div className="mt-6 text-center">
                <div className="text-[11px] uppercase tracking-[0.22em] text-accent-bright">
                  Key Term
                </div>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {term.en}
                </h2>
                <div
                  className="mt-2 text-xl text-sky-300"
                  lang="km"
                  style={{
                    fontFamily:
                      "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif",
                  }}
                >
                  {term.km}
                </div>
              </div>

              {/* Detail card */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] font-mono uppercase tracking-widest text-accent-bright">
                  Simple explanation
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-white">
                  {term.detail}
                </p>
              </div>

              {/* Teacher note */}
              <div className="mt-4 flex items-center justify-between text-[11.5px] text-neutral-400">
                <span>💡 Read this aloud in class</span>
                <span>Press ESC to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Quiz — 20 multiple-choice questions
 * ────────────────────────────────────────────────────────────── */

function Quiz({
  lesson,
  anchorId,
  chapter,
}: {
  lesson: Lesson;
  anchorId: string;
  chapter: ChapterMeta;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  // Collapsed by default -- students expand only when they want to attempt
  // the quiz, matching the collapsed Key Terms section above.
  const [open, setOpen] = useState(false);
  const { locked } = useLessonSession();

  // Timestamp the moment the student first sees this quiz — used as
  // "started_at" on the server side.
  const startedAt = useMemo(() => new Date().toISOString(), []);

  const totalPoints = lesson.quiz.length * 2;
  const correctCount = Object.entries(answers).filter(
    ([qi, choice]) => lesson.quiz[Number(qi)]?.answer === choice
  ).length;
  const scored = correctCount * 2;
  const attempted = Object.keys(answers).length;

  const select = (qi: number, oi: number) => {
    if (locked) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const reset = () => {
    if (locked) return;
    setAnswers({});
    setShowAnswers(false);
  };

  const download = async () => {
    try {
      setDownloading(true);
      const { buildQuizPdf } = await import("@/lib/quiz-pdf");
      const doc = await buildQuizPdf(lesson);
      doc.save(
        `IDIC-Chapter${lesson.chapterNumber}-${slugify(lesson.chapterTitle)}-Quiz.pdf`
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.section
      id={anchorId}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6"
    >
      {/* Header (clickable to expand/collapse the whole quiz body) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${anchorId}-content`}
        className="flex w-full flex-wrap items-start gap-3 text-left"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-2xl">
          📝
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-white sm:text-2xl">Practice Quiz</h3>
          <p className="text-[13px] text-neutral-400">
            {lesson.quiz.length} questions ·{" "}
            <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-300">
              2 pts
            </span>{" "}
            each · <b className="text-white">{totalPoints}</b> total · click to{" "}
            {open ? "collapse" : "expand"}
          </p>
        </div>

        {/* Score chip stays visible even when collapsed so students see
            their progress at a glance. */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-300" />
          <span className="text-[13px] font-semibold text-white">
            {scored} / {totalPoints}
          </span>
          <span className="hidden text-[11px] text-neutral-400 sm:inline">
            · {attempted}/{lesson.quiz.length} answered
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-neutral-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${anchorId}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >

      {/* Locked banner */}
      {locked && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2.5 text-[13px] text-rose-100">
          <Lock className="h-4 w-4 shrink-0 text-rose-300" />
          <div>
            <b>Session ended.</b> Answers are locked. Press{" "}
            <span className="font-mono text-white">Reset</span> in the top clock
            bar to start a new session.
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAnswers((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
            showAnswers
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
              : "border-white/15 bg-white/[0.04] text-neutral-200 hover:bg-white/10"
          )}
        >
          {showAnswers ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {showAnswers ? "Hide answers" : "Show answers"}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={locked}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
            locked
              ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-neutral-600"
              : "border-white/15 bg-white/[0.04] text-neutral-200 hover:bg-white/10"
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button
          type="button"
          onClick={() => setSubmitOpen(true)}
          disabled={submittedId !== null || Object.keys(answers).length === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/25 px-3.5 py-1.5 text-[12.5px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-50"
          title={
            submittedId
              ? "Already submitted"
              : Object.keys(answers).length === 0
                ? "Answer at least one question first"
                : "Send your answers to the teacher"
          }
        >
          <Send className="h-3.5 w-3.5" />
          {submittedId ? "Submitted" : "Submit online"}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-[12.5px] font-semibold text-accent-bright hover:bg-accent/25 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? "Preparing…" : "Download PDF exam"}
        </button>
        <div className="ml-auto hidden items-center gap-1 text-[11px] text-neutral-500 sm:flex">
          <BookOpenCheck className="h-3.5 w-3.5" />
          Practice mode
        </div>
      </div>

      <LmsSubmitDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmitted={(id) => setSubmittedId(id)}
        chapter={chapter}
        title={`Submit your quiz — Chapter ${lesson.chapterNumber}`}
        description={`You've answered ${Object.keys(answers).length} of ${lesson.quiz.length} questions.`}
        payload={{
          kind: "quiz",
          answers: Object.entries(answers).map(([qi, oi]) => ({
            questionIndex: Number(qi),
            selectedOption: Number(oi),
          })),
          startedAt,
          timeSpentSeconds: Math.max(
            0,
            Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000),
          ),
        }}
      />

      {/* Questions */}
      <ol className="mt-6 space-y-4">
        {lesson.quiz.map((q, qi) => {
          const chosen = answers[qi];
          const isCorrect = chosen === q.answer;
          return (
            <li
              key={qi}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] font-mono text-[12px] text-accent-bright">
                  {qi + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14.5px] font-medium leading-snug text-white">
                      {q.q}
                    </p>
                    <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-300">
                      2 pts
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oi) => {
                      const chosenThis = chosen === oi;
                      const correctThis = q.answer === oi;
                      const stateClass = showAnswers
                        ? correctThis
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                          : chosenThis
                            ? "border-rose-400/50 bg-rose-400/10 text-rose-100"
                            : "border-white/10 bg-white/[0.02] text-neutral-300"
                        : chosenThis
                          ? "border-accent/50 bg-accent/15 text-white"
                          : "border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:bg-white/[0.05]";
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => select(qi, oi)}
                          disabled={locked}
                          className={cn(
                            "flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-[13.5px] transition-colors",
                            stateClass,
                            locked && "cursor-not-allowed opacity-80"
                          )}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                            {"ABCD"[oi]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {showAnswers && correctThis && (
                            <Check className="h-4 w-4 shrink-0 text-emerald-300" />
                          )}
                          {showAnswers && chosenThis && !correctThis && (
                            <XIcon className="h-4 w-4 shrink-0 text-rose-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswers && chosen !== undefined && (
                    <div
                      className={cn(
                        "mt-2 rounded-md px-3 py-1.5 text-[11.5px]",
                        isCorrect
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-rose-400/10 text-rose-300"
                      )}
                    >
                      {isCorrect ? "✓ Correct (+2 points)" : `✗ Correct answer: ${"ABCD"[q.answer]}`}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {showAnswers && (
        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-300" />
            <div className="text-lg font-semibold text-white">
              Score: {scored} / {totalPoints}
            </div>
          </div>
          <p className="mt-1 text-[13px] text-neutral-200">
            {correctCount} of {lesson.quiz.length} correct.{" "}
            {attempted < lesson.quiz.length &&
              `${lesson.quiz.length - attempted} question(s) were left blank.`}
          </p>
        </div>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
