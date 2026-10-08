"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, FileSpreadsheet, MessageCircle, RefreshCw, ShoppingCart } from "lucide-react";
import { exportEngagementAction } from "@/lib/actions/admin/parity/marketing";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { csvText, downloadText, formatStamp, todayIso } from "./format";
import { WhatsAppDialog } from "./whatsapp-dialog";

const PAGE_SIZES = ["10", "20", "50", "100"];
const USER_TYPES = [
  { value: "registered", label: "Registered Users" },
  { value: "guest", label: "Guest Users" },
];
const CART_TYPES = [
  { value: "1", label: "Tracking Cart" },
  { value: "0", label: "Checkout Cart" },
];
const COLUMN_FILTERS = ["phone", "fullname", "productName", "country", "region", "city"];

const na = <span className="text-ink-muted">N/A</span>;
const stamp = (v) => (v ? formatStamp(v) : "N/A");
const region = (r) => (r.country === "IN" && r.region ? r.region : null);

const SHARED = [
  { key: "id", label: "ID", sort: "id" },
  { key: "phone", label: "Phone", sort: "phone", filter: true, render: (r) => (r.guest ? na : r.phone || na) },
  {
    key: "fullname",
    label: "Customer Name",
    sort: "fullname",
    filter: true,
    render: (r) => (r.guest ? <Badge tone="neutral">Guest</Badge> : r.fullname || <Badge tone="success">Registered User</Badge>),
  },
  { key: "country", label: "Country", sort: "country", filter: true, render: (r) => r.country || na },
  { key: "region", label: "Region", sort: "region", filter: true, render: (r) => region(r) ?? na },
  { key: "city", label: "City", sort: "city", filter: true, render: (r) => r.city || na },
  { key: "productName", label: "Product Name", sort: "productName", filter: true, wide: true },
];

const COLUMNS = {
  cart: [
    ...SHARED,
    { key: "qty", label: "Qty", sort: "qty", align: "center" },
    {
      key: "type",
      label: "Type",
      sort: "type",
      render: (r) => <span className={cn("font-semibold", r.tracking ? "text-[#10A350]" : "text-[#0d8a42]")}>{r.tracking ? "Tracking Cart" : "Checkout Cart"}</span>,
    },
    { key: "createdAt", label: "Created At", sort: "createdAt", render: (r) => stamp(r.createdAt) },
  ],
  viewed: [
    ...SHARED,
    { key: "views", label: "Views", sort: "views", align: "center", render: (r) => <Badge tone="info">{r.views}</Badge> },
    { key: "viewedAt", label: "First Viewed", sort: "viewedAt", render: (r) => stamp(r.viewedAt) },
    { key: "lastViewedAt", label: "Last Viewed", sort: "lastViewedAt", render: (r) => stamp(r.lastViewedAt) },
  ],
};

const CSV = {
  cart: {
    file: "cart_tracking",
    headers: ["ID", "User ID", "Phone", "Customer Name", "Country", "Region", "City", "Product Name", "Quantity", "Type", "Created At"],
    row: (r) => [r.id, r.userId ?? "", r.guest ? "N/A" : r.phone ?? "", r.guest ? "Guest" : r.fullname ?? "", r.country ?? "", region(r) ?? "N/A", r.city ?? "", r.productName ?? "", r.qty, r.tracking ? "Tracking Cart" : "Checkout Cart", stamp(r.createdAt)],
  },
  viewed: {
    file: "recently_viewed_products",
    headers: ["ID", "User ID", "Phone", "Customer Name", "Country", "Region", "City", "Product Name", "Views", "First Viewed", "Last Viewed"],
    row: (r) => [r.id, r.userId ?? "", r.guest ? "N/A" : r.phone ?? "", r.guest ? "Guest" : r.fullname ?? "", r.country ?? "", region(r) ?? "N/A", r.city ?? "", r.productName ?? "", r.views, stamp(r.viewedAt), stamp(r.lastViewedAt)],
  },
};

/**
 * One grid of engagement_panel.php (cart tracking or recently viewed). Paging,
 * sorting and filters run on the server and live in the URL under `prefix`.
 */
export function EngagementSection({ kind, prefix, data, filters, canSend }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const [quick, setQuick] = useState(filters.q ?? "");
  const [columnFilters, setColumnFilters] = useState(() => Object.fromEntries(COLUMN_FILTERS.map((k) => [k, filters[`f_${k}`] ?? ""])));
  const [showFilters, setShowFilters] = useState(COLUMN_FILTERS.some((k) => filters[`f_${k}`]));
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messageRow, setMessageRow] = useState(null);
  const columns = COLUMNS[kind];
  const cart = kind === "cart";

  function go(changes) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value == null || value === "") params.delete(`${prefix}${key}`);
      else params.set(`${prefix}${key}`, String(value));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function sortBy(key) {
    if (filters.sort === key) go({ sort: key, dir: filters.dir === "asc" ? "desc" : "asc", page: null });
    else go({ sort: key, dir: "asc", page: null });
  }

  function applyColumnFilters(e) {
    e.preventDefault();
    go({ ...Object.fromEntries(COLUMN_FILTERS.map((k) => [`f_${k}`, columnFilters[k].trim()])), page: null });
  }

  function refresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 600);
  }

  async function exportCsv() {
    setExporting(true);
    const result = await exportEngagementAction(kind, filters);
    setExporting(false);
    if (!result.ok) return notify({ title: "Export failed", message: result.message, tone: "error" });
    if (!result.data.rows.length) return notify({ message: "No data to export.", tone: "info" });
    const spec = CSV[kind];
    downloadText(`${spec.file}_${todayIso()}.csv`, csvText(spec.headers, result.data.rows.map(spec.row)));
    notify({ message: `Exported ${formatNumber(result.data.rows.length)} rows.`, tone: "success" });
  }

  const start = (data.page - 1) * data.pageSize;
  const Icon = cart ? ShoppingCart : Eye;

  return (
    <Card id={cart ? "engagement-cart" : "engagement-viewed"} className="scroll-mt-24">
      <div className={cn("flex flex-wrap items-center justify-between gap-2 rounded-t-xl px-4 py-3 text-white", cart ? "bg-[#10A350]" : "bg-[#0d8a42]")}>
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold">
          <Icon className="size-4" aria-hidden />
          {cart ? "User Cart Tracking" : "User Recently Viewed Products"}
        </h2>
        <p className="text-xs opacity-90">
          {cart
            ? `${formatNumber(data.stats.totalItems)} items · ${formatNumber(data.stats.activeCarts)} carts`
            : `${formatNumber(data.stats.totalViews)} views · ${formatNumber(data.stats.uniqueViewers)} viewers`}
        </p>
      </div>

      <div className="grid gap-2 border-b border-line p-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go({ q: quick.trim(), page: null });
          }}
        >
          <Input type="search" value={quick} onChange={(e) => setQuick(e.target.value)} onBlur={() => quick.trim() !== (filters.q ?? "") && go({ q: quick.trim(), page: null })} placeholder="Quick search..." aria-label="Quick search" />
        </form>
        <Select value={filters.userType ?? ""} onChange={(e) => go({ userType: e.target.value, page: null })} placeholder="All Users" options={USER_TYPES} aria-label="User type" />
        {cart ? (
          <Select value={filters.type ?? ""} onChange={(e) => go({ type: e.target.value, page: null })} placeholder="All Types" options={CART_TYPES} aria-label="Cart type" />
        ) : (
          <Input type="date" value={filters.date ?? ""} onChange={(e) => go({ date: e.target.value, page: null })} aria-label="Filter by date" />
        )}
        <Button variant="primary" onClick={refresh} loading={refreshing}>
          <RefreshCw className="size-4" aria-hidden />
          Refresh
        </Button>
        <Button variant="primary" onClick={exportCsv} loading={exporting} title="Export to CSV" aria-label="Export to CSV">
          <FileSpreadsheet className="size-4" aria-hidden />
        </Button>
      </div>

      <div className="flex justify-end px-3 pt-2">
        <Button size="xs" variant={showFilters ? "primary" : "ghost"} onClick={() => setShowFilters((v) => !v)} aria-pressed={showFilters}>
          Column filters
        </Button>
      </div>

      <form onSubmit={applyColumnFilters} className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">{cart ? "User cart tracking" : "User recently viewed products"}</caption>
          <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-3 py-2 whitespace-nowrap", c.align === "center" && "text-center")}>
                  <button type="button" onClick={() => sortBy(c.sort)} className="inline-flex items-center gap-1 hover:text-ink">
                    {c.label}
                    {filters.sort === c.sort && (filters.dir === "asc" ? <ArrowUp className="size-3" aria-label="ascending" /> : <ArrowDown className="size-3" aria-label="descending" />)}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-3 py-2 text-center">Action</th>
            </tr>
            {showFilters && (
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 pb-2">
                    {c.filter && (
                      <Input
                        value={columnFilters[c.key]}
                        onChange={(e) => setColumnFilters((f) => ({ ...f, [c.key]: e.target.value }))}
                        placeholder="Filter…"
                        aria-label={`Filter ${c.label}`}
                        className="h-7 min-w-20 text-xs font-normal"
                      />
                    )}
                  </th>
                ))}
                <th className="px-3 pb-2">
                  <Button size="xs" type="submit" variant="outline">Apply</Button>
                </th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-line">
            {data.rows.map((r) => (
              <tr key={r.id} className="hover:bg-surface-muted/60">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2", c.wide ? "min-w-52" : "whitespace-nowrap", c.align === "center" && "text-center")}>
                    {c.render ? c.render(r) : (r[c.key] ?? na)}
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <Button size="icon-sm" variant="ghost" className="text-[#25d366]" onClick={() => setMessageRow(r)} aria-label={`Send WhatsApp message about ${r.productName ?? "this product"}`} title="Send WhatsApp Message">
                    <MessageCircle className="size-4" aria-hidden />
                  </Button>
                </td>
              </tr>
            ))}
            {!data.rows.length && (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-ink-muted">
                  No rows to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-xs text-ink-muted">
        <label className="flex items-center gap-2">
          Page Size:
          <Select value={String(data.pageSize)} onChange={(e) => go({ pageSize: e.target.value, page: null })} options={PAGE_SIZES} className="w-20" aria-label="Page size" />
        </label>
        <span>{data.total ? `${formatNumber(start + 1)} to ${formatNumber(start + data.rows.length)} of ${formatNumber(data.total)}` : "0 rows"}</span>
        <div className="flex items-center gap-1">
          <Button size="xs" variant="ghost" disabled={data.page <= 1} onClick={() => go({ page: null })}>First</Button>
          <Button size="xs" variant="ghost" disabled={data.page <= 1} onClick={() => go({ page: data.page - 1 })}>Previous</Button>
          <span className="px-1">Page {data.page} of {data.pageCount}</span>
          <Button size="xs" variant="ghost" disabled={data.page >= data.pageCount} onClick={() => go({ page: data.page + 1 })}>Next</Button>
          <Button size="xs" variant="ghost" disabled={data.page >= data.pageCount} onClick={() => go({ page: data.pageCount })}>Last</Button>
        </div>
      </div>

      <WhatsAppDialog kind={kind} row={messageRow} canSend={canSend} onClose={() => setMessageRow(null)} />
    </Card>
  );
}
