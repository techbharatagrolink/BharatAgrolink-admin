/**
 * CRM and sales lists served by the resource engine.
 * Merge `resources` into LIVE_RESOURCES and `livePaths` into LIVE_ADMIN_PATHS.
 * `page` is the PHP menu link adminCan checks. `permission` is the Next sidebar key.
 */
export const resources = {
  "crm.leads": { path: "/crm/leads", page: "crm_leads.php", permission: "crm.leads" },
  "crm.followUps": { path: "/crm/follow-ups", page: "crm_leads.php", permission: "crm.leads" },
  "crm.legacy": { path: "/crm/legacy-leads", page: "manager_all_leads.php", permission: "crm.legacy" },
  "crm.whatsapp": { path: "/crm/whatsapp-sessions", page: "whatsapp_leads.php", permission: "crm.whatsapp" },
  "crm.aiCalls": { path: "/crm/ai-calls", page: "vapi_calls.php", permission: "crm.aiCalls" },
  "crm.callAudit": { path: "/crm/call-audits", page: "call_audit.php", permission: "crm.callAudit" },
  "sales.targets": { path: "/sales/targets", page: "sales_target_management.php", permission: "sales.targets" },
  "sales.salary": { path: "/sales/salary-structures", page: "sales_target_management.php", permission: "sales.salary" },
  "sales.achievements": { path: "/sales/achievements", page: "sales_target_management.php", permission: "sales.targets" },
  "sales.payouts": { path: "/sales/payouts", page: "sales_target_management.php", permission: "sales.payouts" },
  "sales.prepaid": { path: "/sales/prepaid-incentive-config", page: "sales_prepaid_incentive_setup.php", permission: "sales.salary" },
  "sales.team": { path: "/sales/team", page: "sales_target_management.php", permission: "sales" },
};

export const livePaths = [
  "/admin/crm",
  "/admin/crm/leads",
  "/admin/crm/follow-ups",
  "/admin/crm/legacy-leads",
  "/admin/crm/whatsapp",
  "/admin/crm/ai-calls",
  "/admin/crm/call-audit",
  "/admin/sales",
  "/admin/sales/targets",
  "/admin/sales/salary",
  "/admin/sales/achievements",
  "/admin/sales/payouts",
  "/admin/sales/prepaid-incentive",
  "/admin/sales/team",
];
