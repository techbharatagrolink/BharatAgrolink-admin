import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { loadStock } from "@/lib/services/admin/inventory";
import { qty } from "@/lib/content/admin/inventory";
import { StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { AlertList, MovementList } from "@/components/admin/inventory/stock-views";

export const metadata = { title: "Inventory Overview" };

const stockHref = (params) => `/admin/inventory/stock?${new URLSearchParams(params)}`;

export default async function InventoryOverviewPage() {
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "Inventory Overview",
    description: "Live stock across every seller from the central inventory. Website, app and B2B orders all use these numbers.",
    actions: <ButtonLink href="/admin/inventory/stock" size="sm">All stock</ButtonLink>,
  });
  if (denied) return denied;

  const [summary, alerts, moves, sellers, shortfalls] = await Promise.all([
    loadStock(user, "summary"),
    loadStock(user, "alerts"),
    loadStock(user, "movements", { limit: 8 }),
    loadStock(user, "sellers"),
    loadStock(user, "shortfalls"),
  ]);
  if (summary.error)
    return (
      <>
        {header}
        <LoadError error={summary.error} what="the inventory" />
      </>
    );
  const s = summary.data;
  const short = shortfalls.data?.length ?? 0;

  return (
    <>
      {header}
      <StatGrid className="xl:grid-cols-7">
        <StatCard label="Total SKUs" value={qty(s.totalSkus)} hint={`${qty(s.units?.available)} units available`} tone="neutral" href="/admin/inventory/stock" />
        <StatCard label="In stock" value={qty(s.inStock)} href={stockHref({ status: "IN_STOCK" })} />
        <StatCard label="Low stock" value={qty(s.lowStock)} tone="warning" href={stockHref({ status: "LOW_STOCK" })} />
        <StatCard label="Critical" value={qty(s.critical)} tone="danger" href={stockHref({ status: "CRITICAL" })} />
        <StatCard label="Out of stock" value={qty(s.outOfStock)} tone="danger" href={stockHref({ status: "OUT_OF_STOCK" })} />
        <StatCard label="Not set up" value={qty(s.notConfigured)} hint="Cannot be sold yet" tone="neutral" href="/admin/inventory/setup" />
        <StatCard label="Short orders to call" value={qty(short)} hint="Paid, stock ran out" tone={short ? "danger" : "neutral"} href="/admin/inventory/exceptions" />
      </StatGrid>
      <p className="mt-3 text-xs text-ink-muted">
        {qty(s.units?.onHand)} units on hand · {qty(s.units?.reserved)} reserved for open orders · {qty(s.hiddenListings)} SKU(s) hidden from the store
      </p>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader title="Open alerts" description="Most urgent first." actions={<ButtonLink href="/admin/inventory/alerts" size="sm">All alerts</ButtonLink>} />
          {alerts.error ? <LoadError error={alerts.error} what="the alerts" /> : <AlertList alerts={alerts.data.slice(0, 6)} canEdit={canEdit} />}
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Latest stock movements" actions={<ButtonLink href="/admin/inventory/history" size="sm">Full history</ButtonLink>} />
          {moves.error ? <LoadError error={moves.error} what="the stock history" /> : <MovementList movements={moves.data} />}
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Stock by seller" description="Sellers with the most out-of-stock SKUs first." />
        {sellers.error ? (
          <LoadError error={sellers.error} what="the sellers" />
        ) : (
          <MiniTable
            columns={[
              {
                key: "seller",
                label: "Seller",
                render: (r) => (
                  <span className="block">
                    <span className="font-medium text-ink">{r.sellerName}</span>
                    <span className="block text-xs text-ink-muted">{r.sellerId || "Admin-owned B2B"}</span>
                  </span>
                ),
              },
              { key: "totalSkus", label: "SKUs", align: "right", render: (r) => qty(r.totalSkus) },
              { key: "inStock", label: "In stock", align: "right", render: (r) => qty(r.inStock) },
              { key: "lowStock", label: "Low", align: "right", render: (r) => <span className={r.lowStock ? "text-warning-ink" : ""}>{qty(r.lowStock)}</span> },
              { key: "critical", label: "Critical", align: "right", render: (r) => <span className={r.critical ? "text-danger-ink" : ""}>{qty(r.critical)}</span> },
              { key: "outOfStock", label: "Out", align: "right", render: (r) => <span className={r.outOfStock ? "font-medium text-danger-ink" : ""}>{qty(r.outOfStock)}</span> },
              { key: "onHand", label: "Units on hand", align: "right", render: (r) => qty(r.onHand) },
              {
                key: "view",
                label: "",
                render: (r) =>
                  r.sellerId ? (
                    <Link href={stockHref({ sellerId: r.sellerId })} className="inline-flex items-center text-[13px] font-medium text-brand-700 hover:underline">
                      View <ChevronRight className="size-4" aria-hidden />
                    </Link>
                  ) : null,
              },
            ]}
            rows={(sellers.data ?? []).slice(0, 50).map((r) => ({ ...r, id: r.sellerId || "b2b" }))}
          />
        )}
      </Card>
    </>
  );
}
