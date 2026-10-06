"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const START_EVENT = "ba-admin-nav-start";

export function startRouteProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}

function isInternalNavigation(event) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = event.target.closest?.("a[href]");
  if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const routeKey = `${pathname}?${search}`;
  const [phase, setPhase] = useState("idle");
  const [lastKey, setLastKey] = useState(routeKey);

  if (lastKey !== routeKey) {
    setLastKey(routeKey);
    if (phase === "loading") setPhase("done");
  }

  useEffect(() => {
    const start = () => setPhase("loading");
    const onClick = (event) => {
      if (isInternalNavigation(event)) start();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, start);
    };
  }, []);

  useEffect(() => {
    if (phase === "idle") return;
    const timer = setTimeout(() => setPhase(phase === "done" ? "idle" : "done"), phase === "done" ? 350 : 12000);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden" role="progressbar" aria-label="Loading page" aria-busy={phase === "loading"}>
      <div
        className={cn(
          "h-full origin-left bg-brand-600 shadow-[0_0_8px_var(--color-brand-500)]",
          phase === "loading" ? "route-progress-run" : "route-progress-done",
        )}
      />
    </div>
  );
}

export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
