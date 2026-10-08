"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { ProductHtmlEditor } from "@/components/admin/products/product-html-editor";
import { formFieldsFor, validateForm } from "@/lib/validation/admin/forms";

/** `hidden` fields with `fromQuery` take their value from the page URL (e.g. ?attributeId=12) when the record has none. */
function initialValues(fields, record, query) {
  const values = {};
  for (const field of fields) {
    const raw = record?.[field.name] ?? (field.fromQuery ? query?.get(field.fromQuery) : null);
    if (field.type === "checkbox") values[field.name] = raw === true || raw === 1 || raw === "1" ? "1" : record ? "" : field.default ? "1" : "";
    else if (field.type === "multiselect") values[field.name] = Array.isArray(raw) ? raw.map(String) : typeof raw === "string" && raw ? raw.split(",").map((s) => s.trim()) : [];
    else if (field.type === "file") values[field.name] = null;
    else if (raw == null) values[field.name] = field.default != null && !record ? String(field.default) : "";
    else if (field.type === "date") values[field.name] = String(raw).slice(0, 10);
    else values[field.name] = String(raw);
  }
  return values;
}

/**
 * Drawer form driven by a resource `form` config. Validates in the browser for
 * quick feedback; the server action validates again and is authoritative.
 */
export function RecordFormDrawer({ open, onClose, title, description, fields: allFields, record, optionSets = {}, requireReason, onSubmit }) {
  const fields = formFieldsFor(allFields, !record);
  const query = useSearchParams();
  const [values, setValues] = useState(() => initialValues(fields, record, query));
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState(null);
  const [saving, startSaving] = useTransition();

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const pickFile = (field, file) => {
    if (file && field.maxBytes && file.size > field.maxBytes) {
      setErrors((e) => ({ ...e, [field.name]: `File must be ${Math.round(field.maxBytes / 1024 / 1024)} MB or smaller.` }));
      return;
    }
    setFiles((f) => ({ ...f, [field.name]: file || undefined }));
    if (errors[field.name]) setErrors((e) => ({ ...e, [field.name]: undefined }));
  };

  /** With file fields the values travel as JSON in a FormData next to the files. */
  const payload = () => {
    if (!fields.some((f) => f.type === "file")) return values;
    const body = new FormData();
    body.set("__values", JSON.stringify(values));
    for (const [name, file] of Object.entries(files)) if (file) body.set(name, file, file.name);
    return body;
  };

  const submit = (event) => {
    event.preventDefault();
    const check = validateForm(fields, values, optionSets);
    const nextErrors = { ...check.errors };
    for (const f of fields) if (f.type === "file" && f.required && !files[f.name] && !record?.[f.name]) nextErrors[f.name] = `${f.label} is required.`;
    if (requireReason && reason.trim().length < 5) nextErrors.__reason = "Please give a reason (at least 5 characters).";
    setErrors(nextErrors);
    const hiddenError = fields.find((f) => f.type === "hidden" && nextErrors[f.name]);
    if (hiddenError) setFormError(`${hiddenError.label} is missing. Open this list from its parent page.`);
    if (Object.keys(nextErrors).length) return;
    startSaving(async () => {
      const result = await onSubmit(payload(), reason.trim());
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
          if (field.type === "hidden") return null;
          const options = optionSets[field.name] ?? field.options ?? [];
          return (
            <Field key={field.name} label={field.label} required={field.required} error={errors[field.name]} hint={field.hint}>
              {({ id, invalid, describedBy }) => {
                const common = { id, name: field.name, value: values[field.name], "aria-invalid": invalid || undefined, "aria-describedby": describedBy };
                if (field.type === "select") return <Select {...common} options={options} placeholder="Select…" onChange={(e) => set(field.name, e.target.value)} />;
                if (field.type === "multiselect")
                  return (
                    <select
                      {...common}
                      multiple
                      size={Math.min(8, Math.max(3, options.length))}
                      className="w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm"
                      onChange={(e) => set(field.name, [...e.target.selectedOptions].map((o) => o.value))}
                    >
                      {options.map((o) => {
                        const value = typeof o === "object" ? String(o.value) : String(o);
                        return (
                          <option key={value} value={value}>
                            {typeof o === "object" ? o.label : o}
                          </option>
                        );
                      })}
                    </select>
                  );
                if (field.type === "textarea") return <Textarea {...common} rows={field.rows ?? 4} maxLength={field.maxLength} onChange={(e) => set(field.name, e.target.value)} />;
                if (field.type === "html") return <ProductHtmlEditor value={values[field.name]} onChange={(html) => set(field.name, html)} />;
                if (field.type === "checkbox") return <Checkbox id={id} label={field.checkboxLabel ?? field.label} checked={values[field.name] === "1"} onChange={(e) => set(field.name, e.target.checked ? "1" : "")} />;
                if (field.type === "color") return <Input {...common} type="color" className="h-9 w-20 p-1" onChange={(e) => set(field.name, e.target.value)} />;
                if (field.type === "file")
                  return (
                    <div className="space-y-2">
                      {record?.[field.name] && field.accept?.startsWith("image") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={record[field.name]} alt="" className="h-16 w-auto rounded border border-line object-contain" />
                      ) : record?.[field.name] ? (
                        <a href={record[field.name]} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-700 hover:underline">Current file</a>
                      ) : null}
                      <input id={id} type="file" accept={field.accept} aria-describedby={describedBy} className="block w-full text-sm" onChange={(e) => pickFile(field, e.target.files?.[0])} />
                    </div>
                  );
                return (
                  <Input
                    {...common}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "password" ? "password" : "text"}
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
