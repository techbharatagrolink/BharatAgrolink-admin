"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { startRouteProgress } from "@/components/admin/shell/route-progress";

/** Reads and writes list state (filters, search, sort, page) in the URL. */
export function useQueryState() {
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
      if (qs !== searchParams.toString()) startRouteProgress();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [pathname, router, searchParams],
  );

  const get = useCallback((key) => searchParams.get(key) || "", [searchParams]);

  return { get, setParams, pending, searchParams };
}
