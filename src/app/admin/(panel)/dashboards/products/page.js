import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsDashboard } from "@/lib/services/admin/dashboards";
import { formatDate, formatNumber } from "@/lib/format";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PermissionDenied } from "@/components/ui/states";
import { DonutChart, HBarList } from "@/components/charts/charts";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

export const metadata = { title: "Product Management Dashboard" };

const verdictLabels = { ok: "Healthy", below_target: "Below target CM", below_floor: "Below floor CM", loss: "Loss-making" };

export default async function ProductsDashboardPage() {
  const { allowed } = await checkPermission("dashboard.products");
  if (!allowed) return (<><PageHeader title="Product Management Dashboard" /><PermissionDenied module="the product dashboard" /></>);
  const d = await getProductsDashboard();
  return (
    <>
      <PageHeader title="Product Management Dashboard" description="Catalog size, approval queue, stock health and listing economics (contribution verdicts are computed on the server)." />
      <StatGrid className="xl:grid-cols-7">
        <StatCard label="All products" value={formatNumber(d.stats.total)} href="/admin/products" />
        <StatCard label="Live" value={formatNumber(d.stats.live)} />
        <StatCard label="Pending approval" value={formatNumber(d.stats.pending)} tone="warning" href="/admin/products/pending" />
        <StatCard label="Rejected / draft" value={formatNumber(d.stats.rejected)} tone="neutral" />
        <StatCard label="Low stock (1–9)" value={formatNumber(d.stats.lowStock)} tone="warning" href="/admin/inventory?stockStatus=Low+Stock" />
        <StatCard label="Out of stock" value={formatNumber(d.stats.outOfStock)} tone="danger" href="/admin/inventory?stockStatus=Out+of+Stock" />
        <StatCard label="Loss-making listings" value={formatNumber(d.stats.lossMaking)} tone="danger" href="/admin/products?verdict=loss" />
      </StatGrid>
      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader title="Listing economics" description="Live products by contribution verdict" />
          <CardBody>
            <DonutChart data={d.byVerdict.map((v) => ({ ...v, label: verdictLabels[v.label] ?? v.label }))} label="Listing verdicts" centerValue={formatNumber(d.stats.live)} centerLabel="live" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Live products by category" />
          <CardBody>
            <HBarList data={d.byCategory} format={formatNumber} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Best sellers" description="Delivered units, all time" />
          <CardBody>
            <HBarList data={d.bestSellers} format={formatNumber} />
          </CardBody>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader title="Waiting for approval" actions={<Link href="/admin/products/pending" className="text-[13px] font-medium text-brand-700 hover:underline">Open approval queue</Link>} />
        <MiniTable
          columns={[
            { key: "name", label: "Product", render: (r) => <Link href={`/admin/products/${r.id}`} className="font-medium text-brand-700 hover:underline">{r.name}</Link> },
            { key: "vendor", label: "Vendor" },
            { key: "createdAt", label: "Submitted", render: (r) => formatDate(r.createdAt) },
          ]}
          rows={d.pending}
          empty="No products are waiting for approval."
        />
      </Card>
    </>
  );
}
