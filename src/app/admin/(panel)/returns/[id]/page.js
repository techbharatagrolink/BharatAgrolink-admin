import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getReturn, PICKUP_SERVICES } from "@/lib/services/admin/returns";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, PageHeader, Timeline } from "@/components/ui/page";
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
  const data = await getReturn(id);
  if (!data) notFound();
  const { ret, line, order, refund } = data;
  const canEdit = can(user, "returns", "edit");

  return (
    <>
      <PageHeader
        title={`Return ${ret.id}`}
        description={`${ret.reason} · requested ${formatDateTime(ret.createdAt)}`}
        meta={<StatusBadge status={ret.status} />}
        actions={canEdit ? <ReturnActions id={ret.id} actions={data.actions} pickupServices={PICKUP_SERVICES} refundAmount={ret.refundAmount} canRefund={can(user, "refunds", "edit")} /> : null}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Returned item" />
            <CardBody>
              <DescriptionList
                items={[
                  { label: "Product", value: line ? <Link href={`/admin/products/${line.productId}`} className="text-brand-700 hover:underline">{line.product}</Link> : ret.product },
                  { label: "Order", value: <Link href={`/admin/orders/${ret.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{ret.orderId}</Link> },
                  { label: "Vendor", value: <Link href={`/admin/vendors/${ret.vendorId}`} className="text-brand-700 hover:underline">{ret.vendor}</Link> },
                  { label: "Customer", value: <Link href={`/admin/customers/${ret.customerId}`} className="text-brand-700 hover:underline">{ret.customer}</Link> },
                  { label: "Quantity", value: ret.qty },
                  { label: "Seller invoice", value: line?.sellerInvoice ?? "—" },
                  { label: "Delivered", value: formatDate(line?.deliveryDate) },
                  { label: "Return window", value: line?.returnLastDate ? `till ${formatDate(line.returnLastDate)}` : "—" },
                  { label: "Pickup service", value: ret.pickupService ?? "Not booked" },
                  { label: "Customer note", value: ret.notes || "—" },
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
                  { label: "Item price (ex-GST)", value: formatINR(line?.taxable) },
                  { label: "GST", value: formatINR(line?.gst) },
                  { label: "Forward shipping", value: `${formatINR(order?.shippingFee ?? 0)}${ret.refundShipping ? " (refunded)" : ""}` },
                  { label: "Platform fee deducted", value: ret.deductPlatformFee ? "Yes (3%)" : "No" },
                  { label: "Refund amount", value: <span className="font-semibold">{formatINR(ret.refundAmount)}</span> },
                  { label: "Method", value: ret.refundMethod },
                ]}
              />
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
