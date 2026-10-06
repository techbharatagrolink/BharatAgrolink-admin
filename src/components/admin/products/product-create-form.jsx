"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startRouteProgress } from "@/components/admin/shell/route-progress";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Field, Input, Select, Switch } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { validateForm } from "@/lib/validation/admin/forms";
import { MAX_VARIATIONS, VARIATION_ATTRIBUTES, validateVariations, variationRowFields } from "@/lib/validation/admin/product-variations";
import { calculatePricingAction, createProductAction } from "@/lib/actions/admin/products";
import { PricingBreakdown } from "./pricing-panel";

const SECTIONS = [
  { title: "Basics", fields: ["name", "vendorId", "categoryId", "brandId"] },
  { title: "Tax, stock and shipping", fields: ["hsn", "stock", "weightKg", "returnPolicy"] },
  { title: "NRV pricing", fields: ["mrp", "nrv", "takeRate", "gstPercent"] },
];

let rowSeq = 0;
const emptyRow = () => ({ key: `row-${++rowSeq}`, label: "", mrp: "", nrv: "", stock: "", weightKg: "" });

function VariationsCard({ value, onChange, errors, clearError }) {
  const update = (patch) => onChange({ ...value, ...patch });
  const updateRow = (i, field, v) => {
    update({ rows: value.rows.map((r, j) => (j === i ? { ...r, [field]: v } : r)) });
    clearError(`variations.${i}.${field}`);
  };
  const removeRow = (i) => update({ rows: value.rows.filter((_, j) => j !== i) });
  const addRow = () => {
    update({ rows: [...value.rows, emptyRow()] });
    clearError("variations");
  };

  return (
    <Card>
      <CardHeader title="Variations" description="Sell the same product in other pack sizes, weights or volumes. Each variation gets its own SKU, price and stock." />
      <CardBody className="space-y-4">
        <Switch
          checked={value.enabled}
          onChange={(enabled) => update({ enabled, rows: enabled && !value.rows.length ? [emptyRow()] : value.rows })}
          label="This product has variations"
          description="The details above become the base product. Add the other variations below."
        />
        {value.enabled && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Variation type" required error={errors.attribute}>
                {({ id, invalid, describedBy }) => (
                  <Select id={id} value={value.attribute} onChange={(e) => update({ attribute: e.target.value })} options={VARIATION_ATTRIBUTES} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
                )}
              </Field>
              <Field label="Base product variation" required hint="For example 1 kg or 500 ml" error={errors.baseLabel}>
                {({ id, invalid, describedBy }) => (
                  <Input
                    id={id}
                    value={value.baseLabel}
                    maxLength={40}
                    onChange={(e) => {
                      update({ baseLabel: e.target.value });
                      clearError("baseLabel");
                    }}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
            </div>

            <ol className="space-y-3">
              {value.rows.map((row, i) => (
                <li key={row.key} className="rounded-xl border border-line bg-surface-muted/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-ink">Variation {i + 1}</p>
                    <Button type="button" size="xs" variant="ghost" onClick={() => removeRow(i)} aria-label={`Remove variation ${i + 1}`}>
                      <Trash2 className="size-3.5" aria-hidden /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {variationRowFields.map((f) => (
                      <Field key={f.name} label={f.label} required error={errors[`variations.${i}.${f.name}`]} className={f.name === "label" ? "col-span-2 md:col-span-1" : undefined}>
                        {({ id, invalid, describedBy }) => (
                          <Input
                            id={id}
                            type={f.type === "number" ? "number" : "text"}
                            step="any"
                            inputMode={f.type === "number" ? "decimal" : undefined}
                            maxLength={f.maxLength}
                            placeholder={f.name === "label" ? "e.g. 5 kg" : undefined}
                            value={row[f.name]}
                            onChange={(e) => updateRow(i, f.name, e.target.value)}
                            aria-invalid={invalid || undefined}
                            aria-describedby={describedBy}
                          />
                        )}
                      </Field>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
            {errors.variations && <p className="text-xs text-danger-ink" role="alert">{errors.variations}</p>}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" size="sm" onClick={addRow} disabled={value.rows.length >= MAX_VARIATIONS}>
                <Plus className="size-4" aria-hidden /> Add variation
              </Button>
              <p className="text-xs text-ink-muted">
                {value.rows.length} of {MAX_VARIATIONS} · Take rate and GST come from the base product.
              </p>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

export function ProductCreateForm({ fields }) {
  const router = useRouter();
  const { notify } = useToast();
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, f.name === "takeRate" ? "35" : f.name === "gstPercent" ? "18" : ""])));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [variations, setVariations] = useState({ enabled: false, attribute: VARIATION_ATTRIBUTES[0], baseLabel: "", rows: [] });
  const [busy, startBusy] = useTransition();
  const clearError = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  const set = (k, v) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const previewPrice = () =>
    startBusy(async () => {
      const r = await calculatePricingAction({ mrp: values.mrp, nrv: values.nrv, takeRate: values.takeRate, gstPercent: values.gstPercent });
      if (r.ok) setPreview(r);
      else setErrors((e) => ({ ...e, ...(r.fieldErrors ?? {}) }));
    });

  const submit = (event) => {
    event.preventDefault();
    const check = validateForm(fields, values);
    const variationCheck = validateVariations(variations);
    setErrors({ ...check.errors, ...variationCheck.errors });
    if (!check.ok || !variationCheck.ok) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setFormError(null);
    startBusy(async () => {
      const r = await createProductAction({ ...values, variations: { ...variations, rows: variations.rows.map(({ key, ...row }) => row) } });
      if (r.ok) {
        notify({ message: r.message, tone: "success" });
        startRouteProgress();
        router.push(`/admin/products/${r.id}`);
      } else {
        setFormError(r.message);
        if (r.fieldErrors) setErrors(r.fieldErrors);
      }
    });
  };

  const renderField = (name) => {
    const f = byName[name];
    return (
      <Field key={name} label={f.label} required={f.required} error={errors[name]} className={name === "name" ? "sm:col-span-2" : undefined}>
        {({ id, invalid, describedBy }) =>
          f.type === "select" ? (
            <Select id={id} value={values[name]} onChange={(e) => set(name, e.target.value)} options={f.options} placeholder="Select…" aria-invalid={invalid || undefined} aria-describedby={describedBy} />
          ) : (
            <Input id={id} type={f.type === "number" ? "number" : "text"} step="any" inputMode={f.type === "number" ? "decimal" : undefined} value={values[name]} onChange={(e) => set(name, e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
          )
        }
      </Field>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 xl:grid-cols-3">
      <div className="min-w-0 space-y-4 xl:col-span-2">
        {formError && <Notice tone="danger">{formError}</Notice>}
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <CardHeader title={section.title} actions={section.title === "NRV pricing" ? <Button type="button" size="xs" onClick={previewPrice} loading={busy}>Preview price</Button> : null} />
            <CardBody className="grid gap-4 sm:grid-cols-2">{section.fields.map(renderField)}</CardBody>
          </Card>
        ))}
        <VariationsCard value={variations} onChange={setVariations} errors={errors} clearError={clearError} />
      </div>
      <div className="min-w-0 space-y-4">
        <Card className="xl:sticky xl:top-20">
          <CardHeader title="Price preview" description="Calculated by the server pricing engine" />
          <CardBody className="space-y-4">
            {preview ? <PricingBreakdown result={preview} /> : <p className="text-sm text-ink-muted">Enter MRP, NRV and take rate, then choose “Preview price”.</p>}
            <Button type="submit" variant="primary" className="w-full" loading={busy}>
              Create product
            </Button>
            <p className="text-xs text-ink-muted">New products start as Pending and must be approved before they go live.</p>
          </CardBody>
        </Card>
      </div>
    </form>
  );
}
