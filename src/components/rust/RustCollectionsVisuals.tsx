"use client";

// Chapter 6 — Collections & Iterators.
// Real-life analogies: stack of trays (Vec), phone book (HashMap),
// conveyor belt (Iterator).

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 6.1 — Vec = a growing stack of trays.
 * ────────────────────────────────────────────────────────────── */

export function VecVisual() {
  const items = ["apple 🍎", "banana 🍌", "cherry 🍒", "durian 🥭"];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          let mut fruit = vec![&quot;apple&quot;, &quot;banana&quot;];
        </div>

        <div className="relative flex flex-col-reverse gap-1.5">
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-40 items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3">
                <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent-bright">
                  [{i}]
                </span>
                <span className="text-[12px] text-white">{item}</span>
              </div>
              {i >= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.4 + 0.2 }}
                  className="rounded border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9.5px] text-emerald-200"
                >
                  .push()
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center text-[11px] text-neutral-400">
          Grows as needed. All items the same type.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6.2 — String: bytes strung together.
 * ────────────────────────────────────────────────────────────── */

export function StringVisual() {
  // Array.from splits by Unicode code points, so multi-code-unit
  // emojis like 🦀 stay whole. `.split("")` would tear the surrogate
  // pair and break SSR/CSR hydration (server sent broken bytes → `�`).
  const letters = Array.from("Rust 🦀 សួស្តី");
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          let name: String = String::from(&quot;Rust 🦀 សួស្តី&quot;);
        </div>

        <div className="flex items-end gap-1">
          {letters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
              className="flex h-10 w-8 items-center justify-center rounded-md border border-fuchsia-400/40 bg-fuchsia-400/10 font-mono text-[13px] font-semibold text-fuchsia-100"
              style={{
                fontFamily:
                  (c.codePointAt(0) ?? 0) > 4096 && (c.codePointAt(0) ?? 0) < 0x1f000
                    ? "var(--font-noto-khmer), sans-serif"
                    : undefined,
              }}
            >
              {c === " " ? "␣" : c}
            </motion.div>
          ))}
        </div>

        <div className="text-center text-[10.5px] leading-relaxed text-neutral-400">
          UTF-8 bytes. Works with English, Khmer, emoji — anything.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6.3 — HashMap = a phone book (name → number).
 * ────────────────────────────────────────────────────────────── */

export function HashMapVisual() {
  const entries = [
    { key: "Kanel", val: "012-345-678" },
    { key: "Sopheak", val: "099-111-222" },
    { key: "Chan", val: "070-987-654" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11.5px] text-emerald-200">
          HashMap&lt;String, String&gt;
        </div>

        <div className="w-80 overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-amber-400/[0.06] shadow-[0_0_30px_rgba(251,191,36,0.15)]">
          <div className="border-b border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-center font-mono text-[10.5px] uppercase tracking-widest text-amber-200">
            📖 Phone Book
          </div>
          <div className="divide-y divide-white/5">
            {entries.map((e, i) => (
              <motion.div
                key={e.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-center gap-3 px-3 py-2 font-mono text-[12px]"
              >
                <span className="w-16 text-fuchsia-200">{e.key}</span>
                <span className="text-neutral-500">→</span>
                <span className="text-sky-200">{e.val}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] text-neutral-300">
          book.get(&quot;Kanel&quot;) → Some(&quot;012-345-678&quot;)
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6.4 — Iterator = a conveyor belt.
 *       Items go through .map() and .filter() stations.
 * ────────────────────────────────────────────────────────────── */

export function IteratorVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="rounded border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] text-emerald-200">
          numbers.iter().map(|x| x * 2).filter(|x| *x &gt; 4).sum()
        </div>

        <div className="relative flex w-full items-center justify-between">
          {/* Input */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-mono text-neutral-500">input</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.05] font-mono text-[13px] text-white">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Belt with stations */}
          <div className="relative mx-2 flex-1">
            <div className="h-3 w-full rounded-full border border-white/10 bg-gradient-to-r from-neutral-800 to-neutral-700" />
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-y-0 left-2 flex items-center gap-4"
            >
              <div className="rounded-full bg-emerald-300 h-2 w-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div className="rounded-full bg-emerald-300 h-2 w-2" />
              <div className="rounded-full bg-emerald-300 h-2 w-2" />
            </motion.div>

            <div className="mt-2 flex justify-around">
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="rounded border border-sky-400/40 bg-sky-400/15 px-2 py-0.5 font-mono text-[9.5px] text-sky-200">
                  map(*2)
                </div>
                <div className="text-neutral-500 text-[10px]">2,4,6,8</div>
              </motion.div>

              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="flex flex-col items-center gap-0.5"
              >
                <div className="rounded border border-fuchsia-400/40 bg-fuchsia-400/15 px-2 py-0.5 font-mono text-[9.5px] text-fuchsia-200">
                  filter(&gt;4)
                </div>
                <div className="text-neutral-500 text-[10px]">6, 8</div>
              </motion.div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-mono text-neutral-500">sum</div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400/60 bg-amber-400/20 font-mono text-[14px] font-bold text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            >
              14
            </motion.div>
          </div>
        </div>

        <div className="text-center text-[10.5px] text-neutral-400">
          Chain steps. Each item passes through in order.
        </div>
      </div>
    </VisualFrame>
  );
}
