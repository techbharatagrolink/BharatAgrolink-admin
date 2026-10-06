import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getVendorDashboard } from "@/lib/services/admin/dashboards";
import { formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Seller Dashboard" };

export default async function SellerDashboardPage() {
  const { allowed } = await checkPermission("dashboard.sellers");
  if (!allowed) return (<><PageHeader title="Seller Dashboard" /><PermissionDenied module="the seller dashboard" /></>);
  const d = await getVendorDashboard();
  return (
    <>
      <PageHeader title="Seller Dashboard" description="Vendor base, onboarding queue and performance scores (fulfilment, dispatch, revenue, tenure, minus RTO/cancellation penalty)." />
      <StatGrid className="xl:grid-cols-6">
        <StatCard label="All vendors" value={formatNumber(d.stats.total)} href="/admin/vendors" />
        <StatCard label="Active" value={formatNumber(d.stats.active)} />
        <StatCard label="Awaiting verification" value={formatNumber(d.stats.pending)} tone="warning" href="/admin/vendors/verification" />
        <StatCard label="Suspended" value={formatNumber(d.stats.suspended)} tone="danger" />
        <StatCard label="Average score" value={d.stats.avgScore} tone="info" href="/admin/vendors/scores" />
        <StatCard label="Payout page disabled" value={formatNumber(d.stats.payoutAccessOff)} tone="neutral" href="/admin/payouts/access" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Top 10 vendors" actions={<Link href="/admin/vendors/scores" className="text-[13px] font-medium text-brand-700 hover:underline">Score details</Link>} />
          <MiniTable
            columns={[
              { key: "name", label: "Vendor", render: (r) => <Link href={`/admin/vendors/${r.id}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link> },
              { key: "city", label: "City" },
              { key: "orders", label: "Order lines", align: "right", render: (r) => formatNumber(r.orders) },
              { key: "gmv", label: "Delivered GMV", align: "right", render: (r) => formatINR(r.gmv, { compact: true }) },
              { key: "score", label: "Score", align: "right", render: (r) => <span className="font-semibold text-ink">{r.score}</span> },
            ]}
            rows={d.top}
          />
        </Card>
        <Card>
          <CardHeader title="Vendors by state" />
          <CardBody>
            <HBarList data={d.byState} format={formatNumber} />
          </CardBody>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Lowest scores" description="Candidates for a performance review" />
        <MiniTable
          columns={[
            { key: "name", label: "Vendor", render: (r) => <Link href={`/admin/vendors/${r.id}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link> },
            { key: "penaltyRate", label: "RTO + cancel rate", align: "right", render: (r) => `${r.penaltyRate}%` },
            { key: "score", label: "Score", align: "right" },
          ]}
          rows={d.bottom}
        />
      </Card>
    </>
  );
}
