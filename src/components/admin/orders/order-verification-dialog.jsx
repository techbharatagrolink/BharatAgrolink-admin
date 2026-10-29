"use client";

import { useState } from "react";
import { Ban, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/form";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const CALL_STATUSES = ["Confirmed", "Wants changes", "Not reachable", "Switched off", "Busy", "Call back later"];

function numberOptions(order, editor) {
  const opts = [];
  if (order.mobile) opts.push({ value: order.mobile, label: `${order.mobile} (Main)` });
  if (editor?.address?.alternateMobile) opts.push({ value: editor.address.alternateMobile, label: `${editor.address.alternateMobile} (Alternate)` });
  return opts;
}

const PANEL_TONE = {
  brand: "border-t-brand-600",
  success: "border-t-success-ink",
  warning: "border-t-warning-ink",
  danger: "border-t-danger",
};

function Panel({ icon: Icon, tone, title, children }) {
  return (
    <div className={cn("space-y-2.5 rounded-xl border border-line border-t-2 bg-surface p-3", PANEL_TONE[tone])}>
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <Icon className="size-4" aria-hidden /> {title}
      </p>
      {children}
    </div>
  );
}

/**
 * Mirrors the legacy edit_order.php "Order Verification" modal: confirm the order with the
 * customer, then Accept (which hands off to shipment creation) or Reject. The WhatsApp/SMS
 * send and call-status controls are left as placeholders - wiring real sends needs the AiSensy
 * campaign and RapidSMS template names the legacy system uses, which aren't available here yet.
 */
export function OrderVerificationDialog({ order, editor, open, onClose, onAccept, onReject, pending }) {
  const [remarks, setRemarks] = useState("");
  const [primaryCallStatus, setPrimaryCallStatus] = useState("");
  const [altCallStatus, setAltCallStatus] = useState("");
  const numbers = numberOptions(order, editor);
  const address = editor?.address;
  const delivery = [address?.address, address?.area, order.city, order.state].filter(Boolean).join(", ") + (order.pincode ? ` - ${order.pincode}` : "");

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="xl"
      title={`Order ${order.id}`}
      description={`${order.customer || "—"} · Placed ${formatDateTime(order.createdAt)}`}
      footer={
        <>
          <Button variant="danger-outline" loading={pending} onClick={() => onReject(remarks)}>
            Reject
          </Button>
          <Button variant="primary" loading={pending} onClick={() => onAccept(remarks)}>
            Accept Order
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-surface-muted p-3 text-sm">
          <p className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">Shipping address</p>
          <p className="mt-1 text-ink">{delivery.trim().replace(/^,\s*/, "") || "—"}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Panel icon={MessageCircle} tone="success" title="WhatsApp">
            <Select options={numbers} placeholder="Select number" disabled={!numbers.length} />
            <Button variant="primary" size="sm" className="w-full" disabled title="Needs the AiSensy confirmation campaign to be wired up">
              Send Confirmation
            </Button>
            <p className="text-[11px] text-ink-muted">Last Sent: Never</p>
          </Panel>

          <Panel icon={Phone} tone="brand" title="Call Verification">
            <Field label={`Primary (${order.mobile || "—"})`}>
              <Select options={CALL_STATUSES} placeholder="Select Status..." value={primaryCallStatus} onChange={(e) => setPrimaryCallStatus(e.target.value)} />
            </Field>
            <Field label={`Alternate (${address?.alternateMobile || "—"})`}>
              <Select options={CALL_STATUSES} placeholder="Select Status..." value={altCallStatus} onChange={(e) => setAltCallStatus(e.target.value)} disabled={!address?.alternateMobile} />
            </Field>
          </Panel>

          <Panel icon={MessageSquare} tone="warning" title="SMS">
            <Select options={numbers} placeholder="Select number" disabled={!numbers.length} />
            <Button variant="primary" size="sm" className="w-full" disabled title="Needs the RapidSMS confirmation template to be wired up">
              Send SMS
            </Button>
            <p className="text-[11px] text-ink-muted">Last Sent: Never</p>
          </Panel>

          <Panel icon={Ban} tone="danger" title="Cancel Order">
            <p className="text-xs text-ink-soft">Sending this will notify the customer the order is cancelled.</p>
            <Button variant="danger-outline" size="sm" className="w-full" disabled title="Needs the AiSensy cancellation campaign to be wired up">
              WA Cancel
            </Button>
            <Button variant="danger-outline" size="sm" className="w-full" disabled title="Needs the RapidSMS cancellation template to be wired up">
              SMS Cancel
            </Button>
          </Panel>
        </div>

        <Field label="Remarks" hint="Internal team note, saved with Accept/Reject.">
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Type internal team remarks here (e.g. 'Customer asked to deliver on Sunday')..." />
        </Field>
      </div>
    </Dialog>
  );
}
