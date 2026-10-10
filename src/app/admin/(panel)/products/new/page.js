import { checkPermission } from "@/lib/auth/session";
import { getProductOptions } from "@/lib/services/admin/products";
import { pricingFactorsEnabled } from "@/lib/services/admin/pricing-factors";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ProductEditor } from "@/components/admin/products/product-editor";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const { user, allowed } = await checkPermission("products", "add");
  if (!allowed) return (<><PageHeader title="Add Product" /><PermissionDenied module="product creation" /></>);
  const [options, pricingFactors] = await Promise.all([getProductOptions(user), pricingFactorsEnabled(user)]);
  return <ProductEditor mode="create" options={options || { vendors: [], categories: [], brands: [], returnPolicyOptions: [] }} pricingFactors={pricingFactors} />;
}
