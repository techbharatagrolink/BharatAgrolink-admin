import { formatNumber } from "@/lib/format";
import { loadMonetization } from "@/lib/services/admin/monetization";
import { Card, CardHeader } from "@/components/ui/card";
import { Notice } from "@/components/ui/page";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { monetizationPage, LoadError } from "@/components/admin/monetization/monetization-page";
import { ActiveToggle, PlacementEditor } from "@/components/admin/monetization/config-forms";

export const metadata = { title: "Ad Placements" };

const ROTATION = { ROUND_ROBIN: "Round robin", RANDOM: "Random", PRIORITY: "Priority" };
const POSITION = { INTERLEAVE: "Mixed", START: "Before admin banners", END: "After admin banners" };

export default async function MonetizationPlacementsPage() {
  const { user, canAdd, canEdit, header, denied } = await monetizationPage({
    title: "Placements",
    description: "Where paid banners show on the storefront. Each placement mixes paid ads into an existing homepage section, up to its slot limit.",
  });
  if (denied) return denied;

  const [placements, services, sections] = await Promise.all([
    loadMonetization(user, "placements"),
    loadMonetization(user, "services"),
    loadMonetization(user, "sections"),
  ]);
  const error = placements.error || services.error || sections.error;
  if (error)
    return (
      <>
        {header}
        <LoadError error={error} what="the placements" />
      </>
    );

  return (
    <>
      {header}
      <Notice tone="info" className="mb-4">
        Only approved, paid and currently scheduled ads are shown. The admin&apos;s own homepage banners stay as they are.
      </Notice>
      <Card>
        <CardHeader
          title="Placements"
          actions={canAdd ? <PlacementEditor services={services.data} sections={sections.data} button={{ label: "New placement", variant: "primary" }} /> : null}
        />
        <MiniTable
          empty="No placements yet."
          columns={[
            {
              key: "name",
              label: "Placement",
              render: (p) => (
                <span className="block">
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="block text-xs text-ink-muted">{p.code}</span>
                </span>
              ),
            },
            { key: "serviceName", label: "Ad type" },
            { key: "section", label: "Homepage section", render: (p) => p.homeSectionLabel },
            { key: "slots", label: "Booked / slots", align: "right", render: (p) => `${formatNumber(p.liveAds)} / ${formatNumber(p.maxSlots)}` },
            { key: "devices", label: "Shows on", render: (p) => [p.showDesktop && "Desktop", p.showMobile && "Mobile"].filter(Boolean).join(", ") },
            { key: "rotation", label: "Rotation", render: (p) => `${ROTATION[p.rotation] ?? p.rotation} · ${POSITION[p.paidPosition] ?? p.paidPosition}` },
            { key: "priority", label: "Priority", align: "right" },
            { key: "active", label: "Enabled", render: (p) => <ActiveToggle resource="placements" id={p.id} active={p.isActive} disabled={!canEdit} /> },
            {
              key: "edit",
              label: "",
              render: (p) => (canEdit ? <PlacementEditor placement={p} services={services.data} sections={sections.data} button={{ label: "Edit", variant: "ghost" }} /> : null),
            },
          ]}
          rows={placements.data}
        />
      </Card>
    </>
  );
}
