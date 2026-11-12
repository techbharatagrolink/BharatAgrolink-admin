import { checkPermission } from "@/lib/auth/session";
import { getProfitabilityAuditCandidates } from "@/lib/services/admin/products";
import { formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { ProfitabilityAuditTable } from "@/components/admin/pricing/profitability-audit-table";

export const metadata = { title: "Profitability Audit" };

export default async function ProfitabilityAuditPage() {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Profitability Audit" />
        <PermissionDenied module="products" />
      </>
    );
  }

  const { rows, scanned, totalCatalog, truncated, message } = await getProfitabilityAuditCandidates(user);

  return (
    <>
      <PageHeader
        title="Profitability Audit"
        description="Every Active product currently below the minimum contribution-margin target, so pricing can be reviewed and corrected before it loses money."
      />
      {message && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      {truncated && (
        <Notice tone="warning" className="mb-4">
          Scanned the {formatNumber(scanned)} most recently updated products out of {formatNumber(totalCatalog)} in the catalog. Older products may not be listed here yet.
        </Notice>
      )}
      <Card>
        <CardHeader
          title={`${formatNumber(rows.length)} product${rows.length === 1 ? "" : "s"} below target`}
          description="Loss-making or below the floor contribution margin, scanned from the live products list."
        />
        {rows.length ? (
          <ProfitabilityAuditTable rows={rows} />
        ) : (
          <CardBody>
            <p className="text-sm text-ink-muted">No priced product is currently below the contribution-margin target.</p>
          </CardBody>
        )}
      </Card>
    </>
  );
}
