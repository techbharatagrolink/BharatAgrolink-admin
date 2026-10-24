import { getCurrentAdmin, checkPermission } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { PaymentAttemptsTable } from "@/components/admin/orders/payment-attempts-table";
import { listPaymentAttempts, ATTEMPT_STATUSES } from "@/lib/services/admin/payment-attempts";

export const metadata = { title: "Payment Attempts" };

export default async function PaymentAttemptsPage({ searchParams }) {
  const params = await searchParams;
  const statusParam = typeof params?.status === "string" ? params.status : "";
  const status = ATTEMPT_STATUSES.some((s) => s.value === statusParam) ? statusParam : "";

  const { allowed: allowedAttempts } = await checkPermission("orders.paymentAttempts");
  const { allowed: allowedOrders } = allowedAttempts ? { allowed: true } : await checkPermission("orders");
  if (!allowedAttempts && !allowedOrders) {
    return (
      <>
        <PageHeader title="Payment Attempts" />
        <PermissionDenied module="payment attempts" />
      </>
    );
  }

  const user = await getCurrentAdmin();
  const { rows, statusCounts } = await listPaymentAttempts(user, { status });

  return (
    <>
      <PageHeader
        title="Manual Payment Attempts"
        description="Track, retry, and sync manual order payments. Expired pending payments auto-clear after 15 minutes."
        actions={<ButtonLink href="/admin/orders/new" variant="secondary" size="sm">Create Manual Order</ButtonLink>}
      />
      <PaymentAttemptsTable
        initialRows={rows}
        statusCounts={statusCounts}
        initialStatus={status}
      />
    </>
  );
}
