import { test, expect } from "@playwright/test";
import { SKIP_MESSAGE, hasAuth, sessionToken } from "./auth.mjs";
import { checkMatrix } from "./checks.mjs";
import { DETAIL_ROUTES, VIEWPORTS, fillId, resolveIdFromApi, resolveIdFromList, staticRoutes } from "./routes.mjs";

test.skip(!hasAuth(), SKIP_MESSAGE);

async function runMatrix(page, testInfo, route, url) {
  const results = await checkMatrix(page, url, VIEWPORTS, async (viewport) => {
    await testInfo.attach(`${viewport.name}px.png`, { body: await page.screenshot(), contentType: "image/png" });
  });
  await testInfo.attach("matrix", { body: JSON.stringify({ route, url, results }), contentType: "application/json" });
  const failed = results.filter((r) => r.issues.length).map((r) => `@${r.viewport}px:\n  - ${r.issues.join("\n  - ")}`);
  expect(failed, `${url}\n${failed.join("\n")}`).toEqual([]);
}

test.describe("admin routes x viewports", () => {
  for (const route of staticRoutes()) {
    test(route, async ({ page }, testInfo) => {
      await runMatrix(page, testInfo, route, route);
    });
  }

  for (const spec of DETAIL_ROUTES) {
    test(spec.route, async ({ page }, testInfo) => {
      let { id, note } = await resolveIdFromApi(spec, sessionToken());
      if (!id) id = await resolveIdFromList(page, spec);
      if (note) testInfo.annotations.push({ type: "id-lookup", description: note });
      test.skip(!id, `No record to open for ${spec.route}${note ? ` (${note})` : ""}`);
      await runMatrix(page, testInfo, spec.route, fillId(spec.route, id));
    });
  }
});
