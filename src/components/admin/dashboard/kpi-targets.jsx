import { ProgressBar } from "@/components/ui/page";
import { cn } from "@/lib/utils";

export function KpiTargets({ rows }) {
  return (
    <ul className="space-y-3">
      {rows.map((k) => {
        const lowerIsBetter = k.kri > k.target;
        const breached = lowerIsBetter ? k.actual > k.kri : k.actual < k.kri;
        const met = lowerIsBetter ? k.actual <= k.target : k.actual >= k.target;
        const tone = breached ? "danger" : met ? "brand" : "warning";
        return (
          <li key={k.id}>
            <div className="mb-1 flex justify-between gap-2 text-sm">
              <span className="truncate text-ink-soft">{k.name}</span>
              <span className={cn("shrink-0 tabular", breached ? "font-medium text-danger-ink" : "text-ink")}>
                {k.actual.toFixed(1)}% <span className="text-xs text-ink-muted">/ {k.target}%</span>
              </span>
            </div>
            <ProgressBar value={lowerIsBetter ? Math.max(0, 100 - k.actual) : k.actual} max={100} tone={tone} label={`${k.name}: ${k.actual.toFixed(1)}%`} />
          </li>
        );
      })}
    </ul>
  );
}
