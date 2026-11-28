"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

/**
 * The PHP dashboards' filter strip: preset buttons plus a "Calendar" button that
 * reveals a from/to range. Presets and the range are kept in the URL.
 */
export function RangeFilter({ presets, active, from = "", to = "", calendarValue = "calendar" }) {
  const router = useRouter();
  const pathname = usePathname();
  const onCalendar = active === calendarValue;

  function choose(value) {
    router.push(value ? `${pathname}?preset=${encodeURIComponent(value)}` : pathname);
  }

  // The date box: a day range, a month / span of months or a year / span of years.
  function pick({ from: start, to: end }) {
    if (!start || !end) return router.push(pathname);
    const params = new URLSearchParams({ ...(calendarValue ? { preset: calendarValue } : {}), from: start, to: end });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-3 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-small font-semibold text-ink-muted">Filter:</span>
        {presets.map((p) => (
          <Button key={p.value || "all"} size="sm" variant={active === p.value ? "primary" : "outline"} onClick={() => choose(p.value)}>
            {p.label}
          </Button>
        ))}
        <DateRangePicker
          size="sm"
          className={onCalendar ? "w-64 [&>div]:border-brand-600" : "w-64"}
          label="Date range"
          placeholder="Pick dates, month or year"
          presets={[]}
          from={onCalendar ? from : ""}
          to={onCalendar ? to : ""}
          onChange={pick}
        />
      </div>
    </div>
  );
}
