"use client";

// A virtual laser pointer for teaching. When enabled, a red dot follows the
// cursor with a soft fading trail so the class can see where the professor is
// looking. Toggle via the floating button or by pressing "L". Press "Esc" to
// disable. The overlay is pointer-events:none, so it never blocks normal
// interaction beneath it.

import { useCallback, useEffect, useRef, useState } from "react";
import { Pointer } from "lucide-react";
import { cn } from "@/lib/utils";

// Max number of trail points kept alive at once. Higher = longer tail.
const TRAIL_LENGTH = 16;

export function LaserPointer() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const toggle = useCallback(() => setActive((v) => !v), []);

  // Keyboard shortcuts: "L" toggles, "Escape" disables. Skip when the user is
  // typing in an input/textarea/contenteditable so it doesn't hijack normal typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);
      if (typing) return;
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        setActive((v) => !v);
      } else if (e.key === "Escape") {
        setActive(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Track cursor + draw a fading trail on the canvas. Everything here runs in
  // refs to avoid re-rendering on every mouse move.
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read the CSS `zoom` we apply to <html> for the font-size feature.
    // Chrome positions the fixed overlay in the *zoomed* coordinate space
    // (a fixed inset-0 fills `innerWidth / zoom` logical units), but the
    // browser reports mouse `clientX/Y` in unzoomed viewport pixels.
    // Divide the mouse coords by zoom so the dot lands under the cursor.
    const readZoom = () => {
      const v = parseFloat(getComputedStyle(document.documentElement).zoom);
      return Number.isFinite(v) && v > 0 ? v : 1;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const zoom = readZoom();
      // Overlay's own CSS extent in the zoomed context.
      const w = window.innerWidth / zoom;
      const h = window.innerHeight / zoom;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      const zoom = readZoom();
      const x = e.clientX / zoom;
      const y = e.clientY / zoom;
      trailRef.current.push({ x, y, t: performance.now() });
      if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift();
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = "1";
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const points = trailRef.current;
      const now = performance.now();
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const age = (now - b.t) / 400;
        const alpha = Math.max(0, 1 - age) * (i / points.length);
        if (alpha <= 0) continue;
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 3 * (i / points.length);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      rafRef.current = window.requestAnimationFrame(draw);
    };

    // Also react to zoom changes on <html> (from the sidebar font-size
    // dropdown) so the canvas backing store stays in sync.
    const zoomObserver = new MutationObserver(resize);
    zoomObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      zoomObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      trailRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };
  }, [active]);

  return (
    <>
      {/* Floating toggle button — bottom-right corner. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={active ? "Turn off laser pointer" : "Turn on laser pointer"}
        aria-pressed={active}
        title={active ? "Laser: on  (L to toggle, Esc to hide)" : "Laser pointer  (L to toggle)"}
        className={cn(
          "fixed bottom-5 right-5 z-[100] flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-colors",
          active
            ? "border-red-400/60 bg-red-500/20 text-red-300 shadow-red-500/30"
            : "border-white/10 bg-black/50 text-neutral-300 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
        )}
      >
        <Pointer className="h-5 w-5" strokeWidth={2.2} />
        {active && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-red-400/60"
          />
        )}
      </button>

      {/* Overlay layer — pointer-events none so it never blocks clicks. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[99]",
          !active && "hidden"
        )}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div
          ref={dotRef}
          className="absolute left-0 top-0 h-4 w-4 rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.95) 30%, rgba(239,68,68,0.55) 60%, rgba(239,68,68,0) 80%)",
            boxShadow: "0 0 18px 6px rgba(239,68,68,0.55), 0 0 40px 12px rgba(239,68,68,0.25)",
            transition: "opacity 120ms ease-out",
          }}
        />
      </div>
    </>
  );
}
