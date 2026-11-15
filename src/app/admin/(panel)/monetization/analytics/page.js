import Link from "next/link";
import { formatDateTime, formatNumber } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { AD_STATUS } from "@/lib/content/admin/monetization";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { LinkTabs, StatCard, StatGrid } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";

export const metadata = { title: "Ad Performance" };

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const day = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(one(v)) ? one(v) : "");
const GROUPS = [
  ["ad", "By banner"],
  ["seller", "By seller"],
  ["placement", "By placement"],
  ["service", "By ad type"],
  ["day", "By day"],
];

export default async function AdPerformancePage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const groupBy = GROUPS.some(([g]) => g === one(sp.groupBy)) ? one(sp.groupBy) : "ad";
  const f = { from: day(sp.from), to: day(sp.to), sellerId: one(sp.sellerId).slice(0, 100) };
  const { user, header, denied } = await monetizationPage({
    title: "Ad Performance",
    description: "Impressions, clicks and CTR of paid banner ads, with the revenue of their orders. An impression is counted when a banner is at least half on screen.",
  });
  if (denied) return denied;

  const query = { groupBy, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) };
  const { data: r, error } = await loadMonetization(user, "analytics", query);
  const qs = (extra) => new URLSearchParams({ ...query, ...extra }).toString();

  const lead = {
    ad: {
      key: "ad",
      label: "Banner",
      render: (x) => (
        <span className="block">
          <Link href={`/admin/monetization/orders/${x.orderId}`} className="font-medium text-brand-700 hover:underline">
            {x.orderNo}
          </Link>
          <span className="block text-xs text-ink-muted">
            {x.sellerName} · {x.placementName} · {x.durationDays} days
          </span>
          {x.startAt ? (
            <span className="block text-xs text-ink-muted">
              {formatDateTime(x.startAt)} – {formatDateTime(x.endAt)} {x.adStatus ? <Badge tone={AD_STATUS[x.adStatus]?.[1] ?? "neutral"}>{AD_STATUS[x.adStatus]?.[0] ?? x.adStatus}</Badge> : null}
            </span>
          ) : null}
        </span>
      ),
    },
    seller: {
      key: "seller",
      label: "Seller",
      render: (x) => (
        <Link href={`/admin/monetization/analytics?${qs({ groupBy: "ad", sellerId: x.sellerId })}`} className="font-medium text-brand-700 hover:underline">
          {x.label}
        </Link>
      ),
    },
    placement: { key: "label", label: "Placement" },
    service: { key: "label", label: "Ad type" },
    day: { key: "label", label: "Date" },
  }[groupBy];

  return (
    <>
      {header}
      <LinkTabs active={groupBy} tabs={GROUPS.map(([value, label]) => ({ value, label, href: `/admin/monetization/analytics?${qs({ groupBy: value })}` }))} />
      <form className="mb-4 flex flex-wrap items-end gap-2" action="/admin/monetization/analytics">
        <input type="hidden" name="groupBy" value={groupBy} />
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          From
          <input type="date" name="from" defaultValue={f.from || r?.range.from} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          To
          <input type="date" name="to" defaultValue={f.to || r?.range.to} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-ink-muted">
          Seller ID
          <input name="sellerId" defaultValue={f.sellerId} placeholder="All sellers" className="h-9 w-44 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink" />
        </label>
        <button type="submit" className="h-9 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white">
          Apply
        </button>
        <Link href={`/admin/monetization/analytics?groupBy=${groupBy}`} className="h-9 px-2 text-sm leading-9 text-ink-muted hover:text-ink">
          Clear
        </Link>
        <a href={`/admin/monetization/analytics/export?${qs({})}`} className="ml-auto inline-flex h-9 items-center rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-muted">
          Download CSV (Excel)
        </a>
      </form>
      {error ? (
        <LoadError error={error} what="the ad performance" />
      ) : (
        <>
          <p className="mb-2 text-xs text-ink-muted">
            {r.range.from} to {r.range.to}
            {f.sellerId ? ` · seller ${f.sellerId}` : ""}
          </p>
          <StatGrid className="mb-4 xl:grid-cols-5">
            <StatCard label="Impressions" value={formatNumber(r.totals.impressions)} tone="neutral" />
            <StatCard label="Clicks" value={formatNumber(r.totals.clicks)} tone="neutral" />
            <StatCard label="CTR" value={`${r.totals.ctr.toFixed(2)}%`} />
            <StatCard label="Ads live in period" value={formatNumber(r.totals.liveAds)} tone="neutral" />
            <StatCard label="Revenue (incl. GST)" value={rupees.format(r.totals.revenue)} />
          </StatGrid>
          <Card>
            <CardHeader title={GROUPS.find(([g]) => g === groupBy)[1]} description="Desktop / mobile split in brackets. Revenue: orders paid in the period." />
            <MiniTable
              empty="No banner ad activity in this period."
              columns={[
                lead,
                { key: "impressions", label: "Impressions", align: "right", render: (x) => `${formatNumber(x.impressions)} (${formatNumber(x.desktopImpressions)} / ${formatNumber(x.mobileImpressions)})` },
                { key: "clicks", label: "Clicks", align: "right", render: (x) => `${formatNumber(x.clicks)} (${formatNumber(x.desktopClicks)} / ${formatNumber(x.mobileClicks)})` },
                { key: "ctr", label: "CTR", align: "right", render: (x) => `${x.ctr.toFixed(2)}%` },
                ...(groupBy === "day" ? [] : [{ key: "adDays", label: "Ad-days live", align: "right", render: (x) => formatNumber(x.adDays) }]),
                { key: "revenue", label: "Revenue", align: "right", render: (x) => rupees.format(x.revenue) },
              ]}
              rows={r.rows.map((x) => ({ ...x, id: x.key }))}
            />
          </Card>
        </>
      )}
    </>
  );
}
