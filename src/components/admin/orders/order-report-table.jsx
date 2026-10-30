"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatINR, formatNumber } from "@/lib/format";
import { exportOrderReportAction, saveOrderReportOverrideAction } from "@/lib/actions/admin/orders-report";

const MONEY = new Set(["paymentGateway", "deliveryCharge", "price", "taxable", "discount", "advance", "codShipping", "commission", "gstOnCommission", "adAmount", "officeAmount", "profitAmount", "otherCharges", "gstOther", "cgst", "sgst", "igst", "gross", "unitNrv", "totalNrv", "bsa", "serviceExcl", "serviceGst", "serviceIncl", "costDisplayPrice", "costTaxable", "costTcs", "costNrv", "costServiceCharge", "costScGst", "costNetServiceCharge", "costFactorsTotal", "costMargin", "costCourierCharge", "costShippingActual", "costShippingDiff", "costAdjustedMargin", "costTcsBalance", "costSellerPayout", "advanceAmount", "prepaidPartialDiscount", "shippingCharges", "codHandlingCharges", "totalShippingCharges", "razorpayCharges", "contributionTarget", "contributionAchievable", "contributionAchievableVariance", "contributionAchieved", "contributionAchievedVariance"]);
const PERCENT = new Set(["commissionPct", "adPct", "officePct", "profitPct", "costTakeRatePct", "costMarginPct", "costAdjustedMarginPct", "contributionTargetPct", "contributionAchievablePct", "contributionAchievedPct"]);

const COLUMNS = [
  ["sr", "Sr No"], ["id", "Item ID"], ["orderId", "Order ID"], ["customer", "Customer Name"], ["customerState", "Customer State"],
  ["invoice", "Invoice ID"], ["awb", "AWB No"], ["productId", "Product ID"], ["product", "Product Name"], ["sku", "SKU"],
  ["paymentGateway", "Payment Gateway"], ["manageHref", "Order Manage"], ["customerInvoiceHref", "Customer Invoice"], ["vendorInvoiceHref", "Vendor Invoice"],
  ["vendor", "Vendor Name"], ["vendorState", "Vendor State"], ["vendorGst", "Vendor GST Number"], ["vendorGstState", "Vendor GST State Code"],
  ["courier", "Delivery Service"], ["deliveryCharge", "Delivery Service Charges"], ["qty", "Quantity (QTY)"], ["price", "Product Price (Display Price)"],
  ["taxable", "Taxable Amount (S.P.)"], ["discount", "Discount"], ["advance", "Advance Payment"], ["codShipping", "COD Shipping Charges"],
  ["commissionPct", "Commission %"], ["commission", "Commission Amount"], ["gstOnCommission", "GST on Commission"],
  ["adPct", "Ad Expense %"], ["adAmount", "Ad Expense Amount"], ["officePct", "Office Expense %"], ["officeAmount", "Office Expense Amount"],
  ["profitPct", "Profit %"], ["profitAmount", "Profit Amount"], ["otherCharges", "Other Charges"], ["gstOther", "GST on Other Charges"],
  ["cgst", "CGST"], ["sgst", "SGST"], ["igst", "IGST"], ["gross", "Gross Amount"], ["unitNrv", "Single Qty NRV"], ["totalNrv", "Total NRV"],
  ["bsa", "BSA"], ["serviceExcl", "Service Charge (Excl. GST)"], ["serviceGst", "Service GST (18%)"], ["serviceIncl", "Service Charge (Incl. GST)"],
  ["status", "Status"], ["paymentStatus", "Payment Status"], ["paymentMode", "Payment Mode"], ["createdAt", "Order Created Date"], ["deliveredAt", "Delivery Date"],
  ["customerPaymentType", "Customer Payment Status"], ["advanceAmount", "Payment Mode - Advance"], ["prepaidPartialDiscount", "Prepaid / Partial Discount"],
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
];

const LABEL = Object.fromEntries(COLUMNS);

ModuleRegistry.registerModules([AllCommunityModule]);

const SHORT_LABEL = { customerPaymentType: "Payment", contributionAchieved: "Achieved Contribution", contributionAchievedPct: "Achieved %" };

/** Column groups (grid header groups, mobile card sections): [title, key columns, the rest]. Every column is always shown. */
const GROUPS = [
  ["Order & customer", ["customer", "deliveredAt"], ["id", "invoice", "awb", "customerState", "status", "paymentStatus", "createdAt", "manageHref", "customerInvoiceHref", "vendorInvoiceHref"]],
  ["Product & vendor", ["product", "sku"], ["productId", "vendor", "vendorState", "vendorGst", "vendorGstState"]],
  ["Price & tax", ["qty", "gross"], ["price", "taxable", "discount", "cgst", "sgst", "igst"]],
  ["Customer payment", ["customerPaymentType"], ["paymentMode", "advance", "advanceAmount", "prepaidPartialDiscount", "paymentGateway", "razorpayPaymentId", "razorpayCharges"]],
  ["Shipping", ["totalShippingCharges"], ["courier", "deliveryCharge", "codShipping", "shippingCharges", "codHandlingCharges"]],
  ["Commission & expenses", ["commission"], ["commissionPct", "gstOnCommission", "adPct", "adAmount", "officePct", "officeAmount", "profitPct", "profitAmount", "otherCharges", "gstOther"]],
  ["NRV & payout", ["totalNrv"], ["unitNrv", "bsa", "serviceExcl", "serviceGst", "serviceIncl"]],
  ["Contribution", ["contributionAchieved", "contributionAchievedPct"], ["contributionTarget", "contributionTargetPct", "contributionAchievable", "contributionAchievablePct", "contributionAchievableVariance", "contributionAchievedVariance", "contributionBreakdown"]],
  ["Pricing & tax (product)", ["costMargin", "costMarginPct"], ["costDisplayPrice", "costTaxable", "costTcs", "costNrv", "costServiceCharge", "costScGst", "costNetServiceCharge", "costTakeRatePct", "costFactorsTotal", "costCourier", "costCourierCharge", "costShippingActual", "costShippingDiff", "costAdjustedMargin", "costAdjustedMarginPct", "costTcsBalance", "costSellerPayout", "costFactors"]],
];
const WIDTH = { product: 240, contributionBreakdown: 380, costFactors: 320, customer: 170, vendor: 170, courier: 170 };
const TEXT_TIP = new Set(["product", "contributionBreakdown", "costFactors", "courier", "vendor"]);

const gridTheme = themeQuartz.withParams({
  backgroundColor: "var(--surface)",
  foregroundColor: "var(--ink-soft)",
  headerBackgroundColor: "var(--surface-muted)",
  headerTextColor: "var(--ink-muted)",
  borderColor: "var(--line)",
  accentColor: "var(--brand-600)",
  oddRowBackgroundColor: "var(--surface)",
  fontSize: 12.5,
  headerFontSize: 12,
  rowHeight: 34,
  headerHeight: 34,
  wrapperBorderRadius: 0,
  wrapperBorder: false,
});

function column(key) {
  const numeric = MONEY.has(key) || PERCENT.has(key) || key === "qty" || key === "sr";
  return {
    colId: key,
    field: key,
    headerName: SHORT_LABEL[key] ?? LABEL[key],
    headerTooltip: LABEL[key],
    width: WIDTH[key] ?? (numeric ? 130 : 150),
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
  if (key === "status" || key === "paymentStatus") return <Badge tone={value === "Paid" || value === "Delivered" ? "success" : "warning"}>{value}</Badge>;
  if (MONEY.has(key)) return value == null ? "—" : formatINR(value);
  if (PERCENT.has(key)) return value == null || value === "" ? "—" : `${Number(value).toFixed(2)}%`;
  if (key === "qty" || key === "sr") return formatNumber(value);
  return value || "—";
}

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** The orders_report.php grid (AG Grid): column groups that open to every finance column, CSV export, and the manual-override edit. */
export function OrderReportTable({ report, filters, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [line, setLine] = useState(null);
  const [form, setForm] = useState({});
  const [pending, startTransition] = useTransition();
  const [exporting, setExporting] = useState(false);
  const { rows, total, page, pageCount } = report;

  const href = (next) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, page: String(next) })) if (value) params.set(key, value);
    return `/admin/orders/report?${params.toString()}`;
  };

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
    { ...column("sr"), pinned: "left", width: 80 },
    { ...column("orderId"), pinned: "left", width: 190 },
    ...GROUPS.map(([title, shown, more]) => ({
      groupId: title,
      headerName: title,
      children: [...shown, ...more].map(column),
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
  ], [canEdit, open]);

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

  const exportCsv = async () => {
    setExporting(true);
    const result = await exportOrderReportAction(filters);
    setExporting(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    download(result.data.filename, result.data.csv);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {/* <div className="border-b border-danger-ink/20 bg-danger-bg px-4 py-2.5 text-sm font-medium text-danger-ink"> */}
        
      {/* </div> */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Order Details (Delivered Items Only)</h2>
          <p className="text-xs text-ink-muted">{formatNumber(total)} delivered lines</p>
        </div>
        <Button size="sm" variant="primary" onClick={exportCsv} loading={exporting}>Export CSV</Button>
      </div>
      <div className="hidden h-[70vh] md:block">
        <AgGridReact
          theme={gridTheme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true, suppressMovable: true }}
          getRowId={(params) => `${params.data.id}-${params.data.sku}`}
          tooltipShowDelay={300}
          suppressCellFocus
          overlayNoRowsTemplate="No delivered lines match these filters."
        />
      </div>
      <div className="space-y-3 bg-surface-muted/60 p-3 md:hidden">
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">No delivered lines match these filters.</p>
        ) : rows.map((row) => (
          <article key={`${row.id}-${row.sku}`} className="rounded-lg border border-line bg-surface">
            <header className="flex items-start justify-between gap-3 border-b border-line px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-[11px] text-ink-muted">#{formatNumber(row.sr)}</p>
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
                    <div key={key} className={TEXT_TIP.has(key) ? "text-[12px]" : "flex items-baseline justify-between gap-3 text-[12px]"}>
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
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-[13px] text-ink-muted">
          <span>Page {formatNumber(page)} of {formatNumber(pageCount)}</span>
          <div className="flex gap-1.5">
            {page > 1 && <ButtonLink size="sm" href={href(page - 1)}>Previous</ButtonLink>}
            {page < pageCount && <ButtonLink size="sm" href={href(page + 1)}>Next</ButtonLink>}
          </div>
        </div>
      )}
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
