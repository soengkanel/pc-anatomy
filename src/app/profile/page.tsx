// Route: /profile
// A warm, friendly introduction page for the instructor — designed so students
// can quickly see who is teaching them, what they teach, and how to say hello.

import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Meet your instructor — Kanel Soeng",
  description:
    "Hello class! I'm Kanel Soeng, your instructor for the Introduction to Information Technology course at IDIC. A friendly introduction, what I teach, and how to reach me.",
  alternates: { canonical: absoluteUrl("/profile") },
  openGraph: {
    title: "Meet your instructor — Kanel Soeng",
    description:
      "A friendly introduction from your IDIC Introduction to IT instructor.",
    url: absoluteUrl("/profile"),
    siteName: SITE_NAME,
    type: "profile",
  },
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
