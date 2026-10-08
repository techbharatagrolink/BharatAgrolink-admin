import { MousePointerClick, Search, Tags, Users } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getTracking } from "@/lib/services/admin/parity/crm";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { TrackingScreen } from "@/components/admin/parity/crm/tracking-screen";
import { listQuery } from "@/components/admin/parity/crm/query";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "Customer Search & Product Click Tracking" };

const TITLE = "Customer Search & Product Click Tracking";
const DESCRIPTION = "What customers search for on the storefront and which products they open, with summaries per product and per search term.";

const VIEWS = ["activity", "products", "terms"];
const FILTERS = ["sort", "activity", "term", "product", "sku", "phone", "name", "userType", "source", "device", "city", "minTimes"];

export default async function CustomerTrackingPage({ searchParams }) {
  const { user, allowed } = await checkPermission("crm.tracking");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="customer search tracking" /></>);
  const params = await searchParams;
  const view = VIEWS.includes(params.view) ? params.view : "activity";
  const { q: _q, ...query } = listQuery(params, FILTERS, { pageSize: 25 });
  let data;
  try {
    data = await getTracking({ ...query, view }, user);
  } catch (error) {
    return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={error} what="search tracking" /></>);
  }
  const { stats } = data;
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <StatGrid className="mb-4">
        <StatCard label="Total Searches" value={formatNumber(stats.totalSearches)} icon={Search} />
        <StatCard label="Unique Search Terms" value={formatNumber(stats.uniqueTerms)} icon={Tags} tone="info" />
        <StatCard label="Product Opens" value={formatNumber(stats.productOpens)} icon={MousePointerClick} tone="warning" />
        <StatCard label="Customers Tracked" value={formatNumber(stats.customers)} icon={Users} tone="neutral" />
      </StatGrid>
      <TrackingScreen view={view} data={data} sources={data.sources} />
    </>
  );
}
