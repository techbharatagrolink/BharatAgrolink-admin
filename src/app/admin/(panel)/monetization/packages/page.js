import { formatINR, formatNumber } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";
import { ActiveToggle, PackageEditor, ServiceEditor } from "@/components/admin/monetization/config-forms";

export const metadata = { title: "Services & Packages" };

export default async function MonetizationPackagesPage() {
  const { user, canAdd, canEdit, header, denied } = await monetizationPage({
    title: "Services & Packages",
    description: "Ad types sellers can buy, their creative rules, and the fixed-price packages. Paid orders keep the package, price and terms they were bought with.",
  });
  if (denied) return denied;

  const [services, packages, placements] = await Promise.all([
    loadMonetization(user, "services"),
    loadMonetization(user, "packages"),
    loadMonetization(user, "placements"),
  ]);
  const error = services.error || packages.error || placements.error;
  if (error)
    return (
      <>
        {header}
        <LoadError error={error} what="the services and packages" />
      </>
    );

  return (
    <>
      {header}
      <Card>
        <CardHeader
          title="Ad types"
          description="What a seller can buy and the size / format their creative must have."
          actions={canAdd ? <ServiceEditor button={{ label: "New ad type" }} /> : null}
        />
        <MiniTable
          columns={[
            {
              key: "name",
              label: "Ad type",
              render: (s) => (
                <span className="block">
                  <span className="font-medium text-ink">{s.name}</span>
                  <span className="block text-xs text-ink-muted">{s.code}</span>
                </span>
              ),
            },
            {
              key: "size",
              label: "Creative size",
              render: (s) => (
                <span className="tabular">
                  {s.desktopWidth}×{s.desktopHeight}
                  {s.mobileRequired ? ` · mobile ${s.mobileWidth}×${s.mobileHeight}` : ""}
                </span>
              ),
            },
            { key: "formats", label: "Formats / max", render: (s) => `${s.allowedFormats.join(", ").toUpperCase()} · ${formatNumber(s.maxFileKb)} KB` },
            { key: "packages", label: "Packages on sale", align: "right", render: (s) => `${s.activePackageCount} / ${s.packageCount}` },
            { key: "active", label: "On sale", render: (s) => <ActiveToggle resource="services" id={s.id} active={s.isActive} disabled={!canEdit} /> },
            { key: "edit", label: "", render: (s) => (canEdit ? <ServiceEditor service={s} button={{ label: "Edit", variant: "ghost" }} /> : null) },
          ]}
          rows={services.data}
        />
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Packages"
          description="Price is before GST. A package needs a price above 0 before it can be activated."
          actions={canAdd ? <PackageEditor placements={placements.data} button={{ label: "New package", variant: "primary" }} /> : null}
        />
        <MiniTable
          empty="No packages yet."
          columns={[
            {
              key: "name",
              label: "Package",
              render: (p) => (
                <span className="block">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {p.serviceName} · {p.placementName}
                  </span>
                </span>
              ),
            },
            { key: "durationDays", label: "Duration", align: "right", render: (p) => `${p.durationDays} days` },
            { key: "price", label: "Price", align: "right", render: (p) => (p.price > 0 ? formatINR(p.price) : <Badge tone="warning">Not set</Badge>) },
            { key: "gst", label: "GST", align: "right", render: (p) => `${p.gstRate}%` },
            { key: "total", label: "Seller pays", align: "right", render: (p) => formatINR(p.priceWithGst) },
            { key: "orders", label: "Orders", align: "right", render: (p) => formatNumber(p.orderCount) },
            { key: "active", label: "On sale", render: (p) => <ActiveToggle resource="packages" id={p.id} active={p.isActive} disabled={!canEdit || (!p.isActive && !(p.price > 0))} /> },
            { key: "edit", label: "", render: (p) => (canEdit ? <PackageEditor pkg={p} placements={placements.data} button={{ label: "Edit", variant: "ghost" }} /> : null) },
          ]}
          rows={packages.data}
        />
      </Card>
    </>
  );
}
