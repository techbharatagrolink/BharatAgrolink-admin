import { loadSeo } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { IntegrationsCard, SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { PromptLibrary, SettingEditButton } from "@/components/admin/seo/settings-editor";

export const metadata = { title: "SEO Settings" };

const TITLES = {
  readiness_target: "Readiness target",
  readiness_weights: "Readiness category weights",
  readiness_methodology: "Scoring methodology",
  brand_terms: "Brand terms",
  organic_revenue: "Organic revenue definition",
  crawl_limits: "Website crawler",
  ai_platforms: "AI platforms",
  ai_openai: "ChatGPT checks",
};
const LOCKED_REASON = {
  organic_revenue: "Finance decision (Organic GMV, Delivered only). Changed only on finance approval.",
  readiness_methodology: "Tied to the scoring code version.",
  ai_platforms: "Follows which API keys are set on the server.",
};
const ACTION = { "settings.update": "changed", "prompts.add": "added prompt", "prompts.toggle": "switched prompt" };

const show = (v) =>
  Array.isArray(v)
    ? v.join(", ")
    : typeof v === "object" && v
      ? Object.entries(v)
          .map(([k, x]) => `${k.replace(/_/g, " ")}: ${Array.isArray(x) ? x.join(", ") : String(x)}`)
          .join(" · ")
      : String(v);

/** Settings: target, weights, brand terms, crawler, ChatGPT checks and prompt library. No secrets live here. */
export default async function SeoSettingsPage() {
  const page = await seoPage({ title: "SEO Settings", description: "Readiness target and weights, brand terms, crawler, ChatGPT checks and data sources." });
  if (page.denied) return page.denied;

  const [settings, integrations] = await Promise.all([loadSeo(page.user, "settings"), loadSeo(page.user, "integrations/status")]);
  const blocked = SeoLoadState({ result: settings, what: "the SEO settings" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const d = settings.data;
  return (
    <>
      {page.header(null)}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title="Configuration" description="Every change is saved with who made it and the value before and after." />
          <ul className="divide-y divide-line">
            {d.settings.map((s) => (
              <li key={s.setting_key} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{TITLES[s.setting_key] ?? s.setting_key.replace(/_/g, " ")}</span>
                  <span className="block break-words text-ink-soft">{show(s.setting_value)}</span>
                  <span className="block text-xs text-ink-muted">
                    {s.editable ? s.description : (LOCKED_REASON[s.setting_key] ?? s.description)} · updated {formatDateTime(s.updated_at)} by {s.updated_by ?? "—"}
                  </span>
                </span>
                {s.editable && page.canEdit ? <SettingEditButton setting={s} categories={d.categories} /> : !s.editable ? <span className="shrink-0 text-xs text-ink-muted">Locked</span> : null}
              </li>
            ))}
          </ul>
        </Card>
        <div className="grid content-start gap-4">
          {integrations.data?.integrations && <IntegrationsCard integrations={integrations.data.integrations} />}
          <Card className="min-w-0">
            <CardHeader title="Recent changes" />
            {d.changes?.length ? (
              <ul className="divide-y divide-line">
                {d.changes.map((c) => (
                  <li key={c.id} className="px-4 py-2 text-xs">
                    <span className="block text-ink">
                      Admin {c.actor_id} {ACTION[c.action] ?? c.action} {c.detail?.key ? (TITLES[c.detail.key] ?? c.detail.key) : c.detail?.id ? `#${c.detail.id}` : ""}
                      {c.action === "prompts.toggle" ? ` ${c.detail.after ? "on" : "off"}` : ""}
                    </span>
                    <span className="text-ink-muted">{formatDateTime(c.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Unavailable>No changes yet.</Unavailable>
            )}
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="AI prompt library" description="Questions asked to ChatGPT on every run. Switched-off prompts keep their past answers." />
        <PromptLibrary prompts={d.prompts ?? []} canEdit={page.canEdit} canAdd={page.canAdd} />
      </Card>
    </>
  );
}
