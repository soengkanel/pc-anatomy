"use client";

// Animated SVG illustrations used across every subtopic in the IT lecture.
// Each component is self-contained and self-animating — drop it into a card
// and it plays on its own. Framer Motion drives the entrances and loops.

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
 * Shared visual shell — every illustration lives inside one of these
 * so the aspect ratio, background glow, and rounded corners are consistent.
 * ────────────────────────────────────────────────────────────── */

export function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1220] via-[#0a1428] to-[#0b0f17]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px 400px at 30% 20%, rgba(77,141,255,0.18), transparent 60%)," +
            "radial-gradient(500px 350px at 80% 80%, rgba(125,211,252,0.14), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  HARDWARE
 * ═════════════════════════════════════════════════════════════ */

// A glowing CPU chip. Pulses, with instruction dots orbiting.
export function ProcessorVisual() {
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Chip body */}
        <motion.div
          className="relative h-40 w-40 rounded-2xl border-2 border-accent/60 bg-gradient-to-br from-accent/25 to-sky-500/10 shadow-[0_0_40px_rgba(77,141,255,0.4)]"
          animate={{ boxShadow: ["0 0 40px rgba(77,141,255,0.25)", "0 0 60px rgba(77,141,255,0.55)", "0 0 40px rgba(77,141,255,0.25)"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pins on all four sides */}
          {[...Array(6)].map((_, i) => (
            <div key={`t${i}`} style={{ left: `${12 + i * 16}%` }} className="absolute -top-2 h-2 w-1.5 rounded-t bg-accent-bright/70" />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`b${i}`} style={{ left: `${12 + i * 16}%` }} className="absolute -bottom-2 h-2 w-1.5 rounded-b bg-accent-bright/70" />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`l${i}`} style={{ top: `${12 + i * 16}%` }} className="absolute -left-2 h-1.5 w-2 rounded-l bg-accent-bright/70" />
          ))}
          {[...Array(6)].map((_, i) => (
            <div key={`r${i}`} style={{ top: `${12 + i * 16}%` }} className="absolute -right-2 h-1.5 w-2 rounded-r bg-accent-bright/70" />
          ))}

          {/* CPU label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent-bright">
                Brain
              </div>
              <div className="mt-1 text-2xl font-black text-white">CPU</div>
            </div>
          </div>

          {/* Inner circuit lines */}
          <svg className="absolute inset-4" viewBox="0 0 100 100">
            <motion.path
              d="M20,50 L40,50 L40,30 L60,30 L60,50 L80,50"
              stroke="rgba(125,211,252,0.7)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="60"
              animate={{ strokeDashoffset: [60, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M20,70 L50,70 L50,55"
              stroke="rgba(77,141,255,0.7)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="40"
              animate={{ strokeDashoffset: [40, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Orbiting instruction dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.8)]"
            animate={{
              rotate: [i * 90, i * 90 + 360],
            }}
            style={{ transformOrigin: "50% 50%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div style={{ transform: "translate(120px, 0)" }} className="h-full w-full rounded-full bg-sky-300" />
          </motion.div>
        ))}

        {/* Speed callout */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs backdrop-blur"
        >
          <div className="font-mono text-[10px] text-accent-bright">THINKS AT</div>
          <div className="font-bold text-white">Billions of steps / second</div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

// HDD (spinning platter) vs SSD (flashing memory cells).
export function StorageCompareVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full items-center justify-center gap-8">
        {/* HDD */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-36 w-36 rounded-full border-2 border-white/20 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-inner">
            <motion.div
              className="absolute inset-2 rounded-full border border-white/10 bg-gradient-to-br from-neutral-700 to-neutral-800"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-4 rounded-full border border-white/10">
                <div className="absolute inset-6 rounded-full border border-white/10" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
              {/* Read arm */}
              <div className="absolute right-[-6%] top-1/2 h-1 w-16 -translate-y-1/2 origin-right rounded-full bg-neutral-400" />
            </motion.div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">HDD</div>
            <div className="text-[11px] text-neutral-400">Spinning disk · slower</div>
          </div>
        </div>

        {/* VS */}
        <div className="text-lg font-black text-neutral-500">VS</div>

        {/* SSD */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative grid h-36 w-36 grid-cols-4 grid-rows-4 gap-1 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-[#0e1930] to-[#0b1428] p-2">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="rounded-sm bg-accent-bright/70"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: (i * 0.07) % 1.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white">SSD</div>
            <div className="text-[11px] text-neutral-400">Flash chips · much faster</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

// RAM stick with memory cells rapidly lighting up.
export function RamVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-[380px] items-center gap-1 rounded-lg border-2 border-emerald-400/40 bg-gradient-to-b from-emerald-900/40 to-emerald-950/40 px-2">
          {/* Notch */}
          <div className="absolute bottom-0 left-1/2 h-3 w-6 -translate-x-1/2 rounded-t bg-neutral-950" />
          {/* Cells */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="h-14 flex-1 rounded-sm border border-emerald-400/30 bg-emerald-400/10"
              animate={{
                backgroundColor: [
                  "rgba(52,211,153,0.10)",
                  "rgba(52,211,153,0.85)",
                  "rgba(52,211,153,0.10)",
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: (i * 0.09) % 1.2,
              }}
            />
          ))}
        </div>
        <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] backdrop-blur">
          <span className="font-mono text-emerald-400">RAM</span>
          <span className="ml-2 text-white/80">short-term memory · forgets when off</span>
        </div>
      </div>
    </VisualFrame>
  );
}

// Speed hierarchy pyramid.
export function MemoryPyramidVisual() {
  const layers = [
    { label: "Cache", speed: "fastest", color: "bg-accent" },
    { label: "RAM", speed: "very fast", color: "bg-sky-500" },
    { label: "SSD", speed: "fast", color: "bg-emerald-500" },
    { label: "HDD", speed: "slower", color: "bg-amber-500" },
  ];
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-1">
        {layers.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center justify-between rounded-lg px-4 py-2 text-white shadow-lg ${l.color}`}
            style={{ width: `${180 + i * 60}px` }}
          >
            <span className="text-sm font-bold">{l.label}</span>
            <span className="text-[11px] opacity-80">{l.speed}</span>
          </motion.div>
        ))}
        <div className="mt-2 text-[11px] text-neutral-400">↑ smaller &amp; faster</div>
      </div>
    </VisualFrame>
  );
}

// Boot sequence: power → check → OS logo, repeats.
export function BootSequenceVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-4">
        {/* Screen */}
        <div className="relative flex h-40 w-64 flex-col items-center justify-center overflow-hidden rounded-lg border-4 border-neutral-800 bg-black">
          <motion.div
            className="text-center"
            animate={{ opacity: [1, 0, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.25, 0.75, 1] }}
          >
            <div className="text-4xl">⏻</div>
            <div className="mt-2 text-[11px] text-neutral-500">powered off</div>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{ opacity: [0, 1, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
          >
            <div className="font-mono text-[11px] text-accent-bright">CHECKING…</div>
            <div className="mt-1 font-mono text-[10px] text-neutral-500">CPU · RAM · Disk</div>
            <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-accent-bright"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{ opacity: [0, 0, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.6, 0.75, 1] }}
          >
            <div className="text-3xl font-black text-white">Hello</div>
            <div className="mt-1 text-[11px] text-accent-bright">system ready</div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-1">
          <Step index="1" label="Power" active />
          <Step index="2" label="Check hardware" active />
          <Step index="3" label="Load system" active />
        </div>
      </div>
    </VisualFrame>
  );
}

function Step({ index, label }: { index: string; label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5">
      <span className="font-mono text-[10px] text-accent-bright">{index}</span>
      <span className="text-[12px] text-white">{label}</span>
    </div>
  );
}

// Motherboard - top-down PCB with animated connections.
export function MotherboardVisual() {
  return (
    <VisualFrame>
      <svg viewBox="0 0 400 220" className="h-full w-full">
        {/* Board */}
        <rect x="10" y="10" width="380" height="200" rx="10" fill="#0d2b1a" stroke="#26543a" strokeWidth="2" />
        {/* Circuit trace pattern */}
        {[30, 50, 70, 90, 110, 130, 150, 170, 190].map((y) => (
          <line key={y} x1="20" x2="380" y1={y} y2={y} stroke="rgba(74,222,128,0.08)" strokeWidth="0.5" />
        ))}

        {/* CPU */}
        <rect x="60" y="50" width="70" height="70" rx="6" fill="#1e3a8a" stroke="#4d8dff" strokeWidth="2" />
        <text x="95" y="90" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="700">CPU</text>

        {/* RAM slots */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={160 + i * 18} y="40" width="14" height="90" rx="2" fill="#059669" stroke="#34d399" strokeWidth="1" />
        ))}
        <text x="196" y="150" textAnchor="middle" fontSize="10" fill="#a7f3d0">RAM</text>

        {/* GPU slot */}
        <rect x="60" y="150" width="180" height="30" rx="4" fill="#7c2d12" stroke="#fb923c" strokeWidth="1" />
        <text x="150" y="170" textAnchor="middle" fontSize="11" fill="#fed7aa" fontWeight="600">GPU · PCIe</text>

        {/* Storage */}
        <rect x="270" y="50" width="100" height="30" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="1" />
        <text x="320" y="70" textAnchor="middle" fontSize="11" fill="#dbeafe" fontWeight="600">SSD</text>

        {/* BIOS/CMOS */}
        <rect x="290" y="100" width="60" height="30" rx="4" fill="#4c1d95" stroke="#a78bfa" strokeWidth="1" />
        <text x="320" y="120" textAnchor="middle" fontSize="10" fill="#ddd6fe">BIOS</text>

        {/* Ports */}
        <rect x="290" y="150" width="80" height="40" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
        <text x="330" y="175" textAnchor="middle" fontSize="10" fill="#cbd5e1">USB · HDMI</text>

        {/* Animated data flow lines */}
        <motion.circle
          r="3"
          fill="#7dd3fc"
          animate={{
            cx: [130, 160],
            cy: [85, 85],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="3"
          fill="#4d8dff"
          animate={{
            cx: [130, 270],
            cy: [85, 65],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          r="3"
          fill="#fb923c"
          animate={{
            cx: [95, 95],
            cy: [120, 150],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  SOFTWARE
 * ═════════════════════════════════════════════════════════════ */

// Software stack: Apps → OS → Hardware.
export function SoftwareStackVisual() {
  const layers = [
    { top: "Apps", sub: "browser, games, docs", color: "from-sky-400 to-sky-600" },
    { top: "Operating System", sub: "the manager", color: "from-accent to-blue-600" },
    { top: "Hardware", sub: "chips & wires", color: "from-neutral-600 to-neutral-800" },
  ];
  return (
    <VisualFrame>
      <div className="flex flex-col items-stretch gap-3 min-w-[320px]">
        {layers.map((l, i) => (
          <motion.div
            key={l.top}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-xl bg-gradient-to-r ${l.color} px-5 py-4 shadow-lg`}
          >
            <div className="text-base font-bold text-white">{l.top}</div>
            <div className="text-[11px] text-white/80">{l.sub}</div>
          </motion.div>
        ))}
        <div className="text-center text-[11px] text-neutral-400">software sits on top of hardware</div>
      </div>
    </VisualFrame>
  );
}

// OS family - floating cards.
export function OSFamilyVisual() {
  const items = [
    { name: "Windows", emoji: "🪟", color: "bg-blue-500" },
    { name: "macOS", emoji: "🍎", color: "bg-neutral-700" },
    { name: "Linux", emoji: "🐧", color: "bg-orange-500" },
    { name: "Android", emoji: "🤖", color: "bg-emerald-500" },
    { name: "iOS", emoji: "📱", color: "bg-slate-500" },
  ];
  return (
    <VisualFrame>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {items.map((it, i) => (
          <motion.div
            key={it.name}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
            className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl ${it.color} text-white shadow-lg`}
          >
            <div className="text-2xl">{it.emoji}</div>
            <div className="mt-1 text-[10px] font-semibold">{it.name}</div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// File tree that expands.
export function FileTreeVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col gap-1.5 font-mono text-[13px] text-neutral-300">
        {[
          { d: 0, label: "📁 My Computer" },
          { d: 1, label: "📁 Documents" },
          { d: 2, label: "📄 report.docx" },
          { d: 2, label: "📄 notes.txt" },
          { d: 1, label: "📁 Pictures" },
          { d: 2, label: "🖼️ vacation.jpg" },
          { d: 1, label: "📁 Music" },
          { d: 2, label: "🎵 song.mp3" },
        ].map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: i * 0.08 }}
            style={{ paddingLeft: n.d * 20 }}
          >
            {n.label}
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Package install progress.
export function PackageInstallVisual() {
  return (
    <VisualFrame>
      <div className="flex w-[320px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-2xl">📦</div>
          <div>
            <div className="text-sm font-semibold text-white">Installing app…</div>
            <div className="text-[11px] text-neutral-400">Making it ready to use</div>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-accent"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-neutral-500">
          <span>Downloading</span>
          <span>Installing</span>
          <span>Ready ✓</span>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  NETWORKING
 * ═════════════════════════════════════════════════════════════ */

// Nested network scales: PAN → LAN → MAN → WAN.
export function NetworkScalesVisual() {
  const rings = [
    { size: 260, label: "WAN — the world", color: "border-sky-400/40" },
    { size: 200, label: "MAN — city", color: "border-accent/60" },
    { size: 140, label: "LAN — building", color: "border-emerald-400/70" },
    { size: 80, label: "PAN — you", color: "border-amber-400/80" },
  ];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        {rings.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`absolute flex items-end justify-center rounded-full border-2 ${r.color}`}
            style={{ width: r.size, height: r.size }}
          >
            <div className="mb-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white">
              {r.label}
            </div>
          </motion.div>
        ))}
        <div className="text-2xl">📱</div>
      </div>
    </VisualFrame>
  );
}

// IP & MAC address cards.
export function IpMacVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-[220px] rounded-xl border border-accent/40 bg-gradient-to-br from-accent/15 to-transparent p-4"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">IP Address</div>
          <div className="mt-1 font-mono text-lg text-white">192.168.1.10</div>
          <div className="mt-2 text-[11px] text-neutral-400">changes when you move</div>
          <div className="mt-2 flex gap-1 text-[10px]">
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-neutral-300">home</span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="rounded bg-accent/30 px-1.5 py-0.5 text-white"
            >
              school
            </motion.span>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-neutral-300">café</span>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          className="w-[220px] rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/15 to-transparent p-4"
        >
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">MAC Address</div>
          <div className="mt-1 font-mono text-[15px] text-white">A4:C3:F0:12:9B:5E</div>
          <div className="mt-2 text-[11px] text-neutral-400">never changes · built-in</div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-300">🔒 permanent</div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

// Switch (local) vs Router (between networks).
export function SwitchRouterVisual() {
  return (
    <VisualFrame>
      <svg viewBox="0 0 400 200" className="h-full w-full">
        {/* Left: switch with 4 local devices */}
        <rect x="130" y="80" width="60" height="30" rx="4" fill="#059669" stroke="#34d399" strokeWidth="2" />
        <text x="160" y="100" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">SWITCH</text>
        <text x="160" y="125" textAnchor="middle" fontSize="9" fill="#a7f3d0">connects local devices</text>

        {["💻", "📱", "🖥️", "🖨️"].map((emoji, i) => {
          const x = 40 + i * 25;
          return (
            <g key={i}>
              <line x1={x} y1={70} x2={160} y2={80} stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />
              <text x={x} y={60} textAnchor="middle" fontSize="18">{emoji}</text>
            </g>
          );
        })}

        {/* Right: router connecting to internet */}
        <rect x="240" y="80" width="60" height="30" rx="4" fill="#1e40af" stroke="#60a5fa" strokeWidth="2" />
        <text x="270" y="100" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">ROUTER</text>
        <text x="270" y="125" textAnchor="middle" fontSize="9" fill="#bfdbfe">between networks</text>

        <line x1="190" y1="95" x2="240" y2="95" stroke="#60a5fa" strokeWidth="2" />
        <text x="215" y="90" textAnchor="middle" fontSize="9" fill="#93c5fd">bridge</text>

        <text x="350" y="60" textAnchor="middle" fontSize="30">🌍</text>
        <line x1="300" y1="95" x2="340" y2="70" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />
        <text x="350" y="105" textAnchor="middle" fontSize="9" fill="#93c5fd">to the internet</text>

        {/* Animated packet */}
        <motion.circle
          r="4"
          fill="#7dd3fc"
          animate={{ cx: [60, 160, 270, 340], cy: [70, 95, 95, 70] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </VisualFrame>
  );
}

// Ports = doors on a building.
export function PortsVisual() {
  const doors = [
    { n: 80, name: "HTTP", desc: "web" },
    { n: 443, name: "HTTPS", desc: "secure web" },
    { n: 22, name: "SSH", desc: "remote" },
    { n: 25, name: "SMTP", desc: "email" },
  ];
  return (
    <VisualFrame>
      <div className="flex flex-col items-center">
        <div className="rounded-t-lg bg-neutral-800 px-6 py-1 text-[11px] font-mono text-neutral-400">
          🏢 SERVER
        </div>
        <div className="flex gap-2 rounded-b-lg border-2 border-t-0 border-neutral-700 bg-neutral-900 p-3">
          {doors.map((d, i) => (
            <motion.div
              key={d.n}
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              className="flex w-24 flex-col items-center gap-1 rounded-md border border-accent/30 bg-accent/10 p-2"
            >
              <div className="font-mono text-lg font-black text-accent-bright">:{d.n}</div>
              <div className="text-xs font-bold text-white">{d.name}</div>
              <div className="text-[10px] text-neutral-400">{d.desc}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-neutral-400">
          each door leads to a different service
        </div>
      </div>
    </VisualFrame>
  );
}

// Ping = radar pulse.
export function PingRadarVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-8">
        <div className="text-4xl">💻</div>
        <div className="relative flex h-32 w-32 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-accent"
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: [0, 120], height: [0, 120], opacity: [0.9, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
            />
          ))}
          <div className="h-3 w-3 rounded-full bg-accent-bright shadow-[0_0_12px_rgba(77,141,255,0.9)]" />
        </div>
        <div className="text-4xl">🖥️</div>
      </div>
    </VisualFrame>
  );
}

// VPN encrypted tunnel.
export function VpnTunnelVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💻</div>
          <div className="relative h-14 w-64 overflow-hidden rounded-full border-2 border-accent bg-gradient-to-r from-accent/30 via-sky-500/30 to-accent/30">
            {/* Encrypted flow */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 rounded bg-accent-bright/90 px-1.5 py-0.5 font-mono text-[9px] text-white"
                animate={{ x: [-30, 260] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
              >
                #x9k
              </motion.div>
            ))}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white">
                🔒 encrypted tunnel
              </span>
            </div>
          </div>
          <div className="text-3xl">🌍</div>
        </div>
        <div className="text-[11px] text-neutral-400">
          nobody in between can read what&rsquo;s inside
        </div>
      </div>
    </VisualFrame>
  );
}

// Bandwidth pipe filling.
export function BandwidthVisual() {
  const pipes = [
    { label: "Slow · 5 Mbps", width: "20%", color: "from-amber-500 to-amber-400" },
    { label: "Okay · 50 Mbps", width: "55%", color: "from-emerald-500 to-emerald-400" },
    { label: "Fast · 1 Gbps", width: "95%", color: "from-accent to-sky-400" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-[340px] flex-col gap-3">
        {pipes.map((p, i) => (
          <div key={p.label} className="flex items-center gap-2">
            <div className="w-24 text-[11px] text-neutral-300">{p.label}</div>
            <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${p.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: p.width }}
                viewport={{ once: false }}
                transition={{ duration: 1.2, delay: i * 0.15 }}
              />
            </div>
          </div>
        ))}
        <div className="mt-2 text-center text-[11px] text-neutral-400">
          fatter pipe · more data at once
        </div>
      </div>
    </VisualFrame>
  );
}

// Cloud with orbiting services.
export function CloudVisual() {
  const services = ["📧 Email", "📄 Docs", "🎵 Music", "🎥 Video", "💾 Files", "🤖 AI"];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative flex h-32 w-56 items-center justify-center rounded-[100px] border-2 border-accent/40 bg-gradient-to-br from-accent/20 to-sky-500/10 shadow-[0_0_50px_rgba(77,141,255,0.35)]"
        >
          <span className="text-3xl font-black text-white">☁️ Cloud</span>
        </motion.div>
        {services.map((s, i) => {
          const angle = (i / services.length) * 2 * Math.PI;
          const x = Math.cos(angle) * 160;
          const y = Math.sin(angle) * 90;
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              className="absolute rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[11px] text-white backdrop-blur"
            >
              {s}
            </motion.div>
          );
        })}
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  WEB
 * ═════════════════════════════════════════════════════════════ */

// HTML + CSS side by side with live preview.
export function HtmlCssVisual() {
  return (
    <VisualFrame>
      <div className="flex w-full max-w-[520px] gap-3">
        <div className="flex-1 rounded-lg border border-white/10 bg-[#070a11] p-3 font-mono text-[11px]">
          <div className="mb-1 text-[9px] text-neutral-500">index.html</div>
          <div><span className="text-pink-400">&lt;h1&gt;</span> Hello <span className="text-pink-400">&lt;/h1&gt;</span></div>
          <div><span className="text-pink-400">&lt;p&gt;</span> Welcome! <span className="text-pink-400">&lt;/p&gt;</span></div>
          <div className="mt-2 text-[9px] text-neutral-500">style.css</div>
          <div><span className="text-emerald-300">h1</span> {"{ color: #4d8dff; }"}</div>
          <div><span className="text-emerald-300">p</span> {"{ color: #93a3bc; }"}</div>
        </div>
        <div className="text-2xl">→</div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 rounded-lg border border-white/10 bg-white p-3"
        >
          <div className="text-[9px] text-neutral-500">✨ Live page</div>
          <div className="mt-2 text-lg font-bold" style={{ color: "#4d8dff" }}>Hello</div>
          <div className="text-sm" style={{ color: "#93a3bc" }}>Welcome!</div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

// JS (browser) vs PHP (server).
export function JsPhpVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-4">
            <div className="text-3xl">🌐</div>
          </div>
          <div className="text-xs font-bold text-white">Browser</div>
          <div className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-mono text-accent-bright">JavaScript</div>
          <div className="text-[10px] text-neutral-400">runs on your device</div>
        </div>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl text-neutral-500"
        >
          ⇄
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg border border-purple-400/40 bg-purple-400/10 p-4">
            <div className="text-3xl">🗄️</div>
          </div>
          <div className="text-xs font-bold text-white">Server</div>
          <div className="rounded bg-purple-400/20 px-2 py-0.5 text-[10px] font-mono text-purple-300">PHP</div>
          <div className="text-[10px] text-neutral-400">runs far away</div>
        </div>
      </div>
    </VisualFrame>
  );
}

// WordPress blocks assembling.
export function WordpressVisual() {
  const blocks = [
    { w: "100%", label: "Header", color: "bg-blue-500/60" },
    { w: "60%", label: "Article", color: "bg-emerald-500/60" },
    { w: "35%", label: "Sidebar", color: "bg-amber-500/60" },
    { w: "100%", label: "Footer", color: "bg-purple-500/60" },
  ];
  return (
    <VisualFrame>
      <div className="flex w-[320px] flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={`rounded-md p-3 ${blocks[0].color} text-xs font-semibold text-white`}
        >
          {blocks[0].label}
        </motion.div>
        <div className="flex gap-2">
          {[blocks[1], blocks[2]].map((b, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              style={{ flexBasis: b.w }}
              className={`rounded-md p-4 ${b.color} text-xs font-semibold text-white`}
            >
              {b.label}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`rounded-md p-3 ${blocks[3].color} text-xs font-semibold text-white`}
        >
          {blocks[3].label}
        </motion.div>
        <div className="mt-1 text-center text-[10px] text-neutral-400">
          drag blocks · publish · done
        </div>
      </div>
    </VisualFrame>
  );
}

// Domain = address, Hosting = house.
export function DomainHostingVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
            example.com
          </div>
          <div className="text-[10px] text-neutral-400">the address</div>
        </div>
        <div className="text-xl text-neutral-500">→</div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-6xl"
        >
          🏠
        </motion.div>
        <div className="flex flex-col items-start text-[11px] text-neutral-400">
          <span className="rounded bg-white/5 px-2 py-0.5 text-white">the hosting</span>
          <span className="mt-1">where files live</span>
        </div>
      </div>
    </VisualFrame>
  );
}

// DNS lookup - name → number.
export function DnsVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-sm text-white">
            google.com
          </div>
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-2xl"
          >
            📖
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 font-mono text-sm text-white"
          >
            142.250.72.14
          </motion.div>
        </div>
        <div className="rounded-md bg-black/40 px-3 py-1.5 text-[11px] text-neutral-400">
          DNS = the internet&rsquo;s phone book
        </div>
      </div>
    </VisualFrame>
  );
}

// Governance globe (ICANN/IANA).
export function GovernanceVisual() {
  const items = [".com", ".org", ".edu", ".net", ".kh"];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-sky-400/10"
        >
          <span className="text-4xl">🌍</span>
          {items.map((it, i) => {
            const angle = (i / items.length) * 2 * Math.PI;
            const x = Math.cos(angle) * 90;
            const y = Math.sin(angle) * 90;
            return (
              <div
                key={it}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="absolute rounded-full bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white"
              >
                {it}
              </div>
            );
          })}
        </motion.div>
        <div className="absolute bottom-4 rounded-md bg-black/40 px-3 py-1 text-[11px] text-neutral-400">
          keeps every name unique worldwide
        </div>
      </div>
    </VisualFrame>
  );
}

// WHOIS magnifier scan.
export function WhoisVisual() {
  return (
    <VisualFrame>
      <div className="relative w-[300px] rounded-xl border border-white/10 bg-black/40 p-4">
        <div className="text-[10px] font-mono text-accent-bright">WHOIS · example.com</div>
        <div className="mt-2 space-y-1 text-[11.5px] text-neutral-300">
          <div>Owner: hidden by privacy</div>
          <div>Created: 1995-08-14</div>
          <div>Expires: 2030-08-13</div>
          <div>Registrar: IANA</div>
        </div>
        <motion.div
          animate={{ x: [-20, 260, -20], y: [10, 40, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute text-3xl"
        >
          🔍
        </motion.div>
      </div>
    </VisualFrame>
  );
}

// TCP/IP: packets numbered, travel, reassemble.
export function TcpIpVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-3">
        <div className="text-3xl">📄</div>
        <div className="text-lg text-neutral-500">→</div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((n, i) => (
            <motion.div
              key={n}
              animate={{ x: [0, 40, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="flex h-10 w-10 items-center justify-center rounded border border-accent-bright/60 bg-accent/20 font-mono text-sm font-bold text-white"
            >
              {n}
            </motion.div>
          ))}
        </div>
        <div className="text-lg text-neutral-500">→</div>
        <div className="text-3xl">📄</div>
      </div>
    </VisualFrame>
  );
}

// Full internet journey.
export function InternetJourneyVisual() {
  return (
    <VisualFrame>
      <svg viewBox="0 0 500 200" className="h-full w-full">
        <text x="30" y="115" fontSize="30">💻</text>
        <text x="45" y="145" textAnchor="middle" fontSize="10" fill="#9ca3af">you</text>

        <rect x="120" y="90" width="70" height="40" rx="6" fill="rgba(77,141,255,0.15)" stroke="#4d8dff" />
        <text x="155" y="108" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">DNS</text>
        <text x="155" y="122" textAnchor="middle" fontSize="9" fill="#93c5fd">find address</text>

        <rect x="230" y="90" width="70" height="40" rx="6" fill="rgba(52,211,153,0.15)" stroke="#34d399" />
        <text x="265" y="108" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">Router</text>
        <text x="265" y="122" textAnchor="middle" fontSize="9" fill="#a7f3d0">pass along</text>

        <rect x="340" y="90" width="70" height="40" rx="6" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" />
        <text x="375" y="108" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">Server</text>
        <text x="375" y="122" textAnchor="middle" fontSize="9" fill="#fde68a">has the page</text>

        <text x="450" y="115" fontSize="30">📄</text>

        <line x1="70" y1="115" x2="120" y2="110" stroke="#4d8dff" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="190" y1="110" x2="230" y2="110" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="300" y1="110" x2="340" y2="110" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="410" y1="110" x2="450" y2="115" stroke="#a3a3a3" strokeWidth="1.5" strokeDasharray="4 4" />

        <motion.circle
          r="5"
          fill="#7dd3fc"
          animate={{ cx: [70, 155, 265, 375, 445], cy: [115, 110, 110, 110, 115] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  CYBERSECURITY
 * ═════════════════════════════════════════════════════════════ */

// CIA triad shields.
export function CiaTriadVisual() {
  const items = [
    { letter: "C", label: "Keep it private", color: "from-sky-500 to-blue-600" },
    { letter: "I", label: "Keep it true", color: "from-emerald-500 to-teal-600" },
    { letter: "A", label: "Keep it working", color: "from-amber-500 to-orange-600" },
  ];
  return (
    <VisualFrame>
      <div className="flex gap-4">
        {items.map((it, i) => (
          <motion.div
            key={it.letter}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
            className={`flex h-32 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-b ${it.color} p-3 shadow-xl`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)" }}
          >
            <div className="text-4xl font-black text-white">{it.letter}</div>
            <div className="mt-1 text-center text-[10px] font-semibold text-white/90">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Terminal with typing cursor.
export function TerminalVisual() {
  return (
    <VisualFrame>
      <div className="w-[380px] rounded-lg border border-white/10 bg-black shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <div className="ml-2 text-[10px] text-neutral-500">terminal</div>
        </div>
        <div className="p-4 font-mono text-[12px] text-emerald-400">
          <div>$ scan --target=system</div>
          <div className="text-neutral-500">looking for weak spots…</div>
          <div className="mt-1">$ found: 1 open door</div>
          <div className="flex items-center">
            $ <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="ml-1 inline-block h-4 w-2 bg-emerald-400"
            />
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

// Hacker hats.
export function HackerHatsVisual() {
  const hats = [
    { hat: "🎩", label: "White hat", desc: "helps you", color: "bg-white/10 text-white" },
    { hat: "🎩", label: "Grey hat", desc: "unpredictable", color: "bg-neutral-500/20 text-neutral-200" },
    { hat: "🎩", label: "Black hat", desc: "criminal", color: "bg-red-500/20 text-red-300" },
  ];
  return (
    <VisualFrame>
      <div className="flex gap-4">
        {hats.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex w-28 flex-col items-center rounded-xl border border-white/10 p-3 ${h.color}`}
          >
            <div className="text-4xl">{h.hat}</div>
            <div className="mt-2 text-xs font-bold">{h.label}</div>
            <div className="text-[10px] opacity-80">{h.desc}</div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Malware bug swarm.
export function MalwareVisual() {
  const bugs = ["🦠", "🐛", "🕷️", "🪱"];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-red-400 bg-red-500/10">
          <div className="text-4xl">💻</div>
        </div>
        {bugs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            animate={{
              x: [Math.cos((i / 4) * 2 * Math.PI) * 110, 0, Math.cos((i / 4) * 2 * Math.PI) * 110],
              y: [Math.sin((i / 4) * 2 * Math.PI) * 60, 0, Math.sin((i / 4) * 2 * Math.PI) * 60],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          >
            {b}
          </motion.div>
        ))}
        <div className="absolute bottom-2 rounded-md bg-black/50 px-2 py-1 text-[11px] text-neutral-300">
          bad programs trying to sneak in
        </div>
      </div>
    </VisualFrame>
  );
}

// DDoS flood.
export function DdosVisual() {
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="relative z-10 flex h-24 w-32 items-center justify-center rounded-lg border-2 border-red-400 bg-red-500/20 text-lg font-bold text-white">
          🖥️ Server
        </div>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 2 * Math.PI;
          const startX = Math.cos(angle) * 220;
          const startY = Math.sin(angle) * 110;
          return (
            <motion.div
              key={i}
              className="absolute text-lg"
              initial={{ x: startX, y: startY }}
              animate={{
                x: [startX, 0],
                y: [startY, 0],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: (i * 0.15) % 1.6,
              }}
            >
              ⚡
            </motion.div>
          );
        })}
        <div className="absolute bottom-2 rounded-md bg-black/60 px-2 py-1 text-[11px] text-neutral-300">
          too many requests · site crashes
        </div>
      </div>
    </VisualFrame>
  );
}

// Common attacks grid.
export function AttacksVisual() {
  const attacks = [
    { i: "💉", n: "SQL Injection", d: "tricky question" },
    { i: "🎣", n: "Phishing", d: "fake email" },
    { i: "🕵️", n: "MITM", d: "eavesdropper" },
    { i: "🔨", n: "Brute Force", d: "guess all keys" },
  ];
  return (
    <VisualFrame>
      <div className="grid grid-cols-2 gap-3">
        {attacks.map((a, i) => (
          <motion.div
            key={a.n}
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex w-40 items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/5 p-2.5"
          >
            <div className="text-2xl">{a.i}</div>
            <div>
              <div className="text-xs font-bold text-white">{a.n}</div>
              <div className="text-[10px] text-neutral-400">{a.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// Phishing hook.
export function PhishingVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-6">
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-5xl"
        >
          🎣
        </motion.div>
        <div className="flex flex-col items-start gap-1">
          <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-xs">
            <div className="font-bold text-white">📧 URGENT: Your account!</div>
            <div className="text-neutral-400">Click here now: bit.ly/fake…</div>
          </div>
          <div className="text-[10px] text-red-300">fake bait · don&rsquo;t click</div>
        </div>
      </div>
    </VisualFrame>
  );
}

// Defenses layered shield.
export function DefensesVisual() {
  const layers = [
    { label: "Password", color: "bg-emerald-500" },
    { label: "2-Step", color: "bg-sky-500" },
    { label: "Backup", color: "bg-amber-500" },
    { label: "Updates", color: "bg-purple-500" },
  ];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        {layers.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`absolute flex items-end justify-center rounded-full ${l.color}/40 border-2 ${l.color}`}
            style={{
              width: 220 - i * 40,
              height: 220 - i * 40,
              borderColor: `var(--tw-color-${l.color})`,
            }}
          >
            <div className="mb-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
              {l.label}
            </div>
          </motion.div>
        ))}
        <div className="relative z-10 text-3xl">🔒</div>
      </div>
    </VisualFrame>
  );
}

/* ═════════════════════════════════════════════════════════════════
 *  ARTIFICIAL INTELLIGENCE
 * ═════════════════════════════════════════════════════════════ */

// Glowing brain with pulsing neurons.
export function AiBrainVisual() {
  const nodes = [
    { x: 50, y: 30 }, { x: 30, y: 55 }, { x: 70, y: 55 },
    { x: 50, y: 75 }, { x: 20, y: 80 }, { x: 80, y: 80 },
  ];
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-accent/20 shadow-[0_0_50px_rgba(139,92,246,0.4)]"
        >
          <div className="text-7xl">🧠</div>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            {nodes.map((n, i) => (
              <motion.circle
                key={i}
                cx={n.x}
                cy={n.y}
                r="2"
                fill="#7dd3fc"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
            {nodes.slice(0, -1).map((n, i) => (
              <motion.line
                key={i}
                x1={n.x}
                y1={n.y}
                x2={nodes[i + 1].x}
                y2={nodes[i + 1].y}
                stroke="#a78bfa"
                strokeWidth="0.5"
                animate={{ opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

// ML: many examples → learned model.
export function MLVisual() {
  const dots = [..."🐱🐱🐱🐕🐕🐱🐕🐱"];
  return (
    <VisualFrame>
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-4 gap-1 text-2xl">
          {dots.map((d, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            >
              {d}
            </motion.div>
          ))}
        </div>
        <div className="text-2xl text-neutral-500">→</div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-500 text-white shadow-lg"
        >
          <div className="text-2xl">🎯</div>
          <div className="text-[10px] font-bold">learned!</div>
        </motion.div>
        <div className="text-2xl text-neutral-500">→</div>
        <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-center">
          <div className="text-2xl">🐕</div>
          <div className="text-[10px] text-emerald-300">&ldquo;that&rsquo;s a dog!&rdquo;</div>
        </div>
      </div>
    </VisualFrame>
  );
}

// Neural network layers.
export function NeuralNetVisual() {
  const layers = [4, 5, 5, 3];
  return (
    <VisualFrame>
      <svg viewBox="0 0 400 220" className="h-full w-full">
        {layers.map((count, li) => {
          const x = 40 + li * 105;
          return [...Array(count)].map((_, ni) => {
            const y = 30 + ni * (160 / (count - 1 || 1));
            return (
              <g key={`${li}-${ni}`}>
                {li < layers.length - 1 && [...Array(layers[li + 1])].map((_, mj) => {
                  const my = 30 + mj * (160 / (layers[li + 1] - 1 || 1));
                  return (
                    <motion.line
                      key={mj}
                      x1={x}
                      y1={y}
                      x2={x + 105}
                      y2={my}
                      stroke="#4d8dff"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                      animate={{ strokeOpacity: [0.15, 0.6, 0.15] }}
                      transition={{ duration: 2, repeat: Infinity, delay: (ni + mj) * 0.05 }}
                    />
                  );
                })}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill="#0d1220"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  animate={{ fill: ["#0d1220", "#7dd3fc", "#0d1220"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: li * 0.4 + ni * 0.1 }}
                />
              </g>
            );
          });
        })}
        <text x="40" y="200" fontSize="10" fill="#93a3bc">input</text>
        <text x="145" y="200" fontSize="10" fill="#93a3bc">hidden</text>
        <text x="250" y="200" fontSize="10" fill="#93a3bc">hidden</text>
        <text x="355" y="200" fontSize="10" fill="#93a3bc">answer</text>
      </svg>
    </VisualFrame>
  );
}

// NLP: sentence into tokens.
export function NLPVisual() {
  const tokens = ["Hello", "class", "!", "How", "are", "you", "?"];
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white">
          &ldquo;Hello class! How are you?&rdquo;
        </div>
        <div className="text-xl text-neutral-500">↓</div>
        <div className="flex flex-wrap gap-2">
          {tokens.map((t, i) => (
            <motion.div
              key={i}
              initial={{ y: -12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-xs text-white"
            >
              {t}
            </motion.div>
          ))}
        </div>
        <div className="text-[11px] text-neutral-400">
          AI breaks language into small pieces to understand it
        </div>
      </div>
    </VisualFrame>
  );
}

// Ethics balance scale.
export function EthicsVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center gap-8"
        >
          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-emerald-400 bg-emerald-500/10 text-xs text-emerald-200">
            👍 helpful
          </div>
          <div className="text-3xl">⚖️</div>
          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-amber-400 bg-amber-500/10 text-xs text-amber-200">
            ⚠️ risk
          </div>
        </motion.div>
        <div className="text-[11px] text-neutral-400">use AI wisely · think about impact</div>
      </div>
    </VisualFrame>
  );
}

// Future arc.
export function FutureVisual() {
  const points = [
    { emoji: "💾", label: "1950s" },
    { emoji: "🖥️", label: "1990s" },
    { emoji: "📱", label: "2010s" },
    { emoji: "🧠", label: "today" },
    { emoji: "✨", label: "next?" },
  ];
  return (
    <VisualFrame>
      <div className="flex items-center gap-3">
        {points.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${
                i === points.length - 1
                  ? "border-2 border-accent bg-accent/20 shadow-[0_0_20px_rgba(77,141,255,0.4)]"
                  : "border border-white/10 bg-white/[0.04]"
              }`}
            >
              {p.emoji}
            </motion.div>
            <div className="text-[10px] text-neutral-400">{p.label}</div>
            {i < points.length - 1 && <div className="hidden" />}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
