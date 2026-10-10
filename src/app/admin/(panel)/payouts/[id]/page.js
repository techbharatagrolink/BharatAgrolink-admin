import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getPayoutItems } from "@/lib/services/admin/payout-items";
import { formatDateTime } from "@/lib/format";
import { PageHeader, Timeline } from "@/components/ui/page";
import { buttonClasses } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { PayoutItemsTable } from "@/components/admin/payouts/payout-items-table";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

const TITLE = "Vendor Payout Items";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `${TITLE} · Payout ${id}` };
}

export default async function PayoutDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/payouts/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("payouts");
  if (!allowed) return (<><PageHeader title={TITLE} /><PermissionDenied module="vendor payouts" /></>);
  const sp = (await searchParams) ?? {};
  const result = await getPayoutItems(id, sp, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title={TITLE} /><ApiUnavailable error={result.error} what="payout items" /></>);
  const data = result.data;
  if (!data) notFound();
  const { payout } = data;
  const queryKey = JSON.stringify(data.query);

  return (
    <>
      <PageHeader
        title={TITLE}
        description={`Payout ${payout.id} · ${payout.vendor}. Final seller Payout = Total NRV − TCS (1% of taxable). Cycles are filtered here, never shifted.`}
        actions={
          <>
            <Link href="/admin/payouts" className={buttonClasses({ variant: "secondary", size: "sm" })}>
              <ArrowLeft className="size-4" aria-hidden /> Payout summary
            </Link>
            {payout.sellerId ? (
              <Link href={`/admin/vendors/${payout.sellerId}`} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                Open vendor
              </Link>
            ) : null}
          </>
        }
      />
      <div className="min-w-0 space-y-4">
        <PayoutItemsTable key={queryKey} payoutId={payout.id} data={data} cycles={data.cycles} canEdit={can(user, "payouts", "edit")} />
        <details className="group min-w-0 rounded-xl border border-line bg-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-ink">
            <span>
              Change history <span className="font-normal text-ink-muted">· latest {data.history.length} payout events</span>
            </span>
            <ChevronDown className="size-4 text-ink-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="border-t border-line px-4 py-3">
            {data.history.length ? (
              <Timeline items={data.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) }))} />
            ) : (
              <p className="text-sm text-ink-muted">No changes recorded for this payout yet.</p>
            )}
          </div>
        </details>
      </div>
    </>
  );
}
