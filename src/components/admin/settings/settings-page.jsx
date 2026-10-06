import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getSettings } from "@/lib/services/admin/settings";
import { PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { SettingsForm } from "./settings-form";

export async function SettingsPage({ section, description }) {
  const data = await getSettings(section);
  const { user, allowed } = await checkPermission(data.permission);
  if (!allowed) return (<><PageHeader title={data.title} /><PermissionDenied module={data.title.toLowerCase()} /></>);

  return (
    <>
      <PageHeader title={data.title} description={description} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardBody>
            <SettingsForm section={section} fields={data.fields} values={data.values} canEdit={can(user, data.permission, "edit")} />
          </CardBody>
        </Card>
        <div className="min-w-0 space-y-4">
          {data.secrets.length > 0 && (
            <Card>
              <CardHeader title="Credentials" description="Secrets are set as server environment variables (Vercel → Settings → Environment Variables) and are never shown here." />
              <CardBody>
                <ul className="space-y-2">
                  {data.secrets.map((s) => (
                    <li key={s.env} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="block text-ink">{s.label}</span>
                        <span className="font-mono text-[11px] text-ink-muted">{s.env}</span>
                      </span>
                      {s.configured ? <Badge tone="success">Configured</Badge> : <Badge tone="warning">Not set</Badge>}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="API" />
            <CardBody>
              <p className="text-xs break-words text-ink-muted">{data.api}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
