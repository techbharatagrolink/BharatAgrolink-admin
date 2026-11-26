import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getOrderProfitabilityReport, getOrderReportVendors, getOrderReportStatuses } from "@/lib/services/admin/orders-report";
import { formatINR, formatNumber, formatPercent, formatDateTime } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Order Profitability Report" };

const TITLE = "Order-wise Profitability";
const DESCRIPTION = "Target (12% of line value) vs Achievable (the product's current pricing screen margin) vs Achieved (actual revenue after real shipping/payment-gateway costs), per delivered B2C order line. Same filters and underlying figures as the Orders finance report — just the profitability columns on their own.";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SIZES = new Set(["25", "50", "100", "200"]);

function readFilters(sp) {
  const filters = {};
  if (typeof sp?.orderId === "string" && sp.orderId.trim()) filters.orderId = sp.orderId.trim().slice(0, 80);
  if (typeof sp?.vendorId === "string" && sp.vendorId.trim()) filters.vendorId = sp.vendorId.trim().slice(0, 100);
  if (typeof sp?.status === "string" && sp.status.trim()) filters.status = sp.status.trim().slice(0, 60);
  if (sp?.dateType === "created") filters.dateType = "created";
  if (DATE.test(sp?.from ?? "")) filters.from = sp.from;
  if (DATE.test(sp?.to ?? "")) filters.to = sp.to;
  filters.page = /^\d+$/.test(sp?.page ?? "") && Number(sp.page) > 0 ? Number(sp.page) : 1;
  filters.pageSize = SIZES.has(sp?.pageSize) ? Number(sp.pageSize) : 50;
  return filters;
}

function varianceTone(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return "text-ink-soft";
  return n > 0 ? "text-danger-ink" : "text-success-ink";
}

export default async function OrderProfitabilityPage({ searchParams }) {
  const { user, allowed } = await checkPermission("orders.transactions");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="order profitability" /></>);
  const filters = readFilters(await searchParams);
  const result = await Promise.all([getOrderProfitabilityReport(filters, user), getOrderReportVendors(user), getOrderReportStatuses(user)]).then(
    ([report, vendors, statuses]) => ({ report, vendors, statuses }),
    (error) => ({ error }),
  );
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="the order profitability report" /></>);
  const { report } = result;
  const rows = report.rows ?? [];

  const totals = rows.reduce(
    (sum, r) => ({
      target: sum.target + (Number(r.contributionTarget) || 0),
      achievable: sum.achievable + (Number(r.contributionAchievable) || 0),
      achieved: sum.achieved + (Number(r.contributionAchieved) || 0),
    }),
    { target: 0, achievable: 0, achieved: 0 },
  );

  const fields = [
    { name: "orderId", label: "Order ID", type: "search", placeholder: "Search Order ID" },
    { name: "status", label: "Status", type: "select", placeholder: "All statuses", options: result.statuses },
    { name: "dateType", label: "Date filter on", type: "select", options: [{ value: "delivered", label: "Delivery date" }, { value: "created", label: "Created date" }], defaultValue: "delivered" },
    { name: "from", label: "From", type: "date" },
    { name: "to", label: "To", type: "date" },
    { name: "vendorId", label: "Vendor", type: "select", placeholder: "All vendors", options: result.vendors },
    { name: "pageSize", label: "Per page", type: "select", options: ["25", "50", "100", "200"].map((value) => ({ value, label: value })), defaultValue: "50" },
  ];

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <StatGrid className="xl:grid-cols-3">
          <StatCard label="Target contribution (this page)" value={formatINR(totals.target)} hint={`${formatNumber(report.total)} lines match the filter`} />
          <StatCard label="Achievable contribution" value={formatINR(totals.achievable)} hint="From the product's current pricing" />
          <StatCard label="Achieved contribution" value={formatINR(totals.achieved)} tone={totals.achieved < totals.target ? "danger" : "brand"} hint="Actual, after real costs" />
        </StatGrid>
        <QueryFilters fields={fields} />
        <Card>
          <MiniTable
            rows={rows}
            exportName="order-profitability"
            columns={[
              { key: "order", label: "Order", render: (r) => <Link href={`/admin/orders/${r.orderId}`} className="font-medium text-brand-700 hover:underline">{r.orderId}</Link> },
              {
                key: "product",
                label: "Product",
                render: (r) => (
                  <>
                    <span className="block text-ink">{r.product}</span>
                    <span className="block text-xs text-ink-muted">{r.sku}</span>
                  </>
                ),
              },
              { key: "vendor", label: "Vendor", render: (r) => <span className="text-ink-soft">{r.vendor}</span> },
              { key: "target", label: "Target", align: "right", render: (r) => <>{formatINR(r.contributionTarget)} <span className="text-xs text-ink-muted">({formatPercent(r.contributionTargetPct)})</span></> },
              { key: "achievable", label: "Achievable", align: "right", render: (r) => (r.contributionAchievable == null ? "—" : formatINR(r.contributionAchievable)) },
              { key: "achieved", label: "Achieved", align: "right", render: (r) => <span className="font-medium text-ink">{formatINR(r.contributionAchieved)}</span> },
              { key: "variance", label: "Variance", align: "right", render: (r) => <span className={varianceTone(r.contributionAchievedVariance)}>{formatINR(r.contributionAchievedVariance)}</span> },
              { key: "delivered", label: "Delivered", render: (r) => <span className="text-ink-soft">{r.deliveredAt ? formatDateTime(r.deliveredAt) : "—"}</span> },
            ]}
          />
          {!rows.length && <p className="p-4 text-sm text-ink-muted">No order lines match this filter.</p>}
        </Card>
      </div>
    </>
  );
}
