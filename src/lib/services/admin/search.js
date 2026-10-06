import "server-only";
import { getStore } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { mockLatency } from "./_query";

/**
 * Global search. Planned API: GET /api/admin/search?q=
 * Each group is returned only if the user can view that module, and "own"
 * roles only see their own leads/buyers. Max 6 hits per group.
 */

const LIMIT = 6;

export async function globalSearch(rawQuery, user) {
  const q = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 80) : "";
  if (q.length < 2) return { q, groups: [], total: 0 };
  await mockLatency();
  const s = getStore();
  const needle = q.toLowerCase();
  const digits = q.replace(/\D/g, "");
  const has = (...values) => values.some((v) => v != null && String(v).toLowerCase().includes(needle));
  const own = user.role.scope === "own" && !user.role.superAdmin;

  const groups = [
    can(user, "orders") && {
      key: "orders",
      label: "Orders",
      href: `/admin/orders?q=${encodeURIComponent(q)}`,
      hits: s.orders
        .filter((o) => has(o.id, o.customer, o.platformInvoice) || (digits.length >= 6 && o.mobile?.includes(digits)) || s.orderItems.some((l) => l.orderId === o.id && has(l.awb, l.sellerInvoice)))
        .slice(0, LIMIT)
        .map((o) => ({ id: o.id, title: o.id, subtitle: `${o.customer} · ${o.status}`, href: `/admin/orders/${o.id}` })),
    },
    can(user, "products") && {
      key: "products",
      label: "Products",
      href: `/admin/products?q=${encodeURIComponent(q)}`,
      hits: s.products.filter((p) => has(p.id, p.name, p.sku, p.brand)).slice(0, LIMIT).map((p) => ({ id: p.id, title: p.name, subtitle: `${p.sku} · ${p.vendor} · stock ${p.stock}`, href: `/admin/products/${p.id}` })),
    },
    can(user, "vendors") && {
      key: "vendors",
      label: "Vendors",
      href: `/admin/vendors?q=${encodeURIComponent(q)}`,
      hits: s.vendors.filter((v) => has(v.id, v.name, v.owner, v.gstin, v.city)).slice(0, LIMIT).map((v) => ({ id: v.id, title: v.name, subtitle: `${v.city} · ${v.status}`, href: `/admin/vendors/${v.id}` })),
    },
    can(user, "customers") && {
      key: "customers",
      label: "Customers",
      href: `/admin/customers?q=${encodeURIComponent(q)}`,
      hits: s.customers
        .filter((c) => has(c.id, c.name, c.city) || (digits.length >= 6 && c.mobile?.includes(digits)))
        .slice(0, LIMIT)
        .map((c) => ({ id: c.id, title: c.name, subtitle: `${c.city} · ${c.orders} orders`, href: `/admin/customers/${c.id}` })),
    },
    can(user, "crm.leads") && {
      key: "leads",
      label: "Leads",
      href: `/admin/crm/leads?q=${encodeURIComponent(q)}`,
      hits: s.leads
        .filter((l) => (!own || l.assignedTo === user.name) && (has(l.id, l.name, l.city, l.crop) || (digits.length >= 6 && l.mobile?.includes(digits))))
        .slice(0, LIMIT)
        .map((l) => ({ id: l.id, title: l.name, subtitle: `${l.crop} · ${l.status} · ${l.assignedTo}`, href: `/admin/crm/leads/${l.id}` })),
    },
    can(user, "b2b.buyers") && {
      key: "buyers",
      label: "B2B buyers",
      href: `/admin/b2b/buyers?q=${encodeURIComponent(q)}`,
      hits: s.b2bBuyers.filter((b) => (!own || b.owner === user.name) && has(b.id, b.firm, b.contact, b.gstin)).slice(0, LIMIT).map((b) => ({ id: b.id, title: b.firm, subtitle: `${b.type} · ${b.district}`, href: `/admin/b2b/buyers/${b.id}` })),
    },
    can(user, "support") && {
      key: "tickets",
      label: "Tickets",
      href: `/admin/support?q=${encodeURIComponent(q)}`,
      hits: s.tickets.filter((t) => has(t.id, t.subject, t.user, t.orderId)).slice(0, LIMIT).map((t) => ({ id: t.id, title: t.subject, subtitle: `${t.id} · ${t.user} · ${t.status}`, href: `/admin/support/${t.id}` })),
    },
    can(user, "returns") && {
      key: "returns",
      label: "Returns",
      href: `/admin/returns?q=${encodeURIComponent(q)}`,
      hits: s.returns.filter((r) => has(r.id, r.orderId, r.customer, r.product)).slice(0, LIMIT).map((r) => ({ id: r.id, title: r.id, subtitle: `${r.product} · ${r.status}`, href: `/admin/returns/${r.id}` })),
    },
    can(user, "payouts") && {
      key: "payouts",
      label: "Payouts",
      href: `/admin/payouts?q=${encodeURIComponent(q)}`,
      hits: s.payouts.filter((p) => has(p.id, p.vendor, p.transactionId)).slice(0, LIMIT).map((p) => ({ id: p.id, title: p.id, subtitle: `${p.vendor} · ${p.cycle} · ${p.status}`, href: `/admin/payouts/${p.id}` })),
    },
  ].filter((g) => g && g.hits.length);

  return { q, groups, total: groups.reduce((a, g) => a + g.hits.length, 0) };
}
