"use client";

// Chapter 4 — Memory & Pointers.
// The prelude to Ownership. Real-life analogies for stack, heap,
// addresses, pointers, smart pointers, and what Rust catches that C misses.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 4.1 — Stack vs Heap.
 *       Left: a stack of cafeteria trays (LIFO, fast, fixed).
 *       Right: a shopping cart with random items (heap, dynamic).
 * ────────────────────────────────────────────────────────────── */

export function StackVsHeapVisual() {
  return (
    <VisualFrame>
      <div className="grid w-full grid-cols-2 gap-6">
        {/* Stack: cafeteria trays */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-widest text-emerald-200">
            📚 Stack
          </div>
          <div className="relative flex h-40 w-32 flex-col-reverse items-center gap-0.5 rounded-lg border-2 border-emerald-400/30 bg-black/40 p-2">
            {[
              { label: "x = 5", color: "bg-emerald-400/25" },
              { label: "y = 12", color: "bg-emerald-400/20" },
              { label: "z = 3", color: "bg-emerald-400/15" },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.4 }}
                className={`w-full rounded border border-emerald-400/40 ${t.color} px-2 py-1 text-center font-mono text-[10.5px] text-emerald-100`}
              >
                {t.label}
              </motion.div>
            ))}
            {/* Arrow into top */}
            <motion.div
              animate={{ y: [-20, -6, -20] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute -top-5 text-emerald-300"
            >
              ↓ push
            </motion.div>
          </div>
          <div className="w-full text-[10.5px] leading-relaxed text-neutral-300">
            <div className="font-semibold text-emerald-200">Fast · Fixed size</div>
            <div className="text-neutral-400">
              Every function&rsquo;s local variables land here. Pop off when the function ends. Automatic.
            </div>
          </div>
        </div>

        {/* Heap: shopping cart */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full border border-fuchsia-400/40 bg-fuchsia-400/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-widest text-fuchsia-200">
            🛒 Heap
          </div>
          <div className="relative flex h-40 w-32 items-center justify-center rounded-lg border-2 border-fuchsia-400/30 bg-black/40 p-2">
            {[
              { top: "10%", left: "15%", label: "String" },
              { top: "45%", left: "50%", label: "Vec" },
              { top: "70%", left: "10%", label: "Box" },
              { top: "20%", left: "60%", label: "HashMap" },
              { top: "80%", left: "60%", label: "data…" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="absolute rounded border border-fuchsia-400/40 bg-fuchsia-400/15 px-1.5 py-0.5 font-mono text-[9.5px] text-fuchsia-100"
                style={{ top: b.top, left: b.left }}
              >
                {b.label}
              </motion.div>
            ))}
          </div>
          <div className="w-full text-[10.5px] leading-relaxed text-neutral-300">
            <div className="font-semibold text-fuchsia-200">Flexible · Dynamic</div>
            <div className="text-neutral-400">
              For values whose size changes at runtime. Slower, and needs cleanup —
              Rust does it for you.
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.2 — Memory Addresses.
 *       Row of houses with hex address labels. A "pointer" is a
 *       sticky note that points to one house.
 * ────────────────────────────────────────────────────────────── */

export function AddressesVisual() {
  const houses = [
    { addr: "0x100", value: "5", label: "" },
    { addr: "0x104", value: "12", label: "" },
    { addr: "0x108", value: "'A'", label: "" },
    { addr: "0x10C", value: "?", label: "" },
    { addr: "0x110", value: "42", label: "target" },
  ];

  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 text-center font-mono text-[11px] uppercase tracking-widest text-accent-bright">
          RAM = a street of tiny houses
        </div>

        {/* Row of houses */}
        <div className="flex justify-center gap-1.5">
          {houses.map((h, i) => (
            <motion.div
              key={h.addr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="relative flex flex-col items-center gap-0.5"
            >
              {/* House */}
              <div
                className={`flex h-14 w-14 flex-col items-center justify-center rounded border-2 font-mono text-xs transition-colors ${
                  h.label === "target"
                    ? "border-amber-400/60 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                    : "border-white/20 bg-white/[0.05]"
                }`}
              >
                <div
                  className={`text-[10px] ${h.label === "target" ? "text-amber-200" : "text-neutral-300"}`}
                >
                  {h.value}
                </div>
              </div>
              {/* Address label */}
              <div className="rounded bg-black/40 px-1 py-0.5 font-mono text-[9px] text-neutral-400">
                {h.addr}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pointer sticky note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative mx-auto mt-8 w-56"
        >
          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="rounded-md border border-yellow-300/60 bg-yellow-300/[0.15] p-2.5 text-center font-mono text-[11px] text-yellow-100 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          >
            let p: &i32 = &target;
            <div className="mt-1 text-[10px] text-yellow-200/70">points to 0x110</div>
          </motion.div>

          {/* Arrow to target */}
          <motion.svg
            viewBox="0 0 100 40"
            className="absolute -top-16 right-4 h-16 w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.path
              d="M 90 30 Q 60 5 20 5"
              stroke="rgba(252, 211, 77, 0.7)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
            />
            <motion.polygon
              points="15,3 22,5 15,8"
              fill="rgba(252, 211, 77, 0.9)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            />
          </motion.svg>
        </motion.div>

        <div className="mt-3 text-center text-[10.5px] leading-relaxed text-neutral-400">
          A <span className="text-yellow-200">pointer</span> is just an{" "}
          <span className="font-mono text-white">address</span> — a house number saying
          &ldquo;the value lives over there.&rdquo;
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.3 — C pointer bugs.
 *       Three horror-story panels: dangling, null, double-free.
 * ────────────────────────────────────────────────────────────── */

export function CPointerBugsVisual() {
  const bugs = [
    {
      emoji: "🏚️",
      title: "Dangling pointer",
      subtitle: "free() called, pointer still used",
      code: "*p = 5;  // 💀",
      color: "border-rose-400/40 bg-rose-400/[0.08]",
      accent: "text-rose-200",
    },
    {
      emoji: "🕳️",
      title: "Null dereference",
      subtitle: "p was never set",
      code: "*NULL;   // 💥",
      color: "border-amber-400/40 bg-amber-400/[0.08]",
      accent: "text-amber-200",
    },
    {
      emoji: "♻️",
      title: "Double free",
      subtitle: "same memory freed twice",
      code: "free(p);\nfree(p);// 💥",
      color: "border-fuchsia-400/40 bg-fuchsia-400/[0.08]",
      accent: "text-fuchsia-200",
    },
  ];

  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/[0.06] px-3 py-1 text-[10.5px] uppercase tracking-widest text-rose-200">
          <span>💀</span>
          C / C++ classic bugs
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {bugs.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.15 }}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 ${b.color}`}
            >
              <motion.div
                animate={{ rotate: [-3, 3, -3], y: [0, -2, 0] }}
                transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
                className="text-3xl"
              >
                {b.emoji}
              </motion.div>
              <div className={`text-center text-[11.5px] font-bold ${b.accent}`}>
                {b.title}
              </div>
              <div className="text-center text-[9.5px] leading-tight text-neutral-400">
                {b.subtitle}
              </div>
              <pre className="mt-1 w-full rounded border border-white/10 bg-black/50 p-1.5 text-center font-mono text-[9.5px] text-neutral-200">
                {b.code}
              </pre>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/[0.05] p-2.5 text-center text-[11px] leading-relaxed text-rose-100">
          <span className="font-bold">In C, all three compile cleanly</span> — you only find
          out when the program crashes in production. Sometimes months later.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.4 — Smart Pointers: Box, Rc, Arc.
 *       Each is a sticky note with a cleanup crew attached.
 * ────────────────────────────────────────────────────────────── */

export function SmartPointersVisual() {
  const items = [
    {
      name: "Box<T>",
      subtitle: "one owner on the heap",
      emoji: "📦",
      analogy: "A gift box with your name on it. When you leave, it&rsquo;s cleaned up.",
      color: "border-sky-400/40 bg-sky-400/[0.08] text-sky-200",
    },
    {
      name: "Rc<T>",
      subtitle: "reference counted (single-threaded)",
      emoji: "🎈",
      analogy: "A balloon with several people holding strings. When the last person lets go, the balloon pops itself.",
      color: "border-fuchsia-400/40 bg-fuchsia-400/[0.08] text-fuchsia-200",
    },
    {
      name: "Arc<T>",
      subtitle: "atomic Rc (thread-safe)",
      emoji: "🔒",
      analogy: "Same balloon, but the strings are locked — safe when many threads hold them at once.",
      color: "border-emerald-400/40 bg-emerald-400/[0.08] text-emerald-200",
    },
  ];

  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[10.5px] uppercase tracking-widest text-accent-bright">
          <span>✨</span>
          Rust smart pointers · auto cleanup
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.15 }}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 ${it.color}`}
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}
                className="text-3xl"
              >
                {it.emoji}
              </motion.div>
              <div className="font-mono text-[12.5px] font-bold">{it.name}</div>
              <div className="text-center text-[9.5px] leading-tight opacity-80">
                {it.subtitle}
              </div>
              <div
                className="text-center text-[10px] leading-relaxed text-neutral-300"
                dangerouslySetInnerHTML={{ __html: it.analogy }}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1 text-center font-mono text-[9.5px]">
          <div className="rounded border border-white/10 bg-white/[0.03] p-1.5">
            <span className="text-neutral-500">let b = </span>
            <span className="text-sky-200">Box::new(5)</span>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-1.5">
            <span className="text-neutral-500">let a = </span>
            <span className="text-fuchsia-200">Rc::new(5)</span>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-1.5">
            <span className="text-neutral-500">let a = </span>
            <span className="text-emerald-200">Arc::new(5)</span>
          </div>
        </div>

        <div className="mt-2 text-center text-[10.5px] leading-relaxed text-neutral-400">
          You never call <span className="font-mono text-white">free()</span>. When the
          smart pointer goes out of scope, cleanup happens automatically.
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4.5 — Rust vs C: same bug scenarios, different outcomes.
 * ────────────────────────────────────────────────────────────── */

export function RustVsCVisual() {
  const scenarios = [
    { name: "Dangling pointer", c: "runtime crash", rust: "compile error" },
    { name: "Null dereference", c: "segfault", rust: "no null — use Option" },
    { name: "Double free", c: "corrupted heap", rust: "impossible" },
    { name: "Data race", c: "silent bug", rust: "compile error" },
  ];

  return (
    <VisualFrame>
      <div className="w-full">
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-center font-mono text-[10.5px] uppercase tracking-widest text-rose-200">
            💀 C / C++
          </div>
          <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-center font-mono text-[10.5px] uppercase tracking-widest text-emerald-200">
            🦀 Rust
          </div>
        </div>

        <div className="space-y-1.5">
          {scenarios.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="grid grid-cols-[1fr_1.4fr_1.4fr] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2"
            >
              <div className="text-[11px] font-semibold text-white">{s.name}</div>
              <div className="flex items-center gap-1.5 rounded border border-rose-400/30 bg-rose-400/[0.06] px-2 py-1 font-mono text-[10.5px] text-rose-200">
                <span>💥</span> {s.c}
              </div>
              <div className="flex items-center gap-1.5 rounded border border-emerald-400/30 bg-emerald-400/[0.08] px-2 py-1 font-mono text-[10.5px] text-emerald-200">
                <span>✅</span> {s.rust}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border border-accent/30 bg-accent-soft p-2.5 text-center text-[11px] leading-relaxed text-accent-bright">
          Rust moves these bugs from{" "}
          <span className="font-bold text-white">3 AM production crashes</span> to{" "}
          <span className="font-bold text-white">compile-time errors</span> — the same
          performance, without the pain.
        </div>
      </div>
    </VisualFrame>
  );
}
