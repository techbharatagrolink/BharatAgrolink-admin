import { checkPermission } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { ManualOrderForm } from "@/components/admin/orders/manual-order-form";

export const metadata = { title: "Create Manual Order" };

export default async function NewOrderPage({ searchParams }) {
  const params = await searchParams;
  const leadCode = typeof params?.lead_code === "string" ? params.lead_code : "";
  const { allowed } = await checkPermission("orders", "add");
  if (!allowed) return (<><PageHeader title="Create Manual Order" /><PermissionDenied module="order creation" /></>);
  return (
    <>
      <PageHeader
        title="Create Manual Order"
        description="Create a customer order quickly. Search the customer, add products, then choose courier and payment."
        actions={<ButtonLink href="/admin/not-ported?name=Payment%20Attempts&link=manual_payment_attempts.php" variant="secondary" size="sm">Attempts</ButtonLink>}
      />
      <ManualOrderForm leadCode={leadCode} />
    </>
  );
}
