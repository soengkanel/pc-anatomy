"use client";

// Client-side helpers for LMS submissions:
//   • load/save the student's identity in localStorage so they only
//     enter it once per browser
//   • POST a submission to /api/lms/submissions and return the receipt

import { useEffect, useState } from "react";
import type {
  StudentIdentity,
  SubmissionRequest,
  SubmissionReceipt,
} from "@/lib/lms";

/** React hook — current signed-in student (from the session cookie). */
export function useStudentIdentity(): {
  student: StudentIdentity | null;
  loading: boolean;
  /** Set while a teacher is viewing as this student (read-only). */
  viewAs: { teacher: string } | null;
  save: (s: StudentIdentity) => void;
  clear: () => void;
} {
  const [student, setStudent] = useState<StudentIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAs, setViewAs] = useState<{ teacher: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { student: StudentIdentity | null; viewAs?: { teacher: string } | null }) => {
        if (!alive) return;
        setStudent(j.student ?? null);
        setViewAs(j.viewAs ?? null);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return {
    student,
    loading,
    viewAs,
    save: setStudent,
    clear: () => {
      void fetch("/api/auth/logout", { method: "POST" });
      setStudent(null);
    },
  };
}

/** Register or sign in. Resolves with the student; throws with a friendly message. */
export async function authRequest(
  mode: "register" | "login",
  body: Record<string, string>,
): Promise<StudentIdentity> {
  const res = await fetch(`/api/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = (await res.json().catch(() => ({}))) as {
    error?: string;
    student?: StudentIdentity;
  };
  if (!res.ok || !j.student) throw new Error(j.error || "Something went wrong. Try again.");
  return j.student;
}

/** POST a submission to the LMS API. Returns the receipt or throws. */
export async function submitToLms(
  body: SubmissionRequest,
): Promise<SubmissionReceipt> {
  const res = await fetch("/api/lms/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    submissionId?: string;
    submittedAt?: string;
  };
  if (!res.ok || !json.submissionId || !json.submittedAt) {
    throw new Error(json.error || "Submission failed. Please try again.");
  }
  return {
    submissionId: json.submissionId,
    submittedAt: json.submittedAt,
    status: "submitted",
  };
}
