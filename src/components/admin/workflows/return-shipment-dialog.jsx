"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { createReturnShipmentAction, returnShipmentFormAction } from "@/lib/actions/admin/workflows";

const PAYMENT = ["Prepaid", "COD"];
const QC = [
  { value: "false", label: "No" },
  { value: "true", label: "Yes" },
];
const REQUIRED = ["order_id", "pickup_customer_name", "pickup_phone", "pickup_address", "pickup_city", "pickup_pincode", "shipping_customer_name", "shipping_phone", "shipping_address", "shipping_city", "shipping_pincode"];

const int = (v, fallback) => Number.parseInt(v, 10) || fallback;

/** buildShipmentPayload() of manage_returns.php. */
function buildPayload(f) {
  return {
    order_id: f.order_id,
    order_date: f.order_date,
    channel_id: int(f.channel_id, 9008786),
    pickup_customer_name: f.pickup_customer_name,
    pickup_last_name: f.pickup_last_name,
    company_name: f.company_name,
    pickup_address: f.pickup_address,
    pickup_address_2: f.pickup_address_2,
    pickup_city: f.pickup_city,
    pickup_state: f.pickup_state,
    pickup_country: "India",
    pickup_pincode: int(f.pickup_pincode, 0),
    pickup_email: f.pickup_email,
    pickup_phone: f.pickup_phone,
    pickup_isd_code: f.pickup_isd_code,
    shipping_customer_name: f.shipping_customer_name,
    shipping_last_name: f.shipping_last_name,
    shipping_address: f.shipping_address,
    shipping_address_2: f.shipping_address_2,
    shipping_city: f.shipping_city,
    shipping_state: f.shipping_state,
    shipping_country: "India",
    shipping_pincode: int(f.shipping_pincode, 0),
    shipping_email: f.shipping_email,
    shipping_phone: f.shipping_phone,
    shipping_isd_code: f.shipping_isd_code,
    order_items: f.order_items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: int(i.units, 1),
      selling_price: Number.parseFloat(i.selling_price) || 0,
      discount: Number.parseFloat(i.discount) || 0,
      hsn: i.hsn,
      qc_enable: i.qc_enable,
      qc_color: "",
      qc_brand: "",
      qc_serial_no: "",
      qc_ean_barcode: "",
      qc_size: "",
      qc_product_imei: "",
      qc_product_name: i.name,
    })),
    payment_method: f.payment_method,
    total_discount: f.total_discount,
    sub_total: Number.parseFloat(f.sub_total) || 0,
    length: int(f.length, 12),
    breadth: int(f.breadth, 20),
    height: int(f.height, 10),
    weight: Math.max(1, int(f.weight, 1)),
    request_pickup: true,
  };
}

/** Form state as strings; the payment method matches the select case-insensitively ("Cod" -> "COD"). */
function toForm(p) {
  const s = (v) => (v == null ? "" : String(v));
  const out = {};
  for (const [k, v] of Object.entries(p)) if (k !== "order_items") out[k] = s(v);
  out.payment_method = PAYMENT.find((m) => m.toLowerCase() === s(p.payment_method).toLowerCase()) ?? "Prepaid";
  out.order_items = (p.order_items ?? []).map((i) => ({ name: s(i.name), sku: s(i.sku), units: s(i.units || 1), selling_price: s(i.selling_price || 0), discount: s(i.discount || 0), hsn: s(i.hsn), qc_enable: i.qc_enable === "true" ? "true" : "false" }));
  if (!out.order_items.length) out.order_items = [{ name: "", sku: "", units: "1", selling_price: "0", discount: "0", hsn: "", qc_enable: "false" }];
  return out;
}

/**
 * "Create Return Shipment" of manage_returns.php: the reverse-pickup form,
 * pre-filled with the customer (pickup) and vendor (delivery) addresses.
 */
export function ReturnShipmentDialog({ id, open, onClose }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [showPayload, setShowPayload] = useState(false);
  const [busy, start] = useTransition();

  useEffect(() => {
    let live = true;
    returnShipmentFormAction(id).then((r) => {
      if (!live) return;
      if (r.ok) setForm(toForm(r.data.payload));
      else setError(r.message || "Failed to load shipment data");
    });
    return () => {
      live = false;
    };
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setItem = (index, key) => (e) => setForm((f) => ({ ...f, order_items: f.order_items.map((i, n) => (n === index ? { ...i, [key]: e.target.value } : i)) }));
  const addItem = () => setForm((f) => ({ ...f, order_items: [...f.order_items, { name: "", sku: "", units: "1", selling_price: "0", discount: "0", hsn: "", qc_enable: "false" }] }));
  const removeItem = (index) => {
    if (form.order_items.length <= 1) return notify({ message: "At least one item is required", tone: "error" });
    setForm((f) => ({ ...f, order_items: f.order_items.filter((_, n) => n !== index) }));
  };

  const submit = () => {
    const payload = buildPayload(form);
    if (REQUIRED.some((k) => !payload[k])) return setError("Please fill all required fields");
    if (!payload.order_items.length) return setError("Please add at least one item");
    setError(null);
    start(async () => {
      const r = await createReturnShipmentAction(id, payload);
      if (!r.ok) return setError(r.message || "Failed to create return shipment");
      const d = r.data;
      notify({ message: [d.message, d.awb && `AWB: ${d.awb}`, d.courier && `Courier: ${d.courier}`, d.pickupScheduledDate && `Pickup: ${d.pickupScheduledDate}`].filter(Boolean).join(" · "), tone: "success" });
      onClose();
      router.refresh();
    });
  };

  const text = (key, label, opts = {}) => (
    <Field label={label} required={REQUIRED.includes(key)}>
      {({ id: fid }) => <Input id={fid} value={form[key]} onChange={set(key)} type={opts.type ?? "text"} readOnly={opts.readOnly} />}
    </Field>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="xl"
      title="Create return shipment"
      description="Books a reverse pickup from the customer to the vendor. Edit any pre-filled value before creating it."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={() => setShowPayload((v) => !v)} disabled={!form}>{showPayload ? "Hide payload" : "Preview payload"}</Button>
          <Button variant="primary" onClick={submit} loading={busy} disabled={!form}>Create return shipment</Button>
        </>
      }
    >
      {error && <Notice tone="danger" className="mb-4">{error}</Notice>}
      {!form ? (
        !error && (
          <div className="space-y-3" aria-busy>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )
      ) : (
        <div className="space-y-5">
          {showPayload && (
            <div className="space-y-2">
              <pre className="max-h-72 overflow-auto rounded-lg bg-surface-muted p-3 text-xs scrollbar-thin">{JSON.stringify(buildPayload(form), null, 2)}</pre>
              <Button size="xs" onClick={() => navigator.clipboard.writeText(JSON.stringify(buildPayload(form), null, 2)).then(() => notify({ message: "Payload copied to clipboard", tone: "success" }), () => notify({ message: "Failed to copy payload", tone: "error" }))}>
                Copy to clipboard
              </Button>
            </div>
          )}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Order information</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {text("order_id", "Order ID", { readOnly: true })}
              {text("order_date", "Order date", { type: "date" })}
              {text("channel_id", "Channel ID", { type: "number" })}
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Pickup (customer)</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {text("pickup_customer_name", "First name")}
              {text("pickup_last_name", "Last name")}
              {text("company_name", "Company name")}
              {text("pickup_phone", "Phone")}
              {text("pickup_isd_code", "ISD code")}
              {text("pickup_email", "Email")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {text("pickup_address", "Address")}
              {text("pickup_address_2", "Address line 2")}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {text("pickup_city", "City")}
              {text("pickup_state", "State")}
              {text("pickup_pincode", "Pincode", { type: "number" })}
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Delivery (vendor)</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {text("shipping_customer_name", "First name")}
              {text("shipping_last_name", "Last name")}
              {text("shipping_phone", "Phone")}
              {text("shipping_isd_code", "ISD code")}
              {text("shipping_email", "Email")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {text("shipping_address", "Address")}
              {text("shipping_address_2", "Address line 2")}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {text("shipping_city", "City")}
              {text("shipping_state", "State")}
              {text("shipping_pincode", "Pincode", { type: "number" })}
            </div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-ink">Items</h3>
              <Button size="xs" onClick={addItem}>Add item</Button>
            </div>
            {form.order_items.map((item, n) => (
              <div key={n} className="space-y-3 rounded-lg border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink-soft">Item #{n + 1}</span>
                  <Button size="xs" variant="danger-outline" onClick={() => removeItem(n)}>Remove</Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Product name" required>{({ id: fid }) => <Input id={fid} value={item.name} onChange={setItem(n, "name")} />}</Field>
                  <Field label="SKU">{({ id: fid }) => <Input id={fid} value={item.sku} onChange={setItem(n, "sku")} />}</Field>
                  <Field label="HSN code">{({ id: fid }) => <Input id={fid} value={item.hsn} onChange={setItem(n, "hsn")} />}</Field>
                  <Field label="Units" required>{({ id: fid }) => <Input id={fid} type="number" min={1} value={item.units} onChange={setItem(n, "units")} />}</Field>
                  <Field label="Price" required>{({ id: fid }) => <Input id={fid} type="number" step="0.01" value={item.selling_price} onChange={setItem(n, "selling_price")} />}</Field>
                  <Field label="Discount">{({ id: fid }) => <Input id={fid} type="number" step="0.01" value={item.discount} onChange={setItem(n, "discount")} />}</Field>
                  <Field label="QC enable">{({ id: fid }) => <Select id={fid} value={item.qc_enable} onChange={setItem(n, "qc_enable")} options={QC} />}</Field>
                </div>
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Payment and package</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Payment method" required>{({ id: fid }) => <Select id={fid} value={form.payment_method} onChange={set("payment_method")} options={PAYMENT} />}</Field>
              {text("total_discount", "Total discount")}
              {text("sub_total", "Sub total", { type: "number" })}
              {text("weight", "Weight (kg)", { type: "number" })}
              {text("length", "Length (cm)", { type: "number" })}
              {text("breadth", "Breadth (cm)", { type: "number" })}
              {text("height", "Height (cm)", { type: "number" })}
            </div>
          </section>
        </div>
      )}
    </Dialog>
  );
}
