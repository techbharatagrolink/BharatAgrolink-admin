"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, FileText, History, ImageIcon, Pencil, RefreshCw, Wallet } from "lucide-react";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { formatDate, formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EditItemDialog, ItemHistoryDialog, PayItemsDialog } from "./payout-item-dialogs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (ym) => {
  const [y, m] = String(ym).split("-").map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : ym;
};
const CYCLES = [
  { value: "first", label: "First Cycle (1–15)" },
  { value: "second", label: "Second Cycle (16–Month End)" },
];
const PAGE_SIZES = [25, 50, 100, 200];
const SORTABLE = new Set(["id", "payoutId", "orderId", "invoiceNumber", "balInvoiceNumber", "status", "cycleMovement", "productSku", "variantId", "qty", "gross", "taxable", "cgst", "sgst", "igst", "transactionId", "transactionDate", "deliveryDate"]);

const money = (key) => ({ align: "right", render: (r) => <span className="tabular">{formatINR(r[key])}</span> });
const mono = (key) => ({ render: (r) => (r[key] ? <span className="font-mono text-xs">{r[key]}</span> : <span className="text-ink-muted">—</span>) });

/** PHP payout_new_items.php grid, in PHP order. `filter` is the API f_<key> filter on that column. */
const COLUMNS = [
  { group: "basic", key: "sr", label: "SR.", width: 56, align: "right" },
  { group: "basic", key: "id", label: "Item ID", filter: { key: "id", type: "number" }, width: 84, align: "right" },
  { group: "basic", key: "payoutId", label: "Payout ID", filter: { key: "payoutId", type: "text" }, width: 92, align: "right" },
  { group: "basic", key: "orderId", label: "Order ID", filter: { key: "orderId", type: "text" }, width: 190, ...mono("orderId") },
  { group: "basic", key: "invoiceNumber", label: "seller to customer Invoice", filter: { key: "invoiceNumber", type: "text" }, width: 170, ...mono("invoiceNumber") },
  {
    group: "basic", key: "balInvoiceNumber", label: "Bharat Agrolink Invoice", filter: { key: "balInvoiceNumber", type: "text" }, width: 170,
    render: (r) => (r.balInvoiceNumber ? <span className="font-mono text-xs" title={r.balInvoiceStored ? "Saved on the order" : "Computed as in PHP (not saved)"}>{r.balInvoiceNumber}</span> : <span className="text-ink-muted">—</span>),
  },
  { group: "basic", key: "balInvoiceDate", label: "Invoice Date Bharat Agrolink", width: 120, render: (r) => formatDate(r.balInvoiceDate) },
  { group: "basic", key: "status", label: "Payment Status", filter: { key: "status", type: "status" }, width: 120, render: (r) => <StatusBadge status={r.status} /> },
  {
    group: "basic", key: "cycleMovement", label: "Cycle Movement", filter: { key: "cycleMovement", type: "text" }, width: 220,
    render: (r) => (
      <span className="flex min-w-0 flex-col gap-0.5">
        {r.shifted && <Badge tone="info" className="self-start">Shifted</Badge>}
        <span className="text-xs whitespace-normal text-ink-soft" title={r.shifted && r.shiftedAt ? `Shifted ${formatDateTime(r.shiftedAt)}${r.shiftedBy ? ` by ${r.shiftedBy}` : ""}` : undefined}>
          {r.cycleMovement || <span className="text-ink-muted">—</span>}
        </span>
      </span>
    ),
  },
  { group: "basic", key: "productName", label: "Product name", filter: { key: "product", type: "text" }, width: 260, render: (r) => <span className="block whitespace-normal" title={r.productId}>{r.productName}</span> },
  { group: "basic", key: "productSku", label: "Product SKU", filter: { key: "productSku", type: "text" }, width: 220, render: (r) => <span className="block font-mono text-xs break-all whitespace-normal">{r.productSku || "—"}</span> },
  { group: "basic", key: "variantId", label: "Variant ID", filter: { key: "variantId", type: "text" }, width: 90 },
  { group: "basic", key: "vendorId", label: "Vendor ID", filter: { key: "vendorId", type: "text" }, width: 130, ...mono("vendorId") },
  { group: "basic", key: "vendorGstStateCode", label: "Vendor GST State Code", width: 100 },
  { group: "basic", key: "vendorGst", label: "Vendor GST", width: 160, ...mono("vendorGst") },
  { group: "basic", key: "vendorState", label: "Vendor State", width: 130 },
  { group: "basic", key: "customerState", label: "Seller Place Of Supply", width: 140 },
  { group: "financial", key: "qty", label: "Qty", filter: { key: "qty", type: "number" }, width: 70, align: "right" },
  { group: "financial", key: "cycleLabel", label: "Cycle", width: 190 },
  { group: "financial", key: "gross", label: "Total Order value", filter: { key: "gross", type: "number", hint: "≥" }, width: 130, ...money("gross") },
  { group: "financial", key: "taxable", label: "Seller Amount (Exclusive GST)", filter: { key: "taxable", type: "number", hint: "≥" }, width: 150, ...money("taxable") },
  { group: "financial", key: "totalGst", label: "Total GST", width: 110, ...money("totalGst") },
  { group: "financial", key: "cgst", label: "CGST", filter: { key: "cgst", type: "number", hint: "≥" }, width: 100, ...money("cgst") },
  { group: "financial", key: "sgst", label: "SGST", filter: { key: "sgst", type: "number", hint: "≥" }, width: 100, ...money("sgst") },
  { group: "financial", key: "igst", label: "IGST", filter: { key: "igst", type: "number", hint: "≥" }, width: 100, ...money("igst") },
  { group: "financial", key: "serviceInclGst", label: "Service Charges Inclusive Gst", width: 140, ...money("serviceInclGst") },
  { group: "financial", key: "serviceExclGst", label: "Service Charges Exclusive GST", width: 140, ...money("serviceExclGst") },
  { group: "financial", key: "serviceGst", label: "Service Charges GST", width: 120, ...money("serviceGst") },
  { group: "financial", key: "tcs", label: "TCS", width: 100, ...money("tcs") },
  { group: "financial", key: "totalNrv", label: "Total NRV", width: 120, ...money("totalNrv") },
  { group: "financial", key: "singleQtyNrv", label: "Single Qty NRV", width: 120, ...money("singleQtyNrv") },
  { group: "financial", key: "finalPayout", label: "Final seller Payout", width: 140, align: "right", render: (r) => <b className="tabular text-ink">{formatINR(r.finalPayout)}</b> },
  { group: "other", key: "transactionId", label: "Transaction ID", filter: { key: "transactionId", type: "text" }, width: 180, ...mono("transactionId") },
  { group: "other", key: "invoiceProof", label: "Invoice Proof", width: 120, render: null },
  { group: "other", key: "transactionDate", label: "Transaction Date", filter: { key: "transactionDate", type: "date" }, width: 160, render: (r) => formatDateTime(r.transactionDate) },
  { group: "other", key: "deliveryDate", label: "Delivery Date", filter: { key: "deliveryDate", type: "date" }, width: 140, render: (r) => formatDate(r.deliveryDate) },
];
const GROUPS = [
  { id: "basic", label: "📋 Basic Info" },
  { id: "financial", label: "💵 Financial Info" },
  { id: "other", label: "📅 Other Info" },
];
const FILTER_KEYS = COLUMNS.filter((c) => c.filter).map((c) => c.filter.key);

function draftFrom(query) {
  const d = { cycleMonth: query.cycleMonth ?? "", cycle: query.cycle ?? "", orderIds: query.orderIds ?? "" };
  for (const k of FILTER_KEYS) d[`f_${k}`] = query[`f_${k}`] ?? "";
  return d;
}

/** Applied query without paging, for Export Excel and the cycle documents. */
function fileQuery(query) {
  const out = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== "" && v != null && k !== "page" && k !== "pageSize") out.set(k, String(v));
  return out.toString();
}

const thBase = "border-b border-line bg-surface-muted px-3 text-left text-xs font-semibold text-ink-muted";

export function PayoutItemsTable({ payoutId, data, cycles, canEdit }) {
  const router = useRouter();
  const { setParams, pending } = useQueryState();
  const query = data.query;
  const [draft, setDraft] = useState(() => draftFrom(query));
  const [selected, setSelected] = useState(() => new Set());
  const [payRows, setPayRows] = useState([]);
  const [payKey, setPayKey] = useState(0);
  const [editRow, setEditRow] = useState(null);
  const [historyRow, setHistoryRow] = useState(null);

  const rows = data.rows;
  const pendingRows = rows.filter((r) => r.statusCode === "0");
  const selectedRows = pendingRows.filter((r) => selected.has(r.id));
  const months = useMemo(() => {
    const list = [...new Set(cycles.map((c) => c.month))];
    if (draft.cycleMonth && !list.includes(draft.cycleMonth)) list.unshift(draft.cycleMonth);
    return list;
  }, [cycles, draft.cycleMonth]);

  const qs = fileQuery(query);
  const docsReady = Boolean(query.cycleMonth && query.cycle);
  const base = `/admin/payouts/${payoutId}/documents`;
  const [sortKey, sortDir] = (query.sort || "").split(":");
  const filtersActive = Object.entries(draftFrom(query)).some(([, v]) => v);

  const apply = (next = draft) => {
    const updates = { ...next };
    if (!updates.cycleMonth) updates.cycle = "";
    setSelected(new Set());
    setParams(updates);
  };
  const clear = () => {
    const empty = Object.fromEntries(Object.keys(draft).map((k) => [k, ""]));
    setDraft(empty);
    apply(empty);
  };
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      apply();
    }
  };
  const toggleSort = (key) => setParams({ sort: sortKey === key ? (sortDir === "asc" ? `${key}:desc` : "") : `${key}:asc` });
  const openPay = (list) => {
    setPayKey((k) => k + 1);
    setPayRows(list);
  };
  const toggle = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allPendingSelected = pendingRows.length > 0 && pendingRows.every((r) => selected.has(r.id));

  const docButton = (doc, label, Icon, target) => (
    <a
      key={doc}
      href={docsReady ? `${base}/${doc}?${qs}` : undefined}
      target={target}
      rel={target ? "noopener" : undefined}
      aria-disabled={!docsReady}
      title={docsReady ? label : "Select Cycle Month and Cycle first"}
      className={cn(buttonClasses({ variant: "secondary", size: "sm" }), !docsReady && "pointer-events-none opacity-50")}
    >
      <Icon className="size-4" aria-hidden /> {label}
    </a>
  );

  const renderProof = (r) => {
    if (!r.invoiceProof) return <span className="text-ink-muted">—</span>;
    const Icon = r.invoiceProofKind === "image" ? ImageIcon : FileText;
    return (
      <a href={`${base}/proof?item=${r.id}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline" title={r.invoiceProof}>
        <Icon className="size-3.5" aria-hidden /> {r.invoiceProofKind === "image" ? "View image" : r.invoiceProofKind === "pdf" ? "View PDF" : "View file"}
      </a>
    );
  };

  return (
    <section aria-label="Vendor payout items" className="min-w-0 rounded-xl border border-line bg-surface">
      {/* Header: vendor, record count, pending pill, buttons (PHP toolbar without the shift controls). */}
      <div className="flex flex-col gap-3 border-b border-line p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-ink">{data.payout.vendor}</h2>
            <p className="text-xs text-ink-muted tabular">
              Showing {formatNumber(rows.length)} of {formatNumber(data.total)} records · Vendor ID <span className="font-mono">{data.payout.vendorId}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 text-sm font-semibold text-warning-ink tabular">
              Pending Final seller Payout: {formatINR(data.pendingPayout)}
            </span>
            <Badge tone="neutral">Records: {formatNumber(data.total)}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => router.refresh()} loading={pending}>
            <RefreshCw className="size-4" aria-hidden /> Refresh
          </Button>
          <a href={`${base}/export?${qs}`} className={buttonClasses({ variant: "secondary", size: "sm" })}>
            <Download className="size-4" aria-hidden /> Export Excel
          </a>
          {canEdit && (
            <Button size="sm" variant="primary" disabled={!selectedRows.length} onClick={() => openPay(selectedRows)} title={selectedRows.length ? undefined : "Select pending items first"}>
              <Wallet className="size-4" aria-hidden /> Add Payment{selectedRows.length ? ` (${selectedRows.length})` : ""}
            </Button>
          )}
          <span className="hidden h-6 w-px bg-line sm:block" aria-hidden />
          {docButton("invoice", "Invoice", FileText, "_blank")}
          {docButton("order-summary", "Order Summary", Download)}
          {docButton("payment-receipt", "Payment Receipt", Download)}
          {docButton("order-report", "Order Report", Download)}
        </div>

        {/* Filters (server side, kept in the URL). */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          <Select
            aria-label="Cycle month"
            className="lg:w-44"
            value={draft.cycleMonth}
            placeholder="Cycle Month: all"
            options={months.map((m) => ({ value: m, label: monthLabel(m) }))}
            onChange={(e) => setDraft((d) => ({ ...d, cycleMonth: e.target.value, cycle: e.target.value ? d.cycle : "" }))}
          />
          <Select aria-label="Cycle" className="lg:w-60" value={draft.cycle} placeholder="All cycles" options={CYCLES} disabled={!draft.cycleMonth} onChange={set("cycle")} />
          <Input aria-label="Order IDs" className="sm:col-span-2 lg:w-80" placeholder="Order ID(s), comma separated" value={draft.orderIds} onChange={set("orderIds")} onKeyDown={onEnter} />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <Button size="sm" variant="primary" onClick={() => apply()} loading={pending}>Apply Filter</Button>
            {filtersActive && <Button size="sm" variant="ghost" onClick={clear}>Clear</Button>}
          </div>
        </div>
        {data.cycle && (
          <p className="text-xs text-ink-muted">
            Cycle: {data.cycle.label ?? data.cycle.cycles?.map((c) => c.label).join(" + ")}. Items are in the cycle stored on them, otherwise the later of their delivery and created cycles (same rule as the
            payout summary). Cycle Movement is read only history.
          </p>
        )}
      </div>

      {/* Only this container scrolls sideways; the header stays on top while scrolling down. */}
      <div className="max-h-[70vh] overflow-auto overscroll-x-contain scrollbar-thin">
        <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className={cn(thBase, "border-r py-1.5 text-center")} colSpan={COLUMNS.filter((c) => c.group === "basic").length + 1}>{GROUPS[0].label}</th>
              <th className={cn(thBase, "border-r py-1.5 text-center")} colSpan={COLUMNS.filter((c) => c.group === "financial").length}>{GROUPS[1].label}</th>
              <th className={cn(thBase, "py-1.5 text-center")} colSpan={COLUMNS.filter((c) => c.group === "other").length + 1}>{GROUPS[2].label}</th>
            </tr>
            <tr>
              <th scope="col" className={cn(thBase, "w-10 py-2")}>
                {canEdit && (
                  <input
                    type="checkbox"
                    aria-label="Select all pending items on this page"
                    className="size-4 accent-brand-600"
                    disabled={!pendingRows.length}
                    checked={allPendingSelected}
                    onChange={() => setSelected(allPendingSelected ? new Set() : new Set(pendingRows.map((r) => r.id)))}
                  />
                )}
              </th>
              {COLUMNS.map((c) => {
                const sortable = SORTABLE.has(c.key);
                const active = sortKey === c.key;
                return (
                  <th key={c.key} scope="col" style={{ minWidth: c.width }} className={cn(thBase, "py-2 leading-tight", c.align === "right" && "text-right")} aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}>
                    {sortable ? (
                      <button type="button" onClick={() => toggleSort(c.key)} className={cn("inline-flex items-center gap-1 hover:text-ink", c.align === "right" && "flex-row-reverse", active && "text-ink")}>
                        {c.label}
                        {active && (sortDir === "asc" ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />)}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
              <th scope="col" className={cn(thBase, "py-2")} style={{ minWidth: 120 }}>Action</th>
            </tr>
            <tr>
              <th className={cn(thBase, "py-1.5")} />
              {COLUMNS.map((c) => (
                <th key={c.key} className={cn(thBase, "py-1.5 font-normal")}>
                  {c.filter?.type === "status" ? (
                    <Select aria-label={`Filter ${c.label}`} className="[&_select]:h-8 [&_select]:text-xs" value={draft[`f_${c.filter.key}`]} placeholder="All" options={["Paid", "Pending", "On Hold"]} onChange={(e) => apply({ ...draft, [`f_${c.filter.key}`]: e.target.value })} />
                  ) : c.filter ? (
                    <Input
                      aria-label={`Filter ${c.label}`}
                      type={c.filter.type === "date" ? "date" : "text"}
                      inputMode={c.filter.type === "number" ? "decimal" : undefined}
                      placeholder={c.filter.type === "number" ? (c.filter.hint ? "≥ amount" : "Equals") : c.filter.type === "date" ? undefined : "Contains"}
                      className="h-8 text-xs"
                      value={draft[`f_${c.filter.key}`]}
                      onChange={set(`f_${c.filter.key}`)}
                      onKeyDown={onEnter}
                    />
                  ) : null}
                </th>
              ))}
              <th className={cn(thBase, "py-1.5")} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-10 text-center text-sm text-ink-muted">
                  No payout items match these filters.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const isPending = r.statusCode === "0";
              return (
                <tr key={r.id} className={cn("odd:bg-surface even:bg-surface-muted/40 hover:bg-brand-50/40", selected.has(r.id) && "bg-brand-50/60")}>
                  <td className="border-b border-line px-3 py-2 align-top">
                    {canEdit && isPending && <input type="checkbox" aria-label={`Select item ${r.id}`} className="size-4 accent-brand-600" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />}
                  </td>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className={cn("border-b border-line px-3 py-2 align-top whitespace-nowrap", c.align === "right" && "text-right tabular")}>
                      {c.key === "invoiceProof" ? renderProof(r) : c.render ? c.render(r) : r[c.key] === "" || r[c.key] == null ? <span className="text-ink-muted">—</span> : r[c.key]}
                    </td>
                  ))}
                  <td className="border-b border-line px-3 py-2 align-top whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      {canEdit && isPending && (
                        <Button size="xs" variant="primary" onClick={() => openPay([r])}>Pay</Button>
                      )}
                      <Button size="icon-sm" variant="ghost" aria-label={`History of item ${r.id}`} title="View History" onClick={() => setHistoryRow(r)}>
                        <History className="size-4" />
                      </Button>
                      {canEdit && (
                        <Button size="icon-sm" variant="ghost" aria-label={`Edit item ${r.id}`} title="Edit Item" onClick={() => setEditRow(r)}>
                          <Pencil className="size-4" />
                        </Button>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2 text-xs text-ink-muted">
        <span className="tabular">
          Page {formatNumber(data.page)} of {formatNumber(Math.max(1, data.pageCount))} · {formatNumber(data.counts?.paid ?? 0)} paid · {formatNumber(data.counts?.pending ?? 0)} pending
        </span>
        <span className="flex items-center gap-2">
          <Select aria-label="Rows per page" className="w-24 [&_select]:h-8 [&_select]:text-xs" value={String(data.pageSize)} options={PAGE_SIZES.map((n) => ({ value: String(n), label: `${n} / page` }))} onChange={(e) => setParams({ pageSize: e.target.value })} />
          <Button size="icon-sm" variant="secondary" aria-label="Previous page" disabled={data.page <= 1 || pending} onClick={() => setParams({ page: data.page - 1 }, { resetPage: false })}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="icon-sm" variant="secondary" aria-label="Next page" disabled={data.page >= data.pageCount || pending} onClick={() => setParams({ page: data.page + 1 }, { resetPage: false })}>
            <ChevronRight className="size-4" />
          </Button>
        </span>
      </div>

      <PayItemsDialog key={`pay-${payKey}`} payoutId={payoutId} items={payRows} onClose={() => setPayRows([])} onPaid={() => setSelected(new Set())} />
      <EditItemDialog key={`edit-${editRow?.id ?? "none"}`} payoutId={payoutId} row={editRow} onClose={() => setEditRow(null)} />
      <ItemHistoryDialog key={`history-${historyRow?.id ?? "none"}`} payoutId={payoutId} row={historyRow} onClose={() => setHistoryRow(null)} />
    </section>
  );
}
