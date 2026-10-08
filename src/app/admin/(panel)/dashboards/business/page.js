import { ArrowDownRight, ArrowUpRight, ChartLine, IndianRupee, RotateCcw, ShoppingCart, Store } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getBusinessDashboard } from "@/lib/services/admin/parity/marketing";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart, DonutChart, LineChart } from "@/components/charts/charts";
import { RangeFilter } from "@/components/admin/parity/marketing/range-filter";
import { PrintButton } from "@/components/admin/parity/marketing/print-button";
import { formatStamp, rupees, signed } from "@/components/admin/parity/marketing/format";

export const metadata = { title: "Main Dashboard" };

const PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "Lifetime" },
];
const PRESET_KEYS = new Set([...PRESETS.map((p) => p.value), "calendar"]);
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const ALERT_TONES = { warning: "border-warning-ink bg-warning-bg", info: "border-info-ink bg-info-bg" };

/** "▲ +12.5% vs last month", green when the move is good (for RTO a fall is good). */
function Change({ value, invert = false }) {
  const up = Number(value) >= 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-medium", good ? "text-success-ink" : "text-danger-ink")}>
      <Icon className="size-3.5" aria-hidden />
      {signed(value)} vs last month
    </span>
  );
}

/** main_dashboard.php: headline cards, sales and orders trend, top categories and alerts. */
export default async function BusinessDashboardPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.business");
  if (!allowed) return (<><PageHeader title="Main Dashboard" /><PermissionDenied module="the main dashboard" /></>);
  const sp = await searchParams;
  const query = { preset: PRESET_KEYS.has(sp.preset) ? sp.preset : "today" };
  if (query.preset === "calendar" && YMD.test(sp.from ?? "") && YMD.test(sp.to ?? "")) Object.assign(query, { from: sp.from, to: sp.to });
  const result = await getBusinessDashboard(query, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Main Dashboard" /><ApiUnavailable error={result.error} what="the main dashboard" /></>);
  const { filters, stats, salesTrend, topCategories, alerts } = result.data;
  const period = filters.from ? (filters.from === filters.to ? formatStamp(filters.from) : `${formatStamp(filters.from)} – ${formatStamp(filters.to)}`) : "Lifetime";
  const trendTitle = filters.from ? "" : " (Last 30 Days)";

  return (
    <>
      <PageHeader title="Main Dashboard" description={`Showing ${period}`} actions={<PrintButton />} />
      <RangeFilter presets={PRESETS} active={filters.preset} from={filters.preset === "calendar" ? filters.from ?? "" : ""} to={filters.preset === "calendar" ? filters.to ?? "" : ""} />

      <StatGrid className="mt-4 xl:grid-cols-5">
        <StatCard label="Total Orders" value={formatNumber(stats.totalOrders)} icon={ShoppingCart} tone="info" hint={<Change value={stats.ordersChange} />} />
        <StatCard label="Total Sales" value={rupees(stats.totalSales)} icon={IndianRupee} hint={<Change value={stats.salesChange} />} />
        <StatCard label="Average Orders Value" value={rupees(stats.avgOrderValue)} icon={ChartLine} tone="warning" hint={<Change value={stats.avgOrderValueChange} />} />
        <StatCard label="Active Vendors" value={formatNumber(stats.activeVendors)} icon={Store} tone="info" hint={`${formatNumber(stats.vendorsChange)} new this month`} />
        <StatCard label="RTO %" value={`${stats.rtoPercentage}%`} icon={RotateCcw} tone="danger" hint={<Change value={stats.rtoChange} invert />} />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title={`Sales Trend${trendTitle}`} />
          <CardBody>
            <LineChart data={salesTrend} series={[{ key: "sales", label: "Sales (₹)", color: "#3b82f6", format: "inr" }]} label="Sales trend" empty="No sales in this period." />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={`Orders Trend${trendTitle}`} />
          <CardBody>
            <BarChart data={salesTrend} series={[{ key: "orders", label: "Orders", color: "#10b981" }]} label="Orders trend" empty="No orders in this period." />
          </CardBody>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Top Categories by Sales" />
          <CardBody className="flex flex-col items-center gap-4 sm:flex-row">
            <DonutChart
              data={(topCategories.length ? topCategories : [{ category: "No Data", sales: 0 }]).map((c, i) => ({ label: c.category, value: Number(c.sales) || 0, color: PIE_COLORS[i % PIE_COLORS.length] }))}
              centerValue={rupees(topCategories.reduce((s, c) => s + (Number(c.sales) || 0), 0), 0)}
              centerLabel="Top categories"
              label="Top categories by sales"
            />
            <ul className="w-full space-y-1.5 text-sm">
              {topCategories.map((c, i) => (
                <li key={c.id ?? c.category} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} aria-hidden />
                    <span className="truncate">{c.category}</span>
                  </span>
                  <span className="tabular font-medium text-ink">{rupees(c.sales)}</span>
                </li>
              ))}
              {!topCategories.length && <li className="text-ink-muted">No category sales in this period.</li>}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Alerts & Notifications" />
          <CardBody className="space-y-2">
            {(alerts.length ? alerts : [{ type: "info", title: "All Good", message: "No alerts at this time." }]).map((a, i) => (
              <div key={i} className={cn("rounded-lg border-l-4 px-3 py-2 text-sm", ALERT_TONES[a.type] ?? "border-danger-ink bg-danger-bg")}>
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="mt-0.5 text-ink-soft">{a.message}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
