"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { validateForm } from "@/lib/validation/admin/forms";
import { saveSettingsAction } from "@/lib/actions/admin/settings";

const toStrings = (values) => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v == null ? "" : String(v)]));

export function SettingsForm({ section, fields, values, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [initial, setInitial] = useState(() => toStrings(values));
  const [form, setForm] = useState(() => toStrings(values));
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [busy, startBusy] = useTransition();
  const dirty = fields.some((f) => form[f.name] !== initial[f.name]);

  const review = (event) => {
    event.preventDefault();
    const check = validateForm(fields, form);
    setErrors(check.errors);
    if (check.ok) setConfirm(true);
  };

  const save = (reason) =>
    startBusy(async () => {
      const r = await saveSettingsAction(section, form, reason);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.fieldErrors) setErrors(r.fieldErrors);
      if (r.ok) {
        setInitial(form);
        setConfirm(false);
        router.refresh();
      } else if (r.fieldErrors && !r.fieldErrors.__reason) setConfirm(false);
    });

  return (
    <form onSubmit={review} className="space-y-4" noValidate>
      {!canEdit && <Notice>You can view these settings. Changing them needs edit permission.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.name} label={f.label} required={f.required} error={errors[f.name]}>
            {({ id, invalid, describedBy }) => {
              const common = { id, value: form[f.name], disabled: !canEdit, "aria-invalid": invalid || undefined, "aria-describedby": describedBy, onChange: (e) => setForm({ ...form, [f.name]: e.target.value }) };
              if (f.type === "select") return <Select {...common} options={f.options} />;
              return <Input {...common} type={f.type === "number" ? "number" : f.type === "email" ? "email" : f.type === "password" ? "password" : "text"} inputMode={f.type === "number" ? "numeric" : undefined} min={f.min} max={f.max} maxLength={f.maxLength} autoComplete={f.type === "password" ? "new-password" : undefined} />;
            }}
          </Field>
        ))}
      </div>
      {canEdit && (
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="secondary" disabled={!dirty || busy} onClick={() => { setForm(initial); setErrors({}); }}>Discard</Button>
          <Button type="submit" variant="primary" disabled={!dirty}>Save changes</Button>
        </div>
      )}
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={save} loading={busy} tone="warning" title="Save settings?" description="These settings affect the live marketplace. The change and your reason are written to the audit log." confirmLabel="Save" requireReason />
    </form>
  );
}
