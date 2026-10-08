import { checkPermission } from "@/lib/auth/session";
import { getDeliveredCharts, getDeliveredOptions, getDeliveredSummary, getDeliveredTable } from "@/lib/services/admin/parity/ops";
import { PageHeader } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { deliveredQuery } from "@/components/admin/parity/ops/delivered-config";
import { DeliveredFilters } from "@/components/admin/parity/ops/delivered-filters";
import { DeliveredCharts, DeliveredKpis } from "@/components/admin/parity/ops/delivered-overview";
import { DeliveredTable } from "@/components/admin/parity/ops/delivered-table";

export const metadata = { title: "Master Delivered Orders" };

const TITLE = "Master Delivered Orders";
const DESCRIPTION = "Delivered B2C order lines and B2B orders in one view: revenue, GST, platform fee and vendor payout.";

export default async function MasterDeliveredOrdersPage({ searchParams }) {
  const { user, allowed } = await checkPermission("orders.delivered");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="master delivered orders" /></>);
  const query = deliveredQuery(await searchParams);
  const { page, perPage, sort, order, ...filters } = query;
  const result = await Promise.all([
    getDeliveredOptions(user),
    getDeliveredSummary(filters, user),
    getDeliveredCharts(filters, user),
    getDeliveredTable({ ...filters, page, perPage, sort, order }, user),
  ]).then(([options, summary, charts, table]) => ({ options, summary, charts, table }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="delivered orders" /></>);
  const { options, summary, charts, table } = result;
  const period = query.from || query.to ? `${query.from || "start"} to ${query.to || "today"}` : "Lifetime";
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} meta={<Badge tone="neutral">{period}</Badge>} />
      <div className="space-y-4">
        <DeliveredFilters key={JSON.stringify(filters)} query={query} options={options} />
        <DeliveredKpis summary={summary.summary} trends={summary.trends} hasWindow={Boolean(summary.previous)} />
        <DeliveredCharts charts={charts} />
        <DeliveredTable table={table} />
      </div>
    </>
  );
}
