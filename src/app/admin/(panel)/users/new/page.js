import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getStaffRoles } from "@/lib/services/admin/parity/support-admin";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { StaffForm } from "@/components/admin/parity/support-admin/staff-form";

export const metadata = { title: "Add Staff" };

export default async function AddStaffPage() {
  const { user, allowed } = await checkPermission("users.add");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Add Staff" />
        <PermissionDenied module="adding staff" />
      </>
    );
  }

  const { data, error } = await getStaffRoles(user);

  return (
    <>
      <PageHeader
        title="Add Staff"
        description="Creates an admin panel login. The password works for both the old and the new admin login."
        actions={
          can(user, "users") ? (
            <ButtonLink href="/admin/users" size="sm" variant="secondary">
              Staff User
            </ButtonLink>
          ) : null
        }
      />
      {error ? (
        <ApiUnavailable error={error} what="the staff roles" />
      ) : (
        <Card className="max-w-4xl">
          <CardBody>
            <StaffForm roles={data.roles} experienceRoles={data.experienceRoles} canAdd={can(user, "users.add", "add")} />
          </CardBody>
        </Card>
      )}
    </>
  );
}
