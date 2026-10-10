import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ApiError } from "@/lib/api";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBulkOrder, getBulkOrderOptions } from "@/lib/services/admin/parity/bulk";
import { formatDateTime, formatNumber, inr } from "@/lib/format";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DescriptionList, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BulkOrderActions } from "@/components/admin/parity/bulk/order-actions";

export async function generateMetadata({ params }) {
  const { orderId } = await params;
  return { title: `Bulk Order ${decodeURIComponent(orderId)}` };
}

const address = (a) => [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ") || "—";

export default async function BulkOrderPage({ params }) {
  const { orderId } = await params;
  const key = decodeURIComponent(orderId);
  const { user, allowed } = await checkPermission("bulk.orders");
  if (!allowed) return (<><PageHeader title="Bulk order" /><PermissionDenied module="bulk orders" /></>);
  const result = await Promise.all([getBulkOrder(key, user), getBulkOrderOptions(user)]).then(([order, options]) => ({ order, options }), (error) => ({ error }));
  if (result.error instanceof ApiError && result.error.status === 404) notFound();
  if (result.error) return (<><PageHeader title={`Order ${key}`} /><ApiUnavailable error={result.error} what="this bulk order" /></>);
  const { order: o, options } = result;
  const back = (
    <Link href="/admin/bulk-orders/orders" className={buttonClasses({ size: "sm" })}>
      <ArrowLeft className="size-4" aria-hidden /> All orders
    </Link>
  );

  return (
    <>
      <PageHeader
        title={`Order ${o.orderId}`}
        description={`Placed ${formatDateTime(o.orderDate)}${o.provider ? ` · ${o.provider}` : ""}`}
        meta={
          <>
            <StatusBadge status={o.displayStatus || o.status} />
            <Badge tone={o.totals.paymentStatus === "Paid" ? "success" : o.totals.paymentStatus === "Partial" ? "warning" : "neutral"}>{o.totals.paymentStatus}</Badge>
          </>
        }
        actions={back}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Customer & addresses" />
            <CardBody>
              <DescriptionList
                items={[
                  { label: "Customer", value: o.customer.name || "—" },
                  { label: "Phone", value: [o.customer.phone, o.customer.alternate].filter(Boolean).join(" / ") || "—" },
                  { label: "Email", value: o.customer.email || "—" },
                  { label: "Sales agent", value: o.salesmanName || "—" },
                  { label: "Ship to", value: `${o.shipTo.name ? `${o.shipTo.name}, ` : ""}${address(o.shipTo)}` },
                  { label: "Ship from", value: `${o.shipFrom.name ? `${o.shipFrom.name}, ` : ""}${address(o.shipFrom)}` },
                  { label: "Invoice no.", value: o.invoiceNumber || "—" },
                  { label: "PO no.", value: o.poNo || "—" },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Items" description={`${o.items.length} line${o.items.length === 1 ? "" : "s"}`} />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-max text-left text-[13px]">
                <thead>
                  <tr className="border-b border-line text-xs text-ink-muted">
                    {["Item", "HSN", "Qty", "Rate", "Taxable", "GST %", "Total"].map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((it) => (
                    <tr key={it.id} className="border-b border-line last:border-0">
                      <td className="px-3 py-2">
                        <div className="font-medium text-ink">{it.name}</div>
                        {it.description && <div className="text-xs text-ink-muted">{it.description}</div>}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{it.hsn || "—"}</td>
                      <td className="px-3 py-2 tabular">
                        {formatNumber(it.quantity)} {it.unit}
                      </td>
                      <td className="px-3 py-2 tabular">{inr(it.rate)}</td>
                      <td className="px-3 py-2 tabular">{inr(it.taxable)}</td>
                      <td className="px-3 py-2 tabular">{it.gstPercentage}%</td>
                      <td className="px-3 py-2 tabular">{inr(it.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CardBody className="border-t border-line">
              <DescriptionList
                columns={3}
                items={[
                  { label: "Subtotal", value: inr(o.totals.subtotal) },
                  { label: "GST", value: inr(o.totals.gst) },
                  { label: "Grand total", value: inr(o.totals.grandTotal) },
                  { label: "Advance paid", value: inr(o.totals.advance) },
                  { label: "Balance", value: inr(o.totals.balance) },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Shipping" />
            <CardBody>
              <DescriptionList
                columns={3}
                items={[
                  { label: "Waybill", value: o.shipping.waybillNo || "—" },
                  { label: "Shipment ID", value: o.shipping.shipmentId || "—" },
                  { label: "Mode", value: o.shipping.modeName || "—" },
                  { label: "Packages", value: formatNumber(o.shipping.packages) },
                  { label: "Weight (kg)", value: formatNumber(o.shipping.weight) },
                  { label: "COD", value: o.shipping.isCod ? inr(o.shipping.codAmount) : "No" },
                  { label: "E-way bill", value: o.shipping.ewayBillNo || "—" },
                  { label: "Shipment status", value: o.shipmentStatus || "—" },
                  { label: "Responsible", value: o.responsible || "—" },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Remarks" description={`${o.remarks.length} total`} />
            <CardBody>
              {o.remarks.length === 0 ? (
                <p className="text-sm text-ink-muted">No remarks yet.</p>
              ) : (
                <ol className="space-y-3">
                  {o.remarks.map((r, i) => (
                    <li key={r.id ?? i} className="border-l-2 border-line pl-3 text-sm">
                      <p className="break-words text-ink">{r.remark}</p>
                      <p className="text-xs text-ink-muted">
                        {r.added_by || "Unknown"}
                        {r.added_at ? ` · ${r.added_at}` : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>

          {o.documents.length > 0 && (
            <Card>
              <CardHeader title="Documents" />
              <CardBody>
                <ul className="space-y-1 text-sm">
                  {o.documents.map((d) => (
                    <li key={d.url}>
                      <a href={d.url} target="_blank" rel="noreferrer" className="break-all text-brand-700 hover:underline">
                        {d.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>
        <BulkOrderActions order={o} options={options} canEdit={can(user, "bulk.orders", "edit")} />
      </div>
    </>
  );
}
