import Link from "next/link";
import { loadSeo, rangeParams } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/page";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { IntegrationsCard, KpiCard, RangeNote, SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { ProgressToTarget, ReadinessCategories, ReadinessGauge, RecalcButton } from "@/components/admin/seo/readiness";

export const metadata = { title: "SEO & AI Command Center" };

const TASK_TONE = { PENDING: "neutral", IN_PROGRESS: "info", BLOCKED: "danger", COMPLETED: "success" };
const TASK_LABEL = { PENDING: "Pending", IN_PROGRESS: "In progress", BLOCKED: "Blocked", COMPLETED: "Completed" };

/**
 * CEO Overview (task #104, subtasks 1-2): KPI cards, readiness, data sources, tasks and milestones.
 * Every value comes from GET /admin/seo/dashboard; nothing here is a placeholder number.
 */
export default async function SeoOverviewPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({
    title: "SEO & AI Command Center",
    description: "Organic search, AI visibility, organic orders and website health in one place.",
    range: true,
  });
  if (page.denied) return page.denied;

  const query = rangeParams(sp);
  const [dash, tasks, milestones] = await Promise.all([
    loadSeo(page.user, "dashboard", query),
    loadSeo(page.user, "tasks"),
    loadSeo(page.user, "milestones"),
  ]);
  const blocked = SeoLoadState({ result: dash, what: "the SEO & AI Command Center" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const d = dash.data;
  const r = d.readiness;
  return (
    <>
      {page.header(d.range)}
      <RangeNote range={d.range} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {d.kpis.map((k) => (
          <KpiCard key={k.key} kpi={k} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader
            title="Overall Readiness Score"
            description={
              r.latest
                ? `Calculated ${formatDateTime(r.latest.calculatedAt)} · methodology ${r.methodologyVersion} · weights editable in Settings. Click a category to see its checks.`
                : `Target ${r.target}%+. Weights are editable in Settings.`
            }
            actions={page.canEdit ? <RecalcButton /> : null}
          />
          {r.latest ? (
            <div className="grid gap-4 px-4 py-3 sm:grid-cols-[minmax(0,13rem)_1fr]">
              <div>
                <ReadinessGauge score={r.latest.totalScore} coverage={r.latest.coverage} target={r.target} />
                {r.latest.totalScore != null && (
                  <p className="mt-2 text-center text-xs text-ink-soft">
                    {r.latest.toTarget > 0 ? `${formatNumber(r.latest.toTarget)} points to the ${r.target}% target` : `Target ${r.target}% reached`}
                  </p>
                )}
                {r.reason && <p className="mt-2 text-center text-xs text-warning-ink">{r.reason}</p>}
              </div>
              <ReadinessCategories categories={r.categories} />
            </div>
          ) : (
            <>
              <Unavailable>{r.reason} It will be calculated from audit checks once the data sources have synced; missing data never counts as a pass.</Unavailable>
              <ul className="divide-y divide-line border-t border-line">
                {r.categories.map((c) => (
                  <li key={c.key} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span className="text-ink">{c.label}</span>
                    <span className="text-xs text-ink-muted">Not scored · weight {c.weight ?? "—"}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className="min-w-0">
          <CardHeader
            title={`Progress to Target (${r.target}%+)`}
            description="Score at the end of each month (current month = latest). Actual values only; nothing is projected."
          />
          {r.history.length ? (
            <div className="px-4 py-3">
              <ProgressToTarget history={r.history} target={r.target} />
              {r.history.length === 1 && <p className="mt-1 text-xs text-ink-muted">The first month is being recorded; the line grows one point per month.</p>}
            </div>
          ) : (
            <Unavailable>No readiness score has been recorded yet, so there is no history to chart.</Unavailable>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <IntegrationsCard integrations={d.integrations} />

        <Card className="min-w-0">
          <CardHeader
            title="Priority Action Tasks"
            actions={
              <Link href="/admin/seo/tasks" className="text-xs font-medium text-brand-700 hover:underline">
                All tasks
              </Link>
            }
          />
          {tasks.data?.tasks?.length ? (
            <ul className="divide-y divide-line">
              {tasks.data.tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                  <span className="min-w-0">
                    <span className={t.status === "COMPLETED" ? "block truncate text-ink-muted line-through" : "block truncate text-ink"}>{t.title}</span>
                    <span className="text-xs text-ink-muted">
                      {t.owner_name ?? "Unassigned"}
                      {t.due_date ? ` · due ${formatDate(t.due_date)}` : ""}
                    </span>
                  </span>
                  <Badge tone={TASK_TONE[t.status]}>{TASK_LABEL[t.status] ?? t.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable>No tasks yet. Tasks will be created from audit findings or added by hand.</Unavailable>
          )}
        </Card>

        <Card className="min-w-0">
          <CardHeader title="Next Milestones" />
          {milestones.data?.milestones?.length ? (
            <ul className="divide-y divide-line">
              {milestones.data.milestones.map((m) => (
                <li key={m.id} className="px-4 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block truncate text-ink">{m.title}</span>
                      <span className="text-xs text-ink-muted">{m.target_date ? formatDate(m.target_date) : "No target date"}</span>
                    </span>
                    <span className="shrink-0 text-xs text-ink-muted">{m.completion_percent == null ? "No tasks linked" : `${m.completion_percent}%`}</span>
                  </div>
                  {m.completion_percent != null && <ProgressBar value={m.completion_percent} className="mt-1.5" label={`${m.title} progress`} />}
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable>No milestones yet.</Unavailable>
          )}
        </Card>
      </div>
    </>
  );
}
