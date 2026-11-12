import Link from "next/link";
import { checkPermission } from "@/lib/auth/session";
import { getProductsWithServices } from "@/lib/services/admin/products";
import { formatINR, formatNumber } from "@/lib/format";
import { Notice, PageHeader } from "@/components/ui/page";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PermissionDenied } from "@/components/ui/states";
import { cn } from "@/lib/utils";

export const metadata = { title: "Products with Seller Services" };

const BASE_HREF = "/admin/products/with-services";

function chargeText(s) {
  return s.chargeType === "FIXED_PER_UNIT" ? `₹${s.chargeValue}/unit` : `${s.chargeValue}%`;
}

/** One entry per distinct service, with how many of the scanned products have it selected. */
function groupByService(rows) {
  const map = new Map();
  for (const p of rows) {
    for (const s of p.services ?? []) {
      const key = String(s.code ?? s.name);
      if (!map.has(key)) map.set(key, { key, name: s.name, category: s.category, chargeType: s.chargeType, chargeValue: s.chargeValue, count: 0 });
      map.get(key).count += 1;
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

function ServiceBadges({ services }) {
  return (
    <div className="flex flex-wrap gap-1 max-w-[320px]">
      {services.map((s, idx) => (
        <Link
          key={s.code ?? idx}
          href={`${BASE_HREF}?service=${encodeURIComponent(String(s.code ?? s.name))}`}
          title={s.category ? `Filter by ${s.category}` : "Filter by this service"}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
        >
          {s.name} ({chargeText(s)})
        </Link>
      ))}
    </div>
  );
}

export default async function ProductsWithServicesPage({ searchParams }) {
  const params = await searchParams;
  const selected = params?.service ? String(params.service) : "";

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
  const serviceGroups = groupByService(rows);
  const selectedGroup = serviceGroups.find((g) => g.key === selected);
  const filteredRows = selectedGroup ? rows.filter((p) => (p.services ?? []).some((s) => String(s.code ?? s.name) === selected)) : rows;

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

      {serviceGroups.length > 0 && (
        <Card className="mb-4">
          <CardHeader title="By service" description="Click a service to see only the products that have it selected." />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Link
                href={BASE_HREF}
                className={cn(
                  "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
                  !selectedGroup ? "border-brand-600 bg-brand-50" : "border-line",
                )}
              >
                <p className="text-sm font-semibold text-ink">All services</p>
                <p className="mt-1.5 text-xl font-semibold tabular text-ink">{rows.length}</p>
                <p className="text-[11px] text-ink-muted">products</p>
              </Link>
              {serviceGroups.map((g) => (
                <Link
                  key={g.key}
                  href={`${BASE_HREF}?service=${encodeURIComponent(g.key)}`}
                  className={cn(
                    "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
                    selectedGroup?.key === g.key ? "border-brand-600 bg-brand-50" : "border-line",
                  )}
                >
                  <p className="truncate text-sm font-semibold text-ink">{g.name}</p>
                  {g.category && <p className="truncate text-xs text-ink-muted">{g.category}</p>}
                  <p className="mt-1.5 text-xl font-semibold tabular text-ink">{g.count}</p>
                  <p className="text-[11px] text-ink-muted">product{g.count === 1 ? "" : "s"} · {chargeText(g)}</p>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          title={`${formatNumber(filteredRows.length)} product${filteredRows.length === 1 ? "" : "s"}${selectedGroup ? ` with “${selectedGroup.name}”` : ""}`}
          description="Scanned from the live products list."
          actions={
            selectedGroup ? (
              <Link href={BASE_HREF} className="text-xs font-medium text-brand-700 hover:underline">
                Clear filter
              </Link>
            ) : null
          }
        />
        {filteredRows.length ? (
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
                  {filteredRows.map((p) => (
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
              {filteredRows.map((p) => (
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
