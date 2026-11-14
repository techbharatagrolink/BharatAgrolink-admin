"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { bulkStockAction } from "@/lib/actions/admin/inventory";
import { ADJUST_REASONS, qty } from "@/lib/content/admin/inventory";
import { cn } from "@/lib/utils";

const MAX_ROWS = 1000;
const COLUMNS = ["sku", "action", "quantity", "reason", "note"];

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function toRows(text) {
  const table = parseCsv(text);
  if (!table.length) throw new Error("The file is empty.");
  const header = table[0].map((h) => h.trim().toLowerCase());
  const missing = COLUMNS.slice(0, 4).filter((c) => !header.includes(c));
  if (missing.length) throw new Error(`Missing column(s): ${missing.join(", ")}. Download the template for the right format.`);
  const body = table.slice(1);
  if (body.length > MAX_ROWS) throw new Error(`Upload at most ${MAX_ROWS} rows at a time (this file has ${body.length}).`);
  return body.map((cells) => {
    const row = Object.fromEntries(COLUMNS.map((c) => [c, (cells[header.indexOf(c)] ?? "").trim()]));
    return { ...row, note: row.note || undefined };
  });
}

function downloadTemplate() {
  const csv = `${COLUMNS.join(",")}\r\nYOUR-SKU-1,ADD,25,REPLENISHMENT,Invoice 1042\r\nYOUR-SKU-2,SET,40,PHYSICAL_COUNT,Monthly count\r\nYOUR-SKU-3,REDUCE,2,DAMAGED,Leaking cans\r\n`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "stock-update-template.csv" });
  a.click();
  URL.revokeObjectURL(url);
}

const newBatchId = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

/** CSV stock update for one seller: validate + preview every row, then apply (re-applying the same batch never doubles stock). */
export function BulkUpload({ sellers }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [sellerId, setSellerId] = useState("");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function check(list, seller) {
    if (!list?.length || !seller) return;
    setError(null);
    startTransition(async () => {
      const res = await bulkStockAction({ rows: list, dryRun: true, sellerId: seller });
      if (!res.ok) return setError(res.message);
      setResult(res.data);
    });
  }

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setResult(null);
    setError(null);
    setRows(null);
    if (!file) return;
    setFileName(file.name);
    try {
      const parsed = toRows(await file.text());
      setRows(parsed);
      setBatchId(newBatchId());
      check(parsed, sellerId);
    } catch (e) {
      setError(e.message);
    }
  }

  function apply() {
    startTransition(async () => {
      const res = await bulkStockAction({ rows, dryRun: false, batchId, sellerId });
      if (!res.ok) return setError(res.message);
      setResult(res.data);
      notify({ title: "Bulk update applied", message: `${qty(res.data.applied)} row(s) applied.` });
      router.refresh();
    });
  }

  const applied = result && !result.dryRun;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="1. Prepare the file" description="One row per SKU. Columns: sku, action (ADD, REDUCE or SET), quantity, reason, note (optional)." />
        <CardBody className="flex flex-wrap items-center gap-3 text-sm">
          <Button size="sm" onClick={downloadTemplate}>
            <Download className="size-4" aria-hidden /> Download template
          </Button>
          <span className="text-ink-muted">Reasons: {ADJUST_REASONS.map((r) => r.value).join(", ")}</span>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="2. Choose the seller and upload" description="Nothing changes until you press Apply. Every row is checked first." />
        <CardBody className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <Field label="Seller" htmlFor="bulk-seller" required className="md:w-80">
              <Select
                id="bulk-seller"
                value={sellerId}
                onChange={(e) => {
                  setSellerId(e.target.value);
                  setResult(null);
                  check(rows, e.target.value);
                }}
                placeholder="Choose the seller…"
                options={(sellers ?? []).filter((s) => s.sellerId).map((s) => ({ value: s.sellerId, label: s.sellerName || s.sellerId }))}
              />
            </Field>
            <label
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 text-sm text-ink hover:border-brand-600",
                !sellerId && "pointer-events-none opacity-50",
              )}
            >
              <FileUp className="size-4" aria-hidden />
              {fileName || "Choose CSV file"}
              <input type="file" accept=".csv,text/csv" onChange={onFile} className="sr-only" disabled={!sellerId} />
            </label>
          </div>
          {error && <Notice tone="danger">{error}</Notice>}
        </CardBody>
      </Card>

      {result && (
        <Card>
          <CardHeader
            title={applied ? "3. Result" : "3. Preview"}
            description={
              applied
                ? `${qty(result.applied)} row(s) applied${result.invalid ? `, ${qty(result.invalid)} skipped` : ""}.`
                : `${qty(result.valid)} of ${qty(result.total)} row(s) are ready.${result.invalid ? ` ${qty(result.invalid)} have errors and will be skipped.` : ""}`
            }
            actions={
              !applied && (
                <Button variant="primary" size="sm" onClick={apply} disabled={!result.valid} loading={pending}>
                  Apply {qty(result.valid)} row(s)
                </Button>
              )
            }
          />
          <div className="max-h-[28rem] overflow-auto scrollbar-thin">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-line text-xs font-semibold text-ink-muted">
                  <th className="px-4 py-2">Row</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Change</th>
                  <th className="px-4 py-2 text-right">On hand</th>
                  <th className="px-4 py-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {(result.rows ?? []).map((r) => (
                  <tr key={r.rowNo} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-2 text-ink-muted tabular">{r.rowNo}</td>
                    <td className="px-4 py-2 font-mono text-xs">{r.sku || "—"}</td>
                    <td className="px-4 py-2">
                      {r.action} {r.quantity ?? ""} <span className="text-ink-muted">· {r.reason}</span>
                    </td>
                    <td className="px-4 py-2 text-right tabular">{r.preview ? `${qty(r.preview.onHandBefore)} → ${qty(r.preview.onHandAfter)}` : "—"}</td>
                    <td className="px-4 py-2">
                      {r.ok ? <Badge tone="success">{r.applied ? (r.replayed ? "Already applied" : "Applied") : "Ready"}</Badge> : <span className="text-xs text-danger-ink">{(r.errors ?? []).join(" ")}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
