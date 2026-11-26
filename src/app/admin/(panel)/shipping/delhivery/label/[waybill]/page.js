import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getDelhiveryLabel } from "@/lib/services/admin/parity/ops";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { LinkFailed } from "@/components/admin/parity/ops/link-failed";

export const metadata = { title: "Delivery Label" };

export default async function DelhiveryLabelPage({ params }) {
  const { waybill } = await params;
  const { user, allowed } = await checkPermission("shipping.delhivery");
  if (!allowed) return (<><PageHeader title="Delivery Label" /><PermissionDenied module="delivery orders" /></>);
  const result = await getDelhiveryLabel(waybill, user);
  if (result.ok && /^https?:\/\//i.test(result.data.labelUrl ?? "")) redirect(result.data.labelUrl);
  return <LinkFailed title="Delivery Label" message={result.ok ? "Delhivery did not return a label link." : result.message} backHref="/admin/shipping/delhivery" backLabel="Back to Delivery orders" />;
}
