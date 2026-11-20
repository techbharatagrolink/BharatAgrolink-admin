import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaticGrid } from "@/components/data-table/static-grid";

// Zoho CRM-style building blocks for the main dashboard only. They take the same props as the
// shared <StatCard>, <Card> and <MiniTable>, so the page's data, links and permissions stay as-is.
// Colours come from the .zoho-dash tokens in globals.css.

const ICON_TONES = {
  brand: "bg-brand-50 text-brand-700",
  warning: "bg-warning-bg text-warning-ink",
  danger: "bg-danger-bg text-danger-ink",
  info: "bg-info-bg text-info-ink",
  neutral: "bg-neutral-bg text-neutral-ink",
};

const card = "rounded-xl bg-[var(--z-card)] shadow-[var(--z-shadow)] ring-1 ring-[var(--z-line)]";

export function KpiCard({ label, value, hint, delta, href, icon: Icon, tone = "brand", size, className }) {
  const hasDelta = delta != null && Number.isFinite(delta);
  const lg = size === "lg";
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className={cn("min-w-0 leading-5 font-medium text-[var(--z-soft)] transition-colors group-hover:text-[var(--z-accent)]", lg ? "text-small sm:text-sm" : "text-label sm:text-small")}>{label}</p>
        {Icon && (
          <span className={cn("flex shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110", lg ? "size-9" : "size-7", ICON_TONES[tone] ?? ICON_TONES.brand)}>
            <Icon className={lg ? "size-[18px]" : "size-3.5"} aria-hidden />
          </span>
        )}
      </div>
      <p
        className={cn("truncate leading-tight font-bold tracking-tight text-[var(--z-ink)] tabular", lg ? "mt-2.5 text-2xl sm:text-[28px]" : "mt-2 text-xl sm:text-[22px]")}
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </p>
      {(hasDelta || hint) && (
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs">
          {hasDelta && (
            <span className={cn("inline-flex shrink-0 items-center gap-0.5 font-semibold tabular", delta >= 0 ? "text-success-ink" : "text-danger-ink")}>
              {delta >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {hint && (
            <span className="min-w-0 truncate text-[var(--z-muted)]" title={hint}>
              {hint}
            </span>
          )}
        </div>
      )}
    </>
  );
  const classes = cn(
    "group relative block min-w-0",
    lg ? "p-4 sm:p-5" : "p-3.5 sm:p-4",
    card,
    href && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--z-shadow-hover)] hover:ring-[var(--z-line-strong)]",
    className,
  );
  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

// White widget card with a bold title, like Zoho's "My Open Tasks" / "My Pipeline Deals By Stage".
export function Widget({ title, description, actions, className, bodyClassName, children }) {
  return (
    <section className={cn("flex min-w-0 flex-col transition-shadow duration-200 hover:shadow-[var(--z-shadow-hover)]", card, className)}>
      <header className="flex flex-wrap items-start justify-between gap-2 px-5 pt-4 pb-2">
        <div className="min-w-0">
          <h3 className="text-subheading font-semibold text-[var(--z-ink)]">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-[var(--z-muted)]">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      <div className={cn("min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function WidgetLink({ href, children }) {
  return (
    <Link href={href} className="inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-label font-medium text-[var(--z-accent)] transition-colors hover:bg-[var(--z-accent-soft)]">
      {children}
      <ChevronRight className="size-3.5" aria-hidden />
    </Link>
  );
}

// Zoho list-view table: bordered header cells, roomy rows, blue record links. Same API as MiniTable.
export function ZohoTable({ columns, rows, empty = "No records." }) {
  if (!rows.length) return <p className="px-5 py-8 text-center text-sm text-[var(--z-muted)]">{empty}</p>;
  const [lead, ...rest] = columns;
  return (
    <>
      <ul className="divide-y divide-[var(--z-line)] border-t border-[var(--z-line)] md:hidden">
        {rows.map((row, i) => (
          <li key={`${row.id ?? "row"}-${i}`} className="px-4 py-3 transition-colors hover:bg-[var(--z-head)]">
            <div className="min-w-0 text-sm font-medium break-words text-[var(--z-ink)]">{lead.render ? lead.render(row) : row[lead.key]}</div>
            {rest.length > 0 && (
              <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-small">
                {rest.map((c) => (
                  <div key={c.key} className="min-w-0">
                    <dt className="text-micro font-medium text-[var(--z-muted)]">{c.label}</dt>
                    <dd className="mt-0.5 min-w-0 break-words text-[var(--z-soft)] [&_.truncate]:whitespace-normal">{c.render ? c.render(row) : row[c.key]}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
      {/* Desktop: the shared AG Grid look (cells drawn here, so server pages can use it too). */}
      <div className="hidden border-t border-[var(--z-line)] md:block">
        <StaticGrid
          columns={columns.map(({ key, label, align, wrap, width }) => ({ key, label: typeof label === "string" ? label : "", align, wrap, width }))}
          rows={rows.map((row, i) => ({
            __key: `${row.id ?? "row"}-${i}`,
            cells: Object.fromEntries(columns.map((c) => [c.key, c.render ? c.render(row) : (row[c.key] ?? null)])),
          }))}
        />
      </div>
      <div className="flex items-center justify-end gap-1 px-5 py-3 text-label font-semibold text-[var(--z-soft)] tabular">
        1 - {rows.length}
      </div>
    </>
  );
}
