import { checkPermission } from "@/lib/auth/session";
import { getOrderForm } from "@/lib/services/admin/b2b-screens";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { OrderForm } from "@/components/admin/b2b/order-form";

export const metadata = { title: "Create B2B Order" };

const TITLE = "Create B2B Order";
const DESCRIPTION = "Book a B2B order directly. Buyer, customer type, delivery, product lines, quantities and rates. Prepaid and partial advance are collected before the order is booked.";

export default async function CreateB2bOrderPage() {
  const { user, allowed } = await checkPermission("b2b.orders", "add");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="creating a B2B order" /></>);
  const result = await getOrderForm(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/orders" size="sm">Back to orders</ButtonLink>} /><ApiUnavailable error={result.error} what="the order form" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/orders" size="sm">Back to orders</ButtonLink>} />
      <OrderForm options={result.data} />
    </>
  );
}
