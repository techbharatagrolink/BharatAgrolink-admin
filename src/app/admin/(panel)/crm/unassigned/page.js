import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getUnassignedLeads } from "@/lib/services/admin/parity/crm";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { LeadTable } from "@/components/admin/parity/crm/lead-table";
import { LEAD_SEARCH, leadMobile, leadName, leadStatus, listQuery } from "@/components/admin/parity/crm/query";

export const metadata = { title: "Pending Leads" };

const TITLE = "Pending Leads";
const DESCRIPTION = "Unassigned leads that are not dead or done. Assign them to a sales agent, submit a report or close them.";

const COLUMNS = [leadName, leadMobile, { key: "source", label: "Source" }, leadStatus, { key: "createdAt", label: "Created At", type: "datetime" }];

export default async function UnassignedLeadsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.unassigned");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="pending leads" /></>);
  const query = listQuery(await searchParams);
  let data;
  try {
    data = await getUnassignedLeads(query, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="pending leads" /></>);
  }
  return (
    <>
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        actions={can(user, "crm.addLead", "add") ? <ButtonLink href="/admin/crm/add-lead" size="sm" variant="primary">Add Lead</ButtonLink> : null}
      />
      <LeadTable
        id="crm-unassigned"
        scope="unassigned"
        permission="crm.unassigned"
        columns={COLUMNS}
        data={data}
        agents={data.agents}
        canEdit={can(user, "crm.unassigned", "edit")}
        search={LEAD_SEARCH}
        dateRange="Created"
        emptyTitle="No unassigned leads"
      />
    </>
  );
}
