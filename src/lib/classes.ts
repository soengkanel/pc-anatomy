// Class codes: "T2-S1" = Team 2, Shift 1. Mirrors the timetable page
// (src/components/timetable): T is the team, S is the shift.
//   S1 = Wednesday evening, S2 = Thursday evening, S3 = Sunday afternoon.
// Client-safe (no server imports) so forms, the teacher portal and the API share it.

export const SHIFTS = [
  { n: 1, day: "Wednesday", short: "Wed", time: "7:00 – 8:00 PM" },
  { n: 2, day: "Thursday", short: "Thu", time: "7:00 – 8:00 PM" },
  { n: 3, day: "Sunday", short: "Sun", time: "1:00 – 2:00 PM" },
] as const;

/** Highest team number offered in pickers (teams are numbered 1, 2, 3 …). */
export const MAX_TEAM = 9;

export const TEAMS = Array.from({ length: MAX_TEAM }, (_, i) => i + 1);

export const classCode = (team: number, shift: number) => `T${team}-S${shift}`;

const RE = /^T([1-9])-S([1-3])$/;

export function parseClass(code: string): { team: number; shift: number } | null {
  const m = RE.exec(code.trim().toUpperCase());
  return m ? { team: Number(m[1]), shift: Number(m[2]) } : null;
}

export const isClassCode = (code: string) => parseClass(code) !== null;

/** Canonical form ("t2-s1" → "T2-S1"), or null if it isn't a valid class code. */
export function normalizeClass(code: string): string | null {
  const p = parseClass(code);
  return p ? classCode(p.team, p.shift) : null;
}

/** "Team 2 · Shift 1 · Wed 7:00 – 8:00 PM", or null for a non-code (e.g. a legacy value). */
export function describeClass(code: string): string | null {
  const p = parseClass(code);
  if (!p) return null;
  const s = SHIFTS[p.shift - 1];
  return `Team ${p.team} · Shift ${p.shift} · ${s.short} ${s.time}`;
}
