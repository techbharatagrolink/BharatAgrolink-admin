import "server-only";
import { api, ApiError } from "@/lib/api";
import { getResource } from "@/lib/content/admin/resources";
import { can } from "@/lib/auth/permissions";
import { validateForm, validateReason } from "@/lib/validation/admin/forms";
import { parseListParams } from "./_query";
import { LIVE_RESOURCES } from "./live-catalog";
import { resources as cmsLive } from "./live-fragments/cms-settings";

/**
 * Generic resource service. Lists, exports, row actions and forms call the
 * admin API resource engine. Screens without an endpoint return a clear gap
 * instead of the in-memory demo store.
 */

const MAX_BULK = 200;

function liveSpec(key) {
  return cmsLive[key] ?? LIVE_RESOURCES[key] ?? null;
}

function pageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** pages_custom.php is already served by /admin/custom-pages. Shape it like a resource list. */
async function listCustomPages(searchParams, user) {
  const params = parseListParams(searchParams);
  const { data, meta } = await api("admin/custom-pages", {
    token: user.token,
    query: { page: params.page, limit: params.pageSize, q: params.q || undefined },
  });
  const items = Array.isArray(data) ? data : [];
  const detailed = await Promise.all(
    items.map(async (item) => {
      try {
        const { data: full } = await api(`admin/custom-pages/${item.id}`, { token: user.token });
        return full || item;
      } catch {
        return item;
      }
    }),
  );
  const total = meta?.total ?? detailed.length;
  return {
    rows: detailed.map((row) => ({
      id: row.id,
      title: row.title ?? "",
      slug: row.slug ?? "",
      body: row.content ?? "",
      updatedBy: "",
      updatedAt: row.updatedAt ?? row.createdAt ?? null,
      status: "Published",
    })),
    total,
    page: meta?.page ?? params.page,
    pageSize: params.pageSize,
    pageCount: pageCount(total, params.pageSize),
    tabCounts: null,
  };
}

async function saveCustomPage(id, values, user) {
  const { data: current } = await api(`admin/custom-pages/${encodeURIComponent(id)}`, { token: user.token });
  const { data } = await api(`admin/custom-pages/${encodeURIComponent(id)}`, {
    method: "PUT",
    token: user.token,
    body: {
      title: values.title,
      slug: current.slug,
      content: values.body ?? current.content ?? "",
      metaTitle: current.metaTitle ?? "",
      metaDescription: current.metaDescription ?? "",
      metaKeywords: current.metaKeywords ?? "",
    },
  });
  return data;
}

function listQuery(searchParams) {
  const params = parseListParams(searchParams);
  return {
    page: params.page,
    pageSize: params.pageSize,
    q: params.q || undefined,
    sort: params.sort || undefined,
    from: params.from || undefined,
    to: params.to || undefined,
    ...params.filters,
  };
}

function emptyList(message) {
  return { rows: [], total: 0, page: 1, pageSize: 25, pageCount: 1, tabCounts: null, unavailable: message };
}

function fail(error) {
  const field = error instanceof ApiError ? error.details?.field : undefined;
  const message = error instanceof ApiError ? error.message : "The admin API could not complete that request.";
  return { ok: false, message, fieldErrors: field ? { [field]: message } : undefined };
}

const NOT_CONNECTED = "This screen is not connected to the admin API yet.";

export async function resolveFormOptions(resource, user) {
  const sets = {};
  for (const field of resource.form?.fields ?? []) {
    if (field.optionsFrom === "roles" && user?.token) {
      try {
        const { data } = await api("admin/auth/roles", { token: user.token });
        sets[field.name] = (data || []).map((role) => ({ value: String(role.id), label: role.name }));
      } catch {
        sets[field.name] = [];
      }
    }
  }
  return sets;
}

export async function listResource(key, searchParams, user) {
  const resource = getResource(key);
  if (!resource) throw new Error(`Unknown resource ${key}`);
  const spec = liveSpec(key);
  if (!spec) return emptyList(NOT_CONNECTED);
  if (!user?.token) return emptyList("Your session has expired. Please log in again.");
  if (key === "cms.pages") {
    try {
      return await listCustomPages(searchParams, user);
    } catch (error) {
      return emptyList(error instanceof ApiError ? error.message : "Could not load custom pages.");
    }
  }
  try {
    const { data } = await api(`admin${spec.path}`, { token: user.token, query: listQuery(searchParams) });
    return data;
  } catch (error) {
    return emptyList(error instanceof ApiError ? error.message : "Could not load this list from the admin API.");
  }
}

export async function exportResource(key, searchParams, user) {
  const resource = getResource(key);
  if (!resource?.exportable) return { ok: false, message: "Export is not available for this list." };
  if (!can(user, resource.permission, "view")) return { ok: false, message: "You do not have permission to export this list." };
  const spec = liveSpec(key);
  if (!spec) return { ok: false, message: NOT_CONNECTED };
  try {
    const { data } = await api(`admin${spec.path}/export`, { token: user.token, query: listQuery(searchParams) });
    return { ok: true, rows: data?.rows || [] };
  } catch (error) {
    return fail(error);
  }
}

export async function runResourceAction(key, actionId, ids, user, rawReason, rawValue) {
  const resource = getResource(key);
  if (!resource) return { ok: false, message: "Unknown list." };
  const found = [...(resource.rowActions ?? []), ...(resource.bulkActions ?? [])].find((a) => a.id === actionId && (a.effect || a.assign));
  if (!found) return { ok: false, message: "This action is not available." };
  let action = found;
  if (found.assign) {
    if (!found.assign.options.includes(rawValue)) return { ok: false, message: `Choose a valid option for “${found.assign.label}”.` };
    action = { ...found, label: `${found.assign.label}: ${rawValue}`, effect: { set: { [found.assign.field]: rawValue } } };
  }
  if (!can(user, resource.permission, action.permission ?? "edit")) return { ok: false, message: "You do not have permission to perform this action." };

  const idList = Array.isArray(ids) ? ids.slice(0, MAX_BULK) : [];
  if (!idList.length) return { ok: false, message: "Select at least one row." };

  const needsReason = Boolean(action.confirm?.requireReason);
  const reasonCheck = validateReason(rawReason, needsReason);
  if (!reasonCheck.ok) return { ok: false, message: reasonCheck.error };

  const spec = liveSpec(key);
  if (!spec) return { ok: false, message: NOT_CONNECTED };
  try {
    const { data } = await api(`admin${spec.path}/actions/${encodeURIComponent(actionId)}`, {
      method: "POST",
      token: user.token,
      body: { ids: idList, reason: reasonCheck.reason || undefined, value: rawValue || undefined },
    });
    return { ok: true, message: data?.message || `${action.label} completed.` };
  } catch (error) {
    return fail(error);
  }
}

/**
 * Create (id = null) or update a record through the resource form.
 * The API validates the values again and writes the audit log.
 */
export async function saveResourceRecord(key, id, input, user, rawReason) {
  const resource = getResource(key);
  if (!resource?.form) return { ok: false, message: "This list cannot be edited." };
  const isNew = id == null || id === "";
  const permissionAction = isNew ? "add" : "edit";
  if (!can(user, resource.permission, permissionAction)) return { ok: false, message: "You do not have permission to perform this action." };

  const reasonCheck = validateReason(rawReason, Boolean(resource.form.requireReason));
  if (!reasonCheck.ok) return { ok: false, message: reasonCheck.error, fieldErrors: { __reason: reasonCheck.error } };

  const spec = liveSpec(key);
  if (!spec) return { ok: false, message: NOT_CONNECTED };

  const optionSets = await resolveFormOptions(resource, user);
  const fields = resource.form.fields;
  const { ok, values, errors } = validateForm(fields, input, optionSets);
  if (!ok) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errors };

  const payload = { ...values };
  if (isNew && payload.password === "") delete payload.password;

  if (key === "cms.pages") {
    if (isNew) return { ok: false, message: "New custom pages are added from the existing custom-pages API. This screen edits pages that already exist." };
    try {
      const data = await saveCustomPage(id, payload, user);
      return { ok: true, message: `${resource.title}: changes saved.`, id: data?.id ?? id };
    } catch (error) {
      return fail(error);
    }
  }

  try {
    const { data } = await api(isNew ? `admin${spec.path}` : `admin${spec.path}/${encodeURIComponent(id)}`, {
      method: isNew ? "POST" : "PUT",
      token: user.token,
      body: { values: payload, reason: reasonCheck.reason || undefined },
    });
    return { ok: true, message: isNew ? `${resource.title}: record created.` : `${resource.title}: changes saved.`, id: data?.id ?? id };
  } catch (error) {
    return fail(error);
  }
}
