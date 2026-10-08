import { checkPermission } from "@/lib/auth/session";
import { getLogisticsStats } from "@/lib/services/admin/parity/ops";
import { formatINR, formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "B2B Logistics" };

export default async function B2bLogisticsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("b2b.logistics");
  const s = allowed ? await getLogisticsStats(user).catch(() => null) : null;

  return (
    <ResourcePage resourceKey="b2b.logistics" pathname="/admin/b2b/logistics" searchParams={params}>
      {s && (
        <StatGrid className="mb-4">
          <StatCard label="Awaiting Booking" value={formatNumber(s.awaitingBooking)} hint="No AWB/LR yet" tone={s.awaitingBooking > 0 ? "warning" : "neutral"} />
          <StatCard label="In Transit" value={formatNumber(s.inTransit)} hint="On the road" tone="info" />
          <StatCard label="Delayed" value={formatNumber(s.delayed)} hint="Past ETA" tone={s.delayed > 0 ? "danger" : "neutral"} />
          <StatCard label="Freight Variance" value={formatINR(s.freightVariance)} hint="Actual less estimated" />
        </StatGrid>
      )}
    </ResourcePage>
  );
}
