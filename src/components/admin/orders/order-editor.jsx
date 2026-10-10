"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { updateLineBoxAction, updateLineShippingAction, updateOrderAddressAction, updateOrderAwbAction, updateOrderPaymentAction } from "@/lib/actions/admin/orders";

function useSave() {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const save = (work) => {
    startTransition(async () => {
      const result = await work();
      notify({ message: result.message || (result.ok ? "Saved." : "Could not save."), tone: result.ok ? "success" : "error" });
      if (result.ok) router.refresh();
    });
  };
  return { pending, save };
}

/** edit_order.php: delivery address, payment correction, AWB and per-line shipping. */
export function OrderEditor({ orderId, editor, lines, focus = "" }) {
  const { pending, save } = useSave();
  const [address, setAddress] = useState(editor.address);
  const [payment, setPayment] = useState({
    mode: ["cod", "prepaid", "partial"].includes(editor.payment.mode) ? editor.payment.mode : "cod",
    paymentId: editor.payment.paymentId || "",
    advanceAmount: editor.payment.advanceAmount || "",
  });
  const [awb, setAwb] = useState("");
  const setA = (key) => (event) => setAddress((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="space-y-6">
      {(!focus || focus === "address") && <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); save(() => updateOrderAddressAction(orderId, address)); }}>
        <h3 className="sm:col-span-2 text-sm font-semibold text-ink">Delivery address</h3>
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
        <div className="sm:col-span-2 flex justify-end"><Button type="submit" variant="primary" loading={pending}>Save address</Button></div>
      </form>}

      {(!focus || focus === "payment") && <form className="grid gap-3 border-t border-line pt-4 sm:grid-cols-3" onSubmit={(event) => { event.preventDefault(); save(() => updateOrderPaymentAction(orderId, { mode: payment.mode, paymentId: payment.paymentId, advanceAmount: Number(payment.advanceAmount) || 0 })); }}>
        <h3 className="sm:col-span-3 text-sm font-semibold text-ink">Payment</h3>
        <Field label="Mode">{({ id }) => <Select id={id} value={payment.mode} onChange={(event) => setPayment((current) => ({ ...current, mode: event.target.value }))} options={[{ value: "cod", label: "COD" }, { value: "prepaid", label: "Prepaid" }, { value: "partial", label: "Partial" }]} />}</Field>
        <Field label="Payment ID">{({ id }) => <Input id={id} value={payment.paymentId} onChange={(event) => setPayment((current) => ({ ...current, paymentId: event.target.value }))} />}</Field>
        <Field label="Advance amount">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={payment.advanceAmount} onChange={(event) => setPayment((current) => ({ ...current, advanceAmount: event.target.value }))} />}</Field>
        <div className="sm:col-span-3 flex justify-end"><Button type="submit" variant="primary" loading={pending}>Update Payment</Button></div>
      </form>}

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
