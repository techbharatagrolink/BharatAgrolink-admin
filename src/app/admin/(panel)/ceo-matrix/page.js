import { checkPermission } from "@/lib/auth/session";
import { getCeoMatrix } from "@/lib/services/admin/parity/marketing";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { RangeFilter } from "@/components/admin/parity/marketing/range-filter";
import { Markdown } from "@/components/admin/parity/marketing/markdown";
import { formatStamp } from "@/components/admin/parity/marketing/format";

export const metadata = { title: "CEO Decision Matrix" };

const YMD = /^\d{4}-\d{2}-\d{2}$/;
const PRESETS = [{ value: "", label: "Lifetime" }];
const SIGNALS = [
  { title: "Orders ↑", text: "Orders pichhle period se zyada" },
  { title: "Sales ↑", text: "Paisa pichhle period se zyada" },
  { title: "RTO ↓", text: "Loss control me" },
  { title: "Profit 🟢", text: "Net positive" },
  { title: "Alerts 🔴", text: "Koi emergency issue" },
];
const STATUS_TONES = {
  healthy: "bg-success-bg text-success-ink",
  risk: "bg-danger-bg text-danger-ink",
  leakage: "bg-danger-bg text-danger-ink",
  danger: "bg-danger-bg text-danger-ink",
  demand_crash: "bg-danger-bg text-danger-ink",
  ops_issue: "bg-info-bg text-info-ink",
};
const INDICATOR = { green: "bg-[#10b981]", red: "bg-[#ef4444]", yellow: "bg-[#f59e0b]", "yellow/red": "bg-[#f59e0b]" };
const inr = (v) => `₹${(Number(v) || 0).toLocaleString("en-IN")}`;

function Arrow({ dir }) {
  return <span className={cn("text-xl font-bold", dir === "up" ? "text-[#10b981]" : "text-[#ef4444]")}>{dir === "up" ? "↑" : "↓"}</span>;
}

function StatusItem({ label, value, valueClass, change, good }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 text-center">
      <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold text-ink tabular", valueClass)}>{value}</p>
      {change && <p className={cn("mt-1 text-sm font-medium", good ? "text-success-ink" : "text-danger-ink")}>{change}</p>}
    </div>
  );
}

const move = (value, suffix = "%", invert = false) => {
  const n = Number(value) || 0;
  if (n === 0) return null;
  return { text: `${n > 0 ? "↑" : "↓"} ${Math.abs(n)}${suffix}`, good: invert ? n < 0 : n > 0 };
};

/** ceo_decision_matrix.php: the five-signal status, the matched scenario, the AI matrix and the master matrix. */
export default async function CeoMatrixPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.ceo");
  if (!allowed) return (<><PageHeader title="CEO Decision Matrix" /><PermissionDenied module="the CEO decision matrix" /></>);
  const sp = await searchParams;
  const ranged = YMD.test(sp.from ?? "") && YMD.test(sp.to ?? "") && sp.from <= sp.to;
  const result = await getCeoMatrix(ranged ? { from: sp.from, to: sp.to } : {}, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="CEO Decision Matrix" /><ApiUnavailable error={result.error} what="the CEO decision matrix" /></>);
  const d = result.data;
  const orders = move(d.changes.orders);
  const revenue = move(d.changes.revenue);
  const rto = move(d.changes.rto, "%", true);
  const profitStatus = d.signals.profit === "red" ? "🔴 Negative" : d.signals.profit === "yellow" ? "🟡 Low Margin" : "🟢 Positive";
  const period = d.from ? `${formatStamp(d.from, { time: false })} – ${formatStamp(d.to, { time: false })}` : "Lifetime";

  return (
    <>
      <PageHeader
        title="CEO Decision Matrix"
        description={`5 Signal System - 1 Minute Decision Tool · ${period}, compared with ${formatStamp(d.previousFrom, { time: false })} – ${formatStamp(d.previousTo, { time: false })}`}
      />
      <RangeFilter presets={PRESETS} active={d.from ? "calendar" : ""} from={d.from ?? ""} to={d.to ?? ""} />

      <Card className="mt-4">
        <CardHeader title="📊 Current business status" />
        <CardBody className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatusItem label="Orders" value={formatNumber(d.current.orders)} change={orders?.text} good={orders?.good} />
            <StatusItem label="Sales" value={inr(d.current.revenue)} change={revenue?.text} good={revenue?.good} />
            <StatusItem label="RTO %" value={`${d.current.rtoPercentage.toFixed(2)}%`} change={rto?.text} good={rto?.good} />
            <StatusItem label="Profit" value={inr(d.current.profit)} change={profitStatus} good={d.signals.profit === "green"} />
            {d.alerts.length ? (
              <StatusItem label="Alerts" value={`🔴 ${d.alerts.length}`} valueClass="text-[#ef4444]" change={d.alerts.join(", ")} good={false} />
            ) : (
              <StatusItem label="Alerts" value="✓ None" valueClass="text-[#10b981]" change="All Clear" good />
            )}
          </div>

          <div className="rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] p-5 text-white">
            <h2 className="text-lg font-semibold">Current Business Status: {d.businessStatus}</h2>
            <p className="mt-1">
              <strong>CEO Action Required:</strong> {d.ceoAction}
            </p>
          </div>

          <section className="rounded-lg border-2 border-line bg-surface-muted p-5" aria-labelledby="ceo-ai-heading">
            <h3 id="ceo-ai-heading" className="mb-3 text-base font-semibold text-ink">
              🤖 CEO-READY AI DECISION MATRIX
            </h3>
            {d.ai.available ? (
              <>
                {(d.ai.stale || !d.ai.hashMatched) && (
                  <Notice tone="warning" className="mb-3">
                    These recommendations were generated on {formatStamp(d.ai.updatedAt)} for {d.ai.hashMatched ? "these figures" : "an earlier set of figures"}.
                  </Notice>
                )}
                <Markdown source={d.ai.recommendations} numberedHeadings className="text-left" />
              </>
            ) : (
              <p className="text-center text-sm text-ink-muted">No AI recommendations have been generated yet.</p>
            )}
          </section>
        </CardBody>
      </Card>

      <details className="group mt-4 rounded-xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">Signal definitions and the CEO master matrix</summary>
        <div className="space-y-4 border-t border-line p-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-ink">✅ Signal definitions (reminder)</h2>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              {SIGNALS.map((s) => (
                <div key={s.title} className="rounded-lg border border-line bg-surface-muted p-3 text-sm">
                  <strong className="block text-ink">{s.title}</strong>
                  <span className="text-ink-soft">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-ink">📊 CEO master matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">CEO master matrix; the current scenario is highlighted</caption>
                <thead className="bg-surface-muted text-xs font-semibold text-ink-muted">
                  <tr>
                    {["Orders", "Sales", "RTO", "Profit", "Alerts", "Business Status", "CEO Action"].map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.matrix.map((row) => {
                    const current = row.key === d.scenario;
                    return (
                      <tr key={row.key} className={cn("text-center", current && "bg-warning-bg font-semibold outline-2 -outline-offset-2 outline-[#f59e0b]")} aria-current={current ? "true" : undefined}>
                        <td className="px-3 py-2"><Arrow dir={row.orders} /></td>
                        <td className="px-3 py-2"><Arrow dir={row.sales} /></td>
                        <td className="px-3 py-2"><Arrow dir={row.rto} /></td>
                        <td className="px-3 py-2">
                          <span className={cn("inline-block size-4 rounded-full", INDICATOR[row.profit])} role="img" aria-label={`Profit ${row.profit}`} />
                        </td>
                        <td className="px-3 py-2">
                          {row.alerts ? <span className="inline-block size-4 rounded-full bg-[#ef4444]" role="img" aria-label="Alerts" /> : <span className="text-ink-muted" aria-label="No alerts">✗</span>}
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_TONES[row.key] ?? "bg-warning-bg text-warning-ink")}>{row.status}</span>
                        </td>
                        <td className="px-3 py-2 text-left">{row.action}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </details>
    </>
  );
}
