import Link from "next/link";
import { cn } from "@/lib/utils";

export function RangeSwitch({ pathname, ranges, active }) {
  return (
    <nav aria-label="Date range" className="inline-flex rounded-lg border border-line bg-surface p-0.5">
      {ranges.map((r) => (
        <Link
          key={r.value}
          href={`${pathname}?range=${r.value}`}
          scroll={false}
          aria-current={r.value === active ? "true" : undefined}
          className={cn("rounded-md px-2.5 py-2.5 text-[13px] sm:py-1 font-medium whitespace-nowrap", r.value === active ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:text-ink")}
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
  const [lead, ...rest] = columns;
  return (
    <>
      <ul className="divide-y divide-line md:hidden">
        {rows.map((row, i) => (
          <li key={row.id ?? i} className="px-4 py-3">
            <div className="text-sm font-medium break-words text-ink">{lead.render ? lead.render(row) : row[lead.key]}</div>
            {rest.length > 0 && (
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                {rest.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">{c.label}</dt>
                    <dd className="mt-0.5 min-w-0 break-words text-ink-soft [&_.truncate]:whitespace-normal">{c.render ? c.render(row) : row[c.key]}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full min-w-max text-left text-[13px]">
          <thead>
            <tr className="border-b border-line">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-4 py-2 text-xs font-semibold text-ink-muted", c.align === "right" && "text-right")}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? i} className="border-b border-line last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-2 text-ink-soft", c.align === "right" && "text-right tabular")}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
