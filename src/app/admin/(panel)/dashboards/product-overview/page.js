import { checkPermission } from "@/lib/auth/session";
import { getProductDashboard, getProductDashboardOptions, getProductTimelineFeed } from "@/lib/services/admin/parity/seller";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QueryFilters } from "@/components/admin/parity/seller/query-filters";
import { ProductDashboard } from "@/components/admin/parity/seller/product-dashboard";

export const metadata = { title: "Product Dashboard" };

const TITLE = "Product Dashboard";
const DESCRIPTION = "Catalog health, sales, stock, returns and the product activity timeline. Comparison is the previous window of the same length.";
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const STOCK = new Set(["in_stock", "low_stock", "out_of_stock"]);

function readFilters(sp) {
  const filters = {};
  if (sp?.span === "all") {
    filters.start = "all";
    filters.end = "all";
  } else {
    if (DATE.test(sp?.start ?? "")) filters.start = sp.start;
    if (DATE.test(sp?.end ?? "")) filters.end = sp.end;
  }
  if (DATE.test(sp?.compareStart ?? "")) filters.compareStart = sp.compareStart;
  if (DATE.test(sp?.compareEnd ?? "")) filters.compareEnd = sp.compareEnd;
  if (typeof sp?.vendorId === "string" && sp.vendorId.trim()) filters.vendorId = sp.vendorId.trim().slice(0, 100);
  if (/^\d+$/.test(sp?.catId ?? "")) filters.catId = sp.catId;
  if (/^\d+$/.test(sp?.brandId ?? "")) filters.brandId = sp.brandId;
  if (STOCK.has(sp?.stock)) filters.stock = sp.stock;
  if (typeof sp?.search === "string" && sp.search.trim()) filters.search = sp.search.trim().slice(0, 120);
  return filters;
}

export default async function ProductOverviewPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.productOverview");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="the product dashboard" /></>);
  const filters = readFilters(await searchParams);
  const result = await Promise.all([getProductDashboard(filters, user), getProductDashboardOptions(user)]).then(([data, options]) => ({ data, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="the product dashboard" /></>);

  const { data, options } = result;
  const range = data.range;
  let feed = null;
  let feedError = null;
  try {
    feed = await getProductTimelineFeed({ start: range.all ? "all" : range.start, end: range.all ? "all" : range.end, limit: 15, offset: 0 }, user);
  } catch (error) {
    feedError = error?.message || "Activity timeline could not be loaded.";
  }

  const period = range.all ? "All time" : `${formatDate(range.start)} – ${formatDate(range.end)}`;
  const fields = [
    { name: "span", label: "Window", type: "select", placeholder: "Last 7 days", options: [{ value: "all", label: "All time" }] },
    { name: "start", label: "From", type: "date" },
    { name: "end", label: "To", type: "date" },
    { name: "compareStart", label: "Compare from", type: "date" },
    { name: "compareEnd", label: "Compare to", type: "date" },
    { name: "vendorId", label: "Seller", type: "select", placeholder: "All sellers", options: options.sellers },
    { name: "catId", label: "Category", type: "select", placeholder: "All categories", options: options.categories },
    { name: "brandId", label: "Brand", type: "select", placeholder: "All brands", options: options.brands },
    { name: "stock", label: "Stock", type: "select", placeholder: "Any stock", options: [{ value: "in_stock", label: "In stock" }, { value: "low_stock", label: "Low stock" }, { value: "out_of_stock", label: "Out of stock" }] },
    { name: "search", label: "Product", type: "search", placeholder: "Name or SKU" },
  ];

  return (
    <>
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        meta={<Badge tone="neutral">{period}{range.all ? "" : ` · vs ${formatDate(range.compareStart)} – ${formatDate(range.compareEnd)}`}</Badge>}
      />
      <div className="space-y-4">
        <QueryFilters fields={fields} />
        <ProductDashboard key={JSON.stringify(filters)} data={data} filters={filters} feed={feed} feedError={feedError} />
      </div>
    </>
  );
}
