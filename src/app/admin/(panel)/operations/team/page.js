import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getOperationsTeam } from "@/lib/services/admin/insights";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { PermissionDenied } from "@/components/ui/states";
import { LineChart } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { KpiTargets } from "@/components/admin/dashboard/kpi-targets";
import { cn } from "@/lib/utils";

export const metadata = { title: "Team Dashboard" };

const pctCell = (v, good = 90) => <span className={cn("tabular", v < good - 15 ? "text-danger-ink" : v < good ? "text-warning-ink" : "text-success-ink")}>{v}%</span>;

const YMD = /^\d{4}-\d{2}-\d{2}$/;
/** The "Show" choices of the daily trend on operations_team/dashboard.php (default 90 days). */
const TREND_PERIODS = [
  { value: "30", label: "Last 30 Days" },
  { value: "60", label: "Last 60 Days" },
  { value: "90", label: "Last 90 Days" },
  { value: "180", label: "Last 6 Months" },
  { value: "365", label: "Last 1 Year" },
];
const STATUS_TONE = { Critical: "danger", Warning: "warning", Good: "success" };

const istDate = (date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
const pct = (v) => `${(Number(v) || 0).toFixed(1)}%`;

/** dashboard.php defaults: last 7 days, trend over the last 90 days. */
function filtersFrom(params) {
  const one = (key) => (Array.isArray(params?.[key]) ? params[key][0] : params?.[key]);
  const from = YMD.test(one("from") ?? "") ? one("from") : istDate(new Date(Date.now() - 7 * 86400000));
  const to = YMD.test(one("to") ?? "") ? one("to") : istDate(new Date());
  const days = TREND_PERIODS.some((p) => p.value === one("days")) ? one("days") : "90";
  return { from, to, days };
}

export default async function OperationsTeamPage({ searchParams }) {
  const { user, allowed } = await checkPermission("operations.team");
  if (!allowed) return (<><PageHeader title="Team Dashboard" /><PermissionDenied module="the operations team" /></>);
  const filters = filtersFrom(await searchParams);
  const header = <PageHeader title="Team Dashboard" description="Workload and KPI performance per operations agent." />;
  const filterForm = (
    <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-4">
      <div className="w-44 space-y-1.5">
        <label htmlFor="team-from" className="block text-[13px] font-medium text-ink-soft">
          From Date
        </label>
        <Input id="team-from" type="date" name="from" defaultValue={filters.from} required />
      </div>
      <div className="w-44 space-y-1.5">
        <label htmlFor="team-to" className="block text-[13px] font-medium text-ink-soft">
          To Date
        </label>
        <Input id="team-to" type="date" name="to" defaultValue={filters.to} required />
      </div>
      <div className="w-44 space-y-1.5">
        <label htmlFor="team-days" className="block text-[13px] font-medium text-ink-soft">
          Daily Trend
        </label>
        <Select id="team-days" name="days" defaultValue={filters.days} options={TREND_PERIODS} />
      </div>
      <Button type="submit" variant="primary">
        Load Dashboard
      </Button>
    </form>
  );
  if (filters.from > filters.to) {
    return (<>{header}{filterForm}<Notice tone="warning">From date cannot be greater than To date.</Notice></>);
  }
  const d = await getOperationsTeam(user, filters);
  const s = d.stats;
  const summary = d.summary;
  const trendLabel = TREND_PERIODS.find((p) => p.value === filters.days).label;

  return (
    <>
      {header}
      {filterForm}
      <StatGrid>
        <StatCard label="Active agents" value={s.agents} tone="neutral" />
        <StatCard label="Open order lines" value={s.open} href="/admin/operations/team/assignments" />
        <StatCard label="SLA breached" value={s.breached} tone="danger" href="/admin/operations/team/assignments?slaState=Breached" />
        <StatCard label="Avg confirmation" value={`${s.avgConfirmed}%`} tone="info" />
        <StatCard label="Calls made" value={s.calls} tone="neutral" href="/admin/operations/recordings" />
        <StatCard label="Unassigned" value={s.unassigned} tone={s.unassigned ? "warning" : "brand"} />
        <StatCard label="Total orders assigned" value={summary.totalAssigned} hint="Invoice items" tone="neutral" />
        <StatCard label="KPI achievement" value={pct(summary.kpiAchievement.pct)} hint={summary.kpiAchievement.label} tone="info" />
        <StatCard label="Revenue generated" value={formatINR(Math.round(summary.revenue))} hint="From delivered orders" />
        <StatCard label="Delivered items" value={summary.delivered} hint={`${pct(summary.deliveryRate)} delivery rate`} />
        <StatCard label="SLA breaches (>48h)" value={summary.slaBreached} hint="Needs immediate dispatch" tone="danger" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Agent performance" actions={<Link href="/admin/operations/team/agents" className="text-[13px] font-medium text-brand-700 hover:underline">Agent-wise report</Link>} />
          <MiniTable
            columns={[
              { key: "name", label: "Agent", render: (r) => <Link href={`/admin/operations/team/assignments?agent=${encodeURIComponent(r.name)}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link> },
              { key: "assigned", label: "Assigned", align: "right" },
              { key: "open", label: "Open", align: "right" },
              { key: "breached", label: "Breached", align: "right", render: (r) => <span className={r.breached ? "font-medium text-danger-ink" : ""}>{r.breached}</span> },
              { key: "confirmedPct", label: "Confirmed", align: "right", render: (r) => pctCell(r.confirmedPct, 95) },
              { key: "dispatch24Pct", label: "Dispatch 24h", align: "right", render: (r) => pctCell(r.dispatch24Pct, 95) },
              { key: "ndrResolutionPct", label: "NDR resolved", align: "right", render: (r) => pctCell(r.ndrResolutionPct, 90) },
              { key: "escalations", label: "Escalations", align: "right" },
            ]}
            rows={d.agents}
          />
        </Card>
        <Card>
          <CardHeader title="Team KPI targets" actions={<Link href="/admin/operations/team/setup" className="text-[13px] font-medium text-brand-700 hover:underline">Setup</Link>} />
          <CardBody><KpiTargets rows={d.kpiTargets} /></CardBody>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Order funnel" description="Selected date range" />
          <MiniTable
            columns={[
              { key: "label", label: "Stage", render: (r) => <span className="font-medium text-ink">{r.label}</span> },
              { key: "value", label: "Count", align: "right", render: (r) => formatNumber(r.value) },
            ]}
            rows={d.funnel}
          />
        </Card>
        <Card>
          <CardHeader title="KPI health" description="Selected date range" />
          <MiniTable
            empty="No KPI targets are configured."
            columns={[
              { key: "name", label: "Metric", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
              { key: "actual", label: "Actual", align: "right", render: (r) => pct(r.actual) },
              { key: "target", label: "Target", align: "right", render: (r) => pct(r.target) },
              { key: "kri", label: "KRI", align: "right", render: (r) => pct(r.kri) },
              { key: "status", label: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
            ]}
            rows={d.kpiHealth}
          />
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Daily trend" description={trendLabel} />
        <CardBody>
          <LineChart
            data={[...d.trend].reverse()}
            series={[
              { key: "orders", label: "Orders Assigned" },
              { key: "delivered", label: "Delivered" },
              { key: "rtoPct", label: "RTO %" },
            ]}
            label="Daily orders assigned, delivered and RTO %"
          />
        </CardBody>
        <div className="max-h-[400px] overflow-y-auto border-t border-line scrollbar-thin">
          <MiniTable
            empty="No data available"
            columns={[
              { key: "label", label: "Date" },
              { key: "orders", label: "Orders", align: "right" },
              { key: "rtoPct", label: "RTO %", align: "right", render: (r) => (r.rtoPct ? pct(r.rtoPct) : "0%") },
              { key: "delivered", label: "Delivered", align: "right" },
            ]}
            rows={d.trend.map((t) => ({ ...t, id: t.date }))}
          />
        </div>
      </Card>
    </>
  );
}
