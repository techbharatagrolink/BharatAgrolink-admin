import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getReturn, PICKUP_SERVICES } from "@/lib/services/admin/returns";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { ReturnActions } from "@/components/admin/workflows/return-actions";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Return ${id}` };
}

export default async function ReturnDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/returns/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("returns");
  if (!allowed) return (<><PageHeader title="Return details" /><PermissionDenied module="returns" /></>);
  const data = await getReturn(id, user);
  if (!data) notFound();
  const { ret, line, order, refund } = data;
  const p = data.process ?? {};
  const canEdit = can(user, "returns", "edit");
  const openShipment = (await searchParams)?.shipment === "1";

  return (
    <>
      <PageHeader
        title={`Return ${p.returnId || ret.id}`}
        description={`${ret.reason} · requested ${formatDateTime(ret.createdAt)}`}
        meta={<StatusBadge status={ret.status} />}
        actions={
          canEdit ? (
            <ReturnActions
              id={ret.id}
              actions={data.actions}
              pickupServices={PICKUP_SERVICES}
              refundAmount={ret.refundAmount}
              canRefund={can(user, "refunds", "edit")}
              details={{ ...p, refundShipping: ret.refundShipping, deductPlatformFee: ret.deductPlatformFee }}
              openShipment={openShipment}
            />
          ) : null
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Returned item" />
            <CardBody>
              <DescriptionList
                items={[
                  { label: "Product", value: line ? <Link href={`/admin/products/${line.productId}`} className="text-brand-700 hover:underline">{line.product}</Link> : ret.product },
                  { label: "SKU", value: p.productSku || "—" },
                  { label: "Order", value: <Link href={`/admin/orders/${ret.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{ret.orderId}</Link> },
                  { label: "Order date", value: formatDateTime(p.orderDate) },
                  { label: "Vendor", value: <Link href={`/admin/vendors/${ret.vendorId}`} className="text-brand-700 hover:underline">{ret.vendor}</Link> },
                  { label: "Customer", value: <Link href={`/admin/customers/${ret.customerId}`} className="text-brand-700 hover:underline">{ret.customer}</Link> },
                  { label: "Mobile", value: p.customerMobile || "—" },
                  { label: "Address", value: p.customerAddress || "—" },
                  { label: "Quantity", value: ret.qty },
                  { label: "Seller invoice", value: line?.sellerInvoice ?? "—" },
                  { label: "Delivered", value: formatDate(line?.deliveryDate) },
                  { label: "Return window", value: line?.returnLastDate ? `till ${formatDate(line.returnLastDate)}` : "—" },
                  { label: "Pickup service", value: ret.pickupService || "Not booked" },
                  { label: "Pickup address", value: p.pickupAddress || "—" },
                  { label: "Expected pickup", value: p.expectedPickupDate ? formatDate(p.expectedPickupDate) : "—" },
                  {
                    label: "Courier tracking ID",
                    value: p.courierTrackingId ? (
                      p.courierTrackingUrl ? <a href={p.courierTrackingUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-brand-700 hover:underline">{p.courierTrackingId}</a> : <span className="font-mono text-xs">{p.courierTrackingId}</span>
                    ) : "—",
                  },
                  { label: "Customer note", value: ret.notes || "—" },
                  { label: "Internal notes", value: p.internalNotes ? <span className="whitespace-pre-line">{p.internalNotes.trim()}</span> : "—" },
                  {
                    label: "Attachments",
                    value: p.attachments?.length ? (
                      <span className="flex flex-wrap gap-x-3 gap-y-1">
                        {p.attachments.map((url, i) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Photo {i + 1}</a>
                        ))}
                      </span>
                    ) : "No attachments",
                  },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Refund" description="Item price + GST (+ forward shipping if refunded) − 3% platform fee if deducted. Calculated on the server." />
            <CardBody>
              <DescriptionList
                columns={3}
                items={[
                  { label: "Item price", value: formatINR(line?.price) },
                  { label: "GST", value: formatINR(line?.gst) },
                  { label: "Forward shipping", value: `${formatINR(order?.shippingFee ?? 0)}${ret.refundShipping ? " (refunded)" : ""}` },
                  { label: "Platform fee deducted", value: ret.deductPlatformFee ? "Yes (3%)" : "No" },
                  { label: "Refund amount", value: <span className="font-semibold">{formatINR(ret.refundAmount)}</span> },
                  { label: "Method", value: ret.refundMethod },
                  { label: "Payment method", value: p.paymentMethod || "—" },
                  { label: "Payment ID", value: p.paymentId || "N/A" },
                  { label: "Order amount", value: formatINR(p.originalAmount ?? 0) },
                  p.refundRoute?.label && { label: "Refund route", value: p.refundRoute.label },
                ]}
              />
              {p.bank ? (
                <DescriptionList
                  className="mt-4 border-t border-line pt-4"
                  columns={3}
                  items={[
                    { label: "Account holder", value: p.bank.holder },
                    { label: "Account number", value: <span className="font-mono text-xs">{p.bank.account}</span> },
                    { label: "IFSC code", value: <span className="font-mono text-xs">{p.bank.ifsc || "—"}</span> },
                    { label: "Bank", value: p.bank.bankName || "—" },
                    { label: "Bank address", value: p.bank.address || "—" },
                  ]}
                />
              ) : (
                <Notice tone="warning" className="mt-4">Bank details not available for this user. Please ensure bank details are added before processing refund.</Notice>
              )}
              {refund && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-surface-muted px-3 py-2.5 text-sm">
                  <span className="font-mono text-xs">{refund.id}</span>
                  <StatusBadge status={refund.status} />
                  <span className="tabular">{formatINR(refund.amount)}</span>
                  <Link href="/admin/refunds" className="ml-auto text-[13px] font-medium text-brand-700 hover:underline">Refunds</Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader title="Activity" />
          <CardBody>
            <Timeline
              items={[
                ...data.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) })),
                { id: "created", title: "Return requested", description: ret.reason, meta: formatDateTime(ret.createdAt) },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
