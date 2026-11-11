"use client";

// Register / sign-in form for students (Student ID + PIN). On success the
// server sets a signed session cookie and `onSaved` receives the student.

import { useState } from "react";
import { GraduationCap, IdCard, Check, Loader2 } from "lucide-react";
import type { StudentIdentity } from "@/lib/lms";
import { authRequest } from "@/lib/lms-client";

export function StudentIdentityForm({
  initial,
  onSaved,
  submitLabel,
  registerOnly,
}: {
  initial?: StudentIdentity | null;
  onSaved: (s: StudentIdentity) => void;
  submitLabel?: string;
  /** Hide the Sign in tab (used on the unified login page). */
  registerOnly?: boolean;
}) {
  const [mode, setMode] = useState<"register" | "login">(initial ? "login" : "register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState(initial?.studentId ?? "");
  const [classSection, setClassSection] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const s =
        mode === "register"
          ? await authRequest("register", { firstName, lastName, studentId, classSection, pin })
          : await authRequest("login", { studentId, pin });
      onSaved(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
        <IdCard className="h-4 w-4 text-violet-300" />
        {mode === "register" ? "Create your student account" : "Sign in"}
      </div>

      <div className={`${registerOnly ? "hidden" : "inline-flex"} rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[12px]`}>
        {(["register", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              mode === m ? "bg-violet-500/30 text-violet-100" : "text-neutral-400 hover:text-white"
            }`}
          >
            {m === "register" ? "Register" : "Sign in"}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mode === "register" && (
          <>
            <Field label="First name" value={firstName} onChange={setFirstName} autoFocus />
            <Field label="Last name" value={lastName} onChange={setLastName} />
          </>
        )}
        <Field label="Student ID" value={studentId} onChange={setStudentId} autoFocus={mode === "login"} />
        {mode === "register" && (
          <Field
            label="Class / Section"
            value={classSection}
            onChange={setClassSection}
            placeholder="e.g. Grade 10 – A"
          />
        )}
        <Field
          label={mode === "register" ? "Choose a PIN (4–12 letters/digits)" : "PIN"}
          value={pin}
          onChange={setPin}
          password
        />
      </div>

      {error && (
        <div className="rounded-md border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-[12.5px] text-rose-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[12.5px] font-semibold text-violet-100 transition-colors hover:bg-violet-500/35 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {submitLabel ?? (mode === "register" ? "Register & continue" : "Sign in")}
        </button>
        <span className="text-[11px] text-neutral-500">
          <GraduationCap className="mr-1 inline h-3 w-3" />
          Your PIN keeps others from using your ID. Don&rsquo;t share it.
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  autoFocus,
  placeholder,
  password,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  password?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-[12px]">
      <span className="font-medium text-neutral-300">{label}</span>
      <input
        type={password ? "password" : "text"}
        autoComplete={password ? "current-password" : "off"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-[13px] text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-violet-400/60"
      />
    </label>
  );
}
