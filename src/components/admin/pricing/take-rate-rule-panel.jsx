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

/** A base row and a variant row of the same product share `id`, so selection/React keys use this instead. */
const rowKey = (r) => `${r.id}:${r.variantId || 0}`;

function RowMeta({ row }) {
  const meta = [row.sku, row.vendor, row.category].filter(Boolean).join(" · ");
  return (
    <div className="min-w-0">
      <Link href={`/admin/products/${row.id}`} className="font-medium text-brand-700 hover:underline">
        {row.name}
      </Link>
      {row.variantId ? <Badge tone="info" className="ml-1.5">Variant #{row.variantId}</Badge> : null}
      {meta && <p className="text-xs text-ink-muted">{meta}</p>}
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

const PAGE_SIZE = 25;

function Pager({ page, setPage, total }) {
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pageCount <= 1) return null;
  const from = total ? page * PAGE_SIZE + 1 : 0;
  const to = Math.min(total, (page + 1) * PAGE_SIZE);
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-ink-muted">
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded border border-line px-2 py-1 font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
          className="rounded border border-line px-2 py-1 font-medium text-ink-soft hover:bg-surface-muted disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/** Before-state snapshot so an Apply run has a record to revert from by hand if needed. */
function downloadBeforeStateCsv(rows) {
  const header = ["Product ID", "Variant ID", "Name", "SKU", "Vendor", "Category", "Status", "Tier", "Current take rate %", "Proposed take rate %", "Services being added"];
  const lines = [
    header,
    ...rows.map((r) => [r.id, r.variantId || "", r.name, r.sku, r.vendor, r.category, r.status, r.tier ?? "", r.takeRate ?? "", r.proposedTakeRate ?? "", (r.addingServiceNames ?? []).join(" + ")]),
  ];
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
  const [readyPage, setReadyPage] = useState(0);
  const [blockedPage, setBlockedPage] = useState(0);

  const ready = useMemo(() => rows.filter((r) => r.status === "ready"), [rows]);
  const blocked = useMemo(() => rows.filter((r) => r.status !== "ready"), [rows]);
  const byKey = useMemo(() => new Map(rows.map((r) => [rowKey(r), r])), [rows]);
  const readyShown = useMemo(() => ready.slice(readyPage * PAGE_SIZE, readyPage * PAGE_SIZE + PAGE_SIZE), [ready, readyPage]);
  const blockedShown = useMemo(() => blocked.slice(blockedPage * PAGE_SIZE, blockedPage * PAGE_SIZE + PAGE_SIZE), [blocked, blockedPage]);

  const toggle = (key) => setSelected((cur) => { const next = new Set(cur); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const toggleAll = () => setSelected((cur) => (cur.size === ready.length ? new Set() : new Set(ready.map(rowKey))));

  const apply = () => {
    const keys = [...selected];
    if (!keys.length || !reason.trim()) return;
    startTransition(async () => {
      const items = keys.map((key) => { const r = byKey.get(key); return { id: r.id, variantId: r.variantId || 0 }; });
      const batch = await applyTakeRateRuleBatchAction(items, reason);
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
                  {readyShown.map((r) => (
                    <tr key={rowKey(r)} className="align-top hover:bg-surface-muted/60">
                      {canApply && (
                        <td className="px-4 py-2.5">
                          <input type="checkbox" className="accent-brand-600" checked={selected.has(rowKey(r))} onChange={() => toggle(rowKey(r))} />
                        </td>
                      )}
                      <td className="px-4 py-2.5"><RowMeta row={r} /></td>
                      <td className="px-4 py-2.5"><TierBadge tier={r.tier} /></td>
                      <td className="px-4 py-2.5 text-right tabular">
                        {r.takeRate}% <span className="text-ink-muted">→</span> <span className="font-medium text-ink">{r.proposedTakeRate}%</span>
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">
                        {r.addingServiceNames.join(" + ")}
                        {r.variantId ? <span className="block text-xs text-ink-muted">service and take rate change on this variant only</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={readyPage} setPage={setReadyPage} total={ready.length} />
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
                {blockedShown.map((r) => (
                  <tr key={rowKey(r)} className="align-top hover:bg-surface-muted/60">
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
            <Pager page={blockedPage} setPage={setBlockedPage} total={blocked.length} />
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
