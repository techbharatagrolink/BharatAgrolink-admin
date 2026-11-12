import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getVendorProfitability } from "@/lib/services/admin/pricing-factors";
import { formatINR, formatNumber, formatPercent } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                <th scope="col" className="px-4 py-2.5">Vendor</th>
                <th scope="col" className="px-4 py-2.5 text-right">Priced products</th>
                <th scope="col" className="px-4 py-2.5 text-right">Total contribution</th>
                <th scope="col" className="px-4 py-2.5 text-right">Avg. margin</th>
                <th scope="col" className="px-4 py-2.5 text-right">Loss</th>
                <th scope="col" className="px-4 py-2.5 text-right">Below floor</th>
                <th scope="col" className="px-4 py-2.5 text-right">Below target</th>
                <th scope="col" className="px-4 py-2.5 text-right">Healthy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.vendorId} className="hover:bg-surface-muted/60">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/vendors/${r.vendorId}`} className="font-medium text-brand-700 hover:underline">{r.vendor}</Link>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular">{formatNumber(r.products)}</td>
                  <td className="px-4 py-2.5 text-right tabular font-medium text-ink">{formatINR(r.totalContribution)}</td>
                  <td className="px-4 py-2.5 text-right tabular">{formatPercent(r.avgMarginBps / 100)}</td>
                  <td className="px-4 py-2.5 text-right tabular">{r.lossCount ? <span className="text-danger-ink">{r.lossCount}</span> : "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular">{r.belowFloorCount || "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular">{r.belowTargetCount || "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular">{r.healthyCount || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="p-4 text-sm text-ink-muted">No priced vendors yet.</p>}
      </Card>
    </>
  );
}
