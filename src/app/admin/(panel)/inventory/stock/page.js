import { Download } from "lucide-react";
import { loadStock, stockFilters } from "@/lib/services/admin/inventory";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { Pager, StockFilters, StockTable } from "@/components/admin/inventory/stock-views";

export const metadata = { title: "All Stock" };

export default async function StockListPage({ searchParams }) {
  const filters = stockFilters(await searchParams);
  const exportQuery = new URLSearchParams(Object.entries(filters).filter(([k]) => k !== "page"));
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "All Stock",
    description: "Every sellable product and pack size. Available = on hand − reserved for open orders − safety stock.",
    actions: (
      // Route handler download (the token stays on the server).
      <a href={`/admin/inventory/export?${exportQuery}`} className={buttonClasses({ size: "sm" })}>
        <Download className="size-4" aria-hidden /> Export CSV
      </a>
    ),
  });
  if (denied) return denied;

  const [list, categories, sellers] = await Promise.all([
    loadStock(user, "items", { ...filters, limit: 25 }),
    loadStock(user, "categories", filters.sellerId ? { sellerId: filters.sellerId } : undefined),
    loadStock(user, "sellers"),
  ]);
  const pageHref = (page) => `/admin/inventory/stock?${new URLSearchParams({ ...filters, page: String(page) })}`;

  return (
    <>
      {header}
      <Card>
        <StockFilters filters={filters} categories={categories.data ?? []} sellers={sellers.data ?? []} />
        {list.error ? (
          <LoadError error={list.error} what="the stock list" />
        ) : (
          <>
            <StockTable items={list.data} canEdit={canEdit} />
            <Pager meta={list.meta} href={pageHref} />
          </>
        )}
      </Card>
      {!canEdit && <p className="mt-3 text-xs text-ink-muted">You can view stock. Ask a super admin for edit access on Inventory Management to change it.</p>}
    </>
  );
}
