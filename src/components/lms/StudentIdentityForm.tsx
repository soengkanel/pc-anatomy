"use client";

// Small identity form used before a student can submit a quiz or
// homework online. The values are cached in localStorage by
// `useStudentIdentity` so the student only fills this once per browser.

import { useState } from "react";
import { GraduationCap, IdCard, Check } from "lucide-react";
import type { StudentIdentity } from "@/lib/lms";

export function StudentIdentityForm({
  initial,
  onSaved,
  submitLabel = "Save & continue",
}: {
  initial?: StudentIdentity | null;
  onSaved: (s: StudentIdentity) => void;
  submitLabel?: string;
}) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [studentId, setStudentId] = useState(initial?.studentId ?? "");
  const [classSection, setClassSection] = useState(initial?.classSection ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: studentId.trim(),
      classSection: classSection.trim(),
    };
    if (!values.firstName || !values.lastName || !values.studentId || !values.classSection) {
      setError("All four fields are required.");
      return;
    }
    if (Object.values(values).some((v) => v.length > 120)) {
      setError("One of the fields is too long.");
      return;
    }
    setError(null);
    onSaved(values);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
        <IdCard className="h-4 w-4 text-violet-300" />
        Your details
      </div>
      <p className="text-[12.5px] text-neutral-400">
        Enter these once. They&rsquo;re saved on this device so you don&rsquo;t need to type them
        again next time you submit.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="First name" value={firstName} onChange={setFirstName} autoFocus />
        <Field label="Last name" value={lastName} onChange={setLastName} />
        <Field label="Student ID" value={studentId} onChange={setStudentId} />
        <Field
          label="Class / Section"
          value={classSection}
          onChange={setClassSection}
          placeholder="e.g. Grade 10 – A"
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
          className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/50 bg-violet-500/25 px-4 py-2 text-[12.5px] font-semibold text-violet-100 transition-colors hover:bg-violet-500/35"
        >
          <Check className="h-3.5 w-3.5" /> {submitLabel}
        </button>
        <span className="text-[11px] text-neutral-500">
          <GraduationCap className="mr-1 inline h-3 w-3" />
          Only your teacher can see submissions.
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-[12px]">
      <span className="font-medium text-neutral-300">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-[13px] text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-violet-400/60"
      />
    </label>
  );
}
