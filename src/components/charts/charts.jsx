import { cn } from "@/lib/utils";

/** Lightweight in-house SVG charts (no chart library, matching the Seller Panel). */

export { BarChart, DonutChart, LineChart } from "./interactive";

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function HBarList({ data, format = (v) => v, className }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className={cn("-mx-1.5 space-y-1", className)}>
      {data.map((d, i) => (
        <li key={d.label} className="group rounded-md px-1.5 py-1 transition-colors hover:bg-surface-muted" title={`${d.label}: ${format(d.value)}`}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-ink-soft group-hover:text-ink">{d.label}</span>
            <span className="shrink-0 font-medium text-ink tabular">{format(d.value)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-bg transition-[height] group-hover:h-2">
            <div
              className="chart-grow-x h-full rounded-full group-hover:brightness-110"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color || palette[i % palette.length], animationDelay: `${Math.min(i * 50, 500)}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
