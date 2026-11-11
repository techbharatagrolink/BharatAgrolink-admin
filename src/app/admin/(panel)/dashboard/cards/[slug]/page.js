import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can, canCard } from "@/lib/auth/permissions";
import { ApiError } from "@/lib/api";
import { dashboardFilterHref, getDashboardCard, getMainDashboard } from "@/lib/services/admin/main-dashboard";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { DataTable } from "@/components/data-table/data-table";
import { DashboardFilters } from "@/components/admin/dashboard/dashboard-filters";

const PAGE_SIZES = [20, 25, 50, 100];
const STATUS_OPTIONS = [
  { value: "Delivered", label: "Delivered" },
  { value: "Shipped", label: "Shipped" },
  { value: "In Transit", label: "In Transit" },
  { value: "Manifested", label: "Manifested" },
  { value: "Placed", label: "Placed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "RTO", label: "RTO" },
  { value: "Rejected", label: "Rejected" },
];
const PAYMENT_OPTIONS = [
  { value: "partial", label: "Partial" },
  { value: "prepaid", label: "Prepaid" },
  { value: "cod", label: "COD" },
];
const WIDE = new Set(["product", "products", "email", "customer", "seller", "salesman", "agent"]);

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
  "total-sales-b2c": (d) => [
    { label: "Total sales (B2C)", value: formatINR(d.sales.salesB2C), delta: d.deltas.salesB2C, hint: "Live sales value", tone: "brand" },
    { label: "Total orders", value: formatNumber(d.orders.total), delta: d.deltas.totalOrders, hint: "Parent orders", tone: "neutral" },
    { label: "Sub-orders", value: formatNumber(d.orders.subOrders), hint: "All sub-order items", tone: "info", status: "" },
    { label: "Delivered", value: formatNumber(d.orders.delivered), hint: formatINR(d.orders.deliveredGross), tone: "success", status: "Delivered" },
    { label: "Shipped", value: formatNumber(d.orders.shipped), hint: d.orders.shippedAmount ? formatINR(d.orders.shippedAmount) : `${pctText(d.orders.shippedPct)} of sub-orders`, tone: "info", status: "Shipped" },
    { label: "Cancelled", value: formatNumber(d.orders.cancelled), hint: d.orders.cancelledAmount ? formatINR(d.orders.cancelledAmount) : pctText(d.orders.cancellationRate), tone: "danger", status: "Cancelled" },
    { label: "RTO orders", value: formatNumber(d.orders.rto), hint: pctText(d.orders.rtoRate), tone: "warning", status: "RTO" },
    { label: "RTO amount", value: formatINR(d.orders.rtoAmount || d.sales.rtoCharges || 0), hint: d.sales.rtoCharges ? `Freight: ${formatINR(d.sales.rtoCharges)}` : `${formatNumber(d.orders.rto)} RTO orders`, tone: "warning", status: "RTO" },
  ],
  "total-sales-b2b": (d) => [{ label: "Total sales (B2B)", value: formatINR(d.sales.salesB2B), delta: d.deltas.salesB2B }],
  "total-revenue": (d) => [{ label: "Total revenue", value: formatINR(d.sales.totalRevenue), delta: d.deltas.totalRevenue }],
  "seller-payout": (d) => [{ label: "Seller payout", value: formatINR(d.sales.sellerPayout) }],
  "platform-revenue": (d) => [{ label: "Platform revenue", value: formatINR(d.sales.platformRevenue) }],
  "shipping-charges": (d) => [{ label: "Shipping charges", value: formatINR(d.sales.shippingCharges) }],
  "pg-charges": (d) => [{ label: "PG charges", value: formatINR(d.sales.pgCharges) }],
  "prepaid-partial": (d) => [{ label: "Prepaid / partial", value: formatINR(d.sales.prepaidPartial) }],
  tcs: (d) => [{ label: "TCS", value: formatINR(d.sales.tcs) }],
  "rto-charges": (d) => [{ label: "RTO charges", value: formatINR(d.sales.rtoCharges) }, { label: "RTO sub-orders", value: formatNumber(d.sales.rtoSubOrders) }],
  "total-orders": (d) => [{ label: "Total orders", value: formatNumber(d.orders.total), delta: d.deltas.totalOrders }],
  "accepted-orders": (d) => [{ label: "Accepted", value: formatNumber(d.orders.accepted) }],
  "rejected-orders": (d) => [{ label: "Rejected", value: formatNumber(d.orders.rejected) }],
  "sub-orders": (d) => [{ label: "Sub-orders", value: formatNumber(d.orders.subOrders) }],
  shipped: (d) => [{ label: "Shipped", value: formatNumber(d.orders.shipped) }],
  "delivered-orders": (d) => [{ label: "Delivered", value: formatNumber(d.orders.delivered) }, { label: "Delivered gross", value: formatINR(d.orders.deliveredGross) }],
  "delivered-gross": (d) => [{ label: "Delivered gross", value: formatINR(d.orders.deliveredGross), delta: d.deltas.deliveredGross }, { label: "AOV (delivered)", value: formatINR(d.orders.aovDelivered) }],
  "cancelled-orders": (d) => [{ label: "Cancelled sub-orders", value: formatNumber(d.orders.cancelled) }, { label: "Cancellation rate", value: pctText(d.orders.cancellationRate) }],
  "rto-orders": (d) => [{ label: "RTO sub-orders", value: formatNumber(d.orders.rto) }, { label: "RTO rate", value: pctText(d.orders.rtoRate) }],
  "rto-rate": (d) => [{ label: "RTO rate", value: pctText(d.orders.rtoRate) }, { label: "RTO sub-orders", value: formatNumber(d.orders.rto) }, { label: "All sub-orders", value: formatNumber(d.orders.subOrders) }],
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

function cardTotals(slug, dashboard, recordCount, query = {}) {
  let totals = [];
  try {
    totals = (dashboard && TOTALS[slug]?.(dashboard)) || [];
  } catch {
    totals = [];
  }
  if (slug === "total-sales-b2c") {
    const curStatus = String(query?.status || "").trim().toLowerCase();
    totals = totals.map((t) => {
      if (t.status === undefined) return t;
      const isActive = t.status ? curStatus === t.status.toLowerCase() : !curStatus;
      return {
        ...t,
        href: dashboardFilterHref("/admin/dashboard/cards/total-sales-b2c", { ...query, status: t.status }),
        active: isActive,
      };
    });
  }
  if (recordCount != null) totals = [...totals, { label: "Records", value: formatNumber(recordCount), hint: "Rows in this list", tone: "neutral" }];
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
    } else if (column.key === "awb") {
      next.type = "mono";
      next.href = "{trackingUrl}";
      next.wrap = true;
    } else if (column.key === "customerMobile" || column.key === "altMobile") {
      next.type = "mono";
      next.wrap = false;
    } else if (column.key === "status") next.type = "status";
    else if (column.kind === "money") next.type = "currency";
    else if (column.kind === "date") next.type = "datetime";
    else if (column.kind === "percent") next.type = "percent";
    else if (column.align === "right") next.type = "number";
    return next;
  });
}

export default async function DashboardCardPage({ params, searchParams }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,40}$/.test(slug || "")) notFound();
  const query = await searchParams;
  const { user, allowed } = await checkPermission("dashboard.main");
  if (!allowed || !canCard(user, slug)) {
    return (
      <>
        <PageHeader title={titleFromSlug(slug)} />
        <PermissionDenied module={!allowed ? "the main dashboard" : "this dashboard card"} />
      </>
    );
  }

  let data;
  // The main dashboard supplies the card's headline total and filter options; the card list still loads if it fails.
  const dashboardPromise = getMainDashboard(query, user).catch(() => null);
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

  const dashboard = await dashboardPromise;
  const totals = cardTotals(slug, dashboard, data.total, query);
  const allowOrders = can(user, "orders");
  const allowB2B = can(user, "b2b.orders");

  return (
    <>
      <PageHeader
        title={data.title}
        description={data.period}
        actions={<ButtonLink href={dashboardFilterHref("/admin/dashboard", query)} variant="secondary" size="sm">Back to dashboard</ButtonLink>}
      />
      {dashboard?.filters && (
        <DashboardFilters values={dashboard.filters.values} options={dashboard.filters.options} label={dashboard.filters.label} />
      )}
      {totals.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8">
          {totals.map((t) => (
            <StatCard key={t.label} label={t.label} value={t.value} delta={t.delta} hint={t.hint ?? data.period} href={t.href} tone={t.tone ?? (t.label === "Records" ? "neutral" : "brand")} className={t.active ? "ring-2 ring-brand-600 bg-brand-50/50" : undefined} />
          ))}
        </div>
      )}
      {data.salesmen && data.salesmen.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5 bg-gray-50/70">
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">Sales person breakdown</h3>
              <p className="text-xs text-gray-500">Orders and sales volume grouped by sales agent for {data.period}</p>
            </div>
            <div className="flex items-center gap-2">
              {query?.q && (
                <Link
                  href={dashboardFilterHref("/admin/dashboard/cards/total-sales-b2c", { ...query, q: "" })}
                  className="text-xs text-brand-700 hover:text-brand-900 font-medium underline mr-1"
                >
                  Clear filter ({query.q})
                </Link>
              )}
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                {data.salesmen.length} sales persons
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-xs font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-5 w-20 text-gray-400">S.No.</th>
                  <th className="py-3 px-5">Sales person</th>
                  <th className="py-3 px-5 text-right">Orders</th>
                  <th className="py-3 px-5 text-right">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.salesmen.map((s) => {
                  const isSelected = query?.q && String(query.q).toLowerCase() === s.salesman.toLowerCase();
                  return (
                    <tr
                      key={s.salesman}
                      className={`hover:bg-brand-50/40 transition-colors ${isSelected ? "bg-brand-50/70 font-semibold" : ""}`}
                    >
                      <td className="py-3 px-5 font-mono text-xs text-gray-400">{s.sno}</td>
                      <td className="py-3 px-5 font-medium text-gray-900">
                        <Link
                          href={dashboardFilterHref("/admin/dashboard/cards/total-sales-b2c", {
                            ...query,
                            q: isSelected ? "" : s.salesman === "Unassigned" ? "" : s.salesman,
                          })}
                          className="hover:text-brand-700 hover:underline"
                        >
                          {s.salesman}
                          {isSelected && <span className="ml-2 text-xs text-brand-600 font-normal">(filtering sub-orders)</span>}
                        </Link>
                      </td>
                      <td className="py-3 px-5 text-right font-mono text-gray-700">{formatNumber(s.orders)}</td>
                      <td className="py-3 px-5 text-right font-semibold text-gray-900 tabular-nums">{formatINR(s.revenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DataTable
        id={slug}
        rowKey="rowKey"
        columns={tableColumns(data.columns)}
        pageSizes={PAGE_SIZES}
        columnFilters={true}
        search="Search order ID, customer, mobile, AWB, product, agent, seller..."
        filters={
          slug === "total-sales-b2c"
            ? [
                { key: "status", label: "Status", options: STATUS_OPTIONS },
                ...((data.salesmen || []).length > 0
                  ? [{
                      key: "agent",
                      label: "Agent",
                      options: (data.salesmen || [])
                        .filter((s) => s.salesman && s.salesman !== "—")
                        .map((s) => ({ value: s.salesman, label: s.salesman })),
                    }]
                  : []),
                { key: "payment", label: "Payment", options: PAYMENT_OPTIONS },
              ]
            : []
        }
        exportName={`dashboard-${slug}`}
        emptyTitle="No records in this period."
        emptyDescription="Try another period or status from the filters."
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
