"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { payoutActionAction } from "@/lib/actions/admin/workflows";

export function PayoutActions({ id, status, amount, vendorReady }) {
  const router = useRouter();
  const { notify } = useToast();
  const [confirm, setConfirm] = useState(null);
  const [pay, setPay] = useState(false);
  const [form, setForm] = useState({ transactionId: "", proofName: "", reason: "" });
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();

  const run = (action, input) =>
    startBusy(async () => {
      const r = await payoutActionAction(id, action, input);
      if (r.ok) {
        notify({ message: r.message, tone: "success" });
        setConfirm(null);
        setPay(false);
        router.refresh();
      } else if (action === "pay") setError(r.message);
      else notify({ message: r.message, tone: "error" });
    });

  const submitPay = () => {
    setError(null);
    if (!/^[A-Za-z0-9]{10,22}$/.test(form.transactionId.trim())) return setError("Enter a valid bank UTR / transaction ID (10–22 letters or digits).");
    if (!form.proofName) return setError("Attach the payment proof (PDF or image).");
    if (form.reason.trim().length < 5) return setError("Add a note for the audit log (at least 5 characters).");
    run("pay", form);
  };

  return (
    <>
      {status === "Pending" && (
        <>
          <Button size="sm" variant="secondary" onClick={() => setConfirm("hold")}>Put on hold</Button>
          <Button size="sm" variant="primary" onClick={() => { setError(null); setPay(true); }}>Mark as paid</Button>
        </>
      )}
      {status === "On Hold" && <Button size="sm" variant="primary" onClick={() => setConfirm("release")}>Release hold</Button>}

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={(reason) => run(confirm, { reason })}
        loading={busy}
        tone="warning"
        title={confirm === "hold" ? "Put payout on hold?" : "Release payout hold?"}
        description={confirm === "hold" ? "The vendor is not paid in this cycle until the hold is released." : "The payout becomes payable in its cycle."}
        confirmLabel={confirm === "hold" ? "Put on hold" : "Release"}
        requireReason
      />

      <Dialog
        open={pay}
        onClose={() => setPay(false)}
        title="Mark payout as paid"
        description={`Record the bank transfer of ${formatINR(amount)}. This cannot be undone from the panel.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPay(false)} disabled={busy}>Cancel</Button>
            <Button variant="danger" onClick={submitPay} loading={busy} disabled={!vendorReady}>Confirm payment</Button>
          </>
        }
      >
        <div className="space-y-4">
          {!vendorReady && <Notice tone="danger">The vendor must be active with verified KYC before payment.</Notice>}
          {error && <Notice tone="danger">{error}</Notice>}
          <Field label="Bank UTR / transaction ID" required>
            {({ id: fid }) => <Input id={fid} value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value.toUpperCase() })} autoComplete="off" />}
          </Field>
          <Field label="Payment proof" required hint="Bank advice or statement (PDF, PNG or JPG). Uploaded to secure storage when the payouts API is connected.">
            {({ id: fid }) => <input id={fid} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setForm({ ...form, proofName: e.target.files?.[0]?.name ?? "" })} className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium" />}
          </Field>
          <Field label="Note (saved in the audit log)" required>
            {({ id: fid }) => <Textarea id={fid} rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />}
          </Field>
        </div>
      </Dialog>
    </>
  );
}
