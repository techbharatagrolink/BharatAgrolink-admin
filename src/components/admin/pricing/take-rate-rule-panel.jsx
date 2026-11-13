"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyTakeRateRuleBatchAction } from "@/lib/actions/admin/take-rate-rules";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/form";

const STATUS_LABEL = {
  "blocked-seller-inactive": "Seller hasn't activated the service",
  "blocked-price-change": "Would change price / NRV",
  "blocked-actuals-mode": "Rebuild-from-actuals mode",
  "blocked-preview-failed": "Preview failed",
  "blocked-load-failed": "Could not load pricing",
  "already-applied": "Already applied",
};

function RowMeta({ row }) {
  return (
    <div className="min-w-0">
      <Link href={`/admin/products/${row.id}`} className="font-medium text-brand-700 hover:underline">
        {row.name}
      </Link>
      <p className="text-xs text-ink-muted">{row.sku} · {row.vendor} · {row.category}</p>
    </div>
  );
}

function TierBadge({ tier }) {
  if (!tier) return null;
  return <Badge tone={tier === "tier2" ? "danger" : "warning"}>{tier === "tier2" ? ">45%" : "40–45%"}</Badge>;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Before-state snapshot so an Apply run has a record to revert from by hand if needed. */
function downloadBeforeStateCsv(rows) {
  const header = ["Product ID", "Name", "SKU", "Vendor", "Category", "Status", "Tier", "Current take rate %", "Proposed take rate %", "Services being added"];
  const lines = [header, ...rows.map((r) => [r.id, r.name, r.sku, r.vendor, r.category, r.status, r.tier ?? "", r.takeRate ?? "", r.proposedTakeRate ?? "", (r.addingServiceNames ?? []).join(" + ")])];
  const csv = lines.map((line) => line.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `take-rate-service-rule-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function TakeRateRulePanel({ rows, canApply }) {
  const router = useRouter();
  const { notify } = useToast();
  const [selected, setSelected] = useState(() => new Set());
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  const ready = useMemo(() => rows.filter((r) => r.status === "ready"), [rows]);
  const blocked = useMemo(() => rows.filter((r) => r.status !== "ready"), [rows]);

  const toggle = (id) => setSelected((cur) => { const next = new Set(cur); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const toggleAll = () => setSelected((cur) => (cur.size === ready.length ? new Set() : new Set(ready.map((r) => r.id))));

  const apply = () => {
    const ids = [...selected];
    if (!ids.length || !reason.trim()) return;
    startTransition(async () => {
      const batch = await applyTakeRateRuleBatchAction(ids, reason);
      if (!batch.ok) {
        notify({ message: batch.message, tone: "error" });
        return;
      }
      const okCount = batch.results.filter((r) => r.ok).length;
      const failCount = batch.results.length - okCount;
      notify({ message: `${okCount} product${okCount === 1 ? "" : "s"} updated${failCount ? `, ${failCount} failed` : ""}.`, tone: failCount && !okCount ? "error" : "success" });
      setSelected(new Set());
      setReason("");
      router.refresh();
    });
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader
          title={`${ready.length} ready to apply`}
          description="Each row already passed a live preview confirming MRP, NRV and display price stay exactly the same."
          actions={
            rows.length > 0 ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => downloadBeforeStateCsv(rows)} className="text-xs font-medium text-brand-700 hover:underline">
                  Download CSV (before state)
                </button>
                {canApply && ready.length > 0 && (
                  <button type="button" onClick={toggleAll} className="text-xs font-medium text-brand-700 hover:underline">
                    {selected.size === ready.length ? "Clear selection" : "Select all"}
                  </button>
                )}
              </div>
            ) : null
          }
        />
        {ready.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                    {canApply && <th scope="col" className="w-8 px-4 py-2.5" />}
                    <th scope="col" className="px-4 py-2.5">Product</th>
                    <th scope="col" className="px-4 py-2.5">Tier</th>
                    <th scope="col" className="px-4 py-2.5 text-right">Take rate</th>
                    <th scope="col" className="px-4 py-2.5">Adding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ready.map((r) => (
                    <tr key={r.id} className="align-top hover:bg-surface-muted/60">
                      {canApply && (
                        <td className="px-4 py-2.5">
                          <input type="checkbox" className="accent-brand-600" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                        </td>
                      )}
                      <td className="px-4 py-2.5"><RowMeta row={r} /></td>
                      <td className="px-4 py-2.5"><TierBadge tier={r.tier} /></td>
                      <td className="px-4 py-2.5 text-right tabular">
                        {r.takeRate}% <span className="text-ink-muted">→</span> <span className="font-medium text-ink">{r.proposedTakeRate}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">{r.addingServiceNames.join(" + ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {canApply && (
              <CardBody className="border-t border-line">
                <Textarea placeholder="Reason (required before applying)" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
                <button
                  type="button"
                  onClick={apply}
                  disabled={pending || !selected.size || !reason.trim()}
                  className="mt-2 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {pending ? "Applying…" : `Apply to ${selected.size || ""} selected`}
                </button>
              </CardBody>
            )}
          </>
        ) : (
          <CardBody>
            <p className="text-sm text-ink-muted">No products are currently ready to apply.</p>
          </CardBody>
        )}
      </Card>

      <Card>
        <CardHeader title={`${blocked.length} not applied`} description="Shown for visibility — nothing here was changed." />
        {blocked.length ? (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                  <th scope="col" className="px-4 py-2.5">Product</th>
                  <th scope="col" className="px-4 py-2.5">Tier</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Take rate</th>
                  <th scope="col" className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {blocked.map((r) => (
                  <tr key={r.id} className="align-top hover:bg-surface-muted/60">
                    <td className="px-4 py-2.5"><RowMeta row={r} /></td>
                    <td className="px-4 py-2.5"><TierBadge tier={r.tier} /></td>
                    <td className="px-4 py-2.5 text-right tabular">{r.takeRate != null ? `${r.takeRate}%` : "—"}</td>
                    <td className="px-4 py-2.5 text-ink-soft">
                      {STATUS_LABEL[r.status] || r.status}
                      {r.status === "blocked-seller-inactive" && (
                        <>
                          {" — "}
                          {r.missingServiceNames.map((name, idx) => (
                            <span key={name}>
                              {idx > 0 && ", "}
                              <Link href={`/admin/seller-services/requests?service=${encodeURIComponent(name)}`} className="text-brand-700 hover:underline">
                                activate {name}
                              </Link>
                            </span>
                          ))}
                        </>
                      )}
                      {r.status === "blocked-price-change" && (
                        <span className="block text-xs">would become {r.previewDisplayPrice ?? "—"} (currently {r.currentDisplayPrice})</span>
                      )}
                      {(r.loadMessage || r.previewMessage) && <span className="block text-xs">{r.loadMessage || r.previewMessage}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CardBody>
            <p className="text-sm text-ink-muted">Nothing blocked.</p>
          </CardBody>
        )}
      </Card>
    </>
  );
}
