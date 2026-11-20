import { Suspense } from "react";
import { CircleAlert, CircleCheck, CircleDashed, CircleOff, Clock } from "lucide-react";
import { PageHeader, Notice } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { formatDate, formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SeoNav } from "./seo-nav";
import { SeoRange } from "./seo-range";

/**
 * Shared pieces of the SEO & AI Command Center screens (task #104).
 * Spec rule: a value is shown only when the API returned one; otherwise "Data unavailable"
 * with the reason. Status is always written out in words, never shown by colour alone.
 */

/** Permission gate + header + section tabs. Render `denied` when it is set. */
export async function seoPage({ title, description, range }) {
  const { user, allowed } = await checkPermission("seo");
  const nav = (
    <Suspense fallback={<div className="mb-4 h-9 border-b border-line" />}>
      <SeoNav />
    </Suspense>
  );
  if (!allowed)
    return {
      user,
      denied: (
        <>
          <PageHeader title={title} />
          <PermissionDenied module="the SEO & AI Command Center" />
        </>
      ),
    };
  return {
    user,
    canEdit: can(user, "seo", "edit"),
    canAdd: can(user, "seo", "add"),
    denied: null,
    header: (rangeData) => (
      <>
        <PageHeader title={title} description={description} actions={range ? <SeoRange range={rangeData} /> : null} />
        {nav}
      </>
    ),
  };
}

/** API error, or the "tables not created yet" state. Returns null when the data is usable. */
export function SeoLoadState({ result, what }) {
  if (result.error) return <ApiUnavailable error={result.error} what={what} />;
  if (result.data?.setUp === false)
    return (
      <Notice tone="warning" title="Setup pending">
        {result.data.reason} Once the database migration has been run, this screen fills in automatically.
      </Notice>
    );
  return null;
}

export function RangeNote({ range }) {
  if (!range) return null;
  return (
    <p className="mb-2 text-xs text-ink-muted">
      {formatDate(range.from)} – {formatDate(range.to)} ({range.days} days), compared with {formatDate(range.comparison.from)} – {formatDate(range.comparison.to)}.
    </p>
  );
}

const formatValue = (unit, v) => (unit === "inr" ? formatINR(v) : unit === "score100" ? `${formatNumber(v)} / 100` : formatNumber(v));

/** One KPI card: value + change + source + last sync, or "Data unavailable" + why. */
export function KpiCard({ kpi }) {
  const missing = kpi.status === "unavailable" || kpi.value == null;
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-3.5">
      <p className="text-[12.5px] font-medium text-ink-muted">{kpi.label}</p>
      {missing ? (
        <>
          <p className="mt-1.5 text-base font-semibold text-ink-soft">Data unavailable</p>
          <p className="mt-1 text-xs text-ink-muted">{kpi.reason}</p>
        </>
      ) : (
        <>
          <p className="mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular">{formatValue(kpi.unit, kpi.value)}</p>
          <p className="mt-1 text-xs">
            {kpi.change != null ? (
              <span className={cn("font-medium", kpi.change >= 0 ? "text-success-ink" : "text-danger-ink")}>
                {kpi.change >= 0 ? "▲" : "▼"} {Math.abs(kpi.change).toFixed(1)}% vs previous period
              </span>
            ) : (
              <span className="text-ink-muted">{kpi.note ?? "No comparison available"}</span>
            )}
          </p>
          {kpi.sample && (
            <p className="mt-0.5 text-xs text-ink-muted">
              {formatNumber(kpi.sample.answersChecked)} answers checked · {kpi.sample.method}
            </p>
          )}
          {kpi.status === "stale" && <p className="mt-0.5 text-xs font-medium text-warning-ink">Stale: last sync is older than expected</p>}
        </>
      )}
      <p className="mt-auto pt-2 text-[11px] text-ink-muted">
        Source: {kpi.source}
        {kpi.lastSyncAt ? ` · synced ${formatDateTime(kpi.lastSyncAt)}` : ""}
      </p>
    </div>
  );
}

const STATES = {
  ok: { label: "Connected", tone: "success", icon: CircleCheck },
  stale: { label: "Stale", tone: "warning", icon: Clock },
  failed: { label: "Sync failed", tone: "danger", icon: CircleAlert },
  never_run: { label: "Not synced yet", tone: "info", icon: CircleDashed },
  not_connected: { label: "Not connected", tone: "neutral", icon: CircleOff },
};

export function IntegrationBadge({ state }) {
  const s = STATES[state] ?? STATES.not_connected;
  const Icon = s.icon;
  return (
    <Badge tone={s.tone}>
      <Icon className="mr-1 inline size-3.5 align-[-2px]" aria-hidden />
      {s.label}
    </Badge>
  );
}

/** Data sources and their sync state. */
export function IntegrationsCard({ integrations, title = "Data sources", description }) {
  return (
    <Card className="min-w-0">
      <CardHeader title={title} description={description ?? "Where each number comes from and when it last synced."} />
      <ul className="divide-y divide-line">
        {integrations.map((i) => (
          <li key={i.key} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
            <span className="min-w-0">
              <span className="font-medium text-ink">{i.label}</span>
              <span className="block text-xs text-ink-muted">
                {i.lastSuccessAt ? `Last successful sync ${formatDateTime(i.lastSuccessAt)}` : "No successful sync yet"}
                {i.lastError?.summary ? ` · ${i.lastError.summary}` : ""}
              </span>
            </span>
            <IntegrationBadge state={i.state} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Body text for a panel that has nothing real to show yet. */
export function Unavailable({ children, className }) {
  return (
    <div className={cn("px-4 py-6 text-center", className)}>
      <p className="text-sm font-medium text-ink-soft">Data unavailable</p>
      {children && <p className="mx-auto mt-1 max-w-md text-xs text-ink-muted">{children}</p>}
    </div>
  );
}
