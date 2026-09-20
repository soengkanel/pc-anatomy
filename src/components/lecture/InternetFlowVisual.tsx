"use client";

// Interactive Internet-flow scene for the Networking chapter.
//
// Scene layout (bottom-left → top-right):
//   1. Home office (laptop + Wi-Fi router) with a fibre wall outlet
//   2. Neighborhood street, underground fibre run
//   3. Local ISP facility — "KHMER NET ISP"
//   4. Internet Exchange Point — "PHNOM PENH EXCHANGE"
//   5. National backbone — thick fibre bundle heading for the coast
//   6. Submarine cable SEA-ME-WE 5 — undersea leg crossing to the USA coast
//   7. Global cloud data centre — USA, with server racks + a virtual globe
//
// The packet dot travels the whole diagonal path with easing, and the
// student controls Play / Pause / Reset / Speed. Clicking any hop pins its
// details card. Cumulative latency approximates a real Phnom-Penh-to-USA
// round-trip (~230 ms).

import { motion, useAnimationControls } from "framer-motion";
import {
  Building2,
  Cable,
  Cpu,
  Laptop,
  Network,
  Pause,
  Play,
  Radio,
  RadioTower,
  RotateCcw,
  Router,
  Server,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────
 * Hop definitions
 * ────────────────────────────────────────────────────────────── */

type Hop = {
  key: string;
  label: string;
  sub: string;
  ip: string;
  link: string;
  latencyMs: number;
  /** Where the packet dot sits when it reaches this hop. */
  x: number;
  y: number;
  /** Optional control point for the bezier segment INTO this hop. */
  cx?: number;
  cy?: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
  chipBg: string;
};

const HOPS: Hop[] = [
  {
    key: "laptop",
    label: "Laptop",
    sub: "Home office",
    ip: "192.168.1.42",
    link: "Ethernet or Wi-Fi to the switch",
    latencyMs: 0,
    x: 75,
    y: 555,
    icon: Laptop,
    accent: "text-sky-300 border-sky-400/60",
    chipBg: "bg-sky-500/15",
  },
  {
    key: "switch",
    label: "Switch",
    sub: "Home LAN · L2",
    ip: "MAC forwarding",
    link: "Unmanaged switch inside the house",
    latencyMs: 1,
    x: 155,
    y: 525,
    icon: Network,
    accent: "text-teal-300 border-teal-400/60",
    chipBg: "bg-teal-500/15",
  },
  {
    key: "router",
    label: "Router · Wi-Fi",
    sub: "NAT gateway",
    ip: "192.168.1.1",
    link: "Home router doing NAT + DHCP",
    latencyMs: 1,
    x: 240,
    y: 495,
    icon: Router,
    accent: "text-emerald-300 border-emerald-400/60",
    chipBg: "bg-emerald-500/15",
  },
  {
    key: "modem",
    label: "Modem · ONT",
    sub: "Fibre wall outlet",
    ip: "PPPoE session",
    link: "Fibre-to-the-home terminator",
    latencyMs: 1,
    x: 325,
    y: 545,
    icon: RadioTower,
    accent: "text-amber-300 border-amber-400/60",
    chipBg: "bg-amber-500/15",
    cx: 285,
    cy: 575,
  },
  {
    key: "isp",
    label: "KHMER NET ISP",
    sub: "Phnom Penh POP",
    ip: "175.100.68.4",
    link: "ISP edge router · public IP assigned",
    latencyMs: 4,
    x: 445,
    y: 450,
    icon: Cable,
    accent: "text-amber-300 border-amber-400/60",
    chipBg: "bg-amber-500/15",
    cx: 385,
    cy: 505,
  },
  {
    key: "ixp",
    label: "PHNOM PENH EXCHANGE",
    sub: "IXP · BGP peering",
    ip: "AS55666",
    link: "National Internet Exchange Point",
    latencyMs: 3,
    x: 620,
    y: 365,
    icon: Building2,
    accent: "text-violet-300 border-violet-400/60",
    chipBg: "bg-violet-500/15",
    cx: 535,
    cy: 385,
  },
  {
    key: "backbone",
    label: "NATIONAL BACKBONE",
    sub: "Fibre to the coast",
    ip: "TICC-1 route",
    link: "Long-haul terrestrial fibre",
    latencyMs: 4,
    x: 780,
    y: 405,
    icon: Radio,
    accent: "text-cyan-300 border-cyan-400/60",
    chipBg: "bg-cyan-500/15",
    cx: 700,
    cy: 345,
  },
  {
    key: "submarine",
    label: "SEA-ME-WE 5",
    sub: "Submarine cable",
    ip: "20,000 km",
    link: "Fibre optic under the ocean",
    latencyMs: 90,
    x: 940,
    y: 545,
    icon: Waves,
    accent: "text-cyan-300 border-cyan-400/60",
    chipBg: "bg-cyan-500/15",
    cx: 855,
    cy: 595,
  },
  {
    key: "firewall",
    label: "USA FIREWALL",
    sub: "Data-centre edge",
    ip: "WAF · rate limit",
    link: "Blocks bad traffic before servers",
    latencyMs: 3,
    x: 1055,
    y: 280,
    icon: ShieldCheck,
    accent: "text-rose-300 border-rose-400/60",
    chipBg: "bg-rose-500/15",
    cx: 1035,
    cy: 400,
  },
  {
    key: "usa",
    label: "USA DATA CENTRE",
    sub: "Server racks · globe",
    ip: "31.13.72.36",
    link: "HTTPS · TCP port 443",
    latencyMs: 3,
    x: 1120,
    y: 160,
    icon: Server,
    accent: "text-rose-300 border-rose-400/60",
    chipBg: "bg-rose-500/15",
    cx: 1090,
    cy: 210,
  },
];

const TOTAL_STEPS = (HOPS.length - 1) * 2; // 6 forward + 6 return = 12
const STEP_MS_AT_1X = 1500;
const VIEW_W = 1200;
const VIEW_H = 640;
const SEA_LEVEL = 460;

/* ─────────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────── */

export function InternetFlowVisual() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const controls = useAnimationControls();

  const latencyBudget = (() => {
    let ms = 0;
    for (let i = 0; i < step; i++) {
      const hopIndex = i < HOPS.length - 1 ? i + 1 : TOTAL_STEPS - i;
      ms += HOPS[hopIndex]?.latencyMs ?? 0;
    }
    return ms;
  })();

  const packetHopIndex =
    step <= HOPS.length - 1 ? step : TOTAL_STEPS - step;
  const currentHop = HOPS[packetHopIndex];
  const goingBack = step > HOPS.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (step >= TOTAL_STEPS) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS_AT_1X / speed);
    return () => clearTimeout(t);
  }, [playing, step, speed]);

  useEffect(() => {
    if (!currentHop) return;
    // Compute the previous hop we came from — for the return trip it's the
    // hop AFTER packetHopIndex in the list; on the forward trip it's before.
    const prevHop = goingBack
      ? HOPS[packetHopIndex + 1]
      : HOPS[packetHopIndex - 1];
    const startX = prevHop?.x ?? currentHop.x;
    const startY = prevHop?.y ?? currentHop.y;
    // Route through the segment's control point (if any) to get a curved arc.
    const midX = currentHop.cx ?? (startX + currentHop.x) / 2;
    const midY = currentHop.cy ?? (startY + currentHop.y) / 2;

    controls.start({
      cx: [startX, midX, currentHop.x],
      cy: [startY, midY, currentHop.y],
      transition: {
        duration: STEP_MS_AT_1X / 1000 / speed / 1.05,
        ease: "easeInOut",
      },
    });
  }, [step, currentHop, controls, speed, packetHopIndex, goingBack]);

  const onPlayPause = () => {
    if (step >= TOTAL_STEPS) setStep(0);
    setPlaying((p) => !p);
  };
  const onReset = () => {
    setPlaying(false);
    setStep(0);
    controls.set({ cx: HOPS[0].x, cy: HOPS[0].y });
  };

  const stepLabel = (() => {
    if (step === 0) return "Ready — press Play";
    if (step >= TOTAL_STEPS) return "Round-trip complete";
    const arriving = HOPS[packetHopIndex];
    return goingBack
      ? `Response ← ${arriving.label}`
      : `Request → ${arriving.label}`;
  })();

  const detailHop = selected
    ? HOPS.find((h) => h.key === selected)
    : currentHop;

  return (
    <div className="space-y-3">
      {/* SCENE ───────────────────────────────────────────────── */}
      <div className="relative aspect-[15/8] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1428] via-[#0a1730] to-[#0b1836]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sky-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#04102a" />
              <stop offset="1" stopColor="#0a1836" />
            </linearGradient>
            <linearGradient id="sea-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0e365e" />
              <stop offset="1" stopColor="#02132b" />
            </linearGradient>
            <linearGradient id="land-kh" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1e293b" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="land-us" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#334155" />
              <stop offset="1" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="fibre" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="0.15" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="0.85" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sky */}
          <rect width={VIEW_W} height={VIEW_H} fill="url(#sky-grad)" />

          {/* Stars */}
          {[[80, 40], [200, 80], [420, 30], [640, 50], [880, 25], [1050, 70], [1150, 40]].map(
            ([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.2} fill="#ffffff" opacity="0.6" />
            ),
          )}

          {/* Ocean band */}
          <path
            d={`M 700 ${SEA_LEVEL} Q 850 ${SEA_LEVEL - 8} 1000 ${SEA_LEVEL + 4} T 1200 ${SEA_LEVEL} L 1200 ${VIEW_H} L 700 ${VIEW_H} Z`}
            fill="url(#sea-grad)"
          />
          {/* Wave lines */}
          {[SEA_LEVEL + 20, SEA_LEVEL + 40, SEA_LEVEL + 60].map((y, i) => (
            <path
              key={i}
              d={`M 720 ${y} Q 830 ${y - 6} 960 ${y + 2} T 1180 ${y}`}
              stroke="rgba(148, 197, 255, 0.18)"
              strokeWidth="1"
              fill="none"
            />
          ))}

          {/* Cambodian land (bottom-left, KH side) */}
          <path
            d={`M 0 ${SEA_LEVEL + 20} L 720 ${SEA_LEVEL + 20} L 720 ${VIEW_H} L 0 ${VIEW_H} Z`}
            fill="url(#land-kh)"
          />
          {/* Faint ground detail */}
          <line x1="0" y1={SEA_LEVEL + 24} x2="720" y2={SEA_LEVEL + 24} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* USA land (top-right, elevated) */}
          <path d={`M 1000 200 L 1200 200 L 1200 380 L 1000 380 Z`} fill="url(#land-us)" />
          <line x1="1000" y1="206" x2="1200" y2="206" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* USA coastline dropping to sea */}
          <path
            d={`M 1000 380 L 1030 420 L 1060 470 L 1080 ${SEA_LEVEL - 5}`}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
          />

          {/* ── Fibre backbone paths (drawn behind icons) ── */}
          <FibreCable />

          {/* Home area — small house */}
          <HouseGraphic x={25} y={505} />

          {/* Home switch — small L2 device beside the house */}
          <SwitchGraphic x={135} y={520} />

          {/* Home router — Wi-Fi with ripples */}
          <RouterGraphic x={220} y={480} />

          {/* Modem / ONT — fibre wall outlet box */}
          <ModemGraphic x={305} y={535} />

          {/* KHMER NET ISP building */}
          <ServerBuilding x={415} y={405} w={65} h={65} label="KHMER NET" tint="#f59e0b" />

          {/* PHNOM PENH EXCHANGE building */}
          <ServerBuilding x={580} y={310} w={85} h={80} label="P.P EXCHANGE" tint="#a78bfa" antennas={2} />

          {/* National backbone — fibre bundle */}
          <BackboneBundle x={750} y={360} />

          {/* Submarine cable visualisation */}
          <SubmarineCable />

          {/* USA firewall — shield on the coast approach */}
          <FirewallGraphic x={1055} y={280} />

          {/* USA data centre on the elevated land */}
          <DataCenter x={1050} y={120} />

          {/* Virtual globe + satellite */}
          <GlobeAndSatellite cx={1150} cy={70} />

          {/* Hop nodes on top of the scene */}
          {HOPS.map((h, i) => {
            const passed = i <= packetHopIndex;
            return (
              <g key={h.key}>
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={passed ? 9 : 7}
                  fill={passed ? "#38bdf8" : "rgba(255,255,255,0.15)"}
                  stroke="#ffffff"
                  strokeOpacity={passed ? 0.9 : 0.3}
                  strokeWidth={2}
                  filter={i === packetHopIndex ? "url(#glow)" : undefined}
                />
              </g>
            );
          })}

          {/* Packet dot */}
          <motion.circle
            animate={controls}
            initial={{ cx: HOPS[0].x, cy: HOPS[0].y }}
            r={11}
            fill={goingBack ? "#34d399" : "#38bdf8"}
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow)"
          />
        </svg>

        {/* HUD overlays — HTML on top of the SVG */}
        {/* Hop labels (positioned relative to viewBox) */}
        {HOPS.map((h, i) => {
          const active = i === packetHopIndex;
          const passed = i <= packetHopIndex;
          return (
            <button
              key={h.key}
              type="button"
              onClick={() =>
                setSelected((prev) => (prev === h.key ? null : h.key))
              }
              className={cn(
                "absolute -translate-x-1/2 rounded-md border px-1.5 py-0.5 backdrop-blur transition-colors",
                active
                  ? cn(h.accent, h.chipBg, "text-white shadow-lg")
                  : passed
                    ? "border-white/25 bg-black/50 text-neutral-100"
                    : "border-white/10 bg-black/40 text-neutral-400",
              )}
              style={{
                left: `${(h.x / VIEW_W) * 100}%`,
                top: `${((h.y + 26) / VIEW_H) * 100}%`,
              }}
            >
              <div className="whitespace-nowrap text-[9.5px] font-bold uppercase tracking-widest">
                {h.label}
              </div>
              <div className="text-center text-[9px] text-neutral-400">
                {h.sub}
              </div>
            </button>
          );
        })}

        {/* Latency pill */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-sky-300 backdrop-blur">
          <Cpu className="h-3 w-3" />
          {latencyBudget} ms
        </div>

        {/* Step pill */}
        <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-neutral-200 backdrop-blur">
          Step {Math.min(step + 1, TOTAL_STEPS)} / {TOTAL_STEPS}
        </div>

        {/* Zone labels — subtle text banners */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
          KH · LOCAL
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
          USA · GLOBAL
        </div>

        {/* Caption */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
          <div className="text-[12px] font-semibold text-white">
            {stepLabel}
          </div>
          {currentHop && step > 0 && (
            <div className="font-mono text-[10.5px] text-neutral-300">
              {currentHop.link}
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPlayPause}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors",
              playing
                ? "border-rose-400/50 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
                : "border-emerald-400/50 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25",
            )}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : step >= TOTAL_STEPS ? "Replay" : "Play"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 text-[12.5px] text-neutral-200 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <div className="ml-1 flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[11px]">
            {([0.5, 1, 2] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono transition-colors",
                  speed === s
                    ? "bg-white/15 text-white"
                    : "text-neutral-400 hover:text-white",
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {detailHop && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11.5px]">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", detailHop.accent, detailHop.chipBg)}>
              <detailHop.icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-white">{detailHop.label}</div>
              <div className="font-mono text-[10.5px] text-neutral-400">
                {detailHop.ip} · +{detailHop.latencyMs} ms · {detailHop.link}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[11.5px] text-neutral-500">
        💡 Click any labelled hop to pin its details · ~230 ms Phnom Penh ↔ USA round-trip
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Scenic SVG pieces
 * ────────────────────────────────────────────────────────────── */

function FibreCable() {
  // A single glowing polyline that traces all hop positions — visualises
  // the physical fibre network the packet is riding along.
  const d = HOPS.reduce((acc, h, i) => {
    if (i === 0) return `M ${h.x} ${h.y}`;
    if (h.cx !== undefined && h.cy !== undefined) {
      return `${acc} Q ${h.cx} ${h.cy} ${h.x} ${h.y}`;
    }
    return `${acc} L ${h.x} ${h.y}`;
  }, "");

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="url(#fibre)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#glow)"
      />
      <path
        d={d}
        fill="none"
        stroke="rgba(56, 189, 248, 0.4)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </>
  );
}

function HouseGraphic({ x, y }: { x: number; y: number }) {
  // Compact home: sloped roof + wall + a window with a laptop glow.
  return (
    <g>
      {/* House body */}
      <rect x={x} y={y + 15} width={80} height={60} fill="#1e293b" stroke="rgba(255,255,255,0.15)" />
      {/* Roof */}
      <polygon
        points={`${x - 5},${y + 15} ${x + 85},${y + 15} ${x + 40},${y - 10}`}
        fill="#334155"
        stroke="rgba(255,255,255,0.15)"
      />
      {/* Window with laptop glow */}
      <rect x={x + 10} y={y + 25} width={28} height={22} fill="#0a1428" stroke="rgba(56, 189, 248, 0.5)" />
      <rect x={x + 16} y={y + 34} width={16} height={10} fill="rgba(125, 211, 252, 0.7)" />
      {/* Door */}
      <rect x={x + 50} y={y + 40} width={18} height={35} fill="#0a0f1a" stroke="rgba(255,255,255,0.15)" />
    </g>
  );
}

function SwitchGraphic({ x, y }: { x: number; y: number }) {
  // Small unmanaged Ethernet switch: horizontal box with 6 ports and 2 LEDs.
  return (
    <g>
      {/* Body */}
      <rect x={x - 22} y={y - 8} width={44} height={16} rx={2} fill="#111827" stroke="#2dd4bf" strokeOpacity="0.5" />
      {/* Ports */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={x - 18 + i * 6}
          y={y + 2}
          width={4}
          height={4}
          fill="#0a0d14"
          stroke="rgba(45, 212, 191, 0.6)"
          strokeWidth="0.5"
        />
      ))}
      {/* Status LEDs */}
      <circle cx={x + 16} cy={y - 4} r={1.4} fill="#34d399" />
      <circle cx={x + 12} cy={y - 4} r={1.4} fill="#22d3ee" />
      {/* Label */}
      <text
        x={x}
        y={y + 20}
        textAnchor="middle"
        style={{ font: "700 7px system-ui, sans-serif" }}
        fill="#2dd4bf"
      >
        SWITCH
      </text>
    </g>
  );
}

function RouterGraphic({ x, y }: { x: number; y: number }) {
  // Wi-Fi router: base + two upright antennas + expanding ripples.
  return (
    <g>
      {/* Body */}
      <rect x={x - 20} y={y + 4} width={40} height={12} rx={2} fill="#111827" stroke="#34d399" strokeOpacity="0.5" />
      {/* Ports on the front */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={x - 16 + i * 8} y={y + 8} width={4} height={3} fill="#0a0d14" />
      ))}
      {/* Antennas */}
      <line x1={x - 14} y1={y + 4} x2={x - 14} y2={y - 12} stroke="#34d399" strokeWidth="1.4" />
      <line x1={x + 14} y1={y + 4} x2={x + 14} y2={y - 12} stroke="#34d399" strokeWidth="1.4" />
      {/* Wi-Fi ripples */}
      {[6, 12, 18].map((r, i) => (
        <circle
          key={i}
          cx={x}
          cy={y - 4}
          r={r}
          fill="none"
          stroke="rgba(52, 211, 153, 0.55)"
          strokeWidth="0.8"
          opacity={1 - i * 0.28}
        />
      ))}
      {/* Label */}
      <text
        x={x}
        y={y + 26}
        textAnchor="middle"
        style={{ font: "700 7px system-ui, sans-serif" }}
        fill="#34d399"
      >
        ROUTER
      </text>
    </g>
  );
}

function ModemGraphic({ x, y }: { x: number; y: number }) {
  // Fibre ONT — small box on the wall with 3 status LEDs and a fibre pigtail.
  return (
    <g>
      {/* Wall outlet plate behind the modem */}
      <rect x={x - 18} y={y - 12} width={36} height={26} rx={1.5} fill="#0f172a" stroke="rgba(251, 191, 36, 0.35)" />
      {/* Modem body */}
      <rect x={x - 14} y={y - 8} width={28} height={16} rx={1.5} fill="#1e293b" stroke="#fbbf24" strokeOpacity="0.6" />
      {/* Status LEDs */}
      <circle cx={x - 8} cy={y - 3} r={1.4} fill="#22d3ee" />
      <circle cx={x - 3} cy={y - 3} r={1.4} fill="#fbbf24" />
      <circle cx={x + 2} cy={y - 3} r={1.4} fill="#34d399" />
      {/* Fibre pigtail into the wall */}
      <path d={`M ${x + 14} ${y} Q ${x + 22} ${y + 4} ${x + 26} ${y + 12}`} stroke="rgba(56, 189, 248, 0.7)" strokeWidth="1.5" fill="none" />
      {/* Label */}
      <text
        x={x}
        y={y + 22}
        textAnchor="middle"
        style={{ font: "700 7px system-ui, sans-serif" }}
        fill="#fbbf24"
      >
        MODEM · ONT
      </text>
    </g>
  );
}

function FirewallGraphic({ x, y }: { x: number; y: number }) {
  // Shield glyph with rows of "brick" for the layered-defenses look.
  return (
    <g>
      {/* Shield */}
      <path
        d={`M ${x} ${y - 20} L ${x + 18} ${y - 12} L ${x + 18} ${y + 6} Q ${x + 18} ${y + 22} ${x} ${y + 28} Q ${x - 18} ${y + 22} ${x - 18} ${y + 6} L ${x - 18} ${y - 12} Z`}
        fill="rgba(251, 113, 133, 0.15)"
        stroke="#fb7185"
        strokeWidth="1.5"
      />
      {/* Firewall brick pattern */}
      {[-6, 0, 6].map((dy) => (
        <line
          key={dy}
          x1={x - 14}
          y1={y + dy}
          x2={x + 14}
          y2={y + dy}
          stroke="rgba(251, 113, 133, 0.4)"
          strokeWidth="0.6"
        />
      ))}
      {/* Small flame in middle */}
      <path
        d={`M ${x} ${y - 4} q -3 4 -1 8 q 2 -2 1 -4 q 3 2 3 5`}
        fill="#fb7185"
        opacity="0.9"
      />
      {/* Label */}
      <text
        x={x}
        y={y + 42}
        textAnchor="middle"
        style={{ font: "700 8px system-ui, sans-serif" }}
        fill="#fb7185"
      >
        FIREWALL
      </text>
    </g>
  );
}

function ServerBuilding({
  x,
  y,
  w,
  h,
  label,
  tint,
  antennas = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tint: string;
  antennas?: number;
}) {
  return (
    <g>
      {/* Building shell */}
      <rect x={x} y={y} width={w} height={h} fill="#111827" stroke={tint} strokeOpacity="0.5" strokeWidth="1.5" />
      {/* Windows grid */}
      {Array.from({ length: 3 }).map((_, r) => (
        <g key={r}>
          {Array.from({ length: 3 }).map((_, c) => (
            <rect
              key={c}
              x={x + 6 + c * (w - 12) / 3}
              y={y + 8 + r * (h - 16) / 3}
              width={(w - 24) / 3}
              height={(h - 24) / 3}
              fill={tint}
              fillOpacity="0.25"
            />
          ))}
        </g>
      ))}
      {/* Roof + antennas */}
      <rect x={x - 2} y={y - 4} width={w + 4} height={4} fill={tint} fillOpacity="0.4" />
      {Array.from({ length: antennas }).map((_, i) => {
        const ax = x + (w / (antennas + 1)) * (i + 1);
        return (
          <line
            key={i}
            x1={ax}
            y1={y - 4}
            x2={ax}
            y2={y - 20}
            stroke={tint}
            strokeWidth="1.5"
          />
        );
      })}
      {/* Label plate */}
      <rect x={x - 4} y={y + h + 4} width={w + 8} height={12} rx={2} fill="#0a0d14" stroke={tint} strokeOpacity="0.5" />
      <text
        x={x + w / 2}
        y={y + h + 13}
        textAnchor="middle"
        style={{ font: "700 8px system-ui, sans-serif" }}
        fill={tint}
      >
        {label}
      </text>
    </g>
  );
}

function BackboneBundle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Fibre bundle heading south-east into the sea */}
      {[-4, 0, 4].map((dx, i) => (
        <path
          key={i}
          d={`M ${x + dx} ${y} Q ${x + 40 + dx} ${y + 60} ${x + 90 + dx} ${SEA_LEVEL + 20}`}
          stroke="#38bdf8"
          strokeWidth="2"
          fill="none"
          opacity={0.5 + i * 0.15}
        />
      ))}
      {/* Small tag */}
      <rect x={x - 8} y={y - 22} width={90} height={14} rx={2} fill="#0a0d14" stroke="rgba(56, 189, 248, 0.5)" />
      <text
        x={x + 37}
        y={y - 12}
        textAnchor="middle"
        style={{ font: "700 8px system-ui, sans-serif" }}
        fill="#38bdf8"
      >
        NATIONAL BACKBONE
      </text>
    </g>
  );
}

function SubmarineCable() {
  return (
    <g>
      {/* Cable curve descending into the ocean and rising to USA */}
      <path
        d={`M 830 ${SEA_LEVEL + 8} Q 900 ${SEA_LEVEL + 90} 980 ${SEA_LEVEL + 80} T 1080 ${SEA_LEVEL - 10}`}
        stroke="#22d3ee"
        strokeWidth="3"
        fill="none"
        opacity="0.85"
        filter="url(#glow)"
      />
      {/* Repeater markers along the cable */}
      {[[900, SEA_LEVEL + 70], [960, SEA_LEVEL + 82], [1020, SEA_LEVEL + 50]].map(
        ([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} fill="#e0f2fe" opacity="0.9" />
        ),
      )}
      {/* Label */}
      <rect x={890} y={SEA_LEVEL + 100} width={140} height={14} rx={2} fill="#0a0d14" stroke="rgba(34, 211, 238, 0.4)" />
      <text
        x={960}
        y={SEA_LEVEL + 110}
        textAnchor="middle"
        style={{ font: "700 8px system-ui, sans-serif" }}
        fill="#22d3ee"
      >
        SUBMARINE CABLE · SEA-ME-WE 5
      </text>
    </g>
  );
}

function DataCenter({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Building shell */}
      <rect x={x} y={y} width={130} height={90} fill="#0f172a" stroke="rgba(251, 113, 133, 0.5)" strokeWidth="1.5" />
      {/* Server rack blocks */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x={x + 10 + i * 28} y={y + 12} width={22} height={70} fill="#1e293b" stroke="rgba(251, 113, 133, 0.35)" />
          {[0, 1, 2, 3, 4].map((r) => (
            <rect
              key={r}
              x={x + 12 + i * 28}
              y={y + 16 + r * 13}
              width={18}
              height={10}
              fill="rgba(251, 113, 133, 0.4)"
            />
          ))}
        </g>
      ))}
      {/* Label plate */}
      <rect x={x - 4} y={y + 94} width={138} height={14} rx={2} fill="#0a0d14" stroke="rgba(251, 113, 133, 0.5)" />
      <text
        x={x + 65}
        y={y + 103}
        textAnchor="middle"
        style={{ font: "700 8px system-ui, sans-serif" }}
        fill="#fb7185"
      >
        GLOBAL CLOUD DATA CENTER · USA
      </text>
    </g>
  );
}

function GlobeAndSatellite({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g opacity="0.85">
      {/* Globe */}
      <circle cx={cx} cy={cy} r={30} fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" />
      {/* Meridians */}
      <ellipse cx={cx} cy={cy} rx={30} ry={10} fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.6" />
      <ellipse cx={cx} cy={cy} rx={10} ry={30} fill="none" stroke="#38bdf8" strokeWidth="0.6" opacity="0.6" />
      <ellipse cx={cx} cy={cy} rx={30} ry={20} fill="none" stroke="#38bdf8" strokeWidth="0.4" opacity="0.4" />
      {/* Satellite icon */}
      <g transform={`translate(${cx - 60}, ${cy - 45})`}>
        <rect x="-6" y="-3" width="12" height="6" fill="#e0f2fe" stroke="#38bdf8" />
        <line x1="-10" y1="0" x2="-6" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="6" y1="0" x2="10" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="-13" cy="0" r="2" fill="#e0f2fe" />
        <circle cx="13" cy="0" r="2" fill="#e0f2fe" />
      </g>
      {/* Beam from satellite to globe */}
      <line
        x1={cx - 60}
        y1={cy - 42}
        x2={cx - 10}
        y2={cy - 15}
        stroke="rgba(56, 189, 248, 0.5)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
    </g>
  );
}
