"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger aria-invalid:ring-danger/15";

export function Input({ className, ...props }) {
  return <input className={cn(controlBase, "h-9", className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn(controlBase, "py-2 leading-relaxed", className)} {...props} />;
}

export function Select({ className, options = [], placeholder, children, ...props }) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <select className={cn(controlBase, "h-9 appearance-none pr-8")} {...props}>
        {placeholder != null && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
    </div>
  );
}

export function Field({ label, hint, error, required, children, className, htmlFor }) {
  const autoId = useId();
  const id = htmlFor || autoId;
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-ink-soft">
          {label}
          {required && <span className="ml-0.5 text-danger-ink" aria-hidden>*</span>}
        </label>
      )}
      {typeof children === "function" ? children({ id, invalid: Boolean(error), describedBy: error ? `${id}-error` : hint ? `${id}-hint` : undefined }) : children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger-ink" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({ className, label, ...props }) {
  const input = (
    <input
      type="checkbox"
      className={cn("size-4 shrink-0 rounded border-line-strong accent-brand-600 disabled:cursor-not-allowed", !label && className)}
      {...props}
    />
  );
  if (!label) return input;
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft", className)}>
      {input}
      {label}
    </label>
  );
}

export function Switch({ checked, onChange, label, disabled, id, description }) {
  const autoId = useId();
  const switchId = id || autoId;
  return (
    <div className="flex items-start justify-between gap-4">
      {(label || description) && (
        <label htmlFor={switchId} className="min-w-0 cursor-pointer">
          {label && <span className="block text-sm font-medium text-ink">{label}</span>}
          {description && <span className="block text-xs text-ink-muted">{description}</span>}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-brand-600" : "bg-line-strong",
        )}
      >
        <span className={cn("inline-block size-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-4.5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
