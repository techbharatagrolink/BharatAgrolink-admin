import { checkPermission } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { PaymentAttemptsTable } from "@/components/admin/orders/payment-attempts-table";

export const metadata = { title: "Payment Attempts" };

export default async function PaymentAttemptsPage({ searchParams }) {
  const params = await searchParams;
  const status = typeof params?.status === "string" ? params.status : "";
  const { allowed } = await checkPermission("orders");
  if (!allowed) return (<><PageHeader title="Payment Attempts" /><PermissionDenied module="payment attempts" /></>);
  return (
    <>
      <PageHeader
        title="Payment Attempts"
        description="View and manage manual payment attempts. Filter by status, retry failed payments, or sync captured payments."
      />
      <PaymentAttemptsTable initialStatus={status} />
    </>
  );
}