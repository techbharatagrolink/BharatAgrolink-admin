import "server-only";
import { api, ApiError } from "@/lib/api";
import { validateForm, validateReason } from "@/lib/validation/admin/forms";

/**
 * Platform settings stored in the PHP `settings` table (type / description).
 * SMTP and SMS passwords are write-only: the API returns configured, never the secret.
 */

const text = (label, extra = {}) => ({ name: extra.name, label, type: "text", required: false, maxLength: extra.maxLength ?? 255, ...extra });

export const SETTINGS_SECTIONS = {
  system: {
    title: "System Settings",
    permission: "settings",
    api: "system_settings.php → PUT /api/v1/admin/settings/system",
    fields: [
      text("Store name", { name: "system_name", required: true, maxLength: 150 }),
      text("Application title", { name: "system_title", maxLength: 150 }),
      text("Address", { name: "system_address", required: true, maxLength: 500 }),
      text("Phone", { name: "system_phone", required: true, maxLength: 30 }),
      { name: "system_email", label: "Email", type: "email", required: true },
      text("Nimbuspost phone", { name: "system_other_phone", maxLength: 30 }),
      { name: "system_other_email", label: "Other email", type: "email", required: false },
      text("Language id", { name: "system_language", required: true, maxLength: 20 }),
      text("Currency id (or id-symbol)", { name: "system_currency", required: true, maxLength: 40 }),
      text("Currency symbol", { name: "system_currency_symbol", maxLength: 8 }),
      text("Timezone", { name: "system_timezone", required: true, maxLength: 80 }),
      text("GST / VAT number", { name: "system_gst", maxLength: 30 }),
      { name: "affiliate_commission", label: "Affiliate commission", type: "number", required: false, min: 0, max: 100 },
      { name: "default_shipping_fee", label: "Default shipping fee (₹)", type: "number", required: false, min: 0, max: 100000 },
      text("Footer text", { name: "footer_text", maxLength: 2000 }),
      text("Offers", { name: "offers", maxLength: 4000 }),
      text("Android app link", { name: "android_app_link", maxLength: 500 }),
      text("iOS app link", { name: "ios_app_link", maxLength: 500 }),
      text("Facebook link", { name: "facebook_link", maxLength: 500 }),
      text("Instagram link", { name: "instagram_link", maxLength: 500 }),
      text("Twitter link", { name: "twitter_link", maxLength: 500 }),
      text("YouTube link", { name: "youtube_link", maxLength: 500 }),
      text("LinkedIn link", { name: "linkedin_link", maxLength: 500 }),
    ],
  },
  minimums: {
    title: "Minimum Order & COD",
    permission: "shipping.rules",
    api: "manage_minimum_order.php, manage_minimum_cod.php → PUT /api/v1/admin/settings/minimums",
    fields: [
      { name: "minOrderValue", label: "Minimum order value (₹)", type: "number", required: true, min: 0, max: 1000000 },
      { name: "minCodValue", label: "Minimum COD order (₹)", type: "number", required: true, min: 0, max: 1000000 },
    ],
  },
  smtp: {
    title: "SMTP Settings",
    permission: "settings",
    api: "smtp_settings.php → PUT /api/v1/admin/settings/smtp",
    fields: [
      text("Protocol", { name: "smtp_protocol", required: true, maxLength: 20 }),
      text("SMTP host", { name: "smtp_host", required: true, maxLength: 150 }),
      { name: "smtp_port", label: "Port", type: "number", required: true, min: 1, max: 65535 },
      text("Username", { name: "smtp_user", required: true, maxLength: 150 }),
      { name: "smtp_password", label: "SMTP password (leave blank to keep the saved password)", type: "password", required: false, maxLength: 200 },
    ],
    secrets: [{ field: "smtp_password", label: "SMTP password" }],
  },
  sms: {
    title: "SMS Settings",
    permission: "settings",
    api: "sms_settings.php → PUT /api/v1/admin/settings/sms",
    fields: [
      { name: "active_sms_service", label: "Active SMS service", type: "select", required: true, options: ["soft", "disabled"] },
      text("URL", { name: "soft_url", required: true, maxLength: 500 }),
      text("Sender", { name: "soft_sender", required: true, maxLength: 20 }),
      text("Username", { name: "soft_user", required: true, maxLength: 150 }),
      { name: "soft_password", label: "SMS password (leave blank to keep the saved password)", type: "password", required: false, maxLength: 200 },
    ],
    secrets: [{ field: "soft_password", label: "SMS password" }],
  },
};

function fail(error) {
  const message = error instanceof ApiError ? error.message : "The admin API could not save these settings.";
  const field = error instanceof ApiError ? error.details?.field : undefined;
  return { ok: false, message, fieldErrors: field ? { [field]: message } : undefined };
}

export async function getSettings(section, user) {
  const def = SETTINGS_SECTIONS[section];
  if (!def) return null;
  const { secrets: secretDefs, ...publicDef } = def;
  if (!user?.token) return { ...publicDef, values: {}, secrets: (secretDefs ?? []).map((s) => ({ ...s, env: s.field, configured: false })), error: "Your session has expired. Please log in again." };
  try {
    const { data } = await api(`admin/settings/${section}`, { token: user.token });
    const configured = new Map((data?.secrets ?? []).map((s) => [s.field, s]));
    return {
      ...publicDef,
      values: data?.values ?? {},
      secrets: (secretDefs ?? []).map((s) => ({ ...s, env: s.field, label: configured.get(s.field)?.label || s.label, configured: Boolean(configured.get(s.field)?.configured) })),
    };
  } catch (error) {
    return { ...publicDef, values: {}, secrets: (secretDefs ?? []).map((s) => ({ ...s, env: s.field, configured: false })), error: error instanceof ApiError ? error.message : "Could not load settings." };
  }
}

export async function saveSettings(section, input, rawReason, user) {
  const def = SETTINGS_SECTIONS[section];
  if (!def) return { ok: false, message: "Unknown settings section." };
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  const reason = validateReason(rawReason, true);
  if (!reason.ok) return { ok: false, message: reason.error, fieldErrors: { __reason: reason.error } };
  const checked = validateForm(def.fields, input);
  if (!checked.ok) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: checked.errors };
  const values = { ...checked.values };
  for (const secret of def.secrets ?? []) {
    if (!String(values[secret.field] ?? "").trim()) delete values[secret.field];
  }
  try {
    const { data } = await api(`admin/settings/${section}`, { method: "PUT", token: user.token, body: { values, reason: reason.reason } });
    return { ok: true, message: data?.message || `${def.title} saved.` };
  } catch (error) {
    return fail(error);
  }
}

export async function getIntegrations(user) {
  if (!user?.token) return [];
  try {
    const { data } = await api("admin/settings/integrations", { token: user.token });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getExpenseLimits(user) {
  if (!user?.token) return { caps: [], history: [] };
  try {
    const { data } = await api("admin/finance/expense-limits", { token: user.token });
    return { caps: data?.caps ?? [], history: data?.history ?? [] };
  } catch (error) {
    return { caps: [], history: [], error: error instanceof ApiError ? error.message : "Could not load expense limits." };
  }
}

export async function updateExpenseCap(id, rawCap, rawReason, user) {
  if (!user?.token) return { ok: false, message: "Your session has expired. Please log in again." };
  if (!user.role?.superAdmin) return { ok: false, message: "Only a full admin can change expense caps." };
  try {
    const { data } = await api(`admin/finance/expense-limits/${encodeURIComponent(id)}`, {
      method: "PUT",
      token: user.token,
      body: { maxPercent: Number(rawCap), reason: rawReason },
    });
    return { ok: true, message: data?.message || "Cap updated." };
  } catch (error) {
    return fail(error);
  }
}
