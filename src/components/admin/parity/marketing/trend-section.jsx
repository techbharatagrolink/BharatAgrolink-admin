"use client";

import { useState } from "react";
import { Eye, FileDown, FileText, History, RefreshCw, Rocket } from "lucide-react";
import { loadTrendReportAction, scheduleTrendReportAction } from "@/lib/actions/admin/parity/marketing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatStamp } from "./format";
import { Markdown } from "./markdown";
import { printElement } from "./print-button";
import { ChipGroup, Collapsible, MetaItem, StatusPill, capitalize, truncate } from "./social-shared";

const SCOPES = [
  { value: "quick", label: "Quick", hint: "Top 5 trends, faster" },
  { value: "standard", label: "Standard", hint: "Top 10 trends, balanced" },
  { value: "deep", label: "Deep", hint: "Top 20+ trends, comprehensive" },
];
const CATEGORIES = ["Social Media Trends", "Agricultural News", "Government Policies", "Market Prices", "Seasonal Diseases", "Seasonal Tips", "Competitor Activity", "Technology Adoption", "Sustainable Farming"];
const REGIONS = ["Pan India", "Maharashtra", "Punjab", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "West Bengal"];
const TIME_FRAMES = [
  { value: "last_24_hours", label: "Last 24 Hours" },
  { value: "last_week", label: "Last Week" },
  { value: "last_month", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];
const FORMATS = [
  { value: "general", label: "General Content" },
  { value: "instagram_reels", label: "Instagram Reels" },
  { value: "youtube_videos", label: "YouTube Videos" },
  { value: "all_platforms", label: "All Platforms" },
];
const TIME_FRAME_LABELS = { last_24_hours: "24 Hours", last_week: "Last Week", last_month: "Last Month", custom: "Custom" };
const FORMAT_LABELS = { general: "General", instagram_reels: "Instagram Reels", youtube_videos: "YouTube Videos", all_platforms: "All Platforms" };
const INITIAL = { scope: "standard", categories: ["Social Media Trends", "Agricultural News", "Market Prices"], regions: ["Pan India"], timeFrame: "last_week", startDate: "", endDate: "", contentFormat: "general", additionalContext: "" };

function Tags({ list, max, len }) {
  return (
    <div className="flex flex-wrap gap-1">
      {list.slice(0, 2).map((t) => (
        <span key={t} className="rounded border border-line px-1.5 py-0.5 text-[11px]">{truncate(t, len)}</span>
      ))}
      {list.length > max && <span className="rounded border border-line px-1.5 py-0.5 text-[11px]">+{list.length - max}</span>}
    </div>
  );
}

/** social_media_dashboard.php "Trend Analyser": the request form, the latest report and the history. */
export function TrendSection({ latest, history, canAdd, onRefresh, refreshing }) {
  const { notify } = useToast();
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [shown, setShown] = useState(null);
  const [viewing, setViewing] = useState(null);
  const report = shown ?? latest;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.categories.length) return notify({ message: "Please select at least one category", tone: "error" });
    if (!form.regions.length) return notify({ message: "Please select at least one region", tone: "error" });
    if (form.timeFrame === "custom" && (!form.startDate || !form.endDate)) return notify({ message: "Please select both start and end dates", tone: "error" });
    setSubmitting(true);
    const result = await scheduleTrendReportAction(form);
    setSubmitting(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    notify({ message: result.data?.message ?? "Report generation scheduled successfully! It will appear shortly.", tone: "success" });
    setTimeout(() => {
      setShown(null);
      onRefresh();
    }, 3000);
  }

  async function view(id) {
    setViewing(id);
    const result = await loadTrendReportAction(id);
    setViewing(null);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    setShown(result.data);
    document.getElementById("trend-report-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exportPdf() {
    if (!printElement(document.getElementById("trend-report-print"), `Trend Analysis Report ${report.reportId ?? ""}`.trim())) {
      notify({ message: "Allow pop-ups for this site to export the report.", tone: "error" });
    }
  }

  return (
    <Collapsible id="trend-analyser" title="Trend Analyser" icon={Rocket} badge="AI-POWERED">
      {canAdd && (
        <form onSubmit={submit} className="grid gap-4 p-4 md:grid-cols-2">
          <fieldset className="md:col-span-2">
            <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">Analysis Scope</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {SCOPES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={form.scope === s.value}
                  onClick={() => setForm((f) => ({ ...f, scope: s.value }))}
                  className={cn("rounded-lg border px-3 py-2 text-left", form.scope === s.value ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-ink-soft hover:border-brand-200")}
                >
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <small className="text-xs opacity-80">{s.hint}</small>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="md:col-span-2">
            <ChipGroup label="Categories" options={CATEGORIES} value={form.categories} onChange={(categories) => setForm((f) => ({ ...f, categories }))} />
          </div>
          <div className="md:col-span-2">
            <ChipGroup label="Target Regions" options={REGIONS} value={form.regions} onChange={(regions) => setForm((f) => ({ ...f, regions }))} />
          </div>
          <Field label="Time Frame">
            {({ id }) => (
              <div className="space-y-2">
                <Select id={id} value={form.timeFrame} onChange={set("timeFrame")} options={TIME_FRAMES} />
                {form.timeFrame === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" aria-label="Start Date" value={form.startDate} max={form.endDate || undefined} onChange={set("startDate")} />
                    <Input type="date" aria-label="End Date" value={form.endDate} min={form.startDate || undefined} onChange={set("endDate")} />
                  </div>
                )}
              </div>
            )}
          </Field>
          <Field label="Content Format">{({ id }) => <Select id={id} value={form.contentFormat} onChange={set("contentFormat")} options={FORMATS} />}</Field>
          <Field label="Additional Context (Optional)" className="md:col-span-2">
            {({ id }) => <Textarea id={id} rows={3} maxLength={2000} value={form.additionalContext} onChange={set("additionalContext")} placeholder="Add any specific focus areas, upcoming campaigns, or additional context for the analysis..." />}
          </Field>
          <div className="md:col-span-2">
            <Button type="submit" variant="primary" loading={submitting}>
              <Rocket className="size-4" aria-hidden />
              Generate Report
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4 p-4 pt-0">
        <Collapsible
          id="trend-report-viewer"
          nested
          defaultOpen
          title="Latest Report"
          icon={FileText}
          actions={
            <>
              {report && <StatusPill status={report.status} upper />}
              {report && (
                <Button size="xs" variant="outline" onClick={exportPdf}>
                  <FileDown className="size-3.5" aria-hidden />
                  Export PDF
                </Button>
              )}
              <Button
                size="xs"
                variant="outline"
                loading={refreshing}
                onClick={() => {
                  setShown(null);
                  onRefresh();
                }}
              >
                <RefreshCw className="size-3.5" aria-hidden />
                Refresh
              </Button>
            </>
          }
        >
          {report ? (
            <div id="trend-report-print" className="space-y-4 p-4">
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 rounded-lg bg-surface-muted p-3">
                <MetaItem label="Report ID">{report.reportId}</MetaItem>
                <MetaItem label="Generated">{formatStamp(report.generatedAt)}</MetaItem>
                <MetaItem label="Scope">{capitalize(report.scope)}</MetaItem>
                <MetaItem label="Format">{FORMAT_LABELS[report.contentFormat] ?? report.contentFormat}</MetaItem>
                <MetaItem label="Generation Cost">
                  <span className="text-[#10A450]">${report.cost.toFixed(4)}</span>{" "}
                  <span className="text-[11px] font-normal text-ink-muted">({Math.ceil((report.reportLength || report.report?.length || 0) / 4).toLocaleString()} tokens)</span>
                </MetaItem>
              </div>
              {report.report ? <Markdown source={report.report} /> : <p className="py-8 text-center text-ink-muted">Report content is empty.</p>}
            </div>
          ) : (
            <div className="px-4 py-10 text-center">
              <h3 className="text-sm font-semibold text-ink">No Report Available</h3>
              <p className="mt-1 text-sm text-ink-muted">Generate a new trend analysis report using the form above, or wait for the latest report to load.</p>
            </div>
          )}
        </Collapsible>

        <Collapsible id="trend-report-history" nested defaultOpen title="Reports History" icon={History} badge={`${history.rows.length} REPORTS`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Trend reports history</caption>
              <thead className="text-left text-xs font-semibold text-ink-muted">
                <tr>
                  {["Report ID", "Generated", "Scope", "Categories", "Regions", "Time Frame", "Status", "Cost", "Actions"].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {history.rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-3 py-2"><code className="rounded bg-brand-50 px-2 py-0.5 text-xs text-[#10A450]">#{r.reportId}</code></td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatStamp(r.generatedAt)}</td>
                    <td className="px-3 py-2"><span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-[#10A450]">{capitalize(r.scope)}</span></td>
                    <td className="px-3 py-2"><Tags list={r.categories} max={2} len={15} /></td>
                    <td className="px-3 py-2"><Tags list={r.regions} max={2} len={12} /></td>
                    <td className="px-3 py-2 whitespace-nowrap">{TIME_FRAME_LABELS[r.timeFrame] ?? r.timeFrame}</td>
                    <td className="px-3 py-2"><StatusPill status={r.status} /></td>
                    <td className="px-3 py-2 text-[13px] font-semibold text-[#10A450]">${r.cost.toFixed(4)}</td>
                    <td className="px-3 py-2">
                      <Button size="xs" variant="outline" onClick={() => view(r.id)} loading={viewing === r.id}>
                        <Eye className="size-3.5" aria-hidden />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {!history.rows.length && (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-ink-muted">No reports generated yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Collapsible>
      </div>
    </Collapsible>
  );
}
