import { checkPermission } from "@/lib/auth/session";
import { getTeamPerformance } from "@/lib/services/admin/parity/crm";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { RefreshButton } from "@/components/admin/parity/crm/performance-controls";
import { TeamPerformance } from "@/components/admin/parity/crm/team-performance";

export const metadata = { title: "Sales Performance" };

const TITLE = "Sales Performance";
const DESCRIPTION = "Overview of team metrics and KPIs: leads, conversions and revenue from leads per sales agent.";

export default async function TeamPerformancePage() {
  const { user, allowed } = await checkPermission("sales.teamPerformance");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="sales performance" /></>);
  let data;
  try {
    data = await getTeamPerformance(user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="sales performance" /></>);
  }
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} actions={<RefreshButton />} />
      <TeamPerformance rows={data.rows} summary={data.summary} />
    </>
  );
}
