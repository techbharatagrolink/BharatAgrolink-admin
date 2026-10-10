import { test, expect } from "@playwright/test";
import { SKIP_MESSAGE, hasAuth } from "./auth.mjs";
import { SIDEBAR, checkMatrix, waitForPage } from "./checks.mjs";
import { DETAIL_ROUTES, SIDEBAR_MIN_WIDTH, VIEWPORTS, pathOf, staticRoutes } from "./routes.mjs";

test.describe("admin shell", () => {
  test.skip(!hasAuth(), SKIP_MESSAGE);

  test("every sidebar link is covered by the route matrix", async ({ page, request }, testInfo) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/admin/dashboard");
    await waitForPage(page);
    const hrefs = [...new Set(await page.locator(`${SIDEBAR} a[href]`).evaluateAll((els) => els.map((a) => a.getAttribute("href"))))];
    expect(hrefs.length, "sidebar rendered no links").toBeGreaterThan(0);

    const tested = new Set(staticRoutes().map((r) => r.split("?")[0]));
    const detailPatterns = DETAIL_ROUTES.map((d) => new RegExp(`^${d.route.replace("[id]", "[^/]+")}$`));
    const notPorted = hrefs.filter((h) => h.startsWith("/admin/not-ported"));
    const uncovered = hrefs
      .map(pathOf)
      .filter((h) => h.startsWith("/admin/") && !h.startsWith("/admin/not-ported"))
      .map((h) => h.split("?")[0])
      .filter((h) => !tested.has(h) && !detailPatterns.some((re) => re.test(h)));

    const broken = [];
    for (const href of uncovered) {
      const res = await request.get(href, { maxRedirects: 0, timeout: 120_000 }).catch((e) => ({ status: () => `error ${e.message}` }));
      if (typeof res.status() !== "number" || res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
    }
    await testInfo.attach("sidebar-links", {
      body: JSON.stringify({ total: hrefs.length, notPorted, uncovered, broken }, null, 2),
      contentType: "application/json",
    });
    expect(uncovered, `Sidebar links missing from the route matrix (broken: ${broken.join(", ") || "none"})`).toEqual([]);
  });

  for (const route of ["/admin/dashboard", "/admin/orders"]) {
    for (const viewport of VIEWPORTS) {
      const mobile = viewport.width < SIDEBAR_MIN_WIDTH;
      test(`${mobile ? "drawer" : "sidebar"} on ${route} @${viewport.name}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route);
        await waitForPage(page);
        const sidebar = page.locator(SIDEBAR);
        const openButton = page.getByRole("button", { name: "Open menu" });
        if (!mobile) {
          await expect(sidebar).toBeVisible();
          await expect(openButton).toBeHidden();
          expect((await sidebar.boundingBox()).x).toBeGreaterThanOrEqual(0);
          return;
        }
        await expect(sidebar).toBeHidden();
        await openButton.click();
        await expect(sidebar).toBeVisible();
        await expect(sidebar.locator("nav a[href]").first()).toBeVisible();
        expect(await sidebar.locator("nav a[href], nav button").count()).toBeGreaterThan(3);
        await sidebar.getByRole("button", { name: "Close menu" }).click();
        await expect(sidebar).toBeHidden();
        await openButton.click();
        await expect(sidebar).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(sidebar).toBeHidden();
      });
    }
  }
});

test.describe("logged out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("panel redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login page renders at every viewport", async ({ page }) => {
    const results = await checkMatrix(page, "/admin/login", VIEWPORTS);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    const failed = results.filter((r) => r.issues.length).map((r) => `@${r.viewport}px: ${r.issues.join("; ")}`);
    expect(failed).toEqual([]);
  });
});
