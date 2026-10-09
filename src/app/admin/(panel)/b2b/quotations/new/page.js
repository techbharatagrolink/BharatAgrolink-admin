import { checkPermission } from "@/lib/auth/session";
import { getQuotationForm } from "@/lib/services/admin/b2b-screens";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QuotationForm } from "@/components/admin/b2b/quotation-form";

export const metadata = { title: "Create Quotation" };

const TITLE = "Create Quotation";
const DESCRIPTION = "Buyer, customer type, delivery, product lines, quantities, rates and validity. Commercial totals are calculated when the quotation is saved.";

export default async function CreateQuotationPage() {
  const { user, allowed } = await checkPermission("b2b.quotations", "add");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="creating a B2B quotation" /></>);
  const result = await getQuotationForm(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/quotations" size="sm">Back to quotations</ButtonLink>} /><ApiUnavailable error={result.error} what="the quotation form" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/quotations" size="sm">Back to quotations</ButtonLink>} />
      <QuotationForm options={result.data} />
    </>
  );
}
