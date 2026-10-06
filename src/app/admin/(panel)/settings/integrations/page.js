import { checkPermission } from "@/lib/auth/session";
import { getIntegrations } from "@/lib/services/admin/settings";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";

export const metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const { allowed } = await checkPermission("settings");
  if (!allowed) return (<><PageHeader title="Integrations" /><PermissionDenied module="settings" /></>);
  const rows = await getIntegrations();

  return (
    <>
      <PageHeader title="Integrations" description="Connection status of third-party services. Keys are managed as server environment variables and are never displayed." />
      <Notice className="mb-4">To connect a service, add its variables in Vercel → Project → Settings → Environment Variables and redeploy.</Notice>
      <Card>
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.name} className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-ink">{r.name}</p>
                <p className="text-sm text-ink-muted">{r.purpose}</p>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  {r.keys.map((k) => <code key={k} className="rounded bg-neutral-bg px-1.5 py-0.5 text-[11px] text-ink-soft">{k}</code>)}
                </p>
              </div>
              {r.configured ? <Badge tone="success">Connected</Badge> : r.partial ? <Badge tone="warning">Partially configured</Badge> : <Badge tone="neutral">Not configured</Badge>}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
