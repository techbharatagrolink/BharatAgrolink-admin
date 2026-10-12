import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkOrders } from "@/lib/services/admin/parity/bulk";
import { formatNumber, inr } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkFilters } from "@/components/admin/parity/bulk/bulk-list";
import { BulkOrdersTable } from "@/components/admin/parity/bulk/orders-table";

export const metadata = { title: "All Bulk Orders" };

const TITLE = "All Orders";
const DESCRIPTION = "Bulk orders from the cargo desk. Newest first, up to 2000 rows.";
/** orders.php filter + dashboard cards. Values are matched case-insensitively by the API. */
const STATUSES = [
  { value: "created", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "processing", label: "Processing" },
  { value: "Shipped", label: "Dispatched" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];
const STATUS_VALUES = new Set(STATUSES.map((status) => status.value));
const YMD = /^\d{4}-\d{2}-\d{2}$/;

function readQuery(sp) {
  const text = (v, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const page = Number.parseInt(text(sp.page), 10);
  const pageSize = Number.parseInt(text(sp.pageSize), 10);
  return {
    orderId: text(sp.orderId),
    customer: text(sp.customer),
    status: STATUS_VALUES.has(text(sp.status)) ? text(sp.status) : "",
    from: YMD.test(text(sp.from)) ? text(sp.from) : "",
    to: YMD.test(text(sp.to)) ? text(sp.to) : "",
    page: page > 0 ? String(page) : "",
    pageSize: [25, 50, 100].includes(pageSize) ? String(pageSize) : "",
  };
}

export default async function BulkOrdersPage({ searchParams }) {
  const { user, allowed } = await checkPermission("bulk.orders");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="bulk orders" /></>);
  const query = readQuery(await searchParams);
  const result = await getBulkOrders(query, user).catch((error) => ({ error }));
  if (!result || result.error || !result.stats || !Array.isArray(result.rows)) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result?.error} what="bulk orders" /></>);
  }
  const s = result.stats;
  const statusHref = (status) => (status ? `/admin/bulk-orders/orders?status=${encodeURIComponent(status)}` : "/admin/bulk-orders/orders");
  return (
    <>
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        actions={
          <>
            <Link href="/admin/bulk-orders/shipments" className={buttonClasses({ size: "sm" })}>Shipments</Link>
            <Link href="/admin/bulk-orders/quotations" className={buttonClasses({ size: "sm" })}>Quotations</Link>
          </>
        }
      />
      <div className="space-y-4">
        <StatGrid>
          <StatCard label="Total Bulk Orders" value={formatNumber(s.total)} href={statusHref("")} />
          <StatCard label="Pending Orders" value={formatNumber(s.pending)} tone="warning" href={statusHref("created")} />
          <StatCard label="Approved Orders" value={formatNumber(s.approved)} tone="info" href={statusHref("approved")} />
          <StatCard label="Processing Orders" value={formatNumber(s.processing)} tone="info" href={statusHref("processing")} />
          <StatCard label="Dispatched Orders" value={formatNumber(s.dispatched)} tone="info" href={statusHref("Shipped")} />
          <StatCard label="Delivered Orders" value={formatNumber(s.delivered)} href={statusHref("Delivered")} />
          <StatCard label="Cancelled Orders" value={formatNumber(s.cancelled)} tone="danger" href={statusHref("Cancelled")} />
          <StatCard label="Total Revenue" value={inr(s.total_revenue)} />
        </StatGrid>
        <BulkFilters
          key={JSON.stringify(query)}
          values={query}
          fields={[
            { key: "orderId", label: "Bulk Order ID", placeholder: "Search Order ID" },
            { key: "customer", label: "Customer Name", placeholder: "Customer Name" },
            { key: "status", label: "Order Status", type: "select", all: "All Status", options: STATUSES },
            { key: "from", label: "From Date", type: "date" },
            { key: "to", label: "To Date", type: "date" },
          ]}
        />
        <BulkOrdersTable result={result} query={query} canEdit={can(user, "bulk.orders", "edit")} canDelete={can(user, "bulk.orders", "delete")} />
      </div>
    </>
  );
}
