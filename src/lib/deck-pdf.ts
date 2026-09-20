// Generates a printable lecture slide deck for a chapter.
//
// Approach: rather than slicing the whole chapter section into fixed-height
// pages (which cuts subtopics in half), we snapshot each *direct child* of
// the chapter section (the ChapterHeader, each SubTopic, and any hero /
// closing card) as its own image and scale-to-fit onto a landscape A4 page.
// The caller hides the "Key Terms" and "Quiz" cards before invoking us so
// they're absent from the deck.
//
// Result: one slide = one chapter card, always fully visible, never cut.

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import type { Lesson } from "@/lib/lecture-data";

/* ─────────────────────────────────────────────────────────────────
 * Constants — landscape A4
 * ────────────────────────────────────────────────────────────── */

const PAGE_W = 297;
const PAGE_H = 210;
const MARGIN_X = 14;
const HEADER_H = 20;
const FOOTER_H = 12;
const CONTENT_TOP = HEADER_H + 6;
const CONTENT_BOTTOM = PAGE_H - FOOTER_H - 4;
const CONTENT_W = PAGE_W - 2 * MARGIN_X;
const CONTENT_H = CONTENT_BOTTOM - CONTENT_TOP;

const COLOR_INK = "#0a0d14";
const COLOR_MUTED = "#5c6b83";
const COLOR_LINE = "#c9d3e6";
const COLOR_ACCENT = "#1f4bb8";
const COLOR_ACCENT_INK = "#0f2b7a";
const COLOR_PAGE_BG = "#f7f9fd";
const COLOR_SLIDE_BG = "#0a0d14"; // matches the on-page dark theme

/* ─────────────────────────────────────────────────────────────────
 * Entry point
 * ────────────────────────────────────────────────────────────── */

export type DeckMeta = {
  lesson: Lesson;
  chapterNumber: string;
  /** One-sentence lead-in shown under the big chapter title on the cover. */
  hook: string;
  /**
   * Optional progress callback — fires as each card is captured so the
   * caller can update a "Rendering slide N / M" indicator.
   */
  onProgress?: (current: number, total: number) => void;
};

export async function buildDeckPdf(
  chapterElement: HTMLElement,
  meta: DeckMeta,
): Promise<jsPDF> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "landscape",
    compress: true,
  });

  const logo = await loadLogoDataUrl().catch(() => null);

  // Slide 1 — cover
  drawCoverSlide(doc, meta, logo);

  // Iterate over each direct-child card of the chapter section. Skip anything
  // that ends up empty (LessonPack, Sparkles divider) after the caller hid
  // the Key Terms + Quiz cards.
  const cards = Array.from(chapterElement.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.getBoundingClientRect().height > 20,
  );

  for (let i = 0; i < cards.length; i++) {
    meta.onProgress?.(i + 1, cards.length);
    try {
      const canvas = await html2canvas(cards[i], {
        backgroundColor: COLOR_SLIDE_BG,
        scale: 2,
        useCORS: true,
        logging: false,
        imageTimeout: 3000,
        ignoreElements: (node) =>
          node.tagName === "IFRAME" || node.tagName === "VIDEO",
      });
      doc.addPage();
      drawCardSlide(doc, canvas);
    } catch {
      // Non-fatal — if a single card fails, skip it and keep going.
    }
  }

  applyPageChrome(doc, meta, logo);
  return doc;
}

/* ─────────────────────────────────────────────────────────────────
 * A single card, scaled to fit inside the page's content band with
 * aspect ratio preserved and centred both axes.
 * ────────────────────────────────────────────────────────────── */

function drawCardSlide(doc: jsPDF, canvas: HTMLCanvasElement) {
  // Fill the whole slide with the dark theme so scaled-down cards don't
  // sit awkwardly on a bright white page — matches the on-screen look.
  doc.setFillColor(COLOR_SLIDE_BG);
  doc.rect(0, HEADER_H, PAGE_W, PAGE_H - HEADER_H - FOOTER_H, "F");

  const scale = Math.min(
    CONTENT_W / (canvas.width / 3.78), // px / (px per mm at ~96 dpi) ~ mm at html2canvas scale=1
    CONTENT_H / (canvas.height / 3.78),
  );
  // Convert canvas dimensions from pixels to mm, then apply fit-scale so it
  // fills as much of the content band as possible without cropping.
  const mmW = (canvas.width / 3.78) * scale;
  const mmH = (canvas.height / 3.78) * scale;
  const x = MARGIN_X + (CONTENT_W - mmW) / 2;
  const y = CONTENT_TOP + (CONTENT_H - mmH) / 2;

  try {
    doc.addImage(
      canvas.toDataURL("image/jpeg", 0.85),
      "JPEG",
      x,
      y,
      mmW,
      mmH,
      undefined,
      "FAST",
    );
  } catch {
    /* skip */
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Cover slide (page 1)
 * ────────────────────────────────────────────────────────────── */

function drawCoverSlide(doc: jsPDF, meta: DeckMeta, logo: string | null) {
  doc.setFillColor(COLOR_ACCENT);
  doc.rect(0, 0, PAGE_W, 44, "F");
  doc.setFillColor(COLOR_ACCENT_INK);
  doc.rect(0, 44, PAGE_W, 3, "F");

  if (logo) {
    try {
      doc.addImage(logo, "JPEG", MARGIN_X, 10, 22, 22, undefined, "FAST");
    } catch {
      /* ignore */
    }
  }
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    "IDIC · INSTITUTE OF DIGITAL INTELLIGENCE CAMBODIA",
    MARGIN_X + 26,
    18,
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#dbe4ff");
  doc.text(
    "Introduction to Information Technology — Lecture Deck",
    MARGIN_X + 26,
    24,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor("#ffffff");
  doc.text(`Chapter ${meta.chapterNumber}`, PAGE_W - MARGIN_X, 18, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#dbe4ff");
  doc.text(formatDate(new Date()), PAGE_W - MARGIN_X, 24, { align: "right" });

  const leftCol = { x: MARGIN_X, top: 62, w: 110 };
  const rightCol = {
    x: leftCol.x + leftCol.w,
    top: leftCol.top,
    w: PAGE_W - leftCol.x - leftCol.w - MARGIN_X,
  };

  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLOR_ACCENT);
  doc.setFontSize(11);
  doc.text("CHAPTER", leftCol.x, leftCol.top);

  doc.setFontSize(150);
  doc.setTextColor(COLOR_INK);
  doc.text(
    String(meta.chapterNumber).padStart(2, "0"),
    leftCol.x,
    leftCol.top + 62,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(COLOR_INK);
  const titleLines = doc.splitTextToSize(
    normalizeText(meta.lesson.chapterTitle),
    rightCol.w,
  ) as string[];
  titleLines.forEach((line, i) => {
    doc.text(line, rightCol.x, rightCol.top + 4 + i * 13);
  });

  const afterTitleY = rightCol.top + 4 + titleLines.length * 13;
  doc.setDrawColor(COLOR_ACCENT);
  doc.setLineWidth(1);
  doc.line(rightCol.x, afterTitleY + 4, rightCol.x + 40, afterTitleY + 4);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(16);
  doc.setTextColor("#1f2937");
  const hookLines = doc.splitTextToSize(
    normalizeText(meta.hook),
    rightCol.w,
  ) as string[];
  hookLines.forEach((line, i) => {
    doc.text(line, rightCol.x, afterTitleY + 16 + i * 8);
  });

  const stripY = PAGE_H - FOOTER_H - 20;
  doc.setDrawColor(COLOR_LINE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, stripY, PAGE_W - MARGIN_X, stripY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLOR_INK);
  doc.text("Lecture Deck", MARGIN_X, stripY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_MUTED);
  doc.text(
    "Classroom slides for IDIC students",
    MARGIN_X,
    stripY + 13,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLOR_MUTED);
  doc.text(
    "Snapshot of the online /lecture page — quiz + key terms removed",
    PAGE_W - MARGIN_X,
    stripY + 7,
    { align: "right" },
  );
  doc.text(
    "idic.edu.kh",
    PAGE_W - MARGIN_X,
    stripY + 13,
    { align: "right" },
  );
}

/* ─────────────────────────────────────────────────────────────────
 * Header + footer on every non-cover page
 * ────────────────────────────────────────────────────────────── */

function applyPageChrome(doc: jsPDF, meta: DeckMeta, logo: string | null) {
  const pageCount = doc.getNumberOfPages();
  const printed = formatDate(new Date());

  for (let p = 2; p <= pageCount; p++) {
    doc.setPage(p);

    doc.setFillColor(COLOR_PAGE_BG);
    doc.rect(0, 0, PAGE_W, HEADER_H, "F");
    doc.setDrawColor(COLOR_LINE);
    doc.setLineWidth(0.4);
    doc.line(0, HEADER_H, PAGE_W, HEADER_H);

    if (logo) {
      try {
        doc.addImage(logo, "JPEG", MARGIN_X, 4, 12, 12, undefined, "FAST");
      } catch {
        /* ignore */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_ACCENT);
    doc.text("IDIC", MARGIN_X + 15, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      "Institute of Digital Intelligence Cambodia",
      MARGIN_X + 15,
      15,
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_ACCENT);
    doc.text(
      `Chapter ${meta.chapterNumber} · ${normalizeText(meta.lesson.chapterTitle)}`,
      PAGE_W / 2,
      10,
      { align: "center" },
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(COLOR_MUTED);
    doc.text("Lecture Deck", PAGE_W / 2, 15, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(COLOR_INK);
    doc.text(`Slide ${p} / ${pageCount}`, PAGE_W - MARGIN_X, 10, {
      align: "right",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_MUTED);
    doc.text(printed, PAGE_W - MARGIN_X, 15, { align: "right" });

    doc.setDrawColor(COLOR_ACCENT);
    doc.setLineWidth(0.4);
    doc.line(
      MARGIN_X,
      PAGE_H - FOOTER_H,
      PAGE_W - MARGIN_X,
      PAGE_H - FOOTER_H,
    );
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      "IDIC · Introduction to Information Technology · Classroom use only",
      MARGIN_X,
      PAGE_H - FOOTER_H + 6,
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_MUTED);
    doc.text(
      "idic.edu.kh",
      PAGE_W - MARGIN_X,
      PAGE_H - FOOTER_H + 6,
      { align: "right" },
    );
  }
}

/* ─────────────────────────────────────────────────────────────────
 * Assets + helpers
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
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][d.getMonth()];
  return `${pad(d.getDate())} ${month} ${d.getFullYear()}`;
}

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
    .replace(/↔/g, "<->")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/•/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
