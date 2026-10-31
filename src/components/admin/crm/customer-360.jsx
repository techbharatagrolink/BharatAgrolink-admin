import Link from "next/link";
import { AlertTriangle, CalendarClock, IndianRupee, Info, Lightbulb, Lock, Package, Phone, RotateCcw, ShoppingCart, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { BarChart, HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { DescriptionList, ProgressBar, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { formatDate, formatDateTime, formatINR, formatNumber, formatPercent } from "@/lib/format";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Customer 360 body. `data` comes from GET /admin/parity/crm/customer-360 and is already cut
 * to the admin's tier: the limited (sales) payload has no financials, addresses, returns,
 * tickets, reviews, wallet, logins or per-order profit, so those sections simply do not render.
 */

const storeUrl = (slug) => (slug ? `${site.url.replace(/\/$/, "")}/product/${slug}` : null);
const ago = (days) => (days == null ? "—" : days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`);
const SOURCE_LABELS = {
  search_page: "Search Page",
  suggestion: "Search Suggestion",
  search: "Search Results",
  category: "Category / Shop",
  brand: "Brand Page",
  home: "Home Page",
  product: "Another Product",
  direct: "Direct",
  external: "External Site",
  other: "Other",
};
const PAYMENT_LABELS = { cod: "COD", partial: "Partial", prepaid: "Prepaid", online: "Online", unknown: "Unknown" };
const INSIGHT_ICON = { danger: AlertTriangle, warning: CalendarClock, success: Sparkles, info: Lightbulb };
const INSIGHT_TONE = {
  danger: "border-danger-ink/20 bg-danger-bg text-danger-ink",
  warning: "border-warning-ink/20 bg-warning-bg text-warning-ink",
  success: "border-success-ink/20 bg-success-bg text-success-ink",
  info: "border-info-ink/20 bg-info-bg text-info-ink",
};

function ProductLink({ name, url, sub }) {
  const href = storeUrl(url);
  return (
    <span className="block max-w-72 min-w-0">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block truncate font-medium text-brand-700 hover:underline" title={name}>
          {name}
        </a>
      ) : (
        <span className="block truncate font-medium text-ink" title={name}>
          {name}
        </span>
      )}
      {sub && <span className="block truncate text-xs text-ink-muted">{sub}</span>}
    </span>
  );
}

function Insights({ segment, insights }) {
  return (
    <Card>
      <CardHeader title="What to do next" description={segment.hint} actions={<Badge tone={segment.tone}>{segment.label}</Badge>} />
      <CardBody>
        {insights.length ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {insights.map((i) => {
              const Icon = INSIGHT_ICON[i.tone] ?? Info;
              return (
                <li key={i.text} className={cn("flex items-start gap-2 rounded-lg border px-3 py-2 text-sm", INSIGHT_TONE[i.tone] ?? INSIGHT_TONE.info)}>
                  <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{i.text}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted">No open signals for this customer right now.</p>
        )}
      </CardBody>
    </Card>
  );
}

const RATING_TONE = { Excellent: "success", Good: "brand", Satisfactory: "warning", Poor: "danger" };
const barTone = (v) => (v == null ? "brand" : v <= 25 ? "danger" : v <= 50 ? "warning" : "brand");

/** Same customer score and breakdown as the PHP Score Management page (score_user_formula.php). */
function ScoreCard({ score }) {
  if (!score) {
    return (
      <Card>
        <CardHeader title="Customer score" />
        <CardBody>
          <p className="text-sm text-ink-muted">Score could not be calculated right now.</p>
        </CardBody>
      </Card>
    );
  }
  const f = score.facts;
  return (
    <Card>
      <CardHeader title="Customer score" description="Same formula as Score Management (0-100)." actions={<Badge tone={RATING_TONE[score.rating] ?? "neutral"}>{score.rating}</Badge>} />
      <CardBody className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold text-ink tabular">{score.score.toFixed(2)}</span>
          <span className="pb-1 text-sm text-ink-muted">/ 100</span>
        </div>
        <ProgressBar value={score.score} tone={barTone(score.score)} label="Customer score" />
        <ul className="space-y-2.5">
          {score.breakdown.map((m) => (
            <li key={m.key} className="text-sm">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className={cn("text-ink-soft", m.score == null && "text-ink-muted")}>{m.label}</span>
                <span className="shrink-0 text-xs text-ink-muted tabular">
                  {m.score == null ? "no data" : `${m.score} × ${m.weight}% = ${m.points} pts`}
                </span>
              </div>
              {m.score != null && <ProgressBar value={m.score} tone={barTone(m.score)} className="h-1.5" label={m.label} />}
            </li>
          ))}
        </ul>
        <p className="text-xs text-ink-muted">
          {[
            `${f.orders} orders`,
            `LTV ${formatINR(f.lifetimeValue)}`,
            `${f.rtoItems} RTO / ${f.cancelledItems} cancelled items`,
            `${f.prepaidOrders} prepaid · ${f.partialOrders} partial · ${f.codOrders} COD`,
            f.activeMinutes != null ? `${f.activeMinutes} min on site in ${f.windowDays} days` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </CardBody>
    </Card>
  );
}

function SmallList({ items, empty, render }) {
  if (!items?.length) return <p className="text-sm text-ink-muted">{empty}</p>;
  return <ul className="divide-y divide-line text-sm">{items.map(render)}</ul>;
}

export function Customer360View({ data }) {
  const { customer: c, summary: s, engagement: e, crm } = data;
  const full = data.tier === "full";
  const f = data.financials;

  return (
    <div className="space-y-4">
      <StatGrid>
        <StatCard label="Orders" value={formatNumber(s.orders)} hint={`${s.delivered} delivered · ${s.inProgress} in progress · ${s.cancelled} cancelled`} icon={Package} />
        <StatCard label="Lifetime value (delivered)" value={formatINR(s.lifetimeValue)} hint={`Avg order ${formatINR(s.avgOrderValue)}`} icon={IndianRupee} tone="info" />
        <StatCard
          label="Last order"
          value={ago(s.daysSinceLastOrder)}
          hint={s.avgDaysBetweenOrders ? `Orders every ~${s.avgDaysBetweenOrders} days · next ~${formatDate(s.nextOrderExpectedAt)}` : `First order ${formatDate(s.firstOrderAt)}`}
          icon={CalendarClock}
          tone="neutral"
        />
        <StatCard
          label="RTO rate"
          value={formatPercent(s.rtoRate)}
          hint={`${s.rto} RTO · ${formatPercent(s.successRate)} delivery success`}
          icon={RotateCcw}
          tone={s.rtoRate >= 30 ? "danger" : s.rtoRate > 0 ? "warning" : "brand"}
        />
      </StatGrid>

      {full && f && (
        <StatGrid>
          <StatCard label="Profit contributed" value={formatINR(f.profitContributed)} hint="Delivered lines only" icon={TrendingUp} />
          <StatCard label="Discounts given" value={formatINR(f.discountsGiven)} hint={f.couponsUsed.length ? `Coupons: ${f.couponsUsed.join(", ")}` : "No coupon used"} tone="warning" />
          <StatCard label="RTO loss (order value)" value={formatINR(f.rtoLoss)} hint={`Refunds ${formatINR(f.refunds)}`} icon={RotateCcw} tone={f.rtoLoss > 0 ? "danger" : "neutral"} />
          <StatCard label="Wallet balance" value={formatINR(f.walletBalance)} icon={Wallet} tone="neutral" />
        </StatGrid>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <ScoreCard score={data.score} />
        <div className="min-w-0 xl:col-span-2">
          <Insights segment={data.segment} insights={data.insights} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Activity, last 12 months" description="Orders placed, product pages opened and searches on the website, per month." />
            <CardBody>
              <BarChart
                data={data.trend}
                series={[
                  { key: "orders", label: "Orders", color: "var(--chart-1)" },
                  { key: "opens", label: "Product opens", color: "var(--chart-2)" },
                  { key: "searches", label: "Searches", color: "var(--chart-3)" },
                ]}
                label="Customer activity by month"
                height={200}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Order history" description={`Latest ${data.orders.length} of ${s.orders} orders${s.salesAssisted ? ` · ${s.salesAssisted} placed by the sales team` : ""}`} />
            <MiniTable
              columns={[
                {
                  key: "orderId",
                  label: "Order",
                  render: (o) => (
                    <Link href={`/admin/orders/${encodeURIComponent(o.orderId)}`} className="font-mono text-xs text-brand-700 hover:underline">
                      {o.orderId}
                    </Link>
                  ),
                },
                { key: "createdAt", label: "Placed", render: (o) => formatDate(o.createdAt) },
                {
                  key: "items",
                  label: "Products",
                  wrap: true,
                  render: (o) => (
                    <span className="block max-w-80 whitespace-normal text-ink-soft">
                      {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </span>
                  ),
                },
                { key: "status", label: "Status", render: (o) => <StatusBadge status={o.status || o.bucket} /> },
                { key: "paymentMode", label: "Payment", render: (o) => PAYMENT_LABELS[String(o.paymentMode).toLowerCase()] ?? (o.paymentMode || "—") },
                { key: "channel", label: "Placed via", render: (o) => [o.channel, o.salesman].filter(Boolean).join(" · ") || "—" },
                { key: "value", label: "Value", align: "right", render: (o) => formatINR(o.value) },
                { key: "discount", label: "Discount", align: "right", render: (o) => (o.discount ? `${formatINR(o.discount)}${o.coupon ? ` (${o.coupon})` : ""}` : "—") },
                { key: "profit", label: "Profit", align: "right", render: (o) => formatINR(o.profit) },
                { key: "refund", label: "Refund", align: "right", render: (o) => (o.refund ? formatINR(o.refund) : "—") },
                { key: "address", label: "Delivery address", wrap: true, render: (o) => <span className="block max-w-64 whitespace-normal text-ink-soft">{o.address || "—"}</span> },
              ]}
              rows={data.orders.map((o) => ({ ...o, id: o.orderId }))}
              empty="No orders."
            />
          </Card>

          <Card>
            <CardHeader title="Products bought" description={`${s.distinctProducts} products · ${formatNumber(s.itemsBought)} units in all`} />
            <MiniTable
              columns={[
                { key: "name", label: "Product", render: (p) => <ProductLink name={p.name} url={p.url} sub={p.sku} /> },
                { key: "category", label: "Category", render: (p) => p.category || "—" },
                { key: "orders", label: "Orders", align: "right", render: (p) => formatNumber(p.orders) },
                { key: "qty", label: "Units", align: "right", render: (p) => `${formatNumber(p.qty)} (${p.delivered} delivered)` },
                { key: "lastBoughtAt", label: "Last bought", render: (p) => formatDate(p.lastBoughtAt) },
                { key: "avgGapDays", label: "Buys every", render: (p) => (p.avgGapDays ? `~${p.avgGapDays} days` : "—") },
                ...(full ? [{ key: "spend", label: "Spend", align: "right", render: (p) => formatINR(p.spend) }] : []),
              ]}
              rows={data.products.map((p) => ({ ...p, id: p.productId || p.sku }))}
              empty="No products."
            />
          </Card>

          <Card>
            <CardHeader
              title="Interested but not bought"
              description="Products this customer opened on the website and never ordered. Best cross-sell list for the next call."
            />
            <MiniTable
              columns={[
                { key: "name", label: "Product", render: (v) => <ProductLink name={v.name} url={v.url} sub={v.sku} /> },
                { key: "opens", label: "Times opened", align: "right", render: (v) => formatNumber(v.opens) },
                { key: "firstAt", label: "First opened", render: (v) => formatDateTime(v.firstAt) },
                { key: "lastAt", label: "Last opened", render: (v) => formatDateTime(v.lastAt) },
              ]}
              rows={e.interestedNotBought.map((v) => ({ ...v, id: v.productId }))}
              empty="Every product this customer opened was also bought, or no product opens are tracked."
            />
          </Card>

          <Card>
            <CardHeader title="Search terms" description={`${formatNumber(e.searches)} searches · ${formatNumber(e.uniqueTerms)} distinct terms`} />
            <MiniTable
              columns={[
                { key: "term", label: "Search term", render: (t) => <span className="font-medium text-ink">{t.term}</span> },
                { key: "times", label: "Times", align: "right", render: (t) => formatNumber(t.times) },
                { key: "results", label: "Results found", align: "right", render: (t) => (t.results == null ? "—" : formatNumber(t.results)) },
                { key: "lastAt", label: "Last searched", render: (t) => formatDateTime(t.lastAt) },
              ]}
              rows={e.topTerms.map((t) => ({ ...t, id: t.term }))}
              empty="No searches tracked for this customer."
            />
          </Card>

          {full && (
            <>
              <Card>
                <CardHeader title="Returns" />
                <MiniTable
                  columns={[
                    { key: "returnId", label: "Return", render: (r) => <Link href={`/admin/returns/${r.id}`} className="font-mono text-xs text-brand-700 hover:underline">{r.returnId || r.id}</Link> },
                    { key: "product", label: "Product", render: (r) => <span className="block max-w-64 truncate">{r.product}</span> },
                    { key: "reason", label: "Reason", render: (r) => r.reason || "—" },
                    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                    { key: "refundAmount", label: "Refund", align: "right", render: (r) => formatINR(r.refundAmount) },
                  ]}
                  rows={data.returns}
                  empty="No returns."
                />
              </Card>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader title="Support tickets" />
                  <CardBody>
                    <SmallList
                      items={data.tickets}
                      empty="No tickets."
                      render={(t) => (
                        <li key={t.id} className="flex items-center justify-between gap-2 py-2">
                          <Link href={`/admin/support/${t.id}`} className="truncate text-brand-700 hover:underline">
                            {t.subject}
                          </Link>
                          <StatusBadge status={t.status} />
                        </li>
                      )}
                    />
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Reviews" />
                  <CardBody>
                    <SmallList
                      items={data.reviews}
                      empty="No reviews."
                      render={(r) => (
                        <li key={r.id} className="py-2">
                          <p className="font-medium text-ink">
                            {"★".repeat(r.rating)}
                            <span className="text-ink-muted">{"★".repeat(Math.max(0, 5 - r.rating))}</span> <span className="font-normal text-ink-soft">{r.product}</span>
                          </p>
                          {r.comment && <p className="text-ink-soft">{r.comment}</p>}
                        </li>
                      )}
                    />
                  </CardBody>
                </Card>
              </div>
              <Card>
                <CardHeader title="Wallet transactions" />
                <MiniTable
                  columns={[
                    { key: "createdAt", label: "Date", render: (w) => formatDateTime(w.createdAt) },
                    { key: "type", label: "Type", render: (w) => <StatusBadge status={w.type} /> },
                    { key: "orderId", label: "Order", render: (w) => w.orderId || "—" },
                    { key: "remark", label: "Remark", render: (w) => w.remark || "—" },
                    { key: "amount", label: "Amount", align: "right", render: (w) => formatINR(w.amount) },
                    { key: "balance", label: "Balance", align: "right", render: (w) => formatINR(w.balance) },
                  ]}
                  rows={data.wallet}
                  empty="No wallet activity."
                />
              </Card>
            </>
          )}

          <Card>
            <CardHeader title="Timeline" description="Orders, CRM calls and lead updates in one feed, newest first." />
            <CardBody>
              <Timeline
                items={data.timeline.map((t, i) => ({
                  id: `${t.kind}-${i}`,
                  title: t.title,
                  description: t.detail,
                  meta: formatDateTime(t.at),
                  tone: t.tone,
                }))}
              />
            </CardBody>
          </Card>
        </div>

        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Profile" actions={!full && <Badge tone="neutral"><Lock className="size-3" aria-hidden /> Limited view</Badge>} />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  {
                    label: "Mobile",
                    value: c.mobile ? (
                      <a href={`tel:+91${String(c.mobile).slice(-10)}`} className="inline-flex items-center gap-1 font-mono text-brand-700 hover:underline">
                        <Phone className="size-3.5" aria-hidden /> {c.mobile}
                      </a>
                    ) : (
                      "—"
                    ),
                  },
                  c.alternateMobile && { label: "Alternate mobile", value: c.alternateMobile },
                  full && { label: "Email", value: c.email || "—" },
                  { label: "Location", value: [c.city, c.state, c.pincode].filter(Boolean).join(", ") || "—" },
                  { label: "Customer type", value: c.customerType || "Farmer" },
                  { label: "Crop · season", value: [c.crop, c.season].filter(Boolean).join(" · ") || "—" },
                  (c.soil || c.water) && { label: "Soil · water", value: [c.soil, c.water].filter(Boolean).join(" · ") },
                  c.landHolding && { label: "Land holding", value: c.landHolding },
                  { label: "Preferred payment", value: PAYMENT_LABELS[s.preferredPayment] ?? s.preferredPayment ?? "—" },
                  { label: "Customer since", value: formatDate(c.joinedAt) },
                  { label: "Last login", value: formatDateTime(c.lastLoginAt) },
                  full && { label: "Login method", value: c.loginMethod || "—" },
                ]}
              />
            </CardBody>
          </Card>

          {data.reorderDue.length > 0 && (
            <Card>
              <CardHeader title="Reorder due" description="Products bought more than once, by the usual gap between purchases." />
              <CardBody>
                <SmallList
                  items={data.reorderDue}
                  render={(r) => (
                    <li key={r.name} className="flex items-start justify-between gap-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink" title={r.name}>
                          {r.name}
                        </span>
                        <span className="text-xs text-ink-muted">Every ~{r.avgGapDays} days · last {formatDate(r.lastBoughtAt)}</span>
                      </span>
                      <Badge tone={r.dueInDays < 0 ? "warning" : "info"}>{r.dueInDays < 0 ? `${-r.dueInDays}d overdue` : `in ${r.dueInDays}d`}</Badge>
                    </li>
                  )}
                />
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Cart & wishlist" description="Items waiting on the website right now." />
            <CardBody className="space-y-3">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink-muted uppercase">
                  <ShoppingCart className="size-3.5" aria-hidden /> In cart ({data.cart.length})
                </p>
                <SmallList
                  items={data.cart}
                  empty="Cart is empty."
                  render={(it) => (
                    <li key={`${it.productId}-${it.sku}`} className="flex items-center justify-between gap-2 py-1.5">
                      <ProductLink name={it.name} url={it.url} sub={it.sku} />
                      <span className="shrink-0 text-xs text-ink-muted">×{it.qty} · {ago(it.days)}</span>
                    </li>
                  )}
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-ink-muted uppercase">Wishlist ({data.wishlist.length})</p>
                <SmallList items={data.wishlist} empty="Wishlist is empty." render={(it) => <li key={`${it.productId}-${it.sku}`} className="py-1.5"><ProductLink name={it.name} url={it.url} /></li>} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Buys from categories" />
            <CardBody>
              {data.categories.length ? <HBarList data={data.categories.map((x) => ({ label: x.name, value: x.qty }))} format={(v) => `${formatNumber(v)} units`} /> : <p className="text-sm text-ink-muted">No category data.</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Website engagement" description={e.lastSeenAt ? `Last seen ${formatDateTime(e.lastSeenAt)}` : "Not seen on the website yet"} />
            <CardBody className="space-y-4">
              <DescriptionList
                columns={2}
                items={[
                  { label: "Product opens", value: formatNumber(e.productOpens) },
                  { label: "Products viewed", value: formatNumber(e.productsViewed) },
                  { label: "Searches", value: formatNumber(e.searches) },
                  { label: "Viewed → bought", value: formatPercent(e.viewToBuyRate) },
                  { label: "First seen", value: formatDate(e.firstSeenAt) },
                  { label: "Payment split", value: s.paymentModes.map((p) => `${PAYMENT_LABELS[p.mode] ?? p.mode} ${p.orders}`).join(" · ") || "—" },
                ]}
              />
              {e.sources.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink-muted uppercase">Comes from</p>
                  <HBarList data={e.sources.map((x) => ({ label: SOURCE_LABELS[x.source] ?? x.source, value: x.opens }))} format={(v) => `${formatNumber(v)} opens`} />
                </div>
              )}
              {full && e.devices?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink-muted uppercase">Devices</p>
                  <ul className="space-y-1 text-sm">
                    {e.devices.map((d) => (
                      <li key={d.device} className="flex justify-between gap-2">
                        <span className="capitalize">{d.device}</span>
                        <span className="text-ink-muted">{[d.city, d.region].filter(Boolean).join(", ")} · {formatNumber(d.events)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="CRM" description={crm.leads.length ? `${crm.leads.length} lead${crm.leads.length === 1 ? "" : "s"} for this mobile` : "No lead for this mobile"} />
            <CardBody className="space-y-3">
              <SmallList
                items={crm.leads}
                empty="Not in the lead sheet."
                render={(l) => (
                  <li key={l.id} className="py-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/admin/crm/leads/${l.id}`} className="font-medium text-brand-700 hover:underline">
                        {l.code || `Lead ${l.id}`}
                      </Link>
                      <StatusBadge status={l.status} />
                    </div>
                    <p className="text-xs text-ink-muted">
                      {[l.source, l.agent && `Agent: ${l.agent}`, l.priority, formatDate(l.createdAt)].filter(Boolean).join(" · ")}
                    </p>
                    {(l.productInterest || l.lastNote) && <p className="mt-1 text-ink-soft">{[l.productInterest && `Interest: ${l.productInterest}`, l.lastNote].filter(Boolean).join(" — ")}</p>}
                    {l.nextFollowUp && <p className="text-xs text-warning-ink">Follow-up {formatDate(l.nextFollowUp)}</p>}
                  </li>
                )}
              />
              {crm.calls.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink-muted uppercase">Recent calls</p>
                  <SmallList
                    items={crm.calls.slice(0, 6)}
                    render={(call) => (
                      <li key={call.id} className="py-1.5">
                        <p className="font-medium text-ink">
                          {call.status || "Call"} <span className="font-normal text-ink-muted">· {formatDateTime(call.at)}</span>
                        </p>
                        <p className="text-xs text-ink-soft">{[call.note, call.agent].filter(Boolean).join(" — ")}</p>
                      </li>
                    )}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {data.agronomist && (
            <Card>
              <CardHeader title="Krishi Salahkar (AI) chats" description={`${data.agronomist.chats} chat${data.agronomist.chats === 1 ? "" : "s"} · last ${formatDateTime(data.agronomist.lastMessageAt)}`} />
              <CardBody>
                <DescriptionList
                  columns={1}
                  items={[
                    { label: "Summary", value: data.agronomist.summary || "—" },
                    { label: "Problem", value: data.agronomist.problem || "—" },
                    { label: "Product interest", value: data.agronomist.productInterest || "—" },
                    { label: "Crop", value: data.agronomist.crop || "—" },
                  ]}
                />
              </CardBody>
            </Card>
          )}

          {full && (
            <>
              <Card>
                <CardHeader title="Address book" />
                <CardBody>
                  <SmallList
                    items={data.addresses}
                    empty="No saved address."
                    render={(a, i) => (
                      <li key={i} className="py-2">
                        <p className="font-medium text-ink">
                          {a.name} {a.type && <span className="text-xs font-normal text-ink-muted">({a.type})</span>}
                        </p>
                        <p className="text-ink-soft">{[a.line, a.city, a.state, a.pincode].filter(Boolean).join(", ")}</p>
                        {a.mobile && <p className="text-xs text-ink-muted">{a.mobile}</p>}
                      </li>
                    )}
                  />
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Recent logins" />
                <CardBody>
                  <SmallList
                    items={data.logins}
                    empty="No login history."
                    render={(l, i) => (
                      <li key={i} className="py-1.5">
                        <p className="text-ink">
                          {formatDateTime(l.at)} <span className="text-ink-muted">· {l.type}</span>
                        </p>
                        <p className="truncate text-xs text-ink-muted" title={l.userAgent}>
                          {l.ip} · {l.userAgent}
                        </p>
                      </li>
                    )}
                  />
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
