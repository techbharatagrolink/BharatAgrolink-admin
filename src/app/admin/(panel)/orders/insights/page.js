import Link from "next/link";
import { CalendarClock, CheckCircle2, HandCoins, PackageX, Repeat, RotateCcw, TrendingDown, Truck } from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { getOrderInsights } from "@/lib/services/admin/order-insights";
import { formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { DonutChart, HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Order Insights" };

const MODE_ICON = { cod: PackageX, prepaid: CheckCircle2, partial: HandCoins };
const MODE_TONE = { cod: "warning", prepaid: "brand", partial: "info" };

export default async function OrderInsightsPage() {
  const { user, allowed } = await checkPermission("orders");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Order Insights" />
        <PermissionDenied module="order insights" />
      </>
    );
  }
  const { payments, rto, delivery, repeat } = await getOrderInsights(user);

  return (
    <>
      <PageHeader title="Order Insights" description="Payment mode mix, RTO analysis, delivery time and repeat customers across all B2C orders." />

      <section id="payment-modes" className="scroll-mt-20">
        <h2 className="mb-2 text-sm font-semibold text-ink">COD vs Prepaid</h2>
        {payments.error ? (
          <ApiUnavailable error={payments.error} what="the payment mode report" />
        ) : (
          <div className="grid gap-4 xl:grid-cols-3">
            <StatGrid className="xl:col-span-2 sm:grid-cols-3 lg:grid-cols-3">
              {payments.data.rows.map((m) => (
                <StatCard key={m.mode} label={`${m.label} orders`} value={`${m.pct}%`} hint={`${formatNumber(m.orders)} orders`} icon={MODE_ICON[m.mode]} tone={MODE_TONE[m.mode]} href={`/admin/orders?paymentMode=${m.label}`} />
              ))}
            </StatGrid>
            <Card>
              <CardHeader title="Payment mode split" description="All orders, by payment mode" />
              <CardBody>
                {payments.data.total ? (
                  <DonutChart data={payments.data.rows.map((m) => ({ label: m.label, value: m.orders }))} label="COD vs prepaid vs partial orders" centerValue={formatNumber(payments.data.total)} centerLabel="orders" />
                ) : (
                  <p className="text-sm text-ink-muted">No COD, prepaid or partial orders.</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </section>

      <section id="rto-analysis" className="mt-6 scroll-mt-20">
        <h2 className="mb-2 text-sm font-semibold text-ink">RTO analysis</h2>
        {rto.error ? (
          <ApiUnavailable error={rto.error} what="the RTO analysis" />
        ) : (
          <>
            <StatGrid className="sm:grid-cols-3 lg:grid-cols-3">
              <StatCard label="RTO orders" value={formatNumber(rto.data.orders)} hint="Orders with a product in an RTO status" icon={RotateCcw} tone="danger" href="/admin/rto" />
              <StatCard label="RTO rate" value={`${rto.data.rate}%`} hint="Of all orders" icon={TrendingDown} tone={rto.data.rate > 10 ? "danger" : "warning"} />
              <StatCard
                label="Average delivery time"
                value={delivery.error ? "—" : `${delivery.data?.averageDeliveryDays ?? 0} days`}
                hint={delivery.error ? "Delivery summary unavailable" : `${formatNumber(delivery.data?.deliveredOrders ?? 0)} delivered orders with a delivery date`}
                icon={CalendarClock}
                tone="info"
              />
            </StatGrid>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader title="RTO by status" description="Orders that have a product in each RTO status" />
                <CardBody>{rto.data.orders ? <HBarList data={rto.data.byStatus} format={formatNumber} /> : <p className="text-sm text-ink-muted">No RTO orders.</p>}</CardBody>
              </Card>
              <Card>
                <CardHeader title="Responsible party" description="Who the RTO is attributed to on the order" />
                <CardBody>{rto.data.byResponsible.length ? <HBarList data={rto.data.byResponsible} format={formatNumber} /> : <p className="text-sm text-ink-muted">No RTO orders.</p>}</CardBody>
              </Card>
            </div>
            <Notice className="mt-4">Return reasons are not stored for RTO orders, so they are grouped by status and responsible party. Forward and reverse shipping costs are in the RTO ledger.</Notice>
            <Card className="mt-4">
              <CardHeader title="Latest RTO orders" actions={<Link href="/admin/rto" className="text-[13px] font-medium text-brand-700 hover:underline">Open RTO ledger</Link>} />
              <MiniTable
                columns={[
                  { key: "id", label: "Order", render: (r) => <Link href={`/admin/orders/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.id}</Link> },
                  { key: "customer", label: "Customer" },
                  { key: "payment", label: "Payment" },
                  { key: "responsible", label: "Responsible" },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  { key: "createdAt", label: "Placed", render: (r) => formatDateTime(r.createdAt) },
                  { key: "amount", label: "Total", align: "right", render: (r) => formatINR(r.amount) },
                ]}
                rows={rto.data.recent}
                empty="No RTO orders."
              />
            </Card>
          </>
        )}
      </section>

      <section id="repeat-customers" className="mt-6 scroll-mt-20">
        <h2 className="mb-2 text-sm font-semibold text-ink">Repeat customers and order sources</h2>
        {repeat.error ? (
          <ApiUnavailable error={repeat.error} what="repeat customers and order sources" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <StatCard
              label="Repeat customer rate"
              value={`${repeat.data.repeatCustomerRate}%`}
              hint={`${formatNumber(repeat.data.repeatOrders)} repeat orders of ${formatNumber(repeat.data.orders)}${repeat.data.period ? ` · ${repeat.data.period.from} to ${repeat.data.period.to}` : ""}`}
              icon={Repeat}
              tone="info"
            />
            <Card className="lg:col-span-2">
              <CardHeader title="Order sources" description="Orders placed in the last 30 days, by source" />
              <CardBody>{repeat.data.sources.length ? <HBarList data={repeat.data.sources} format={formatNumber} /> : <p className="text-sm text-ink-muted">No orders in this period.</p>}</CardBody>
            </Card>
          </div>
        )}
      </section>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-ink-muted">
        <Truck className="size-3.5" aria-hidden /> Period-filtered payment and RTO figures are on the <Link href="/admin/dashboard" className="font-medium text-brand-700 hover:underline">main dashboard</Link>.
      </p>
    </>
  );
}
