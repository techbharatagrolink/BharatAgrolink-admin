import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getScripts } from "@/lib/services/admin/parity/support-admin";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ScriptsForm } from "@/components/admin/parity/support-admin/scripts-form";

export const metadata = { title: "Script Settings" };

export default async function ScriptSettingsPage() {
  const { user, allowed } = await checkPermission("settings.scripts");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Script Settings" />
        <PermissionDenied module="script settings" />
      </>
    );
  }

  const { data, error } = await getScripts(user);

  return (
    <>
      <PageHeader title="Script Settings" description="Google, Facebook Pixel and Tag Manager snippets added to every storefront page." />
      {error ? (
        <ApiUnavailable error={error} what="the script settings" />
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <ScriptsForm values={data} canEdit={can(user, "settings.scripts", "edit")} />
          </CardBody>
        </Card>
      )}
    </>
  );
}
