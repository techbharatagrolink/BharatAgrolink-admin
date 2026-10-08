import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getRequestedLeads } from "@/lib/services/admin/parity/crm";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { LeadTable } from "@/components/admin/parity/crm/lead-table";
import { LEAD_SEARCH, leadMobile, leadName, leadStatus, listQuery } from "@/components/admin/parity/crm/query";

export const metadata = { title: "Report Requested Leads" };

const TITLE = "Report Requested Leads";
const DESCRIPTION = "Leads awaiting a report, with who asked for it and when (latest request per lead).";

const COLUMNS = [leadName, leadMobile, leadStatus, { key: "requestedBy", label: "Requested By" }, { key: "requestedAt", label: "Requested At", type: "datetime" }];

export default async function RequestedLeadsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.requested");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="report requested leads" /></>);
  const query = listQuery(await searchParams, ["agent"]);
  let data;
  try {
    data = await getRequestedLeads(query, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="report requested leads" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <LeadTable
        id="crm-requested"
        scope="requested"
        permission="crm.requested"
        columns={COLUMNS}
        data={data}
        agents={data.agents}
        canEdit={can(user, "crm.requested", "edit")}
        search={LEAD_SEARCH}
        filters={[{ key: "agent", label: "Agent", options: data.agentFilter }]}
        dateRange="Last updated"
        emptyTitle="No leads awaiting a report"
      />
    </>
  );
}
