// SERVER-ONLY auth helpers: scrypt PIN hashing + HMAC-signed session cookies.
import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "idic_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session =
  | { role: "student"; sid: string; exp: number }
  | { role: "teacher"; exp: number };

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
  s: { role: "student"; sid: string } | { role: "teacher" },
): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const payload = b64(JSON.stringify({ ...s, exp: Date.now() + MAX_AGE * 1000 }));
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const key = secret();
  const raw = (await cookies()).get(COOKIE)?.value;
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

export async function requireTeacher(): Promise<boolean> {
  return (await getSession())?.role === "teacher";
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
