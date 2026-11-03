import { checkPermission } from "@/lib/auth/session";
import { api } from "@/lib/api";
import { listPayoutVendorItems } from "@/lib/services/admin/payout-summary";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { VendorItemsTable } from "@/components/admin/payouts/vendor-items-table";

export const metadata = { title: "Vendor Payout Items" };

const TITLE = "Vendor Payout Items";
const DESCRIPTION = "The items Export items downloads from the Vendor Payout Summary, on screen. Status, cycle, order IDs and the vendor search narrow them the same way.";

export default async function VendorPayoutItemsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("payouts");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="vendor payouts" /></>);
  const sp = (await searchParams) ?? {};
  const [result, cycles] = await Promise.all([
    listPayoutVendorItems(sp, user).then((data) => ({ data }), (error) => ({ error })),
    api("admin/payouts/cycles", { token: user.token }).then((res) => (Array.isArray(res.data) ? res.data : []), () => []),
  ]);
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="payout items" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <VendorItemsTable data={result.data} cycles={cycles} />
    </>
  );
}
