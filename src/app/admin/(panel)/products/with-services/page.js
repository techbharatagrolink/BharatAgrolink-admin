import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsWithServices } from "@/lib/services/admin/products";
import { formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { filterRowsByQuery, groupByService, ProductsServicesTable, ServiceCardsGrid } from "@/components/admin/products/services-report";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";

export const metadata = { title: "Products with Seller Services" };

const BASE_HREF = "/admin/products/with-services";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FILTER_FIELDS = [
  { name: "q", label: "Search", type: "search", placeholder: "Product name, SKU or vendor" },
  { name: "from", label: "Updated from", type: "date" },
  { name: "to", label: "Updated to", type: "date" },
];

export default async function ProductsWithServicesPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.service ? String(params.service) : "";
  const q = typeof params?.q === "string" ? params.q.trim().slice(0, 120) : "";
  const from = DATE.test(params?.from ?? "") ? params.from : "";
  const to = DATE.test(params?.to ?? "") ? params.to : "";

  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Products with Seller Services" />
        <PermissionDenied module="products" />
      </>
    );
  }

  const { rows, scanned, totalCatalog, truncated, message } = await getProductsWithServices(user);
  const serviceGroups = groupByService(rows);
  const selectedGroup = serviceGroups.find((g) => g.key === selected);
  const byService = selectedGroup ? rows.filter((p) => (p.services ?? []).some((s) => String(s.code ?? s.name) === selected)) : rows;
  const filteredRows = filterRowsByQuery(byService, { q, from, to });

  return (
    <>
      <PageHeader
        title="Products with Seller Services"
        description="Every product with at least one seller-selected promotional or support service, so sales can see what's already active and pitch it."
        actions={
          <Link href="/admin/marketing/products-with-services" className="text-xs font-medium text-brand-700 hover:underline">
            Marketing services report →
          </Link>
        }
      />
      {message && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      {truncated && (
        <Notice tone="warning" className="mb-4">
          Scanned the {formatNumber(scanned)} most recently updated products out of {formatNumber(totalCatalog)} in the catalog. Older products with services may not be listed here — use the search on{" "}
          <Link href="/admin/products" className="underline">
            All Products
          </Link>{" "}
          for the full catalog.
        </Notice>
      )}

      <div className="mb-4">
        <QueryFilters fields={FILTER_FIELDS} />
      </div>

      <ServiceCardsGrid baseHref={BASE_HREF} serviceGroups={serviceGroups} selectedKey={selectedGroup?.key} totalCount={rows.length} />

      <ProductsServicesTable
        rows={filteredRows}
        baseHref={BASE_HREF}
        selectedName={selectedGroup?.name}
        emptyMessage="No products currently have a seller service selected."
      />
    </>
  );
}
