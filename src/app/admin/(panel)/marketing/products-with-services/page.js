import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsWithServices } from "@/lib/services/admin/products";
import { formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { groupByService, ProductsServicesTable, ServiceCardsGrid } from "@/components/admin/products/services-report";

export const metadata = { title: "Products with Marketing Services" };

const BASE_HREF = "/admin/marketing/products-with-services";

/** Keeps only the Marketing-category services on each product (B2B / catalog / agronomist services are dropped). */
function toMarketingOnly(rows) {
  return rows
    .map((p) => ({ ...p, services: (p.services ?? []).filter((s) => String(s.category || "").trim().toLowerCase() === "marketing") }))
    .filter((p) => p.services.length > 0);
}

export default async function MarketingServicesPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.service ? String(params.service) : "";

  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Products with Marketing Services" />
        <PermissionDenied module="products" />
      </>
    );
  }

  const { rows: scannedRows, scanned, totalCatalog, truncated, message } = await getProductsWithServices(user);
  const rows = toMarketingOnly(scannedRows);
  const serviceGroups = groupByService(rows);
  const selectedGroup = serviceGroups.find((g) => g.key === selected);
  const filteredRows = selectedGroup ? rows.filter((p) => p.services.some((s) => String(s.code ?? s.name) === selected)) : rows;

  return (
    <>
      <PageHeader
        title="Products with Marketing Services"
        description="Products with a Marketing-category service selected (Product Promotion, Seasonal Campaigns, Marketing) — for planning marketing pushes and campaigns."
        actions={
          <Link href="/admin/products/with-services" className="text-xs font-medium text-brand-700 hover:underline">
            All services report →
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
          Scanned the {formatNumber(scanned)} most recently updated products out of {formatNumber(totalCatalog)} in the catalog. Older products may not be listed here.
        </Notice>
      )}

      <ServiceCardsGrid baseHref={BASE_HREF} serviceGroups={serviceGroups} selectedKey={selectedGroup?.key} totalCount={rows.length} />

      <ProductsServicesTable
        rows={filteredRows}
        baseHref={BASE_HREF}
        description="Scanned from the live products list, Marketing-category services only."
        selectedName={selectedGroup?.name}
        emptyMessage="No products currently have a Marketing service selected."
      />
    </>
  );
}
