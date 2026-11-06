import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getPayoutSync } from "@/lib/services/admin/payout-sync";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { PayoutSyncPanel } from "@/components/admin/payouts/payout-sync-panel";

export const metadata = { title: "Payout Items Sync" };

export default async function PayoutSyncPage() {
  const { user } = await checkPermission("payouts");
  if (!can(user, "payouts")) {
    return (
      <>
        <PageHeader title="Payout Items Sync" />
        <PermissionDenied module="payout items sync" />
      </>
    );
  }
  const status = await getPayoutSync(user);
  return (
    <>
      <PageHeader
        title="Payout Items Sync"
        description="Creates the vendor_payout_items row of any delivered order line that is missing one. Feeds Vendor Payout Items, Vendor Payout Summary and the dashboard Delivered card."
      />
      <PayoutSyncPanel initial={status.ok ? status.data : []} error={status.ok ? null : status.message} canRun={can(user, "payouts", "edit")} />
    </>
  );
}
