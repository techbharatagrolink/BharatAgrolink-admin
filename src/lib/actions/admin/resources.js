"use server";

import { getResource } from "@/lib/content/admin/resources";
import { getCurrentAdmin } from "@/lib/auth/session";
import { exportResource, runResourceAction, saveResourceRecord } from "@/lib/services/admin/resources";

const expired = { ok: false, message: "Your session has expired. Please log in again." };

function cleanKey(key) {
  return typeof key === "string" && getResource(key) ? key : null;
}

function cleanParams(params) {
  if (!params || typeof params !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof k === "string" && k.length <= 40 && (typeof v === "string" || typeof v === "number")) out[k] = String(v).slice(0, 120);
  }
  return out;
}

export async function resourceActionAction(key, actionId, ids, reason, value) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const resourceKey = cleanKey(key);
  if (!resourceKey || typeof actionId !== "string") return { ok: false, message: "Invalid request." };
  const idList = Array.isArray(ids) ? ids.filter((id) => typeof id === "string" || typeof id === "number") : [];
  return runResourceAction(resourceKey, actionId, idList, user, typeof reason === "string" ? reason : "", typeof value === "string" ? value : "");
}

export async function resourceExportAction(key, params) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const resourceKey = cleanKey(key);
  if (!resourceKey) return { ok: false, message: "Invalid request." };
  return exportResource(resourceKey, cleanParams(params), user);
}

export async function resourceSaveAction(key, id, input, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const resourceKey = cleanKey(key);
  if (!resourceKey || !input || typeof input !== "object") return { ok: false, message: "Invalid request." };
  const recordId = typeof id === "string" || typeof id === "number" ? id : null;
  return saveResourceRecord(resourceKey, recordId, input, user, typeof reason === "string" ? reason : "");
}
