"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { writeSeo } from "@/lib/services/admin/seo";

/*
 * SEO & AI Command Center writes. The permission is checked here and again by the API.
 */

/** Starts a ChatGPT check of every active prompt; the API runs it in the background. */
export async function runAiCheckAction() {
  const gate = await assertPermission("seo", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeSeo(gate.user, "ai-visibility/run");
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}

/** Starts a website audit (crawl + PageSpeed); the API runs it in the background. */
export async function runAuditAction() {
  const gate = await assertPermission("seo", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeSeo(gate.user, "website-health/run");
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}

/** Saves one setting. The API validates the value and logs who changed what. */
export async function saveSeoSettingAction(key, value) {
  const gate = await assertPermission("seo", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeSeo(gate.user, `settings/${encodeURIComponent(key)}`, { method: "PUT", body: { value } });
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}

/** Adds a prompt to the AI visibility library. */
export async function addSeoPromptAction(input) {
  const gate = await assertPermission("seo", "add");
  if (!gate.ok) return { ok: false, message: gate.message };
  const body = { prompt_text: String(input?.prompt_text ?? "").trim(), intent: input?.intent, language: input?.language };
  const result = await writeSeo(gate.user, "ai-prompts", { body });
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}

/** Switches a prompt on or off. */
export async function toggleSeoPromptAction(id, isActive) {
  const gate = await assertPermission("seo", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeSeo(gate.user, `ai-prompts/${Number(id)}`, { method: "PATCH", body: { isActive: Boolean(isActive) } });
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}
