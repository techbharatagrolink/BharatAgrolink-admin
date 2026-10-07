import { checkPermission } from "@/lib/auth/session";
import { productFields, productFormOptions } from "@/lib/services/admin/products";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ProductCreateForm } from "@/components/admin/products/product-create-form";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const { user, allowed } = await checkPermission("products", "add");
  if (!allowed) return (<><PageHeader title="Add Product" /><PermissionDenied module="product creation" /></>);
  const options = await productFormOptions(user);
  return (
    <>
      <PageHeader title="Add Product" description="Create a listing on behalf of a vendor, with optional variations such as other pack sizes. Images are managed in the Seller Panel." />
      <ProductCreateForm fields={productFields(options)} />
    </>
  );
}
