import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getFeatureCategories, getFeatureCategory, getFeatureCategoryOptions } from "@/lib/services/admin/parity/seller";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { FeatureCategoryForm } from "@/components/admin/parity/seller/feature-category-form";
import { FeatureCategoryList } from "@/components/admin/parity/seller/feature-category-list";

export const metadata = { title: "Feature Category" };

const PERMISSION = "catalog.featureCategories";
const LIST = "/admin/catalog/feature-categories";
const DESCRIPTION = "Curated storefront categories with their own banners and product lists. The order here is the display order.";

/** feature_category.php, with add_feature_category.php at ?new=1 and edit_feature_category.php at ?edit=<id>. */
export default async function FeatureCategoriesPage({ searchParams }) {
  const sp = await searchParams;
  const editId = /^\d+$/.test(sp?.edit ?? "") ? sp.edit : null;
  const creating = !editId && sp?.new === "1";
  const title = editId ? "Update Feature Category" : creating ? "Add Feature Category" : "All Categories";
  const { user, allowed } = await checkPermission(PERMISSION, creating ? "add" : "view");
  if (!allowed) return (<><PageHeader title={title} /><PermissionDenied module="feature categories" /></>);
  const back = <ButtonLink href={LIST}>Back to List</ButtonLink>;

  if (creating || editId) {
    const result = await Promise.all([editId ? getFeatureCategory(editId, user) : null, getFeatureCategoryOptions(user)]).then(([category, options]) => ({ category, options }), (error) => ({ error }));
    if (result.error?.status === 404) return (<><PageHeader title={title} actions={back} /><EmptyState title="Feature category not found" description="It may have been deleted." /></>);
    if (result.error) return (<><PageHeader title={title} actions={back} /><ApiUnavailable error={result.error} what="this feature category" /></>);
    return (
      <>
        <PageHeader title={title} description={result.category ? `/${result.category.slug}` : undefined} actions={back} />
        <FeatureCategoryForm key={editId ?? "new"} category={result.category} options={result.options} canSave={can(user, PERMISSION, editId ? "edit" : "add")} />
      </>
    );
  }

  const result = await getFeatureCategories(user).then((data) => ({ data }), (error) => ({ error }));
  const add = can(user, PERMISSION, "add") && <ButtonLink variant="primary" href={`${LIST}?new=1`}>Add New Category</ButtonLink>;
  if (result.error) return (<><PageHeader title={title} description={DESCRIPTION} actions={add} /><ApiUnavailable error={result.error} what="feature categories" /></>);
  return (
    <>
      <PageHeader title={title} description={DESCRIPTION} actions={add} />
      <FeatureCategoryList categories={result.data} canEdit={can(user, PERMISSION, "edit")} canDelete={can(user, PERMISSION, "delete")} />
    </>
  );
}
