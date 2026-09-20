"use client";

// A single coding challenge card.
// Different from CodeExercise: this one asks the student to WRITE code.
// It shows a problem statement, starter code with `// TODO` markers, sample
// output, a "Show solution" reveal, and a "Try in Playground" button that
// pre-fills the STARTER code (not the solution) so they start from scratch.

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
  Puzzle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Challenge = {
  /** e.g. "Challenge 1". */
  number: string;
  /** Short imperative title. */
  title: string;
  /** Difficulty pill. */
  difficulty: "easy" | "medium" | "hard";
  /** The problem statement — 1-3 sentences. */
  prompt: string;
  /** Optional bullet list of concrete requirements. */
  requirements?: string[];
  /** Starter code with `// TODO` markers where the student writes. */
  starter: string;
  /** What the finished program should print. */
  sampleOutput?: string;
  /** The reference solution (hidden by default). */
  solution: string;
  /** Optional hint. */
  hint?: string;
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

const DIFFICULTY = {
  easy: {
    label: "easy",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  },
  medium: {
    label: "medium",
    className: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  },
  hard: {
    label: "hard",
    className: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  },
} as const;

/* ─────────────────────────────────────────────────────────────── */

export function CodingChallenge({ challenge }: { challenge: Challenge }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const diff = DIFFICULTY[challenge.difficulty];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.02]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-300">
          <Puzzle className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-widest text-amber-300">
            {challenge.number}
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[9.5px] font-semibold normal-case tracking-normal",
                diff.className
              )}
            >
              {diff.label}
            </span>
          </div>
          <div className="text-[15px] font-semibold text-white">{challenge.title}</div>
        </div>
        <a
          href={playgroundUrl(challenge.starter)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 text-[12px] font-semibold text-amber-200 transition-colors hover:bg-amber-400/20"
        >
          <Play className="h-3.5 w-3.5" />
          Try in Playground
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
      </div>

      <div className="p-4 sm:p-5">
        {/* Prompt */}
        <div className="flex gap-2">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-[13.5px] leading-relaxed text-neutral-200">
            {challenge.prompt}
          </p>
        </div>

        {/* Requirements */}
        {challenge.requirements && challenge.requirements.length > 0 && (
          <ul className="mt-3 space-y-1 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[12.5px] leading-relaxed text-neutral-300">
            {challenge.requirements.map((r) => (
              <li key={r} className="flex gap-1.5">
                <span className="text-amber-300">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Starter code */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-widest text-neutral-400">
            <span>Starter code</span>
            <span className="text-neutral-600">— fill in the TODOs</span>
          </div>
          <CodeBlock code={challenge.starter} filename="main.rs" onCopy={() => copy(challenge.starter)} copied={copied} />
        </div>

        {/* Sample output */}
        {challenge.sampleOutput && (
          <div className="mt-3 overflow-hidden rounded-xl border border-sky-400/30 bg-sky-400/[0.04]">
            <div className="flex items-center gap-1.5 border-b border-sky-400/20 bg-black/20 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-widest text-sky-200">
              Expected output
            </div>
            <pre className="thin-scroll overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-sky-100">
              {challenge.sampleOutput}
            </pre>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors",
              showSolution
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                : "border-white/15 bg-white/[0.04] text-neutral-200 hover:bg-white/10"
            )}
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
          {challenge.hint && (
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-neutral-300 transition-colors hover:bg-white/10"
            >
              {showHint ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
        </div>

        {/* Hint */}
        <AnimatePresence initial={false}>
          {showHint && challenge.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 overflow-hidden rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3 text-[13px] leading-relaxed text-amber-100"
            >
              <span className="font-semibold text-amber-200">💡 Hint · </span>
              {challenge.hint}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <AnimatePresence initial={false}>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-widest text-emerald-300">
                <Check className="h-3 w-3" /> Reference solution
              </div>
              <CodeBlock code={challenge.solution} filename="solution.rs" onCopy={() => copy(challenge.solution)} copied={copied} accent="emerald" />
              <div className="mt-2 flex justify-end">
                <a
                  href={playgroundUrl(challenge.solution)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11.5px] font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/20"
                >
                  <Play className="h-3 w-3" />
                  Run the solution
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────── */

function CodeBlock({
  code,
  filename,
  onCopy,
  copied,
  accent,
}: {
  code: string;
  filename: string;
  onCopy: () => void;
  copied: boolean;
  accent?: "emerald";
}) {
  const borderClass = accent === "emerald" ? "border-emerald-400/30" : "border-white/10";
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-[#0a0e18]", borderClass)}>
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-3 py-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="inline-block h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-neutral-500">{filename}</span>
        </div>
        <button
          type="button"
          onClick={onCopy}
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
  );
}

/* ─────────────────────────────────────────────────────────────────
 * ChallengeSet — the section header + a list of challenges
 * ────────────────────────────────────────────────────────────── */

export function ChallengeSet({
  chapterId,
  challenges,
}: {
  chapterId: string;
  challenges: Challenge[];
}) {
  return (
    <motion.section
      id={`${chapterId}-challenges`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm sm:p-6"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-2xl">
          🧩
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-white sm:text-2xl">Coding Challenges</h3>
          <p className="text-[13px] text-neutral-400">
            Your turn. Write the code yourself — hint first, solution second.
          </p>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] text-neutral-300 sm:block">
          {challenges.length} problem{challenges.length !== 1 && "s"}
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map((c) => (
          <CodingChallenge key={c.number} challenge={c} />
        ))}
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Minimal Rust syntax highlighter — same tokeniser as CodeExercise.
 * Duplicated here to keep CodingChallenge self-contained; both files
 * are teaching aids and shouldn't fight for a shared module.
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

    if (rest.startsWith("//")) {
      segs.push({ text: rest, className: "text-neutral-500 italic" });
      i = line.length;
      continue;
    }

    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1);
      const stop = end === -1 ? rest.length : end + 1;
      segs.push({ text: rest.slice(0, stop), className: "text-emerald-300" });
      i += stop;
      continue;
    }

    if (rest[0] === "'" && rest.length >= 3 && rest[2] === "'") {
      segs.push({ text: rest.slice(0, 3), className: "text-emerald-300" });
      i += 3;
      continue;
    }

    const numMatch = /^[0-9][0-9_.]*[a-z0-9]*/i.exec(rest);
    if (numMatch) {
      segs.push({ text: numMatch[0], className: "text-orange-300" });
      i += numMatch[0].length;
      continue;
    }

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
