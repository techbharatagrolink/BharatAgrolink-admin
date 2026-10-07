"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

export function LoginForm({ next }) {
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
    </>
  );
}
