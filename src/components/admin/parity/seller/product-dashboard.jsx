"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatCard, StatGrid } from "@/components/ui/page";
import { BarChart, DonutChart, LineChart } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { formatINR, formatNumber, formatPercent } from "@/lib/format";
import { ProductActivity, ProductInspect } from "./product-inspect";

const HEALTH_TONE = { Scale: "success", Improve: "warning", Review: "warning", "Stop / Replace": "danger" };
const PROFIT_TONE = { "High Profit": "success", "Low Profit": "warning", "Loss Making": "danger" };

const right = (key, label, render) => ({ key, label, align: "right", render });

function shortDay(day) {
  const date = new Date(`${String(day).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(day) : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function Drill({ children, onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="block h-full w-full min-w-0 text-left" aria-label={label}>
      {children}
    </button>
  );
}

function ScoreRing({ score, color }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 96 96" className="size-24 shrink-0" role="img" aria-label={`Health score ${score} out of 100`}>
      <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--line)" strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text x="48" y="53" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--ink)">
        {score}
      </text>
    </svg>
  );
}

function ProductName({ row, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(row.prodId)} className="inline-flex max-w-xs items-center gap-2 text-left font-medium text-brand-700 hover:underline">
      {row.image ? <Image src={row.image} alt="" width={32} height={32} unoptimized className="size-8 shrink-0 rounded-md border border-line object-cover" /> : null}
      <span className="truncate">{row.name || row.prodId}</span>
    </button>
  );
}

function Funnel({ stages }) {
  const max = Math.max(1, ...stages.map((stage) => stage.count || 0));
  return (
    <ul className="space-y-2.5">
      {stages.map((stage) => (
        <li key={stage.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-ink-soft">{stage.name}</span>
            <span className="shrink-0 tabular text-ink">
              {stage.count == null ? "Not tracked" : formatNumber(stage.count)}
              {stage.conversionPct != null && <span className="ml-2 text-xs text-ink-muted">{formatPercent(stage.conversionPct)} of previous</span>}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-bg">
            <div className="h-full rounded-full" style={{ width: stage.count == null ? "0%" : `${(stage.count / max) * 100}%`, background: stage.color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const demandColumns = (onOpen) => [
  { key: "location", label: "Location" },
  { key: "product", label: "Product", render: (row) => (row.prodId ? <ProductName row={{ ...row, name: row.product }} onOpen={onOpen} /> : row.product || "—") },
  right("orders", "Orders", (row) => formatNumber(row.orders)),
  right("qty", "Qty", (row) => formatNumber(row.qty)),
  right("gmv", "GMV", (row) => formatINR(row.gmv)),
];

/** product_dashboard.php: health, catalog cards, sales KPIs, funnel, stock, RTO, demand and activity. */
export function ProductDashboard({ data, filters, feed, feedError }) {
  const [card, setCard] = useState(null);
  const [productId, setProductId] = useState(null);
  const { health, summary, kpis, topProducts, funnel, profitability, inventory, rto, demand, range } = data;
  const openProduct = (id) => setProductId(id);

  const catalog = [
    ["total_products", "Total products", summary.totalProducts.value, null, "brand"],
    ["active_products", "Active", summary.activeProducts.value, null, "brand"],
    ["out_of_stock", "Out of stock", summary.outOfStock.value, null, "danger"],
    ["low_stock", "Low stock", summary.lowStock.value, null, "warning"],
    ["zero_sale_products", "Zero sale", summary.zeroSale.value, null, "warning", `${Number(summary.zeroSale.delta) > 0 ? "+" : ""}${Number(summary.zeroSale.delta).toFixed(1)}% vs prior`],
    ["new_products", "New (30 days)", summary.newProducts.value, summary.newProducts.delta, "info"],
  ];
  const sales = [
    ["gmv", "GMV", formatINR(kpis.gmv.value), kpis.gmv.delta],
    ["orders", "Orders", formatNumber(kpis.orders.value), kpis.orders.delta],
    ["qty_sold", "Qty sold", formatNumber(kpis.qtySold.value), kpis.qtySold.delta],
    ["revenue", "Platform revenue", formatINR(kpis.revenue.value), kpis.revenue.delta],
    ["contribution_margin", "Contribution", formatINR(kpis.contribution.value), kpis.contribution.delta],
    ["avg_margin", "Avg margin", formatPercent(kpis.avgMarginPct.value), kpis.avgMarginPct.deltaPts],
  ];
  const trend = health.trend.map((point) => ({ ...point, label: shortDay(point.day) }));

  return (
    <>
      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Drill onClick={() => setCard("health_score")} label="Open products behind the health score">
            <ScoreRing score={health.score} color={health.color} />
          </Drill>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-ink">Catalog health</h2>
              <Badge tone={HEALTH_TONE[health.status] ?? "neutral"} dot>{health.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-muted">Stock, returns, sales velocity and margin, 25 points each. Click the score to see the products behind it.</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {[
                ["Stock", health.components.stock],
                ["RTO", health.components.rto],
                ["Velocity", health.components.velocity],
                ["Margin", health.components.margin],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink-muted">{label}</dt>
                  <dd className="font-medium tabular text-ink">{formatNumber(value)} / 25</dd>
                </div>
              ))}
            </dl>
          </div>
        </CardBody>
      </Card>

      <StatGrid className="xl:grid-cols-6">
        {catalog.map(([key, label, value, delta, tone, hint]) => (
          <Drill key={key} onClick={() => setCard(key)} label={`Open ${label}`}>
            <StatCard className="h-full" label={label} value={formatNumber(value)} delta={delta} tone={tone} hint={hint || "View products"} />
          </Drill>
        ))}
      </StatGrid>

      <StatGrid className="xl:grid-cols-6">
        {sales.map(([key, label, value, delta]) => (
          <Drill key={key} onClick={() => setCard(key)} label={`Open ${label}`}>
            <StatCard className="h-full" label={label} value={value} delta={delta} hint="vs prior window" />
          </Drill>
        ))}
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="GMV, last 7 days of the window" />
          <CardBody>
            <LineChart data={trend} series={[{ key: "gmv", label: "GMV (₹)", color: "#3b82f6", format: "inr" }]} label="GMV trend" empty="No orders in this window." />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Orders, last 7 days of the window" />
          <CardBody>
            <BarChart data={trend} series={[{ key: "orders", label: "Orders", color: "#10b981" }]} label="Orders trend" empty="No orders in this window." />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Conversion funnel" description="Impressions and checkout are not stored, so those stages stay blank." />
          <CardBody>
            <Funnel stages={funnel} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Inventory mix" description={`${formatNumber(summary.totalProducts.value)} SKUs`} />
          <CardBody>
            <DonutChart
              data={inventory.categories.map((item) => ({ label: item.label, value: item.count, color: item.color }))}
              centerValue={formatNumber(summary.totalProducts.value)}
              centerLabel="SKUs"
              label="Inventory mix"
            />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Top products" description="By GMV in this window. Growth is against the comparison window." />
        <MiniTable
          empty="No product sales in this window."
          rows={topProducts.map((row) => ({ ...row, id: row.prodId }))}
          columns={[
            { key: "rank", label: "#", render: (row) => row.rank },
            { key: "name", label: "Product", render: (row) => <ProductName row={row} onOpen={openProduct} /> },
            { key: "category", label: "Category" },
            right("orders", "Orders", (row) => formatNumber(row.orders)),
            right("qty", "Qty", (row) => formatNumber(row.qty)),
            right("gmv", "GMV", (row) => formatINR(row.gmv)),
            right("margin", "Margin", (row) => formatINR(row.margin)),
            right("marginPct", "Margin %", (row) => formatPercent(row.marginPct)),
            right("growthPct", "Growth", (row) => formatPercent(row.growthPct)),
          ]}
        />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Profitability" description="Contribution margin on the top products." />
          <MiniTable
            empty="No margin data in this window."
            rows={profitability.map((row) => ({ ...row, id: row.prodId }))}
            columns={[
              { key: "name", label: "Product", render: (row) => <ProductName row={row} onOpen={openProduct} /> },
              right("revenue", "Revenue", (row) => formatINR(row.revenue)),
              right("margin", "Margin", (row) => formatINR(row.margin)),
              right("marginPct", "Margin %", (row) => formatPercent(row.marginPct)),
              { key: "status", label: "Status", render: (row) => <Badge tone={PROFIT_TONE[row.status] ?? "neutral"}>{row.status}</Badge> },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Returns (RTO)" description={`${formatPercent(rto.rtoPct)} of ${formatNumber(rto.orders)} orders · ${formatNumber(rto.delivered)} delivered`} />
          <MiniTable
            empty="No returns in this window."
            rows={rto.topProducts.map((row) => ({ ...row, id: row.prodId }))}
            columns={[
              { key: "name", label: "Product", render: (row) => <ProductName row={row} onOpen={openProduct} /> },
              right("orders", "Orders", (row) => formatNumber(row.orders)),
              right("delivered", "Delivered", (row) => formatNumber(row.delivered)),
              right("rtoOrders", "RTO", (row) => formatNumber(row.rtoOrders)),
              right("rtoPct", "RTO %", (row) => formatPercent(row.rtoPct)),
            ]}
          />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {[
          ["Demand by state", demand.byState],
          ["Demand by district", demand.byDistrict],
          ["Demand by category", demand.byCrop],
          ["Demand by season", demand.bySeason],
        ].map(([title, rows]) => (
          <Card key={title}>
            <CardHeader title={title} />
            <MiniTable empty="No orders in this window." rows={rows.map((row, index) => ({ ...row, id: `${row.location}-${row.prodId}-${index}` }))} columns={demandColumns(openProduct)} />
          </Card>
        ))}
      </div>

      <ProductActivity feed={feed} feedError={feedError} range={range} onOpenProduct={openProduct} />
      <ProductInspect card={card} productId={productId} filters={filters} onClose={() => { setCard(null); setProductId(null); }} onBack={() => setProductId(null)} onOpenProduct={openProduct} />
    </>
  );
}
