import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getAddSellerOptions } from "@/lib/services/admin/parity/seller";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { AddSellerForm } from "@/components/admin/parity/seller/add-seller-form";

export const metadata = { title: "Add Seller" };

const TITLE = "Add Seller";
const DESCRIPTION = "Register a seller account. The PIN code is checked against the state and city, and the seller code is assigned on save.";

export default async function AddSellerPage() {
  const { user, allowed } = await checkPermission("vendors.add");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="add seller" /></>);
  const result = await getAddSellerOptions(user).then((data) => ({ data }), (error) => ({ error }));
  const back = <ButtonLink href="/admin/vendors">All sellers</ButtonLink>;
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} actions={back} /><ApiUnavailable error={result.error} what="seller form options" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={back} />
      <AddSellerForm options={result.data} canAdd={can(user, "vendors.add", "add")} />
    </>
  );
}
