import { checkPermission } from "@/lib/auth/session";
import { getOverallReport } from "@/lib/services/admin/parity/ops";
import { formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { OverallExport } from "@/components/admin/parity/ops/overall-export";

export const metadata = { title: "Operations Overall Report" };

const TITLE = "Operations Overall Report";
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STATUS_TONE = { Critical: "danger", Warning: "warning", Good: "success" };

const istDate = (date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
const pct = (v) => `${(Number(v) || 0).toFixed(1)}%`;
const dmy = (ymd) => {
  const [y, m, d] = String(ymd).split("-");
  return MONTHS[Number(m) - 1] ? `${d}-${MONTHS[Number(m) - 1]}-${y}` : String(ymd);
};

function range(params) {
  const one = (key) => (Array.isArray(params?.[key]) ? params[key][0] : params?.[key]);
  const today = istDate(new Date());
  const from = YMD.test(one("from") ?? "") ? one("from") : istDate(new Date(Date.now() - 30 * 86400000));
  const to = YMD.test(one("to") ?? "") ? one("to") : today;
  return { from, to };
}

export default async function OperationsOverallPage({ searchParams }) {
  const { user, allowed } = await checkPermission("operations.overall");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the operations overall report" /></>);
  const { from, to } = range(await searchParams);
  const header = (
    <PageHeader
      title={TITLE}
      description="Team-wide confirmation, verification and RTO performance against KPI targets."
      actions={<OverallExport from={from} to={to} />}
    />
  );
  const filters = (
    <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-4">
      <div className="w-44 space-y-1.5">
        <label htmlFor="overall-from" className="block text-[13px] font-medium text-ink-soft">
          From Date
        </label>
        <Input id="overall-from" type="date" name="from" defaultValue={from} required />
      </div>
      <div className="w-44 space-y-1.5">
        <label htmlFor="overall-to" className="block text-[13px] font-medium text-ink-soft">
          To Date
        </label>
        <Input id="overall-to" type="date" name="to" defaultValue={to} required />
      </div>
      <Button type="submit" variant="primary">
        Load Report
      </Button>
    </form>
  );
  const result = await getOverallReport({ from, to }, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<>{header}{filters}<ApiUnavailable error={result.error} what="the operations report" /></>);
  const { summary, kpi, daily } = result.data;

  return (
    <>
      {header}
      {filters}
      <StatGrid className="mb-4">
        <StatCard label="Total Orders" value={formatNumber(summary.totalOrders)} tone="neutral" />
        <StatCard label="Avg Confirmation %" value={pct(summary.avgConfirmation)} />
        <StatCard label="Avg Verification %" value={pct(summary.avgVerification)} tone="info" />
        <StatCard label="Avg RTO %" value={pct(summary.avgRto)} tone="danger" />
      </StatGrid>
      <Card className="mb-4">
        <CardHeader title="Overall KPI Performance" />
        <MiniTable
          empty="No KPI targets are configured."
          columns={[
            { key: "metric", label: "Metric", render: (r) => <span className="font-medium text-ink">{r.metric}</span> },
            { key: "actual", label: "Average Actual", align: "right", render: (r) => pct(r.actual) },
            { key: "target", label: "Target", align: "right", render: (r) => pct(r.target) },
            { key: "kri", label: "KRI", align: "right", render: (r) => pct(r.kri) },
            { key: "status", label: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
            { key: "performance", label: "Performance", align: "right", render: (r) => pct(r.performance) },
          ]}
          rows={kpi.map((k) => ({ ...k, id: k.code }))}
        />
      </Card>
      <Card>
        <CardHeader title="Daily Breakdown" />
        <MiniTable
          empty="No data available"
          columns={[
            { key: "date", label: "Date", render: (r) => dmy(r.date) },
            { key: "orders", label: "Orders", align: "right", render: (r) => formatNumber(r.orders) },
            { key: "confirmed", label: "Confirmed", align: "right", render: (r) => formatNumber(r.confirmed) },
            { key: "verified", label: "Verified", align: "right", render: (r) => formatNumber(r.verified) },
            { key: "dispatched", label: "Dispatched", align: "right", render: (r) => formatNumber(r.dispatched) },
            { key: "delivered", label: "Delivered", align: "right", render: (r) => formatNumber(r.delivered) },
            { key: "rto", label: "RTO", align: "right", render: (r) => formatNumber(r.rto) },
            { key: "confirmationPct", label: "Confirmation %", align: "right", render: (r) => pct(r.confirmationPct) },
            { key: "rtoPct", label: "RTO %", align: "right", render: (r) => pct(r.rtoPct) },
          ]}
          rows={daily.map((d) => ({ ...d, id: d.date }))}
        />
      </Card>
    </>
  );
}
