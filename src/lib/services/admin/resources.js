import "server-only";
import { getResource } from "@/lib/content/admin/resources";
import { getStore, appendAudit } from "@/lib/mock/admin/store";
import { can } from "@/lib/auth/permissions";
import { validateForm, validateReason } from "@/lib/validation/admin/forms";
import { mockLatency, parseListParams, queryRows, countBy } from "./_query";

/**
 * Generic resource service. Each resource config names the planned API
 * endpoint (`resource.api`). Until those endpoints exist, reads and writes go
 * to the in-memory demo store. Every mutation re-checks permission, scopes
 * rows to what the user may see, validates input and writes an audit entry.
 */

const MAX_BULK = 200;
const MAX_EXPORT = 5000;

function moduleName(key) {
  const head = key.split(".")[0];
  return (
    {
      catalog: "Catalog", pricing: "Pricing", orders: "Orders", shipping: "Shipping", returns: "Returns", payouts: "Payouts",
      vendors: "Vendors", finance: "Finance", customers: "Customers", crm: "CRM", sales: "Sales", b2b: "B2B", bulk: "B2B",
      operations: "Operations", support: "Support", cms: "CMS", users: "Users", audit: "Audit", masters: "Masters", settings: "Settings",
    }[head] ?? head
  );
}

function sameId(a, b) {
  return String(a) === String(b);
}

/** Rows this user is allowed to see for a resource (base filter + ownership). */
function scopedRows(resource, user) {
  const store = getStore();
  let rows = store[resource.collection] ?? [];
  if (typeof resource.baseFilter === "function") {
    rows = rows.filter(resource.baseFilter);
  } else if (resource.baseFilter) {
    rows = rows.filter((row) => Object.entries(resource.baseFilter).every(([field, allowed]) => allowed.includes(row[field])));
  }
  if (resource.ownerField && user.role?.scope === "own" && !user.role.superAdmin) {
    rows = rows.filter((row) => row[resource.ownerField] === user.name);
  }
  return rows;
}

/** Scoped rows plus computed display fields (copies; never mutate these). */
function readableRows(resource, user) {
  const rows = scopedRows(resource, user);
  return resource.decorate ? rows.map(resource.decorate) : rows;
}

function rowMatchesWhen(row, when) {
  if (!when) return true;
  const value = row[when.field];
  if (when.in) return when.in.includes(value);
  if (when.notIn) return !when.notIn.includes(value);
  return true;
}

function publicRows(rows) {
  return rows.map((row) => ({ ...row }));
}

export function resolveFormOptions(resource) {
  const sets = {};
  for (const field of resource.form?.fields ?? []) {
    if (field.optionsFrom === "roles") {
      sets[field.name] = getStore().roles.map((r) => ({ value: String(r.id), label: r.name }));
    }
  }
  return sets;
}

export async function listResource(key, searchParams, user) {
  const resource = getResource(key);
  if (!resource) throw new Error(`Unknown resource ${key}`);
  await mockLatency();
  const params = parseListParams(searchParams);
  const scoped = readableRows(resource, user);
  const tabField = resource.tabs?.field;
  const options = {
    searchFields: resource.searchFields ?? [],
    filterFields: [...new Set([...(resource.filterFields ?? []), ...(tabField ? [tabField] : [])])],
    dateField: resource.dateField,
    defaultSort: resource.defaultSort,
  };
  const { rows, total, page, pageSize, pageCount } = queryRows(scoped, params, options);

  let tabCounts = null;
  if (tabField) {
    const withoutTab = { ...params, filters: { ...params.filters, [tabField]: undefined }, page: 1, pageSize: 1 };
    tabCounts = { all: 0, ...countBy(queryRows(scoped, withoutTab, options).all, tabField) };
    tabCounts.all = Object.entries(tabCounts).reduce((s, [k, v]) => (k === "all" ? s : s + v), 0);
  }
  return { rows: publicRows(rows), total, page, pageSize, pageCount, tabCounts };
}

export async function exportResource(key, searchParams, user) {
  const resource = getResource(key);
  if (!resource?.exportable) return { ok: false, message: "Export is not available for this list." };
  if (!can(user, resource.permission, "view")) return { ok: false, message: "You do not have permission to export this list." };
  const params = { ...parseListParams(searchParams), page: 1, pageSize: MAX_EXPORT };
  const tabField = resource.tabs?.field;
  const { all } = queryRows(readableRows(resource, user), params, {
    searchFields: resource.searchFields ?? [],
    filterFields: [...new Set([...(resource.filterFields ?? []), ...(tabField ? [tabField] : [])])],
    dateField: resource.dateField,
    defaultSort: resource.defaultSort,
  });
  appendAudit({ actorId: user.id, actor: user.name, module: moduleName(key), action: `Exported ${resource.title}`, entity: `${Math.min(all.length, MAX_EXPORT)} rows` });
  return { ok: true, rows: publicRows(all.slice(0, MAX_EXPORT)) };
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

  await mockLatency(200);
  const store = getStore();
  const visible = scopedRows(resource, user);
  const targets = idList.map((id) => visible.find((row) => sameId(row.id, id))).filter(Boolean);
  if (targets.length !== idList.length) return { ok: false, message: "One or more records were not found or are not accessible to you." };

  const eligible = targets.filter((row) => rowMatchesWhen(row, action.when));
  if (!eligible.length) return { ok: false, message: "None of the selected records can take this action in their current state." };

  if (action.effect.remove) {
    const removeIds = new Set(eligible.map((r) => String(r.id)));
    store[resource.collection] = store[resource.collection].filter((row) => !removeIds.has(String(row.id)));
  } else if (action.effect.set) {
    for (const row of eligible) Object.assign(row, action.effect.set);
  }

  for (const row of eligible) {
    appendAudit({
      actorId: user.id,
      actor: user.name,
      module: moduleName(key),
      action: `${action.label} (${resource.title})`,
      entity: String(row.id),
      before: null,
      after: action.effect.set ?? { removed: true },
      reason: reasonCheck.reason || null,
    });
  }

  const skipped = targets.length - eligible.length;
  const noun = eligible.length === 1 ? "record" : "records";
  return { ok: true, message: `${action.label}: ${eligible.length} ${noun} updated${skipped ? `, ${skipped} skipped (not eligible)` : ""}.` };
}

function nextId(rows) {
  if (!rows.length) return 1;
  if (rows.every((r) => typeof r.id === "number")) return Math.max(...rows.map((r) => r.id)) + 1;
  let best = null;
  for (const row of rows) {
    const match = /^(.*?)(\d+)$/.exec(String(row.id));
    if (!match) continue;
    const n = Number(match[2]);
    if (!best || n > best.n) best = { prefix: match[1], n, width: match[2].length };
  }
  return best ? `${best.prefix}${String(best.n + 1).padStart(best.width, "0")}` : `R-${Date.now()}`;
}

const derivers = {
  otherCharges(values) {
    const lbhWeight = Math.round(((values.length * values.breadth * values.height) / 5000) * 1000);
    const rtoPercent = Math.round(values.shippingCost * 0.02 * 25 * 100) / 100;
    return { ...values, lbhWeight, rtoPercent, total: Math.round((values.shippingCost + values.codHandling + rtoPercent) * 100) / 100 };
  },
  holdLedger(values, { isNew, rows }) {
    const intra = String(values.supply).startsWith("Intra");
    const cgst = intra ? Math.round(values.taxable * 0.09 * 100) / 100 : 0;
    const igst = intra ? 0 : Math.round(values.taxable * 0.18 * 100) / 100;
    const out = { ...values, cgst, sgst: cgst, igst, total: Math.round((values.taxable + cgst * 2 + igst) * 100) / 100 };
    delete out.supply;
    if (isNew) {
      const prefix = values.type === "Credit Note" ? "CN" : "DN";
      const max = rows.reduce((m, r) => Math.max(m, Number(String(r.id).split("-").pop()) || 0), 0);
      out.id = `${prefix}-2627-${String(max + 1).padStart(4, "0")}`;
      out.createdAt = new Date().toISOString();
    }
    return out;
  },
  staff(values) {
    const role = getStore().roles.find((r) => String(r.id) === String(values.roleId));
    return { ...values, roleId: role.id, roleName: role.name };
  },
};

/**
 * Create (id = null) or update a record through the resource form.
 * Only fields declared in the form are written; derived values are computed here.
 */
export async function saveResourceRecord(key, id, input, user, rawReason) {
  const resource = getResource(key);
  if (!resource?.form) return { ok: false, message: "This list cannot be edited." };
  const isNew = id == null || id === "";
  const permissionAction = isNew ? "add" : "edit";
  if (!can(user, resource.permission, permissionAction)) return { ok: false, message: "You do not have permission to perform this action." };

  const reasonCheck = validateReason(rawReason, Boolean(resource.form.requireReason));
  if (!reasonCheck.ok) return { ok: false, message: reasonCheck.error, fieldErrors: { __reason: reasonCheck.error } };

  const optionSets = resolveFormOptions(resource);
  const fields = resource.form.fields;
  const { ok, values, errors } = validateForm(fields, input, optionSets);
  if (!ok) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: errors };

  await mockLatency(200);
  const store = getStore();
  const rows = store[resource.collection];
  if (!rows) return { ok: false, message: "This list is not available." };

  let target = null;
  if (!isNew) {
    target = scopedRows(resource, user).find((row) => sameId(row.id, id));
    if (!target) return { ok: false, message: "Record not found or not accessible to you." };
  }

  if (resource.form.unique) {
    const field = resource.form.unique;
    const clash = rows.find((row) => String(row[field]).toLowerCase() === String(values[field]).toLowerCase() && (!target || !sameId(row.id, target.id)));
    if (clash) return { ok: false, message: "A record with this value already exists.", fieldErrors: { [field]: "Already exists." } };
  }

  if (key === "users" && target && target.id === user.id && String(values.roleId) !== String(target.roleId)) {
    return { ok: false, message: "You cannot change your own role." };
  }

  const derive = derivers[resource.form.derive];
  const record = derive ? derive(values, { isNew, rows }) : values;

  if (isNew) {
    const created = { ...(resource.form.defaults ?? {}), ...record };
    if (created.id == null) created.id = nextId(rows);
    if (resource.collection === "leads") created.createdAt = new Date().toISOString();
    rows.unshift(created);
    target = created;
  } else {
    Object.assign(target, record);
  }

  appendAudit({
    actorId: user.id,
    actor: user.name,
    module: moduleName(key),
    action: `${isNew ? "Created" : "Updated"} ${resource.title} record`,
    entity: String(target.id),
    after: record,
    reason: reasonCheck.reason || null,
  });
  return { ok: true, message: isNew ? `${resource.title}: record created.` : `${resource.title}: changes saved.`, id: target.id };
}
