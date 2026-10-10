"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { cancelShiprocketOrdersAction, cancelShiprocketShipmentsAction, shiprocketReportDocumentAction, trackShiprocketAwbsAction } from "@/lib/actions/admin/shipping";
import { ShiprocketBulkTrackingDialog, ShiprocketOrderDialog, ShiprocketTrackingDialog, listTone, openInTab } from "./shiprocket-dialogs";

const unique = (list) => [...new Set(list.filter(Boolean))];
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function RowActions({ row, onTrack, onDetails }) {
  return (
    <Popover
      label={`Actions for ${row.channelOrderId || row.srOrderId}`}
      panelClassName="w-44"
      trigger={({ toggle, props }) => (
        <Button size="xs" onClick={toggle} {...props}>
          Actions <ChevronDown className="size-3.5" aria-hidden />
        </Button>
      )}
    >
      <ul className="py-1">
        {row.shipmentId && (
          <li>
            <button type="button" data-close onClick={onTrack} className="w-full px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted">Track</button>
          </li>
        )}
        <li>
          <button type="button" data-close onClick={onDetails} className="w-full px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted">Details</button>
        </li>
        {row.invoiceUrl && (
          <li>
            <a href={row.invoiceUrl} target="_blank" rel="noreferrer" data-close className="block w-full px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted">Invoice</a>
          </li>
        )}
      </ul>
    </Popover>
  );
}

/**
 * shiprocket_orders_report.php table: one row per Shiprocket shipment, with
 * the PHP bulk actions (label, manifest, invoice, tracking, order and
 * shipment cancellation) on the selected rows.
 */
export function ShiprocketOrdersTable({ rows, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [selected, setSelected] = useState([]);
  const [details, setDetails] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [bulkTracking, setBulkTracking] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [running, start] = useTransition();

  const picked = rows.filter((r) => selected.includes(r.key));
  const withDocs = picked.filter((r) => r.shipmentId && r.awb);
  const orderIds = unique(picked.map((r) => r.srOrderId));
  const trackAwbs = picked.filter((r) => r.awb).map((r) => r.awb);
  const cancelAwbs = unique(picked.map((r) => r.awb));
  const allChecked = rows.length > 0 && selected.length === rows.length;
  const byShipment = Object.fromEntries(rows.map((r) => [r.shipmentId, r]));
  const byOrder = Object.fromEntries(rows.map((r) => [r.srOrderId, r]));
  const byAwb = Object.fromEntries(rows.filter((r) => r.awb).map((r) => [r.awb, r]));

  const toggle = (key, on) => setSelected((list) => (on ? [...list, key] : list.filter((k) => k !== key)));

  const documents = (doc) => {
    const ids = doc === "invoice" ? orderIds : withDocs.map((r) => r.shipmentId);
    const skipped = doc === "invoice" ? 0 : picked.length - withDocs.length;
    if (!ids.length) {
      return notify({ message: doc === "invoice" ? "No valid orders selected. Please select shipments that have order IDs." : `No valid shipments selected. ${doc === "label" ? "Labels" : "Manifests"} can only be generated for shipments that have both Shipment ID and AWB code assigned${doc === "manifest" ? ", and pickup must be requested" : ""}.`, tone: "error" });
    }
    if (skipped) notify({ message: `${plural(skipped, "shipment")} skipped because they don't have AWB codes assigned.`, tone: "info" });
    start(async () => {
      const r = await openInTab(() => shiprocketReportDocumentAction(doc, ids));
      if (!r.ok) return notify({ message: r.message, tone: "error" });
      const d = r.data;
      const names = (list, map, field) => list.map((id) => map[id]?.[field] || id).join(", ");
      if (doc === "label") {
        const failed = d.notCreated.length ? ` Not created: ${names(d.notCreated, byShipment, "channelOrderId")}.` : "";
        return notify({ message: d.ok ? `${plural(d.created, "label")} generated.${failed}` : `Label generation failed. ${d.message || "Please check shipment details."}${failed}`, tone: d.ok ? (failed ? "info" : "success") : "error" });
      }
      if (doc === "manifest") return notify({ message: d.ok ? `Manifest generated for ${plural(ids.length, "shipment")}.` : `Manifest generation failed. ${d.message || "Please verify that all shipments meet the requirements."}`, tone: d.ok ? "success" : "error" });
      const failed = d.notCreated.length ? ` Not created: ${names(d.notCreated, byOrder, "channelOrderId")}.` : "";
      return notify({ message: d.ok ? `${plural(ids.length - d.notCreated.length, "invoice")} generated.${failed}` : `Invoice generation failed.${failed}`, tone: d.ok ? (failed ? "info" : "success") : "error" });
    });
  };

  const track = () => {
    if (!trackAwbs.length) return notify({ message: "No shipments with AWB codes selected. Please select shipments that have AWB codes.", tone: "error" });
    if (trackAwbs.length > 50) return notify({ message: "Maximum 50 shipments with AWB codes can be tracked at once. Please select 50 or fewer shipments.", tone: "error" });
    start(async () => {
      const r = await trackShiprocketAwbsAction(trackAwbs);
      if (!r.ok) return notify({ message: r.message, tone: "error" });
      setBulkTracking(r.data);
      setSelected([]);
    });
  };

  const cancel = (kind) =>
    start(async () => {
      const r = kind === "orders" ? await cancelShiprocketOrdersAction(orderIds) : await cancelShiprocketShipmentsAction(cancelAwbs);
      setConfirm(null);
      if (!r.ok) return notify({ message: r.message, tone: "error" });
      const d = r.data;
      const word = kind === "orders" ? "order" : "shipment";
      const parts = [d.message || `${plural(d.successCount, word)} cancelled.`];
      if (d.failCount) parts.push(`${plural(d.failCount, word)} could not be cancelled${kind === "shipments" ? ' (only before "Out for Pickup")' : ""}${d.errors.length ? `: ${d.errors.join(", ")}` : "."}`);
      notify({ message: parts.join(" "), tone: d.failCount ? (d.successCount ? "info" : "error") : "success" });
      setSelected([]);
      router.refresh();
    });

  if (!rows.length) return <EmptyState title="No orders found." description="Try another search, status, pickup location or date range." />;

  return (
    <>
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-muted px-4 py-2 text-sm">
          <span className="mr-2 text-ink-soft">{selected.length} selected</span>
          {canEdit && <Button size="xs" loading={running && !confirm} onClick={() => documents("label")}>Label ({withDocs.length})</Button>}
          {canEdit && <Button size="xs" onClick={() => documents("manifest")} disabled={running}>Manifest ({withDocs.length})</Button>}
          {canEdit && <Button size="xs" onClick={() => documents("invoice")} disabled={running}>Invoice ({orderIds.length})</Button>}
          <Button size="xs" onClick={track} disabled={running || !trackAwbs.length}>Track ({trackAwbs.length})</Button>
          {canEdit && <Button size="xs" variant="danger-outline" disabled={!orderIds.length} onClick={() => setConfirm("orders")}>Cancel orders ({orderIds.length})</Button>}
          {canEdit && <Button size="xs" variant="danger-outline" disabled={!cancelAwbs.length} onClick={() => setConfirm("shipments")}>Cancel shipments ({cancelAwbs.length})</Button>}
          <Button size="xs" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface-muted text-left text-xs text-ink-muted">
            <tr>
              <th className="w-8 px-3 py-2">
                <Checkbox aria-label="Select all" checked={allChecked} onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r.key) : [])} />
              </th>
              <th className="px-3 py-2 font-medium">Channel order ID</th>
              <th className="px-3 py-2 font-medium">Shipment ID</th>
              <th className="px-3 py-2 font-medium">AWB code</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Courier</th>
              <th className="px-3 py-2 text-right font-medium">Freight charges</th>
              <th className="px-3 py-2 font-medium">Created at</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.key} className="align-top hover:bg-surface-muted/60">
                <td className="px-3 py-2.5">
                  <Checkbox aria-label={`Select ${r.channelOrderId || r.srOrderId}`} checked={selected.includes(r.key)} onChange={(e) => toggle(r.key, e.target.checked)} />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs font-medium text-ink">{r.channelOrderId || "N/A"}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-soft">{r.shipmentId || "-"}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-soft">{r.awb || "-"}</td>
                <td className="px-3 py-2.5">
                  <Badge tone={listTone(r.status)} dot>{r.status || "N/A"}</Badge>
                </td>
                <td className="px-3 py-2.5 text-xs text-ink-soft">{r.courier || "-"}</td>
                <td className="px-3 py-2.5 text-right tabular">{formatINR(r.freight)}</td>
                <td className="px-3 py-2.5 text-xs text-ink-soft">{r.createdAt || "-"}</td>
                <td className="px-3 py-2.5 text-right">
                  <RowActions row={r} onTrack={() => setTracking(r.shipmentId)} onDetails={() => setDetails(r.srOrderId)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {details && <ShiprocketOrderDialog key={details} srOrderId={details} open onClose={() => setDetails(null)} canEdit={canEdit} />}
      {tracking && <ShiprocketTrackingDialog key={tracking} shipmentId={tracking} open onClose={() => setTracking(null)} />}
      {bulkTracking && <ShiprocketBulkTrackingDialog data={bulkTracking} rowsByAwb={byAwb} open onClose={() => setBulkTracking(null)} />}
      <ConfirmDialog
        open={confirm === "orders"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() => cancel("orders")}
        title={`Cancel ${plural(orderIds.length, "order")}?`}
        description="The orders are cancelled on Shiprocket, then their Shiprocket shipments are marked cancelled here. This action cannot be undone."
        confirmLabel="Cancel orders"
      />
      <ConfirmDialog
        open={confirm === "shipments"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() => cancel("shipments")}
        title={`Cancel ${plural(cancelAwbs.length, "shipment")}?`}
        description='Shipments can only be cancelled before "Out for Pickup". Cancelled AWBs are cleared from their order lines, which go back to Placed. This action cannot be undone.'
        confirmLabel="Cancel shipments"
      />
    </>
  );
}
