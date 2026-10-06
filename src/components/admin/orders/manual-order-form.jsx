"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startRouteProgress } from "@/components/admin/shell/route-progress";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { createManualOrderAction } from "@/lib/actions/admin/orders";

export function ManualOrderForm({ options }) {
  const router = useRouter();
  const { notify } = useToast();
  const [customerId, setCustomerId] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [salesman, setSalesman] = useState("");
  const [items, setItems] = useState([{ key: 1, productId: "", qty: "1" }]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, startSaving] = useTransition();

  const productMap = new Map(options.products.map((p) => [p.value, p]));
  const estimate = items.reduce((sum, i) => sum + (productMap.get(i.productId)?.price ?? 0) * (Number(i.qty) || 0), 0);

  const update = (key, patch) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!customerId) nextErrors.customerId = "Choose a customer.";
    if (!items.some((i) => i.productId)) nextErrors.items = "Add at least one product.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    startSaving(async () => {
      const result = await createManualOrderAction({ customerId, paymentMode, salesman: salesman || null, items: items.filter((i) => i.productId).map((i) => ({ productId: i.productId, qty: i.qty })) });
      if (result.ok) {
        notify({ message: result.message, tone: "success" });
        startRouteProgress();
        router.push(`/admin/orders/${encodeURIComponent(result.id)}`);
      } else {
        setFormError(result.message);
        if (result.fieldErrors) setErrors(result.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 xl:grid-cols-3">
      <div className="min-w-0 space-y-4 xl:col-span-2">
        {formError && <Notice tone="danger">{formError}</Notice>}
        <Card>
          <CardHeader title="Customer and payment" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer" required error={errors.customerId} className="sm:col-span-2">
              {({ id, invalid, describedBy }) => <Select id={id} value={customerId} onChange={(e) => setCustomerId(e.target.value)} options={options.customers} placeholder="Select customer…" aria-invalid={invalid || undefined} aria-describedby={describedBy} />}
            </Field>
            <Field label="Payment mode" required error={errors.paymentMode}>
              {({ id }) => <Select id={id} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={[{ value: "COD", label: "Cash on delivery" }, { value: "Prepaid", label: "Prepaid (payment link)" }, { value: "Partial", label: "Partial advance + COD" }]} />}
            </Field>
            <Field label="Salesman (for incentive credit)">
              {({ id }) => <Select id={id} value={salesman} onChange={(e) => setSalesman(e.target.value)} options={options.salesmen} placeholder="None" />}
            </Field>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Products" description="Only live, in-stock products are listed" actions={<Button size="xs" type="button" onClick={() => setItems((l) => [...l, { key: Math.max(0, ...l.map((i) => i.key)) + 1, productId: "", qty: "1" }])}><Plus className="size-3.5" aria-hidden /> Add line</Button>} />
          <CardBody className="space-y-3">
            {errors.items && <p className="text-xs text-danger-ink" role="alert">{errors.items}</p>}
            {items.map((item, index) => (
              <div key={item.key} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <Field label={`Product ${index + 1}`} className="flex-1">
                  {({ id }) => <Select id={id} value={item.productId} onChange={(e) => update(item.key, { productId: e.target.value })} options={options.products.map(({ value, label }) => ({ value, label }))} placeholder="Select product…" />}
                </Field>
                <Field label="Qty" className="w-full sm:w-24">
                  {({ id }) => <Input id={id} type="number" min={1} max={Math.min(50, productMap.get(item.productId)?.stock ?? 50)} value={item.qty} onChange={(e) => update(item.key, { qty: e.target.value })} />}
                </Field>
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove product ${index + 1}`} disabled={items.length === 1} onClick={() => setItems((l) => l.filter((i) => i.key !== item.key))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
      <div className="min-w-0">
        <Card className="xl:sticky xl:top-20">
          <CardHeader title="Summary" />
          <CardBody className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Items (estimate)</span>
              <span className="font-semibold text-ink tabular">{formatINR(estimate)}</span>
            </div>
            <p className="text-xs text-ink-muted">Final prices, GST split, shipping and COD handling are calculated by the server from the product master when the order is created.</p>
            <Button type="submit" variant="primary" className="w-full" loading={saving}>
              Create order
            </Button>
          </CardBody>
        </Card>
      </div>
    </form>
  );
}
