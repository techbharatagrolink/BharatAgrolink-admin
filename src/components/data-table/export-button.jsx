"use client";

import { useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { useCanExport } from "@/components/admin/shell/admin-user";
import { formatNumber } from "@/lib/format";
import { csvText, downloadCsv, downloadXlsx, exportFileName, exportMatrix } from "@/lib/csv";

/**
 * Export (CSV & Excel) for screens that build their own tables. Super admins only: renders nothing for
 * anyone else, and every `load` action re-checks on the server.
 *
 * Give it one of:
 *   - `headers` + `matrix`: rows already turned into values (server pages: functions cannot cross to the client)
 *   - `columns` ([{ label, value(row) }]) + `rows`: the rows on screen
 *   - `columns` + `load`: a server action returning { ok, rows, truncated?, message? } with every matching row
 */
export function ExportButton({ name, headers, matrix, columns, rows, load, label = "Export", size = "sm", variant, className, title }) {
  const allowed = useCanExport();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  if (!allowed) return null;

  const run = async (format = "csv") => {
    setBusy(true);
    try {
      let data = rows;
      let truncated = false;
      if (load) {
        const result = await load();
        if (!result?.ok) throw new Error(result?.message || "Export failed.");
        data = result.rows ?? [];
        truncated = Boolean(result.truncated);
      }
      const sheet = matrix ? { headers, rows: matrix } : exportMatrix(columns ?? [], data ?? []);
      if (!sheet.rows.length) {
        notify({ message: "There is nothing to export for these filters.", tone: "info" });
        return;
      }
      if (format === "xlsx") {
        await downloadXlsx(exportFileName(name, "xlsx"), sheet.headers, sheet.rows);
      } else {
        downloadCsv(exportFileName(name, "csv"), csvText(sheet.headers, sheet.rows));
      }
      console.info(`[Audit] Export completed: "${name || "dataset"}" (${sheet.rows.length} rows, format: ${format.toUpperCase()})`);
      notify(
        truncated
          ? { message: `Exported the first ${formatNumber(sheet.rows.length)} rows (${format.toUpperCase()}). Narrow the filters to export the rest.`, tone: "info" }
          : { message: `Exported ${formatNumber(sheet.rows.length)} row${sheet.rows.length === 1 ? "" : "s"} (${format.toUpperCase()}).`, tone: "success" },
      );
    } catch (error) {
      notify({ message: error?.message || "Export failed.", tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Popover
      panelClassName="w-40"
      trigger={({ toggle, props }) => (
        <Button size={size} variant={variant} className={className} onClick={toggle} loading={busy} title={title} {...props}>
          {!busy && <Download className="size-4" aria-hidden />} {label} <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </Button>
      )}
    >
      <ul className="py-1">
        <li>
          <button
            type="button"
            data-close
            onClick={() => run("csv")}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
          >
            <FileText className="size-4 text-ink-muted" /> CSV (.csv)
          </button>
        </li>
        <li>
          <button
            type="button"
            data-close
            onClick={() => run("xlsx")}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
          >
            <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
          </button>
        </li>
      </ul>
    </Popover>
  );
}

/** A download link to an export route (the route re-checks). Renders nothing for non-super admins. */
export function ExportLink({ children, ...props }) {
  const allowed = useCanExport();
  if (!allowed) return null;
  return <a {...props}>{children}</a>;
}

/** A dropdown for route-based exports offering both CSV (.csv) and Excel (.xlsx) options. Super admins only. */
export function RouteExportDropdown({ href, label = "Export", size = "sm", variant, className }) {
  const allowed = useCanExport();
  if (!allowed) return null;
  const separator = href.includes("?") ? "&" : "?";
  const csvHref = `${href}${separator}format=csv`;
  const xlsxHref = `${href}${separator}format=xlsx`;

  return (
    <Popover
      panelClassName="w-40"
      trigger={({ toggle, props }) => (
        <Button size={size} variant={variant} className={className} onClick={toggle} {...props}>
          <Download className="size-4" aria-hidden /> {label} <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </Button>
      )}
    >
      <ul className="py-1">
        <li>
          <a
            href={csvHref}
            download
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
          >
            <FileText className="size-4 text-ink-muted" /> CSV (.csv)
          </a>
        </li>
        <li>
          <a
            href={xlsxHref}
            download
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
          >
            <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
          </a>
        </li>
      </ul>
    </Popover>
  );
}

/** A slim bar with an Export button above a table (MiniTable `exportName`). Hidden for non-super admins. */
export function ExportBar(props) {
  const allowed = useCanExport();
  if (!allowed) return null;
  return (
    <div className="flex justify-end border-b border-line px-3 py-2">
      <ExportButton size="xs" {...props} />
    </div>
  );
}
