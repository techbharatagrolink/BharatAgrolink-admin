import { checkPermission } from "@/lib/auth/session";
import { getLogisticsDashboard, RANGES } from "@/lib/services/admin/dashboards";
import { formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { BarChart, HBarList } from "@/components/charts/charts";
import { MiniTable, RangeSwitch } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Logistics & Operations Dashboard" };

export default async function LogisticsDashboardPage({ searchParams }) {
  const { allowed } = await checkPermission("dashboard.logistics");
  if (!allowed) return (<><PageHeader title="Logistics & Operations Dashboard" /><PermissionDenied module="the logistics dashboard" /></>);
  const { range } = await searchParams;
  const d = await getLogisticsDashboard(range);
  return (
    <>
      <PageHeader
        title="Logistics & Operations Dashboard"
        description="Shipping queue, courier performance, NDR and RTO across NimbusPost, Shiprocket and Delhivery."
        actions={<RangeSwitch pathname="/admin/dashboards/logistics" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="Ready to ship" value={formatNumber(d.stats.readyToShip)} tone="warning" href="/admin/shipping" />
        <StatCard label="In transit" value={formatNumber(d.stats.inTransit)} tone="info" />
        <StatCard label="Open NDR" value={formatNumber(d.stats.ndrOpen)} tone="warning" href="/admin/operations/ndr" />
        <StatCard label="RTO rate" value={`${d.stats.rtoPct}%`} tone={d.stats.rtoPct > 10 ? "danger" : "neutral"} href="/admin/rto" />
        <StatCard label="Weight disputes" value={formatNumber(d.stats.weightDisputes)} href="/admin/shipping/weight-discrepancy" />
        <StatCard label="Open escalations" value={formatNumber(d.stats.escalations)} tone="danger" href="/admin/operations" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Shipments and RTO" />
          <CardBody>
            <BarChart data={d.trend} series={[{ key: "shipped", label: "Shipments" }, { key: "rto", label: "RTO", color: "var(--chart-4)" }]} label="Shipments and RTO" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Shipments by zone" />
          <CardBody>
            <HBarList data={d.byZone} format={formatNumber} />
          </CardBody>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Courier performance" description={d.period.label} />
        <MiniTable
          columns={[
            { key: "courier", label: "Courier" },
            { key: "shipments", label: "Shipments", align: "right", render: (r) => formatNumber(r.shipments) },
            { key: "delivered", label: "Delivered", align: "right", render: (r) => formatNumber(r.delivered) },
            { key: "deliveredPct", label: "Delivered %", align: "right", render: (r) => `${r.deliveredPct}%` },
            { key: "rto", label: "RTO", align: "right", render: (r) => formatNumber(r.rto) },
            { key: "rtoPct", label: "RTO %", align: "right", render: (r) => <span className={r.rtoPct > 10 ? "font-medium text-danger-ink" : undefined}>{r.rtoPct}%</span> },
          ]}
          rows={d.couriers}
        />
      </Card>
    </>
  );
}
