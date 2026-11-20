"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { recalcReadinessAction } from "@/lib/actions/admin/seo";

/*
 * Overall Readiness Score + Progress to Target (task #104, subtasks 3-4).
 * One brand hue for the data; the target is a dashed reference line, not a series. Status is
 * always written in words next to any colour. Every number has a text equivalent.
 */

const STATUS = {
  pass: { label: "Pass", cls: "text-success-ink" },
  partial: { label: "Partly", cls: "text-warning-ink" },
  fail: { label: "Failing", cls: "text-danger-ink" },
  unavailable: { label: "No data", cls: "text-ink-muted" },
};

/** Half-circle gauge with the score in the middle; "Partial" when the total is withheld. */
export function ReadinessGauge({ score, coverage, target }) {
  const r = 70;
  const len = Math.PI * r;
  const filled = score == null ? 0 : Math.max(0, Math.min(100, score)) / 100;
  const targetAngle = Math.PI * (1 - target / 100);
  const tx = 90 + r * Math.cos(targetAngle);
  const ty = 90 - r * Math.sin(targetAngle);
  return (
    <figure className="flex flex-col items-center" aria-label={score == null ? `Readiness score withheld: only ${coverage}% of checks have data` : `Readiness score ${score} out of 100, target ${target}`}>
      <svg viewBox="0 0 180 100" className="w-full max-w-[220px]" role="img" aria-hidden>
        <path d="M20 90 A70 70 0 0 1 160 90" fill="none" className="stroke-neutral-bg" strokeWidth="14" strokeLinecap="round" />
        {score != null && (
          <path d="M20 90 A70 70 0 0 1 160 90" fill="none" className="stroke-brand-600" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${len * filled} ${len}`} />
        )}
        <line x1={90 + (r - 11) * Math.cos(targetAngle)} y1={90 - (r - 11) * Math.sin(targetAngle)} x2={tx + 11 * Math.cos(targetAngle)} y2={ty - 11 * Math.sin(targetAngle)} className="stroke-ink" strokeWidth="2" />
      </svg>
      <figcaption className="-mt-12 text-center">
        <span className="block text-3xl font-semibold tabular text-ink">{score == null ? "Partial" : `${Math.round(score)}%`}</span>
        <span className="text-xs text-ink-muted">{score == null ? `only ${coverage}% of checks have data` : "current readiness"}</span>
      </figcaption>
      <p className="mt-2 text-[11px] text-ink-muted">Black tick = target {target}% · data coverage {coverage}%</p>
    </figure>
  );
}

/** Category bars; each row opens its checks (value, source, last checked, why unavailable). */
export function ReadinessCategories({ categories }) {
  const [open, setOpen] = useState(null);
  return (
    <ul className="divide-y divide-line">
      {categories.map((c) => (
        <li key={c.key} className="py-2">
          <button type="button" onClick={() => setOpen(open === c.key ? null : c.key)} className="grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-left text-sm sm:grid-cols-[11rem_1fr_4.5rem]" aria-expanded={open === c.key}>
            <span className="text-ink">{c.label}</span>
            <span className="col-span-2 row-start-2 h-2 overflow-hidden rounded-full bg-neutral-bg sm:col-span-1 sm:col-start-2 sm:row-start-1" role="progressbar" aria-valuenow={c.score ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.label} score`}>
              {c.score != null && <span className="block h-full rounded-full bg-brand-600" style={{ width: `${c.score}%` }} />}
            </span>
            <span className="text-right text-xs tabular text-ink-soft sm:col-start-3 sm:row-start-1">{c.score == null ? "No data" : `${Math.round(c.score)}%`}</span>
          </button>
          <p className="mt-0.5 text-[11px] text-ink-muted">
            Data for {c.coverage}% of checks · weight {c.weight ?? "—"} · {open === c.key ? "hide" : "show"} checks
          </p>
          {open === c.key && (
            <ul className="mt-2 space-y-1.5 rounded-lg bg-surface-muted p-2.5 text-xs">
              {c.checks.map((x) => (
                <li key={x.key} className="grid grid-cols-[4rem_1fr] gap-2">
                  <span className={cn("font-medium", STATUS[x.status]?.cls)}>{x.value == null ? STATUS[x.status]?.label : `${x.value}%`}</span>
                  <span>
                    <span className="text-ink">{x.label}</span>
                    <span className="block text-ink-muted">
                      {x.detail}
                      {x.source ? ` · ${x.source}` : ""}
                      {x.checkedAt ? ` · ${formatDateTime(x.checkedAt)}` : ""} · weight {x.weight}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

const monthLabel = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleString("en-IN", { month: "short", year: "2-digit" });

/**
 * Monthly readiness line with the target as a dashed line. Hover (or focus) a month for its value.
 * Months without enough data are drawn as gaps and listed as "partial".
 */
export function ProgressToTarget({ history, target }) {
  const [hover, setHover] = useState(null);
  const W = 520;
  const H = 200;
  const P = { l: 34, r: 14, t: 14, b: 28 };
  const n = history.length;
  const x = (i) => (n === 1 ? (P.l + W - P.r) / 2 : P.l + (i * (W - P.l - P.r)) / (n - 1));
  const y = (v) => P.t + ((100 - v) * (H - P.t - P.b)) / 100;
  const segments = [];
  let seg = [];
  history.forEach((h, i) => {
    if (h.totalScore == null) {
      if (seg.length) segments.push(seg);
      seg = [];
    } else seg.push([x(i), y(h.totalScore)]);
  });
  if (seg.length) segments.push(seg);
  const last = [...history].reverse().find((h) => h.totalScore != null);
  const shown = hover != null ? history[hover] : null;

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Monthly readiness score. ${last ? `Latest ${last.totalScore}% in ${monthLabel(last.month)}, target ${target}%.` : "No complete month yet."}`}>
          {[0, 25, 50, 75, 100].map((g) => (
            <g key={g}>
              <line x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} className="stroke-line" strokeWidth="1" />
              <text x={P.l - 6} y={y(g) + 3} textAnchor="end" className="fill-ink-muted text-[10px]">
                {g}
              </text>
            </g>
          ))}
          <line x1={P.l} x2={W - P.r} y1={y(target)} y2={y(target)} className="stroke-ink" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={W - P.r} y={y(target) - 5} textAnchor="end" className="fill-ink text-[10px] font-medium">
            Target {target}%
          </text>
          {segments.map((s, i) => (
            <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} fill="none" className="stroke-brand-600" strokeWidth="2" strokeLinejoin="round" />
          ))}
          {history.map((h, i) => (
            <g key={h.month}>
              {h.totalScore != null && <circle cx={x(i)} cy={y(h.totalScore)} r={hover === i ? 6 : 4.5} className="fill-brand-600 stroke-surface" strokeWidth="2" />}
              <text x={x(i)} y={H - 8} textAnchor="middle" className={cn("text-[10px]", i === n - 1 ? "fill-ink font-medium" : "fill-ink-muted")}>
                {monthLabel(h.month)}
                {i === n - 1 ? " (now)" : ""}
              </text>
              <rect
                x={x(i) - Math.max(14, (W - P.l - P.r) / Math.max(1, n) / 2)}
                y={P.t}
                width={Math.max(28, (W - P.l - P.r) / Math.max(1, n))}
                height={H - P.t - P.b}
                fill="transparent"
                tabIndex={0}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${monthLabel(h.month)}: ${h.totalScore == null ? `partial, ${h.coverage}% of checks had data` : `${h.totalScore}%`}`}
              />
            </g>
          ))}
        </svg>
        {shown && (
          <div className="pointer-events-none absolute top-1 rounded-md border border-line bg-surface px-2 py-1 text-xs shadow-sm" style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}>
            <span className="block font-medium text-ink">{monthLabel(shown.month)}</span>
            <span className="text-ink-soft">{shown.totalScore == null ? `Partial (${shown.coverage}% data)` : `${shown.totalScore}% · ${Math.max(0, Math.round((target - shown.totalScore) * 10) / 10)} to target`}</span>
          </div>
        )}
      </div>
      <details className="mt-2 text-xs text-ink-muted">
        <summary className="cursor-pointer">Table view</summary>
        <table className="mt-1 w-full">
          <thead>
            <tr className="text-left">
              <th className="py-1 font-medium">Month</th>
              <th className="py-1 font-medium">Score</th>
              <th className="py-1 font-medium">Data coverage</th>
              <th className="py-1 font-medium">Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.month}>
                <td className="py-0.5">{monthLabel(h.month)}</td>
                <td className="py-0.5 tabular">{h.totalScore == null ? "Partial" : `${h.totalScore}%`}</td>
                <td className="py-0.5 tabular">{h.coverage}%</td>
                <td className="py-0.5">{formatDate(h.scoreDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export function RecalcButton() {
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const run = () =>
    startTransition(async () => {
      const res = await recalcReadinessAction();
      notify(res.ok ? { message: res.data.total == null ? `Recalculated: partial (${res.data.coverage}% of checks have data).` : `Recalculated: ${res.data.total}%.` } : { tone: "error", message: res.message });
      if (res.ok) router.refresh();
    });
  return (
    <Button size="sm" variant="outline" onClick={run} loading={pending}>
      <RefreshCw className="size-3.5" aria-hidden />
      Recalculate
    </Button>
  );
}
