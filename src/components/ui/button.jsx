import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-600 text-brand-fg hover:bg-brand-700 active:bg-brand-800 border border-transparent",
  secondary: "bg-surface text-ink border border-line-strong hover:bg-surface-muted active:bg-neutral-bg",
  ghost: "bg-transparent text-ink-soft border border-transparent hover:bg-neutral-bg hover:text-ink",
  outline: "bg-surface text-ink border border-line-strong hover:bg-surface-muted active:bg-neutral-bg",
  danger: "bg-danger text-white border border-transparent hover:brightness-95 active:brightness-90",
  "danger-outline": "bg-surface text-danger-ink border border-line-strong hover:bg-danger-bg",
  link: "bg-transparent text-brand-700 border border-transparent hover:underline px-0",
};

const sizes = {
  xs: "h-7 px-2 text-xs gap-1 rounded-md",
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-sm gap-2 rounded-lg",
  lg: "h-10 px-4 text-sm gap-2 rounded-lg",
  icon: "h-9 w-9 rounded-lg justify-center",
  "icon-sm": "h-8 w-8 rounded-md justify-center",
};

export function buttonClasses({ variant = "secondary", size = "md", className } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors select-none",
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-auto aria-disabled:cursor-not-allowed aria-disabled:opacity-55",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ asChild = false, variant, size, className, loading = false, disabled, children, type = "button", ...props }) {
  const classNameValue = buttonClasses({ variant, size, className });
  if (asChild) {
    return (
      <Slot className={classNameValue} aria-busy={loading || undefined} {...props}>
        {children}
      </Slot>
    );
  }
  return (
    <button type={type} className={classNameValue} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, ...props }) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
