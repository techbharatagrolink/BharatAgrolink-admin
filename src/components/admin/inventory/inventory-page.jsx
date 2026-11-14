import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { LiveRefresh } from "./live-refresh";

/**
 * Permission gate + header shared by the Inventory Management screens.
 * Returns { user, canEdit, header, denied }: render `denied` when it is set.
 */
export async function inventoryPage({ title, description, actions, live = true }) {
  const { user, allowed } = await checkPermission("inventory");
  const header = <PageHeader title={title} description={description} meta={live ? <LiveRefresh /> : null} actions={actions} />;
  if (!allowed)
    return {
      user,
      canEdit: false,
      header,
      denied: (
        <>
          <PageHeader title={title} />
          <PermissionDenied module="inventory management" />
        </>
      ),
    };
  return { user, canEdit: can(user, "inventory", "edit"), header, denied: null };
}

export function LoadError({ error, what }) {
  return <ApiUnavailable error={error} what={what} />;
}
