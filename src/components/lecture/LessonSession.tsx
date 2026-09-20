"use client";

// LessonSession — sticky clock bar at the top of the lecture page, plus
// a React context that broadcasts session state ("idle" | "running" |
// "stopped") to every LessonPack so quizzes can lock when the professor
// ends the class.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Pencil, Play, RotateCcw, Square, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────
 * Context
 * ────────────────────────────────────────────────────────────── */

type SessionState = "idle" | "running" | "stopped";

// The class runs on a fixed 45-minute timer. When it expires the session
// auto-locks, plays the fireworks fanfare, and every quiz freezes — same
// behavior as the professor pressing Stop.
const SESSION_LIMIT_SEC = 45 * 60;
// Below this many seconds remaining, the timer switches to a warning color.
const SESSION_WARN_SEC = 5 * 60;

type SessionContextValue = {
  state: SessionState;
  elapsedSec: number;
  remainingSec: number;
  limitSec: number;
  locked: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useLessonSession(): SessionContextValue {
  return (
    useContext(SessionContext) ?? {
      state: "idle",
      elapsedSec: 0,
      remainingSec: SESSION_LIMIT_SEC,
      limitSec: SESSION_LIMIT_SEC,
      locked: false,
      start: () => {},
      stop: () => {},
      reset: () => {},
    }
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Provider + Bar
 * ────────────────────────────────────────────────────────────── */

export function LessonSessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SessionState>("idle");
  const [elapsedSec, setElapsedSec] = useState(0);
  const [muted, setMuted] = useState(false);
  const [effect, setEffect] = useState<null | "claps" | "fireworks">(null);
  const startedAtRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // Tick the elapsed counter while running.
  useEffect(() => {
    if (state !== "running") return;
    const id = window.setInterval(() => {
      if (startedAtRef.current !== null) {
        const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setElapsedSec(secs > SESSION_LIMIT_SEC ? SESSION_LIMIT_SEC : secs);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [state]);

  const ensureAudio = useCallback((): AudioContext | null => {
    if (muted) return null;
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const W = window as Window & { webkitAudioContext?: typeof AudioContext };
      const Ctor = window.AudioContext ?? W.webkitAudioContext;
      if (!Ctor) return null;
      audioRef.current = new Ctor();
    }
    if (audioRef.current.state === "suspended") {
      void audioRef.current.resume();
    }
    return audioRef.current;
  }, [muted]);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setState("running");
    setEffect("claps");
    window.setTimeout(() => setEffect(null), 2200);
    const ctx = ensureAudio();
    if (ctx) {
      playClapCheer(ctx);
    }
  }, [ensureAudio]);

  const stop = useCallback(() => {
    setState("stopped");
    setEffect("fireworks");
    window.setTimeout(() => setEffect(null), 4200);
    const ctx = ensureAudio();
    if (ctx) {
      playFireworkFanfare(ctx);
    }
  }, [ensureAudio]);

  const reset = useCallback(() => {
    startedAtRef.current = null;
    setElapsedSec(0);
    setState("idle");
    setEffect(null);
  }, []);

  // Auto-lock the moment the running session hits the 45-minute limit.
  // We defer the stop() call to the next animation frame so React 19's
  // "don't setState synchronously inside an effect" rule stays happy.
  useEffect(() => {
    if (state !== "running" || elapsedSec < SESSION_LIMIT_SEC) return;
    const raf = window.requestAnimationFrame(() => stop());
    return () => window.cancelAnimationFrame(raf);
  }, [state, elapsedSec, stop]);

  const value = useMemo(
    () => ({
      state,
      elapsedSec,
      remainingSec: Math.max(0, SESSION_LIMIT_SEC - elapsedSec),
      limitSec: SESSION_LIMIT_SEC,
      locked: state === "stopped",
      start,
      stop,
      reset,
    }),
    [state, elapsedSec, start, stop, reset]
  );

  return (
    <SessionContext.Provider value={value}>
      <ClockBar
        state={state}
        elapsedSec={elapsedSec}
        muted={muted}
        onStart={start}
        onStop={stop}
        onReset={reset}
        onToggleMute={() => setMuted((m) => !m)}
      />
      <AnimatePresence>
        {effect === "claps" && <ClapOverlay key="claps" />}
        {effect === "fireworks" && <FireworkOverlay key="fw" />}
      </AnimatePresence>
      {children}
    </SessionContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Sticky clock bar
 * ────────────────────────────────────────────────────────────── */

function ClockBar({
  state,
  elapsedSec,
  muted,
  onStart,
  onStop,
  onReset,
  onToggleMute,
}: {
  state: SessionState;
  elapsedSec: number;
  muted: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onToggleMute: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Update the wall clock every second, and flip a `mounted` flag on the same
  // tick. Everything the clock bar renders depends on time or interactive
  // state, so we only paint the UI post-mount — that way the server HTML and
  // the first client paint match (both empty), and there's no hydration risk
  // from framer-motion, style objects, or the wall-clock string.
  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      setMounted(true);
    };
    const raf = window.requestAnimationFrame(tick);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const wallTime = now ? formatWallTime(now) : "--:--:--";
  const remainingSec = Math.max(0, SESSION_LIMIT_SEC - elapsedSec);
  const session = formatMMSS(elapsedSec);
  const limit = formatMMSS(SESSION_LIMIT_SEC);
  const warning = state === "running" && remainingSec > 0 && remainingSec <= SESSION_WARN_SEC;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[65] h-[46px] border-b border-white/10 bg-[#05070d]/85 backdrop-blur-xl"
      suppressHydrationWarning
    >
      {!mounted ? null : (
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-3 py-1.5 sm:px-6 sm:py-2">
        {/* Left: digital clock */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
              "border-emerald-400/30 bg-[#031a10]"
            )}
          >
            <span className="hidden text-[9px] font-mono uppercase tracking-widest text-emerald-500/80 sm:inline">
              Clock
            </span>
            <span
              className="font-mono text-[15px] font-bold tracking-[0.14em] text-emerald-300 sm:text-[17px]"
              style={{ textShadow: "0 0 12px rgba(52,211,153,0.6)" }}
            >
              {wallTime}
            </span>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
              state === "stopped"
                ? "border-rose-400/40 bg-[#1a0508]"
                : warning
                  ? "border-rose-400/50 bg-[#1a0a08]"
                  : state === "running"
                    ? "border-amber-400/40 bg-[#1a1000]"
                    : "border-white/10 bg-black/40"
            )}
          >
            <span className="hidden text-[9px] font-mono uppercase tracking-widest text-neutral-500 sm:inline">
              Session
            </span>
            <span
              className={cn(
                "font-mono text-[15px] font-bold tracking-[0.14em] sm:text-[17px]",
                state === "stopped"
                  ? "text-rose-300"
                  : warning
                    ? "text-rose-300"
                    : state === "running"
                      ? "text-amber-300"
                      : "text-neutral-400"
              )}
              style={{
                textShadow:
                  state === "stopped" || warning
                    ? "0 0 12px rgba(251,113,133,0.6)"
                    : state === "running"
                      ? "0 0 12px rgba(251,191,36,0.55)"
                      : undefined,
              }}
            >
              {session}
            </span>
            <span className="hidden font-mono text-[10px] text-neutral-500 sm:inline">
              / {limit}
            </span>
            {state === "running" && !warning && (
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-amber-400"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            {warning && state === "running" && (
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-rose-400"
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ filter: "drop-shadow(0 0 4px rgba(251,113,133,0.9))" }}
              />
            )}
            {state === "stopped" && (
              <Lock className="h-3.5 w-3.5 text-rose-300" />
            )}
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onStart}
            disabled={state === "running"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all sm:px-4",
              state === "running"
                ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-neutral-600"
                : "border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:scale-[1.03] hover:bg-emerald-500/25"
            )}
            aria-label="Start session"
          >
            <Play className="h-3.5 w-3.5" fill="currentColor" />
            <span className="hidden sm:inline">Start</span>
          </button>

          <button
            type="button"
            onClick={onStop}
            disabled={state !== "running"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all sm:px-4",
              state !== "running"
                ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-neutral-600"
                : "border-rose-400/40 bg-rose-500/15 text-rose-200 hover:scale-[1.03] hover:bg-rose-500/25"
            )}
            aria-label="Stop session"
          >
            <Square className="h-3 w-3" fill="currentColor" />
            <span className="hidden sm:inline">Stop</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={state === "idle"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              state === "idle"
                ? "cursor-not-allowed border-white/10 bg-white/[0.02] text-neutral-600"
                : "border-white/15 bg-white/[0.04] text-neutral-300 hover:bg-white/10"
            )}
            aria-label="Reset"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/10"
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Whiteboard link — quick access to the shared teaching whiteboard
              from any course page. Icon-only on small viewports, icon+label
              from sm up so it doesn't crowd the session controls. */}
          <Link
            href="/whiteboard"
            className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-[12px] font-medium text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
            aria-label="Open Whiteboard"
            title="Open Whiteboard"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Whiteboard</span>
          </Link>
        </div>
      </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Emoji effect overlays
 * ────────────────────────────────────────────────────────────── */

function ClapOverlay() {
  // Random positions computed once inside a state initializer so React 19's
  // purity rule doesn't complain about Math.random being called during render.
  const [emojis] = useState(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      emoji: Math.random() > 0.35 ? "👏" : "🎉",
      delay: Math.random() * 0.6,
      duration: 1.6 + Math.random() * 0.8,
      scale: 0.9 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 120,
    }))
  );
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Big central banner */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="rounded-2xl border border-emerald-400/40 bg-black/60 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: [-14, 14, -14] }}
              transition={{ duration: 0.35, repeat: 4 }}
              className="text-3xl"
            >
              👏
            </motion.span>
            <span className="text-lg font-bold text-white">
              Let&rsquo;s begin!
            </span>
            <motion.span
              animate={{ rotate: [14, -14, 14] }}
              transition={{ duration: 0.35, repeat: 4 }}
              className="text-3xl"
            >
              👏
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Floating claps */}
      {emojis.map((e) => (
        <motion.span
          key={e.id}
          className="absolute bottom-0 text-3xl select-none"
          style={{ left: `${e.left}%` }}
          initial={{ y: 40, opacity: 0, rotate: 0 }}
          animate={{
            y: -window.innerHeight - 60,
            x: e.drift,
            opacity: [0, 1, 1, 0],
            rotate: [0, 360],
            scale: e.scale,
          }}
          transition={{ duration: e.duration, delay: e.delay, ease: "easeOut" }}
        >
          {e.emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}

function FireworkOverlay() {
  const [bursts] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 15 + (i / 7) * 70 + (Math.random() - 0.5) * 8,
      y: 20 + Math.random() * 30,
      delay: i * 0.18,
      color: ["#fbbf24", "#f472b6", "#7dd3fc", "#4d8dff", "#a78bfa", "#34d399"][i % 6],
      size: 60 + Math.random() * 40,
    }))
  );
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark celebratory wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.2] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3.5 }}
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(251,191,36,0.15), transparent 60%)",
        }}
      />

      {/* Big central banner */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.3 }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="rounded-3xl border border-amber-400/50 bg-black/60 px-8 py-5 backdrop-blur-md shadow-[0_0_60px_rgba(251,191,36,0.35)]">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-4xl">
              <motion.span
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                🎆
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="text-5xl"
              >
                🙏
              </motion.span>
              <motion.span
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                🎇
              </motion.span>
            </div>
            <div className="text-xl font-bold text-white">Well done, class!</div>
            <div className="text-[12px] text-amber-200">
              The lesson is now locked · press <span className="font-mono">Reset</span> to try again
            </div>
          </div>
        </div>
      </motion.div>

      {/* Firework bursts */}
      {bursts.map((b) => (
        <Firework key={b.id} x={b.x} y={b.y} delay={b.delay} color={b.color} size={b.size} />
      ))}
    </motion.div>
  );
}

function Firework({
  x,
  y,
  delay,
  color,
  size,
}: {
  x: number;
  y: number;
  delay: number;
  color: string;
  size: number;
}) {
  const rays = 14;
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}
    >
      {Array.from({ length: rays }).map((_, i) => {
        const angle = (i / rays) * Math.PI * 2;
        const dx = Math.cos(angle) * size;
        const dy = Math.sin(angle) * size;
        return (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: dx, y: dy, opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
          />
        );
      })}
      <motion.div
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
        initial={{ scale: 0.4, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, delay }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Sound synthesis via Web Audio API — no external assets.
 * ────────────────────────────────────────────────────────────── */

// A short cheerful ascending chime + a couple of noise-burst "claps".
function playClapCheer(ctx: AudioContext) {
  // Cheerful chime (C-E-G-C major arpeggio)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.08;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  });

  // Two quick noise bursts (the "claps")
  [0.05, 0.24].forEach((offset) => {
    const t = ctx.currentTime + offset;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.09, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.5);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1500;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t);
  });
}

// A rising whoosh + explosion burst + a triumphant chord.
function playFireworkFanfare(ctx: AudioContext) {
  // Rising whoosh
  const whooshT = ctx.currentTime;
  const whoosh = ctx.createOscillator();
  whoosh.type = "sawtooth";
  whoosh.frequency.setValueAtTime(120, whooshT);
  whoosh.frequency.exponentialRampToValueAtTime(900, whooshT + 0.45);
  const whooshGain = ctx.createGain();
  whooshGain.gain.setValueAtTime(0.0001, whooshT);
  whooshGain.gain.exponentialRampToValueAtTime(0.06, whooshT + 0.1);
  whooshGain.gain.exponentialRampToValueAtTime(0.0001, whooshT + 0.5);
  const whooshFilter = ctx.createBiquadFilter();
  whooshFilter.type = "lowpass";
  whooshFilter.frequency.value = 1200;
  whoosh.connect(whooshFilter).connect(whooshGain).connect(ctx.destination);
  whoosh.start(whooshT);
  whoosh.stop(whooshT + 0.55);

  // Explosion — filtered noise burst
  const boomT = ctx.currentTime + 0.5;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
  }
  const boom = ctx.createBufferSource();
  boom.buffer = buf;
  const boomFilter = ctx.createBiquadFilter();
  boomFilter.type = "bandpass";
  boomFilter.frequency.value = 500;
  boomFilter.Q.value = 0.9;
  const boomGain = ctx.createGain();
  boomGain.gain.setValueAtTime(0.3, boomT);
  boomGain.gain.exponentialRampToValueAtTime(0.001, boomT + 0.4);
  boom.connect(boomFilter).connect(boomGain).connect(ctx.destination);
  boom.start(boomT);

  // Triumphant chord (C major, then held)
  const chord = [523.25, 659.25, 783.99];
  chord.forEach((freq, i) => {
    const t = ctx.currentTime + 0.7 + i * 0.02;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.04);
    gain.gain.setValueAtTime(0.14, t + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.25);
  });
}

/* ─────────────────────────────────────────────────────────────── */

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatWallTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatMMSS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad(m)}:${pad(s)}`;
}
