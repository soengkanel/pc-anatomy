// Route: /whiteboard
// A live tldraw whiteboard used during class to sketch and explain ideas.
// The actual tldraw editor only runs in the browser, so it is loaded by a
// small Client wrapper (WhiteboardClient) using next/dynamic + ssr:false.

import type { Metadata } from "next";
import { WhiteboardClient } from "@/components/whiteboard/WhiteboardClient";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Whiteboard",
  description: "A live whiteboard used in class to sketch and explain ideas.",
  alternates: { canonical: absoluteUrl("/whiteboard") },
  robots: { index: false, follow: false },
};

export default function WhiteboardRoute() {
  return <WhiteboardClient />;
}
