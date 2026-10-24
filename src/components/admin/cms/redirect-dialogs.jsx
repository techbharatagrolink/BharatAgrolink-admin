"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { Download, ExternalLink, Play, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatNumber } from "@/lib/format";
import {
  checkRedirectAction,
  deleteAllRedirectsAction,
  importRedirectsAction,
  previewRedirectImportAction,
  redirectLogsAction,
  saveRedirectAction,
  testRedirectAction,
} from "@/lib/actions/admin/redirects";

export const DELETE_ALL_KEYWORD = "DELETE_ALL_CONFIRMED";
export const SAMPLE_HREF = "/admin/cms/redirects/download?file=sample";

const STATUS_OPTIONS = [
  { value: 301, label: "301 · Moved permanently (recommended for SEO)" },
  { value: 302, label: "302 · Temporary redirect" },
];

/** "water-soluble" -> "/water-soluble"; "/" stays. */
export const showPath = (path) => (!path || path === "/" ? "/" : `/${String(path).replace(/^\/+/, "")}`);

/** Where a destination opens: full URLs as they are, paths on the website. */
export function websiteHref(target, siteUrl) {
  const value = String(target ?? "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  return `${String(siteUrl ?? "").replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}

function DestinationLink({ target, siteUrl, className }) {
  return (
    <a href={websiteHref(target, siteUrl)} target="_blank" rel="noopener noreferrer" className={className ?? "inline-flex max-w-full items-center gap-1 break-all text-brand-700 hover:underline"}>
      <span className="min-w-0 break-all">{target}</span>
      <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
    </a>
  );
}

/* ---------- Add / edit ---------- */

const EMPTY_RULE = { sourceUrl: "", targetUrl: "", statusCode: 301, keepQueryParams: false, overrideRoute: false, isActive: true, notes: "" };

function initialForm(rule) {
  if (!rule) return EMPTY_RULE;
  return {
    sourceUrl: rule.sourceUrl ?? "",
    targetUrl: rule.targetUrl ?? "",
    statusCode: rule.statusCode === 302 ? 302 : 301,
    keepQueryParams: Boolean(rule.keepQueryParams),
    overrideRoute: Boolean(rule.overrideRoute),
    isActive: Boolean(rule.isActive),
    notes: rule.notes ?? "",
  };
}

/** Mount with a fresh `key` each time it opens; `rule` is null for a new redirect. */
export function RedirectFormDialog({ rule, onClose, onSaved }) {
  const { notify } = useToast();
  const formId = useId();
  const [form, setForm] = useState(() => initialForm(rule));
  const [check, setCheck] = useState(null);
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();
  const latest = useRef(0);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  // Live warnings as in the PHP form: collision with a page, loops, chains, unapproved domains.
  const sourceUrl = form.sourceUrl.trim();
  const targetUrl = form.targetUrl.trim();
  useEffect(() => {
    if (!sourceUrl && !targetUrl) return undefined;
    const request = ++latest.current;
    const timer = setTimeout(async () => {
      const result = await checkRedirectAction({ sourceUrl, targetUrl, excludeId: rule?.id });
      if (request === latest.current) setCheck(result.ok ? { ...result.data, sourceUrl, targetUrl } : null);
    }, 400);
    return () => clearTimeout(timer);
  }, [sourceUrl, targetUrl, rule?.id]);

  const current = check && check.sourceUrl === sourceUrl && check.targetUrl === targetUrl ? check : null;
  const blocking = current && (current.protected || current.duplicate || current.loop || current.target);

  const submit = (event) => {
    event.preventDefault();
    setError(null);
    if (!sourceUrl || !targetUrl) return setError("Both the source URL and the destination are required.");
    startBusy(async () => {
      const result = await saveRedirectAction(rule?.id ?? null, form);
      if (!result.ok) return setError(result.message);
      notify({ title: rule ? "Redirect updated" : "Redirect added", message: result.message });
      onSaved?.();
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={rule ? `Edit redirect #${rule.id}` : "Add redirect"}
      description="Visitors and search engines that open the source address are sent to the destination before any page loads."
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={busy} disabled={Boolean(blocking)}>
            Save redirect
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="space-y-4">
        {error && <Notice tone="danger">{error}</Notice>}
        {current && (
          <div className="space-y-2">
            {[current.protected, current.duplicate?.message, current.loop, current.target].filter(Boolean).map((message) => (
              <Notice key={message} tone="danger">
                {message}
              </Notice>
            ))}
            {current.liveRoute && !form.overrideRoute && (
              <Notice tone="warning" title="This address is a live page">
                {current.liveRoute} opens at {showPath(current.sourcePath)}. The rule is saved, but it only redirects once you tick “Override existing route”.
              </Notice>
            )}
            {current.liveRoute && form.overrideRoute && (
              <Notice tone="info">Override is on: visitors to {current.liveRoute} will be redirected instead of seeing the page.</Notice>
            )}
            {current.chain && <Notice tone="info">{current.chain}</Notice>}
          </div>
        )}

        <Field
          label="Source URL or path"
          required
          hint={
            current?.sourcePath
              ? `Matches ${showPath(current.sourcePath)}: letter case, trailing slashes and the query string are ignored.`
              : "Any old address: a path, a full URL, encoded characters (%26), or / for the home page."
          }
        >
          {({ id, describedBy }) => (
            <Input id={id} aria-describedby={describedBy} value={form.sourceUrl} onChange={(e) => set({ sourceUrl: e.target.value })} placeholder="/old-page or https://www.bharatagrolink.com/old-page" autoComplete="off" autoFocus maxLength={2000} required />
          )}
        </Field>

        <Field label="Destination URL or path" required hint="A path on the website (recommended), e.g. /products/pebbles, or a full URL on bharatagrolink.com.">
          {({ id, describedBy }) => (
            <Input id={id} aria-describedby={describedBy} value={form.targetUrl} onChange={(e) => set({ targetUrl: e.target.value })} placeholder="/products/pebbles" autoComplete="off" maxLength={2000} required />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="HTTP status code">
            {({ id }) => <Select id={id} value={form.statusCode} onChange={(e) => set({ statusCode: Number(e.target.value) })} options={STATUS_OPTIONS} />}
          </Field>
          <Field label="Internal note (optional)">
            {({ id }) => <Input id={id} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="e.g. Search Console clean-up, Oct 2026" maxLength={255} />}
          </Field>
        </div>

        <div className="space-y-2.5 rounded-lg border border-line bg-surface-muted p-3">
          <Checkbox label={<span>Preserve the incoming query string (e.g. <code>?utm_source=…</code>)</span>} checked={form.keepQueryParams} onChange={(e) => set({ keepQueryParams: e.target.checked })} />
          <Checkbox label="Override existing route: redirect even if this address is a live page" checked={form.overrideRoute} onChange={(e) => set({ overrideRoute: e.target.checked })} />
          <Checkbox label="Active: start redirecting right away" checked={form.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
        </div>
      </form>
    </Dialog>
  );
}

/* ---------- Bulk import ---------- */

export function ImportDialog({ canUpdate, onClose, onImported }) {
  const { notify } = useToast();
  const [file, setFile] = useState(null);
  const [updateExisting, setUpdateExisting] = useState(canUpdate);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(null);
  const [busy, startBusy] = useTransition();

  const payload = () => {
    const data = new FormData();
    data.append("file", file);
    if (updateExisting) data.append("updateExisting", "1");
    return data;
  };
  const run = (kind) => {
    setError(null);
    if (!file) return setError("Choose an .xlsx or .csv file first.");
    setStep(kind);
    startBusy(async () => {
      const result = kind === "preview" ? await previewRedirectImportAction(payload()) : await importRedirectsAction(payload());
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (kind === "preview") return setPreview(result.data);
      notify({ title: "Redirects imported", message: result.message, duration: 7000 });
      onImported?.();
    });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      size="xl"
      title="Import redirects from Excel or CSV"
      description="The first sheet is read and its first row is the column headings. Columns such as “Current URL canonical page” and “301 Redirect Pages” (Search Console), or Source / Target, are found automatically."
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Close
          </Button>
          <Button onClick={() => run("preview")} loading={busy && step === "preview"} disabled={busy || !file}>
            Preview &amp; validate
          </Button>
          <Button variant="primary" onClick={() => run("import")} loading={busy && step === "import"} disabled={busy || !file}>
            <Upload className="size-4" aria-hidden /> Import
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error && <Notice tone="danger">{error}</Notice>}
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-7 text-center hover:bg-surface-muted">
          <Upload className="size-5 text-ink-muted" aria-hidden />
          <span className="text-sm font-medium break-all text-ink">{file ? file.name : "Choose an .xlsx or .csv file"}</span>
          <span className="text-xs text-ink-muted">Up to 5 MB and 20,000 rows. New rules are active 301 redirects.</span>
          <input
            type="file"
            accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="sr-only"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setPreview(null);
              setError(null);
            }}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Checkbox
            label="Update the destination when a source already has a rule"
            checked={updateExisting}
            disabled={!canUpdate}
            onChange={(e) => {
              setUpdateExisting(e.target.checked);
              setPreview(null);
            }}
          />
          <a href={SAMPLE_HREF} className="inline-flex items-center gap-1 text-[13px] text-brand-700 hover:underline">
            <Download className="size-3.5" aria-hidden /> Sample template
          </a>
        </div>

        {preview && <ImportPreview preview={preview} updateExisting={updateExisting} />}
      </div>
    </Dialog>
  );
}

function ImportPreview({ preview, updateExisting }) {
  return (
    <div className="space-y-3">
      <Notice tone={preview.validRows ? "info" : "warning"} title={`${formatNumber(preview.totalRows)} rows read from ${preview.fileName}`}>
        Source column “{preview.columns.source || "?"}”, destination column “{preview.columns.target || "?"}”.
      </Notice>
      <div className="flex flex-wrap gap-2">
        <Badge tone="success">{formatNumber(preview.newCount)} new</Badge>
        <Badge tone="warning">
          {formatNumber(preview.existingCount)} already have a rule{preview.existingCount ? (updateExisting ? " (destination updated)" : " (left as they are)") : ""}
        </Badge>
        {preview.liveCount > 0 && <Badge tone="info">{formatNumber(preview.liveCount)} are live pages (saved, run only with Override)</Badge>}
        <Badge tone={preview.skippedCount ? "danger" : "neutral"}>{formatNumber(preview.skippedCount)} skipped</Badge>
      </div>

      {preview.preview.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-max text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                <th className="px-3 py-2 font-semibold text-ink-muted">Row</th>
                <th className="px-3 py-2 font-semibold text-ink-muted">Source path</th>
                <th className="px-3 py-2 font-semibold text-ink-muted">Destination</th>
                <th className="px-3 py-2 font-semibold text-ink-muted">Note</th>
              </tr>
            </thead>
            <tbody>
              {preview.preview.map((r) => (
                <tr key={r.row} className="border-b border-line last:border-0">
                  <td className="px-3 py-1.5 text-ink-muted tabular">{r.row}</td>
                  <td className="max-w-[16rem] truncate px-3 py-1.5" title={r.sourceUrl}>
                    <code>{showPath(r.sourcePath)}</code>
                  </td>
                  <td className="max-w-[20rem] truncate px-3 py-1.5" title={r.targetUrl}>
                    {r.targetUrl}
                  </td>
                  <td className="px-3 py-1.5">
                    {r.existingId ? <Badge tone="warning">Rule #{r.existingId}</Badge> : <Badge tone="success">New</Badge>}
                    {r.liveRoute && (
                      <Badge tone="info" className="ml-1">
                        Live page
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.validRows > preview.preview.length && <p className="border-t border-line px-3 py-1.5 text-xs text-ink-muted">First {preview.preview.length} of {formatNumber(preview.validRows)} valid rows.</p>}
        </div>
      )}

      {preview.skipped.length > 0 && (
        <details className="rounded-lg border border-line" open={!preview.validRows}>
          <summary className="cursor-pointer px-3 py-2 text-[13px] font-medium text-ink">Skipped rows ({formatNumber(preview.skippedCount)})</summary>
          <ul className="max-h-56 divide-y divide-line overflow-y-auto border-t border-line text-[12.5px]">
            {preview.skipped.map((s) => (
              <li key={`${s.row}-${s.reason}`} className="flex gap-3 px-3 py-1.5">
                <span className="w-14 shrink-0 text-ink-muted tabular">Row {s.row}</span>
                <span className="min-w-0 break-words text-ink-soft">{s.reason}</span>
              </li>
            ))}
          </ul>
          {preview.skippedCount > preview.skipped.length && <p className="border-t border-line px-3 py-1.5 text-xs text-ink-muted">First {preview.skipped.length} shown.</p>}
        </details>
      )}
    </div>
  );
}

/* ---------- Test a URL ---------- */

const TEST_TONE = { protected: "info", skipped: "warning", inactive: "warning", no_match: "info" };
const TEST_TITLE = { protected: "Protected path", skipped: "A rule matches, but it does not run", inactive: "Inactive rule", no_match: "No matching redirect" };

/** Mount with a fresh `key`; `initialUrl` is tested straight away. */
export function TestDialog({ initialUrl = "", siteUrl, onClose }) {
  const [url, setUrl] = useState(initialUrl);
  const [result, setResult] = useState(null);
  const [busy, startBusy] = useTransition();

  const run = useCallback(
    (value) =>
      startBusy(async () => {
        setResult(await testRedirectAction(value));
      }),
    [],
  );
  useEffect(() => {
    if (initialUrl) run(initialUrl);
  }, [initialUrl, run]);

  const submit = (event) => {
    event.preventDefault();
    if (url.trim()) run(url.trim());
  };
  const d = result?.ok ? result.data : null;

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Test a URL"
      description="Shows what the website does with an address right now, using the same rules as the live redirect engine."
      footer={<Button onClick={onClose}>Close</Button>}
    >
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/old-page or https://www.bharatagrolink.com/old-page?utm_source=x" aria-label="URL or path to test" autoFocus />
        <Button type="submit" variant="primary" loading={busy} disabled={!url.trim()}>
          <Play className="size-4" aria-hidden /> Test
        </Button>
      </form>

      <div className="mt-4 space-y-3" aria-live="polite">
        {result && !result.ok && <Notice tone="danger">{result.message}</Notice>}
        {d?.status === "matched" && (
          <>
            <Notice tone="success" title={`HTTP ${d.statusCode} redirect`}>
              <DestinationLink target={d.destination} siteUrl={siteUrl} className="inline-flex max-w-full items-center gap-1 font-medium break-all underline" />
            </Notice>
            <dl className="divide-y divide-line rounded-lg border border-line text-[13px]">
              {[
                ["Requested path", <code key="p">{showPath(d.testedPath)}</code>],
                ["Matched rule", `#${d.ruleId} · ${d.sourceUrl}`],
                ["Rules followed", d.chain.length ? [showPath(d.sourcePath), ...d.chain.map(showPath)].join(" → ") : "None (direct)"],
                ["Query string", d.keepQueryParams ? "Passed on to the destination" : "Dropped"],
                ["Route override", d.overrideRoute ? "Yes" : "No"],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 px-3 py-2 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="min-w-0 break-words text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
        {d && d.status !== "matched" && (
          <Notice tone={TEST_TONE[d.status] ?? "info"} title={TEST_TITLE[d.status] ?? "Result"}>
            {d.message}
          </Notice>
        )}
      </div>
    </Dialog>
  );
}

/* ---------- Audit log ---------- */

const ACTION_TONE = { create: "success", update: "brand", toggle: "neutral", delete: "danger", delete_all: "danger", bulk_import: "info" };

export function LogsDialog({ onClose }) {
  const [state, setState] = useState({ loading: true, logs: [], error: null });

  useEffect(() => {
    let alive = true;
    redirectLogsAction().then((result) => {
      if (alive) setState({ loading: false, logs: result.ok ? result.data ?? [] : [], error: result.ok ? null : result.message });
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Dialog open onClose={onClose} size="xl" title="Redirect audit log" description="The latest 100 changes made from this panel or the PHP admin." footer={<Button onClick={onClose}>Close</Button>}>
      {state.loading && <p className="py-6 text-center text-sm text-ink-muted">Loading…</p>}
      {state.error && <Notice tone="danger">{state.error}</Notice>}
      {!state.loading && !state.error && !state.logs.length && <p className="py-6 text-center text-sm text-ink-muted">No changes recorded yet.</p>}
      {state.logs.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-max text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {["#", "Action", "Path", "Details", "By", "IP", "When"].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-semibold text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.logs.map((log) => (
                <tr key={log.id} className="border-b border-line align-top last:border-0">
                  <td className="px-3 py-1.5 text-ink-muted tabular">{log.id}</td>
                  <td className="px-3 py-1.5">
                    <Badge tone={ACTION_TONE[log.action] ?? "neutral"}>{log.action.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="max-w-[14rem] truncate px-3 py-1.5" title={log.sourcePath ?? ""}>
                    <code>{log.sourcePath && !["*", "bulk"].includes(log.sourcePath) ? showPath(log.sourcePath) : log.sourcePath ?? "—"}</code>
                  </td>
                  <td className="max-w-[22rem] px-3 py-1.5 whitespace-normal text-ink-soft">{log.details ?? "—"}</td>
                  <td className="px-3 py-1.5 text-ink-soft">{log.performedBy ?? "—"}</td>
                  <td className="px-3 py-1.5 text-ink-muted tabular">{log.ipAddress ?? "—"}</td>
                  <td className="px-3 py-1.5 text-ink-muted">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Dialog>
  );
}

/* ---------- Delete all ---------- */

export function DeleteAllDialog({ total, onClose, onDeleted }) {
  const { notify } = useToast();
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();
  const matches = value.trim() === DELETE_ALL_KEYWORD;

  const confirm = () =>
    startBusy(async () => {
      const result = await deleteAllRedirectsAction(value.trim());
      if (!result.ok) return setError(result.message);
      notify({ title: "All redirects deleted", message: result.message });
      onDeleted?.();
    });

  return (
    <Dialog
      open
      onClose={onClose}
      size="sm"
      title="Delete all redirects"
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirm} loading={busy} disabled={!matches}>
            Permanently delete all
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {error && <Notice tone="danger">{error}</Notice>}
        <Notice tone="danger">This permanently removes all {formatNumber(total)} redirect rules. Old links will stop redirecting on the website (and on the PHP site, which shares them).</Notice>
        <Field label={<>Type <code>{DELETE_ALL_KEYWORD}</code> to confirm</>}>
          {({ id }) => <Input id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={DELETE_ALL_KEYWORD} autoComplete="off" />}
        </Field>
      </div>
    </Dialog>
  );
}
