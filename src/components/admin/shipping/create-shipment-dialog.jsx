"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { availableCouriersAction, createShipmentAction } from "@/lib/actions/admin/shipping";
import { ShipmentResults } from "./shipment-results";

const COMPANIES = [
  { value: "nimbus", label: "Nimbus Post" },
  { value: "shiprocket", label: "Shiprocket" },
  { value: "delhivery", label: "Delhivery" },
];

const companyLabel = (value) => COMPANIES.find((company) => company.value === value)?.label || "Courier";

function vendorKey(vendor) {
  return String(vendor.vendorId);
}

function courierKey(courier, index) {
  return courier.id ? String(courier.id) : `row-${index}`;
}

function sortedCouriers(vendor) {
  return [...(vendor.couriers || [])].sort((a, b) => Number(a.totalCharges || 0) - Number(b.totalCharges || 0));
}

function weightText(courier, parcelWeight) {
  const raw = courier?.minWeight;
  if (raw != null && raw !== "" && Number(raw) !== 0) return `${raw}g`;
  if (Number(parcelWeight) > 0) return `${parcelWeight}g`;
  return "—";
}

function cheapestSelection(vendors) {
  const selected = {};
  for (const vendor of vendors || []) {
    const [cheapest] = sortedCouriers(vendor);
    if (cheapest) selected[vendorKey(vendor)] = courierKey(cheapest, 0);
  }
  return selected;
}

/**
 * edit_order.php courier modal: company tabs, vendor parcel, and the courier
 * rate table. Booking still goes through the existing create-shipment API.
 */
export function CreateShipmentDialog({ orderId, open, onClose, fallbackVendors = [] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [company, setCompany] = useState("nimbus");
  const [vendors, setVendors] = useState(null);
  const [selected, setSelected] = useState({});
  const [excluded, setExcluded] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, startBooking] = useTransition();
  const fallbackRef = useRef(fallbackVendors);
  fallbackRef.current = fallbackVendors;

  const reset = () => {
    setCompany("nimbus");
    setVendors(null);
    setSelected({});
    setExcluded([]);
    setResult(null);
    setError("");
    setLoading(false);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const label = companyLabel(company);
    setLoading(true);
    setError("");
    setResult(null);
    setSelected({});
    setVendors(fallbackRef.current?.length ? fallbackRef.current : null);
    availableCouriersAction(orderId, company).then((response) => {
      if (cancelled) return;
      setLoading(false);
      if (!response.ok) {
        const fallback = fallbackRef.current || [];
        setVendors(fallback.length ? fallback : []);
        setSelected({});
        setError(`${label} quote could not be made. ${response.message || "The courier service did not respond."}`);
        return;
      }
      const list = response.data?.vendors || [];
      setVendors(list);
      setSelected(cheapestSelection(list));
      setExcluded([]);
    });
    return () => {
      cancelled = true;
    };
  }, [open, company, orderId]);

  const shown = vendors ?? [];
  const included = shown.filter((vendor) => !excluded.includes(vendorKey(vendor)));
  const label = companyLabel(company);

  const book = () =>
    startBooking(async () => {
      const selectedCouriers = {};
      for (const vendor of included) {
        const key = vendorKey(vendor);
        const choice = sortedCouriers(vendor).find((courier, index) => courierKey(courier, index) === selected[key]);
        if (choice?.raw) selectedCouriers[key] = choice.raw;
      }
      if (!Object.keys(selectedCouriers).length) {
        setError("Select a courier before creating the shipment.");
        return;
      }
      const response = await createShipmentAction(orderId, { company, selectedCouriers, excludedVendors: excluded });
      if (!response.ok) {
        const message = response.message || `${label} shipment was not created.`;
        setError(message);
        notify({ message, tone: "error" });
        return;
      }
      setResult(response.data);
      notify({
        message: `${response.data.message}: ${response.data.successCount} booked, ${response.data.failedCount} failed.`,
        tone: response.data.success ? "success" : response.data.successCount ? "info" : "error",
      });
      router.refresh();
    });

  const canBook = !loading && !booking && included.some((vendor) => {
    const key = vendorKey(vendor);
    return sortedCouriers(vendor).some((courier, index) => courierKey(courier, index) === selected[key]);
  });

  return (
    <Dialog
      open={open}
      onClose={close}
      size="wide"
      title={`Courier selection – ${orderId}`}
      footer={
        result ? (
          <Button onClick={close}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={close} disabled={booking}>Close</Button>
            <Button variant="primary" onClick={book} loading={booking} disabled={!canBook}>
              Create shipment with selected couriers
            </Button>
          </>
        )
      }
    >
      {result ? (
        <ShipmentResults vendors={result.vendors} />
      ) : (
        <div className="space-y-4">
          <div className="flex gap-1 border-b border-line" role="tablist" aria-label="Courier company">
            {COMPANIES.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={company === item.value}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
                  company === item.value ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink",
                )}
                onClick={() => setCompany(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading && <Notice tone="info">Fetching {label} couriers for this order…</Notice>}
          {error && <Notice tone="danger">{error}</Notice>}
          {shown.length > 0 && (
            <Notice tone="info">
              <span className="font-semibold">Order ID:</span> {orderId}
              {" · "}
              <span className="font-semibold">Vendors:</span> {shown.length}
              {" · "}
              <span className="font-semibold">Selected for shipment:</span> {included.length}
            </Notice>
          )}

          {!loading && shown.length === 0 && !error && <Notice tone="warning">No vendor parcels were found for this order.</Notice>}

          {shown.map((vendor) => {
            const key = vendorKey(vendor);
            const skip = excluded.includes(key);
            const couriers = sortedCouriers(vendor);
            const cheapest = couriers[0];
            const parcel = vendor.package || {};
            return (
              <Card key={key} className={cn(skip && "opacity-60")}>
                <CardHeader
                  title={vendor.vendorName || `Vendor ${key}`}
                  description={`Vendor ID: ${key}${vendor.originPincode ? ` · ${vendor.originPincode} → ${vendor.destinationPincode}` : ""}`}
                  actions={
                    <div className="flex flex-wrap items-center gap-2">
                      {vendor.locked && <Badge tone="warning">Already shipped</Badge>}
                      {vendor.validBox === false && <Badge tone="danger">Box not set</Badge>}
                      <Checkbox
                        label="Include in shipment"
                        checked={!skip}
                        onChange={(event) => setExcluded((list) => (event.target.checked ? list.filter((id) => id !== key) : [...list, key]))}
                      />
                    </div>
                  }
                />
                <CardBody className="space-y-3">
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p><span className="font-semibold">Payment type:</span> {vendor.paymentType || "—"}</p>
                    <p><span className="font-semibold">Order amount:</span> {formatINR(vendor.orderAmount || 0)}</p>
                    <p><span className="font-semibold">Weight:</span> {Number(parcel.weightGm) > 0 ? `${parcel.weightGm}g` : "—"}</p>
                    <p><span className="font-semibold">Dimensions:</span> {parcel.length || "—"} × {parcel.breadth || "—"} × {parcel.height || "—"} cm</p>
                  </div>
                  {vendor.error && <Notice tone="danger">{label} quote could not be made. {vendor.error}</Notice>}
                  {!vendor.error && couriers.length === 0 && !loading && (
                    <Notice tone="warning">No couriers available for this route.</Notice>
                  )}
                  {couriers.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-ink">
                        Available couriers ({couriers.length})
                        {cheapest?.name && <Badge tone="success" className="ml-2">Cheapest: {cheapest.name}</Badge>}
                      </p>
                      <div className="overflow-x-auto rounded-lg border border-line">
                        <table className="w-full min-w-[720px] text-left text-[12.5px]">
                          <thead>
                            <tr className="bg-ink text-white">
                              {["Select", "Courier name", "Freight", "COD", "Total", "Delivery", "Weight"].map((heading) => (
                                <th key={heading} className="whitespace-nowrap px-3 py-2 font-semibold">{heading}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {couriers.map((courier, index) => {
                              const id = courierKey(courier, index);
                              const best = index === 0;
                              return (
                                <tr key={id} className={cn("border-t border-line", best && "bg-success-bg")}>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="radio"
                                      name={`courier-${key}`}
                                      className="size-4 accent-brand-600"
                                      checked={selected[key] === id}
                                      disabled={skip}
                                      onChange={() => setSelected((current) => ({ ...current, [key]: id }))}
                                      aria-label={`Select ${courier.name || "courier"}`}
                                    />
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="font-semibold text-ink">{courier.name || "Courier"}</span>
                                    {best && <Badge tone="success" className="ml-2">Best price</Badge>}
                                    <span className="mt-0.5 block text-[11px] text-ink-muted">ID: {courier.id || "—"}</span>
                                  </td>
                                  <td className="px-3 py-2 tabular">{formatINR(courier.freightCharges || 0)}</td>
                                  <td className="px-3 py-2 tabular">{formatINR(courier.codCharges || 0)}</td>
                                  <td className="px-3 py-2 font-semibold tabular">{formatINR(courier.totalCharges || 0)}</td>
                                  <td className="px-3 py-2">{courier.edd || "N/A"}</td>
                                  <td className="px-3 py-2 text-center">{weightText(courier, parcel.weightGm)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
