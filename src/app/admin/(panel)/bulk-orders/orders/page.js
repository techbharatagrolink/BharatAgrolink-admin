import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkOrders } from "@/lib/services/admin/parity/bulk";
import { formatNumber, inr } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkFilters } from "@/components/admin/parity/bulk/bulk-list";
import { BulkOrdersTable } from "@/components/admin/parity/bulk/orders-table";

export const metadata = { title: "All Bulk Orders" };

const TITLE = "All Orders";
const DESCRIPTION = "Bulk (B2B cargo) orders created from quotations or the create-order form. Newest first, up to 2000 rows.";
const STATUSES = ["created", "confirmed", "processing", "shipped", "delivered", "cancelled", "rejected", "returned", "rto"];
const YMD = /^\d{4}-\d{2}-\d{2}$/;

function readQuery(sp) {
  const text = (v, max = 100) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const page = Number.parseInt(text(sp.page), 10);
  const pageSize = Number.parseInt(text(sp.pageSize), 10);
  return {
    orderId: text(sp.orderId),
    customer: text(sp.customer),
    status: STATUSES.includes(text(sp.status)) ? text(sp.status) : "",
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
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="bulk orders" /></>);
  const s = result.stats;
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <StatGrid>
          <StatCard label="Total Orders" value={formatNumber(s.total)} />
          <StatCard label="Pending" value={formatNumber(s.pending)} tone="warning" />
          <StatCard label="Approved" value={formatNumber(s.approved)} tone="info" />
          <StatCard label="Processing" value={formatNumber(s.processing)} tone="info" />
          <StatCard label="Dispatched" value={formatNumber(s.dispatched)} tone="info" />
          <StatCard label="Delivered" value={formatNumber(s.delivered)} />
          <StatCard label="Cancelled" value={formatNumber(s.cancelled)} tone="danger" />
          <StatCard label="Total Revenue" value={inr(s.total_revenue)} />
        </StatGrid>
        <BulkFilters
          key={JSON.stringify(query)}
          values={query}
          fields={[
            { key: "orderId", label: "Order ID", placeholder: "BAL-B2B-…" },
            { key: "customer", label: "Customer", placeholder: "Customer name" },
            { key: "status", label: "Status", type: "select", options: STATUSES.map((v) => ({ value: v, label: v.toUpperCase() === "RTO" ? "RTO" : v[0].toUpperCase() + v.slice(1) })) },
            { key: "from", label: "From", type: "date" },
            { key: "to", label: "To", type: "date" },
          ]}
        />
        <BulkOrdersTable result={result} query={query} canDelete={can(user, "bulk.orders", "delete")} />
      </div>
    </>
  );
}
