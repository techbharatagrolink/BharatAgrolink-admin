import Link from "next/link";
import { loadSeo } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/page";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { EditTaskButton, MilestoneButton, MODULE_OPTIONS, NewTaskButton, PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/components/admin/seo/task-editor";
import { ExportButton } from "@/components/data-table/export-button";

export const metadata = { title: "Tasks & Team" };

const STATUS_TONE = { PENDING: "neutral", IN_PROGRESS: "info", BLOCKED: "danger", COMPLETED: "success" };
const PRIORITY_TONE = { CRITICAL: "danger", HIGH: "danger", MEDIUM: "warning", LOW: "neutral" };
const label = (opts, v) => opts.find((o) => o.value === v)?.label ?? v;
const todayIst = () => new Date(Date.now() + 5.5 * 3600_000).toISOString().slice(0, 10);

/** Priority action tasks and milestones (task #104, subtasks 9-10). */
export default async function SeoTasksPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({ title: "Tasks & Team", description: "Who is fixing what, by when, and the milestones they lead to." });
  if (page.denied) return page.denied;

  const filters = {
    status: STATUS_OPTIONS.some((o) => o.value === sp.status) ? sp.status : undefined,
    priority: PRIORITY_OPTIONS.some((o) => o.value === sp.priority) ? sp.priority : undefined,
    module: MODULE_OPTIONS.some((o) => o.value === sp.module) ? sp.module : undefined,
    ownerId: /^\d+$/.test(sp.owner ?? "") ? sp.owner : undefined,
    dueBefore: /^\d{4}-\d{2}-\d{2}$/.test(sp.due ?? "") ? sp.due : undefined,
  };
  const [tasks, milestones, owners] = await Promise.all([loadSeo(page.user, "tasks", filters), loadSeo(page.user, "milestones"), loadSeo(page.user, "owners")]);
  const blocked = SeoLoadState({ result: tasks, what: "the SEO tasks" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const list = tasks.data.tasks ?? [];
  const ms = milestones.data?.milestones ?? [];
  const ownerList = Array.isArray(owners.data) ? owners.data : [];
  const today = todayIst();
  const filtered = Object.values(filters).some(Boolean);

  return (
    <>
      {page.header(null)}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader
            title="Priority action tasks"
            description={`${list.length} ${filtered ? "matching" : ""} tasks · open first, soonest due first.`}
            actions={
              <div className="flex items-center gap-2">
                <ExportButton
                  name="seo-tasks"
                  columns={[
                    { label: "Task", value: (t) => t.title },
                    { label: "Module", value: (t) => label(MODULE_OPTIONS, t.module) },
                    { label: "Priority", value: (t) => t.priority },
                    { label: "Status", value: (t) => t.status },
                    { label: "Owner", value: (t) => t.ownerName || "" },
                    { label: "Due Date", value: (t) => t.dueDate || "" },
                    { label: "Estimated Impact", value: (t) => t.impact || "" },
                  ]}
                  rows={list}
                />
                {page.canAdd ? <NewTaskButton owners={ownerList} milestones={ms} /> : null}
              </div>
            }
          />
          <form method="get" className="flex flex-wrap items-end gap-2 border-b border-line px-4 py-2.5 text-xs">
            <FilterSelect name="status" label="Status" value={filters.status} options={STATUS_OPTIONS} />
            <FilterSelect name="priority" label="Priority" value={filters.priority} options={PRIORITY_OPTIONS} />
            <FilterSelect name="module" label="Module" value={filters.module} options={MODULE_OPTIONS} />
            <FilterSelect name="owner" label="Owner" value={filters.ownerId} options={ownerList.map((o) => ({ value: o.id, label: o.name }))} />
            <label className="flex flex-col gap-1 text-ink-muted">
              Due by
              <input type="date" name="due" defaultValue={filters.dueBefore ?? ""} className="h-8 rounded-md border border-line bg-surface px-2 text-ink" />
            </label>
            <button type="submit" className="h-8 rounded-md bg-brand-600 px-3 font-medium text-brand-fg hover:bg-brand-700">
              Apply
            </button>
            {filtered && (
              <Link href="/admin/seo/tasks" className="h-8 px-2 leading-8 text-brand-700 hover:underline">
                Clear
              </Link>
            )}
          </form>
          {list.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="text-left text-xs text-ink-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Task</th>
                    <th className="px-4 py-2 font-medium">Owner</th>
                    <th className="px-4 py-2 font-medium">Priority</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line align-top">
                  {list.map((t) => {
                    const due = t.due_date ? String(t.due_date).slice(0, 10) : null;
                    const overdue = due && due < today && t.status !== "COMPLETED";
                    return (
                      <tr key={t.id}>
                        <td className="max-w-md px-4 py-2.5">
                          <EditTaskButton taskId={t.id} owners={ownerList} milestones={ms}>
                            <span className={cn("font-medium", t.status === "COMPLETED" && "text-ink-muted line-through")}>{t.title}</span>
                          </EditTaskButton>
                          <span className="block text-xs text-ink-muted">
                            {label(MODULE_OPTIONS, t.module)}
                            {t.milestone_title ? ` · ${t.milestone_title}` : ""}
                            {t.source_type === "audit_issue" ? " · from audit issue" : ""}
                          </span>
                          {t.status === "COMPLETED" && t.evidence && <span className="mt-0.5 block break-words text-xs text-success-ink">Evidence: {t.evidence}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-xs">{t.owner_name ?? <span className="text-ink-muted">Unassigned</span>}</td>
                        <td className="px-4 py-2.5">
                          <Badge tone={PRIORITY_TONE[t.priority]}>{label(PRIORITY_OPTIONS, t.priority)}</Badge>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge tone={STATUS_TONE[t.status]}>{label(STATUS_OPTIONS, t.status)}</Badge>
                        </td>
                        <td className={cn("whitespace-nowrap px-4 py-2.5 text-xs", overdue ? "font-medium text-danger-ink" : "text-ink-soft")}>
                          {due ? formatDate(due) : "—"}
                          {overdue && <span className="block">Overdue</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Unavailable>{filtered ? "No tasks match these filters." : "No tasks yet. Create one here, or from an issue on Website Health."}</Unavailable>
          )}
        </Card>

        <Card className="min-w-0">
          <CardHeader title="Milestones" description="Progress = completed linked tasks ÷ linked tasks." actions={page.canAdd ? <MilestoneButton owners={ownerList} /> : null} />
          {ms.length ? (
            <ul className="divide-y divide-line">
              {ms.map((m) => (
                <li key={m.id} className="px-4 py-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{m.title}</span>
                      <span className="text-xs text-ink-muted">
                        {m.target_date ? formatDate(m.target_date) : "No target date"} · {m.owner_name ?? "Unassigned"} · {label(STATUS_OPTIONS, m.status)}
                      </span>
                    </span>
                    {page.canEdit && <MilestoneButton milestone={m} owners={ownerList} />}
                  </div>
                  {m.completion_percent == null ? (
                    <p className="mt-1 text-xs text-ink-muted">No tasks linked yet</p>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={m.completion_percent} label={`${m.title} progress`} />
                      <span className="shrink-0 text-xs tabular text-ink-soft">
                        {m.completion_percent}% ({m.tasks_completed}/{m.task_count})
                      </span>
                    </div>
                  )}
                  {m.completion_criteria && <p className="mt-1 text-xs text-ink-muted">Done when: {m.completion_criteria}</p>}
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

function FilterSelect({ name, label: text, value, options }) {
  return (
    <label className="flex flex-col gap-1 text-ink-muted">
      {text}
      <select name={name} defaultValue={value ?? ""} className="h-8 rounded-md border border-line bg-surface px-2 text-ink">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
