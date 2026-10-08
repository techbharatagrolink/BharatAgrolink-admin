"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useQueryState } from "@/components/data-table/use-query-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
];

/** My Orders period buttons (URL param `range`, default this month). */
export function OrderRangeButtons({ active }) {
  const { setParams, pending } = useQueryState();
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-line-strong" role="group" aria-label="Order period">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          disabled={pending}
          aria-pressed={active === r.value}
          onClick={() => setParams({ range: r.value === "month" ? "" : r.value }, { resetPage: false })}
          className={cn("h-8 border-l border-line-strong px-2.5 text-xs font-medium first:border-l-0", active === r.value ? "bg-brand-600 text-brand-fg" : "bg-surface text-ink-soft hover:bg-surface-muted")}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

/** Achievements month filter (URL param `month`; cleared = every month). */
export function AchievementMonth({ value }) {
  const { setParams } = useQueryState();
  return (
    <div className="flex items-center gap-2">
      <Input type="month" aria-label="Achievement month" value={value} onChange={(e) => setParams({ month: e.target.value || "all" }, { resetPage: false })} className="w-44" />
      {value && (
        <Button size="sm" variant="ghost" onClick={() => setParams({ month: "all" }, { resetPage: false })}>
          All months
        </Button>
      )}
    </div>
  );
}

export function RefreshButton({ label = "Refresh" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button size="sm" onClick={() => startTransition(() => router.refresh())} loading={pending}>
      {!pending && <RefreshCw className="size-4" aria-hidden />} {label}
    </Button>
  );
}
