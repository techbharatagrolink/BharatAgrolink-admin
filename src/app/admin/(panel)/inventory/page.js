import { checkPermission } from "@/lib/auth/session";
import { getInventorySummary } from "@/lib/services/admin/inventory";
import { formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Inventory" };

export default async function InventoryPage({ searchParams }) {
  const params = await searchParams;
  const { allowed } = await checkPermission("products");
  const summary = allowed ? await getInventorySummary() : null;
  const s = summary?.stats;

  return (
    <ResourcePage resourceKey="inventory" pathname="/admin/inventory" searchParams={params}>
      {summary && (
        <>
          <StatGrid className="mb-4">
            <StatCard label="Listed products" value={formatNumber(s.listed)} hint={`${formatNumber(s.units)} units`} tone="neutral" />
            <StatCard label="In stock (10+)" value={formatNumber(s.inStock)} href="/admin/inventory?stockStatus=In+Stock" />
            <StatCard label="Low stock (1–9)" value={formatNumber(s.lowStock)} tone="warning" href="/admin/inventory?stockStatus=Low+Stock" />
            <StatCard label="Out of stock" value={formatNumber(s.outOfStock)} tone="danger" href="/admin/inventory?stockStatus=Out+of+Stock" />
            <StatCard label="Below 50 units" value={formatNumber(s.below50)} hint="Main dashboard alert" tone="warning" href="/admin/inventory?reorder=below50" />
            <StatCard label="Movements (7 days)" value={formatNumber(s.movements7d)} hint={`${s.manual7d} manual`} tone="info" href="/admin/inventory/history" />
          </StatGrid>
          <Card className="mb-4">
            <CardHeader title="Stock by vendor" description="Top 10 vendors by listed products" />
            <MiniTable
              columns={[
                { key: "vendor", label: "Vendor", render: (r) => <span className="font-medium text-ink">{r.vendor}</span> },
                { key: "inStock", label: "In stock", align: "right" },
                { key: "lowStock", label: "Low", align: "right", render: (r) => <span className={r.lowStock ? "text-warning-ink" : ""}>{r.lowStock}</span> },
                { key: "outOfStock", label: "Out", align: "right", render: (r) => <span className={r.outOfStock ? "font-medium text-danger-ink" : ""}>{r.outOfStock}</span> },
                { key: "total", label: "Total", align: "right" },
              ]}
              rows={summary.vendors}
            />
          </Card>
        </>
      )}
    </ResourcePage>
  );
}
