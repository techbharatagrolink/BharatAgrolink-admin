import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getLoginModal } from "@/lib/services/admin/parity/support-admin";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { LoginModalForm } from "@/components/admin/parity/support-admin/login-modal-form";

export const metadata = { title: "Login Modal" };

export default async function LoginModalSettingsPage() {
  const { user, allowed } = await checkPermission("settings.loginModal");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Signup Modal Settings" />
        <PermissionDenied module="signup modal settings" />
      </>
    );
  }

  const { data, error } = await getLoginModal(user);

  return (
    <>
      <PageHeader title="Signup Modal Settings" description="Manage the title, subtitle, and image displayed in the signup modal." />
      {error ? (
        <ApiUnavailable error={error} what="the signup modal settings" />
      ) : (
        <Card className="max-w-3xl">
          <CardBody>
            <LoginModalForm key={`${data.title}|${data.subtitle}|${data.image}`} values={data} canEdit={can(user, "settings.loginModal", "edit")} />
          </CardBody>
        </Card>
      )}
    </>
  );
}
