/** Routes whose data comes from the admin API. The preview banner stays on every other page. */
const LIVE_ROUTES = new Set([
  "/",
  "/dashboard",
  "/orders",
  "/orders/list",
  "/orders/rto",
  "/orders/payment",
  "/products",
  "/products/approval",
  "/vendors",
  "/sales",
  "/logistics",
  "/finance",
  "/marketing",
  "/marketing/coupons",
  "/support",
  "/profile",
  "/settings",
]);

export function isLiveRoute(pathname) {
  return LIVE_ROUTES.has(pathname || "");
}
