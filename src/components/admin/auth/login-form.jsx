"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

const DEMO_PASSWORD = "Demo@1234";

export function LoginForm({ accounts, next }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  return (
    <>
      <form action={formAction} className="mt-6 space-y-4 rounded-xl border border-line bg-surface p-5" noValidate>
        <input type="hidden" name="next" value={next} />
        {state?.message && <Notice tone="danger">{state.message}</Notice>}
        <Field label="Work email" required>
          {({ id }) => <Input id={id} name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />}
        </Field>
        <Field label="Password" required>
          {({ id }) => (
            <div className="relative">
              <Input id={id} name="password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" required />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          )}
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={pending}>
          Log in
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-dashed border-line-strong bg-surface-muted p-4">
        <p className="text-sm font-semibold text-ink">Demo accounts</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          Password for all: <code className="rounded bg-neutral-bg px-1">{DEMO_PASSWORD}</code>. Pick a role to see the permission-aware menu.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {accounts.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(DEMO_PASSWORD);
                }}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-left hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="block text-[13px] font-medium text-ink">{account.role}</span>
                <span className="block truncate text-xs text-ink-muted">{account.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
