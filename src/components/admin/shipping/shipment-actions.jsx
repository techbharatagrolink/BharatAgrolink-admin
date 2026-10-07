"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import {
  cancelShipmentsAction,
  markCancelledAction,
  openLabelAction,
  regenerateLabelAction,
  shiprocketDocumentAction,
  syncStatusAction,
} from "@/lib/actions/admin/shipping";
import { CreateShipmentDialog } from "./create-shipment-dialog";

export function syncSummary(data) {
  const lines = data?.lines ?? [];
  const changed = lines.filter((l) => l.changed).length;
  const failed = lines.filter((l) => l.error);
  const parts = [`${lines.length} AWB${lines.length === 1 ? "" : "s"} checked`, `${changed} updated`];
  if (failed.length) parts.push(`${failed.length} failed (${failed[0].error})`);
  return { message: parts.join(", ") + ".", tone: failed.length && !changed ? "error" : "success" };
}

/** Opens the tab before the await so the browser does not block it as a popup. */
async function openInTab(load) {
  const tab = window.open("", "_blank");
  const r = await load();
  if (r.ok && r.data?.url) {
    if (tab) tab.location.href = r.data.url;
    else window.location.href = r.data.url;
  } else tab?.close();
  return r;
}

export function ShipmentActions({ row, canAdd, canEdit, size = "xs" }) {
  const router = useRouter();
  const { notify } = useToast();
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [running, start] = useTransition();
  const hasAwb = Boolean(row.awb);
  const isShiprocket = row.carrier === "shiprocket";

  const run = (fn, { refresh = false, success } = {}) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) notify({ message: r.message, tone: "error" });
      else {
        const msg = typeof success === "function" ? success(r.data) : { message: success ?? "Done.", tone: "success" };
        notify(msg);
        if (refresh) router.refresh();
      }
      setConfirm(null);
    });

  const items = [
    canAdd && row.canCreate && { label: "Create shipment", onClick: () => setCreating(true) },
    hasAwb && { label: "Open label", onClick: () => run(() => openInTab(() => openLabelAction(row.orderId, row.vendorId)), { success: (d) => ({ message: d.regenerated ? "A fresh label was generated." : "Label opened.", tone: "success" }) }) },
    hasAwb && canEdit && { label: "Regenerate label", onClick: () => run(() => openInTab(() => regenerateLabelAction(row.orderId, row.awb, row.vendorId)), { refresh: true, success: "New label generated." }) },
    hasAwb && isShiprocket && canEdit && { label: "Manifest", onClick: () => run(() => openInTab(() => shiprocketDocumentAction(row.orderId, row.vendorId, "manifest")), { success: "Manifest opened." }) },
    hasAwb && isShiprocket && canEdit && { label: "Request pickup", onClick: () => run(() => shiprocketDocumentAction(row.orderId, row.vendorId, "pickup"), { success: (d) => ({ message: d.scheduled ? `Pickup scheduled for ${d.scheduled}.` : String(d.message || "Pickup requested."), tone: "success" }) }) },
    hasAwb && isShiprocket && canEdit && { label: "Shiprocket invoice", onClick: () => run(() => openInTab(() => shiprocketDocumentAction(row.orderId, row.vendorId, "invoice")), { success: "Invoice opened." }) },
    hasAwb && canEdit && { label: "Sync courier status", onClick: () => run(() => syncStatusAction([row.orderId]), { refresh: true, success: syncSummary }) },
    hasAwb && canEdit && row.canCancel && { label: "Cancel shipment", danger: true, onClick: () => setConfirm("cancel") },
    hasAwb && canEdit && { label: "Mark cancelled (local)", danger: true, onClick: () => setConfirm("mark") },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <>
      <Popover
        label={`Shipment actions for ${row.orderId}`}
        panelClassName="w-56"
        trigger={({ toggle, props }) => (
          <Button size={size} onClick={toggle} loading={running} {...props}>
            Actions <ChevronDown className="size-3.5" aria-hidden />
          </Button>
        )}
      >
        <ul className="py-1">
          {items.map((item) => (
            <li key={item.label}>
              <button type="button" data-close onClick={item.onClick} className={`w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted ${item.danger ? "text-danger-ink" : "text-ink"}`}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </Popover>
      {creating && <CreateShipmentDialog orderId={row.orderId} open={creating} onClose={() => setCreating(false)} />}
      <ConfirmDialog
        open={confirm === "cancel"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() =>
          run(() => cancelShipmentsAction([row.awb], [row.orderId]), {
            refresh: true,
            success: (d) => ({ message: d.failedCount ? d.results.find((x) => !x.success)?.error ?? "Cancellation failed." : "Shipment cancelled. The lines are back to Placed.", tone: d.failedCount ? "error" : "success" }),
          })
        }
        title={`Cancel AWB ${row.awb}?`}
        description="The shipment is cancelled at the courier, then the order lines go back to Placed and the AWB, label and courier are cleared."
        confirmLabel="Cancel shipment"
      />
      <ConfirmDialog
        open={confirm === "mark"}
        onClose={() => setConfirm(null)}
        loading={running}
        onConfirm={() => run(() => markCancelledAction([row.awb], [row.orderId]), { refresh: true, success: "Marked cancelled. The lines are back to Placed." })}
        title={`Mark AWB ${row.awb} cancelled?`}
        description="Use this only when the shipment is already cancelled on the courier's side. Nothing is sent to the courier; the lines go back to Placed."
        confirmLabel="Mark cancelled"
      />
    </>
  );
}
