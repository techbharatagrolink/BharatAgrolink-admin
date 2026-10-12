"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Eye, FileText, MessageSquare, Trash2 } from "lucide-react";
import { addBulkOrderRemarkAction, bulkOrderLabelAction, deleteBulkOrderAction, exportBulkOrdersAction } from "@/lib/actions/admin/parity/bulk";
import { formatDateTime, formatNumber, inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Select, Textarea } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { BulkPager } from "./bulk-list";

const CSV_COLUMNS = ["order_id", "customer_name", "product_names", "total_quantity", "invoice_value", "payment_status", "order_status", "responsible", "remark", "salesman_name", "created_at", "source_warehouse"];
const RESPONSIBLE = [
  { value: "", label: "Not set" },
  { value: "customer", label: "User / Customer" },
  { value: "vendor", label: "Vendor / Seller" },
  { value: "admin", label: "Operation / Admin" },
  { value: "courier", label: "Courier / Delivery Partner" },
];

function plain(value) {
  if (value == null || value === "") return "";
  if (typeof value === "object") return "";
  return String(value);
}

/** orders.php status column: live courier status once it exists, otherwise the order stage. */
function displayStatus(order) {
  const courier = plain(order.shipmentStatus);
  if (courier && courier !== "N/A") return courier;
  const stage = plain(order.orderStatus) || "created";
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

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

const HEADERS = ["#", "Bulk Order ID", "Customer Name", "Product Name", "Quantity", "Total Amount", "Payment Status", "Order Status", "Sales Agent", "Created Date", "Assigned Vendor", "Remarks", ""];

/** orders.php grid: newest first, same columns and row actions as the PHP list. */
export function BulkOrdersTable({ result, query, canEdit, canDelete }) {
  "use no memo";
  const router = useRouter();
  const { notify } = useToast();
  const [exporting, setExporting] = useState(false);
  const [pending, setPending] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [remarkFor, setRemarkFor] = useState(null);
  const [remark, setRemark] = useState("");
  const [responsible, setResponsible] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [labelFor, setLabelFor] = useState("");
  const rows = Array.isArray(result?.rows) ? result.rows.filter((row) => row && (row.id != null || row.orderId)) : [];
  const page = Number(result?.page) > 0 ? Number(result.page) : 1;
  const pageSize = Number(result?.pageSize) > 0 ? Number(result.pageSize) : rows.length || 1;
  const deleteId = pending == null ? "" : plain(pending.id);

  async function exportCsv() {
    setExporting(true);
    const res = await exportBulkOrdersAction(query);
    setExporting(false);
    if (!res.ok) return notify({ message: res.message, tone: "error" });
    download(`bulk_orders_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(res.data.rows));
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteBulkOrderAction(deleteId);
    setDeleting(false);
    setPending(null);
    notify({ message: res.ok ? res.data.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) router.refresh();
  }

  async function openLabel(order) {
    const orderId = plain(order.orderId);
    setLabelFor(orderId);
    const res = await bulkOrderLabelAction(orderId);
    setLabelFor("");
    if (!res.ok) return notify({ message: res.message, tone: "error" });
    if (res.data?.labelUrl) window.open(res.data.labelUrl, "_blank", "noopener,noreferrer");
    else notify({ message: "No label is available for this order.", tone: "error" });
  }

  function openRemark(order) {
    setRemarkFor(order);
    setRemark("");
    setResponsible(plain(order.responsible));
  }

  async function saveRemark() {
    const orderId = plain(remarkFor?.orderId);
    if (!orderId || !remark.trim()) return;
    setSavingRemark(true);
    const res = await addBulkOrderRemarkAction(orderId, { remark: remark.trim(), responsible });
    setSavingRemark(false);
    notify({ message: res.ok ? res.data.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) {
      setRemarkFor(null);
      setRemark("");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader
        title={`Bulk Order Listing (${formatNumber(result?.total ?? rows.length)})`}
        actions={
          <Button size="sm" onClick={exportCsv} loading={exporting}>
            <Download className="size-4" aria-hidden /> Export CSV
          </Button>
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="No bulk orders" description="No orders match these filters. Clear the filters to see every bulk order." />
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-max text-left text-[13px]">
            <thead>
              <tr className="border-b border-line text-xs text-ink-muted">
                {HEADERS.map((h) => (
                  <th key={h || "actions"} scope="col" className="px-3 py-2 font-semibold">
                    {h || "Actions"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((order, index) => {
                const orderId = plain(order.orderId) || "—";
                const href = order.orderId ? `/admin/bulk-orders/orders/${encodeURIComponent(plain(order.orderId))}` : "/admin/bulk-orders/orders";
                const vendorBits = [plain(order.provider) && plain(order.provider) !== "N/A" ? plain(order.provider) : "", plain(order.waybillNo) ? `AWB: ${plain(order.waybillNo)}` : ""].filter(Boolean);
                const last = order.lastRemark;
                const remarkText = plain(last?.remark);
                return (
                  <tr key={plain(order.id) || orderId} className="border-b border-line align-top last:border-0">
                    <td className="px-3 py-2 text-ink-muted tabular">{(page - 1) * pageSize + index + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      <Link href={href} className="font-semibold text-brand-700 hover:underline">
                        {orderId}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-ink">{plain(order.customerName) || "N/A"}</div>
                      {plain(order.customerContact) && <div className="text-xs text-ink-muted">{plain(order.customerContact)}</div>}
                    </td>
                    <td className="max-w-64 px-3 py-2 whitespace-normal text-ink-soft" title={plain(order.productNames)}>
                      {plain(order.productNames) || "N/A"}
                    </td>
                    <td className="px-3 py-2 tabular">
                      <div className="font-medium text-ink">{formatNumber(order.totalQuantity)}</div>
                      <div className="text-xs text-ink-muted">{formatNumber(order.noOfPackages)} pkg(s)</div>
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular">{inr(order.invoiceValue)}</td>
                    <td className="px-3 py-2">{plain(order.paymentStatus) || "Unpaid"}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={displayStatus(order)} />
                    </td>
                    <td className="px-3 py-2">{plain(order.salesmanName) || "Unassigned"}</td>
                    <td className="px-3 py-2 text-xs text-ink-muted">{formatDateTime(order.createdAt)}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-ink">{plain(order.sourceWarehouse) || "N/A"}</div>
                      {vendorBits.length > 0 && <div className="text-xs text-ink-muted capitalize">{vendorBits.join(" | ")}</div>}
                    </td>
                    <td className="max-w-56 px-3 py-2 text-xs whitespace-normal text-ink-soft">
                      {remarkText ? (
                        <>
                          {remarkText}
                          <div className="text-ink-muted">
                            {plain(last.addedBy) || "Unknown"}
                            {Number(order.remarkCount) > 1 ? ` · ${formatNumber(order.remarkCount)} total` : ""}
                          </div>
                        </>
                      ) : (
                        "No remarks"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Link href={href} className={buttonClasses({ size: "icon-sm", variant: "ghost" })} aria-label={`View ${orderId}`} title="View details">
                          <Eye className="size-4" aria-hidden />
                        </Link>
                        {canEdit && (
                          <Button size="icon-sm" variant="ghost" onClick={() => openRemark(order)} aria-label={`Remark ${orderId}`} title="Add remark">
                            <MessageSquare className="size-4" aria-hidden />
                          </Button>
                        )}
                        <Button size="icon-sm" variant="ghost" onClick={() => openLabel(order)} loading={labelFor === orderId} aria-label={`Label ${orderId}`} title="Download label">
                          <FileText className="size-4" aria-hidden />
                        </Button>
                        {canDelete && (
                          <Button size="icon-sm" variant="ghost" onClick={() => setPending(order)} aria-label={`Delete ${orderId}`} title="Delete">
                            <Trash2 className="size-4 text-danger-ink" aria-hidden />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <BulkPager result={result} query={query} />
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setPending(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title={`Delete order ${plain(pending?.orderId)}?`}
        description="The order and its items are removed. A linked quotation becomes unconverted again."
        confirmLabel="Delete order"
      />
      <Dialog
        open={Boolean(remarkFor)}
        onClose={() => setRemarkFor(null)}
        title="Add remark"
        description={plain(remarkFor?.orderId)}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemarkFor(null)} disabled={savingRemark}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveRemark} loading={savingRemark} disabled={!remark.trim()}>
              Save remark
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-medium text-ink-muted">
            Responsible party
            <Select className="mt-1 w-full" aria-label="Responsible party" value={responsible} onChange={(e) => setResponsible(e.target.value)} options={RESPONSIBLE} />
          </label>
          <label className="block text-xs font-medium text-ink-muted">
            Remark
            <Textarea className="mt-1" aria-label="Remark" value={remark} maxLength={500} rows={4} placeholder="Enter a remark" onChange={(e) => setRemark(e.target.value)} />
          </label>
        </div>
      </Dialog>
    </Card>
  );
}
