"use client";

// Chapters 1–2: Welcome to Rust + First Program.
// Real-life analogies with self-animating SVG + framer-motion.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 1.1 — Why Rust? A race car with a seatbelt.
 *       Two labels ("Fast" and "Safe") glow at the same time.
 * ────────────────────────────────────────────────────────────── */

export function WhyRustVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full items-center justify-around gap-6 px-4">
        {/* Left: Fast */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-6xl">⚡</div>
          <div className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[12px] font-semibold text-amber-200">
            Fast
          </div>
          <div className="text-[10.5px] text-neutral-400">like C / C++</div>
        </motion.div>

        {/* Center: Rust crab */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex flex-col items-center gap-1"
        >
          <div className="text-7xl drop-shadow-[0_0_20px_rgba(255,120,60,0.5)]">🦀</div>
          <div className="rounded-full border border-orange-400/40 bg-orange-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-200">
            Rust
          </div>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute -top-2 h-2 w-2 rounded-full bg-orange-300"
              style={{ left: `${20 + i * 30}%` }}
              animate={{ y: [-4, -24], opacity: [1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>

        {/* Right: Safe */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-6xl">🛡️</div>
          <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold text-emerald-200">
            Safe
          </div>
          <div className="text-[10.5px] text-neutral-400">no memory bugs, no GC</div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 1.2 — Where Rust is used. Floating logos in a starfield.
 * ────────────────────────────────────────────────────────────── */

export function WhereUsedVisual() {
  const products = [
    { name: "Firefox", emoji: "🦊" },
    { name: "Linux", emoji: "🐧" },
    { name: "Discord", emoji: "💬" },
    { name: "Dropbox", emoji: "📦" },
    { name: "Cloudflare", emoji: "☁️" },
    { name: "AWS", emoji: "🅰️" },
  ];
  return (
    <VisualFrame>
      <div className="grid w-full grid-cols-3 gap-3 sm:gap-4">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * i }}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              className="text-3xl"
            >
              {p.emoji}
            </motion.div>
            <div className="text-[11px] font-semibold text-white">{p.name}</div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 1.3 — The learning path. Eight signposts along a curved road.
 * ────────────────────────────────────────────────────────────── */

export function LearningPathVisual() {
  const stops = ["Welcome", "Setup", "Values", "Ownership", "Data", "Vecs", "Traits", "Ship it"];
  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-4 text-center text-[11.5px] font-mono uppercase tracking-widest text-accent-bright">
          Your 8-chapter journey
        </div>
        <div className="relative h-40">
          <svg viewBox="0 0 400 100" className="absolute inset-0 h-full w-full">
            <motion.path
              d="M 10 60 Q 100 10 200 50 T 390 40"
              stroke="rgba(111, 164, 255, 0.35)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>
          {stops.map((s, i) => {
            const t = i / (stops.length - 1);
            const x = 5 + t * 90;
            const y = 55 + Math.sin(t * Math.PI * 1.5) * 20;
            return (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-accent bg-accent/30 font-mono text-[9px] font-bold text-white shadow-[0_0_8px_rgba(77,141,255,0.6)]">
                  {i + 1}
                </div>
                <div className="whitespace-nowrap rounded-md border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] font-medium text-neutral-200">
                  {s}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2.1 — rustup install. Terminal window typing itself.
 * ────────────────────────────────────────────────────────────── */

export function InstallVisual() {
  const lines = [
    { prompt: "$", text: "curl --proto '=https' https://sh.rustup.rs -sSf | sh", color: "text-neutral-200" },
    { prompt: "→", text: "info: downloading rustup", color: "text-neutral-400" },
    { prompt: "→", text: "info: default toolchain: stable", color: "text-neutral-400" },
    { prompt: "→", text: "Rust is installed now. Great!", color: "text-emerald-300" },
    { prompt: "$", text: "rustc --version", color: "text-neutral-200" },
    { prompt: "→", text: "rustc 1.82.0 (2024-10-15)", color: "text-sky-300" },
  ];
  return (
    <VisualFrame>
      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-inner">
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[10.5px] text-neutral-500">terminal — bash</span>
        </div>
        <div className="p-3 font-mono text-[11.5px] leading-relaxed">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.5 }}
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
 * 2.2 — cargo new. A folder sprouts sub-files.
 * ────────────────────────────────────────────────────────────── */

export function CargoNewVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-[11.5px] text-emerald-300">
            $ cargo new hello
          </div>
          <div className="text-[10.5px] text-neutral-500">1 command</div>
        </motion.div>

        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl text-accent-bright"
        >
          →
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-56 rounded-xl border border-white/10 bg-white/[0.04] p-3 font-mono text-[11.5px] text-neutral-200"
        >
          <div className="flex items-center gap-1.5 text-accent-bright">📁 hello/</div>
          <div className="ml-4 mt-1 space-y-0.5 text-neutral-300">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-1.5"
            >
              📄 Cargo.toml
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-1.5"
            >
              📁 src/
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="ml-4 flex items-center gap-1.5 text-emerald-300"
            >
              📜 main.rs
            </motion.div>
          </div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2.3 — cargo run. Play button pumps out compilation + output.
 * ────────────────────────────────────────────────────────────── */

export function CargoRunVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-400/60 bg-emerald-400/20 shadow-[0_0_30px_rgba(52,211,153,0.5)]"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-emerald-300" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.div>

        <div className="flex flex-col gap-1.5">
          {[
            { text: "Compiling hello v0.1.0", color: "text-neutral-300" },
            { text: "Finished in 0.42s", color: "text-emerald-300" },
            { text: "Running `target/debug/hello`", color: "text-neutral-300" },
            { text: "Hello, world!", color: "text-sky-200 font-semibold" },
          ].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.4 }}
              className={`rounded border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] ${line.color}`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2.4 — The compiler as a teacher. Speech bubble with a helpful error.
 * ────────────────────────────────────────────────────────────── */

export function CompilerTeacherVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center gap-4 px-2">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity }}
          className="text-6xl"
        >
          🤖
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex-1 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 font-mono text-[11px] leading-relaxed"
        >
          <div className="absolute -left-2 top-6 h-3 w-3 rotate-45 border-b border-l border-amber-400/40 bg-amber-400/10" />
          <div className="text-amber-200">
            <span className="font-bold">error[E0384]:</span> cannot assign twice to immutable variable{" "}
            <span className="text-white">`x`</span>
          </div>
          <div className="mt-1 text-neutral-300"> ├─ help: add `mut` to make it changeable</div>
          <div className="mt-1 text-emerald-300">
            <span className="text-neutral-500">─ </span>let <span className="font-bold">mut</span> x = 5;
          </div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}
