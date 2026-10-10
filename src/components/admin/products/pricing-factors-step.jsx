"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { loadProductPricingAction, previewProductPricingAction, resetProductActualsAction, saveProductPricingAction } from "@/lib/actions/admin/pricing-factors";

const GST_OPTIONS = [0, 5, 12, 18, 28].map((value) => ({ value: String(value), label: `${value}%` }));
const MODES = [
  ["TAKE_RATE", "Set take rate", "Display price follows the take rate."],
  ["FROM_ACTUALS", "Rebuild from actuals", "Take rate is solved from edited actuals and the target margin."],
];

/** "6.5" -> 650 without floating point; null when not a percentage with up to 2 decimals. */
function pctToBps(value) {
  const match = /^(-?)(\d{1,3})(?:\.(\d{0,2}))?$/.exec(String(value ?? "").trim());
  if (!match) return null;
  const bps = Number(match[2]) * 100 + Number((match[3] || "").padEnd(2, "0"));
  return match[1] ? -bps : bps;
}
const bpsToPct = (bps) => (bps == null ? "—" : `${(bps < 0 ? "-" : "")}${Math.floor(Math.abs(bps) / 100)}.${String(Math.abs(bps) % 100).padStart(2, "0")}%`);
const trimRate = (rate) => (rate == null ? "" : String(rate).replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1"));
const money = (value) => (value == null ? "—" : formatINR(value));

/** "131.38" - "148.07" on the API's 2-decimal strings, in integer paise. */
function subtractMoney(a, b) {
  const paise = (s) => {
    const m = /^(-?)(\d+)\.(\d{2})$/.exec(String(s ?? ""));
    return m ? (m[1] ? -1n : 1n) * (BigInt(m[2]) * 100n + BigInt(m[3])) : null;
  };
  const x = paise(a);
  const y = paise(b);
  if (x === null || y === null) return "—";
  const d = x - y;
  const abs = d < 0n ? -d : d;
  return `${d < 0n ? "-" : ""}${abs / 100n}.${String(abs % 100n).padStart(2, "0")}`;
}

function achievementTone(bps) {
  if (bps == null) return "neutral";
  if (bps <= 10_000) return "success";
  if (bps <= 11_500) return "warning";
  return "danger";
}

function draftFrom(pricing) {
  return {
    mode: pricing.input.mode,
    takeRate: trimRate(pricing.input.takeRate),
    targetMargin: bpsToPct(pricing.input.targetMarginBps).replace("%", ""),
    mrp: pricing.input.mrp ?? "",
    nrv: pricing.input.nrv ?? "",
    gstPercent: pricing.input.gstPercent == null ? "" : String(pricing.input.gstPercent),
    hsn: pricing.input.hsn ?? "",
    factors: (pricing.result.factors || []).map((f) => ({ code: f.code, overridden: f.overridden, actual: f.overridden ? f.actualAmount : "", notes: f.notes || "" })),
  };
}

function SummaryRow({ label, value, hint, strong, tone }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-xs text-ink-muted">{label}{hint && <span className="block text-[11px]">{hint}</span>}</span>
      <span className={`text-sm tabular-nums ${strong ? "font-semibold text-ink" : "text-ink-soft"} ${tone === "danger" ? "text-danger-ink" : tone === "warning" ? "text-warning-ink" : ""}`}>{value}</span>
    </div>
  );
}

/** Step 3 "Pricing & Tax" with PRICING_FACTORS_V1: take rate -> display price -> service charge -> cost factors. */
export function PricingFactorsStep({ productId, canEdit, onPriced }) {
  const { notify } = useToast();
  const [variantId, setVariantId] = useState(0);
  const [pricing, setPricing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const requestId = useRef(0);

  const apply = useCallback((next) => {
    setPricing(next);
    setDraft(draftFrom(next));
    setPreview(null);
    setDirty(false);
    if (next.variantId === 0 && onPriced) {
      onPriced({ displayPrice: next.result.displayPrice ?? next.currentDisplayPrice, mrp: next.input.mrp, nrv: next.input.nrv, gstPercent: next.input.gstPercent, hsn: next.input.hsn, saved: next.saved });
    }
  }, [onPriced]);

  useEffect(() => {
    let live = true;
    setLoadError("");
    loadProductPricingAction(productId, variantId).then((res) => {
      if (!live) return;
      if (res.ok) apply(res.pricing);
      else setLoadError(res.message);
    });
    return () => { live = false; };
  }, [productId, variantId, apply]);

  const body = useCallback((d) => ({
    variantId,
    mode: d.mode,
    takeRate: d.mode === "TAKE_RATE" ? d.takeRate : undefined,
    targetMarginBps: d.mode === "FROM_ACTUALS" ? pctToBps(d.targetMargin) ?? undefined : undefined,
    mrp: d.mrp,
    nrv: d.nrv,
    ...(variantId === 0 ? { gstPercent: d.gstPercent, hsn: d.hsn } : {}),
    factors: d.factors,
  }), [variantId]);

  useEffect(() => {
    if (!dirty || !draft) return undefined;
    const id = ++requestId.current;
    setPreviewing(true);
    const timer = setTimeout(async () => {
      const res = await previewProductPricingAction(productId, body(draft));
      if (id !== requestId.current) return;
      setPreviewing(false);
      if (res.ok) setPreview(res.pricing);
      else setPreview({ result: { ok: false, errors: res.errors?.length ? res.errors : [{ code: res.code, message: res.message }], warnings: [] } });
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, dirty, productId, body]);

  if (loadError) return <p className="rounded-lg bg-danger-bg p-3 text-sm text-danger-ink">{loadError}</p>;
  if (!pricing || !draft) return <p className="text-sm text-ink-muted">Loading pricing…</p>;

  const result = preview?.result ?? pricing.result;
  const resultFactors = new Map((result.factors || []).map((f) => [f.code, f]));
  const config = pricing.config;
  const isVariant = variantId !== 0;
  const update = (patch) => { setDraft((current) => ({ ...current, ...patch })); setDirty(true); };
  const setFactor = (code, patch) => update({ factors: draft.factors.map((f) => (f.code === code ? { ...f, ...patch } : f)) });
  const errors = result.errors || [];
  const warnings = result.warnings || [];
  const canSave = canEdit && !pending && !previewing && result.ok !== false && errors.length === 0;
  const anyOverridden = draft.factors.some((f) => f.overridden);
  const minRate = config.minTakeRateBps / 100;
  const maxRate = config.maxTakeRateBps / 100;

  const save = () => startTransition(async () => {
    const res = await saveProductPricingAction(productId, { ...body(draft), reason });
    notify({ message: res.ok ? res.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) { setReason(""); apply(res.pricing); } else if (res.result) setPreview({ result: { ...res.result, errors: res.errors } });
  });
  const resetActuals = () => {
    if (!pricing.saved) { update({ factors: draft.factors.map((f) => ({ ...f, overridden: false, actual: "" })) }); return; }
    startTransition(async () => {
      const res = await resetProductActualsAction(productId, variantId, [], reason || "Reset actuals to targets");
      notify({ message: res.message, tone: res.ok ? "success" : "error" });
      if (res.ok) apply(res.pricing);
    });
  };

  return (
    <div className="space-y-4" data-testid="pricing-factors-step">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">3. Pricing &amp; Tax</h2>
          <p className="text-xs text-ink-muted">Take rate → display price → service charge → cost factors. Every amount is calculated on the server.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {pricing.variants.length > 1 && (
            <Select aria-label="Variant" value={String(variantId)} onChange={(event) => setVariantId(Number(event.target.value))} options={pricing.variants.map((v) => ({ value: String(v.id), label: `${v.label}${v.priced ? "" : " (not priced)"}` }))} />
          )}
          {pricing.saved ? <Badge tone="success" dot>Saved</Badge> : <Badge tone="warning" dot>Not saved yet</Badge>}
          {pricing.stale && <Badge tone="danger" dot>Catalog price changed to {money(pricing.currentDisplayPrice)}</Badge>}
          {dirty && <Badge tone="info" dot>{previewing ? "Calculating…" : "Unsaved changes"}</Badge>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Field label="MRP (₹)" required>{({ id }) => <Input id={id} inputMode="decimal" value={draft.mrp} onChange={(e) => update({ mrp: e.target.value })} disabled={!canEdit} />}</Field>
        <Field label="NRV (₹)" required hint="What the seller receives. Whole rupees.">{({ id }) => <Input id={id} inputMode="numeric" value={draft.nrv} onChange={(e) => update({ nrv: e.target.value })} disabled={!canEdit} />}</Field>
        <Field label="GST %" required hint={isVariant ? "Set on the base product." : undefined}>{({ id }) => <Select id={id} value={draft.gstPercent} onChange={(e) => update({ gstPercent: e.target.value })} placeholder="Select" options={GST_OPTIONS} disabled={!canEdit || isVariant} />}</Field>
        <Field label="HSN Code" required hint={isVariant ? "Set on the base product." : "GST is not derived from HSN; check both."}>{({ id }) => <Input id={id} value={draft.hsn} onChange={(e) => update({ hsn: e.target.value })} disabled={!canEdit || isVariant} />}</Field>
      </div>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pricing mode">
        {MODES.map(([value, label, hint]) => (
          <button key={value} type="button" role="radio" aria-checked={draft.mode === value} disabled={!canEdit} onClick={() => update({ mode: value })} className={`rounded-lg border px-3 py-2 text-left text-sm ${draft.mode === value ? "border-brand-600 bg-brand-50 font-semibold" : "border-line"}`}>
            {label}<span className="block text-xs font-normal text-ink-muted">{hint}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3 rounded-lg border border-line p-3">
          {draft.mode === "TAKE_RATE" ? (
            <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
              <Field label={`Take rate (${minRate}% – ${maxRate}%)`} hint="Share of the display price kept by the platform: 1 − NRV / display price.">
                {({ id }) => <input id={id} type="range" className="w-full accent-brand-600" min={minRate} max={maxRate} step="0.01" value={Number(draft.takeRate) || minRate} onChange={(e) => update({ takeRate: e.target.value })} disabled={!canEdit} />}
              </Field>
              <Field label="Take rate %">{({ id }) => <Input id={id} inputMode="decimal" value={draft.takeRate} onChange={(e) => update({ takeRate: e.target.value })} disabled={!canEdit} />}</Field>
            </div>
          ) : (
            <div className="grid items-end gap-3 sm:grid-cols-2">
              <Field label="Target margin %" hint="Platform margin after net service charge pays the actual costs.">{({ id }) => <Input id={id} inputMode="decimal" value={draft.targetMargin} onChange={(e) => update({ targetMargin: e.target.value })} disabled={!canEdit} />}</Field>
              <div className="pb-2 text-sm">Effective take rate <span className="font-semibold tabular-nums">{result.takeRate ? `${trimRate(result.takeRate)}%` : "—"}</span></div>
            </div>
          )}
          <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg bg-surface-muted p-3">
            <div>
              <p className="text-xs text-ink-muted">Display price (customer pays, incl. GST)</p>
              <p className="text-2xl font-semibold tabular-nums text-ink" data-testid="display-price">{money(result.displayPrice)}</p>
            </div>
            <div className="text-right text-xs text-ink-muted">
              <p>Service charge is {bpsToPct(result.scPctOfDpBps)} of display price</p>
              {result.limits?.maxTakeRate && <p>Max take rate under MRP: {result.limits.maxTakeRate}%</p>}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-muted">
                  <th className="py-2 pr-2 font-medium">Cost factor</th>
                  <th className="py-2 pr-2 text-right font-medium">Target %</th>
                  <th className="py-2 pr-2 text-right font-medium">Target ₹</th>
                  <th className="py-2 pr-2 font-medium">Actual ₹</th>
                  <th className="py-2 pr-2 text-right font-medium">Achievement</th>
                  <th className="py-2 text-right font-medium">Variance ₹</th>
                </tr>
              </thead>
              <tbody>
                {draft.factors.map((f) => {
                  const r = resultFactors.get(f.code) || {};
                  return (
                    <tr key={f.code} className="border-b border-line" data-factor={f.code}>
                      <td className="py-2 pr-2">{r.label || f.code}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">{bpsToPct(r.targetBps)}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">{money(r.targetAmount)}</td>
                      <td className="py-2 pr-2">
                        <div className="flex items-center gap-2">
                          <Input aria-label={`${r.label || f.code} actual`} className="w-28 text-right" inputMode="decimal" value={f.overridden ? f.actual : (r.actualAmount ?? "")} onChange={(e) => setFactor(f.code, { overridden: true, actual: e.target.value })} disabled={!canEdit} />
                          {f.overridden && <Badge tone="info">Edited</Badge>}
                          {f.overridden && canEdit && <button type="button" className="text-xs text-brand-700 underline" onClick={() => setFactor(f.code, { overridden: false, actual: "" })}>Reset</button>}
                        </div>
                      </td>
                      <td className="py-2 pr-2 text-right"><Badge tone={achievementTone(r.achievementBps)}>{bpsToPct(r.achievementBps)}</Badge></td>
                      <td className={`py-2 text-right tabular-nums ${r.varianceAmount && !String(r.varianceAmount).startsWith("-") && r.varianceAmount !== "0.00" ? "text-danger-ink" : "text-success-ink"}`}>{r.varianceAmount ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="text-sm font-semibold">
                  <td className="py-2 pr-2">Total</td>
                  <td />
                  <td className="py-2 pr-2 text-right tabular-nums">{money(result.totalFactorTarget)}</td>
                  <td className="py-2 pr-2 tabular-nums">{money(result.totalFactorActual)}</td>
                  <td />
                  <td className="py-2 text-right tabular-nums">{subtractMoney(result.totalFactorActual, result.totalFactorTarget)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" disabled={!anyOverridden || draft.mode === "FROM_ACTUALS"} onClick={() => update({ mode: "FROM_ACTUALS" })}>Rebuild take rate from actuals</Button>
              <Button size="sm" variant="secondary" disabled={!anyOverridden || pending} onClick={resetActuals}>Reset all actuals</Button>
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-lg border border-line p-3" data-testid="pricing-summary">
            <p className="mb-1 text-xs font-semibold text-ink-muted">Summary</p>
            <SummaryRow label="Display price" value={money(result.displayPrice)} strong />
            <SummaryRow label="Taxable value" hint="Display price ÷ (1 + GST)" value={money(result.taxableValue)} />
            <SummaryRow label="TCS" hint={`${bpsToPct(config.tcsBps)} of taxable value`} value={money(result.tcs)} />
            <SummaryRow label="NRV to seller" value={money(draft.nrv)} />
            <SummaryRow label="Service charge" hint="Display price − NRV − TCS" value={money(result.serviceCharge)} strong />
            <SummaryRow label="GST on service charge" value={money(result.scGst)} />
            <SummaryRow label="Net service charge" value={money(result.netServiceCharge)} strong />
            <SummaryRow label="Cost factors (actual)" value={money(result.totalFactorActual)} />
            <SummaryRow label="Platform margin" value={`${money(result.platformMargin)} · ${bpsToPct(result.platformMarginBps)}`} strong tone={result.platformMarginBps < 0 ? "danger" : result.platformMarginBps < config.minMarginBps ? "warning" : undefined} />
            <div className="mt-2 border-t border-line pt-2">
              <SummaryRow label="TCS balance retained" hint="Memo: TCS collected, not part of margin" value={money(result.tcsBalance)} />
              <SummaryRow label="Seller payout" hint="NRV − TCS" value={money(result.sellerPayout)} />
            </div>
          </div>

          {errors.length > 0 && (
            <ul className="space-y-1 rounded-lg bg-danger-bg p-3 text-sm text-danger-ink" data-testid="pricing-errors">
              {errors.map((e, i) => <li key={`${e.code}-${i}`}>{e.message}</li>)}
            </ul>
          )}
          {warnings.length > 0 && (
            <ul className="space-y-1 rounded-lg bg-warning-bg p-3 text-sm text-warning-ink" data-testid="pricing-warnings">
              {warnings.map((w, i) => <li key={`${w.code}-${i}`}>{w.message}</li>)}
            </ul>
          )}

          {canEdit && (
            <div className="space-y-2 rounded-lg border border-line p-3">
              <Field label="Reason (optional)">{({ id }) => <Input id={id} value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} placeholder="Why the price changed" />}</Field>
              <Button variant="primary" className="w-full" loading={pending} disabled={!canSave} onClick={save}>Save pricing</Button>
              <p className="text-[11px] text-ink-muted">Saving writes the display price to the catalog and records a history entry.</p>
            </div>
          )}

          {pricing.history?.length > 0 && (
            <div className="rounded-lg border border-line p-3">
              <p className="mb-1 text-xs font-semibold text-ink-muted">Recent changes</p>
              <ul className="space-y-1 text-xs">
                {pricing.history.map((h) => (
                  <li key={h.id} className="flex justify-between gap-2">
                    <span className="text-ink-muted">{new Date(h.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {h.actor || "admin"}{h.reason ? ` · ${h.reason}` : ""}</span>
                    <span className="tabular-nums text-ink">{h.before ? `${money(h.before)} → ` : ""}{money(h.after)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
