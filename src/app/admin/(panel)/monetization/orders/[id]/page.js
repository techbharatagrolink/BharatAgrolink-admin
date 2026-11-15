import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { AD_STATUS, APPROVAL_STATUS, CREATIVE_STATUS, LOG_LABELS, ORDER_STATUS } from "@/lib/content/admin/monetization";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DescriptionList, Notice, Timeline } from "@/components/ui/page";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";
import { OrderActions } from "@/components/admin/monetization/order-actions";

export const metadata = { title: "Banner Order" };

const rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

function Status({ label, map, value, empty = "—" }) {
  const [text, tone] = value ? (map[value] ?? [value, "neutral"]) : [empty, null];
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      {tone ? <Badge tone={tone}>{text}</Badge> : <p className="text-sm text-ink-muted">{text}</p>}
    </div>
  );
}

function Creative({ c, spec }) {
  const [label, tone] = CREATIVE_STATUS[c.status] ?? [c.status, "neutral"];
  return (
    <div className="space-y-2 rounded-lg border border-line p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">Version {c.version}</span>
        <Badge tone={tone}>{label}</Badge>
      </div>
      <div className={c.mobile ? "grid gap-3 md:grid-cols-[2fr_1fr]" : ""}>
        <a href={c.desktop.url} target="_blank" rel="noopener" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element -- seller creative under review */}
          <img src={c.desktop.url} alt={`Version ${c.version}`} className="w-full rounded border border-line bg-surface-muted object-contain" />
          <span className="text-xs text-ink-muted">
            {c.mobile ? "Desktop" : "Image"} {c.desktop.width}×{c.desktop.height}
            {spec ? ` (needs ${spec.desktopWidth}×${spec.desktopHeight})` : ""}
          </span>
        </a>
        {c.mobile ? (
          <a href={c.mobile.url} target="_blank" rel="noopener" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element -- seller creative under review */}
            <img src={c.mobile.url} alt={`Version ${c.version} mobile`} className="w-full rounded border border-line bg-surface-muted object-contain" />
            <span className="text-xs text-ink-muted">
              Mobile {c.mobile.width}×{c.mobile.height}
            </span>
          </a>
        ) : null}
      </div>
      {c.reviewNote ? <p className="text-xs text-ink-soft">Review note: {c.reviewNote}</p> : null}
    </div>
  );
}

export default async function BannerOrderDetailPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, canEdit, header, denied } = await monetizationPage({
    title: "Banner order",
    actions: (
      <ButtonLink href="/admin/monetization/orders" size="sm">
        All banner orders
      </ButtonLink>
    ),
  });
  if (denied) return denied;
  const { data: o, error } = await loadMonetization(user, `orders/${id}`);
  if (error?.code === "ORDER_NOT_FOUND") notFound();
  if (error)
    return (
      <>
        {header}
        <LoadError error={error} what="this banner order" />
      </>
    );
  const a = o.amounts;

  return (
    <>
      {header}
      <Card className="mb-4">
        <CardHeader title={`${o.orderNo} · ${o.title}`} description={`${o.serviceName} · ${o.packageName} (${o.durationDays} days) · ${o.placement?.name ?? o.placementName}`} />
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-3">
          <Status label="Payment" map={ORDER_STATUS} value={o.orderStatus} />
          <Status label="Review" map={APPROVAL_STATUS} value={o.approvalStatus} empty="After payment" />
          <Status label="Ad" map={AD_STATUS} value={o.adStatus} empty="After approval" />
        </div>
        {o.statusReason ? (
          <div className="px-4 pb-4">
            <Notice tone="warning">{o.statusReason}</Notice>
          </div>
        ) : null}
        <div className="border-t border-line px-4 py-3">
          <OrderActions order={o} canEdit={canEdit} />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Creative" description="Newest first. Earlier versions are kept." />
            <div className="space-y-3 px-4 pb-4">
              {o.creatives.map((c) => (
                <Creative key={c.id} c={c} spec={o.spec} />
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Ad details" />
            <div className="px-4 pb-4">
              <DescriptionList
                items={[
                  {
                    label: "Opens",
                    value: (
                      <a href={o.destinationUrl} target="_blank" rel="noopener noreferrer" className="break-all text-brand-700 hover:underline">
                        {o.destinationUrl}
                      </a>
                    ),
                  },
                  { label: "Purpose", value: o.purpose || "—" },
                  { label: "Description", value: o.description || "—" },
                  { label: "Seller wants to start", value: o.preferredStartDate || "Any date" },
                  { label: "Scheduled", value: o.schedule ? `${formatDateTime(o.schedule.startAt)} – ${formatDateTime(o.schedule.endAt)}` : "Not scheduled" },
                  { label: "Placement", value: o.placement ? `${o.placement.name} (${o.placement.maxSlots} slot${o.placement.maxSlots === 1 ? "" : "s"})` : o.placementName },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="History" description="Who did what and when." />
            <div className="px-4 pb-4">
              <Timeline
                items={o.logs.map((l, i) => ({
                  id: `${i}`,
                  title: LOG_LABELS[l.action] ?? l.action,
                  description: l.note || null,
                  meta: `${formatDateTime(l.createdAt)} · ${l.actorType}${l.actorId ? ` ${l.actorId}` : ""}`,
                  tone: ["rejected", "stopped", "payment_failed", "payment_mismatch"].includes(l.action) ? "danger" : ["paused", "revision_requested", "cancelled_by_seller"].includes(l.action) ? "warning" : undefined,
                }))}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Seller" />
            <div className="px-4 pb-4">
              <DescriptionList
                columns={1}
                items={[
                  { label: "Name", value: `${o.seller.name} (${o.seller.id})` },
                  { label: "Billing", value: o.seller.billing ? `${o.seller.billing.legalName || "—"} · ${o.seller.billing.gstin || "No GSTIN"}` : "—" },
                  { label: "Email / phone", value: [o.seller.email, o.seller.phone].filter(Boolean).join(" · ") || "—" },
                ]}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Amount" />
            <div className="space-y-1 px-4 pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Price</span>
                <span>{rupees.format(a.taxable)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">{a.taxType === "INTRA" ? `CGST + SGST ${a.gstRate}%` : `IGST ${a.gstRate}%`}</span>
                <span>{rupees.format(a.cgst + a.sgst + a.igst)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-1 font-medium">
                <span>Total</span>
                <span>{rupees.format(a.total)}</span>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Payments" />
            <ul className="divide-y divide-line px-4 pb-2 text-[13px]">
              {o.payments.length ? (
                o.payments.map((p) => (
                  <li key={p.id} className="py-2">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{p.status}</span>
                      <span>{rupees.format(p.amount)}</span>
                    </div>
                    <div className="text-xs text-ink-muted">
                      {p.gateway_payment_id || p.gateway_order_id} · {p.gateway_mode}
                      {p.verified_via ? ` · verified by ${p.verified_via}` : ""}
                      {p.refund_id ? ` · refund ${p.refund_id}` : ""}
                    </div>
                    {p.error_description ? <div className="text-xs text-danger-ink">{p.error_description}</div> : null}
                  </li>
                ))
              ) : (
                <li className="py-2 text-ink-muted">No payment yet.</li>
              )}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Invoice & credit note" />
            <ul className="space-y-1 px-4 pb-4 text-sm">
              {o.documents.length ? (
                o.documents.map((d) => (
                  <li key={d.id} className="flex justify-between gap-2">
                    <a href={`/admin/monetization/invoices/${d.id}`} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
                      {d.number}
                    </a>
                    <span className="text-ink-muted">
                      {d.docType === "CREDIT_NOTE" ? "Credit note" : "Invoice"} · {d.date}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-ink-muted">Issued after the payment is confirmed.</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
