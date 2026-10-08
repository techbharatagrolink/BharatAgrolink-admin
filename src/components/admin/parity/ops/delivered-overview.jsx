import { formatINR, formatNumber } from "@/lib/format";
import { StatCard } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { HBarList } from "@/components/charts/charts";
import { BarChart, DonutChart, LineChart } from "@/components/charts/interactive";

const rupees = (v) => `₹ ${formatNumber(Math.round(Number(v) || 0))}`;
const rupees2 = (v) => `₹ ${(Number(v) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function trendText(trends, key, hasWindow) {
  if (!hasWindow) return null;
  const value = trends?.[key];
  if (value == null) return "— no prior period";
  return `${value >= 0 ? "▲" : "▼"} ${Math.abs(value)}% vs prior period`;
}

/** KPI cards of master_delivered_orders.php, in the PHP order and wording. */
export function DeliveredKpis({ summary: s, trends, hasWindow }) {
  const t = (key) => trendText(trends, key, hasWindow);
  const cards = [
    { label: "Total Orders Delivered", value: formatNumber(s.total_orders), hint: `${formatNumber(s.total_lines)} order lines`, trend: t("total_orders") },
    { label: "B2C Delivered Orders", value: formatNumber(s.b2c_orders), hint: `Gross: ${rupees(s.b2c_gross)}` },
    { label: "B2B Delivered Orders", value: formatNumber(s.b2b_orders), hint: `Gross: ${rupees(s.b2b_gross)}` },
    { label: "Delivered Gross Amount", value: rupees(s.total_gross), hint: `Total delivered revenue — ${rupees2(s.total_gross)}`, trend: t("total_gross") },
    { label: "Total Taxable Amount", value: rupees(s.total_taxable), hint: "qty-multiplied true total", trend: t("total_taxable") },
    { label: "GST Collected", value: rupees(s.total_gst), hint: "B2C only — B2B has no GST split", trend: t("total_gst") },
    { label: "Platform Fee", value: rupees(s.total_commission), hint: "Commission / fee — locked payout values, B2C", trend: t("total_commission") },
    { label: "Platform Revenue", value: rupees(s.total_net_revenue), hint: "Platform share — commission + GST on commission", trend: t("total_net_revenue") },
    { label: "AOV (Delivered)", value: rupees2(s.average_order_value), hint: "Average delivered value — gross ÷ distinct orders", trend: t("average_order_value") },
    { label: "Vendors Involved", value: formatNumber(s.total_vendors), hint: `${formatNumber(s.total_qty)} units delivered` },
    { label: "Seller Payout", value: rupees(s.total_vendor_payout), hint: "vendor pay amount — from vendor_payout_items" },
    { label: "Total Discount", value: rupees(s.total_discount), hint: "total promotional discount" },
    { label: "Shipping Charges", value: rupees(s.total_shipping), hint: "Shipping collected — freight charges, B2C + B2B" },
    { label: "PG Charges", value: rupees(s.total_pg_charges), hint: "Gateway fees" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="min-w-0">
          <StatCard label={card.label} value={card.value} hint={card.hint} className="h-full" />
          {card.trend && <p className={`mt-1 px-1 text-xs ${card.trend.startsWith("▲") ? "text-success-ink" : card.trend.startsWith("▼") ? "text-danger-ink" : "text-ink-muted"}`}>{card.trend}</p>}
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, children, className }) {
  return (
    <Card className={className}>
      <CardHeader title={title} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

const donut = (rows, key, money) => rows.map((r) => ({ label: r.label || "—", value: r[key], display: money ? formatINR(r[key]) : formatNumber(r[key]) }));

/** chart_data.php charts. The PHP also computes a by-state series it never draws, so it is not shown here either. */
export function DeliveredCharts({ charts }) {
  const empty = <p className="py-8 text-center text-sm text-ink-muted">No data for the selected filters.</p>;
  const gst = [
    { label: "CGST", value: charts.gst.cgst, display: formatINR(charts.gst.cgst) },
    { label: "SGST", value: charts.gst.sgst, display: formatINR(charts.gst.sgst) },
    { label: "IGST", value: charts.gst.igst, display: formatINR(charts.gst.igst) },
  ].filter((d) => d.value > 0);
  const composition = charts.commissionSplit.map((r) => ({ label: r.label, commission: r.commission, gstOnCommission: Math.max(0, Math.round((r.netRevenue - r.commission) * 100) / 100) }));
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <ChartCard title="B2C vs B2B — Order Count">{charts.typeSplit.length ? <DonutChart data={donut(charts.typeSplit, "orders")} label="Orders by type" /> : empty}</ChartCard>
      <ChartCard title="B2C vs B2B — Revenue">{charts.typeSplit.length ? <DonutChart data={donut(charts.typeSplit, "revenue", true)} label="Revenue by type" /> : empty}</ChartCard>
      <ChartCard title="GST Breakdown (B2C only)">{gst.length ? <DonutChart data={gst} label="GST breakdown" /> : empty}</ChartCard>
      <ChartCard title="Payment Mode">{charts.paymentMode.length ? <DonutChart data={donut(charts.paymentMode.map((r) => ({ ...r, label: String(r.label).toUpperCase() })), "revenue", true)} label="Revenue by payment mode" /> : empty}</ChartCard>
      <ChartCard title="Revenue by Category">{charts.byCategory.length ? <HBarList data={charts.byCategory.slice(0, 8).map((r) => ({ label: r.label || "—", value: r.revenue }))} format={formatINR} /> : empty}</ChartCard>
      <ChartCard title="Top 5 Vendors">{charts.topVendors.length ? <HBarList data={charts.topVendors.map((r) => ({ label: r.label || r.vendorId || "—", value: r.revenue }))} format={formatINR} /> : empty}</ChartCard>
      <ChartCard title="Delivered Orders Trend" className="lg:col-span-2 xl:col-span-2">
        <LineChart data={charts.dailyTrend.map((r) => ({ label: r.label, orders: r.orders }))} series={[{ key: "orders", label: "Delivered orders" }]} label="Delivered orders per day" />
      </ChartCard>
      <ChartCard title="Net Revenue Composition">
        <BarChart data={composition} series={[{ key: "commission", label: "Commission", format: "inr" }, { key: "gstOnCommission", label: "GST on commission", format: "inr" }]} stacked label="Net revenue composition" />
      </ChartCard>
    </div>
  );
}
