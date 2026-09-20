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
//   • Student identity is upserted on the human-readable `student_id`
//     field, so a student switching browsers keeps their history.
//   • If Supabase is not configured, the route responds with 503 rather
//     than crashing — same graceful pattern as the waitlist route.

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { LESSONS } from "@/lib/lecture-data";
import { validateStudent } from "@/lib/lms";
import type {
  StudentIdentity,
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
  // ── 1) Parse body ───────────────────────────────────────────────
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ── 2) Validate student identity ────────────────────────────────
  let student: StudentIdentity;
  try {
    validateStudent(body.student);
    student = body.student as StudentIdentity;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid student info." },
      { status: 400 },
    );
  }

  // ── 3) Validate chapter meta ────────────────────────────────────
  const chapter = validateChapter(body.chapter);
  if (!chapter) {
    return NextResponse.json({ error: "Invalid chapter info." }, { status: 400 });
  }

  const kind = body.kind;
  if (kind !== "quiz" && kind !== "homework") {
    return NextResponse.json({ error: "Invalid submission kind." }, { status: 400 });
  }

  // ── 4) Check config ─────────────────────────────────────────────
  if (!supabase) {
    return NextResponse.json(
      { error: "Submissions are not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  // ── 5) Course lookup ────────────────────────────────────────────
  const { data: courseRow, error: courseErr } = await supabase
    .from("courses")
    .select("id, slug")
    .eq("slug", chapter.courseSlug)
    .maybeSingle();

  if (courseErr || !courseRow) {
    console.error("course lookup failed:", courseErr?.message);
    return NextResponse.json({ error: "Course not found." }, { status: 500 });
  }

  // ── 6) Upsert student ───────────────────────────────────────────
  const { data: studentRow, error: studentErr } = await supabase
    .from("students")
    .upsert(
      {
        student_id: student.studentId.trim(),
        first_name: student.firstName.trim(),
        last_name: student.lastName.trim(),
        class_section: student.classSection.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id" },
    )
    .select("id")
    .single();

  if (studentErr || !studentRow) {
    console.error("student upsert failed:", studentErr?.message);
    return NextResponse.json({ error: "Could not save student info." }, { status: 500 });
  }

  const startedAt = typeof body.startedAt === "string" ? body.startedAt : null;
  const timeSpent =
    typeof body.timeSpentSeconds === "number" && Number.isFinite(body.timeSpentSeconds)
      ? Math.max(0, Math.floor(body.timeSpentSeconds))
      : null;

  // ── 7a) Quiz path ───────────────────────────────────────────────
  if (kind === "quiz") {
    const answers = Array.isArray(body.answers)
      ? (body.answers as unknown[]).filter(isQuizAnswer)
      : [];

    // Look up the answer key from the server-side LESSONS map.
    const lesson = LESSONS[chapter.chapterKey];
    if (!lesson) {
      return NextResponse.json(
        { error: "Unknown chapter." },
        { status: 400 },
      );
    }

    const maxScore = lesson.quiz.length * 2;
    let score = 0;
    const scored = answers.map((a) => {
      const correct = lesson.quiz[a.questionIndex]?.answer === a.selectedOption;
      if (correct) score += 2;
      return { ...a, isCorrect: correct };
    });

    const { data: submissionRow, error: submitErr } = await supabase
      .from("submissions")
      .insert({
        student_id: studentRow.id,
        course_id: courseRow.id,
        chapter_key: chapter.chapterKey,
        chapter_number: chapter.chapterNumber,
        chapter_title: chapter.chapterTitle,
        kind: "quiz",
        status: "submitted",
        started_at: startedAt,
        time_spent_seconds: timeSpent,
        score,
        max_score: maxScore,
      })
      .select("id, submitted_at")
      .single();

    if (submitErr || !submissionRow) {
      console.error("submission insert failed:", submitErr?.message);
      return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
    }

    if (scored.length > 0) {
      const rows = scored.map((a) => ({
        submission_id: submissionRow.id,
        question_index: a.questionIndex,
        selected_option: a.selectedOption,
        is_correct: a.isCorrect,
      }));
      const { error: ansErr } = await supabase.from("submission_answers").insert(rows);
      if (ansErr) {
        console.error("answers insert failed:", ansErr.message);
        // Submission is already in the DB; report a partial failure.
        return NextResponse.json(
          { error: "Submission saved but answers failed to record. Contact the teacher." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        submissionId: submissionRow.id,
        submittedAt: submissionRow.submitted_at,
      },
      { status: 200 },
    );
  }

  // ── 7b) Homework path ───────────────────────────────────────────
  const codeContent = typeof body.codeContent === "string" ? body.codeContent : "";
  const codeLanguage =
    typeof body.codeLanguage === "string" && body.codeLanguage.trim() !== ""
      ? body.codeLanguage.trim()
      : "rust";
  const notes = typeof body.notes === "string" ? body.notes : "";

  if (codeContent.trim().length === 0) {
    return NextResponse.json(
      { error: "Please paste your code before submitting." },
      { status: 400 },
    );
  }
  if (new Blob([codeContent]).size > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: "Your code is too large (200 kB max)." },
      { status: 400 },
    );
  }
  if (new Blob([notes]).size > MAX_NOTES_BYTES) {
    return NextResponse.json(
      { error: "Notes are too long (4 kB max)." },
      { status: 400 },
    );
  }

  const { data: submissionRow, error: hwErr } = await supabase
    .from("submissions")
    .insert({
      student_id: studentRow.id,
      course_id: courseRow.id,
      chapter_key: chapter.chapterKey,
      chapter_number: chapter.chapterNumber,
      chapter_title: chapter.chapterTitle,
      kind: "homework",
      status: "submitted",
      started_at: startedAt,
      time_spent_seconds: timeSpent,
      code_content: codeContent,
      code_language: codeLanguage,
      notes: notes || null,
    })
    .select("id, submitted_at")
    .single();

  if (hwErr || !submissionRow) {
    console.error("homework insert failed:", hwErr?.message);
    return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
  }

  return NextResponse.json(
    {
      submissionId: submissionRow.id,
      submittedAt: submissionRow.submitted_at,
    },
    { status: 200 },
  );
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
