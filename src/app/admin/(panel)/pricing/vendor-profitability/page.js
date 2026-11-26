import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getVendorProfitability } from "@/lib/services/admin/pricing-factors";
import { formatINR, formatNumber, formatPercent } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Vendor Profitability Report" };

export default async function VendorProfitabilityPage() {
  const { user, allowed } = await checkPermission("products");
  if (!allowed) return (<><PageHeader title="Vendor Profitability" /><PermissionDenied module="vendor profitability" /></>);

  const { ok, rows, message } = await getVendorProfitability(user, { limit: 200 });

  return (
    <>
      <PageHeader
        title="Vendor-wise Profitability"
        description="Total contribution and margin-verdict counts per vendor, from their priced & Active products only (most of the catalog hasn't been priced through the new Pricing & Tax system yet, so this reflects that subset)."
      />
      {!ok && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      <Card>
        <MiniTable
          rows={rows.map((r) => ({ ...r, id: r.vendorId }))}
          exportName="vendor-profitability"
          columns={[
            { key: "vendor", label: "Vendor", render: (r) => <Link href={`/admin/vendors/${r.vendorId}`} className="font-medium text-brand-700 hover:underline">{r.vendor}</Link> },
            { key: "products", label: "Priced products", align: "right", render: (r) => formatNumber(r.products) },
            { key: "total", label: "Total contribution", align: "right", render: (r) => <span className="font-medium text-ink">{formatINR(r.totalContribution)}</span> },
            { key: "avg", label: "Avg. margin", align: "right", render: (r) => formatPercent(r.avgMarginBps / 100) },
            { key: "loss", label: "Loss", align: "right", render: (r) => (r.lossCount ? <span className="text-danger-ink">{r.lossCount}</span> : "—") },
            { key: "floor", label: "Below floor", align: "right", render: (r) => r.belowFloorCount || "—" },
            { key: "below", label: "Below target", align: "right", render: (r) => r.belowTargetCount || "—" },
            { key: "healthy", label: "Healthy", align: "right", render: (r) => r.healthyCount || "—" },
          ]}
        />
        {!rows.length && <p className="p-4 text-sm text-ink-muted">No priced vendors yet.</p>}
      </Card>
    </>
  );
}
