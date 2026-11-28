"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, FileSpreadsheet, FileText } from "lucide-react";
import { gridTheme } from "@/components/data-table/ag-data-grid";
import { ColumnFilter, applyColumnFilters, columnFilterActive, columnValueOptions } from "@/components/data-table/column-filter";
import { ColumnMenu } from "@/components/data-table/column-menu";
import { useTableColumns } from "@/components/data-table/use-table-columns";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { useCanExport } from "@/components/admin/shell/admin-user";
import { formatDate, formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { saveOrderReportOverrideAction } from "@/lib/actions/admin/orders-report";

/** Cost factors of the product Pricing & Tax step, one column group each (API fields cf_<CODE>_<Part>). */
const COST_FACTORS = [
  ["SHIPPING", "Shipping"],
  ["PG_COD", "Payment gateway / COD"],
  ["PACKAGING", "Packaging"],
  ["RTO_CLAIMS", "RTO & claims"],
  ["PAYMENT_DISCOUNT", "Partial Payment"],
  ["PAYMENT_DISCOUNTS", "Pre Paid Payment"],
];
const FACTOR_PARTS = [["TargetPct", "Target %"], ["Target", "Target ₹"], ["Achievable", "Achievable ₹"], ["AchievementPct", "Achievement %"], ["Variance", "Variance ₹"]];
const factorKey = (code, part) => `cf_${code}_${part}`;
const FACTOR_COLUMNS = COST_FACTORS.flatMap(([code, name]) => FACTOR_PARTS.map(([part, label]) => [factorKey(code, part), `${name} ${label}`]));
const FACTOR_MONEY = COST_FACTORS.flatMap(([code]) => ["Target", "Achievable", "Variance"].map((part) => factorKey(code, part)));
const FACTOR_PERCENT = COST_FACTORS.flatMap(([code]) => ["TargetPct", "AchievementPct"].map((part) => factorKey(code, part)));

const MONEY = new Set([...FACTOR_MONEY, "deliveryCharge", "price", "taxable", "discount", "advance", "codShipping", "commission", "gstOnCommission", "adAmount", "officeAmount", "profitAmount", "otherCharges", "gstOther", "cgst", "sgst", "igst", "gross", "unitNrv", "totalNrv", "bsa", "serviceExcl", "serviceGst", "serviceIncl", "rtoCharge", "costDisplayPrice", "costTaxable", "costTcs", "costNrv", "costServiceCharge", "costScGst", "costNetServiceCharge", "costFactorsTotal", "costMargin", "costCourierCharge", "costShippingActual", "costShippingDiff", "costAdjustedMargin", "costTcsBalance", "costSellerPayout", "advanceAmount", "prepaidPartialDiscount", "shippingCharges", "codHandlingCharges", "totalShippingCharges", "razorpayCharges", "contributionTarget", "contributionAchievable", "contributionAchievableVariance", "contributionAchieved", "contributionAchievedVariance"]);
const PERCENT = new Set([...FACTOR_PERCENT, "commissionPct", "adPct", "officePct", "profitPct", "costTakeRatePct", "costMarginPct", "costAdjustedMarginPct", "contributionTargetPct", "contributionAchievablePct", "contributionAchievedPct"]);

const COLUMNS = [
  ["sr", "Sr No"], ["id", "Item ID"], ["orderId", "Order ID"], ["customer", "Customer Name"], ["customerState", "Customer State"],
  ["invoice", "Invoice ID"], ["balInvoice", "Bharat Agrolink Invoice"], ["awb", "AWB No"], ["productId", "Product ID"], ["product", "Product Name"], ["sku", "SKU"],
  ["manageHref", "Order Manage"], ["customerInvoiceHref", "Customer Invoice"], ["vendorInvoiceHref", "Vendor Invoice"],
  ["vendor", "Vendor Name"], ["vendorState", "Vendor State"], ["vendorGst", "Vendor GST Number"], ["vendorGstState", "Vendor GST State Code"],
  ["courier", "Delivery Service"], ["deliveryCharge", "Delivery Service Charges"], ["qty", "Quantity (QTY)"], ["price", "Product Price (Display Price)"],
  ["taxable", "Taxable Amount (S.P.)"], ["discount", "Discount"], ["advance", "Advance Payment"], ["codShipping", "COD Shipping Charges"],
  // ["commissionPct", "Commission %"], ["commission", "Commission Amount"], ["gstOnCommission", "GST on Commission"],
  // ["adPct", "Ad Expense %"], ["adAmount", "Ad Expense Amount"], 
   ["officePct", "Office Expense %"], ["officeAmount", "Office Expense Amount"],
  ["profitPct", "Profit %"], ["profitAmount", "Profit Amount"], ["otherCharges", "Other Charges"], ["gstOther", "GST on Other Charges"],
  ["cgst", "CGST"], ["sgst", "SGST"], ["igst", "IGST"], ["gross", "Gross Amount"], ["unitNrv", "Single Qty NRV"], ["totalNrv", "Total NRV"],
  ["bsa", "BSA"], ["serviceExcl", "Service Charge (Excl. GST)"], ["serviceGst", "Service GST (18%)"], ["serviceIncl", "Service Charge (Incl. GST)"],
  ["status", "Status"], ["rtoCharge", "RTO Charge (freight × 1)"], ["rtoStatus", "RTO Status"], ["rtoDate", "RTO Date"],
  ["paymentStatus", "Payment Status"], ["paymentMode", "Payment Mode"], ["createdAt", "Order Created Date"], ["deliveredAt", "Delivery Date"],
  ["customerPaymentType", "Customer Payment Status"], ["advanceAmount", "Payment Advance"], ["prepaidPartialDiscount", "Prepaid / Partial Discount"],
  ["shippingCharges", "Shipping Charges"], ["codHandlingCharges", "COD Handling Charges"], ["totalShippingCharges", "Total Shipping Charges"],
  ["razorpayPaymentId", "Razorpay Payment ID"], ["razorpayCharges", "Razorpay Charges"],
  ["contributionTarget", "Target Contribution"], ["contributionTargetPct", "Target Contribution %"],
  ["contributionAchievable", "Achievable Contribution"], ["contributionAchievablePct", "Achievable Contribution %"], ["contributionAchievableVariance", "Achievable Variance"],
  ["contributionAchieved", "Achieved Contribution"], ["contributionAchievedPct", "Achieved Contribution %"], ["contributionAchievedVariance", "Achieved Variance"],
  ["contributionBreakdown", "Achieved Contribution Breakdown"],
  ["costDisplayPrice", "Pricing display price"], ["costTaxable", "Pricing taxable value"], ["costTcs", "Pricing TCS"], ["costNrv", "Pricing NRV to seller"],
  ["costServiceCharge", "Pricing service charge"], ["costScGst", "Pricing GST on service charge"], ["costNetServiceCharge", "Pricing net service charge"],
  ["costTakeRatePct", "Pricing take rate %"], ["costFactorsTotal", "Pricing cost factors actual"], ["costMargin", "Pricing contribution margin"],
  ["costMarginPct", "Pricing contribution margin %"], ["costCourier", "Pricing courier"], ["costCourierCharge", "Pricing courier charge"],
  ["costShippingActual", "Pricing shipping actual"], ["costShippingDiff", "Pricing shipping difference"], ["costAdjustedMargin", "Pricing adjusted contribution margin"],
  ["costAdjustedMarginPct", "Pricing adjusted contribution margin %"], ["costTcsBalance", "Pricing TCS balance retained"], ["costSellerPayout", "Pricing seller payout"],
  ["costFactors", "Pricing cost factors"],
  ...FACTOR_COLUMNS,
];

const LABEL = Object.fromEntries(COLUMNS);

ModuleRegistry.registerModules([AllCommunityModule]);

const SHORT_LABEL = {
  customerPaymentType: "Payment",
  contributionAchieved: "Achieved Contribution",
  contributionAchievedPct: "Achieved %",
  // Inside a "Cost factor: <name>" group the header only needs the part; the full name stays in the tooltip.
  ...Object.fromEntries(COST_FACTORS.flatMap(([code]) => FACTOR_PARTS.map(([part, label]) => [factorKey(code, part), label]))),
};

/** Column groups (grid header groups, mobile card sections): [title, key columns, the rest]. Every column is always shown. */
const GROUPS = [
  ["Order & customer", ["customer", "deliveredAt"], ["id", "invoice", "balInvoice", "awb", "customerState", "status", "paymentStatus", "createdAt", "manageHref", "customerInvoiceHref", "vendorInvoiceHref"]],
  ["RTO", ["rtoCharge", "rtoStatus"], ["rtoDate"]],
  ["Product & vendor", ["product", "sku"], ["productId", "vendor", "vendorState", "vendorGst", "vendorGstState"]],
  ["Price & tax", ["qty", "gross"], ["price", "taxable", "discount", "cgst", "sgst", "igst"]],
  ["Customer payment", ["customerPaymentType"], ["paymentMode", "advance", "advanceAmount", "prepaidPartialDiscount", "razorpayPaymentId", "razorpayCharges"]],
  ["Shipping", ["totalShippingCharges"], ["courier", "deliveryCharge", "codShipping", "shippingCharges", "codHandlingCharges"]],
  // ["Commission & expenses", ["commission"], ["commissionPct", "gstOnCommission", "adPct", "adAmount", "officePct", "officeAmount", "profitPct", "profitAmount", "otherCharges", "gstOther"]],
  ["NRV & payout", ["totalNrv"], ["unitNrv", "bsa", "serviceExcl", "serviceGst", "serviceIncl"]],
  ["Contribution", ["contributionAchieved", "contributionAchievedPct"], ["contributionTarget", "contributionTargetPct", "contributionAchievable", "contributionAchievablePct", "contributionAchievableVariance", "contributionAchievedVariance", "contributionBreakdown"]],
  // One group per cost factor, like the Pricing & Tax step's table: Target %, Target ₹, Achievable ₹, Achievement %, Variance ₹.
  ...COST_FACTORS.map(([code, name]) => [`Cost factor: ${name}`, [factorKey(code, "Achievable"), factorKey(code, "Variance")], [factorKey(code, "TargetPct"), factorKey(code, "Target"), factorKey(code, "AchievementPct")]]),
  ["Pricing & tax (product)", ["costMargin", "costMarginPct"], ["costDisplayPrice", "costTaxable", "costTcs", "costNrv", "costServiceCharge", "costScGst", "costNetServiceCharge", "costTakeRatePct", "costFactorsTotal", "costCourier", "costCourierCharge", "costShippingActual", "costShippingDiff", "costAdjustedMargin", "costAdjustedMarginPct", "costTcsBalance", "costSellerPayout", "costFactors"]],
];
const WIDTH = { balInvoice: 170, product: 240, contributionBreakdown: 380, costFactors: 320, customer: 170, vendor: 170, courier: 170 };
const TEXT_TIP = new Set(["product", "contributionBreakdown", "costFactors", "courier", "vendor"]);

// The shared admin grid look (as every other AG Grid table), a little tighter as this report has ~120 columns.
const reportTheme = gridTheme.withParams({ rowHeight: 44, headerHeight: 46 });
const LINK_KEYS = new Set(["manageHref", "customerInvoiceHref", "vendorInvoiceHref"]);
const DATE_KEYS = new Set(["createdAt", "deliveredAt", "rtoDate"]);
const isNumeric = (key) => MONEY.has(key) || PERCENT.has(key) || key === "qty" || key === "sr";

/** Column description the shared header filter understands ({ key, label, type }). */
const FILTER_COLUMNS = Object.fromEntries(
  COLUMNS.map(([key, label]) => [
    key,
    { key, label, type: MONEY.has(key) ? "currency" : PERCENT.has(key) ? "percent" : key === "qty" || key === "sr" ? "number" : DATE_KEYS.has(key) ? "date" : undefined, filter: !LINK_KEYS.has(key) },
  ]),
);

/** The text a cell shows, for the filter checklist. */
function cellText(row, key) {
  const value = row[key];
  if (value == null || value === "") return "";
  if (key === "createdAt" || key === "deliveredAt") return formatDate(value);
  if (key === "rtoDate") return formatDateTime(value);
  if (MONEY.has(key)) return formatINR(value);
  if (PERCENT.has(key)) return `${Number(value).toFixed(2)}%`;
  if (key === "qty" || key === "sr") return formatNumber(value);
  return String(value);
}

const ReportGrid = createContext(null);
// Every report column, for the session's column choice (none hidden by default).
const REPORT_COLUMN_KEYS = COLUMNS.map(([key]) => ({ key }));
// Kept constant: a new object each render would make AG Grid re-apply the defaults and lose column widths.
const DEFAULT_COL_DEF = { sortable: true, resizable: true, suppressMovable: false, suppressHeaderMenuButton: true };

/**
 * Header of every report column, as in the other admin tables: the name (click to sort ↑ / ↓ / off on the
 * loaded page), then the filter (value checklist + condition) and the ⋮ column menu on the right.
 */
function ReportHeader({ column, api, displayName }) {
  const g = useContext(ReportGrid);
  const key = column.getColId();
  const col = FILTER_COLUMNS[key] ?? { key, label: displayName };
  const right = isNumeric(key);
  const [sort, setSortState] = useState(column.getSort() ?? "");
  useEffect(() => {
    const update = () => setSortState(column.getSort() ?? "");
    column.addEventListener("sortChanged", update);
    return () => column.removeEventListener("sortChanged", update);
  }, [column]);
  const setSort = (dir) => api.applyColumnState({ state: [{ colId: key, sort: dir || null }], defaultState: { sort: null } });
  const SortIcon = !sort ? ArrowUpDown : sort === "asc" ? ArrowUp : ArrowDown;
  const filterable = col.filter !== false;
  const options = filterable ? columnValueOptions(col, g.allRows, (row) => cellText(row, key)) : null;

  return (
    <div className="flex w-full min-w-0 items-center gap-1 text-label font-semibold tracking-[0.04em] uppercase select-none" aria-sort={sort ? (sort === "asc" ? "ascending" : "descending") : undefined}>
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          setSort(sort === "" ? "asc" : sort === "asc" ? "desc" : "");
        }}
        title={`Sort by ${col.label}`}
        className={cn("group mr-auto inline-flex min-w-0 cursor-pointer items-center gap-1.5 uppercase transition-colors", right && "ml-auto mr-0", sort ? "font-bold text-ink" : "text-ink-muted hover:text-ink")}
      >
        <span className="truncate">{displayName}</span>
        <SortIcon className={cn("size-3.5 shrink-0", sort ? "stroke-[2.5] text-brand-600" : "text-ink-muted/50 group-hover:text-ink")} aria-hidden />
      </button>
      <div className="ml-1 flex shrink-0 items-center gap-0.5">
        {filterable && <ColumnFilter column={col} filter={g.colFilters[key]} options={options} onChange={(value) => g.setColFilter(key, value)} />}
        <ColumnMenu
          api={api}
          column={column}
          col={col}
          sortable
          sortDir={sort}
          onSort={setSort}
          allColumns={g.allColumns}
          hiddenKeys={g.hidden}
          onToggleColumn={g.toggleColumn}
          onReset={g.reset}
        />
      </div>
    </div>
  );
}

/** "Sr No" header: centred, no tools. */
const SerialHeader = () => <span className="w-full text-center text-label font-medium tracking-[0.02em] uppercase">Sr No</span>;

function column(key) {
  const numeric = isNumeric(key);
  return {
    colId: key,
    field: key,
    headerName: SHORT_LABEL[key] ?? LABEL[key],
    headerTooltip: LABEL[key],
    headerComponent: ReportHeader,
    width: WIDTH[key] ?? (numeric ? 150 : 170),
    minWidth: 110,
    type: numeric ? "rightAligned" : undefined,
    valueGetter: numeric ? (params) => (params.data[key] == null || params.data[key] === "" ? null : Number(params.data[key])) : undefined,
    cellRenderer: (params) => cell(params.data, key),
    tooltipValueGetter: TEXT_TIP.has(key) ? (params) => params.data[key] || undefined : undefined,
  };
}

function cell(row, key) {
  const value = row[key];
  if (key === "manageHref" || key === "customerInvoiceHref" || key === "vendorInvoiceHref") {
    if (!value) return "—";
    const label = key === "manageHref" ? "Open" : "Invoice";
    return <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">{label}</a>;
  }
  if (key === "orderId") return <a href={row.manageHref || `/admin/orders/${row.orderId}`} className="font-medium text-brand-700 hover:underline">{value}</a>;
  if (key === "createdAt" || key === "deliveredAt") return formatDate(value);
  if (key === "rtoDate") return value ? formatDateTime(value) : "—";
  if (key === "status" || key === "paymentStatus" || key === "rtoStatus") return value ? <StatusBadge status={value} /> : "—";
  if (MONEY.has(key)) return value == null ? "—" : formatINR(value);
  if (PERCENT.has(key)) return value == null || value === "" ? "—" : `${Number(value).toFixed(2)}%`;
  if (key === "qty" || key === "sr") return formatNumber(value);
  return value || "—";
}

const FORMATS = [
  { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { value: "csv", label: "CSV (.csv)", icon: FileText },
];

function orderReportExportHref(filters, format, columns = null) {
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value && key !== "page" && key !== "pageSize") out.set(key, String(value));
  }
  if (columns && columns.length) out.set("columns", columns.join(","));
  out.set("format", format);
  return `/admin/orders/report-export?${out.toString()}`;
}

export function OrderReportExportMenu({ filters, columns }) {
  const canExport = useCanExport();
  const allColumns = useMemo(() => {
    if (columns && columns.length) return columns;
    return COLUMNS.map(([value, label]) => ({ value, label }));
  }, [columns]);
  const allKeys = useMemo(() => allColumns.map((c) => c.value), [allColumns]);
  const [picked, setPicked] = useState(null);
  const known = useMemo(() => new Set(allKeys), [allKeys]);
  const selected = useMemo(() => {
    if (picked === null) return allKeys;
    return picked.filter((k) => known.has(k));
  }, [picked, allKeys, known]);
  const toggle = (key) =>
    setPicked((p) => {
      const cur = p === null ? allKeys : p;
      return cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
    });
  const chosen = selected.length && selected.length < allKeys.length ? selected : null;
  // Exports are for super admins only (the download route re-checks).
  if (!canExport) return null;

  return (
    <Popover
      label="Export Order Report: choose columns and format"
      panelClassName="w-64"
      trigger={({ toggle: open, props }) => (
        <Button size="sm" variant="primary" onClick={open} title="Export delivered order lines" {...props}>
          <Download className="size-4" aria-hidden /> Export
        </Button>
      )}
    >
      <div className="max-h-64 space-y-1.5 overflow-y-auto border-b border-line p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-ink-muted">Columns</span>
          <button type="button" onClick={() => setPicked(selected.length ? [] : allKeys)} className="text-xs font-medium text-brand-700 hover:underline">
            {selected.length ? "Clear" : "Select all"}
          </button>
        </div>
        {allColumns.map((c) => (
          <Checkbox key={c.value} label={c.label} checked={selected.includes(c.value)} onChange={() => toggle(c.value)} className="flex" />
        ))}
      </div>
      {selected.length === 0 ? (
        <p className="px-3.5 py-2.5 text-xs text-ink-muted">Tick at least one column to export.</p>
      ) : (
        <ul className="p-1">
          {FORMATS.map(({ value, label: formatLabel, icon: Icon }) => (
            <li key={value}>
              <a href={orderReportExportHref(filters, value, chosen)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-small text-ink hover:bg-surface-muted">
                <Icon className="size-4 text-ink-muted" aria-hidden /> {formatLabel}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

/** The orders_report.php grid (AG Grid): column groups that open to every finance column, CSV export, and the manual-override edit. */
export function OrderReportTable({ report, filters, exportColumns, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [line, setLine] = useState(null);
  const [form, setForm] = useState({});
  const [pending, startTransition] = useTransition();
  const { rows, total, page, pageCount } = report;
  const apiRef = useRef(null);
  const [colFilters, setColFilters] = useState({});
  // Columns shown (⋮ Choose Columns), kept for this session like every admin table.
  const { hidden, setHidden, reset: resetSavedColumns } = useTableColumns("order-report", REPORT_COLUMN_KEYS);

  // Header filters work on the loaded page, instantly (as in the other admin tables).
  const shownRows = useMemo(() => applyColumnFilters(rows, Object.values(FILTER_COLUMNS), colFilters), [rows, colFilters]);
  const filteredCount = Object.values(colFilters).some(columnFilterActive) ? shownRows.length : null;

  const grid = useMemo(
    () => ({
      allRows: rows,
      colFilters,
      setColFilter: (key, value) => setColFilters((current) => ({ ...current, [key]: value })),
      allColumns: COLUMNS.filter(([key]) => key !== "sr").map(([key, label]) => ({ key, label })),
      hidden,
      // The column definitions take `hide` from `hidden`, so a choice (and the session's saved one) applies itself.
      toggleColumn: (key, show) => setHidden((h) => (show ? h.filter((k) => k !== key) : [...new Set([...h, key])])),
      reset: () => {
        apiRef.current?.resetColumnState();
        resetSavedColumns();
        setColFilters({});
      },
    }),
    [rows, colFilters, hidden, setHidden, resetSavedColumns],
  );

  const href = (next) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, page: String(next) })) if (value) params.set(key, value);
    return `/admin/orders/report?${params.toString()}`;
  };
  const pageSize = Number(filters?.pageSize) || rows.length || 1;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, (page - 1) * pageSize + rows.length);

  const open = useCallback((row) => {
    setLine(row);
    setForm({
      commissionPct: row.commissionPct ?? "",
      adPct: row.adPct ?? "",
      officePct: row.officePct ?? "",
      profitPct: row.profitPct ?? "",
      totalNrv: row.totalNrv ?? "",
      gross: row.gross ?? "",
    });
  }, []);

  const columnDefs = useMemo(() => [
    // Slim, centred Sr No like the other tables' S.No. (drag the edge to resize).
    { ...column("sr"), headerComponent: SerialHeader, pinned: "left", width: 56, minWidth: 44, maxWidth: 120, type: undefined, cellClass: "ba-serial text-center", headerClass: "ba-serial", sortable: false, lockPinned: true },
    { ...column("orderId"), pinned: "left", width: 190, hide: hidden.includes("orderId") },
    ...GROUPS.map(([title, shown, more]) => ({
      groupId: title,
      headerName: title,
      children: [...shown, ...more].map((key) => ({ ...column(key), hide: hidden.includes(key) })),
    })),
    ...(canEdit
      ? [{
          colId: "edit",
          headerName: "Edit",
          pinned: "right",
          width: 80,
          sortable: false,
          resizable: false,
          cellRenderer: (params) => (params.data.b2b ? <span className="text-xs text-ink-muted">—</span> : <Button size="xs" onClick={() => open(params.data)}>Edit</Button>),
        }]
      : []),
  ], [canEdit, open, hidden]);

  const save = () => {
    startTransition(async () => {
      const result = await saveOrderReportOverrideAction({ ...form, orderId: line.orderId, productId: line.productId, sku: line.sku, vendorId: line.vendorId });
      notify({ message: result.message || (result.ok ? "Saved." : "Could not save."), tone: result.ok ? "success" : "error" });
      if (result.ok) {
        setLine(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface shadow-[var(--shadow-card)]">
      {/* <div className="border-b border-danger-ink/20 bg-danger-bg px-4 py-2.5 text-sm font-medium text-danger-ink"> */}
        
      {/* </div> */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Order Details</h2>
          <p className="text-xs text-ink-muted">{formatNumber(total)} order lines{filters?.status ? ` · Status: ${filters.status}` : ""}</p>
        </div>
        <OrderReportExportMenu filters={filters} columns={exportColumns} />
      </div>
      <ReportGrid.Provider value={grid}>
        <div className="ba-grid ba-report-grid hidden h-[70vh] md:block">
          <AgGridReact
            theme={reportTheme}
            rowData={shownRows}
            columnDefs={columnDefs}
            defaultColDef={DEFAULT_COL_DEF}
            getRowId={(params) => `${params.data.id}-${params.data.sku}`}
            onGridReady={(params) => {
              apiRef.current = params.api;
            }}
            tooltipShowDelay={300}
            suppressCellFocus
            enableCellTextSelection
            maintainColumnOrder
            overlayNoRowsTemplate="No order lines match these filters."
          />
        </div>
      </ReportGrid.Provider>
      <div className="space-y-3 bg-surface-muted/60 p-3 md:hidden">
        {shownRows.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">No order lines match these filters.</p>
        ) : shownRows.map((row) => (
          <article key={`${row.id}-${row.sku}`} className="rounded-lg border border-line bg-surface">
            <header className="flex items-start justify-between gap-3 border-b border-line px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-micro text-ink-muted">#{formatNumber(row.sr)}</p>
                <p className="text-sm">{cell(row, "orderId")}</p>
                <p className="mt-0.5 break-words text-xs text-ink-soft">{row.product || "—"}</p>
              </div>
              {canEdit && !row.b2b && <Button size="xs" onClick={() => open(row)}>Edit</Button>}
            </header>
            {GROUPS.map(([title, shown, more]) => (
              <section key={title} className="border-b border-line px-3 py-2.5 last:border-b-0">
                <h3 className="mb-1.5 text-xs font-semibold text-ink">{title}</h3>
                <dl className="space-y-1">
                  {[...shown, ...more].map((key) => (
                    <div key={key} className={TEXT_TIP.has(key) ? "text-label" : "flex items-baseline justify-between gap-3 text-label"}>
                      <dt className="text-ink-muted">{LABEL[key]}</dt>
                      <dd className={TEXT_TIP.has(key) ? "mt-0.5 break-words text-ink-soft" : `min-w-0 break-all text-right text-ink-soft ${MONEY.has(key) || PERCENT.has(key) ? "tabular" : ""}`}>{cell(row, key)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </article>
        ))}
      </div>
      {/* Footer as in the other admin tables: "Showing x–y of n" left, paging right, pinned while scrolling. */}
      <div className="flex flex-col gap-2 rounded-b-xl border-t border-line bg-surface px-3 py-2.5 text-small text-ink-muted sm:sticky sm:bottom-0 sm:z-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-center tabular sm:truncate sm:text-left">
          {total === 0 ? "No results" : `Showing ${formatNumber(from)}–${formatNumber(to)} of ${formatNumber(total)}`}
          {filteredCount != null && (
            <>
              {" · "}
              <span className="font-medium text-brand-700">{formatNumber(filteredCount)} match column filters</span>{" "}
              <button type="button" onClick={() => setColFilters({})} className="font-medium underline hover:text-ink">
                Reset
              </button>
            </>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-2 max-sm:w-full max-sm:justify-between">
          <Button size="icon-sm" className="max-sm:size-10" disabled={page <= 1} onClick={() => router.push(href(page - 1))} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-20 text-center font-medium text-ink-soft tabular">
            Page {formatNumber(page)} / {formatNumber(Math.max(1, pageCount))}
          </span>
          <Button size="icon-sm" className="max-sm:size-10" disabled={page >= pageCount} onClick={() => router.push(href(page + 1))} aria-label="Next page">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <Dialog open={Boolean(line)} onClose={() => setLine(null)} title="Edit financial fields" description={line ? `${line.orderId} · ${line.sku || line.productId} · ${line.vendor}` : undefined} size="lg">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["commissionPct", "Commission %"],
            ["adPct", "Ad expense %"],
            ["officePct", "Office expense %"],
            ["profitPct", "Profit %"],
            ["totalNrv", "Total NRV (₹)"],
            ["gross", "Gross amount (₹)"],
          ].map(([key, label]) => (
            <Field key={key} label={label} hint="Leave blank to clear a manual override.">
              {({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />}
            </Field>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setLine(null)}>Cancel</Button>
          <Button variant="primary" loading={pending} onClick={save}>Save changes</Button>
        </div>
      </Dialog>
    </div>
  );
}
