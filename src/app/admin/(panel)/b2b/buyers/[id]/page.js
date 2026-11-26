import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getBuyer } from "@/lib/services/admin/pipeline";
import { formatDate, formatINR, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { getBuyerCredit, getCrmOptions } from "@/lib/services/admin/b2b-screens";
import { BuyerCredit } from "@/components/admin/b2b/buyer-credit";
import { BuyerActivity, BuyerCrmProfile } from "@/components/admin/b2b/buyer-crm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Buyer ${id}` };
}

export default async function BuyerDetailPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("b2b.buyers");
  if (!allowed) return (<><PageHeader title="Buyer 360" /><PermissionDenied module="B2B buyers" /></>);
  const data = await getBuyer(id, user);
  if (!data) notFound();
  const { buyer: b, totals } = data;
  const showFinance = can(user, "b2b.finance") || can(user, "b2b.buyers", "edit");
  // Credit account from the finance ledger (subtask 11); the API hides it from roles without access.
  const credit = await getBuyerCredit(id, user).catch(() => null);
  const position = credit?.position;
  // Lead / CRM options (subtask 2); the page still works if they cannot be loaded.
  const options = await getCrmOptions(user).catch(() => null);
  const canEdit = can(user, "b2b.buyers", "edit");
  const perf = data.performance;

  return (
    <>
      <PageHeader title={b.firm} description={`${b.id} · ${b.type} · ${b.district}, ${b.state}`} meta={<><Badge tone="info">{b.segment}</Badge><StatusBadge status={b.status} /></>} />
      <StatGrid>
        <StatCard label="Lifetime GMV" value={formatINR(b.lifetimeGmv, { compact: true })} />
        <StatCard label="Orders here" value={data.orders.length} hint={formatINR(totals.orderValue, { compact: true })} tone="neutral" />
        {showFinance && position && (
          <StatCard label="Credit available" value={position.status === "none" ? "No credit" : formatINR(position.available)} hint={position.status === "none" ? "Not approved by Finance" : `Limit ${formatINR(position.limit)} · ${position.days} days · ${position.statusLabel}`} tone="info" />
        )}
        {perf && <StatCard label="Delivered GMV" value={formatINR(perf.deliveredGmv, { compact: true })} hint={`AOV ${formatINR(perf.aov, { compact: true })}${perf.repeat ? " · repeat buyer" : ""}`} tone="neutral" />}
        {perf && (perf.claims > 0 || perf.rtoReturns > 0) && <StatCard label="Claims / RTO" value={`${perf.claims} / ${perf.rtoReturns}`} tone="warning" />}
        {showFinance && <StatCard label="Outstanding" value={formatINR(b.outstanding)} hint={totals.overdue ? `${formatINR(totals.overdue)} overdue` : "Nothing overdue"} tone={totals.overdue ? "danger" : "warning"} />}
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4">
        <Card>
          <CardHeader title="Profile" />
          <CardBody>
            <DescriptionList
              columns={1}
              items={[
                { label: "Contact", value: b.contact },
                { label: "Mobile", value: can(user, "b2b.buyers", "edit") ? `+91 ${b.mobile}` : maskMobile(b.mobile) },
                { label: "GSTIN", value: b.gstin ? <span className="font-mono text-xs">{b.gstin}</span> : "Not registered" },
                { label: "Owner", value: b.owner },
                { label: "Next follow-up", value: formatDate(b.nextFollowUp) },
              ]}
            />
          </CardBody>
        </Card>
        <BuyerCrmProfile buyerId={id} crm={data.crm} can={{ ...data.crmCan, edit: canEdit }} options={options} lead={data.crmLead} />
        <BuyerCredit buyerId={id} credit={credit} />
        </div>
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <BuyerActivity buyerId={id} openTasks={data.openTasks} timeline={data.timeline} options={options} canLog={canEdit} />
          <Card>
            <CardHeader title="RFQs" />
            <MiniTable
              columns={[
                { key: "id", label: "RFQ", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                { key: "lines", label: "Lines", align: "right" },
                { key: "estValue", label: "Est. value", align: "right", render: (r) => formatINR(r.estValue) },
                { key: "paymentMode", label: "Payment" },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
              ]}
              rows={data.rfqs}
              empty="No RFQs from this buyer."
              exportName={`buyer-${b.id}-rfqs`}
            />
          </Card>
          <Card>
            <CardHeader title="Orders" />
            <MiniTable
              columns={[
                { key: "id", label: "Order", render: (r) => <Link href={`/admin/b2b/orders/${r.id}`} className="font-mono text-xs font-medium text-brand-700 hover:underline">{r.id}</Link> },
                { key: "seller", label: "Seller", render: (r) => <span className="block max-w-40 truncate">{r.seller}</span> },
                { key: "value", label: "Value", align: "right", render: (r) => formatINR(r.value) },
                { key: "paymentStatus", label: "Payment", render: (r) => <StatusBadge status={r.paymentStatus} /> },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={data.orders}
              empty="No orders yet."
              exportName={`buyer-${b.id}-orders`}
            />
          </Card>
          {data.claims.length > 0 && (
            <Card>
              <CardHeader title="Claims" />
              <MiniTable
                columns={[
                  { key: "id", label: "Claim", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                  { key: "type", label: "Type" },
                  { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                ]}
                rows={data.claims}
                exportName={`buyer-${b.id}-claims`}
              />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
