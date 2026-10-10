import { checkPermission } from "@/lib/auth/session";
import { getBulkDashboard } from "@/lib/services/admin/parity/bulk";
import { formatNumber, formatPercent, inr } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart, DonutChart, LineChart } from "@/components/charts/interactive";
import { BulkFilters } from "@/components/admin/parity/bulk/bulk-list";

export const metadata = { title: "Bulk Order Dashboard" };

const TITLE = "Bulk Order Dashboard";
const DESCRIPTION = "Shipments, revenue and delivery rate of bulk orders. Changes compare with the previous period of the same length.";
const YMD = /^\d{4}-\d{2}-\d{2}$/;

export default async function BulkDashboardPage({ searchParams }) {
  const { user, allowed } = await checkPermission("bulk.dashboard");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the bulk order dashboard" /></>);
  const sp = await searchParams;
  const range = { from: YMD.test(sp.from ?? "") ? sp.from : "", to: YMD.test(sp.to ?? "") ? sp.to : "" };
  const data = await getBulkDashboard(range, user).catch((error) => ({ error }));
  if (data.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={data.error} what="the bulk order dashboard" /></>);
  const k = data.keyMetrics;
  const period = range.from || range.to ? `${data.from} to ${data.to}` : "All time";
  const trend = data.trend.map((d) => ({ label: d.date.slice(5), count: d.count, revenue: d.revenue }));

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} meta={<Badge tone="neutral">{period}</Badge>} />
      <div className="space-y-4">
        <BulkFilters key={JSON.stringify(range)} values={range} fields={[{ key: "from", label: "From", type: "date" }, { key: "to", label: "To", type: "date" }]} />
        <StatGrid>
          <StatCard label="Total Orders" value={formatNumber(k.totalOrders)} delta={k.ordersChange} href="/admin/bulk-orders/orders" />
          <StatCard label="Shipments" value={formatNumber(k.totalShipments)} delta={k.shipmentsChange} href="/admin/bulk-orders/shipments" tone="info" />
          <StatCard label="Revenue" value={inr(k.totalRevenue)} delta={k.revenueChange} />
          <StatCard label="Delivery Rate" value={formatPercent(k.deliveryRate)} delta={k.deliveryChange} />
        </StatGrid>
        <Card>
          <CardHeader title="Shipments trend" description="Last 30 days of the period" />
          <CardBody>
            <LineChart
              data={trend}
              label="Shipments and revenue per day"
              series={[
                { key: "count", label: "Shipments" },
                { key: "revenue", label: "Revenue (₹)", format: "inr" },
              ]}
            />
          </CardBody>
        </Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader title="Status distribution" />
            <CardBody className="flex justify-center">
              <DonutChart data={data.statusDistribution} label="Shipments by status" centerLabel="Shipments" centerValue={formatNumber(k.totalShipments)} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Shipping mode" />
            <CardBody>
              <BarChart data={data.modeDistribution.map((m) => ({ label: m.label, value: m.value }))} series={[{ key: "value", label: "Shipments" }]} label="Shipments by mode" height={180} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Top pickup warehouses" />
            <CardBody>
              {data.topWarehouses.length === 0 ? (
                <p className="text-sm text-ink-muted">No shipments in this period.</p>
              ) : (
                <ol className="space-y-2 text-sm">
                  {data.topWarehouses.map((w) => (
                    <li key={w.name} className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-ink" title={w.name}>
                        {w.name}
                      </span>
                      <span className="shrink-0 font-medium tabular">{formatNumber(w.count)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
