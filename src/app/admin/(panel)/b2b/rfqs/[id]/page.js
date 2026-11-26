import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getRfqComparison, getRfqDetail } from "@/lib/services/admin/b2b-screens";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { InviteSellers, OpenRfqButton, SourcingBoard } from "@/components/admin/b2b/rfq-sourcing";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `RFQ ${id}` };
}

const STATUS_TONE = { converted: "success", lost: "danger", expired: "danger", quote_ready: "info", sent: "info", negotiation: "warning", quotes_received: "info" };
const INVITE_TONE = { quoted: "success", declined: "danger", invited: "neutral", viewed: "info" };
const QUOTE_LABEL = { draft: "Draft", sent: "Sent", converted: "Converted", superseded: "Superseded", cancelled: "Cancelled", rejected: "Rejected" };

/** Screen 10, RFQ Detail (task #107 subtask 4): requirement, sellers, comparison, sourcing, quotation, timeline. */
export default async function RfqDetailPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { user, allowed } = await checkPermission("b2b.rfqs");
  if (!allowed) return (<><PageHeader title="RFQ" /><PermissionDenied module="B2B RFQs" /></>);
  const result = await getRfqDetail(id, user).then((rfq) => ({ rfq }), (error) => ({ error }));
  if (result.error) return (<><PageHeader title="RFQ" /><ApiUnavailable error={result.error} what="the RFQ" /></>);
  const r = result.rfq;
  if (!r) notFound();
  const comparison = r.invites.length ? await getRfqComparison(id, user).catch(() => null) : null;
  const quoted = r.invites.filter((i) => i.quote).length;
  const a = r.actions;

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {a.open && <OpenRfqButton rfqId={r.id} />}
      {a.edit && <ButtonLink href={`/admin/b2b/rfqs/${r.id}/edit`} size="sm">Edit</ButtonLink>}
      {a.invite && <InviteSellers rfqId={r.id} />}
      {a.createQuotation && <ButtonLink href={`/admin/b2b/quotations/new?rfq=${r.id}`} size="sm" variant="primary">Create quotation</ButtonLink>}
      {r.liveQuotation && <ButtonLink href={`/admin/b2b/quotations/${r.liveQuotation.id}`} size="sm">Open {r.liveQuotation.number}</ButtonLink>}
      <ButtonLink href="/admin/b2b/rfqs" size="sm">All RFQs</ButtonLink>
    </div>
  );

  return (
    <>
      <PageHeader
        title={r.number}
        description={`${r.buyer.businessName || r.buyer.name}${r.buyer.type ? ` · ${r.buyer.type}` : ""} · ${[r.delivery.district, r.delivery.state, r.delivery.pincode].filter(Boolean).join(", ")}`}
        meta={
          <>
            <Badge tone={STATUS_TONE[r.status] ?? "neutral"}>{r.statusLabel}</Badge>
            {r.sla.breached && <Badge tone="danger">Quote SLA breached</Badge>}
          </>
        }
        actions={actions}
      />
      {r.status === "lost" && <Notice tone="danger" className="mb-4">Lost: {r.lostReason || "no reason recorded"}</Notice>}
      <StatGrid>
        <StatCard label="Lines" value={r.lines.length} tone="neutral" />
        <StatCard label="Sellers invited" value={r.invites.length} hint={`${quoted} quoted`} tone="info" />
        <StatCard label="Required by" value={r.requiredDate ? formatDate(r.requiredDate) : "—"} tone="neutral" />
        <StatCard
          label="Quote SLA"
          value={r.sla.dueAt ? formatDateTime(r.sla.dueAt) : "Not started"}
          hint={r.sla.stopped ? "Customer quotation made" : r.sla.breached ? "Breached: no customer quotation yet" : r.sla.minutes ? `${r.sla.minutes} min from opening` : undefined}
          tone={r.sla.breached ? "danger" : "neutral"}
        />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Requirement" />
            <MiniTable
              columns={[
                { key: "requirement", label: "Line", render: (l) => <span className="block max-w-96">{l.product || l.requirement}{l.product && l.requirement && l.requirement !== l.product && <span className="block text-xs text-ink-muted">{l.requirement}</span>}{!l.productId && <span className="block text-xs text-ink-muted">Free text{l.pack ? ` · ${l.pack}` : ""}</span>}</span> },
                { key: "quantity", label: "Quantity", align: "right", render: (l) => `${l.quantity} ${l.uom}` },
                ...(r.canViewCost ? [{ key: "targetRate", label: "Target rate", align: "right", render: (l) => (l.targetRate != null ? formatINR(l.targetRate) : "—") }] : []),
                { key: "stock", label: "Catalog stock", align: "right", render: (l) => (l.stock == null ? "—" : l.stock) },
              ]}
              rows={r.lines}
            />
          </Card>

          <Card>
            <CardHeader title="Sellers" description="Invited sellers see the requirement in their B2B panel without the buyer's identity or target rate." />
            <MiniTable
              columns={[
                { key: "seller", label: "Seller" },
                { key: "status", label: "Invite", render: (i) => <Badge tone={INVITE_TONE[i.status] ?? "neutral"}>{i.status}</Badge> },
                { key: "quote", label: "Quote", render: (i) => (i.quote ? `${i.quote.status}${i.quote.expired ? " (expired)" : ""}` : i.declineNote ? `Declined: ${i.declineNote}` : "—") },
                { key: "dispatch", label: "Dispatch", align: "right", render: (i) => (i.quote?.dispatchTimeHours ? `${i.quote.dispatchTimeHours} h` : "—") },
                ...(r.canViewCost ? [{ key: "total", label: "Quote value", align: "right", render: (i) => (i.quote?.total != null ? formatINR(i.quote.total) : "—") }] : []),
                { key: "validUntil", label: "Valid until", render: (i) => (i.quote?.validUntil ? formatDateTime(i.quote.validUntil) : "—") },
              ]}
              rows={r.invites.map((i) => ({ ...i, id: i.sellerId }))}
              empty={a.invite ? "No seller invited yet. Use Invite sellers." : "No seller invited."}
            />
          </Card>

          {comparison && <SourcingBoard rfqId={r.id} comparison={comparison} canSource={a.source} />}
          {r.liveQuotation && <Notice tone="info">The sourcing is locked while quotation {r.liveQuotation.number} is open. Cancel it to change the sourcing.</Notice>}

          <Card>
            <CardHeader title="Customer quotations" />
            <MiniTable
              columns={[
                { key: "number", label: "Quotation", render: (q) => <Link href={`/admin/b2b/quotations/${q.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{q.number}</Link> },
                { key: "status", label: "Status", render: (q) => QUOTE_LABEL[q.status] ?? q.status },
                { key: "approvalStatus", label: "Approval", render: (q) => String(q.approvalStatus || "").replace(/_/g, " ") },
                { key: "totalPayable", label: "Total", align: "right", render: (q) => formatINR(q.totalPayable) },
                { key: "createdAt", label: "Created", render: (q) => formatDateTime(q.createdAt) },
              ]}
              rows={r.quotations}
              empty={r.sourced ? "Sourcing chosen. Create the quotation." : "Choose the sourcing first."}
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Buyer", value: r.buyer.id ? <Link href={`/admin/b2b/buyers/${r.buyer.id}`} className="text-brand-700 hover:underline">{r.buyer.businessName || r.buyer.name}</Link> : r.buyer.name },
                  { label: "Payment", value: `${r.paymentMode || "—"}${r.paymentMode === "Credit" ? ` · ${r.creditDays} days requested` : ""}` },
                  { label: "Preferred brands", value: r.preferredBrands || "—" },
                  { label: "Owner", value: r.owner.name },
                  { label: "Created", value: formatDateTime(r.createdAt) },
                  { label: "Internal notes", value: r.internalNotes || "—" },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Timeline" />
            <CardBody>
              <Timeline items={r.timeline.map((t) => ({ id: t.id, title: t.description || t.action, meta: `${t.by} · ${formatDateTime(t.at)}` }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
