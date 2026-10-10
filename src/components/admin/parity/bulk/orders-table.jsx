"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, Trash2 } from "lucide-react";
import { deleteBulkOrderAction, exportBulkOrdersAction } from "@/lib/actions/admin/parity/bulk";
import { formatDateTime, inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { BulkPager } from "./bulk-list";

const CSV_COLUMNS = ["order_id", "customer_name", "product_names", "total_quantity", "invoice_value", "payment_status", "order_status", "responsible", "remark", "salesman_name", "created_at", "source_warehouse"];

function toCsv(rows) {
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => cell(r[c])).join(","))].join("\n");
}

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
}

/** orders.php grid: newest first, at most 2000 rows like the PHP page. */
export function BulkOrdersTable({ result, query, canDelete }) {
  const router = useRouter();
  const { notify } = useToast();
  const [exporting, setExporting] = useState(false);
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function exportCsv() {
    setExporting(true);
    const res = await exportBulkOrdersAction(query);
    setExporting(false);
    if (!res.ok) return notify({ message: res.message, tone: "error" });
    download(`bulk_orders_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(res.data.rows));
  }

  async function confirmDelete() {
    setDeleting(true);
    const res = await deleteBulkOrderAction(pending.id);
    setDeleting(false);
    setPending(null);
    notify({ message: res.ok ? res.data.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) router.refresh();
  }

  return (
    <Card>
      <CardHeader
        title="Orders"
        actions={
          <Button size="sm" onClick={exportCsv} loading={exporting}>
            <Download className="size-4" aria-hidden /> Export CSV
          </Button>
        }
      />
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-max text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-xs text-ink-muted">
              {["Order ID", "Customer", "Products", "Qty", "Invoice", "Payment", "Status", "Sales Agent", "Last Remark", "Created", ""].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-ink-muted">
                  No orders match the filters.
                </td>
              </tr>
            )}
            {result.rows.map((o) => (
              <tr key={o.id} className="border-b border-line align-top last:border-0">
                <td className="px-3 py-2 font-mono text-xs">
                  <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(o.orderId)}`} className="text-brand-700 hover:underline">
                    {o.orderId}
                  </Link>
                  <div className="text-ink-muted">{o.provider}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-ink">{o.customerName}</div>
                  <div className="text-xs text-ink-muted">{o.customerContact}</div>
                </td>
                <td className="max-w-64 px-3 py-2 whitespace-normal text-ink-soft">{o.productNames}</td>
                <td className="px-3 py-2 text-right tabular">{o.totalQuantity}</td>
                <td className="px-3 py-2 text-right tabular">{inr(o.invoiceValue)}</td>
                <td className="px-3 py-2">{o.paymentStatus}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={o.orderStatus} />
                </td>
                <td className="px-3 py-2">{o.salesmanName || "—"}</td>
                <td className="max-w-56 px-3 py-2 text-xs whitespace-normal text-ink-soft">
                  {o.lastRemark ? (
                    <>
                      {o.lastRemark.remark}
                      <div className="text-ink-muted">
                        {o.lastRemark.addedBy} · {o.remarkCount} total
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-ink-muted">{formatDateTime(o.createdAt)}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(o.orderId)}`} className={buttonClasses({ size: "icon-sm", variant: "ghost" })} aria-label={`View ${o.orderId}`}>
                      <Eye className="size-4" aria-hidden />
                    </Link>
                    {canDelete && (
                      <Button size="icon-sm" variant="ghost" onClick={() => setPending(o)} aria-label={`Delete ${o.orderId}`}>
                        <Trash2 className="size-4 text-danger-ink" aria-hidden />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BulkPager result={result} query={query} />
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={`Delete order ${pending?.orderId ?? ""}?`}
        description="The order and its items are removed. A linked quotation becomes unconverted again."
        confirmLabel="Delete order"
      />
    </Card>
  );
}
