import { checkPermission } from "@/lib/auth/session";
import { manualOrderOptions } from "@/lib/services/admin/orders";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ManualOrderForm } from "@/components/admin/orders/manual-order-form";

export const metadata = { title: "Create Order" };

export default async function NewOrderPage() {
  const { allowed } = await checkPermission("orders", "add");
  if (!allowed) return (<><PageHeader title="Create Order" /><PermissionDenied module="order creation" /></>);
  return (
    <>
      <PageHeader title="Create Order" description="Manual order for phone, WhatsApp or field sales. The order starts as Placed and follows the normal vendor acceptance flow." />
      <ManualOrderForm options={manualOrderOptions()} />
    </>
  );
}
