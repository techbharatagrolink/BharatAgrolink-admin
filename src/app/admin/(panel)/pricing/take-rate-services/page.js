import { checkPermission } from "@/lib/auth/session";
import { canPage } from "@/lib/auth/permissions";
import { scanTakeRateRuleCandidatesAction } from "@/lib/actions/admin/take-rate-rules";
import { formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { TakeRateRulePanel } from "@/components/admin/pricing/take-rate-rule-panel";

export const metadata = { title: "Take-Rate Service Rule" };

export default async function TakeRateServicesPage() {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Take-Rate Service Rule" />
        <PermissionDenied module="products" />
      </>
    );
  }

  const { rows, scanned, totalCatalog, truncated, message, variantNote } = await scanTakeRateRuleCandidatesAction();
  const canApply = canPage(user, "manage_product.php", "edit");

  return (
    <>
      <PageHeader
        title="Take-Rate Service Rule"
        description="Products above 40% take rate get 'sales pitch'; above 45% get 'sales pitch' + 'Marketing' too, and the take rate drops by exactly what the services charge. The base product and each variant are judged on their own take rate and get their own services. Every row below is checked against a live price preview first — MRP, NRV and display price never move."
      />
      {message && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      {variantNote && (
        <Notice tone="warning" className="mb-4">
          Could not load variant-level take rates this time ({variantNote}) — base products are still shown below.
        </Notice>
      )}
      {truncated && (
        <Notice tone="warning" className="mb-4">
          Scanned the {formatNumber(scanned)} most recently updated products out of {formatNumber(totalCatalog)} in the catalog. Some older high-take-rate products may not be listed here yet.
        </Notice>
      )}
      <TakeRateRulePanel rows={rows} canApply={canApply} />
    </>
  );
}
