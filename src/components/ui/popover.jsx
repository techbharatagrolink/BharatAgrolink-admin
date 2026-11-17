"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Popover({ id: idProp, trigger, children, align = "right", className, panelClassName, label }) {
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
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle, props: { "aria-expanded": open, "aria-controls": id, "aria-haspopup": "true", "aria-label": label } })}
      {open && (isFloating ? createPortal(panel, document.body) : panel)}
    </div>
  );
}
