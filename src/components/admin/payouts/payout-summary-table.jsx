"use client";

import { CalendarRange, X } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Select } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { payoutSummaryExportAction } from "@/lib/actions/admin/payout-summary";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (ym) => {
  const [y, m] = String(ym).split("-").map(Number);
  return y && m ? `${MONTHS[m - 1]} ${y}` : ym;
};
const HALVES = [
  { value: "first", label: "First Cycle (1–15)" },
  { value: "second", label: "Second Cycle (16–Month End)" },
];
const STATE_TONE = { Running: "success", Closed: "neutral", Upcoming: "info" };

/** PHP payout_new.php columns, in PHP's order. Items / pending items are extra and hidden by default. */
const COLUMNS = [
  { key: "sr", label: "SR.", type: "number", width: 64 },
  { key: "vendor", label: "Vendor", sub: "vendorId", href: "/admin/vendors/{sellerId}", width: 280, wrap: true, sortable: true },
  { key: "orders", label: "Orders", type: "number", sortable: true },
  { key: "items", label: "Items", type: "number", hidden: true },
  { key: "gross", label: "Gross Amount", type: "currency", sortable: true },
  { key: "taxable", label: "Taxable", type: "currency", sortable: true },
  { key: "net", label: "Net Amount", type: "currency", sortable: true },
  { key: "paidBsa", label: "Paid BSA", type: "currency", sortable: true },
  { key: "pendingBsa", label: "Pending BSA", type: "currency", sortable: true },
  { key: "pendingItems", label: "Pending items", type: "number", hidden: true },
  { key: "status", label: "Status", type: "status", sortable: true },
  { key: "view", label: "Action", href: "/admin/payouts/{id}" },
];

const ROW_ACTIONS = [
  { id: "open", label: "View payout", href: "/admin/payouts/{id}" },
  { id: "items", label: "View payout items", href: "/admin/payouts/items?vendorId={vendorId}" },
  { id: "vendor", label: "Open vendor", href: "/admin/vendors/{sellerId}" },
];

const STATUS_FILTER = { key: "status", label: "Status", options: ["Pending", "Paid", "On Hold"] };

function CycleSelector({ cycles }) {
  const { get, setParams } = useQueryState();
  const month = get("cycleMonth");
  const half = get("cycle");
  const months = [...new Set(cycles.map((c) => c.month))];
  if (month && !months.includes(month)) months.unshift(month);
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <div className="relative">
        <CalendarRange className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <Select
          aria-label="Cycle month"
          className="w-44 [&_select]:pl-8"
          value={month}
          placeholder="Cycle month: all"
          options={months.map((m) => ({ value: m, label: monthLabel(m) }))}
          onChange={(e) => setParams({ cycleMonth: e.target.value, cycle: e.target.value ? half : "" })}
        />
      </div>
      <Select
        aria-label="Cycle"
        className="w-56"
        value={half}
        placeholder="All cycles in month"
        options={HALVES}
        disabled={!month}
        onChange={(e) => setParams({ cycle: e.target.value })}
      />
    </div>
  );
}

/** Every cycle that has payout items. Picking one filters the table; nothing changes on its own. */
function CycleStrip({ cycles }) {
  const { get, setParams, pending } = useQueryState();
  const month = get("cycleMonth");
  const half = get("cycle");
  if (!cycles.length) return null;
  return (
    <section aria-label="Payout cycles" className="min-w-0 rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <h2 className="text-sm font-semibold text-ink">Payout cycles</h2>
        {month && (
          <button type="button" onClick={() => setParams({ cycleMonth: "", cycle: "" })} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink">
            <X className="size-3.5" aria-hidden /> All cycles
          </button>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <ul className="flex min-w-max gap-2 p-3">
          {cycles.map((c) => {
            const active = month === c.month && half === c.half;
            return (
              <li key={c.index}>
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => setParams(active ? { cycleMonth: "", cycle: "" } : { cycleMonth: c.month, cycle: c.half })}
                  className={cn(
                    "w-52 rounded-lg border px-3 py-2 text-left transition-colors",
                    active ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600/20" : "border-line hover:border-brand-200 hover:bg-surface-muted",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-ink">{c.label.replace(/ \(.*\)$/, "")}</span>
                    <Badge tone={STATE_TONE[c.state]}>{c.state}</Badge>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ink-muted tabular">
                    {c.from.slice(8)}–{c.to.slice(8)} {monthLabel(c.month)} · {formatNumber(c.vendors)} vendors · {formatNumber(c.items)} items
                  </span>
                  <span className="mt-1 block truncate text-xs text-success-ink tabular">Paid BSA {formatINR(c.paidBsa)}</span>
                  <span className="block truncate text-xs text-warning-ink tabular">Pending BSA {formatINR(c.pendingBsa)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function PayoutSummaryTable({ data, cycles }) {
  const rows = data.rows.map((r) => ({ ...r, view: "View" }));
  const t = data.totals ?? {};
  const counts = data.tabCounts ?? {};
  const summary = (
    <span className="flex flex-wrap gap-x-4 gap-y-1 tabular">
      <span>
        Filtered totals — Orders <b className="text-ink">{formatNumber(t.orders)}</b>
      </span>
      <span>
        Gross <b className="text-ink">{formatINR(t.gross)}</b>
      </span>
      <span>
        Taxable <b className="text-ink">{formatINR(t.taxable)}</b>
      </span>
      <span>
        Net <b className="text-ink">{formatINR(t.net)}</b>
      </span>
      <span>
        Paid BSA <b className="text-success-ink">{formatINR(t.paidBsa)}</b>
      </span>
      <span>
        Pending BSA <b className="text-warning-ink">{formatINR(t.pendingBsa)}</b>
      </span>
      <span>
        Status: {formatNumber(counts.Pending ?? 0)} pending · {formatNumber(counts.Paid ?? 0)} paid
        {counts["On Hold"] ? ` · ${formatNumber(counts["On Hold"])} on hold` : ""}
      </span>
    </span>
  );
  return (
    <div className="space-y-4">
      <CycleStrip cycles={cycles} />
      <DataTable
        id="vendor-payouts"
        columns={COLUMNS}
        data={{ ...data, rows }}
        search="Search vendor name or vendor ID"
        filters={[STATUS_FILTER]}
        toolbar={<CycleSelector cycles={cycles} />}
        rowActions={ROW_ACTIONS}
        onExport={payoutSummaryExportAction}
        exportName="vendor_payout_summary"
        summary={summary}
        emptyTitle="No vendor payouts found"
        emptyDescription={data.cycle ? "No vendor has payout items in this cycle with these filters." : "Try changing the search or filters."}
      />
    </div>
  );
}
