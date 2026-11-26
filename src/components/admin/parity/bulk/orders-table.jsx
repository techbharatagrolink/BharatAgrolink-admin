"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, Eye, FileSpreadsheet, FileText, MessageSquare, Trash2 } from "lucide-react";
import { addBulkOrderRemarkAction, bulkOrderLabelAction, deleteBulkOrderAction, exportBulkOrdersAction } from "@/lib/actions/admin/parity/bulk";
import { formatDateTime, formatNumber, inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Select, Textarea } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/states";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { GridTable } from "@/components/data-table/grid-table";
import { useCanExport } from "@/components/admin/shell/admin-user";
import { csvText, downloadCsv, downloadXlsx, exportFileName } from "@/lib/csv";
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
  return csvText(CSV_COLUMNS, rows.map((r) => CSV_COLUMNS.map((c) => r[c])));
}

const orderHref = (order) => (order.orderId ? `/admin/bulk-orders/orders/${encodeURIComponent(plain(order.orderId))}` : "/admin/bulk-orders/orders");

const HEADERS = ["#", "Bulk Order ID", "Customer Name", "Product Name", "Quantity", "Total Amount", "Payment Status", "Order Status", "Sales Agent", "Created Date", "Assigned Vendor", "Remarks", ""];

/** orders.php grid: newest first, same columns and row actions as the PHP list. */
export function BulkOrdersTable({ result, query, canEdit, canDelete }) {
  "use no memo";
  const router = useRouter();
  const { notify } = useToast();
  const canExport = useCanExport();
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

  async function runExport(format = "csv") {
    setExporting(true);
    const res = await exportBulkOrdersAction(query);
    setExporting(false);
    if (!res.ok) return notify({ message: res.message, tone: "error" });
    const dataRows = (res.data.rows ?? []).map((r) => CSV_COLUMNS.map((c) => plain(r[c])));
    if (format === "xlsx") {
      await downloadXlsx(exportFileName("bulk_orders", "xlsx"), CSV_COLUMNS, dataRows);
    } else {
      downloadCsv(exportFileName("bulk_orders", "csv"), toCsv(res.data.rows));
    }
    notify({ message: `Exported ${formatNumber(dataRows.length)} rows (${format.toUpperCase()}).`, tone: "success" });
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
          canExport ? (
            <Popover
              panelClassName="w-40"
              trigger={({ toggle, props }) => (
                <Button size="sm" onClick={toggle} loading={exporting} {...props}>
                  {!exporting && <Download className="size-4" aria-hidden />} Export <ChevronDown className="size-3.5 opacity-70" aria-hidden />
                </Button>
              )}
            >
              <ul className="py-1">
                <li>
                  <button
                    type="button"
                    data-close
                    onClick={() => runExport("csv")}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                  >
                    <FileText className="size-4 text-ink-muted" /> CSV (.csv)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    data-close
                    onClick={() => runExport("xlsx")}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
                  >
                    <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
                  </button>
                </li>
              </ul>
            </Popover>
          ) : null
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="No bulk orders" description="No orders match these filters. Clear the filters to see every bulk order." />
      ) : (
        <div className="hidden md:block">
          <GridTable
            rows={rows}
            rowKey={(order) => plain(order.id) || plain(order.orderId)}
            columns={[
              { key: "n", label: HEADERS[0], width: 56, render: (_, index) => <span className="text-ink-muted tabular">{(page - 1) * pageSize + index + 1}</span> },
              {
                key: "orderId",
                label: HEADERS[1],
                render: (order) => (
                  <Link href={orderHref(order)} className="font-mono text-xs font-semibold text-brand-700 hover:underline">
                    {plain(order.orderId) || "—"}
                  </Link>
                ),
              },
              {
                key: "customer",
                label: HEADERS[2],
                render: (order) => (
                  <>
                    <div className="font-medium text-ink">{plain(order.customerName) || "N/A"}</div>
                    {plain(order.customerContact) && <div className="text-xs text-ink-muted">{plain(order.customerContact)}</div>}
                  </>
                ),
              },
              { key: "products", label: HEADERS[3], render: (order) => <span title={plain(order.productNames)}>{plain(order.productNames) || "N/A"}</span> },
              {
                key: "qty",
                label: HEADERS[4],
                render: (order) => (
                  <span className="tabular">
                    <span className="block font-medium text-ink">{formatNumber(order.totalQuantity)}</span>
                    <span className="block text-xs text-ink-muted">{formatNumber(order.noOfPackages)} pkg(s)</span>
                  </span>
                ),
              },
              { key: "amount", label: HEADERS[5], align: "right", render: (order) => <span className="font-medium">{inr(order.invoiceValue)}</span> },
              { key: "payment", label: HEADERS[6], render: (order) => plain(order.paymentStatus) || "Unpaid" },
              { key: "status", label: HEADERS[7], render: (order) => <StatusBadge status={displayStatus(order)} /> },
              { key: "agent", label: HEADERS[8], render: (order) => plain(order.salesmanName) || "Unassigned" },
              { key: "created", label: HEADERS[9], render: (order) => <span className="text-xs text-ink-muted">{formatDateTime(order.createdAt)}</span> },
              {
                key: "vendor",
                label: HEADERS[10],
                render: (order) => {
                  const vendorBits = [plain(order.provider) && plain(order.provider) !== "N/A" ? plain(order.provider) : "", plain(order.waybillNo) ? `AWB: ${plain(order.waybillNo)}` : ""].filter(Boolean);
                  return (
                    <>
                      <div className="font-medium text-ink">{plain(order.sourceWarehouse) || "N/A"}</div>
                      {vendorBits.length > 0 && <div className="text-xs text-ink-muted capitalize">{vendorBits.join(" | ")}</div>}
                    </>
                  );
                },
              },
              {
                key: "remarks",
                label: HEADERS[11],
                render: (order) => {
                  const last = order.lastRemark;
                  const remarkText = plain(last?.remark);
                  return (
                    <span className="text-xs text-ink-soft">
                      {remarkText ? (
                        <>
                          {remarkText}
                          <span className="block text-ink-muted">
                            {plain(last.addedBy) || "Unknown"}
                            {Number(order.remarkCount) > 1 ? ` · ${formatNumber(order.remarkCount)} total` : ""}
                          </span>
                        </>
                      ) : (
                        "No remarks"
                      )}
                    </span>
                  );
                },
              },
              {
                key: "actions",
                label: "Actions",
                width: 168,
                render: (order) => {
                  const orderId = plain(order.orderId) || "—";
                  return (
                    <div className="flex gap-1">
                      <Link href={orderHref(order)} className={buttonClasses({ size: "icon-sm", variant: "ghost" })} aria-label={`View ${orderId}`} title="View details">
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
                  );
                },
              },
            ]}
          />
        </div>
      )}
      {rows.length > 0 && (
        <div className="space-y-3 p-3 md:hidden">
          {rows.map((order, index) => {
            const orderId = plain(order.orderId) || "—";
            const href = order.orderId ? `/admin/bulk-orders/orders/${encodeURIComponent(plain(order.orderId))}` : "/admin/bulk-orders/orders";
            const vendorBits = [plain(order.provider) && plain(order.provider) !== "N/A" ? plain(order.provider) : "", plain(order.waybillNo) ? `AWB: ${plain(order.waybillNo)}` : ""].filter(Boolean);
            const last = order.lastRemark;
            const remarkText = plain(last?.remark);
            return (
              <div key={plain(order.id) || orderId} className="space-y-2.5 rounded-lg border border-line p-3 text-small">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={href} className="font-mono text-xs font-semibold text-brand-700 hover:underline">#{(page - 1) * pageSize + index + 1} · {orderId}</Link>
                    <p className="mt-0.5 font-medium text-ink">{plain(order.customerName) || "N/A"}</p>
                    {plain(order.customerContact) && <p className="text-xs text-ink-muted">{plain(order.customerContact)}</p>}
                  </div>
                  <StatusBadge status={displayStatus(order)} />
                </div>
                <p className="text-ink-soft" title={plain(order.productNames)}>{plain(order.productNames) || "N/A"}</p>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Qty</dt>
                    <dd className="text-ink tabular">{formatNumber(order.totalQuantity)} ({formatNumber(order.noOfPackages)} pkg)</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Amount</dt>
                    <dd className="font-medium text-ink tabular">{inr(order.invoiceValue)}</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Payment</dt>
                    <dd className="text-ink">{plain(order.paymentStatus) || "Unpaid"}</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Sales agent</dt>
                    <dd className="text-ink">{plain(order.salesmanName) || "Unassigned"}</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Created</dt>
                    <dd className="text-ink">{formatDateTime(order.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-medium tracking-wide text-ink-muted uppercase">Warehouse</dt>
                    <dd className="text-ink">{plain(order.sourceWarehouse) || "N/A"}{vendorBits.length > 0 && <span className="block text-xs text-ink-muted capitalize">{vendorBits.join(" | ")}</span>}</dd>
                  </div>
                </dl>
                <p className="border-t border-line pt-2 text-xs text-ink-soft">
                  {remarkText ? (
                    <>
                      {remarkText}
                      <span className="block text-ink-muted">{plain(last.addedBy) || "Unknown"}{Number(order.remarkCount) > 1 ? ` · ${formatNumber(order.remarkCount)} total` : ""}</span>
                    </>
                  ) : (
                    "No remarks"
                  )}
                </p>
                <div className="flex gap-1 border-t border-line pt-2">
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
              </div>
            );
          })}
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
