/**
 * Screens for the crm PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */
export const resources = {};
export const routes = {};
export const live = {};
export const pages = {
  "crm.addLead": ["add_lead.php"],
  "crm.convert": ["manage_engagement_leads.php"],
  "crm.agentLeads": ["sales_agent_leads.php"],
  "crm.unassigned": ["pending_leads.php"],
  "crm.dead": ["dead_leads.php"],
  "crm.tracking": ["customer_search_tracking.php"],
  "crm.requested": ["report_requested_leads.php"],
  "sales.myPerformance": ["my_sales_performance.php"],
  "sales.teamPerformance": ["sales_performance_report.php"],
};
export const livePaths = [
  "/admin/crm/add-lead",
  "/admin/crm/convert",
  "/admin/crm/agent-leads",
  "/admin/crm/unassigned",
  "/admin/crm/dead",
  "/admin/crm/customer-tracking",
  "/admin/crm/requested",
  "/admin/sales/my-performance",
  "/admin/sales/team-performance",
];
