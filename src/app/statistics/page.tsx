// Route: /statistics
// A hands-on 8-chapter Statistics course for IDIC students —
// every worked example uses Cambodia-based data (rice yields by province,
// tuk-tuk fares in Phnom Penh, Angkor ticket demand, ABA transfers, market
// prices, election turnout, hospital wait times). Each chapter ends with a
// bilingual key-terms glossary and a 20-question quiz.

import type { Metadata } from "next";
import { StatisticsCoursePage } from "@/components/statistics/StatisticsCoursePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Statistics — IDIC Course",
  description:
    "A beginner-friendly, visual-first Statistics course taught with Cambodian data — rice yields, market prices, ABA transfers, hospital wait times. Descriptive stats, probability, sampling, hypothesis testing, correlation, regression, ANOVA, chi-square.",
  alternates: { canonical: absoluteUrl("/statistics") },
  openGraph: {
    title: "Statistics — IDIC Course",
    description:
      "Learn Statistics from zero with Cambodian examples: means and medians on rice yields, hypothesis tests on ABA transfers, regression on tuk-tuk fares.",
    url: absoluteUrl("/statistics"),
    siteName: SITE_NAME,
    type: "article",
  },
};

export default function StatisticsRoute() {
  return <StatisticsCoursePage />;
}
