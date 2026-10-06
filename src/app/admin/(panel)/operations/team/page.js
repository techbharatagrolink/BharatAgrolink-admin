import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getOperationsTeam } from "@/lib/services/admin/insights";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { KpiTargets } from "@/components/admin/dashboard/kpi-targets";
import { cn } from "@/lib/utils";

export const metadata = { title: "Team Dashboard" };

const pctCell = (v, good = 90) => <span className={cn("tabular", v < good - 15 ? "text-danger-ink" : v < good ? "text-warning-ink" : "text-success-ink")}>{v}%</span>;

export default async function OperationsTeamPage() {
  const { allowed } = await checkPermission("operations.team");
  if (!allowed) return (<><PageHeader title="Team Dashboard" /><PermissionDenied module="the operations team" /></>);
  const d = await getOperationsTeam();
  const s = d.stats;

  return (
    <>
      <PageHeader title="Team Dashboard" description="Workload and KPI performance per operations agent." />
      <StatGrid>
        <StatCard label="Active agents" value={s.agents} tone="neutral" />
        <StatCard label="Open order lines" value={s.open} href="/admin/operations/team/assignments" />
        <StatCard label="SLA breached" value={s.breached} tone="danger" href="/admin/operations/team/assignments?slaState=Breached" />
        <StatCard label="Avg confirmation" value={`${s.avgConfirmed}%`} tone="info" />
        <StatCard label="Calls made" value={s.calls} tone="neutral" href="/admin/operations/recordings" />
        <StatCard label="Unassigned" value={s.unassigned} tone={s.unassigned ? "warning" : "brand"} />
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
    </>
  );
}
