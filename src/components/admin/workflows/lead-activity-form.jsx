"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { logLeadActivityAction } from "@/lib/actions/admin/workflows";

export function LeadActivityForm({ id, status, dispositions, statuses }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState({ disposition: "", status, note: "", nextFollowUp: "", minutes: "" });
  const [errors, setErrors] = useState({});
  const [busy, startBusy] = useTransition();
  const needsFollowUp = ["Follow Up", "Interested"].includes(form.status);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (event) => {
    event.preventDefault();
    startBusy(async () => {
      const nextFollowUp = form.nextFollowUp && !Number.isNaN(new Date(form.nextFollowUp).getTime()) ? new Date(form.nextFollowUp).toISOString() : "";
      const r = await logLeadActivityAction(id, { ...form, nextFollowUp, durationSec: Math.round(Number(form.minutes || 0) * 60) });
      setErrors(r.fieldErrors ?? {});
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setForm({ disposition: "", status: form.status, note: "", nextFollowUp: "", minutes: "" });
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <Field label="Call outcome" required error={errors.disposition}>
        {({ id: fid, invalid }) => <Select id={fid} aria-invalid={invalid} value={form.disposition} onChange={set("disposition")} options={dispositions} placeholder="Select…" />}
      </Field>
      <Field label="Lead status" required error={errors.status}>
        {({ id: fid, invalid }) => <Select id={fid} aria-invalid={invalid} value={form.status} onChange={set("status")} options={statuses} />}
      </Field>
      {needsFollowUp && (
        <Field label="Next follow-up" required error={errors.nextFollowUp}>
          {({ id: fid, invalid }) => <Input id={fid} type="datetime-local" aria-invalid={invalid} value={form.nextFollowUp} onChange={set("nextFollowUp")} />}
        </Field>
      )}
      <Field label="Call duration (minutes)" error={errors.durationSec}>
        {({ id: fid, invalid }) => <Input id={fid} type="number" min={0} max={120} step="0.5" inputMode="decimal" aria-invalid={invalid} value={form.minutes} onChange={set("minutes")} />}
      </Field>
      <Field label="Notes" error={errors.note}>
        {({ id: fid, invalid }) => <Textarea id={fid} rows={3} maxLength={1000} aria-invalid={invalid} value={form.note} onChange={set("note")} placeholder="Crop problem, quantity, budget…" />}
      </Field>
      <Button type="submit" variant="primary" className="w-full" loading={busy}>Log call</Button>
    </form>
  );
}
