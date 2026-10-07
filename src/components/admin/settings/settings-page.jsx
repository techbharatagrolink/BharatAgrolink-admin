import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getSettings, SETTINGS_SECTIONS } from "@/lib/services/admin/settings";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { SettingsForm } from "./settings-form";

export async function SettingsPage({ section, description }) {
  const permission = SETTINGS_SECTIONS[section]?.permission ?? "settings";
  const { user, allowed } = await checkPermission(permission);
  const data = await getSettings(section, user);
  if (!data) return (<><PageHeader title="Settings" /><PermissionDenied module="settings" /></>);
  if (!allowed) return (<><PageHeader title={data.title} /><PermissionDenied module={data.title.toLowerCase()} /></>);

  return (
    <>
      <PageHeader title={data.title} description={description} />
      {data.error ? <Notice className="mb-4" tone="danger">{data.error}</Notice> : null}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardBody>
            <SettingsForm section={section} fields={data.fields} values={data.values} canEdit={can(user, data.permission, "edit")} />
          </CardBody>
        </Card>
        <div className="min-w-0 space-y-4">
          {data.secrets.length > 0 && (
            <Card>
              <CardHeader title="Credentials" description="Passwords are stored in the settings table. Leave the field blank to keep the saved value. The saved password is never shown." />
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
