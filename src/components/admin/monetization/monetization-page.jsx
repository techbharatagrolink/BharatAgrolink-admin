import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";

/**
 * Permission gate + header shared by the Monetization Center screens.
 * Returns { user, canAdd, canEdit, header, denied }: render `denied` when it is set.
 */
export async function monetizationPage({ title, description, actions }) {
  const { user, allowed } = await checkPermission("monetization");
  const header = <PageHeader title={title} description={description} actions={actions} />;
  if (!allowed)
    return {
      user,
      canAdd: false,
      canEdit: false,
      header,
      denied: (
        <>
          <PageHeader title={title} />
          <PermissionDenied module="the Monetization Center" />
        </>
      ),
    };
  return { user, canAdd: can(user, "monetization", "add"), canEdit: can(user, "monetization", "edit"), header, denied: null };
}

export function LoadError({ error, what }) {
  return <ApiUnavailable error={error} what={what} />;
}
