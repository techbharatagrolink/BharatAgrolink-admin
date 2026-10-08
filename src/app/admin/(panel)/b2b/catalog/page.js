import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getB2bCatalog, getB2bCatalogOptions } from "@/lib/services/admin/parity/seller";
import { formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { B2bCatalogTable } from "@/components/admin/parity/seller/b2b-catalog-table";

export const metadata = { title: "B2B Catalog / Products" };

const TITLE = "Catalog / Products";
const DESCRIPTION = "Products offered to B2B buyers: pricing, NRV/BSA, stock and catalog PDFs.";
const PAGE_SIZES = ["10", "25", "50", "100"];

export default async function B2bCatalogPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.catalog");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the B2B catalog" /></>);
  const sp = await searchParams;
  const query = {
    q: typeof sp?.q === "string" ? sp.q.slice(0, 120) : undefined,
    category: /^\d+$/.test(sp?.category ?? "") ? sp.category : undefined,
    seller: typeof sp?.seller === "string" ? sp.seller.slice(0, 100) : undefined,
    status: ["1", "0", "draft"].includes(sp?.status) ? sp.status : undefined,
    page: /^\d+$/.test(sp?.page ?? "") && Number(sp.page) > 0 ? sp.page : 1,
    pageSize: PAGE_SIZES.includes(sp?.pageSize) ? sp.pageSize : 25,
  };
  const result = await Promise.all([getB2bCatalog(query, user), getB2bCatalogOptions(user)]).then(([data, options]) => ({ data, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="the B2B catalog" /></>);
  const { data, options } = result;
  const { kpis } = data;
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="space-y-4">
        <StatGrid className="xl:grid-cols-5">
          <StatCard label="Total SKUs" value={formatNumber(kpis.total)} hint="Products in B2B catalog" />
          <StatCard label="Active" value={formatNumber(kpis.active)} hint="Ready for quotation" />
          <StatCard label="Drafts" value={formatNumber(kpis.drafts)} hint="Incomplete listings" tone="warning" />
          <StatCard label="Low Stock" value={formatNumber(kpis.lowStock)} hint="At or below threshold" tone="warning" />
          <StatCard label="Out of Stock" value={formatNumber(kpis.outOfStock)} hint="Requires restocking" tone="danger" />
        </StatGrid>
        <B2bCatalogTable data={data} options={options} canEdit={can(user, "b2b.catalog", "edit")} canDelete={can(user, "b2b.catalog", "delete")} />
      </div>
    </>
  );
}
