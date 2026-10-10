"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { Notice, Timeline } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatINR } from "@/lib/format";
import { payPayoutItemsAction, payoutItemTimelineAction, updatePayoutItemAction } from "@/lib/actions/admin/payout-items";

const PROOF_TYPES = ".pdf,.jpg,.jpeg,.png,.gif,.webp";
const fileClasses = "block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium";

/** PHP "Add Payment" / row "Pay": marks the chosen pending items paid with one transaction ID and invoice proof. */
export function PayItemsDialog({ payoutId, items, onClose, onPaid }) {
  const router = useRouter();
  const { notify } = useToast();
  const [transactionId, setTransactionId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();
  const open = items.length > 0;
  const total = items.reduce((s, r) => s + (Number(r.finalPayout) || 0), 0);

  const submit = () => {
    setError(null);
    if (!transactionId.trim()) return setError("Transaction ID is required.");
    if (!file) return setError("Attach the invoice proof (PDF or image).");
    if (file.size > 10 * 1024 * 1024) return setError("Invoice proof must be 10 MB or smaller.");
    const form = new FormData();
    form.set("transactionId", transactionId.trim());
    form.set("itemIds", JSON.stringify(items.map((r) => r.id)));
    form.set("file", file);
    startBusy(async () => {
      const r = await payPayoutItemsAction(payoutId, form);
      if (!r.ok) return setError(r.message);
      notify({ message: r.message || `${items.length} item(s) marked paid.`, tone: "success" });
      onPaid?.();
      onClose();
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? () => {} : onClose}
      title="Add Payment"
      description={`${items.length} pending item${items.length === 1 ? "" : "s"} · Final seller Payout ${formatINR(total)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={busy}>Save payment</Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Notice tone="danger">{error}</Notice>}
        <div className="max-h-40 overflow-auto rounded-lg border border-line text-xs">
          <ul className="divide-y divide-line">
            {items.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-1.5">
                <span className="min-w-0 truncate"><span className="font-mono">{r.orderId}</span> · {r.productName}</span>
                <span className="shrink-0 tabular">{formatINR(r.finalPayout)}</span>
              </li>
            ))}
          </ul>
        </div>
        <Field label="Transaction ID" required>
          {({ id }) => <Input id={id} value={transactionId} maxLength={500} autoComplete="off" onChange={(e) => setTransactionId(e.target.value)} />}
        </Field>
        <Field label="Invoice proof" required hint="PDF, JPG, PNG, GIF or WEBP, up to 10 MB. Saved with each selected item.">
          {({ id }) => <input id={id} type="file" accept={PROOF_TYPES} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className={fileClasses} />}
        </Field>
        <p className="text-xs text-ink-muted">The transaction date is recorded as now. Only pending items are updated; paid items are left unchanged.</p>
      </div>
    </Dialog>
  );
}

/* PHP edit form: visible fields only; the hidden PHP inputs are re-sent unchanged by PHP, so they are left out here. */
const EDIT_INPUTS = [
  { key: "invoiceNumber", label: "Invoice Number", type: "text" },
  { key: "balInvoiceNumber", label: "Bharat Agrolink Invoice", type: "text" },
  { key: "qty", label: "Quantity", type: "number", step: "1" },
  { key: "grossAmount", label: "Total Order value", type: "number" },
  { key: "netAmount", label: "Grand Total", type: "number" },
  { key: "tcs", label: "TCS", type: "number" },
  { key: "gstInput", label: "GST Input", type: "number" },
  { key: "singleQtyNrv", label: "Single Qty NRV", type: "number" },
  { key: "deliveryDate", label: "Delivery Date", type: "date" },
];

function initialEdit(row) {
  const e = row?.edit ?? {};
  return Object.fromEntries(EDIT_INPUTS.map((f) => [f.key, f.key === "tcs" ? String(row?.tcs ?? "") : String(e[f.key] ?? "")]));
}

export function EditItemDialog({ payoutId, row, onClose }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(() => initialEdit(row));
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();

  const submit = () => {
    setError(null);
    const qty = Number(form.qty);
    if (!Number.isInteger(qty) || qty <= 0) return setError("Quantity must be a whole number above 0.");
    const body = {
      invoiceNumber: form.invoiceNumber.trim(),
      balInvoiceNumber: form.balInvoiceNumber.trim(),
      qty: form.qty.trim(),
      grossAmount: form.grossAmount.trim(),
      netAmount: form.netAmount.trim(),
      tcs: form.tcs.trim(),
      gstInput: form.gstInput.trim(),
      deliveryDate: form.deliveryDate,
    };
    if (form.singleQtyNrv.trim() !== "") {
      const single = Number(form.singleQtyNrv);
      if (!Number.isFinite(single)) return setError("Single Qty NRV must be a number.");
      body.totalNrv = (single * qty).toFixed(2);
    }
    startBusy(async () => {
      const r = await updatePayoutItemAction(payoutId, row.id, body);
      if (!r.ok) return setError(r.message);
      notify({ message: r.message || "Payout item updated.", tone: "success" });
      onClose();
      router.refresh();
    });
  };

  return (
    <Dialog
      open={Boolean(row)}
      onClose={busy ? () => {} : onClose}
      size="lg"
      title={`Edit item ${row?.id ?? ""}`}
      description={row ? `${row.orderId} · ${row.productName}` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={submit} loading={busy}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Notice tone="danger">{error}</Notice>}
        <div className="grid gap-4 sm:grid-cols-2">
          {EDIT_INPUTS.map((f) => (
            <Field key={f.key} label={f.label}>
              {({ id }) => (
                <Input
                  id={id}
                  type={f.type}
                  step={f.type === "number" ? (f.step ?? "0.01") : undefined}
                  inputMode={f.type === "number" ? "decimal" : undefined}
                  value={form[f.key]}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                />
              )}
            </Field>
          ))}
        </div>
        <p className="text-xs text-ink-muted">
          Total NRV is saved as Single Qty NRV × Quantity, as in PHP. Changing the delivery date also updates the order line. The payout cycle is not
          changed from here.
        </p>
      </div>
    </Dialog>
  );
}

export function ItemHistoryDialog({ payoutId, row, onClose }) {
  const [state, setState] = useState({ loading: Boolean(row), data: null, error: null });

  useEffect(() => {
    if (!row) return;
    let live = true;
    payoutItemTimelineAction(payoutId, row.id).then((r) => {
      if (live) setState({ loading: false, data: r.ok ? r : null, error: r.ok ? null : r.message });
    });
    return () => {
      live = false;
    };
  }, [payoutId, row]);

  const items = (state.data?.timeline ?? []).map((t) => ({
    id: t.id,
    title: t.summary || t.actionType,
    description: t.user ? `${t.actionType} · ${t.user}` : t.actionType,
    meta: formatDateTime(t.at),
  }));

  return (
    <Dialog open={Boolean(row)} onClose={onClose} size="lg" title={`History · item ${row?.id ?? ""}`} description={row ? `${row.orderId} · ${row.productName}` : undefined}>
      {state.loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : state.error ? (
        <Notice tone="danger">{state.error}</Notice>
      ) : items.length ? (
        <Timeline items={items} />
      ) : (
        <p className="text-sm text-ink-muted">No history recorded for this item yet.</p>
      )}
    </Dialog>
  );
}
