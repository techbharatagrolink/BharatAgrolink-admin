"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { orderStatusColor } from "@/lib/content/admin/order-status-color";
import { cn } from "@/lib/utils";

const control =
  "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted";

function optionValue(option) {
  return typeof option === "object" ? option.value : option;
}

function optionLabel(option) {
  return typeof option === "object" ? option.label : option;
}

export function StatusDot({ color, status }) {
  const resolved = color || orderStatusColor(status);
  return (
    <span
      className="inline-block size-3.5 shrink-0 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
      style={{ backgroundColor: resolved }}
      data-status-dot={resolved}
      aria-hidden
    />
  );
}

function placeMenu(button, menu) {
  const rect = button.getBoundingClientRect();
  const gap = 4;
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(120, Math.min(288, openUp ? spaceAbove : spaceBelow));
  const width = Math.max(rect.width, 196);
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  const top = openUp ? Math.max(8, rect.top - gap - maxHeight) : rect.bottom + gap;
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.width = `${width}px`;
  menu.style.maxHeight = `${maxHeight}px`;
}

export function StatusDotSelect({ value, options = [], onChange, "aria-label": ariaLabel, title, className, disabled, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const listId = useId();
  const current = String(value ?? "");
  const items = options.map((option) => ({ value: String(optionValue(option) ?? ""), label: String(optionLabel(option) ?? "") }));
  const selected = items.find((item) => item.value === current);
  const label = selected?.label || current || "—";

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !menuRef.current) return;
    const update = () => placeMenu(buttonRef.current, menuRef.current);
    update();
    const selectedNode = menuRef.current.querySelector("[aria-selected='true']");
    selectedNode?.scrollIntoView({ block: "nearest" });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event) => {
      const target = event.target;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (next) => {
    setOpen(false);
    if (next !== current) onChange?.({ target: { value: next } });
  };

  return (
    <div className={cn(iconOnly ? "relative inline-flex" : "relative min-w-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(iconOnly ? "inline-flex size-6 items-center justify-center rounded-full hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30" : cn(control, "flex h-9 items-center gap-2 pr-8 text-left"))}
        aria-label={ariaLabel || label}
        title={title || label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <StatusDot color={orderStatusColor(current)} />
        {iconOnly ? null : <span className="truncate">{label}</span>}
      </button>
      {iconOnly ? null : <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            className="fixed z-50 overflow-y-auto rounded-lg border border-line-strong bg-surface py-1 shadow-xl"
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={item.value === current}
                className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink hover:bg-surface-muted", item.value === current && "bg-brand-50")}
                onClick={() => pick(item.value)}
              >
                <StatusDot color={orderStatusColor(item.value)} />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
