"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { adjustStockAction, setProductStatusAction } from "@/lib/actions/admin/products";

const ACTIONS = {
  approve: { label: "Approve", title: "Approve product?", description: "The product goes live on the storefront.", tone: "warning", reason: false },
  reject: { label: "Reject", title: "Reject product?", description: "The vendor is notified with your reason and can edit and resubmit.", tone: "danger", reason: true },
  deactivate: { label: "Deactivate", title: "Deactivate listing?", description: "The product is hidden from the storefront and returns to the approval queue.", tone: "danger", reason: true },
};

export function ProductStatusActions({ productId, available }) {
  const router = useRouter();
  const { notify } = useToast();
  const [action, setAction] = useState(null);
  const [busy, startBusy] = useTransition();
  if (!available.length) return null;
  const run = (reason) =>
    startBusy(async () => {
      const r = await setProductStatusAction(productId, action, reason);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setAction(null);
        router.refresh();
      }
    });
  const cfg = action ? ACTIONS[action] : null;
  return (
    <>
      {available.map((a) => (
        <Button key={a} size="sm" variant={ACTIONS[a].tone === "danger" ? "danger-outline" : "primary"} onClick={() => setAction(a)}>
          {ACTIONS[a].label}
        </Button>
      ))}
      <ConfirmDialog open={Boolean(action)} onClose={() => setAction(null)} onConfirm={run} loading={busy} title={cfg?.title} description={cfg?.description} confirmLabel={cfg?.label} tone={cfg?.tone} requireReason={cfg?.reason} />
    </>
  );
}

export function StockControl({ productId, stock }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(stock));
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();
  const submit = () => {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) return setError("Enter a whole number of units (0 or more).");
    if (reason.trim().length < 5) return setError("Please give a reason (at least 5 characters).");
    startBusy(async () => {
      const r = await adjustStockAction(productId, n, reason);
      if (r.ok) {
        notify({ message: r.message, tone: "success" });
        setOpen(false);
        setReason("");
        router.refresh();
      } else setError(r.message);
    });
  };
  return (
    <>
      <Button size="xs" onClick={() => { setValue(String(stock)); setError(null); setOpen(true); }}>
        Adjust stock
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Adjust stock"
        description="Set the available quantity. Vendors normally manage stock from the Seller Panel; admin changes are audited."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button variant="primary" onClick={submit} loading={busy}>Save stock</Button>
          </>
        }
      >
        <div className="space-y-3">
          {error && <p className="text-sm text-danger-ink" role="alert">{error}</p>}
          <Field label="Available units" required>
            {({ id }) => <Input id={id} type="number" min={0} step={1} value={value} onChange={(e) => setValue(e.target.value)} />}
          </Field>
          <Field label="Reason (saved in the audit log)" required>
            {({ id }) => <Textarea id={id} rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Physical count at warehouse" />}
          </Field>
        </div>
      </Dialog>
    </>
  );
}
