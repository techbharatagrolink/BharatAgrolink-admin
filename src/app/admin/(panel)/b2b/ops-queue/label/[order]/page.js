import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getB2bLabel } from "@/lib/services/admin/parity/ops";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { LinkFailed } from "@/components/admin/parity/ops/link-failed";

export const metadata = { title: "B2B Shipping Label" };

export default async function B2bLabelPage({ params }) {
  const { order } = await params;
  const { user, allowed } = await checkPermission("b2b.opsQueue");
  if (!allowed) return (<><PageHeader title="Shipping Label" /><PermissionDenied module="the operations queue" /></>);
  const result = await getB2bLabel(order, user);
  if (result.ok && /^https?:\/\//i.test(result.data.labelUrl ?? "")) redirect(result.data.labelUrl);
  return <LinkFailed title="Shipping Label" message={result.ok ? "No label link was found for this order." : result.message} backHref="/admin/b2b/ops-queue" backLabel="Back to operations queue" />;
}
