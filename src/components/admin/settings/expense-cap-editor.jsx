"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { ProgressBar } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { updateExpenseCapAction } from "@/lib/actions/admin/settings";

export function ExpenseCapEditor({ caps, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [values, setValues] = useState(() => Object.fromEntries(caps.map((c) => [c.id, String(c.capPercent)])));
  const [pending, setPending] = useState(null);
  const [busy, startBusy] = useTransition();

  const save = (reason) =>
    startBusy(async () => {
      const r = await updateExpenseCapAction(pending?.id, values[pending?.id], reason);
      notify({ message: r.message, tone: r.ok ? "success" : "error" });
      setPending(null);
      if (r.ok) router.refresh();
    });

  return (
    <>
    <ul className="divide-y divide-line">
      {caps.map((c) => {
        const value = values[c.id];
        const changed = value !== String(c.capPercent);
        return (
          <li key={c.id} className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-ink">{c.label}</span>
                {c.over ? <Badge tone="danger">Over cap</Badge> : <Badge tone="success">Within cap</Badge>}
                <span className="ml-auto text-ink-soft tabular">Actual {c.actualPercent}% of sales</span>
              </div>
              <ProgressBar value={c.actualPercent} max={c.capPercent} tone={c.over ? "danger" : "brand"} label={`${c.label}: ${c.actualPercent}% of ${c.capPercent}% cap`} />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor={`cap-${c.id}`} className="text-[13px] text-ink-muted">Cap %</label>
              <Input id={`cap-${c.id}`} type="number" min={0.1} max={50} step={0.1} inputMode="decimal" className="w-20" value={value} disabled={!canEdit} onChange={(e) => setValues({ ...values, [c.id]: e.target.value })} />
              {canEdit && (
                <Button size="sm" variant="primary" disabled={!changed || !value} onClick={() => setPending(c)}>
                  Save
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={save}
        loading={busy}
        tone="warning"
        title={pending ? `Change ${pending.label} cap?` : ""}
        description={pending ? `${pending.capPercent}% → ${values[pending.id]}% of sales. Alerts and the finance dashboard use this cap.` : ""}
        confirmLabel="Change cap"
        requireReason
      />
    </>
  );
}
