import { loadStock } from "@/lib/services/admin/inventory";
import { Card } from "@/components/ui/card";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { AlertList } from "@/components/admin/inventory/stock-views";

export const metadata = { title: "Stock Alerts" };

export default async function StockAlertsPage({ searchParams }) {
  const { sellerId } = await searchParams;
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "Stock Alerts",
    description: "Out-of-stock, critical and low-stock SKUs. An alert closes by itself once stock is back above its level.",
  });
  if (denied) return denied;
  const alerts = await loadStock(user, "alerts", typeof sellerId === "string" && sellerId ? { sellerId } : undefined);
  return (
    <>
      {header}
      <Card>{alerts.error ? <LoadError error={alerts.error} what="the alerts" /> : <AlertList alerts={alerts.data} canEdit={canEdit} />}</Card>
    </>
  );
}
