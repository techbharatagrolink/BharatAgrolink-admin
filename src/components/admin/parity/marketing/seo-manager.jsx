"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { deleteSeoPageAction, loadSeoPageAction, saveSeoPageAction } from "@/lib/actions/admin/parity/marketing";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

const PER_PAGE = ["10", "25", "50"];
const EMPTY = { pageTitle: "", pageHeading: "", pageSlug: "", metaTags: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", content: "" };

/** meta.php: the SEO pages list (Sno, title, heading, meta tags) with add / edit / delete. */
export function SeoManager({ items, meta, q, can, siteUrl }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const [search, setSearch] = useState(q);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);

  function go(changes) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value == null || value === "") params.delete(key);
      else params.set(key, String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  async function open(row) {
    setErrors({});
    if (!row) {
      setForm(EMPTY);
      return setEditing("new");
    }
    setLoadingId(row.id);
    const result = await loadSeoPageAction(row.id);
    setLoadingId(null);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    const p = result.data;
    setForm({ pageTitle: p.pageTitle, pageHeading: p.pageHeading, pageSlug: p.pageSlug, metaTags: p.metaTags, metaDescription: p.metaDescription, metaKeywords: p.metaKeywords, canonicalUrl: p.canonicalUrl, content: p.content ?? "" });
    setEditing(p.id);
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    const next = {};
    if (!form.pageTitle.trim()) next.pageTitle = "Page title is required.";
    if (!form.pageHeading.trim()) next.pageHeading = "Page heading is required.";
    if (!form.pageSlug.trim()) next.pageSlug = "Page slug is required.";
    if (form.canonicalUrl.trim() && !/^https?:\/\/\S+$/i.test(form.canonicalUrl.trim())) next.canonicalUrl = "Enter a full URL starting with http:// or https://.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    const result = await saveSeoPageAction(editing === "new" ? null : editing, form);
    setSaving(false);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    notify({ message: editing === "new" ? "Page added." : "Page updated.", tone: "success" });
    setEditing(null);
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    const result = await deleteSeoPageAction(removing.id);
    setBusy(false);
    setRemoving(null);
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    notify({ message: "Page deleted.", tone: "success" });
    router.refresh();
  }

  const start = (meta.page - 1) * meta.limit;
  const pages = Math.max(1, meta.totalPages);

  return (
    <>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              go({ q: search.trim(), page: null });
            }}
          >
            <Input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, heading or slug" aria-label="Search pages" className="h-8 w-64" />
            <Button size="sm" type="submit" variant="outline">
              <Search className="size-4" aria-hidden />
              Search
            </Button>
          </form>
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <span>Show</span>
            <Select value={String(meta.limit)} onChange={(e) => go({ limit: e.target.value, page: null })} options={PER_PAGE} aria-label="Entries per page" className="w-20" />
            <span>entries</span>
            {can.add && (
              <Button size="sm" variant="primary" onClick={() => open(null)}>
                <Plus className="size-4" aria-hidden />
                Add page
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">SEO pages</caption>
            <thead className="bg-surface-muted text-left text-xs font-semibold text-ink-muted">
              <tr>
                <th scope="col" className="w-16 px-3 py-2">Sno</th>
                <th scope="col" className="px-3 py-2">Page Title</th>
                <th scope="col" className="px-3 py-2">Page Heading</th>
                <th scope="col" className="px-3 py-2">Meta Tags</th>
                <th scope="col" className="w-36 px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((p, i) => (
                <tr key={p.id} className="align-top">
                  <td className="px-3 py-2 tabular">{start + i + 1}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-ink">{p.pageTitle}</p>
                    <a href={new URL(p.websitePath.replace(/^\//, ""), siteUrl).toString()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline">
                      {p.websitePath}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  </td>
                  <td className="px-3 py-2">{p.pageHeading}</td>
                  <td className="max-w-md px-3 py-2 break-words text-ink-soft">{p.metaTags || "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {can.edit && (
                      <Button size="icon-sm" variant="ghost" onClick={() => open(p)} loading={loadingId === p.id} aria-label={`Edit ${p.pageTitle}`} title="Edit">
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                    )}
                    {can.delete && (
                      <Button size="icon-sm" variant="ghost" className="text-danger-ink" onClick={() => setRemoving(p)} aria-label={`Delete ${p.pageTitle}`} title="Delete">
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-ink-muted">
                    {q ? "No pages match your search." : "No pages yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-xs text-ink-muted">
          <span>Total Row : {formatNumber(meta.total)}</span>
          <div className="flex items-center gap-1">
            <Button size="xs" variant="ghost" disabled={meta.page <= 1} onClick={() => go({ page: 1 })}>First</Button>
            <Button size="xs" variant="ghost" disabled={meta.page <= 1} onClick={() => go({ page: meta.page - 1 })}>Previous</Button>
            <span className="px-1">Page {meta.page} of {pages}</span>
            <Button size="xs" variant="ghost" disabled={meta.page >= pages} onClick={() => go({ page: meta.page + 1 })}>Next</Button>
            <Button size="xs" variant="ghost" disabled={meta.page >= pages} onClick={() => go({ page: pages })}>Last</Button>
          </div>
        </div>
      </Card>

      <Dialog
        open={editing != null}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing === "new" ? "Add page" : "Edit page"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button variant="primary" type="submit" form="seo-page-form" loading={saving}>Save</Button>
          </>
        }
      >
        <form id="seo-page-form" onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          <Field label="Page Title" required error={errors.pageTitle}>
            {({ id, invalid, describedBy }) => <Input id={id} maxLength={255} value={form.pageTitle} onChange={set("pageTitle")} aria-invalid={invalid} aria-describedby={describedBy} />}
          </Field>
          <Field label="Page Heading" required error={errors.pageHeading}>
            {({ id, invalid, describedBy }) => <Input id={id} maxLength={255} value={form.pageHeading} onChange={set("pageHeading")} aria-invalid={invalid} aria-describedby={describedBy} />}
          </Field>
          <Field label="Page Slug" required error={errors.pageSlug} hint="The page's address on the website, e.g. about-us.">
            {({ id, invalid, describedBy }) => <Input id={id} maxLength={200} value={form.pageSlug} onChange={set("pageSlug")} aria-invalid={invalid} aria-describedby={describedBy} />}
          </Field>
          <Field label="Canonical URL" error={errors.canonicalUrl}>
            {({ id, invalid, describedBy }) => <Input id={id} type="url" maxLength={500} value={form.canonicalUrl} onChange={set("canonicalUrl")} aria-invalid={invalid} aria-describedby={describedBy} />}
          </Field>
          <Field label="Meta Tags" className="sm:col-span-2">
            {({ id }) => <Textarea id={id} rows={2} maxLength={1000} value={form.metaTags} onChange={set("metaTags")} />}
          </Field>
          <Field label="Meta Description" className="sm:col-span-2">
            {({ id }) => <Textarea id={id} rows={3} maxLength={2000} value={form.metaDescription} onChange={set("metaDescription")} />}
          </Field>
          <Field label="Meta Keywords" className="sm:col-span-2">
            {({ id }) => <Textarea id={id} rows={2} maxLength={2000} value={form.metaKeywords} onChange={set("metaKeywords")} />}
          </Field>
          <Field label="Page Content" hint="HTML shown on the page." className="sm:col-span-2">
            {({ id, describedBy }) => <Textarea id={id} rows={10} value={form.content} onChange={set("content")} aria-describedby={describedBy} className="font-mono text-xs" />}
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={removing != null}
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        loading={busy}
        title="Delete this page?"
        description={removing ? `"${removing.pageTitle}" and its SEO settings will be removed.` : ""}
        confirmLabel="Delete"
      />
    </>
  );
}
