import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { ApiError } from "@/lib/api";
import { dashboardFilterHref, getDashboardCard, getMainDashboard } from "@/lib/services/admin/main-dashboard";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { DataTable } from "@/components/data-table/data-table";

const PAGE_SIZES = [20, 25, 50, 100];
const WIDE = new Set(["product", "products", "email", "customer", "seller", "salesman"]);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: titleFromSlug(slug) };
}

function titleFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((part) => (part === "b2c" || part === "b2b" || part === "pg" || part === "rto" || part === "tcs" || part === "cod" ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

const pctText = (v) => (v == null || Number.isNaN(Number(v)) ? "—" : `${v}%`);
const courier = (d, name) => d.shipping.couriers.find((c) => c.name === name);
const mode = (d, name) => d.paymentModes.find((m) => m.mode === name);
const modeTotals = (m) => (m ? [{ label: `${m.mode} share`, value: `${m.pct}%` }, { label: `${m.mode} value`, value: formatINR(m.value) }, { label: "Sub-orders", value: formatNumber(m.count) }] : []);

// Headline figures for each card, taken from the main dashboard so they match the card exactly.
const TOTALS = {
  "total-sales-b2c": (d) => [{ label: "Total sales (B2C)", value: formatINR(d.sales.salesB2C), delta: d.deltas.salesB2C }],
  "total-sales-b2b": (d) => [{ label: "Total sales (B2B)", value: formatINR(d.sales.salesB2B), delta: d.deltas.salesB2B }],
  "total-revenue": (d) => [{ label: "Total revenue", value: formatINR(d.sales.totalRevenue), delta: d.deltas.totalRevenue }],
  "seller-payout": (d) => [{ label: "Seller payout", value: formatINR(d.sales.sellerPayout) }],
  "platform-revenue": (d) => [{ label: "Platform revenue", value: formatINR(d.sales.platformRevenue) }],
  "shipping-charges": (d) => [{ label: "Shipping charges", value: formatINR(d.sales.shippingCharges) }],
  "pg-charges": (d) => [{ label: "PG charges", value: formatINR(d.sales.pgCharges) }],
  "prepaid-partial": (d) => [{ label: "Prepaid / partial", value: formatINR(d.sales.prepaidPartial) }],
  tcs: (d) => [{ label: "TCS", value: formatINR(d.sales.tcs) }],
  "total-orders": (d) => [{ label: "Total orders", value: formatNumber(d.orders.total), delta: d.deltas.totalOrders }],
  "accepted-orders": (d) => [{ label: "Accepted", value: formatNumber(d.orders.accepted) }],
  "rejected-orders": (d) => [{ label: "Rejected", value: formatNumber(d.orders.rejected) }],
  "sub-orders": (d) => [{ label: "Sub-orders", value: formatNumber(d.orders.subOrders) }],
  shipped: (d) => [{ label: "Shipped", value: formatNumber(d.orders.shipped) }],
  "delivered-orders": (d) => [{ label: "Delivered", value: formatNumber(d.orders.delivered) }, { label: "Delivered gross", value: formatINR(d.orders.deliveredGross) }],
  "delivered-gross": (d) => [{ label: "Delivered gross", value: formatINR(d.orders.deliveredGross), delta: d.deltas.deliveredGross }, { label: "AOV (delivered)", value: formatINR(d.orders.aovDelivered) }],
  "cancelled-orders": (d) => [{ label: "Cancelled", value: formatNumber(d.orders.cancelled) }, { label: "Cancellation rate", value: `${d.orders.cancellationRate}%` }],
  "rto-orders": (d) => [{ label: "RTO orders", value: formatNumber(d.orders.rto) }, { label: "RTO rate", value: pctText(d.orders.rtoRate) }],
  "rto-rate": (d) => [{ label: "RTO rate", value: pctText(d.orders.rtoRate) }, { label: "RTO orders", value: formatNumber(d.orders.rto) }],
  "new-orders": (d) => [{ label: "New order %", value: `${d.orders.newOrderPct}%` }],
  "repeat-orders": (d) => [{ label: "Repeat orders", value: formatNumber(d.orders.repeatOrders) }],
  "repeat-customers": (d) => [{ label: "Repeat customer %", value: `${d.orders.repeatCustomerPct}%` }],
  delhivery: (d) => [{ label: "Delhivery shipments", value: formatNumber(courier(d, "Delhivery")?.shipments ?? 0) }],
  shiprocket: (d) => [{ label: "Shiprocket shipments", value: formatNumber(courier(d, "Shiprocket")?.shipments ?? 0) }],
  "average-shipping": (d) => [{ label: "Average delivery time", value: `${d.shipping.avgDays} days` }, { label: "Average shipping fee", value: formatINR(d.shipping.avgAmount) }],
  "top-products": (d) => [{ label: "Top product (units)", value: formatNumber(d.marketplace.topProduct?.units ?? 0), hint: d.marketplace.topProduct?.name }],
  "top-locations": (d) => [{ label: "Top location (orders)", value: formatNumber(d.marketplace.topLocation?.orders ?? 0), hint: d.marketplace.topLocation ? `${d.marketplace.topLocation.city}, ${d.marketplace.topLocation.state}` : undefined }],
  "unique-visitors": (d) => [{ label: "Unique visitors", value: formatNumber(d.customers.uniqueVisitors), delta: d.customers.uniqueVisitorsPct }],
  "ordering-customers": (d) => [{ label: "Ordering customers", value: formatNumber(d.customers.ordering) }],
  "prepaid-orders": (d) => modeTotals(mode(d, "Prepaid")),
  "partial-orders": (d) => modeTotals(mode(d, "Partial")),
  "cod-orders": (d) => modeTotals(mode(d, "COD")),
};

function cardTotals(slug, dashboard, recordCount) {
  let totals = [];
  try {
    totals = (dashboard && TOTALS[slug]?.(dashboard)) || [];
  } catch {
    totals = [];
  }
  if (recordCount != null) totals = [...totals, { label: "Records", value: formatNumber(recordCount), hint: "Rows in this list" }];
  return totals;
}

function orderHref(row, allowOrders, allowB2B) {
  if (!row.orderId) return "";
  if (row.channel === "SP" && allowB2B) return `/admin/b2b/orders/${encodeURIComponent(row.orderId)}`;
  if (row.channel === "B2B" || row.channel === "SP") return "";
  if (allowOrders) return `/admin/orders/${encodeURIComponent(row.orderId)}`;
  return "";
}

function tableColumns(columns) {
  return (columns || []).map((column) => {
    const next = { key: column.key, label: column.label, align: column.align, wrap: WIDE.has(column.key) };
    if (column.key === "orderId") {
      next.type = "mono";
      next.href = "{orderHref}";
      next.wrap = true;
    } else if (column.key === "status") next.type = "status";
    else if (column.kind === "money") next.type = "currency";
    else if (column.kind === "date") next.type = "datetime";
    else if (column.align === "right") next.type = "number";
    return next;
  });
}

export default async function DashboardCardPage({ params, searchParams }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,40}$/.test(slug || "")) notFound();
  const query = await searchParams;
  const { user, allowed } = await checkPermission("dashboard.main");
  if (!allowed) {
    return (
      <>
        <PageHeader title={titleFromSlug(slug)} />
        <PermissionDenied module="the main dashboard" />
      </>
    );
  }

  let data;
  // The main dashboard supplies the card's headline total; the card list still loads if it fails.
  const dashboardPromise = TOTALS[slug] ? getMainDashboard(query, user).catch(() => null) : null;
  try {
    data = await getDashboardCard(slug, query, user);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.code === "DASHBOARD_CARD_NOT_FOUND")) notFound();
    return (
      <>
        <PageHeader title={titleFromSlug(slug)} />
        <ApiUnavailable error={error} what="this dashboard card" />
      </>
    );
  }

  const totals = cardTotals(slug, await dashboardPromise, data.total);
  const allowOrders = can(user, "orders");
  const allowB2B = can(user, "b2b.orders");

  return (
    <>
      <PageHeader
        title={data.title}
        description={data.period}
        actions={<ButtonLink href={dashboardFilterHref("/admin/dashboard", query)} variant="secondary" size="sm">Back to dashboard</ButtonLink>}
      />
      {totals.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {totals.map((t) => (
            <StatCard key={t.label} label={t.label} value={t.value} delta={t.delta} hint={t.hint ?? data.period} tone={t.label === "Records" ? "neutral" : "brand"} />
          ))}
        </div>
      )}
      <DataTable
        id={slug}
        rowKey="rowKey"
        columns={tableColumns(data.columns)}
        pageSizes={PAGE_SIZES}
        emptyTitle="No records in this period."
        emptyDescription="Try another period from the dashboard filters."
        data={{
          rows: (data.rows || []).map((row, index) => ({ ...row, rowKey: `${row.id ?? row.orderId ?? "row"}-${index}`, orderHref: orderHref(row, allowOrders, allowB2B) })),
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          pageCount: data.pageCount,
        }}
      />
    </>
  );
}
