"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const PRESETS = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Date filter for the SEO screens. `range` is what the API actually used ({ from, to, days });
 * choosing a preset or a custom range puts ?from&to in the URL, which every tab carries along.
 */
export function SeoRange({ range }) {
  const router = useRouter();
  const pathname = usePathname();
  const go = (from, to) => router.push(`${pathname}?${new URLSearchParams({ from, to }).toString()}`);

  function preset(days) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));
    go(ymd(start), ymd(end));
  }

  const activeDays = range?.to === ymd(new Date()) ? range?.days : null;
  const customActive = Boolean(range?.from && range?.to) && !PRESETS.some((p) => p.days === activeDays);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      {PRESETS.map((p) => (
        <Button key={p.days} size="sm" variant={activeDays === p.days ? "primary" : "outline"} onClick={() => preset(p.days)}>
          {p.label}
        </Button>
      ))}
      {/* Any other range: day range, a month / span of months or a year / span of years. */}
      <DateRangePicker
        size="sm"
        align="right"
        className="w-60"
        label="Date range"
        placeholder="Custom dates, month or year"
        presets={[]}
        clearable={false}
        from={customActive ? range.from : ""}
        to={customActive ? range.to : ""}
        onChange={({ from, to }) => from && to && go(from, to)}
      />
    </div>
  );
}
