"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 30_000;
const timeFormat = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata" });

/**
 * Keeps an inventory screen in step with the central inventory (SRS §11 polling fallback):
 * re-fetches the server data every 30 s while the tab is visible, when the window regains focus,
 * and on demand.
 */
export function LiveRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [updatedAt, setUpdatedAt] = useState(null);
  const [online, setOnline] = useState(true);
  const last = useRef(0);

  useEffect(() => {
    const refresh = (force = false) => {
      if (!force && (document.visibilityState !== "visible" || Date.now() - last.current < 5000)) return;
      last.current = Date.now();
      startTransition(() => {
        router.refresh();
        setUpdatedAt(new Date());
      });
    };
    const onFocus = () => refresh();
    const onNetwork = () => setOnline(navigator.onLine);
    // First stamp after hydration (the server render has no clock to match).
    const first = setTimeout(() => {
      setUpdatedAt(new Date());
      onNetwork();
    }, 0);
    const timer = setInterval(refresh, INTERVAL_MS);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onNetwork);
    window.addEventListener("offline", onNetwork);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onNetwork);
      window.removeEventListener("offline", onNetwork);
    };
  }, [router]);

  function now() {
    last.current = Date.now();
    startTransition(() => {
      router.refresh();
      setUpdatedAt(new Date());
    });
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs text-ink-muted" aria-live="polite">
      <span className={cn("size-2 rounded-full", online ? "bg-success-ink" : "bg-danger")} aria-hidden />
      <span>
        {online ? "Live" : "Offline – showing last data"}
        {updatedAt && ` · updated ${timeFormat.format(updatedAt)}`}
      </span>
      <button type="button" onClick={now} disabled={pending} className="grid size-6 place-items-center rounded hover:bg-neutral-bg hover:text-ink" title="Refresh now" aria-label="Refresh now">
        <RefreshCw className={cn("size-3.5", pending && "animate-spin")} aria-hidden />
      </button>
    </span>
  );
}
