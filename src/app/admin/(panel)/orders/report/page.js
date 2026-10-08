import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getOrderReport, getOrderReportVendors } from "@/lib/services/admin/orders-report";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";
import { OrderReportTable } from "@/components/admin/orders/order-report-table";

export const metadata = { title: "Order Reports" };

const TITLE = "Finance Report — Delivered Orders";
const DESCRIPTION = "Financial analysis based on delivered items only. Blank override fields clear a manual value.";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const SIZES = new Set(["25", "50", "100", "200"]);

function readFilters(sp) {
  const filters = {};
  if (typeof sp?.orderId === "string" && sp.orderId.trim()) filters.orderId = sp.orderId.trim().slice(0, 80);
  if (typeof sp?.vendorId === "string" && sp.vendorId.trim()) filters.vendorId = sp.vendorId.trim().slice(0, 100);
  if (DATE.test(sp?.from ?? "")) filters.from = sp.from;
  if (DATE.test(sp?.to ?? "")) filters.to = sp.to;
  if (sp?.cycle === "first" || sp?.cycle === "second") filters.cycle = sp.cycle;
  if (MONTH.test(sp?.month ?? "")) filters.month = sp.month;
  filters.page = /^\d+$/.test(sp?.page ?? "") && Number(sp.page) > 0 ? Number(sp.page) : 1;
  filters.pageSize = SIZES.has(sp?.pageSize) ? Number(sp.pageSize) : 50;
  return filters;
}

export default async function OrderReportPage({ searchParams }) {
  const { user, allowed } = await checkPermission("orders.transactions");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="order reports" /></>);
  const filters = readFilters(await searchParams);
  const result = await Promise.all([getOrderReport(filters, user), getOrderReportVendors(user)]).then(([report, vendors]) => ({ report, vendors }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="the order report" /></>);
  const { summary } = result.report;
  const fields = [
    { name: "orderId", label: "Order ID", type: "search", placeholder: "Search Order ID" },
    { name: "from", label: "From", type: "date" },
    { name: "to", label: "To", type: "date" },
    { name: "cycle", label: "Cycle", type: "select", placeholder: "All cycles", options: [{ value: "first", label: "First cycle (1–15)" }, { value: "second", label: "Second cycle (16–31)" }] },
    { name: "month", label: "Month", type: "month" },
    { name: "vendorId", label: "Vendor", type: "select", placeholder: "All vendors", options: result.vendors },
    { name: "pageSize", label: "Per page", type: "select", options: ["25", "50", "100", "200"].map((value) => ({ value, label: value })), defaultValue: "50" },
  ];

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <StatGrid className="xl:grid-cols-5">
          <StatCard label="Total Delivered Orders" value={formatNumber(summary.orders)} tone="info" />
          <StatCard label="Total Revenue" value={formatINR(summary.gross)} />
          <StatCard label="Total Products Sold" value={formatNumber(summary.qty)} tone="info" />
          <StatCard label="Total Vendors" value={formatNumber(summary.vendors)} tone="warning" />
          <StatCard label="Total Exclusive GST Amount" value={formatINR(summary.taxable)} />
          <StatCard label="Total GST" value={formatINR(summary.gst)} hint="CGST + SGST + IGST" />
          <StatCard label="CGST" value={formatINR(summary.cgst)} hint="Central GST" />
          <StatCard label="SGST" value={formatINR(summary.sgst)} hint="State GST" />
          <StatCard label="IGST" value={formatINR(summary.igst)} tone="info" hint="Integrated GST" />
          <StatCard label="TCS" value={formatINR(summary.tcs)} tone="warning" hint="Tax collected" />
          <StatCard label="Total BSA" value={formatINR(summary.bsa)} hint="Vendor settlement base" />
          <StatCard label="Service Charge (Excl. GST)" value={formatINR(summary.serviceExcl)} hint="(Order − BSA − TCS) ÷ 1.18" />
          <StatCard label="Service GST (18%)" value={formatINR(summary.serviceGst)} tone="info" hint="GST on service charge" />
          <StatCard label="Service Charge (Incl. GST)" value={formatINR(summary.serviceIncl)} hint="Excl. GST + service GST" />
          <StatCard label="Total Shipping" value={formatINR(summary.shipping)} tone="info" hint="Shipping charges (Shiprocket)" />
        </StatGrid>
        <QueryFilters fields={fields} />
        <OrderReportTable report={result.report} filters={filters} canEdit={can(user, "orders.transactions", "edit")} />
      </div>
    </>
  );
}
