import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { getCustomer } from "@/lib/services/admin/people";
import { formatDate, formatINR, formatNumber, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Customer ${id}` };
}

const loginLabels = { general: "Mobile OTP", guest: "Guest checkout", google: "Google" };

export default async function CustomerDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/customers/${id}`, searchParams);
  if (fallback) return fallback;

  const { allowed } = await checkPermission("customers");
  if (!allowed) return (<><PageHeader title="Customer details" /><PermissionDenied module="customers" /></>);
  const data = await getCustomer(id);
  if (!data) notFound();
  const c = data.customer;

  return (
    <>
      <PageHeader title={c.name} description={`${c.id} · ${c.city}, ${c.state}`} meta={<StatusBadge status={c.status} />} />
      <StatGrid>
        <StatCard label="Orders" value={formatNumber(c.orders)} hint={`${data.stats.delivered} delivered`} />
        <StatCard label="Lifetime value" value={formatINR(c.lifetimeValue)} />
        <StatCard label="Wallet balance" value={formatINR(c.walletBalance)} tone="info" />
        <StatCard label="RTO orders" value={formatNumber(data.stats.rto)} hint={`${data.stats.cod} COD orders`} tone={data.stats.rto > 1 ? "danger" : "neutral"} />
      </StatGrid>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Orders" />
            <MiniTable
              columns={[
                { key: "id", label: "Order", render: (r) => <Link href={`/admin/orders/${r.id}`} className="font-mono text-xs text-brand-700 hover:underline">{r.id}</Link> },
                { key: "paymentMode", label: "Payment" },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "createdAt", label: "Placed", render: (r) => formatDate(r.createdAt) },
                { key: "total", label: "Total", align: "right", render: (r) => formatINR(r.total) },
              ]}
              rows={data.orders}
              empty="No orders yet."
            />
          </Card>
          <Card>
            <CardHeader title="Returns" />
            <MiniTable
              columns={[
                { key: "id", label: "Return", render: (r) => <Link href={`/admin/returns/${r.id}`} className="font-mono text-xs text-brand-700 hover:underline">{r.id}</Link> },
                { key: "product", label: "Product", render: (r) => <span className="block max-w-64 truncate">{r.product}</span> },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "refundAmount", label: "Refund", align: "right", render: (r) => formatINR(r.refundAmount) },
              ]}
              rows={data.returns}
              empty="No returns."
            />
          </Card>
        </div>
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Profile" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Mobile", value: maskMobile(c.mobile) },
                  { label: "Email", value: c.email ?? "—" },
                  { label: "Login", value: loginLabels[c.loginMethod] ?? c.loginMethod },
                  { label: "Address", value: `${c.city}, ${c.state} – ${c.pincode}` },
                  { label: "Customer score", value: `${c.score} / 100` },
                  { label: "Joined", value: formatDate(c.createdAt) },
                  { label: "Last order", value: formatDate(c.lastOrderAt) },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Wallet withdrawals" />
            <CardBody>
              {data.wallet.length ? (
                <ul className="space-y-2 text-sm">
                  {data.wallet.map((w) => (
                    <li key={w.id} className="flex items-center justify-between gap-2">
                      <span className="tabular">{formatINR(w.amount)} · {formatDate(w.createdAt)}</span>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">No withdrawal requests.</p>
              )}
            </CardBody>
          </Card>
          {data.tickets.length > 0 && (
            <Card>
              <CardHeader title="Support tickets" />
              <ul className="divide-y divide-line text-sm">
                {data.tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <Link href={`/admin/support/${t.id}`} className="truncate text-brand-700 hover:underline">{t.subject}</Link>
                    <StatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
