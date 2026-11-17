"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { updateBulkWaybillAction } from "@/lib/actions/admin/parity/bulk";
import { inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { GridTable } from "@/components/data-table/grid-table";
import { BulkPager } from "./bulk-list";

/** shipments.php grid (newest 1000 orders) with the "Update waybill" modal. */
export function BulkShipmentsTable({ result, query, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [editing, setEditing] = useState(null);
  const [waybill, setWaybill] = useState("");
  const [saving, setSaving] = useState(false);
  // The API can return empty entries; skip them (same guard as the bulk orders and quotations tables).
  const rows = Array.isArray(result?.rows) ? result.rows.filter((s) => s && (s.id != null || s.orderId)) : [];

  async function save() {
    if (!editing) return;
    setSaving(true);
    const res = await updateBulkWaybillAction(editing.orderId, waybill);
    setSaving(false);
    notify({ message: res.ok ? res.data.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) {
      setEditing(null);
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader title="Shipments" />
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-ink-muted">No shipments match the filters.</p>
      ) : (
        <>
          <div className="hidden xl:block">
            <GridTable
              rows={rows}
              rowKey={(s) => s.id ?? s.orderId}
              columns={[
                {
                  key: "orderId",
                  label: "Order ID",
                  render: (s) => (
                    <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(s.orderId)}`} className="font-mono text-xs text-brand-700 hover:underline">
                      {s.orderId}
                    </Link>
                  ),
                },
                { key: "waybill", label: "Waybill", render: (s) => <span className="font-mono text-xs">{s.waybillNo || "—"}</span> },
                { key: "customer", label: "Customer", render: (s) => s.customerName || "—" },
                { key: "from", label: "From", render: (s) => <span title={s.from}>{s.from || "—"}</span> },
                { key: "to", label: "To", render: (s) => <span title={s.to}>{s.to || "—"}</span> },
                { key: "partner", label: "Partner", render: (s) => s.partner || "—" },
                { key: "invoice", label: "Invoice", align: "right", render: (s) => inr(s.invoiceValue) },
                { key: "status", label: "Status", render: (s) => <StatusBadge status={s.status} /> },
                {
                  key: "label",
                  label: "Label",
                  render: (s) =>
                    s.labelUrl ? (
                      <a href={s.labelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                        Label <ExternalLink className="size-3" aria-hidden />
                      </a>
                    ) : (
                      "—"
                    ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  width: 88,
                  render: (s) =>
                    canEdit && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Update waybill of ${s.orderId}`}
                        onClick={() => {
                          setWaybill(s.waybillNo ?? "");
                          setEditing(s);
                        }}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                    ),
                },
              ]}
            />
          </div>

          <div className="space-y-3 p-3 xl:hidden">
            {rows.map((s) => (
              <div key={s.id ?? s.orderId} className="space-y-2.5 rounded-lg border border-line p-3 text-small">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(s.orderId)}`} className="font-mono text-xs font-semibold text-brand-700 hover:underline">{s.orderId}</Link>
                    <p className="mt-0.5 font-medium text-ink">{s.customerName || "—"}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
                  <div><dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Waybill</dt><dd className="font-mono text-ink">{s.waybillNo || "—"}</dd></div>
                  <div><dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Partner</dt><dd className="text-ink">{s.partner || "—"}</dd></div>
                  <div><dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Invoice</dt><dd className="text-ink tabular">{inr(s.invoiceValue)}</dd></div>
                  <div className="col-span-2 sm:col-span-1"><dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">From</dt><dd className="truncate text-ink" title={s.from}>{s.from || "—"}</dd></div>
                  <div className="col-span-2 sm:col-span-1"><dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">To</dt><dd className="truncate text-ink" title={s.to}>{s.to || "—"}</dd></div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Label</dt>
                    <dd>
                      {s.labelUrl ? (
                        <a href={s.labelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                          Label <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ) : (
                        <span className="text-ink">—</span>
                      )}
                    </dd>
                  </div>
                </dl>
                {canEdit && (
                  <div className="border-t border-line pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Update waybill of ${s.orderId}`}
                      onClick={() => {
                        setWaybill(s.waybillNo ?? "");
                        setEditing(s);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden /> Update waybill
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <BulkPager result={result} query={query} />
      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Update waybill number"
        description={editing?.orderId}
        footer={
          <>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={saving} disabled={!waybill.trim()}>
              Save
            </Button>
          </>
        }
      >
        <Input aria-label="Waybill number" value={waybill} onChange={(e) => setWaybill(e.target.value)} placeholder="Waybill number" />
      </Dialog>
    </Card>
  );
}
