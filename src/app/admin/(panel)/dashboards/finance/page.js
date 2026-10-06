import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getFinanceDashboard, RANGES } from "@/lib/services/admin/dashboards";
import { formatINR } from "@/lib/format";
import { PageHeader, ProgressBar, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { LineChart } from "@/components/charts/charts";
import { MiniTable, RangeSwitch } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Finance & Payout Dashboard" };

export default async function FinanceDashboardPage({ searchParams }) {
  const { allowed } = await checkPermission("dashboard.finance");
  if (!allowed) return (<><PageHeader title="Finance & Payout Dashboard" /><PermissionDenied module="the finance dashboard" /></>);
  const { range } = await searchParams;
  const d = await getFinanceDashboard(range);
  const s = d.stats;
  return (
    <>
      <PageHeader
        title="Finance & Payout Dashboard"
        description="Delivered revenue, platform commission, tax and payout liabilities. Values come from server-side finance calculations."
        actions={<RangeSwitch pathname="/admin/dashboards/finance" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid>
        <StatCard label="Delivered gross (incl. GST)" value={formatINR(s.gross, { compact: true })} />
        <StatCard label="Platform commission (ex-GST)" value={formatINR(s.commissionExGst, { compact: true })} hint="taxable − NRV" tone="info" />
        <StatCard label="Seller payable (BSA)" value={formatINR(s.payable, { compact: true })} hint="NRV − TCS" tone="neutral" />
        <StatCard label="TCS collected" value={formatINR(s.tcs, { compact: true })} hint="1% of taxable" tone="neutral" href="/admin/finance/gst" />
        <StatCard label="Payouts pending" value={formatINR(s.pendingPayouts, { compact: true })} tone="warning" href="/admin/payouts" />
        <StatCard label="Payouts on hold" value={formatINR(s.onHold, { compact: true })} tone="danger" href="/admin/payouts?status=On+Hold" />
        <StatCard label="Refunds pending" value={formatINR(s.refundsPending, { compact: true })} tone="warning" href="/admin/refunds" />
        <StatCard label="COD remittance pending" value={formatINR(s.codPending, { compact: true })} tone="warning" href="/admin/finance/cod" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Gross sales and commission" description="By delivery date" />
          <CardBody>
            <LineChart data={d.trend} series={[{ key: "gross", label: "Gross (₹)" }, { key: "commission", label: "Commission ex-GST (₹)" }]} label="Gross and commission trend" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Expense limits" description="Actual vs cap, % of sales" actions={<Link href="/admin/finance/expense-limits" className="text-[13px] font-medium text-brand-700 hover:underline">Details</Link>} />
          <CardBody className="space-y-4">
            {d.expenseCaps.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-soft">{c.label}</span>
                  <span className={c.actualPercent > c.capPercent ? "font-medium text-danger-ink tabular" : "text-ink tabular"}>
                    {c.actualPercent}% / {c.capPercent}%
                  </span>
                </div>
                <ProgressBar value={c.actualPercent} max={c.capPercent} tone={c.actualPercent > c.capPercent ? "danger" : "brand"} label={`${c.label} against cap`} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Payout queue" actions={<Link href="/admin/payouts" className="text-[13px] font-medium text-brand-700 hover:underline">All payouts</Link>} />
        <MiniTable
          columns={[
            { key: "id", label: "Payout", render: (r) => <Link href={`/admin/payouts/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.id}</Link> },
            { key: "vendor", label: "Vendor" },
            { key: "cycle", label: "Cycle" },
            { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            { key: "bsa", label: "Amount (BSA)", align: "right", render: (r) => formatINR(r.bsa) },
          ]}
          rows={d.payoutQueue}
          empty="No unpaid payouts."
        />
      </Card>
    </>
  );
}
