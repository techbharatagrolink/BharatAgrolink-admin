"use client";

import { useEffect } from "react";

/**
 * Deep links such as /admin/dashboard#dashboard_sales_overview: opens the
 * collapsed accordion section that carries the id, then scrolls to it.
 */
export function HashSectionOpener() {
  useEffect(() => {
    function open() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      const toggle = target.querySelector('h2 > button[aria-controls^="dash-panel-"]');
      if (toggle?.getAttribute("aria-expanded") === "false") toggle.click();
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
    function onClick(event) {
      const link = event.target.closest?.('a[href*="#"]');
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) setTimeout(open, 0);
    }
    open();
    window.addEventListener("hashchange", open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
