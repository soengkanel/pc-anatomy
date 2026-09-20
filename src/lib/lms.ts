// Shared types used by both the /api/lms/* routes and the client-side
// components. Nothing here imports Supabase — the API routes bring their
// own server-only client.

export type StudentIdentity = {
  studentId: string;
  firstName: string;
  lastName: string;
  classSection: string;
};

export type QuizAnswer = {
  questionIndex: number;
  selectedOption: number;
};

export type ChapterMeta = {
  courseSlug: "it-intro" | "rust" | "ml";
  chapterKey: string;      // e.g. "welcome-introduction", "rust-values", "ml-regression"
  chapterNumber: string;   // "1".."9"
  chapterTitle: string;    // human-readable
};

export type QuizSubmissionRequest = {
  student: StudentIdentity;
  chapter: ChapterMeta;
  kind: "quiz";
  answers: QuizAnswer[];
  startedAt: string;       // ISO
  timeSpentSeconds?: number;
};

export type HomeworkSubmissionRequest = {
  student: StudentIdentity;
  chapter: ChapterMeta;
  kind: "homework";
  codeContent: string;
  codeLanguage?: string;   // default 'rust'
  notes?: string;
  startedAt?: string;
  timeSpentSeconds?: number;
};

export type SubmissionRequest = QuizSubmissionRequest | HomeworkSubmissionRequest;

export type SubmissionReceipt = {
  submissionId: string;
  submittedAt: string;
  status: "submitted";
};

/** Validates a StudentIdentity — throws with a specific message on failure. */
export function validateStudent(s: unknown): asserts s is StudentIdentity {
  if (!s || typeof s !== "object") throw new Error("Missing student info.");
  const rec = s as Record<string, unknown>;
  const fields: (keyof StudentIdentity)[] = ["studentId", "firstName", "lastName", "classSection"];
  for (const f of fields) {
    if (typeof rec[f] !== "string" || (rec[f] as string).trim().length === 0) {
      throw new Error(`Missing or invalid: ${f}`);
    }
    if ((rec[f] as string).length > 120) {
      throw new Error(`Value too long: ${f}`);
    }
  }
}
