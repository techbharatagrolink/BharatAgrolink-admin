"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { DescriptionList, Notice, StatCard, StatGrid } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { formatDateTime, formatINR, formatNumber, formatPercent } from "@/lib/format";
import { productCardsAction, productDetailAction, productTimelineAction, timelineFeedAction } from "@/lib/actions/admin/parity/seller";

const CARD_TITLES = {
  total_products: "Total products",
  active_products: "Active products",
  out_of_stock: "Out of stock",
  low_stock: "Low stock",
  zero_sale_products: "Zero-sale products",
  new_products: "New products",
  health_score: "Health score",
  gmv: "GMV",
  orders: "Orders",
  qty_sold: "Quantity sold",
  revenue: "Platform revenue",
  contribution_margin: "Contribution",
  avg_margin: "Average margin",
};

const STOCK_TONE = { "In Stock": "success", "Low Stock": "warning", "Out of Stock": "danger" };
const ACTIONS = [
  { value: "created", label: "Added" },
  { value: "updated", label: "Updated" },
  { value: "status_changed", label: "Status" },
  { value: "pricing", label: "Pricing" },
  { value: "inventory", label: "Inventory" },
  { value: "variant", label: "Variant" },
];
const TIMELINE_TABS = [
  ["", "All"],
  ["pricing", "Pricing"],
  ["inventory", "Inventory"],
  ["general", "General"],
  ["variant", "Variant"],
  ["status", "Status"],
  ["media", "Media"],
];

const right = (key, label, render) => ({ key, label, align: "right", render });

function Changes({ item }) {
  const { productChanges = [], variantChanges = [], initialData = [] } = item.details ?? {};
  if (!productChanges.length && !variantChanges.length && !initialData.length && !item.summary) return null;
  return (
    <div className="mt-2 space-y-1 text-xs text-ink-soft">
      {item.summary && <p>{item.summary}</p>}
      {initialData.map((row) => (
        <p key={row.label}><span className="text-ink-muted">{row.label}:</span> {row.value}</p>
      ))}
      {productChanges.map((change) => (
        <p key={`${change.field}-${change.label}`}>
          <span className="font-medium text-ink">{change.label}</span> {change.old} → {change.new}
        </p>
      ))}
      {variantChanges.length > 0 && <p>{formatNumber(variantChanges.length)} variant change(s)</p>}
    </div>
  );
}

function ActivityItem({ item, onOpenProduct }) {
  return (
    <li className="px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-ink">
          <span className="font-medium">{item.actionLabel}</span>
          {" · "}
          <button type="button" className="font-medium text-brand-700 hover:underline" onClick={() => onOpenProduct(item.productId)}>
            {item.productName || item.productId}
          </button>
          {item.productSku ? <span className="text-ink-muted"> · {item.productSku}</span> : null}
        </p>
        <p className="text-xs text-ink-muted">{item.user} · {formatDateTime(item.createdAt)}</p>
      </div>
      <Changes item={item} />
    </li>
  );
}

/** Activity feed from get_product_dashboard_timeline.php. */
export function ProductActivity({ feed, feedError, range, onOpenProduct }) {
  const [data, setData] = useState(feed);
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(feedError);
  const [pending, startTransition] = useTransition();
  const windowQuery = { start: range.all ? "all" : range.start, end: range.all ? "all" : range.end };

  const load = (offset, append) => {
    startTransition(async () => {
      const result = await timelineFeedAction({ ...windowQuery, action, userId, search, limit: 15, offset });
      if (!result.ok) {
        setError(result.message || "Activity timeline could not be loaded.");
        return;
      }
      setError(null);
      setData((current) => (append && current ? { ...result.data, items: [...current.items, ...result.data.items] } : result.data));
    });
  };

  return (
    <Card>
      <CardHeader title="Product activity" description={data?.dateLabel || "Changes recorded on products in this window."} />
      <div className="space-y-3 px-4 py-3">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            load(0, false);
          }}
        >
          <Field label="Action" className="w-40">
            {({ id }) => <Select id={id} value={action} onChange={(event) => setAction(event.target.value)} placeholder="Any action" options={ACTIONS} />}
          </Field>
          <Field label="Staff" className="w-48">
            {({ id }) => (
              <Select
                id={id}
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder="Anyone"
                options={(data?.admins ?? feed?.admins ?? []).map((admin) => ({ value: admin.id, label: admin.name }))}
              />
            )}
          </Field>
          <Field label="Search" className="min-w-48 flex-1">
            {({ id }) => <Input id={id} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Product, SKU or summary" maxLength={120} />}
          </Field>
          <Button type="submit" variant="primary" loading={pending}>Apply</Button>
        </form>
        {error && <Notice tone="warning">{error}</Notice>}
        {data?.summary && (
          <StatGrid>
            <StatCard label="Events" value={formatNumber(data.summary.total)} />
            <StatCard label="Added" value={formatNumber(data.summary.added)} />
            <StatCard label="Updated" value={formatNumber(data.summary.updated)} />
            <StatCard label="Products touched" value={formatNumber(data.summary.products)} />
          </StatGrid>
        )}
      </div>
      {data?.users?.length > 0 && (
        <MiniTable
          rows={data.users.map((user) => ({ ...user, id: user.userId || user.name }))}
          columns={[
            { key: "name", label: "Staff" },
            right("total", "Events", (row) => formatNumber(row.total)),
            right("added", "Added", (row) => formatNumber(row.added)),
            right("updated", "Updated", (row) => formatNumber(row.updated)),
            right("status", "Status", (row) => formatNumber(row.status)),
            { key: "lastActiveAt", label: "Last active", render: (row) => formatDateTime(row.lastActiveAt) },
          ]}
        />
      )}
      {!data?.items?.length ? (
        <p className="px-4 py-6 text-center text-sm text-ink-muted">No product changes in this window.</p>
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {data.items.map((item) => <ActivityItem key={item.id} item={item} onOpenProduct={onOpenProduct} />)}
        </ul>
      )}
      {data?.hasMore && (
        <div className="border-t border-line px-4 py-3">
          <Button size="sm" loading={pending} onClick={() => load(data.items.length, true)}>Load more</Button>
        </div>
      )}
    </Card>
  );
}

function CardList({ data, error, pending, page, onPage, onOpenProduct }) {
  if (error) return <Notice tone="danger">{error}</Notice>;
  if (!data) return <p className="text-sm text-ink-muted">{pending ? "Loading products…" : ""}</p>;
  return (
    <div className="space-y-3">
      <MiniTable
        empty="No products match this card."
        rows={data.rows.map((row) => ({ ...row, id: row.prodId }))}
        columns={[
          {
            key: "name",
            label: "Product",
            render: (row) => (
              <button type="button" onClick={() => onOpenProduct(row.prodId)} className="inline-flex items-center gap-2 text-left font-medium text-brand-700 hover:underline">
                {row.image ? <Image src={row.image} alt="" width={32} height={32} unoptimized className="size-8 rounded-md border border-line object-cover" /> : null}
                <span>{row.name}</span>
              </button>
            ),
          },
          { key: "sku", label: "SKU" },
          { key: "seller", label: "Seller" },
          { key: "stock", label: "Stock", render: (row) => <Badge tone={STOCK_TONE[row.stockLabel] ?? "neutral"}>{row.stockLabel} · {formatNumber(row.stock)}</Badge> },
          right("price", "Price", (row) => formatINR(row.price)),
          right("gmv", "GMV", (row) => formatINR(row.gmv)),
          right("marginPct", "Margin", (row) => formatPercent(row.marginPct)),
        ]}
      />
      {data.pageCount > 1 && (
        <div className="flex items-center justify-between text-[13px] text-ink-muted">
          <span>Page {formatNumber(page)} of {formatNumber(data.pageCount)} · {formatNumber(data.total)} products</span>
          <div className="flex gap-1.5">
            <Button size="sm" disabled={page <= 1 || pending} onClick={() => onPage(page - 1)}>Previous</Button>
            <Button size="sm" disabled={page >= data.pageCount || pending} onClick={() => onPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetail({ detail, error, pending, tab, onTab, timeline, timelineError, onTimeline }) {
  if (error) return <Notice tone="danger">{error}</Notice>;
  if (!detail) return <p className="text-sm text-ink-muted">{pending ? "Loading product…" : ""}</p>;
  const { product, variants, orders, metrics } = detail;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-line">
        {["overview", "variants", "orders", "timeline"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTab(value)}
            className={value === tab ? "-mb-px border-b-2 border-brand-600 px-3 py-2 text-sm font-medium text-brand-700" : "-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink"}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <>
          <div className="flex gap-3">
            {product.image ? <Image src={product.image} alt="" width={72} height={72} unoptimized className="size-[72px] rounded-lg border border-line object-cover" /> : null}
            <div>
              <p className="font-semibold text-ink">{product.name}</p>
              <p className="text-sm text-ink-muted">{product.sku || "No SKU"} · {product.category || "Uncategorised"} · {product.brand || "No brand"}</p>
              <Badge className="mt-1" tone={product.status === "Active" ? "success" : "neutral"} dot>{product.status}</Badge>
            </div>
          </div>
          <StatGrid>
            <StatCard label="Orders" value={formatNumber(metrics.orders)} />
            <StatCard label="Units" value={formatNumber(metrics.units)} />
            <StatCard label="GMV" value={formatINR(metrics.gmv)} />
            <StatCard label="Profit" value={formatINR(metrics.profit)} hint={formatPercent(metrics.marginPct)} />
            <StatCard label="Delivered" value={formatNumber(metrics.delivered)} />
            <StatCard label="RTO" value={formatNumber(metrics.rto)} hint={formatPercent(metrics.rtoPct)} tone="danger" />
          </StatGrid>
          <DescriptionList
            columns={3}
            items={[
              { label: "Seller", value: product.seller.company },
              { label: "Contact", value: [product.seller.name, product.seller.phone, product.seller.email].filter(Boolean).join(" · ") || "—" },
              { label: "MRP", value: formatINR(product.mrp) },
              { label: "Sale price", value: formatINR(product.salePrice) },
              { label: "Seller price", value: formatINR(product.sellerPrice) },
              { label: "Stock", value: `${formatNumber(product.stock)} · ${product.stockStatus || "—"}` },
              { label: "NRV", value: formatINR(product.nrv) },
              { label: "MSP", value: formatINR(product.msp) },
              { label: "Commission", value: product.commission == null ? "—" : formatPercent(product.commission) },
              { label: "Other expenses", value: formatINR(product.otherExpenses) },
              { label: "Tax class", value: product.taxClass },
              { label: "Dimensions", value: product.dimensions },
              { label: "Weight", value: product.weight },
              { label: "Courier zone", value: product.courierZone },
              { label: "Self ship", value: product.selfShip },
              { label: "Toxicity", value: product.toxicity },
              { label: "Purchase limit", value: product.purchaseLimit },
            ]}
          />
        </>
      )}
      {tab === "variants" && (
        <MiniTable
          empty="No variants."
          rows={variants.map((row) => ({ ...row, id: row.id }))}
          columns={[
            { key: "title", label: "Variant" },
            { key: "sku", label: "SKU" },
            right("price", "Price", (row) => formatINR(row.price)),
            right("stock", "Stock", (row) => formatNumber(row.stock)),
            right("orders", "Orders", (row) => formatNumber(row.orders)),
            right("qty", "Qty", (row) => formatNumber(row.qty)),
            right("profit", "Profit", (row) => formatINR(row.profit)),
            { key: "on", label: "Status", render: (row) => <Badge tone={row.on ? "success" : "neutral"}>{row.on ? "On" : "Off"}</Badge> },
          ]}
        />
      )}
      {tab === "orders" && (
        <MiniTable
          empty="No orders for this product."
          rows={orders.map((row) => ({ ...row, id: row.id }))}
          columns={[
            { key: "orderId", label: "Order" },
            { key: "date", label: "Date", render: (row) => formatDateTime(row.date) },
            { key: "customer", label: "Customer" },
            { key: "location", label: "Location" },
            right("qty", "Qty", (row) => formatNumber(row.qty)),
            right("price", "Price", (row) => formatINR(row.price)),
            right("profit", "Profit", (row) => formatINR(row.profit)),
            { key: "status", label: "Status" },
          ]}
        />
      )}
      {tab === "timeline" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {TIMELINE_TABS.map(([value, label]) => (
              <Button key={label} size="sm" variant={timeline?.category === value ? "primary" : "secondary"} onClick={() => onTimeline(value, 0, false)}>
                {label}{timeline?.summary?.[value] != null && value ? ` ${formatNumber(timeline.summary[value])}` : ""}
              </Button>
            ))}
          </div>
          {timelineError && <Notice tone="danger">{timelineError}</Notice>}
          {!timeline?.items?.length ? (
            <p className="text-sm text-ink-muted">{pending ? "Loading timeline…" : "No changes recorded for this product."}</p>
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line">
              {timeline.items.map((item) => (
                <li key={item.id} className="px-3 py-2.5">
                  <p className="text-sm font-medium text-ink">{item.actionLabel}</p>
                  <p className="text-xs text-ink-muted">{item.user} · {formatDateTime(item.createdAt)}</p>
                  <Changes item={item} />
                </li>
              ))}
            </ul>
          )}
          {timeline?.hasMore && <Button size="sm" loading={pending} onClick={() => onTimeline(timeline.category || "", timeline.items.length, true)}>Load more</Button>}
        </div>
      )}
    </div>
  );
}

/** Card drill-down (get_product_card_modal_data.php) and the product 360 modal. */
export function ProductInspect({ card, productId, filters, onClose, onBack, onOpenProduct }) {
  const open = Boolean(card || productId);
  const [page, setPage] = useState(1);
  const [cardKey, setCardKey] = useState(card);
  const [seenProduct, setSeenProduct] = useState(productId);
  const [cardData, setCardData] = useState(null);
  const [cardError, setCardError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [tab, setTab] = useState("overview");
  const [timeline, setTimeline] = useState(null);
  const [timelineError, setTimelineError] = useState("");
  const [pending, startTransition] = useTransition();

  if (card !== cardKey) {
    setCardKey(card);
    setPage(1);
    setCardData(null);
    setCardError("");
  }
  if (productId !== seenProduct) {
    setSeenProduct(productId);
    setDetail(null);
    setDetailError("");
    setTab("overview");
    setTimeline(null);
    setTimelineError("");
  }

  useEffect(() => {
    if (!open || productId) return undefined;
    let live = true;
    startTransition(async () => {
      const result = await productCardsAction({ ...filters, card, page, limit: 25 });
      if (!live) return;
      if (result.ok) setCardData(result.data);
      else setCardError(result.message || "Could not load this list.");
    });
    return () => {
      live = false;
    };
  }, [open, productId, card, page, filters]);

  useEffect(() => {
    if (!productId) return undefined;
    let live = true;
    startTransition(async () => {
      const result = await productDetailAction(productId);
      if (!live) return;
      if (result.ok) setDetail(result.data);
      else setDetailError(result.message || "Could not load this product.");
    });
    return () => {
      live = false;
    };
  }, [productId]);

  const loadTimeline = (category, offset, append) => {
    setTimeline((current) => ({ ...(current ?? {}), category }));
    startTransition(async () => {
      const result = await productTimelineAction(productId, { category, limit: 20, offset });
      if (!result.ok) {
        setTimelineError(result.message || "Could not load the timeline.");
        return;
      }
      setTimelineError("");
      setTimeline((current) => ({ ...result.data, category, items: append && current?.items ? [...current.items, ...result.data.items] : result.data.items }));
    });
  };

  const title = productId ? detail?.product?.name || "Product" : CARD_TITLES[card] || "Products";

  return (
    <Dialog open={open} onClose={onClose} title={title} description={productId ? detail?.product?.sku : "Products behind this figure."} size="xl">
      {productId && card ? (
        <div className="mb-3">
          <Button size="sm" onClick={onBack}>Back to list</Button>
        </div>
      ) : null}
      {productId ? (
        <ProductDetail
          detail={detail}
          error={detailError}
          pending={pending}
          tab={tab}
          onTab={(next) => {
            setTab(next);
            if (next === "timeline" && !timeline) loadTimeline("", 0, false);
          }}
          timeline={timeline}
          timelineError={timelineError}
          onTimeline={loadTimeline}
        />
      ) : (
        <CardList data={cardData} error={cardError} pending={pending} page={page} onPage={setPage} onOpenProduct={onOpenProduct} />
      )}
    </Dialog>
  );
}
