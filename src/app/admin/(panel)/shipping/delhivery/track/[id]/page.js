import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getDelhiveryTracking } from "@/lib/services/admin/parity/ops";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { LinkFailed } from "@/components/admin/parity/ops/link-failed";

export const metadata = { title: "Track Delhivery Shipment" };

export default async function DelhiveryTrackPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("shipping.delhivery");
  if (!allowed) return (<><PageHeader title="Track Shipment" /><PermissionDenied module="Delhivery orders" /></>);
  if (!/^\d+$/.test(id)) return <LinkFailed title="Track Shipment" message="Unknown shipment." backHref="/admin/shipping/delhivery" backLabel="Back to Delhivery orders" />;
  const result = await getDelhiveryTracking(id, user);
  if (result.ok && /^https?:\/\//i.test(result.data.url ?? "")) redirect(result.data.url);
  return <LinkFailed title="Track Shipment" message={result.ok ? "No tracking link for this shipment." : result.message} backHref="/admin/shipping/delhivery" backLabel="Back to Delhivery orders" />;
}
