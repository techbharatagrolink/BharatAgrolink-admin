import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getPickupAddresses } from "@/lib/services/admin/parity/ops";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { PickupAddresses } from "@/components/admin/parity/ops/pickup-addresses";

export const metadata = { title: "Pickup Addresses" };

export default async function PickupAddressesPage() {
  const { user, allowed } = await checkPermission("shipping.pickupAddresses");
  const header = <PageHeader title="Pickup Addresses" description="Warehouses registered with the shipping service for courier pickups." />;
  if (!allowed) return (<>{header}<PermissionDenied module="pickup addresses" /></>);
  const result = await getPickupAddresses(user).then((rows) => ({ rows }), (error) => ({ error }));
  if (result.error) return (<>{header}<ApiUnavailable error={result.error} what="pickup addresses" /></>);
  return (
    <>
      {header}
      <PickupAddresses rows={result.rows} canAdd={can(user, "shipping.pickupAddresses", "add")} />
    </>
  );
}
