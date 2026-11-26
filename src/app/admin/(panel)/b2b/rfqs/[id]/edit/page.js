import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getRfqDetail, getRfqForm } from "@/lib/services/admin/b2b-screens";
import { Notice, PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { RfqForm } from "@/components/admin/b2b/rfq-form";

export const metadata = { title: "Edit RFQ" };

export default async function EditRfqPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("b2b.rfqs", "edit");
  if (!allowed) return (<><PageHeader title="Edit RFQ" /><PermissionDenied module="editing a B2B RFQ" /></>);
  const back = <ButtonLink href={`/admin/b2b/rfqs/${id}`} size="sm">Back to RFQ</ButtonLink>;
  const result = await Promise.all([getRfqDetail(id, user), getRfqForm(user)]).then(([rfq, options]) => ({ rfq, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Edit RFQ" actions={back} /><ApiUnavailable error={result.error} what="the RFQ" /></>);
  if (!result.rfq) notFound();
  const { rfq, options } = result;
  if (!rfq.actions.edit) return (<><PageHeader title={`Edit ${rfq.number}`} actions={back} /><Notice tone="warning">This RFQ is {rfq.statusLabel} and can no longer be edited.</Notice></>);
  return (
    <>
      <PageHeader title={`Edit ${rfq.number}`} actions={back} />
      <RfqForm options={options} initial={rfq} linesLocked={!rfq.actions.editLines} />
    </>
  );
}
