"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";

/**
 * Floating notice shown on every page while a teacher is viewing the site as a
 * student. It only does any work when the (non-secret) hint cookie is present,
 * so ordinary visitors pay nothing.
 */
export function ViewAsBanner() {
  const [info, setInfo] = useState<{ name: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!document.cookie.split("; ").includes("idic_viewas_on=1")) return;
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (alive && j.viewAs && j.student) setInfo({ name: `${j.student.firstName} ${j.student.lastName}` });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!info) return null;

  const exit = async () => {
    setBusy(true);
    const r = await fetch("/api/view-as/exit", { method: "POST" });
    const j = await r.json().catch(() => ({ redirect: "/" }));
    window.location.assign(j.redirect ?? "/");
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-amber-400/50 bg-[#1a1405]/95 px-4 py-2 text-[12.5px] text-amber-100 shadow-xl backdrop-blur">
      <Eye className="h-4 w-4 shrink-0 text-amber-300" />
      <span className="truncate">
        Viewing as <b>{info.name}</b> · read-only
      </span>
      <button
        onClick={exit}
        disabled={busy}
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 font-semibold text-amber-50 hover:bg-amber-400/30 disabled:opacity-60"
      >
        {busy && <Loader2 className="h-3 w-3 animate-spin" />}
        Exit view
      </button>
    </div>
  );
}
