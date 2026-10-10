"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { previewRefundAction, processReturnAction } from "@/lib/actions/admin/workflows";
import { ReturnShipmentDialog } from "./return-shipment-dialog";

const CONFIRM = {
  pickup: { label: "Mark picked up", title: "Mark return as picked up?", tone: "warning" },
  received: { label: "Mark received", title: "Confirm the vendor received the item?", tone: "warning" },
  replace: { label: "Send replacement", title: "Create a replacement shipment?", tone: "warning" },
  reject: { label: "Reject return", title: "Reject this return?", description: "The customer is notified with your reason.", tone: "danger", reason: true },
};

/** Pickup service options, plus the stored value when PHP wrote another one (e.g. "Bharatagrolink Logistics"). */
const serviceOptions = (services, current) => (current && !services.some((s) => s.value === current) ? [...services, { value: current, label: current }] : services);

/** `openShipment`: the list's "Create Return Shipment" action opens the page with the shipment dialog already open. */
export function ReturnActions({ id, actions, pickupServices, refundAmount, canRefund, details = {}, openShipment = false }) {
  const router = useRouter();
  const { notify } = useToast();
  const [approve, setApprove] = useState(false);
  const [update, setUpdate] = useState(false);
  const [refund, setRefund] = useState(false);
  const [shipment, setShipment] = useState(() => openShipment && actions.includes("shipment"));
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ pickupService: details.pickupService || "", refundShipping: false, deductPlatformFee: false });
  const [edit, setEdit] = useState({
    pickupService: details.pickupService || "",
    pickupAddress: details.pickupAddress || details.customerAddress || "",
    expectedPickupDate: details.expectedPickupDate || "",
    courierTrackingId: details.courierTrackingId || "",
    internalNotes: details.internalNotes || "",
    refundShipping: Boolean(details.refundShipping),
    deductPlatformFee: Boolean(details.deductPlatformFee),
  });
  const [pay, setPay] = useState({ transactionId: "", reason: "", refundShipping: Boolean(details.refundShipping), deductPlatformFee: Boolean(details.deductPlatformFee) });
  const [amount, setAmount] = useState(refundAmount);
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();

  const run = (action, input) =>
    startBusy(async () => {
      const r = await processReturnAction(id, action, input);
      if (!r.ok && (action === "update" || action === "refund")) return setError(r.message);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setApprove(false);
        setUpdate(false);
        setRefund(false);
        setConfirm(null);
        router.refresh();
      }
    });

  /** Live net refund (calculateRefund()) for a set of flags. */
  const preview = (flags) =>
    startBusy(async () => {
      const r = await previewRefundAction(id, flags);
      if (r.ok) setAmount(r.amount);
    });

  const setFlag = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    preview(next);
  };
  const setEditFlag = (key, value) => {
    const next = { ...edit, [key]: value };
    setEdit(next);
    preview(next);
  };
  const setPayFlag = (key, value) => {
    const next = { ...pay, [key]: value };
    setPay(next);
    preview(next);
  };
  const openRefund = () => {
    setError(null);
    preview(pay);
    setRefund(true);
  };
  const openUpdate = () => {
    setError(null);
    preview(edit);
    setUpdate(true);
  };
  const submitRefund = () => {
    if (details.refundRoute?.bankTransferRequired && !pay.transactionId.trim()) return setError("Please enter the bank transfer transaction ID before processing refund");
    if (!(amount > 0)) return setError("Invalid refund amount");
    setError(null);
    run("refund", pay);
  };

  const visible = actions.filter((a) => a !== "refund" || canRefund);
  if (!visible.length) return null;
  const cfg = confirm ? CONFIRM[confirm] : null;
  const label = { approve: "Approve return", update: "Update details", refund: "Issue refund", shipment: "Create return shipment" };

  return (
    <>
      {visible.map((a) =>
        a === "approve" ? (
          <Button
            key={a}
            size="sm"
            variant="primary"
            onClick={() => {
              preview(form);
              setApprove(true);
            }}
          >
            {label.approve}
          </Button>
        ) : a === "update" ? (
          <Button key={a} size="sm" onClick={openUpdate}>{label.update}</Button>
        ) : a === "shipment" ? (
          <Button key={a} size="sm" onClick={() => setShipment(true)}>{label.shipment}</Button>
        ) : a === "refund" ? (
          <Button key={a} size="sm" variant="danger-outline" onClick={openRefund}>{label.refund}</Button>
        ) : CONFIRM[a] ? (
          <Button key={a} size="sm" variant={CONFIRM[a].tone === "danger" ? "danger-outline" : "secondary"} onClick={() => setConfirm(a)}>
            {CONFIRM[a].label}
          </Button>
        ) : null,
      )}
      <Dialog
        open={approve}
        onClose={() => setApprove(false)}
        title="Approve return"
        description="Book a reverse pickup and set the refund policy. The refund amount is calculated by the server."
        footer={
          <>
            <Button variant="secondary" onClick={() => setApprove(false)} disabled={busy}>Cancel</Button>
            <Button variant="primary" onClick={() => run("approve", form)} loading={busy} disabled={!form.pickupService}>Approve and book pickup</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Pickup service" required>
            {({ id: fid }) => <Select id={fid} value={form.pickupService} onChange={(e) => setForm({ ...form, pickupService: e.target.value })} options={serviceOptions(pickupServices, details.pickupService)} placeholder="Select…" />}
          </Field>
          <Checkbox label="Refund the forward shipping charge" checked={form.refundShipping} onChange={(e) => setFlag("refundShipping", e.target.checked)} className="flex" />
          <Checkbox label="Deduct platform fee (3% of item price)" checked={form.deductPlatformFee} onChange={(e) => setFlag("deductPlatformFee", e.target.checked)} className="flex" />
          <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
            Refund on completion: <span className="font-semibold text-ink tabular">{formatINR(amount)}</span>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={update}
        onClose={() => setUpdate(false)}
        title="Update return details"
        description="Pickup service, pickup address and date, courier tracking ID, internal notes and the refund policy. The status does not change."
        footer={
          <>
            <Button variant="secondary" onClick={() => setUpdate(false)} disabled={busy}>Cancel</Button>
            <Button variant="primary" onClick={() => run("update", edit)} loading={busy}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Notice tone="danger">{error}</Notice>}
          <Field label="Pickup service">
            {({ id: fid }) => <Select id={fid} value={edit.pickupService} onChange={(e) => setEdit({ ...edit, pickupService: e.target.value })} options={serviceOptions(pickupServices, details.pickupService)} placeholder="Not selected" />}
          </Field>
          <Field label="Pickup address">
            {({ id: fid }) => <Textarea id={fid} rows={3} value={edit.pickupAddress} onChange={(e) => setEdit({ ...edit, pickupAddress: e.target.value })} placeholder="Enter pickup address" />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expected pickup date">
              {({ id: fid }) => <Input id={fid} type="date" value={edit.expectedPickupDate} onChange={(e) => setEdit({ ...edit, expectedPickupDate: e.target.value })} />}
            </Field>
            <Field label="Courier tracking ID">
              {({ id: fid }) => <Input id={fid} value={edit.courierTrackingId} onChange={(e) => setEdit({ ...edit, courierTrackingId: e.target.value })} placeholder="Enter tracking ID" />}
            </Field>
          </div>
          <Field label="Internal notes" hint="Visible only to the admin team.">
            {({ id: fid }) => <Textarea id={fid} rows={4} value={edit.internalNotes} onChange={(e) => setEdit({ ...edit, internalNotes: e.target.value })} />}
          </Field>
          <Checkbox label="Refund the forward shipping charge" checked={edit.refundShipping} onChange={(e) => setEditFlag("refundShipping", e.target.checked)} className="flex" />
          <Checkbox label="Deduct platform fee (3% of item price)" checked={edit.deductPlatformFee} onChange={(e) => setEditFlag("deductPlatformFee", e.target.checked)} className="flex" />
          <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
            Net refund: <span className="font-semibold text-ink tabular">{formatINR(amount)}</span>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={refund}
        onClose={() => setRefund(false)}
        title="Issue refund"
        description={details.refundRoute?.label || "Refund to the customer's bank account."}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefund(false)} disabled={busy}>Cancel</Button>
            <Button variant="danger" onClick={submitRefund} loading={busy}>Process refund of {formatINR(amount)}</Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Notice tone="danger">{error}</Notice>}
          {details.bank && (
            <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
              {details.bank.holder} · <span className="font-mono text-xs">{details.bank.account}</span> · IFSC <span className="font-mono text-xs">{details.bank.ifsc}</span> · {details.bank.bankName}
            </div>
          )}
          <Checkbox label="Refund the forward shipping charge" checked={pay.refundShipping} onChange={(e) => setPayFlag("refundShipping", e.target.checked)} className="flex" />
          <Checkbox label="Deduct platform fee (3% of item price)" checked={pay.deductPlatformFee} onChange={(e) => setPayFlag("deductPlatformFee", e.target.checked)} className="flex" />
          <Field
            label="Bank transfer transaction ID"
            required={Boolean(details.refundRoute?.bankTransferRequired)}
            hint="Enter the bank transfer transaction/reference number after completing the transfer. It is stored as the refund transaction ID."
          >
            {({ id: fid }) => <Input id={fid} maxLength={100} value={pay.transactionId} onChange={(e) => setPay({ ...pay, transactionId: e.target.value })} placeholder="e.g., NEFT123456789, UPI-TXN-ABC123, IMPS987654321" />}
          </Field>
          <Field label="Internal notes" hint="Added to the return's internal notes and history.">
            {({ id: fid }) => <Textarea id={fid} rows={3} value={pay.reason} onChange={(e) => setPay({ ...pay, reason: e.target.value })} />}
          </Field>
        </div>
      </Dialog>

      {shipment && (
        <ReturnShipmentDialog
          id={id}
          open
          onClose={() => {
            setShipment(false);
            if (openShipment) router.replace(`/admin/returns/${id}`, { scroll: false });
          }}
        />
      )}
      <ConfirmDialog open={Boolean(confirm)} onClose={() => setConfirm(null)} onConfirm={(reason) => run(confirm, { reason })} loading={busy} title={cfg?.title} description={cfg?.description} confirmLabel={cfg?.label} tone={cfg?.tone} requireReason={cfg?.reason} />
    </>
  );
}
