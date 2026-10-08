"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { BarChart, DonutChart, LineChart } from "@/components/charts/interactive";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/form";
import { Notice, ProgressBar } from "@/components/ui/page";
import { formatDate, formatINR, formatNumber } from "@/lib/format";
import { agentPerformanceAction, salesByLeadsAction } from "@/lib/actions/admin/parity/crm";

const STATUS_TONE = { Excellent: "success", Good: "info", Average: "warning", "Low Performance": "danger" };
const rateTone = (rate) => (rate >= 20 ? "brand" : rate >= 10 ? "info" : rate >= 5 ? "warning" : "danger");

function Spinner() {
  return (
    <div className="flex justify-center py-10 text-ink-muted">
      <Loader2 className="size-5 animate-spin" aria-label="Loading" />
    </div>
  );
}

function Metric({ label, value, className }) {
  return (
    <div className="rounded-lg border border-line p-3 text-center">
      <p className={`text-lg font-bold tabular ${className || "text-ink"}`}>{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

/** get_agent_detailed_performance.php modal. */
function AgentDialog({ agentId, onClose }) {
  const [state, setState] = useState({ loading: true, result: null });
  useEffect(() => {
    let live = true;
    agentPerformanceAction(agentId).then((result) => live && setState({ loading: false, result }));
    return () => {
      live = false;
    };
  }, [agentId]);
  const d = state.result?.ok ? state.result.data : null;
  return (
    <Dialog open onClose={onClose} size="xl" title={d ? d.agent.name : "Agent performance"} description={d ? `${d.agent.role}${d.agent.joined ? ` · Joined ${d.agent.joined}` : ""}` : undefined}>
      {state.loading ? (
        <Spinner />
      ) : !d ? (
        <Notice tone="danger">{state.result.message}</Notice>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Metric label="Total Leads" value={formatNumber(d.metrics.totalLeads)} />
            <Metric label="Converted" value={formatNumber(d.metrics.converted)} className="text-success-ink" />
            <Metric label="Conversion Rate" value={`${d.metrics.rate}%`} className="text-brand-700" />
            <Metric label="Dead Leads" value={formatNumber(d.metrics.dead)} className="text-danger-ink" />
            <Metric label="Total Revenue" value={formatINR(d.metrics.totalRevenue)} className="text-success-ink" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">7-Day Conversion Trend</p>
              <LineChart data={d.trend.map((t) => ({ label: formatDate(t.day).replace(/ \d{4}$/, ""), value: t.value }))} series={[{ key: "value", label: "Conversions" }]} label="7-day conversion trend" height={200} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Lead Status Breakdown</p>
              <DonutChart data={d.statusBreakdown.filter((s) => s.value > 0)} label="Lead status breakdown" centerLabel="Leads" centerValue={formatNumber(d.metrics.totalLeads)} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Recent Conversions</p>
            {d.recent.length === 0 ? (
              <p className="text-sm text-ink-muted">No recent conversions.</p>
            ) : (
              <ul className="divide-y divide-line rounded-lg border border-line">
                {d.recent.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{r.name || "Lead"}</p>
                      <p className="text-xs text-ink-muted">Converted on {formatDate(r.convertedAt || r.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="success">{r.status}</Badge>
                      {r.orderId && (
                        <Link href={`/admin/orders/${encodeURIComponent(r.orderId)}`} className="text-xs font-medium text-brand-700 hover:underline">
                          #{r.orderId}
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}

/** get_sales_by_leads_modal_data.php: per-agent lead revenue, total (optionally dated) or today. */
function SalesByLeadsDialog({ type, onClose }) {
  const [range, setRange] = useState({ from: "", to: "" });
  const [state, setState] = useState({ loading: true, result: null });
  useEffect(() => {
    if (type === "total" && Boolean(range.from) !== Boolean(range.to)) return undefined;
    let live = true;
    salesByLeadsAction({ type, ...range }).then((result) => live && setState({ loading: false, result }));
    return () => {
      live = false;
    };
  }, [type, range]);
  const d = state.result?.ok ? state.result.data : null;
  return (
    <Dialog open onClose={onClose} size="xl" title={type === "today" ? "Today Sales by Leads" : "Total Sales by Leads"}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="rounded-lg bg-brand-600 px-4 py-3 text-brand-fg">
            <p className="text-[11px] font-semibold tracking-wide uppercase opacity-80">Total Sales</p>
            <p className="text-2xl font-bold tabular">{d ? formatINR(d.totalSales) : "—"}</p>
          </div>
          {type === "total" && (
            <div className="flex flex-wrap items-end gap-2">
              <Field label="From Date">
                {({ id }) => <input id={id} type="date" value={range.from} max={range.to || undefined} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} className="h-8 rounded-md border border-line-strong bg-surface px-2 text-sm" />}
              </Field>
              <Field label="To Date">
                {({ id }) => <input id={id} type="date" value={range.to} min={range.from || undefined} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} className="h-8 rounded-md border border-line-strong bg-surface px-2 text-sm" />}
              </Field>
              {(range.from || range.to) && (
                <Button size="sm" onClick={() => setRange({ from: "", to: "" })}>
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
        {state.loading ? (
          <Spinner />
        ) : !d ? (
          <Notice tone="danger">{state.result.message}</Notice>
        ) : d.rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">No sales agents found.</p>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-max text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted text-xs text-ink-muted">
                  <th className="px-3 py-2 font-semibold">Agent</th>
                  <th className="px-3 py-2 text-right font-semibold">Total Leads</th>
                  <th className="px-3 py-2 text-right font-semibold">Converted Leads</th>
                  <th className="px-3 py-2 text-right font-semibold">Total Revenue</th>
                  <th className="px-3 py-2 text-right font-semibold">Avg Amount/Lead</th>
                  <th className="px-3 py-2 text-right font-semibold">Conversion Rate</th>
                  <th className="px-3 py-2 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-ink-muted">{r.role}</p>
                    </td>
                    <td className="px-3 py-2 text-right tabular">{formatNumber(r.totalLeads)}</td>
                    <td className="px-3 py-2 text-right tabular text-success-ink">{formatNumber(r.converted)}</td>
                    <td className="px-3 py-2 text-right font-medium tabular">{formatINR(r.revenue)}</td>
                    <td className="px-3 py-2 text-right tabular">{formatINR(r.avgPerLead)}</td>
                    <td className="px-3 py-2 text-right tabular">{r.rate}%</td>
                    <td className="px-3 py-2 text-right">
                      <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Dialog>
  );
}

/** sales_performance_report.php: KPI cards, charts, agent table and the two drill-down modals. */
export function TeamPerformance({ rows, summary }) {
  const [search, setSearch] = useState("");
  const [agent, setAgent] = useState(null);
  const [sales, setSales] = useState(null);
  const needle = search.trim().toLowerCase();
  const visible = needle ? rows.filter((r) => `${r.name} ${r.role ?? ""} ${r.status}`.toLowerCase().includes(needle)) : rows;
  const chartRows = rows.map((r) => ({ label: r.name, leads: r.totalLeads, converted: r.converted }));

  const kpi = (label, value, onClick) => (
    <button key={label} type="button" onClick={onClick} disabled={!onClick} className="rounded-xl border border-line bg-surface p-3.5 text-left enabled:hover:border-brand-200 enabled:hover:bg-surface-muted">
      <p className="text-[12.5px] font-medium text-ink-muted">{label}</p>
      <p className="mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular">{value}</p>
      {onClick && <p className="mt-1 text-xs text-brand-700">View agent breakdown</p>}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {kpi("Total Sales by Leads", formatINR(summary.totalSalesByLeads), () => setSales("total"))}
        {kpi("Today Total Sales by Lead", formatINR(summary.todaySalesByLeads), () => setSales("today"))}
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpi("Total Leads", formatNumber(summary.totalLeads))}
        {kpi("Total Conversions", formatNumber(summary.totalConversions))}
        {kpi("Avg Conversion Rate", `${summary.avgRate}%`)}
        {kpi("Top Performer", summary.topPerformer || "-")}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Performance Overview" description="Total leads and conversions per agent" />
          <CardBody>
            <BarChart
              data={chartRows}
              series={[
                { key: "leads", label: "Total Leads" },
                { key: "converted", label: "Conversions" },
              ]}
              label="Leads and conversions per agent"
              height={260}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Conversion Share" />
          <CardBody>
            <DonutChart data={rows.filter((r) => r.converted > 0).map((r) => ({ label: r.name, value: r.converted }))} label="Conversion share per agent" centerLabel="Conversions" centerValue={formatNumber(summary.totalConversions)} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Agent Details"
          description="Click an agent for the detailed report."
          actions={
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agent..."
                aria-label="Search agent"
                className="h-8 w-56 rounded-md border border-line-strong bg-surface pr-2 pl-8 text-sm"
              />
            </div>
          }
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-max text-left text-[13px]">
            <thead>
              <tr className="border-y border-line bg-surface-muted text-xs text-ink-muted">
                <th className="px-4 py-2 font-semibold">Agent</th>
                <th className="px-3 py-2 text-center font-semibold">Total Leads</th>
                <th className="px-3 py-2 text-center font-semibold">Converted</th>
                <th className="px-3 py-2 text-center font-semibold">Dead</th>
                <th className="w-1/4 px-3 py-2 font-semibold">Conversion Rate</th>
                <th className="px-4 py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} onClick={() => setAgent(r.id)} className="cursor-pointer border-b border-line last:border-0 hover:bg-surface-muted">
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => setAgent(r.id)} className="text-left">
                      <span className="block font-medium text-ink">{r.name}</span>
                      <span className="block text-xs text-ink-muted">{r.role}</span>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center tabular">{formatNumber(r.totalLeads)}</td>
                  <td className="px-3 py-2 text-center font-medium tabular text-success-ink">{formatNumber(r.converted)}</td>
                  <td className="px-3 py-2 text-center font-medium tabular text-danger-ink">{formatNumber(r.dead)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-xs font-medium tabular">{r.rate}%</span>
                      <ProgressBar value={r.rate} tone={rateTone(r.rate)} label={`${r.name} conversion rate`} />
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className="inline-flex items-center gap-1.5">
                      <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                      {r.alert && <AlertTriangle className="size-4 text-danger-ink" aria-label="Low conversion alert" />}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-muted">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {agent && <AgentDialog agentId={agent} onClose={() => setAgent(null)} />}
      {sales && <SalesByLeadsDialog type={sales} onClose={() => setSales(null)} />}
    </div>
  );
}
