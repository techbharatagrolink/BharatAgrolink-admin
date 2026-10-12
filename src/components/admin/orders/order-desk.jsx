"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime, formatINR } from "@/lib/format";
import { changeLineStatusAction, updateLineBoxAction } from "@/lib/actions/admin/orders";
import { cancelShipmentsAction, openLabelAction, regenerateLabelAction } from "@/lib/actions/admin/shipping";
import { OrderEditor } from "@/components/admin/orders/order-editor";
import { CreateShipmentDialog } from "@/components/admin/shipping/create-shipment-dialog";

function money(value) {
  return formatINR(Number(value) || 0);
}

/** edit_order.php summary: COD shipping is shown as ₹79, prepaid/partial use the stored fee. */
function shippingCharge(order) {
  return String(order.paymentMode || "").toLowerCase() === "cod" ? 79 : Number(order.shippingFee) || 0;
}

function grandTotal(order, shipping) {
  const total = Number(order.total) || 0;
  const mode = String(order.paymentMode || "").toLowerCase();
  let grand = total - (Number(order.couponValue) || 0) + shipping + (Number(order.handling) || 0);
  if (mode === "partial" || mode === "prepaid") grand -= Math.round((total * (mode === "partial" ? 1 : 3)) / 100 * 100) / 100;
  if (Number(order.advance) > 0) grand -= Number(order.advance);
  if (Number(order.walletUsed) > 0) grand -= Number(order.walletUsed);
  return Math.max(0, Math.round(grand * 100) / 100);
}

function productsOf(lines) {
  const grouped = new Map();
  for (const line of lines || []) {
    const productId = String(line.productId || "");
    if (!productId) continue;
    const sku = line.sku && line.sku !== "—" ? String(line.sku) : "";
    const key = `${productId}\0${sku}`;
    const qty = Number(line.qty) || 0;
    const existing = grouped.get(key);
    if (existing) existing.qty += qty;
    else grouped.set(key, { productId, variantId: 0, name: line.productName || "Product", sku, qty });
  }
  return [...grouped.values()];
}

function shortVendor(name) {
  const text = String(name || "Vendor");
  return text.length > 20 ? `${text.slice(0, 17)}...` : text;
}

function bpsText(bps) {
  if (bps == null || Number.isNaN(Number(bps))) return "—";
  const abs = Math.abs(Math.trunc(Number(bps)));
  return `${Number(bps) < 0 ? "-" : ""}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}%`;
}

function factorText(factors) {
  if (!factors?.length) return "—";
  return factors.map((factor) => `${factor.name || factor.code} ${formatINR(factor.actualAmount)}`).join(" · ");
}

/** Saved Pricing & Tax snapshot for this order, one row per product line. */
function OrderCostTable({ costs }) {
  if (!costs?.length) return null;
  const headers = ["Product", "Qty", "Display price", "Taxable", "TCS", "NRV", "Service charge", "Net service charge", "Factors actual", "Contribution margin", "Courier", "Courier charge", "Shipping actual", "Difference", "Adjusted margin", "Seller payout", "Cost factors"];
  return (
    <section className="overflow-x-auto rounded-xl border border-line bg-surface">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Pricing &amp; Tax at shipment</h2>
        <p className="text-xs text-ink-muted">Saved when the shipment was created. Prices are per unit. The courier charge is the parcel charge, and the difference is that charge minus shipping actual.</p>
      </div>
      <table className="w-max min-w-full text-left text-[12.5px]">
        <thead>
          <tr className="bg-ink text-white">
            {headers.map((label) => (
              <th key={label} className="whitespace-nowrap px-3 py-2 font-semibold">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {costs.map((cost) => (
            <tr key={cost.id || `${cost.productId}:${cost.variantId}`} className="border-t border-line">
              <td className="max-w-64 px-3 py-2 font-medium">{cost.productName || cost.productId}</td>
              <td className="px-3 py-2 tabular">{cost.qty}</td>
              <td className="px-3 py-2 tabular">{cost.displayPrice == null ? "—" : formatINR(cost.displayPrice)}</td>
              <td className="px-3 py-2 tabular">{cost.taxableValue == null ? "—" : formatINR(cost.taxableValue)}</td>
              <td className="px-3 py-2 tabular">{cost.tcs == null ? "—" : formatINR(cost.tcs)}</td>
              <td className="px-3 py-2 tabular">{cost.nrv == null ? "—" : formatINR(cost.nrv)}</td>
              <td className="px-3 py-2 tabular">{cost.serviceCharge == null ? "—" : formatINR(cost.serviceCharge)}</td>
              <td className="px-3 py-2 tabular">{cost.netServiceCharge == null ? "—" : formatINR(cost.netServiceCharge)}</td>
              <td className="px-3 py-2 tabular">{cost.totalFactorActual == null ? "—" : formatINR(cost.totalFactorActual)}</td>
              <td className="px-3 py-2 tabular">{cost.contributionMargin == null ? "—" : `${formatINR(cost.contributionMargin)} · ${bpsText(cost.contributionMarginBps)}`}</td>
              <td className="px-3 py-2">{cost.courierName || "—"}</td>
              <td className="px-3 py-2 tabular">{cost.courierCharge == null ? "—" : formatINR(cost.courierCharge)}</td>
              <td className="px-3 py-2 tabular">{cost.shippingActual == null ? "—" : formatINR(cost.shippingActual)}</td>
              <td className="px-3 py-2 tabular">{cost.shippingDifference == null ? "—" : formatINR(cost.shippingDifference)}</td>
              <td className="px-3 py-2 tabular">{cost.adjustedContributionMargin == null ? "—" : `${formatINR(cost.adjustedContributionMargin)} · ${bpsText(cost.adjustedContributionMarginBps)}`}</td>
              <td className="px-3 py-2 tabular">{cost.sellerPayout == null ? "—" : formatINR(cost.sellerPayout)}</td>
              <td className="max-w-sm whitespace-normal px-3 py-2 text-ink-soft">{factorText(cost.factors)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function prepaidDiscount(order) {
  const mode = String(order.paymentMode || "").toLowerCase();
  if (mode !== "partial" && mode !== "prepaid") return 0;
  const rate = mode === "partial" ? 1 : 3;
  return Math.round(((Number(order.total) || 0) * rate) / 100 * 100) / 100;
}

/**
 * The PHP edit_order.php page: address strip, line finance table,
 * shipment and payment panel, totals, and the fixed order actions.
 */
export function OrderDesk({ order, groups, totals, editor, orderCosts = [], canEdit }) {
  const lines = groups.flatMap((group) => group.lines.map((line) => ({ ...line, vendor: group.vendor })));
  const [panel, setPanel] = useState("");
  const [shipmentOpen, setShipmentOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const shipping = shippingCharge(order);
  const discountRate = prepaidDiscount(order);
  const selling = lines.reduce((sum, line) => sum + Number(line.sellingPrice || 0) * Number(line.qty || 0), 0);
  const tax = (key) => lines.reduce((sum, line) => sum + Number(line[key] || 0) * Number(line.qty || 0), 0);
  const gross = Math.round((selling + tax("cgst") + tax("sgst") + tax("igst")) * 100) / 100;
  const mode = String(editor?.payment?.mode || order.paymentMode || "").toLowerCase();
  const firstTracked = lines.find((line) => line.awb || line.trackingUrl) || lines[0];
  const labelVendors = groups
    .map((group) => {
      const stored = group.lines.find((line) => line.printLabel);
      const tracked = group.lines.find((line) => line.awb);
      return { vendorId: group.vendorId, name: group.vendor, printLabel: stored?.printLabel || "", awb: tracked?.awb || "" };
    })
    .filter((vendor) => vendor.vendorId && (vendor.printLabel || vendor.awb));

  const run = async (work) => {
    setPending(true);
    setMessage("");
    const result = await work();
    setMessage(result?.message || (result?.ok ? "Saved." : "Could not save."));
    setPending(false);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-line bg-surface px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="text-sm">
            {editor?.address?.name && <p className="font-medium text-ink">{editor.address.name}</p>}
            {editor?.address?.address && <p className="mt-1 text-ink">{editor.address.address}</p>}
            {editor?.address?.area && <p className="text-ink-soft">{editor.address.area}</p>}
            <p className="font-medium text-ink">{[order.city, order.state].filter(Boolean).join(", ")}{order.pincode ? ` – ${order.pincode}` : ""}{editor?.address?.type ? ` (${editor.address.type})` : ""}</p>
            <p className="mt-1 text-ink">Primary: {order.mobile || "—"}</p>
            <p className="text-ink">Secondary: {editor?.address?.alternateMobile || "—"}</p>
          </div>
          {canEdit && <Button size="sm" variant="secondary" onClick={() => setPanel(panel === "address" ? "" : "address")}>Edit Address</Button>}
        </div>
      </section>

      <section className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-max min-w-full text-left text-[12.5px]">
          <thead>
            <tr className="bg-ink text-white">
              {["Image", "Invoice no.", "Product name", "Product ID", "Vendor", "SKU", "SGST", "CGST", "IGST", "Price", "Selling price", "Vendor NRV", "Qty", "Tax", "Status"].map((label) => (
                <th key={label} className="whitespace-nowrap px-3 py-2 font-semibold">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-t border-line">
                <td className="px-3 py-2">{line.image ? <img src={line.image} alt="" className="h-10 w-10 rounded object-cover" /> : "—"}</td>
                <td className="px-3 py-2">{line.invoice || "—"}</td>
                <td className="px-3 py-2 font-medium"><Link href={`/admin/products/${line.productId}`} className="hover:underline">{line.productName}</Link></td>
                <td className="px-3 py-2">{line.productId}</td>
                <td className="max-w-44 px-3 py-2">{line.vendor}</td>
                <td className="px-3 py-2">{line.sku}</td>
                <td className="px-3 py-2 tabular">{Number(line.sgst || 0).toFixed(2)}</td>
                <td className="px-3 py-2 tabular">{Number(line.cgst || 0).toFixed(2)}</td>
                <td className="px-3 py-2 tabular">{Number(line.igst || 0).toFixed(2)}</td>
                <td className="px-3 py-2 tabular">{Number(line.unitPrice || 0).toFixed(2)}</td>
                <td className="px-3 py-2 tabular">{Number(line.sellingPrice || 0).toFixed(2)}</td>
                <td className="px-3 py-2 font-semibold tabular">
                  {Number(line.vendorNrv || 0).toFixed(2)}
                  {Number(line.qty) > 1 && <div className="text-[11px] font-normal text-ink-muted">Total: {Number(line.vendorNrvTotal || 0).toFixed(2)}</div>}
                </td>
                <td className="px-3 py-2">{line.qty}</td>
                <td className="px-3 py-2">{line.gstPercent}</td>
                <td className="px-3 py-2"><StatusBadge status={line.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <OrderCostTable costs={orderCosts} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-line bg-surface p-4 text-sm">
          <p><span className="font-semibold">Shipping type</span><br />{firstTracked?.pickupType === "self" ? "Self Shipping" : "Ship By Bharat Agrolink"}</p>
          <p><span className="font-semibold">Payment methods</span><br />{mode || "—"}</p>
          <p><span className="font-semibold">Payment TXN ID</span><br />{order.paymentId || "—"}</p>
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary" onClick={() => setPanel(panel === "payment" ? "" : "payment")}>Update Payment</Button>
              {firstTracked?.awb && !/nimbus/i.test(firstTracked.courier || "") && (
                <Button size="sm" variant="danger" loading={pending} onClick={() => run(() => cancelShipmentsAction([firstTracked.awb], [order.id]))}>Cancel This Shipment</Button>
              )}
            </div>
          )}
          {firstTracked?.trackingUrl && <p><span className="font-semibold">Tracking URL</span><br /><a className="break-all text-brand-700 hover:underline" href={firstTracked.trackingUrl} target="_blank" rel="noreferrer">{firstTracked.trackingUrl}</a></p>}
          {firstTracked?.courier && <p><span className="font-semibold">Courier name</span><br />{firstTracked.courier}</p>}
          {firstTracked?.awb && <p><span className="font-semibold">AWB / waybill</span><br /><span className="font-mono">{firstTracked.awb}</span></p>}
          {firstTracked?.deliveryDate && <p><span className="font-semibold">Expected delivery</span><br />{formatDateTime(firstTracked.deliveryDate)}</p>}
        </section>

        <section className="rounded-xl border border-line bg-surface p-4 text-sm">
          <dl className="space-y-1.5">
            {[
              ["Total selling price", selling.toFixed(2)],
              ["Discount", Number(order.discount) > 0 ? money(order.discount) : "—"],
              ["Shipping charges", shipping.toFixed(2)],
              ["CGST", tax("cgst").toFixed(2)],
              ["SGST", tax("sgst").toFixed(2)],
              ["IGST", tax("igst").toFixed(2)],
              ["Gross total", gross.toFixed(2)],
              ["Partial", order.partial ? "Yes" : "No"],
              ["Advance", Number(order.advance || 0).toFixed(2)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4"><dt className="text-ink-muted">{label}</dt><dd className="tabular">{value}</dd></div>
            ))}
            {discountRate > 0 && (
              <div className="flex justify-between gap-4"><dt className="text-ink-muted">{mode === "partial" ? "Partial discount 1%" : "Prepaid discount 3%"}</dt><dd className="tabular">{discountRate.toFixed(2)}</dd></div>
            )}
            {Number(order.walletUsed) > 0 && (
              <div className="flex justify-between gap-4"><dt className="text-ink-muted">CN wallet used</dt><dd className="tabular">-{Number(order.walletUsed).toFixed(2)}</dd></div>
            )}
          </dl>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-600 px-3 py-2 font-semibold text-brand-fg">
            <span>Grand total</span><span className="tabular">{money(grandTotal(order, shipping))}</span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="primary" size="sm" onClick={() => setShipmentOpen(true)}>Process Order</Button>
            {labelVendors.map((vendor) => vendor.printLabel ? (
              <Button key={`print-${vendor.vendorId}`} variant="secondary" size="sm" loading={pending} onClick={() => run(async () => {
                const opened = await openLabelAction(order.id, vendor.vendorId);
                if (opened?.ok && opened.data?.url) {
                  window.open(opened.data.url, "_blank", "noopener");
                  return { ok: true, message: "Label opened." };
                }
                return opened?.ok === false ? opened : { ok: false, message: opened?.message || "Could not open the label. The shipment may need to be created first." };
              })}>Print Label - {shortVendor(vendor.name)}</Button>
            ) : (
              <Button key={`make-${vendor.vendorId}`} variant="secondary" size="sm" loading={pending} onClick={() => run(async () => {
                const generated = await regenerateLabelAction(order.id, vendor.awb, vendor.vendorId);
                if (generated?.ok && generated.data?.url) {
                  window.open(generated.data.url, "_blank", "noopener");
                  return { ok: true, message: "Label generated." };
                }
                return generated?.ok === false ? generated : { ok: false, message: generated?.message || "Label will not generate if the shipment is not created." };
              })}>Generate Label - {shortVendor(vendor.name)}</Button>
            ))}
            <ButtonLink href={`/admin/orders/${encodeURIComponent(order.id)}/invoice`} target="_blank" rel="noreferrer" variant="danger" size="sm">Generate Invoice</ButtonLink>
            {canEdit && <Button variant="danger" size="sm" loading={pending} onClick={() => run(async () => {
              let last = { ok: true, message: "Order rejected." };
              for (const line of lines) last = await changeLineStatusAction(order.id, line.id, "Rejected", "Rejected from the order page");
              return last;
            })}>Reject Order</Button>}
            {canEdit && <Button variant="secondary" size="sm" onClick={() => setPanel(panel === "box" ? "" : "box")}>Packed box</Button>}
          </div>
          {message && <p className="mt-2 text-xs text-ink-muted">{message}</p>}
        </section>
      </div>

      {canEdit && panel === "box" && (
        <section className="space-y-3 rounded-xl border border-line bg-surface p-4">
          <h2 className="text-sm font-semibold text-ink">Packed box</h2>
          {lines.map((line) => <BoxForm key={line.id} orderId={order.id} line={line} onSave={(box) => run(() => updateLineBoxAction(order.id, line.id, box))} pending={pending} />)}
        </section>
      )}

      <CreateShipmentDialog
        orderId={order.id}
        open={shipmentOpen}
        onClose={() => setShipmentOpen(false)}
        fallbackVendors={groups.map((group) => {
          const weight = group.lines.reduce((sum, line) => sum + Number(line.box?.weight || 0) * Math.max(1, Number(line.qty) || 1), 0);
          const box = group.lines.find((line) => Number(line.box?.length) > 0) || group.lines[0];
          const amount = group.lines.reduce((sum, line) => sum + Number(line.unitPrice || 0) * Number(line.qty || 0), 0);
          return {
            vendorId: String(group.vendorId),
            vendorName: group.vendor,
            paymentType: String(order.paymentMode || "").toLowerCase(),
            orderAmount: Math.round(amount * 100) / 100,
            package: { weightGm: weight, length: box?.box?.length || 0, breadth: box?.box?.width || 0, height: box?.box?.height || 0 },
            products: productsOf(group.lines),
            couriers: [],
          };
        })}
      />

      {canEdit && editor && (panel === "address" || panel === "payment") && (
        <section className="rounded-xl border border-line bg-surface p-4">
          <OrderEditor orderId={order.id} editor={editor} lines={lines} focus={panel} />
        </section>
      )}

      <p className="text-xs text-ink-muted">Taxable {money(totals.taxable)} · TCS is calculated on the finance report.</p>
    </div>
  );
}

function BoxForm({ line, onSave, pending }) {
  const [box, setBox] = useState({
    weight: line.box?.weight || "",
    length: line.box?.length || "",
    width: line.box?.width || "",
    height: line.box?.height || "",
  });
  return (
    <form className="grid gap-2 border-t border-line pt-3 sm:grid-cols-5" onSubmit={(event) => { event.preventDefault(); onSave(box); }}>
      <p className="sm:col-span-5 text-sm font-medium text-ink">{line.productName}</p>
      {[["weight", "Weight (g)"], ["length", "Length (cm)"], ["width", "Width (cm)"], ["height", "Height (cm)"]].map(([key, label]) => (
        <label key={key} className="text-xs text-ink-muted">{label}
          <input className="mt-1 h-9 w-full rounded-lg border border-line px-2 text-sm text-ink" type="number" min="0.01" step="0.01" required value={box[key]} onChange={(event) => setBox((current) => ({ ...current, [key]: event.target.value }))} />
        </label>
      ))}
      <div className="flex items-end"><Button type="submit" size="sm" loading={pending}>Save box</Button></div>
    </form>
  );
}
