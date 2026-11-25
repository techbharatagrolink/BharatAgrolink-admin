"use server";

import { revalidatePath } from "next/cache";
import { assertExport, assertPermission } from "@/lib/auth/session";
import { loadStock, writeStock } from "@/lib/services/admin/inventory";
import { EXPORT_MAX_ROWS } from "@/lib/csv";

/*
 * Inventory Management writes. The permission is checked here and again by the API; every stock
 * change goes through the central inventory (row lock, movement ledger, audit log, idempotency key).
 */

const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));
const int = (v) => (v === "" || v == null ? NaN : Number(v));

async function run(path, options) {
  const gate = await assertPermission("inventory", "edit");
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeStock(gate.user, path, options);
  if (result.ok) revalidatePath("/admin/inventory", "layout");
  return result;
}

/** Add / reduce / set one SKU. A note is required for admins (SRS §12.2). */
export async function adjustStockAction(input) {
  const note = str(input?.note);
  if (note.length < 3) return { ok: false, message: "Add a note explaining this change." };
  return run("adjustments", {
    body: {
      balanceId: int(input?.balanceId),
      action: str(input?.action),
      quantity: int(input?.quantity),
      reason: str(input?.reason),
      note,
      idempotencyKey: str(input?.idempotencyKey) || undefined,
    },
  });
}

export async function saveStockSettingsAction(balanceId, input) {
  return run(`items/${int(balanceId)}/settings`, {
    method: "PATCH",
    body: { lowStockThreshold: int(input?.lowStockThreshold), criticalThreshold: int(input?.criticalThreshold), safetyStockQty: int(input?.safetyStockQty) },
  });
}

/** First real count for a listing that has no stock record. */
export async function configureStockAction(input) {
  return run("configure", { body: { sourceType: str(input?.sourceType), sourceId: int(input?.sourceId), quantity: int(input?.quantity) } });
}

export async function bulkStockAction(input) {
  const rows = Array.isArray(input?.rows) ? input.rows.slice(0, 1000) : [];
  return run("bulk", { body: { rows, dryRun: Boolean(input?.dryRun), sellerId: str(input?.sellerId) || undefined, batchId: str(input?.batchId) || undefined } });
}

/** Outcome after the team called the customer of a short paid order. */
export async function resolveShortfallAction(id, input) {
  return run(`shortfalls/${int(id)}/resolve`, { body: { resolution: str(input?.resolution), note: str(input?.note) || undefined } });
}

/**
 * Stock History export: every movement of the tab on screen (stock changes, or the opening balances),
 * newest first, read 200 at a time through the movement feed's `beforeId` cursor. Super admins only.
 */
export async function exportStockMovementsAction(input) {
  const auth = await assertExport();
  if (!auth.ok) return auth;
  const base = input?.view === "opening" ? { type: "OPENING" } : { changesOnly: "1" };
  const LIMIT = 200;
  const rows = [];
  let beforeId;
  while (rows.length < EXPORT_MAX_ROWS) {
    const page = await loadStock(auth.user, "movements", { ...base, limit: LIMIT, beforeId });
    if (page.error) return { ok: false, message: page.error.message || "The stock history could not be loaded." };
    const batch = Array.isArray(page.data) ? page.data : [];
    rows.push(...batch);
    if (batch.length < LIMIT) return { ok: true, rows, truncated: false };
    beforeId = batch.at(-1)?.id;
    if (beforeId == null) break;
  }
  return { ok: true, rows: rows.slice(0, EXPORT_MAX_ROWS), truncated: true };
}
