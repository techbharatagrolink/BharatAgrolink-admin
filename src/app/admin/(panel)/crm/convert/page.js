import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkInquiries, getEngagement } from "@/lib/services/admin/parity/crm";
import { LinkTabs, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkInquiryTable, EngagementTable } from "@/components/admin/parity/crm/convert-tables";
import { listQuery } from "@/components/admin/parity/crm/query";

export const metadata = { title: "Convert To Leads" };

const TITLE = "Convert To Leads";
const DESCRIPTION = "View and manually convert engagement data and bulk inquiries to leads.";

const TABS = [
  { value: "engagement", label: "Engagement Leads", href: "/admin/crm/convert" },
  { value: "bulk", label: "Bulk Inquiry", href: "/admin/crm/convert?tab=bulk" },
];

export default async function ConvertLeadsPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.convert");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="convert to leads" /></>);
  const params = await searchParams;
  const tab = params.tab === "bulk" ? "bulk" : "engagement";
  const query = listQuery(params, tab === "bulk" ? ["state"] : ["type"], { pageSize: 25 });
  if (query.type && !["cart", "viewed"].includes(query.type)) delete query.type;
  let data;
  try {
    data = tab === "bulk" ? await getBulkInquiries(query, user) : await getEngagement(query, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what={tab === "bulk" ? "bulk inquiries" : "engagement data"} /></>);
  }
  const canConvert = can(user, "crm.convert", "add");
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <LinkTabs tabs={TABS} active={tab} />
      {tab === "bulk" ? <BulkInquiryTable data={data} agents={data.agents} canConvert={canConvert} /> : <EngagementTable data={data} canConvert={canConvert} />}
    </>
  );
}
