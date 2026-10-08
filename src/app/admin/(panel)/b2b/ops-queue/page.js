import { checkPermission } from "@/lib/auth/session";
import { getOpsQueueStats } from "@/lib/services/admin/parity/ops";
import { formatINR, formatNumber } from "@/lib/format";
import { StatCard, StatGrid } from "@/components/ui/page";
import { ResourcePage } from "@/components/admin/resource/resource-page";

export const metadata = { title: "Operations Queue" };

export default async function OpsQueuePage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("b2b.opsQueue");
  const s = allowed ? await getOpsQueueStats(user).catch(() => null) : null;

  return (
    <ResourcePage resourceKey="b2b.opsQueue" pathname="/admin/b2b/ops-queue" searchParams={params}>
      {s && (
        <StatGrid className="mb-4">
          <StatCard label="Awaiting Processing" value={formatNumber(s.awaiting)} hint="Paid or approved, not started" tone={s.awaiting > 0 ? "warning" : "neutral"} />
          <StatCard label="In Packing" value={formatNumber(s.packing)} hint="Pick, pack and label" tone="info" />
          <StatCard label="Dispatch Overdue" value={formatNumber(s.overdue)} hint="Past expected dispatch date" tone={s.overdue > 0 ? "danger" : "neutral"} />
          <StatCard label="Queue Value" value={formatINR(s.queueValue)} hint="Value sitting in operations" />
        </StatGrid>
      )}
    </ResourcePage>
  );
}
