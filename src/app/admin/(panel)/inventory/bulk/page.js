import { loadStock } from "@/lib/services/admin/inventory";
import { PermissionDenied } from "@/components/ui/states";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { BulkUpload } from "@/components/admin/inventory/bulk-upload";

export const metadata = { title: "Bulk Stock Update" };

export default async function BulkStockPage() {
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "Bulk Stock Update",
    description: "Update many SKUs of one seller from a CSV file. Each row is checked and previewed; applying the same file twice never doubles stock.",
    live: false,
  });
  if (denied) return denied;
  if (!canEdit)
    return (
      <>
        {header}
        <PermissionDenied module="bulk stock updates" />
      </>
    );
  const sellers = await loadStock(user, "sellers");
  return (
    <>
      {header}
      {sellers.error ? <LoadError error={sellers.error} what="the sellers" /> : <BulkUpload sellers={sellers.data} />}
    </>
  );
}
