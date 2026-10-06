import { cn } from "@/lib/utils";
import { statusTone } from "@/lib/content/admin/status";

const toneClasses = {
  success: "bg-success-bg text-success-ink",
  warning: "bg-warning-bg text-warning-ink",
  danger: "bg-danger-bg text-danger-ink",
  info: "bg-info-bg text-info-ink",
  neutral: "bg-neutral-bg text-neutral-ink",
  brand: "bg-brand-50 text-brand-700",
};

const dotClasses = {
  success: "bg-success-ink",
  warning: "bg-warning-ink",
  danger: "bg-danger-ink",
  info: "bg-info-ink",
  neutral: "bg-neutral-ink",
  brand: "bg-brand-600",
};

const variantTone = {
  default: "success",
  secondary: "neutral",
  destructive: "danger",
  outline: "neutral",
};

export function Badge({ tone, variant, className, children, dot = false }) {
  const resolved = tone || variantTone[variant] || "neutral";
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium leading-5 whitespace-nowrap", toneClasses[resolved], className)}>
      {dot && <span className={cn("size-1.5 shrink-0 rounded-full", dotClasses[resolved])} aria-hidden />}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function StatusBadge({ status, label, className }) {
  if (status == null || status === "") return <span className="text-ink-muted">—</span>;
  const text = label ?? (typeof status === "boolean" ? (status ? "Yes" : "No") : String(status).replace(/_/g, " "));
  return (
    <Badge tone={statusTone(status)} dot className={className}>
      {text}
    </Badge>
  );
}
