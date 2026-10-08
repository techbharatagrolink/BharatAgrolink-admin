import { checkPermission } from "@/lib/auth/session";
import { getB2bReport } from "@/lib/services/admin/parity/seller";
import { formatDate, formatINR, formatNumber, formatPercent } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { FilterBar } from "@/components/data-table/filter-bar";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "B2B Reports" };

const TITLE = "Reports";
const DESCRIPTION = "Sales, funnel, buyer, seller and commercial reporting. Totals reconcile to the underlying orders.";
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const monthLabel = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
const right = (key, label, render) => ({ key, label, align: "right", render });

export default async function B2bReportsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.reports");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="B2B reports" /></>);
  const sp = await searchParams;
  const range = { from: DATE.test(sp?.from ?? "") ? sp.from : undefined, to: DATE.test(sp?.to ?? "") ? sp.to : undefined };
  const result = await getB2bReport(range, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="B2B reports" /></>);
  const r = result.data;

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} meta={<Badge tone="neutral">Reporting on {formatDate(r.from)} – {formatDate(r.to)}</Badge>} />
      <div className="space-y-4">
        <FilterBar dateRange="Period" />
        <Card>
          <CardHeader title="Funnel" />
          <div className="p-4">
            <StatGrid className="xl:grid-cols-5">
              {r.funnel.map((stage) => (
                <StatCard key={stage.label} label={stage.label} value={formatNumber(stage.value)} hint={stage.conversionPct == null ? stage.note : `${stage.note} · ${formatPercent(stage.conversionPct, 1)} of previous`} />
              ))}
            </StatGrid>
          </div>
        </Card>
        <Card>
          <CardHeader title="Monthly Sales" />
          <MiniTable
            empty="No orders in this period. Widen the date range, or place a B2B order to populate this report."
            rows={r.monthly.map((m) => ({ ...m, id: m.month }))}
            columns={[
              { key: "month", label: "Month", render: (m) => monthLabel(m.month) },
              right("orders", "Orders", (m) => formatNumber(m.orders)),
              right("gmv", "GMV", (m) => formatINR(m.gmv)),
              right("aov", "AOV", (m) => formatINR(m.aov)),
              right("shipping", "Shipping", (m) => formatINR(m.shipping)),
              right("platformRevenue", "Platform Rev", (m) => formatINR(m.platformRevenue)),
              right("takePct", "Take %", (m) => formatPercent(m.takePct)),
              right("contribution", "Contribution", (m) => formatINR(m.contribution)),
              right("cmPct", "CM %", (m) => <Badge tone={m.cmHealth}>{formatPercent(m.cmPct)}</Badge>),
            ]}
          />
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Top Buyers" />
            <MiniTable
              empty="No buyer activity in this period"
              rows={r.topBuyers.map((b) => ({ ...b, id: `b-${b.id}` }))}
              columns={[
                { key: "buyer", label: "Buyer" },
                right("orders", "Orders", (b) => formatNumber(b.orders)),
                right("gmv", "GMV", (b) => formatINR(b.gmv)),
                right("aov", "AOV", (b) => formatINR(b.aov)),
              ]}
            />
          </Card>
          <Card>
            <CardHeader title="Top Sellers" />
            <MiniTable
              empty="No seller fulfilment yet"
              rows={r.topSellers.map((s) => ({ ...s, id: `s-${s.id}` }))}
              columns={[
                { key: "seller", label: "Seller" },
                right("orders", "Orders", (s) => formatNumber(s.orders)),
                right("gmv", "Line Value", (s) => formatINR(s.gmv)),
              ]}
            />
          </Card>
        </div>
        {r.lostReasons.length > 0 && (
          <Card>
            <CardHeader title="Why Quotes Are Lost" />
            <MiniTable rows={r.lostReasons.map((l) => ({ ...l, id: l.label }))} columns={[{ key: "label", label: "Reason" }, right("count", "Count", (l) => formatNumber(l.count))]} />
          </Card>
        )}
      </div>
    </>
  );
}
