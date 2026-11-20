import Link from "next/link";
import {
  Ban,
  BadgePercent,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  LayoutDashboard,
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
  Sigma,
  SlidersHorizontal,
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
import { can, canCard, canPage, SALES_CARD_SLUGS } from "@/lib/auth/permissions";
import { dashboardFilterHref, getMainDashboard } from "@/lib/services/admin/main-dashboard";
import { getFixedExpenses } from "@/lib/services/admin/fixed-expenses";
import { formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { PageHeader } from "@/components/ui/page";
import { KpiCard as StatCard, Widget, WidgetLink, ZohoTable } from "@/components/admin/dashboard/zoho";
import { StatusBadge } from "@/components/ui/badge";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { BarChart, HBarList, LineChart } from "@/components/charts/charts";
import { StatusMixView } from "@/components/admin/dashboard/zoho-charts";
import { AlertList } from "@/components/admin/dashboard/range-switch";
import { DashboardFilters } from "@/components/admin/dashboard/dashboard-filters";
import { DashboardAccordion, DashboardSection } from "@/components/admin/dashboard/dashboard-accordion";
import { cn } from "@/lib/utils";

export const metadata = { title: "Main Dashboard" };

const inr = (v) => formatINR(v, { compact: true });
const pctText = (v) => (v == null || Number.isNaN(Number(v)) ? "—" : `${v}%`);
/* "29.77% of sub-orders · shipped / in transit" for a status card */
const subShare = (pct, text) => (pct == null ? text[0].toUpperCase() + text.slice(1) : `${pct}% of sub-orders · ${text}`);

function Grid({ children, className }) {
  return <div className={cn("z-stagger grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 2xl:grid-cols-5", className)}>{children}</div>;
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
  const showFixed = can(user, "finance.expenses");
  const [result, fixedResult] = await Promise.all([
    getMainDashboard(params, user).then((data) => ({ data }), (error) => ({ error })),
    // Fixed Expenses page cards for the current month (that page's default view).
    showFixed ? getFixedExpenses({ pageSize: "10" }, user) : null,
  ]);
  if (result.error) return (<><PageHeader title="Main Dashboard" /><ApiUnavailable error={result.error} what="the main dashboard" /></>);
  const d = result.data;
  const { sales, orders, shipping, marketplace, customers, finance, deltas } = d;
  const fixed = fixedResult?.ok ? fixedResult.data : null;
  const fixedMonth = fixed ? new Date(`${fixed.month}-01T00:00:00Z`).toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }) : "";
  const fixedShort = fixed ? new Date(`${fixed.month}-01T00:00:00Z`).toLocaleString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }) : "";
  const showFinance = can(user, "finance") || can(user, "payouts");
  const showOrders = can(user, "orders");
  // Every "Overview · Business Performance" row in Roles & Permissions (Sales/Orders/Shipping/
  // Product & Location/Customer/Payment/Charts Overview) gates its own dashboard section,
  // independent of the generic "orders" resource permission above (which only controls a couple
  // of inner stat-card links) and independent of "finance"/"finance.expenses" (Finance & report /
  // Fixed expenses, which already had their own gate before this).
  // Card-level permissions: if individual cards in Sales Overview are configured,
  // showSales is true if at least one card is visible to the role.
  const anySalesCardVisible = SALES_CARD_SLUGS.some((slug) => canCard(user, slug));
  const showSales = anySalesCardVisible;
  const showOrdersOverview = canPage(user, "#dashboard_orders_overview");
  const showShipping = canPage(user, "#dashboard_logistics_overview");
  const showMarketplace = canPage(user, "#dashboard_products_overview");
  const showCustomers = canPage(user, "#dashboard_customers_overview");
  const showPayments = canPage(user, "#dashboard_payments_overview");
  const showCharts = canPage(user, "#dashboard_charts_overview");
  const vs = d.filters.compare ? "vs previous period" : undefined;
  const card = (slug) => dashboardFilterHref(`/admin/dashboard/cards/${slug}`, params);

  const salesSummaryParts = [];
  if (canCard(user, "total-revenue")) salesSummaryParts.push(`${inr(sales.totalRevenue)} total revenue`);
  if (canCard(user, "total-sales-b2c")) salesSummaryParts.push(`${inr(sales.salesB2C)} B2C`);
  if (canCard(user, "total-sales-b2b")) salesSummaryParts.push(`${inr(sales.salesB2B)} B2B`);
  const salesSummary = salesSummaryParts.join(" · ") || "Sales overview";
  const sectionIds = [
    ...(showSales ? ["sales"] : []),
    ...(showOrdersOverview ? ["orders"] : []),
    ...(showShipping ? ["shipping"] : []),
    ...(showMarketplace ? ["marketplace"] : []),
    ...(showCustomers ? ["customers"] : []),
    ...(showFinance ? ["finance"] : []),
    ...(showPayments ? ["payments"] : []),
    ...(showCharts ? ["charts"] : []),
    ...(fixed ? ["fixed"] : []),
  ];
  const indexOf = (id) => sectionIds.indexOf(id) + 1;

  // Zoho-style headline strip: the same figures (and permission gates / links) as the cards below.
  const highlights = [
    canCard(user, "total-revenue") && { key: "rev", label: "Total revenue", value: inr(sales.totalRevenue), delta: deltas.totalRevenue, hint: vs ?? "Delivered B2C and B2B", icon: TrendingUp, href: card("total-revenue") },
    showOrdersOverview && { key: "ord", label: "Total orders", value: formatNumber(orders.total), delta: deltas.totalOrders, hint: vs ?? "B2C + B2B", icon: ClipboardList, tone: "info", href: card("total-orders") },
    showOrdersOverview && { key: "dlv", label: "Delivered gross", value: inr(orders.deliveredGross), delta: deltas.deliveredGross, hint: vs ?? "Delivered sales value", icon: PackageCheck, href: card("delivered-gross") },
    showCustomers && { key: "cus", label: "Ordering customers", value: formatNumber(customers.ordering), hint: "Placed at least one order", icon: ShoppingCart, tone: "warning", href: card("ordering-customers") },
  ].filter(Boolean);
  const highlightCols = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"][highlights.length];

  return (
    <div className="zoho-dash -mx-3 -my-5 min-h-full bg-[var(--z-canvas)] px-3 py-4 sm:-mx-5 sm:px-5 sm:py-5 lg:-mx-6 lg:px-6">
      <DashboardAccordion
        sections={sectionIds}
        defaultOpen={["sales"]}
        header={
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--z-card)] text-[var(--z-ink)] shadow-[var(--z-shadow)] ring-1 ring-[var(--z-line)]">
              <LayoutDashboard className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-page-title font-semibold text-[var(--z-ink)]">Welcome {user?.name || "back"}</h1>
              <p className="truncate text-xs text-[var(--z-muted)]" title="Marketplace performance across sales, orders, shipping, customers and finance. All figures are calculated on the server for the filters below.">
                Main Dashboard · Marketplace performance across sales, orders, shipping, customers and finance
              </p>
            </div>
          </div>
        }
        beforeSections={
          <>
            <DashboardFilters values={d.filters.values} options={d.filters.options} label={d.filters.label} variant="zoho" />
            {highlights.length > 0 && (
              <div className={cn("z-stagger mb-4 grid grid-cols-2 gap-2.5 sm:gap-4", highlightCols)}>
                {highlights.map(({ key, ...h }) => (
                  <StatCard key={key} size="lg" {...h} />
                ))}
              </div>
            )}
          </>
        }
      >
      {showSales && (
      <DashboardSection id="sales" index={indexOf("sales")} title="Sales overview" summary={salesSummary}>
        <Grid>
          {canCard(user, "total-sales-b2c") && <StatCard label="Total sales (B2C)" value={inr(sales.salesB2C)} delta={deltas.salesB2C} hint={vs ?? "Live sales value"} icon={ShoppingCart} href={card("total-sales-b2c")} />}
          {canCard(user, "total-sales-b2b") && <StatCard label="Total sales (B2B)" value={inr(sales.salesB2B)} delta={deltas.salesB2B} hint={`${formatNumber(sales.b2bCount)} B2B orders`} icon={Building2} tone="info" href={card("total-sales-b2b")} />}
          {canCard(user, "total-revenue") && <StatCard label="Total revenue" value={inr(sales.totalRevenue)} delta={deltas.totalRevenue} hint="Delivered B2C and B2B" icon={TrendingUp} href={card("total-revenue")} />}
          {canCard(user, "seller-payout") && <StatCard label="Seller payout" value={inr(sales.sellerPayout)} hint="BSA on delivered orders" icon={Wallet} tone="neutral" href={card("seller-payout")} />}
          {canCard(user, "platform-revenue") && <StatCard label="Platform revenue" value={inr(sales.platformRevenue)} hint="Commission, ex-GST" icon={Landmark} tone="brand" href={card("platform-revenue")} />}
          {canCard(user, "shipping-charges") && <StatCard label="Shipping charges" value={inr(sales.shippingCharges)} hint="Courier freight + COD handling, once per AWB" icon={Truck} tone="info" href={card("shipping-charges")} />}
          {canCard(user, "pg-charges") && <StatCard label="PG charges" value={inr(sales.pgCharges)} hint="Actual Razorpay fee (excl. GST); estimate until Razorpay reports it" icon={CreditCard} tone="warning" href={card("pg-charges")} />}
          {canCard(user, "prepaid-partial") && <StatCard label="Prepaid / partial" value={inr(sales.prepaidPartial)} hint="3% prepaid / 1% partial" icon={HandCoins} tone="info" href={card("prepaid-partial")} />}
          {canCard(user, "tcs") && <StatCard label="TCS" value={inr(sales.tcs)} hint="1% on delivered taxable value" icon={Receipt} tone="danger" href={card("tcs")} />}
          {canCard(user, "rto-charges") && (
            <StatCard
              label="RTO charges"
              value={inr(sales.rtoCharges)}
              hint={sales.rtoSubOrders == null ? "Courier freight per RTO sub-order" : `${formatNumber(sales.rtoSubOrders)} RTO sub-orders · freight × 1`}
              icon={RotateCcw}
              tone="danger"
              href={card("rto-charges")}
            />
          )}
        </Grid>
      </DashboardSection>
      )}

      {showOrdersOverview && (
      <DashboardSection id="orders" index={indexOf("orders")} title="Orders overview" note="status counts are sub-orders" summary={`${formatNumber(orders.total)} orders · ${formatNumber(orders.subOrders)} sub-orders · ${formatNumber(orders.delivered)} delivered · RTO ${pctText(orders.rtoRate)}`}>
        <Grid>
          <StatCard label="Total orders" value={formatNumber(orders.total)} delta={deltas.totalOrders} hint={vs ?? "B2C + B2B"} icon={ClipboardList} href={card("total-orders")} />
          <StatCard label="Accepted" value={formatNumber(orders.accepted)} hint={subShare(orders.acceptedPct, "accepted by vendors")} icon={CheckCircle2} href={card("accepted-orders")} />
          <StatCard label="Rejected" value={formatNumber(orders.rejected)} hint={subShare(orders.rejectedPct, "rejected by vendors")} icon={XCircle} tone="danger" href={card("rejected-orders")} />
          <StatCard label="Sub-orders" value={formatNumber(orders.subOrders)} hint={`One per seller in an order · ${formatNumber(orders.total)} orders`} icon={Layers} tone="neutral" href={card("sub-orders")} />
          <StatCard label="Processing" value={formatNumber(orders.processing)} hint={subShare(orders.processingPct, "not yet delivered")} icon={Package} tone="warning" href={showOrders ? "/admin/orders" : undefined} />
          <StatCard label="Shipped" value={formatNumber(orders.shipped)} hint={subShare(orders.shippedPct, "shipped / in transit")} icon={Truck} tone="info" href={card("shipped")} />
          <StatCard label="Delivered" value={formatNumber(orders.delivered)} hint={subShare(orders.deliveredPct, "delivered")} icon={PackageCheck} href={card("delivered-orders")} />
          <StatCard label="Delivered gross" value={inr(orders.deliveredGross)} delta={deltas.deliveredGross} hint={vs ?? "Delivered sales value"} icon={IndianRupee} href={card("delivered-gross")} />
          <StatCard label="AOV (delivered)" value={formatINR(orders.aovDelivered)} hint="Average delivered order value" icon={PieChart} tone="info" />
          <StatCard label="Cancelled" value={formatNumber(orders.cancelled)} hint={subShare(orders.cancellationRate, "cancelled")} icon={Ban} tone="danger" href={card("cancelled-orders")} />
          <StatCard label="Cancellation rate" value={pctText(orders.cancellationRate)} hint="Cancelled sub-orders ÷ all sub-orders" icon={BadgePercent} tone={orders.cancellationRate > 8 ? "danger" : "warning"} />
          <StatCard label="RTO orders" value={formatNumber(orders.rto)} hint={`RTO sub-orders${orders.rtoOrders != null ? ` · ${formatNumber(orders.rtoOrders)} orders` : ""}`} icon={RotateCcw} tone="danger" href={card("rto-orders")} />
          <StatCard label="RTO rate" value={pctText(orders.rtoRate)} hint="RTO sub-orders ÷ all sub-orders" icon={TrendingDown} tone={orders.rtoRate > 10 ? "danger" : "warning"} href={card("rto-rate")} />
          <StatCard label="Returned" value={formatNumber(orders.returned)} hint="Return requests raised" icon={Undo2} tone="warning" href="/admin/returns" />
          <StatCard label="New order %" value={`${orders.newOrderPct}%`} hint="First order by the customer" icon={Sparkles} tone="info" href={card("new-orders")} />
          <StatCard label="Repeat orders" value={formatNumber(orders.repeatOrders)} hint="From returning customers" icon={Repeat} href={card("repeat-orders")} />
          <StatCard label="Repeat customer %" value={`${orders.repeatCustomerPct}%`} hint="Customers who ordered again" icon={Users} tone="info" href={card("repeat-customers")} />
        </Grid>
      </DashboardSection>
      )}

      {showShipping && (
      <DashboardSection id="shipping" index={indexOf("shipping")} title="Shipping & courier analytics" summary={`${formatNumber(shipping.couriers.reduce((a, c) => a + c.shipments, 0))} shipments · ${shipping.avgDays} days average delivery`}>
        <Grid className="lg:grid-cols-5 2xl:grid-cols-5">
          {shipping.couriers.map((c) => (
            <StatCard key={c.name} label={`${c.name} shipments`} value={formatNumber(c.shipments)} hint="Courier count" icon={Truck} tone="info" href={c.name === "Delhivery" ? card("delhivery") : c.name === "Shiprocket" ? card("shiprocket") : "/admin/shipping"} />
          ))}
          <StatCard label="Average delivery time" value={`${shipping.avgDays} days`} hint="Order to delivery" icon={CalendarClock} tone="warning" href={card("average-shipping")} />
          <StatCard label="Average shipping fee" value={formatINR(shipping.avgAmount)} hint={`${formatNumber(shipping.feeOrders)} orders paid a fee`} icon={IndianRupee} tone="neutral" />
        </Grid>
      </DashboardSection>
      )}

      {showMarketplace && (
      <DashboardSection id="marketplace" index={indexOf("marketplace")} title="Marketplace, product & location" summary={`${formatNumber(marketplace.sellers)} sellers · ${formatNumber(marketplace.totalSku)} SKUs${marketplace.topLocation ? ` · top city ${marketplace.topLocation.city}` : ""}`}>
        <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
          <StatCard label="Sellers" value={formatNumber(marketplace.sellers)} hint={`${formatNumber(marketplace.pendingSellers)} pending verification`} icon={Store} href="/admin/vendors" />
          <StatCard label="Total SKUs" value={formatNumber(marketplace.totalSku)} hint={`${formatNumber(marketplace.liveSku)} live, incl. variations`} icon={Boxes} tone="info" href="/admin/products" />
          <StatCard label="Top product (units)" value={formatNumber(marketplace.topProduct?.units ?? 0)} hint={marketplace.topProduct?.name ?? "No sales in this period"} icon={ShoppingBag} tone="brand" href={card("top-products")} />
          <StatCard label="Top location (orders)" value={formatNumber(marketplace.topLocation?.orders ?? 0)} hint={marketplace.topLocation ? `${marketplace.topLocation.city}, ${marketplace.topLocation.state}${marketplace.topLocation.pincode ? ` · ${marketplace.topLocation.pincode}` : ""}` : "No orders in this period"} icon={MapPin} tone="danger" href={card("top-locations")} />
        </Grid>
      </DashboardSection>
      )}

      {showCustomers && (
      <DashboardSection id="customers" index={indexOf("customers")} title="Customer & visitor analytics" summary={`${formatNumber(customers.ordering)} ordering customers · ${formatNumber(customers.registrations)} new registrations`}>
        <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
          <StatCard label="Unique visitors" value={formatNumber(customers.uniqueVisitors)} delta={customers.uniqueVisitorsPct} hint={customers.visitorsCompareLabel || "Buyers and new accounts"} icon={Eye} tone="neutral" href={card("unique-visitors")} />
          <StatCard label="New registrations" value={formatNumber(customers.registrations)} delta={customers.registrationsPct} hint="Signed up in this period" icon={UserPlus} tone="info" href="/admin/customers" />
          <StatCard label="Total registered users" value={formatNumber(customers.totalRegistered)} hint="All customer accounts" icon={Users} href="/admin/customers" />
          <StatCard label="Ordering customers" value={formatNumber(customers.ordering)} hint="Placed at least one order" icon={ShoppingCart} tone="brand" href={card("ordering-customers")} />
        </Grid>
      </DashboardSection>
      )}

      {showFinance && (
        <DashboardSection id="finance" index={indexOf("finance")} title="Finance & report" summary={`${finance.contributionPct}% contribution margin · net ${inr(finance.netProfit)}`} action={<WidgetLink href="/admin/dashboards/finance">Open finance dashboard</WidgetLink>}>
          <Grid className="lg:grid-cols-5 2xl:grid-cols-5">
            <StatCard label="Contribution margin" value={`${finance.contributionPct}%`} hint={`${inr(finance.contribution)} on delivered revenue`} icon={TrendingUp} tone={finance.contribution >= 0 ? "brand" : "danger"} />
            <StatCard label="GMV (order value)" value={inr(finance.gmv)} delta={deltas.gmv} hint={vs ?? "Delivered customer-paid value"} icon={CircleDollarSign} tone="info" />
            <StatCard label="Variable cost" value={inr(finance.variableCost)} hint="Payout + PG + courier + discounts" icon={Layers} tone="warning" />
            <StatCard label="Fixed expenses" value={inr(finance.fixedExpenses)} hint={`${inr(finance.fixedMonthly)} a month, pro-rated`} icon={Building2} tone="neutral" href="/admin/finance/expenses" />
            <StatCard label="Net profit" value={inr(finance.netProfit)} hint="Contribution − fixed expenses" icon={finance.netProfit == null || finance.netProfit >= 0 ? TrendingUp : TrendingDown} tone={finance.netProfit == null ? "neutral" : finance.netProfit >= 0 ? "brand" : "danger"} />
          </Grid>
        </DashboardSection>
      )}

      {showPayments && (
      <DashboardSection id="payments" index={indexOf("payments")} title="Payment mode analytics" note="delivered orders" summary={d.paymentModes.map((m) => `${m.mode} ${m.pct}%`).join(" · ")}>
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
              href={card(m.mode === "Partial" ? "partial-orders" : m.mode === "Prepaid" ? "prepaid-orders" : "cod-orders")}
            />
          ))}
        </Grid>
      </DashboardSection>
      )}

      {showCharts && (
      <DashboardSection id="charts" index={indexOf("charts")} title="Reports & charts" summary="Sales trend, alerts, status mix, revenue mix, top categories and vendors">
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
          <Widget className="xl:col-span-2" title="Sales and orders" description="Delivered sales (₹) and orders placed" bodyClassName="space-y-6 px-5 pt-2 pb-5">
            <LineChart data={d.trend} series={[{ key: "sales", label: "Delivered sales (₹)" }]} label="Delivered sales trend" height={200} />
            <BarChart data={d.trend} series={[{ key: "orders", label: "Orders placed", color: "var(--chart-2)" }]} label="Orders trend" height={160} />
          </Widget>
          <Widget title="Needs attention" description="Operational alerts across the marketplace" bodyClassName="pb-2 [&_ul]:border-t [&_ul]:border-[var(--z-line)]">
            <AlertList alerts={d.alerts} />
          </Widget>
        </div>
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
          <Widget title="Order status distribution" description="Sub-orders in this period" bodyClassName="px-5 pt-2 pb-5">
            <StatusMixView data={d.statusMix} label="Order status distribution" centerValue={formatNumber(orders.subOrders)} centerLabel="sub-orders" />
          </Widget>
          <Widget title="Revenue mix" description="Where the money in this period comes from" bodyClassName="px-5 pt-2 pb-5">
            {d.revenueMix.some((r) => r.value > 0) ? <HBarList data={d.revenueMix} format={inr} /> : <p className="text-sm text-[var(--z-muted)]">No revenue in this period.</p>}
          </Widget>
          <Widget title="Top categories" description="Delivered sales in this period" bodyClassName="px-5 pt-2 pb-5">
            {d.topCategories.length ? <HBarList data={d.topCategories} format={inr} /> : <p className="text-sm text-[var(--z-muted)]">No delivered sales in this period.</p>}
          </Widget>
          <Widget title="Top vendors" description="Delivered GMV in this period" bodyClassName="px-5 pt-2 pb-5">
            {d.topVendors.length ? <HBarList data={d.topVendors} format={inr} /> : <p className="text-sm text-[var(--z-muted)]">No delivered sales in this period.</p>}
          </Widget>
        </div>
      </DashboardSection>
      )}

      {fixed && (
        <DashboardSection
          id="fixed"
          index={indexOf("fixed")}
          title="Fixed expenses"
          note={fixedMonth}
          summary={`${formatINR(fixed.kpis.total)} total · ${formatINR(fixed.kpis.baseRecurring)} recurring · ${formatINR(fixed.kpis.monthAdjustments)} adjustments`}
          action={<WidgetLink href="/admin/finance/fixed-expenses">Open fixed expenses</WidgetLink>}
        >
          <Grid className="lg:grid-cols-4 2xl:grid-cols-4">
            <StatCard label="Total Fixed Cost" value={formatINR(fixed.kpis.total)} hint={`Effective total for ${fixedMonth}`} icon={Sigma} href="/admin/finance/fixed-expenses" />
            <StatCard label="Base Recurring" value={formatINR(fixed.kpis.baseRecurring)} hint="Applies to all months automatically" icon={Repeat} tone="info" href="/admin/finance/fixed-expenses?month=all" />
            <StatCard
              label="Month Adjustments"
              value={formatINR(fixed.kpis.monthAdjustments)}
              hint={`${fixed.kpis.monthItems} custom item(s) in ${fixedShort}`}
              icon={SlidersHorizontal}
              tone={fixed.kpis.monthAdjustments > 0 ? "warning" : "neutral"}
              href="/admin/finance/fixed-expenses"
            />
            <StatCard label="Active Expense Items" value={formatNumber(fixed.kpis.activeItems)} hint="Deducted from Contribution Margin" icon={Layers} tone="neutral" href="/admin/finance/fixed-expenses" />
          </Grid>
        </DashboardSection>
      )}
      </DashboardAccordion>

      {showOrders && (
        <Widget className="mt-4" title="Latest orders" description="In the selected period" actions={<WidgetLink href="/admin/orders">View all orders</WidgetLink>}>
          <ZohoTable
            columns={[
              { key: "id", label: "Order", render: (r) => <Link href={`/admin/orders/${r.id}`} className="font-mono text-xs font-medium text-[var(--z-accent)] hover:underline">{r.id}</Link> },
              { key: "customer", label: "Customer" },
              { key: "paymentMode", label: "Payment" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "createdAt", label: "Placed", render: (r) => formatDateTime(r.createdAt) },
              { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
            ]}
            rows={d.recentOrders}
            empty="No orders in this period."
          />
        </Widget>
      )}
    </div>
  );
}
