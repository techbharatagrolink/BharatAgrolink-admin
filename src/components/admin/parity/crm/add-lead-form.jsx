"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice, ProgressBar } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { addLeadAction, importLeadsAction } from "@/lib/actions/admin/parity/crm";

const BATCH = 500;

/** fgetcsv-style parser: quoted fields, escaped quotes, CRLF / LF; blank lines are skipped. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  row.push(field);
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

/**
 * add_lead.php: manual lead (duplicate WhatsApp number check, optional agent)
 * or a sheet import. Choosing a file makes the manual fields optional and the
 * save runs the import instead, as in PHP.
 */
export function AddLeadForm({ agents }) {
  const router = useRouter();
  const { notify } = useToast();
  const fileRef = useRef(null);
  const [values, setValues] = useState({ name: "", mobile: "", source: "", agentId: "" });
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [summary, setSummary] = useState(null);
  const [pending, startTransition] = useTransition();
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: key === "mobile" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value }));

  const runImport = async () => {
    const text = (await file.text()).replace(/^\ufeff/, "");
    const [header, ...rows] = parseCsv(text);
    if (!header) return notify({ message: "Error opening file.", tone: "error" });
    const total = { total: 0, success: 0, duplicates: 0, errors: 0, errorDetails: [] };
    setProgress({ done: 0, of: rows.length });
    for (let start = 0; start < Math.max(rows.length, 1); start += BATCH) {
      const result = await importLeadsAction({ header, rows: rows.slice(start, start + BATCH), rowOffset: start });
      if (!result.ok) {
        setProgress(null);
        return notify({ message: result.message, tone: "error" });
      }
      for (const key of ["total", "success", "duplicates", "errors"]) total[key] += result[key];
      total.errorDetails.push(...result.errorDetails);
      setProgress({ done: Math.min(start + BATCH, rows.length), of: rows.length });
    }
    let message = `Import Complete. Total Leads: ${total.total}, Success: ${total.success}, Logically Duplicates Skipped: ${total.duplicates}, DB Errors Skipped: ${total.errors}.`;
    if (total.errorDetails.length) message += " Errors occurred during insertion (see details).";
    setSummary({ message, details: total.errorDetails });
    setProgress(null);
    setFile(null);
    setValues({ name: "", mobile: "", source: "", agentId: "" });
    if (fileRef.current) fileRef.current.value = "";
    notify({ message, tone: "success" });
    router.refresh();
  };

  const submit = (e) => {
    e.preventDefault();
    setSummary(null);
    if (!file && !/^\d{10}$/.test(values.mobile)) return notify({ message: "Phone number must be exactly 10 digits.", tone: "error" });
    startTransition(async () => {
      if (file) return runImport();
      const result = await addLeadAction(values);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        setValues({ name: "", mobile: "", source: "", agentId: "" });
        router.refresh();
      }
    });
  };

  const required = !file;
  return (
    <form onSubmit={submit} className="max-w-3xl space-y-4">
      <Card>
        <CardHeader title="Lead details" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Lead Name" required={required}>{({ id }) => <Input id={id} value={values.name} onChange={set("name")} placeholder="Lead Name" required={required} maxLength={150} />}</Field>
          <Field label="Number" required={required}>
            {({ id }) => <Input id={id} inputMode="numeric" value={values.mobile} onChange={set("mobile")} placeholder="Phone Number (e.g. 9999999999)" maxLength={10} required={required} />}
          </Field>
          <Field label="Source" required={required}>{({ id }) => <Input id={id} value={values.source} onChange={set("source")} placeholder="Lead Source (e.g. meta, website)" required={required} maxLength={100} />}</Field>
          <Field label="Assign Sales Agent">{({ id }) => <Select id={id} value={values.agentId} onChange={set("agentId")} options={agents} placeholder="Select Agent" />}</Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Import Leads (Optional)" description="CSV with a header row. Required columns: Name, UserNumber. Optional: Source (AD is saved as Meta), Last Active or Created On." />
        <CardBody className="space-y-3">
          <Field label="Upload Sheet" hint="Supported format: .csv (export Excel sheets as CSV first)">
            {({ id, describedBy }) => (
              <input
                id={id}
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                aria-describedby={describedBy}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-md file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-sm file:text-ink hover:file:bg-surface-muted"
              />
            )}
          </Field>
          {progress && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-ink">Processing Leads... {progress.done} / {progress.of}</p>
              <ProgressBar value={progress.of ? progress.done : 0} max={progress.of || 1} label="Import progress" />
              <p className="text-xs text-ink-muted">Analyzing data and assigning to agents</p>
            </div>
          )}
          {summary && (
            <Notice tone={summary.details.length ? "warning" : "success"} title="Import Complete!">
              <p>{summary.message}</p>
              {summary.details.length > 0 && (
                <ul className="mt-2 max-h-48 list-disc space-y-0.5 overflow-y-auto pl-5 text-xs">
                  {summary.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </Notice>
          )}
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" loading={pending}>
          {pending ? "Processing..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
