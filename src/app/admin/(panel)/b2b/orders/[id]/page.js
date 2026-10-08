import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getB2BOrder } from "@/lib/services/admin/pipeline";
import { formatDate, formatDateTime, formatINR, formatPercent } from "@/lib/format";
import { DescriptionList, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `B2B order ${id}` };
}

export default async function B2BOrderPage({ params }) {
  const { id } = await params;
  const { user, allowed } = await checkPermission("b2b.orders");
  if (!allowed) return (<><PageHeader title="B2B order" /><PermissionDenied module="B2B orders" /></>);
  const data = await getB2BOrder(id, user);
  if (!data) notFound();
  const { order: o, quotation: q } = data;

  return (
    <>
      <PageHeader title={`B2B order ${o.id}`} description={`${o.buyer} · placed ${formatDateTime(o.createdAt)}`} meta={<><StatusBadge status={o.status} /><StatusBadge status={o.paymentStatus} /></>} />
      <StatGrid>
        <StatCard label="Order value" value={formatINR(o.value)} />
        {data.showFinance && <StatCard label="Seller cost" value={formatINR(o.sellerCost)} tone="neutral" />}
        {data.showFinance && <StatCard label="Platform revenue" value={formatINR(o.platformRevenue)} tone="info" />}
        {data.showFinance && <StatCard label="Contribution" value={formatINR(o.contribution)} hint={formatPercent((o.contribution / o.value) * 100)} tone={o.contribution / o.value < 0.05 ? "danger" : "brand"} />}
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Order" />
          <CardBody>
            <DescriptionList
              columns={1}
              items={[
                { label: "Buyer", value: data.buyer ? <Link href={`/admin/b2b/buyers/${data.buyer.id}`} className="text-brand-700 hover:underline">{data.buyer.firm}</Link> : o.buyer },
                { label: "Seller", value: o.seller },
                { label: "Quotation", value: q ? <span className="font-mono text-xs">{q.id}</span> : "—" },
                { label: "LR / AWB", value: o.awb ? <span className="font-mono text-xs">{o.awb}</span> : "Not dispatched" },
                { label: "Owner", value: o.owner },
              ]}
            />
          </CardBody>
        </Card>
        <div className="min-w-0 space-y-4 xl:col-span-2">
          {q && (
            <Card>
              <CardHeader title="Quotation economics" description="Manager approval is required when CM is below 5% or net shipping is above 5%." />
              <CardBody>
                <DescriptionList
                  columns={3}
                  items={[
                    { label: "Quoted value", value: formatINR(q.value) },
                    ...(data.showFinance
                      ? [
                          { label: "Take rate", value: formatPercent(q.takeRate) },
                          { label: "Contribution margin", value: <span className={q.cmPercent < 5 ? "font-medium text-danger-ink" : ""}>{formatPercent(q.cmPercent)}</span> },
                        ]
                      : []),
                    { label: "Net shipping", value: <span className={q.netShippingPercent > 5 ? "font-medium text-danger-ink" : ""}>{formatPercent(q.netShippingPercent)}</span> },
                    { label: "Approval", value: <StatusBadge status={q.approval} /> },
                    { label: "Valid till", value: formatDate(q.validTill) },
                  ]}
                />
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Payments" />
            <MiniTable
              columns={[
                { key: "id", label: "Payment", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                { key: "mode", label: "Mode" },
                { key: "reference", label: "Reference", render: (r) => <span className="font-mono text-xs">{r.reference}</span> },
                { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                { key: "dueDate", label: "Due", render: (r) => formatDate(r.dueDate) },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
              ]}
              rows={data.payments}
              empty="No payments recorded."
            />
          </Card>
          {data.settlements.length > 0 && (
            <Card>
              <CardHeader title="Seller settlement" />
              <MiniTable
                columns={[
                  { key: "id", label: "Settlement", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                  { key: "grossPayable", label: "Gross", align: "right", render: (r) => formatINR(r.grossPayable) },
                  { key: "deductions", label: "Deductions", align: "right", render: (r) => formatINR(r.deductions) },
                  { key: "netPayable", label: "Net", align: "right", render: (r) => formatINR(r.netPayable) },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                ]}
                rows={data.settlements}
              />
            </Card>
          )}
          {data.claims.length > 0 && (
            <Card>
              <CardHeader title="Claims" />
              <MiniTable
                columns={[
                  { key: "id", label: "Claim", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
                  { key: "type", label: "Type" },
                  { key: "amount", label: "Amount", align: "right", render: (r) => formatINR(r.amount) },
                  { key: "owner", label: "Owner" },
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
