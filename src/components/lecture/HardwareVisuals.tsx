"use client";

// Realistic, richly-detailed SVG illustrations for the Hardware chapter.
// Each component is self-animating (Framer Motion + SVG) and educational —
// it shows what the real part looks like, not just an abstract icon.

import { motion } from "framer-motion";
import { VisualFrame } from "@/components/lecture/Visuals";

/* ─────────────────────────────────────────────────────────────────
 * 1 — CPU (Processor)
 *     Top-down view of a modern CPU with metallic heat spreader,
 *     brand text, substrate + capacitors, plus a heat-sink fan on
 *     the right and rising heat shimmer.
 * ────────────────────────────────────────────────────────────── */

export function ProcessorRealisticVisual() {
  return (
    <VisualFrame>
      <div className="relative flex h-full w-full items-center justify-center gap-4">
        {/* CPU (main visual) */}
        <div className="relative">
          {/* Rising heat waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0 h-1 w-8 -translate-x-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,120,60,0.6), transparent)",
                filter: "blur(3px)",
              }}
              animate={{ y: [-4, -40], opacity: [0, 0.9, 0], x: [-14, 6, -8] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            />
          ))}

          <svg viewBox="0 0 220 220" className="h-56 w-56 drop-shadow-[0_20px_35px_rgba(77,141,255,0.25)]">
            <defs>
              <linearGradient id="ihs" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#b8c4d0" />
                <stop offset="0.35" stopColor="#dbe4ee" />
                <stop offset="0.65" stopColor="#8a97a8" />
                <stop offset="1" stopColor="#4a5665" />
              </linearGradient>
              <linearGradient id="substrate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0a5a30" />
                <stop offset="1" stopColor="#053d20" />
              </linearGradient>
              <radialGradient id="ihsShine" cx="0.3" cy="0.25">
                <stop offset="0" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="0.6" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Green PCB substrate */}
            <rect x="10" y="10" width="200" height="200" rx="6" fill="url(#substrate)" stroke="#0a1d0f" strokeWidth="0.5" />

            {/* Fine gold traces on substrate */}
            {[...Array(20)].map((_, i) => (
              <line
                key={`h${i}`}
                x1="14"
                x2="206"
                y1={16 + i * 9.5}
                y2={16 + i * 9.5}
                stroke="rgba(255,215,0,0.06)"
                strokeWidth="0.3"
              />
            ))}

            {/* SMD components around the substrate edges */}
            {[
              [20, 20], [40, 20], [60, 20], [180, 20], [200, 20],
              [20, 40], [200, 40],
              [20, 180], [40, 200], [180, 200], [200, 180], [200, 200],
            ].map(([cx, cy], i) => (
              <rect key={i} x={cx - 3} y={cy - 1.5} width="6" height="3" rx="0.5" fill="#1a1a1a" stroke="#333" strokeWidth="0.2" />
            ))}

            {/* Heat spreader (IHS) */}
            <rect x="45" y="45" width="130" height="130" rx="8" fill="url(#ihs)" stroke="#3a4552" strokeWidth="1.5" />
            <rect x="47" y="47" width="126" height="126" rx="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />

            {/* Shine on IHS */}
            <rect x="45" y="45" width="130" height="130" rx="8" fill="url(#ihsShine)" opacity="0.6" />

            {/* Brand text engraved on IHS */}
            <text x="110" y="90" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill="#3a4552" fontWeight="900" letterSpacing="1.5">
              IDIC
            </text>
            <text x="110" y="106" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16" fill="#2a3542" fontWeight="800" letterSpacing="1">
              CORE i9
            </text>
            <text x="110" y="122" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="#4a5665" letterSpacing="0.8">
              16 cores · 32 threads
            </text>
            <text x="110" y="134" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="7" fill="#4a5665" letterSpacing="0.8">
              5.4 GHz max
            </text>

            {/* Tiny etched serial on bottom */}
            <text x="110" y="152" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" fill="#5a6675" letterSpacing="0.5">
              L2 · SR9K3 · 2026
            </text>

            {/* Notch corner marker */}
            <circle cx="55" cy="55" r="2" fill="#2a3542" />

            {/* Pulsing activity dots on substrate corners */}
            {[[20, 100], [200, 100], [100, 20], [100, 200]].map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="2"
                fill="#4d8dff"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
              />
            ))}
          </svg>
        </div>

        {/* Right side: fan + heatsink cutaway */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {/* Fan housing */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 shadow-inner">
              <motion.svg
                viewBox="0 0 100 100"
                className="h-20 w-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                {/* Fan hub */}
                <circle cx="50" cy="50" r="10" fill="#3a3a3a" stroke="#666" strokeWidth="1" />
                <circle cx="50" cy="50" r="3" fill="#666" />
                {/* Blades */}
                {[0, 60, 120, 180, 240, 300].map((rot) => (
                  <path
                    key={rot}
                    d="M 50 50 Q 45 25 60 12 Q 55 30 55 50 Z"
                    fill="#4a5568"
                    stroke="#2d3748"
                    strokeWidth="0.5"
                    transform={`rotate(${rot} 50 50)`}
                  />
                ))}
              </motion.svg>
              {/* Corner screws */}
              {[[6, 6], [82, 6], [6, 82], [82, 82]].map(([x, y], i) => (
                <div key={i} className="absolute h-2 w-2 rounded-full bg-neutral-600" style={{ left: `${x}px`, top: `${y}px` }} />
              ))}
            </div>
          </div>

          {/* Spec sticker */}
          <div className="rounded-md border border-white/10 bg-black/60 px-2.5 py-1.5 text-center backdrop-blur">
            <div className="font-mono text-[9px] text-emerald-400">CPU FAN</div>
            <div className="mt-0.5 font-mono text-[10px] text-neutral-300">2400 RPM</div>
          </div>
        </div>

        {/* Bottom-left spec badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur"
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-accent-bright">
            Instructions per second
          </div>
          <div className="mt-0.5 font-mono text-[13px] font-bold text-white">
            ≈ 5,400,000,000
          </div>
        </motion.div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 2 — Storage: HDD (cutaway platters + actuator) vs SSD (NAND PCB)
 * ────────────────────────────────────────────────────────────── */

export function StorageRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex h-full w-full items-center justify-center gap-4">
        {/* ── HDD ─────────────────────────────── */}
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 220 180" className="h-44 w-52">
            <defs>
              <linearGradient id="platterGrad" cx="0.5" cy="0.5">
                <stop offset="0" stopColor="#c8d1dd" />
                <stop offset="0.5" stopColor="#7a8290" />
                <stop offset="1" stopColor="#3d4552" />
              </linearGradient>
              <radialGradient id="platterShine" cx="0.35" cy="0.3">
                <stop offset="0" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="0.4" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* HDD case */}
            <rect x="4" y="10" width="212" height="160" rx="4" fill="#1a1e26" stroke="#2a2f38" strokeWidth="1.5" />
            <rect x="4" y="10" width="212" height="160" rx="4" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

            {/* Corner screws */}
            {[[14, 20], [206, 20], [14, 160], [206, 160]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="3" fill="#3a3f48" stroke="#1a1e26" strokeWidth="0.5" />
                <line x1={x - 2} y1={y - 2} x2={x + 2} y2={y + 2} stroke="#1a1e26" strokeWidth="0.6" />
              </g>
            ))}

            {/* Spinning platters (stack — 3 layers) */}
            <g transform="translate(90 90)">
              {[3, 2, 1].map((layer) => (
                <motion.g
                  key={layer}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="0" cy="0" r={60 - layer * 2} fill="url(#platterGrad)" stroke="#2a2f38" strokeWidth="0.5" />
                  {/* Tracks */}
                  {[50, 40, 30, 20].map((r) => (
                    <circle key={r} cx="0" cy="0" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
                  ))}
                  {/* Shine */}
                  <circle cx="0" cy="0" r={60 - layer * 2} fill="url(#platterShine)" opacity="0.5" />
                  {/* Sector marker */}
                  <line x1="0" y1="0" x2="55" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                </motion.g>
              ))}

              {/* Center spindle */}
              <circle cx="0" cy="0" r="10" fill="#2a2f38" stroke="#4a5665" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" fill="#4d8dff" />
            </g>

            {/* Actuator arm sweeping */}
            <motion.g
              style={{ transformOrigin: "180px 90px" }}
              animate={{ rotate: [-20, 15, -20] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Base pivot */}
              <circle cx="180" cy="90" r="8" fill="#2a2f38" stroke="#4a5665" strokeWidth="1" />
              <circle cx="180" cy="90" r="3" fill="#5a6675" />

              {/* Arm */}
              <rect x="80" y="87" width="100" height="6" rx="2" fill="#3a4552" stroke="#1a1e26" strokeWidth="0.5" />

              {/* Read head */}
              <path d="M 80 90 L 74 87 L 74 93 Z" fill="#8a97a8" />
              <circle cx="76" cy="90" r="1" fill="#4d8dff">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
              </circle>
            </motion.g>

            {/* Ribbon cable */}
            <path d="M 180 82 Q 200 60 208 40" stroke="#c9a842" strokeWidth="2" fill="none" opacity="0.6" />

            {/* Model sticker */}
            <rect x="14" y="20" width="60" height="18" rx="1" fill="#e8ecf2" stroke="#a8b2c0" strokeWidth="0.3" />
            <text x="44" y="28" textAnchor="middle" fontSize="5" fill="#1a1e26" fontFamily="ui-monospace, monospace">
              IDIC HDD 2TB
            </text>
            <text x="44" y="34" textAnchor="middle" fontSize="4" fill="#1a1e26" fontFamily="ui-monospace, monospace">
              7200 RPM · SATA
            </text>
          </svg>

          {/* Speed indicator */}
          <div className="w-52 rounded-lg border border-white/10 bg-black/40 p-2 backdrop-blur">
            <div className="text-center text-[10px] font-semibold text-neutral-200">HDD</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  animate={{ width: ["10%", "20%", "10%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <div className="font-mono text-[9px] text-amber-300">~150 MB/s</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-neutral-400">
          <div className="text-2xl font-black">VS</div>
        </div>

        {/* ── SSD ─────────────────────────────── */}
        <div className="flex flex-col items-center gap-2">
          <svg viewBox="0 0 220 180" className="h-44 w-52">
            <defs>
              <linearGradient id="ssdBoard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0d3a1c" />
                <stop offset="1" stopColor="#062012" />
              </linearGradient>
              <linearGradient id="chipTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a1a1a" />
                <stop offset="0.4" stopColor="#2a2a2a" />
                <stop offset="1" stopColor="#0a0a0a" />
              </linearGradient>
            </defs>

            {/* PCB */}
            <rect x="6" y="24" width="208" height="140" rx="3" fill="url(#ssdBoard)" stroke="#0a2010" strokeWidth="1" />

            {/* Copper traces */}
            {[45, 60, 75, 105, 120, 135].map((y) => (
              <line key={y} x1="15" x2="205" y1={y} y2={y} stroke="rgba(218,165,32,0.15)" strokeWidth="0.4" />
            ))}
            {[30, 60, 90, 120, 150, 180, 200].map((x) => (
              <line key={x} x1={x} x2={x} y1="30" y2="160" stroke="rgba(218,165,32,0.1)" strokeWidth="0.4" />
            ))}

            {/* NAND flash chips (8 chips) */}
            {[
              [20, 40], [82, 40], [138, 40], [162, 40],
              [20, 110], [82, 110], [138, 110], [162, 110],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect x={x} y={y} width="42" height="30" rx="1" fill="url(#chipTop)" stroke="#000" strokeWidth="0.4" />
                <rect x={x + 1} y={y + 1} width="40" height="28" rx="0.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
                <text x={x + 21} y={y + 14} textAnchor="middle" fontSize="4" fill="#666" fontFamily="ui-monospace, monospace">
                  NAND
                </text>
                <text x={x + 21} y={y + 22} textAnchor="middle" fontSize="3.5" fill="#555" fontFamily="ui-monospace, monospace">
                  128GB
                </text>
                {/* Activity blinker */}
                <motion.circle
                  cx={x + 38}
                  cy={y + 4}
                  r="1"
                  fill="#4d8dff"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.8, delay: (i * 0.09) % 0.8, repeat: Infinity }}
                />
              </g>
            ))}

            {/* Controller (larger center chip) */}
            <rect x="88" y="76" width="44" height="26" rx="1" fill="url(#chipTop)" stroke="#000" strokeWidth="0.5" />
            <text x="110" y="88" textAnchor="middle" fontSize="4.5" fill="#7dd3fc" fontFamily="ui-monospace, monospace" fontWeight="700">
              CONTROLLER
            </text>
            <text x="110" y="96" textAnchor="middle" fontSize="4" fill="#666" fontFamily="ui-monospace, monospace">
              NVMe 5.0
            </text>
            <motion.circle
              cx="130"
              cy="80"
              r="1.5"
              fill="#4d8dff"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Small DRAM cache */}
            <rect x="20" y="80" width="30" height="18" rx="1" fill="url(#chipTop)" stroke="#000" strokeWidth="0.4" />
            <text x="35" y="91" textAnchor="middle" fontSize="4" fill="#666" fontFamily="ui-monospace, monospace">
              DRAM
            </text>

            {/* M.2 connector notch */}
            <rect x="90" y="20" width="8" height="6" rx="1" fill="#c9a842" />
            <rect x="122" y="20" width="8" height="6" rx="1" fill="#c9a842" />

            {/* Edge connector gold pins */}
            <rect x="16" y="164" width="188" height="8" fill="#c9a842" stroke="#a08830" strokeWidth="0.3" />
            {[...Array(40)].map((_, i) => (
              <line key={i} x1={20 + i * 4.5} x2={20 + i * 4.5} y1="164" y2="172" stroke="#8a7020" strokeWidth="0.3" />
            ))}

            {/* Model label */}
            <rect x="150" y="76" width="52" height="26" rx="1" fill="none" stroke="rgba(125,211,252,0.4)" strokeWidth="0.5" strokeDasharray="2 1" />
            <text x="176" y="90" textAnchor="middle" fontSize="5" fill="#7dd3fc" fontFamily="ui-monospace, monospace">
              IDIC SSD
            </text>
            <text x="176" y="98" textAnchor="middle" fontSize="4" fill="#666" fontFamily="ui-monospace, monospace">
              1TB M.2
            </text>
          </svg>

          {/* Speed indicator */}
          <div className="w-52 rounded-lg border border-white/10 bg-black/40 p-2 backdrop-blur">
            <div className="text-center text-[10px] font-semibold text-neutral-200">SSD</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
                  animate={{ width: ["85%", "95%", "85%"] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </div>
              <div className="font-mono text-[9px] text-emerald-300">~7000 MB/s</div>
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 3 — RAM (DDR DIMM with heat spreader and chips)
 * ────────────────────────────────────────────────────────────── */

export function RamRealisticVisual() {
  return (
    <VisualFrame>
      <div className="flex flex-col items-center gap-3">
        {/* Two sticks stacked */}
        <RamStick label="SLOT A" delayOffset={0} />
        <RamStick label="SLOT B" delayOffset={0.4} />

        <div className="flex items-center gap-3">
          <div className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-accent-bright">
              Total memory
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-white">32 GB DDR5</div>
          </div>
          <div className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur">
            <div className="font-mono text-[9px] uppercase tracking-widest text-accent-bright">
              Speed
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-white">6400 MT/s</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function RamStick({ label, delayOffset }: { label: string; delayOffset: number }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 460 60" className="h-12 w-[460px] max-w-full">
        <defs>
          <linearGradient id={`spreader-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a01e2c" />
            <stop offset="0.5" stopColor="#c62d3d" />
            <stop offset="1" stopColor="#6c1220" />
          </linearGradient>
          <linearGradient id={`pcb-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d3a1c" />
            <stop offset="1" stopColor="#062012" />
          </linearGradient>
        </defs>

        {/* PCB */}
        <rect x="6" y="12" width="448" height="42" fill={`url(#pcb-${label})`} stroke="#0a2010" strokeWidth="0.5" />

        {/* Heat spreader (red aluminum) */}
        <path d="M 10 12 L 10 40 Q 12 42 14 42 L 446 42 Q 448 42 450 40 L 450 12 Z" fill={`url(#spreader-${label})`} stroke="#4a0a12" strokeWidth="0.6" />

        {/* Vent lines on heat spreader */}
        {[...Array(20)].map((_, i) => (
          <line
            key={i}
            x1={20 + i * 22}
            y1="15"
            x2={20 + i * 22}
            y2="38"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="0.6"
          />
        ))}

        {/* Highlight strip */}
        <rect x="10" y="14" width="440" height="3" fill="rgba(255,255,255,0.35)" />

        {/* Brand plate */}
        <rect x="180" y="20" width="100" height="14" rx="1" fill="#1a0508" stroke="#4a0a12" strokeWidth="0.5" />
        <text x="230" y="30" textAnchor="middle" fontSize="8" fill="#ffdbc0" fontFamily="ui-monospace, monospace" fontWeight="900" letterSpacing="1.5">
          IDIC RAM
        </text>

        {/* Notch in gold pins */}
        <rect x="6" y="52" width="448" height="6" fill="#c9a842" stroke="#8a7020" strokeWidth="0.4" />
        <rect x="200" y="52" width="16" height="6" fill="#062012" />

        {/* Gold pin lines */}
        {[...Array(90)].map((_, i) => (
          <line
            key={i}
            x1={10 + i * 4.9}
            y1="52"
            x2={10 + i * 4.9}
            y2="58"
            stroke="#8a7020"
            strokeWidth="0.3"
          />
        ))}

        {/* Data flow indicator dots along the spreader (activity LED style) */}
        {[80, 130, 320, 380].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy="10"
            r="1.8"
            fill="#7dd3fc"
            animate={{ opacity: [0.1, 1, 0.1] }}
            transition={{ duration: 1.2, delay: delayOffset + i * 0.15, repeat: Infinity }}
            style={{ filter: "drop-shadow(0 0 3px rgba(125,211,252,0.9))" }}
          />
        ))}

        {/* Slot label */}
        <text x="14" y="8" fontSize="5" fill="rgba(255,255,255,0.4)" fontFamily="ui-monospace, monospace">
          {label} · 16GB
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 4 — Cache & ROM (memory hierarchy with latency + a physical ROM chip)
 * ────────────────────────────────────────────────────────────── */

export function CacheRomRealisticVisual() {
  const levels = [
    { name: "L1", size: "64 KB", ns: "1 ns", color: "bg-accent", w: 40 },
    { name: "L2", size: "1 MB", ns: "3 ns", color: "bg-sky-500", w: 60 },
    { name: "L3", size: "32 MB", ns: "10 ns", color: "bg-emerald-500", w: 90 },
    { name: "RAM", size: "32 GB", ns: "100 ns", color: "bg-amber-500", w: 130 },
    { name: "SSD", size: "1 TB", ns: "0.1 ms", color: "bg-neutral-500", w: 170 },
  ];
  return (
    <VisualFrame>
      <div className="flex h-full w-full items-center justify-center gap-6">
        {/* Memory pyramid */}
        <div className="flex flex-col items-center gap-1">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            Cache hierarchy
          </div>
          {levels.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between rounded-md px-3 py-1.5 text-white shadow ${l.color}/80 border border-white/20`}
              style={{ width: `${100 + i * 22}px` }}
            >
              <span className="text-[11px] font-bold">{l.name}</span>
              <span className="text-[9px] opacity-80">{l.size}</span>
              <span className="text-[9px] font-mono">{l.ns}</span>
            </motion.div>
          ))}
          <div className="mt-1 text-[9px] text-neutral-400">↑ smaller · faster</div>
        </div>

        {/* Data packet traveling through the levels */}
        <div className="flex items-center gap-2">
          <motion.div
            className="text-2xl"
            animate={{ x: [0, 10, 0], y: [-40, 0, 40, 0, -40] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            📦
          </motion.div>
        </div>

        {/* ROM chip (DIP-8) */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-bright">
            ROM chip
          </div>
          <svg viewBox="0 0 100 60" className="h-16 w-24">
            {/* Chip body */}
            <rect x="20" y="10" width="60" height="40" rx="2" fill="#1a1a1a" stroke="#000" strokeWidth="0.6" />
            <rect x="21" y="11" width="58" height="38" rx="1.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
            {/* Notch */}
            <circle cx="50" cy="14" r="2" fill="#333" />
            {/* Text */}
            <text x="50" y="28" textAnchor="middle" fontSize="4.5" fill="#7dd3fc" fontFamily="ui-monospace, monospace" fontWeight="700">
              IDIC ROM
            </text>
            <text x="50" y="36" textAnchor="middle" fontSize="3.5" fill="#666" fontFamily="ui-monospace, monospace">
              27C256 · 32K
            </text>
            <text x="50" y="43" textAnchor="middle" fontSize="3.5" fill="#666" fontFamily="ui-monospace, monospace">
              Read-Only
            </text>
            {/* Pins (DIP-8) */}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={15} y={16 + i * 8} width="6" height="4" fill="#c9c9c9" />
                <rect x={79} y={16 + i * 8} width="6" height="4" fill="#c9c9c9" />
              </g>
            ))}
          </svg>
          <div className="text-center text-[9px] text-neutral-400">
            Permanent<br />never forgets
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 5 — BIOS / CMOS (realistic BIOS POST screen + CMOS battery)
 * ────────────────────────────────────────────────────────────── */

export function BiosRealisticVisual() {
  const bootLines = [
    { t: 0.0, text: "IDIC BIOS v4.2 · (c) 2026", cls: "text-emerald-400" },
    { t: 0.3, text: "─────────────────────────────" },
    { t: 0.6, text: "CPU  ..... IDIC CORE i9  [OK]", cls: "text-emerald-400" },
    { t: 1.0, text: "RAM  ..... 32768 MB       [OK]", cls: "text-emerald-400" },
    { t: 1.4, text: "SSD  ..... 1024 GB NVMe   [OK]", cls: "text-emerald-400" },
    { t: 1.8, text: "GPU  ..... IDIC GTX 90    [OK]", cls: "text-emerald-400" },
    { t: 2.2, text: "USB, PCIe, LAN            [OK]", cls: "text-emerald-400" },
    { t: 2.6, text: "POST complete." },
    { t: 3.0, text: "Loading operating system...", cls: "text-amber-300" },
    { t: 3.4, text: "_", cls: "text-amber-300 animate-pulse" },
  ];
  return (
    <VisualFrame>
      <div className="flex h-full w-full items-center justify-center gap-4">
        {/* CRT-style BIOS screen */}
        <div className="relative overflow-hidden rounded-lg border-4 border-neutral-800 bg-black shadow-inner">
          <div className="relative h-40 w-64 p-2 font-mono text-[9.5px] leading-[1.4]">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 4.5,
                  times: [0, line.t / 4.5, 0.9, 1],
                  repeat: Infinity,
                }}
                className={line.cls ?? "text-emerald-300"}
                style={{ position: "absolute", top: 8 + i * 12, left: 8 }}
              >
                {line.text}
              </motion.div>
            ))}
            {/* Scanline overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
              }}
            />
            {/* Screen curve highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05), transparent 60%)",
              }}
            />
          </div>
        </div>

        {/* CMOS battery + label */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {/* CR2032 coin cell */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-neutral-600 bg-gradient-to-br from-neutral-300 to-neutral-500 shadow-inner">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-500 bg-gradient-to-br from-neutral-200 to-neutral-400">
                <div className="text-center">
                  <div className="font-mono text-[9px] font-bold text-neutral-700">CR2032</div>
                  <div className="font-mono text-[7px] text-neutral-600">3V</div>
                  <div className="mt-0.5 text-[8px]">+</div>
                </div>
              </div>
            </div>
            {/* Positive terminal indicator */}
            <motion.div
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ boxShadow: "0 0 8px rgba(52,211,153,0.7)" }}
            />
          </div>
          <div className="rounded border border-white/10 bg-black/40 px-2 py-1 text-center backdrop-blur">
            <div className="font-mono text-[9px] text-accent-bright">CMOS BATTERY</div>
            <div className="text-[9px] text-neutral-400">keeps time alive</div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6 — Motherboard I/O flow: keyboard/mouse → motherboard → monitor/speaker.
 *     Animates typing "IDIC" through the whole pipeline:
 *     key press → scan code → ASCII → machine op → pixel on screen.
 *     Every 2 s a new character enters the pipeline.
 * ────────────────────────────────────────────────────────────── */

const IDIC_KEYS: Array<{ ch: string; scan: string; ascii: string }> = [
  { ch: "I", scan: "0x17", ascii: "0x49" },
  { ch: "D", scan: "0x20", ascii: "0x44" },
  { ch: "I", scan: "0x17", ascii: "0x49" },
  { ch: "C", scan: "0x2E", ascii: "0x43" },
];

// Total loop length; one character enters the pipeline every CHAR_STEP seconds.
const CHAR_STEP = 2.2;
const LOOP = CHAR_STEP * IDIC_KEYS.length; // = 8.8 s

export function MotherboardFlowVisual() {
  return (
    <VisualFrame>
      <svg viewBox="0 0 900 500" className="h-full w-full">
        <defs>
          <linearGradient id="mbPcb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d3a1c" />
            <stop offset="1" stopColor="#062012" />
          </linearGradient>
          <linearGradient id="kbBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2f38" />
            <stop offset="1" stopColor="#1a1e26" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1428" />
            <stop offset="1" stopColor="#050810" />
          </linearGradient>
          <linearGradient id="ihs2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8c4d0" />
            <stop offset="0.5" stopColor="#8a97a8" />
            <stop offset="1" stopColor="#3d4552" />
          </linearGradient>
          <radialGradient id="glowKey">
            <stop offset="0" stopColor="rgba(125,211,252,0.9)" />
            <stop offset="1" stopColor="rgba(125,211,252,0)" />
          </radialGradient>
        </defs>

        {/* Column titles */}
        <text x="120" y="20" textAnchor="middle" fontSize="10" fill="#7dd3fc" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="2">
          1 · INPUT
        </text>
        <text x="450" y="20" textAnchor="middle" fontSize="10" fill="#a78bfa" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="2">
          2 · PROCESSING
        </text>
        <text x="780" y="20" textAnchor="middle" fontSize="10" fill="#34d399" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="2">
          3 · OUTPUT
        </text>

        {/* ═════════════════════════════════════════════════════
         * LEFT · Keyboard + mouse
         * ═════════════════════════════════════════════════════ */}

        {/* Keyboard body */}
        <g transform="translate(30 40)">
          <rect x="0" y="0" width="180" height="110" rx="6" fill="url(#kbBody)" stroke="#0a0d14" strokeWidth="1" />
          <rect x="4" y="4" width="172" height="6" rx="1" fill="rgba(255,255,255,0.05)" />

          {/* Keys grid: 5 cols × 4 rows */}
          {[...Array(4)].map((_, r) =>
            [...Array(9)].map((_, c) => {
              const x = 6 + c * 19;
              const y = 16 + r * 22;
              const isI = r === 1 && c === 5;
              const isD = r === 2 && c === 2;
              const isC = r === 3 && c === 2;
              return (
                <g key={`k${r}${c}`}>
                  <rect
                    x={x}
                    y={y}
                    width="16"
                    height="18"
                    rx="2"
                    fill="#0f1420"
                    stroke="#3a4552"
                    strokeWidth="0.4"
                  />
                  <rect x={x + 1} y={y + 1} width="14" height="4" rx="1" fill="rgba(255,255,255,0.04)" />
                  {/* Highlighted keys: I (r1c5), D (r2c2), C (r3c2) */}
                  {(isI || isD || isC) && (
                    <text
                      x={x + 8}
                      y={y + 13}
                      textAnchor="middle"
                      fontSize="8"
                      fontFamily="ui-monospace, monospace"
                      fontWeight="700"
                      fill="#e8eef8"
                    >
                      {isI ? "I" : isD ? "D" : "C"}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Animated key press glows */}
          {IDIC_KEYS.map((k, i) => {
            const pos =
              k.ch === "I" ? { x: 111, y: 40 } : k.ch === "D" ? { x: 54, y: 62 } : { x: 54, y: 84 };
            return (
              <motion.circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r="14"
                fill="url(#glowKey)"
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: LOOP,
                  times: [i * CHAR_STEP / LOOP, (i * CHAR_STEP + 0.15) / LOOP, (i * CHAR_STEP + 0.6) / LOOP],
                  repeat: Infinity,
                }}
              />
            );
          })}

          {/* Bump on key that is pressed */}
          {IDIC_KEYS.map((k, i) => {
            const pos =
              k.ch === "I" ? { x: 103, y: 32 } : k.ch === "D" ? { x: 46, y: 54 } : { x: 46, y: 76 };
            return (
              <motion.rect
                key={`p${i}`}
                x={pos.x}
                y={pos.y}
                width="16"
                height="18"
                rx="2"
                fill="rgba(125,211,252,0.8)"
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{
                  duration: LOOP,
                  times: [i * CHAR_STEP / LOOP, (i * CHAR_STEP + 0.15) / LOOP, (i * CHAR_STEP + 0.6) / LOOP],
                  repeat: Infinity,
                }}
              />
            );
          })}

          <text x="90" y="128" textAnchor="middle" fontSize="8" fill="#7dd3fc" fontFamily="ui-monospace, monospace">
            KEYBOARD
          </text>
        </g>

        {/* Mouse */}
        <g transform="translate(80 320)">
          <path
            d="M 0 22 Q 0 0 40 0 Q 80 0 80 22 L 80 90 Q 80 110 40 110 Q 0 110 0 90 Z"
            fill="url(#kbBody)"
            stroke="#0a0d14"
            strokeWidth="1"
          />
          {/* Buttons split */}
          <line x1="40" y1="0" x2="40" y2="42" stroke="#0a0d14" strokeWidth="1" />
          <line x1="0" y1="42" x2="80" y2="42" stroke="#0a0d14" strokeWidth="1" />
          {/* Scroll wheel */}
          <rect x="35" y="16" width="10" height="16" rx="4" fill="#3a4552" stroke="#666" strokeWidth="0.4" />
          {/* Activity light */}
          <motion.circle
            cx="40"
            cy="70"
            r="3"
            fill="#34d399"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }}
          />
          <text x="40" y="128" textAnchor="middle" fontSize="8" fill="#7dd3fc" fontFamily="ui-monospace, monospace">
            MOUSE
          </text>
        </g>

        {/* Keyboard USB cable curve → motherboard USB port */}
        <path
          d="M 210 95 Q 260 95 280 160 T 320 200"
          stroke="#c9c9c9"
          strokeWidth="2"
          fill="none"
        />
        {/* Mouse USB cable */}
        <path
          d="M 160 340 Q 220 340 260 260 T 320 220"
          stroke="#c9c9c9"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated packet: keyboard → motherboard USB */}
        {IDIC_KEYS.map((_, i) => (
          <motion.circle
            key={`kb-pkt-${i}`}
            r="3.5"
            fill="#7dd3fc"
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: LOOP,
              times: [(i * CHAR_STEP) / LOOP, (i * CHAR_STEP + 0.15) / LOOP, (i * CHAR_STEP + 1) / LOOP, (i * CHAR_STEP + 1.1) / LOOP],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: "path('M 210 95 Q 260 95 280 160 T 320 200')",
              filter: "drop-shadow(0 0 5px rgba(125,211,252,1))",
            }}
          />
        ))}

        {/* ═════════════════════════════════════════════════════
         * CENTER · Motherboard (compact)
         * ═════════════════════════════════════════════════════ */}

        <g transform="translate(310 60)">
          {/* PCB */}
          <rect x="0" y="0" width="280" height="290" rx="5" fill="url(#mbPcb)" stroke="#0a2010" strokeWidth="1" />
          {/* Faint traces */}
          {[30, 45, 60, 130, 145, 160, 210, 225, 240].map((y) => (
            <line key={y} x1="8" x2="272" y1={y} y2={y} stroke="rgba(218,165,32,0.1)" strokeWidth="0.4" />
          ))}

          {/* USB input port (left edge, receives keyboard/mouse) */}
          <g transform="translate(0 130)">
            <rect x="0" y="0" width="24" height="14" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.5" />
            <rect x="1" y="1" width="22" height="4" fill="#0f1a2a" />
            <text x="12" y="26" textAnchor="middle" fontSize="6" fill="#93c5fd" fontFamily="ui-monospace, monospace">USB IN</text>
          </g>

          {/* CPU with heat spreader */}
          <g transform="translate(85 40)">
            <rect x="-2" y="-2" width="80" height="80" rx="4" fill="#1a1e26" stroke="#3a4552" strokeWidth="0.6" />
            <rect x="4" y="4" width="68" height="68" rx="4" fill="url(#ihs2)" stroke="#3a4552" strokeWidth="0.8" />
            <text x="38" y="34" textAnchor="middle" fontSize="6" fill="#2a3542" fontFamily="ui-monospace, monospace" fontWeight="900">
              IDIC
            </text>
            <text x="38" y="46" textAnchor="middle" fontSize="7" fill="#2a3542" fontFamily="ui-monospace, monospace" fontWeight="900">
              CPU
            </text>
            <text x="38" y="55" textAnchor="middle" fontSize="4" fill="#4a5665" fontFamily="ui-monospace, monospace">
              i9 · 5.4GHz
            </text>
            {/* Active glow when packet is being processed */}
            <motion.rect
              x="4"
              y="4"
              width="68"
              height="68"
              rx="4"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2"
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: CHAR_STEP, repeat: Infinity, times: [0, 0.45, 0.6, 0.85] }}
              style={{ filter: "drop-shadow(0 0 6px rgba(125,211,252,0.8))" }}
            />
            <text x="38" y="90" textAnchor="middle" fontSize="6" fill="#93c5fd" fontFamily="ui-monospace, monospace">CPU</text>
          </g>

          {/* RAM sticks */}
          <g transform="translate(200 42)">
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x={i * 12} y="0" width="8" height="76" rx="1" fill="#1a0508" stroke="#4a0a12" strokeWidth="0.4" />
                <rect x={i * 12} y="0" width="8" height="72" rx="1" fill="#a01e2c" opacity="0.7" />
                {[10, 25, 40, 55].map((y) => (
                  <motion.rect
                    key={`ram${i}-${y}`}
                    x={i * 12 + 1}
                    y={y}
                    width="6"
                    height="4"
                    fill="#7dd3fc"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 0.9, delay: (i * 0.2 + y * 0.01) % 0.9, repeat: Infinity }}
                  />
                ))}
              </g>
            ))}
            <text x="14" y="90" textAnchor="middle" fontSize="6" fill="#fca5a5" fontFamily="ui-monospace, monospace">RAM</text>
          </g>

          {/* Chipset */}
          <rect x="100" y="150" width="50" height="30" rx="3" fill="#2a2f38" stroke="#4a5665" strokeWidth="0.5" />
          <text x="125" y="170" textAnchor="middle" fontSize="5" fill="#e5e7eb" fontFamily="ui-monospace, monospace" fontWeight="700">CHIPSET</text>

          {/* GPU */}
          <rect x="30" y="200" width="180" height="16" rx="1" fill="#3d3d0a" stroke="#5a5a20" strokeWidth="0.4" />
          <text x="120" y="211" textAnchor="middle" fontSize="6" fill="#fed7aa" fontFamily="ui-monospace, monospace">PCIe · GPU</text>

          {/* HDMI output (right edge) */}
          <g transform="translate(256 100)">
            <rect x="0" y="0" width="24" height="12" fill="#0f172a" stroke="#a3a3a3" strokeWidth="0.5" />
            <path d="M 3 3 L 21 3 L 19 9 L 5 9 Z" fill="#1a1e26" stroke="#666" strokeWidth="0.4" />
            <text x="12" y="24" textAnchor="middle" fontSize="6" fill="#a3a3a3" fontFamily="ui-monospace, monospace">HDMI</text>
          </g>

          {/* Audio output (right edge) */}
          <g transform="translate(256 175)">
            <circle cx="12" cy="6" r="6" fill="#0f172a" stroke="#34d399" strokeWidth="0.5" />
            <circle cx="12" cy="6" r="3" fill="#000" />
            <text x="12" y="24" textAnchor="middle" fontSize="6" fill="#6ee7b7" fontFamily="ui-monospace, monospace">AUDIO</text>
          </g>

          {/* Motherboard label */}
          <text x="140" y="280" textAnchor="middle" fontSize="7" fill="#a78bfa" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="1">
            MOTHERBOARD
          </text>
        </g>

        {/* Internal wire: USB IN → CPU (data path on the PCB) */}
        <path
          d="M 334 200 L 380 200 L 380 130"
          stroke="#4d8dff"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          fill="none"
          opacity="0.4"
        />
        {/* Internal: CPU → HDMI out */}
        <path
          d="M 470 130 L 555 130 L 565 165"
          stroke="#7dd3fc"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          fill="none"
          opacity="0.4"
        />
        {/* Internal: CPU → AUDIO */}
        <path
          d="M 470 145 L 555 145 L 565 240"
          stroke="#34d399"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          fill="none"
          opacity="0.4"
        />

        {/* ═════════════════════════════════════════════════════
         * PROCESSING PIPELINE (below motherboard)
         * ═════════════════════════════════════════════════════ */}

        <g transform="translate(60 400)">
          <text x="0" y="0" fontSize="9" fill="#a78bfa" fontFamily="ui-monospace, monospace" fontWeight="700" letterSpacing="1">
            HOW A KEY PRESS BECOMES A LETTER ON THE SCREEN:
          </text>

          {/* Five pipeline stages */}
          {[
            { label: "KEY PRESS", detail: "hardware signal", color: "#7dd3fc" },
            { label: "SCAN CODE", detail: "0x17", color: "#93c5fd" },
            { label: "ASCII", detail: "0x49 = 'I'", color: "#a78bfa" },
            { label: "MACHINE OP", detail: "PRINT R1", color: "#f472b6" },
            { label: "PIXELS", detail: "draw 'I'", color: "#34d399" },
          ].map((stage, i) => {
            const x = i * 152;
            return (
              <g key={i} transform={`translate(${x} 12)`}>
                <motion.rect
                  x="0"
                  y="0"
                  width="140"
                  height="48"
                  rx="4"
                  fill="rgba(255,255,255,0.03)"
                  stroke={stage.color}
                  strokeWidth="0.6"
                  animate={{
                    fill: [
                      "rgba(255,255,255,0.03)",
                      `${stage.color}22`,
                      "rgba(255,255,255,0.03)",
                    ],
                    strokeWidth: [0.6, 2, 0.6],
                  }}
                  transition={{
                    duration: CHAR_STEP,
                    delay: i * 0.15,
                    repeat: Infinity,
                    times: [0, 0.3, 0.7],
                  }}
                  style={{ filter: `drop-shadow(0 0 4px ${stage.color}66)` }}
                />
                <text x="70" y="17" textAnchor="middle" fontSize="8" fill={stage.color} fontFamily="ui-monospace, monospace" fontWeight="700">
                  {i + 1}. {stage.label}
                </text>
                <text x="70" y="32" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="ui-monospace, monospace">
                  {stage.detail}
                </text>
                {/* Live value swap for the ASCII / bytecode stages */}
                {i >= 1 && i <= 3 && (
                  <>
                    {IDIC_KEYS.map((k, ki) => {
                      const value =
                        i === 1 ? k.scan : i === 2 ? `${k.ascii} = '${k.ch}'` : `PRINT '${k.ch}'`;
                      return (
                        <motion.text
                          key={ki}
                          x="70"
                          y="43"
                          textAnchor="middle"
                          fontSize="7"
                          fill="#fbbf24"
                          fontFamily="ui-monospace, monospace"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{
                            duration: LOOP,
                            times: [
                              (ki * CHAR_STEP + 0.1) / LOOP,
                              (ki * CHAR_STEP + 0.4 + i * 0.1) / LOOP,
                              (ki * CHAR_STEP + 1.1) / LOOP,
                            ],
                            repeat: Infinity,
                          }}
                        >
                          {value}
                        </motion.text>
                      );
                    })}
                  </>
                )}
              </g>
            );
          })}

          {/* Arrows between stages */}
          {[0, 1, 2, 3].map((i) => (
            <g key={`arrow-${i}`} transform={`translate(${140 + i * 152} 30)`}>
              <motion.path
                d="M 0 6 L 8 6 M 5 3 L 8 6 L 5 9"
                stroke="#7dd3fc"
                strokeWidth="1.5"
                fill="none"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: CHAR_STEP, delay: i * 0.15 + 0.1, repeat: Infinity }}
              />
            </g>
          ))}
        </g>

        {/* ═════════════════════════════════════════════════════
         * RIGHT · Monitor + speaker
         * ═════════════════════════════════════════════════════ */}

        {/* Cable: HDMI → monitor */}
        <path
          d="M 590 160 Q 640 160 660 130 T 700 100"
          stroke="#7dd3fc"
          strokeWidth="2"
          fill="none"
        />
        {/* HDMI packet animation */}
        {IDIC_KEYS.map((_, i) => (
          <motion.circle
            key={`hdmi-${i}`}
            r="3.5"
            fill="#7dd3fc"
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: LOOP,
              times: [
                (i * CHAR_STEP + 1.05) / LOOP,
                (i * CHAR_STEP + 1.15) / LOOP,
                (i * CHAR_STEP + 1.75) / LOOP,
                (i * CHAR_STEP + 1.9) / LOOP,
              ],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: "path('M 590 160 Q 640 160 660 130 T 700 100')",
              filter: "drop-shadow(0 0 5px rgba(125,211,252,1))",
            }}
          />
        ))}

        {/* Monitor */}
        <g transform="translate(680 40)">
          {/* Bezel */}
          <rect x="0" y="0" width="200" height="130" rx="6" fill="#1a1e26" stroke="#0a0d14" strokeWidth="1" />
          {/* Screen */}
          <rect x="8" y="8" width="184" height="110" rx="2" fill="url(#screenGrad)" />
          {/* Screen scanline overlay */}
          <rect
            x="8"
            y="8"
            width="184"
            height="110"
            rx="2"
            fill="none"
            stroke="rgba(125,211,252,0.06)"
          />
          {/* Title bar */}
          <rect x="14" y="14" width="172" height="10" rx="1" fill="rgba(125,211,252,0.05)" />
          <circle cx="20" cy="19" r="1.5" fill="#ef4444" />
          <circle cx="26" cy="19" r="1.5" fill="#f59e0b" />
          <circle cx="32" cy="19" r="1.5" fill="#22c55e" />
          <text x="100" y="21" textAnchor="middle" fontSize="4.5" fill="#93a3bc" fontFamily="ui-monospace, monospace">
            IDIC · Editor
          </text>

          {/* Prompt */}
          <text x="18" y="45" fontSize="8" fill="#34d399" fontFamily="ui-monospace, monospace">
            $
          </text>
          <text x="26" y="45" fontSize="8" fill="#e8eef8" fontFamily="ui-monospace, monospace">
            type &gt;
          </text>

          {/* Typed characters appearing one by one */}
          {IDIC_KEYS.map((k, i) => (
            <motion.text
              key={`out-${i}`}
              x={64 + i * 12}
              y="45"
              fontSize="10"
              fill="#7dd3fc"
              fontFamily="ui-monospace, monospace"
              fontWeight="700"
              animate={{ opacity: [0, 0, 1, 1] }}
              transition={{
                duration: LOOP,
                times: [
                  0,
                  (i * CHAR_STEP + 1.4) / LOOP,
                  (i * CHAR_STEP + 1.5) / LOOP,
                  1,
                ],
                repeat: Infinity,
              }}
              style={{ filter: "drop-shadow(0 0 3px rgba(125,211,252,0.9))" }}
            >
              {k.ch}
            </motion.text>
          ))}

          {/* Blinking cursor after last character */}
          <motion.rect
            x={62 + IDIC_KEYS.length * 12}
            y="36"
            width="2"
            height="11"
            fill="#7dd3fc"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Body of program below */}
          <text x="18" y="65" fontSize="6" fill="#5c6b83" fontFamily="ui-monospace, monospace">
            {"// Class of Prof · IDIC"}
          </text>
          <text x="18" y="76" fontSize="6" fill="#5c6b83" fontFamily="ui-monospace, monospace">
            {"console.log('Hello,'"}
          </text>
          <text x="18" y="87" fontSize="6" fill="#5c6b83" fontFamily="ui-monospace, monospace">
            {"           + name)"}
          </text>
          <text x="18" y="103" fontSize="6" fill="#34d399" fontFamily="ui-monospace, monospace">
            ✓ compiled · running
          </text>

          {/* Stand */}
          <rect x="80" y="130" width="40" height="6" fill="#0a0d14" />
          <rect x="60" y="136" width="80" height="4" rx="1" fill="#0a0d14" />

          <text x="100" y="156" textAnchor="middle" fontSize="8" fill="#34d399" fontFamily="ui-monospace, monospace">
            MONITOR
          </text>
        </g>

        {/* Cable: audio → speaker */}
        <path
          d="M 590 245 Q 640 260 680 300 T 720 340"
          stroke="#34d399"
          strokeWidth="2"
          fill="none"
        />
        {IDIC_KEYS.map((_, i) => (
          <motion.circle
            key={`audio-${i}`}
            r="3"
            fill="#34d399"
            animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: LOOP,
              times: [
                (i * CHAR_STEP + 1.1) / LOOP,
                (i * CHAR_STEP + 1.25) / LOOP,
                (i * CHAR_STEP + 1.7) / LOOP,
                (i * CHAR_STEP + 1.85) / LOOP,
              ],
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: "path('M 590 245 Q 640 260 680 300 T 720 340')",
              filter: "drop-shadow(0 0 5px rgba(52,211,153,1))",
            }}
          />
        ))}

        {/* Speaker */}
        <g transform="translate(710 300)">
          {/* Speaker box */}
          <rect x="0" y="0" width="90" height="80" rx="4" fill="#1a1e26" stroke="#0a0d14" strokeWidth="1" />
          {/* Big cone */}
          <circle cx="45" cy="42" r="26" fill="#0a0d14" stroke="#3a4552" strokeWidth="1.5" />
          <circle cx="45" cy="42" r="20" fill="#1a1e26" stroke="#666" strokeWidth="0.6" />
          <circle cx="45" cy="42" r="8" fill="#3a4552" />
          {/* Small tweeter */}
          <circle cx="45" cy="12" r="4" fill="#0a0d14" stroke="#3a4552" strokeWidth="0.6" />

          {/* Sound waves */}
          {IDIC_KEYS.map((_, i) => (
            <motion.g key={`wave-${i}`}>
              {[24, 32, 40].map((r, j) => (
                <motion.circle
                  key={j}
                  cx="45"
                  cy="42"
                  r={r}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.2"
                  animate={{ opacity: [0, 0.9, 0] }}
                  transition={{
                    duration: LOOP,
                    times: [
                      (i * CHAR_STEP + 0.15 + j * 0.06) / LOOP,
                      (i * CHAR_STEP + 0.35 + j * 0.06) / LOOP,
                      (i * CHAR_STEP + 0.55 + j * 0.06) / LOOP,
                    ],
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.g>
          ))}

          <text x="45" y="98" textAnchor="middle" fontSize="8" fill="#34d399" fontFamily="ui-monospace, monospace">
            SPEAKER
          </text>
        </g>

        {/* ═════════════════════════════════════════════════════
         * Bottom band: label the entire flow
         * ═════════════════════════════════════════════════════ */}

        <line x1="30" y1="490" x2="870" y2="490" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </svg>
    </VisualFrame>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * 6b — Original detailed motherboard (kept for optional use)
 * ────────────────────────────────────────────────────────────── */

export function MotherboardRealisticVisual() {
  return (
    <VisualFrame>
      <svg viewBox="0 0 480 260" className="h-full w-full">
        <defs>
          <linearGradient id="pcbGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d3a1c" />
            <stop offset="1" stopColor="#062012" />
          </linearGradient>
          <linearGradient id="chipsetHeat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a5665" />
            <stop offset="1" stopColor="#1a1e26" />
          </linearGradient>
        </defs>

        {/* PCB */}
        <rect x="6" y="6" width="468" height="248" rx="6" fill="url(#pcbGrad)" stroke="#0a2010" strokeWidth="1" />

        {/* Screw holes */}
        {[[16, 16], [464, 16], [16, 244], [464, 244], [240, 16], [240, 244]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#c8d1dd" stroke="#0a2010" strokeWidth="0.5" />
            <circle cx={x} cy={y} r="1.5" fill="#062012" />
          </g>
        ))}

        {/* Copper traces (background) */}
        {[40, 55, 70, 85, 145, 160, 175, 190, 220].map((y, i) => (
          <line key={i} x1="20" x2="460" y1={y} y2={y} stroke="rgba(218,165,32,0.1)" strokeWidth="0.4" />
        ))}
        {[60, 100, 140, 200, 260, 320, 380, 420].map((x, i) => (
          <line key={i} x1={x} x2={x} y1="20" y2="240" stroke="rgba(218,165,32,0.08)" strokeWidth="0.4" />
        ))}

        {/* ─── CPU socket ─────────────── */}
        <rect x="60" y="60" width="90" height="90" fill="#1a1e26" stroke="#4a5665" strokeWidth="1.5" />
        <rect x="65" y="65" width="80" height="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        {/* Socket pins pattern */}
        {[...Array(15)].map((_, r) =>
          [...Array(15)].map((_, c) => (
            <circle key={`p${r}${c}`} cx={68 + c * 5} cy={68 + r * 5} r="0.6" fill="#c9a842" />
          ))
        )}
        <text x="105" y="55" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">CPU SOCKET</text>
        <text x="105" y="167" textAnchor="middle" fontSize="6" fill="#7dd3fc" fontFamily="ui-monospace, monospace">LGA-1700</text>

        {/* ─── DIMM slots (4x) ────────── */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={175 + i * 15} y="30" width="10" height="130" rx="1" fill="#1a0a1a" stroke="#3a2540" strokeWidth="0.6" />
            <rect x={175 + i * 15} y="30" width="10" height="4" fill="#c9a842" />
            <rect x={175 + i * 15} y="156" width="10" height="4" fill="#c9a842" />
          </g>
        ))}
        <text x="197" y="25" textAnchor="middle" fontSize="7" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">DIMM SLOTS</text>
        <text x="197" y="172" textAnchor="middle" fontSize="6" fill="#7dd3fc" fontFamily="ui-monospace, monospace">DDR5 · 4×</text>

        {/* ─── Chipset heatsink ────────── */}
        <rect x="260" y="120" width="45" height="45" rx="4" fill="url(#chipsetHeat)" stroke="#1a1e26" strokeWidth="0.8" />
        {/* Fins */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="264" x2="301" y1={126 + i * 9} y2={126 + i * 9} stroke="#2a2f38" strokeWidth="0.6" />
        ))}
        <text x="282" y="115" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">CHIPSET</text>

        {/* ─── PCIe slots ────────── */}
        <rect x="60" y="180" width="240" height="8" rx="1" fill="#3d3d0a" stroke="#5a5a20" strokeWidth="0.5" />
        <text x="180" y="177" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="ui-monospace, monospace">PCIe ×16 · GPU</text>

        <rect x="60" y="200" width="120" height="8" rx="1" fill="#3d3d0a" stroke="#5a5a20" strokeWidth="0.5" />
        <text x="120" y="197" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.6)" fontFamily="ui-monospace, monospace">PCIe ×4 · M.2</text>

        <rect x="60" y="220" width="80" height="6" rx="1" fill="#3d3d0a" stroke="#5a5a20" strokeWidth="0.5" />
        <text x="100" y="217" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.4)" fontFamily="ui-monospace, monospace">PCIe ×1</text>

        {/* ─── SATA ports ────────── */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={320 + i * 12} y="180" width="10" height="18" rx="1" fill="#7c2d12" stroke="#3d1608" strokeWidth="0.4" />
            <rect x={321 + i * 12} y="182" width="8" height="14" fill="#1a0a08" />
          </g>
        ))}
        <text x="344" y="177" textAnchor="middle" fontSize="6" fill="#fed7aa" fontFamily="ui-monospace, monospace">SATA</text>

        {/* ─── 24-pin ATX power ───── */}
        <rect x="380" y="30" width="70" height="16" rx="1" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.4" />
        {[...Array(12)].map((_, i) => (
          <rect key={`p1${i}`} x={382 + i * 5.6} y="32" width="4" height="5" fill="#2a2a2a" />
        ))}
        {[...Array(12)].map((_, i) => (
          <rect key={`p2${i}`} x={382 + i * 5.6} y="39" width="4" height="5" fill="#2a2a2a" />
        ))}
        <text x="415" y="55" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">24-PIN ATX</text>

        {/* ─── 8-pin CPU power ───── */}
        <rect x="60" y="30" width="34" height="14" rx="1" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.4" />
        {[...Array(4)].map((_, i) => (
          <rect key={`c1${i}`} x={62 + i * 8} y="32" width="6" height="4" fill="#2a2a2a" />
        ))}
        {[...Array(4)].map((_, i) => (
          <rect key={`c2${i}`} x={62 + i * 8} y="38" width="6" height="4" fill="#2a2a2a" />
        ))}
        <text x="77" y="53" textAnchor="middle" fontSize="5.5" fill="#fff" fontFamily="ui-monospace, monospace" fontWeight="700">CPU-8PIN</text>

        {/* ─── BIOS / CMOS ──────── */}
        <rect x="335" y="60" width="30" height="15" rx="1" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
        <text x="350" y="70" textAnchor="middle" fontSize="5" fill="#a78bfa" fontFamily="ui-monospace, monospace">BIOS</text>

        <circle cx="380" cy="70" r="10" fill="#c8d1dd" stroke="#4a5665" strokeWidth="0.8" />
        <text x="380" y="72" textAnchor="middle" fontSize="4.5" fill="#1a1e26" fontFamily="ui-monospace, monospace">CR2032</text>

        {/* ─── I/O panel ────────── */}
        <rect x="330" y="90" width="130" height="22" rx="2" fill="#1a1e26" stroke="#3a4552" strokeWidth="0.6" />
        {/* USB ports blue */}
        {[0, 1].map((i) => (
          <rect key={`u${i}`} x={335 + i * 13} y="94" width="10" height="6" fill="#1e40af" stroke="#3b82f6" strokeWidth="0.3" />
        ))}
        {/* USB-C */}
        <rect x="365" y="94" width="10" height="4" rx="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.3" />
        {/* HDMI */}
        <rect x="380" y="94" width="16" height="6" rx="0.5" fill="#0f172a" stroke="#666" strokeWidth="0.3" />
        {/* Ethernet */}
        <rect x="400" y="94" width="14" height="8" rx="0.5" fill="#0f172a" stroke="#22c55e" strokeWidth="0.3" />
        {/* Audio jacks */}
        {[0, 1, 2].map((i) => (
          <circle key={`a${i}`} cx={422 + i * 8} cy="98" r="2" fill="#0f172a" stroke="#666" strokeWidth="0.3" />
        ))}
        <text x="395" y="108" textAnchor="middle" fontSize="5" fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, monospace">I/O · USB · HDMI · LAN</text>

        {/* ─── Capacitors / VRMs near CPU ───── */}
        {[[50, 62], [50, 78], [50, 94], [50, 110], [50, 126], [50, 142], [160, 175]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#0a1a3a" stroke="#4a5665" strokeWidth="0.4" />
            <line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke="#4a5665" strokeWidth="0.3" />
            <line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke="#4a5665" strokeWidth="0.3" />
          </g>
        ))}

        {/* ─── Live data flow ───── */}
        {/* CPU ↔ RAM */}
        <motion.circle r="2.5" fill="#7dd3fc" style={{ filter: "drop-shadow(0 0 3px rgba(125,211,252,0.9))" }}
          animate={{ cx: [150, 175], cy: [105, 95] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        {/* CPU → PCIe (GPU) */}
        <motion.circle r="2.5" fill="#4d8dff" style={{ filter: "drop-shadow(0 0 3px rgba(77,141,255,0.9))" }}
          animate={{ cx: [105, 180], cy: [150, 184] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
        />
        {/* CPU → Chipset → SATA */}
        <motion.circle r="2.5" fill="#fb923c" style={{ filter: "drop-shadow(0 0 3px rgba(251,146,60,0.9))" }}
          animate={{ cx: [150, 260, 320], cy: [130, 140, 189] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
        />
        {/* ATX power line */}
        <motion.circle r="2.5" fill="#22c55e" style={{ filter: "drop-shadow(0 0 3px rgba(34,197,94,0.9))" }}
          animate={{ cx: [380, 260, 105], cy: [50, 90, 60] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />

        {/* Title band */}
        <text x="240" y="252" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="ui-monospace, monospace" letterSpacing="2">
          IDIC MOTHERBOARD · ATX · 2026
        </text>
      </svg>
    </VisualFrame>
  );
}
