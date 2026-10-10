import { checkPermission } from "@/lib/auth/session";
import { SHIPMENT_TABS, SHIPROCKET_PAGE_SIZES, canShip, listShipments, listShiprocketOrders } from "@/lib/services/admin/shipping";
import { formatNumber } from "@/lib/format";
import { LinkTabs, Notice, PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { PermissionDenied } from "@/components/ui/states";
import { ShipmentsTable } from "@/components/admin/shipping/shipments-table";
import { ShiprocketFilters } from "@/components/admin/shipping/shiprocket-filters";
import { ShiprocketOrdersTable } from "@/components/admin/shipping/shiprocket-orders-table";

export const metadata = { title: "Shipments" };

const LIMIT = 25;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function ShipmentsPage({ searchParams }) {
  const { user } = await checkPermission("shipping");
  if (!canShip(user)) return (<><PageHeader title="Shipments" /><PermissionDenied module="shipping" /></>);

  const sp = (await searchParams) ?? {};
  const tab = SHIPMENT_TABS.some((t) => t.value === sp.tab) ? sp.tab : "to_ship";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const dateFrom = DATE.test(sp.from ?? "") ? sp.from : "";
  const dateTo = DATE.test(sp.to ?? "") ? sp.to : "";
  const page = Math.max(1, Number.parseInt(sp.page, 10) || 1);

  // "Shiprocket" tab = shiprocket_orders_report.php: the Shiprocket account's orders, with its extra filters.
  const shiprocket = tab === "shiprocket";
  const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const sr = {
    status: text(sp.status, 50),
    pickup: text(sp.pickup, 100),
    sort: sp.sort === "ASC" ? "ASC" : "DESC",
    perPage: SHIPROCKET_PAGE_SIZES.includes(sp.perPage) ? sp.perPage : "10",
  };
  const srParams = { ...(sr.status && { status: sr.status }), ...(sr.pickup && { pickup: sr.pickup }), ...(sr.sort !== "DESC" && { sort: sr.sort }), ...(sr.perPage !== "10" && { perPage: sr.perPage }) };
  const limit = shiprocket ? Number(sr.perPage) : LIMIT;

  const result = shiprocket
    ? await listShiprocketOrders({ page, perPage: sr.perPage, from: dateFrom || undefined, to: dateTo || undefined, search: q || undefined, status: sr.status || undefined, pickupLocation: sr.pickup || undefined, sort: sr.sort }, user)
    : await listShipments({ tab, q, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, page, limit: LIMIT }, user);
  const total = (shiprocket ? result.data?.total : result.meta?.total) ?? 0;
  const pages = Math.max(1, Math.ceil(total / limit));
  const href = (overrides) => {
    const target = overrides.tab ?? tab;
    const params = new URLSearchParams({ tab, ...(q && { q }), ...(dateFrom && { from: dateFrom }), ...(dateTo && { to: dateTo }), ...(target === "shiprocket" && srParams), ...overrides });
    return `/admin/shipping?${params}`;
  };

  return (
    <>
      <PageHeader
        title="Shipments"
        description="One row per order and vendor parcel. Book couriers, print labels, sync courier status and cancel shipments."
      />
      <LinkTabs tabs={SHIPMENT_TABS.map((t) => ({ ...t, href: href({ tab: t.value }), count: t.value === tab && result.ok ? formatNumber(total) : null }))} active={tab} />
      <Card>
        {shiprocket ? (
          <ShiprocketFilters values={{ q, ...sr, from: dateFrom, to: dateTo }} statuses={result.ok ? result.data.statuses : []} />
        ) : (
          <form className="flex flex-wrap items-end gap-2 border-b border-line px-4 py-3" action="/admin/shipping">
            <input type="hidden" name="tab" value={tab} />
            <label className="min-w-56 flex-1 space-y-1 text-xs text-ink-muted">
              Search
              <Input name="q" defaultValue={q} placeholder="Order ID, AWB, invoice, customer, mobile" />
            </label>
            <label className="space-y-1 text-xs text-ink-muted">
              From
              <Input type="date" name="from" defaultValue={dateFrom} />
            </label>
            <label className="space-y-1 text-xs text-ink-muted">
              To
              <Input type="date" name="to" defaultValue={dateTo} />
            </label>
            <Button type="submit" size="md">Filter</Button>
            {(q || dateFrom || dateTo) && <ButtonLink href={`/admin/shipping?tab=${tab}`} variant="ghost">Reset</ButtonLink>}
          </form>
        )}
        {result.ok ? (
          shiprocket ? (
            <ShiprocketOrdersTable key={`${q}|${sr.status}|${sr.pickup}|${sr.sort}|${sr.perPage}|${dateFrom}|${dateTo}|${page}`} rows={result.data.rows} canEdit={canShip(user, "edit")} />
          ) : (
            <ShipmentsTable key={`${tab}|${q}|${dateFrom}|${dateTo}|${page}`} rows={result.data} canAdd={canShip(user, "add")} canEdit={canShip(user, "edit")} />
          )
        ) : (
          <Notice tone="danger" className="m-4">{result.message}</Notice>
        )}
        {result.ok && pages > 1 && (
          <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 text-sm text-ink-muted">
            <span>Page {page} of {formatNumber(pages)} · {formatNumber(total)} {shiprocket ? "orders" : "parcels"}</span>
            <div className="flex gap-2">
              {page > 1 && <ButtonLink href={href({ page: String(page - 1) })} size="sm">Previous</ButtonLink>}
              {page < pages && <ButtonLink href={href({ page: String(page + 1) })} size="sm">Next</ButtonLink>}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
