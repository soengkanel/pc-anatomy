"use client";

// Chapter 3 — Values & Flow.
// Real-life analogies for variables, mutability, types, control flow.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 3.1 — Variable = a labeled box.
 *       A physical box with a name tag; a value drops inside.
 * ────────────────────────────────────────────────────────────── */

export function VariableBoxVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-lg border-2 border-orange-400/60 bg-orange-500/20 px-4 py-2 font-mono text-2xl font-bold text-orange-100 shadow-[0_0_20px_rgba(255,120,60,0.35)]"
        >
          42
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          ⬇️
        </motion.div>

        <div className="relative">
          {/* Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-24 w-40 items-center justify-center rounded-lg border-2 border-white/20 bg-gradient-to-b from-white/[0.06] to-white/[0.02]"
          >
            <div className="text-[11px] font-mono text-neutral-400">value goes here</div>
          </motion.div>
          {/* Label */}
          <div className="absolute -left-2 -top-3 rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent-bright">
            let age
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          let age = 42;
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.2 — Immutable vs Mutable: stone tablet vs whiteboard.
 * ────────────────────────────────────────────────────────────── */

export function ImmutableVsMutVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-around gap-4 px-2">
        {/* Stone tablet — immutable */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex h-24 w-24 items-center justify-center rounded-md bg-gradient-to-br from-stone-500 to-stone-700 text-3xl shadow-lg"
          >
            🪨
          </motion.div>
          <div className="rounded-full border border-neutral-400/40 bg-neutral-400/10 px-2.5 py-1 font-mono text-[11px] text-neutral-200">
            let x = 5;
          </div>
          <div className="text-center text-[10.5px] leading-tight text-neutral-400">
            🔒 Immutable
            <br />
            (default)
          </div>
        </div>

        <div className="text-2xl text-neutral-500">vs</div>

        {/* Whiteboard — mutable */}
        <div className="flex flex-col items-center gap-2">
          <motion.div className="relative flex h-24 w-24 items-center justify-center rounded-md border-4 border-neutral-300 bg-white text-2xl font-bold text-neutral-800 shadow-lg">
            <motion.span
              key="wb"
              animate={{ opacity: [1, 0, 1], scale: [1, 0.9, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              5 → 6 → 7
            </motion.span>
          </motion.div>
          <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
            let mut x = 5;
          </div>
          <div className="text-center text-[10.5px] leading-tight text-neutral-400">
            ✏️ Mutable
            <br />
            (opt in with `mut`)
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.2b — Real-life mutability pairs.
 *        Everyday things that never change vs. things that do.
 * ────────────────────────────────────────────────────────────── */

export function MutabilityInLifeVisual() {
  const items = [
    { emoji: "🎂", label: "Birthday", code: "let birthday", locked: true },
    { emoji: "🕰️", label: "Age", code: "let mut age", locked: false },
    { emoji: "🆔", label: "ID number", code: "let id_no", locked: true },
    { emoji: "📱", label: "Phone number", code: "let mut phone", locked: false },
    { emoji: "🎓", label: "Grad year", code: "let grad_year", locked: true },
    { emoji: "🏠", label: "Home address", code: "let mut address", locked: false },
    { emoji: "🧬", label: "DNA", code: "let dna", locked: true },
    { emoji: "💰", label: "Bank balance", code: "let mut balance", locked: false },
  ];
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-2 grid grid-cols-2 gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em]">
          <div className="text-center text-neutral-300">🔒 let &mdash; set for life</div>
          <div className="text-center text-emerald-300">✏️ let mut &mdash; can change</div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className={`flex items-center gap-2 rounded-xl border p-2 sm:p-2.5 ${
                it.locked
                  ? "border-neutral-400/30 bg-neutral-400/[0.06]"
                  : "border-emerald-400/30 bg-emerald-400/[0.07]"
              }`}
            >
              <div className="text-xl sm:text-2xl">{it.emoji}</div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-[11px] font-semibold ${
                    it.locked ? "text-neutral-100" : "text-emerald-100"
                  }`}
                >
                  {it.label}
                </div>
                <div
                  className={`font-mono text-[9.5px] leading-tight ${
                    it.locked ? "text-neutral-500" : "text-emerald-300/80"
                  }`}
                >
                  {it.code}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.2c — Shopping cart: a running total climbing with every scan.
 * ────────────────────────────────────────────────────────────── */

export function ShoppingCartVisual() {
  const items = [
    { emoji: "🍚", label: "Rice", price: 2.5 },
    { emoji: "🥚", label: "Eggs", price: 3.2 },
    { emoji: "🥛", label: "Milk", price: 1.8 },
  ];
  const runningTotals = items.reduce<number[]>(
    (acc, it) => [...acc, (acc[acc.length - 1] ?? 0) + it.price],
    [],
  );
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-4xl">
          🛒
          <div className="flex items-center gap-2">
            {items.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.4 }}
                className="text-3xl"
              >
                {it.emoji}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xs rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-neutral-200">
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            let mut cart_total = 0.0
          </div>
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.4 }}
              className="flex items-center justify-between border-t border-white/5 py-1"
            >
              <span>
                {it.emoji} {it.label}
              </span>
              <span className="text-emerald-300">
                +${it.price.toFixed(2)}{" "}
                <span className="text-neutral-500">→</span>{" "}
                <span className="text-white">
                  ${runningTotals[i].toFixed(2)}
                </span>
              </span>
            </motion.div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-emerald-400/30 pt-1 text-emerald-200">
            <span className="text-[10px] uppercase tracking-[0.2em]">total</span>
            <span>${runningTotals[runningTotals.length - 1].toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center text-[10.5px] leading-tight text-neutral-400">
          Prices per item = <span className="text-neutral-200">let</span> (fixed) · Running total
          = <span className="text-emerald-300">let mut</span> (grows)
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.2d — Traffic light: state that cycles all day.
 * ────────────────────────────────────────────────────────────── */

export function TrafficLightVisual() {
  const states = [
    { color: "Red", bg: "bg-red-500", ring: "shadow-[0_0_28px_rgba(239,68,68,0.9)]" },
    { color: "Green", bg: "bg-emerald-500", ring: "shadow-[0_0_28px_rgba(16,185,129,0.9)]" },
    { color: "Yellow", bg: "bg-amber-400", ring: "shadow-[0_0_28px_rgba(251,191,36,0.9)]" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-neutral-700 bg-neutral-900 p-3">
          {states.map((s, i) => (
            <motion.div
              key={s.color}
              animate={{
                opacity: [0.15, 0.15, 1, 1, 0.15],
                scale: [1, 1, 1.05, 1, 1],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                times: [0, i / 3, (i + 0.1) / 3, (i + 0.9) / 3, 1],
              }}
              className={`h-10 w-10 rounded-full ${s.bg} ${s.ring}`}
            />
          ))}
        </div>

        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-[11px] text-neutral-300">
          <span className="text-emerald-300">let mut</span> current ={" "}
          <motion.span
            className="text-orange-300"
            animate={{ opacity: [0.4, 1, 1, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            &quot;Red&quot; → &quot;Green&quot; → &quot;Yellow&quot; → ...
          </motion.span>
        </div>

        <div className="text-center text-[10.5px] leading-tight text-neutral-400">
          The colour names are fixed. Which one shows right now &mdash; that&rsquo;s{" "}
          <span className="text-emerald-300">mut</span>.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.3 — Basic types as containers.
 * ────────────────────────────────────────────────────────────── */

export function TypesVisual() {
  const types = [
    { label: "i32", desc: "42", color: "border-orange-400/40 bg-orange-400/10 text-orange-200", emoji: "🔢" },
    { label: "f64", desc: "3.14", color: "border-sky-400/40 bg-sky-400/10 text-sky-200", emoji: "🌊" },
    { label: "bool", desc: "true", color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200", emoji: "✅" },
    { label: "&str", desc: "\"hi\"", color: "border-fuchsia-400/40 bg-fuchsia-400/10 text-fuchsia-200", emoji: "🧵" },
    { label: "char", desc: "'A'", color: "border-amber-400/40 bg-amber-400/10 text-amber-200", emoji: "🔤" },
    { label: "u8", desc: "0…255", color: "border-rose-400/40 bg-rose-400/10 text-rose-200", emoji: "📏" },
  ];
  return (
    <VisualFrame>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {types.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 ${t.color}`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
              className="text-2xl"
            >
              {t.emoji}
            </motion.div>
            <div className="font-mono text-[13px] font-bold">{t.label}</div>
            <div className="font-mono text-[10.5px] opacity-80">{t.desc}</div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.4 — if/else as a crossroads.
 * ────────────────────────────────────────────────────────────── */

export function IfElseVisual() {
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[12px] text-white">
          if age &gt;= 18
        </div>

        <svg viewBox="0 0 200 60" className="w-64">
          <motion.path
            d="M 100 5 L 40 50"
            stroke="rgba(52, 211, 153, 0.7)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d="M 100 5 L 160 50"
            stroke="rgba(244, 114, 182, 0.7)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </svg>

        <div className="flex gap-16 -mt-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
              &quot;adult&quot;
            </div>
            <div className="text-[10px] text-neutral-500">then branch</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-md border border-fuchsia-400/40 bg-fuchsia-400/10 px-2.5 py-1 font-mono text-[11px] text-fuchsia-200">
              &quot;child&quot;
            </div>
            <div className="text-[10px] text-neutral-500">else branch</div>
          </motion.div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.5 — loop = a spinning gear.
 * ────────────────────────────────────────────────────────────── */

export function LoopVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ⚙️
        </motion.div>

        <div className="flex flex-col gap-2 font-mono text-[11.5px]">
          <div className="rounded-md border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-sky-200">
            for i in 1..=3 {"{"}
          </div>
          <div className="pl-3 text-neutral-300">
            println!(&quot;
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-emerald-300"
            >
              i = {"{i}"}
            </motion.span>
            &quot;);
          </div>
          <div className="text-sky-200">{"}"}</div>
          <div className="mt-1 rounded border border-white/10 bg-black/50 px-2 py-1 text-sky-100">
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.6, delay: 0.5 }}>
              i = 1
            </motion.div>
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.6, delay: 1.2 }}>
              i = 2
            </motion.div>
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.6, delay: 1.9 }}>
              i = 3
            </motion.div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.6 — match = a shape sorter (every shape has a slot).
 * ────────────────────────────────────────────────────────────── */

export function MatchVisual() {
  const arms = [
    { shape: "🔴", label: "Red", output: "stop" },
    { shape: "🟡", label: "Yellow", output: "slow" },
    { shape: "🟢", label: "Green", output: "go" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[12px] text-white">
          match light {"{"}
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          {arms.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="text-3xl"
              >
                {a.shape}
              </motion.div>
              <div className="font-mono text-[10.5px] text-neutral-400">
                Light::{a.label}
              </div>
              <div className="text-neutral-500 text-[10px]">↓</div>
              <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
                &quot;{a.output}&quot;
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-md border border-white/10 bg-black/40 px-3 py-1 font-mono text-[12px] text-white">{"}"}</div>
        <div className="text-center text-[10.5px] leading-relaxed text-neutral-400">
          Every possible shape must have a slot.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.6b — Grade bands: match on numeric RANGES.
 * ────────────────────────────────────────────────────────────── */

export function GradeMatchVisual() {
  const bands = [
    { letter: "F", range: "0..=59", color: "bg-rose-500", text: "text-rose-100" },
    { letter: "D", range: "60..=69", color: "bg-orange-500", text: "text-orange-100" },
    { letter: "C", range: "70..=79", color: "bg-amber-400", text: "text-amber-900" },
    { letter: "B", range: "80..=89", color: "bg-lime-400", text: "text-lime-900" },
    { letter: "A", range: "90..=100", color: "bg-emerald-500", text: "text-emerald-50" },
  ];
  const highlight = 87;
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="text-center text-[11px] leading-tight text-neutral-400">
          A score is just a number. `match` slices the number line into named bands.
        </div>

        <div className="relative w-full">
          <div className="flex h-8 w-full overflow-hidden rounded-lg border border-white/10">
            {bands.map((b, i) => (
              <motion.div
                key={b.letter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className={`flex flex-1 items-center justify-center font-mono text-[11px] font-bold ${b.color} ${b.text}`}
              >
                {b.letter}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute -top-1"
            style={{ left: `${(highlight / 100) * 100}%`, transform: "translateX(-50%)" }}
          >
            <div className="flex flex-col items-center">
              <div className="rounded-md border border-orange-400/50 bg-orange-500/90 px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-lg">
                score = {highlight}
              </div>
              <div className="-mt-0.5 h-2 w-0.5 bg-orange-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid w-full grid-cols-5 gap-1 text-center font-mono text-[9px] text-neutral-500">
          {bands.map((b) => (
            <div key={b.letter}>{b.range}</div>
          ))}
        </div>

        <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
          87 → &quot;B&quot;
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.6c — Rock/Paper/Scissors: match on TUPLES.
 * ────────────────────────────────────────────────────────────── */

export function RockPaperScissorsVisual() {
  const moves = [
    { name: "Rock", emoji: "🪨" },
    { name: "Paper", emoji: "📄" },
    { name: "Scissors", emoji: "✂️" },
  ];
  const winnerOf = (a: string, b: string) => {
    if (a === b) return "=";
    if (
      (a === "Rock" && b === "Scissors") ||
      (a === "Paper" && b === "Rock") ||
      (a === "Scissors" && b === "Paper")
    )
      return "W";
    return "L";
  };
  type Cell =
    | { kind: "corner" }
    | { kind: "col-header"; emoji: string; name: string }
    | { kind: "row-header"; emoji: string; name: string }
    | { kind: "result"; result: "W" | "L" | "="; row: string; col: string };
  const cells: Cell[] = [{ kind: "corner" }];
  for (const m of moves) cells.push({ kind: "col-header", emoji: m.emoji, name: m.name });
  for (const row of moves) {
    cells.push({ kind: "row-header", emoji: row.emoji, name: row.name });
    for (const col of moves) {
      cells.push({
        kind: "result",
        result: winnerOf(row.name, col.name) as "W" | "L" | "=",
        row: row.name,
        col: col.name,
      });
    }
  }
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="text-center text-[11px] leading-tight text-neutral-400">
          Two inputs at once. `match (you, friend)` handles every pairing.
        </div>
        <div className="grid grid-cols-[auto_repeat(3,1fr)] items-center gap-1.5 text-[11px]">
          {cells.map((cell, i) => {
            if (cell.kind === "corner") return <div key={`cell-${i}`} />;
            if (cell.kind === "col-header")
              return (
                <div key={`cell-${i}`} className="text-center text-neutral-400">
                  <div className="text-2xl">{cell.emoji}</div>
                  <div className="text-[9.5px]">{cell.name}</div>
                </div>
              );
            if (cell.kind === "row-header")
              return (
                <div key={`cell-${i}`} className="pr-1 text-right text-neutral-400">
                  <div className="text-2xl">{cell.emoji}</div>
                  <div className="text-[9.5px]">{cell.name}</div>
                </div>
              );
            const style =
              cell.result === "W"
                ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                : cell.result === "L"
                ? "border-rose-400/40 bg-rose-400/15 text-rose-200"
                : "border-neutral-400/40 bg-neutral-400/10 text-neutral-300";
            const label =
              cell.result === "W" ? "You win" : cell.result === "L" ? "Friend" : "Draw";
            return (
              <motion.div
                key={`cell-${i}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center justify-center rounded-md border px-2 py-1.5 text-[10px] font-semibold ${style}`}
              >
                {label}
              </motion.div>
            );
          })}
        </div>
        <div className="text-center text-[10px] text-neutral-500">
          Rows = your move · Columns = friend&rsquo;s move
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3.6d — Weather → outfit: match with a meaningful default.
 * ────────────────────────────────────────────────────────────── */

export function WeatherMatchVisual() {
  const rows = [
    { input: "☀️", label: "sunny", output: "🕶️👕", advice: "sunglasses + tee" },
    { input: "🌧️", label: "rainy", output: "🧥👢", advice: "raincoat + boots" },
    { input: "❄️", label: "snowy", output: "🧣🧤", advice: "scarf + gloves" },
    { input: "☁️", label: "cloudy", output: "👕", advice: "just a hoodie" },
    { input: "❓", label: "_ (anything else)", output: "👀🌤️", advice: "check the sky yourself" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col gap-1.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
            className={`flex items-center gap-2 rounded-lg border p-2 ${
              i === rows.length - 1
                ? "border-neutral-400/30 bg-neutral-400/[0.06]"
                : "border-sky-400/20 bg-sky-400/[0.05]"
            }`}
          >
            <div className="text-2xl">{r.input}</div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] text-neutral-400">
                &quot;{r.label}&quot; =&gt;
              </div>
              <div className="text-[11px] font-semibold text-white">
                {r.advice}
              </div>
            </div>
            <div className="text-xl">{r.output}</div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}
