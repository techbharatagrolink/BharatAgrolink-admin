import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getReturnStats, RETURN_REASONS } from "@/lib/services/admin/returns";
import { formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";
import { AddReturnRequest } from "@/components/admin/workflows/add-return-request";

export const metadata = { title: "Returns" };

/** manage_returns.php: the four counters and "Add Return Request" above the returns list. */
export default async function ReturnsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("returns");
  const s = allowed ? await getReturnStats(user).catch(() => null) : null;

  return (
    <ResourcePage
      resourceKey="returns"
      pathname="/admin/returns"
      searchParams={params}
      actions={allowed && can(user, "returns", "add") ? <AddReturnRequest reasons={RETURN_REASONS} /> : null}
    >
      {s && (
        <StatGrid className="mb-4">
          <StatCard label="Pending Returns" value={formatNumber(s.pending)} tone="warning" href="/admin/returns?status=Pending" />
          <StatCard label="Awaiting Pickup" value={formatNumber(s.awaitingPickup)} tone="info" href="/admin/returns?status=Awaiting+Pickup" />
          <StatCard label="In Transit" value={formatNumber(s.inTransit)} tone="info" href="/admin/returns?status=In+Transit" />
          <StatCard label="Refunded" value={formatNumber(s.refunded)} href="/admin/returns?status=Refunded" />
        </StatGrid>
      )}
    </ResourcePage>
  );
}
