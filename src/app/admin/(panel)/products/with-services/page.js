import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsWithServices } from "@/lib/services/admin/products";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";

export const metadata = { title: "Products with Seller Services" };

function ServiceBadges({ services }) {
  return (
    <div className="flex flex-wrap gap-1 max-w-[320px]">
      {services.map((s, idx) => (
        <span
          key={s.code ?? idx}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
          title={s.category || undefined}
        >
          {s.name} ({s.chargeType === "FIXED_PER_UNIT" ? `₹${s.chargeValue}/unit` : `${s.chargeValue}%`})
        </span>
      ))}
    </div>
  );
}

export default async function ProductsWithServicesPage() {
  const { allowed, user } = await checkPermission("products");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Products with Seller Services" />
        <PermissionDenied module="products" />
      </>
    );
  }

  const { rows, scanned, totalCatalog, truncated, message } = await getProductsWithServices(user);

  return (
    <>
      <PageHeader
        title="Products with Seller Services"
        description="Every product with at least one seller-selected promotional or support service, so sales can see what's already active and pitch it."
      />
      {message && (
        <Notice tone="danger" className="mb-4">
          {message}
        </Notice>
      )}
      {truncated && (
        <Notice tone="warning" className="mb-4">
          Scanned the {formatNumber(scanned)} most recently updated products out of {formatNumber(totalCatalog)} in the catalog. Older products with services may not be listed here — use the search on{" "}
          <Link href="/admin/products" className="underline">
            All Products
          </Link>{" "}
          for the full catalog.
        </Notice>
      )}
      <Card>
        <CardHeader
          title={`${formatNumber(rows.length)} product${rows.length === 1 ? "" : "s"}`}
          description="Scanned from the live products list."
        />
        {rows.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-line bg-surface-muted text-left text-xs font-medium text-ink-muted">
                    <th scope="col" className="px-4 py-2.5">Product</th>
                    <th scope="col" className="px-4 py-2.5">Vendor</th>
                    <th scope="col" className="px-4 py-2.5">Category</th>
                    <th scope="col" className="px-4 py-2.5">Services</th>
                    <th scope="col" className="px-4 py-2.5 text-right">Display price</th>
                    <th scope="col" className="px-4 py-2.5 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((p) => (
                    <tr key={p.id} className="align-top hover:bg-surface-muted/60">
                      <td className="px-4 py-2.5">
                        <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-700 hover:underline">
                          {p.name}
                        </Link>
                        <div className="text-xs text-ink-muted">{p.sku}</div>
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">{p.vendor}</td>
                      <td className="px-4 py-2.5 text-ink-soft">{p.category}</td>
                      <td className="px-4 py-2.5">
                        <ServiceBadges services={p.services} />
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(p.display)}</td>
                      <td className="px-4 py-2.5 text-right tabular">{formatNumber(p.stock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="space-y-2.5 border-t border-line p-3 md:hidden">
              {rows.map((p) => (
                <li key={p.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-brand-700 hover:underline">
                      {p.name}
                    </Link>
                    <Badge tone="brand">{p.services.length} service{p.services.length === 1 ? "" : "s"}</Badge>
                  </div>
                  <p className="text-xs text-ink-muted">{p.sku} · {p.vendor} · {p.category}</p>
                  <div className="mt-2">
                    <ServiceBadges services={p.services} />
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                    <div><dt className="text-xs text-ink-muted">Display price</dt><dd className="font-medium text-ink">{formatINR(p.display)}</dd></div>
                    <div><dt className="text-xs text-ink-muted">Stock</dt><dd className="text-ink-soft">{formatNumber(p.stock)}</dd></div>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <CardBody>
            <p className="text-sm text-ink-muted">No products currently have a seller service selected.</p>
          </CardBody>
        )}
      </Card>
    </>
  );
}
