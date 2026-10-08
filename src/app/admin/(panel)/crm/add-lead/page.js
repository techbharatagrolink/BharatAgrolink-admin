import { ArrowLeft } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getAddLeadOptions } from "@/lib/services/admin/parity/crm";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { AddLeadForm } from "@/components/admin/parity/crm/add-lead-form";

export const metadata = { title: "Add Lead" };

const TITLE = "Add Lead";
const DESCRIPTION = "Add a single lead or import a sheet. Imported leads are auto-assigned to the least-loaded agent of the number's telecom circle.";

export default async function AddLeadPage() {
  const { user, allowed } = await checkPermission("crm.addLead");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="add lead" /></>);
  let options;
  try {
    options = await getAddLeadOptions(user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="the sales agent list" /></>);
  }
  return (
    <>
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        actions={
          <ButtonLink href="/admin/crm/unassigned" size="sm">
            <ArrowLeft className="size-4" aria-hidden /> Back
          </ButtonLink>
        }
      />
      <AddLeadForm agents={options.agents} />
    </>
  );
}
