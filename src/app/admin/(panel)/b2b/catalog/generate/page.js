import { checkPermission } from "@/lib/auth/session";
import { getCatalogBatch } from "@/lib/services/admin/b2b-screens";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { CatalogBatch } from "@/components/admin/b2b/catalog-batch";

export const metadata = { title: "Generate Catalogue" };

const PAGE_SIZES = ["25", "50", "100", "250"];
const TITLE = "Generate Catalogue";
const DESCRIPTION = "Batch mode from the catalogue generator: pick active products and build a specification catalogue. Prices are not printed.";

export default async function CatalogGeneratePage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.catalog");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the B2B catalogue" /></>);
  const sp = await searchParams;
  const ids = typeof sp?.ids === "string" ? sp.ids : "";
  const pageSize = PAGE_SIZES.includes(sp?.pageSize) ? Number(sp.pageSize) : 25;
  const page = /^\d+$/.test(sp?.page ?? "") && Number(sp.page) > 0 ? Number(sp.page) : 1;
  const query = {
    q: typeof sp?.q === "string" ? sp.q.slice(0, 120) : undefined,
    seller: typeof sp?.seller === "string" ? sp.seller.slice(0, 80) : undefined,
    ids: ids.slice(0, 4000) || undefined,
  };
  const result = await getCatalogBatch(query, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/catalog" size="sm">Back to catalog</ButtonLink>} /><ApiUnavailable error={result.error} what="the catalogue generator" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/catalog" size="sm">Back to catalog</ButtonLink>} />
      <CatalogBatch
        products={(result.data.products || []).slice((page - 1) * pageSize, page * pageSize)}
        total={(result.data.products || []).length}
        page={page}
        pageSize={pageSize}
        pageCount={Math.max(1, Math.ceil((result.data.products || []).length / pageSize))}
        vendors={result.data.vendors || []}
        totalActive={result.data.totalActive || 0}
        initialPreview={ids ? result.data.products || [] : null}
      />
    </>
  );
}
