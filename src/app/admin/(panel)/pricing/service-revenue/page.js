import { checkPermission } from "@/lib/auth/session";
import { getServiceRevenueAllocation } from "@/lib/services/admin/pricing-factors";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Service Revenue Allocation" };

export default async function ServiceRevenuePage() {
  const { user, allowed } = await checkPermission("products");
  if (!allowed) return <PageHeader title="Service Revenue Allocation" />;

  const { ok, allocation, message } = await getServiceRevenueAllocation(user);
  const total = allocation.reduce((sum, a) => sum + (Number(a.revenue) || 0), 0);

  return (
    <>
      <PageHeader
        title="Service Revenue Allocation"
        description="Where revenue from priced, Active products is coming from: the platform's own take-rate margin (Base), vs. what sellers pay for the Sales and Marketing services selected on their products. NRV-basis services (deducted from the seller's payout rather than added to the display price) aren't counted here."
      />
      {!ok && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {allocation.map((a) => (
          <Card key={a.label} className="p-3.5">
            <p className="text-xs font-medium text-ink-muted">{a.label}</p>
            <p className="mt-1.5 text-xl font-semibold tabular text-ink">{formatINR(a.revenue)}</p>
            <p className="text-[11px] text-ink-muted">
              {total > 0 ? `${((a.revenue / total) * 100).toFixed(1)}% of total` : "—"}
              {a.products != null && ` · ${formatNumber(a.products)} products`}
            </p>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <CardHeader title="Total" description="Sum across every bucket above." />
        <CardBody>
          <p className="text-2xl font-semibold tabular text-ink">{formatINR(total)}</p>
        </CardBody>
      </Card>
    </>
  );
}
