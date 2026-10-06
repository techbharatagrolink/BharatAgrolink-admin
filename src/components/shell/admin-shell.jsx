"use client";

import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLiveRoute } from "@/lib/live-routes";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const TABLET_QUERY = "(max-width: 1023px)";
const RAIL_KEY = "ba-admin-rail";
const RAIL_EVENT = "ba-admin-rail-change";

function subscribe(callback) {
  const mq = window.matchMedia(TABLET_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function subscribeRail(callback) {
  window.addEventListener(RAIL_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(RAIL_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readRail() {
  try {
    return localStorage.getItem(RAIL_KEY) === "1";
  } catch {
    return false;
  }
}

function saveRail(value) {
  try {
    localStorage.setItem(RAIL_KEY, value ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(RAIL_EVENT));
}

export function AdminShell({ children }) {
  const pathname = usePathname();
  const isTablet = useSyncExternalStore(subscribe, () => window.matchMedia(TABLET_QUERY).matches, () => false);
  const desktopRail = useSyncExternalStore(subscribeRail, readRail, () => false);
  const [tabletRail, setTabletRail] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    if (isTablet) setTabletRail(true);
  }
  const rail = isTablet ? tabletRail : desktopRail;
  const toggleRail = () => (isTablet ? setTabletRail(!rail) : saveRail(!rail));

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm">
        Skip to content
      </a>
      <Sidebar rail={rail} onToggleRail={toggleRail} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className={cn("flex min-h-dvh min-w-0 flex-col transition-[padding] duration-200", rail ? "md:pl-16" : "md:pl-[264px]")}>
        <Header rail={rail} onToggleRail={toggleRail} onOpenMobile={() => setMobileOpen(true)} />
        {isLiveRoute(pathname) ? null : (
          <div className="border-b border-warning-ink/15 bg-warning-bg px-3 py-1.5 text-[12.5px] text-warning-ink sm:px-5">
            <p className="mx-auto flex max-w-[1600px] items-center gap-2">
              <Info className="size-3.5 shrink-0" aria-hidden />
              <span>This page is not connected to the admin API yet.</span>
            </p>
          </div>
        )}
        <main id="admin-main" className="mx-auto w-full max-w-[1600px] min-w-0 flex-1 px-3 py-5 sm:px-5 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
