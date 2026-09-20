"use client";

// A full-screen tldraw whiteboard for live in-class explanations.
// tldraw pulls in a lot of code and must render only on the client, so the
// route page uses next/dynamic to load this file with ssr disabled.

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BrainCircuit, GraduationCap, Layers, Rocket } from "lucide-react";

// Quick-jump chips to every course so the professor can dart back to the
// lesson deck from a whiteboard session without hunting the browser back
// button.
const COURSE_LINKS = [
  { href: "/lecture", label: "IT Lecture", icon: Layers },
  { href: "/ml", label: "ML", icon: BrainCircuit },
  { href: "/rust", label: "Rust", icon: Rocket },
] as const;

export default function Whiteboard() {
  const router = useRouter();

  const goBack = () => {
    // Prefer the browser history so we return to whichever course launched
    // the whiteboard. Fall back to /lecture when there's no history (e.g.
    // the whiteboard was opened in a fresh tab).
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/lecture");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-between gap-3 border-b border-line-strong bg-background/90 px-4 py-2 backdrop-blur-xl">
        {/* Left cluster: back-to-course + quick course chips */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
            aria-label="Back to course"
            title="Back to course"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to course</span>
          </button>
          <div className="hidden items-center gap-1.5 sm:flex">
            {COURSE_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-white/[0.03] px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-tight text-foreground hover:text-accent-bright"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line-strong bg-white/[0.05] text-accent-bright">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          Kanel&rsquo;s Whiteboard
        </Link>
      </div>
      <div className="relative flex-1">
        <Tldraw persistenceKey="kanel-classroom-whiteboard" />
      </div>
    </div>
  );
}
