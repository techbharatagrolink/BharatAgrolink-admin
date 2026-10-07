"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { bulkCouriersAction, bulkCreateAction } from "@/lib/actions/admin/shipping";
import { ShipmentResults } from "./shipment-results";

/** bulk_action.php: NimbusPost couriers for many orders, cheapest preselected, then book order by order. */
export function BulkCreateDialog({ orderIds, open, onClose, onDone }) {
  const router = useRouter();
  const { notify } = useToast();
  const [data, setData] = useState(null);
  const [choice, setChoice] = useState({});
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, startLoading] = useTransition();
  const [booking, startBooking] = useTransition();

  const check = () =>
    startLoading(async () => {
      setData(null);
      setResult(null);
      setError("");
      const r = await bulkCouriersAction(orderIds);
      if (!r.ok) return setError(r.message);
      const initial = {};
      for (const o of r.data.orders) for (const v of o.vendors) if (v.cheapest) initial[`${o.orderId}|${v.vendorId}`] = v.cheapest.id;
      setChoice(initial);
      setData(r.data);
    });

  const close = () => {
    setData(null);
    setResult(null);
    setError("");
    onClose?.();
  };

  const ready = (data?.orders ?? []).filter((o) => o.vendors.some((v) => v.success && !v.locked));

  const book = () =>
    startBooking(async () => {
      const orders = ready.map((o) => {
        const selectedCouriers = {};
        for (const v of o.vendors) {
          const c = v.couriers?.find((x) => x.id === choice[`${o.orderId}|${v.vendorId}`]);
          if (c) selectedCouriers[v.vendorId] = c.raw;
        }
        return { orderId: o.orderId, selectedCouriers };
      });
      const r = await bulkCreateAction(orders);
      if (!r.ok) {
        notify({ message: r.message, tone: "error" });
        return;
      }
      setResult(r.data);
      notify({ message: `${r.data.successCount} of ${r.data.total} orders booked.`, tone: r.data.failedCount ? (r.data.successCount ? "info" : "error") : "success" });
      onDone?.();
      router.refresh();
    });

  return (
    <Dialog
      open={open}
      onClose={close}
      size="xl"
      title={`Bulk create shipments · ${orderIds.length} order${orderIds.length === 1 ? "" : "s"}`}
      description="NimbusPost, as in the PHP bulk action. The cheapest courier is preselected for each parcel."
      footer={
        result ? (
          <Button onClick={close}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close} disabled={booking}>Cancel</Button>
            {data ? (
              <Button variant="primary" onClick={book} loading={booking} disabled={!ready.length}>Book {ready.length} order{ready.length === 1 ? "" : "s"}</Button>
            ) : (
              <Button variant="primary" onClick={check} loading={loading}>Check couriers</Button>
            )}
          </>
        )
      }
    >
      {!data && !error && !result && <p className="text-sm text-ink-muted">{loading ? "Checking couriers for each parcel…" : `${orderIds.join(", ")}`}</p>}
      {error && <Notice tone="danger">{error}</Notice>}
      {result ? (
        <div className="space-y-4">
          {result.orders.map((o) => (
            <div key={o.orderId} className="space-y-2">
              <p className="text-sm font-semibold text-ink">{o.orderId} · {o.message}</p>
              <ShipmentResults vendors={o.vendors} />
            </div>
          ))}
        </div>
      ) : (
        data && (
          <div className="space-y-3">
            {data.orders.map((o) => (
              <div key={o.orderId} className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">
                    {o.orderId}
                    {o.order && <span className="ml-2 text-xs font-normal text-ink-muted">{o.order.customerName} · {o.order.pincode} · {o.order.paymentMode}</span>}
                  </p>
                  {o.error && <Badge tone="danger">{o.error}</Badge>}
                </div>
                <ul className="mt-2 space-y-2">
                  {o.vendors.map((v) => (
                    <li key={v.vendorId} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center">
                      <span className="text-sm text-ink-soft">
                        {v.vendorName} {v.locked && <Badge tone="warning">Already shipped</Badge>}
                      </span>
                      {v.success && !v.locked ? (
                        <Select
                          aria-label={`Courier for ${v.vendorName}`}
                          value={choice[`${o.orderId}|${v.vendorId}`] ?? ""}
                          onChange={(e) => setChoice((s) => ({ ...s, [`${o.orderId}|${v.vendorId}`]: e.target.value }))}
                          placeholder="Auto (cheapest)"
                        >
                          {[...v.couriers].sort((a, b) => a.totalCharges - b.totalCharges).map((c) => (
                            <option key={c.id} value={c.id}>{c.name} — {formatINR(c.totalCharges)}</option>
                          ))}
                        </Select>
                      ) : (
                        <span className="text-xs text-danger-ink">{v.error || (v.locked ? "Skipped" : "")}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )
      )}
    </Dialog>
  );
}
