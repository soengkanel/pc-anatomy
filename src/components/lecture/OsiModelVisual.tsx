"use client";

// Interactive OSI 7-layer journey.
//
// Shows a "GET /idic.edu.kh" request being encapsulated as it descends the
// sender's stack (Layer 7 → Layer 1), crossing the physical wire, then
// being decapsulated as it ascends the receiver's stack (Layer 1 → Layer 7).
//
// At each step the visible packet gains or loses one header. The current
// active layer glows on the correct side of the diagram and its details
// (PDU, protocols, role) are shown below the scene.

import { motion, useAnimationControls } from "framer-motion";
import {
  Cable,
  Cpu,
  Layers,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────
 * Layer definitions — index 0 = L1 (bottom), index 6 = L7 (top).
 * ────────────────────────────────────────────────────────────── */

type OsiLayer = {
  n: number;
  name: string;
  pdu: string;
  role: string;
  protocols: string[];
  color: string;
  headerLabel: string;
};

const LAYERS: OsiLayer[] = [
  {
    n: 1,
    name: "Physical",
    pdu: "Bits",
    role: "Turns the frame into electrical, optical, or radio signals.",
    protocols: ["Cat 6", "Fibre", "Wi-Fi radio", "Bluetooth"],
    color: "#e879f9",
    headerLabel: "010",
  },
  {
    n: 2,
    name: "Data Link",
    pdu: "Frame",
    role: "Adds MAC addresses and an error-check trailer.",
    protocols: ["Ethernet", "Wi-Fi (802.11)", "ARP"],
    color: "#a78bfa",
    headerLabel: "Eth",
  },
  {
    n: 3,
    name: "Network",
    pdu: "Packet",
    role: "Adds IP addresses so routers can pick the best path.",
    protocols: ["IP", "ICMP", "OSPF", "BGP"],
    color: "#22d3ee",
    headerLabel: "IP",
  },
  {
    n: 4,
    name: "Transport",
    pdu: "Segment",
    role: "Adds ports; handles reliability and packet order.",
    protocols: ["TCP", "UDP"],
    color: "#34d399",
    headerLabel: "TCP",
  },
  {
    n: 5,
    name: "Session",
    pdu: "Data",
    role: "Opens, keeps alive, and closes the conversation.",
    protocols: ["Sockets", "NetBIOS", "RPC"],
    color: "#fbbf24",
    headerLabel: "Sess",
  },
  {
    n: 6,
    name: "Presentation",
    pdu: "Data",
    role: "Encrypts, compresses, and formats data for the app.",
    protocols: ["TLS / SSL", "JPEG", "ASCII", "UTF-8"],
    color: "#fb923c",
    headerLabel: "TLS",
  },
  {
    n: 7,
    name: "Application",
    pdu: "Data",
    role: "What Chrome, Gmail, and Wing produce for the user.",
    protocols: ["HTTP", "DNS", "SMTP", "FTP"],
    color: "#fb7185",
    headerLabel: "App",
  },
];

const TOTAL_STEPS = 14; // 7 down (encapsulate) + 7 up (decapsulate)
const STEP_MS_AT_1X = 1300;
const VIEW_W = 1200;
const VIEW_H = 620;
const LAYER_H = 60;
const LAYER_GAP = 8;
const LAYER_TOP = 68;
const STACK_W = 230;
const SENDER_X = 30;
const RECEIVER_X = VIEW_W - STACK_W - SENDER_X;
const PAYLOAD = "GET /idic.edu.kh";

/* Position of layer i (0=L1 bottom, 6=L7 top) in the SVG. */
function layerY(i: number): number {
  return LAYER_TOP + (6 - i) * (LAYER_H + LAYER_GAP);
}

/* ─────────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────── */

export function OsiModelVisual() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);
  const [selected, setSelected] = useState<number | null>(null);
  const packetControls = useAnimationControls();

  // Derived state:
  //   step 0-6  → sender, currentLayer = 6 - step (starts at L7, ends at L1)
  //   step 7-13 → receiver, currentLayer = step - 7 (starts at L1, ends at L7)
  const goingUp = step >= 7;
  const layerIndex = goingUp ? step - 7 : 6 - step;
  const currentLayer = LAYERS[layerIndex];
  const headerCount = 6 - layerIndex; // how many headers wrap the payload
  const onWire = step === 6 || step === 7; // physical-layer or crossing
  const activeSide = goingUp ? "receiver" : "sender";

  // Auto-advance while playing.
  useEffect(() => {
    if (!playing) return;
    if (step >= TOTAL_STEPS - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(
      () => setStep((s) => s + 1),
      STEP_MS_AT_1X / speed,
    );
    return () => clearTimeout(t);
  }, [playing, step, speed]);

  // Slide the packet to the current layer + side.
  useEffect(() => {
    const targetX = goingUp ? RECEIVER_X - 240 : SENDER_X + STACK_W + 20;
    const targetY = layerY(layerIndex) + LAYER_H / 2 - 14;
    packetControls.start({
      x: targetX,
      y: targetY,
      transition: {
        duration: STEP_MS_AT_1X / 1000 / speed / 1.1,
        ease: "easeInOut",
      },
    });
  }, [step, layerIndex, goingUp, packetControls, speed]);

  const onPlayPause = () => {
    if (step >= TOTAL_STEPS - 1) setStep(0);
    setPlaying((p) => !p);
  };
  const onReset = () => {
    setPlaying(false);
    setStep(0);
    packetControls.set({
      x: SENDER_X + STACK_W + 20,
      y: layerY(6) + LAYER_H / 2 - 14,
    });
  };

  const stepLabel = (() => {
    if (step === 0) return "Ready — press Play. The packet starts at Layer 7 (Application).";
    if (step >= TOTAL_STEPS - 1)
      return "Delivered! Data reached the destination Application layer.";
    if (onWire) return "The frame is on the wire — bits flowing over the link.";
    return goingUp
      ? `Decapsulating at ${currentLayer.name} (L${currentLayer.n}) — removing the ${currentLayer.headerLabel} header.`
      : `Encapsulating at ${currentLayer.name} (L${currentLayer.n}) — adding the ${currentLayer.headerLabel} header.`;
  })();

  const detailLayer =
    selected !== null ? LAYERS.find((l) => l.n === selected + 1) : currentLayer;

  return (
    <div className="space-y-3">
      {/* SCENE ────────────────────────────────────────────────── */}
      <div className="relative aspect-[15/8] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0a1428] via-[#0a1730] to-[#0b1836]">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="osi-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="wire" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="0.5" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Panel titles */}
          <text
            x={SENDER_X + STACK_W / 2}
            y={40}
            textAnchor="middle"
            style={{ font: "700 14px system-ui, sans-serif" }}
            fill="#e0f2fe"
          >
            SENDER · your laptop
          </text>
          <text
            x={SENDER_X + STACK_W / 2}
            y={58}
            textAnchor="middle"
            style={{ font: "400 10px system-ui, sans-serif" }}
            fill="rgba(224, 242, 254, 0.6)"
          >
            encapsulating ↓
          </text>

          <text
            x={RECEIVER_X + STACK_W / 2}
            y={40}
            textAnchor="middle"
            style={{ font: "700 14px system-ui, sans-serif" }}
            fill="#e0f2fe"
          >
            RECEIVER · idic.edu.kh
          </text>
          <text
            x={RECEIVER_X + STACK_W / 2}
            y={58}
            textAnchor="middle"
            style={{ font: "400 10px system-ui, sans-serif" }}
            fill="rgba(224, 242, 254, 0.6)"
          >
            decapsulating ↑
          </text>

          {/* Sender stack */}
          {LAYERS.map((layer, i) => (
            <LayerBox
              key={`s-${i}`}
              layer={layer}
              x={SENDER_X}
              y={layerY(i)}
              active={!goingUp && layerIndex === i}
              onClick={() => setSelected(selected === i ? null : i)}
            />
          ))}

          {/* Receiver stack */}
          {LAYERS.map((layer, i) => (
            <LayerBox
              key={`r-${i}`}
              layer={layer}
              x={RECEIVER_X}
              y={layerY(i)}
              active={goingUp && layerIndex === i}
              onClick={() => setSelected(selected === i ? null : i)}
            />
          ))}

          {/* Physical wire between the two L1 boxes */}
          <line
            x1={SENDER_X + STACK_W}
            y1={layerY(0) + LAYER_H / 2}
            x2={RECEIVER_X}
            y2={layerY(0) + LAYER_H / 2}
            stroke="url(#wire)"
            strokeWidth="4"
            opacity={onWire ? 1 : 0.35}
            filter={onWire ? "url(#osi-glow)" : undefined}
          />

          {/* Bit stream on the wire when at the physical layer */}
          {onWire && <BitStream y={layerY(0) + LAYER_H / 2} />}

          {/* Encapsulation vs decapsulation labels near the arrows */}
          <text
            x={SENDER_X + STACK_W / 2}
            y={VIEW_H - 8}
            textAnchor="middle"
            style={{ font: "600 9px system-ui, sans-serif" }}
            fill="rgba(255,255,255,0.35)"
          >
            HEADERS ADDED AT EACH LAYER
          </text>
          <text
            x={RECEIVER_X + STACK_W / 2}
            y={VIEW_H - 8}
            textAnchor="middle"
            style={{ font: "600 9px system-ui, sans-serif" }}
            fill="rgba(255,255,255,0.35)"
          >
            HEADERS STRIPPED AT EACH LAYER
          </text>

          {/* Packet composition — animated position */}
          <motion.g
            animate={packetControls}
            initial={{
              x: SENDER_X + STACK_W + 20,
              y: layerY(6) + LAYER_H / 2 - 14,
            }}
          >
            <Packet headerCount={headerCount} onWire={onWire} />
          </motion.g>
        </svg>

        {/* HUD overlays */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-sky-300 backdrop-blur">
          <Layers className="h-3 w-3" />
          L{currentLayer.n} · {currentLayer.name}
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-neutral-200 backdrop-blur">
          Step {step + 1} / {TOTAL_STEPS}
        </div>

        {/* Caption bar */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur">
          <div className="text-[12px] font-semibold text-white">
            {stepLabel}
          </div>
          <div className="font-mono text-[10.5px] text-neutral-300">
            side: {activeSide} · headers: {headerCount}
          </div>
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
            {playing ? "Pause" : step >= TOTAL_STEPS - 1 ? "Replay" : "Play"}
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

        {/* Layer detail card */}
        {detailLayer && (
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11.5px]">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-[13px] font-bold text-white"
              style={{
                borderColor: detailLayer.color,
                backgroundColor: hexToRgba(detailLayer.color, 0.18),
              }}
            >
              L{detailLayer.n}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="font-semibold text-white">
                {detailLayer.name} <span className="font-mono text-[10px] text-neutral-400">· PDU: {detailLayer.pdu}</span>
              </div>
              <div className="text-[11px] text-neutral-300">{detailLayer.role}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {detailLayer.protocols.map((p) => (
                  <span
                    key={p}
                    className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px] text-neutral-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[11.5px] text-neutral-500">
        💡 Click any layer to pin its details · one round trip = 14 steps
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Sub-components (all pure, all SVG)
 * ────────────────────────────────────────────────────────────── */

function LayerBox({
  layer,
  x,
  y,
  active,
  onClick,
}: {
  layer: OsiLayer;
  x: number;
  y: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      <rect
        x={x}
        y={y}
        width={STACK_W}
        height={LAYER_H}
        rx={6}
        fill={active ? hexToRgba(layer.color, 0.22) : "rgba(255,255,255,0.03)"}
        stroke={active ? layer.color : "rgba(255,255,255,0.12)"}
        strokeWidth={active ? 2 : 1}
        filter={active ? "url(#osi-glow)" : undefined}
      />
      {/* Left accent bar */}
      <rect
        x={x}
        y={y}
        width={5}
        height={LAYER_H}
        rx={2}
        fill={layer.color}
        opacity={active ? 1 : 0.6}
      />
      {/* L# badge */}
      <text
        x={x + 22}
        y={y + 24}
        style={{ font: "700 15px system-ui, sans-serif" }}
        fill={active ? "#ffffff" : "rgba(255,255,255,0.6)"}
      >
        L{layer.n}
      </text>
      {/* Layer name */}
      <text
        x={x + 46}
        y={y + 24}
        style={{ font: "700 13px system-ui, sans-serif" }}
        fill={active ? "#ffffff" : "rgba(255,255,255,0.85)"}
      >
        {layer.name}
      </text>
      {/* PDU chip on the right */}
      <rect
        x={x + STACK_W - 60}
        y={y + 12}
        width={54}
        height={14}
        rx={7}
        fill="rgba(0,0,0,0.4)"
        stroke={hexToRgba(layer.color, 0.6)}
      />
      <text
        x={x + STACK_W - 33}
        y={y + 22}
        textAnchor="middle"
        style={{ font: "700 8.5px system-ui, sans-serif" }}
        fill={layer.color}
      >
        {layer.pdu.toUpperCase()}
      </text>
      {/* Protocols line */}
      <text
        x={x + 22}
        y={y + 44}
        style={{ font: "400 10px system-ui, sans-serif" }}
        fill="rgba(255,255,255,0.6)"
      >
        {layer.protocols.slice(0, 3).join(" · ")}
      </text>
    </g>
  );
}

function Packet({
  headerCount,
  onWire,
}: {
  headerCount: number;
  onWire: boolean;
}) {
  if (onWire) {
    // Compact bit-stream card while on the physical wire.
    return (
      <g>
        <rect
          x={0}
          y={0}
          width={220}
          height={28}
          rx={4}
          fill="rgba(232, 121, 249, 0.18)"
          stroke="#e879f9"
          strokeWidth="1.5"
        />
        <text
          x={110}
          y={19}
          textAnchor="middle"
          style={{ font: "700 12px 'JetBrains Mono', monospace" }}
          fill="#f0abfc"
        >
          01000111 01000101 01010100
        </text>
      </g>
    );
  }

  // Header stack — order top-to-bottom = outermost to innermost header.
  // Payload sits at the right.
  const headerSlots: OsiLayer[] = [];
  // A layer at index i wraps everything above. So headers stacked when at
  // layerIndex L are: L2..L(7-headerCount+1). Actually simpler: pick the
  // top `headerCount` layers (indices from 6 down to 6-headerCount).
  for (let k = 0; k < headerCount; k++) {
    headerSlots.push(LAYERS[6 - k]);
  }
  // Reverse so the outermost header appears on the far left, matching how
  // real Ethernet frames are drawn.
  const drawOrder = headerSlots.reverse();

  const HDR_W = 34;
  const PAD = 8;
  const barH = 28;
  const payloadW = 160;
  const totalW = drawOrder.length * HDR_W + payloadW + PAD;

  return (
    <g>
      {/* Background box */}
      <rect
        x={0}
        y={0}
        width={totalW}
        height={barH}
        rx={4}
        fill="rgba(15, 23, 42, 0.85)"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />

      {/* Header segments */}
      {drawOrder.map((layer, i) => (
        <g key={`${layer.n}-${i}`}>
          <rect
            x={i * HDR_W + 2}
            y={2}
            width={HDR_W - 2}
            height={barH - 4}
            rx={2}
            fill={hexToRgba(layer.color, 0.85)}
          />
          <text
            x={i * HDR_W + HDR_W / 2}
            y={barH / 2 + 4}
            textAnchor="middle"
            style={{ font: "700 9px system-ui, sans-serif" }}
            fill="#0a0d14"
          >
            {layer.headerLabel}
          </text>
        </g>
      ))}

      {/* Payload */}
      <rect
        x={drawOrder.length * HDR_W + 4}
        y={2}
        width={payloadW - 4}
        height={barH - 4}
        rx={2}
        fill="rgba(224, 242, 254, 0.95)"
      />
      <text
        x={drawOrder.length * HDR_W + payloadW / 2 + 4}
        y={barH / 2 + 4}
        textAnchor="middle"
        style={{ font: "600 11px 'JetBrains Mono', monospace" }}
        fill="#0a0d14"
      >
        {PAYLOAD}
      </text>
    </g>
  );
}

function BitStream({ y }: { y: number }) {
  const bits = "01100111 01100101 01110100 00100000 00101111";
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          y={y + 4}
          style={{ font: "700 10px 'JetBrains Mono', monospace" }}
          fill="#e879f9"
          initial={{ x: SENDER_X + STACK_W - 40 }}
          animate={{ x: RECEIVER_X + 20 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.55,
            ease: "linear",
          }}
        >
          {bits}
        </motion.text>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Colour helper — inline instead of pulling in a whole library.
 * ────────────────────────────────────────────────────────────── */

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
