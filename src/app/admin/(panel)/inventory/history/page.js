import { loadStock } from "@/lib/services/admin/inventory";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkTabs } from "@/components/ui/page";
import { EmptyState } from "@/components/ui/states";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { MovementTable } from "@/components/admin/inventory/stock-views";

export const metadata = { title: "Stock History" };

const PAGE = 100;

/**
 * Real stock changes by default (adjustments, orders, cancellations, returns). "Opening balances" are the
 * one-time import of the old stock columns: one row per SKU, kept separate so they do not bury the changes.
 */
export default async function StockHistoryPage({ searchParams }) {
  const { before, view } = await searchParams;
  const opening = view === "opening";
  const beforeId = typeof before === "string" && /^\d+$/.test(before) ? before : undefined;
  const { user, header, denied } = await inventoryPage({
    title: "Stock History",
    description: "Every stock change: adjustments, orders, cancellations and returns, with who made it and why. This log is append-only.",
  });
  if (denied) return denied;
  const moves = await loadStock(user, "movements", opening ? { limit: PAGE, beforeId, type: "OPENING" } : { limit: PAGE, beforeId, changesOnly: "1" });
  const last = moves.data?.at(-1);
  const base = opening ? "/admin/inventory/history?view=opening" : "/admin/inventory/history";
  const more = (q) => `${base}${base.includes("?") ? "&" : "?"}${q}`;
  return (
    <>
      {header}
      <LinkTabs
        active={opening ? "opening" : "changes"}
        tabs={[
          { value: "changes", label: "Stock changes", href: "/admin/inventory/history" },
          { value: "opening", label: "Opening balances (initial import)", href: "/admin/inventory/history?view=opening" },
        ]}
      />
      <Card>
        {moves.error ? (
          <LoadError error={moves.error} what="the stock history" />
        ) : !moves.data.length && !opening ? (
          <EmptyState title="No stock changes yet" description="Stock has not been added, reduced, ordered or returned since the stock was imported. The starting numbers are under Opening balances." />
        ) : (
          <MovementTable movements={moves.data} />
        )}
        {(beforeId || moves.data?.length === PAGE) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted">
            <span>Showing {moves.data?.length ?? 0} entries</span>
            <span className="flex gap-2">
              {beforeId && (
                <ButtonLink size="sm" href={base}>
                  Newest
                </ButtonLink>
              )}
              {moves.data?.length === PAGE && (
                <ButtonLink size="sm" href={more(`before=${last.id}`)}>
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
