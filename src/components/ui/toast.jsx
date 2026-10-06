"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (input) => {
      const toast = typeof input === "string" ? { message: input } : input;
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list.slice(-3), { id, tone: "success", ...toast }]);
      setTimeout(() => dismiss(id), toast.duration ?? 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-16 right-3 left-3 z-[70] flex flex-col items-end gap-2 max-lg:top-28 sm:left-auto sm:w-96" aria-live="polite" role="status">
        {toasts.map((toast) => {
          const Icon = toast.tone === "error" ? XCircle : toast.tone === "info" ? Info : CheckCircle2;
          return (
            <div key={toast.id} className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-surface p-3 shadow-lg">
              <Icon className={cn("mt-0.5 size-5 shrink-0", toast.tone === "error" ? "text-danger-ink" : toast.tone === "info" ? "text-info-ink" : "text-success-ink")} aria-hidden />
              <div className="min-w-0 flex-1">
                {toast.title && <p className="text-sm font-semibold text-ink">{toast.title}</p>}
                <p className="text-sm text-ink-soft">{toast.message}</p>
              </div>
              <button type="button" onClick={() => dismiss(toast.id)} className="rounded p-0.5 text-ink-muted hover:bg-neutral-bg hover:text-ink" aria-label="Dismiss notification">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
