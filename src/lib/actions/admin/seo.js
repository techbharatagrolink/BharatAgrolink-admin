"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { loadSeo, writeSeo } from "@/lib/services/admin/seo";

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

/* ---------- Tasks & milestones ---------- */

async function seoWrite(action, path, options) {
  const gate = await assertPermission("seo", action);
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeSeo(gate.user, path, options);
  if (result.ok) revalidatePath("/admin/seo", "layout");
  return result;
}

const orNull = (v) => (v === "" || v == null ? null : v);

/** Creates a task (by hand or from a Website Health issue). */
export async function createSeoTaskAction(input) {
  return seoWrite("add", "tasks", {
    body: {
      title: String(input?.title ?? "").trim(),
      description: String(input?.description ?? "").trim(),
      module: input?.module || "other",
      ownerId: orNull(input?.ownerId),
      priority: input?.priority || "MEDIUM",
      dueDate: orNull(input?.dueDate),
      milestoneId: orNull(input?.milestoneId),
      sourceType: input?.sourceType || "manual",
      sourceId: orNull(input?.sourceId),
    },
  });
}

/** Updates a task; only the fields sent are changed. */
export async function updateSeoTaskAction(id, patch) {
  const body = {};
  for (const key of ["title", "description", "module", "priority", "status", "note"]) if (patch?.[key] !== undefined) body[key] = patch[key];
  for (const key of ["ownerId", "dueDate", "milestoneId", "evidence"]) if (patch?.[key] !== undefined) body[key] = orNull(patch[key]);
  return seoWrite("edit", `tasks/${Number(id)}`, { method: "PATCH", body });
}

/** One task with its history, for the edit dialog. */
export async function loadSeoTaskAction(id) {
  const gate = await assertPermission("seo", "view");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await loadSeo(gate.user, `tasks/${Number(id)}`);
  return result.error ? { ok: false, message: result.error.message } : { ok: true, data: result.data };
}

export async function saveSeoMilestoneAction(id, input) {
  const body = {
    title: String(input?.title ?? "").trim(),
    description: orNull(input?.description),
    completionCriteria: orNull(input?.completionCriteria),
    ownerId: orNull(input?.ownerId),
    targetDate: orNull(input?.targetDate),
    status: input?.status || "PENDING",
    sortOrder: input?.sortOrder === "" || input?.sortOrder == null ? undefined : Number(input.sortOrder),
  };
  return id ? seoWrite("edit", `milestones/${Number(id)}`, { method: "PATCH", body }) : seoWrite("add", "milestones", { body });
}

/** Runs the product data check now (a few seconds; database only). */
export async function runProductCheckAction() {
  return seoWrite("edit", "product-quality/run");
}

/** Recalculates today's readiness snapshot from the latest data. */
export async function recalcReadinessAction() {
  return seoWrite("edit", "readiness/recalculate");
}
