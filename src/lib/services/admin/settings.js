import "server-only";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { validateForm, validateReason } from "@/lib/validation/admin/forms";
import { mockLatency } from "./_query";

/**
 * Platform settings. Planned APIs:
 *   GET/PUT /api/admin/settings/{system|minimums|smtp|sms}
 *   PUT     /api/admin/finance/expense-caps          (full admin only)
 *   GET     /api/admin/settings/integrations          (status only)
 * Secrets (SMTP password, SMS/API keys, gateway secrets) are never stored in or
 * returned by the panel; they live in server environment variables.
 */

export const SETTINGS_SECTIONS = {
  system: {
    title: "System Settings",
    permission: "settings",
    api: "system-settings.php → PUT /api/admin/settings/system",
    fields: [
      { name: "siteName", label: "Marketplace name", type: "text", required: true, maxLength: 80 },
      { name: "supportEmail", label: "Support email", type: "email", required: true },
      { name: "supportPhone", label: "Support phone", type: "text", required: true, pattern: "^[6-9]\\d{9}$", patternMessage: "Enter a 10-digit Indian mobile number." },
      { name: "orderAutoCancelHours", label: "Auto-cancel unconfirmed orders after (hours)", type: "number", required: true, min: 1, max: 168 },
      { name: "returnWindowDays", label: "Default return window (days)", type: "number", required: true, min: 0, max: 30 },
      { name: "payoutCycle", label: "Vendor payout cycle", type: "select", required: true, options: ["Weekly (Monday)", "Fortnightly", "Monthly"] },
      { name: "maintenanceMode", label: "Storefront maintenance mode", type: "select", required: true, options: ["Off", "On"] },
    ],
    defaults: { siteName: "Bharat AgroLink", supportEmail: "support@bharatagrolink.com", supportPhone: "9826000000", orderAutoCancelHours: 24, returnWindowDays: 7, payoutCycle: "Weekly (Monday)", maintenanceMode: "Off" },
  },
  minimums: {
    title: "Minimum Order & COD",
    permission: "shipping.rules",
    api: "manage_minimum_order.php, manage_minimum_cod.php → PUT /api/admin/settings/minimums",
    fields: [
      { name: "minOrderValue", label: "Minimum order value (₹)", type: "number", required: true, min: 0, max: 10000 },
      { name: "minCodValue", label: "Minimum COD order (₹)", type: "number", required: true, min: 0, max: 10000 },
      { name: "maxCodValue", label: "Maximum COD order (₹)", type: "number", required: true, min: 500, max: 200000 },
      { name: "codHandlingFee", label: "COD handling fee (₹)", type: "number", required: true, min: 0, max: 500 },
      { name: "freeShippingAbove", label: "Free shipping above (₹)", type: "number", required: true, min: 0, max: 100000 },
    ],
    defaults: { minOrderValue: 199, minCodValue: 299, maxCodValue: 25000, codHandlingFee: 30, freeShippingAbove: 3000 },
    check: (v) => (v.minCodValue > v.maxCodValue ? { minCodValue: "Minimum COD cannot exceed maximum COD." } : null),
  },
  smtp: {
    title: "SMTP Settings",
    permission: "settings",
    api: "smtp-settings → PUT /api/admin/settings/smtp",
    fields: [
      { name: "host", label: "SMTP host", type: "text", required: true, maxLength: 120, pattern: "^[a-zA-Z0-9.-]+$", patternMessage: "Enter a host name like smtp.example.com." },
      { name: "port", label: "Port", type: "number", required: true, min: 1, max: 65535 },
      { name: "encryption", label: "Encryption", type: "select", required: true, options: ["TLS", "SSL", "None"] },
      { name: "username", label: "Username", type: "text", required: true, maxLength: 120 },
      { name: "fromEmail", label: "From email", type: "email", required: true },
      { name: "fromName", label: "From name", type: "text", required: true, maxLength: 80 },
    ],
    defaults: { host: "smtp.zoho.in", port: 587, encryption: "TLS", username: "noreply@bharatagrolink.com", fromEmail: "noreply@bharatagrolink.com", fromName: "Bharat AgroLink" },
    secrets: [{ env: "SMTP_PASSWORD", label: "SMTP password" }],
  },
  sms: {
    title: "SMS Settings",
    permission: "settings",
    api: "sms-settings → PUT /api/admin/settings/sms",
    fields: [
      { name: "provider", label: "Provider", type: "select", required: true, options: ["MSG91", "Fast2SMS", "Twilio"] },
      { name: "senderId", label: "Sender ID (DLT header)", type: "text", required: true, pattern: "^[A-Z]{6}$", patternMessage: "Sender ID must be 6 capital letters." },
      { name: "dltEntityId", label: "DLT entity ID", type: "text", required: true, pattern: "^\\d{12,19}$", patternMessage: "DLT entity ID is 12–19 digits." },
      { name: "otpTemplateId", label: "OTP template ID", type: "text", required: true, pattern: "^[A-Za-z0-9]{6,30}$", patternMessage: "Template ID is 6–30 letters or digits." },
    ],
    defaults: { provider: "MSG91", senderId: "BAGROL", dltEntityId: "1201160000000000000", otpTemplateId: "64f0b1c2d3e4" },
    secrets: [{ env: "SMS_API_KEY", label: "Provider API key" }],
  },
};

const INTEGRATIONS = [
  { name: "Razorpay", purpose: "Prepaid payments and refunds", env: ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"] },
  { name: "Shiprocket", purpose: "Courier booking, checkout", env: ["SHIPROCKET_EMAIL", "SHIPROCKET_PASSWORD"] },
  { name: "NimbusPost", purpose: "Courier booking and tracking", env: ["NIMBUSPOST_API_KEY"] },
  { name: "Delhivery", purpose: "Courier booking, reverse pickup", env: ["DELHIVERY_TOKEN"] },
  { name: "WhatsApp Cloud API", purpose: "WhatsApp bot and order updates", env: ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_ID"] },
  { name: "VAPI", purpose: "AI voice calls for leads", env: ["VAPI_API_KEY"] },
  { name: "Firebase Cloud Messaging", purpose: "App push notifications", env: ["FCM_SERVICE_ACCOUNT"] },
  { name: "Object storage", purpose: "Invoices, images, payout proofs", env: ["STORAGE_BUCKET", "STORAGE_ACCESS_KEY"] },
  { name: "Backend API", purpose: "PHP admin API base URL", env: ["ADMIN_API_BASE_URL"] },
];

function settingsStore() {
  const s = getStore();
  if (!s.settings) s.settings = Object.fromEntries(Object.entries(SETTINGS_SECTIONS).map(([k, v]) => [k, { ...v.defaults }]));
  return s.settings;
}

const secretStatus = (secrets = []) => secrets.map((x) => ({ ...x, configured: Boolean(process.env[x.env]) }));

export async function getSettings(section) {
  await mockLatency();
  const def = SETTINGS_SECTIONS[section];
  if (!def) return null;
  const { check, defaults, ...publicDef } = def;
  return { ...publicDef, values: { ...settingsStore()[section] }, secrets: secretStatus(def.secrets) };
}

export async function saveSettings(section, input, rawReason, user) {
  const def = SETTINGS_SECTIONS[section];
  if (!def) return { ok: false, message: "Unknown settings section." };
  if (!can(user, def.permission, "edit")) return { ok: false, message: "You do not have permission to change these settings." };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error, fieldErrors: { __reason: reason.error } };
  const result = validateForm(def.fields, input);
  const extra = result.ok && def.check ? def.check(result.values) : null;
  if (!result.ok || extra) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: { ...result.errors, ...extra } };

  await mockLatency(150);
  const store = settingsStore();
  const before = store[section];
  const changed = Object.keys(result.values).filter((k) => String(before[k]) !== String(result.values[k]));
  if (!changed.length) return { ok: false, message: "Nothing changed." };
  store[section] = { ...before, ...result.values };
  appendAudit({
    actorId: user.id,
    actor: user.name,
    module: "Settings",
    action: `Updated ${def.title} (${changed.join(", ")})`,
    entity: section,
    before: Object.fromEntries(changed.map((k) => [k, before[k]])),
    after: Object.fromEntries(changed.map((k) => [k, result.values[k]])),
    reason: reason.reason,
  });
  return { ok: true, message: `${def.title} saved.` };
}

export async function getIntegrations() {
  await mockLatency();
  return INTEGRATIONS.map((i) => ({ name: i.name, purpose: i.purpose, keys: i.env, configured: i.env.every((k) => Boolean(process.env[k])), partial: i.env.some((k) => Boolean(process.env[k])) && !i.env.every((k) => Boolean(process.env[k])) }));
}

/* --------------------------------------------------------- Expense caps */

export async function getExpenseLimits() {
  await mockLatency();
  const s = getStore();
  return {
    caps: s.expenseCaps.map((c) => ({ ...c, over: c.actualPercent > c.capPercent })),
    history: s.auditLog.filter((a) => a.module === "Expense limits").slice(0, 10),
  };
}

export async function updateExpenseCap(id, rawCap, rawReason, user) {
  if (!user.role.superAdmin) return { ok: false, message: "Only a full admin can change expense caps." };
  const s = getStore();
  const cap = s.expenseCaps.find((c) => c.id === id);
  if (!cap) return { ok: false, message: "Unknown expense cap." };
  const value = Number(rawCap);
  if (!Number.isFinite(value) || value <= 0 || value > 50) return { ok: false, message: "Cap must be between 0.1% and 50% of sales.", fieldErrors: { cap: "Enter 0.1–50." } };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error };
  const rounded = Math.round(value * 10) / 10;
  if (rounded === cap.capPercent) return { ok: false, message: "Cap is unchanged." };
  await mockLatency(150);
  const before = cap.capPercent;
  cap.capPercent = rounded;
  appendAudit({ actorId: user.id, actor: user.name, module: "Expense limits", action: `${cap.label} cap ${before}% → ${rounded}%`, entity: id, before: { capPercent: before }, after: { capPercent: rounded }, reason: reason.reason });
  return { ok: true, message: `${cap.label} cap set to ${rounded}%.` };
}
