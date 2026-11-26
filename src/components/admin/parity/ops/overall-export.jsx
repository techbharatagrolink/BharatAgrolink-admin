"use client";

import { useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportAllAgentsAction, exportOverallAction } from "@/lib/actions/admin/parity/ops";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { useCanExport } from "@/components/admin/shell/admin-user";
import { downloadText } from "./delivered-config";

/** Export (CSV & Excel) / Export All Agents of operations_team/overall_report.php for the loaded date range. Super admins only. */
export function OverallExport({ from, to }) {
  const { notify } = useToast();
  const canExport = useCanExport();
  const [busy, setBusy] = useState("");
  if (!canExport) return null;

  async function run(kind, action, format = "csv") {
    setBusy(kind);
    try {
      const result = await action({ from, to });
      if (!result.ok) return notify({ message: result.message, tone: "error" });
      if (format === "xlsx") {
        const XLSX = await import("xlsx");
        const wb = XLSX.read(result.data.csv, { type: "string" });
        const sheetName = wb.SheetNames[0] || "Report";
        const ws = wb.Sheets[sheetName];
        if (ws["!ref"]) {
          const range = XLSX.utils.decode_range(ws["!ref"]);
          const colWidths = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLen = 10;
            for (let R = range.s.r; R <= range.e.r; ++R) {
              const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
              if (cell && cell.v != null) {
                const str = String(cell.v);
                if (str.length > maxLen) maxLen = str.length;
              }
            }
            colWidths.push({ wch: Math.min(Math.max(maxLen + 4, 12), 50) });
          }
          ws["!cols"] = colWidths;
        }
        const xlsxName = result.data.filename.replace(/\.csv$/, ".xlsx");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), { href: url, download: xlsxName });
        a.click();
        URL.revokeObjectURL(url);
      } else {
        downloadText(result.data.filename, result.data.csv);
      }
    } catch (err) {
      notify({ message: err?.message || "Export failed", tone: "error" });
    } finally {
      setBusy("");
    }
  }

  return (
    <>
      <Popover
        panelClassName="w-40"
        trigger={({ toggle, props }) => (
          <Button onClick={toggle} loading={busy === "overall"} disabled={Boolean(busy)} aria-label="Export report" {...props}>
            {!busy && <Download className="size-4" aria-hidden />} Export <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </Button>
        )}
      >
        <ul className="py-1">
          <li>
            <button
              type="button"
              data-close
              onClick={() => run("overall", exportOverallAction, "csv")}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <FileText className="size-4 text-ink-muted" /> CSV (.csv)
            </button>
          </li>
          <li>
            <button
              type="button"
              data-close
              onClick={() => run("overall", exportOverallAction, "xlsx")}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
            </button>
          </li>
        </ul>
      </Popover>

      <Popover
        panelClassName="w-44"
        trigger={({ toggle, props }) => (
          <Button onClick={toggle} loading={busy === "agents"} disabled={Boolean(busy)} aria-label="Export all agents" {...props}>
            {!busy && <Download className="size-4" aria-hidden />}
            <span className="sm:hidden">All agents</span>
            <span className="max-sm:hidden">All Agents</span>
            <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </Button>
        )}
      >
        <ul className="py-1">
          <li>
            <button
              type="button"
              data-close
              onClick={() => run("agents", exportAllAgentsAction, "csv")}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <FileText className="size-4 text-ink-muted" /> CSV (.csv)
            </button>
          </li>
          <li>
            <button
              type="button"
              data-close
              onClick={() => run("agents", exportAllAgentsAction, "xlsx")}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-ink hover:bg-surface-muted"
            >
              <FileSpreadsheet className="size-4 text-success-ink" /> Excel (.xlsx)
            </button>
          </li>
        </ul>
      </Popover>
    </>
  );
}
