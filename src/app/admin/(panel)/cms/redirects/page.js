import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getRedirectsScreen, redirectFilters, REDIRECTS_PERMISSION } from "@/lib/services/admin/redirects";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { RedirectsManager } from "@/components/admin/cms/redirects-manager";

export const metadata = { title: "301 URL Redirects" };

const TITLE = "301 URL Redirects";

export default async function RedirectsPage({ searchParams }) {
  const { user, allowed } = await checkPermission(REDIRECTS_PERMISSION);
  if (!allowed)
    return (
      <>
        <PageHeader title={TITLE} />
        <PermissionDenied module="URL redirects" />
      </>
    );

  const filters = redirectFilters(await searchParams);
  const data = await getRedirectsScreen(user, filters);
  if (data.error)
    return (
      <>
        <PageHeader title={TITLE} />
        <ApiUnavailable error={data.error} what="the redirect rules" />
      </>
    );

  return (
    <RedirectsManager
      title={TITLE}
      items={data.items}
      metrics={data.metrics}
      meta={data.meta}
      filters={filters}
      siteUrl={site.url}
      perms={{
        add: can(user, REDIRECTS_PERMISSION, "add"),
        edit: can(user, REDIRECTS_PERMISSION, "edit"),
        delete: can(user, REDIRECTS_PERMISSION, "delete"),
      }}
    />
  );
}
