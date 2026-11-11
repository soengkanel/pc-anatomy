import "server-only";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const err = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

export const noDb = () =>
  err("The server database is not configured yet. Please try again later.", 503);

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export const str = (v: unknown, max = 120): string | null =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

export { db };

export type StudentRow = {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  class_section: string;
};

export const publicStudent = (r: StudentRow) => ({
  studentId: r.student_id,
  firstName: r.first_name,
  lastName: r.last_name,
  classSection: r.class_section,
});
