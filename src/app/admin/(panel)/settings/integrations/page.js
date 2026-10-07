import { checkPermission } from "@/lib/auth/session";
import { getIntegrations } from "@/lib/services/admin/settings";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";

export const metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const { user, allowed } = await checkPermission("settings");
  if (!allowed) return (<><PageHeader title="Integrations" /><PermissionDenied module="settings" /></>);
  const rows = await getIntegrations(user);

  return (
    <>
      <PageHeader title="Integrations" description="Credentials the PHP panel stores in the settings table. Secret values are not shown." />
      <Notice className="mb-4">SMTP and Soft SMS are the integrations that screen writes. A password is configured when that settings row is non-empty.</Notice>
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
