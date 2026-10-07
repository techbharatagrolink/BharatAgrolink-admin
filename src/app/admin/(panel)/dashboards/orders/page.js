import { checkPermission } from "@/lib/auth/session";
import { getOrdersDashboard, RANGES } from "@/lib/services/admin/dashboards";
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
  return (
    <>
      <PageHeader
        title="Order Management Dashboard"
        description="Order volume, fulfilment funnel and payment mix. Statuses are tracked per order line (vendor invoice)."
        actions={<RangeSwitch pathname="/admin/dashboards/orders" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="Orders" value={formatNumber(d.stats.orders)} href="/admin/orders" />
        <StatCard label="Order lines" value={formatNumber(d.stats.lines)} />
        <StatCard label="Order value" value={formatINR(d.stats.gmv, { compact: true })} />
        <StatCard label="Multi-vendor orders" value={formatNumber(d.stats.multiVendor)} tone="info" />
        <StatCard label="Awaiting vendor acceptance" value={formatNumber(d.stats.awaitingAcceptance)} tone="warning" href="/admin/orders?status=Placed" />
        <StatCard label="Cancelled / rejected lines" value={formatNumber(d.stats.cancelled)} tone="danger" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Orders by payment mode" />
          <CardBody>
            <BarChart data={d.trend} stacked series={[{ key: "COD", label: "COD" }, { key: "Prepaid", label: "Prepaid" }, { key: "Partial", label: "Partial (advance)" }]} label="Orders by payment mode" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Fulfilment funnel" description="Order lines by stage" />
          <CardBody>
            <HBarList data={d.funnel} format={formatNumber} />
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
