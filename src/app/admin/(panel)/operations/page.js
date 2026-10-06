import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getOperationsCenter } from "@/lib/services/admin/insights";
import { formatDateTime, formatINR } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { BarChart } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { KpiTargets } from "@/components/admin/dashboard/kpi-targets";

export const metadata = { title: "Command Center" };

export default async function OperationsCenterPage() {
  const { user, allowed } = await checkPermission("operations.center");
  if (!allowed) return (<><PageHeader title="Command Center" /><PermissionDenied module="the operations center" /></>);
  const d = await getOperationsCenter(user);

  return (
    <>
      <PageHeader title="Command Center" description={d.scoped ? "Live view of the order lines assigned to you." : "Live order-line pipeline, SLA health, NDR and escalations across the operations team."} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {d.kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} hint={k.hint} tone={k.tone} href={k.href} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Pipeline by stage" />
          <CardBody>
            <BarChart data={d.stages} series={[{ key: "value", label: "Order lines" }]} label="Order lines by stage" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="KPI targets" description="Actual vs target; red when the KRI threshold is crossed" />
          <CardBody>
            <KpiTargets rows={d.kpiTargets} />
          </CardBody>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Open escalations" actions={<Link href="/admin/operations/ndr" className="text-[13px] font-medium text-brand-700 hover:underline">NDR & escalations</Link>} />
          <MiniTable
            columns={[
              { key: "title", label: "Escalation", render: (r) => <span className="block max-w-56 truncate font-medium text-ink">{r.title}</span> },
              { key: "orderId", label: "Order", render: (r) => <Link href={`/admin/orders/${r.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{r.orderId}</Link> },
              { key: "severity", label: "Severity", render: (r) => <StatusBadge status={r.severity} /> },
              { key: "owner", label: "Owner" },
              { key: "firstSeenAt", label: "Since", render: (r) => formatDateTime(r.firstSeenAt) },
            ]}
            rows={d.escalations}
            empty="No open escalations."
          />
        </Card>
        <Card>
          <CardHeader title="SLA breached" actions={<Link href="/admin/operations/team/assignments?slaState=Breached" className="text-[13px] font-medium text-brand-700 hover:underline">View all</Link>} />
          <MiniTable
            columns={[
              { key: "orderId", label: "Order", render: (r) => <Link href={`/admin/orders/${r.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{r.orderId}</Link> },
              { key: "vendor", label: "Vendor", render: (r) => <span className="block max-w-40 truncate">{r.vendor}</span> },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "agent", label: "Agent" },
              { key: "value", label: "Value", align: "right", render: (r) => formatINR(r.value) },
            ]}
            rows={d.breached}
            empty="Nothing breached. Good work."
          />
        </Card>
      </div>
    </>
  );
}