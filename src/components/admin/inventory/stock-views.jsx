import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { CardBody } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { formatDateTime, formatRelative } from "@/lib/format";
import { ALERT_TYPES, MOVEMENT_TYPES, POOL_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS, STOCK_STATUS, actorLabel, itemName, qty, reasonLabel, signedQty } from "@/lib/content/admin/inventory";
import { cn } from "@/lib/utils";
import { AdjustStock } from "./adjust-stock";

/* Server-rendered building blocks of the Inventory Management screens. */

export const itemHref = (id) => `/admin/inventory/stock/${id}`;

export function StockStatusBadge({ status }) {
  const s = STOCK_STATUS[status] ?? { label: status ?? "—", tone: "neutral" };
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}

export function AlertBadge({ type }) {
  const a = ALERT_TYPES[type] ?? { label: type, tone: "neutral" };
  return (
    <Badge tone={a.tone} dot>
      {a.label}
    </Badge>
  );
}

function ProductCell({ item, showSeller = true }) {
  return (
    <span className="block min-w-0 max-w-[22rem] whitespace-normal">
      <Link href={itemHref(item.id)} className="font-medium text-brand-700 hover:underline">
        {itemName(item)}
      </Link>
      <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        {item.variantLabel && <span>Pack: {item.variantLabel}</span>}
        {item.pool === "B2B" && <Badge tone="info">B2B</Badge>}
        {item.listingActive === false && <Badge>Hidden from store</Badge>}
        {showSeller && item.sellerName && <span>· {item.sellerName}</span>}
      </span>
    </span>
  );
}

const delta = (m) => (m.onHandDelta !== 0 ? m.onHandDelta : m.reservedDelta);
const deltaTone = (v) => (v > 0 ? "text-success-ink" : v < 0 ? "text-danger-ink" : "text-ink-muted");

export function StockTable({ items, canEdit }) {
  return (
    <MiniTable
      empty="No stock matches these filters."
      columns={[
        { key: "product", label: "Product", render: (i) => <ProductCell item={i} /> },
        { key: "sku", label: "SKU", render: (i) => <span className="font-mono text-xs break-all">{i.sku}</span> },
        { key: "onHandQty", label: "On hand", align: "right", render: (i) => qty(i.onHandQty) },
        { key: "reservedQty", label: "Reserved", align: "right", render: (i) => qty(i.reservedQty) },
        { key: "availableQty", label: "Available", align: "right", render: (i) => <span className="font-semibold text-ink">{qty(i.availableQty)}</span> },
        { key: "lowStockThreshold", label: "Low at", align: "right", render: (i) => qty(i.lowStockThreshold) },
        { key: "status", label: "Status", render: (i) => <StockStatusBadge status={i.status} /> },
        {
          key: "updatedAt",
          label: "Updated",
          render: (i) => (
            <span className="text-xs text-ink-muted" title={formatDateTime(i.updatedAt)}>
              {formatRelative(i.updatedAt)}
            </span>
          ),
        },
        ...(canEdit ? [{ key: "actions", label: "Actions", render: (i) => <AdjustStock item={i} /> }] : []),
      ]}
      rows={items ?? []}
    />
  );
}

export function AlertList({ alerts, canEdit }) {
  if (!alerts?.length) return <EmptyState title="No open alerts" description="All stock is above its alert level." />;
  return (
    <ul className="divide-y divide-line">
      {alerts.map((a) => (
        <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge type={a.type} />
              <Link href={itemHref(a.item.id)} className="text-sm font-medium text-brand-700 hover:underline">
                {itemName(a.item)}
              </Link>
            </div>
            <p className="mt-0.5 text-xs text-ink-muted">
              {a.item.variantLabel && `Pack ${a.item.variantLabel} · `}SKU {a.item.sku} · available <span className="tabular">{qty(a.item.availableQty)}</span>
              {a.type !== "OUT_OF_STOCK" && a.threshold != null && ` (alert at ${qty(a.threshold)})`} · {formatRelative(a.triggeredAt)}
              {a.item.sellerName && ` · ${a.item.sellerName}`}
            </p>
          </div>
          {canEdit && <AdjustStock item={a.item} initialAction="ADD" label="Replenish" variant="primary" />}
        </li>
      ))}
    </ul>
  );
}

export function MovementTable({ movements, showProduct = true }) {
  return (
    <MiniTable
      empty="No stock movements yet."
      columns={[
        { key: "at", label: "When", render: (m) => <span className="text-xs whitespace-nowrap">{formatDateTime(m.at)}</span> },
        ...(showProduct
          ? [
              {
                key: "product",
                label: "Product",
                render: (m) => (
                  <span className="block max-w-[16rem] whitespace-normal">
                    <Link href={itemHref(m.balanceId)} className="text-brand-700 hover:underline">
                      {m.productName || m.sku}
                    </Link>
                    <span className="block font-mono text-xs break-all text-ink-muted">{m.sku}</span>
                  </span>
                ),
              },
            ]
          : []),
        {
          key: "type",
          label: "What",
          render: (m) => (
            <span>
              {MOVEMENT_TYPES[m.type] ?? m.type}
              {m.onHandDelta === 0 && m.reservedDelta !== 0 && <span className="block text-xs text-ink-muted">reserved</span>}
            </span>
          ),
        },
        {
          key: "delta",
          label: "Change",
          align: "right",
          // The opening line is the starting stock copied from the old stock column, not stock that was added.
          render: (m) =>
            m.type === "OPENING" ? <span className="text-xs text-ink-muted">Starting stock</span> : <span className={cn("font-medium", deltaTone(delta(m)))}>{signedQty(delta(m))}</span>,
        },
        { key: "onHandAfter", label: "On hand after", align: "right", render: (m) => qty(m.onHandAfter) },
        {
          key: "reason",
          label: "Reason / reference",
          wrap: true,
          render: (m) => (
            <span className="block max-w-[18rem] text-xs whitespace-normal">
              {reasonLabel(m.reason)}
              {m.note && <span className="block text-ink-muted">{m.note}</span>}
              {m.referenceType && m.referenceType !== "adjustment" && m.referenceId && (
                <span className="block break-all text-ink-muted">
                  {m.referenceType}: {m.referenceId}
                </span>
              )}
            </span>
          ),
        },
        { key: "by", label: "By", render: (m) => <span className="text-xs">{actorLabel(m)}</span> },
      ]}
      rows={movements ?? []}
    />
  );
}

/** Latest movements as a compact list (overview). */
export function MovementList({ movements }) {
  if (!movements?.length) return <EmptyState title="No stock changes yet" description="Nothing has been added, reduced, ordered or returned since the stock was imported." />;
  return (
    <ul className="divide-y divide-line">
      {movements.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <div className="min-w-0">
            <Link href={itemHref(m.balanceId)} className="block truncate text-ink hover:text-brand-700 hover:underline">
              {m.productName || m.sku}
            </Link>
            <p className="text-xs text-ink-muted">
              {MOVEMENT_TYPES[m.type] ?? m.type} · {formatRelative(m.at)}
            </p>
          </div>
          {m.type === "OPENING" ? (
            <span className="text-xs text-ink-muted">Start {qty(m.onHandAfter)}</span>
          ) : (
            <span className={cn("font-medium tabular", deltaTone(delta(m)))}>{signedQty(delta(m))}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** GET filter form for the stock list; state lives in the URL. */
export function StockFilters({ filters, categories = [], sellers = [] }) {
  const label = "min-w-0 space-y-1 text-[13px] font-medium text-ink-soft";
  return (
    <CardBody className="border-b border-line">
      <form method="get" action="/admin/inventory/stock" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <label className={label}>
          <span>Search</span>
          <Input type="search" name="search" defaultValue={filters.search ?? ""} placeholder="Product name or SKU" />
        </label>
        <label className={label}>
          <span>Status</span>
          <Select name="status" defaultValue={filters.status ?? ""} placeholder="All statuses" options={STATUS_OPTIONS} />
        </label>
        <label className={label}>
          <span>Seller</span>
          <Select name="sellerId" defaultValue={filters.sellerId ?? ""} placeholder="All sellers" options={sellers.filter((s) => s.sellerId).map((s) => ({ value: s.sellerId, label: s.sellerName || s.sellerId }))} />
        </label>
        <label className={label}>
          <span>Category</span>
          <Select name="category" defaultValue={filters.category ?? ""} placeholder="All categories" options={categories} />
        </label>
        <label className={label}>
          <span>Pool</span>
          <Select name="pool" defaultValue={filters.pool ?? ""} placeholder="B2C + B2B" options={POOL_OPTIONS} />
        </label>
        <label className={label}>
          <span>Sort</span>
          <Select name="sort" defaultValue={filters.sort ?? ""} placeholder="Recently updated" options={SORT_OPTIONS} />
        </label>
        <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-3 2xl:col-span-6">
          <button type="submit" className={buttonClasses({ variant: "primary", size: "sm" })}>
            Apply filters
          </button>
          <Link href="/admin/inventory/stock" className={buttonClasses({ size: "sm" })}>
            Reset
          </Link>
        </div>
      </form>
    </CardBody>
  );
}

/** Previous / next links for a paged list (meta from the API: page, totalPages, total). */
export function Pager({ meta, href, unit = "SKUs" }) {
  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted">
      <span>
        Page {page} of {totalPages} · {qty(meta.total)} {unit}
      </span>
      <span className="flex gap-2">
        {page > 1 && (
          <Link href={href(page - 1)} className={buttonClasses({ size: "sm" })}>
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link href={href(page + 1)} className={buttonClasses({ size: "sm" })}>
            Next
          </Link>
        )}
      </span>
    </nav>
  );
}
