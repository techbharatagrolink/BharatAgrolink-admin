import { loadStock } from "@/lib/services/admin/inventory";
import { qty } from "@/lib/content/admin/inventory";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard, StatGrid } from "@/components/ui/page";
import { EmptyState } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { inventoryPage, LoadError } from "@/components/admin/inventory/inventory-page";
import { ResolveShortfall } from "@/components/admin/inventory/stock-forms";

export const metadata = { title: "Short Orders & Exceptions" };

const CHECKS = [
  { key: "ledger", label: "Balance vs movement ledger", help: "On-hand or reserved does not equal the sum of its movements." },
  { key: "reservations", label: "Reserved vs open holds", help: "Reserved quantity does not equal the open reservations." },
  { key: "legacyDrift", label: "Store stock column drift", help: "The stock column the website reads was changed outside the inventory." },
  { key: "alerts", label: "Alerts vs stock", help: "An item at or below its alert level has no open alert, or an open alert was not closed after restocking." },
];

/** SRS §12.2 / §15: short paid orders to call, reconciliation, stuck holds, event backlog. Nothing is corrected automatically. */
export default async function InventoryExceptionsPage() {
  const { user, canEdit, header, denied } = await inventoryPage({
    title: "Short Orders & Exceptions",
    description: "Checks that keep stock trustworthy. Problems are reported here; nothing is corrected automatically.",
  });
  if (denied) return denied;
  const res = await loadStock(user, "exceptions");
  if (res.error)
    return (
      <>
        {header}
        <LoadError error={res.error} what="the inventory checks" />
      </>
    );
  const data = res.data;
  const rec = data.reconciliation;
  const shortfalls = data.shortfalls ?? [];
  const pending = data.outbox?.PENDING?.count ?? 0;
  const failed = data.outbox?.FAILED?.count ?? 0;
  const notes = data.notifications ?? {};
  const failedNotes = data.failedNotifications ?? [];
  const daily = data.lastDailyCheck;

  return (
    <>
      {header}
      <StatGrid className="xl:grid-cols-7">
        <StatCard label="Short orders to call" value={qty(shortfalls.length)} tone={shortfalls.length ? "danger" : "neutral"} hint="Paid, but stock ran out" />
        <StatCard label="Reconciliation" value={rec.ok ? "OK" : "Mismatch"} tone={rec.ok ? "brand" : "danger"} hint={`Checked ${formatDateTime(rec.generatedAt)}`} />
        <StatCard label="Stuck reservations" value={qty(data.stuckReservations.length)} tone={data.stuckReservations.length ? "danger" : "neutral"} hint="Unpaid holds past expiry" />
        <StatCard label="Events waiting" value={qty(pending)} tone={pending > 100 ? "warning" : "neutral"} hint={data.outbox?.PENDING?.oldest ? `Oldest ${formatDateTime(data.outbox.PENDING.oldest)}` : "Live-update queue"} />
        <StatCard label="Failed events" value={qty(failed)} tone={failed ? "danger" : "neutral"} />
        <StatCard
          label="Alert messages"
          value={qty(notes.SENT ?? 0)}
          hint={`sent · ${qty(notes.PENDING ?? 0)} waiting · ${qty(notes.SKIPPED ?? 0)} skipped`}
          tone="neutral"
        />
        <StatCard label="Failed alert messages" value={qty(notes.FAILED ?? 0)} tone={notes.FAILED ? "danger" : "neutral"} hint={daily ? `Daily check ${formatDateTime(daily.at)}` : "Daily check not run yet"} />
      </StatGrid>
      {daily && <p className="mt-2 text-xs text-ink-muted">Last daily stock check: {formatDateTime(daily.at)}: {daily.summary}</p>}

      <Card className="mt-4">
        <CardHeader
          title="Short orders to call"
          description="The customer paid, but there was not enough stock when the order was saved, so only the units in stock were taken. Call the customer, then record what was agreed."
        />
        {!shortfalls.length ? (
          <EmptyState title="No short orders" description="Every paid order was fully in stock." />
        ) : (
          <ul className="divide-y divide-line">
            {shortfalls.map((s) => (
              <li key={s.id} className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-ink">
                    Order {s.orderId} · {s.productName || s.sku}
                  </p>
                  <p className="text-xs text-ink-muted">
                    SKU {s.sku} · ordered <span className="tabular">{qty(s.orderedQty)}</span>, in stock <span className="tabular">{qty(s.fulfilledQty)}</span>,{" "}
                    <strong className="text-danger-ink">short {qty(s.shortQty)}</strong> · {s.sellerName} · {formatDateTime(s.createdAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Customer: {s.customerName || "—"}
                    {s.customerMobile && (
                      <a href={`tel:${s.customerMobile}`} className="ml-1 font-medium text-brand-700 hover:underline">
                        {s.customerMobile}
                      </a>
                    )}
                    {s.paymentRef && <span className="text-ink-muted"> · payment {s.paymentRef}</span>}
                  </p>
                </div>
                {canEdit ? <ResolveShortfall id={s.id} /> : <span className="text-xs text-ink-muted">Needs edit access to resolve.</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mt-4">
        <CardHeader title="Reconciliation" description="Runs on every visit. A mismatch means stock was changed outside the inventory and must be checked by hand." />
        <ul className="divide-y divide-line">
          {CHECKS.map((c) => {
            const section = rec[c.key] ?? { count: 0, sample: [] };
            return (
              <li key={c.key} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{c.label}</p>
                    <p className="text-xs text-ink-muted">{c.help}</p>
                  </div>
                  <Badge tone={section.count ? "danger" : "success"}>{section.count ? `${qty(section.count)} found` : "None"}</Badge>
                </div>
                {section.count > 0 && (
                  <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-surface-muted p-2 text-xs scrollbar-thin">{(section.sample ?? []).slice(0, 20).map((r) => JSON.stringify(r)).join("\n")}</pre>
                )}
              </li>
            );
          })}
          <li className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Listings without a stock record</p>
              <p className="text-xs text-ink-muted">Not purchasable until stock is set up (Stock Not Set Up).</p>
            </div>
            <Badge tone={rec.unconfigured?.count ? "warning" : "success"}>{qty(rec.unconfigured?.count)}</Badge>
          </li>
        </ul>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Stuck reservations" description="Checkout holds still open 30+ minutes after they should have expired." />
        <MiniTable
          empty="No stuck reservations."
          columns={[
            { key: "order_ref", label: "Order ref", render: (r) => <span className="font-mono text-xs">{r.order_ref}</span> },
            { key: "sku", label: "SKU", render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
            { key: "qty", label: "Qty", align: "right", render: (r) => qty(r.qty) },
            { key: "channel", label: "Channel" },
            { key: "expires_at", label: "Expired at", render: (r) => formatDateTime(r.expires_at) },
          ]}
          rows={data.stuckReservations}
        />
      </Card>

      {data.failedEvents?.length > 0 && (
        <Card className="mt-4">
          <CardHeader title="Failed live-update events" />
          <ul className="divide-y divide-line text-sm">
            {data.failedEvents.map((e) => (
              <li key={e.id} className="px-4 py-2">
                <span className="font-medium text-ink">{e.event_type}</span> · balance {e.aggregate_id} · {e.retry_count} retries
                <span className="block text-xs text-danger-ink">{e.last_error}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {failedNotes.length > 0 && (
        <Card className="mt-4">
          <CardHeader title="Failed alert messages" description="Stock alert emails / SMS / WhatsApp that could not be delivered after every retry. The in-app alert still shows to the seller." />
          <MiniTable
            columns={[
              { key: "updated_at", label: "Last try", render: (r) => <span className="text-xs whitespace-nowrap">{formatDateTime(r.updated_at)}</span> },
              { key: "channel", label: "Channel" },
              { key: "event_type", label: "Alert", render: (r) => String(r.event_type).replace(/_/g, " ").toLowerCase() },
              { key: "sku", label: "SKU", render: (r) => <span className="font-mono text-xs">{r.sku}</span> },
              { key: "attempt_count", label: "Tries", align: "right" },
              { key: "error_message", label: "Error", render: (r) => <span className="text-xs text-danger-ink">{r.error_message}</span> },
            ]}
            rows={failedNotes}
          />
        </Card>
      )}
    </>
  );
}
