import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getProcurementOptions, getSupplierRfq } from "@/lib/services/admin/b2b-screens";
import { Notice, PageHeader } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { SupplierResponseForm } from "@/components/admin/b2b/supplier-response-form";

export const metadata = { title: "Record Supplier Response" };

export default async function RecordResponsePage({ params, searchParams }) {
  const { id } = await params;
  const { seller } = (await searchParams) ?? {};
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("b2b.rfqs", "edit");
  if (!allowed) return (<><PageHeader title="Record Supplier Response" /><PermissionDenied module="recording supplier responses" /></>);
  const back = <ButtonLink href={`/admin/b2b/procurement/${id}`} size="sm">Back</ButtonLink>;
  const result = await Promise.all([getSupplierRfq(id, user), getProcurementOptions(user)]).then(([rfq, options]) => ({ rfq, options }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="Record Supplier Response" actions={back} /><ApiUnavailable error={result.error} what="the RFQ" /></>);
  if (!result.rfq) notFound();
  const { rfq, options } = result;
  if (!rfq.actions.recordResponse) return (<><PageHeader title={`Response to ${rfq.number}`} actions={back} /><Notice tone="warning">Responses can be recorded only while the RFQ is open, by staff with edit rights.</Notice></>);
  if (!rfq.invites.length) return (<><PageHeader title={`Response to ${rfq.number}`} actions={back} /><Notice tone="warning">Invite the supplier first.</Notice></>);
  return (
    <>
      <PageHeader title={`Response to ${rfq.number}`} description={rfq.title} actions={back} />
      <SupplierResponseForm rfq={rfq} options={options} sellerId={/^\d+$/.test(seller ?? "") ? Number(seller) : null} />
    </>
  );
}
