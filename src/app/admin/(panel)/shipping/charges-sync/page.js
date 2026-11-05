import { checkPermission } from "@/lib/auth/session";
import { canShip } from "@/lib/services/admin/shipping";
import { getChargesSync } from "@/lib/services/admin/charges-sync";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ChargesSyncPanel } from "@/components/admin/shipping/charges-sync-panel";

export const metadata = { title: "Courier Charges Sync" };

export default async function ChargesSyncPage() {
  const { user } = await checkPermission("orders");
  if (!canShip(user)) {
    return (
      <>
        <PageHeader title="Courier Charges Sync" />
        <PermissionDenied module="courier charges sync" />
      </>
    );
  }
  const status = await getChargesSync(user);
  return (
    <>
      <PageHeader
        title="Courier Charges Sync"
        description="Exact freight and COD charges from Shiprocket and the Delhivery One wallet. They feed the order page, Vendor Payout Items, the Orders Report and the dashboard Shipping / RTO charges cards."
      />
      <ChargesSyncPanel initial={status.ok ? status.data : []} error={status.ok ? null : status.message} canRun={canShip(user, "edit")} />
    </>
  );
}
