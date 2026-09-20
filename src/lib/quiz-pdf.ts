// Turns a Lesson's quiz into a printable / fillable PDF exam paper using jsPDF.
// The generated PDF has:
//  · A letterhead with the IDIC circular logo, institution name, and the
//    auto-generated print date.
//  · A student info block the student fills in themselves (First Name,
//    Last Name, Class, Student ID, Date of Birth as three tick fields, and
//    Gender as three interactive checkboxes).
//  · 20 questions with A/B/C/D radio-button groups (only one choice per Q).
//  · A teacher score box.
//  · A footer on every page with page numbers and small IDIC credits.

import {
  AcroFormCheckBox,
  AcroFormRadioButton,
  AcroFormTextField,
  jsPDF,
} from "jspdf";
import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Page + palette constants
 * ────────────────────────────────────────────────────────────── */

const PAGE_W = 210; // A4 mm
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

/* ─────────────────────────────────────────────────────────────────
 * Main entry
 * ────────────────────────────────────────────────────────────── */

export async function buildQuizPdf(lesson: Lesson): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });

  const logoDataUrl = await loadLogoDataUrl().catch(() => null);

  drawLetterhead(doc, lesson, logoDataUrl);
  const chapterBottom = drawChapterTitle(doc, LETTERHEAD_H + 4, lesson);
  const infoBottom = drawStudentInfo(doc, chapterBottom + 4);
  const instrBottom = drawInstructions(doc, infoBottom + 6, lesson);
  drawQuiz(doc, instrBottom + 6, lesson);

  // Add per-page letterhead accent + footer on every page (including any
  // page breaks introduced by drawQuiz).
  applyPageChrome(doc, lesson, logoDataUrl);

  return doc;
}

/* ─────────────────────────────────────────────────────────────────
 * Letterhead
 * ────────────────────────────────────────────────────────────── */

function drawLetterhead(doc: jsPDF, lesson: Lesson, logo: string | null) {
  // Colored top accent band
  doc.setFillColor(COLOR_ACCENT);
  doc.rect(0, 0, PAGE_W, 5, "F");

  // Logo (compact circular)
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", MARGIN_X, MARGIN_TOP, 22, 22, undefined, "FAST");
    } catch {
      /* ignore */
    }
  }

  // Institution name — English
  doc.setTextColor(COLOR_INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(
    "INSTITUTE OF DIGITAL INTELLIGENCE CAMBODIA",
    MARGIN_X + 26,
    MARGIN_TOP + 6
  );

  // Short brand line
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("IDIC", MARGIN_X + 26, MARGIN_TOP + 11);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLOR_MUTED);
  doc.setFontSize(9);
  doc.text("Introduction to Information Technology", MARGIN_X + 26, MARGIN_TOP + 16);
  doc.text(
    "Quiz Paper · Practice & Assessment",
    MARGIN_X + 26,
    MARGIN_TOP + 21
  );

  // Printed date (auto) — top-right
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
    `Chapter ${lesson.chapterNumber} · ${lesson.quiz.length} questions`,
    PAGE_W - MARGIN_X,
    MARGIN_TOP + 17,
    { align: "right" }
  );

  // Divider under letterhead
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 5, PAGE_W - MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 5);

  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.15);
  doc.line(MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 4, PAGE_W - MARGIN_X, MARGIN_TOP + LETTERHEAD_H - 4);
}

/* ─────────────────────────────────────────────────────────────────
 * Chapter title band
 * ────────────────────────────────────────────────────────────── */

function drawChapterTitle(doc: jsPDF, y: number, lesson: Lesson): number {
  doc.setFillColor(COLOR_ACCENT_SOFT);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 14, "F");
  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(COLOR_ACCENT);
  doc.text(
    `Chapter ${lesson.chapterNumber} — ${lesson.chapterTitle}`,
    MARGIN_X + 4,
    y + 9
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_INK);
  doc.text(
    `Total: ${lesson.quiz.length * 2} points`,
    PAGE_W - MARGIN_X - 4,
    y + 6,
    { align: "right" }
  );
  doc.setTextColor(COLOR_MUTED);
  doc.text(
    `${lesson.quiz.length} questions × 2 pts each`,
    PAGE_W - MARGIN_X - 4,
    y + 11,
    { align: "right" }
  );

  return y + 14;
}

/* ─────────────────────────────────────────────────────────────────
 * Student info block — student ticks fields in the PDF reader
 * ────────────────────────────────────────────────────────────── */

function drawStudentInfo(doc: jsPDF, y: number): number {
  // Title bar
  doc.setFillColor(COLOR_INK);
  doc.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 6, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("STUDENT INFORMATION — to be filled by the student", MARGIN_X + 3, y + 4.2);

  // Body box
  const bodyY = y + 6;
  const bodyH = 38;
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, bodyY, PAGE_W - 2 * MARGIN_X, bodyH);

  // Grid layout: two columns
  const colGap = 6;
  const col1X = MARGIN_X + 4;
  const col2X = MARGIN_X + (PAGE_W - 2 * MARGIN_X) / 2 + colGap / 2;

  const row1Y = bodyY + 8;
  const row2Y = bodyY + 20;
  const row3Y = bodyY + 32;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLOR_INK);
  doc.setFontSize(8.5);

  // ── Row 1: First Name | Last Name ────────────────────────
  drawLabel(doc, "First Name", col1X, row1Y);
  addTextField(doc, "firstName", col1X + 20, row1Y - 4.5, 60, 6);
  drawLabel(doc, "Last Name", col2X, row1Y);
  addTextField(doc, "lastName", col2X + 20, row1Y - 4.5, 60, 6);

  // ── Row 2: DOB (3 tick fields) | Gender (3 tick boxes) ───
  drawLabel(doc, "Date of Birth", col1X, row2Y);
  const dobStart = col1X + 24;
  addTextField(doc, "dob_d", dobStart, row2Y - 4.5, 12, 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("/", dobStart + 14, row2Y);
  addTextField(doc, "dob_m", dobStart + 17, row2Y - 4.5, 12, 6);
  doc.text("/", dobStart + 31, row2Y);
  addTextField(doc, "dob_y", dobStart + 34, row2Y - 4.5, 20, 6);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(COLOR_MUTED);
  doc.text("DD  /  MM  /  YYYY", dobStart, row2Y + 3);

  // Gender ticks
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_INK);
  drawLabel(doc, "Gender", col2X, row2Y);
  const genderStart = col2X + 16;
  addCheckbox(doc, "gender_m", genderStart, row2Y - 3.5, 4);
  doc.setFont("helvetica", "normal");
  doc.text("Male", genderStart + 5, row2Y);
  doc.setFont("helvetica", "bold");
  addCheckbox(doc, "gender_f", genderStart + 20, row2Y - 3.5, 4);
  doc.setFont("helvetica", "normal");
  doc.text("Female", genderStart + 25, row2Y);
  doc.setFont("helvetica", "bold");
  addCheckbox(doc, "gender_o", genderStart + 42, row2Y - 3.5, 4);
  doc.setFont("helvetica", "normal");
  doc.text("Other", genderStart + 47, row2Y);

  // ── Row 3: Class | Student ID ────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  drawLabel(doc, "Class / Section", col1X, row3Y);
  addTextField(doc, "classSection", col1X + 26, row3Y - 4.5, 54, 6);

  drawLabel(doc, "Student ID", col2X, row3Y);
  addTextField(doc, "studentId", col2X + 20, row3Y - 4.5, 60, 6);

  return bodyY + bodyH;
}

function drawLabel(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_INK);
  doc.text(text + ":", x, y);
}

/* ─────────────────────────────────────────────────────────────────
 * Instructions
 * ────────────────────────────────────────────────────────────── */

function drawInstructions(doc: jsPDF, y: number, lesson: Lesson): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(COLOR_INK);
  doc.text("Instructions", MARGIN_X, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(COLOR_MUTED);
  const lines = [
    `• Answer all ${lesson.quiz.length} multiple-choice questions. Pick ONE option (A, B, C, or D) per question.`,
    "• Each correct answer = 2 points. Wrong or blank = 0 points.",
    "• You may fill this on paper, or tick the boxes in any PDF reader, save, and send back.",
  ];
  let ly = y + 4.5;
  lines.forEach((l) => {
    doc.text(l, MARGIN_X, ly);
    ly += 4.2;
  });
  return ly;
}

/* ─────────────────────────────────────────────────────────────────
 * Quiz body — 20 questions with interactive radio-button groups
 * ────────────────────────────────────────────────────────────── */

function drawQuiz(doc: jsPDF, y: number, lesson: Lesson) {
  const optLetter = ["A", "B", "C", "D"];
  const contentW = PAGE_W - 2 * MARGIN_X;
  const bottomLimit = PAGE_H - MARGIN_BOTTOM - FOOTER_H;

  lesson.quiz.forEach((q, i) => {
    const wrapped = doc.splitTextToSize(q.q, contentW - 12) as string[];
    const optionLines = q.options.map(
      (o) => doc.splitTextToSize(o, contentW - 22) as string[]
    );
    const questionHeight =
      wrapped.length * 4.6 +
      optionLines.reduce((sum, ol) => sum + ol.length * 4.4, 0) +
      6;

    if (y + questionHeight > bottomLimit) {
      doc.addPage();
      y = LETTERHEAD_H + MARGIN_TOP + 4;
    }

    // Question number + prompt
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_INK);
    doc.text(`${i + 1}.`, MARGIN_X, y);

    doc.setFont("helvetica", "normal");
    doc.text(wrapped, MARGIN_X + 6, y);

    // 2 pts chip aligned right of the question
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor("#a07000");
    doc.setDrawColor("#e0b040");
    doc.setFillColor("#fff5d6");
    doc.roundedRect(PAGE_W - MARGIN_X - 12, y - 3.4, 12, 4.4, 1, 1, "FD");
    doc.text("2 pts", PAGE_W - MARGIN_X - 6, y - 0.4, { align: "center" });

    y += wrapped.length * 4.6 + 1;

    // Options as a radio group
    const groupName = `q${i + 1}`;
    q.options.forEach((_, oi) => {
      const boxY = y - 3;
      addRadio(doc, groupName, optLetter[oi], MARGIN_X + 8, boxY, 3.4);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(COLOR_ACCENT);
      doc.text(`${optLetter[oi]}.`, MARGIN_X + 13, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLOR_INK);
      doc.text(optionLines[oi], MARGIN_X + 19, y);
      y += optionLines[oi].length * 4.4;
    });

    y += 4;
  });

  // Score box for the teacher
  if (y + 22 > bottomLimit) {
    doc.addPage();
    y = LETTERHEAD_H + MARGIN_TOP + 4;
  }

  doc.setFillColor("#f5f7fb");
  doc.setDrawColor(COLOR_LINE_STRONG);
  doc.setLineWidth(0.35);
  doc.roundedRect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 20, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT);
  doc.text("TEACHER USE ONLY", MARGIN_X + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_INK);
  doc.text(
    `Score:  ______  /  ${lesson.quiz.length * 2}`,
    MARGIN_X + 4,
    y + 14
  );
  doc.text("Grade:  ______", MARGIN_X + 70, y + 14);
  doc.text("Signature:  ______________________", MARGIN_X + 115, y + 14);
}

/* ─────────────────────────────────────────────────────────────────
 * Per-page footer (added after all content so we know page count)
 * ────────────────────────────────────────────────────────────── */

function applyPageChrome(doc: jsPDF, lesson: Lesson, logo: string | null) {
  const pageCount = doc.getNumberOfPages();
  const printed = formatDate(new Date());

  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);

    // Footer accent line
    doc.setDrawColor(COLOR_ACCENT);
    doc.setLineWidth(0.4);
    doc.line(
      MARGIN_X,
      PAGE_H - MARGIN_BOTTOM,
      PAGE_W - MARGIN_X,
      PAGE_H - MARGIN_BOTTOM
    );

    // Small IDIC mark (left)
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
    doc.text(
      "IDIC",
      MARGIN_X + 10,
      PAGE_H - MARGIN_BOTTOM + 5
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      "Institute of Digital Intelligence Cambodia",
      MARGIN_X + 10,
      PAGE_H - MARGIN_BOTTOM + 9
    );

    // Center: chapter reference
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      `Chapter ${lesson.chapterNumber} · ${lesson.chapterTitle} · Quiz`,
      PAGE_W / 2,
      PAGE_H - MARGIN_BOTTOM + 6,
      { align: "center" }
    );

    // Right: page N / M + printed date
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_INK);
    doc.text(
      `Page ${p} of ${pageCount}`,
      PAGE_W - MARGIN_X,
      PAGE_H - MARGIN_BOTTOM + 5,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      `Printed: ${printed}`,
      PAGE_W - MARGIN_X,
      PAGE_H - MARGIN_BOTTOM + 9,
      { align: "right" }
    );
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Assets & date helpers
 * ────────────────────────────────────────────────────────────── */

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
 * jsPDF v4 AcroForm helpers
 * ────────────────────────────────────────────────────────────── */

function addTextField(
  doc: jsPDF,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const f = new AcroFormTextField();
  f.fieldName = name;
  f.x = x;
  f.y = y;
  f.width = w;
  f.height = h;
  f.fontSize = 10;
  doc.addField(f);

  // Underline so hand-fill works too
  doc.setDrawColor(COLOR_LINE);
  doc.setLineWidth(0.2);
  doc.line(x, y + h, x + w, y + h);
}

function addCheckbox(
  doc: jsPDF,
  name: string,
  x: number,
  y: number,
  size: number
) {
  const f = new AcroFormCheckBox();
  f.fieldName = name;
  f.x = x;
  f.y = y;
  f.width = size;
  f.height = size;
  doc.addField(f);

  // Visible square outline
  doc.setDrawColor(COLOR_INK);
  doc.setLineWidth(0.35);
  doc.rect(x, y, size, size);
}

// Radio groups need one AcroFormRadioButton per group (fieldName is the group),
// with createOption(name) called for each A/B/C/D — that's what enforces
// "only one choice per question" in every PDF reader.
const radioGroups = new WeakMap<jsPDF, Map<string, AcroFormRadioButton>>();

function addRadio(
  doc: jsPDF,
  groupName: string,
  optionValue: string,
  x: number,
  y: number,
  size: number
) {
  // Visible circle so students can see the target when printed on paper.
  doc.setDrawColor(COLOR_INK);
  doc.setLineWidth(0.3);
  doc.circle(x + size / 2, y + size / 2, size / 2);

  let groups = radioGroups.get(doc);
  if (!groups) {
    groups = new Map();
    radioGroups.set(doc, groups);
  }

  let group = groups.get(groupName);
  if (!group) {
    group = new AcroFormRadioButton();
    group.fieldName = groupName;
    groups.set(groupName, group);
    doc.addField(group);
  }

  const opt = group.createOption(optionValue);
  opt.x = x;
  opt.y = y;
  opt.width = size;
  opt.height = size;
  opt.appearanceState = "Off";
}
