import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions, meta, className }) {
  return (
    <div className={cn("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-[22px]">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-ink-muted">{description}</p>}
        {meta && <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, delta, href, icon: Icon, tone = "brand", className }) {
  const toneBg = { brand: "bg-brand-50 text-brand-700", warning: "bg-warning-bg text-warning-ink", danger: "bg-danger-bg text-danger-ink", info: "bg-info-bg text-info-ink", neutral: "bg-neutral-bg text-neutral-ink" }[tone];
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12.5px] font-medium text-ink-muted">{label}</p>
        {Icon && (
          <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", toneBg)}>
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular">{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
        {delta != null && Number.isFinite(delta) && (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success-ink" : "text-danger-ink")}>
            {delta >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && <span className="truncate text-ink-muted">{hint}</span>}
      </div>
    </>
  );
  const classes = cn("block min-w-0 rounded-xl border border-line bg-surface p-3.5", href && "transition-colors hover:border-brand-200 hover:bg-surface-muted", className);
  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}

export function StatGrid({ children, className }) {
  return <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4", className)}>{children}</div>;
}

export function DescriptionList({ items, columns = 2, className }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 1 ? "" : "sm:grid-cols-2", className)}>
      {items.filter(Boolean).map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs text-ink-muted">{item.label}</dt>
          <dd className="mt-0.5 text-sm break-words text-ink">{item.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ items }) {
  if (!items?.length) return <p className="text-sm text-ink-muted">No activity yet.</p>;
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className={cn("absolute top-1 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", item.tone === "danger" ? "bg-danger" : item.tone === "warning" ? "bg-warning-ink" : "bg-brand-600")} aria-hidden />
          <p className="text-sm font-medium text-ink">{item.title}</p>
          {item.description && <p className="text-sm text-ink-soft">{item.description}</p>}
          <p className="mt-0.5 text-xs text-ink-muted">{item.meta}</p>
        </li>
      ))}
    </ol>
  );
}

export function LinkTabs({ tabs, active }) {
  return (
    <div className="-mx-1 mb-4 overflow-x-auto scrollbar-thin">
      <nav className="flex min-w-max gap-1 border-b border-line px-1" aria-label="Sections">
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors",
                isActive ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {tab.label}
              {tab.count != null && <span className="rounded-full bg-neutral-bg px-1.5 text-[11px] text-ink-soft tabular">{tab.count}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Notice({ tone = "info", title, children, className }) {
  const toneClass = { info: "border-info-ink/20 bg-info-bg text-info-ink", warning: "border-warning-ink/20 bg-warning-bg text-warning-ink", danger: "border-danger-ink/20 bg-danger-bg text-danger-ink", success: "border-success-ink/20 bg-success-bg text-success-ink" }[tone];
  return (
    <div className={cn("rounded-lg border px-3.5 py-2.5 text-sm", toneClass, className)} role={tone === "danger" ? "alert" : undefined}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={cn(title && "mt-0.5", "opacity-95")}>{children}</div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, tone = "brand", className, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass = { brand: "bg-brand-600", warning: "bg-warning-ink", danger: "bg-danger", info: "bg-info-ink" }[tone];
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-neutral-bg", className)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn("chart-grow-x h-full rounded-full", toneClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}
