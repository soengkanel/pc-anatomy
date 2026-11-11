"use client";

// Chapter locking for a course page. Chapters start locked; the owning teacher
// opens one (for the whole class) by entering the unlock key. Students see a
// lock card and the page polls so a chapter opens live while they watch.
//
// NOTE: this gates the page UI and, on the server, quiz/homework submissions.
// It is classroom pacing, not content security: the lesson text ships in the
// page's JavaScript.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Loader2, Lock, LockOpen, X } from "lucide-react";

export type ChapterLockProps = { course: string; unlocked: string[]; isOwner: boolean };

type Ctx = {
  enabled: boolean;
  isOwner: boolean;
  isOpen: (key: string) => boolean;
  /** Owner only: open the key dialog for this chapter. */
  request: (key: string, title: string) => void;
};

const NONE: Ctx = { enabled: false, isOwner: false, isOpen: () => true, request: () => {} };
const LockCtx = createContext<Ctx>(NONE);
export const useChapterLocks = () => useContext(LockCtx);

export function ChapterLocksProvider({ locks, children }: { locks?: ChapterLockProps; children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<string>>(() => new Set(locks?.unlocked ?? []));
  const [target, setTarget] = useState<{ key: string; title: string } | null>(null);
  const enabled = !!locks;
  const isOwner = !!locks?.isOwner;
  const course = locks?.course;

  // Students: pick up chapters the teacher opens without a reload.
  useEffect(() => {
    if (!course || isOwner) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      fetch(`/api/courses/${course}/locks`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { unlocked: string[] } | null) => j && setUnlocked(new Set(j.unlocked)))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, [course, isOwner]);

  const request = useCallback((key: string, title: string) => setTarget({ key, title }), []);
  const value = useMemo<Ctx>(
    () => (enabled ? { enabled, isOwner, isOpen: (k) => unlocked.has(k), request } : NONE),
    [enabled, isOwner, unlocked, request],
  );

  return (
    <LockCtx.Provider value={value}>
      {children}
      {target && course && (
        <KeyDialog
          course={course}
          chapterKey={target.key}
          title={target.title}
          currentlyOpen={unlocked.has(target.key)}
          onClose={() => setTarget(null)}
          onDone={(open) => {
            setUnlocked((s) => {
              const n = new Set(s);
              if (open) n.add(target.key);
              else n.delete(target.key);
              return n;
            });
            setTarget(null);
          }}
        />
      )}
    </LockCtx.Provider>
  );
}

function KeyDialog({
  course,
  chapterKey,
  title,
  currentlyOpen,
  onClose,
  onDone,
}: {
  course: string;
  chapterKey: string;
  title: string;
  currentlyOpen: boolean;
  onClose: () => void;
  onDone: (open: boolean) => void;
}) {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const opening = !currentlyOpen;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const r = await fetch(`/api/teacher/courses/${course}/chapters/${chapterKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, unlocked: opening }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(j.error ?? "Something went wrong.");
    onDone(opening);
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d111a] p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-[15px] font-semibold text-white">
              {opening ? <LockOpen className="h-4 w-4 text-emerald-300" /> : <Lock className="h-4 w-4 text-amber-300" />}
              {opening ? "Open chapter" : "Lock chapter"}
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-400">{title}</p>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block text-[12px] font-medium text-neutral-300">
          Teacher key
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-center font-mono text-lg tracking-[0.3em] text-white outline-none focus:border-violet-400/60"
          />
        </label>
        <p className="mt-2 text-[11.5px] text-neutral-500">
          {opening ? "This opens the chapter for every student in the class." : "Students will no longer be able to open this chapter."}
        </p>
        {error && <p className="mt-2 text-[12.5px] text-rose-300">{error}</p>}
        <button
          disabled={busy || key === ""}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[13px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {opening ? "Open for students" : "Lock again"}
        </button>
      </form>
    </div>
  );
}

/** Lock / open icon for a chapter row. The owner can click it to change the lock. */
export function ChapterLockIcon({ chapterKey, title }: { chapterKey: string; title: string }) {
  const { enabled, isOwner, isOpen, request } = useChapterLocks();
  if (!enabled) return null;
  const open = isOpen(chapterKey);
  const Icon = open ? LockOpen : Lock;
  const cls = open ? "text-emerald-400/80" : "text-amber-300";
  if (!isOwner) {
    return (
      <span title={open ? "Open" : "Locked — your teacher will open this chapter"} className={cls}>
        <Icon className="h-3.5 w-3.5" aria-label={open ? "Open" : "Locked"} />
      </span>
    );
  }
  return (
    <span
      role="button"
      tabIndex={0}
      title={open ? "Open for students — click to lock" : "Locked for students — click to open"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        request(chapterKey, title);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          request(chapterKey, title);
        }
      }}
      className={`cursor-pointer rounded p-0.5 hover:bg-white/10 ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * Wraps a chapter's content. Students get a lock card while it's locked; the
 * owning teacher always sees the content, with a bar to open or lock it.
 */
export function ChapterGate({
  chapterKey,
  anchorId,
  number,
  title,
  children,
}: {
  chapterKey: string;
  anchorId: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  const { enabled, isOwner, isOpen, request } = useChapterLocks();
  if (!enabled) return <>{children}</>;
  const open = isOpen(chapterKey);

  if (!open && !isOwner) {
    return (
      <section id={anchorId} className="scroll-mt-24 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-amber-400/30 bg-amber-400/10">
            <Lock className="h-6 w-6 text-amber-300" />
          </div>
          <div className="mt-4 font-mono text-[11px] tracking-widest text-neutral-500">CHAPTER {number}</div>
          <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-neutral-400">
            This chapter is locked. Your teacher will open it during class — it will appear here on its own.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {isOwner && (
        <div
          className={`mx-auto mb-2 mt-8 flex max-w-4xl items-center justify-between gap-3 rounded-full border px-4 py-2 text-[12.5px] ${
            open
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-amber-400/30 bg-amber-400/10 text-amber-200"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {open ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {open ? "Chapter " + number + " is open for students" : "Chapter " + number + " is locked for students (you can still preview it)"}
          </span>
          <button
            onClick={() => request(chapterKey, title)}
            className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white hover:bg-white/20"
          >
            {open ? "Lock again" : "Open for students"}
          </button>
        </div>
      )}
      {children}
    </>
  );
}
