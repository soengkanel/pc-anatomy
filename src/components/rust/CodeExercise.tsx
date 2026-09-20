"use client";

// A per-lesson interactive practice card.
// Shows a Rust code snippet with syntax highlight, a "Reveal output" button
// so students can guess first, and a "Try in Playground" link that opens
// the code in play.rust-lang.org with everything pre-filled.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PredictOption = {
  label: string;
  correct?: boolean;
};

export type CodeExerciseProps = {
  /** Short teachable title. */
  title: string;
  /** One-sentence goal for the student. */
  goal: string;
  /** The Rust code sample. */
  code: string;
  /** What the program prints when it runs. */
  output: string;
  /**
   * Optional "predict the output" multiple choice — appears above the reveal
   * button and gives immediate feedback. Great for the harder lessons.
   */
  predict?: PredictOption[];
  /** Optional hint / teacher note. */
  hint?: string;
};

const RUST_PLAYGROUND = "https://play.rust-lang.org/";

function buildPlaygroundUrl(code: string): string {
  const params = new URLSearchParams({
    version: "stable",
    mode: "debug",
    edition: "2021",
    code,
  });
  return `${RUST_PLAYGROUND}?${params.toString()}`;
}

/* ─────────────────────────────────────────────────────────────── */

export function CodeExercise({
  title,
  goal,
  code,
  output,
  predict,
  hint,
}: CodeExerciseProps) {
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore – older browsers
    }
  };

  const playgroundHref = buildPlaygroundUrl(code);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="mt-5 overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/[0.06] to-teal-500/[0.02]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
          <Terminal className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-emerald-300">
            Try it — Exercise
          </div>
          <div className="text-[15px] font-semibold text-white">{title}</div>
        </div>
        <a
          href={playgroundHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-[12px] font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/20"
        >
          <Play className="h-3.5 w-3.5" />
          Run in Playground
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>

      <div className="p-4 sm:p-5">
        {/* Goal */}
        <p className="text-[13.5px] leading-relaxed text-neutral-300">
          <span className="font-semibold text-white">Goal:</span> {goal}
        </p>

        {/* Code block */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0a0e18]">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-neutral-500">main.rs</span>
            </div>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-neutral-300 transition-colors hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
          </div>
          <pre className="thin-scroll overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed">
            <HighlightedRust code={code} />
          </pre>
        </div>

        {/* Predict quiz */}
        {predict && predict.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5 text-[11.5px] font-mono uppercase tracking-widest text-accent-bright">
              <Sparkles className="h-3 w-3" />
              Predict the output
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {predict.map((opt, i) => {
                const isPicked = picked === i;
                const isCorrect = opt.correct === true;
                const showState = picked !== null;
                const stateClass = showState
                  ? isCorrect
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                    : isPicked
                      ? "border-rose-400/50 bg-rose-400/10 text-rose-100"
                      : "border-white/10 bg-white/[0.02] text-neutral-400"
                  : "border-white/10 bg-white/[0.02] text-neutral-200 hover:border-white/20 hover:bg-white/[0.05]";
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPicked(i)}
                    className={cn(
                      "flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-[12.5px] transition-colors",
                      stateClass
                    )}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold">
                      {"ABCD"[i]}
                    </span>
                    <span className="flex-1 font-mono">{opt.label}</span>
                    {showState && isCorrect && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Reveal output */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOutput((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors",
              showOutput
                ? "border-sky-400/40 bg-sky-400/10 text-sky-200"
                : "border-white/15 bg-white/[0.04] text-neutral-200 hover:bg-white/10"
            )}
          >
            {showOutput ? (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Hide output
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Reveal output
              </>
            )}
          </button>
          {hint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-neutral-300 transition-colors hover:bg-white/10"
            >
              {showHint ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
        </div>

        {/* Output panel */}
        <AnimatePresence initial={false}>
          {showOutput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 overflow-hidden rounded-xl border border-sky-400/30 bg-sky-400/[0.04]"
            >
              <div className="flex items-center gap-1.5 border-b border-sky-400/20 bg-black/20 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-widest text-sky-200">
                <Terminal className="h-3 w-3" /> stdout
              </div>
              <pre className="thin-scroll overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed text-sky-100">
                {output}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {showHint && hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 overflow-hidden rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-3 text-[13px] leading-relaxed text-amber-100"
            >
              <span className="font-semibold text-amber-200">💡 Hint · </span>
              {hint}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * A tiny, dependency-free Rust syntax highlighter — enough for
 * teaching snippets. Not a real parser: highlights keywords,
 * types, strings, macros, numbers, and comments with regex passes.
 * ────────────────────────────────────────────────────────────── */

type Segment = { text: string; className?: string };

const KEYWORDS = new Set([
  "let", "mut", "fn", "if", "else", "match", "return", "for", "while", "loop",
  "in", "as", "use", "mod", "pub", "struct", "enum", "impl", "trait", "self",
  "Self", "true", "false", "break", "continue", "const", "static", "type",
  "where", "async", "await", "move", "ref", "dyn", "crate", "super",
]);

const TYPES = new Set([
  "i8", "i16", "i32", "i64", "i128", "isize",
  "u8", "u16", "u32", "u64", "u128", "usize",
  "f32", "f64", "bool", "char", "str", "String",
  "Vec", "Option", "Result", "HashMap", "HashSet",
  "Box", "Rc", "Arc", "Some", "None", "Ok", "Err",
]);

function tokenize(line: string): Segment[] {
  const segs: Segment[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);

    // Line comment
    if (rest.startsWith("//")) {
      segs.push({ text: rest, className: "text-neutral-500 italic" });
      i = line.length;
      continue;
    }

    // Strings (single line only)
    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1);
      const stop = end === -1 ? rest.length : end + 1;
      segs.push({ text: rest.slice(0, stop), className: "text-emerald-300" });
      i += stop;
      continue;
    }

    // Char literal
    if (rest[0] === "'" && rest.length >= 3 && rest[2] === "'") {
      segs.push({ text: rest.slice(0, 3), className: "text-emerald-300" });
      i += 3;
      continue;
    }

    // Numbers
    const numMatch = /^[0-9][0-9_.]*[a-z0-9]*/i.exec(rest);
    if (numMatch) {
      segs.push({ text: numMatch[0], className: "text-orange-300" });
      i += numMatch[0].length;
      continue;
    }

    // Identifier
    const idMatch = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (idMatch) {
      const word = idMatch[0];
      const isMacro = rest[idMatch[0].length] === "!";
      let cls: string | undefined;
      if (isMacro) cls = "text-fuchsia-300 font-semibold";
      else if (KEYWORDS.has(word)) cls = "text-sky-300 font-semibold";
      else if (TYPES.has(word)) cls = "text-cyan-200";
      else if (
        rest[idMatch[0].length] === "(" &&
        /[a-z_]/.test(word[0]) &&
        !KEYWORDS.has(word)
      )
        cls = "text-yellow-200";
      segs.push({ text: word, className: cls });
      i += word.length;
      if (isMacro) {
        segs.push({ text: "!", className: "text-fuchsia-300 font-semibold" });
        i += 1;
      }
      continue;
    }

    // Everything else — single character
    segs.push({ text: rest[0], className: "text-neutral-300" });
    i += 1;
  }
  return segs;
}

function HighlightedRust({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <code className="block text-neutral-200">
      {lines.map((line, li) => (
        <div key={li} className="whitespace-pre">
          {tokenize(line).map((seg, si) => (
            <span key={si} className={seg.className}>
              {seg.text}
            </span>
          ))}
          {line.length === 0 && <span>&nbsp;</span>}
        </div>
      ))}
    </code>
  );
}
