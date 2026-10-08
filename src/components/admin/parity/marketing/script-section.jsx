"use client";

import { useState } from "react";
import { Eye, FileText, History, Plus, RefreshCw, Video, X } from "lucide-react";
import { loadVideoScriptAction, scheduleVideoScriptAction } from "@/lib/actions/admin/parity/marketing";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatStamp } from "./format";
import { Markdown } from "./markdown";
import { ChipGroup, Collapsible, MetaItem, StatusPill, capitalize, truncate } from "./social-shared";

const DURATIONS = [
  { value: "15", label: "15 seconds - Ultra-short" },
  { value: "30", label: "30 seconds - Quick tips" },
  { value: "45", label: "45 seconds - Standard" },
  { value: "60", label: "60 seconds - Detailed" },
  { value: "90", label: "90 seconds - Deep dive" },
  { value: "custom", label: "Custom Duration" },
];
const STYLES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "energetic", label: "Energetic" },
  { value: "meme", label: "Meme/Humorous" },
  { value: "emotional", label: "Emotional/Storytelling" },
  { value: "urgent", label: "Urgent/Alert" },
];
const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi - हिंदी" },
  { value: "marathi", label: "Marathi - मराठी" },
  { value: "punjabi", label: "Punjabi - ਪੰਜਾਬੀ" },
  { value: "telugu", label: "Telugu - తెలుగు" },
  { value: "tamil", label: "Tamil - தமிழ்" },
  { value: "gujarati", label: "Gujarati - ગુજરાતી" },
  { value: "kannada", label: "Kannada - ಕನ್ನಡ" },
  { value: "bengali", label: "Bengali - বাংলা" },
  { value: "hinglish", label: "Hinglish" },
];
const VIDEO_TYPES = [
  { value: "explainer", label: "Explainer" },
  { value: "product_showcase", label: "Product Showcase" },
  { value: "alert", label: "Alert/Announcement" },
  { value: "skit", label: "Skit/Drama" },
  { value: "meme", label: "Meme/Trend" },
  { value: "offer", label: "Offer/Promotion" },
  { value: "case_study", label: "Case Study/Success Story" },
  { value: "tips", label: "Tips/Listicle" },
  { value: "behind_scenes", label: "Behind-the-Scenes" },
  { value: "tutorial", label: "Tutorial/How-To" },
];
const VIDEO_TYPE_LABELS = { explainer: "Explainer", product_showcase: "Product Showcase", alert: "Alert/Announcement", skit: "Skit/Drama", meme: "Meme/Trend", offer: "Offer/Promotion", case_study: "Case Study", tips: "Tips/Listicle", behind_scenes: "Behind-the-Scenes", tutorial: "Tutorial/How-To" };
const AUDIENCES = [
  { value: "farmers", label: "Farmers" },
  { value: "vendors", label: "Vendors" },
  { value: "buyers", label: "Buyers" },
  { value: "agri_businesses", label: "Agri-Businesses" },
  { value: "general_public", label: "General Public" },
];
const CTAS = [
  { value: "visit_website", label: "Visit Website" },
  { value: "download_app", label: "Download App" },
  { value: "shop_now", label: "Shop Now" },
  { value: "sign_up", label: "Sign Up" },
  { value: "learn_more", label: "Learn More" },
  { value: "share_this", label: "Share This" },
  { value: "comment_below", label: "Comment Below" },
  { value: "save_for_later", label: "Save for Later" },
  { value: "follow_for_more", label: "Follow for More" },
  { value: "contact_us", label: "Contact Us" },
  { value: "custom", label: "Custom CTA" },
];
const OPTIONS = [
  { value: "generateThumbnail", label: "Generate Thumbnail" },
  { value: "generateStoryboard", label: "Generate Storyboard" },
  { value: "includeHashtags", label: "Include Hashtags" },
];
const INITIAL = {
  duration: "60",
  customDuration: "",
  style: "casual",
  language: "hinglish",
  videoType: "product_showcase",
  targetAudience: ["farmers"],
  topic: "",
  productName: "",
  keyPoints: [""],
  cta: "shop_now",
  customCta: "",
  options: OPTIONS.map((o) => o.value),
  brandVoiceNotes: "",
};

/** social_media_dashboard.php "Video Script Generator": the request form, the latest script and the history. */
export function ScriptSection({ latest, history, canAdd, onRefresh, refreshing }) {
  const { notify } = useToast();
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [shown, setShown] = useState(null);
  const [viewing, setViewing] = useState(null);
  const script = shown ?? latest;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setPoint = (i, value) => setForm((f) => ({ ...f, keyPoints: f.keyPoints.map((p, n) => (n === i ? value : p)) }));

  async function submit(e) {
    e.preventDefault();
    const duration = form.duration === "custom" ? Number(form.customDuration) : Number(form.duration);
    if (!form.topic.trim()) return notify({ message: "Please enter a topic for the video script", tone: "error" });
    if (!form.targetAudience.length) return notify({ message: "Please select at least one target audience", tone: "error" });
    if (!Number.isInteger(duration) || duration < 10 || duration > 300) return notify({ message: "Please enter a valid duration between 10 and 300 seconds", tone: "error" });
    setSubmitting(true);
    const result = await scheduleVideoScriptAction({
      videoType: form.videoType,
      duration,
      style: form.style,
      language: form.language,
      targetAudience: form.targetAudience,
      topic: form.topic,
      productName: form.productName,
      keyPoints: form.keyPoints.map((p) => p.trim()).filter(Boolean),
      cta: form.cta,
      customCta: form.cta === "custom" ? form.customCta : "",
      brandVoiceNotes: form.brandVoiceNotes,
      generateThumbnail: form.options.includes("generateThumbnail"),
      generateStoryboard: form.options.includes("generateStoryboard"),
      includeHashtags: form.options.includes("includeHashtags"),
    });
    setSubmitting(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    notify({ message: result.data?.message ?? "Video script generation scheduled successfully! It will appear shortly.", tone: "success" });
    setTimeout(() => {
      setShown(null);
      onRefresh();
    }, 3000);
  }

  async function view(id) {
    setViewing(id);
    const result = await loadVideoScriptAction(id);
    setViewing(null);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    setShown(result.data);
    document.getElementById("video-script-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Collapsible id="video-script-generator" title="Video Script Generator" icon={Video} badge="AI-POWERED">
      {canAdd && (
        <form onSubmit={submit} className="grid gap-4 p-4 md:grid-cols-2">
          <Field label="Video Length">
            {({ id }) => (
              <div className="space-y-2">
                <Select id={id} value={form.duration} onChange={set("duration")} options={DURATIONS} />
                {form.duration === "custom" && <Input type="number" min={10} max={300} value={form.customDuration} onChange={set("customDuration")} placeholder="Enter duration in seconds" aria-label="Custom duration in seconds" />}
              </div>
            )}
          </Field>
          <Field label="Video Style">{({ id }) => <Select id={id} value={form.style} onChange={set("style")} options={STYLES} />}</Field>
          <Field label="Language">{({ id }) => <Select id={id} value={form.language} onChange={set("language")} options={LANGUAGES} />}</Field>
          <Field label="Video Type">{({ id }) => <Select id={id} value={form.videoType} onChange={set("videoType")} options={VIDEO_TYPES} />}</Field>
          <div className="md:col-span-2">
            <ChipGroup label="Target Audience" options={AUDIENCES} value={form.targetAudience} onChange={(targetAudience) => setForm((f) => ({ ...f, targetAudience }))} columns="sm:grid-cols-3 lg:grid-cols-5" />
          </div>
          <Field label="Topic" required className="md:col-span-2">
            {({ id }) => <Input id={id} required maxLength={500} value={form.topic} onChange={set("topic")} placeholder="Enter the main topic or subject for the video script..." />}
          </Field>
          <Field label="Product Name (Optional)">{({ id }) => <Input id={id} maxLength={255} value={form.productName} onChange={set("productName")} placeholder="Enter product name if applicable..." />}</Field>
          <fieldset className="md:col-span-2">
            <legend className="mb-1.5 text-[13px] font-medium text-ink-soft">Key Points</legend>
            <div className="space-y-2">
              {form.keyPoints.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={p} maxLength={500} onChange={(e) => setPoint(i, e.target.value)} placeholder="Enter key point..." aria-label={`Key point ${i + 1}`} />
                  <Button
                    size="icon"
                    variant="danger"
                    aria-label={`Remove key point ${i + 1}`}
                    onClick={() => setForm((f) => ({ ...f, keyPoints: f.keyPoints.length > 1 ? f.keyPoints.filter((_, n) => n !== i) : [""] }))}
                  >
                    <X className="size-4" aria-hidden />
                  </Button>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-2" disabled={form.keyPoints.length >= 20} onClick={() => setForm((f) => ({ ...f, keyPoints: [...f.keyPoints, ""] }))}>
              <Plus className="size-4" aria-hidden />
              Add Key Point
            </Button>
          </fieldset>
          <Field label="Call-to-Action">
            {({ id }) => (
              <div className="space-y-2">
                <Select id={id} value={form.cta} onChange={set("cta")} options={CTAS} />
                {form.cta === "custom" && <Input maxLength={255} value={form.customCta} onChange={set("customCta")} placeholder="Enter custom CTA text..." aria-label="Custom CTA text" />}
              </div>
            )}
          </Field>
          <div className="md:col-span-2">
            <ChipGroup label="Additional Options" options={OPTIONS} value={form.options} onChange={(options) => setForm((f) => ({ ...f, options }))} columns="sm:grid-cols-3" />
          </div>
          <Field label="Brand Voice Notes (Optional)" className="md:col-span-2">
            {({ id }) => <Textarea id={id} rows={3} maxLength={2000} value={form.brandVoiceNotes} onChange={set("brandVoiceNotes")} placeholder="Add any specific brand voice guidelines, tone preferences, or additional context..." />}
          </Field>
          <div className="md:col-span-2">
            <Button type="submit" variant="primary" loading={submitting}>
              <Video className="size-4" aria-hidden />
              Generate Script
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4 p-4 pt-0">
        <Collapsible
          id="video-script-viewer"
          nested
          defaultOpen
          title="Latest Script"
          icon={FileText}
          actions={
            <>
              {script && <StatusPill status={script.status} upper />}
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
          {script ? (
            <div className="space-y-4 p-4">
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 rounded-lg bg-surface-muted p-3">
                <MetaItem label="Script ID">{script.scriptId || "N/A"}</MetaItem>
                <MetaItem label="Created">{formatStamp(script.createdAt)}</MetaItem>
                <MetaItem label="Type">{VIDEO_TYPE_LABELS[script.videoType] ?? script.videoType}</MetaItem>
                <MetaItem label="Duration">{script.duration}s</MetaItem>
                <MetaItem label="Style">{capitalize(script.style)}</MetaItem>
                <MetaItem label="Language">{capitalize(script.language)}</MetaItem>
                {script.productName && <MetaItem label="Product">{script.productName}</MetaItem>}
              </div>
              {script.scriptContent?.trim() ? <Markdown source={script.scriptContent} /> : <p className="py-8 text-center text-ink-muted">Script content is empty.</p>}
            </div>
          ) : (
            <div className="px-4 py-10 text-center">
              <h3 className="text-sm font-semibold text-ink">No Script Available</h3>
              <p className="mt-1 text-sm text-ink-muted">Generate a new video script using the form above, or wait for the latest script to load.</p>
            </div>
          )}
        </Collapsible>

        <Collapsible id="video-script-history" nested defaultOpen title="Scripts History" icon={History} badge={`${history.rows.length} SCRIPTS`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Video scripts history</caption>
              <thead className="text-left text-xs font-semibold text-ink-muted">
                <tr>
                  {["Script ID", "Created", "Type", "Duration", "Style", "Language", "Topic", "Status", "Actions"].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {history.rows.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2"><code className="rounded bg-brand-50 px-2 py-0.5 text-xs text-[#10A450]">#{s.scriptId || s.id}</code></td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatStamp(s.createdAt)}</td>
                    <td className="px-3 py-2"><span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-[#10A450]">{VIDEO_TYPE_LABELS[s.videoType] ?? s.videoType}</span></td>
                    <td className="px-3 py-2">{s.duration}s</td>
                    <td className="px-3 py-2">{capitalize(s.style)}</td>
                    <td className="px-3 py-2">{capitalize(s.language)}</td>
                    <td className="px-3 py-2">{truncate(s.topic || "N/A", 30)}</td>
                    <td className="px-3 py-2"><StatusPill status={s.status} /></td>
                    <td className="px-3 py-2">
                      <Button size="xs" variant="outline" onClick={() => view(s.id)} loading={viewing === s.id}>
                        <Eye className="size-3.5" aria-hidden />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {!history.rows.length && (
                  <tr>
                    <td colSpan={9} className="px-3 py-10 text-center text-ink-muted">No scripts generated yet</td>
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
