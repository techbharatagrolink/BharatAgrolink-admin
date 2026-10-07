"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatINR } from "@/lib/format";
import { cancelShipmentsAction, markCancelledAction, syncStatusAction } from "@/lib/actions/admin/shipping";
import { BulkCreateDialog } from "./bulk-create-dialog";
import { ShipmentActions, syncSummary } from "./shipment-actions";
import { TrackingCell } from "./tracking-cell";

const keyOf = (r) => `${r.orderId}|${r.vendorId}`;

export function ShipmentsTable({ rows, canAdd, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [selected, setSelected] = useState([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [running, start] = useTransition();

  const picked = rows.filter((r) => selected.includes(keyOf(r)));
  const toCreate = [...new Set(picked.filter((r) => r.canCreate).map((r) => r.orderId))].slice(0, 50);
  const withAwb = picked.filter((r) => r.awb);
  const cancellable = withAwb.filter((r) => r.canCancel);
  const syncIds = [...new Set(withAwb.map((r) => r.orderId))].slice(0, 50);
  const allChecked = rows.length > 0 && selected.length === rows.length;

  const toggle = (key, on) => setSelected((list) => (on ? [...list, key] : list.filter((k) => k !== key)));

  const run = (fn, toMessage) =>
    start(async () => {
      const r = await fn();
      setConfirm(null);
      if (!r.ok) return notify({ message: r.message, tone: "error" });
      notify(toMessage(r.data));
      setSelected([]);
      router.refresh();
    });

  if (!rows.length) return <EmptyState title="No shipments here" description="Try another tab, date range or search." />;

  return (
    <>
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-muted px-4 py-2 text-sm">
          <span className="mr-2 text-ink-soft">{selected.length} selected</span>
          {canAdd && <Button size="xs" variant="primary" disabled={!toCreate.length} onClick={() => setBulkOpen(true)}>Create shipments ({toCreate.length})</Button>}
          {canEdit && (
            <Button size="xs" disabled={!syncIds.length} loading={running && !confirm} onClick={() => run(() => syncStatusAction(syncIds), syncSummary)}>
              Sync status ({syncIds.length})
            </Button>
          )}
          {canEdit && <Button size="xs" variant="danger-outline" disabled={!cancellable.length} onClick={() => setConfirm("cancel")}>Cancel ({cancellable.length})</Button>}
          {canEdit && <Button size="xs" variant="danger-outline" disabled={!withAwb.length} onClick={() => setConfirm("mark")}>Mark cancelled ({withAwb.length})</Button>}
          <Button size="xs" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface-muted text-left text-xs text-ink-muted">
            <tr>
              <th className="w-8 px-3 py-2">
                <Checkbox aria-label="Select all" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? rows.map(keyOf) : [])} />
              </th>
              <th className="px-3 py-2 font-medium">Order / vendor</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">AWB / courier</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={keyOf(r)} className="align-top hover:bg-surface-muted/60">
                <td className="px-3 py-2.5">
                  <Checkbox aria-label={`Select ${r.orderId} ${r.vendorName}`} checked={selected.includes(keyOf(r))} onChange={(e) => toggle(keyOf(r), e.target.checked)} />
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/admin/orders/${encodeURIComponent(r.orderId)}`} className="font-mono text-xs text-brand-700 hover:underline">{r.orderId}</Link>
                  <p className="text-xs text-ink-muted">{r.vendorName} · {formatDate(r.orderDate)}</p>
                  {r.invoiceNumber && <p className="font-mono text-[11px] text-ink-muted">{r.invoiceNumber}</p>}
                </td>
                <td className="px-3 py-2.5">
                  <p className="text-ink">{r.customer}</p>
                  <p className="text-xs text-ink-muted">{r.destination}</p>
                </td>
                <td className="px-3 py-2.5 text-xs text-ink-soft">{r.paymentMode}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={r.status} />
                  {r.statuses?.length > 1 && <p className="mt-1 text-[11px] text-ink-muted">{r.statuses.join(", ")}</p>}
                </td>
                <td className="px-3 py-2.5">
                  <TrackingCell awb={r.awb} courier={r.courier} carrier={r.carrier} trackingUrl={r.trackingUrl} labelUrl={r.labelUrl} manifestUrl={r.manifestUrl} />
                </td>
                <td className="px-3 py-2.5 text-right tabular">
                  {formatINR(r.amount)}
                  <p className="text-[11px] text-ink-muted">{r.lines} line{r.lines === 1 ? "" : "s"} · qty {r.qty}</p>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <ShipmentActions row={r} canAdd={canAdd} canEdit={canEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bulkOpen && <BulkCreateDialog orderIds={toCreate} open={bulkOpen} onClose={() => setBulkOpen(false)} onDone={() => setSelected([])} />}
      <ConfirmDialog
        open={confirm === "cancel"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() =>
          run(() => cancelShipmentsAction(cancellable.map((r) => r.awb), cancellable.map((r) => r.orderId)), (d) => ({
            message: `${d.successCount} cancelled, ${d.failedCount} failed.${d.failedCount ? ` ${d.results.find((x) => !x.success)?.error ?? ""}` : ""}`,
            tone: d.failedCount ? (d.successCount ? "info" : "error") : "success",
          }))
        }
        title={`Cancel ${cancellable.length} shipment${cancellable.length === 1 ? "" : "s"}?`}
        description="Each AWB is cancelled at its courier (Delhivery / Shiprocket), then its lines go back to Placed. NimbusPost AWBs are refused, as the PHP panel had no NimbusPost cancel."
        confirmLabel="Cancel shipments"
      />
      <ConfirmDialog
        open={confirm === "mark"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() => run(() => markCancelledAction(withAwb.map((r) => r.awb), withAwb.map((r) => r.orderId)), () => ({ message: "Marked cancelled. The lines are back to Placed.", tone: "success" }))}
        title={`Mark ${withAwb.length} shipment${withAwb.length === 1 ? "" : "s"} cancelled?`}
        description="Only for shipments already cancelled on the courier's side. Nothing is sent to the courier."
        confirmLabel="Mark cancelled"
      />
    </>
  );
}
