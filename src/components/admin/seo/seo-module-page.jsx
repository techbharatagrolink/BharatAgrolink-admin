import { loadSeo, rangeParams } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { IntegrationsCard, RangeNote, SeoLoadState, Unavailable, seoPage } from "./seo-parts";

/**
 * Detail screen shell used until each module's real data is built (Phase 3-5): header, tabs,
 * date filter, the data sources it depends on, and what the screen will show.
 */
export async function SeoModulePage({ searchParams, apiPath, title, description, plannedSections }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({ title, description, range: true });
  if (page.denied) return page.denied;

  const result = await loadSeo(page.user, apiPath, rangeParams(sp));
  const blocked = SeoLoadState({ result, what: title });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const m = result.data;
  return (
    <>
      {page.header(m.range)}
      <RangeNote range={m.range} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title={title} />
          <Unavailable>{m.reason}</Unavailable>
          {plannedSections?.length > 0 && (
            <div className="border-t border-line px-4 py-3">
              <p className="mb-1 text-xs font-medium text-ink-muted">This screen will show</p>
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-ink">
                {plannedSections.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
        {m.integrations.length > 0 ? (
          <IntegrationsCard integrations={m.integrations} />
        ) : (
          <Card className="min-w-0">
            <CardHeader title="Data sources" />
            <p className="px-4 py-3 text-sm text-ink-muted">Reads the marketplace product catalogue directly; no outside connection needed.</p>
          </Card>
        )}
      </div>
    </>
  );
}
