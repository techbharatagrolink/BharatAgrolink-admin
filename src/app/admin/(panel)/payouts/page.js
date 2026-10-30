import { checkPermission } from "@/lib/auth/session";
import { getPayoutSummary } from "@/lib/services/admin/payout-summary";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { PayoutSummaryView } from "@/components/admin/payouts/payout-summary-view";

export const metadata = { title: "Vendor Payout Summary" };

const TITLE = "Vendor Payout Summary";
const DESCRIPTION = "One row per vendor payout. BSA = NRV − 1% of taxable; Paid / Pending BSA come from the vendor's payout items. Pick a payout cycle (1st–15th, 16th–month end) to see that cycle only.";

export default async function PayoutSummaryPage({ searchParams }) {
  const { user, allowed } = await checkPermission("payouts");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="vendor payouts" /></>);
  const sp = await searchParams;
  const result = await getPayoutSummary(sp ?? {}, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} description={DESCRIPTION} /><ApiUnavailable error={result.error} what="vendor payouts" /></>);
  return (
    <>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <PayoutSummaryView initialData={result.data} cycles={result.data.cycles} />
    </>
  );
}
