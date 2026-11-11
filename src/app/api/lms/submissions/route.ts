// LMS submission endpoint — accepts a quiz OR homework submission,
// upserts the student, writes a submission row (+ per-question answers
// for quizzes), and returns a receipt with the submission id.
//
// Design notes:
//   • The client is never trusted to compute quiz scores. We look up the
//     correct answer key from LESSONS on the server, score there, and
//     write is_correct + score + max_score to the database.
//   • Homework submissions are stored as-is (code + notes). Grading is
//     added later by a teacher UI (`teacher_score`, `teacher_notes`, etc.).
//   • The student is taken from the signed session cookie (register /
//     sign in with Student ID + PIN), never from the request body.
//   • If the database is not configured, the route responds with 503.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { LESSONS } from "@/lib/lecture-data";
import type {
  QuizAnswer,
  ChapterMeta,
} from "@/lib/lms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  student?: unknown;
  chapter?: unknown;
  kind?: unknown;
  answers?: unknown;
  codeContent?: unknown;
  codeLanguage?: unknown;
  notes?: unknown;
  startedAt?: unknown;
  timeSpentSeconds?: unknown;
};

const MAX_CODE_BYTES = 200_000;   // ~200 kB — plenty for any Rust homework
const MAX_NOTES_BYTES = 4_000;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Submissions are not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const session = await getSession();
  if (session?.role !== "student") {
    return NextResponse.json({ error: "Please sign in to submit." }, { status: 401 });
  }

  const chapter = validateChapter(body.chapter);
  if (!chapter) {
    return NextResponse.json({ error: "Invalid chapter info." }, { status: 400 });
  }
  const kind = body.kind;
  if (kind !== "quiz" && kind !== "homework") {
    return NextResponse.json({ error: "Invalid submission kind." }, { status: 400 });
  }

  const courseRes = await db.query<{ id: string }>("select id from courses where slug = $1", [
    chapter.courseSlug,
  ]);
  const courseId = courseRes.rows[0]?.id;
  if (!courseId) return NextResponse.json({ error: "Course not found." }, { status: 500 });

  const startedAt = typeof body.startedAt === "string" && !isNaN(Date.parse(body.startedAt))
    ? body.startedAt
    : null;
  const timeSpent =
    typeof body.timeSpentSeconds === "number" && Number.isFinite(body.timeSpentSeconds)
      ? Math.max(0, Math.floor(body.timeSpentSeconds))
      : null;

  const common = [
    session.sid, courseId, chapter.chapterKey, chapter.chapterNumber, chapter.chapterTitle,
    startedAt, timeSpent,
  ];

  if (kind === "quiz") {
    const answers = Array.isArray(body.answers)
      ? (body.answers as unknown[]).filter(isQuizAnswer)
      : [];
    const lesson = LESSONS[chapter.chapterKey];
    if (!lesson) return NextResponse.json({ error: "Unknown chapter." }, { status: 400 });

    // Last answer per question wins; ignore out-of-range indexes.
    const byQ = new Map<number, number>();
    for (const a of answers) {
      if (a.questionIndex < lesson.quiz.length) byQ.set(a.questionIndex, a.selectedOption);
    }
    const maxScore = lesson.quiz.length * 2;
    let score = 0;
    const scored = [...byQ].map(([q, sel]) => {
      const ok = lesson.quiz[q].answer === sel;
      if (ok) score += 2;
      return { q, sel, ok };
    });

    const client = await db.connect();
    try {
      await client.query("begin");
      const ins = await client.query<{ id: string; submitted_at: string }>(
        `insert into submissions
           (student_id, course_id, chapter_key, chapter_number, chapter_title,
            kind, status, started_at, time_spent_seconds, score, max_score)
         values ($1,$2,$3,$4,$5,'quiz','submitted',$6,$7,$8,$9)
         returning id, submitted_at`,
        [...common, score, maxScore],
      );
      const sub = ins.rows[0];
      for (const a of scored) {
        await client.query(
          `insert into submission_answers (submission_id, question_index, selected_option, is_correct)
           values ($1,$2,$3,$4)`,
          [sub.id, a.q, a.sel, a.ok],
        );
      }
      await client.query("commit");
      return NextResponse.json({ submissionId: sub.id, submittedAt: sub.submitted_at });
    } catch (e) {
      await client.query("rollback").catch(() => {});
      console.error("quiz submission failed:", e);
      return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
    } finally {
      client.release();
    }
  }

  const codeContent = typeof body.codeContent === "string" ? body.codeContent : "";
  const codeLanguage =
    typeof body.codeLanguage === "string" && body.codeLanguage.trim() !== ""
      ? body.codeLanguage.trim()
      : "rust";
  const notes = typeof body.notes === "string" ? body.notes : "";
  if (codeContent.trim().length === 0) {
    return NextResponse.json({ error: "Please paste your code before submitting." }, { status: 400 });
  }
  if (Buffer.byteLength(codeContent) > MAX_CODE_BYTES) {
    return NextResponse.json({ error: "Your code is too large (200 kB max)." }, { status: 400 });
  }
  if (Buffer.byteLength(notes) > MAX_NOTES_BYTES) {
    return NextResponse.json({ error: "Notes are too long (4 kB max)." }, { status: 400 });
  }
  try {
    const ins = await db.query<{ id: string; submitted_at: string }>(
      `insert into submissions
         (student_id, course_id, chapter_key, chapter_number, chapter_title,
          kind, status, started_at, time_spent_seconds, code_content, code_language, notes)
       values ($1,$2,$3,$4,$5,'homework','submitted',$6,$7,$8,$9,$10)
       returning id, submitted_at`,
      [...common, codeContent, codeLanguage, notes || null],
    );
    return NextResponse.json({
      submissionId: ins.rows[0].id,
      submittedAt: ins.rows[0].submitted_at,
    });
  } catch (e) {
    console.error("homework insert failed:", e);
    return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────
// Validators
// ─────────────────────────────────────────────────────────────────

function validateChapter(x: unknown): ChapterMeta | null {
  if (!x || typeof x !== "object") return null;
  const c = x as Record<string, unknown>;
  const slug = c.courseSlug;
  if (slug !== "it-intro" && slug !== "rust" && slug !== "ml") return null;
  if (typeof c.chapterKey !== "string" || c.chapterKey.length === 0) return null;
  if (typeof c.chapterNumber !== "string") return null;
  if (typeof c.chapterTitle !== "string") return null;
  return {
    courseSlug: slug,
    chapterKey: c.chapterKey,
    chapterNumber: c.chapterNumber,
    chapterTitle: c.chapterTitle,
  };
}

function isQuizAnswer(x: unknown): x is QuizAnswer {
  if (!x || typeof x !== "object") return false;
  const a = x as Record<string, unknown>;
  return (
    typeof a.questionIndex === "number" &&
    Number.isInteger(a.questionIndex) &&
    a.questionIndex >= 0 &&
    typeof a.selectedOption === "number" &&
    Number.isInteger(a.selectedOption) &&
    a.selectedOption >= 0 &&
    a.selectedOption <= 3
  );
}
