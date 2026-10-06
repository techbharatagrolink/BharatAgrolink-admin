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

  return (
    <>
      <PageHeader title={b.firm} description={`${b.id} · ${b.type} · ${b.district}, ${b.state}`} meta={<><Badge tone="info">{b.segment}</Badge><StatusBadge status={b.status} /></>} />
      <StatGrid>
        <StatCard label="Lifetime GMV" value={formatINR(b.lifetimeGmv, { compact: true })} />
        <StatCard label="Orders here" value={data.orders.length} hint={formatINR(totals.orderValue, { compact: true })} tone="neutral" />
        {showFinance && <StatCard label="Credit available" value={formatINR(b.availableCredit)} hint={`Limit ${formatINR(b.creditLimit)}`} tone="info" />}
        {showFinance && <StatCard label="Outstanding" value={formatINR(b.outstanding)} hint={totals.overdue ? `${formatINR(totals.overdue)} overdue` : "Nothing overdue"} tone={totals.overdue ? "danger" : "warning"} />}
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
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
        <div className="min-w-0 space-y-4 xl:col-span-2">
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
              />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
