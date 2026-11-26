import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getQuotationDetail } from "@/lib/services/admin/b2b-screens";
import { formatDate, formatDateTime, formatINR, formatNumber, formatPercent } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { QuotationActions } from "@/components/admin/b2b/quotation-actions";
import { QuotationBuyerLink } from "@/components/admin/b2b/quotation-buyer-link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `B2B quotation ${id}` };
}

const STATE_TONE = {
  ready: "success",
  sent: "info",
  viewed: "info",
  converted: "success",
  accepted: "success",
  approval_pending: "warning",
  change_requested: "warning",
  blocked: "danger",
  expired: "danger",
  rejected: "danger",
  cancelled: "neutral",
  superseded: "neutral",
  draft: "neutral",
};

const BUYER_SIDE = { NOT_SENT: "Not sent", SENT: "Sent", VIEWED: "Viewed", CHANGE_REQUESTED: "Change requested", ACCEPTED: "Accepted", REJECTED: "Rejected" };

const quoteLink = (id, label) => (
  <Link href={`/admin/b2b/quotations/${id}`} className="font-mono text-xs text-brand-700 hover:underline">
    {label}
  </Link>
);

export default async function B2bQuotationPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("b2b.quotations");
  if (!allowed) return (<><PageHeader title="B2B quotation" /><PermissionDenied module="B2B quotations" /></>);
  if (!/^\d+$/.test(id)) notFound();

  const result = await getQuotationDetail(id, user).then((data) => ({ data }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="B2B quotation" /><ApiUnavailable error={result.error} what="this quotation" /></>);
  const d = result.data;
  if (!d) notFound();

  const e = d.economics;
  const reasons = d.approval.reasons ?? [];
  const showCost = d.lines.some((l) => l.unitCost != null);
  const showMargin = d.lines.some((l) => l.lineMargin != null);
  const successor = d.supersededById ? d.versions.find((v) => v.id === d.supersededById) : null;

  return (
    <>
      <PageHeader
        title={`Quotation ${d.number}`}
        description={`${d.buyer.businessName || d.buyer.name || "Buyer"} · created ${formatDateTime(d.createdAt)}${d.createdBy ? ` by ${d.createdBy}` : ""}`}
        meta={
          <>
            <Badge tone={STATE_TONE[d.state.code] ?? "neutral"}>{d.state.label}</Badge>
            <Badge tone="neutral">Version {d.version}</Badge>
            <Badge tone="neutral">Buyer: {BUYER_SIDE[d.customerStatus] ?? d.customerStatus}</Badge>
          </>
        }
        actions={
          <>
            {/* Buyer-facing document: buyer-safe fields only, watermarked unless it is a live offer. */}
            <ButtonLink href={`/admin/b2b/quotations/${d.id}/document`} target="_blank" rel="noopener" prefetch={false} size="sm" variant="primary">
              Preview / PDF
            </ButtonLink>
            <ButtonLink href="/admin/b2b/quotations" size="sm">Back to quotations</ButtonLink>
          </>
        }
      />

      <div className="space-y-4">
        {successor && (
          <Notice tone="info" title="This version was replaced">
            The current offer is {quoteLink(successor.id, successor.number)}. This version is kept unchanged for the record.
          </Notice>
        )}
        {d.state.code === "expired" && <Notice tone="warning" title="Expired">Valid until {formatDateTime(d.validUntil)}. Revise it to send the buyer a new version.</Notice>}
        {["approval_pending", "blocked"].includes(d.state.code) && (
          <Notice tone={d.state.code === "blocked" ? "danger" : "warning"} title={d.state.code === "blocked" ? "Blocked by the commercial rules" : "Waiting for manager approval"}>
            {reasons.length ? (
              <ul className="list-disc pl-5">
                {reasons.map((r) => (
                  <li key={r.code}>{r.message || r.code.replace(/_/g, " ").toLowerCase()}</li>
                ))}
              </ul>
            ) : (
              "The commercial engine held this quotation."
            )}
            {d.state.code === "approval_pending" && (
              <p className="mt-1">
                Decide on the <Link href="/admin/b2b/approvals" className="font-medium underline">Approvals</Link> screen.
              </p>
            )}
          </Notice>
        )}
        {d.state.code === "cancelled" && d.lostNote && <Notice tone="info" title="Cancelled">{d.lostNote}</Notice>}
        {d.acceptedAt && (
          <Notice tone="success" title="Accepted by the buyer">
            The buyer verified the OTP, confirmed the delivery address and accepted on {formatDateTime(d.acceptedAt)}. This version can no longer be revised.
          </Notice>
        )}
        {d.state.code === "change_requested" && (
          <Notice tone="warning" title="The buyer asked for a change">
            See the request under Buyer link. Revise the quotation or close the request so the buyer can accept.
          </Notice>
        )}

        <StatGrid>
          <StatCard label="Total payable" value={formatINR(d.totals.totalPayable)} hint={`Value ex-GST ${formatINR(d.totals.valueExGst)} · GST ${formatINR(d.totals.gst)}`} />
          <StatCard label="Valid until" value={d.validUntil ? formatDate(d.validUntil) : "—"} hint={d.validUntil ? formatDateTime(d.validUntil) : "No validity set"} tone={d.state.code === "expired" ? "danger" : "neutral"} />
          {e && <StatCard label="Contribution margin" value={formatPercent(e.cmPct, 2)} hint={`${formatINR(e.contribution)} on value before GST`} tone={e.cmPct < 5 ? "danger" : e.cmPct < 7 ? "warning" : "brand"} />}
          {e && <StatCard label="Take rate" value={formatPercent(e.takeRatePct, 2)} hint={`Platform revenue ${formatINR(e.platformRevenue)}`} tone="info" />}
          {e && <StatCard label="Net shipping" value={formatPercent(e.netShippingPct, 2)} hint={`Shipping ${formatINR(d.totals.shipping)}`} tone={e.netShippingPct > 5 ? "danger" : e.netShippingPct > 4 ? "warning" : "neutral"} />}
        </StatGrid>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader title="Buyer and delivery" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Buyer", value: d.buyer.id ? <Link href={`/admin/b2b/buyers/${d.buyer.id}`} className="text-brand-700 hover:underline">{d.buyer.businessName || d.buyer.name}</Link> : d.buyer.name },
                  { label: "Contact", value: [d.buyer.name, d.buyer.mobile].filter(Boolean).join(" · ") },
                  { label: "Customer type", value: d.buyer.type || "—" },
                  { label: "GSTIN", value: d.buyer.gstin ? <span className="font-mono text-xs">{d.buyer.gstin}</span> : "—" },
                  { label: "Deliver to", value: [d.delivery.address, d.delivery.district, d.delivery.state, d.delivery.pincode].filter(Boolean).join(", ") || "—" },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Payment and validity" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Payment terms", value: d.payment.mode || "—" },
                  d.payment.mode === "Partial Advance" && { label: "Advance", value: `${formatPercent(d.payment.advancePct, 0)} · ${formatINR(d.payment.advanceAmount)}` },
                  { label: "Credit days", value: formatNumber(d.payment.creditDays ?? 0) },
                  { label: "Valid until", value: d.validUntil ? formatDateTime(d.validUntil) : "—" },
                  { label: "Sent", value: d.sentAt ? formatDateTime(d.sentAt) : "Not sent" },
                  d.convertedOrderId && { label: "Order", value: <Link href={`/admin/b2b/orders/${d.convertedOrderId}`} className="text-brand-700 hover:underline">Order #{d.convertedOrderId}</Link> },
                  d.remarks && { label: "Remarks", value: d.remarks },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Approval" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Status", value: <StatusBadge status={d.approval.status} /> },
                  d.approval.approvedBy && { label: "Decided by", value: `${d.approval.approvedBy}${d.approval.approvedAt ? ` · ${formatDateTime(d.approval.approvedAt)}` : ""}` },
                  d.approval.note && { label: "Note", value: d.approval.note },
                  e && { label: "Seller cost", value: formatINR(e.sellerCost) },
                  e && { label: "Variable costs", value: formatINR(e.variableCosts) },
                ]}
              />
            </CardBody>
          </Card>
        </div>

        <QuotationBuyerLink
          id={d.id}
          number={d.number}
          buyerName={d.buyer.name || d.buyer.businessName}
          buyerMobile={d.buyer.mobile}
          validUntil={d.validUntil}
          link={d.customerLink ?? null}
          changeRequests={d.changeRequests ?? []}
          payments={d.payments ?? []}
          whatsapp={d.whatsapp ?? null}
          followups={d.followups ?? []}
          action={d.actions.shareLink}
          canEdit={can(user, "b2b.quotations", "edit")}
        />

        <Card>
          <CardHeader title="Line items" description="Rates exclude GST. Commercial values were calculated on the server when the quotation was saved." />
          <MiniTable
            columns={[
              { key: "name", label: "Product", render: (r) => (<><span className="font-medium text-ink">{r.name}</span><span className="block font-mono text-xs text-ink-muted">{r.sku}</span></>) },
              { key: "quantity", label: "Qty", align: "right", render: (r) => formatNumber(r.quantity) },
              { key: "rate", label: "Rate", align: "right", render: (r) => formatINR(r.rate) },
              { key: "discountPct", label: "Disc.", align: "right", render: (r) => (r.discountPct ? formatPercent(r.discountPct, 1) : "—") },
              { key: "valueExGst", label: "Value ex-GST", align: "right", render: (r) => formatINR(r.valueExGst) },
              { key: "gst", label: "GST", align: "right", render: (r) => `${formatINR(r.gst)} (${formatPercent(r.gstPct, 0)})` },
              { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
              ...(showCost ? [{ key: "unitCost", label: "Seller cost / unit", align: "right", render: (r) => formatINR(r.unitCost) }] : []),
              ...(showMargin ? [{ key: "lineMarginPct", label: "Line margin", align: "right", render: (r) => formatPercent(r.lineMarginPct, 1) }] : []),
            ]}
            rows={d.lines}
            empty="No line items."
          />
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card>
            <CardHeader title="Versions" description="Each change to a sent or approved offer is a new version; older ones never change." />
            <MiniTable
              columns={[
                { key: "number", label: "Quotation", render: (r) => (r.current ? <span className="font-mono text-xs font-semibold">{r.number}</span> : quoteLink(r.id, r.number)) },
                { key: "state", label: "State", render: (r) => <Badge tone={STATE_TONE[r.state.code] ?? "neutral"}>{r.state.label}</Badge> },
                { key: "totalPayable", label: "Total", align: "right", render: (r) => formatINR(r.totalPayable) },
              ]}
              rows={d.versions}
            />
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader title="Timeline" />
            <CardBody>
              <Timeline
                items={d.timeline.map((t, i) => ({
                  id: `${t.at}-${i}`,
                  title: `${t.action.replace(/_/g, " ")}${t.quotationId && t.quotationId !== d.id ? ` (version ${d.versions.find((v) => v.id === t.quotationId)?.version ?? "?"})` : ""}`,
                  description: t.description,
                  meta: `${t.actor || "System"} · ${formatDateTime(t.at)}`,
                  tone: /cancel|reject|block/i.test(t.action) ? "danger" : undefined,
                }))}
              />
            </CardBody>
          </Card>
        </div>

        <QuotationActions id={d.id} actions={d.actions} can={{ add: can(user, "b2b.quotations", "add"), edit: can(user, "b2b.quotations", "edit") }} />
      </div>
    </>
  );
}
