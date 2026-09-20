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

const STORAGE_KEY = "idic:student";

function readStorage(): StudentIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.studentId === "string" &&
      typeof parsed.firstName === "string" &&
      typeof parsed.lastName === "string" &&
      typeof parsed.classSection === "string"
    ) {
      return parsed as StudentIdentity;
    }
  } catch {
    /* ignore malformed data */
  }
  return null;
}

/** React hook — returns the cached student identity + a setter. */
export function useStudentIdentity(): {
  student: StudentIdentity | null;
  save: (s: StudentIdentity) => void;
  clear: () => void;
} {
  const [student, setStudent] = useState<StudentIdentity | null>(null);

  useEffect(() => {
    setStudent(readStorage());
  }, []);

  return {
    student,
    save: (s) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      }
      setStudent(s);
    },
    clear: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setStudent(null);
    },
  };
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
