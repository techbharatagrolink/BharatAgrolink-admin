import "server-only";
import { getStore } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { maskAccount, maskEmail } from "@/lib/format";
import { mockLatency, countBy, sum } from "./_query";

/**
 * Vendor and customer 360 views. Planned APIs:
 *   GET /api/admin/vendors/{id}
 *   GET /api/admin/customers/{id}
 * Bank and identity numbers are masked unless the viewer has finance access;
 * the full values never leave the server for other roles.
 */

export async function getVendor(id, user) {
  await mockLatency();
  const s = getStore();
  const v = s.vendors.find((x) => x.id === id);
  if (!v) return null;
  const lines = s.orderItems.filter((l) => l.vendorId === id);
  const finance = can(user, "payouts");
  return {
    vendor: {
      ...v,
      bankAccount: finance ? v.bankAccount : maskAccount(v.bankAccount),
      pan: finance ? v.pan : `${v.pan.slice(0, 3)}XXXX${v.pan.slice(-2)}`,
      email: maskEmail(v.email),
    },
    statusMix: Object.entries(countBy(lines, "status")).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    products: s.products.filter((p) => p.vendorId === id).slice(0, 8).map((p) => ({ id: p.id, name: p.name, display: p.display, stock: p.stock, status: p.status })),
    productCount: s.products.filter((p) => p.vendorId === id).length,
    recentLines: lines.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8).map((l) => ({ id: l.id, orderId: l.orderId, product: l.productName, price: l.price, status: l.status, createdAt: l.createdAt })),
    payouts: finance ? s.payouts.filter((p) => p.vendorId === id).slice(0, 6) : [],
    payoutTotals: finance ? { paid: sum(s.payouts.filter((p) => p.vendorId === id && p.status === "Paid"), "bsa"), pending: sum(s.payouts.filter((p) => p.vendorId === id && p.status !== "Paid"), "bsa") } : null,
    tickets: s.tickets.filter((t) => t.userType === "vendor" && t.user === v.name).slice(0, 5),
    showFinance: finance,
  };
}

export async function getCustomer(id) {
  await mockLatency();
  const s = getStore();
  const c = s.customers.find((x) => x.id === id);
  if (!c) return null;
  const orders = s.orders.filter((o) => o.customerId === id);
  return {
    customer: { ...c, email: c.email ? maskEmail(c.email) : null },
    orders: orders.slice(0, 10).map((o) => ({ id: o.id, total: o.total, status: o.status, paymentMode: o.paymentMode, createdAt: o.createdAt })),
    returns: s.returns.filter((r) => r.customerId === id).slice(0, 6),
    wallet: s.walletWithdrawals.filter((w) => w.customerId === id),
    tickets: s.tickets.filter((t) => t.userType === "customer" && t.user === c.name).slice(0, 5),
    reviews: s.reviews.filter((r) => r.customer === c.name).slice(0, 5),
    stats: {
      delivered: orders.filter((o) => o.status === "Delivered").length,
      rto: orders.filter((o) => String(o.status).startsWith("RTO")).length,
      cod: orders.filter((o) => o.paymentMode === "COD").length,
    },
  };
}
