"use client";

// Light / dark theme toggle. The chosen theme lives in localStorage under
// `idic-theme` and is applied by toggling the `theme-light` class on <html>.
// On first client render we read the stored preference and apply it in a
// useLayoutEffect so the class is on <html> before the browser paints —
// this keeps the flash of the wrong theme to a minimum.

import { useEffect, useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "idic-theme";

// useLayoutEffect is a no-op on the server; fall back to useEffect there to
// silence React's dev warning without changing client behavior.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readStoredTheme(): Theme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-light", next === "light");
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage may be unavailable (private mode) — silent no-op */
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useIsoLayoutEffect(() => {
    const stored = readStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={isLight}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-[12px] text-neutral-300 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-bright",
        className
      )}
    >
      {isLight ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      <span className="font-medium">{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
