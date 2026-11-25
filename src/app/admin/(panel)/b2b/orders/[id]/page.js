import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getB2BOrder } from "@/lib/services/admin/pipeline";
import { getOrderLifecycle } from "@/lib/services/admin/b2b-screens";
import { formatDate, formatDateTime, formatINR, formatNumber, formatPercent } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { OrderActions, OrderSellers } from "@/components/admin/b2b/order-actions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `B2B order ${id}` };
}

const STAGE_TONE = {
  gate_pending: "warning",
  seller_pending: "warning",
  claim_hold: "danger",
  rto: "danger",
  rto_in_transit: "danger",
  cancelled: "danger",
  delivered: "success",
  closed: "neutral",
};

const STOCK_TONE = { PENDING: "info", COMMITTED: "success", EXPIRED: "warning", RELEASED: "neutral", NONE: "neutral" };
const STOCK_LABEL = { PENDING: "Held", COMMITTED: "Dispatched (left stock)", EXPIRED: "Hold expired", RELEASED: "Released", NONE: "Not reserved" };

// Spec §10 flow, for the progress strip.
const FLOW = [
  ["confirmedAt", "Confirmed"],
  ["sellerAcceptedAt", "Sellers accepted"],
  ["reservedAt", "Stock reserved"],
  ["packedAt", "Packed"],
  ["dispatchedAt", "Dispatched"],
  ["deliveredAt", "Delivered"],
  ["closedAt", "Closed"],
];

export default async function B2BOrderPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("b2b.orders");
  if (!allowed) return (<><PageHeader title="B2B order" /><PermissionDenied module="B2B orders" /></>);

  const [life, legacy] = await Promise.all([
    getOrderLifecycle(id, user).then((data) => ({ data }), (error) => ({ error })),
    getB2BOrder(id, user).catch(() => null),
  ]);
  if (life.error) return (<><PageHeader title="B2B order" /><ApiUnavailable error={life.error} what="this order" /></>);
  const d = life.data;
  if (!d) notFound();
  const e = d.economics;
  const showCost = d.lines.some((l) => l.unitCost != null);
  const q = legacy?.quotation;

  return (
    <>
      <PageHeader
        title={`B2B order ${d.number || d.id}`}
        description={`${d.buyer.businessName || d.buyer.name || "Buyer"} · placed ${formatDateTime(d.createdAt)}${d.owner ? ` · ${d.owner}` : ""}`}
        meta={
          <>
            <Badge tone={STAGE_TONE[d.state.code] ?? "info"}>{d.state.label}</Badge>
            <StatusBadge status={d.payment.status} />
          </>
        }
        actions={<ButtonLink href="/admin/b2b/orders" size="sm">Back to orders</ButtonLink>}
      />

      <div className="space-y-4">
        {d.state.code === "gate_pending" && (
          <Notice tone="warning" title="Waiting for payment or credit approval">
            The order is not confirmed yet (spec §21). It moves on when the payment is received, or when Finance confirms it on approved credit.
          </Notice>
        )}
        {d.state.code === "claim_hold" && <Notice tone="danger" title="On claim hold">Release the hold to continue from &quot;{d.heldFrom.replace(/_/g, " ")}&quot;.</Notice>}
        {d.state.code === "cancelled" && (
          <Notice tone="danger" title="Cancelled">
            {d.cancelReason || "No reason recorded."}
            {d.payment.received > 0 ? ` ${formatINR(d.payment.received)} was received: Finance must refund it.` : ""}
          </Notice>
        )}

        <StatGrid>
          <StatCard label="Order value" value={formatINR(d.totals.totalPayable)} hint={`Ex-GST ${formatINR(d.totals.valueExGst)} · GST ${formatINR(d.totals.gst)}`} />
          <StatCard label="Received" value={formatINR(d.payment.received)} hint={d.payment.outstanding > 0 ? `Outstanding ${formatINR(d.payment.outstanding)}` : "Fully paid"} tone={d.payment.outstanding > 0 ? "warning" : "success"} />
          {e && <StatCard label="Contribution" value={formatINR(e.contribution)} hint={formatPercent(e.cmPct, 2)} tone={e.cmPct < 5 ? "danger" : "brand"} />}
          {e && <StatCard label="Platform revenue" value={formatINR(e.platformRevenue)} tone="info" />}
        </StatGrid>

        <Card>
          <CardHeader title="Progress" />
          <CardBody>
            <ol className="grid gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {FLOW.map(([key, label]) => (
                <li key={key} className={`rounded-md border p-2 text-xs ${d.stages[key] ? "border-success-ink/30 bg-success-bg text-success-ink" : "border-line text-ink-muted"}`}>
                  <span className="block font-medium">{label}</span>
                  {d.stages[key] ? formatDateTime(d.stages[key]) : "—"}
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <OrderActions id={d.id} actions={d.actions} packageTypes={d.packageTypes ?? []} suggestion={d.packingSuggestion ?? null} />

        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader title="Buyer and delivery" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Buyer", value: d.buyer.id ? <Link href={`/admin/b2b/buyers/${d.buyer.id}`} className="text-brand-700 hover:underline">{d.buyer.businessName || d.buyer.name}</Link> : d.buyer.businessName || d.buyer.name },
                  { label: "Contact", value: [d.buyer.name, d.buyer.mobile].filter(Boolean).join(" · ") || "—" },
                  { label: "GSTIN", value: d.buyer.gstin ? <span className="font-mono text-xs">{d.buyer.gstin}</span> : "—" },
                  { label: "Deliver to", value: [d.delivery.address, d.delivery.district, d.delivery.state, d.delivery.pincode].filter(Boolean).join(", ") || "—" },
                  d.quotation && { label: "Quotation", value: <Link href={`/admin/b2b/quotations/${d.quotation.id}`} className="font-mono text-xs text-brand-700 hover:underline">{d.quotation.number}</Link> },
                  d.poNumber && { label: "PO", value: d.poNumber },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Payment" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Terms", value: d.payment.mode || "—" },
                  { label: "Status", value: <StatusBadge status={d.payment.status} /> },
                  { label: "Received", value: `${formatINR(d.payment.received)} of ${formatINR(d.payment.total)}` },
                  d.payment.mode === "Partial Advance" && { label: "Advance", value: formatINR(d.payment.advanceAmount) },
                  d.payment.dueDate && { label: "Due", value: formatDate(d.payment.dueDate) },
                  d.payment.razorpayPaymentId && { label: "Razorpay", value: <span className="font-mono text-xs">{d.payment.razorpayPaymentId}</span> },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Shipping" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "LR / AWB", value: d.shipping.awbNumber ? <span className="font-mono text-xs">{d.shipping.awbNumber}</span> : "Not dispatched" },
                  { label: "Courier", value: d.shipping.courierName || "—" },
                  { label: "Weight", value: d.shipping.weightKg ? `${formatNumber(d.shipping.weightKg)} kg` : "—" },
                  d.shipping.expectedDispatch && { label: "Dispatch by", value: formatDate(d.shipping.expectedDispatch) },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title="Stock" description="Held in the inventory B2B pool from Stock reserved until dispatch." />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Hold", value: <Badge tone={STOCK_TONE[d.stock?.status] ?? "neutral"}>{STOCK_LABEL[d.stock?.status] ?? d.stock?.status ?? "—"}</Badge> },
                  d.stock?.holdUntil && d.stock.status === "PENDING" && { label: "Held until", value: formatDateTime(d.stock.holdUntil) },
                  d.stock?.committedAt && { label: "Left stock", value: formatDateTime(d.stock.committedAt) },
                  d.stock?.reservationRef && { label: "Reference", value: <span className="font-mono text-xs">{d.stock.reservationRef}</span> },
                ]}
              />
              {d.stock?.status === "EXPIRED" && <p className="mt-2 text-xs text-warning-ink">The hold expired. Dispatch takes a new hold first and stops if the stock is gone.</p>}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Packages" description="Recorded at Packed. Chargeable = the higher of actual and volumetric weight." />
            <MiniTable
              columns={[
                { key: "code", label: "Package", render: (r) => (r.originalPack ? "Original pack" : `${r.code} · ${r.type}`) },
                { key: "dims", label: "L × W × H cm", render: (r) => (r.lengthCm ? `${r.lengthCm} × ${r.widthCm} × ${r.heightCm}` : "—") },
                { key: "weightKg", label: "Actual kg", align: "right", render: (r) => formatNumber(r.weightKg) },
                { key: "chargeableKg", label: "Chargeable kg", align: "right", render: (r) => formatNumber(r.chargeableKg) },
              ]}
              rows={d.packages ?? []}
              empty="Not packed yet."
            />
          </Card>
        </div>

        <Card>
          <CardHeader title="Sellers" description="Each seller confirms its part of the order before stock is reserved." />
          <CardBody>
            <OrderSellers id={d.id} sellers={d.sellers} waiting={d.state.code === "seller_pending"} canEdit={can(user, "b2b.orders", "edit")} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Line items" />
          <MiniTable
            columns={[
              { key: "name", label: "Product", render: (r) => (<><span className="font-medium text-ink">{r.name}</span><span className="block font-mono text-xs text-ink-muted">{[r.sku, r.pack].filter(Boolean).join(" · ")}</span></>) },
              { key: "seller", label: "Seller" },
              { key: "quantity", label: "Qty", align: "right", render: (r) => formatNumber(r.quantity) },
              { key: "dispatchedQty", label: "Dispatched", align: "right", render: (r) => formatNumber(r.dispatchedQty) },
              {
                key: "available",
                label: "Available / held",
                align: "right",
                render: (r) => (r.stockConfigured ? `${formatNumber(r.available)} / ${formatNumber(r.heldForOrder)}` : <span className="text-danger-ink">No stock record</span>),
              },
              { key: "rate", label: "Rate", align: "right", render: (r) => formatINR(r.rate) },
              { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
              ...(showCost ? [{ key: "unitCost", label: "Seller cost / unit", align: "right", render: (r) => formatINR(r.unitCost) }] : []),
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={d.lines}
            empty="No line items."
          />
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Order history" description="Every status change with who did it and when (spec C7)." />
            <CardBody>
              <Timeline
                items={d.timeline.map((t) => ({
                  id: t.id,
                  title: t.from === t.to || !t.to ? t.action.replace(/_/g, " ") : `${t.fromLabel || "—"} → ${t.toLabel}`,
                  description: [t.from !== t.to && t.to ? t.action.replace(/_/g, " ") : null, t.reason].filter(Boolean).join(" · "),
                  meta: `${t.actor || "System"} · ${formatDateTime(t.at)}`,
                  tone: /cancel|reject|hold|rto/i.test(t.action) ? "danger" : undefined,
                }))}
              />
              {!d.timeline.length && <p className="text-sm text-ink-muted">No changes recorded yet.</p>}
            </CardBody>
          </Card>
          <div className="space-y-4">
            {q && (
              <Card>
                <CardHeader title="Quotation economics" />
                <CardBody>
                  <DescriptionList
                    columns={1}
                    items={[
                      { label: "Quoted value", value: formatINR(q.value) },
                      ...(legacy?.showFinance ? [{ label: "Take rate", value: formatPercent(q.takeRate) }, { label: "Contribution margin", value: formatPercent(q.cmPercent) }] : []),
                      { label: "Net shipping", value: formatPercent(q.netShippingPercent) },
                    ]}
                  />
                </CardBody>
              </Card>
            )}
            {legacy?.settlements?.length > 0 && (
              <Card>
                <CardHeader title="Seller settlement" />
                <MiniTable
                  columns={[
                    { key: "seller", label: "Seller" },
                    { key: "netPayable", label: "Net", align: "right", render: (r) => formatINR(r.netPayable) },
                    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  ]}
                  rows={legacy.settlements}
                />
              </Card>
            )}
            {legacy?.claims?.length > 0 && (
              <Card>
                <CardHeader title="Claims" />
                <MiniTable
                  columns={[
                    { key: "type", label: "Type" },
                    { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  ]}
                  rows={legacy.claims}
                />
              </Card>
            )}
            {d.payments.length > 0 && (
              <Card>
                <CardHeader title="Payments received" />
                <MiniTable
                  columns={[
                    { key: "reference", label: "Reference", render: (r) => <span className="font-mono text-xs">{r.reference}</span> },
                    { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                    { key: "receivedAt", label: "Received", render: (r) => formatDate(r.receivedAt) },
                  ]}
                  rows={d.payments}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
