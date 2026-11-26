import { checkPermission } from "@/lib/auth/session";
import { getQuotationForm, getRfqQuotationDraft } from "@/lib/services/admin/b2b-screens";
import { Notice, PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { QuotationForm } from "@/components/admin/b2b/quotation-form";

export const metadata = { title: "Create Quotation" };

const TITLE = "Create Quotation";
const DESCRIPTION = "Buyer, customer type, delivery, product lines, quantities, rates and validity. Commercial totals are calculated when the quotation is saved.";

export default async function CreateQuotationPage({ searchParams }) {
  const { user, allowed } = await checkPermission("b2b.quotations", "add");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="creating a B2B quotation" /></>);
  const result = await getQuotationForm(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/quotations" size="sm">Back to quotations</ButtonLink>} /><ApiUnavailable error={result.error} what="the quotation form" /></>);
  }
  // From an RFQ (task #107 subtask 4): pre-filled from its sourcing; sourced lines cost the seller's quoted rate.
  const { rfq } = (await searchParams) ?? {};
  if (rfq && /^\d+$/.test(rfq)) {
    const back = <ButtonLink href={`/admin/b2b/rfqs/${rfq}`} size="sm">Back to RFQ</ButtonLink>;
    const draft = await getRfqQuotationDraft(rfq, user).catch((error) => ({ error: error?.message || "Could not load the RFQ." }));
    if (draft.error) return (<><PageHeader title={TITLE} actions={back} /><Notice tone="warning">{draft.error}</Notice></>);
    return (
      <>
        <PageHeader title={`${TITLE} from ${draft.data.rfqNumber}`} description="Lines come from the chosen seller offers: each line's seller cost is that seller's quoted rate. Set the buyer rates; totals, CM and approval are calculated on save." actions={back} />
        <QuotationForm options={result.data} initial={draft.data} />
      </>
    );
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<ButtonLink href="/admin/b2b/quotations" size="sm">Back to quotations</ButtonLink>} />
      <QuotationForm options={result.data} />
    </>
  );
}
