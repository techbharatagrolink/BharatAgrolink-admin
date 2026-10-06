"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { validateForm } from "@/lib/validation/admin/forms";

function initialValues(fields, record) {
  const values = {};
  for (const field of fields) {
    const raw = record?.[field.name];
    if (raw == null) values[field.name] = "";
    else if (field.type === "date") values[field.name] = String(raw).slice(0, 10);
    else values[field.name] = String(raw);
  }
  return values;
}

/**
 * Drawer form driven by a resource `form` config. Validates in the browser for
 * quick feedback; the server action validates again and is authoritative.
 */
export function RecordFormDrawer({ open, onClose, title, description, fields, record, optionSets = {}, requireReason, onSubmit }) {
  const [values, setValues] = useState(() => initialValues(fields, record));
  const [errors, setErrors] = useState({});
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState(null);
  const [saving, startSaving] = useTransition();

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const check = validateForm(fields, values, optionSets);
    const nextErrors = { ...check.errors };
    if (requireReason && reason.trim().length < 5) nextErrors.__reason = "Please give a reason (at least 5 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    startSaving(async () => {
      const result = await onSubmit(values, reason.trim());
      if (result?.ok) return;
      setFormError(result?.message || "Could not save.");
      if (result?.fieldErrors) setErrors(result.fieldErrors);
    });
  };

  const formId = "record-form";
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" form={formId} loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="space-y-4" noValidate>
        {formError && <Notice tone="danger">{formError}</Notice>}
        {fields.map((field) => {
          const options = optionSets[field.name] ?? field.options ?? [];
          return (
            <Field key={field.name} label={field.label} required={field.required} error={errors[field.name]} hint={field.hint}>
              {({ id, invalid, describedBy }) => {
                const common = { id, name: field.name, value: values[field.name], "aria-invalid": invalid || undefined, "aria-describedby": describedBy };
                if (field.type === "select") return <Select {...common} options={options} placeholder="Select…" onChange={(e) => set(field.name, e.target.value)} />;
                if (field.type === "textarea") return <Textarea {...common} rows={4} maxLength={field.maxLength} onChange={(e) => set(field.name, e.target.value)} />;
                return (
                  <Input
                    {...common}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
                    inputMode={field.type === "number" ? "decimal" : undefined}
                    min={field.min}
                    max={field.max}
                    step={field.type === "number" ? "any" : undefined}
                    maxLength={field.maxLength}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                );
              }}
            </Field>
          );
        })}
        {requireReason && (
          <Field label="Reason for change (saved in the audit log)" required error={errors.__reason}>
            {({ id, invalid, describedBy }) => (
              <Textarea id={id} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
            )}
          </Field>
        )}
      </form>
    </Drawer>
  );
}
