import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getFeatureCategory, getFeatureCategoryOptions } from "@/lib/services/admin/parity/seller";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { FeatureCategoryForm } from "@/components/admin/parity/seller/feature-category-form";

export const metadata = { title: "Update Feature Category" };

const TITLE = "Update Feature Category";

export default async function EditFeatureCategoryPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("catalog.featureCategories");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="feature categories" /></>);
  const result = await Promise.all([getFeatureCategory(id, user), getFeatureCategoryOptions(user)]).then(([category, options]) => ({ category, options }), (error) => ({ error }));
  if (result.error?.status === 404) notFound();
  const back = <ButtonLink href="/admin/catalog/feature-categories">Back to List</ButtonLink>;
  if (result.error) return (<><PageHeader title={TITLE} actions={back} /><ApiUnavailable error={result.error} what="this feature category" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={`/${result.category.slug}`} actions={back} />
      <FeatureCategoryForm key={result.category.id} category={result.category} options={result.options} canSave={can(user, "catalog.featureCategories", "edit")} />
    </>
  );
}
