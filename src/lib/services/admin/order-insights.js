import "server-only";
import { api } from "@/lib/api";

/**
 * Order insights. Live API:
 *   GET /api/v1/admin/orders?paymentMode=cod|prepaid|partial (meta.total only)
 *   GET /api/v1/admin/orders/rto-summary
 *   GET /api/v1/admin/orders/delivery-summary
 *   GET /api/v1/admin/orders?status=RTO (latest RTO orders)
 *   GET /api/v1/admin/marketing (repeat rate and order sources, last 30 days)
 * Each block loads on its own so one failing endpoint does not hide the rest.
 */

export const PAYMENT_MODES = [
  { mode: "cod", label: "COD" },
  { mode: "prepaid", label: "Prepaid" },
  { mode: "partial", label: "Partial" },
];

export const RTO_STATUSES = ["RTO", "RTO Delivered", "RTO/Exeption"];

const settle = (promise) => promise.then((data) => ({ data }), (error) => ({ error }));

async function paymentMix(token) {
  const results = await Promise.all(
    PAYMENT_MODES.map((m) => api("admin/orders", { token, query: { paymentMode: m.mode, limit: 1, page: 1 } })),
  );
  const rows = PAYMENT_MODES.map((m, i) => ({ ...m, orders: results[i].meta?.total ?? 0 }));
  const total = rows.reduce((sum, r) => sum + r.orders, 0);
  return { total, rows: rows.map((r) => ({ ...r, pct: total ? Math.round((r.orders / total) * 1000) / 10 : 0 })) };
}

async function rtoAnalysis(token) {
  const [summary, list, all] = await Promise.all([
    api("admin/orders/rto-summary", { token }),
    api("admin/orders", { token, query: { status: "RTO", limit: 20, page: 1, sort: "created", dir: "desc" } }),
    api("admin/orders", { token, query: { limit: 1, page: 1 } }),
  ]);
  const s = summary.data || {};
  const counts = new Map((s.byStatus || []).map((r) => [r.status, r.orders]));
  const totalOrders = all.meta?.total ?? 0;
  return {
    orders: s.orders ?? 0,
    rate: totalOrders ? Math.round(((s.orders ?? 0) / totalOrders) * 1000) / 10 : 0,
    byStatus: RTO_STATUSES.map((status) => ({ label: status, value: counts.get(status) || 0 })),
    byResponsible: (s.byResponsible || []).map((r) => ({ label: r.responsible, value: r.orders })),
    recent: (list.data || []).map((o) => ({
      id: o.orderId ?? o.id,
      customer: typeof o.customer === "string" ? o.customer : o.customer?.name || "—",
      createdAt: o.createdAt,
      amount: o.totalAmount ?? o.amount ?? 0,
      payment: typeof o.payment === "string" ? o.payment : o.payment?.mode || "—",
      status: o.status || "—",
      responsible: o.responsible || "—",
    })),
  };
}

async function retention(token) {
  const { data } = await api("admin/marketing", { token });
  return {
    period: data?.period ?? null,
    orders: data?.orders ?? 0,
    repeatOrders: data?.repeatOrders ?? 0,
    repeatCustomerRate: data?.repeatCustomerRate ?? 0,
    sources: (data?.sources || []).map((r) => ({ label: r.source || "Unknown", value: r.orders })),
  };
}

export async function getOrderInsights(user) {
  const token = user.token;
  const [payments, rto, delivery, repeat] = await Promise.all([
    settle(paymentMix(token)),
    settle(rtoAnalysis(token)),
    settle(api("admin/orders/delivery-summary", { token }).then((r) => r.data)),
    settle(retention(token)),
  ]);
  return { payments, rto, delivery, repeat };
}
