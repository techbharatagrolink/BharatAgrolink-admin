import { checkPermission } from "@/lib/auth/session";
import { getPickupRequestStats } from "@/lib/services/admin/parity/ops";
import { formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Pickup Update" };

export default async function PickupRequestsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("shipping.pickupRequests");
  const s = allowed ? await getPickupRequestStats(user).catch(() => null) : null;

  return (
    <ResourcePage resourceKey="shipping.pickupRequests" pathname="/admin/shipping/pickup-requests" searchParams={params}>
      {s && (
        <StatGrid className="mb-4">
          <StatCard label="Total Requests" value={formatNumber(s.total)} tone="neutral" href="/admin/shipping/pickup-requests" />
          <StatCard label="Pending" value={formatNumber(s.pending)} tone="warning" href="/admin/shipping/pickup-requests?status=Pending" />
          <StatCard label="Approved" value={formatNumber(s.approved)} href="/admin/shipping/pickup-requests?status=Approved" />
          <StatCard label="Rejected" value={formatNumber(s.rejected)} tone="danger" href="/admin/shipping/pickup-requests?status=Rejected" />
        </StatGrid>
      )}
    </ResourcePage>
  );
}
