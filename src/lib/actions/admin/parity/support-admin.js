"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { createStaff, saveChatReview, saveScripts } from "@/lib/services/admin/parity/support-admin";

const SCRIPT_KEYS = ["google_script", "facebook_pixel", "tag_manager"];
const STAFF_FIELDS = ["roleId", "experienceLevel", "fullName", "address", "phone", "email", "password"];
const EXPERIENCE_LEVELS = ["", "junior", "intermediate", "senior"];

export async function saveChatReviewAction(sessionId, conversation, feedback) {
  const gate = await assertPermission("support.chatLogs", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const id = typeof sessionId === "string" ? sessionId.trim() : "";
  if (!id || id.length > 100) return { ok: false, message: "Invalid session ID" };
  const text = typeof feedback === "string" ? feedback : "";
  if (text.length > 65535) return { ok: false, message: "Feedback is too long." };
  const result = await saveChatReview(id, { conversation: Boolean(conversation), feedback: text }, gate.user);
  if (result.ok) revalidatePath("/admin/support/chat-logs");
  return result;
}

export async function createStaffAction(input) {
  const gate = await assertPermission("users.add", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const values = {};
  for (const key of STAFF_FIELDS) values[key] = typeof input?.[key] === "string" ? input[key] : "";
  if (!EXPERIENCE_LEVELS.includes(values.experienceLevel)) return { ok: false, message: "Choose a valid experience level.", fieldErrors: { experienceLevel: "Choose a valid experience level." } };
  if (!/^\d+$/.test(values.roleId)) return { ok: false, message: "Please select user role", fieldErrors: { roleId: "Please select user role" } };
  const result = await createStaff({ ...values, roleId: Number(values.roleId) }, gate.user);
  if (result.ok) revalidatePath("/admin/users");
  return result;
}

export async function saveScriptsAction(input) {
  const gate = await assertPermission("settings.scripts", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const values = {};
  for (const key of SCRIPT_KEYS) {
    const value = typeof input?.[key] === "string" ? input[key] : "";
    if (value.length > 60000) return { ok: false, message: "Script is too long (60,000 characters max)." };
    values[key] = value;
  }
  const result = await saveScripts(values, gate.user);
  if (result.ok) revalidatePath("/admin/settings/scripts");
  return result;
}
