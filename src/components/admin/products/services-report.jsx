import Link from "next/link";
import { formatINR, formatNumber } from "@/lib/format";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { storefrontUrl } from "@/lib/site";

/** The live customer-facing listing — this report exists so sales can pitch what's already there. */
function storeUrl(slug) {
  return slug ? `${storefrontUrl.replace(/\/$/, "")}/product/${slug}` : null;
}

function ProductCell({ p, v }) {
  const href = storeUrl(p.slug);
  return (
    <div className="min-w-0">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline" title="Open on the live site">
          {p.name}
        </a>
      ) : (
        <span className="font-medium text-ink">{p.name}</span>
      )}
      {v && <Badge tone="info" className="ml-1.5">{v.label || `Variant #${v.id}`}</Badge>}
      <div className="text-xs text-ink-muted">
        {v ? v.sku : p.sku} ·{" "}
        <Link href={`/admin/products/${p.id}`} className="hover:underline">
          Edit
        </Link>
      </div>
    </div>
  );
}

/**
 * Each variation has its own service pick (falling back to the base product's), and its own
 * display price and stock — so a product with variants becomes one row per variant here
 * (each with its own services, price and stock), instead of hiding that behind a single
 * base-product row. A product with no variants is still just the one row.
 */
function toDisplayRows(rows) {
  return rows.flatMap((p) => {
    const variants = Array.isArray(p.variants) ? p.variants : [];
    if (!variants.length) return [{ key: p.id, p, v: null, services: uniqueServices(p.services) }];
    // A variation shows its own pick (pricing reads only that one; null = none). Older APIs send no
    // "services" key on a variant: then the base product's pick applies.
    return variants.map((v) => ({ key: `${p.id}:${v.id}`, p, v, services: uniqueServices("services" in v ? v.services : p.services) }));
  });
}

/** One badge per service: older API versions repeat a service once per variation. */
export function uniqueServices(services) {
  const seen = new Set();
  return (services ?? []).filter((s) => {
    const key = String(s.code ?? s.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Shared building blocks for the "products by seller service" reports
 * (/admin/products/with-services and category-scoped pages like
 * /admin/marketing/products-with-services). Each page scans the live
 * products list, picks the services it cares about, and renders these.
 */

export function chargeText(s) {
  return s.chargeType === "FIXED_PER_UNIT" ? `₹${s.chargeValue}/unit` : `${s.chargeValue}%`;
}

/** Search by name/SKU/vendor and a last-updated date range — applied on top of the service-card filter. */
export function filterRowsByQuery(rows, { q, from, to } = {}) {
  let result = rows;
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((p) => [p.name, p.sku, p.vendor].some((v) => String(v ?? "").toLowerCase().includes(needle)));
  }
  if (from) {
    const fromTime = new Date(`${from}T00:00:00+05:30`).getTime();
    result = result.filter((p) => p.updatedAt && new Date(p.updatedAt).getTime() >= fromTime);
  }
  if (to) {
    const toTime = new Date(`${to}T23:59:59+05:30`).getTime();
    result = result.filter((p) => p.updatedAt && new Date(p.updatedAt).getTime() <= toTime);
  }
  return result;
}

/** One entry per distinct service, with how many of the given products have it selected. */
export function groupByService(rows) {
  const map = new Map();
  for (const p of rows) {
    for (const s of uniqueServices(p.services)) {
      const key = String(s.code ?? s.name);
      if (!map.has(key)) map.set(key, { key, name: s.name, category: s.category, chargeType: s.chargeType, chargeValue: s.chargeValue, count: 0 });
      map.get(key).count += 1;
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function ServiceBadges({ services, baseHref }) {
  return (
    <div className="flex flex-wrap gap-1 max-w-[320px]">
      {services.map((s, idx) => (
        <Link
          key={s.code ?? idx}
          href={`${baseHref}?service=${encodeURIComponent(String(s.code ?? s.name))}`}
          title={s.category ? `Filter by ${s.category}` : "Filter by this service"}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
        >
          {s.name} ({chargeText(s)})
        </Link>
      ))}
    </div>
  );
}

export function ServiceCardsGrid({ baseHref, serviceGroups, selectedKey, totalCount }) {
  if (!serviceGroups.length) return null;
  return (
    <Card className="mb-4">
      <CardHeader title="By service" description="Click a service to see only the products that have it selected." />
      <CardBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Link
            href={baseHref}
            className={cn(
              "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
              !selectedKey ? "border-brand-600 bg-brand-50" : "border-line",
            )}
          >
            <p className="text-sm font-semibold text-ink">All services</p>
            <p className="mt-1.5 text-xl font-semibold tabular text-ink">{totalCount}</p>
            <p className="text-[11px] text-ink-muted">products</p>
          </Link>
          {serviceGroups.map((g) => (
            <Link
              key={g.key}
              href={`${baseHref}?service=${encodeURIComponent(g.key)}`}
              className={cn(
                "rounded-xl border p-3 transition-colors hover:border-brand-200 hover:bg-surface-muted",
                selectedKey === g.key ? "border-brand-600 bg-brand-50" : "border-line",
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
  );
}

export function ProductsServicesTable({ rows, baseHref, description, selectedName, emptyMessage }) {
  const displayRows = toDisplayRows(rows);
  const variantRowCount = displayRows.filter((r) => r.v).length;
  return (
    <Card>
      <CardHeader
        title={`${formatNumber(rows.length)} product${rows.length === 1 ? "" : "s"}${selectedName ? ` with “${selectedName}”` : ""}`}
        description={`${description || "Scanned from the live products list."}${variantRowCount ? ` ${formatNumber(variantRowCount)} shown by variant, each with its own price and stock.` : ""}`}
        actions={
          selectedName ? (
            <Link href={baseHref} className="text-xs font-medium text-brand-700 hover:underline">
              Clear filter
            </Link>
          ) : null
        }
      />
      {displayRows.length ? (
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
                {displayRows.map(({ key, p, v, services }) => (
                  <tr key={key} className="align-top hover:bg-surface-muted/60">
                    <td className="px-4 py-2.5">
                      <ProductCell p={p} v={v} />
                    </td>
                    <td className="px-4 py-2.5 text-ink-soft">{p.vendor}</td>
                    <td className="px-4 py-2.5 text-ink-soft">{p.category}</td>
                    <td className="px-4 py-2.5">
                      <ServiceBadges services={services} baseHref={baseHref} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-ink tabular">{formatINR(v ? v.display : p.display)}</td>
                    <td className="px-4 py-2.5 text-right tabular">{formatNumber(v ? v.stock : p.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2.5 border-t border-line p-3 md:hidden">
            {displayRows.map(({ key, p, v, services }) => (
              <li key={key} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    {storeUrl(p.slug) ? (
                      <a href={storeUrl(p.slug)} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 hover:underline" title="Open on the live site">
                        {p.name}
                      </a>
                    ) : (
                      <span className="font-medium text-ink">{p.name}</span>
                    )}
                    {v && <Badge tone="info" className="ml-1.5">{v.label || `Variant #${v.id}`}</Badge>}
                  </div>
                  <Badge tone="brand">{services.length} service{services.length === 1 ? "" : "s"}</Badge>
                </div>
                <p className="text-xs text-ink-muted">
                  {v ? v.sku : p.sku} · {p.vendor} · {p.category} ·{" "}
                  <Link href={`/admin/products/${p.id}`} className="hover:underline">
                    Edit
                  </Link>
                </p>
                <div className="mt-2">
                  <ServiceBadges services={services} baseHref={baseHref} />
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                  <div><dt className="text-xs text-ink-muted">Display price</dt><dd className="font-medium text-ink">{formatINR(v ? v.display : p.display)}</dd></div>
                  <div><dt className="text-xs text-ink-muted">Stock</dt><dd className="text-ink-soft">{formatNumber(v ? v.stock : p.stock)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <CardBody>
          <p className="text-sm text-ink-muted">{emptyMessage || "No products match."}</p>
        </CardBody>
      )}
    </Card>
  );
}
