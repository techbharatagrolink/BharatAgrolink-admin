import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getB2BDashboard } from "@/lib/services/admin/insights";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { DonutChart, HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "B2B Dashboard" };

const more = (href, label) => <Link href={href} className="text-[13px] font-medium text-brand-700 hover:underline">{label}</Link>;

export default async function B2BDashboardPage() {
  const { user, allowed } = await checkPermission("b2b");
  if (!allowed) return (<><PageHeader title="B2B Dashboard" /><PermissionDenied module="B2B" /></>);
  const result = await getB2BDashboard(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="B2B Dashboard" description="RFQ pipeline, quotation approvals, order value, contribution and buyer credit." /><ApiUnavailable error={result.error} what="the B2B dashboard" /></>);
  const d = result.data || {};
  d.rfqStatus = d.rfqStatus || [];
  d.funnel = d.funnel || [];
  d.lostReasons = d.lostReasons || [];
  d.segments = d.segments || [];
  d.alerts = d.alerts || [];
  d.recentOrders = d.recentOrders || [];
  const s = d.stats || {};

  return (
    <>
      <PageHeader title="B2B Dashboard" description="RFQ pipeline, quotation approvals, order value, contribution and buyer credit." />
      <StatGrid>
        <StatCard label="Open RFQs" value={s.openRfqs} hint={s.slaBreached ? `${s.slaBreached} past 30-min SLA` : "All within SLA"} tone={s.slaBreached ? "danger" : "brand"} href="/admin/b2b/rfqs" />
        <StatCard label="Quotes awaiting approval" value={s.approvalPending} hint="CM < 5% or shipping > 5%" tone="warning" href="/admin/b2b/quotations" />
        <StatCard label="Order value" value={formatINR(s.orderValue, { compact: true })} hint={s.contributionPct == null ? "Live orders" : `Contribution ${s.contributionPct}%`} href="/admin/b2b/orders" />
        <StatCard label="Win rate" value={`${s.winRate}%`} hint="Converted / decided RFQs" tone="info" />
        <StatCard label="Buyers" value={s.buyers} tone="neutral" href="/admin/b2b/buyers" />
        <StatCard label="Credit outstanding" value={formatINR(s.outstanding, { compact: true })} tone="warning" href="/admin/b2b/payments" />
        <StatCard label="Overdue payments" value={formatINR(s.overdue, { compact: true })} tone="danger" href="/admin/b2b/payments?status=Overdue" />
      </StatGrid>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Pipeline" />
          <CardBody><HBarList data={d.funnel} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="RFQ status" />
          <CardBody><DonutChart data={d.rfqStatus} label="RFQs by status" centerValue={d.rfqStatus.reduce((a, x) => a + x.value, 0)} centerLabel="RFQs" /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Lost reasons" />
          <CardBody>{d.lostReasons.length ? <HBarList data={d.lostReasons} /> : <p className="text-sm text-ink-muted">No lost RFQs.</p>}</CardBody>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Open alerts" actions={more("/admin/b2b/alerts", "All alerts")} />
          <MiniTable
            columns={[
              { key: "type", label: "Alert", render: (r) => <span className="font-medium text-ink">{r.type}</span> },
              { key: "entity", label: "Record", render: (r) => <span className="font-mono text-xs">{r.entity}</span> },
              { key: "severity", label: "Severity", render: (r) => <StatusBadge status={r.severity} /> },
              { key: "assignedTo", label: "Owner" },
              { key: "createdAt", label: "Raised", render: (r) => formatDateTime(r.createdAt) },
            ]}
            rows={d.alerts}
            empty="No open alerts."
          />
        </Card>
        <Card>
          <CardHeader title="Recent B2B orders" actions={more("/admin/b2b/orders", "All orders")} />
          <MiniTable
            columns={[
              { key: "id", label: "Order", render: (r) => <Link href={`/admin/b2b/orders/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.id}</Link> },
              { key: "buyer", label: "Buyer", render: (r) => <span className="block max-w-44 truncate">{r.buyer}</span> },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "value", label: "Value", align: "right", render: (r) => formatINR(r.value) },
              { key: "createdAt", label: "Date", render: (r) => formatDate(r.createdAt) },
            ]}
            rows={d.recentOrders}
            empty="No orders yet."
          />
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Buyer segments" description="B0 lead → B6 key account" />
        <CardBody><HBarList data={d.segments} /></CardBody>
      </Card>
    </>
  );
}
