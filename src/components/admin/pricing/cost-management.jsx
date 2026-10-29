"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { StatCard, StatGrid } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR, formatNumber } from "@/lib/format";
import { deleteCostFactorAction, saveCostFactorAction, savePricingConfigAction } from "@/lib/actions/admin/pricing-factors";

const STATUS_FILTERS = [
  ["all", "All"],
  ["negative", "Negative margin"],
  ["low", "Below minimum"],
  ["healthy", "Healthy"],
  ["overridden", "Edited actuals"],
];
const CONFIG_FIELDS = [
  ["defaultTakeRateBps", "Default take rate"],
  ["minTakeRateBps", "Minimum take rate"],
  ["maxTakeRateBps", "Maximum take rate"],
  ["defaultTargetMarginBps", "Default target margin"],
  ["minMarginBps", "Minimum margin (warning)"],
  ["minDenominatorBps", "Minimum price denominator"],
  ["scGstBps", "GST on service charge"],
  ["tcsBps", "TCS rate (of taxable value)"],
];

const bpsToPct = (bps) => (bps == null ? "—" : `${bps < 0 ? "-" : ""}${Math.floor(Math.abs(bps) / 100)}.${String(Math.abs(bps) % 100).padStart(2, "0")}%`);
const bpsToInput = (bps) => bpsToPct(bps).replace("%", "");
function pctToBps(value) {
  const match = /^(\d{1,3})(?:\.(\d{0,2}))?$/.exec(String(value ?? "").trim());
  return match ? Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0")) : null;
}
const marginTone = (bps, min) => (bps < 0 ? "danger" : bps < min ? "warning" : "success");

function FactorRow({ factor, permissions, onSaved }) {
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState({ label: factor.label, target: bpsToInput(factor.defaultTargetBps), active: factor.active });
  const changed = draft.label !== factor.label || draft.target !== bpsToInput(factor.defaultTargetBps) || draft.active !== factor.active;
  const save = () => startTransition(async () => {
    const bps = pctToBps(draft.target);
    if (bps == null) { notify({ message: "Target % needs up to 2 decimals.", tone: "error" }); return; }
    const res = await saveCostFactorAction(factor.id, { label: draft.label, defaultTargetBps: bps, active: draft.active });
    notify({ message: res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) onSaved();
  });
  const remove = () => startTransition(async () => {
    const res = await deleteCostFactorAction(factor.id);
    notify({ message: res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) onSaved();
  });
  const FIELD_LABEL = "text-[10.5px] font-medium uppercase tracking-wide text-ink-muted xl:hidden";
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-2 border-b border-line p-3 text-sm xl:grid-cols-[70px_minmax(0,1fr)_90px_80px_70px_90px_90px_100px_auto] xl:items-center xl:gap-3 xl:px-3 xl:py-2"
      data-factor={factor.code}
    >
      <div className="col-span-2 xl:col-span-1">
        <p className={FIELD_LABEL}>Code</p>
        <p className="font-mono text-xs">{factor.code}</p>
      </div>
      <div className="col-span-2 xl:col-span-1">
        <p className={FIELD_LABEL}>Label</p>
        {permissions.edit ? <Input aria-label={`${factor.code} label`} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /> : factor.label}
      </div>
      <div>
        <p className={FIELD_LABEL}>Target %</p>
        {permissions.edit ? <Input aria-label={`${factor.code} target %`} className="w-20 xl:text-right" value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} /> : <p className="xl:text-right">{bpsToPct(factor.defaultTargetBps)}</p>}
      </div>
      <div>
        <p className={FIELD_LABEL}>Priced rows</p>
        <p className="tabular-nums xl:text-right">{formatNumber(factor.rows)}</p>
      </div>
      <div>
        <p className={FIELD_LABEL}>Edited</p>
        <p className="tabular-nums xl:text-right">{formatNumber(factor.overridden)}</p>
      </div>
      <div>
        <p className={FIELD_LABEL}>Target ₹</p>
        <p className="tabular-nums xl:text-right">{formatINR(factor.targetTotal)}</p>
      </div>
      <div>
        <p className={FIELD_LABEL}>Actual ₹</p>
        <p className="tabular-nums xl:text-right">{formatINR(factor.actualTotal)}</p>
      </div>
      <div>
        <p className={FIELD_LABEL}>Achievement</p>
        <p className="xl:text-right">{factor.achievementBps == null ? "—" : <Badge tone={factor.achievementBps <= 10_000 ? "success" : factor.achievementBps <= 11_500 ? "warning" : "danger"}>{bpsToPct(factor.achievementBps)}</Badge>}</p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-2 xl:col-span-1 xl:justify-end">
        {permissions.edit ? (
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active</label>
        ) : (
          <Badge tone={factor.active ? "success" : "neutral"}>{factor.active ? "Active" : "Inactive"}</Badge>
        )}
        {permissions.edit && <Button size="sm" disabled={!changed} loading={pending} onClick={save}>Save</Button>}
        {permissions.remove && <Button size="sm" variant="secondary" loading={pending} onClick={remove}>Delete</Button>}
      </div>
    </div>
  );
}

function AddFactor({ onSaved }) {
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState({ code: "", label: "", target: "" });
  const add = () => startTransition(async () => {
    const bps = pctToBps(draft.target);
    if (bps == null) { notify({ message: "Target % needs up to 2 decimals.", tone: "error" }); return; }
    const res = await saveCostFactorAction(null, { code: draft.code, label: draft.label, defaultTargetBps: bps });
    notify({ message: res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) { setDraft({ code: "", label: "", target: "" }); onSaved(); }
  });
  return (
    <div className="grid items-end gap-3 border-t border-line p-3 sm:grid-cols-[160px_minmax(0,1fr)_120px_auto]">
      <Field label="Code">{({ id }) => <Input id={id} value={draft.code} placeholder="WAREHOUSING" onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} />}</Field>
      <Field label="Label">{({ id }) => <Input id={id} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />}</Field>
      <Field label="Target % of DP">{({ id }) => <Input id={id} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} />}</Field>
      <Button loading={pending} disabled={!draft.code || !draft.label || draft.target === ""} onClick={add}>Add factor</Button>
    </div>
  );
}

function ConfigCard({ config, canEdit, onSaved }) {
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const initial = () => ({ ...Object.fromEntries(CONFIG_FIELDS.map(([key]) => [key, bpsToInput(config[key])])), roundingMode: config.roundingMode, fromActualsFixed: config.fromActualsFixed, notes: "" });
  const [draft, setDraft] = useState(initial);
  const save = () => startTransition(async () => {
    const body = { roundingMode: draft.roundingMode, fromActualsFixed: draft.fromActualsFixed, notes: draft.notes };
    for (const [key, label] of CONFIG_FIELDS) {
      const bps = pctToBps(draft[key]);
      if (bps == null) { notify({ message: `${label}: enter a percentage with up to 2 decimals.`, tone: "error" }); return; }
      body[key] = bps;
    }
    const res = await savePricingConfigAction(body);
    notify({ message: res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) onSaved();
  });
  return (
    <Card>
      <CardHeader title="Pricing rates" description={`Active configuration${config.configId ? ` #${config.configId}` : ""}. Saving creates a new version; saved prices change only when each product is saved again.`} />
      <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CONFIG_FIELDS.map(([key, label]) => (
          <Field key={key} label={`${label} %`}>{({ id }) => <Input id={id} value={draft[key]} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />}</Field>
        ))}
        <Field label="Rounding">{({ id }) => <Select id={id} value={draft.roundingMode} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, roundingMode: e.target.value })} options={[{ value: "PAISE", label: "To the paisa" }, { value: "RUPEE", label: "To the rupee (never above MRP)" }]} />}</Field>
        <Field label="Rebuild from actuals fixes">{({ id }) => <Select id={id} value={draft.fromActualsFixed} disabled={!canEdit} onChange={(e) => setDraft({ ...draft, fromActualsFixed: e.target.value })} options={[{ value: "OVERRIDDEN", label: "Only edited actuals" }, { value: "ALL", label: "All current actuals" }]} />}</Field>
        {canEdit && (
          <>
            <Field label="Change note" className="sm:col-span-2">{({ id }) => <Input id={id} value={draft.notes} maxLength={500} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />}</Field>
            <div className="flex items-end gap-2 sm:col-span-2 xl:col-span-4">
              <Button variant="primary" loading={pending} onClick={save}>Save as new version</Button>
              <Button variant="secondary" disabled={pending} onClick={() => setDraft(initial())}>Undo changes</Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

/** Cost Management for PRICING_FACTORS_V1: portfolio margin, factor master, rates and per-product margins. */
export function CostManagement({ summary, meta, factors, config, filters, permissions }) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q);
  const totals = summary.totals;
  const usage = new Map((summary.factors || []).map((f) => [f.id, f]));
  const refresh = () => router.refresh();
  const go = (patch) => {
    const next = new URLSearchParams({ q: filters.q, status: filters.status, page: String(filters.page), ...patch });
    for (const [key, value] of [...next.entries()]) if (!value || (key === "status" && value === "all") || (key === "page" && value === "1")) next.delete(key);
    router.push(`/admin/pricing/cost-management${next.size ? `?${next}` : ""}`);
  };
  const pages = Math.max(1, Math.ceil((meta?.total ?? 0) / (meta?.limit ?? 25)));

  return (
    <div className="space-y-4" data-testid="cost-management">
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="Priced listings" value={formatNumber(totals.priced)} hint={`${formatNumber(totals.fromActuals)} rebuilt from actuals`} />
        <StatCard label="Not priced yet" value={formatNumber(totals.unpriced)} hint="Active offers without a saved price" tone="neutral" />
        <StatCard label="Negative margin" value={formatNumber(totals.negative)} tone={totals.negative ? "danger" : "neutral"} />
        <StatCard label="Below minimum" value={formatNumber(totals.low)} hint={`Under ${bpsToPct(config.minMarginBps)}`} tone={totals.low ? "warning" : "neutral"} />
        <StatCard label="Portfolio margin" value={totals.marginBps == null ? "—" : bpsToPct(totals.marginBps)} hint={formatINR(totals.marginTotal)} tone="info" />
        <StatCard label="TCS balance retained" value={formatINR(totals.tcsBalanceTotal)} hint="Memo, not part of margin" tone="neutral" />
      </StatGrid>

      <Card>
        <CardHeader title="Cost factors" description="Each factor's target is a % of the display price. Changing a target applies to a product the next time its price is saved." />
        <div>
          <div className="hidden border-y border-line bg-surface-muted px-3 py-2 text-xs text-ink-muted xl:grid xl:grid-cols-[70px_minmax(0,1fr)_90px_80px_70px_90px_90px_100px_auto] xl:items-center xl:gap-3">
            <span className="font-medium">Code</span>
            <span className="font-medium">Label</span>
            <span className="text-right font-medium">Target %</span>
            <span className="text-right font-medium">Priced rows</span>
            <span className="text-right font-medium">Edited</span>
            <span className="text-right font-medium">Target ₹</span>
            <span className="text-right font-medium">Actual ₹</span>
            <span className="text-right font-medium">Achievement</span>
            <span />
          </div>
          {factors.map((f) => (
            <FactorRow key={`${f.id}-${f.updatedAt}`} factor={{ ...f, ...(usage.get(f.id) ? { rows: usage.get(f.id).rows, overridden: usage.get(f.id).overridden, targetTotal: usage.get(f.id).targetTotal, actualTotal: usage.get(f.id).actualTotal, achievementBps: usage.get(f.id).achievementBps } : { rows: 0, overridden: 0 }) }} permissions={permissions} onSaved={refresh} />
          ))}
        </div>
        {permissions.add && <AddFactor onSaved={refresh} />}
      </Card>

      <ConfigCard key={config.configId} config={config} canEdit={permissions.edit} onSaved={refresh} />

      <Card>
        <CardHeader title="Contribution margin" description="Lowest contribution margin first. Open a product to change its take rate or actual costs in Step 3." />
        <div className="flex flex-wrap items-end gap-2 border-b border-line p-3">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); go({ q: query.trim(), page: "1" }); }}>
            <Input aria-label="Search products" value={query} placeholder="Product id, name or SKU" onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit" size="sm">Search</Button>
          </form>
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map(([value, label]) => (
              <button key={value} type="button" onClick={() => go({ status: value, page: "1" })} className={`rounded-full border px-3 py-1 text-xs ${filters.status === value ? "border-brand-600 bg-brand-50 font-semibold" : "border-line"}`}>{label}</button>
            ))}
          </div>
        </div>
        {summary.rows.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">No priced products match.</p>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[960px] text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-muted text-left text-xs text-ink-muted">
                    <th className="px-3 py-2 font-medium">Product</th>
                    <th className="px-3 py-2 font-medium">Mode</th>
                    <th className="px-3 py-2 text-right font-medium">Take rate</th>
                    <th className="px-3 py-2 text-right font-medium">NRV</th>
                    <th className="px-3 py-2 text-right font-medium">Display price</th>
                    <th className="px-3 py-2 text-right font-medium">Net SC</th>
                    <th className="px-3 py-2 text-right font-medium">Costs (actual)</th>
                    <th className="px-3 py-2 text-right font-medium">Contribution margin</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.rows.map((r) => (
                    <tr key={`${r.productId}-${r.variantId}`} className="border-b border-line">
                      <td className="px-3 py-2">
                        <Link href={`/admin/products/${encodeURIComponent(r.productId)}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link>
                        <span className="block text-xs text-ink-muted">{r.variant ? `${r.variant} · ` : ""}{r.sku || r.productId}{r.overridden ? ` · ${r.overridden} edited` : ""}</span>
                        {r.stale && <Badge tone="danger">Catalog price changed outside Step 3</Badge>}
                      </td>
                      <td className="px-3 py-2 text-xs">{r.mode === "FROM_ACTUALS" ? "From actuals" : "Take rate"}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.takeRate.replace(/0+$/, "").replace(/\.$/, "")}%</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatINR(r.nrv)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatINR(r.displayPrice)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatINR(r.netServiceCharge)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatINR(r.actualTotal)}</td>
                      <td className="px-3 py-2 text-right"><Badge tone={marginTone(r.marginBps, config.minMarginBps)}>{formatINR(r.margin)} · {bpsToPct(r.marginBps)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-line xl:hidden">
              {summary.rows.map((r) => (
                <li key={`${r.productId}-${r.variantId}`} className="space-y-2 px-3 py-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/admin/products/${encodeURIComponent(r.productId)}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link>
                      <span className="block text-xs text-ink-muted">{r.variant ? `${r.variant} · ` : ""}{r.sku || r.productId}{r.overridden ? ` · ${r.overridden} edited` : ""}</span>
                      {r.stale && <Badge tone="danger">Catalog price changed outside Step 3</Badge>}
                    </div>
                    <Badge tone={marginTone(r.marginBps, config.minMarginBps)} className="shrink-0">{formatINR(r.margin)} · {bpsToPct(r.marginBps)}</Badge>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[12.5px] sm:grid-cols-3">
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">Mode</dt>
                      <dd className="truncate text-ink-soft">{r.mode === "FROM_ACTUALS" ? "From actuals" : "Take rate"}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">Take rate</dt>
                      <dd className="tabular-nums text-ink-soft">{r.takeRate.replace(/0+$/, "").replace(/\.$/, "")}%</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">NRV</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(r.nrv)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">Display price</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(r.displayPrice)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">Net SC</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(r.netServiceCharge)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-medium uppercase tracking-wide text-ink-muted">Costs (actual)</dt>
                      <dd className="tabular-nums text-ink-soft">{formatINR(r.actualTotal)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="flex items-center justify-between p-3 text-xs text-ink-muted">
          <span>{formatNumber(meta?.total ?? 0)} rows · page {filters.page} of {pages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={filters.page <= 1} onClick={() => go({ page: String(filters.page - 1) })}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={filters.page >= pages} onClick={() => go({ page: String(filters.page + 1) })}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
