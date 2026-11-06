"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatINR } from "@/lib/format";
import { lookupPaymentsAction, updateLineBoxAction, updateLineShippingAction, updateOrderAddressAction, updateOrderAwbAction, updateOrderPaymentAction } from "@/lib/actions/admin/orders";

function useSave() {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const save = (work, onSaved) => {
    startTransition(async () => {
      const result = await work();
      notify({ message: result.message || (result.ok ? "Saved." : "Could not save."), tone: result.ok ? "success" : "error" });
      if (result.ok) {
        router.refresh();
        onSaved?.();
      }
    });
  };
  return { pending, save };
}

/** edit_order.php delivery address, edited in a dialog from the order page's Edit Address. */
export function OrderAddressDialog({ orderId, address, open, onClose }) {
  const { pending, save } = useSave();
  const formId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit delivery address"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" form={formId} variant="primary" loading={pending}>Save address</Button>
        </>
      }
    >
      {/* Mounted only while open, so each opening starts from the saved address. */}
      <AddressForm id={formId} initial={address} onSubmit={(value) => save(() => updateOrderAddressAction(orderId, value), onClose)} />
    </Dialog>
  );
}

function AddressForm({ id: formId, initial, onSubmit }) {
  const [address, setAddress] = useState(initial);
  const setA = (key) => (event) => setAddress((current) => ({ ...current, [key]: event.target.value }));
  return (
    <form id={formId} className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(address); }}>
      <Field label="Name" required>{({ id }) => <Input id={id} value={address.name} onChange={setA("name")} required />}</Field>
      <Field label="Mobile" required>{({ id }) => <Input id={id} value={address.mobile} onChange={setA("mobile")} inputMode="numeric" maxLength={10} required />}</Field>
      <Field label="Alternate mobile">{({ id }) => <Input id={id} value={address.alternateMobile} onChange={setA("alternateMobile")} inputMode="numeric" maxLength={10} />}</Field>
      <Field label="Email">{({ id }) => <Input id={id} type="email" value={address.email} onChange={setA("email")} />}</Field>
      <Field label="Full address" className="sm:col-span-2" required>{({ id }) => <Textarea id={id} value={address.address} onChange={setA("address")} required />}</Field>
      <Field label="Area / locality">{({ id }) => <Input id={id} value={address.area} onChange={setA("area")} />}</Field>
      <Field label="City" required>{({ id }) => <Input id={id} value={address.city} onChange={setA("city")} required />}</Field>
      <Field label="State" required>{({ id }) => <Input id={id} value={address.state} onChange={setA("state")} required />}</Field>
      <Field label="Pincode" required>{({ id }) => <Input id={id} value={address.pincode} onChange={setA("pincode")} inputMode="numeric" maxLength={6} required />}</Field>
      <Field label="Country">{({ id }) => <Input id={id} value={address.country} onChange={setA("country")} />}</Field>
      <Field label="Address type">{({ id }) => (
        <Select
          id={id}
          value={address.type || ""}
          onChange={setA("type")}
          options={[
            ...(address.type && !["Home", "Work", "Other"].includes(address.type) ? [{ value: address.type, label: address.type }] : []),
            { value: "Home", label: "Home" },
            { value: "Work", label: "Work" },
            { value: "Other", label: "Other" },
          ]}
          placeholder="Select type"
        />
      )}</Field>
    </form>
  );
}

const paymentInput = (payment) => {
  const ids = String(payment.paymentId || "")
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    mode: payment.mode,
    paymentId: ids.join(", "),
    advanceAmount: Number(payment.advanceAmount) || 0,
  };
};

/** edit_order.php payment correction, edited in a dialog from the order page's Update Payment. */
export function OrderPaymentDialog({ orderId, payment, open, onClose }) {
  const { pending, save } = useSave();
  const formId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Update payment"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button>
          <Button type="submit" form={formId} variant="primary" loading={pending}>Update Payment</Button>
        </>
      }
    >
      <PaymentForm id={formId} initial={payment} className="sm:grid-cols-2" onSubmit={(value) => save(() => updateOrderPaymentAction(orderId, paymentInput(value)), onClose)} />
    </Dialog>
  );
}

function PaymentForm({ id: formId, initial, className, onSubmit }) {
  const [payment, setPayment] = useState({
    mode: ["cod", "prepaid", "partial"].includes(initial.mode) ? initial.mode : "cod",
    paymentId: initial.paymentId || "",
    advanceAmount: initial.advanceAmount || "",
  });
  const [breakdown, setBreakdown] = useState([]);
  const [mergedTotal, setMergedTotal] = useState(0);
  const [loadingLookup, setLoadingLookup] = useState(false);

  const set = (key) => (event) => setPayment((current) => ({ ...current, [key]: event.target.value }));

  // Debounced lookup of payment IDs
  useEffect(() => {
    const raw = String(payment.paymentId || "");
    const ids = Array.from(new Set(raw.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean)));
    if (ids.length === 0) {
      setBreakdown([]);
      setMergedTotal(0);
      return;
    }

    let active = true;
    setLoadingLookup(true);
    const timer = setTimeout(async () => {
      try {
        const res = await lookupPaymentsAction(ids);
        if (!active) return;
        if (res && Array.isArray(res.payments)) {
          setBreakdown(res.payments);
          const total = Number(res.totalAmount) || 0;
          setMergedTotal(total);
          // Auto-fill advance amount if partial and current advance is 0 or empty
          if (payment.mode === "partial" && total > 0 && (!payment.advanceAmount || Number(payment.advanceAmount) === 0)) {
            setPayment((p) => ({ ...p, advanceAmount: total }));
          }
        }
      } catch {
        // ignore
      } finally {
        if (active) setLoadingLookup(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [payment.paymentId, payment.mode]);

  const removePaymentId = (pid) => {
    const raw = String(payment.paymentId || "");
    const remaining = raw
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter((id) => id && id !== pid);
    setPayment((p) => ({ ...p, paymentId: remaining.join(" ") }));
  };

  return (
    <form id={formId} className={`grid gap-3 ${className}`} onSubmit={(event) => { event.preventDefault(); onSubmit(payment); }}>
      <Field label="Mode">
        {({ id }) => (
          <Select
            id={id}
            value={payment.mode}
            onChange={set("mode")}
            options={[
              { value: "cod", label: "COD" },
              { value: "prepaid", label: "Prepaid" },
              { value: "partial", label: "Partial" },
            ]}
          />
        )}
      </Field>
      <Field label="Advance amount">
        {({ id }) => (
          <div>
            <Input id={id} type="number" min="0" step="0.01" value={payment.advanceAmount} onChange={set("advanceAmount")} />
            {mergedTotal > 0 && payment.mode === "partial" && Number(payment.advanceAmount) !== mergedTotal && (
              <button
                type="button"
                onClick={() => setPayment((p) => ({ ...p, advanceAmount: mergedTotal }))}
                className="mt-1 text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline cursor-pointer"
              >
                Set to merged total ({formatINR(mergedTotal)})
              </button>
            )}
          </div>
        )}
      </Field>
      <Field
        label="Payment ID"
        className="sm:col-span-full"
        hint="Paste multiple payment IDs separated by space or comma (e.g. pay_TwVLi192kSKbeV pay_TwW08TOU8FMtCx)"
      >
        {({ id }) => (
          <div className="space-y-1">
            <div className="relative">
              <Input
                id={id}
                value={payment.paymentId}
                onChange={set("paymentId")}
                placeholder="pay_TwVLi192kSKbeV pay_TwW08TOU8FMtCx"
              />
              {loadingLookup && (
                <div className="absolute right-2.5 top-2.5">
                  <Loader2 className="size-4 animate-spin text-ink-muted" />
                </div>
              )}
            </div>
          </div>
        )}
      </Field>

      {/* Multi-payment breakdown list and merged total */}
      {breakdown.length > 0 && (
        <div className="sm:col-span-full space-y-2 rounded-lg border border-line bg-surface-muted/50 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <span className="flex items-center gap-1.5">
              <span>Payment Details ({breakdown.length})</span>
              {loadingLookup && <Loader2 className="size-3 animate-spin text-ink-muted" />}
            </span>
            <span className="text-brand-700">Merged Total: {formatINR(mergedTotal)}</span>
          </div>

          <div className="space-y-2">
            {breakdown.map((item) => (
              <div
                key={item.paymentId}
                className="flex flex-col gap-1.5 rounded-md border border-line bg-surface p-2.5 text-xs shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="font-mono font-medium text-ink truncate">{item.paymentId}</span>
                    <Badge
                      tone={
                        item.status === "captured" || item.status === "Placed" || item.status === "Success" || item.status === "paid"
                          ? "success"
                          : item.found
                            ? "info"
                            : "neutral"
                      }
                      className="text-[10px]"
                    >
                      {item.status || "Unknown"}
                    </Badge>
                    {item.source && (
                      <span className="text-[10px] text-ink-muted hidden sm:inline">
                        ({item.source === "manual_order_payment_attempts" ? "attempt" : item.source})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-ink tabular-nums">
                      {formatINR(item.amount || 0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePaymentId(item.paymentId)}
                      className="rounded p-1 text-ink-muted hover:bg-danger-bg hover:text-danger-ink cursor-pointer"
                      title="Remove payment ID"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rich payment details: Method, VPA, RRN, Bank, Card, Date */}
                {(item.method || item.vpa || item.rrn || item.bank || item.cardLast4 || item.createdAt) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted border-t border-line/60 pt-1.5 mt-0.5">
                    {item.method && (
                      <span className="inline-flex items-center gap-1 font-semibold text-ink uppercase tracking-wide">
                        <CreditCard className="size-3 text-ink-muted" />
                        {item.method}
                      </span>
                    )}
                    {item.vpa && (
                      <span>VPA: <strong className="font-medium text-ink">{item.vpa}</strong></span>
                    )}
                    {item.rrn && (
                      <span>RRN / UTR: <strong className="font-mono font-medium text-ink">{item.rrn}</strong></span>
                    )}
                    {item.cardLast4 && (
                      <span>Card: <strong className="font-medium text-ink">{item.cardNetwork ? `${item.cardNetwork} ` : ''}•••• {item.cardLast4}</strong></span>
                    )}
                    {item.bank && (
                      <span>Bank: <strong className="font-medium text-ink">{item.bank}</strong></span>
                    )}
                    {item.createdAt && (
                      <span>Date: <span className="text-ink">{formatDateTime(item.createdAt)}</span></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-md bg-brand-50 px-3 py-2 text-xs">
            <div className="flex items-center gap-2 font-medium text-brand-900">
              <CheckCircle2 className="size-4 text-brand-600" />
              <span>
                Merged Total ({breakdown.length} {breakdown.length === 1 ? "payment" : "payments"}):{" "}
                <strong className="text-sm font-bold text-brand-700">{formatINR(mergedTotal)}</strong>
              </span>
            </div>
            {payment.mode === "partial" && (
              <button
                type="button"
                onClick={() => setPayment((p) => ({ ...p, advanceAmount: mergedTotal }))}
                className="rounded bg-brand-600 px-2.5 py-1 font-semibold text-white hover:bg-brand-700 shadow-2xs cursor-pointer"
              >
                Apply as Advance ({formatINR(mergedTotal)})
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}

/** edit_order.php: payment correction, AWB and per-line shipping. The delivery address is OrderAddressDialog. */
export function OrderEditor({ orderId, editor, lines, focus = "" }) {
  const { pending, save } = useSave();
  const paymentFormId = useId();
  const [awb, setAwb] = useState("");

  return (
    <div className="space-y-6">
      {(!focus || focus === "payment") && <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">Payment</h3>
        <PaymentForm id={paymentFormId} initial={editor.payment} className="sm:grid-cols-3" onSubmit={(value) => save(() => updateOrderPaymentAction(orderId, paymentInput(value)))} />
        <div className="flex justify-end"><Button type="submit" form={paymentFormId} variant="primary" loading={pending}>Update Payment</Button></div>
      </div>}

      {!focus && <form className="flex flex-wrap items-end gap-3 border-t border-line pt-4" onSubmit={(event) => { event.preventDefault(); save(() => updateOrderAwbAction(orderId, { awb })); }}>
        <Field label="Manual AWB" className="min-w-56 flex-1">{({ id }) => <Input id={id} value={awb} onChange={(event) => setAwb(event.target.value)} required />}</Field>
        <Button type="submit" loading={pending}>Save AWB</Button>
      </form>}

      {!focus && <div className="space-y-4 border-t border-line pt-4">
        <h3 className="text-sm font-semibold text-ink">Line shipping</h3>
        {lines.map((line) => <LineShipping key={line.id} orderId={orderId} line={line} pending={pending} save={save} />)}
      </div>}
    </div>
  );
}

function LineShipping({ orderId, line, pending, save }) {
  const [shipping, setShipping] = useState({
    status: line.status || "Placed",
    pickupType: line.pickupType || "",
    trackingId: line.awb || "",
    trackingUrl: line.trackingUrl || "",
  });
  const [box, setBox] = useState({
    weight: line.box?.weight || "",
    length: line.box?.length || "",
    width: line.box?.width || "",
    height: line.box?.height || "",
  });
  return (
    <div className="rounded-lg border border-line p-3">
      <p className="text-sm font-medium text-ink">{line.productName}</p>
      <form className="mt-3 grid gap-3 sm:grid-cols-4" onSubmit={(event) => { event.preventDefault(); save(() => updateLineShippingAction(orderId, line.id, shipping)); }}>
        <p className="text-sm"><span className="mb-1 block text-xs text-ink-muted">Status</span><span className="font-medium text-ink">{shipping.status}</span></p>
        <Field label="Pickup">{({ id }) => <Input id={id} value={shipping.pickupType} onChange={(event) => setShipping((current) => ({ ...current, pickupType: event.target.value }))} placeholder="self" />}</Field>
        <Field label="AWB">{({ id }) => <Input id={id} value={shipping.trackingId} onChange={(event) => setShipping((current) => ({ ...current, trackingId: event.target.value }))} />}</Field>
        <Field label="Tracking URL">{({ id }) => <Input id={id} value={shipping.trackingUrl} onChange={(event) => setShipping((current) => ({ ...current, trackingUrl: event.target.value }))} />}</Field>
        <div className="sm:col-span-4 flex justify-end"><Button type="submit" size="sm" loading={pending}>Save shipping</Button></div>
      </form>
      <form className="mt-2 grid gap-3 sm:grid-cols-4" onSubmit={(event) => { event.preventDefault(); save(() => updateLineBoxAction(orderId, line.id, box)); }}>
        {[["weight", "Weight (g)"], ["length", "Length (cm)"], ["width", "Width (cm)"], ["height", "Height (cm)"]].map(([key, label]) => (
          <Field key={key} label={label}>{({ id }) => <Input id={id} type="number" min="0.01" step="0.01" value={box[key]} onChange={(event) => setBox((current) => ({ ...current, [key]: event.target.value }))} required />}</Field>
        ))}
        <div className="sm:col-span-4 flex justify-end"><Button type="submit" size="sm" loading={pending}>Save box</Button></div>
      </form>
    </div>
  );
}
