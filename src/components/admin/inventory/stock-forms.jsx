"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { configureStockAction, resolveShortfallAction, saveStockSettingsAction } from "@/lib/actions/admin/inventory";
import { SHORTFALL_RESOLUTIONS } from "@/lib/content/admin/inventory";

const digits = (v) => v.replace(/[^\d]/g, "");

/** Low / critical alert levels and safety stock of one SKU (SRS §5, §7; changes are audited). */
export function StockSettings({ item, disabled }) {
  const router = useRouter();
  const { notify } = useToast();
  const ids = useId();
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState({
    lowStockThreshold: String(item.lowStockThreshold ?? ""),
    criticalThreshold: String(item.criticalThreshold ?? ""),
    safetyStockQty: String(item.safetyStockQty ?? 0),
  });
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: digits(e.target.value) }));
  const valid = Object.values(values).every((v) => v !== "");
  const safetyTooHigh = Number(values.safetyStockQty) > item.onHandQty;

  function submit(event) {
    event.preventDefault();
    if (!valid || safetyTooHigh) return;
    startTransition(async () => {
      const res = await saveStockSettingsAction(item.id, values);
      notify(res.ok ? { message: "Stock settings saved." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Low stock at or below" htmlFor={`${ids}-low`} hint="Raises a low-stock alert.">
          <Input id={`${ids}-low`} inputMode="numeric" value={values.lowStockThreshold} onChange={set("lowStockThreshold")} disabled={disabled} className="tabular" />
        </Field>
        <Field label="Critical at or below" htmlFor={`${ids}-crit`} hint="0 turns critical alerts off.">
          <Input id={`${ids}-crit`} inputMode="numeric" value={values.criticalThreshold} onChange={set("criticalThreshold")} disabled={disabled} className="tabular" />
        </Field>
        <Field label="Safety stock" htmlFor={`${ids}-safety`} hint="Kept back, never sold online." error={safetyTooHigh ? "Cannot be more than the stock on hand." : null}>
          <Input id={`${ids}-safety`} inputMode="numeric" value={values.safetyStockQty} onChange={set("safetyStockQty")} disabled={disabled} className="tabular" />
        </Field>
      </div>
      <Button type="submit" size="sm" disabled={disabled || !valid || safetyTooHigh} loading={pending}>
        Save settings
      </Button>
    </form>
  );
}

/** First real stock count for a listing that has never had one (SRS §7: stock is never assumed). */
export function SetupStock({ sourceType, sourceId, suggested }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [count, setCount] = useState("");

  function submit(event) {
    event.preventDefault();
    if (count === "") return;
    startTransition(async () => {
      const res = await configureStockAction({ sourceType, sourceId, quantity: count });
      notify(res.ok ? { message: "Stock set up. The listing can be sold now." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <Input
        aria-label="Counted quantity"
        inputMode="numeric"
        placeholder={suggested ? `Count (old value ${suggested})` : "Counted qty"}
        value={count}
        onChange={(e) => setCount(digits(e.target.value))}
        className="w-44 tabular"
      />
      <Button type="submit" size="sm" variant="primary" disabled={count === ""} loading={pending}>
        Set up stock
      </Button>
    </form>
  );
}

/** Records what was agreed after calling the customer of a short paid order. */
export function ResolveShortfall({ id }) {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [resolution, setResolution] = useState("");
  const [note, setNote] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!resolution) return;
    startTransition(async () => {
      const res = await resolveShortfallAction(id, { resolution, note });
      notify(res.ok ? { message: "Marked as resolved." } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select aria-label="Outcome of the call" value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Outcome of the call…" options={SHORTFALL_RESOLUTIONS} className="sm:w-64" />
      <Input aria-label="Note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="Note (optional)" className="sm:w-48" />
      <Button type="submit" size="sm" variant="primary" disabled={!resolution} loading={pending}>
        Mark resolved
      </Button>
    </form>
  );
}
