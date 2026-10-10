"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { createReturnRequestAction, returnCustomerOrdersAction, searchReturnCustomersAction } from "@/lib/actions/admin/workflows";

/**
 * manage_returns.php "Add Return Request": find the customer (name, mobile,
 * email or order id), tick delivered items that are not returned yet, pick a
 * reason and attach up to 5 photos. One return request is created per item.
 */
export function AddReturnRequest({ reasons }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ loading: false, list: [], message: "" });
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState({ loading: false, list: [], message: "" });
  const [picked, setPicked] = useState([]);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [saving, startSaving] = useTransition();

  const reset = () => {
    setSearch("");
    setResults({ loading: false, list: [], message: "" });
    setCustomer(null);
    setOrders({ loading: false, list: [], message: "" });
    setPicked([]);
    setReason("");
    setDetail("");
    setFiles([]);
    setError(null);
  };

  // searchCustomer(): from 3 characters.
  useEffect(() => {
    const q = search.trim();
    if (customer || q.length < 3) return undefined;
    let live = true;
    const timer = setTimeout(async () => {
      setResults((r) => ({ ...r, loading: true }));
      const r = await searchReturnCustomersAction(q);
      if (live) setResults({ loading: false, list: r.ok ? r.data : [], message: r.ok ? (r.data.length ? "" : "No customers found") : r.message });
    }, 300);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [search, customer]);

  const choose = async (c) => {
    setCustomer(c);
    setPicked([]);
    setOrders({ loading: true, list: [], message: "" });
    const r = await returnCustomerOrdersAction(c.userId);
    setOrders({
      loading: false,
      list: r.ok ? r.data : [],
      message: r.ok ? (r.data.length ? "" : "No eligible orders found for this customer. Orders must be Delivered or Shipped and not already returned.") : `Error loading orders: ${r.message}`,
    });
  };

  const pickFiles = (list) => {
    const chosen = [...(list ?? [])].filter((f) => f.type.startsWith("image/"));
    if (chosen.length > 5) {
      notify({ message: "Maximum 5 images allowed", tone: "error" });
      return;
    }
    setFiles(chosen);
  };

  const submit = () => {
    if (!picked.length) return setError("Please select at least one order item");
    if (!reason) return setError("Please select a return reason");
    setError(null);
    const form = new FormData();
    form.set("userId", customer.userId);
    form.set("items", JSON.stringify(picked));
    form.set("reason", reason);
    form.set("detail", detail);
    for (const f of files) form.append("attachments", f, f.name);
    startSaving(async () => {
      const r = await createReturnRequestAction(form);
      if (!r.ok) return setError(r.message || "An error occurred");
      notify({ message: `${r.message}: ${r.data.returnIds.join(", ")}`, tone: "success" });
      setOpen(false);
      reset();
      router.refresh();
    });
  };

  // PHP clears the list below 3 characters.
  const showResults = search.trim().length >= 3;
  const toggle = (id, on) => setPicked((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <>
      <Button size="sm" variant="primary" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> Add return request
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="xl"
        title="Add return request"
        description="Search the customer, select the delivered items to return and give a reason."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="primary" onClick={submit} loading={saving} disabled={!customer}>Submit return request</Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <Notice tone="danger">{error}</Notice>}
          {!customer ? (
            <Field label="Customer" hint="Search by name, mobile, email or order ID (at least 3 characters).">
              {({ id }) => (
                <div className="space-y-2">
                  <Input id={id} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Name, Mobile, Email, or Order ID" autoComplete="off" />
                  {showResults && results.loading && <p className="text-xs text-ink-muted">Searching…</p>}
                  {showResults && results.message && <p className="text-xs text-warning-ink">{results.message}</p>}
                  {showResults && results.list.length > 0 && (
                    <ul className="divide-y divide-line rounded-lg border border-line">
                      {results.list.map((c) => (
                        <li key={c.userId || c.name}>
                          <button type="button" onClick={() => choose(c)} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-surface-muted">
                            <span className="min-w-0">
                              <span className="block font-medium text-ink">{c.name || "—"}</span>
                              <span className="block truncate text-xs text-ink-muted">{c.phone || c.email}</span>
                            </span>
                            <Badge tone="info">{c.orderCount} orders</Badge>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Field>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
              <span>
                <span className="font-medium text-ink">{customer.name}</span> <span className="text-ink-muted">· {customer.phone || customer.email}</span>
              </span>
              <Button size="xs" variant="ghost" onClick={reset}>Change customer</Button>
            </div>
          )}

          {customer && (
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-ink-soft">Order items</p>
              {orders.loading && <p className="text-sm text-ink-muted">Loading orders…</p>}
              {orders.message && <Notice tone={orders.message.startsWith("Error") ? "danger" : "info"}>{orders.message}</Notice>}
              {orders.list.length > 0 && (
                <div className="max-h-80 overflow-auto rounded-lg border border-line scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="border-b border-line bg-surface-muted text-left text-xs text-ink-muted">
                      <tr>
                        <th className="w-8 px-3 py-2" />
                        <th className="px-3 py-2 font-medium">Product</th>
                        <th className="px-3 py-2 font-medium">SKU</th>
                        <th className="px-3 py-2 text-right font-medium">Qty</th>
                        <th className="px-3 py-2 text-right font-medium">Price</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    {orders.list.map((o) => (
                      <tbody key={o.orderId} className="divide-y divide-line border-b border-line last:border-0">
                        <tr className="bg-surface-muted/60">
                          <td colSpan={6} className="px-3 py-2 text-xs text-ink-muted">
                            <span className="font-mono font-medium text-ink">{o.orderId}</span>{" "}
                            <Badge tone={o.eligible ? "success" : "warning"}>{o.eligible ? "Eligible" : "Not eligible"}</Badge>
                            <span className="ml-2">{o.createdAt} · {o.paymentMode} · {formatINR(o.totalPrice)} · {o.status} · {o.daysElapsed} days</span>
                          </td>
                        </tr>
                        {o.items.map((i) => (
                          <tr key={i.orderProductId} className="hover:bg-surface-muted/60">
                            <td className="px-3 py-2">
                              <Checkbox aria-label={`Select ${i.name}`} checked={picked.includes(i.orderProductId)} onChange={(e) => toggle(i.orderProductId, e.target.checked)} />
                            </td>
                            <td className="px-3 py-2 text-ink">{i.name || "N/A"}</td>
                            <td className="px-3 py-2 font-mono text-xs text-ink-soft">{i.sku || "N/A"}</td>
                            <td className="px-3 py-2 text-right tabular">{i.qty}</td>
                            <td className="px-3 py-2 text-right tabular">{formatINR(i.price)}</td>
                            <td className="px-3 py-2 text-xs text-ink-soft">{i.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    ))}
                  </table>
                </div>
              )}
            </div>
          )}

          {customer && (
            <>
              <Field label="Return reason" required>
                {({ id }) => <Select id={id} value={reason} onChange={(e) => setReason(e.target.value)} options={reasons} placeholder="Select Reason" />}
              </Field>
              <Field label="Additional details">
                {({ id }) => <Textarea id={id} rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} />}
              </Field>
              <Field label="Attachments" hint="Up to 5 images.">
                {({ id }) => <input id={id} type="file" multiple accept="image/*" className="block w-full text-sm" onChange={(e) => pickFiles(e.target.files)} />}
              </Field>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
}
