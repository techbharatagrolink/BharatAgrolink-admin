"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { availableCouriersAction, createShipmentAction } from "@/lib/actions/admin/shipping";
import { ShipmentResults } from "./shipment-results";

const COMPANIES = [
  { value: "nimbus", label: "NimbusPost" },
  { value: "shiprocket", label: "Shiprocket" },
  { value: "delhivery", label: "Delhivery" },
];

const today = () => new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);

/** The edit-order courier modal: pick a company, check couriers per vendor parcel, then book. */
export function CreateShipmentDialog({ orderId, open, onClose }) {
  const router = useRouter();
  const { notify } = useToast();
  const [company, setCompany] = useState("nimbus");
  const [pickupDate, setPickupDate] = useState(today);
  const [vendors, setVendors] = useState(null);
  const [selected, setSelected] = useState({});
  const [excluded, setExcluded] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, startLoading] = useTransition();
  const [booking, startBooking] = useTransition();

  const reset = () => {
    setVendors(null);
    setSelected({});
    setExcluded([]);
    setResult(null);
    setError("");
  };
  const close = () => {
    reset();
    onClose?.();
  };

  const check = () =>
    startLoading(async () => {
      reset();
      const r = await availableCouriersAction(orderId, company);
      if (!r.ok) return setError(r.message);
      setVendors(r.data.vendors);
      setExcluded(r.data.vendors.filter((v) => v.locked || !v.validBox).map((v) => v.vendorId));
    });

  const book = () =>
    startBooking(async () => {
      const selectedCouriers = {};
      for (const [vendorId, courierId] of Object.entries(selected)) {
        const courier = vendors?.find((v) => v.vendorId === vendorId)?.couriers.find((c) => c.id === courierId);
        if (courier) selectedCouriers[vendorId] = courier.raw;
      }
      const r = await createShipmentAction(orderId, { company, selectedCouriers, excludedVendors: excluded, pickupDate });
      if (!r.ok) {
        notify({ message: r.message, tone: "error" });
        return;
      }
      setResult(r.data);
      notify({ message: `${r.data.message}: ${r.data.successCount} booked, ${r.data.failedCount} failed.`, tone: r.data.success ? "success" : r.data.successCount ? "info" : "error" });
      router.refresh();
    });

  const toBook = (vendors ?? []).filter((v) => !excluded.includes(v.vendorId));
  const missingDelhivery = company === "delhivery" && toBook.some((v) => !selected[v.vendorId]);

  return (
    <Dialog
      open={open}
      onClose={close}
      size="lg"
      title={`Create shipment · ${orderId}`}
      description="One parcel per vendor. The courier is booked on the API with the same box, weight, pickup address and COD amount as the PHP panel."
      footer={
        result ? (
          <Button onClick={close}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close} disabled={booking}>Cancel</Button>
            <Button variant="primary" onClick={book} loading={booking} disabled={!vendors || !toBook.length || missingDelhivery}>
              Book {toBook.length || ""} shipment{toBook.length === 1 ? "" : "s"}
            </Button>
          </>
        )
      }
    >
      {result ? (
        <ShipmentResults vendors={result.vendors} />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field label="Courier company">
              {({ id }) => <Select id={id} value={company} onChange={(e) => { setCompany(e.target.value); reset(); }} options={COMPANIES} />}
            </Field>
            {company === "nimbus" ? (
              <Field label="Pickup date">
                {({ id }) => <Input id={id} type="date" value={pickupDate} min={today()} onChange={(e) => setPickupDate(e.target.value)} />}
              </Field>
            ) : <span />}
            <Button onClick={check} loading={loading}>Check couriers</Button>
          </div>
          {error && <Notice tone="danger">{error}</Notice>}
          {company === "delhivery" && vendors && <p className="text-xs text-ink-muted">Delhivery needs a courier chosen for every parcel.</p>}
          {company !== "delhivery" && vendors && <p className="text-xs text-ink-muted">Leave a parcel on “Auto” to let the API pick: the cheapest NimbusPost courier, or Shiprocket&apos;s recommended courier.</p>}
          {vendors?.map((v) => {
            const skip = excluded.includes(v.vendorId);
            return (
              <div key={v.vendorId} className="rounded-lg border border-line p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{v.vendorName}</p>
                    <p className="text-xs text-ink-muted">
                      {v.originPincode} → {v.destinationPincode} · {v.package?.weightGm ?? 0} g · {v.package?.length}×{v.package?.breadth}×{v.package?.height} cm · {String(v.paymentType || "").toUpperCase()} {formatINR(v.orderAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {v.locked && <Badge tone="warning">Already shipped</Badge>}
                    {!v.validBox && <Badge tone="danger">Box not set</Badge>}
                    <Checkbox
                      label="Skip"
                      checked={skip}
                      onChange={(e) => setExcluded((list) => (e.target.checked ? [...list, v.vendorId] : list.filter((x) => x !== v.vendorId)))}
                    />
                  </div>
                </div>
                {v.error && <p className="mt-2 text-xs text-danger-ink">{v.error}</p>}
                {!skip && v.couriers.length > 0 && (
                  <Field label={`Courier (${v.courierCount})`} className="mt-2">
                    {({ id }) => (
                      <Select id={id} value={selected[v.vendorId] ?? ""} onChange={(e) => setSelected((s) => ({ ...s, [v.vendorId]: e.target.value }))} placeholder={company === "delhivery" ? "Choose a courier" : "Auto"}>
                        {[...v.couriers]
                          .sort((a, b) => a.totalCharges - b.totalCharges)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} — {formatINR(c.totalCharges)}{c.edd ? ` · ${c.edd}` : ""}
                            </option>
                          ))}
                      </Select>
                    )}
                  </Field>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
