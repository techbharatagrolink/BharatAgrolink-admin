"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { addSeoPromptAction, saveSeoSettingAction, toggleSeoPromptAction } from "@/lib/actions/admin/seo";

/*
 * Settings screen editors (task #104). Each editable setting opens a dialog with fields made for it;
 * the API validates the value again and logs the change with its before/after value.
 */

const lines = (text) =>
  String(text ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

const TITLES = {
  readiness_target: "Readiness target",
  readiness_weights: "Readiness category weights",
  brand_terms: "Brand terms",
  crawl_limits: "Website crawler",
  ai_openai: "ChatGPT checks",
};

function toForm(key, v) {
  switch (key) {
    case "brand_terms":
      return { terms: (v ?? []).join("\n") };
    case "crawl_limits":
      return { ...v, exclude_patterns: (v?.exclude_patterns ?? []).join("\n") };
    case "ai_openai":
      return { ...v, brand_domains: (v?.brand_domains ?? []).join("\n") };
    default:
      return { ...(v ?? {}) };
  }
}

function fromForm(key, f) {
  switch (key) {
    case "readiness_target":
      return { percent: Number(f.percent) };
    case "readiness_weights":
      return Object.fromEntries(Object.entries(f).map(([k, x]) => [k, Number(x)]));
    case "brand_terms":
      return lines(f.terms);
    case "crawl_limits":
      return { base_url: String(f.base_url ?? "").trim(), max_pages: Number(f.max_pages), delay_ms: Number(f.delay_ms), exclude_patterns: lines(f.exclude_patterns) };
    case "ai_openai":
      return { model: String(f.model ?? "").trim(), web_search: Boolean(f.web_search), interval_days: Number(f.interval_days), brand_domains: lines(f.brand_domains) };
    default:
      return f;
  }
}

function Fields({ settingKey, form, set, categories }) {
  const num = (name, label, hint, props = {}) => (
    <Field label={label} hint={hint}>
      {({ id }) => <Input id={id} type="number" value={form[name] ?? ""} onChange={(e) => set({ [name]: e.target.value })} {...props} />}
    </Field>
  );
  switch (settingKey) {
    case "readiness_target":
      return num("percent", "Target score (%)", "Shown as the goal on Progress to Target. 50–100.", { min: 50, max: 100 });
    case "readiness_weights":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <Field key={c.key} label={c.label}>
              {({ id }) => <Input id={id} type="number" min={0} max={10} step="0.5" value={form[c.key] ?? ""} onChange={(e) => set({ [c.key]: e.target.value })} />}
            </Field>
          ))}
          <p className="text-xs text-ink-muted sm:col-span-2">0–10 each. A category with weight 2 counts twice as much as one with 1. Changes apply from the next score.</p>
        </div>
      );
    case "brand_terms":
      return (
        <Field label="Brand terms, one per line" hint="A Search Console query or AI answer containing any of these counts as a brand mention.">
          {({ id }) => <Textarea id={id} rows={6} value={form.terms ?? ""} onChange={(e) => set({ terms: e.target.value })} />}
        </Field>
      );
    case "crawl_limits":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Website address" className="sm:col-span-2">
            {({ id }) => <Input id={id} value={form.base_url ?? ""} onChange={(e) => set({ base_url: e.target.value })} />}
          </Field>
          {num("max_pages", "Maximum pages", "10–5000", { min: 10, max: 5000 })}
          {num("delay_ms", "Delay between pages (ms)", "At least 500 so the site is never overloaded.", { min: 500, max: 10000 })}
          <Field label="Paths never crawled, one per line" className="sm:col-span-2" hint="robots.txt rules are always obeyed as well.">
            {({ id }) => <Textarea id={id} rows={4} value={form.exclude_patterns ?? ""} onChange={(e) => set({ exclude_patterns: e.target.value })} />}
          </Field>
        </div>
      );
    case "ai_openai":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="OpenAI model">{({ id }) => <Input id={id} value={form.model ?? ""} onChange={(e) => set({ model: e.target.value })} />}</Field>
          {num("interval_days", "Run every (days)", "7–90. Fewer runs = lower OpenAI cost.", { min: 7, max: 90 })}
          <div className="sm:col-span-2">
            <Switch
              checked={Boolean(form.web_search)}
              onChange={(v) => set({ web_search: v })}
              label="Web search"
              description="On: answers match the ChatGPT app more closely (about $0.025 per prompt). Off: much cheaper, but answers come from training data only."
            />
          </div>
          <Field label="Domains that count as a mention, one per line" className="sm:col-span-2">
            {({ id }) => <Textarea id={id} rows={2} value={form.brand_domains ?? ""} onChange={(e) => set({ brand_domains: e.target.value })} />}
          </Field>
        </div>
      );
    default:
      return null;
  }
}

/** "Edit" button + dialog for one setting. */
export function SettingEditButton({ setting, categories }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(setting.setting_key, setting.setting_value));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const openDialog = () => {
    setForm(toForm(setting.setting_key, setting.setting_value));
    setError("");
    setOpen(true);
  };
  const save = () =>
    startTransition(async () => {
      const res = await saveSeoSettingAction(setting.setting_key, fromForm(setting.setting_key, form));
      if (!res.ok) return setError(res.message);
      setOpen(false);
      notify({ message: `${TITLES[setting.setting_key]} saved.` });
      router.refresh();
    });

  return (
    <>
      <Button size="sm" variant="outline" onClick={openDialog}>
        <Pencil className="size-3.5" aria-hidden />
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Edit ${TITLES[setting.setting_key] ?? setting.setting_key}`}
        description={setting.description}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save} loading={pending}>
              Save
            </Button>
          </>
        }
      >
        <Fields settingKey={setting.setting_key} form={form} set={set} categories={categories} />
        {error && (
          <p className="mt-3 text-sm text-danger-ink" role="alert">
            {error}
          </p>
        )}
      </Dialog>
    </>
  );
}

const INTENTS = ["farmer", "product", "category", "marketplace", "brand"].map((v) => ({ value: v, label: v }));
const LANGS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
];

/** AI prompt library: switch prompts on/off, add new ones. */
export function PromptLibrary({ prompts, canEdit, canAdd }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ prompt_text: "", intent: "farmer", language: "en" });
  const [error, setError] = useState("");
  const active = prompts.filter((p) => p.is_active).length;

  const toggle = (p) => {
    setBusyId(p.id);
    startTransition(async () => {
      const res = await toggleSeoPromptAction(p.id, !p.is_active);
      setBusyId(null);
      notify(res.ok ? { message: p.is_active ? "Prompt switched off." : "Prompt switched on." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });
  };
  const add = () =>
    startTransition(async () => {
      const res = await addSeoPromptAction(draft);
      if (!res.ok) return setError(res.message);
      setOpen(false);
      setDraft({ prompt_text: "", intent: "farmer", language: "en" });
      notify({ message: "Prompt added. It is asked from the next ChatGPT run." });
      router.refresh();
    });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5 text-xs text-ink-muted">
        <span>
          {active} of {prompts.length} on · each active prompt costs about $0.025 per run with web search
        </span>
        {canAdd && (
          <Button size="sm" variant="outline" onClick={() => (setError(""), setOpen(true))}>
            <Plus className="size-3.5" aria-hidden />
            Add prompt
          </Button>
        )}
      </div>
      <ul className="divide-y divide-line">
        {prompts.map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
            <span className={p.is_active ? "min-w-0 text-ink" : "min-w-0 text-ink-muted"}>
              {p.prompt_text}
              <span className="mt-0.5 flex gap-1.5 text-xs">
                <Badge tone="neutral">{p.intent}</Badge>
                <Badge tone="neutral">{p.language === "hi" ? "Hindi" : "English"}</Badge>
                {!p.is_active && <Badge tone="warning">Off</Badge>}
              </span>
            </span>
            {canEdit && (
              <Button size="sm" variant={p.is_active ? "outline" : "primary"} onClick={() => toggle(p)} loading={pending && busyId === p.id} disabled={pending}>
                {p.is_active ? "Switch off" : "Switch on"}
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add a prompt"
        description="A question a farmer or buyer would ask an AI assistant. Avoid naming Bharat Agrolink unless it is a brand question."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button variant="primary" onClick={add} loading={pending}>
              Add
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Question" className="sm:col-span-2" required>
            {({ id }) => <Textarea id={id} rows={3} value={draft.prompt_text} onChange={(e) => setDraft((d) => ({ ...d, prompt_text: e.target.value }))} />}
          </Field>
          <Field label="Intent">{({ id }) => <Select id={id} options={INTENTS} value={draft.intent} onChange={(e) => setDraft((d) => ({ ...d, intent: e.target.value }))} />}</Field>
          <Field label="Language">{({ id }) => <Select id={id} options={LANGS} value={draft.language} onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))} />}</Field>
        </div>
        {error && (
          <p className="mt-3 text-sm text-danger-ink" role="alert">
            {error}
          </p>
        )}
      </Dialog>
    </>
  );
}
