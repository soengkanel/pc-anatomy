"use client";

// A per-lesson interactive Python practice card for the ML course.
// Shows a Python snippet with syntax highlight, a "Reveal output" button,
// an optional multiple-choice "predict the output" quiz, and a link to
// open Google Colab so students can paste + run with scikit-learn /
// pandas / matplotlib pre-installed.

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

export type MLCodeExerciseProps = {
  title: string;
  goal: string;
  code: string;
  output: string;
  predict?: PredictOption[];
  hint?: string;
  filename?: string;
};

const COLAB_URL = "https://colab.research.google.com/#create=true";

export function MLCodeExercise({
  title,
  goal,
  code,
  output,
  predict,
  hint,
  filename = "cambodia_ml.ipynb",
}: MLCodeExerciseProps) {
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
      // ignore
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="mt-5 overflow-hidden rounded-2xl border border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-500/[0.06] to-purple-500/[0.02]"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300">
          <Terminal className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-mono uppercase tracking-widest text-fuchsia-300">
            Try it — Python exercise
          </div>
          <div className="text-[15px] font-semibold text-white">{title}</div>
        </div>
        <a
          href={COLAB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-3.5 py-1.5 text-[12px] font-semibold text-fuchsia-200 transition-colors hover:bg-fuchsia-400/20"
        >
          <Play className="h-3.5 w-3.5" />
          Open in Colab
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[13.5px] leading-relaxed text-neutral-300">
          <span className="font-semibold text-white">Goal:</span> {goal}
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0a0e18]">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-neutral-500">{filename}</span>
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
            <HighlightedPython code={code} />
          </pre>
        </div>

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
 * Tiny Python syntax highlighter — enough for teaching snippets.
 * ────────────────────────────────────────────────────────────── */

type Segment = { text: string; className?: string };

const PY_KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue",
  "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
  "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass",
  "raise", "return", "try", "while", "with", "yield",
  "True", "False", "None", "self", "cls",
]);

const PY_BUILTINS = new Set([
  "print", "len", "range", "list", "dict", "tuple", "set", "str", "int",
  "float", "bool", "map", "filter", "sum", "min", "max", "abs", "round",
  "sorted", "zip", "enumerate", "open", "type", "isinstance",
]);

function tokenize(line: string): Segment[] {
  const segs: Segment[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);

    if (rest.startsWith("#")) {
      segs.push({ text: rest, className: "text-neutral-500 italic" });
      i = line.length;
      continue;
    }

    if (rest[0] === '"' || rest[0] === "'") {
      const quote = rest[0];
      let end = 1;
      while (end < rest.length && rest[end] !== quote) {
        if (rest[end] === "\\") end += 2;
        else end += 1;
      }
      const stop = end < rest.length ? end + 1 : end;
      segs.push({ text: rest.slice(0, stop), className: "text-emerald-300" });
      i += stop;
      continue;
    }

    const numMatch = /^[0-9][0-9_.]*(e[-+]?[0-9]+)?/i.exec(rest);
    if (numMatch) {
      segs.push({ text: numMatch[0], className: "text-orange-300" });
      i += numMatch[0].length;
      continue;
    }

    const idMatch = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (idMatch) {
      const word = idMatch[0];
      const next = rest[word.length];
      let cls: string | undefined;
      if (PY_KEYWORDS.has(word)) cls = "text-sky-300 font-semibold";
      else if (PY_BUILTINS.has(word)) cls = "text-fuchsia-300";
      else if (next === "(") cls = "text-yellow-200";
      else if (/^[A-Z]/.test(word)) cls = "text-cyan-200";
      segs.push({ text: word, className: cls });
      i += word.length;
      continue;
    }

    segs.push({ text: rest[0], className: "text-neutral-300" });
    i += 1;
  }
  return segs;
}

function HighlightedPython({ code }: { code: string }) {
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
