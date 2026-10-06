"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatINR, formatPercent } from "@/lib/format";
import { calculatePricingAction, updatePricingAction } from "@/lib/actions/admin/products";

const verdictLabels = { ok: "Healthy", below_target: "Below target CM", below_floor: "Below floor CM", loss: "Loss-making" };

function Row({ label, value, strong, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="text-sm text-ink-muted">
        {label}
        {hint && <span className="block text-[11px]">{hint}</span>}
      </dt>
      <dd className={strong ? "text-sm font-semibold text-ink tabular" : "text-sm text-ink tabular"}>{value}</dd>
    </div>
  );
}

export function PricingBreakdown({ result }) {
  if (!result) return null;
  const { price, economics } = result;
  return (
    <div className="space-y-4">
      {!price.ok && (
        <Notice tone="danger" title="This price would be rejected">
          <ul className="list-disc pl-4">
            {price.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Notice>
      )}
      <dl className="divide-y divide-line">
        <Row label="Display price (incl. GST)" value={formatINR(price.display)} strong hint="NRV ÷ (1 − take rate)" />
        <Row label="Sale value (ex-GST)" value={formatINR(price.sale)} />
        <Row label="TCS (1% of sale)" value={formatINR(price.tcs)} />
        <Row label="Service charge" value={formatINR(price.serviceCharge)} hint="display − NRV − TCS" />
        <Row label="Service charge ex-GST" value={formatINR(price.serviceChargeExGst)} />
        <Row label="Commission %" value={formatPercent(price.commissionPercent)} />
        <Row label="Seller payout (BSA)" value={formatINR(price.bsa)} strong hint="NRV − TCS" />
      </dl>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Prepaid order", economics.prepaid],
          ["COD order", economics.cod],
        ].map(([label, e]) => (
          <div key={label} className="rounded-lg border border-line p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-ink-muted">{label}</span>
              <StatusBadge status={e.verdict} label={verdictLabels[e.verdict]} />
            </div>
            <p className="text-lg font-semibold text-ink tabular">{formatINR(e.contribution)}</p>
            <p className="text-xs text-ink-muted">Contribution {formatPercent(e.contributionPct)} of collected</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * NRV pricing form. In "calculator" mode it only previews; in "edit" mode it
 * saves through a confirmed, audited server action.
 */
export function PricingPanel({ mode = "calculator", productId, initial, initialResult }) {
  const router = useRouter();
  const { notify } = useToast();
  const [values, setValues] = useState({ mrp: String(initial?.mrp ?? ""), nrv: String(initial?.nrv ?? ""), takeRate: String(initial?.takeRate ?? "35"), gstPercent: String(initial?.gstPercent ?? "18") });
  const [result, setResult] = useState(initialResult ?? null);
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [busy, startBusy] = useTransition();
  const dirty = initial && ["mrp", "nrv", "takeRate", "gstPercent"].some((k) => String(initial[k]) !== values[k]);

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const calculate = (event) => {
    event?.preventDefault();
    startBusy(async () => {
      const r = await calculatePricingAction(values);
      if (r.ok) {
        setResult(r);
        setErrors({});
      } else {
        setErrors(r.fieldErrors ?? {});
        if (!r.fieldErrors) notify({ message: r.message, tone: "error" });
      }
    });
  };

  const save = (reason) =>
    startBusy(async () => {
      const r = await updatePricingAction(productId, values, reason);
      if (r.ok) {
        notify({ message: r.message, tone: "success" });
        setConfirm(false);
        router.refresh();
      } else {
        notify({ message: r.message, tone: "error" });
        if (r.fieldErrors) setErrors(r.fieldErrors);
      }
    });

  return (
    <div className="space-y-5">
      <form onSubmit={calculate} noValidate className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["mrp", "MRP (₹)"],
          ["nrv", "NRV (₹)"],
          ["takeRate", "Take rate %"],
        ].map(([k, label]) => (
          <Field key={k} label={label} required error={errors[k]}>
            {({ id, invalid, describedBy }) => <Input id={id} type="number" inputMode="decimal" step="any" value={values[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={invalid || undefined} aria-describedby={describedBy} />}
          </Field>
        ))}
        <Field label="GST %" required error={errors.gstPercent}>
          {({ id }) => <Select id={id} value={values.gstPercent} onChange={(e) => set("gstPercent", e.target.value)} options={["0", "5", "12", "18", "28"]} />}
        </Field>
        <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-4">
          <Button type="submit" variant="secondary" loading={busy && !confirm}>
            <Calculator className="size-4" aria-hidden /> Calculate
          </Button>
          {mode === "edit" && (
            <Button type="button" disabled={!dirty || !result?.price?.ok || busy} onClick={() => setConfirm(true)}>
              Save new price
            </Button>
          )}
        </div>
      </form>
      <PricingBreakdown result={result} />
      {mode === "edit" && (
        <ConfirmDialog
          open={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={save}
          loading={busy}
          tone="warning"
          title="Change product price?"
          description={result ? `New display price ${formatINR(result.price.display)}. The storefront updates immediately and the change is audited.` : ""}
          confirmLabel="Save price"
          requireReason
        />
      )}
    </div>
  );
}
