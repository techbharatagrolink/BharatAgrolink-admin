import { loadStock } from "@/lib/services/admin/inventory";
import { NOT_CONFIGURED_REASONS } from "@/lib/content/admin/inventory";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { SetupStock } from "@/components/admin/inventory/stock-forms";

export const metadata = { title: "Stock Not Set Up" };

export default async function StockSetupPage() {
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "Stock Not Set Up",
    description: "These listings have no stock record, so customers cannot buy them. Stock is never assumed: enter a real count to start selling.",
  });
  if (denied) return denied;
  const list = await loadStock(user, "not-configured");
  const items = list.data?.items ?? [];
  return (
    <>
      {header}
      <Card>
        {list.error ? (
          <LoadError error={list.error} what="the listings" />
        ) : !items.length ? (
          <EmptyState title="Every listing has stock set up" />
        ) : (
          <ul className="divide-y divide-line">
            {items.map((r) => (
              <li key={`${r.sourceType}-${r.sourceId}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{r.productName || `Listing ${r.productId}`}</p>
                  <p className="text-xs text-ink-muted">
                    {r.sku && `SKU ${r.sku} · `}
                    {NOT_CONFIGURED_REASONS[r.reason] ?? r.reason} · seller {r.sellerId || "—"}
                    {r.listingActive === false && " · hidden from store"}
                  </p>
                </div>
                {r.canSetUp && canEdit ? (
                  <SetupStock sourceType={r.sourceType} sourceId={r.sourceId} suggested={r.legacyStock} />
                ) : (
                  <span className="text-xs text-ink-muted">{r.reason === "NO_PACK_SIZES" ? "Add pack sizes in the product form first." : r.canSetUp ? "Needs edit access." : "Fix the product listing first."}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
