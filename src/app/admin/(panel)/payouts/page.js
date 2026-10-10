import { checkPermission } from "@/lib/auth/session";
import { getPayoutSummary } from "@/lib/services/admin/payout-summary";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { PayoutSummaryTable } from "@/components/admin/payouts/payout-summary-table";

export const metadata = { title: "Vendor Payout Summary" };

const TITLE = "Vendor Payout Summary";
const DESCRIPTION = "One row per vendor payout. BSA = NRV − 1% of taxable; Paid / Pending BSA come from the vendor's payout items. Pick a payout cycle (1st–15th, 16th–month end) to see that cycle only.";

export default async function PayoutSummaryPage({ searchParams }) {
  const { user, allowed } = await checkPermission("payouts");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="vendor payouts" /></>);
  const sp = await searchParams;
  const result = await getPayoutSummary(sp ?? {}, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="vendor payouts" /></>);
  const { data } = result;
  const t = data.totals ?? {};
  const cycleText = data.cycle ? data.cycle.cycles.map((c) => c.label).join(" + ") : "";

  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <div className="min-w-0 space-y-4">
        {data.cycle && (
          <Notice title={`Cycle: ${cycleText}`}>
            Orders, Gross, Taxable and Net are the sums of this cycle&apos;s payout items; without a cycle they are the stored vendor payout totals, as in the PHP summary.
          </Notice>
        )}
        <StatGrid className="md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Records" value={formatNumber(t.records)} hint={`${formatNumber(t.pendingItems)} pending items`} />
          <StatCard label="Total BSA" value={formatINR(t.totalBsa)} hint="Paid + pending BSA" tone="info" />
          <StatCard label="Paid BSA" value={formatINR(t.paidBsa)} hint="Items marked paid" />
          <StatCard label="Pending BSA" value={formatINR(t.pendingBsa)} hint="Items still pending" tone="warning" />
        </StatGrid>
        <PayoutSummaryTable data={data} cycles={data.cycles} />
      </div>
    </>
  );
}
