import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getShopTopic, getShopTopics } from "@/lib/services/admin/parity/seller";
import { LinkTabs, PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, EmptyState, PermissionDenied } from "@/components/ui/states";
import { CropMenuForm } from "@/components/admin/parity/seller/crop-menu-form";
import { CropMenuList } from "@/components/admin/parity/seller/crop-menu-list";

export const metadata = { title: "Crop Menu" };

const PERMISSION = "catalog.cropMenu";
const LIST = "/admin/catalog/crop-menu";
const LABELS = { crop: "Crop", disease: "Pest & Disease" };

/** shop_topics.php?type=crop|disease, with add_shop_topic.php at ?new=1 and edit_shop_topic.php at ?edit=<id>. */
export default async function CropMenuPage({ searchParams }) {
  const sp = await searchParams;
  const editId = /^\d+$/.test(sp?.edit ?? "") ? sp.edit : null;
  const creating = !editId && sp?.new === "1";
  let type = sp?.type === "disease" ? "disease" : "crop";
  const { user, allowed } = await checkPermission(PERMISSION, creating ? "add" : "view");
  if (!allowed) return (<><PageHeader title="Crop Menu" /><PermissionDenied module="the crop menu" /></>);

  if (editId) {
    const back = <ButtonLink href={`${LIST}?type=${type}`}>Back to List</ButtonLink>;
    const result = await getShopTopic(editId, user).then((data) => ({ data }), (error) => ({ error }));
    if (result.error?.status === 404) return (<><PageHeader title="Update" actions={back} /><EmptyState title="Item not found" description="It may have been deleted." /></>);
    if (result.error) return (<><PageHeader title="Update" actions={back} /><ApiUnavailable error={result.error} what="this item" /></>);
    type = result.data.type === "disease" ? "disease" : "crop";
    return (
      <>
        <PageHeader title={`Update ${LABELS[type]}`} description={result.data.name} actions={<ButtonLink href={`${LIST}?type=${type}`}>Back to List</ButtonLink>} />
        <CropMenuForm key={editId} type={type} label={LABELS[type]} topic={result.data} canSave={can(user, PERMISSION, "edit")} />
      </>
    );
  }

  if (creating) {
    return (
      <>
        <PageHeader title={`Add New ${LABELS[type]}`} actions={<ButtonLink href={`${LIST}?type=${type}`}>Back to List</ButtonLink>} />
        <CropMenuForm key={`new-${type}`} type={type} label={LABELS[type]} canSave={can(user, PERMISSION, "add")} />
      </>
    );
  }

  const title = `Shop by ${LABELS[type]}`;
  const add = can(user, PERMISSION, "add") && <ButtonLink variant="primary" href={`${LIST}?type=${type}&new=1`}>Add New {LABELS[type]}</ButtonLink>;
  const result = await getShopTopics(type, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={title} actions={add} /><ApiUnavailable error={result.error} what="the crop menu" /></>);
  const { counts, rows } = result.data;
  return (
    <>
      <PageHeader title={title} description="Tiles for the storefront and WhatsApp crop menus. The order here is the display order." actions={add} />
      <LinkTabs
        active={type}
        tabs={[
          { value: "crop", href: `${LIST}?type=crop`, label: "Crops", count: counts.crop ?? 0 },
          { value: "disease", href: `${LIST}?type=disease`, label: "Pests & Diseases", count: counts.disease ?? 0 },
        ]}
      />
      <CropMenuList key={type} type={type} label={LABELS[type]} topics={rows} canEdit={can(user, PERMISSION, "edit")} canDelete={can(user, PERMISSION, "delete")} />
    </>
  );
}
