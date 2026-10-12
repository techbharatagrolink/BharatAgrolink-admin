import { checkPermission } from "@/lib/auth/session";
import { getBulkCreateOptions, getBulkQuotation } from "@/lib/services/admin/parity/bulk";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { CreateBulkOrderForm } from "@/components/admin/parity/bulk/create-order-form";

export const metadata = { title: "Create Order" };

const TITLE = "Create Order";
const DESCRIPTION = "Create a bulk cargo order. Pick the customer, add products with quantity and price, then set pickup, delivery and the courier.";

export default async function CreateBulkOrderPage({ searchParams }) {
  const { user, allowed } = await checkPermission("bulk.create");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="creating a bulk order" /></>);

  const sp = await searchParams;
  const quotationId = /^\d+$/.test(String(sp?.quotation_id || "")) ? String(sp.quotation_id) : "";
  const optionsResult = await getBulkCreateOptions(user).then((data) => ({ data }), (error) => ({ error }));
  if (optionsResult.error) {
    return (
      <>
        <PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/bulk-orders/orders" size="sm">All orders</ButtonLink>} />
        <ApiUnavailable error={optionsResult.error} what="the create order form" />
      </>
    );
  }

  const quotation = quotationId ? await getBulkQuotation(quotationId, user).catch(() => null) : null;
  const fromQuotation = Boolean(quotation?.id);
  return (
    <>
      <PageHeader
        title={fromQuotation ? "Create Order from Quotation" : TITLE}
        description={DESCRIPTION}
        actions={<ButtonLink href="/admin/bulk-orders/orders" size="sm">All orders</ButtonLink>}
      />
      <CreateBulkOrderForm options={optionsResult.data} quotation={fromQuotation ? quotation : null} />
    </>
  );
}
