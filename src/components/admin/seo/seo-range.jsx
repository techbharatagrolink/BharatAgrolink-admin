"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";

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
  const [custom, setCustom] = useState(false);
  const [value, setValue] = useState({ from: range?.from ?? "", to: range?.to ?? "" });
  const [error, setError] = useState("");

  const go = (from, to) => router.push(`${pathname}?${new URLSearchParams({ from, to }).toString()}`);

  function preset(days) {
    setCustom(false);
    setError("");
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));
    go(ymd(start), ymd(end));
  }

  function apply() {
    if (!value.from || !value.to) return setError("Choose both dates.");
    if (value.from > value.to) return setError("The start date must be on or before the end date.");
    setError("");
    go(value.from, value.to);
  }

  const activeDays = !custom && range?.to === ymd(new Date()) ? range?.days : null;

  return (
    <div className="flex flex-col items-end gap-1 print:hidden">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {PRESETS.map((p) => (
          <Button key={p.days} size="sm" variant={activeDays === p.days ? "primary" : "outline"} onClick={() => preset(p.days)}>
            {p.label}
          </Button>
        ))}
        <Button size="sm" variant={custom || (range && activeDays == null) ? "primary" : "outline"} onClick={() => setCustom(true)}>
          <CalendarDays className="size-4" aria-hidden />
          Custom
        </Button>
      </div>
      {custom && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Input type="date" aria-label="From date" value={value.from} max={value.to || undefined} onChange={(e) => setValue((v) => ({ ...v, from: e.target.value }))} className="h-8 w-auto" />
          <span className="text-sm text-ink-muted">to</span>
          <Input type="date" aria-label="To date" value={value.to} min={value.from || undefined} max={ymd(new Date())} onChange={(e) => setValue((v) => ({ ...v, to: e.target.value }))} className="h-8 w-auto" />
          <Button size="sm" variant="primary" onClick={apply}>
            Apply
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-danger-ink" role="alert">{error}</p>}
    </div>
  );
}
