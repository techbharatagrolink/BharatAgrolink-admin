import { ResourcePage } from "@/components/admin/resource/resource-page";
import { LeadSheetBar } from "@/components/admin/crm/lead-sheet-bar";
import { checkPermission } from "@/lib/auth/session";
import { mySalesTarget } from "@/lib/services/admin/crm-sheet";

export const metadata = { title: "CRM Lead Sheet" };

export default async function CrmLeadsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("crm.leads");
  const target = allowed ? await mySalesTarget(user).catch(() => null) : null;
  return (
    <ResourcePage resourceKey="crm.leads" pathname="/admin/crm/leads" searchParams={params}>
      <LeadSheetBar target={target} />
    </ResourcePage>
  );
}
