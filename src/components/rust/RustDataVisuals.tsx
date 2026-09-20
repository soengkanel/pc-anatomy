"use client";

// Chapter 5 — Shaping Data. Struct, Enum, Option, Result, methods.
// Real-life analogies: student ID card, traffic light, gift box, envelope.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 5.1 — Struct = a form / ID card with named fields.
 * ────────────────────────────────────────────────────────────── */

export function StructVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10.5px] uppercase tracking-widest text-accent-bright">
          struct Student
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-80 overflow-hidden rounded-2xl border-2 border-white/15 bg-gradient-to-br from-sky-500/10 to-white/[0.02] shadow-lg"
        >
          {/* Photo strip */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.06] p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-3xl">
              🎓
            </div>
            <div>
              <div className="text-[10.5px] font-mono uppercase tracking-widest text-neutral-400">
                Student ID Card
              </div>
              <div className="text-[13.5px] font-bold text-white">Kanel Soeng</div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-1 p-3 font-mono text-[11.5px]">
            {[
              { key: "name:", val: `"Kanel"`, kv: "String" },
              { key: "age:", val: "24", kv: "u32" },
              { key: "grade:", val: "'A'", kv: "char" },
              { key: "active:", val: "true", kv: "bool" },
            ].map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] px-2 py-1"
              >
                <span className="text-neutral-400">{f.key}</span>
                <span className="text-emerald-300">{f.val}</span>
                <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9.5px] text-neutral-500">
                  {f.kv}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center text-[11px] text-neutral-400">
          A struct groups related fields under a name.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5.2 — Enum = traffic light (one variant at a time).
 * ────────────────────────────────────────────────────────────── */

export function EnumVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-6">
        {/* Traffic light body */}
        <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-600 bg-neutral-800 p-2">
          {[
            { color: "#ef4444", label: "Red", delay: 0 },
            { color: "#facc15", label: "Yellow", delay: 1.6 },
            { color: "#22c55e", label: "Green", delay: 3.2 },
          ].map((l, i) => (
            <motion.div
              key={l.label}
              animate={{
                opacity: [0.2, 0.2, 1, 1, 0.2],
                boxShadow: [
                  "0 0 0px transparent",
                  "0 0 0px transparent",
                  `0 0 25px ${l.color}`,
                  `0 0 25px ${l.color}`,
                  "0 0 0px transparent",
                ],
              }}
              transition={{ duration: 4.8, times: [0, 0.33 * i, 0.33 * i + 0.02, 0.33 * (i + 1) - 0.02, 0.33 * (i + 1)], repeat: Infinity }}
              className="h-9 w-9 rounded-full"
              style={{ backgroundColor: l.color }}
            />
          ))}
        </div>

        {/* Enum listing */}
        <div className="font-mono text-[12px]">
          <div className="text-sky-300">enum Light {"{"}</div>
          <div className="ml-3 text-red-300">Red,</div>
          <div className="ml-3 text-amber-300">Yellow,</div>
          <div className="ml-3 text-emerald-300">Green,</div>
          <div className="text-sky-300">{"}"}</div>
          <div className="mt-2 rounded border border-white/10 bg-black/40 px-2 py-1 text-neutral-300">
            One value = one variant.
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5.3 — Option<T> = a gift box (maybe something inside, maybe empty).
 * ────────────────────────────────────────────────────────────── */

export function OptionVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-around gap-4">
        {/* Some(gift) */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="text-6xl"
          >
            🎁
          </motion.div>
          <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
            Some(&quot;book&quot;)
          </div>
          <div className="text-center text-[10.5px] text-neutral-400">
            has a value
            <br />
            inside
          </div>
        </div>

        <div className="text-3xl text-neutral-500">|</div>

        {/* None (empty) */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="text-6xl grayscale"
          >
            📦
          </motion.div>
          <div className="rounded-md border border-neutral-400/40 bg-neutral-400/10 px-2.5 py-1 font-mono text-[11px] text-neutral-200">
            None
          </div>
          <div className="text-center text-[10.5px] text-neutral-500">
            empty
            <br />
            (safe null)
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5.4 — Result<T, E> = an envelope with good OR bad news.
 * ────────────────────────────────────────────────────────────── */

export function ResultVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-around gap-4">
        {/* Ok envelope */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="relative flex h-16 w-24 items-center justify-center rounded-md border-2 border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
          >
            <div className="text-3xl">✅</div>
          </motion.div>
          <div className="rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
            Ok(42)
          </div>
          <div className="text-center text-[10.5px] text-neutral-400">success</div>
        </div>

        <div className="text-3xl text-neutral-500">or</div>

        {/* Err envelope */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="relative flex h-16 w-24 items-center justify-center rounded-md border-2 border-rose-400/60 bg-rose-400/10 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
          >
            <div className="text-3xl">⚠️</div>
          </motion.div>
          <div className="rounded-md border border-rose-400/40 bg-rose-400/10 px-2.5 py-1 font-mono text-[11px] text-rose-200">
            Err(&quot;file missing&quot;)
          </div>
          <div className="text-center text-[10.5px] text-neutral-400">failure</div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5.5 — Method on a struct. Student.greet()
 * ────────────────────────────────────────────────────────────── */

export function MethodVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full items-center justify-center gap-3">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-400/60 bg-sky-400/10 text-3xl shadow-[0_0_18px_rgba(56,189,248,0.4)]"
        >
          🎓
        </motion.div>

        <div className="rounded border border-white/10 bg-black/40 px-2 py-1 font-mono text-[12px] text-white">
          student<span className="text-neutral-500">.</span>
          <span className="text-yellow-200">greet</span>()
        </div>

        <motion.div
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl text-neutral-500"
        >
          →
        </motion.div>

        <motion.div
          animate={{ opacity: [0.6, 1, 0.6], y: [-1, 1, -1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative rounded-2xl border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 font-mono text-[11.5px] text-emerald-100"
        >
          <div className="absolute -left-2 top-3 h-3 w-3 rotate-45 border-b border-l border-emerald-400/50 bg-emerald-400/10" />
          Hi! I&rsquo;m Kanel.
        </motion.div>
      </div>
    </VisualFrame>
  );
}
