import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getSeoPages } from "@/lib/services/admin/parity/marketing";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { SeoManager } from "@/components/admin/parity/marketing/seo-manager";

export const metadata = { title: "All Pages" };

const LIMITS = new Set(["10", "25", "50"]);

/** meta.php: SEO titles, headings and meta tags of the website's pages. */
export default async function SeoPagesPage({ searchParams }) {
  const { user, allowed } = await checkPermission("cms.seo");
  if (!allowed) return (<><PageHeader title="All Pages" /><PermissionDenied module="page SEO" /></>);
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 120) : "";
  const query = { page: /^\d{1,6}$/.test(sp.page ?? "") && Number(sp.page) > 0 ? sp.page : 1, limit: LIMITS.has(sp.limit) ? sp.limit : 10 };
  if (q) query.q = q;
  const result = await getSeoPages(query, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="All Pages" /><ApiUnavailable error={result.error} what="the pages list" /></>);
  const meta = result.data.meta ?? { page: Number(query.page), limit: Number(query.limit), total: result.data.items.length, totalPages: 1 };

  return (
    <>
      <PageHeader title="All Pages" description="Page titles, headings and meta tags used by the website." />
      <SeoManager
        key={q}
        items={result.data.items}
        meta={meta}
        q={q}
        siteUrl={site.url}
        can={{ add: can(user, "cms.seo", "add"), edit: can(user, "cms.seo", "edit"), delete: can(user, "cms.seo", "delete") }}
      />
    </>
  );
}
