import { checkPermission } from "@/lib/auth/session";
import { importTemplate } from "@/lib/services/admin/products";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ImportForm } from "@/components/admin/products/import-form";

export const metadata = { title: "Bulk Import" };

export default async function ProductImportPage() {
  const { user, allowed } = await checkPermission("products.import", "add");
  if (!allowed) return (<><PageHeader title="Bulk Import" /><PermissionDenied module="product import" /></>);
  return (
    <>
      <PageHeader title="Bulk Import" description="Import many products from a CSV using the same columns as the PHP spreadsheet import. XLSX is not imported." />
      <ImportForm template={await importTemplate(user)} />
    </>
  );
}
