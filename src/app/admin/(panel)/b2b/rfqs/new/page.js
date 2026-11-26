import { checkPermission } from "@/lib/auth/session";
import { getRfqForm } from "@/lib/services/admin/b2b-screens";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { RfqForm } from "@/components/admin/b2b/rfq-form";

export const metadata = { title: "Create RFQ" };

const TITLE = "Create RFQ";
const DESCRIPTION = "Capture the buyer's requirement. Opening it starts the quote SLA clock; then invite sellers and compare their quotes.";

/** Screen 9, RFQ Create (task #107 subtask 4). */
export default async function CreateRfqPage() {
  const { user, allowed } = await checkPermission("b2b.rfqs", "add");
  const back = <ButtonLink href="/admin/b2b/rfqs" size="sm">Back to RFQs</ButtonLink>;
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="creating a B2B RFQ" /></>);
  const result = await getRfqForm(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} actions={back} /><ApiUnavailable error={result.error} what="the RFQ form" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={back} />
      <RfqForm options={result.data} />
    </>
  );
}
