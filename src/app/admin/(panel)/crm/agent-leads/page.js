import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getAgentLeads } from "@/lib/services/admin/parity/crm";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { LeadTable } from "@/components/admin/parity/crm/lead-table";
import { AgentStatusFilter, ZonePicker } from "@/components/admin/parity/crm/agent-leads-controls";
import { LEAD_SEARCH, leadMobile, leadName, leadStatus, listQuery } from "@/components/admin/parity/crm/query";

export const metadata = { title: "My Leads" };

const TITLE = "My Leads";
const DESCRIPTION = "Leads assigned to you. Update the status after every call, schedule follow-ups and submit reports.";

const COLUMNS = [
  leadName,
  leadMobile,
  leadStatus,
  { key: "nextFollowUp", label: "Next Follow-up", type: "datetime" },
  { key: "createdAt", label: "Created At", type: "datetime" },
  { key: "source", label: "Source", hidden: true },
];

export default async function AgentLeadsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.agentLeads");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="my leads" /></>);
  const query = listQuery(await searchParams, ["status"]);
  let data;
  try {
    data = await getAgentLeads(query, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="your leads" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<ZonePicker key={data.myZones.join(",")} zones={data.zones} myZones={data.myZones} />} />
      <AgentStatusFilter filters={data.filters} />
      <LeadTable
        id="crm-agent-leads"
        scope="agent"
        permission="crm.agentLeads"
        columns={COLUMNS}
        data={data}
        canEdit={can(user, "crm.agentLeads", "edit")}
        search={LEAD_SEARCH}
        dateRange="Created"
        emptyTitle="No leads found"
      />
    </>
  );
}
