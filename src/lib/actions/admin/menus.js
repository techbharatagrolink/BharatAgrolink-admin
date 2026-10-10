"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { createMenu, deleteMenu, moveMenu, updateMenu } from "@/lib/services/admin/roles";

/*
 * Menu Master writes (admin_menus). The API re-checks menu-master.php grants
 * and writes the audit log. The whole admin layout is revalidated so the
 * sidebar and breadcrumbs pick up new names straight away.
 */

const expired = { ok: false, message: "Your session has expired. Please log in again." };
const str = (v, max) => (typeof v === "string" ? v : v == null ? "" : String(v)).trim().slice(0, max);
const id = (v) => (Number.isInteger(Number(v)) && Number(v) >= 0 ? Number(v) : null);

function fields(input) {
  const out = {};
  if (input?.name !== undefined) out.name = str(input.name, 150);
  if (input?.link !== undefined) out.link = str(input.link, 255);
  if (input?.icon !== undefined) out.icon = str(input.icon, 80);
  if (input?.status !== undefined) out.status = Number(input.status) === 1 ? 1 : 0;
  if (input?.parentId !== undefined && id(input.parentId) !== null) out.parentId = id(input.parentId);
  return out;
}

function done(result, message) {
  if (!result.ok) return result;
  revalidatePath("/admin", "layout");
  return { ok: true, message };
}

export async function createMenuAction(input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  const body = fields(input);
  if (!body.name) return { ok: false, message: "Menu name is required." };
  const result = await createMenu({ ...body, parentId: body.parentId ?? 0 }, user);
  return done(result, `“${body.name}” added.`);
}

export async function updateMenuAction(menuId, input) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (id(menuId) === null) return { ok: false, message: "Unknown menu." };
  const body = fields(input);
  if (body.name !== undefined && !body.name) return { ok: false, message: "Menu name is required." };
  const result = await updateMenu(id(menuId), body, user);
  const message = body.status !== undefined && Object.keys(body).length === 1 ? (body.status ? `“${result.data?.name}” is visible again.` : `“${result.data?.name}” is hidden.`) : `“${result.data?.name}” saved.`;
  return done(result, message);
}

export async function moveMenuAction(menuId, direction, visibleOnly = false) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (id(menuId) === null || !["up", "down"].includes(direction)) return { ok: false, message: "Unknown move." };
  return done(await moveMenu(id(menuId), direction, visibleOnly === true, user), "Order saved.");
}

export async function deleteMenuAction(menuId, reason) {
  const user = await getCurrentAdmin();
  if (!user) return expired;
  if (id(menuId) === null) return { ok: false, message: "Unknown menu." };
  const result = await deleteMenu(id(menuId), str(reason, 500), user);
  const count = result.data?.deleted?.length ?? 0;
  return done(result, `“${result.data?.name}” deleted${count > 1 ? ` with ${count - 1} entr${count === 2 ? "y" : "ies"} under it` : ""}.`);
}
