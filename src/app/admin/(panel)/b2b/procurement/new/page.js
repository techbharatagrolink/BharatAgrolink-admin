import { checkPermission } from "@/lib/auth/session";
import { getProcurementOptions } from "@/lib/services/admin/b2b-screens";
import { PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ProcurementRfqForm } from "@/components/admin/b2b/procurement-rfq-form";

export const metadata = { title: "New Supplier RFQ" };

export default async function NewProcurementRfqPage() {
  const { user, allowed } = await checkPermission("b2b.rfqs", "add");
  const back = <ButtonLink href="/admin/b2b/procurement" size="sm">Back</ButtonLink>;
  if (!allowed) return (<><PageHeader title="New Supplier RFQ" /><PermissionDenied module="creating a supplier RFQ" /></>);
  const result = await getProcurementOptions(user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="New Supplier RFQ" actions={back} /><ApiUnavailable error={result.error} what="the form" /></>);
  return (
    <>
      <PageHeader title="New Supplier RFQ" description="Ask a manufacturer or seller for their commercial offer: slab rates, terms, dispatch and declaration." actions={back} />
      <ProcurementRfqForm options={result.data} />
    </>
  );
}
