"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRightLeft, CheckCircle2, Download, ExternalLink, FileSpreadsheet, FileText, FlaskConical, History, MousePointerClick, PauseCircle, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input, Select, Switch } from "@/components/ui/form";
import { PageHeader, StatCard, StatGrid } from "@/components/ui/page";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatDateTime, formatNumber } from "@/lib/format";
import { deleteRedirectAction, setRedirectActiveAction } from "@/lib/actions/admin/redirects";
import { DeleteAllDialog, ImportDialog, LogsDialog, RedirectFormDialog, SAMPLE_HREF, showPath, TestDialog, websiteHref } from "./redirect-dialogs";

const PATH = "/admin/cms/redirects";
const STATUS_FILTERS = [
  { value: "active", label: "Active only" },
  { value: "inactive", label: "Inactive only" },
];

function href(filters, patch) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...patch })) if (value != null && value !== "" && !(key === "page" && Number(value) === 1)) params.set(key, String(value));
  const qs = params.toString();
  return `${PATH}${qs ? `?${qs}` : ""}`;
}

function SourceCell({ rule }) {
  const path = showPath(rule.sourcePath);
  const blocked = rule.isActive && rule.runtime && !rule.runtime.applied;
  return (
    <span className="block max-w-[26rem] min-w-0 whitespace-normal">
      <span className="flex flex-wrap items-center gap-1.5">
        <code className="rounded bg-surface-muted px-1.5 py-0.5 text-[12.5px] break-all text-ink">{path}</code>
        {rule.overrideRoute && <Badge tone="warning">Override</Badge>}
        {rule.liveRoute && !rule.overrideRoute && <Badge tone="info">Live page</Badge>}
      </span>
      {rule.sourceUrl && rule.sourceUrl !== path && (
        <span className="mt-0.5 block truncate text-xs text-ink-muted" title={rule.sourceUrl}>
          {rule.sourceUrl}
        </span>
      )}
      {blocked && (
        <span className="mt-1 flex items-start gap-1 text-xs text-warning-ink">
          <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden />
          <span>Not redirecting: {rule.runtime.message}</span>
        </span>
      )}
      {rule.isActive && rule.runtime?.applied && rule.runtime.message && <span className="mt-1 block text-xs text-ink-muted">{rule.runtime.message}</span>}
      {rule.notes && <span className="mt-0.5 block text-xs text-ink-muted italic">{rule.notes}</span>}
    </span>
  );
}

export function RedirectsManager({ title, items, metrics, meta, filters, siteUrl, perms }) {
  const router = useRouter();
  const { notify } = useToast();
  const [dialog, setDialog] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [busy, startBusy] = useTransition();

  const open = (type, extra = {}) => setDialog({ type, key: Date.now(), ...extra });
  const close = () => setDialog(null);
  const finish = () => {
    close();
    router.refresh();
  };

  const toggle = (rule, isActive) => {
    setToggling({ id: rule.id, isActive });
    startBusy(async () => {
      const result = await setRedirectActiveAction(rule.id, isActive);
      notify(result.ok ? { message: result.message } : { tone: "error", title: "Could not change the status", message: result.message });
      if (result.ok) router.refresh();
      setToggling(null);
    });
  };

  const remove = () =>
    startBusy(async () => {
      const result = await deleteRedirectAction(deleting.id);
      notify(result.ok ? { title: "Redirect deleted", message: result.message } : { tone: "error", title: "Could not delete", message: result.message });
      setDeleting(null);
      if (result.ok) router.refresh();
    });

  const page = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? items.length;
  const filtered = Boolean(filters.q || filters.status);

  const columns = [
    { key: "source", label: "Source", render: (r) => <SourceCell rule={r} /> },
    {
      key: "target",
      label: "Destination",
      render: (r) => (
        <a href={websiteHref(r.targetUrl, siteUrl)} target="_blank" rel="noopener noreferrer" title={r.targetUrl} className="inline-flex max-w-[22rem] items-center gap-1 text-brand-700 hover:underline">
          <span className="truncate">{r.targetUrl}</span>
          <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
        </a>
      ),
    },
    { key: "statusCode", label: "Type", render: (r) => <Badge tone={r.statusCode === 301 ? "brand" : "warning"}>{r.statusCode}</Badge> },
    { key: "query", label: "Query", render: (r) => (r.keepQueryParams ? <Badge tone="info">Preserved</Badge> : <Badge>Dropped</Badge>) },
    {
      key: "hits",
      label: "Hits",
      align: "right",
      render: (r) => (
        <span className="block">
          <span className="font-medium text-ink tabular">{formatNumber(r.hits)}</span>
          {r.lastHitAt && <span className="block text-xs text-ink-muted">{formatDateTime(r.lastHitAt)}</span>}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => {
        const checked = toggling?.id === r.id ? toggling.isActive : r.isActive;
        return perms.edit ? (
          <Switch checked={checked} onChange={(next) => toggle(r, next)} disabled={busy} label={checked ? "Active" : "Inactive"} />
        ) : (
          <Badge tone={r.isActive ? "success" : "neutral"} dot>
            {r.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <span className="flex gap-1">
          <Button size="icon-sm" variant="ghost" onClick={() => open("test", { url: showPath(r.sourcePath) })} aria-label={`Test ${showPath(r.sourcePath)}`} title="Test">
            <Play className="size-4" aria-hidden />
          </Button>
          {perms.edit && (
            <Button size="icon-sm" variant="ghost" onClick={() => open("form", { rule: r })} aria-label={`Edit redirect #${r.id}`} title="Edit">
              <Pencil className="size-4" aria-hidden />
            </Button>
          )}
          {perms.delete && (
            <Button size="icon-sm" variant="ghost" className="text-danger-ink" onClick={() => setDeleting(r)} aria-label={`Delete redirect #${r.id}`} title="Delete">
              <Trash2 className="size-4" aria-hidden />
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={title}
        description="Send old or broken website addresses to new pages with a 301 (permanent) or 302 (temporary) redirect. Rules run on the website before any page loads, so old links and search results keep working."
        actions={
          <>
            <Button size="sm" onClick={() => open("test")}>
              <FlaskConical className="size-4" aria-hidden /> Test URL
            </Button>
            {perms.add && (
              <Button size="sm" onClick={() => open("import")}>
                <FileSpreadsheet className="size-4" aria-hidden /> Import Excel / CSV
              </Button>
            )}
            {perms.add && (
              <Button size="sm" variant="primary" onClick={() => open("form", { rule: null })}>
                <Plus className="size-4" aria-hidden /> Add redirect
              </Button>
            )}
          </>
        }
      />

      <StatGrid>
        <StatCard label="Total redirects" value={formatNumber(metrics.total)} icon={ArrowRightLeft} tone="brand" href={href({}, {})} />
        <StatCard label="Active rules" value={formatNumber(metrics.active)} icon={CheckCircle2} tone="info" href={href({}, { status: "active" })} />
        <StatCard label="Inactive rules" value={formatNumber(metrics.inactive)} icon={PauseCircle} tone="neutral" href={href({}, { status: "inactive" })} />
        <StatCard label="Total hits" value={formatNumber(metrics.totalHits)} icon={MousePointerClick} tone="warning" hint="Redirects served on the website" />
      </StatGrid>

      <Card className="mt-4">
        <CardHeader
          title="Redirect rules"
          description={`${formatNumber(total)} rule${total === 1 ? "" : "s"}${filtered ? " match the filters" : ""} · newest first`}
          actions={
            <span className="flex flex-wrap gap-2">
              <a href={SAMPLE_HREF} className={buttonClasses({ size: "xs" })}>
                <Download className="size-3.5" aria-hidden /> Sample template
              </a>
              <a href={`${PATH}/download?file=export`} className={buttonClasses({ size: "xs" })}>
                <FileText className="size-3.5" aria-hidden /> Export CSV
              </a>
              <Button size="xs" onClick={() => open("logs")}>
                <History className="size-3.5" aria-hidden /> Audit log
              </Button>
              {perms.delete && metrics.total > 0 && (
                <Button size="xs" variant="danger-outline" onClick={() => open("deleteAll")}>
                  <Trash2 className="size-3.5" aria-hidden /> Delete all
                </Button>
              )}
            </span>
          }
        />
        <CardBody className="border-b border-line">
          <form method="get" action={PATH} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input type="search" name="q" defaultValue={filters.q} placeholder="Search source, destination or note" aria-label="Search redirects" className="sm:max-w-sm" />
            <Select name="status" defaultValue={filters.status} placeholder="All statuses" options={STATUS_FILTERS} aria-label="Status" className="sm:w-44" />
            <span className="flex gap-2">
              <button type="submit" className={buttonClasses({ variant: "primary", size: "sm" })}>
                Apply
              </button>
              {filtered && (
                <Link href={PATH} className={buttonClasses({ size: "sm" })}>
                  Reset
                </Link>
              )}
            </span>
          </form>
        </CardBody>

        {items.length ? (
          <MiniTable columns={columns} rows={items} />
        ) : (
          <EmptyState
            title={filtered ? "No redirects match" : "No redirects yet"}
            description={filtered ? "Try another search or status." : "Add a redirect, or import the old URLs from an Excel or CSV file."}
            action={
              !filtered && perms.add ? (
                <Button size="sm" variant="primary" onClick={() => open("form", { rule: null })}>
                  <Plus className="size-4" aria-hidden /> Add redirect
                </Button>
              ) : null
            }
          />
        )}

        {totalPages > 1 && (
          <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted">
            <span>
              Page {page} of {totalPages}
            </span>
            <span className="flex gap-2">
              {page > 1 && (
                <Link href={href(filters, { page: page - 1 })} className={buttonClasses({ size: "sm" })}>
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link href={href(filters, { page: page + 1 })} className={buttonClasses({ size: "sm" })}>
                  Next
                </Link>
              )}
            </span>
          </nav>
        )}
      </Card>

      {dialog?.type === "form" && <RedirectFormDialog key={dialog.key} rule={dialog.rule} onClose={close} onSaved={finish} />}
      {dialog?.type === "import" && <ImportDialog key={dialog.key} canUpdate={perms.edit} onClose={close} onImported={finish} />}
      {dialog?.type === "test" && <TestDialog key={dialog.key} initialUrl={dialog.url} siteUrl={siteUrl} onClose={close} />}
      {dialog?.type === "logs" && <LogsDialog key={dialog.key} onClose={close} />}
      {dialog?.type === "deleteAll" && <DeleteAllDialog key={dialog.key} total={metrics.total} onClose={close} onDeleted={finish} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        loading={busy}
        title={deleting ? `Delete redirect #${deleting.id}?` : ""}
        description={deleting ? `${showPath(deleting.sourcePath)} will stop redirecting to ${deleting.targetUrl}. This cannot be undone.` : ""}
        confirmLabel="Delete"
      />
    </>
  );
}
