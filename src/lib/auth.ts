// SERVER-ONLY auth helpers: scrypt PIN hashing + HMAC-signed session cookies.
import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

// Separate cookies so a teacher and a student can be signed in in the same
// browser at once (e.g. when testing alone) without overwriting each other.
const COOKIE = "idic_session";
const T_COOKIE = "idic_teacher";
// "View as student": a teacher looking at the student portal as one student, read-only.
const V_COOKIE = "idic_viewas";
// Non-httpOnly hint (no secrets) so the banner only fetches when a view is active.
export const V_HINT = "idic_viewas_on";
const VIEW_MAX_AGE = 60 * 60 * 2; // 2 hours
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session =
  | { role: "student"; sid: string; exp: number }
  | { role: "teacher"; tid: string; exp: number };

export type Teacher = { id: string; username: string; displayName: string };

function secret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (data: string, key: string) =>
  createHmac("sha256", key).update(data).digest("base64url");

export function hashPin(pin: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(pin, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(pin, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(expected, actual);
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function setSession(
  s: { role: "student"; sid: string } | { role: "teacher"; tid: string },
): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const payload = b64(JSON.stringify({ ...s, exp: Date.now() + MAX_AGE * 1000 }));
  (await cookies()).set(s.role === "teacher" ? T_COOKIE : COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function clearSession(role: "student" | "teacher" = "student"): Promise<void> {
  (await cookies()).delete(role === "teacher" ? T_COOKIE : COOKIE);
}

async function readSession(name: string): Promise<Session | null> {
  const key = secret();
  const raw = (await cookies()).get(name)?.value;
  if (!key || !raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

/** Signed-in student session (null if none). */
export async function getSession(): Promise<Session | null> {
  const s = await readSession(COOKIE);
  return s?.role === "student" ? s : null;
}

/**
 * The signed-in teacher, verified against the database on every call (so a
 * deleted teacher loses access immediately). Null when not signed in.
 */
export async function getTeacher(): Promise<Teacher | null> {
  const s = await readSession(T_COOKIE);
  if (s?.role !== "teacher" || !db) return null;
  const { rows } = await db.query<{ id: string; username: string; display_name: string }>(
    "select id, username, display_name from teachers where id = $1",
    [s.tid],
  );
  return rows[0] ? { id: rows[0].id, username: rows[0].username, displayName: rows[0].display_name } : null;
}

// ── View as student (teacher impersonation, read-only) ─────────────────────

export async function startViewAs(tid: string, sid: string): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const payload = b64(JSON.stringify({ tid, sid, exp: Date.now() + VIEW_MAX_AGE * 1000 }));
  const jar = await cookies();
  const opts = { sameSite: "lax" as const, secure: process.env.COOKIE_SECURE === "true", path: "/", maxAge: VIEW_MAX_AGE };
  jar.set(V_COOKIE, `${payload}.${sign(payload, key)}`, { ...opts, httpOnly: true });
  jar.set(V_HINT, "1", { ...opts, httpOnly: false });
  return true;
}

export async function endViewAs(): Promise<void> {
  const jar = await cookies();
  jar.delete(V_COOKIE);
  jar.delete(V_HINT);
}

/** Active "view as" — only valid while the SAME teacher is still signed in. */
export async function getViewAs(): Promise<{ sid: string; teacher: Teacher } | null> {
  const key = secret();
  const raw = (await cookies()).get(V_COOKIE)?.value;
  if (!key || !raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return null;
  try {
    const v = JSON.parse(Buffer.from(payload, "base64url").toString()) as { tid: string; sid: string; exp: number };
    if (v.exp <= Date.now()) return null;
    const teacher = await getTeacher();
    return teacher && teacher.id === v.tid ? { sid: v.sid, teacher } : null;
  } catch {
    return null;
  }
}

export type StudentContext = { sid: string; readOnly: boolean; viewer: Teacher | null };

/** Who the student portal should show: the viewed student (read-only) or the real signed-in student. */
export async function studentContext(): Promise<StudentContext | null> {
  const v = await getViewAs();
  if (v) return { sid: v.sid, readOnly: true, viewer: v.teacher };
  const s = await getSession();
  return s?.role === "student" ? { sid: s.sid, readOnly: false, viewer: null } : null;
}

export const VIEW_ONLY_MESSAGE =
  "View-only mode: you're viewing the student portal as a student, so nothing can be submitted or played. Exit the view first.";

/**
 * For endpoints that WRITE as a student. Rejects "view as" sessions outright,
 * even if a real student cookie is also present in this browser.
 */
export async function writableStudent(): Promise<{ sid: string } | { error: string; status: number }> {
  if (await getViewAs()) return { error: VIEW_ONLY_MESSAGE, status: 403 };
  const s = await getSession();
  if (s?.role !== "student") return { error: "Please sign in.", status: 401 };
  return { sid: s.sid };
}

/** Tiny in-memory throttle: max `limit` failures per key per window. */
const fails = new Map<string, { n: number; reset: number }>();
export function throttled(key: string, limit = 6): boolean {
  const e = fails.get(key);
  return !!e && e.reset > Date.now() && e.n >= limit;
}
export function noteFailure(key: string, windowMs = 10 * 60_000) {
  const now = Date.now();
  const e = fails.get(key);
  if (!e || e.reset <= now) fails.set(key, { n: 1, reset: now + windowMs });
  else e.n++;
}
export function clearFailures(key: string) {
  fails.delete(key);
}
