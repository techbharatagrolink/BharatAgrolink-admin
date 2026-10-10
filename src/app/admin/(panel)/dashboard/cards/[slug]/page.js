import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { ApiError } from "@/lib/api";
import { dashboardFilterHref, getDashboardCard } from "@/lib/services/admin/main-dashboard";
import { PageHeader } from "@/components/ui/page";
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

  const allowOrders = can(user, "orders");
  const allowB2B = can(user, "b2b.orders");

  return (
    <>
      <PageHeader
        title={data.title}
        description={data.period}
        actions={<ButtonLink href={dashboardFilterHref("/admin/dashboard", query)} variant="secondary" size="sm">Back to dashboard</ButtonLink>}
      />
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
