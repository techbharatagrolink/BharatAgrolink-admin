import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getResource } from "@/lib/content/admin/resources";
import { listResource, resolveFormOptions } from "@/lib/services/admin/resources";
import { ResourcePage } from "@/components/admin/resource/resource-page";
import { AgentMaster } from "@/components/admin/parity/ops/agent-master";

export const metadata = { title: "Agents & KPI Targets" };

const AGENTS = "operations.agentMaster";

/**
 * operations_team/setup.php: "1) Agent Master" above the KPI targets list.
 * The agent list ignores the page URL (it is never paged or filtered), so the
 * KPI table keeps its own list state.
 */
export default async function OperationsSetupPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("operations.setup");
  const resource = getResource(AGENTS);
  const [agents, optionSets] = allowed ? await Promise.all([listResource(AGENTS, { pageSize: "100" }, user), resolveFormOptions(resource, user)]) : [null, {}];

  return (
    <ResourcePage resourceKey="operations.setup" pathname="/admin/operations/team/setup" searchParams={params}>
      {agents && (
        <AgentMaster
          rows={agents.rows}
          unavailable={agents.unavailable}
          fields={resource.form.fields}
          optionSets={optionSets}
          canAdd={can(user, resource.permission, "add")}
          canEdit={can(user, resource.permission, "edit")}
        />
      )}
    </ResourcePage>
  );
}
