"use client";

import { useState, useTransition } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Notice } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import { validateImportAction } from "@/lib/actions/admin/products";

const MAX_BYTES = 200_000;

export function ImportForm({ template }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [busy, startBusy] = useTransition();

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([template], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validate = () => {
    setError(null);
    if (!file) return setError("Choose a CSV file first.");
    if (file.size > MAX_BYTES) return setError("File is larger than 200 KB. Split it into smaller files.");
    startBusy(async () => {
      const text = await file.text();
      const r = await validateImportAction(text);
      if (r.ok) setResult(r);
      else {
        setResult(null);
        setError(r.message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Upload CSV" description="Step 1: the server checks every row against vendors, categories, brands and pricing rules. Nothing is saved in this step." actions={<Button size="xs" onClick={downloadTemplate}><Download className="size-3.5" aria-hidden /> Template</Button>} />
        <CardBody className="space-y-3">
          {error && <Notice tone="danger">{error}</Notice>}
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center hover:bg-surface-muted">
            <Upload className="size-5 text-ink-muted" aria-hidden />
            <span className="text-sm font-medium text-ink">{file ? file.name : "Choose a .csv file"}</span>
            <span className="text-xs text-ink-muted">Up to 500 rows, 200 KB</span>
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }} />
          </label>
          <Button variant="primary" onClick={validate} loading={busy} disabled={!file}>
            Validate file
          </Button>
        </CardBody>
      </Card>

      {result && (
        <Card>
          <CardHeader title="Validation result" description={`${result.valid} of ${result.total} rows are valid`} />
          <CardBody className="space-y-3">
            {result.valid < result.total ? (
              <Notice tone="warning">Fix the rows marked below and upload again. Valid rows can be imported once the bulk-import API is connected.</Notice>
            ) : (
              <Notice tone="success">All rows are valid. Importing creates them as Pending products for approval once the bulk-import API is connected.</Notice>
            )}
            <ul className="divide-y divide-line rounded-lg border border-line md:hidden">
              {result.results.map((r) => (
                <li key={r.row} className="px-3 py-2.5 text-[13px]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 font-medium break-words text-ink">
                      <span className="mr-1.5 text-xs font-normal text-ink-muted tabular">#{r.row}</span>
                      {r.name || "—"}
                    </p>
                    {!r.problems.length && <StatusBadge status="ok" label="Valid" />}
                  </div>
                  <p className="mt-0.5 text-ink-soft">{r.vendor || "—"} · <span className="tabular">{r.display != null ? formatINR(r.display) : "—"}</span></p>
                  {r.problems.length > 0 && <p className="mt-1 text-danger-ink">{r.problems.join("; ")}</p>}
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto scrollbar-thin md:block">
              <table className="w-full min-w-max text-left text-[13px]">
                <thead>
                  <tr className="border-b border-line text-xs text-ink-muted">
                    <th scope="col" className="px-3 py-2 font-semibold">Row</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Product</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Vendor</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Display price</th>
                    <th scope="col" className="px-3 py-2 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r) => (
                    <tr key={r.row} className="border-b border-line last:border-0 align-top">
                      <td className="px-3 py-2 tabular">{r.row}</td>
                      <td className="max-w-72 truncate px-3 py-2 text-ink">{r.name}</td>
                      <td className="px-3 py-2">{r.vendor}</td>
                      <td className="px-3 py-2 text-right tabular">{r.display != null ? formatINR(r.display) : "—"}</td>
                      <td className="px-3 py-2">
                        {r.problems.length ? <span className="text-danger-ink">{r.problems.join("; ")}</span> : <StatusBadge status="ok" label="Valid" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
