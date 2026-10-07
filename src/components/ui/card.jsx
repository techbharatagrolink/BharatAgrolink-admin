import { cn } from "@/lib/utils";

export function Card({ className, as: Tag = "section", ...props }) {
  return <Tag className={cn("min-w-0 rounded-xl border border-line bg-surface shadow-sm", className)} {...props} />;
}

export function CardHeader({ title, description, actions, className, children }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3", className)}>
      <div className="min-w-0">
        {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
        {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardTitle({ className, children }) {
  return <h2 className={cn("text-sm font-semibold text-ink", className)}>{children}</h2>;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}
