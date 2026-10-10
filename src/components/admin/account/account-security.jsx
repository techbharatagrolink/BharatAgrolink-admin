"use client";

import { useActionState, useTransition, useState } from "react";
import { changePasswordAction, logoutOtherSessionsAction } from "@/lib/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && <Notice tone={state.ok ? "success" : "danger"}>{state.message}</Notice>}
      <Field label="Current password" required error={state?.fieldErrors?.currentPassword}>
        {({ id, invalid }) => <Input id={id} name="currentPassword" type="password" autoComplete="current-password" aria-invalid={invalid || undefined} required />}
      </Field>
      <Field label="New password" required hint="At least 8 characters, with letters and numbers." error={state?.fieldErrors?.newPassword}>
        {({ id, invalid, describedBy }) => <Input id={id} name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={40} aria-invalid={invalid || undefined} aria-describedby={describedBy} required />}
      </Field>
      <Field label="Confirm new password" required error={state?.fieldErrors?.confirmPassword}>
        {({ id, invalid }) => <Input id={id} name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={40} aria-invalid={invalid || undefined} required />}
      </Field>
      <Button type="submit" variant="primary" loading={pending}>
        Change password
      </Button>
    </form>
  );
}

export function LogoutOtherSessionsButton({ disabled }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-3">
      {result?.message && <Notice tone={result.ok ? "success" : "danger"}>{result.message}</Notice>}
      <Button type="button" variant="secondary" loading={pending} disabled={disabled} onClick={() => startTransition(async () => setResult(await logoutOtherSessionsAction()))}>
        Log out other sessions
      </Button>
    </div>
  );
}
