import Link from "next/link";
import { CalendarDays, Gauge, PieChart, Target } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getMyPerformance } from "@/lib/services/admin/parity/crm";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Notice, PageHeader, ProgressBar, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { AchievementMonth, OrderRangeButtons, RefreshButton, SalesPersonSelect } from "@/components/admin/parity/crm/performance-controls";
import { formatDate, formatINR, formatNumber } from "@/lib/format";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "My Sales Performance" };

const TITLE = "My Sales Performance";
const DESCRIPTION = "Your monthly target, today's target with rollover, your B2C and B2B orders and your achievements.";

const RANGES = ["today", "tomorrow", "week", "month", "all"];

const monthLabel = (ym) => (ym ? new Date(`${ym.slice(0, 7)}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "");

function DailyBox({ label, value, hint, tone }) {
  const tones = { warning: "bg-warning-bg text-warning-ink", success: "bg-success-bg text-success-ink", info: "bg-info-bg text-info-ink", neutral: "bg-surface-muted text-ink" };
  return (
    <div className={`rounded-lg p-3 text-center ${tones[tone]}`}>
      <p className="text-micro font-bold tracking-wide uppercase">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular">{value}</p>
      <p className="text-xs text-ink-muted">{hint}</p>
    </div>
  );
}

export default async function MyPerformancePage({ searchParams }) {
  const { user, allowed } = await checkPermission("sales.myPerformance");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="my sales performance" /></>);
  const params = await searchParams;
  const range = RANGES.includes(params.range) ? params.range : "month";
  const month = params.month === "all" || /^\d{4}-\d{2}$/.test(params.month || "") ? params.month : undefined;
  const person = /^\d{1,20}$/.test(params.person || "") ? params.person : undefined;
  let data;
  try {
    data = await getMyPerformance({ range, ...(month ? { month } : {}), ...(person ? { person } : {}) }, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="your sales performance" /></>);
  }
  if (!data.eligible) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <Notice tone="warning" title="Only for sales executives and sales managers">
          This page shows the performance of the logged-in sales person. Your account is not an active Sales Executive or Sales Manager.
        </Notice>
      </>
    );
  }
  if (!data.person) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <EmptyState title="No active sales executives or sales managers." />
      </>
    );
  }
  const { standing, daily, orders, achievements } = data;
  const picker = data.people?.length ? <SalesPersonSelect people={data.people} value={data.person.id} /> : null;
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} meta={<Badge tone="neutral">{data.person.name}</Badge>} actions={<>{picker}<RefreshButton /></>} />
      <div className="space-y-4">
        <StatGrid className="xl:grid-cols-3">
          <StatCard label="Target Amount" value={formatINR(standing.target)} hint={monthLabel(standing.month)} icon={Target} />
          <StatCard label="Achieved Amount" value={formatINR(standing.achieved)} hint={`${standing.percent.toFixed(1)}% · ${standing.statusBadge}`} icon={Gauge} tone="info" />
          <StatCard label="Achievement %" value={`${standing.percent.toFixed(1)}%`} hint={standing.statusText} icon={PieChart} tone={standing.percent >= 100 ? "brand" : "warning"} />
        </StatGrid>
        {standing.isManager && <p className="text-xs text-ink-muted">As a sales manager your target and achievement include your sales team.</p>}

        <Card>
          <CardHeader title="Today's Target & Rollover" description={formatDate(daily.targetDate)} />
          <CardBody className="space-y-3">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <DailyBox label="Total daily target" value={formatINR(daily.totalTarget)} hint={`Base ${formatINR(daily.dailyBase)} + Roll ${formatINR(daily.rollover)}`} tone="warning" />
              <DailyBox label="Delivered today" value={formatINR(daily.achieved)} hint={`B2C ${formatINR(daily.b2cDelivered)} | B2B ${formatINR(daily.b2bDelivered)}`} tone="success" />
              <DailyBox label="Remaining target" value={formatINR(daily.remaining)} hint="Rest rolls to tomorrow" tone="info" />
              <DailyBox label="Daily completion" value={`${daily.progressPct}%`} hint={daily.isAchieved ? "Target Achieved!" : "In Progress"} tone="neutral" />
            </div>
            <ProgressBar value={daily.progressPct} label="Daily completion" />
            {daily.isAchieved && (
              <Notice tone="success">
                <strong>Target Amount is Achieved!</strong> Everything delivered beyond this point is a bonus.
              </Notice>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="My Orders & Tracking (B2C + B2B)" actions={<OrderRangeButtons active={range} />} />
          <CardBody className="space-y-3">
            <div className="flex flex-wrap gap-4 text-small">
              <span>
                <strong>{formatNumber(orders.totals.b2cOrders)}</strong> B2C · <strong>{formatNumber(orders.totals.b2bOrders)}</strong> B2B
              </span>
              <span className="text-success-ink">
                Delivered: <strong>{formatINR(orders.totals.totalDelivered)}</strong>
              </span>
              <span className="text-ink-muted">
                Order value: <strong>{formatINR(orders.totals.totalOrderValue)}</strong>
              </span>
              {orders.window && <span className="text-ink-muted">{orders.window.from === orders.window.to ? formatDate(orders.window.from) : `${formatDate(orders.window.from)} – ${formatDate(orders.window.to)}`}</span>}
            </div>
            {orders.rows.length === 0 ? (
              <EmptyState title="No orders in this period." />
            ) : (
              <div className="-mx-4 -mb-4 overflow-hidden rounded-b-xl border-t border-line">
                <MiniTable
                  rows={orders.rows.map((o) => ({ ...o, id: o.key }))}
                  columns={[
                    { key: "orderId", label: "Order ID", render: (o) => <Link href={o.href} className="font-medium text-brand-700 hover:underline">{o.orderId}</Link> },
                    { key: "type", label: "Type", render: (o) => <Badge tone={o.type === "B2B" ? "info" : "neutral"}>{o.type}</Badge> },
                    { key: "date", label: "Date", render: (o) => formatDate(o.date) },
                    { key: "customer", label: "Customer", render: (o) => o.customer || "-" },
                    { key: "value", label: "Value", align: "right", render: (o) => formatINR(o.value) },
                    { key: "delivered", label: "Delivered", align: "right", render: (o) => <span className={o.delivered > 0 ? "font-semibold text-success-ink" : "text-ink-muted"}>{formatINR(o.delivered)}</span> },
                    { key: "status", label: "Status", render: (o) => <Badge tone={o.done ? "success" : "neutral"}>{o.status}</Badge> },
                    { key: "tracking", label: "Tracking", render: (o) => <span className="font-mono text-label">{o.tracking || "-"}</span> },
                  ]}
                />
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Achievements" description={achievements.month ? monthLabel(achievements.month) : "All months"} actions={<AchievementMonth value={achievements.month} />} />
          <CardBody>
            {achievements.rows.length === 0 ? (
              <EmptyState title="No achievements found" icon={CalendarDays} />
            ) : (
              <div className="-mx-4 -mb-4 overflow-hidden rounded-b-xl border-t border-line">
                <MiniTable
                  rows={achievements.rows}
                  columns={[
                    { key: "month", label: "Month", render: (a) => monthLabel(String(a.month)) },
                    { key: "target", label: "Target Amount", align: "right", render: (a) => formatINR(a.target) },
                    { key: "achieved", label: "Achieved Amount", align: "right", render: (a) => formatINR(a.achieved) },
                    { key: "percent", label: "Achievement %", align: "right", render: (a) => `${a.percent.toFixed(2)}%` },
                    { key: "status", label: "Status", render: (a) => <Badge tone={a.met ? "success" : "warning"}>{a.met ? "Target Met" : "Pending"}</Badge> },
                  ]}
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
