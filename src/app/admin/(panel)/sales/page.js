import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getSalesDashboard } from "@/lib/services/admin/insights";
import { formatINR } from "@/lib/format";
import { PageHeader, ProgressBar, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Sales Dashboard" };

export default async function SalesDashboardPage() {
  const { user, allowed } = await checkPermission("sales");
  if (!allowed) return (<><PageHeader title="Sales Dashboard" /><PermissionDenied module="the sales team" /></>);
  const d = await getSalesDashboard(user);
  const s = d.stats;
  const showPayouts = can(user, "sales.payouts") || d.scoped;

  return (
    <>
      <PageHeader
        title="Sales Dashboard"
        description={`Target vs achievement for ${d.month}. Variable pay and incentives are calculated on the server from the salary structure.`}
        actions={d.scoped ? null : <ButtonLink href="/admin/sales/team" size="sm">Sales team</ButtonLink>}
      />
      <StatGrid>
        <StatCard label="Monthly target" value={formatINR(s.target, { compact: true })} tone="neutral" href="/admin/sales/targets" />
        <StatCard label="Achieved" value={formatINR(s.achieved, { compact: true })} hint={`${s.percent}% of target`} />
        <StatCard label="Month-end run rate" value={formatINR(s.runRate, { compact: true })} tone={s.runRate >= s.target ? "brand" : "warning"} />
        <StatCard label="People at target" value={`${s.metTarget} / ${s.people}`} tone="info" href="/admin/sales/achievements" />
        {showPayouts && <StatCard label="Payouts this month" value={formatINR(s.payoutTotal, { compact: true })} hint={`${formatINR(s.payoutPending, { compact: true })} pending`} tone="warning" href={can(user, "sales.payouts") ? "/admin/sales/payouts" : undefined} />}
      </StatGrid>
      <Card className="mt-4">
        <CardHeader title="Target achievement" actions={<Link href="/admin/sales/achievements" className="text-[13px] font-medium text-brand-700 hover:underline">Details</Link>} />
        <CardBody className="space-y-4">
          {d.leaderboard.map((r) => (
            <div key={r.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-ink">{r.person} <span className="font-normal text-ink-muted">· {r.role}</span></span>
                <span className="text-ink-soft tabular">{formatINR(r.achieved)} / {formatINR(r.target)} · <span className={r.percent >= 100 ? "font-medium text-success-ink" : "text-ink"}>{r.percent}%</span></span>
              </div>
              <ProgressBar value={r.percent} max={100} tone={r.percent >= 100 ? "brand" : r.percent >= 70 ? "info" : "warning"} label={`${r.person} achievement`} />
            </div>
          ))}
        </CardBody>
      </Card>
      {showPayouts && (
        <Card className="mt-4">
          <CardHeader title="Payout summary" description="Fixed + variable (if target met) + incentive above target + prepaid incentive" />
          <MiniTable
            columns={[
              { key: "person", label: "Person", render: (r) => <span className="font-medium text-ink">{r.person}</span> },
              { key: "fixed", label: "Fixed", align: "right", render: (r) => formatINR(r.fixed) },
              { key: "variable", label: "Variable", align: "right", render: (r) => formatINR(r.variable) },
              { key: "incentive", label: "Incentive", align: "right", render: (r) => formatINR(r.incentive) },
              { key: "prepaidIncentive", label: "Prepaid", align: "right", render: (r) => formatINR(r.prepaidIncentive) },
              { key: "total", label: "Total", align: "right", render: (r) => <span className="font-medium text-ink">{formatINR(r.total)}</span> },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={d.payouts}
          />
        </Card>
      )}
    </>
  );
}
