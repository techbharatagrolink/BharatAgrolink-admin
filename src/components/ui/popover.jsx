"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhone } from "./use-phone";

export function Popover({ id: idProp, trigger, children, align = "right", className, panelClassName, label, sheetOnPhone = false }) {
  // sheetOnPhone: on phone-width screens the panel opens as a bottom sheet (fits the screen, never overlaps the page).
  const phone = usePhone();
  const asSheet = sheetOnPhone && phone;
  const [open, setOpen] = useState(false);
  // Inside a grid table (AG Grid) the cell clips anything that spills out of it, so there the panel is
  // drawn in a layer on <body> at a fixed position under (or above) the trigger. Elsewhere: unchanged.
  // null = normal panel; { placed: false } = floating, not yet positioned; { placed: true, ...coords }.
  const [floating, setFloating] = useState(null);
  const ref = useRef(null);
  const panelRef = useRef(null);
  const autoId = useId();
  const id = idProp ?? autoId;
  const isFloating = floating != null;

  // Triggers pass their click event; the clicked button tells us whether we sit inside a grid table.
  const toggle = (event) => {
    const inGrid = Boolean(event?.currentTarget?.closest?.(".ba-grid"));
    setFloating(inGrid ? { placed: false } : null);
    setOpen((value) => !value);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (event) => {
      if (ref.current?.contains(event.target) || panelRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    if (asSheet) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      if (asSheet) document.body.style.overflow = prevOverflow;
    };
  }, [open, asSheet]);

  // Floating panel: place it once drawn (its height decides whether it opens below or above the button).
  useEffect(() => {
    if (!open || !isFloating) return;
    const place = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const h = panelRef.current?.offsetHeight ?? 0;
      const below = r.bottom + 8 + h <= window.innerHeight - 8 || r.top - 8 - h < 8;
      const vertical = below ? { top: r.bottom + 8 } : { bottom: window.innerHeight - r.top + 8 };
      const horizontal = align === "right" ? { right: Math.max(8, window.innerWidth - r.right) } : { left: Math.max(8, r.left) };
      setFloating({ placed: true, ...vertical, ...horizontal });
    };
    const frame = requestAnimationFrame(place);
    // The grid scrolls inside itself; close rather than leave a menu floating away from its row.
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, isFloating, align]);

  const { placed, ...coords } = floating ?? {};
  const panel = (
    <div
      ref={panelRef}
      id={id}
      style={isFloating ? { position: "fixed", top: 0, left: 0, ...(placed ? { top: undefined, left: undefined, ...coords } : {}) } : undefined}
      className={cn(
        "w-72 max-w-[calc(100vw-1.5rem)] animate-in rounded-lg border duration-150 fade-in-0 zoom-in-95 slide-in-from-top-1 motion-reduce:animate-none border-line bg-surface shadow-[var(--shadow-pop)]",
        isFloating ? cn("z-[65]", !placed && "invisible") : cn("absolute top-full z-50 mt-2", align === "right" ? "right-0" : "left-0"),
        panelClassName,
      )}
      onClick={(event) => {
        if (event.target.closest("a,[data-close]")) setOpen(false);
      }}
    >
      {children}
    </div>
  );

  const sheet = (
    <div className="fixed inset-0 z-[90] flex items-end bg-black/45">
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-label={label}
        className="ui-sheet flex max-h-[78dvh] w-full flex-col rounded-t-2xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-pop)]"
        onClick={(event) => {
          if (event.target.closest("a,[data-close]")) setOpen(false);
        }}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong" aria-hidden />
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-2 pb-1">
          <p className="truncate text-subheading font-semibold text-ink">{label}</p>
          <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface-muted" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle, props: { "aria-expanded": open, "aria-controls": id, "aria-haspopup": "true", "aria-label": label } })}
      {open && (asSheet ? createPortal(sheet, document.body) : isFloating ? createPortal(panel, document.body) : panel)}
    </div>
  );
}
