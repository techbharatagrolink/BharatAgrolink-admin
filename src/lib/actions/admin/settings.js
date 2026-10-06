"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { saveSettings, SETTINGS_SECTIONS, updateExpenseCap } from "@/lib/services/admin/settings";
import { updateRolePermissions } from "@/lib/services/admin/roles";

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

const SECTION_PATHS = { system: "/admin/settings", minimums: "/admin/shipping/minimums", smtp: "/admin/settings/smtp", sms: "/admin/settings/sms" };

export async function saveSettingsAction(section, values, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const def = SETTINGS_SECTIONS[str(section)];
  if (!def) return { ok: false, message: "Unknown settings section." };
  const clean = Object.fromEntries(def.fields.map((f) => [f.name, str(values?.[f.name])]));
  const result = await saveSettings(str(section), clean, str(reason), user);
  if (result.ok) revalidatePath(SECTION_PATHS[section]);
  return result;
}

export async function updateExpenseCapAction(id, cap, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const result = await updateExpenseCap(str(id), str(cap), str(reason), user);
  if (result.ok) {
    revalidatePath("/admin/finance/expense-limits");
    revalidatePath("/admin/finance");
  }
  return result;
}

export async function updateRolePermissionsAction(id, permissions, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const clean = {};
  if (permissions && typeof permissions === "object") {
    for (const [key, actions] of Object.entries(permissions).slice(0, 500)) {
      if (Array.isArray(actions)) clean[str(key)] = actions.slice(0, 4).map(str);
    }
  }
  const result = await updateRolePermissions(str(id), clean, str(reason), user);
  if (result.ok) revalidatePath(`/admin/roles/${id}`);
  return result;
}
