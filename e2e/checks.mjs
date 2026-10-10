import { SIDEBAR_MIN_WIDTH } from "./routes.mjs";

const ERROR_TEXTS = [
  "This page could not be loaded", // (panel)/error.js
  "This page does not exist or the record was removed", // (panel)/not-found.js
  "Application error",
  "Unhandled Runtime Error",
  "Something went wrong", // ErrorState default title
];

const IGNORED_CONSOLE = [/data-cursor-ref/i, /Download the React DevTools/i, /\[HMR\]/, /\[Fast Refresh\]/i];
const RATE_LIMITED = /Too many requests/i;

export const SIDEBAR = 'aside[aria-label="Admin navigation"]';

/** Collects console errors and uncaught page errors between `take()` calls. */
export function collectErrors(page) {
  let errors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    const where = msg.location()?.url;
    errors.push(`console: ${text.replace(/%c|background:[^;]*;|color:[^;]*;|border-radius:[^ ]*/g, "").slice(0, 400)}${where && /Failed to load resource/.test(text) ? ` (${where})` : ""}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${String(error.message).slice(0, 400)}`));
  return {
    take() {
      const out = [...new Set(errors)];
      errors = [];
      return out;
    },
  };
}

export async function waitForPage(page) {
  await page.locator("main").first().waitFor({ state: "visible", timeout: 90_000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(250);
}

/**
 * Opens `url`; returns route-level problems (status, redirect). Retries while the
 * API answers 429, which a full matrix run can hit on a shared server.
 */
export async function loadRoute(page, errors, url) {
  for (let attempt = 0; ; attempt++) {
    let response;
    try {
      response = await page.goto(url, { waitUntil: "domcontentloaded" });
    } catch (error) {
      return { issues: [`navigation failed: ${error.message.split("\n")[0]}`], consoleErrors: errors.take() };
    }
    await waitForPage(page);
    const consoleErrors = errors.take();
    const text = await page.locator("body").innerText().catch(() => "");
    if (attempt < 3 && (RATE_LIMITED.test(text) || consoleErrors.some((e) => RATE_LIMITED.test(e)))) {
      await page.waitForTimeout(65_000);
      continue;
    }
    const issues = [];
    const status = response?.status() ?? 0;
    if (status >= 400) issues.push(`HTTP ${status}`);
    if (new URL(page.url()).pathname === "/admin/login" && !url.startsWith("/admin/login")) issues.push("redirected to /admin/login (session rejected)");
    return { issues, consoleErrors };
  }
}

async function overflowReport(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const limit = root.clientWidth + 1;
    if (root.scrollWidth <= limit) return null;
    const clipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    const describe = (el) => {
      const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 6).join(".") : "";
      const text = (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 40);
      const r = el.getBoundingClientRect();
      return `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${cls ? `.${cls}` : ""}> right=${Math.round(r.right)} w=${Math.round(r.width)}${text ? ` "${text}"` : ""}`;
    };
    const offenders = [];
    for (const el of document.body.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= limit || clipped(el)) continue;
      if (getComputedStyle(el).position === "fixed") continue;
      const parent = el.parentElement;
      const parentOver = parent && parent !== document.body && parent.getBoundingClientRect().right > limit;
      if (!parentOver) offenders.push(describe(el));
      if (offenders.length >= 4) break;
    }
    return `horizontal overflow: scrollWidth=${root.scrollWidth} clientWidth=${root.clientWidth}; widest causes: ${offenders.join(" | ") || "n/a"}`;
  });
}

/** Resizes the loaded page to `viewport` and returns layout/error problems at that width. */
export async function inspectViewport(page, errors, viewport) {
  const issues = [];
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.waitForTimeout(400);

  const text = await page.locator("body").innerText().catch(() => "");
  for (const needle of ERROR_TEXTS) if (text.includes(needle)) issues.push(`error text on page: "${needle}"`);
  if ((await page.locator("[data-nextjs-dialog], [data-nextjs-dialog-overlay]").count()) > 0) issues.push("Next.js error overlay is open");

  const overflow = await overflowReport(page);
  if (overflow) issues.push(overflow);

  if (new URL(page.url()).pathname !== "/admin/login" && (await page.locator("#admin-main").count())) {
    const sidebarVisible = await page.locator(SIDEBAR).isVisible();
    if (viewport.width >= SIDEBAR_MIN_WIDTH) {
      if (!sidebarVisible) issues.push(`sidebar hidden at ${viewport.width}px (expected visible from ${SIDEBAR_MIN_WIDTH}px)`);
    } else {
      if (sidebarVisible) issues.push(`sidebar visible at ${viewport.width}px (expected drawer below ${SIDEBAR_MIN_WIDTH}px)`);
      if (!(await page.getByRole("button", { name: "Open menu" }).isVisible())) issues.push(`"Open menu" button missing at ${viewport.width}px`);
    }
  }

  for (const e of errors.take()) issues.push(e);
  return issues;
}

/** Load once at the first viewport, then resize through the rest. */
export async function checkMatrix(page, url, viewports, onFail) {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: viewports[0].width, height: viewports[0].height });
  const load = await loadRoute(page, errors, url);
  const results = [];
  for (const [i, viewport] of viewports.entries()) {
    const issues = [...load.issues, ...(i === 0 ? load.consoleErrors : [])];
    if (!load.issues.some((m) => m.startsWith("navigation failed"))) issues.push(...(await inspectViewport(page, errors, viewport)));
    results.push({ viewport: viewport.name, issues });
    if (issues.length && onFail) await onFail(viewport, issues);
  }
  return results;
}
