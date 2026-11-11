// The public course catalogue (landing view). "/" is the sign-in page.

import type { Metadata } from "next";
import { CoursesLanding } from "@/components/landing/CoursesLanding";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, absoluteUrl } from "@/lib/site";

// Metadata is special Next.js information (title, description) used by the browser tab and search engines.
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/home") },
  keywords: [
    "computer anatomy",
    "PC anatomy",
    "computer components",
    "computer parts",
    "PC components",
    "computer hardware",
    "PC assembly",
    "PC building",
    "learn computer hardware",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/home"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: "PC Anatomy — Explore Computer Hardware in 3D",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/og-image.png")],
  },
};

// This is the main component Next.js renders for the "/home" URL. It just displays the LandingPage.
// (Global structured data — WebSite, Organization, EducationalApplication — lives in layout.tsx.)
export default function HomeCatalogue() {
  return <CoursesLanding />;
}
