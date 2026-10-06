"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Popover({ trigger, children, align = "right", className, panelClassName, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle: () => setOpen((value) => !value), props: { "aria-expanded": open, "aria-controls": id, "aria-haspopup": "true", "aria-label": label } })}
      {open && (
        <div
          id={id}
          className={cn(
            "absolute top-full z-50 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-line bg-surface shadow-xl",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
          onClick={(event) => {
            if (event.target.closest("a,[data-close]")) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
