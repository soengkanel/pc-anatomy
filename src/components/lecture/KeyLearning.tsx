"use client";

// End-of-chapter "Key Learning" card — a radial mindmap plus a short list
// of takeaways. Placed just before the LessonPack in each chapter section
// so it renders on the /lecture page AND appears as the last slide of the
// generated PDF deck.

import { motion } from "framer-motion";
import { Lightbulb, Sparkles } from "lucide-react";
import { CHAPTER_SUMMARIES } from "@/lib/chapter-summary";
import { cn } from "@/lib/utils";

type Accent = "sky" | "amber" | "emerald" | "violet" | "rose" | "fuchsia";

// Small palette lookup keeps the JSX tidy while letting each chapter tint
// its own mindmap. Colours pulled from Tailwind's default swatches so they
// stay coherent with the rest of the lecture UI.
const ACCENTS: Record<Accent, {
  ring: string;
  fill: string;
  line: string;
  chip: string;
  chipText: string;
  glow: string;
}> = {
  sky:      { ring: "border-sky-400/40",     fill: "bg-sky-500/15",     line: "stroke-sky-300/60",     chip: "bg-sky-500/15 border-sky-400/40",     chipText: "text-sky-100",     glow: "rgba(56, 189, 248, 0.28)" },
  amber:    { ring: "border-amber-400/40",   fill: "bg-amber-500/15",   line: "stroke-amber-300/60",   chip: "bg-amber-500/15 border-amber-400/40", chipText: "text-amber-100",   glow: "rgba(251, 191, 36, 0.28)" },
  emerald:  { ring: "border-emerald-400/40", fill: "bg-emerald-500/15", line: "stroke-emerald-300/60", chip: "bg-emerald-500/15 border-emerald-400/40", chipText: "text-emerald-100", glow: "rgba(52, 211, 153, 0.28)" },
  violet:   { ring: "border-violet-400/40",  fill: "bg-violet-500/15",  line: "stroke-violet-300/60",  chip: "bg-violet-500/15 border-violet-400/40",   chipText: "text-violet-100",  glow: "rgba(167, 139, 250, 0.28)" },
  rose:     { ring: "border-rose-400/40",    fill: "bg-rose-500/15",    line: "stroke-rose-300/60",    chip: "bg-rose-500/15 border-rose-400/40",       chipText: "text-rose-100",    glow: "rgba(251, 113, 133, 0.28)" },
  fuchsia:  { ring: "border-fuchsia-400/40", fill: "bg-fuchsia-500/15", line: "stroke-fuchsia-300/60", chip: "bg-fuchsia-500/15 border-fuchsia-400/40", chipText: "text-fuchsia-100", glow: "rgba(232, 121, 249, 0.28)" },
};

export function KeyLearning({ summaryKey }: { summaryKey: string }) {
  const summary = CHAPTER_SUMMARIES[summaryKey];
  if (!summary) return null;

  const palette = ACCENTS[summary.accent];

  return (
    <motion.article
      id={`${summaryKey}-key-learning`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm sm:p-6"
    >
      {/* Card header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-2xl">
          <Lightbulb className="h-6 w-6 text-amber-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Key Learning
          </h3>
          <p className="text-[13.5px] text-neutral-400">
            The chapter at a glance — mindmap on the left, takeaways on the right.
          </p>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-neutral-300 sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          End of Chapter
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <Mindmap summary={summary} palette={palette} />
        <Takeaways summary={summary} palette={palette} />
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Mindmap — SVG radial layout
 * ────────────────────────────────────────────────────────────── */

function Mindmap({
  summary,
  palette,
}: {
  summary: (typeof CHAPTER_SUMMARIES)[string];
  palette: (typeof ACCENTS)[Accent];
}) {
  const viewW = 520;
  const viewH = 380;
  const cx = viewW / 2;
  const cy = viewH / 2;
  const radius = 138;

  const n = summary.branches.length;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1428] to-[#0a0f1a] p-4"
      style={{
        background:
          "radial-gradient(600px 300px at 50% 50%, " +
          palette.glow +
          ", transparent 60%), linear-gradient(to bottom right, #0b1428, #0a0f1a)",
      }}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="h-auto w-full"
        aria-hidden="true"
      >
        {/* Faint grid rings */}
        {[radius * 0.4, radius * 0.7].map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="2 4"
          />
        ))}

        {/* Branch lines + labels */}
        {summary.branches.map((b, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          const labelW = 108;
          const labelH = 40;
          const lx = x - labelW / 2;
          const ly = y - labelH / 2;
          return (
            <motion.g
              key={b.label}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                className={palette.line}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <rect
                x={lx}
                y={ly}
                width={labelW}
                height={labelH}
                rx={10}
                className={cn("fill-black/40", palette.line)}
                strokeWidth={1}
                stroke="currentColor"
              />
              <text
                x={x}
                y={ly + 16}
                textAnchor="middle"
                className={cn("fill-white text-[12px] font-semibold")}
                style={{ font: "600 12px system-ui, sans-serif" }}
              >
                {b.label}
              </text>
              <text
                x={x}
                y={ly + 30}
                textAnchor="middle"
                className="fill-white/60"
                style={{ font: "400 10px system-ui, sans-serif" }}
              >
                {b.hint}
              </text>
            </motion.g>
          );
        })}

        {/* Centre node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
          />
          <circle
            cx={cx}
            cy={cy}
            r={42}
            className={cn("fill-black/60", palette.line)}
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            style={{ font: "600 22px system-ui, sans-serif" }}
            className="fill-white"
          >
            {summary.emoji}
          </text>
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            style={{ font: "700 13px system-ui, sans-serif" }}
            className="fill-white"
          >
            {summary.title}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Takeaways list
 * ────────────────────────────────────────────────────────────── */

function Takeaways({
  summary,
  palette,
}: {
  summary: (typeof CHAPTER_SUMMARIES)[string];
  palette: (typeof ACCENTS)[Accent];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold",
            palette.chip,
            palette.chipText,
          )}
        >
          ✓
        </span>
        <div className="text-[13.5px] font-semibold uppercase tracking-widest text-white/80">
          If you remember only these…
        </div>
      </div>
      <ol className="space-y-2.5">
        {summary.takeaways.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 pl-3"
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                palette.chip,
                palette.chipText,
              )}
            >
              {i + 1}
            </span>
            <span className="text-[13.5px] leading-relaxed text-neutral-200">
              {t}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
