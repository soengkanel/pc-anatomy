// Generates a printable/fillable coding-homework PDF that a teacher can
// send to students. Visual language matches quiz-pdf.ts (same letterhead,
// student-info block, footer) so all IDIC handouts feel like one series.
//
// Layout:
//  · IDIC letterhead + Printed date
//  · "Chapter N — Title" band with Week + estimated time
//  · Student info block (fillable AcroForm)
//  · Instructions
//  · Scenario box (grey card)
//  · Learning objectives (chip list)
//  · Tasks (numbered, each with a tick box)
//  · Starter code (courier, if present)
//  · Sample output (courier, green tint)
//  · Stretch goals (amber card, optional)
//  · Ruled "Student notes / attempts" lines
//  · Teacher grading box
//  · Per-page footer

import { AcroFormCheckBox, AcroFormTextField, jsPDF } from "jspdf";
import type { WeeklyAssignment } from "@/components/rust/WeeklyAssignment";

/* ─────────────────────────────────────────────────────────────────
 * Page + palette constants — mirror quiz-pdf.ts on purpose.
 * ────────────────────────────────────────────────────────────── */

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 15;
const MARGIN_TOP = 10;
const MARGIN_BOTTOM = 18;

const LETTERHEAD_H = 30;
const FOOTER_H = 12;

const COLOR_INK = "#0a0d14";
const COLOR_MUTED = "#5c6b83";
const COLOR_LINE = "#c9d3e6";
const COLOR_LINE_STRONG = "#8fa1c5";
const COLOR_ACCENT = "#1f4bb8";
const COLOR_ACCENT_SOFT = "#e6ecff";
const COLOR_CODE_BG = "#0f172a";
const COLOR_CODE_TEXT = "#e2e8f0";
const COLOR_OUTPUT_BG = "#ecfdf5";
const COLOR_OUTPUT_TEXT = "#065f46";
const COLOR_STRETCH_BG = "#fef7e0";
const COLOR_STRETCH_INK = "#7a5d00";
const COLOR_STRETCH_LINE = "#e0b040";

type Ctx = {
  doc: jsPDF;
  y: number;
  a: WeeklyAssignment;
  chapterNumber: string;
  chapterTitle: string;
};

const bottomLimit = () => PAGE_H - MARGIN_BOTTOM - FOOTER_H;

/* ─────────────────────────────────────────────────────────────────
 * Main entry
 * ────────────────────────────────────────────────────────────── */

export async function buildHomeworkPdf(
  assignment: WeeklyAssignment,
  meta: { chapterNumber: string; chapterTitle: string },
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const logo = await loadLogoDataUrl().catch(() => null);

  const ctx: Ctx = {
    doc,
    y: 0,
    a: assignment,
    chapterNumber: meta.chapterNumber,
    chapterTitle: meta.chapterTitle,
  };

  drawLetterhead(doc, ctx, logo);
  ctx.y = LETTERHEAD_H + 4;

  ctx.y = drawTitleBand(ctx);
  ctx.y = drawStudentInfo(doc, ctx.y + 3);
  ctx.y = drawInstructions(doc, ctx.y + 4);
  ctx.y = drawScenario(ctx, ctx.y + 4);
  ctx.y = drawObjectives(ctx, ctx.y + 3);
  ctx.y = drawTasks(ctx, ctx.y + 3);

  if (assignment.starter) ctx.y = drawCodeBlock(ctx, ctx.y + 3, "Starter code", assignment.starter, "code");
  if (assignment.sampleOutput)
    ctx.y = drawCodeBlock(ctx, ctx.y + 3, "Expected output", assignment.sampleOutput, "output");
  if (assignment.stretch && assignment.stretch.length > 0)
    ctx.y = drawStretch(ctx, ctx.y + 3);

  ctx.y = drawNotesArea(ctx, ctx.y + 3);
  drawTeacherBox(ctx, ctx.y + 3);

  applyPageChrome(doc, ctx, logo);
  return doc;
}

/* ─────────────────────────────────────────────────────────────────
 * Letterhead
 * ────────────────────────────────────────────────────────────── */

function drawLetterhead(doc: jsPDF, ctx: Ctx, logo: string | null) {
  doc.setFillColor(COLOR_ACCENT);
  doc.rect(0, 0, PAGE_W, 5, "F");

  if (logo) {
    try {
      doc.addImage(logo, "JPEG", MARGIN_X, MARGIN_TOP, 22, 22, undefined, "FAST");
    } catch {
      /* ignore */
    }
  }

  doc.setTextColor(COLOR_INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("INSTITUTE OF DIGITAL INTELLIGENCE CAMBODIA", MARGIN_X + 26, MARGIN_TOP + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("IDIC", MARGIN_X + 26, MARGIN_TOP + 11);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLOR_MUTED);
  doc.setFontSize(9);
  doc.text("Rust Programming", MARGIN_X + 26, MARGIN_TOP + 16);
  doc.text("Coding Homework · Weekly Assignment", MARGIN_X + 26, MARGIN_TOP + 21);

  const printed = formatDate(new Date());
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLOR_INK);
  doc.setFontSize(8);
  doc.text("Printed on", PAGE_W - MARGIN_X, MARGIN_TOP + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(COLOR_ACCENT);
  doc.text(printed, PAGE_W - MARGIN_X, MARGIN_TOP + 12, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLOR_MUTED);
  doc.text(
    `Week ${ctx.a.week} · Chapter ${ctx.chapterNumber}`,
    PAGE_W - MARGIN_X,
    MARGIN_TOP + 17,
    { align: "right" },
  );

  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 5, PAGE_W - MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 5);
  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.15);
  doc.line(MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 4, PAGE_W - MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 4);
}

/* ─────────────────────────────────────────────────────────────────
 * Chapter / week title band
 * ────────────────────────────────────────────────────────────── */

function drawTitleBand(ctx: Ctx): number {
  const { doc, a, chapterNumber, chapterTitle, y } = ctx;
  const h = 18;

  doc.setFillColor(COLOR_ACCENT_SOFT);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, h, "F");
  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, h);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLOR_ACCENT);
  doc.text(`Week ${a.week}  ·  ${a.title}`, MARGIN_X + 4, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  doc.text(`Chapter ${chapterNumber} — ${chapterTitle}`, MARGIN_X + 4, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_MUTED);
  doc.text(`Est. time: ${a.estimatedTime}`, PAGE_W - MARGIN_X - 4, y + 8, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Total: 20 pts", PAGE_W - MARGIN_X - 4, y + 14, { align: "right" });

  return y + h;
}

/* ─────────────────────────────────────────────────────────────────
 * Student info block (fillable) — mirrors quiz-pdf.
 * ────────────────────────────────────────────────────────────── */

function drawStudentInfo(doc: jsPDF, y: number): number {
  doc.setFillColor(COLOR_INK);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 6, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("STUDENT INFORMATION — to be filled by the student", MARGIN_X + 3, y + 4.2);

  const bodyY = y + 6;
  const bodyH = 32;
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, bodyY, PAGE_W - 2 * MARGIN_X, bodyH);

  const col1X = MARGIN_X + 4;
  const col2X = MARGIN_X + (PAGE_W - 2 * MARGIN_X) / 2 + 3;

  const row1Y = bodyY + 8;
  const row2Y = bodyY + 20;
  const row3Y = bodyY + 28;

  drawLabel(doc, "First Name", col1X, row1Y);
  addTextField(doc, "firstName", col1X + 20, row1Y - 4.5, 60, 6);
  drawLabel(doc, "Last Name", col2X, row1Y);
  addTextField(doc, "lastName", col2X + 20, row1Y - 4.5, 60, 6);

  drawLabel(doc, "Class / Section", col1X, row2Y);
  addTextField(doc, "classSection", col1X + 26, row2Y - 4.5, 54, 6);
  drawLabel(doc, "Student ID", col2X, row2Y);
  addTextField(doc, "studentId", col2X + 20, row2Y - 4.5, 60, 6);

  drawLabel(doc, "Submitted on", col1X, row3Y);
  addTextField(doc, "submittedDate", col1X + 24, row3Y - 4, 40, 5.5);

  return bodyY + bodyH;
}

/* ─────────────────────────────────────────────────────────────────
 * Instructions
 * ────────────────────────────────────────────────────────────── */

function drawInstructions(doc: jsPDF, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_INK);
  doc.text("Instructions", MARGIN_X, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_MUTED);
  const lines = [
    "• Read the scenario, then complete every task below in order.",
    "• Write your Rust code in the Rust Playground (play.rust-lang.org) OR your local editor.",
    "• When done, attach your final .rs file (or paste the code) when you submit.",
  ];
  let ly = y + 4.5;
  lines.forEach((l) => {
    doc.text(l, MARGIN_X, ly);
    ly += 4.2;
  });
  return ly;
}

/* ─────────────────────────────────────────────────────────────────
 * Scenario card
 * ────────────────────────────────────────────────────────────── */

function drawScenario(ctx: Ctx, y: number): number {
  const { doc, a } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const bodyPad = 4;

  // Set the target font BEFORE splitTextToSize so widths are measured correctly.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const wrapped = doc.splitTextToSize(
    normalizeText(a.scenario),
    contentW - bodyPad * 2,
  ) as string[];
  const bodyH = wrapped.length * 4.8 + 12;

  y = pageBreakIfNeeded(ctx, y, bodyH);

  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.3);
  doc.setFillColor("#f4f7ff");
  doc.roundedRect(MARGIN_X, y, contentW, bodyH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("SCENARIO", MARGIN_X + bodyPad, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_INK);
  doc.text(wrapped, MARGIN_X + bodyPad, y + 11);

  return y + bodyH;
}

/* ─────────────────────────────────────────────────────────────────
 * Learning objectives chip row
 * ────────────────────────────────────────────────────────────── */

function drawObjectives(ctx: Ctx, y: number): number {
  const { doc, a } = ctx;
  y = pageBreakIfNeeded(ctx, y, 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  doc.text("You'll practice:", MARGIN_X, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const labelIndent = MARGIN_X + 32;
  const rightEdge = PAGE_W - MARGIN_X;
  let x = labelIndent;
  let chipY = y - 3;
  const rowGap = 6;

  a.learningGoals.forEach((g) => {
    const label = stripBackticks(g);
    const w = doc.getTextWidth(label) + 4;
    // Wrap to next row if this chip won't fit on the current line.
    if (x !== labelIndent && x + w > rightEdge) {
      x = MARGIN_X; // subsequent rows start flush with the left content margin
      chipY += rowGap;
    }
    doc.setDrawColor(COLOR_LINE_STRONG);
    doc.setFillColor("#f5f7fb");
    doc.setLineWidth(0.25);
    doc.roundedRect(x, chipY, w, 4.5, 1.2, 1.2, "FD");
    doc.setTextColor(COLOR_ACCENT);
    doc.text(label, x + 2, chipY + 3.2);
    x += w + 2;
  });

  return chipY + 6;
}

/* ─────────────────────────────────────────────────────────────────
 * Tasks with tick boxes
 * ────────────────────────────────────────────────────────────── */

function drawTasks(ctx: Ctx, y: number): number {
  const { doc, a } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const textIndent = 7; // just enough room for the number "1."

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_INK);
  y = pageBreakIfNeeded(ctx, y, 8);
  doc.text("Tasks", MARGIN_X, y);
  y += 4;

  a.tasks.forEach((task, i) => {
    // Measure with the exact font we'll render with so widths are correct.
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const clean = normalizeText(stripBackticks(task));
    const wrapped = doc.splitTextToSize(clean, contentW - textIndent - 3) as string[];
    const h = wrapped.length * 4.8 + 3;
    y = pageBreakIfNeeded(ctx, y, h);

    // Number
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(COLOR_ACCENT);
    doc.text(`${i + 1}.`, MARGIN_X, y);

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(COLOR_INK);
    doc.text(wrapped, MARGIN_X + textIndent, y);

    y += h;
  });

  return y;
}

/* ─────────────────────────────────────────────────────────────────
 * Code / output blocks — courier font on a tinted panel
 * ────────────────────────────────────────────────────────────── */

function drawCodeBlock(
  ctx: Ctx,
  y: number,
  label: string,
  code: string,
  variant: "code" | "output",
): number {
  const { doc } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const pad = 3;
  const lineH = 3.6;

  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  const maxCharsPerLine = Math.floor((contentW - pad * 2) / 1.85);
  const raw = code.replace(/\t/g, "  ").split("\n");
  const wrapped: string[] = [];
  raw.forEach((l) => {
    if (l.length <= maxCharsPerLine) {
      wrapped.push(l);
      return;
    }
    // For plain-text output, break at word boundaries so phrases stay intact.
    // For code, fall back to character-count wrapping so tokens survive.
    if (variant === "output") {
      const words = l.split(/(\s+)/);
      let current = "";
      words.forEach((tok) => {
        if ((current + tok).length <= maxCharsPerLine) {
          current += tok;
        } else {
          if (current) wrapped.push(current);
          if (tok.length > maxCharsPerLine) {
            for (let i = 0; i < tok.length; i += maxCharsPerLine)
              wrapped.push(tok.slice(i, i + maxCharsPerLine));
            current = "";
          } else {
            current = tok.trimStart();
          }
        }
      });
      if (current) wrapped.push(current);
    } else {
      for (let i = 0; i < l.length; i += maxCharsPerLine) {
        wrapped.push(l.slice(i, i + maxCharsPerLine));
      }
    }
  });

  const bodyH = wrapped.length * lineH + 10;
  y = pageBreakIfNeeded(ctx, y, bodyH);

  // Label above
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(variant === "code" ? COLOR_ACCENT : COLOR_OUTPUT_TEXT);
  doc.text(label, MARGIN_X, y);

  const boxY = y + 2;
  const bg = variant === "code" ? COLOR_CODE_BG : COLOR_OUTPUT_BG;
  const fg = variant === "code" ? COLOR_CODE_TEXT : COLOR_OUTPUT_TEXT;

  doc.setFillColor(bg);
  doc.setDrawColor(variant === "code" ? COLOR_CODE_BG : COLOR_OUTPUT_TEXT);
  doc.setLineWidth(0.25);
  doc.roundedRect(MARGIN_X, boxY, contentW, wrapped.length * lineH + 6, 1.2, 1.2, "FD");

  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(fg);

  let ly = boxY + 5;
  wrapped.forEach((line) => {
    doc.text(line, MARGIN_X + pad, ly);
    ly += lineH;
  });

  return boxY + wrapped.length * lineH + 6;
}

/* ─────────────────────────────────────────────────────────────────
 * Stretch goals — amber card
 * ────────────────────────────────────────────────────────────── */

function drawStretch(ctx: Ctx, y: number): number {
  const { doc, a } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const items = a.stretch ?? [];

  // Measure lines up-front so the box height matches the wrapped content.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const wrappedItems = items.map(
    (s) => doc.splitTextToSize(`•  ${normalizeText(stripBackticks(s))}`, contentW - 10) as string[],
  );
  const totalLines = wrappedItems.reduce((n, w) => n + w.length, 0);
  const bodyH = 10 + totalLines * 4.6 + 4;

  y = pageBreakIfNeeded(ctx, y, bodyH);

  doc.setFillColor(COLOR_STRETCH_BG);
  doc.setDrawColor(COLOR_STRETCH_LINE);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_X, y, contentW, bodyH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_STRETCH_INK);
  doc.text("STRETCH GOALS (optional bonus)", MARGIN_X + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  let ly = y + 12;
  wrappedItems.forEach((wrapped) => {
    doc.text(wrapped, MARGIN_X + 4, ly);
    ly += wrapped.length * 4.6;
  });

  return y + bodyH;
}

/* ─────────────────────────────────────────────────────────────────
 * Ruled notes area — hand-written scratch space
 * ────────────────────────────────────────────────────────────── */

function drawNotesArea(ctx: Ctx, y: number): number {
  const { doc } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const bodyH = 34;

  y = pageBreakIfNeeded(ctx, y, bodyH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  doc.text("Student notes / attempts", MARGIN_X, y);

  const boxY = y + 2;
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.25);
  doc.rect(MARGIN_X, boxY, contentW, bodyH);

  doc.setDrawColor(COLOR_LINE);
  doc.setLineWidth(0.15);
  const lineGap = 5.5;
  for (let ly = boxY + lineGap; ly < boxY + bodyH; ly += lineGap) {
    doc.line(MARGIN_X + 2, ly, MARGIN_X + contentW - 2, ly);
  }

  return boxY + bodyH;
}

/* ─────────────────────────────────────────────────────────────────
 * Teacher grading box
 * ────────────────────────────────────────────────────────────── */

function drawTeacherBox(ctx: Ctx, y: number) {
  const { doc } = ctx;
  const contentW = PAGE_W - 2 * MARGIN_X;
  const h = 22;

  y = pageBreakIfNeeded(ctx, y, h);

  doc.setFillColor("#f5f7fb");
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN_X, y, contentW, h, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("TEACHER USE ONLY", MARGIN_X + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  doc.text("Compiles cleanly:", MARGIN_X + 4, y + 12);
  addCheckbox(doc, "grade_compiles", MARGIN_X + 34, y + 9, 4);
  doc.text("Meets all tasks:", MARGIN_X + 44, y + 12);
  addCheckbox(doc, "grade_meets", MARGIN_X + 72, y + 9, 4);
  doc.text("Style:", MARGIN_X + 82, y + 12);
  addTextField(doc, "grade_style", MARGIN_X + 92, y + 8.5, 16, 5);

  doc.text("Score:  ______ / 20", MARGIN_X + 4, y + 18);
  doc.text("Grade:  ______", MARGIN_X + 60, y + 18);
  doc.text("Signature:  ______________________", MARGIN_X + 105, y + 18);
}

/* ─────────────────────────────────────────────────────────────────
 * Per-page footer
 * ────────────────────────────────────────────────────────────── */

function applyPageChrome(doc: jsPDF, ctx: Ctx, logo: string | null) {
  const pageCount = doc.getNumberOfPages();
  const printed = formatDate(new Date());

  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);

    doc.setDrawColor(COLOR_ACCENT);
    doc.setLineWidth(0.4);
    doc.line(MARGIN_X, PAGE_H - MARGIN_BOTTOM, PAGE_W - MARGIN_X, PAGE_H - MARGIN_BOTTOM);

    if (logo) {
      try {
        doc.addImage(logo, "JPEG", MARGIN_X, PAGE_H - MARGIN_BOTTOM + 2, 8, 8, undefined, "FAST");
      } catch {
        /* ignore */
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_ACCENT);
    doc.text("IDIC", MARGIN_X + 10, PAGE_H - MARGIN_BOTTOM + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(COLOR_MUTED);
    doc.text("Institute of Digital Intelligence Cambodia", MARGIN_X + 10, PAGE_H - MARGIN_BOTTOM + 9);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      `Week ${ctx.a.week} · ${ctx.a.title} · Coding Homework`,
      PAGE_W / 2,
      PAGE_H - MARGIN_BOTTOM + 6,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_INK);
    doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN_X, PAGE_H - MARGIN_BOTTOM + 5, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(COLOR_MUTED);
    doc.text(`Printed: ${printed}`, PAGE_W - MARGIN_X, PAGE_H - MARGIN_BOTTOM + 9, {
      align: "right",
    });
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Small helpers
 * ────────────────────────────────────────────────────────────── */

function pageBreakIfNeeded(ctx: Ctx, y: number, needed: number): number {
  if (y + needed > bottomLimit()) {
    ctx.doc.addPage();
    return LETTERHEAD_H + MARGIN_TOP + 4;
  }
  return y;
}

/** Remove Markdown-ish inline-code backticks so they don't appear as literal text. */
function stripBackticks(s: string): string {
  return s.replace(/`/g, "");
}

/** Decode the handful of HTML entities that leaked in from JSX authoring
 *  and normalize whitespace so wrapping behaves predictably. */
function normalizeText(s: string): string {
  return s
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function drawLabel(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_INK);
  doc.text(text + ":", x, y);
}

async function loadLogoDataUrl(): Promise<string> {
  const res = await fetch("/idic-logo.jpg");
  if (!res.ok) throw new Error("logo not found");
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDate(d: Date): string {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
  return `${pad(d.getDate())} ${month} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─────────────────────────────────────────────────────────────────
 * jsPDF v4 AcroForm helpers (duplicated from quiz-pdf.ts on purpose)
 * ────────────────────────────────────────────────────────────── */

function addTextField(doc: jsPDF, name: string, x: number, y: number, w: number, h: number) {
  const f = new AcroFormTextField();
  f.fieldName = name;
  f.x = x;
  f.y = y;
  f.width = w;
  f.height = h;
  f.fontSize = 10;
  doc.addField(f);

  doc.setDrawColor(COLOR_LINE);
  doc.setLineWidth(0.2);
  doc.line(x, y + h, x + w, y + h);
}

function addCheckbox(doc: jsPDF, name: string, x: number, y: number, size: number) {
  const f = new AcroFormCheckBox();
  f.fieldName = name;
  f.x = x;
  f.y = y;
  f.width = size;
  f.height = size;
  doc.addField(f);

  doc.setDrawColor(COLOR_INK);
  doc.setLineWidth(0.35);
  doc.rect(x, y, size, size);
}
