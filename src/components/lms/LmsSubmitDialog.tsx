"use client";

// A reusable modal that walks a student through:
//   1) Confirming (or entering) their name / ID / class
//   2) Submitting their quiz answers or homework code to /api/lms/submissions
//   3) Seeing a confirmation receipt
//
// The parent component owns the "when to open" logic — this dialog only
// handles the submission flow.

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import { StudentIdentityForm } from "@/components/lms/StudentIdentityForm";
import { submitToLms, useStudentIdentity } from "@/lib/lms-client";
import type {
  ChapterMeta,
  StudentIdentity,
  SubmissionRequest,
} from "@/lib/lms";

type Payload =
  | {
      kind: "quiz";
      answers: { questionIndex: number; selectedOption: number }[];
      startedAt: string;
      timeSpentSeconds?: number;
    }
  | {
      kind: "homework";
      codeContent: string;
      codeLanguage?: string;
      notes?: string;
      startedAt?: string;
      timeSpentSeconds?: number;
    };

export function LmsSubmitDialog({
  open,
  onClose,
  onSubmitted,
  chapter,
  payload,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted?: (submissionId: string) => void;
  chapter: ChapterMeta;
  payload: Payload;
  title: string;
  description?: string;
}) {
  const { student, save } = useStudentIdentity();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [receipt, setReceipt] = useState<{ id: string; at: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset internal state each time the dialog is opened.
  useEffect(() => {
    if (open) {
      setEditing(false);
      setStatus("idle");
      setReceipt(null);
      setError(null);
    }
  }, [open]);

  const canSubmit = useMemo(() => !!student && status === "idle", [student, status]);

  const doSubmit = async (identity: StudentIdentity) => {
    setStatus("sending");
    setError(null);
    try {
      const base = { student: identity, chapter };
      const body: SubmissionRequest =
        payload.kind === "quiz"
          ? {
              ...base,
              kind: "quiz",
              answers: payload.answers,
              startedAt: payload.startedAt,
              timeSpentSeconds: payload.timeSpentSeconds,
            }
          : {
              ...base,
              kind: "homework",
              codeContent: payload.codeContent,
              codeLanguage: payload.codeLanguage,
              notes: payload.notes,
              startedAt: payload.startedAt,
              timeSpentSeconds: payload.timeSpentSeconds,
            };
      const r = await submitToLms(body);
      setReceipt({ id: r.submissionId, at: r.submittedAt });
      setStatus("done");
      onSubmitted?.(r.submissionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-violet-400/25 bg-neutral-950 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-white/10 bg-gradient-to-br from-violet-500/[0.08] to-transparent p-4 sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/40 bg-violet-400/15 text-xl">
              🎓
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[15px] font-semibold text-white">{title}</h4>
              {description && (
                <p className="mt-0.5 text-[12px] text-neutral-400">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
            {/* State: done — show receipt */}
            {status === "done" && receipt && (
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15">
                  <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                </div>
                <div className="text-lg font-semibold text-white">Submitted!</div>
                <p className="text-[13px] text-neutral-400">
                  Your teacher has received your work. Results will be released once graded.
                </p>
                <div className="mx-auto max-w-sm rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left font-mono text-[11.5px] text-neutral-300">
                  <div>
                    <span className="text-neutral-500">Receipt:</span> {receipt.id}
                  </div>
                  <div>
                    <span className="text-neutral-500">At:</span>{" "}
                    {new Date(receipt.at).toLocaleString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[12.5px] font-medium text-neutral-200 hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            )}

            {/* State: identity capture (first visit OR editing) */}
            {status !== "done" && (!student || editing) && (
              <StudentIdentityForm
                initial={student}
                submitLabel={student ? "Save changes" : "Save & continue"}
                onSaved={(s) => {
                  save(s);
                  setEditing(false);
                }}
              />
            )}

            {/* State: idle/sending/error — confirm-and-submit */}
            {status !== "done" && student && !editing && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                    Submitting as
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-white">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-[12px] text-neutral-400">
                    ID {student.studentId} · {student.classSection}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="mt-2 text-[11.5px] text-violet-300 underline-offset-2 hover:underline"
                  >
                    Not you? Change details
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[12.5px] text-neutral-300">
                  <div className="mb-1 font-semibold text-white">Chapter</div>
                  {chapter.chapterNumber} — {chapter.chapterTitle}
                </div>

                {error && (
                  <div className="rounded-md border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[12.5px] text-rose-200">
                    {error}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] text-neutral-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
                    Answers are locked once you submit.
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-neutral-200 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => doSubmit(student)}
                      disabled={!canSubmit}
                      className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-1.5 text-[12.5px] font-semibold text-violet-100 hover:bg-violet-500/35 disabled:opacity-60"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
