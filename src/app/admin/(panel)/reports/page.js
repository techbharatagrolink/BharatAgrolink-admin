import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { reportGroups } from "@/lib/content/admin/reports";
import { PageHeader } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState, PermissionDenied } from "@/components/ui/states";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const { user, allowed } = await checkPermission("reports");
  if (!allowed) return (<><PageHeader title="Reports" /><PermissionDenied module="reports" /></>);
  const groups = reportGroups.map((g) => ({ ...g, reports: g.reports.filter((r) => can(user, r.permission)) })).filter((g) => g.reports.length);

  return (
    <>
      <PageHeader title="Reports" description="Open a report, filter it by date, status or vendor, then use Export CSV. Exports run on the server with your permissions and are logged." />
      {groups.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((g) => (
            <Card key={g.group}>
              <CardHeader title={g.group} />
              <ul className="divide-y divide-line">
                {g.reports.map((r) => (
                  <li key={r.key}>
                    <Link href={r.href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{r.title}</span>
                        <span className="block text-[13px] text-ink-muted">{r.description}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-ink-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState title="No reports available" description="Your role does not include any of the modules reports are built from." /></Card>
      )}
    </>
  );
}
