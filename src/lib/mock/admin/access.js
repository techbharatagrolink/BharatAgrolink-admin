import { daysAgo, createRandom } from "./seed";

const ALL = ["view", "add", "edit", "delete"];
const VIEW = ["view"];
const EDIT = ["view", "edit"];
const WRITE = ["view", "add", "edit"];

function grant(keys, actions) {
  return Object.fromEntries(keys.map((key) => [key, actions]));
}

/** Mirrors `user_roles` (role_id 0 = super admin; 32/57/66 ops agents; 56/59 sales). */
export function buildRoles() {
  return [
    { id: 0, name: "Super Admin", superAdmin: true, description: "Full access to every module and setting.", permissions: {} },
    {
      id: 70,
      name: "Finance Manager",
      description: "Finance, payouts, refunds, ledgers and finance reports.",
      permissions: {
        ...grant(["dashboard.main", "dashboard.finance", "orders", "orders.invoices", "orders.transactions", "vendors", "vendors.reports", "rto", "reports", "customers"], VIEW),
        ...grant(["finance", "finance.ledger", "finance.tax", "finance.expenses", "finance.wallet", "payouts", "payouts.access", "refunds", "b2b.finance"], WRITE),
        "finance.holdLedger": ALL,
      },
    },
    {
      id: 71,
      name: "Catalog Manager",
      description: "Products, approvals, catalog setup and pricing.",
      permissions: {
        ...grant(["dashboard.main", "dashboard.products", "vendors", "customers.reviews"], VIEW),
        ...grant(["products", "products.approval", "products.import", "catalog.categories", "catalog.brands", "catalog.attributes", "catalog.tax", "catalog.hsn", "catalog.returnPolicies", "pricing", "pricing.masterNrv", "pricing.commission"], ALL),
        "pricing.costConfig": VIEW,
      },
    },
    {
      id: 32,
      name: "Operations Agent",
      description: "Assigned orders, shipments, NDR and escalations.",
      scope: "own",
      permissions: {
        ...grant(["dashboard.main", "dashboard.logistics", "returns", "rto", "customers", "operations.team", "support"], VIEW),
        ...grant(["orders", "shipping", "operations.center"], EDIT),
      },
    },
    {
      id: 59,
      name: "Sales Manager",
      description: "Team pipeline, CRM, targets and B2B approvals.",
      permissions: {
        ...grant(["dashboard.main", "orders", "customers", "sales.payouts"], VIEW),
        ...grant(["crm", "crm.leads", "crm.legacy", "crm.whatsapp", "crm.aiCalls", "crm.callAudit", "crm.circles", "sales", "sales.targets", "b2b", "b2b.buyers", "b2b.rfqs", "b2b.quotations", "b2b.orders", "bulk"], WRITE),
      },
    },
    {
      id: 56,
      name: "Sales Executive",
      description: "Own leads, follow-ups and own B2B pipeline.",
      scope: "own",
      permissions: {
        ...grant(["crm", "sales", "orders", "b2b"], VIEW),
        ...grant(["crm.leads", "b2b.buyers", "b2b.rfqs"], WRITE),
      },
    },
    {
      id: 72,
      name: "Support Agent",
      description: "Helpdesk tickets with read access to orders and returns.",
      permissions: {
        ...grant(["dashboard.main", "orders", "customers", "returns"], VIEW),
        support: WRITE,
      },
    },
  ];
}

export function buildStaff() {
  const rand = createRandom(1357);
  const rows = [
    ["ADM-001", "Aditya Sharma", "admin@bharatagrolink.com", 0, "Founder & Super Admin"],
    ["ADM-002", "Meera Iyer", "finance@bharatagrolink.com", 70, "Finance Manager"],
    ["ADM-003", "Rahul Dubey", "catalog@bharatagrolink.com", 71, "Catalog Lead"],
    ["ADM-004", "Pankaj Lodhi", "ops@bharatagrolink.com", 32, "Operations Agent"],
    ["ADM-005", "Nitin Sharma", "sales.manager@bharatagrolink.com", 59, "Sales Manager"],
    ["ADM-006", "Rupesh Kumar", "sales.exec@bharatagrolink.com", 56, "Sales Executive"],
    ["ADM-007", "Kunal Verma", "support@bharatagrolink.com", 72, "Support Agent"],
    ["ADM-008", "Ritu Sahu", "ritu.ops@bharatagrolink.com", 32, "Operations Agent"],
    ["ADM-009", "Anjali Verma", "anjali.sales@bharatagrolink.com", 56, "Sales Executive"],
  ];
  return rows.map(([id, name, email, roleId, designation], i) => ({
    id,
    name,
    email,
    roleId,
    designation,
    mobile: `98${String(26000000 + i * 1371).padStart(8, "0")}`,
    status: i === 8 ? "Inactive" : "Active",
    twoFactor: i < 3,
    lastLoginAt: daysAgo(rand.int(0, 6), rand),
    createdAt: daysAgo(rand.int(60, 700), rand),
  }));
}

export const demoAccounts = [
  { userId: "ADM-001", hint: "Everything (role_id 0)" },
  { userId: "ADM-002", hint: "Finance, payouts, refunds" },
  { userId: "ADM-003", hint: "Products, catalog, pricing" },
  { userId: "ADM-004", hint: "Orders, shipping, ops center" },
  { userId: "ADM-005", hint: "CRM, sales team, B2B" },
  { userId: "ADM-007", hint: "Support tickets" },
];
