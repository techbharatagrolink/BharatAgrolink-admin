import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getOrder } from "@/lib/services/admin/orders";
import { formatDateTime, formatINR, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PermissionDenied } from "@/components/ui/states";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";
import { canShip, orderShipments } from "@/lib/services/admin/shipping";
import { OrderShipmentsPanel } from "@/components/admin/shipping/order-shipments-panel";
import { OrderDesk } from "@/components/admin/orders/order-desk";

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

      <OrderDesk
        order={order}
        groups={groups}
        totals={totals}
        editor={data.editor}
        canEdit={can(user, "orders", "edit") && Boolean(data.editor)}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
