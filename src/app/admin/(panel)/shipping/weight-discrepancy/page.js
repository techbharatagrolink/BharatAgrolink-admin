import { AlertTriangle, Package, Scale, TrendingUp } from "lucide-react";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Weight Discrepancy" };

export default async function WeightDiscrepancyPage({ searchParams }) {
  const params = await searchParams;

  return (
    <ResourcePage resourceKey="shipping.weight" pathname="/admin/shipping/weight-discrepancy" searchParams={params}>
      {(data) => {
        const s = data?.summary;
        return (
          <>
            {s && (
              <StatGrid className="mb-4">
                <StatCard
                  label="Total Discrepancies"
                  value={formatNumber(s.totalCases)}
                  hint={`${formatNumber(s.affectedSkus)} unique SKUs affected`}
                  icon={Package}
                  tone="info"
                />
                <StatCard
                  label="Total Extra Charges"
                  value={formatINR(s.totalExtraCharges)}
                  hint="Carrier discrepancy billing"
                  icon={TrendingUp}
                  tone="danger"
                />
                <StatCard
                  label="Total Weight Variance"
                  value={`+${formatNumber(s.totalExtraWeightKg)} kg`}
                  hint="Excess weight charged by couriers"
                  icon={Scale}
                  tone="warning"
                />
                <StatCard
                  label="Average Variance"
                  value={`+${s.avgVariancePct}%`}
                  hint="Higher than declared package weight"
                  icon={AlertTriangle}
                  tone="danger"
                />
              </StatGrid>
            )}
            <Notice tone="info" className="mb-4">
              <strong>Weight Discrepancy Management:</strong> Discrepancies arise when the courier weighs the shipment higher than the declared catalog weight. Review the courier charged weight against catalog weight, and click <strong>Update Product Weight</strong> in the row actions (or select multiple rows for bulk update) to automatically calibrate catalog product weight and prevent repeated surcharges.
            </Notice>
          </>
        );
      }}
    </ResourcePage>
  );
}
