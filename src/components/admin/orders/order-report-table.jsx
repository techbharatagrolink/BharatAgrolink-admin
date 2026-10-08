"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatINR, formatNumber } from "@/lib/format";
import { exportOrderReportAction, saveOrderReportOverrideAction } from "@/lib/actions/admin/orders-report";

const MONEY = new Set(["paymentGateway", "deliveryCharge", "price", "taxable", "discount", "advance", "codShipping", "commission", "gstOnCommission", "adAmount", "officeAmount", "profitAmount", "otherCharges", "gstOther", "cgst", "sgst", "igst", "gross", "unitNrv", "totalNrv", "bsa", "serviceExcl", "serviceGst", "serviceIncl"]);
const PERCENT = new Set(["commissionPct", "adPct", "officePct", "profitPct"]);

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
];

function cell(row, key) {
  const value = row[key];
  if (key === "manageHref" || key === "customerInvoiceHref" || key === "vendorInvoiceHref") {
    if (!value) return "—";
    const label = key === "manageHref" ? "Open" : "Invoice";
    return <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline">{label}</a>;
  }
  if (key === "orderId") return <a href={row.manageHref || `/admin/orders/${row.orderId}`} className="font-medium text-brand-700 hover:underline">{value}</a>;
  if (key === "product") return <span className="block max-w-64 truncate" title={value}>{value || "—"}</span>;
  if (key === "createdAt" || key === "deliveredAt") return formatDate(value);
  if (key === "status" || key === "paymentStatus") return <Badge tone={value === "Paid" || value === "Delivered" ? "success" : "warning"}>{value}</Badge>;
  if (MONEY.has(key)) return value == null ? "—" : formatINR(value);
  if (PERCENT.has(key)) return `${Number(value || 0).toFixed(2)}%`;
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

/** The orders_report.php grid: every finance column, CSV export, and the manual-override edit. */
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

  const open = (row) => {
    setLine(row);
    setForm({
      commissionPct: row.commissionPct ?? "",
      adPct: row.adPct ?? "",
      officePct: row.officePct ?? "",
      profitPct: row.profitPct ?? "",
      totalNrv: row.totalNrv ?? "",
      gross: row.gross ?? "",
    });
  };

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
      <div className="border-b border-danger-ink/20 bg-danger-bg px-4 py-2.5 text-sm font-medium text-danger-ink">
        Please note that the Order Report data should be considered accurate only for orders created from 12/05/2026 onwards.
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Order Details (Delivered Items Only)</h2>
          <p className="text-xs text-ink-muted">{formatNumber(total)} delivered lines</p>
        </div>
        <Button size="sm" variant="primary" onClick={exportCsv} loading={exporting}>Export CSV</Button>
      </div>
      <div className="max-h-[70vh] overflow-auto scrollbar-thin">
        <table className="w-max min-w-full border-separate border-spacing-0 text-left text-[12.5px]">
          <thead>
            <tr>
              {COLUMNS.map(([key, label]) => (
                <th key={key} className={`sticky top-0 z-10 whitespace-nowrap border-b border-line bg-surface-muted px-3 py-2 text-xs font-semibold text-ink-muted ${MONEY.has(key) || PERCENT.has(key) ? "text-right" : ""}`}>{label}</th>
              ))}
              {canEdit && <th className="sticky top-0 z-10 whitespace-nowrap border-b border-line bg-surface-muted px-3 py-2 text-xs font-semibold text-ink-muted">Edit</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-sm text-ink-muted">No delivered lines match these filters.</td></tr>
            ) : rows.map((row) => (
              <tr key={`${row.id}-${row.sku}`} className="hover:bg-surface-muted">
                {COLUMNS.map(([key]) => (
                  <td key={key} className={`whitespace-nowrap border-b border-line px-3 py-1.5 text-ink-soft ${MONEY.has(key) || PERCENT.has(key) ? "text-right tabular" : ""}`}>{cell(row, key)}</td>
                ))}
                {canEdit && (
                  <td className="whitespace-nowrap border-b border-line px-3 py-1.5">
                    {row.b2b ? <span className="text-xs text-ink-muted">—</span> : <Button size="xs" onClick={() => open(row)}>Edit</Button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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
