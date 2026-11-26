"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveB2bCaseSlabs } from "@/lib/actions/admin/b2b-screens";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";

const label = (step) => (step === 8 ? "8+ cases" : `${step} case${step > 1 ? "s" : ""}`);

/** Edits a unit's customer case rates 1 / 2 / 4 / 8+ (ex-GST per selling unit). Blank = not set. */
export function CaseRatesForm({ data }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [result, setResult] = useState(null);
  const current = Object.fromEntries(data.slabs.map((s) => [s.minCases, String(s.rate)]));
  const [rates, setRates] = useState(Object.fromEntries(data.steps.map((step) => [step, current[step] ?? ""])));
  const [validUntil, setValidUntil] = useState(data.validUntil ?? "");
  const [note, setNote] = useState("");

  function save(clear = false) {
    if (clear && !window.confirm("Clear all case rates? The list price becomes the base rate again.")) return;
    const slabs = clear ? [] : data.steps.filter((step) => String(rates[step]).trim() !== "").map((step) => ({ minCases: step, rate: Number(rates[step]) }));
    start(async () => {
      const res = await saveB2bCaseSlabs(data.sourceType, data.sourceId, { slabs, validUntil, note });
      setResult(res);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {!data.unitsPerCase && <Notice tone="warning">Set the units per case on SKU Links first: rates are by manufacturer case.</Notice>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.steps.map((step) => (
          <Field key={step} label={`${label(step)} (₹ ex-GST / unit)`}>
            <Input type="number" min="0" step="0.01" value={rates[step]} onChange={(e) => setRates((r) => ({ ...r, [step]: e.target.value }))} />
          </Field>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Valid until (optional)"><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></Field>
        <Field label="Note (optional)"><Input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} /></Field>
      </div>
      {result && (
        <Notice tone={result.ok ? "success" : "danger"}>
          {result.message}
          {!result.ok && result.details?.length > 1 && (
            <ul className="mt-1 list-disc pl-5">
              {result.details.map((d, i) => <li key={i}>{d.message}</li>)}
            </ul>
          )}
        </Notice>
      )}
      <div className="flex gap-2">
        <Button loading={busy} onClick={() => save(false)}>Save case rates</Button>
        {data.slabs.length > 0 && <Button variant="secondary" disabled={busy} onClick={() => save(true)}>Clear</Button>}
      </div>
    </div>
  );
}
