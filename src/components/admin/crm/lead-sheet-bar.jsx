"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { syncAisensyAction } from "@/lib/actions/admin/crm-sheet";

function money(value) {
  return formatINR(Number(value) || 0);
}

/** crm_leads.php: daily target card, plus the AiSensy sync the page runs on load. */
export function LeadSheetBar({ target }) {
  const router = useRouter();
  const { notify } = useToast();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    syncAisensyAction().then((result) => {
      const changed = (result?.created || 0) + (result?.updated || 0);
      if (result?.ok && changed > 0) {
        notify({ message: `AiSensy sync: ${result.created || 0} new, ${result.updated || 0} updated.`, tone: "success" });
        router.refresh();
      }
    }).catch(() => {});
  }, [notify, router]);

  if (!target) return null;
  const pct = Math.min(100, Number(target.progressPct) || 0);

  return (
    <section className="mb-4 rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-muted px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{target.name} · Daily Sales Target</h2>
          <p className="text-xs text-ink-muted">Today {target.date}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink">Monthly Goal: {money(target.monthlyTarget)}</span>
          <span className="rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-ink">Weekly Goal: {money(target.weeklyGoal)}</span>
          <Button size="sm" variant="secondary" onClick={() => syncAisensyAction().then((result) => {
            if (!result?.ok) notify({ message: result?.message || "AiSensy sync failed.", tone: "error" });
            else {
              notify({ message: result.allowed === false ? "AiSensy sync runs for admins and managers." : `Synced. ${result.created || 0} new, ${result.updated || 0} updated.`, tone: "success" });
              if ((result.created || 0) + (result.updated || 0) > 0) router.refresh();
            }
          })}>Sync AiSensy</Button>
        </div>
      </div>
      <div className="space-y-3 p-4">
        {target.achievedToday && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">Your target amount for today has been fully achieved.</p>
        )}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Total daily target" value={money(target.totalTarget)} note={`Base ${money(target.dailyBase)} + roll ${money(target.rollover)}`} />
          <Tile label="Delivered sales today" value={money(target.achieved)} note={`B2C ${money(target.b2cDelivered)} | B2B ${money(target.b2bDelivered)}`} />
          <Tile label="Remaining target" value={money(target.remaining)} note="Rest rolls to tomorrow" />
          <Tile label="Daily completion" value={`${pct}%`} note={target.achievedToday ? "Target achieved" : "In progress"} />
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </section>
  );
}

function Tile({ label, value, note }) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
      <p className="text-[11px] font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-muted">{note}</p>
    </div>
  );
}
