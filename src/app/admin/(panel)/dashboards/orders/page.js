import { checkPermission } from "@/lib/auth/session";
import { getOrdersDashboard, RANGES } from "@/lib/services/admin/dashboards";
import Link from "next/link";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart, DonutChart, HBarList } from "@/components/charts/charts";
import { RangeSwitch } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Order Management Dashboard" };

export default async function OrdersDashboardPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.orders");
  if (!allowed) return (<><PageHeader title="Order Management Dashboard" /><PermissionDenied module="the order dashboard" /></>);
  const { range } = await searchParams;
  const result = await getOrdersDashboard(range, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Order Management Dashboard" /><ApiUnavailable error={result.error} what="the order dashboard" /></>);
  const d = result.data;
  // Opens the same records as the main dashboard's status cards, for this page's date range.
  const statusHref = (drill) => `/admin/dashboard/order-status/${drill}?${new URLSearchParams({ from: d.statusFilters.from, to: d.statusFilters.to, type: "b2c" })}`;
  return (
    <>
      <PageHeader
        title="Order Management Dashboard"
        description="Order volume, fulfilment funnel and payment mix. Status figures are B2C sub-orders (one order + one seller), each in exactly one current status."
        actions={<RangeSwitch pathname="/admin/dashboards/orders" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="Orders (B2C)" value={formatNumber(d.stats.orders)} hint={`${formatNumber(d.stats.subOrders)} sub-orders`} href={statusHref("orders")} />
        <StatCard label="Order lines" value={formatNumber(d.stats.lines)} />
        <StatCard label="Order value" value={formatINR(d.stats.gmv, { compact: true })} />
        <StatCard label="Multi-vendor orders" value={formatNumber(d.stats.multiVendor)} tone="info" />
        <StatCard label="Placed (not manifested)" value={formatNumber(d.stats.awaitingAcceptance)} hint="Sub-orders" tone="warning" href={statusHref("placed")} />
        <StatCard label="Rejected + cancelled" value={formatNumber(d.stats.cancelled)} hint="Sub-orders" tone="danger" href={statusHref("unsuccessful")} />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Orders by payment mode" />
          <CardBody>
            <BarChart data={d.trend} stacked series={[{ key: "COD", label: "COD" }, { key: "Prepaid", label: "Prepaid" }, { key: "Partial", label: "Partial (advance)" }]} label="Orders by payment mode" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Current status" description="Sub-orders, each counted once" />
          <CardBody>
            <HBarList data={d.funnel} format={formatNumber} />
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {d.funnel.map((f) => (
                <li key={f.key}>
                  <Link href={statusHref(f.drill)} className="text-brand-700 hover:underline">{f.label} ({f.share})</Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Channel" />
          <CardBody>
            <DonutChart data={d.byChannel} label="Orders by channel" centerValue={formatNumber(d.stats.orders)} centerLabel="orders" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Payment mode" />
          <CardBody>
            <DonutChart data={d.byPayment} label="Orders by payment mode" centerValue={formatNumber(d.stats.orders)} centerLabel="orders" />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
