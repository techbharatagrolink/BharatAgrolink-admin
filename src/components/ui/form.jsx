"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePhone } from "./use-phone";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full min-w-0 rounded-md border border-line-strong bg-surface px-3 text-field text-ink placeholder:text-ink-muted transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger aria-invalid:ring-danger/15";

export function Input({ className, ...props }) {
  return <input className={cn(controlBase, "h-9", className)} {...props} />;
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn(controlBase, "py-2 leading-relaxed", className)} {...props} />;
}

const optionOf = (option) => (typeof option === "object" ? { value: String(option.value ?? ""), label: String(option.label ?? option.value ?? "") } : { value: String(option), label: String(option) });

/**
 * Long option lists (sellers, vendors, categories…) get a searchable panel that stays inside the
 * screen instead of the browser's own list, which on phones spills past the edge and can't be searched.
 * A hidden native <select> keeps the name/value/onChange contract, so forms and handlers work unchanged.
 */
function SearchableSelect({ className, options, placeholder, value, defaultValue, onChange, disabled, id, name, required, form, sheet = false, searchable = true, ...rest }) {
  const selectRef = useRef(null);
  const rootRef = useRef(null);
  const sheetRef = useRef(null);
  const [title, setTitle] = useState("");
  const searchRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [inner, setInner] = useState(defaultValue == null ? "" : String(defaultValue));
  const current = value !== undefined ? String(value ?? "") : inner;
  const items = [...(placeholder != null ? [{ value: "", label: String(placeholder) }] : []), ...options.map(optionOf)];
  const selected = items.find((item) => item.value === current);
  const needle = query.trim().toLowerCase();
  const shown = needle ? items.filter((item) => item.label.toLowerCase().includes(needle)) : items;
  const listId = `${useId()}-list`;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target) && !sheetRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    // Phone sheet: keep the page behind it from scrolling while it is open.
    const prevOverflow = document.body.style.overflow;
    if (sheet) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      if (sheet) document.body.style.overflow = prevOverflow;
    };
  }, [open, sheet]);

  const openPanel = () => {
    if (disabled) return;
    setQuery("");
    setActive(Math.max(0, items.findIndex((item) => item.value === current)));
    // Sheet title: the field's own label when there is one.
    const labelText = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent : "";
    setTitle((labelText || rest["aria-label"] || placeholder || "Choose an option").replace(/\*$/, "").trim());
    setOpen(true);
    if (searchable) requestAnimationFrame(() => searchRef.current?.focus());
  };

  const pick = (next) => {
    if (value === undefined) setInner(next);
    const el = selectRef.current;
    if (el) {
      // Update the hidden select and fire a real change event, so the page's onChange runs as before.
      el.value = next;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(shown.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (shown[active]) pick(shown[active].value);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const searchBox = searchable ? (
    <div className="relative shrink-0 border-b border-line p-2">
      <Search className="pointer-events-none absolute top-1/2 left-4.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        ref={searchRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={`Search ${String(placeholder ?? "").replace(/^all\s+/i, "").toLowerCase() || "options"}…`}
        aria-label="Search options"
        className="h-9 w-full rounded-md border border-line-strong bg-surface pr-3 pl-8 text-field text-ink placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
      />
    </div>
  ) : null;

  const list = (sizeClass, roomy = false) => (
    <ul id={listId} role="listbox" className={cn("overflow-y-auto overscroll-contain p-1", sizeClass)}>
      {shown.length === 0 && <li className="px-3 py-4 text-center text-small text-ink-muted">No matches for “{query}”.</li>}
      {shown.map((item, index) => {
        const isSelected = item.value === current;
        return (
          <li key={item.value || "__all"} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onMouseEnter={() => setActive(index)}
              onClick={() => pick(item.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 text-left text-body",
                roomy ? "py-3" : "py-2",
                index === active ? "bg-surface-muted" : "",
                isSelected ? "font-medium text-brand-700" : "text-ink",
              )}
            >
              <span className="min-w-0 flex-1 break-words">{item.label}</span>
              {isSelected && <Check className="size-4 shrink-0" aria-hidden />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      <select ref={selectRef} name={name} form={form} required={required} disabled={disabled} value={value} defaultValue={value === undefined ? defaultValue : undefined} onChange={onChange} tabIndex={-1} aria-hidden className="sr-only">
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={cn(controlBase, "flex h-9 items-center pr-8 text-left max-sm:text-small")}
        {...rest}
      >
        <span className={cn("truncate", !selected?.value && placeholder != null && "text-ink-soft")}>{selected?.label ?? placeholder ?? ""}</span>
      </button>
      <ChevronDown className={cn("pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted transition-transform", open && "rotate-180")} aria-hidden />
      {open && !sheet && (
        <div className="ui-pop absolute top-full left-0 z-50 mt-1 w-full min-w-[min(16rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow-pop)]" onKeyDown={searchable ? undefined : onKeyDown}>
          {searchBox}
          {list("max-h-[min(16rem,50vh)]")}
        </div>
      )}
      {open &&
        sheet &&
        createPortal(
          <div className="fixed inset-0 z-[90] flex items-end bg-black/45" onClick={() => setOpen(false)}>
            <div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={searchable ? undefined : onKeyDown}
              className="ui-sheet flex max-h-[78dvh] w-full flex-col rounded-t-2xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-pop)]"
            >
              <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong" aria-hidden />
              <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-2 pb-1">
                <p className="truncate text-subheading font-semibold text-ink">{title}</p>
                <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted" aria-label="Close">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              {searchBox}
              {list("min-h-0 flex-1", true)}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export function Select({ className, options = [], placeholder, children, ...props }) {
  const phone = usePhone();
  const long = options.length > 12;
  // Phones: every option list opens as a bottom sheet. Wider screens: only long lists get the searchable panel.
  if (!children && (long || phone)) return <SearchableSelect className={className} options={options} placeholder={placeholder} sheet={phone} searchable={long} {...props} />;
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
        <label htmlFor={id} className="block text-label font-medium text-ink-soft">
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
