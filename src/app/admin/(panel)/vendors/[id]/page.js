import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getVendor } from "@/lib/services/admin/people";
import { formatDate, formatDateTime, formatINR, formatNumber, maskMobile } from "@/lib/format";
import { DescriptionList, PageHeader, ProgressBar, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { ButtonLink } from "@/components/ui/button";
import { VendorKyc } from "@/components/admin/vendors/vendor-kyc";
import { HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Vendor ${id}` };
}

const scoreParts = [
  ["fulfillment", "Fulfilment", 25],
  ["dispatch", "Dispatch on time", 20],
  ["revenue", "Revenue", 20],
  ["tenure", "Tenure", 15],
];

export default async function VendorDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/vendors/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("vendors");
  if (!allowed) return (<><PageHeader title="Vendor details" /><PermissionDenied module="vendors" /></>);
  const data = await getVendor(id, user);
  if (!data) notFound();
  const v = data.vendor;

  return (
    <>
      <PageHeader
        title={v.name}
        description={`${v.id} · ${v.owner} · ${v.city}, ${v.state}`}
        meta={
          <>
            <StatusBadge status={v.status} />
            <Badge tone={v.kyc === "Verified" ? "success" : "warning"}>KYC {v.kyc}</Badge>
            <Badge tone={v.payoutAccess ? "success" : "neutral"}>Payout page {v.payoutAccess ? "enabled" : "disabled"}</Badge>
          </>
        }
        actions={<ButtonLink href={`/admin/vendors/${v.id}/bank`} variant="secondary" size="sm">Bank details</ButtonLink>}
      />
      <VendorKyc vendorId={v.id} documents={data.documents || []} canEdit={can(user, "vendors", "edit")} />
      <StatGrid>
        <StatCard label="Score" value={v.score ?? "—"} hint="out of 100" tone="info" href="/admin/vendors/scores" />
        <StatCard label="Products" value={formatNumber(data.productCount)} href={`/admin/products?vendorId=${v.id}`} />
        <StatCard label="Order lines" value={formatNumber(v.orders)} />
        <StatCard label="Delivered GMV" value={formatINR(v.gmv, { compact: true })} />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Recent order lines" />
            <MiniTable
              columns={[
                { key: "orderId", label: "Order", render: (r) => <Link href={`/admin/orders/${r.orderId}`} className="font-mono text-xs text-brand-700 hover:underline">{r.orderId}</Link> },
                { key: "product", label: "Product", render: (r) => <span className="block max-w-64 truncate">{r.product}</span> },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "createdAt", label: "Placed", render: (r) => formatDate(r.createdAt) },
                { key: "price", label: "Value", align: "right", render: (r) => formatINR(r.price) },
              ]}
              rows={data.recentLines}
              empty="No orders yet."
            />
          </Card>
          <Card>
            <CardHeader title="Products" actions={<Link href={`/admin/products?vendorId=${v.id}`} className="text-[13px] font-medium text-brand-700 hover:underline">All {data.productCount}</Link>} />
            <MiniTable
              columns={[
                { key: "name", label: "Product", render: (r) => <Link href={`/admin/products/${r.id}`} className="block max-w-72 truncate text-brand-700 hover:underline">{r.name}</Link> },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "stock", label: "Stock", align: "right", render: (r) => formatNumber(r.stock) },
                { key: "display", label: "Price", align: "right", render: (r) => formatINR(r.display) },
              ]}
              rows={data.products}
              empty="No products listed."
            />
          </Card>
          {data.showFinance && (
            <Card>
              <CardHeader title="Payouts" description={`Paid ${formatINR(data.payoutTotals.paid)} · unpaid ${formatINR(data.payoutTotals.pending)}`} />
              <MiniTable
                columns={[
                  { key: "id", label: "Payout", render: (r) => <Link href={`/admin/payouts/${r.id}`} className="font-mono text-xs text-brand-700 hover:underline">{r.id}</Link> },
                  { key: "cycle", label: "Cycle" },
                  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
                  { key: "bsa", label: "Amount", align: "right", render: (r) => formatINR(r.bsa) },
                ]}
                rows={data.payouts}
                empty="No payouts yet."
              />
            </Card>
          )}
        </div>
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Business details" />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Owner", value: v.owner },
                  { label: "Mobile", value: maskMobile(v.mobile) },
                  { label: "Email", value: v.email },
                  { label: "GSTIN", value: <span className="font-mono text-xs">{v.gstin}</span> },
                  { label: "PAN", value: <span className="font-mono text-xs">{v.pan}</span> },
                  { label: "Bank account", value: <span className="font-mono text-xs">{v.bankAccount} · {v.ifsc}</span> },
                  { label: "Pickup pincode", value: v.pincode },
                  { label: "Dispatch SLA", value: `${v.dispatchSlaHours} hours` },
                  { label: "Onboarded", value: formatDate(v.onboardedAt) },
                ]}
              />
            </CardBody>
          </Card>
          {v.scoreParts && (
            <Card>
              <CardHeader title="Score breakdown" description="Weighted, minus RTO/cancellation penalty" />
              <CardBody className="space-y-3">
                {scoreParts.map(([key, label, weight]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ink-soft">{label} <span className="text-xs text-ink-muted">×{weight}</span></span>
                      <span className="tabular">{v.scoreParts[key]}</span>
                    </div>
                    <ProgressBar value={v.scoreParts[key]} label={label} />
                  </div>
                ))}
                <p className="text-sm text-danger-ink">RTO + cancellation rate: {v.scoreParts.penaltyRate}%</p>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Order status mix" />
            <CardBody>{data.statusMix.length ? <HBarList data={data.statusMix.slice(0, 8)} format={formatNumber} /> : <p className="text-sm text-ink-muted">No orders yet.</p>}</CardBody>
          </Card>
          {data.tickets.length > 0 && (
            <Card>
              <CardHeader title="Support tickets" />
              <ul className="divide-y divide-line text-sm">
                {data.tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <Link href={`/admin/support/${t.id}`} className="truncate text-brand-700 hover:underline">{t.subject}</Link>
                    <span className="shrink-0 text-xs text-ink-muted">{formatDateTime(t.createdAt)}</span>
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
