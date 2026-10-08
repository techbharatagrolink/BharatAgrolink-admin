import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getDeadLeads } from "@/lib/services/admin/parity/crm";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { LeadTable } from "@/components/admin/parity/crm/lead-table";
import { LEAD_SEARCH, leadMobile, leadName, leadStatus, listQuery } from "@/components/admin/parity/crm/query";

export const metadata = { title: "Dead Leads" };

const TITLE = "Dead Leads";
const DESCRIPTION = "Review leads marked dead. Reassign them to an agent or ask the agent for a report.";

const COLUMNS = [leadName, leadMobile, { key: "agentName", label: "Assigned Agent" }, leadStatus, { key: "updatedAt", label: "Last Updated", type: "datetime" }];

export default async function DeadLeadsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.dead");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="dead leads" /></>);
  const query = listQuery(await searchParams, ["agent"]);
  let data;
  try {
    data = await getDeadLeads(query, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="dead leads" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <LeadTable
        id="crm-dead"
        scope="dead"
        permission="crm.dead"
        columns={COLUMNS}
        data={data}
        agents={data.agents}
        canEdit={can(user, "crm.dead", "edit")}
        search={LEAD_SEARCH}
        filters={[{ key: "agent", label: "Agent", options: data.agentFilter }]}
        dateRange="Last updated"
        emptyTitle="No dead leads"
      />
    </>
  );
}
