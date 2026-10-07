import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProfitLoss } from "@/lib/services/admin/insights";
import { RANGES } from "@/lib/services/admin/dashboards";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Notice, PageHeader, ProgressBar, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart } from "@/components/charts/charts";
import { RangeSwitch } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Profit & Loss" };

export default async function ProfitLossPage({ searchParams }) {
  const { user, allowed } = await checkPermission("finance");
  if (!allowed) return (<><PageHeader title="Profit & Loss" /><PermissionDenied module="finance" /></>);
  const { range } = await searchParams;
  const result = await getProfitLoss(range, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Profit & Loss" /><ApiUnavailable error={result.error} what="the profit and loss report" /></>);
  const d = result.data;

  return (
    <>
      <PageHeader
        title="Profit & Loss"
        description="Platform revenue against operating costs for delivered orders. Calculated on the server."
        actions={<RangeSwitch pathname="/admin/finance" ranges={RANGES} active={d.period.value} />}
      />
      <StatGrid>
        <StatCard label="Delivered GMV" value={formatINR(d.gmv, { compact: true })} tone="neutral" />
        <StatCard label="Platform revenue" value={formatINR(d.revenue, { compact: true })} hint="Commission + shipping income" />
        <StatCard label="Operating costs" value={formatINR(d.costs, { compact: true })} tone="warning" />
        <StatCard label="Net contribution" value={formatINR(d.net, { compact: true })} hint={`${d.marginPct}% of GMV`} tone={d.net >= 0 ? "brand" : "danger"} />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={`Statement · ${d.period.label}`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Profit and loss statement</caption>
              <tbody>
                {["Revenue", "Cost"].map((group) => (
                  <GroupRows key={group} group={group} lines={d.lines.filter((l) => l.group === group)} />
                ))}
                <tr className="border-t-2 border-line-strong">
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">Net contribution</th>
                  <td className={cn("px-4 py-3 text-right font-semibold tabular", d.net < 0 ? "text-danger-ink" : "text-success-ink")}>{formatINR(d.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardHeader title="Expense limits" description="Actual vs cap, % of sales" actions={<Link href="/admin/finance/expense-limits" className="text-[13px] font-medium text-brand-700 hover:underline">Manage</Link>} />
          <CardBody className="space-y-4">
            {d.expenseCaps.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-soft">{c.label}</span>
                  <span className={c.actualPercent > c.capPercent ? "font-medium text-danger-ink tabular" : "text-ink tabular"}>{c.actualPercent}% / {c.capPercent}%</span>
                </div>
                <ProgressBar value={c.actualPercent} max={c.capPercent} tone={c.actualPercent > c.capPercent ? "danger" : "brand"} label={`${c.label} against cap`} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Revenue vs costs" description="Rolling 30-day windows" />
        <CardBody>
          <BarChart data={d.months} series={[{ key: "revenue", label: "Revenue (₹)" }, { key: "costs", label: "Costs (₹)" }]} label="Revenue and costs by month" />
        </CardBody>
      </Card>
      <Notice className="mt-4" title="How these numbers are calculated">
        <ul className="list-disc space-y-0.5 pl-4">
          {d.assumptions.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </Notice>
    </>
  );
}

function GroupRows({ group, lines }) {
  const total = lines.reduce((s, l) => s + l.value, 0);
  return (
    <>
      <tr className="bg-surface-muted">
        <th scope="rowgroup" colSpan={2} className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-ink-muted uppercase">{group === "Cost" ? "Costs" : "Revenue"}</th>
      </tr>
      {lines.map((l) => (
        <tr key={l.label} className="border-b border-line">
          <th scope="row" className="px-4 py-2.5 text-left font-normal text-ink-soft">{l.label}</th>
          <td className={cn("px-4 py-2.5 text-right tabular", l.value < 0 ? "text-danger-ink" : "text-ink")}>{formatINR(l.value)}</td>
        </tr>
      ))}
      <tr className="border-b border-line">
        <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink">Total {group === "Cost" ? "costs" : "revenue"}</th>
        <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(total)}</td>
      </tr>
    </>
  );
}
