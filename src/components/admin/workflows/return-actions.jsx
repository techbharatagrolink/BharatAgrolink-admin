"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { previewRefundAction, processReturnAction } from "@/lib/actions/admin/workflows";

const CONFIRM = {
  pickup: { label: "Mark picked up", title: "Mark return as picked up?", tone: "warning" },
  received: { label: "Mark received", title: "Confirm the vendor received the item?", tone: "warning" },
  refund: { label: "Issue refund", title: "Issue refund?", description: "Prepaid orders are refunded through Razorpay; COD refunds are queued as a manual bank transfer for finance.", tone: "danger", reason: true },
  replace: { label: "Send replacement", title: "Create a replacement shipment?", tone: "warning" },
  reject: { label: "Reject return", title: "Reject this return?", description: "The customer is notified with your reason.", tone: "danger", reason: true },
};

export function ReturnActions({ id, actions, pickupServices, refundAmount, canRefund }) {
  const router = useRouter();
  const { notify } = useToast();
  const [approve, setApprove] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ pickupService: "", refundShipping: false, deductPlatformFee: false });
  const [amount, setAmount] = useState(refundAmount);
  const [busy, startBusy] = useTransition();

  const run = (action, input) =>
    startBusy(async () => {
      const r = await processReturnAction(id, action, input);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setApprove(false);
        setConfirm(null);
        router.refresh();
      }
    });

  const setFlag = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    startBusy(async () => {
      const r = await previewRefundAction(id, next);
      if (r.ok) setAmount(r.amount);
    });
  };

  const visible = actions.filter((a) => a !== "refund" || canRefund);
  if (!visible.length) return null;
  const cfg = confirm ? CONFIRM[confirm] : null;

  return (
    <>
      {visible.map((a) =>
        a === "approve" ? (
          <Button key={a} size="sm" variant="primary" onClick={() => setApprove(true)}>Approve return</Button>
        ) : (
          <Button key={a} size="sm" variant={CONFIRM[a].tone === "danger" ? "danger-outline" : "secondary"} onClick={() => setConfirm(a)}>
            {CONFIRM[a].label}
          </Button>
        ),
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
            {({ id: fid }) => <Select id={fid} value={form.pickupService} onChange={(e) => setForm({ ...form, pickupService: e.target.value })} options={pickupServices} placeholder="Select…" />}
          </Field>
          <Checkbox label="Refund the forward shipping charge" checked={form.refundShipping} onChange={(e) => setFlag("refundShipping", e.target.checked)} className="flex" />
          <Checkbox label="Deduct platform fee (3% of item price)" checked={form.deductPlatformFee} onChange={(e) => setFlag("deductPlatformFee", e.target.checked)} className="flex" />
          <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
            Refund on completion: <span className="font-semibold text-ink tabular">{formatINR(amount)}</span>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog open={Boolean(confirm)} onClose={() => setConfirm(null)} onConfirm={(reason) => run(confirm, { reason })} loading={busy} title={cfg?.title} description={confirm === "refund" ? `${cfg.description} Amount: ${formatINR(refundAmount)}.` : cfg?.description} confirmLabel={cfg?.label} tone={cfg?.tone} requireReason={cfg?.reason} />
    </>
  );
}
