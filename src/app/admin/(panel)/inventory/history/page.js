import { loadStock } from "@/lib/services/admin/inventory";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { MovementTable } from "@/components/admin/inventory/stock-views";

export const metadata = { title: "Stock History" };

const PAGE = 100;

export default async function StockHistoryPage({ searchParams }) {
  const { before } = await searchParams;
  const beforeId = typeof before === "string" && /^\d+$/.test(before) ? before : undefined;
  const { user, header, denied } = await inventoryPage({
    title: "Stock History",
    description: "Every stock change: adjustments, orders, cancellations, returns and imports. This log is append-only.",
  });
  if (denied) return denied;
  const moves = await loadStock(user, "movements", { limit: PAGE, beforeId });
  const last = moves.data?.at(-1);
  return (
    <>
      {header}
      <Card>
        {moves.error ? <LoadError error={moves.error} what="the stock history" /> : <MovementTable movements={moves.data} />}
        {(beforeId || moves.data?.length === PAGE) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted">
            <span>Showing {moves.data?.length ?? 0} movements</span>
            <span className="flex gap-2">
              {beforeId && (
                <ButtonLink size="sm" href="/admin/inventory/history">
                  Newest
                </ButtonLink>
              )}
              {moves.data?.length === PAGE && (
                <ButtonLink size="sm" href={`/admin/inventory/history?before=${last.id}`}>
                  Older
                </ButtonLink>
              )}
            </span>
          </div>
        )}
      </Card>
    </>
  );
}
