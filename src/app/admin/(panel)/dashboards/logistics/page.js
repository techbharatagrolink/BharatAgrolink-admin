import { checkPermission } from "@/lib/auth/session";
import { getLogisticsDashboard, RANGES } from "@/lib/services/admin/dashboards";
import { formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart, HBarList } from "@/components/charts/charts";
import { MiniTable, RangeSwitch } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Logistics & Operations Dashboard" };

export default async function LogisticsDashboardPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.logistics");
  if (!allowed) return (<><PageHeader title="Logistics & Operations Dashboard" /><PermissionDenied module="the logistics dashboard" /></>);
  const { range } = await searchParams;
  const result = await getLogisticsDashboard(range, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Logistics & Operations Dashboard" /><ApiUnavailable error={result.error} what="the logistics dashboard" /></>);
  const d = result.data;
  // Opens the same records as the main dashboard's cards, for this page's date range.
  const statusHref = (drill) => `/admin/dashboard/order-status/${drill}?${new URLSearchParams({ from: d.filters.from, to: d.filters.to, type: "b2c" })}`;
  const pct = (v) => (v == null ? "N/A" : `${v}%`);
  return (
    <>
      <PageHeader
        title="Logistics & Operations Dashboard"
        description="Shipping queue, courier performance, NDR and RTO. Figures are B2C sub-orders by order date, the same as the main dashboard; RTO rate = RTO ÷ (Delivered + RTO)."
        actions={<RangeSwitch pathname="/admin/dashboards/logistics" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="Ready to ship" value={formatNumber(d.stats.readyToShip)} tone="warning" href="/admin/shipping" />
        <StatCard label="In transit" value={formatNumber(d.stats.inTransit)} hint={`+ ${formatNumber(d.stats.outForDelivery)} out for delivery`} tone="info" href={statusHref("in-transit")} />
        <StatCard label="Open NDR" value={formatNumber(d.stats.ndrOpen)} tone="warning" href="/admin/operations/ndr" />
        <StatCard label="RTO rate" value={pct(d.stats.rtoPct)} hint={`${formatNumber(d.stats.rto)} RTO ÷ (${formatNumber(d.stats.delivered)} delivered + RTO)`} tone={d.stats.rtoPct > 10 ? "danger" : "neutral"} href={statusHref("final-rto")} />
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
          <CardHeader title="Sub-orders by zone" />
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
            { key: "shipments", label: "Sub-orders", align: "right", render: (r) => formatNumber(r.shipments) },
            { key: "delivered", label: "Delivered", align: "right", render: (r) => formatNumber(r.delivered) },
            { key: "deliveredPct", label: "Final delivery %", align: "right", render: (r) => pct(r.deliveredPct) },
            { key: "rto", label: "RTO", align: "right", render: (r) => formatNumber(r.rto) },
            { key: "rtoPct", label: "RTO rate", align: "right", render: (r) => <span className={r.rtoPct > 10 ? "font-medium text-danger-ink" : undefined}>{pct(r.rtoPct)}</span> },
          ]}
          rows={d.couriers}
        />
      </Card>
    </>
  );
}
