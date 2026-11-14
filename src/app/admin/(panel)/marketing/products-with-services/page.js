import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsWithServices } from "@/lib/services/admin/products";
import { formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { filterRowsByQuery, groupByService, ProductsServicesTable, ServiceCardsGrid, toServiceRows } from "@/components/admin/products/services-report";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";

export const metadata = { title: "Products with Marketing Services" };

const BASE_HREF = "/admin/marketing/products-with-services";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FILTER_FIELDS = [
  { name: "q", label: "Search", type: "search", placeholder: "Product name, SKU or vendor" },
  { name: "from", label: "Updated from", type: "date" },
  { name: "to", label: "Updated to", type: "date" },
];

/** Only Marketing-category services count here (B2B / catalog / agronomist services are dropped). */
const isMarketing = (s) => String(s.category || "").trim().toLowerCase() === "marketing";

export default async function MarketingServicesPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.service ? String(params.service) : "";
  const q = typeof params?.q === "string" ? params.q.trim().slice(0, 120) : "";
  const from = DATE.test(params?.from ?? "") ? params.from : "";
  const to = DATE.test(params?.to ?? "") ? params.to : "";

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
  // One row per sellable item (product, or each variant) with at least one Marketing service of its own.
  const rows = toServiceRows(scannedRows, isMarketing);
  const serviceGroups = groupByService(rows);
  const selectedGroup = serviceGroups.find((g) => g.key === selected);
  const byService = selectedGroup ? rows.filter((r) => r.services.some((s) => String(s.code ?? s.name) === selected)) : rows;
  const filteredRows = filterRowsByQuery(byService, { q, from, to });

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

      <div className="mb-4">
        <QueryFilters fields={FILTER_FIELDS} />
      </div>

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
