import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getOrder } from "@/lib/services/admin/orders";
import { formatDate, formatDateTime, formatINR, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PermissionDenied } from "@/components/ui/states";
import { LineStatusControl } from "@/components/admin/orders/line-status-control";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";
import { canShip, orderShipments } from "@/lib/services/admin/shipping";
import { OrderShipmentsPanel } from "@/components/admin/shipping/order-shipments-panel";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Order ${decodeURIComponent(id)}` };
}

export default async function OrderDetailPage({ params, searchParams }) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const fallback = await resourceFallback(`/admin/orders/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("orders");
  if (!allowed) return (<><PageHeader title="Order details" /><PermissionDenied module="orders" /></>);
  const data = await getOrder(id, user);
  if (!data) notFound();
  const shipments = canShip(user) && user?.token ? await orderShipments(id, user) : null;
  const { order, customer, groups, totals } = data;
  const showFinance = can(user, "finance") || can(user, "payouts");

  return (
    <>
      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed ${formatDateTime(order.createdAt)} via ${order.channel}`}
        meta={
          <>
            <StatusBadge status={order.status} />
            <Badge tone="neutral">{order.paymentMode}</Badge>
            {order.vendors > 1 && <Badge tone="info">{order.vendors} vendors</Badge>}
            {order.couponCode && <Badge tone="brand">Coupon {order.couponCode}</Badge>}
          </>
        }
        actions={<ButtonLink href="/admin/orders" variant="secondary" size="sm">Back to orders</ButtonLink>}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {groups.map((g) => (
            <Card key={g.vendorId}>
              <CardHeader
                title={g.vendor}
                description={g.sellerInvoice ? `Seller invoice ${g.sellerInvoice}` : "Seller invoice is generated when the vendor accepts"}
                actions={<Link href={`/admin/vendors/${g.vendorId}`} className="text-[13px] font-medium text-brand-700 hover:underline">Vendor profile</Link>}
              />
              <ul className="divide-y divide-line">
                {g.lines.map((l) => (
                  <li key={l.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Link href={`/admin/products/${l.productId}`} className="text-sm font-medium text-ink hover:text-brand-700 hover:underline">{l.productName}</Link>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        SKU {l.sku} · Qty {l.qty} · GST {l.gstPercent}%{l.courier ? ` · ${l.courier}` : ""}
                        {l.awb && (
                          <>
                            {" · AWB "}
                            {l.trackingUrl ? (
                              <a href={l.trackingUrl} target="_blank" rel="noreferrer" className="font-mono text-brand-700 hover:underline">{l.awb}</a>
                            ) : (
                              <span className="font-mono">{l.awb}</span>
                            )}
                          </>
                        )}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <StatusBadge status={l.status} />
                        {l.returnLastDate && <span className="text-xs text-ink-muted">Return window till {formatDate(l.returnLastDate)}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                      <span className="text-sm font-semibold text-ink tabular">{formatINR(l.price)}</span>
                      <LineStatusControl orderId={order.id} lineId={l.id} transitions={l.transitions} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          <Card>
            <CardHeader title="Payment summary" description="GST is inclusive in the selling price" />
            <CardBody>
              <dl className="space-y-1.5 text-sm">
                {[
                  ["Items subtotal", order.subtotal],
                  ["Shipping", order.shippingFee],
                  ["COD handling", order.handling],
                  ["Discount", -order.discount],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="text-ink tabular">{formatINR(v)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
                  <dt>Order total</dt>
                  <dd className="tabular">{formatINR(order.total)}</dd>
                </div>
                {order.advance > 0 && (
                  <div className="flex justify-between gap-4 text-ink-soft">
                    <dt>Advance paid online (partial COD)</dt>
                    <dd className="tabular">{formatINR(order.advance)}</dd>
                  </div>
                )}
              </dl>
              <DescriptionList
                className="mt-4 border-t border-line pt-4"
                columns={3}
                items={[
                  { label: "Taxable value", value: formatINR(totals.taxable) },
                  { label: "CGST + SGST", value: formatINR(totals.cgst + totals.sgst) },
                  { label: "IGST", value: formatINR(totals.igst) },
                  { label: "TCS (1%)", value: formatINR(totals.tcs) },
                  showFinance && { label: "NRV (seller)", value: formatINR(totals.nrv) },
                  showFinance && { label: "Commission", value: formatINR(totals.commission) },
                  { label: "Platform invoice", value: order.platformInvoice ?? "—" },
                  { label: "Payment ID", value: order.paymentId ?? "—" },
                  { label: "Salesman", value: order.salesman ?? "—" },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Customer" actions={customer && can(user, "customers") ? <Link href={`/admin/customers/${customer.id}`} className="text-[13px] font-medium text-brand-700 hover:underline">Profile</Link> : null} />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Name", value: order.customer },
                  { label: "Mobile", value: maskMobile(order.mobile) },
                  { label: "Delivery", value: `${order.city}, ${order.state} – ${order.pincode}` },
                  customer && { label: "Orders so far", value: customer.orders },
                ]}
              />
            </CardBody>
          </Card>

          {shipments && (
            <OrderShipmentsPanel
              orderId={order.id}
              rows={shipments.ok ? shipments.data : []}
              error={shipments.ok ? null : shipments.message}
              canAdd={canShip(user, "add")}
              canEdit={canShip(user, "edit")}
            />
          )}

          {(data.returns.length > 0 || data.refunds.length > 0 || data.tickets.length > 0) && (
            <Card>
              <CardHeader title="Related" />
              <ul className="divide-y divide-line text-sm">
                {data.returns.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <Link href={`/admin/returns/${r.id}`} className="font-mono text-xs text-brand-700 hover:underline">{r.id}</Link>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
                {data.refunds.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <span className="font-mono text-xs">{r.id} · {formatINR(r.amount)}</span>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
                {data.tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <Link href={`/admin/support/${t.id}`} className="truncate text-brand-700 hover:underline">{t.subject}</Link>
                    <StatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card>
            <CardHeader title="Activity" />
            <CardBody>
              <Timeline items={data.timeline.map((t) => ({ ...t, meta: formatDateTime(t.at) }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
