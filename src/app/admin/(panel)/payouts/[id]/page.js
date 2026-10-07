import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getPayout } from "@/lib/services/admin/payouts";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { DescriptionList, PageHeader, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { PayoutActions } from "@/components/admin/workflows/payout-actions";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Payout ${id}` };
}

export default async function PayoutDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/payouts/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("payouts");
  if (!allowed) return (<><PageHeader title="Payout details" /><PermissionDenied module="vendor payouts" /></>);
  const data = await getPayout(id, user);
  if (!data) notFound();
  const { payout: p, vendor, totals } = data;

  return (
    <>
      <PageHeader
        title={`Payout ${p.id}`}
        description={`${p.vendor} · ${p.cycle}`}
        meta={<StatusBadge status={p.status} />}
        actions={can(user, "payouts", "edit") ? <PayoutActions id={p.id} status={p.status} amount={p.bsa} vendorReady={vendor?.status === "Active" && vendor?.kyc === "Verified"} /> : null}
      />
      <StatGrid>
        <StatCard label="Payable to vendor (BSA)" value={formatINR(totals.bsa)} hint="NRV − TCS" />
        <StatCard label="Gross order value" value={formatINR(totals.gross)} tone="neutral" />
        <StatCard label="TCS deducted" value={formatINR(totals.tcs)} hint="1% of taxable" tone="neutral" />
        <StatCard label="Platform service (ex-GST)" value={formatINR(totals.serviceExGst)} tone="info" />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Payout items" description={`${data.items.length} delivered order lines`} />
          <MiniTable
            columns={[
              { key: "orderId", label: "Order", render: (r) => <Link href={`/admin/orders/${r.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{r.orderId}</Link> },
              { key: "product", label: "Product", render: (r) => <span className="block max-w-56 truncate">{r.product}</span> },
              { key: "deliveryDate", label: "Delivered", render: (r) => formatDate(r.deliveryDate) },
              { key: "gross", label: "Gross", align: "right", render: (r) => formatINR(r.gross) },
              { key: "tcs", label: "TCS", align: "right", render: (r) => formatINR(r.tcs) },
              { key: "bsa", label: "BSA", align: "right", render: (r) => formatINR(r.bsa) },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={data.items}
          />
        </Card>
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Payment" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Vendor", value: vendor ? <Link href={`/admin/vendors/${vendor.id}`} className="text-brand-700 hover:underline">{vendor.name}</Link> : p.vendor },
                  { label: "Bank account", value: <span className="font-mono text-xs">{vendor?.bank ?? "—"}</span> },
                  { label: "KYC", value: vendor?.kyc ?? "—" },
                  { label: "Transaction ID (UTR)", value: p.transactionId ? <span className="font-mono text-xs">{p.transactionId}</span> : "—" },
                  { label: "Proof", value: p.proof ?? "—" },
                  { label: "Paid on", value: formatDateTime(p.paidAt) },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Activity" />
            <CardBody>
              <Timeline items={data.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
