import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getOrderReport, getOrderReportVendors } from "@/lib/services/admin/orders-report";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";
import { OrderReportTable } from "@/components/admin/orders/order-report-table";

export const metadata = { title: "Order Reports" };

const TITLE = "Order Reports";
const DESCRIPTION = "Delivered B2C and B2B lines with tax, commission, NRV, BSA and service charge. Blank override fields clear a manual value.";
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
    { name: "orderId", label: "Order ID", type: "search", placeholder: "Order ID" },
    { name: "vendorId", label: "Vendor", type: "select", placeholder: "All vendors", options: result.vendors },
    { name: "from", label: "From", type: "date" },
    { name: "to", label: "To", type: "date" },
    { name: "month", label: "Month", type: "month" },
    { name: "cycle", label: "Cycle", type: "select", placeholder: "Full month", options: [{ value: "first", label: "1–15" }, { value: "second", label: "16–end" }] },
    { name: "pageSize", label: "Per page", type: "select", options: ["25", "50", "100", "200"].map((value) => ({ value, label: value })), defaultValue: "50" },
  ];

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <StatGrid className="xl:grid-cols-6">
          <StatCard label="Orders" value={formatNumber(summary.orders)} />
          <StatCard label="Quantity" value={formatNumber(summary.qty)} />
          <StatCard label="Vendors" value={formatNumber(summary.vendors)} />
          <StatCard label="Gross" value={formatINR(summary.gross)} />
          <StatCard label="Taxable" value={formatINR(summary.taxable)} />
          <StatCard label="GST" value={formatINR(summary.gst)} hint={`CGST ${formatINR(summary.cgst)} · SGST ${formatINR(summary.sgst)} · IGST ${formatINR(summary.igst)}`} />
          <StatCard label="TCS" value={formatINR(summary.tcs)} />
          <StatCard label="Shipping" value={formatINR(summary.shipping)} />
          <StatCard label="BSA" value={formatINR(summary.bsa)} />
          <StatCard label="Service excl. GST" value={formatINR(summary.serviceExcl)} />
          <StatCard label="Service GST" value={formatINR(summary.serviceGst)} />
          <StatCard label="Service incl. GST" value={formatINR(summary.serviceIncl)} />
        </StatGrid>
        <QueryFilters fields={fields} />
        <OrderReportTable report={result.report} filters={filters} canEdit={can(user, "orders.transactions", "edit")} />
      </div>
    </>
  );
}
