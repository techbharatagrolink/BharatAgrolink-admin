import { chromium } from "@playwright/test";
import { AUTH_FILE, BASE_URL, SKIP_MESSAGE, authMode, tokenCookie, writeStorageState } from "./auth.mjs";

export default async function globalSetup() {
  const mode = authMode();
  if (!mode) {
    writeStorageState();
    console.warn(`\n[e2e] Skipping admin tests. ${SKIP_MESSAGE}\n`);
    return;
  }

  if (mode === "token") {
    writeStorageState([tokenCookie(process.env.ADMIN_E2E_TOKEN)]);
    return;
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL: BASE_URL });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(120_000);
    await page.goto("/admin/login");
    await page.locator('input[name="email"]').fill(process.env.ADMIN_E2E_EMAIL);
    await page.locator('input[name="password"]').fill(process.env.ADMIN_E2E_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.startsWith("/admin/login"), { timeout: 120_000 });
    await context.storageState({ path: AUTH_FILE });
  } catch (error) {
    throw new Error(`[e2e] Login through /admin/login failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}
