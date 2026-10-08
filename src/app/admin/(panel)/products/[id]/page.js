import Link from "next/link";
import { notFound } from "next/navigation";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getProduct, getProductOptions } from "@/lib/services/admin/products";
import { ProductEditor } from "@/components/admin/products/product-editor";
import { formatDate, formatDateTime, formatINR, formatNumber } from "@/lib/format";
import { DescriptionList, Notice, PageHeader, StatCard, StatGrid, Timeline } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { PricingBreakdown, PricingPanel } from "@/components/admin/products/pricing-panel";
import { ProductStatusActions, StockControl } from "@/components/admin/products/product-controls";
import { resourceFallback } from "@/components/admin/resource/resource-fallback";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Product ${id}` };
}

function VariationsCard({ product: p }) {
  const rows = [
    { id: p.id, label: p.baseLabel ?? "Base product", sku: p.sku, mrp: p.mrp, nrv: p.nrv, display: p.display, stock: p.stock, stockStatus: p.stockStatus, weightKg: p.weightKg, base: true },
    ...p.variations,
  ];
  const totalStock = rows.reduce((sum, r) => sum + r.stock, 0);
  return (
    <Card>
      <CardHeader
        title="Variations"
        description={
          p.variations.length
            ? `${rows.length} variations by ${p.variationAttribute?.toLowerCase() ?? "type"} · ${formatNumber(totalStock)} units in stock in total`
            : "Sold as a single SKU. Variations can be added when the product is created."
        }
      />
      {p.variations.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                  <th scope="col" className="px-4 py-2.5">{p.variationAttribute ?? "Variation"}</th>
                  <th scope="col" className="px-4 py-2.5">SKU</th>
                  <th scope="col" className="px-4 py-2.5 text-right">MRP</th>
                  <th scope="col" className="px-4 py-2.5 text-right">NRV</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Display price</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Weight</th>
                  <th scope="col" className="px-4 py-2.5 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-muted/60">
                    <td className="px-4 py-2.5 font-medium text-ink">
                      {r.label} {r.base && <Badge tone="brand" className="ml-1.5">Base</Badge>}
                    </td>
                    <td className="px-4 py-2.5 text-ink-soft tabular">{r.sku}</td>
                    <td className="px-4 py-2.5 text-right text-ink-soft tabular">{formatINR(r.mrp)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-soft tabular">{formatINR(r.nrv)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(r.display)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-soft tabular">{r.weightKg} kg</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="tabular">{formatNumber(r.stock)}</span> <StatusBadge status={r.stockStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2.5 border-t border-line p-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink">
                    {r.label} {r.base && <Badge tone="brand" className="ml-1">Base</Badge>}
                  </p>
                  <StatusBadge status={r.stockStatus} />
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                  <div><dt className="text-xs text-ink-muted">SKU</dt><dd className="text-ink-soft">{r.sku}</dd></div>
                  <div><dt className="text-xs text-ink-muted">Display price</dt><dd className="font-medium text-ink">{formatINR(r.display)}</dd></div>
                  <div><dt className="text-xs text-ink-muted">MRP / NRV</dt><dd className="text-ink-soft">{formatINR(r.mrp)} / {formatINR(r.nrv)}</dd></div>
                  <div><dt className="text-xs text-ink-muted">Stock · weight</dt><dd className="text-ink-soft">{formatNumber(r.stock)} · {r.weightKg} kg</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Card>
  );
}

export default async function ProductDetailPage({ params, searchParams }) {
  const { id } = await params;
  const fallback = await resourceFallback(`/admin/products/${id}`, searchParams);
  if (fallback) return fallback;

  const { user, allowed } = await checkPermission("products");
  if (!allowed) return (<><PageHeader title="Product details" /><PermissionDenied module="products" /></>);
  const data = await getProduct(id, user);
  if (!data) notFound();
  const options = can(user, "products", "edit") ? await getProductOptions(user) : null;
  const { product: p, vendor, pricing, sales } = data;
  const canEdit = can(user, "products", "edit");
  const canApprove = can(user, "products.approval", "edit");
  const statusActions = [
    ...(canApprove && [0, 2].includes(p.statusCode) ? ["approve", "reject"] : []),
    ...(canEdit && p.statusCode === 1 ? ["deactivate"] : []),
  ];

  if (canEdit && options) {
    return <ProductEditor product={p} options={options} vendorName={vendor?.name || p.vendor} />;
  }

  return (
    <>
      <PageHeader
        title={p.name}
        description={`${p.sku} · ${p.parentCategory} › ${p.category} · ${p.brand}`}
        meta={
          <>
            <StatusBadge status={p.status} />
            <StatusBadge status={p.stockStatus} />
            {p.toxicity && <Badge tone="danger">Toxicity: {p.toxicity.replace("_", " ")}</Badge>}
          </>
        }
        actions={<ProductStatusActions productId={p.id} available={statusActions} />}
      />
      {p.rejectReason && p.statusCode === 3 && (
        <Notice tone="danger" title="Rejected" className="mb-4">
          {p.rejectReason}
        </Notice>
      )}

      <StatGrid>
        <StatCard label="Display price" value={formatINR(p.display)} hint={`MRP ${formatINR(p.mrp)}`} />
        <StatCard label="Stock" value={formatNumber(p.stock)} hint={p.stockStatus} tone={p.stock === 0 ? "danger" : p.stock < 50 ? "warning" : "brand"} />
        <StatCard label="Delivered units" value={formatNumber(sales.deliveredUnits)} hint={formatINR(sales.deliveredValue)} tone="info" />
        <StatCard label="Returns" value={formatNumber(sales.returns)} hint={`${formatNumber(sales.lines)} order lines`} tone="neutral" />
      </StatGrid>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="NRV pricing" description="Prices are calculated from the seller's NRV and take rate. Changes are confirmed and audited." />
            <CardBody>
              {canEdit ? (
                <PricingPanel mode="edit" productId={p.id} initial={{ mrp: p.mrp, nrv: p.nrv, takeRate: p.takeRate, gstPercent: p.gstPercent }} initialResult={pricing} />
              ) : (
                <PricingBreakdown result={pricing} />
              )}
            </CardBody>
          </Card>
          {canEdit && options ? (
            <Card>
              <CardHeader title="Edit product" description="The same catalog fields as the PHP product editor. Images upload to Cloudflare R2." />
              <CardBody>
                <ProductEditor product={p} options={options} />
              </CardBody>
            </Card>
          ) : (
            <VariationsCard product={p} />
          )}
        </div>
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Listing" actions={canEdit ? <StockControl productId={p.id} stock={p.stock} /> : null} />
            <CardBody>
              <DescriptionList
                columns={1}
                items={[
                  { label: "Vendor", value: vendor ? <Link href={`/admin/vendors/${vendor.id}`} className="text-brand-700 hover:underline">{vendor.name}</Link> : p.vendor },
                  { label: "Product ID", value: `${p.id} · ${p.uniqueId}` },
                  { label: "HSN", value: p.hsn },
                  { label: "GST", value: `${p.gstPercent}% (inclusive)` },
                  { label: "Weight", value: `${p.weightKg} kg` },
                  { label: "Variants", value: p.variants },
                  { label: "Return policy", value: p.returnPolicy },
                  { label: "Created", value: formatDate(p.createdAt) },
                  { label: "Updated", value: formatDateTime(p.updatedAt) },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Recent reviews" />
            <CardBody>
              {data.reviews.length ? (
                <ul className="space-y-3">
                  {data.reviews.map((r) => (
                    <li key={r.id} className="text-sm">
                      <p className="font-medium text-ink">
                        {"★".repeat(r.rating)}
                        <span className="text-line-strong">{"★".repeat(5 - r.rating)}</span> <span className="text-xs font-normal text-ink-muted">· {r.customer}</span>
                      </p>
                      <p className="text-ink-soft">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">No reviews yet.</p>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Stock movements" actions={<Link href={`/admin/inventory/history?q=${encodeURIComponent(p.sku)}`} className="text-[13px] font-medium text-brand-700 hover:underline">All</Link>} />
            <CardBody>
              <Timeline
                items={data.movements.map((m) => ({
                  id: m.id,
                  title: `${m.type}: ${m.change > 0 ? "+" : ""}${m.change} (${m.before} → ${m.after})`,
                  description: [m.reason, m.reference, m.actor].filter(Boolean).join(" · "),
                  meta: formatDateTime(m.at),
                  tone: m.after === 0 ? "danger" : m.change < 0 ? "warning" : undefined,
                }))}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Change history" />
            <CardBody>
              <Timeline items={data.history.map((h) => ({ id: h.id, title: h.action, description: h.reason ? `${h.actor} · ${h.reason}` : h.actor, meta: formatDateTime(h.at) }))} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
