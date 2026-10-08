import { coreResources } from "./core";
import { catalogResources } from "./catalog";
import { orderResources } from "./orders";
import { financeResources } from "./finance";
import { crmResources } from "./crm";
import { b2bOpsResources } from "./b2b-ops";
import { adminResources } from "./admin";
import { parityResources, parityRoutes } from "./parity";
import { portResources, portRoutes } from "./port";

/**
 * Declarative list screens. A resource describes columns, filters, actions and
 * forms; the generic ResourcePage renders it and the resource service applies
 * actions on the server, so the client only ever sends an action id.
 */
export const resources = {
  ...coreResources,
  ...catalogResources,
  ...orderResources,
  ...financeResources,
  ...crmResources,
  ...b2bOpsResources,
  ...adminResources,
  ...parityResources,
  ...portResources,
};

/** Admin route → resource key, for routes rendered by the generic page. */
export const resourceRoutes = {
  "/admin/orders": "orders",
  "/admin/products": "products",
  "/admin/products/pending": "products.pending",
  "/admin/vendors": "vendors",
  "/admin/vendors/scores": "vendors.scores",
  "/admin/customers": "customers",
  "/admin/shipping": "shipping",
  "/admin/returns": "returns",
  "/admin/refunds": "refunds",
  "/admin/rto": "rto",
  "/admin/payouts": "payouts",
  "/admin/support": "support",
  "/admin/crm/follow-ups": "crm.followUps",

  "/admin/catalog/categories": "catalog.categories",
  "/admin/catalog/brands": "catalog.brands",
  "/admin/catalog/attributes": "catalog.attributes",
  "/admin/catalog/tax-classes": "catalog.tax",
  "/admin/catalog/hsn-codes": "catalog.hsn",
  "/admin/catalog/return-policies": "catalog.returnPolicies",
  "/admin/pricing/master-nrv": "pricing.masterNrv",
  "/admin/pricing/commission": "pricing.commission",
  "/admin/pricing/cost-config": "pricing.costConfig",

  "/admin/orders/invoices": "orders.invoices",
  "/admin/orders/transactions": "orders.transactions",
  "/admin/orders/whatsapp": "orders.whatsapp",
  "/admin/orders/sr-checkout": "orders.srCheckout",
  "/admin/shipping/courier-slabs": "shipping.courierSlabs",
  "/admin/shipping/slabs": "shipping.slabs",
  "/admin/shipping/cod-rules": "shipping.codRules",
  "/admin/shipping/other-charges": "shipping.otherCharges",
  "/admin/shipping/package-boxes": "shipping.boxes",
  "/admin/shipping/weight-discrepancy": "shipping.weight",
  "/admin/shipping/pincodes": "shipping.pincodes",
  "/admin/returns/reasons": "returns.reasons",

  "/admin/vendors/verification": "vendors.verification",
  "/admin/vendors/reports": "vendors.reports",
  "/admin/payouts/items": "payouts.items",
  "/admin/payouts/access": "payouts.access",
  "/admin/payouts/legacy": "payouts.legacy",

  "/admin/finance/ledger": "finance.ledger",
  "/admin/finance/hold-ledger": "finance.holdLedger",
  "/admin/finance/cod": "finance.cod",
  "/admin/finance/gst": "finance.tax",
  "/admin/finance/fixed-expenses": "finance.fixedExpenses",
  "/admin/finance/wallet-withdrawals": "finance.wallet",

  "/admin/customers/coupons": "customers.coupons",
  "/admin/customers/reviews": "customers.reviews",

  "/admin/crm/leads": "crm.leads",
  "/admin/crm/legacy-leads": "crm.legacy",
  "/admin/crm/whatsapp": "crm.whatsapp",
  "/admin/crm/ai-calls": "crm.aiCalls",
  "/admin/crm/call-audit": "crm.callAudit",
  "/admin/crm/circles": "crm.circles",
  "/admin/sales/targets": "sales.targets",
  "/admin/sales/salary": "sales.salary",
  "/admin/sales/achievements": "sales.achievements",
  "/admin/sales/payouts": "sales.payouts",
  "/admin/sales/prepaid-incentive": "sales.prepaid",
  "/admin/sales/team": "sales.team",

  "/admin/b2b/buyers": "b2b.buyers",
  "/admin/b2b/rfqs": "b2b.rfqs",
  "/admin/b2b/quotations": "b2b.quotations",
  "/admin/b2b/orders": "b2b.orders",
  "/admin/b2b/payments": "b2b.payments",
  "/admin/b2b/settlements": "b2b.settlements",
  "/admin/b2b/claims": "b2b.claims",
  "/admin/b2b/alerts": "b2b.alerts",
  "/admin/bulk-orders": "bulk",
  "/admin/bulk-orders/warehouses": "bulk.warehouses",

  "/admin/inventory": "inventory",
  "/admin/inventory/history": "inventory.history",
  "/admin/operations/ndr": "operations.ndr",
  "/admin/operations/escalations": "operations.escalations",
  "/admin/operations/recordings": "operations.recordings",
  "/admin/operations/rules": "operations.rules",
  "/admin/operations/sla": "operations.sla",
  "/admin/operations/team/assignments": "operations.assignments",
  "/admin/operations/team/agents": "operations.agents",
  "/admin/operations/team/setup": "operations.setup",
  "/admin/support/sla": "support.sla",

  "/admin/cms/banners": "cms.banners",
  "/admin/cms/home-sections": "cms.homeSections",
  "/admin/cms/blogs": "cms.blogs",
  "/admin/cms/events": "cms.events",
  "/admin/cms/faqs": "cms.faqs",
  "/admin/cms/pages": "cms.pages",
  "/admin/cms/footer": "cms.footer",
  "/admin/cms/notifications": "cms.notifications",

  "/admin/users": "users",
  "/admin/audit": "audit",
  "/admin/masters/geography": "masters.geography",
  "/admin/masters/reject-reasons": "masters.rejectReasons",
  "/admin/masters/currency": "masters.currency",
  "/admin/settings/email-templates": "settings.emailTemplates",
  "/admin/settings/languages": "settings.languages",
  ...parityRoutes,
  ...portRoutes,
};

export function getResource(key) {
  return resources[key] ?? null;
}

export function getResourceByPath(pathname) {
  const key = resourceRoutes[pathname];
  return key ? { key, resource: resources[key] } : null;
}
