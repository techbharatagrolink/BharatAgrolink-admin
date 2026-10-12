"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/page";
import { PricingFactorsStep } from "@/components/admin/products/pricing-factors-step";
import { formatINR } from "@/lib/format";
import { loadProductPricingAction } from "@/lib/actions/admin/pricing-factors";
import { cn } from "@/lib/utils";

const bpsToPct = (bps) => (bps == null ? "—" : `${bps < 0 ? "-" : ""}${Math.floor(Math.abs(bps) / 100)}.${String(Math.abs(bps) % 100).padStart(2, "0")}%`);
const money = (value) => (value == null || value === "" ? "—" : formatINR(value));

function toPaise(value) {
  if (value == null || value === "" || value === "—") return null;
  const text = String(value).trim();
  const exact = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (exact) {
    const paise = Number(exact[2]) * 100 + Number((exact[3] || "").padEnd(2, "0"));
    return exact[1] ? -paise : paise;
  }
  const n = Number(text);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}

function formatPaise(paise) {
  if (paise == null) return "—";
  const neg = paise < 0;
  const abs = Math.abs(paise);
  return formatINR(`${neg ? "-" : ""}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}`);
}

/** Half-up, away from zero. Same rule as the pricing calculator's divRound. */
function divRound(a, b) {
  if (b === 0n) return null;
  if (b < 0n) return divRound(-a, -b);
  if (a < 0n) return -divRound(-a, b);
  return (2n * a + b) / (2n * b);
}

/** Courier charge and shipping actual, in paise. Null when either side is missing. */
function shippingGap(shippingActual, courierCharge) {
  const actual = toPaise(shippingActual);
  const charge = toPaise(courierCharge);
  if (actual == null || charge == null) return null;
  return { actual, charge, gap: charge - actual };
}

/**
 * Saved contribution margin minus (courier charge − shipping actual).
 * A zero gap keeps the saved margin and percent. A missing side returns null
 * so the caller shows the saved margin and does not invent a difference.
 */
function adjustedContribution(result, gapPaise) {
  if (!gapPaise) return null;
  const saved = toPaise(result?.platformMargin);
  const display = toPaise(result?.displayPrice);
  if (saved == null) return null;
  const margin = saved - gapPaise;
  const bps = display ? Number(divRound(BigInt(margin) * 10000n, BigInt(display))) : null;
  return { margin, bps };
}

function marginTone(bps, minBps) {
  if (bps == null || Number.isNaN(Number(bps))) return undefined;
  if (bps < 0) return "danger";
  if (minBps != null && bps < minBps) return "warning";
  return undefined;
}

/** Variance is target − actual. A leading minus means the actual ran over target. */
function varianceClass(amount) {
  const text = String(amount ?? "").trim();
  if (!text || text === "—" || Number(text) === 0) return "text-success-ink";
  return text.startsWith("-") ? "text-danger-ink" : "text-success-ink";
}

/** Margin variance uses the same target − actual sign, but a shortfall (positive) is the miss. */
function marginVarianceClass(amount) {
  const text = String(amount ?? "").trim();
  if (!text || text === "—" || Number(text) === 0) return "text-success-ink";
  return text.startsWith("-") ? "text-success-ink" : "text-danger-ink";
}

function achievementClass(bps, targetBps) {
  if (bps == null) return "text-ink";
  if (bps < 0) return "text-danger-ink";
  if (targetBps != null && bps < targetBps) return "text-warning-ink";
  return "text-ink";
}

function SummaryLine({ label, hint, value, strong, tone }) {
  return (
    <div className="flex min-w-0 max-w-full items-start justify-between gap-3 py-1">
      <dt className={cn("min-w-0 break-words text-sm leading-snug", strong ? "font-medium text-ink" : "text-ink-muted")}>
        {label}
        {hint && <span className="mt-0.5 block text-xs font-normal leading-tight text-ink-muted">{hint}</span>}
      </dt>
      <dd className={cn(
        "max-w-[60%] shrink-0 break-words text-right text-sm leading-snug tabular-nums",
        strong && "font-semibold",
        tone === "danger" ? "text-danger-ink" : tone === "warning" ? "text-warning-ink" : "text-ink",
      )}>{value}</dd>
    </div>
  );
}

/** Wide factor list: header + aligned columns. Narrow: name on top, labelled values in a 2x2 / 4-column grid. */
const FACTOR_COLS = "@sm/factors:grid-cols-[minmax(0,1fr)_4rem_4.5rem_4rem_4.5rem]";

function FactorValue({ label, children, className }) {
  return (
    <span className="flex min-w-0 flex-col @sm/factors:block @sm/factors:text-right">
      <span className="text-xs text-ink-muted @sm/factors:hidden">{label}</span>
      <span className={cn("break-words text-sm tabular-nums", className || "text-ink")}>{children}</span>
    </span>
  );
}

/** Every factor the pricing result returned, including Marketing and Sales incentive at a 0% target. */
function FactorRows({ factors, marginRows = [] }) {
  if (!factors.length) {
    return <p className="text-sm text-ink-muted">No cost factors were returned for this product.</p>;
  }
  return (
    <div className="@container/factors min-w-0">
      <div className={cn("hidden gap-x-2 border-b border-line pb-1 text-xs font-medium text-ink-muted @sm/factors:grid", FACTOR_COLS)}>
        <span>Factor</span>
        <span className="text-right">Target</span>
        <span className="text-right">Actual</span>
        <span className="text-right">Achv</span>
        <span className="text-right">Var</span>
      </div>
      <ul className="min-w-0 divide-y divide-line border-y border-line @sm/factors:border-t-0" data-testid="shipment-cost-factors">
        {factors.map((factor) => (
          <li
            key={factor.code}
            data-factor={factor.code}
            className={cn("grid min-w-0 gap-x-2 gap-y-1 py-1.5 @sm/factors:items-baseline", FACTOR_COLS)}
          >
            <span className="min-w-0 break-words text-sm font-medium text-ink">{factor.label || factor.code}</span>
            <span className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1 @xs/factors:grid-cols-4 @sm/factors:contents">
              <FactorValue label="Target">{bpsToPct(factor.targetBps)}</FactorValue>
              <FactorValue label="Actual">{money(factor.actualAmount)}</FactorValue>
              <FactorValue label="Achv">{bpsToPct(factor.achievementBps)}</FactorValue>
              <FactorValue label="Var" className={varianceClass(factor.varianceAmount)}>{money(factor.varianceAmount)}</FactorValue>
            </span>
          </li>
        ))}
        {marginRows.map((row, index) => (
          <li
            key={row.code}
            data-factor={row.code}
            className={cn(
              "grid min-w-0 gap-x-2 gap-y-1 py-1.5 @sm/factors:items-baseline",
              FACTOR_COLS,
              index === 0 && "!border-t !border-t-line-strong",
            )}
          >
            <span className="min-w-0 break-words text-sm font-semibold text-ink">
              {row.label}
              {row.hint && <span className="mt-0.5 block text-xs font-normal leading-tight text-ink-muted">{row.hint}</span>}
            </span>
            <span className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1 @xs/factors:grid-cols-4 @sm/factors:contents">
              <FactorValue label="Target">{row.target}</FactorValue>
              <FactorValue label="Actual" className={row.actualClass}>{row.actual}</FactorValue>
              <FactorValue label="Achv" className={row.achvClass}>{row.achv}</FactorValue>
              <FactorValue label="Var" className={row.varClass}>{row.variance}</FactorValue>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductPricingBlock({ product, courierCharge, courierName, canEdit }) {
  const summaryRef = useRef(null);
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let live = true;
    loadProductPricingAction(product.productId, product.variantId).then((res) => {
      if (!live) return;
      if (res.ok) {
        setPricing(res.pricing);
        setError("");
      } else {
        setPricing(null);
        setError(res.message || "Could not load pricing.");
      }
    });
    return () => { live = false; };
  }, [product.productId, product.variantId, revision]);

  const result = pricing?.result;
  const factors = result?.factors || [];
  const shipping = factors.find((factor) => factor.code === "SHIPPING");
  const gap = shipping ? shippingGap(shipping.actualAmount, courierCharge) : null;
  const adjusted = gap ? adjustedContribution(result, gap.gap) : null;
  const minMarginBps = pricing?.config?.minMarginBps;
  const marginTargetBps = result?.marginTargetBps ?? pricing?.config?.defaultTargetMarginBps;
  const marginTargetPaise = toPaise(result?.marginTargetAmount);

  const marginHint = adjusted ? `at ${courierName || "courier"} ${formatPaise(gap.charge)}` : undefined;
  const marginBps = adjusted ? adjusted.bps : result?.platformMarginBps;
  const marginActual = adjusted ? formatPaise(adjusted.margin) : money(result?.platformMargin);
  const marginNegative = adjusted ? adjusted.margin < 0 : result?.platformMarginBps < 0;
  const adjustedVariance = adjusted && marginTargetPaise != null ? marginTargetPaise - adjusted.margin : null;
  const marginVariance = adjusted
    ? (adjustedVariance == null ? "—" : formatPaise(adjustedVariance))
    : money(result?.marginVarianceAmount);
  const marginVarClass = adjusted
    ? (adjustedVariance == null ? "text-ink" : marginVarianceClass(adjustedVariance / 100))
    : marginVarianceClass(result?.marginVarianceAmount);
  const marginSummaryTone = marginTone(marginBps, minMarginBps);
  const belowMin = minMarginBps != null && marginBps != null && marginBps < minMarginBps;

  const marginRows = result
    ? [{
      code: "CONTRIBUTION_MARGIN",
      label: "Contribution margin",
      hint: marginHint,
      target: bpsToPct(marginTargetBps),
      actual: marginActual,
      actualClass: marginNegative ? "text-danger-ink" : "text-ink",
      achv: bpsToPct(marginBps),
      achvClass: achievementClass(marginBps, marginTargetBps),
      variance: marginVariance,
      varClass: marginVarClass,
    }]
    : [];

  return (
    <section ref={summaryRef} className="@container/pricing min-w-0 max-w-full space-y-3 overflow-x-hidden rounded-lg border border-line p-3 sm:p-4" data-testid="shipment-product-pricing">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 break-words text-sm font-semibold text-ink sm:text-base">{product.name || "Product"}</p>
        {canEdit && (
          <Button size="sm" variant="secondary" className="min-h-11 w-full sm:min-h-8 sm:w-auto" onClick={() => setEditing((open) => !open)}>
            {editing ? "Close editor" : "Edit product"}
          </Button>
        )}
      </div>

      {error && <Notice tone="danger">{error}</Notice>}
      {!error && !pricing && <p className="text-sm text-ink-muted">Loading pricing…</p>}
      {pricing && result && (
        <>
          {!pricing.saved && <Badge tone="warning">Pricing not saved yet</Badge>}
          <div className="grid min-w-0 grid-cols-1 gap-4 @3xl/pricing:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] @3xl/pricing:gap-6">
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-semibold text-ink">Cost factors</p>
              <FactorRows factors={factors} marginRows={marginRows} />
            </div>
            <div className="min-w-0 space-y-2 border-t border-line pt-3 @3xl/pricing:border-t-0 @3xl/pricing:border-l @3xl/pricing:pt-0 @3xl/pricing:pl-6">
              {gap && gap.gap !== 0 && (
                <p className="break-words rounded-md bg-surface-muted px-2.5 py-1.5 text-xs leading-snug text-ink-muted sm:text-sm" data-testid="courier-shipping-gap">
                  {courierName || "Courier"} {formatPaise(gap.charge)}
                  {" is "}
                  {formatPaise(Math.abs(gap.gap))}
                  {gap.gap > 0 ? " above " : " below "}
                  shipping actual {formatPaise(gap.actual)}.
                </p>
              )}
              <dl className="min-w-0 max-w-full" data-testid="shipment-pricing-summary">
                <SummaryLine label="Display price" value={money(result.displayPrice)} strong />
                <SummaryLine label="Taxable value" hint="Display price ÷ (1 + GST)" value={money(result.taxableValue)} />
                <SummaryLine label="TCS" hint={`${bpsToPct(pricing.config?.tcsBps)} of taxable value`} value={money(result.tcs)} />
                <SummaryLine label="NRV to seller" value={money(pricing.input?.nrv)} />
                <SummaryLine label="Service charge" hint="Display price − NRV − TCS" value={money(result.serviceCharge)} strong />
                <SummaryLine label="GST on service charge" value={money(result.scGst)} />
                <SummaryLine label="Net service charge" value={money(result.netServiceCharge)} strong />
                <SummaryLine label="Cost factors (actual)" value={money(result.totalFactorActual)} />
                <SummaryLine
                  label="Contribution margin"
                  hint={marginHint}
                  value={`${marginActual} · ${bpsToPct(marginBps)}`}
                  strong
                  tone={marginSummaryTone}
                />
                <div className="mt-1 border-t border-line pt-1">
                  <SummaryLine label="TCS balance retained" hint="Memo: TCS collected, not part of margin" value={money(result.tcsBalance)} />
                  <SummaryLine label="Seller payout" hint="NRV − TCS" value={money(result.sellerPayout)} />
                </div>
              </dl>
              {belowMin && (
                <p className="break-words text-xs leading-snug text-warning-ink sm:text-sm">
                  {`Contribution margin ${bpsToPct(marginBps)} is below the ${bpsToPct(minMarginBps)} minimum.`}
                </p>
              )}
              {!shipping && courierCharge != null && (
                <p className="break-words text-xs leading-snug text-ink-muted sm:text-sm">
                  No Shipping cost factor, so the courier charge is not applied to this margin.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {editing && (
        <div className="min-w-0 max-w-full border-t border-line pt-2">
          <PricingFactorsStep
            productId={product.productId}
            initialVariantId={product.variantId}
            canEdit={canEdit}
            onSaved={() => {
              setRevision((n) => n + 1);
              summaryRef.current?.scrollIntoView({ block: "nearest" });
            }}
          />
        </div>
      )}
    </section>
  );
}

/** Saved Pricing & Tax for the products in one vendor parcel, next to the selected courier charge. */
export function ShipmentProductPricing({ products, courierCharge = null, courierName = "", access }) {
  if (!products?.length) return null;
  if (!access) return <p className="text-sm text-ink-muted">Loading product pricing…</p>;
  if (!access.ok) return <Notice tone="danger">{access.message || "Product pricing could not be loaded."}</Notice>;
  if (!access.enabled) return <Notice tone="warning">Product pricing factors are not enabled, so take rate and cost factors cannot be shown.</Notice>;
  if (!access.canView) return <Notice tone="warning">You do not have permission to view product pricing.</Notice>;

  return (
    <div className="min-w-0 max-w-full space-y-2">
      <p className="text-sm font-semibold text-ink">Pricing &amp; Tax</p>
      {products.map((product) => (
        <ProductPricingBlock
          key={`${product.productId}:${product.variantId}`}
          product={product}
          courierCharge={courierCharge}
          courierName={courierName}
          canEdit={Boolean(access.canEdit)}
        />
      ))}
    </div>
  );
}
