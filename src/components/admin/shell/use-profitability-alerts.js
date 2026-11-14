"use client";

import { useEffect, useRef } from "react";
import { profitabilityAlertsAction } from "@/lib/actions/admin/pricing-factors";

const BASELINE_KEY = "ba-admin-profitability-baseline";
const POLL_MS = 60_000;
const BAD = new Set(["loss", "below_floor", "below_target"]);

function readBaseline() {
  try {
    return JSON.parse(localStorage.getItem(BASELINE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveBaseline(next) {
  try {
    localStorage.setItem(BASELINE_KEY, JSON.stringify(next));
  } catch {}
}

function notify(title, body, tag) {
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    new Notification(title, { body, tag, renotify: false });
  } catch {}
}

/**
 * Polls the live verdict snapshot and fires a browser Notification when a product's
 * verdict crosses into or out of trouble. State lives entirely in this browser
 * (localStorage) — there's no server-side "last seen" to compare against, so the first
 * poll after a fresh baseline never notifies (nothing to compare yet), only later
 * transitions do. Fires only while this tab is open somewhere (background is fine,
 * focus isn't required); there is no push support for a fully closed browser.
 */
export function useProfitabilityAlerts() {
  const pollingRef = useRef(false);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const poll = async () => {
      if (pollingRef.current) return;
      pollingRef.current = true;
      try {
        const res = await profitabilityAlertsAction();
        if (!res.ok) return;
        const baseline = readBaseline();
        const next = {};
        for (const p of res.products) {
          const prev = baseline[p.id];
          next[p.id] = p.verdict;
          if (prev == null) continue; // first time this product has ever been seen — don't notify
          if (prev === p.verdict) continue;
          if (!BAD.has(prev) && BAD.has(p.verdict)) {
            notify("Critical loss alert", `${p.name} dropped to "${p.verdict.replace("_", " ")}" (margin ${(p.marginBps / 100).toFixed(2)}%).`, `profit-red-${p.id}`);
          } else if (BAD.has(prev) && !BAD.has(p.verdict)) {
            notify("Target achieved", `${p.name} is now healthy (margin ${(p.marginBps / 100).toFixed(2)}%).`, `profit-green-${p.id}`);
          }
        }
        saveBaseline(next);
      } finally {
        pollingRef.current = false;
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, []);
}
