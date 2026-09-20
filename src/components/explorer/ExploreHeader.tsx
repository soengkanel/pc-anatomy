"use client";

// ExploreHeader.tsx: The top navigation bar shown on all screen sizes on the
// Explore page. On mobile/tablet it provides the hamburger button that opens
// the components drawer; on every size it shows the brand and a "PC Assembly"
// button linking to the step-by-step assembly guide.
import Image from "next/image";
import Link from "next/link";
import { GitCompareArrows, Menu, Wrench } from "lucide-react";

export function ExploreHeader({
  onOpenMenu,
  onOpenDifferences,
}: {
  onOpenMenu: () => void;
  onOpenDifferences: () => void;
}) {
  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface/80 px-3.5 backdrop-blur-xl">
      {/* Hamburger button opens the components drawer (mobile/tablet only). */}
      <button
        type="button"
        aria-label="Open components list"
        onClick={onOpenMenu}
        className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-foreground transition-colors active:bg-surface-3 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.8} />
      </button>

      {/* Logo mark. */}
      <div className="relative shrink-0">
        <Image
          src="/logo.png"
          alt="Computer Anatomy logo"
          width={128}
          height={128}
          priority
          className="h-8 w-8 rounded-lg object-cover"
        />
      </div>

      {/* Name + short subtitle. */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13.5px] font-semibold leading-tight tracking-tight text-foreground">
          Computer Anatomy
        </span>
        <span className="hidden truncate text-[10.5px] leading-tight text-muted-2 sm:block">
          Explore Components in 3D
        </span>
      </div>

      {/* Key Differences button — opens the "commonly confused" comparisons. */}
      <button
        type="button"
        onClick={onOpenDifferences}
        className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-3 hover:text-accent"
      >
        <GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.8} />
        <span className="hidden sm:inline">Key Differences</span>
        <span className="sm:hidden">Compare</span>
      </button>

      {/* PC Assembly button linking to the step-by-step build guide. */}
      <Link
        href="/assembly"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-surface-3 hover:text-accent"
      >
        <Wrench className="h-3.5 w-3.5" strokeWidth={1.8} />
        <span className="hidden sm:inline">PC Assembly</span>
        <span className="sm:hidden">Build</span>
      </Link>

      {/* Compact version badge (hidden on small screens). */}
      <span className="hidden shrink-0 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-2 sm:inline-flex">
        v0.1
      </span>
    </header>
  );
}
