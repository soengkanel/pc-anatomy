"use client";

// Chapter 8 — Build Something Real.
// The mini-project: a Todo CLI. Visuals show terminal usage,
// file save/load, and green-check tests.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 8.1 — Todo CLI in the terminal.
 * ────────────────────────────────────────────────────────────── */

export function CliTodoVisual() {
  const lines = [
    { prompt: "$", text: "todo add \"Buy milk\"", color: "text-neutral-200", delay: 0.2 },
    { prompt: "→", text: "✓ added: Buy milk", color: "text-emerald-300", delay: 0.9 },
    { prompt: "$", text: "todo add \"Study Rust\"", color: "text-neutral-200", delay: 1.6 },
    { prompt: "→", text: "✓ added: Study Rust", color: "text-emerald-300", delay: 2.2 },
    { prompt: "$", text: "todo list", color: "text-neutral-200", delay: 2.9 },
    { prompt: "→", text: "1. [ ] Buy milk", color: "text-sky-200", delay: 3.5 },
    { prompt: "→", text: "2. [ ] Study Rust", color: "text-sky-200", delay: 3.7 },
    { prompt: "$", text: "todo done 1", color: "text-neutral-200", delay: 4.3 },
    { prompt: "→", text: "🎉 done: Buy milk", color: "text-amber-300", delay: 4.9 },
  ];
  return (
    <VisualFrame>
      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-inner">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[10.5px] text-neutral-500">todo — CLI</span>
        </div>
        <div className="max-h-64 p-3 font-mono text-[11.5px] leading-relaxed">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: line.delay }}
              className="flex gap-2"
            >
              <span className="text-orange-400">{line.prompt}</span>
              <span className={line.color}>{line.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8.2 — File I/O: save to disk, load back.
 * ────────────────────────────────────────────────────────────── */

export function FileIOVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-around gap-3">
        {/* Program */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="text-4xl">🦀</div>
          <div className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10.5px] text-neutral-200">
            your program
          </div>
        </div>

        {/* Write arrow */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ x: [-3, 5, -3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl text-emerald-300"
          >
            →
          </motion.div>
          <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9.5px] text-emerald-200">
            fs::write
          </div>
          <motion.div
            animate={{ x: [3, -5, 3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="text-2xl text-sky-300"
          >
            ←
          </motion.div>
          <div className="rounded border border-sky-400/40 bg-sky-400/10 px-1.5 py-0.5 font-mono text-[9.5px] text-sky-200">
            fs::read_to_string
          </div>
        </div>

        {/* File */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="relative w-24 rounded-md border-2 border-amber-400/40 bg-amber-400/[0.08] p-2 font-mono text-[10px] leading-tight text-amber-200 shadow-lg">
            <div className="mb-1 flex items-center gap-1 border-b border-amber-400/30 pb-0.5 font-mono text-[9px] uppercase tracking-widest text-amber-300">
              📄 todo.txt
            </div>
            <div>[ ] Buy milk</div>
            <div>[x] Study Rust</div>
          </div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8.3 — cargo test = a green checklist.
 * ────────────────────────────────────────────────────────────── */

export function TestingVisual() {
  const tests = [
    { name: "adds a task", pass: true },
    { name: "marks a task done", pass: true },
    { name: "saves to file", pass: true },
    { name: "reads back from file", pass: true },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          $ cargo test
        </div>

        <div className="w-72 space-y-1.5 rounded-xl border border-white/10 bg-black/40 p-3">
          {tests.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.3 }}
              className="flex items-center gap-2 font-mono text-[11.5px]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.3, type: "spring", stiffness: 300 }}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/20 font-bold text-emerald-200"
              >
                ✓
              </motion.div>
              <span className="text-neutral-200">test {t.name} ... </span>
              <span className="text-emerald-300">ok</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-200"
        >
          test result: ok · {tests.length} passed · 0 failed
        </motion.div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 8.4 — Where next: badges of paths forward.
 * ────────────────────────────────────────────────────────────── */

export function WhereNextVisual() {
  const paths = [
    { emoji: "🌐", label: "Web servers", tool: "axum" },
    { emoji: "🎮", label: "Games", tool: "bevy" },
    { emoji: "🤖", label: "Embedded", tool: "embedded-hal" },
    { emoji: "🖥️", label: "Desktop apps", tool: "tauri" },
    { emoji: "📡", label: "Networking", tool: "tokio" },
    { emoji: "🧠", label: "AI / ML", tool: "candle" },
  ];
  return (
    <VisualFrame>
      <div className="grid w-full grid-cols-3 gap-2">
        {paths.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="flex flex-col items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center transition-transform hover:-translate-y-0.5"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
              className="text-2xl"
            >
              {p.emoji}
            </motion.div>
            <div className="text-[11px] font-semibold text-white">{p.label}</div>
            <div className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9.5px] text-accent-bright">
              {p.tool}
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}
