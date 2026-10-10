import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3058";
const port = new URL(baseURL).port;

export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.mjs$/,
  outputDir: "test-results",
  globalSetup: "./e2e/global-setup.mjs",
  fullyParallel: true,
  workers: Number(process.env.E2E_WORKERS) || 3,
  retries: 0,
  // Dev servers compile each route on first hit; a route test visits 5 viewports.
  timeout: 6 * 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }], ["./e2e/matrix-reporter.mjs"]],
  use: {
    baseURL,
    storageState: "e2e/.auth/admin.json",
    navigationTimeout: 120_000,
    actionTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
    viewport: { width: 1600, height: 900 },
  },
  projects: [{ name: "chromium" }],
  // Only ever starts the isolated e2e server (own dist dir); never the user's dev server on 3000.
  webServer:
    port === "3058"
      ? {
          command: "npx next dev -p 3058",
          url: `${baseURL}/admin/login`,
          reuseExistingServer: true,
          timeout: 180_000,
          env: { NEXT_DIST_DIR: ".next-e2e", API_URL: process.env.API_URL || "http://localhost:5058/api/v1" },
        }
      : undefined,
});
