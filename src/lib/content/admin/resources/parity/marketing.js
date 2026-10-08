/**
 * Screens for the marketing PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */
export const resources = {};
export const routes = {};
export const live = {};
export const pages = {
  marketing: ["social_media_dashboard.php"],
  "marketing.expenses": ["marketing_expenses.php"],
  "marketing.engagement": ["engagement_panel.php"],
  "dashboard.ceo": ["ceo_decision_matrix.php"],
  "dashboard.business": ["main_dashboard.php"],
  "finance.fraud": ["fraud_analysis_dashboard.php"],
  "cms.seo": ["meta.php"],
};
export const livePaths = [
  "/admin/marketing",
  "/admin/marketing/expenses",
  "/admin/marketing/engagement",
  "/admin/ceo-matrix",
  "/admin/dashboards/business",
  "/admin/finance/fraud",
  "/admin/cms/seo",
];
