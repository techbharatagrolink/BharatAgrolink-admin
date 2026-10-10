import { checkPermission } from "@/lib/auth/session";
import { getCatalogueOptions } from "@/lib/services/admin/b2b-catalog-generator";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { CatalogGenerator } from "@/components/admin/b2b/catalog-generator/catalog-generator";

export const metadata = { title: "Catalogue Generator" };

const TITLE = "Catalogue Generator";
const param = (value, max) => (typeof value === "string" && value !== "" ? value.slice(0, max) : undefined);

/** b2b_orders/catalog_generator.php: ?mode=product&product_id=, ?mode=vendor&vendor_id=, ?mode=batch&ids=1,2,3 */
export default async function CatalogGeneratePage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.catalog");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the B2B catalogue" /></>);
  const sp = await searchParams;
  const query = {
    mode: param(sp?.mode, 20),
    vendor_id: param(sp?.vendor_id, 80),
    product_id: param(sp?.product_id, 20),
    ids: param(sp?.ids, 4000),
  };
  const result = await getCatalogueOptions(query, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) {
    return (<><PageHeader title={TITLE} actions={<ButtonLink href="/admin/b2b/catalog" size="sm">Back to Catalog</ButtonLink>} /><ApiUnavailable error={result.error} what="the catalogue generator" /></>);
  }
  const key = [query.mode, query.vendor_id, query.product_id, query.ids].join("|");
  return <CatalogGenerator key={key} boot={result.data} />;
}
