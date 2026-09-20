"use client";

// Chapter 4 — Ownership.
// The most important chapter. Uses tangible real-life analogies:
// a pencil that can only be held by one person at a time,
// moving house, library book borrowing, and a whiteboard writer.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 4.1 — The Rule: one hand, one pencil.
 *       One person owns the value at any moment.
 * ────────────────────────────────────────────────────────────── */

export function OwnershipRuleVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-orange-200">
          Rust&rsquo;s golden rule
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="text-5xl"
          >
            🧑
          </motion.div>

          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl"
          >
            ✏️
          </motion.div>

          <div className="text-neutral-500 text-2xl">=</div>

          <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 font-mono text-[11.5px] text-emerald-200">
            let pencil = String::from(&quot;Rust&quot;);
          </div>
        </div>

        <div className="mt-2 text-center text-[13px] leading-relaxed text-neutral-300">
          <span className="font-bold text-white">One pencil.</span> <span className="font-bold text-white">One owner.</span>{" "}
          When the owner walks away, the pencil is put back in the box.
        </div>

        <div className="grid w-full grid-cols-3 gap-2 text-[10.5px]">
          {[
            { emoji: "1️⃣", label: "Every value has one owner" },
            { emoji: "2️⃣", label: "Only one owner at a time" },
            { emoji: "3️⃣", label: "Owner leaves → value dropped" },
          ].map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center text-neutral-300"
            >
              <div className="text-lg">{r.emoji}</div>
              <div>{r.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.2 — Move: A hands the book to B. A's shelf empties.
 * ────────────────────────────────────────────────────────────── */

export function MoveVisual() {
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 text-center font-mono text-[11.5px] text-orange-200">
          let b = a; <span className="text-neutral-500">// ownership moves</span>
        </div>

        <div className="grid grid-cols-3 items-center">
          {/* Left: person A with empty shelf */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-4xl">🧑‍🦱</div>
            <div className="text-[11px] font-mono text-neutral-300">a</div>
            <motion.div
              animate={{ opacity: [1, 0.2, 0.2] }}
              transition={{ duration: 3, times: [0, 0.4, 1], repeat: Infinity }}
              className="flex h-14 w-24 items-center justify-center rounded-lg border-2 border-dashed border-neutral-500/50 bg-white/[0.02] text-[10px] text-neutral-500"
            >
              (empty — moved out)
            </motion.div>
            <div className="rounded border border-rose-400/40 bg-rose-400/10 px-2 py-0.5 font-mono text-[10px] text-rose-200">
              ✗ can&rsquo;t use a
            </div>
          </div>

          {/* Middle: the book flying across */}
          <div className="relative flex h-24 items-center justify-center">
            <motion.div
              animate={{ x: [-60, 60] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl"
            >
              📕
            </motion.div>
          </div>

          {/* Right: person B with the book now */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-4xl">👩‍🦰</div>
            <div className="text-[11px] font-mono text-neutral-300">b</div>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 3, times: [0, 0.6, 1], repeat: Infinity }}
              className="flex h-14 w-24 items-center justify-center rounded-lg border-2 border-emerald-400/60 bg-emerald-400/10 text-2xl"
            >
              📕
            </motion.div>
            <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
              ✓ new owner
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-[11.5px] text-neutral-400">
          The book moves. Only <span className="text-white">one</span> person can read it.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.3 — Copy: small values are photocopied. Both stay usable.
 * ────────────────────────────────────────────────────────────── */

export function CopyVisual() {
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 text-center font-mono text-[11.5px] text-orange-200">
          let b = a; <span className="text-neutral-500">// small types → COPY</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[11px] font-mono text-neutral-400">a</div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-emerald-400/60 bg-emerald-400/10 font-mono text-xl font-bold text-emerald-100"
            >
              5
            </motion.div>
            <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
              ✓ still usable
            </div>
          </div>

          <motion.div
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            📄
          </motion.div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-[11px] font-mono text-neutral-400">b</div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-emerald-400/60 bg-emerald-400/10 font-mono text-xl font-bold text-emerald-100"
            >
              5
            </motion.div>
            <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
              ✓ fresh copy
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] p-2 text-emerald-200">
            <span className="font-semibold">Cheap types copy:</span>
            <div className="mt-0.5 font-mono text-neutral-300">i32, f64, bool, char, tuples of Copy</div>
          </div>
          <div className="rounded-lg border border-rose-400/30 bg-rose-400/[0.06] p-2 text-rose-200">
            <span className="font-semibold">Expensive types move:</span>
            <div className="mt-0.5 font-mono text-neutral-300">String, Vec, HashMap, ...</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.4 — Borrow: library book. Many readers, one book.
 * ────────────────────────────────────────────────────────────── */

export function BorrowVisual() {
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-2 text-center font-mono text-[11.5px] text-sky-200">
          let r1 = &amp;book; let r2 = &amp;book; <span className="text-neutral-500">// many readers OK</span>
        </div>

        <div className="relative flex items-center justify-center py-3">
          {/* The book (the value being borrowed) */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.6, repeat: Infinity }}
            className="relative flex flex-col items-center gap-1"
          >
            <div className="text-5xl">📗</div>
            <div className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
              book: String
            </div>
          </motion.div>

          {/* Reader arrows and readers */}
          {[
            { emoji: "🧑", angle: -60, label: "&book" },
            { emoji: "👩", angle: 0, label: "&book" },
            { emoji: "🧒", angle: 60, label: "&book" },
          ].map((r, i) => {
            const rad = (r.angle * Math.PI) / 180;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: Math.sin(rad) * 110 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                style={{ top: `${25 + Math.cos(rad) * 30}%` }}
                className="absolute flex flex-col items-center gap-0.5"
              >
                <div className="text-2xl">{r.emoji}</div>
                <div className="rounded border border-sky-400/40 bg-sky-400/10 px-1.5 py-0.5 font-mono text-[9px] text-sky-200">
                  {r.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-2 rounded-lg border border-sky-400/30 bg-sky-400/[0.06] p-2 text-center text-[11.5px] leading-relaxed text-sky-100">
          <span className="font-bold">Immutable borrow (&amp;)</span> = read-only.
          As many readers as you want — no one is changing the book.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.5 — Mutable Borrow: only one writer on the whiteboard.
 * ────────────────────────────────────────────────────────────── */

export function MutBorrowVisual() {
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-2 text-center font-mono text-[11.5px] text-fuchsia-200">
          let w = &amp;mut board; <span className="text-neutral-500">// only ONE writer</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Waiting people */}
          <div className="flex flex-col gap-1 text-center">
            <div className="text-[10px] font-mono text-neutral-500">queue</div>
            <div className="text-2xl opacity-60">👤</div>
            <div className="text-2xl opacity-40">👤</div>
            <div className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] text-neutral-500">
              waiting…
            </div>
          </div>

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl text-neutral-500"
          >
            →
          </motion.div>

          {/* The whiteboard being written on */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-24 w-40 items-center justify-center rounded-md border-4 border-neutral-300 bg-white shadow-lg">
              <motion.span
                animate={{ opacity: [1, 0, 1], scale: [1, 0.9, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="font-bold text-neutral-800"
              >
                Rustaceans!
              </motion.span>
              <motion.div
                animate={{ x: [-20, 20, -20], y: [-4, 4, -4] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="absolute bottom-0 right-2 text-2xl"
              >
                ✍️
              </motion.div>
            </div>
            <div className="rounded border border-fuchsia-400/40 bg-fuchsia-400/10 px-2 py-0.5 font-mono text-[10px] text-fuchsia-200">
              1 writer only
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-fuchsia-400/30 bg-fuchsia-400/[0.06] p-2 text-center text-[11.5px] leading-relaxed text-fuchsia-100">
          <span className="font-bold">Mutable borrow (&amp;mut)</span> = write access.
          Rust allows only <span className="font-bold">one</span> — no clashes, no data races.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.6 — Scope and Drop: value dies at the closing brace.
 * ────────────────────────────────────────────────────────────── */

export function ScopeDropVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full max-w-sm rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-[11.5px] leading-relaxed">
          <div className="text-sky-300">fn birthday() {"{"}</div>
          <motion.div
            animate={{ backgroundColor: ["rgba(52,211,153,0)", "rgba(52,211,153,0.12)", "rgba(52,211,153,0)"] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.15, 1] }}
            className="ml-3 rounded px-1 text-emerald-200"
          >
            let cake = String::from(&quot;🎂&quot;);
          </motion.div>
          <div className="ml-3 text-neutral-400">// party happens…</div>
          <motion.div
            animate={{ color: ["#9ca3af", "#f43f5e", "#9ca3af"] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0.4, 0.7, 1] }}
            className="text-sky-300"
          >
            {"}"}  <span className="text-neutral-500">// cake dropped here 💥</span>
          </motion.div>
        </div>

        <div className="text-center text-[11.5px] leading-relaxed text-neutral-300">
          When the closing <span className="font-mono text-white">{"}"}</span> arrives, Rust automatically cleans up.
          No garbage collector needed.
        </div>
      </div>
    </VisualFrame>
  );
}
