"use client";

import { useCallback, useId, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Boxes,
  CalendarClock,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Hash,
  History,
  IndianRupee,
  Link2,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  Pencil,
  Phone,
  Printer,
  Receipt,
  ShoppingBag,
  Truck,
  UserRound,
  Wallet,
  ZoomIn,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatINR, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { changeLineStatusAction, updateLineBoxAction } from "@/lib/actions/admin/orders";
import { cancelShipmentsAction, openLabelAction, regenerateLabelAction } from "@/lib/actions/admin/shipping";
import { OrderAddressDialog, OrderPaymentDialog } from "@/components/admin/orders/order-editor";
import { OrderVerificationDialog } from "@/components/admin/orders/order-verification-dialog";
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

function prepaidDiscount(order) {
  const mode = String(order.paymentMode || "").toLowerCase();
  if (mode !== "partial" && mode !== "prepaid") return 0;
  const rate = mode === "partial" ? 1 : 3;
  return Math.round(((Number(order.total) || 0) * rate) / 100 * 100) / 100;
}

const MODE_LABELS = { cod: "COD", prepaid: "Prepaid", partial: "Partial" };
const modeLabel = (mode) => MODE_LABELS[mode] || mode || "—";
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

function scrollToId(id) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Copies `value`; shows a tick for a moment. With children it is a labelled button, else an icon. */
function CopyButton({ value, label, className, children }) {
  const [copied, setCopied] = useState(false);
  const text = String(value ?? "").trim();
  if (!text || text === "—") return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? "Copied" : `Copy ${label}`}
      aria-label={children ? undefined : `Copy ${label}`}
      className={cn("inline-flex shrink-0 items-center gap-1.5 rounded p-0.5 text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-700", className, copied && "text-success-ink hover:text-success-ink")}
    >
      <Icon className="size-3.5" aria-hidden />
      {children && <span>{copied ? "Copied" : children}</span>}
    </button>
  );
}

/**
 * Every card on the page: icon + title header, optional `meta` text and
 * `actions` on the right. `collapsible` panels open and close from the title.
 */
function Panel({ id, icon: Icon, title, meta, actions, collapsible = false, className, children }) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();
  const heading = (
    <>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 truncate">{title}</span>
    </>
  );
  return (
    <Card id={id} className={cn("scroll-mt-28", className)}>
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors", open && "border-b border-line")}>
        <h2 className="min-w-[min(100%,13rem)] flex-1 text-sm font-semibold text-ink">
          {collapsible ? (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={bodyId}
              className="group -mx-1 flex w-[calc(100%+0.5rem)] min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-left focus-visible:ring-2 focus-visible:ring-brand-600/30 focus-visible:outline-none"
            >
              {heading}
              {meta && <span className="ml-auto hidden shrink-0 text-xs font-normal text-ink-muted sm:inline">{meta}</span>}
              <ChevronDown
                className={cn("size-4 shrink-0 text-ink-muted transition-transform duration-200 group-hover:text-ink motion-reduce:transition-none", !meta && "ml-auto", meta && "max-sm:ml-auto", open && "rotate-180")}
                aria-hidden
              />
              <span className="sr-only">{open ? "(collapse)" : "(expand)"}</span>
            </button>
          ) : (
            <span className="flex min-w-0 items-center gap-2">
              {heading}
              {meta && <span className="ml-auto shrink-0 text-xs font-normal text-ink-muted">{meta}</span>}
            </span>
          )}
        </h2>
        {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
      </div>
      <div
        id={bodyId}
        className={cn("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        inert={!open}
      >
        <div className="min-h-0 min-w-0 overflow-hidden">{children}</div>
      </div>
    </Card>
  );
}

/**
 * Label/value pair inside a card. Values wrap while their card is narrow and
 * truncate (full text on hover) once it is wide (the nearest @container).
 */
function CardField({ label, value, copy = false }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10.5px] font-bold tracking-wide text-ink uppercase">{label}</dt>
      <dd className="flex min-w-0 items-start gap-1 text-ink">
        <span className="min-w-0 break-words @md:truncate" title={typeof value === "string" ? value : undefined}>{value ?? "—"}</span>
        {copy && <CopyButton value={value} label={label} className="-my-0.5" />}
      </dd>
    </div>
  );
}

/** Saved Pricing & Tax snapshot for this order, one row per product line. */
function OrderCostTable({ costs }) {
  if (!costs?.length) return null;
  return (
    <Panel icon={IndianRupee} title="Pricing & Tax at shipment" collapsible>
      <p className="px-4 pt-3 text-xs text-ink-muted">Saved when the shipment was created. Prices are per unit. The courier charge is the parcel charge, and the difference is that charge minus shipping actual.</p>
      <ul className="space-y-3 p-3">
        {costs.map((cost) => (
          <li key={cost.id || `${cost.productId}:${cost.variantId}`} className="@container rounded-lg border border-line p-3 text-[12.5px]">
            <p className="font-semibold text-ink">{cost.productName || cost.productId}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
              <CardField label="Qty" value={cost.qty} />
              <CardField label="Display price" value={cost.displayPrice == null ? null : formatINR(cost.displayPrice)} />
              <CardField label="Taxable" value={cost.taxableValue == null ? null : formatINR(cost.taxableValue)} />
              <CardField label="TCS" value={cost.tcs == null ? null : formatINR(cost.tcs)} />
              <CardField label="NRV" value={cost.nrv == null ? null : formatINR(cost.nrv)} />
              <CardField label="Service charge" value={cost.serviceCharge == null ? null : formatINR(cost.serviceCharge)} />
              <CardField label="Net service charge" value={cost.netServiceCharge == null ? null : formatINR(cost.netServiceCharge)} />
              <CardField label="Factors actual" value={cost.totalFactorActual == null ? null : formatINR(cost.totalFactorActual)} />
              <CardField label="Contribution margin" value={cost.contributionMargin == null ? null : `${formatINR(cost.contributionMargin)} · ${bpsText(cost.contributionMarginBps)}`} />
              <CardField label="Courier" value={cost.courierName} />
              <CardField label="Courier charge" value={cost.courierCharge == null ? null : formatINR(cost.courierCharge)} />
              <CardField label="Shipping actual" value={cost.shippingActual == null ? null : formatINR(cost.shippingActual)} />
              <CardField label="Difference" value={cost.shippingDifference == null ? null : formatINR(cost.shippingDifference)} />
              <CardField label="Adjusted margin" value={cost.adjustedContributionMargin == null ? null : `${formatINR(cost.adjustedContributionMargin)} · ${bpsText(cost.adjustedContributionMarginBps)}`} />
              <CardField label="Seller payout" value={cost.sellerPayout == null ? null : formatINR(cost.sellerPayout)} />
            </dl>
            <p className="mt-2 text-[11px] text-ink-soft"><span className="font-medium text-ink-muted">Cost factors: </span>{factorText(cost.factors)}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PhoneChip({ label, number }) {
  if (!number) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line px-2.5 py-1 text-xs text-ink-muted">
        <Phone className="size-3.5" aria-hidden />
        {label}: —
      </span>
    );
  }
  return (
    <a
      href={`tel:${String(number).replace(/[^\d+]/g, "")}`}
      title={`Call ${number}`}
      className="group inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-ink transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
    >
      <Phone className="size-3.5 text-brand-700" aria-hidden />
      <span className="text-ink-muted group-hover:text-brand-700">{label}</span>
      <span className="font-medium tabular">{number}</span>
    </a>
  );
}

function InfoItem({ icon: Icon, label, value, mono = false, copy = false }) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-muted/60 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
        <Icon className="size-3.5 text-brand-700" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 flex min-w-0 items-start gap-1 text-ink">
        <span className={cn("min-w-0 break-all", mono && "font-mono text-[13px]")}>{value || "—"}</span>
        {copy && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

/** One product line. Narrow cards stack (image centred, status at its right); wide cards put the image beside the details. */
function LineCard({ line, onPreview }) {
  const qty = Number(line.qty) || 0;
  const lineTotal = (Number(line.sellingPrice || 0) + Number(line.cgst || 0) + Number(line.sgst || 0) + Number(line.igst || 0)) * qty;
  return (
    <li className="@container">
      <div className="rounded-lg border border-line p-3 text-[12.5px] transition hover:border-brand-600/40 hover:shadow-md motion-reduce:transition-none @md:flex @md:gap-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 @md:block @md:shrink-0">
          {line.image ? (
            <button
              type="button"
              onClick={onPreview}
              className="group relative col-start-2 block size-16 cursor-zoom-in overflow-hidden rounded-lg border border-line focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:outline-none"
              aria-label={`Enlarge image of ${line.productName}`}
            >
              <img src={line.image} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
                <ZoomIn className="size-5 text-white" />
              </span>
            </button>
          ) : (
            <div className="col-start-2 flex size-16 items-center justify-center rounded-lg bg-line/40 text-ink-muted"><Package className="size-6" aria-hidden /></div>
          )}
          <span className="col-start-3 justify-self-end @md:hidden"><StatusBadge status={line.status} /></span>
        </div>
        <div className="mt-2.5 min-w-0 flex-1 @md:mt-0">
          <div className="flex items-start justify-center gap-2 @md:justify-between">
            <Link href={`/admin/products/${line.productId}`} className="text-center font-bold text-brand-700 hover:underline @md:text-left">{line.productName}</Link>
            <span className="hidden shrink-0 @md:block"><StatusBadge status={line.status} /></span>
          </div>
          <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line pt-2.5 @md:mt-2 @md:gap-x-3 @md:gap-y-2 @md:border-0 @md:pt-0 @lg:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-6">
            <CardField label="Product ID" value={line.productId} copy />
            <CardField label="Vendor" value={line.vendor} />
            <CardField label="SKU" value={line.sku} copy />
            <CardField label="Invoice no." value={line.invoice} copy />
            <CardField label="Qty" value={line.qty} />
            <CardField label="Tax" value={line.gstPercent} />
            <CardField label="Price" value={Number(line.unitPrice || 0).toFixed(2)} />
            <CardField label="Selling price" value={Number(line.sellingPrice || 0).toFixed(2)} />
            <CardField label="SGST" value={Number(line.sgst || 0).toFixed(2)} />
            <CardField label="CGST" value={Number(line.cgst || 0).toFixed(2)} />
            <CardField label="IGST" value={Number(line.igst || 0).toFixed(2)} />
            <CardField label="Vendor NRV" value={`${Number(line.vendorNrv || 0).toFixed(2)}${qty > 1 ? ` (Total ${Number(line.vendorNrvTotal || 0).toFixed(2)})` : ""}`} />
          </dl>
          <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-dashed border-line pt-2 text-ink-muted">
            Line total incl. GST
            <span className="text-[13px] font-semibold text-ink tabular">{money(lineTotal)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Who ordered (the old Customer card) beside where it goes (the old address strip). */
function CustomerDelivery({ order, address, customer, canViewProfile, canEdit, onEditAddress }) {
  const cityLine = `${[order.city, order.state].filter(Boolean).join(", ")}${order.pincode ? ` – ${order.pincode}` : ""}`;
  const fullAddress = [address?.name, address?.address, address?.area, cityLine, order.mobile && `Mobile: ${order.mobile}`].filter(Boolean).join("\n");
  return (
    <Panel
      icon={UserRound}
      title="Customer & delivery"
      collapsible
      className="@container"
      actions={
        customer && (
          <span className="flex flex-wrap justify-end gap-x-3 text-[13px] font-medium">
            <Link href={`/admin/crm/customer-360/${encodeURIComponent(customer.id)}`} className="text-brand-700 hover:underline">Customer 360</Link>
            {canViewProfile && <Link href={`/admin/customers/${customer.id}`} className="text-brand-700 hover:underline">Profile</Link>}
          </span>
        )
      }
    >
      <div className="grid gap-4 p-4 @2xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @2xl:gap-0">
        <div className="flex min-w-0 gap-3 @2xl:pr-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-brand-fg">{initials(order.customer || "?")}</span>
          <div className="min-w-0 text-sm">
            <p className="text-[11px] font-semibold tracking-wide text-ink-muted uppercase">Customer</p>
            <p className="mt-0.5 truncate text-[15px] font-semibold text-ink">{order.customer || "—"}</p>
            {customer && <p className="text-xs text-ink-muted">{plural(Number(customer.orders) || 0, "order")} so far</p>}
            {address?.email && (
              <p className="mt-1 flex min-w-0 items-center gap-1.5 text-ink-soft">
                <Mail className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{address.email}</span>
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap gap-2">
              <PhoneChip label="Primary" number={order.mobile} />
              <PhoneChip label="Secondary" number={address?.alternateMobile} />
            </div>
          </div>
        </div>
        <div className="flex min-w-0 gap-3 border-t border-line pt-4 @2xl:border-t-0 @2xl:border-l @2xl:pt-0 @2xl:pl-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 text-sm">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
              Deliver to
              {address?.type && <Badge tone="neutral">{address.type}</Badge>}
            </p>
            {address?.name && <p className="mt-0.5 font-semibold text-ink">{address.name}</p>}
            {address?.address && <p className="text-ink">{address.address}</p>}
            {address?.area && <p className="text-ink-soft">{address.area}</p>}
            <p className="font-medium text-ink">{cityLine || "—"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton value={fullAddress} label="address" className="h-8 rounded-md border border-line-strong px-3 text-[13px] font-medium text-ink">Copy address</CopyButton>
              {canEdit && address && (
                <Button size="sm" variant="secondary" onClick={onEditAddress}>
                  <Pencil className="size-3.5" aria-hidden />
                  Edit Address
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/**
 * The PHP edit_order.php page, as one screen: order header, then the working panels (customer, lines, shipment) beside the money and the
 * order actions, which stay in view while scrolling on wide screens. Narrower
 * screens get a sticky bar with the grand total and Process Order.
 * `shipments`, `related` and `activity` are rendered by the page (server) and placed here.
 */
export function OrderDesk({ order, groups, totals, editor, orderCosts = [], canEdit, customer = null, canViewProfile = false, shipments = null, related = null, activity = null }) {
  const lines = groups.flatMap((group) => group.lines.map((line) => ({ ...line, vendor: group.vendor })));
  const { notify } = useToast();
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [shipmentOpen, setShipmentOpen] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const closeAddress = useCallback(() => setAddressOpen(false), []);
  const closePayment = useCallback(() => setPaymentOpen(false), []);
  const closeBox = useCallback(() => setBoxOpen(false), []);
  const closePreview = useCallback(() => setPreview(null), []);
  const shipping = shippingCharge(order);
  const discountRate = prepaidDiscount(order);
  const selling = lines.reduce((sum, line) => sum + Number(line.sellingPrice || 0) * Number(line.qty || 0), 0);
  const tax = (key) => lines.reduce((sum, line) => sum + Number(line[key] || 0) * Number(line.qty || 0), 0);
  const gross = Math.round((selling + tax("cgst") + tax("sgst") + tax("igst")) * 100) / 100;
  const grand = grandTotal(order, shipping);
  const units = lines.reduce((sum, line) => sum + (Number(line.qty) || 0), 0);
  const mode = String(editor?.payment?.mode || order.paymentMode || "").toLowerCase();
  const firstTracked = lines.find((line) => line.awb || line.trackingUrl) || lines[0];
  const canCancelShipment = Boolean(firstTracked?.awb) && !/nimbus/i.test(firstTracked?.courier || "");
  const address = editor?.address;
  const labelVendors = groups
    .map((group) => {
      const stored = group.lines.find((line) => line.printLabel);
      const tracked = group.lines.find((line) => line.awb);
      return { vendorId: group.vendorId, name: group.vendor, printLabel: stored?.printLabel || "", awb: tracked?.awb || "" };
    })
    .filter((vendor) => vendor.vendorId && (vendor.printLabel || vendor.awb));

  /** Runs one action at a time (`key` drives that button's spinner) and reports the outcome as a toast. */
  const run = async (key, work) => {
    setBusy(key);
    try {
      const result = await work();
      notify({ message: result?.message || (result?.ok ? "Saved." : "Could not save."), tone: result?.ok ? "success" : "error" });
      return result;
    } catch {
      notify({ message: "Something went wrong. Please try again.", tone: "error" });
      return { ok: false };
    } finally {
      setBusy("");
    }
  };

  const setAllLines = (status, remarks) => async () => {
    let last = { ok: true, message: `Order ${status.toLowerCase()}.` };
    for (const line of lines) last = await changeLineStatusAction(order.id, line.id, status, remarks);
    return last;
  };

  const acceptOrder = async (remarks) => {
    const result = await run("verify", setAllLines("Accepted", remarks || "Accepted from the order page"));
    if (result?.ok !== false) {
      setVerifyOpen(false);
      setShipmentOpen(true);
    }
  };

  const rejectFromVerification = async (remarks) => {
    const result = await run("verify", setAllLines("Rejected", remarks || "Rejected from the order page"));
    if (result?.ok !== false) setVerifyOpen(false);
  };

  const rejectOrder = async () => {
    const result = await run("reject", setAllLines("Rejected", "Rejected from the order page"));
    if (result?.ok !== false) setConfirm("");
  };

  const cancelShipment = async () => {
    const result = await run("cancel-shipment", () => cancelShipmentsAction([firstTracked.awb], [order.id]));
    if (result?.ok !== false) setConfirm("");
  };

  const openLabel = (vendor) =>
    run(`label-${vendor.vendorId}`, async () => {
      if (vendor.printLabel) {
        const opened = await openLabelAction(order.id, vendor.vendorId);
        if (opened?.ok && opened.data?.url) {
          window.open(opened.data.url, "_blank", "noopener");
          return { ok: true, message: "Label opened." };
        }
        return opened?.ok === false ? opened : { ok: false, message: opened?.message || "Could not open the label. The shipment may need to be created first." };
      }
      const generated = await regenerateLabelAction(order.id, vendor.awb, vendor.vendorId);
      if (generated?.ok && generated.data?.url) {
        window.open(generated.data.url, "_blank", "noopener");
        return { ok: true, message: "Label generated." };
      }
      return generated?.ok === false ? generated : { ok: false, message: generated?.message || "Label will not generate if the shipment is not created." };
    });

  const summaryRows = [
    { label: "Total selling price", value: selling.toFixed(2) },
    { label: "Discount", value: Number(order.discount) > 0 ? money(order.discount) : "—" },
    { label: "Shipping charges", value: shipping.toFixed(2) },
    { label: "CGST", value: tax("cgst").toFixed(2) },
    { label: "SGST", value: tax("sgst").toFixed(2) },
    { label: "IGST", value: tax("igst").toFixed(2) },
    { label: "Gross total", value: gross.toFixed(2), strong: true },
    { label: "Partial", value: order.partial ? "Yes" : "No" },
    { label: "Advance", value: Number(order.advance || 0).toFixed(2) },
    discountRate > 0 && { label: mode === "partial" ? "Partial discount 1%" : "Prepaid discount 3%", value: discountRate.toFixed(2) },
    Number(order.walletUsed) > 0 && { label: "CN wallet used", value: `-${Number(order.walletUsed).toFixed(2)}` },
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Order header: identity and back link. */}
      <Card>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-700 text-brand-fg shadow-sm sm:flex">
              <ShoppingBag className="size-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="min-w-0 text-xl font-semibold tracking-tight break-words text-ink sm:text-[22px]">Order {order.id}</h1>
                <CopyButton value={order.id} label="order ID" className="p-1" />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-ink-muted">
                <CalendarClock className="size-3.5 shrink-0" aria-hidden />
                Placed {formatDateTime(order.createdAt)} via {order.channel}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                <Badge tone="neutral">{order.paymentMode}</Badge>
                {order.vendors > 1 && <Badge tone="info">{order.vendors} vendors</Badge>}
                {order.couponCode && <Badge tone="brand">Coupon {order.couponCode}</Badge>}
              </div>
            </div>
          </div>
          <ButtonLink href="/admin/orders" variant="secondary" size="sm" className="self-start">
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to orders
          </ButtonLink>
        </div>
      </Card>

      {/*
        Phones/tablets: one column — working panels, money and actions, then activity.
        xl: working panels and activity on the left; money and actions on the right, kept in view.
      */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="min-w-0 space-y-4 xl:col-start-1 xl:row-start-1">
          <CustomerDelivery order={order} address={address} customer={customer} canViewProfile={canViewProfile} canEdit={canEdit} onEditAddress={() => setAddressOpen(true)} />

          <Panel icon={Package} title={`Items (${lines.length})`} meta={`${plural(units, "unit")} · ${plural(groups.length, "vendor")} · Gross ${money(gross)}`} collapsible>
            <ul className="space-y-3 p-3">
              {lines.map((line) => <LineCard key={line.id} line={line} onPreview={() => setPreview(line)} />)}
            </ul>
          </Panel>

          <OrderCostTable costs={orderCosts} />

          <Panel icon={Truck} title="Shipment & payment" collapsible className="@container">
            <dl className="grid gap-2.5 p-4 text-sm @md:grid-cols-2 @3xl:grid-cols-3">
              <InfoItem icon={Truck} label="Shipping type" value={firstTracked?.pickupType === "self" ? "Self Shipping" : "Ship By Bharat Agrolink"} />
              <InfoItem icon={Wallet} label="Payment method" value={mode ? <Badge tone="brand">{modeLabel(mode)}</Badge> : null} />
              <InfoItem icon={Receipt} label="Payment TXN ID" value={order.paymentId} mono copy />
              <InfoItem icon={Truck} label="Courier name" value={firstTracked?.courier} />
              <InfoItem icon={Hash} label="AWB / waybill" value={firstTracked?.awb} mono copy />
              <InfoItem icon={CalendarClock} label="Expected delivery" value={firstTracked?.deliveryDate ? formatDateTime(firstTracked.deliveryDate) : null} />
            </dl>
            {(firstTracked?.trackingUrl || canEdit) && (
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
                {firstTracked?.trackingUrl && (
                  <>
                    <ButtonLink href={firstTracked.trackingUrl} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                      <ExternalLink className="size-3.5" aria-hidden />
                      Track shipment
                    </ButtonLink>
                    <CopyButton value={firstTracked.trackingUrl} label="tracking link" className="h-8 rounded-md px-2 text-[13px] font-medium">Copy link</CopyButton>
                  </>
                )}
                {canEdit && (
                  <Button size="sm" variant="primary" onClick={() => setPaymentOpen(true)}>
                    <Wallet className="size-3.5" aria-hidden />
                    Update Payment
                  </Button>
                )}
                {canEdit && canCancelShipment && (
                  <Button size="sm" variant="danger-outline" onClick={() => setConfirm("cancel-shipment")}>
                    <Ban className="size-3.5" aria-hidden />
                    Cancel This Shipment
                  </Button>
                )}
              </div>
            )}
          </Panel>

          {shipments}

          {related && (
            <Panel icon={Link2} title="Related" collapsible>
              {related}
            </Panel>
          )}
        </div>

        <aside
          aria-label="Order totals and actions"
          className="min-w-0 space-y-4 xl:sticky xl:top-20 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:-mx-0.5 xl:max-h-[calc(100dvh-6rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:px-0.5 xl:pb-1 scrollbar-thin"
        >
          <Panel id="order-totals" icon={Receipt} title="Payment summary">
            <div className="p-4 text-sm">
              <dl className="space-y-1.5">
                {summaryRows.map((row) => (
                  <div key={row.label} className={cn("flex justify-between gap-4", row.strong && "mt-2 border-t border-line pt-2 font-bold text-brand-700")}>
                    <dt className={row.strong ? undefined : "text-ink-muted"}>{row.label}</dt>
                    <dd className={cn("tabular", !row.strong && "text-ink")}>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-linear-to-r from-brand-600 to-brand-700 px-4 py-3 text-brand-fg shadow-sm">
                <span className="font-medium">Grand total</span>
                <span className="text-lg font-bold tabular">{money(grand)}</span>
              </div>
              <p className="mt-3 text-xs text-ink-muted">Taxable {money(totals.taxable)} · TCS is calculated on the finance report.</p>
            </div>
          </Panel>

          <Panel icon={PackageCheck} title="Actions">
            <div className="space-y-2 p-4">
              <Button variant="primary" className="w-full" onClick={() => setVerifyOpen(true)}>
                <PackageCheck className="size-4" aria-hidden />
                Process Order
              </Button>
              {labelVendors.map((vendor) => (
                <Button
                  key={vendor.vendorId}
                  variant="secondary"
                  size="sm"
                  className="h-auto min-h-8 w-full py-1.5 whitespace-normal"
                  loading={busy === `label-${vendor.vendorId}`}
                  disabled={Boolean(busy)}
                  onClick={() => openLabel(vendor)}
                >
                  {busy !== `label-${vendor.vendorId}` && <Printer className="size-3.5" aria-hidden />}
                  {vendor.printLabel ? "Print Label" : "Generate Label"} - {shortVendor(vendor.name)}
                </Button>
              ))}
              <div className={cn("grid gap-2", canEdit && "sm:grid-cols-2")}>
                <ButtonLink href={`/admin/orders/${encodeURIComponent(order.id)}/invoice`} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                  <FileText className="size-3.5" aria-hidden />
                  Generate Invoice
                </ButtonLink>
                {canEdit && (
                  <Button variant="secondary" size="sm" onClick={() => setBoxOpen(true)}>
                    <Boxes className="size-3.5" aria-hidden />
                    Packed box
                  </Button>
                )}
              </div>
              {canEdit && (
                <Button variant="danger-outline" size="sm" className="w-full" disabled={Boolean(busy)} onClick={() => setConfirm("reject")}>
                  <Ban className="size-3.5" aria-hidden />
                  Reject Order
                </Button>
              )}
            </div>
          </Panel>
        </aside>

        {activity && (
          <div className="min-w-0 xl:col-start-1 xl:row-start-2">
            <Panel icon={History} title="Activity" collapsible>
              <div className="p-4">{activity}</div>
            </Panel>
          </div>
        )}
      </div>

      {/* Phones/tablets: grand total and the main action stay within reach while scrolling. */}
      <div className="sticky bottom-3 z-20 xl:hidden">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 py-2.5 pr-2.5 pl-4 shadow-lg backdrop-blur supports-backdrop-filter:bg-surface/85">
          <button type="button" onClick={() => scrollToId("order-totals")} className="min-w-0 text-left" aria-label={`Grand total ${money(grand)}, show the payment summary`}>
            <span className="block text-[11px] font-semibold tracking-wide text-ink-muted uppercase">Grand total</span>
            <span className="block truncate text-base font-bold text-ink tabular">{money(grand)}</span>
          </button>
          <Button variant="primary" onClick={() => setVerifyOpen(true)}>
            <PackageCheck className="size-4" aria-hidden />
            Process Order
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(preview)} onClose={closePreview} title={preview?.productName || "Product image"}>
        {preview && (
          <div className="space-y-3 text-center">
            <img src={preview.image} alt={preview.productName || ""} className="mx-auto max-h-[60vh] w-auto rounded-lg object-contain" />
            <Link href={`/admin/products/${preview.productId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
              Open product page
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          </div>
        )}
      </Dialog>

      {canEdit && (
        <Dialog open={boxOpen} onClose={closeBox} title="Packed box" description="Weight and box size for each product, used when the shipment is created." size="lg">
          <div className="space-y-3">
            {lines.map((line) => <BoxForm key={line.id} line={line} onSave={(box) => run(`box-${line.id}`, () => updateLineBoxAction(order.id, line.id, box))} pending={busy === `box-${line.id}`} />)}
          </div>
        </Dialog>
      )}

      <ConfirmDialog
        open={confirm === "reject"}
        onClose={() => setConfirm("")}
        onConfirm={rejectOrder}
        title="Reject this order?"
        description={`All ${plural(lines.length, "item")} in order ${order.id} will be marked Rejected.`}
        confirmLabel="Reject Order"
        loading={busy === "reject"}
      />

      <ConfirmDialog
        open={confirm === "cancel-shipment"}
        onClose={() => setConfirm("")}
        onConfirm={cancelShipment}
        title="Cancel this shipment?"
        description={`AWB ${firstTracked?.awb || ""} will be cancelled with ${firstTracked?.courier || "the courier"}.`}
        confirmLabel="Cancel Shipment"
        loading={busy === "cancel-shipment"}
      />

      <OrderVerificationDialog
        order={order}
        editor={editor}
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onAccept={acceptOrder}
        onReject={rejectFromVerification}
        pending={busy === "verify"}
      />

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

      {canEdit && address && <OrderAddressDialog orderId={order.id} address={address} open={addressOpen} onClose={closeAddress} />}
      {canEdit && editor?.payment && <OrderPaymentDialog orderId={order.id} payment={editor.payment} open={paymentOpen} onClose={closePayment} />}
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
    <form className="grid gap-2 rounded-lg border border-line p-3 sm:grid-cols-5" onSubmit={(event) => { event.preventDefault(); onSave(box); }}>
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
