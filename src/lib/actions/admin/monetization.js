"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/lib/auth/session";
import { writeMonetization } from "@/lib/services/admin/monetization";

/*
 * Monetization Center configuration writes (services, placements, packages). The permission is
 * checked here ("add" to create, "edit" to change) and again by the API, which validates every
 * field and writes an audit log row. Paid orders keep their own snapshot, so edits never change them.
 */

const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));
const num = (v) => (v === "" || v == null ? undefined : Number(v));
const bool = (v) => v === true || v === "true" || v === "1" || v === 1;

async function run(action, path, options) {
  const gate = await assertPermission("monetization", action);
  if (!gate.ok) return { ok: false, message: gate.message };
  const result = await writeMonetization(gate.user, path, options);
  if (result.ok) revalidatePath("/admin/monetization", "layout");
  return result;
}

const save = (resource, id, body) => (id ? run("edit", `${resource}/${Number(id)}`, { method: "PATCH", body }) : run("add", resource, { body }));

export async function saveServiceAction(id, input) {
  const body = {
    name: str(input?.name),
    description: str(input?.description),
    desktopWidth: num(input?.desktopWidth),
    desktopHeight: num(input?.desktopHeight),
    mobileRequired: bool(input?.mobileRequired),
    mobileWidth: bool(input?.mobileRequired) ? num(input?.mobileWidth) : null,
    mobileHeight: bool(input?.mobileRequired) ? num(input?.mobileHeight) : null,
    sizeTolerancePct: num(input?.sizeTolerancePct),
    allowedFormats: Array.isArray(input?.allowedFormats) ? input.allowedFormats : undefined,
    maxFileKb: num(input?.maxFileKb),
    terms: str(input?.terms),
    sortOrder: num(input?.sortOrder),
  };
  if (!id) Object.assign(body, { code: str(input?.code), adFormat: str(input?.adFormat), isActive: true });
  return save("services", id, body);
}

export async function savePlacementAction(id, input) {
  const body = {
    name: str(input?.name),
    serviceId: num(input?.serviceId),
    homeSection: str(input?.homeSection),
    maxSlots: num(input?.maxSlots),
    showDesktop: bool(input?.showDesktop),
    showMobile: bool(input?.showMobile),
    priority: num(input?.priority),
    rotation: str(input?.rotation),
    paidPosition: str(input?.paidPosition),
  };
  if (!id) Object.assign(body, { code: str(input?.code), isActive: true });
  return save("placements", id, body);
}

export async function savePackageAction(id, input) {
  return save("packages", id, {
    name: str(input?.name),
    placementId: num(input?.placementId),
    durationDays: num(input?.durationDays),
    price: num(input?.price),
    gstRate: num(input?.gstRate),
    sacCode: str(input?.sacCode),
    terms: str(input?.terms),
    sortOrder: num(input?.sortOrder),
    ...(id ? {} : { isActive: false }),
  });
}

/** Activate / deactivate a service, placement or package. */
export async function setActiveAction(resource, id, isActive) {
  if (!["services", "placements", "packages"].includes(resource)) return { ok: false, message: "Unknown item." };
  return run("edit", `${resource}/${Number(id)}`, { method: "PATCH", body: { isActive: Boolean(isActive) } });
}
