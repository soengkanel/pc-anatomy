// Route: /ml
// A hands-on 8-chapter Machine Learning course for IDIC students —
// every worked example uses Cambodia-based data (rice yields by province,
// tuk-tuk fares in Phnom Penh, Angkor ticket demand, ABA fraud, Khmer
// letters). Each chapter ends with a bilingual key-terms glossary and
// a 20-question quiz.

import type { Metadata } from "next";
import { MLCoursePage } from "@/components/ml/MLCoursePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Machine Learning — IDIC Course",
  description:
    "A beginner-friendly, visual-first Machine Learning course taught with Cambodian data — rice yields, moto prices, ABA fraud, Khmer letters. Regression, classification, neural networks, and modern ML.",
  alternates: { canonical: absoluteUrl("/ml") },
  openGraph: {
    title: "Machine Learning — IDIC Course",
    description:
      "Learn ML from zero with Cambodian examples: regression on rice yields, classifying ABA fraud, and a taste of deep learning.",
    url: absoluteUrl("/ml"),
    siteName: SITE_NAME,
    type: "article",
  },
};

export default function MLRoute() {
  return <MLCoursePage />;
}
