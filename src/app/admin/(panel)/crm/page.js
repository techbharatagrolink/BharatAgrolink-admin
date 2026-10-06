import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getCrmDashboard } from "@/lib/services/admin/insights";
import { formatDateTime, formatINR } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { DonutChart, HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Lead Dashboard" };

export default async function CrmDashboardPage() {
  const { user, allowed } = await checkPermission("crm");
  if (!allowed) return (<><PageHeader title="Lead Dashboard" /><PermissionDenied module="lead management" /></>);
  const d = await getCrmDashboard(user);
  const s = d.stats;

  return (
    <>
      <PageHeader title="Lead Dashboard" description={d.scoped ? "Your assigned leads and follow-ups." : "Lead pipeline, sources, follow-ups and executive performance."} />
      <StatGrid>
        <StatCard label="Total leads" value={s.total} href="/admin/crm/leads" />
        <StatCard label="New (not called)" value={s.fresh} tone="info" href="/admin/crm/leads?status=New" />
        <StatCard label="Hot open leads" value={s.hot} tone="warning" href="/admin/crm/leads?priority=Hot" />
        <StatCard label="Follow-ups overdue" value={s.overdue} hint={`${s.dueToday} due today`} tone="danger" href="/admin/crm/follow-ups" />
        <StatCard label="Conversion" value={`${s.conversion}%`} hint={`Avg ${s.avgAttempts} attempts`} />
        <StatCard label="Converted order value" value={formatINR(s.convertedValue, { compact: true })} tone="neutral" />
      </StatGrid>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="By status" />
          <CardBody><DonutChart data={d.byStatus} label="Leads by status" centerValue={s.total} centerLabel="leads" /></CardBody>
        </Card>
        <Card>
          <CardHeader title="By source" />
          <CardBody><HBarList data={d.bySource} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Top crops" />
          <CardBody><HBarList data={d.byCrop} /></CardBody>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upcoming and overdue follow-ups" actions={<Link href="/admin/crm/follow-ups" className="text-[13px] font-medium text-brand-700 hover:underline">All follow-ups</Link>} />
          <MiniTable
            columns={[
              { key: "name", label: "Lead", render: (r) => <Link href={`/admin/crm/leads/${r.id}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link> },
              { key: "crop", label: "Crop" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "assignedTo", label: "Executive" },
              { key: "nextFollowUp", label: "Follow-up", render: (r) => (
                <span className="inline-flex items-center gap-1.5">
                  {formatDateTime(r.nextFollowUp)}
                  {r.overdue && <Badge tone="danger">Overdue</Badge>}
                </span>
              ) },
            ]}
            rows={d.followUps}
            empty="No pending follow-ups."
          />
        </Card>
        {!d.scoped && (
          <Card>
            <CardHeader title="Executive leaderboard" />
            <MiniTable
              columns={[
                { key: "name", label: "Executive", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
                { key: "leads", label: "Leads", align: "right" },
                { key: "converted", label: "Converted", align: "right" },
                { key: "conversion", label: "Conv. %", align: "right", render: (r) => `${r.conversion}%` },
                { key: "value", label: "Order value", align: "right", render: (r) => formatINR(r.value) },
              ]}
              rows={d.leaderboard}
            />
          </Card>
        )}
      </div>
    </>
  );
}
