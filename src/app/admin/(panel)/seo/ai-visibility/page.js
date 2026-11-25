import { loadSeo, rangeParams } from "@/lib/services/admin/seo";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber } from "@/lib/format";
import { IntegrationBadge, RangeNote, SeoLoadState, Unavailable, seoPage } from "@/components/admin/seo/seo-parts";
import { AiRunButton } from "@/components/admin/seo/ai-run-button";
import { ExportButton } from "@/components/data-table/export-button";

export const metadata = { title: "AI Recommendations" };

const RESULT = {
  MENTIONED: { label: "Mentioned", tone: "success" },
  NOT_MENTIONED: { label: "Not mentioned", tone: "neutral" },
  ERROR: { label: "Error", tone: "danger" },
};
const RUN = { RUNNING: "Running", SUCCESS: "Completed", PARTIAL: "Completed with errors", FAILED: "Failed" };

/**
 * AI Recommendations (task #104, subtask 6): does ChatGPT bring up Bharat Agrolink for farmer and
 * buyer questions? Other platforms stay "Not connected" until they have their own API key.
 */
export default async function SeoAiVisibilityPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const page = await seoPage({
    title: "AI Recommendations",
    description: "Whether AI assistants mention Bharat Agrolink for farmer, product and category questions.",
    range: true,
  });
  if (page.denied) return page.denied;

  const result = await loadSeo(page.user, "ai-visibility", rangeParams(sp));
  const blocked = SeoLoadState({ result, what: "AI Recommendations" });
  if (blocked)
    return (
      <>
        {page.header(null)}
        {blocked}
      </>
    );

  const d = result.data;
  const active = d.prompts.filter((p) => p.is_active);
  const running = d.runs.some((r) => r.status === "RUNNING");
  const chatgpt = d.platforms.find((p) => p.key === "chatgpt");

  return (
    <>
      {page.header(d.range)}
      <RangeNote range={d.range} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {d.platforms.map((p) => (
          <div key={p.key} className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{p.label}</p>
              <IntegrationBadge state={p.state} />
            </div>
            {p.checked ? (
              <>
                <p className="mt-2 text-[22px] font-semibold text-ink tabular">
                  {formatNumber(p.mentioned)} <span className="text-sm font-normal text-ink-muted">of {formatNumber(p.checked)} answers</span>
                </p>
                <p className="text-xs text-ink-muted">Mentioned in {p.mentionRate}% of answers checked in this period</p>
              </>
            ) : (
              <p className="mt-2 text-xs text-ink-muted">
                {p.state === "not_connected" ? "Not connected: needs its own API key. ChatGPT answers are never shown here." : "No answers checked in this period."}
              </p>
            )}
          </div>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Prompts and latest ChatGPT answers"
          description={`${active.length} active prompts. Latest answer per prompt, whatever its date.`}
          actions={
            <div className="flex items-center gap-2">
              <ExportButton
                name="seo-ai-visibility-prompts"
                columns={[
                  { label: "Prompt", value: (p) => p.prompt_text },
                  { label: "Intent", value: (p) => p.intent },
                  { label: "Language", value: (p) => p.language },
                  { label: "Active", value: (p) => (p.is_active ? "Yes" : "No") },
                  { label: "ChatGPT Result", value: (p) => p.latest_answer?.result || "Not checked" },
                  { label: "Position", value: (p) => p.latest_answer?.brand_position || "" },
                  { label: "Checked At", value: (p) => p.latest_answer?.checked_at || "" },
                ]}
                rows={d.prompts}
              />
              {page.canEdit && chatgpt?.state !== "not_connected" ? <AiRunButton promptCount={active.length} running={running} /> : null}
            </div>
          }
        />
        {d.prompts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Prompt</th>
                  <th className="px-4 py-2 font-medium">ChatGPT result</th>
                  <th className="px-4 py-2 font-medium">Position</th>
                  <th className="px-4 py-2 font-medium">Evidence</th>
                  <th className="px-4 py-2 font-medium">Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line align-top">
                {d.prompts.map((p) => (
                  <tr key={p.id} className={p.is_active ? "" : "opacity-60"}>
                    <td className="max-w-xs px-4 py-2.5">
                      <span className="block text-ink">{p.prompt_text}</span>
                      <span className="text-xs text-ink-muted">
                        {p.intent} · {p.language === "hi" ? "Hindi" : "English"}
                        {p.is_active ? "" : " · switched off"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {p.result_status ? <Badge tone={RESULT[p.result_status]?.tone}>{RESULT[p.result_status]?.label}</Badge> : <span className="text-xs text-ink-muted">Not checked yet</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs">{p.observed_position ? `#${p.observed_position} in list` : "—"}</td>
                    <td className="max-w-md px-4 py-2.5 text-xs text-ink-soft">
                      {p.result_status === "ERROR" ? p.error_summary : p.evidence_snippet ? <span className="line-clamp-4">{p.evidence_snippet}</span> : "—"}
                      {p.evidence_url && (
                        <a href={p.evidence_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-brand-700 hover:underline">
                          {p.evidence_url}
                        </a>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-ink-muted">
                      {p.run_at ? formatDateTime(p.run_at) : "—"}
                      {p.model && <span className="block">{p.model} · API</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Unavailable>No prompts yet. Run the prompt library migration (2026-11-20-003).</Unavailable>
        )}
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader title="How this is measured" />
          <p className="px-4 py-3 text-sm text-ink-soft">{d.methodology}</p>
        </Card>
        <Card className="min-w-0">
          <CardHeader title="Recent ChatGPT runs" />
          {d.runs.length ? (
            <ul className="divide-y divide-line">
              {d.runs.map((r) => (
                <li key={r.id} className="px-4 py-2 text-sm">
                  <span className="block text-ink">
                    {RUN[r.status] ?? r.status} · {formatNumber(r.records_processed)} answers
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {formatDateTime(r.started_at)} · {r.triggered_by === "system" ? "automatic" : "manual"}
                  </span>
                  {r.error_summary && <span className="block text-xs text-danger-ink">{r.error_summary}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <Unavailable>No run yet. The first run is started by hand; after that it repeats every 14 days.</Unavailable>
          )}
        </Card>
      </div>
    </>
  );
}
