import Link from "next/link";
import { cn } from "@/lib/utils";
import { StaticGrid } from "@/components/data-table/static-grid";

export function RangeSwitch({ pathname, ranges, active }) {
  return (
    <nav aria-label="Date range" className="inline-flex rounded-lg border border-line bg-surface p-0.5">
      {ranges.map((r) => (
        <Link
          key={r.value}
          href={`${pathname}?range=${r.value}`}
          scroll={false}
          aria-current={r.value === active ? "true" : undefined}
          className={cn("rounded-md px-2.5 py-2.5 text-small sm:py-1 font-medium whitespace-nowrap", r.value === active ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:text-ink")}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
}

export function AlertList({ alerts }) {
  const tone = { danger: "bg-danger", warning: "bg-warning-ink", info: "bg-info-ink" };
  return (
    <ul className="divide-y divide-line">
      {alerts.map((a) => (
        <li key={a.id}>
          <Link href={a.href} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-muted">
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", a.count ? tone[a.tone] : "bg-line-strong")} aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{a.title}</span>
              {a.hint && <span className="block truncate text-xs text-ink-muted">{a.hint}</span>}
            </span>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular", a.count ? "bg-neutral-bg text-ink" : "text-ink-muted")}>{a.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MiniTable({ columns, rows, empty = "No records." }) {
  if (!rows.length) return <p className="px-4 py-6 text-center text-sm text-ink-muted">{empty}</p>;
  const [lead, ...others] = columns;
  // Phone cards (same style as the main tables): a "Status" column rides in the card header,
  // the rest are label-left / value-right lines in a soft panel (long text keeps a full-width block).
  const statusCol = others.find((c) => c.key === "status" || (typeof c.label === "string" && c.label.toLowerCase() === "status"));
  const rest = others.filter((c) => c !== statusCol);
  const cell = (c, row) => (c.render ? c.render(row) : (row[c.key] ?? "—"));
  return (
    <>
      <ul className="divide-y divide-line md:hidden">
        {rows.map((row, i) => (
          <li key={`${row.id ?? "row"}-${i}`} className="px-3 py-3 sm:px-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 font-medium break-words text-ink">{cell(lead, row)}</div>
              {statusCol && <div className="shrink-0 text-right">{cell(statusCol, row)}</div>}
            </div>
            {rest.length > 0 && (
              <dl className="mt-2 grid gap-x-6 rounded-lg bg-surface-muted/60 px-3 py-1 text-table sm:grid-cols-2">
                {rest.map((c) =>
                  c.wrap ? (
                    <div key={c.key} className="min-w-0 border-b border-line/60 py-1.5 last:border-0 sm:col-span-2">
                      <dt className="text-small text-ink-muted">{c.label}</dt>
                      <dd className="mt-0.5 min-w-0 break-words text-ink [&_.truncate]:whitespace-normal">{cell(c, row)}</dd>
                    </div>
                  ) : (
                    <div key={c.key} className="flex min-w-0 items-start justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
                      <dt className="max-w-[40%] shrink-0 pt-px text-small leading-snug text-ink-muted">{c.label}</dt>
                      <dd className="flex min-w-0 flex-1 flex-col items-end text-right leading-snug break-words text-ink [&_.truncate]:whitespace-normal">{cell(c, row)}</dd>
                    </div>
                  ),
                )}
              </dl>
            )}
          </li>
        ))}
      </ul>
      {/* Desktop: the shared AG Grid look. Cells are drawn here (server or client) and handed over as
          finished elements, because server pages can't pass render functions to a client component. */}
      <div className="hidden md:block">
        <StaticGrid
          columns={columns.map(({ key, label, align, wrap, width }) => ({ key, label: typeof label === "string" ? label : "", align, wrap, width }))}
          rows={rows.map((row, i) => ({
            __key: `${row.id ?? "row"}-${i}`,
            cells: Object.fromEntries(columns.map((c) => [c.key, c.render ? c.render(row) : (row[c.key] ?? null)])),
          }))}
        />
      </div>
    </>
  );
}
