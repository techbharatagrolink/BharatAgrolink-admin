import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can, canPage } from "@/lib/auth/permissions";
import { dashboardFilterHref, getMainDashboard } from "@/lib/services/admin/main-dashboard";
import { BUCKET_DRILL, DRILLS, getOrderStatusList, orderStatusExportHref, snapshotHash } from "@/lib/services/admin/order-status";
import { formatDateTime, formatNumber } from "@/lib/format";
import { Notice, PageHeader, StatCard } from "@/components/ui/page";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { DataTable } from "@/components/data-table/data-table";
import { DashboardFilters } from "@/components/admin/dashboard/dashboard-filters";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [20, 25, 50, 100];
const BUCKET_TABS = ["P", "M", "I", "O", "D", "J", "C", "R", "U"];
const TAB_LABELS = { P: "Placed", M: "Manifested", I: "In Transit", O: "Out for Delivery", D: "Delivered", J: "Rejected", C: "Cancelled", R: "RTO", U: "Unmapped" };

export async function generateMetadata() {
  return { title: "Order status records" };
}

function columnsOf(columns) {
  return columns.map((c) => {
    const col = { key: c.key, label: c.label, align: c.align, wrap: ["rawStatuses", "seller", "sellers", "statuses", "awb"].includes(c.key) };
    if (c.key === "orderId") {
      col.type = "mono";
      col.href = "{orderHref}";
    } else if (c.key === "subOrderId" || c.key === "awb" || c.key === "sellerId") col.type = "mono";
    else if (c.key === "status") col.type = "status";
    else if (c.kind === "datetime") col.type = "datetime";
    else if (c.align === "right") col.type = "number";
    return col;
  });
}

export default async function OrderStatusListPage({ params, searchParams }) {
  const { drill } = await params;
  if (!DRILLS[drill]) notFound();
  const query = await searchParams;
  const { user, allowed } = await checkPermission("dashboard.main");
  if (!allowed || !canPage(user, "#dashboard_orders_overview")) {
    return (
      <>
        <PageHeader title="Order status records" />
        <PermissionDenied module={!allowed ? "the main dashboard" : "the orders overview"} />
      </>
    );
  }

  const dashboardPromise = getMainDashboard(query, user).catch(() => null);
  let data;
  try {
    data = await getOrderStatusList(drill, query, user);
  } catch (error) {
    return (
      <>
        <PageHeader title="Order status records" />
        <ApiUnavailable error={error} what="these order status records" />
      </>
    );
  }
  const dashboard = await dashboardPromise;
  const back = dashboardFilterHref("/admin/dashboard", query);

  if (!data.applicable) {
    return (
      <>
        <PageHeader title="Order status records" actions={<ButtonLink href={back} variant="secondary" size="sm">Back to dashboard</ButtonLink>} />
        {dashboard?.filters && <DashboardFilters values={dashboard.filters.values} options={dashboard.filters.options} label={dashboard.filters.label} />}
        <Notice tone="info" title="B2C sub-orders only">{data.reason}</Notice>
      </>
    );
  }

  const d = data.drill;
  const superAdmin = Boolean(user?.role?.superAdmin);
  const allowOrders = can(user, "orders");
  // The dashboard passes its snapshot hash; a different hash means the data changed since the cards were read.
  const fromSnap = String(query?.snap || "");
  const changed = fromSnap && fromSnap !== snapshotHash(data.snapshot.id);
  const tabHref = (seg) => dashboardFilterHref(`/admin/dashboard/order-status/${seg}`, query);
  const isOrders = d.view === "orders";

  return (
    <>
      <PageHeader
        title={d.title}
        description={`${data.filters.label} · ${isOrders ? "parent orders" : "sub-orders"} · ${data.filters.cohort}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {superAdmin && (
              <>
                {/* Plain links: these are file downloads from a route handler, not pages. */}
                <a href={orderStatusExportHref(drill, query, "xlsx")} className={buttonClasses({ variant: "secondary", size: "sm" })}>Export XLSX</a>
                <a href={orderStatusExportHref(drill, query, "csv")} className={buttonClasses({ variant: "secondary", size: "sm" })}>Export CSV</a>
              </>
            )}
            <ButtonLink href={back} variant="secondary" size="sm">Back to dashboard</ButtonLink>
          </div>
        }
      />
      {dashboard?.filters && <DashboardFilters values={dashboard.filters.values} options={dashboard.filters.options} label={dashboard.filters.label} />}
      {changed && (
        <Notice tone="warning" title="Data changed since the dashboard loaded" className="mb-4">
          These records are as of {formatDateTime(data.snapshot.asOf)}. Go back to the dashboard to refresh its cards so both show the same snapshot.
        </Notice>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={isOrders ? "Parent orders" : "Records"} value={formatNumber(data.total)} hint={`Formula: ${d.formula}`} tone="brand" />
        {d.denominator && <StatCard label={`Denominator (${d.denominator.label})`} value={formatNumber(d.denominator.value)} hint="Rate context for these records" tone="neutral" />}
        {d.denominator && (
          <StatCard
            label="Share"
            value={d.denominator.value > 0 ? `${((data.total / d.denominator.value) * 100).toFixed(2)}%` : "N/A"}
            hint={`${formatNumber(data.total)} ÷ ${formatNumber(d.denominator.value)}`}
            tone="info"
          />
        )}
        <StatCard label="Snapshot" value={formatDateTime(data.snapshot.asOf)} hint={`Snapshot ${snapshotHash(data.snapshot.id)}`} tone="neutral" />
      </div>

      {!isOrders && (
        <nav aria-label="Status" className="mb-3 flex flex-wrap gap-1.5">
          {[["total", "All"], ...BUCKET_TABS.map((k) => [BUCKET_DRILL[k], TAB_LABELS[k]])].map(([seg, label]) => (
            <Link
              key={seg}
              href={tabHref(seg)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                seg === drill ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line text-ink-soft hover:border-brand-400 hover:text-brand-700"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      <DataTable
        id={`order-status-${drill}`}
        rowKey="rowKey"
        columns={columnsOf(data.columns)}
        pageSizes={PAGE_SIZES}
        selectable={superAdmin}
        search={isOrders ? "Search order ID, seller, AWB, invoice..." : "Search sub-order / order ID, seller, AWB, invoice..."}
        emptyTitle="No records for these filters."
        emptyDescription="Try another period, seller or status."
        data={{
          rows: data.rows.map((row, i) => ({
            ...row,
            rowKey: `${row.subOrderId ?? row.orderId}-${i}`,
            orderHref: allowOrders && row.orderId ? `/admin/orders/${encodeURIComponent(row.orderId)}` : "",
          })),
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          pageCount: Math.max(1, Math.ceil(data.total / data.pageSize)),
        }}
      />
    </>
  );
}
