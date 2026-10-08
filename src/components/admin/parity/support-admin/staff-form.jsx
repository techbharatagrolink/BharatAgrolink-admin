"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { createStaffAction } from "@/lib/actions/admin/parity/support-admin";

const EXPERIENCE = [
  { value: "junior", label: "Junior" },
  { value: "intermediate", label: "Intermediate" },
  { value: "senior", label: "Senior" },
];
const EMAIL = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const EMPTY = { roleId: "", experienceLevel: "", fullName: "", address: "", phone: "", email: "", password: "" };

/** add-staff.php checks, in the same order and with the same messages (add-staff-user.js). */
function check(form, needsLevel) {
  if (!form.roleId) return ["roleId", "Please select user role"];
  if (!form.fullName.trim()) return ["fullName", "User full name is empty"];
  if (!form.address.trim()) return ["address", "user address is empty"];
  if (needsLevel && !form.experienceLevel) return ["experienceLevel", "Please select Role Experience Level"];
  if (!form.phone.trim()) return ["phone", "Phone number is empty"];
  if (!form.email.trim()) return ["email", "Email id is empty"];
  if (!EMAIL.test(form.email.trim())) return ["email", "Email id is invalid"];
  if (!form.password) return ["password", "Password is empty"];
  const p = form.password;
  if (p.length < 5 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return ["password", "Password Must contain 5 characters or more,lowercase and uppercase characters and contains digits."];
  return null;
}

export function StaffForm({ roles, experienceRoles, canAdd }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [saving, startSaving] = useTransition();
  const needsLevel = experienceRoles.map(String).includes(form.roleId);
  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const submit = (event) => {
    event.preventDefault();
    const problem = check(form, needsLevel);
    if (problem) {
      setErrors({ [problem[0]]: problem[1] });
      notify({ message: problem[1], tone: "error" });
      return;
    }
    setErrors({});
    startSaving(async () => {
      const result = await createStaffAction({ ...form, experienceLevel: needsLevel ? form.experienceLevel : "" });
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.ok) router.push("/admin/users");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {!canAdd && <Notice>You can view this form. Adding staff needs add permission.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Select Role" required error={errors.roleId}>
          {({ id, invalid }) => <Select id={id} value={form.roleId} onChange={set("roleId")} aria-invalid={invalid || undefined} placeholder="Select" options={roles.map((r) => ({ value: String(r.id), label: r.title }))} />}
        </Field>
        {needsLevel && (
          <Field label="Role Experience Level" required error={errors.experienceLevel}>
            {({ id, invalid }) => <Select id={id} value={form.experienceLevel} onChange={set("experienceLevel")} aria-invalid={invalid || undefined} placeholder="Select" options={EXPERIENCE} />}
          </Field>
        )}
        <Field label="Full Name" required error={errors.fullName}>
          {({ id, invalid }) => <Input id={id} value={form.fullName} onChange={set("fullName")} aria-invalid={invalid || undefined} placeholder="Full Name" maxLength={100} autoComplete="off" />}
        </Field>
        <Field label="Address" required error={errors.address}>
          {({ id, invalid }) => <Input id={id} value={form.address} onChange={set("address")} aria-invalid={invalid || undefined} placeholder="Address" maxLength={2000} autoComplete="off" />}
        </Field>
        <Field label="Phone" required error={errors.phone}>
          {({ id, invalid }) => <Input id={id} value={form.phone} onChange={set("phone")} aria-invalid={invalid || undefined} placeholder="Without country code" inputMode="tel" maxLength={15} autoComplete="off" />}
        </Field>
        <Field label="Email Id" required error={errors.email}>
          {({ id, invalid }) => <Input id={id} type="email" value={form.email} onChange={set("email")} aria-invalid={invalid || undefined} placeholder="email id" maxLength={50} autoComplete="off" />}
        </Field>
        <Field label="Password" required error={errors.password} hint="5 or more characters with lowercase, uppercase and a digit.">
          {({ id, invalid, describedBy }) => (
            <div className="relative">
              <Input id={id} type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} aria-invalid={invalid || undefined} aria-describedby={describedBy} placeholder="Password" maxLength={40} autoComplete="new-password" className="pr-10" />
              {form.password && (
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-ink-muted hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
              )}
            </div>
          )}
        </Field>
      </div>
      <div className="flex justify-end border-t border-line pt-4">
        <Button type="submit" variant="primary" loading={saving} disabled={!canAdd}>
          Save
        </Button>
      </div>
    </form>
  );
}
