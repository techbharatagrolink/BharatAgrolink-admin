import Link from "next/link";
import {
  Ban,
  BadgePercent,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Eye,
  HandCoins,
  IndianRupee,
  Landmark,
  Layers,
  MapPin,
  Package,
  PackageCheck,
  PackageX,
  PieChart,
  Receipt,
  Repeat,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Undo2,
  UserPlus,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getMainDashboard } from "@/lib/services/admin/main-dashboard";
import { formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { PageHeader, StatCard } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { BarChart, DonutChart, HBarList, LineChart } from "@/components/charts/charts";
import { AlertList, MiniTable } from "@/components/admin/dashboard/range-switch";
import { DashboardFilters } from "@/components/admin/dashboard/dashboard-filters";
import { DashboardAccordion, DashboardSection } from "@/components/admin/dashboard/dashboard-accordion";
import { cn } from "@/lib/utils";

export const metadata = { title: "Main Dashboard" };

const inr = (v) => formatINR(v, { compact: true });

function Grid({ children, className }) {
  return <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5", className)}>{children}</div>;
}

export default async function MainDashboardPage({ searchParams }) {
  const { user, allowed } = await checkPermission("dashboard.main");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Main Dashboard" />
        <PermissionDenied module="the main dashboard" />
      </>
    );
  }
  const params = await searchParams;
  const d = await getMainDashboard(params);
  const { sales, orders, shipping, marketplace, customers, finance, deltas } = d;
  const showFinance = can(user, "finance") || can(user, "payouts");
  const showOrders = can(user, "orders");
  const vs = d.filters.compare ? "vs previous period" : undefined;
  const sectionIds = ["sales", "orders", "shipping", "marketplace", "customers", ...(showFinance ? ["finance"] : []), "payments", "charts"];

  return (
    <>
      <PageHeader title="Main Dashboard" description="Marketplace performance across sales, orders, shipping, customers and finance. All figures are calculated on the server for the filters below." />
      <DashboardFilters values={d.filters.values} options={d.filters.options} label={d.filters.label} />

      <DashboardAccordion sections={sectionIds} defaultOpen={["sales"]}>
      <DashboardSection id="sales" index={1} title="Sales overview" summary={`${inr(sales.totalRevenue)} total revenue · ${inr(sales.salesB2C)} B2C · ${inr(sales.salesB2B)} B2B`}>
        <Grid>
          <StatCard label="Total sales (B2C)" value={inr(sales.salesB2C)} delta={deltas.salesB2C} hint={vs ?? `${formatNumber(sales.liveLines)} live sub-orders`} icon={ShoppingCart} href={showOrders ? "/admin/orders" : undefined} />
          <StatCard label="Total sales (B2B)" value={inr(sales.salesB2B)} delta={deltas.salesB2B} hint={`${formatNumber(sales.b2bCount)} B2B orders`} icon={Building2} tone="info" href="/admin/b2b/orders" />
          <StatCard label="Total revenue" value={inr(sales.totalRevenue)} delta={deltas.totalRevenue} hint="B2C + B2B order value" icon={TrendingUp} />
          {showFinance && <StatCard label="Seller payout" value={inr(sales.sellerPayout)} hint="BSA on delivered orders" icon={Wallet} tone="neutral" href="/admin/payouts" />}
          {showFinance && <StatCard label="Platform revenue" value={inr(sales.platformRevenue)} hint="Commission, ex-GST" icon={Landmark} tone="brand" />}
          <StatCard label="Shipping charges" value={inr(sales.shippingCharges)} hint="Shipping + COD handling collected" icon={Truck} tone="info" />
          {showFinance && <StatCard label="PG charges" value={inr(sales.pgCharges)} hint="Gateway fee, est. 2% + GST" icon={CreditCard} tone="warning" />}
          <StatCard label="Prepaid / partial" value={inr(sales.prepaidPartial)} hint={`${sales.prepaidPct}% prepaid · ${sales.partialPct}% partial`} icon={HandCoins} tone="info" />
          {showFinance && <StatCard label="TCS" value={inr(sales.tcs)} hint="1% on delivered taxable value" icon={Receipt} tone="danger" href="/admin/finance/tax" />}
        </Grid>
      </DashboardSection>

      <DashboardSection id="orders" index={2} title="Orders overview" note="status counts are sub-orders" summary={`${formatNumber(orders.total)} orders · ${formatNumber(orders.delivered)} delivered · RTO ${orders.rtoRate}%`}>
        <Grid>
          <StatCard label="Total orders" value={formatNumber(orders.total)} delta={deltas.totalOrders} hint={vs ?? "B2C + B2B"} icon={ClipboardList} href={showOrders ? "/admin/orders" : undefined} />
          <StatCard label="Accepted" value={formatNumber(orders.accepted)} hint="Accepted by vendors" icon={CheckCircle2} />
          <StatCard label="Rejected" value={formatNumber(orders.rejected)} hint="Rejected by vendors" icon={XCircle} tone="danger" />
          <StatCard label="Sub-orders" value={formatNumber(orders.subOrders)} hint="One per vendor line" icon={Layers} tone="neutral" />
          <StatCard label="Processing" value={formatNumber(orders.processing)} hint="Accepted, packed, awaiting pickup" icon={Package} tone="warning" href="/admin/shipping" />
          <StatCard label="Shipped" value={formatNumber(orders.shipped)} hint="Shipped / in transit" icon={Truck} tone="info" />
          <StatCard label="Delivered" value={formatNumber(orders.delivered)} hint="Delivered sub-orders" icon={PackageCheck} />
          <StatCard label="Delivered gross" value={inr(orders.deliveredGross)} delta={deltas.deliveredGross} hint={vs ?? "Delivered sales value"} icon={IndianRupee} />
          <StatCard label="AOV (delivered)" value={formatINR(orders.aovDelivered)} hint="Average delivered order value" icon={PieChart} tone="info" />
          <StatCard label="Cancelled" value={formatNumber(orders.cancelled)} hint="Cancelled sub-orders" icon={Ban} tone="danger" />
          <StatCard label="Cancellation rate" value={`${orders.cancellationRate}%`} hint="Of all sub-orders" icon={BadgePercent} tone={orders.cancellationRate > 8 ? "danger" : "warning"} />
          <StatCard label="RTO orders" value={formatNumber(orders.rto)} hint="Returned to origin" icon={RotateCcw} tone="danger" href="/admin/rto" />
          <StatCard label="RTO rate" value={`${orders.rtoRate}%`} hint="Of shipped sub-orders" icon={TrendingDown} tone={orders.rtoRate > 10 ? "danger" : "warning"} />
          <StatCard label="Returned" value={formatNumber(orders.returned)} hint="Return requests raised" icon={Undo2} tone="warning" href="/admin/returns" />
          <StatCard label="New order %" value={`${orders.newOrderPct}%`} hint="First order by the customer" icon={Sparkles} tone="info" />
          <StatCard label="Repeat orders" value={formatNumber(orders.repeatOrders)} hint="From returning customers" icon={Repeat} />
          <StatCard label="Repeat customer %" value={`${orders.repeatCustomerPct}%`} hint="Customers who ordered again" icon={Users} tone="info" />
        </Grid>
      </DashboardSection>

      <DashboardSection id="shipping" index={3} title="Shipping & courier analytics" summary={`${formatNumber(shipping.couriers.reduce((a, c) => a + c.shipments, 0))} shipments · ${shipping.avgDays} days average delivery`}>
        <Grid className="lg:grid-cols-5 2xl:grid-cols-5">
          {shipping.couriers.map((c) => (
            <StatCard key={c.name} label={`${c.name} shipments`} value={formatNumber(c.shipments)} hint={`${formatNumber(c.delivered)} delivered`} icon={Truck} tone="info" href="/admin/shipping" />
          ))}
          <StatCard label="Average delivery time" value={`${shipping.avgDays} days`} hint="Order to delivery" icon={CalendarClock} tone="warning" />
          <StatCard label="Average shipping fee" value={formatINR(shipping.avgAmount)} hint={`${formatNumber(shipping.feeOrders)} orders paid a fee`} icon={IndianRupee} tone="neutral" />
        </Grid>
      </DashboardSection>

      <DashboardSection id="marketplace" index={4} title="Marketplace, product & location" summary={`${formatNumber(marketplace.sellers)} sellers · ${formatNumber(marketplace.totalSku)} SKUs${marketplace.topLocation ? ` · top city ${marketplace.topLocation.city}` : ""}`}>
        <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
          <StatCard label="Sellers" value={formatNumber(marketplace.sellers)} hint={`${formatNumber(marketplace.pendingSellers)} pending verification`} icon={Store} href="/admin/vendors" />
          <StatCard label="Total SKUs" value={formatNumber(marketplace.totalSku)} hint={`${formatNumber(marketplace.liveSku)} live, incl. variations`} icon={Boxes} tone="info" href="/admin/products" />
          <StatCard label="Top product (units)" value={formatNumber(marketplace.topProduct?.units ?? 0)} hint={marketplace.topProduct?.name ?? "No sales in this period"} icon={ShoppingBag} tone="brand" />
          <StatCard label="Top location (orders)" value={formatNumber(marketplace.topLocation?.orders ?? 0)} hint={marketplace.topLocation ? `${marketplace.topLocation.city}, ${marketplace.topLocation.state}` : "No orders in this period"} icon={MapPin} tone="danger" />
        </Grid>
      </DashboardSection>

      <DashboardSection id="customers" index={5} title="Customer & visitor analytics" summary={`${formatNumber(customers.ordering)} ordering customers · ${formatNumber(customers.registrations)} new registrations`}>
        <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
          <StatCard label="Unique visitors" value="—" hint="Connect web analytics to show visitors" icon={Eye} tone="neutral" />
          <StatCard label="New registrations" value={formatNumber(customers.registrations)} hint="Signed up in this period" icon={UserPlus} tone="info" href="/admin/customers" />
          <StatCard label="Total registered users" value={formatNumber(customers.totalRegistered)} hint="All customer accounts" icon={Users} href="/admin/customers" />
          <StatCard label="Ordering customers" value={formatNumber(customers.ordering)} hint="Placed at least one order" icon={ShoppingCart} tone="brand" />
        </Grid>
      </DashboardSection>

      {showFinance && (
        <DashboardSection id="finance" index={6} title="Finance & report" summary={`${finance.contributionPct}% contribution margin · net ${inr(finance.netProfit)}`} action={<Link href="/admin/dashboards/finance" className="text-[13px] font-medium text-brand-700 hover:underline">Open finance dashboard</Link>}>
          <Grid className="lg:grid-cols-5 2xl:grid-cols-5">
            <StatCard label="Contribution margin" value={`${finance.contributionPct}%`} hint={`${inr(finance.contribution)} on delivered revenue`} icon={TrendingUp} tone={finance.contribution >= 0 ? "brand" : "danger"} />
            <StatCard label="GMV (order value)" value={inr(finance.gmv)} delta={deltas.gmv} hint={vs ?? "Customer-paid order value"} icon={CircleDollarSign} tone="info" />
            <StatCard label="Variable cost" value={inr(finance.variableCost)} hint="Payout + PG + courier + discounts" icon={Layers} tone="warning" />
            <StatCard label="Fixed expenses" value={inr(finance.fixedExpenses)} hint={`${inr(finance.fixedMonthly)} a month, pro-rated`} icon={Building2} tone="neutral" href="/admin/finance/expenses" />
            <StatCard label="Net profit" value={inr(finance.netProfit)} hint="Contribution − fixed expenses" icon={finance.netProfit >= 0 ? TrendingUp : TrendingDown} tone={finance.netProfit >= 0 ? "brand" : "danger"} />
          </Grid>
        </DashboardSection>
      )}

      <DashboardSection id="payments" index={showFinance ? 7 : 6} title="Payment mode analytics" note="delivered orders" summary={d.paymentModes.map((m) => `${m.mode} ${m.pct}%`).join(" · ")}>
        <Grid className="sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
          {d.paymentModes.map((m) => (
            <StatCard
              key={m.mode}
              label={`${m.mode} orders`}
              value={`${m.pct}%`}
              hint={`${inr(m.value)} · ${formatNumber(m.count)} sub-orders`}
              icon={m.mode === "COD" ? PackageX : m.mode === "Prepaid" ? CheckCircle2 : HandCoins}
              tone={m.mode === "COD" ? "warning" : m.mode === "Prepaid" ? "brand" : "info"}
              className={m.mode === "COD" ? "col-span-2 sm:col-span-1" : undefined}
            />
          ))}
        </Grid>
      </DashboardSection>

      <DashboardSection id="charts" index={showFinance ? 8 : 7} title="Reports & charts" summary="Sales trend, alerts, status mix, revenue mix, top categories and vendors">
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader title="Sales and orders" description="Delivered sales (₹) and orders placed" />
            <CardBody className="space-y-6">
              <LineChart data={d.trend} series={[{ key: "sales", label: "Delivered sales (₹)" }]} label="Delivered sales trend" height={200} />
              <BarChart data={d.trend} series={[{ key: "orders", label: "Orders placed", color: "var(--chart-2)" }]} label="Orders trend" height={160} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Needs attention" description="Operational alerts across the marketplace" />
            <AlertList alerts={d.alerts} />
          </Card>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Order status distribution" description="Sub-orders in this period" />
            <CardBody>
              <DonutChart data={d.statusMix} label="Order status distribution" centerValue={formatNumber(orders.subOrders)} centerLabel="sub-orders" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Revenue mix" description="Where the money in this period comes from" />
            <CardBody>{d.revenueMix.some((r) => r.value > 0) ? <HBarList data={d.revenueMix} format={inr} /> : <p className="text-sm text-ink-muted">No revenue in this period.</p>}</CardBody>
          </Card>
          <Card>
            <CardHeader title="Top categories" description="Delivered sales in this period" />
            <CardBody>{d.topCategories.length ? <HBarList data={d.topCategories} format={inr} /> : <p className="text-sm text-ink-muted">No delivered sales in this period.</p>}</CardBody>
          </Card>
          <Card>
            <CardHeader title="Top vendors" description="Delivered GMV in this period" />
            <CardBody>{d.topVendors.length ? <HBarList data={d.topVendors} format={inr} /> : <p className="text-sm text-ink-muted">No delivered sales in this period.</p>}</CardBody>
          </Card>
        </div>
      </DashboardSection>
      </DashboardAccordion>

      {showOrders && (
        <Card className="mt-4">
          <CardHeader title="Latest orders" description="In the selected period" actions={<Link href="/admin/orders" className="text-[13px] font-medium text-brand-700 hover:underline">View all orders</Link>} />
          <MiniTable
            columns={[
              { key: "id", label: "Order", render: (r) => <Link href={`/admin/orders/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.id}</Link> },
              { key: "customer", label: "Customer" },
              { key: "paymentMode", label: "Payment" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "createdAt", label: "Placed", render: (r) => formatDateTime(r.createdAt) },
              { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
            ]}
            rows={d.recentOrders}
            empty="No orders in this period."
          />
        </Card>
      )}
    </>
  );
}
