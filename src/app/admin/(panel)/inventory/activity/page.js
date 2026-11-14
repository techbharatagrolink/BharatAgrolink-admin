import Link from "next/link";
import { loadStock } from "@/lib/services/admin/inventory";
import { ACTIVITY_ACTIONS, ACTOR_LABEL, ACTOR_OPTIONS, SETTING_LABELS, qty, reasonLabel, signedQty } from "@/lib/content/admin/inventory";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { Pager, itemHref } from "@/components/admin/inventory/stock-views";
import { cn } from "@/lib/utils";

export const metadata = { title: "Activity Log" };

const KEYS = ["actorType", "sellerId", "search", "from", "to", "page"];
const ACTOR_TONE = { admin: "info", seller: "brand", customer: "neutral", system: "neutral" };

function filtersOf(params) {
  const out = {};
  for (const k of KEYS) {
    const v = Array.isArray(params[k]) ? params[k][0] : params[k];
    if (v != null && String(v).trim() !== "") out[k] = String(v).trim();
  }
  if (out.from && !/^\d{4}-\d{2}-\d{2}$/.test(out.from)) delete out.from;
  if (out.to && !/^\d{4}-\d{2}-\d{2}$/.test(out.to)) delete out.to;
  return out;
}

const show = (v) => (v == null || v === "" ? "none" : String(v));

/** Settings / record changes as "Low stock at: none → 12". */
function settingChanges(before, after) {
  if (!after || typeof after !== "object") return null;
  return Object.keys(after)
    .filter((k) => !before || JSON.stringify(before[k]) !== JSON.stringify(after[k]))
    .map((k) => `${SETTING_LABELS[k] ?? k}: ${before && k in before ? `${show(before[k])} → ` : ""}${show(after[k])}`)
    .join(" · ");
}

/**
 * Who changed what in the inventory (admin panel only): stock added / reduced / counted, stock set up, alert levels
 * and safety stock, records closed or reopened, short orders resolved. Every row names the admin or seller,
 * the product, the change and the reason, newest first.
 */
export default async function InventoryActivityPage({ searchParams }) {
  const filters = filtersOf(await searchParams);
  const { user, header, denied } = await inventoryPage({
    title: "Activity Log",
    description: "Who changed what in the inventory: every stock change, setting and record change by admins and sellers, with the reason. Entries cannot be edited or deleted.",
  });
  if (denied) return denied;

  const [log, sellers] = await Promise.all([loadStock(user, "activity", { ...filters, limit: 50 }), loadStock(user, "sellers")]);
  const pageHref = (page) => `/admin/inventory/activity?${new URLSearchParams({ ...filters, page: String(page) })}`;
  const label = "min-w-0 space-y-1 text-[13px] font-medium text-ink-soft";

  return (
    <>
      {header}
      <Card>
        <CardBody className="border-b border-line">
          <form method="get" action="/admin/inventory/activity" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            <label className={label}>
              <span>Who</span>
              <Select name="actorType" defaultValue={filters.actorType ?? "people"} options={ACTOR_OPTIONS} />
            </label>
            <label className={label}>
              <span>Seller (stock owner)</span>
              <Select
                name="sellerId"
                defaultValue={filters.sellerId ?? ""}
                placeholder="All sellers"
                options={(sellers.data ?? []).filter((s) => s.sellerId).map((s) => ({ value: s.sellerId, label: s.sellerName || s.sellerId }))}
              />
            </label>
            <label className={label}>
              <span>Product or SKU</span>
              <Input type="search" name="search" defaultValue={filters.search ?? ""} placeholder="Name or SKU" />
            </label>
            <label className={label}>
              <span>From</span>
              <Input type="date" name="from" defaultValue={filters.from ?? ""} />
            </label>
            <label className={label}>
              <span>To</span>
              <Input type="date" name="to" defaultValue={filters.to ?? ""} />
            </label>
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3 2xl:col-span-5">
              <button type="submit" className={buttonClasses({ variant: "primary", size: "sm" })}>
                Apply filters
              </button>
              <Link href="/admin/inventory/activity" className={buttonClasses({ size: "sm" })}>
                Reset
              </Link>
            </div>
          </form>
        </CardBody>

        {log.error ? (
          <LoadError error={log.error} what="the activity log" />
        ) : (
          <>
            <MiniTable
              empty="No activity for these filters."
              columns={[
                { key: "at", label: "When", render: (r) => <span className="text-xs whitespace-nowrap">{formatDateTime(r.at)}</span> },
                {
                  key: "who",
                  label: "Who",
                  render: (r) => (
                    <span className="block">
                      <Badge tone={ACTOR_TONE[r.actorType] ?? "neutral"}>{ACTOR_LABEL[r.actorType] ?? r.actorType}</Badge>
                      <span className="mt-0.5 block text-xs font-medium text-ink">{r.actorName || (r.actorType === "system" ? "Automatic" : r.actorId || "—")}</span>
                      {r.channel && <span className="block text-[11px] text-ink-muted">via {r.channel}</span>}
                    </span>
                  ),
                },
                { key: "action", label: "What", render: (r) => <span className="font-medium text-ink">{ACTIVITY_ACTIONS[r.action] ?? r.action}</span> },
                {
                  key: "product",
                  label: "Product",
                  render: (r) =>
                    r.balanceId ? (
                      <span className="block max-w-[16rem] whitespace-normal">
                        <Link href={itemHref(r.balanceId)} className="text-brand-700 hover:underline">
                          {r.productName || r.sku}
                        </Link>
                        <span className="block text-xs text-ink-muted">
                          {[r.variantLabel && `Pack ${r.variantLabel}`, r.sku, r.sellerName].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    ),
                },
                {
                  key: "change",
                  label: "Change",
                  wrap: true,
                  render: (r) =>
                    r.kind === "stock" ? (
                      <span className="block whitespace-nowrap">
                        <span className={cn("font-semibold tabular", r.onHandDelta > 0 ? "text-success-ink" : r.onHandDelta < 0 ? "text-danger-ink" : "text-ink-muted")}>
                          {r.action === "OPENING" ? `Start ${qty(r.onHandAfter)}` : signedQty(r.onHandDelta || r.reservedDelta)}
                        </span>
                        {r.action !== "OPENING" && <span className="text-xs text-ink-muted"> → {qty(r.onHandAfter)} on hand</span>}
                      </span>
                    ) : (
                      <span className="block max-w-[18rem] text-xs whitespace-normal text-ink-soft">{settingChanges(r.before, r.after) || "—"}</span>
                    ),
                },
                {
                  key: "reason",
                  label: "Reason / note",
                  wrap: true,
                  render: (r) => (
                    <span className="block max-w-[18rem] text-xs whitespace-normal">
                      {r.kind === "stock" ? reasonLabel(r.reason) : r.reason}
                      {r.note && <span className="block text-ink-muted">{r.note}</span>}
                      {r.referenceType === "order" && r.referenceId && <span className="block text-ink-muted">Order {r.referenceId}</span>}
                    </span>
                  ),
                },
              ]}
              rows={log.data ?? []}
            />
            <Pager meta={log.meta} href={pageHref} unit="entries" />
          </>
        )}
      </Card>
    </>
  );
}
