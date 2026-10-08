"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

/**
 * The PHP dashboards' filter strip: preset buttons plus a "Calendar" button that
 * reveals a from/to range. Presets and the range are kept in the URL.
 */
export function RangeFilter({ presets, active, from = "", to = "", calendarValue = "calendar" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showRange, setShowRange] = useState(active === calendarValue);
  const [range, setRange] = useState({ from, to });
  const [error, setError] = useState("");

  function choose(value) {
    setError("");
    if (value === calendarValue) return setShowRange(true);
    setShowRange(false);
    router.push(value ? `${pathname}?preset=${encodeURIComponent(value)}` : pathname);
  }

  function apply() {
    if (!range.from || !range.to) return setError("Please select both from and to dates");
    if (range.from > range.to) return setError("From date cannot be after to date");
    setError("");
    const params = new URLSearchParams({ ...(calendarValue ? { preset: calendarValue } : {}), from: range.from, to: range.to });
    router.push(`${pathname}?${params.toString()}`);
  }

  const current = showRange ? calendarValue : active;
  return (
    <div className="rounded-xl border border-line bg-surface p-3 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[13px] font-semibold text-ink-muted">Filter:</span>
        {presets.map((p) => (
          <Button key={p.value || "all"} size="sm" variant={current === p.value ? "primary" : "outline"} onClick={() => choose(p.value)}>
            {p.label}
          </Button>
        ))}
        <Button size="sm" variant={current === calendarValue ? "primary" : "outline"} onClick={() => choose(calendarValue)}>
          <CalendarDays className="size-4" aria-hidden />
          Calendar
        </Button>
        {showRange && (
          <div className="flex flex-wrap items-center gap-2">
            <Input type="date" aria-label="From date" value={range.from} max={range.to || undefined} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} className="h-8 w-auto" />
            <span className="text-sm text-ink-muted">to</span>
            <Input type="date" aria-label="To date" value={range.to} min={range.from || undefined} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} className="h-8 w-auto" />
            <Button size="sm" variant="primary" onClick={apply}>
              Apply
            </Button>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger-ink" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
