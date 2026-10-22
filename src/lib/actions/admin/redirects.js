"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
  checkRedirect,
  createRedirect,
  deleteAllRedirects,
  deleteRedirect,
  importRedirects,
  previewRedirectImport,
  redirectLogs,
  setRedirectActive,
  testRedirect,
  updateRedirect,
} from "@/lib/services/admin/redirects";

const PATH = "/admin/cms/redirects";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const expired = { ok: false, message: "Your session has expired. Please log in again." };
const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const ruleId = (id) => (Number.isInteger(Number(id)) && Number(id) > 0 ? Number(id) : null);

function refresh(result) {
  if (result.ok) revalidatePath(PATH);
  return result;
}

async function withAdmin(fn) {
  const user = await getCurrentAdmin();
  return user ? fn(user) : expired;
}

function ruleInput(input) {
  return {
    sourceUrl: text(input?.sourceUrl, 2000),
    targetUrl: text(input?.targetUrl, 2000),
    statusCode: Number(input?.statusCode) || 301,
    keepQueryParams: Boolean(input?.keepQueryParams),
    overrideRoute: Boolean(input?.overrideRoute),
    isActive: input?.isActive !== false,
    notes: text(input?.notes, 255),
  };
}

/** Creates a rule, or updates rule `id` when given. */
export async function saveRedirectAction(id, input) {
  return withAdmin(async (user) => {
    const body = ruleInput(input);
    if (!body.sourceUrl || !body.targetUrl) return { ok: false, message: "Both the source URL and the destination are required." };
    const existing = id == null ? null : ruleId(id);
    if (id != null && !existing) return { ok: false, message: "Unknown redirect rule." };
    return refresh(existing ? await updateRedirect(existing, body, user) : await createRedirect(body, user));
  });
}

export async function setRedirectActiveAction(id, isActive) {
  return withAdmin(async (user) => (ruleId(id) ? refresh(await setRedirectActive(ruleId(id), Boolean(isActive), user)) : { ok: false, message: "Unknown redirect rule." }));
}

export async function deleteRedirectAction(id) {
  return withAdmin(async (user) => (ruleId(id) ? refresh(await deleteRedirect(ruleId(id), user)) : { ok: false, message: "Unknown redirect rule." }));
}

export async function deleteAllRedirectsAction(confirm) {
  return withAdmin(async (user) => refresh(await deleteAllRedirects(text(confirm, 50), user)));
}

export async function checkRedirectAction(input) {
  return withAdmin((user) => checkRedirect({ sourceUrl: text(input?.sourceUrl, 2000), targetUrl: text(input?.targetUrl, 2000), excludeId: ruleId(input?.excludeId) ?? undefined }, user));
}

export async function testRedirectAction(url) {
  return withAdmin(async (user) => {
    const value = text(url, 2000);
    return value ? testRedirect(value, user) : { ok: false, message: "Enter a URL or path to test." };
  });
}

export async function redirectLogsAction() {
  return withAdmin((user) => redirectLogs(user));
}

/** Only the file (and the update flag) are passed on to the API. */
function importForm(formData) {
  const file = formData?.get?.("file");
  if (!file || typeof file === "string" || !file.size) return { error: "Choose an .xlsx or .csv file first." };
  if (file.size > MAX_FILE_BYTES) return { error: "The file must be 5 MB or smaller." };
  if (!/\.(xlsx|csv)$/i.test(file.name ?? "")) return { error: "Unsupported file type. Please upload .xlsx or .csv." };
  const out = new FormData();
  out.append("file", file, file.name);
  if (formData.get("updateExisting") === "1") out.append("updateExisting", "1");
  return { form: out };
}

export async function previewRedirectImportAction(formData) {
  return withAdmin(async (user) => {
    const { form, error } = importForm(formData);
    return error ? { ok: false, message: error } : previewRedirectImport(form, user);
  });
}

export async function importRedirectsAction(formData) {
  return withAdmin(async (user) => {
    const { form, error } = importForm(formData);
    return error ? { ok: false, message: error } : refresh(await importRedirects(form, user));
  });
}
