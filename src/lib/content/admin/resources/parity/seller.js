/**
 * Screens for the seller PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */
export const resources = {};
export const routes = {};
export const live = {};

export const pages = {
  "vendors.add": ["add_seller.php"],
  "catalog.featureCategories": ["feature_category.php"],
  "catalog.cropMenu": ["shop_topics.php"],
  "dashboard.productOverview": ["product_dashboard.php"],
  "b2b.catalog": ["b2b_orders/catalog.php"],
  "b2b.approvals": ["b2b_orders/approvals.php"],
  "b2b.reports": ["b2b_orders/reports.php"],
};

export const livePaths = [
  "/admin/vendors/new",
  "/admin/catalog/feature-categories",
  "/admin/catalog/crop-menu",
  "/admin/dashboards/product-overview",
  "/admin/b2b/catalog",
  "/admin/b2b/approvals",
  "/admin/b2b/reports",
];
