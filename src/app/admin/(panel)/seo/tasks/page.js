import { loadSeo } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";

export const metadata = { title: "Tasks & Team" };

const STATUS = {
  PENDING: { label: "Pending", tone: "neutral" },
  IN_PROGRESS: { label: "In progress", tone: "info" },
  BLOCKED: { label: "Blocked", tone: "danger" },
  COMPLETED: { label: "Completed", tone: "success" },
};

/** Priority action tasks and milestones (read-only for now; create/assign comes with subtasks 9-10). */
export default async function SeoTasksPage() {
  const page = await seoPage({ title: "Tasks & Team", description: "Who is fixing what, by when, and the milestones they lead to." });
  if (page.denied) return page.denied;

  const [tasks, milestones] = await Promise.all([loadSeo(page.user, "tasks"), loadSeo(page.user, "milestones")]);
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
  return (
    <>
      {page.header(null)}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title="Priority action tasks" description="Sorted by status, due date and priority." />
          {list.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-ink-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Task</th>
                    <th className="px-4 py-2 font-medium">Priority</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {list.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-2 text-ink">{t.title}</td>
                      <td className="px-4 py-2 text-xs">{t.priority}</td>
                      <td className="px-4 py-2">
                        <Badge tone={STATUS[t.status]?.tone}>{STATUS[t.status]?.label ?? t.status}</Badge>
                      </td>
                      <td className="px-4 py-2 text-xs">{t.due_date ? formatDate(t.due_date) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Unavailable>No tasks yet. Creating and assigning tasks is the next part of this screen.</Unavailable>
          )}
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Milestones" />
          {ms.length ? (
            <ul className="divide-y divide-line">
              {ms.map((m) => (
                <li key={m.id} className="px-4 py-2 text-sm">
                  <span className="block text-ink">{m.title}</span>
                  <span className="text-xs text-ink-muted">
                    {m.target_date ? formatDate(m.target_date) : "No target date"} · {m.completion_percent == null ? "no tasks linked" : `${m.completion_percent}% done`}
                  </span>
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
