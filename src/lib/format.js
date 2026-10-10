const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export function formatINR(value, { compact = false } = {}) {
  if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
  return (compact ? inrCompactFormatter : inrFormatter).format(Number(value));
}

export function formatNumber(value) {
  if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
  return numberFormatter.format(Number(value));
}

export function formatPercent(value, digits = 1) {
  if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toFixed(digits)}%`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

const phpDateParts = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Kolkata",
});

/** PHP date() for the tokens d M Y H i a (IST), so ported screens print dates as the PHP page did. */
export function formatPhpDate(value, pattern) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const p = Object.fromEntries(phpDateParts.formatToParts(date).map(({ type, value: v }) => [type, v]));
  const tokens = { d: p.day, M: p.month, Y: p.year, H: p.hour, i: p.minute, a: Number(p.hour) < 12 ? "am" : "pm" };
  return pattern.replace(/[dMYHia]/g, (c) => tokens[c]);
}

export function formatRelative(value, now = Date.now()) {
  if (!value) return "—";
  const diff = Math.round((new Date(value).getTime() - now) / 60000);
  const abs = Math.abs(diff);
  const suffix = diff < 0 ? "ago" : "from now";
  if (abs < 1) return "just now";
  if (abs < 60) return `${abs} min ${suffix}`;
  if (abs < 60 * 24) return `${Math.round(abs / 60)} h ${suffix}`;
  return `${Math.round(abs / 1440)} d ${suffix}`;
}

export function maskMobile(value) {
  if (!value) return "—";
  const digits = String(value).replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  return `${"•".repeat(Math.max(digits.length - 4, 2))}${digits.slice(-4)}`;
}

export function maskEmail(value) {
  if (!value || !String(value).includes("@")) return "—";
  const [name, domain] = String(value).split("@");
  return `${name.slice(0, 2)}${"•".repeat(Math.max(name.length - 2, 2))}@${domain}`;
}

export function maskAccount(value) {
  if (!value) return "—";
  const str = String(value);
  return `•••• ${str.slice(-4)}`;
}

export function inr(value) {
  return formatINR(value);
}

export function formatWhen(value) {
  return formatDateTime(value);
}

export function errorMessage(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  return error.message || "Something went wrong.";
}

export function localIso(date) {
  const value = date instanceof Date ? date : new Date(date);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

export function statusVariant(status) {
  const value = String(status || "").toLowerCase();
  if (/(deliver|active|paid|verified|completed|resolved|success)/.test(value)) return "default";
  if (/(rto|cancel|reject|fail|refund)/.test(value)) return "destructive";
  if (/(pending|partial|progress|hold)/.test(value)) return "secondary";
  return "outline";
}

export function presentOrder(order) {
  const lines = Array.isArray(order?.items) ? order.items : [];
  const tracked = lines.find((line) => line?.trackingUrl) || lines.find((line) => line?.courier) || lines[0] || {};
  const customer = order?.customer;
  const name = typeof customer === "string" ? customer : customer?.name;
  const invoices = [...new Set(lines.map((line) => line?.invoiceNumber).filter(Boolean))];
  const pickup = lines.map((line) => String(line?.pickupType || "").toLowerCase());
  const shipping = !lines.length
    ? "—"
    : pickup.some((type) => type === "self")
      ? "Self Shipping"
      : "Ship By Bharat Agrolink";
  return {
    id: order?.orderId ?? order?.id ?? "—",
    createdAt: formatDateTime(order?.createdAt),
    customer: name || "—",
    courier: tracked.courier || tracked.carrier || "—",
    invoice: invoices.join(", ") || "—",
    items: order?.itemCount ?? lines.length,
    shipping,
    payment: typeof order?.payment === "string" ? order.payment : order?.payment?.mode || "—",
    status: order?.status || "—",
    amount: formatINR(order?.totalAmount ?? order?.amount),
    responsible: order?.responsible || "—",
    trackingUrl: tracked.trackingUrl || "",
  };
}

export function initials(name) {
  if (!name) return "?";
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
