"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useTransition } from "react";
import { startRouteProgress } from "@/components/admin/shell/route-progress";

/**
 * Inside <ShallowQuery value>, setParams only rewrites the browser URL (history.replaceState, which
 * Next syncs into useSearchParams) and the page itself fetches its data, so no server render or
 * route progress bar runs on every filter click.
 */
export const ShallowQuery = createContext(false);

/** Reads and writes list state (filters, search, sort, page) in the URL. */
export function useQueryState() {
  const shallow = useContext(ShallowQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setParams = useCallback(
    (updates, { resetPage = true } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") params.delete(key);
        else params.set(key, String(value));
      }
      if (resetPage && !("page" in updates)) params.delete("page");
      const qs = params.toString();
      if (shallow) {
        // null state: Next skips syncing useSearchParams when the state already holds its own router data
        if (qs !== searchParams.toString()) window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
        return;
      }
      if (qs !== searchParams.toString()) startRouteProgress();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams, shallow],
  );

  const get = useCallback((key) => searchParams.get(key) || "", [searchParams]);

  return { get, setParams, pending, searchParams };
}
