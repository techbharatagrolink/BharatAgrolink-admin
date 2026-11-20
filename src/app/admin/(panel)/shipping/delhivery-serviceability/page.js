import { checkPermission } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ServiceabilityTools } from "@/components/admin/parity/ops/serviceability-tools";

export const metadata = { title: "Delivery Serviceability" };

export default async function DelhiveryServiceabilityPage() {
  const { allowed } = await checkPermission("shipping.delhiveryPincodes");
  const header = <PageHeader title="Delivery Serviceability" description="Route serviceability, pincode coverage and shipping cost, checked live against Delhivery." />;
  if (!allowed) return (<>{header}<PermissionDenied module="delivery serviceability" /></>);
  return (
    <>
      {header}
      <ServiceabilityTools />
    </>
  );
}
