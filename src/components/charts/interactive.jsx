"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatINR, formatNumber } from "@/lib/format";

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function niceMax(value) {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / pow) * pow;
}

function shortNumber(n) {
  if (Math.abs(n) >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
  if (Math.abs(n) >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(Math.round(n));
}

const isMoney = (s) => s.format === "inr" || /₹/.test(s.label);
const formatValue = (s, v) => (isMoney(s) ? formatINR(v) : formatNumber(v));
const colorOf = (s, i) => s.color || palette[i % palette.length];

/** Pointer/keyboard index tracking shared by the cartesian charts. */
function useActiveIndex(count, toIndex) {
  const [active, setActive] = useState(null);
  const svgRef = useRef(null);
  const fromPointer = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    setActive(toIndex(((e.clientX - rect.left) / rect.width)));
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") setActive((a) => Math.min(count - 1, (a ?? -1) + 1));
    else if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? count) - 1));
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };
  return {
    active,
    svgProps: {
      ref: svgRef,
      tabIndex: 0,
      onPointerMove: fromPointer,
      onPointerDown: fromPointer,
      onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null),
      onKeyDown,
      onBlur: () => setActive(null),
    },
  };
}

function Tooltip({ leftPct, title, rows }) {
  const left = Math.min(82, Math.max(18, leftPct));
  return (
    <div
      className="pointer-events-none absolute top-1 z-10 min-w-32 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-2 text-xs shadow-lg transition-[left] duration-100"
      style={{ left: `${left}%` }}
      role="status"
    >
      <p className="mb-1 font-semibold text-ink">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="flex items-center justify-between gap-3 text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm" style={{ background: r.color }} aria-hidden />
            {r.label}
          </span>
          <span className="font-medium text-ink tabular">{r.value}</span>
        </p>
      ))}
    </div>
  );
}

function Legend({ series, hidden, onToggle }) {
  return (
    <figcaption className="mt-2 flex flex-wrap gap-x-1 gap-y-1">
      {series.map((s, i) => {
        const off = hidden.includes(s.key);
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onToggle(s.key)}
            aria-pressed={!off}
            className={cn("inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs text-ink-muted transition-opacity hover:bg-surface-muted hover:text-ink", off && "opacity-45 line-through")}
          >
            <span className="h-2 w-3 rounded-sm" style={{ background: colorOf(s, i) }} aria-hidden />
            {s.label}
          </button>
        );
      })}
    </figcaption>
  );
}

function useHiddenSeries(series) {
  const [hidden, setHidden] = useState([]);
  const toggle = (key) => setHidden((h) => (h.includes(key) ? h.filter((k) => k !== key) : h.length < series.length - 1 ? [...h, key] : h));
  return [hidden, toggle];
}

export function LineChart({ data, series, height = 220, className, label }) {
  const width = 640;
  const pad = { top: 12, right: 12, bottom: 26, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const [hidden, toggle] = useHiddenSeries(series);
  const shown = series.filter((s) => !hidden.includes(s.key));
  const max = niceMax(Math.max(1, ...data.flatMap((d) => shown.map((s) => d[s.key] || 0))));
  const x = (i) => pad.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v) => pad.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const labelEvery = Math.ceil(data.length / 8);
  const { active, svgProps } = useActiveIndex(data.length, (f) => {
    const i = Math.round(((f * width - pad.left) / innerW) * (data.length - 1));
    return Math.max(0, Math.min(data.length - 1, i));
  });

  return (
    <figure className={cn("relative w-full", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500" role="img" aria-label={`${label}. Use arrow keys to read values.`} {...svgProps}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t === 0 ? "" : "3 4"} />
            <text x={pad.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--ink-muted)">{shortNumber(t)}</text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10" fill={active === i ? "var(--ink)" : "var(--ink-muted)"}>{d.label}</text>
          ) : null,
        )}
        {active != null && <line x1={x(active)} x2={x(active)} y1={pad.top} y2={y(0)} stroke="var(--ink-muted)" strokeDasharray="3 3" opacity="0.6" />}
        {series.map((s, si) => {
          if (hidden.includes(s.key)) return null;
          const color = colorOf(s, si);
          const points = data.map((d, i) => `${x(i)},${y(d[s.key] || 0)}`).join(" ");
          return (
            <g key={`${s.key}-${max}`}>
              {si === 0 && <polygon className="chart-fade" points={`${x(0)},${y(0)} ${points} ${x(data.length - 1)},${y(0)}`} fill={color} opacity="0.08" />}
              <polyline className="chart-draw" pathLength="1" points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {active != null && <circle cx={x(active)} cy={y(data[active][s.key] || 0)} r="4.5" fill="var(--surface)" stroke={color} strokeWidth="2.5" />}
            </g>
          );
        })}
      </svg>
      {active != null && (
        <Tooltip leftPct={(x(active) / width) * 100} title={data[active].label} rows={shown.map((s) => ({ label: s.label, color: colorOf(s, series.indexOf(s)), value: formatValue(s, data[active][s.key] || 0) }))} />
      )}
      <Legend series={series} hidden={hidden} onToggle={toggle} />
    </figure>
  );
}

export function BarChart({ data, series, height = 220, className, label, stacked = false }) {
  const width = 640;
  const pad = { top: 12, right: 8, bottom: 26, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const [hidden, toggle] = useHiddenSeries(series);
  const shown = series.filter((s) => !hidden.includes(s.key));
  const totals = data.map((d) => (stacked ? shown.reduce((s, ser) => s + (d[ser.key] || 0), 0) : Math.max(...shown.map((ser) => d[ser.key] || 0))));
  const max = niceMax(Math.max(1, ...totals));
  const band = innerW / Math.max(1, data.length);
  const barW = stacked ? band * 0.6 : (band * 0.7) / shown.length;
  const y = (v) => pad.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.5, 1].map((t) => t * max);
  const labelEvery = Math.ceil(data.length / 10);
  const { active, svgProps } = useActiveIndex(data.length, (f) => Math.max(0, Math.min(data.length - 1, Math.floor((f * width - pad.left) / band))));

  return (
    <figure className={cn("relative w-full", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500" role="img" aria-label={`${label}. Use arrow keys to read values.`} {...svgProps}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray={t === 0 ? "" : "3 4"} />
            <text x={pad.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--ink-muted)">{shortNumber(t)}</text>
          </g>
        ))}
        {active != null && <rect x={pad.left + active * band} y={pad.top} width={band} height={innerH} fill="var(--neutral-bg)" opacity="0.7" rx="3" />}
        {data.map((d, i) => {
          const bx = pad.left + i * band + (band - (stacked ? barW : barW * shown.length)) / 2;
          let acc = 0;
          return (
            <g key={i}>
              <g key={`${hidden.join()}-${max}`} className="chart-grow-y" style={{ animationDelay: `${Math.min(i * 18, 400)}ms`, opacity: active == null || active === i ? 1 : 0.45, transition: "opacity 150ms" }}>
                {shown.map((s, si) => {
                  const v = d[s.key] || 0;
                  const color = colorOf(s, series.indexOf(s));
                  if (stacked) {
                    const top = y(acc + v);
                    const h = y(acc) - top;
                    acc += v;
                    return <rect key={s.key} x={bx} y={top} width={barW} height={Math.max(0, h)} fill={color} rx="2" />;
                  }
                  return <rect key={s.key} x={bx + si * barW} y={y(v)} width={Math.max(1, barW - 2)} height={Math.max(0, y(0) - y(v))} fill={color} rx="2" />;
                })}
              </g>
              {i % labelEvery === 0 && (
                <text x={pad.left + i * band + band / 2} y={height - 8} textAnchor="middle" fontSize="10" fill={active === i ? "var(--ink)" : "var(--ink-muted)"}>{d.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      {active != null && (
        <Tooltip
          leftPct={((pad.left + active * band + band / 2) / width) * 100}
          title={data[active].label}
          rows={[
            ...shown.map((s) => ({ label: s.label, color: colorOf(s, series.indexOf(s)), value: formatValue(s, data[active][s.key] || 0) })),
            ...(stacked && shown.length > 1 ? [{ label: "Total", color: "transparent", value: formatValue(shown[0], totals[active]) }] : []),
          ]}
        />
      )}
      {series.length > 1 && <Legend series={series} hidden={hidden} onToggle={toggle} />}
    </figure>
  );
}

export function DonutChart({ data, size = 160, className, label, centerLabel, centerValue }) {
  const [active, setActive] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 60;
  const c = 2 * Math.PI * r;
  const segments = data.map((d, i) => {
    const len = (d.value / total) * c;
    const start = data.slice(0, i).reduce((s, x) => s + (x.value / total) * c, 0);
    return { ...d, len, start, color: d.color || palette[i % palette.length] };
  });
  const a = active != null ? segments[active] : null;
  const pct = (v) => `${((v / total) * 100).toFixed(0)}%`;

  return (
    <figure className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-center", className)} onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}>
      <svg viewBox="0 0 160 160" width={size} height={size} role="img" aria-label={label} className="shrink-0 overflow-visible">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--neutral-bg)" strokeWidth="20" />
        {segments.map((s, i) => (
          <circle
            key={s.label}
            className="chart-donut cursor-pointer"
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={active === i ? 26 : 20}
            strokeDasharray={`${s.len} ${c - s.len}`}
            strokeDashoffset={-s.start}
            transform="rotate(-90 80 80)"
            pointerEvents="stroke"
            opacity={active == null || active === i ? 1 : 0.35}
            style={{ "--c": c, animationDelay: `${i * 70}ms`, transition: "stroke-width 150ms, opacity 150ms" }}
            onPointerEnter={() => setActive(i)}
            onPointerDown={() => setActive(i)}
          />
        ))}
        <text x="80" y="78" textAnchor="middle" fontSize={a ? 18 : 20} fontWeight="600" fill="var(--ink)">
          {a ? (a.display ?? formatNumber(a.value)) : centerValue}
        </text>
        <text x="80" y="96" textAnchor="middle" fontSize="10" fill="var(--ink-muted)">
          {a ? `${a.label.length > 16 ? `${a.label.slice(0, 15)}…` : a.label} · ${pct(a.value)}` : centerLabel}
        </text>
      </svg>
      <ul className="w-full min-w-0 space-y-0.5">
        {segments.map((d, i) => (
          <li key={d.label}>
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              className={cn("flex w-full items-center justify-between gap-3 rounded-md px-1.5 py-1 text-left text-sm transition-colors", active === i ? "bg-surface-muted" : "hover:bg-surface-muted", active != null && active !== i && "opacity-55")}
            >
              <span className="flex min-w-0 items-center gap-2 text-ink-soft">
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: d.color }} aria-hidden />
                <span className="truncate">{d.label}</span>
              </span>
              <span className="shrink-0 font-medium text-ink tabular">
                {d.display ?? d.value} <span className="text-xs font-normal text-ink-muted">({pct(d.value)})</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </figure>
  );
}
