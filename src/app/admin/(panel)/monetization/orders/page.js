import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { AD_STATUS, APPROVAL_STATUS, ORDER_STATUS } from "@/lib/content/admin/monetization";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkTabs } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";

export const metadata = { title: "Banner Orders" };

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
const one = (v) => (Array.isArray(v) ? v[0] : v) ?? "";
const pick = (map, v) => (map[v] ? v : "");
const day = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(one(v)) ? one(v) : "");

function Status({ map, value }) {
  if (!value) return <span className="text-ink-muted">—</span>;
  const [label, tone] = map[value] ?? [value, "neutral"];
  return <Badge tone={tone}>{label}</Badge>;
}

function select(name, value, map, label) {
  return (
    <label className="flex flex-col gap-1 text-xs text-ink-muted">
      {label}
      <select name={name} defaultValue={value} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink">
        <option value="">All</option>
        {Object.entries(map).map(([v, [l]]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function BannerOrdersPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const queue = ["review", "refund"].includes(one(sp.queue)) ? one(sp.queue) : one(sp.queue) === "all" ? "all" : "review";
  const f = {
    search: one(sp.search).slice(0, 100),
    orderStatus: pick(ORDER_STATUS, one(sp.orderStatus)),
    approvalStatus: pick(APPROVAL_STATUS, one(sp.approvalStatus)),
    adStatus: pick(AD_STATUS, one(sp.adStatus)),
    from: day(sp.from),
    to: day(sp.to),
    scheduledFrom: day(sp.scheduledFrom),
    scheduledTo: day(sp.scheduledTo),
  };
  const page = Math.max(1, Number(one(sp.page)) || 1);
  const { user, header, denied } = await monetizationPage({
    title: "Banner Orders",
    description: "Review paid banners, approve and schedule them, ask sellers for changes, and refund rejected or cancelled orders.",
  });
  if (denied) return denied;

  const query = { ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)), queue: queue === "all" ? undefined : queue, page };
  const result = await loadMonetization(user, "orders", query);
  const counts = result.meta?.counts ?? {};
  const params = Object.fromEntries(Object.entries({ queue, ...f }).filter(([, v]) => v));
  const href = (p) => `/admin/monetization/orders?${new URLSearchParams({ ...params, page: String(p) })}`;

  return (
    <>
      {header}
      <LinkTabs
        active={queue}
        tabs={[
          { value: "review", label: "Waiting for review", count: counts.review ?? 0, href: "/admin/monetization/orders?queue=review" },
          { value: "refund", label: "Refunds to issue", count: counts.refund ?? 0, href: "/admin/monetization/orders?queue=refund" },
          { value: "all", label: "All orders", href: "/admin/monetization/orders?queue=all" },
        ]}
      />
      {queue === "all" ? (
        <form className="mb-4 flex flex-wrap items-end gap-2" action="/admin/monetization/orders">
          <input type="hidden" name="queue" value="all" />
          <label className="flex flex-col gap-1 text-xs text-ink-muted">
            Search
            <input name="search" defaultValue={f.search} placeholder="Order no / title / seller" className="h-9 w-56 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink" />
          </label>
          {select("orderStatus", f.orderStatus, ORDER_STATUS, "Payment")}
          {select("approvalStatus", f.approvalStatus, APPROVAL_STATUS, "Review")}
          {select("adStatus", f.adStatus, AD_STATUS, "Ad")}
          <label className="flex flex-col gap-1 text-xs text-ink-muted">
            Bought from
            <input type="date" name="from" defaultValue={f.from} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-muted">
            Bought to
            <input type="date" name="to" defaultValue={f.to} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-muted">
            Running from
            <input type="date" name="scheduledFrom" defaultValue={f.scheduledFrom} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-ink-muted">
            Running to
            <input type="date" name="scheduledTo" defaultValue={f.scheduledTo} className="h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink" />
          </label>
          <button type="submit" className="h-9 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white">
            Apply
          </button>
          <Link href="/admin/monetization/orders?queue=all" className="h-9 px-2 text-sm leading-9 text-ink-muted hover:text-ink">
            Clear
          </Link>
        </form>
      ) : null}
      {result.error ? (
        <LoadError error={result.error} what="the banner orders" />
      ) : (
        <Card>
          <MiniTable
            empty={queue === "review" ? "No banner is waiting for review." : queue === "refund" ? "No refund to issue." : "No banner orders for these filters."}
            columns={[
              {
                key: "order",
                label: "Order",
                render: (o) => (
                  <span className="flex items-center gap-3">
                    {o.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element -- seller creative preview
                      <img src={o.thumbnail} alt="" className="h-10 w-16 shrink-0 rounded border border-line object-cover" />
                    ) : null}
                    <span className="block">
                      <Link href={`/admin/monetization/orders/${o.id}`} className="font-medium text-brand-700 hover:underline">
                        {o.orderNo}
                      </Link>
                      <span className="block text-xs text-ink-muted">{o.title}</span>
                    </span>
                  </span>
                ),
              },
              { key: "seller", label: "Seller", render: (o) => <span className="text-[13px]">{o.sellerName}</span> },
              { key: "ad", label: "Ad", render: (o) => `${o.serviceName} · ${o.packageName}` },
              { key: "total", label: "Amount", align: "right", render: (o) => rupees.format(o.total) },
              { key: "pay", label: "Payment", render: (o) => <Status map={ORDER_STATUS} value={o.orderStatus} /> },
              { key: "review", label: "Review", render: (o) => <Status map={APPROVAL_STATUS} value={o.approvalStatus} /> },
              { key: "adStatus", label: "Ad", render: (o) => <Status map={AD_STATUS} value={o.adStatus} /> },
              { key: "dates", label: "Runs", render: (o) => (o.startAt ? `${formatDateTime(o.startAt)} – ${formatDateTime(o.endAt)}` : o.preferredStartDate ? `Wants ${o.preferredStartDate}` : "—") },
              { key: "paid", label: "Paid", render: (o) => (o.paidAt ? formatDateTime(o.paidAt) : "—") },
            ]}
            rows={result.data}
          />
          {result.meta?.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
              <span className="text-ink-muted">
                Page {result.meta.page} of {result.meta.totalPages} · {result.meta.total} orders
              </span>
              <div className="flex gap-2">
                {page > 1 ? (
                  <ButtonLink href={href(page - 1)} size="sm">
                    Previous
                  </ButtonLink>
                ) : null}
                {page < result.meta.totalPages ? (
                  <ButtonLink href={href(page + 1)} size="sm">
                    Next
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          ) : null}
        </Card>
      )}
    </>
  );
}
