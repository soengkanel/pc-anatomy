"use client";

// Chapter 7 — Traits & Modules.
// Analogies: driver's licence (trait), photo frame (generic),
// filing cabinet (modules), app-store grid (crates.io).

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 7.1 — Trait = a licence / capability certificate.
 * ────────────────────────────────────────────────────────────── */

export function TraitVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-72 overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-400/[0.1] to-white/[0.02] shadow-[0_0_30px_rgba(251,191,36,0.15)]"
        >
          <div className="flex items-center justify-between border-b border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-200">
              Trait: Greet
            </div>
            <div className="text-lg">🎫</div>
          </div>
          <div className="p-3 font-mono text-[11.5px]">
            <div className="text-sky-300">trait Greet {"{"}</div>
            <div className="ml-3 text-neutral-300">fn hello(&amp;self) -&gt; String;</div>
            <div className="text-sky-300">{"}"}</div>
            <div className="mt-3 h-px bg-white/10" />
            <div className="mt-2 text-neutral-400">Anything that implements this promise…</div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 text-neutral-500 text-lg">↓</div>

        <div className="flex gap-3">
          {[
            { emoji: "🧑", name: "Student" },
            { emoji: "🐕", name: "Dog" },
            { emoji: "🤖", name: "Robot" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="text-3xl">{t.emoji}</div>
              <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200">
                impl Greet
              </div>
              <div className="text-[9.5px] text-neutral-400">{t.name}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center text-[10.5px] text-neutral-400">
          …can be treated the same way.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7.2 — Generic = a photo frame that fits any picture size.
 * ────────────────────────────────────────────────────────────── */

export function GenericVisual() {
  const pictures = [
    { emoji: "🖼️", label: "&str" },
    { emoji: "🎨", label: "i32" },
    { emoji: "📷", label: "bool" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-sky-200">
          fn wrap&lt;T&gt;(item: T) -&gt; Box&lt;T&gt;
        </div>

        <div className="flex items-center gap-4">
          {pictures.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-lg border-4 border-amber-500/60 bg-amber-500/[0.06] shadow-lg">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="text-3xl"
                >
                  {p.emoji}
                </motion.div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9.5px] text-white">
                  T = {p.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center text-[11px] leading-relaxed text-neutral-400">
          <span className="text-white font-semibold">One function</span> —
          works with any type <span className="font-mono text-amber-300">T</span>.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7.3 — Modules = a filing cabinet with labelled drawers.
 * ────────────────────────────────────────────────────────────── */

export function ModuleVisual() {
  const drawers = [
    { name: "math", items: ["add", "sub", "mul"] },
    { name: "text", items: ["trim", "split"] },
    { name: "io", items: ["read", "write"] },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-sky-200">
          mod math { } mod text { } mod io { }
        </div>

        <div className="w-80 space-y-1.5">
          {drawers.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="overflow-hidden rounded-lg border border-white/15 bg-gradient-to-r from-white/[0.06] to-white/[0.02]"
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
                <div className="text-lg">🗂️</div>
                <div className="font-mono text-[11.5px] font-semibold text-accent-bright">
                  mod {d.name}
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="ml-auto text-neutral-500 text-lg"
                >
                  ↦
                </motion.div>
              </div>
              <div className="flex gap-1.5 p-2">
                {d.items.map((it) => (
                  <div
                    key={it}
                    className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-neutral-300"
                  >
                    fn {it}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10.5px] text-neutral-300">
          use math::add;
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 7.4 — crates.io = an app store of code packages.
 * ────────────────────────────────────────────────────────────── */

export function CratesIoVisual() {
  const crates = [
    { name: "serde", desc: "JSON in/out", emoji: "📦" },
    { name: "tokio", desc: "async", emoji: "⚡" },
    { name: "clap", desc: "CLI parser", emoji: "⌨️" },
    { name: "regex", desc: "patterns", emoji: "🔎" },
    { name: "reqwest", desc: "HTTP", emoji: "🌐" },
    { name: "rand", desc: "random", emoji: "🎲" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-accent-bright">
          crates.io — the community shelf
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          {crates.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex flex-col items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center"
            >
              <div className="text-xl">{c.emoji}</div>
              <div className="font-mono text-[11.5px] font-semibold text-white">
                {c.name}
              </div>
              <div className="text-[9.5px] text-neutral-400">{c.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          $ cargo add serde
        </div>
      </div>
    </VisualFrame>
  );
}
