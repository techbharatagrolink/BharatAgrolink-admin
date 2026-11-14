import Link from "next/link";
import { notFound } from "next/navigation";
import { loadStock } from "@/lib/services/admin/inventory";
import { itemName, qty } from "@/lib/content/admin/inventory";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { AdjustStock } from "@/components/admin/inventory/adjust-stock";
import { StockSettings } from "@/components/admin/inventory/stock-forms";
import { MovementTable, StockStatusBadge } from "@/components/admin/inventory/stock-views";
import { LiveRefresh } from "@/components/admin/inventory/live-refresh";

export const metadata = { title: "Stock Item" };

export default async function StockItemPage({ params }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const { user, canEdit, header, denied } = await inventoryPage({ title: "Stock Item" });
  if (denied) return denied;

  const [item, moves] = await Promise.all([loadStock(user, `items/${id}`), loadStock(user, `items/${id}/movements`, { limit: 100 })]);
  if (item.error) {
    if (item.error.status === 404) notFound();
    return (
      <>
        {header}
        <LoadError error={item.error} what="this stock item" />
      </>
    );
  }
  const i = item.data;

  return (
    <>
      <Link href="/admin/inventory/stock" className="mb-3 inline-block text-[13px] text-ink-muted hover:text-ink">
        ← Back to all stock
      </Link>
      <PageHeader
        title={itemName(i)}
        meta={
          <>
            {i.variantLabel && <span className="text-sm text-ink-muted">Pack {i.variantLabel}</span>}
            <span className="font-mono text-xs text-ink-muted">SKU {i.sku}</span>
            <StockStatusBadge status={i.status} />
            {i.pool === "B2B" && <Badge tone="info">B2B</Badge>}
            {i.listingActive === false && <Badge>Hidden from store</Badge>}
            {i.sellerName && <span className="text-sm text-ink-muted">· {i.sellerName}</span>}
            <LiveRefresh />
          </>
        }
        actions={
          canEdit && (
            <>
              <AdjustStock item={i} initialAction="ADD" label="Add stock" size="md" variant="primary" />
              <AdjustStock item={i} initialAction="REDUCE" label="Reduce" size="md" />
              <AdjustStock item={i} initialAction="SET" label="Set physical count" size="md" />
            </>
          )
        }
      />
      <StatGrid>
        <StatCard label="On hand" value={qty(i.onHandQty)} hint="Physically in stock" tone="neutral" />
        <StatCard label="Reserved" value={qty(i.reservedQty)} hint="Held for open orders" tone="info" />
        <StatCard label="Safety stock" value={qty(i.safetyStockQty)} hint="Never sold online" tone="neutral" />
        <StatCard label="Available to sell" value={qty(i.availableQty)} hint={`Updated ${formatDateTime(i.updatedAt)}`} tone={i.availableQty > 0 ? "brand" : "danger"} />
      </StatGrid>

      <Card className="mt-4">
        <CardHeader title="Alert levels and safety stock" description="Changes are recorded in the audit log." />
        <CardBody>
          <StockSettings item={i} disabled={!canEdit} />
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Movement history" description="Every change to this SKU, newest first. Records cannot be edited or deleted." />
        {moves.error ? <LoadError error={moves.error} what="the movement history" /> : <MovementTable movements={moves.data} showProduct={false} />}
      </Card>
    </>
  );
}
