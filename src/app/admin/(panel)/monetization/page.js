import { formatINR, formatNumber } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { StatCard, StatGrid, Notice } from "@/components/ui/page";
import { Card, CardHeader } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";

export const metadata = { title: "Monetization Overview" };

const day = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);

export default async function MonetizationOverviewPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const { user, header, denied } = await monetizationPage({
    title: "Monetization Center",
    description: "Standalone prepaid banner advertising: revenue, orders waiting for review and live ads. Separate from service charges, commission and BAL invoices.",
    actions: (
      <ButtonLink href="/admin/monetization/packages" size="sm">
        Services &amp; packages
      </ButtonLink>
    ),
  });
  if (denied) return denied;

  const [overview, packages] = await Promise.all([
    loadMonetization(user, "overview", { from: day(sp.from), to: day(sp.to) }),
    loadMonetization(user, "packages"),
  ]);
  if (overview.error)
    return (
      <>
        {header}
        <LoadError error={overview.error} what="the Monetization Center" />
      </>
    );
  const o = overview.data;
  const activePackages = (packages.data ?? []).filter((p) => p.isActive).length;

  return (
    <>
      {header}
      {packages.data && activePackages === 0 && (
        <Notice tone="warning" title="No package is on sale yet" className="mb-4">
          Sellers cannot buy banner ads until a package has a price and is active. Set prices in Services &amp; Packages.
        </Notice>
      )}
      <p className="mb-2 text-xs text-ink-muted">
        Revenue and orders from {o.range.from} to {o.range.to} (by payment date). Workload and ad counts are as of now.
      </p>
      <StatGrid className="xl:grid-cols-5">
        <StatCard label="Revenue (incl. GST)" value={formatINR(o.totals.revenue)} hint={`${formatINR(o.totals.revenueTaxable)} before GST`} />
        <StatCard label="Paid orders" value={formatNumber(o.totals.paidOrders)} hint={`${formatNumber(o.totals.orders)} orders placed`} tone="neutral" />
        <StatCard label="Pending payment" value={formatNumber(o.workload.pendingPayment)} tone="neutral" />
        <StatCard label="Waiting for review" value={formatNumber(o.workload.pendingReview)} hint={`${formatNumber(o.workload.revisionRequired)} revision requested`} tone={o.workload.pendingReview ? "warning" : "neutral"} />
        <StatCard label="Payment failures" value={formatNumber(o.payments.failed)} hint={`${formatNumber(o.payments.refunds)} refunds`} tone={o.payments.failed ? "danger" : "neutral"} />
      </StatGrid>
      <StatGrid className="mt-3 xl:grid-cols-6">
        <StatCard label="Approved, not scheduled" value={formatNumber(o.workload.approvedUnscheduled)} tone="neutral" />
        <StatCard label="Scheduled" value={formatNumber(o.ads.scheduled)} tone="neutral" />
        <StatCard label="Active" value={formatNumber(o.ads.active)} />
        <StatCard label="Paused" value={formatNumber(o.ads.paused)} tone="neutral" />
        <StatCard label="Expiring in 3 days" value={formatNumber(o.workload.expiringSoon)} tone={o.workload.expiringSoon ? "warning" : "neutral"} />
        <StatCard label="Completed" value={formatNumber(o.ads.completed)} hint={`${formatNumber(o.ads.suspended)} suspended`} tone="neutral" />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader title="Revenue by ad type" />
          <MiniTable
            columns={[
              { key: "name", label: "Ad type" },
              { key: "orders", label: "Paid orders", align: "right", render: (r) => formatNumber(r.orders) },
              { key: "revenue", label: "Revenue", align: "right", render: (r) => formatINR(r.revenue) },
            ]}
            rows={o.byService.map((r) => ({ ...r, id: r.serviceId }))}
          />
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Top sellers" description="By banner ad revenue in this period." />
          <MiniTable
            empty="No paid banner orders in this period."
            columns={[
              {
                key: "seller",
                label: "Seller",
                render: (r) => (
                  <span className="block">
                    <span className="font-medium text-ink">{r.sellerName}</span>
                    <span className="block text-xs text-ink-muted">{r.sellerId}</span>
                  </span>
                ),
              },
              { key: "orders", label: "Orders", align: "right", render: (r) => formatNumber(r.orders) },
              { key: "revenue", label: "Revenue", align: "right", render: (r) => formatINR(r.revenue) },
            ]}
            rows={o.bySeller.map((r) => ({ ...r, id: r.sellerId }))}
          />
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Revenue by day" />
        <MiniTable
          empty="No paid banner orders in this period."
          columns={[
            { key: "day", label: "Date" },
            { key: "orders", label: "Paid orders", align: "right", render: (r) => formatNumber(r.orders) },
            { key: "revenue", label: "Revenue", align: "right", render: (r) => formatINR(r.revenue) },
          ]}
          rows={o.byDay.map((r) => ({ ...r, id: r.day }))}
        />
      </Card>
    </>
  );
}
