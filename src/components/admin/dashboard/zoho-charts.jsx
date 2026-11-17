"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { DonutChart } from "@/components/charts/interactive";

// Zoho CRM "Pipeline by stage" palette: soft pastels with one deep accent.
const FUNNEL_COLORS = ["#a9d6fb", "#f1c3f6", "#b9e7c6", "#3f51b5", "#9a7ae0", "#f4c542", "#ffb38a", "#7fd3d9"];

const W = 300; // funnel cone width (viewBox units)
const H = 260; // funnel height
const NECK = 0.3; // stem width as a share of W
const MIN_H = 7;

function geometry(data) {
  const rows = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const total = rows.reduce((s, d) => s + d.value, 0) || 1;
  const coneH = rows.length > 1 ? H * 0.8 : H;
  // Height per stage: proportional to its value, with a floor so small stages stay visible.
  const raw = rows.map((d) => Math.max(MIN_H, (d.value / total) * coneH));
  const scale = coneH / raw.reduce((s, h) => s + h, 0);
  const widthAt = (y) => (y >= coneH ? W * NECK : W - (W - W * NECK) * (y / coneH));
  let y = 0;
  return rows.map((d, i) => {
    const isStem = rows.length > 1 && i === rows.length - 1;
    const h = isStem ? H - coneH : raw[i] * scale;
    const y0 = y;
    const y1 = y + h;
    y = y1;
    const w0 = isStem ? W * NECK : widthAt(y0);
    const w1 = isStem ? W * NECK : widthAt(y1);
    const pts = [
      [(W - w0) / 2, y0],
      [(W + w0) / 2, y0],
      [(W + w1) / 2, y1],
      [(W - w1) / 2, y1],
    ];
    return { ...d, color: d.color || FUNNEL_COLORS[i % FUNNEL_COLORS.length], pts, mid: (y0 + y1) / 2, edge: (W + (w0 + w1) / 2) / 2, pct: Math.round((d.value / total) * 100) };
  });
}

// Spread label positions so they never overlap (min gap in viewBox units).
function spread(ys, gap = 22, max = H) {
  const out = [...ys];
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
  const overflow = out[out.length - 1] - max;
  if (overflow > 0) for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i] - overflow, i === out.length - 1 ? max : out[i + 1] - gap);
  return out;
}

export function FunnelChart({ data, label }) {
  const [active, setActive] = useState(null);
  const segs = geometry(data);
  if (!segs.length) return <p className="py-10 text-center text-sm text-[var(--z-muted)]">No orders in this period.</p>;
  const labelYs = spread(segs.map((s) => s.mid + 4));

  return (
    <figure className="w-full" onPointerLeave={() => setActive(null)}>
      {/* Wide screens: Zoho-style labels with leader lines. */}
      <svg viewBox={`0 -6 ${W + 270} ${H + 12}`} className="hidden h-auto w-full overflow-visible sm:block" role="img" aria-label={label}>
        {segs.map((s, i) => (
          <g key={s.label} onPointerEnter={() => setActive(i)} className="cursor-pointer">
            <polygon
              points={s.pts.map((p) => p.join(",")).join(" ")}
              fill={s.color}
              stroke="var(--z-card)"
              strokeWidth="1.5"
              className="transition-opacity duration-200"
              opacity={active == null || active === i ? 1 : 0.35}
            />
            <polyline
              points={`${s.edge + 4},${s.mid} ${W + 40},${s.mid} ${W + 62},${labelYs[i] - 4} ${W + 70},${labelYs[i] - 4}`}
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? 1.6 : 1}
            />
            <text x={W + 74} y={labelYs[i]} fontSize="12.5" fill="var(--z-soft)" fontWeight={active === i ? 600 : 400}>
              {s.label} : {formatNumber(s.value)}
              {active === i && <tspan fill="var(--z-muted)"> ({s.pct}%)</tspan>}
            </text>
          </g>
        ))}
      </svg>

      {/* Phones: funnel + legend list (labels would be unreadably small inside the SVG). */}
      <div className="flex items-center gap-4 sm:hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-[42%] shrink-0" role="img" aria-label={label}>
          {segs.map((s, i) => (
            <polygon key={s.label} points={s.pts.map((p) => p.join(",")).join(" ")} fill={s.color} stroke="var(--z-card)" strokeWidth="2" opacity={active == null || active === i ? 1 : 0.35} onPointerDown={() => setActive(i)} />
          ))}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5 text-label">
          {segs.map((s, i) => (
            <li key={s.label}>
              <button type="button" onClick={() => setActive(active === i ? null : i)} className={cn("flex w-full min-w-0 items-center gap-2 rounded px-1 py-0.5 text-left", active === i && "bg-[var(--z-accent-soft)]")}>
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[var(--z-soft)]">{s.label}</span>
                <span className="shrink-0 font-semibold text-[var(--z-ink)] tabular">{formatNumber(s.value)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

// "Order status distribution" widget body: Zoho funnel by default, donut on request.
export function StatusMixView({ data, label, centerValue, centerLabel }) {
  const [view, setView] = useState("funnel");
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <div className="inline-flex rounded-md bg-[var(--z-head)] p-0.5 ring-1 ring-[var(--z-line)]" role="group" aria-label="Chart type">
          {[
            { value: "funnel", label: "Funnel" },
            { value: "donut", label: "Donut" },
          ].map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setView(v.value)}
              aria-pressed={view === v.value}
              className={cn("rounded px-2.5 py-0.5 text-micro font-medium transition-all", view === v.value ? "bg-[var(--z-card)] text-[var(--z-accent)] shadow-sm" : "text-[var(--z-muted)] hover:text-[var(--z-ink)]")}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      {view === "funnel" ? <FunnelChart data={data} label={label} /> : <DonutChart data={data} label={label} centerValue={centerValue} centerLabel={centerLabel} />}
    </div>
  );
}
