import "server-only";
import { api, ApiError } from "@/lib/api";
import { can } from "@/lib/auth/permissions";

/**
 * fixed_expenses.php on the admin API resource /finance/fixed-expenses:
 *   GET  /overview?month=YYYY-MM|all&q&category&page&pageSize  month view, KPI cards, year strip
 *   POST / · PUT /:id                                          add / edit / adjust (values)
 *   POST /actions/:action { ids }                              activate | deactivate | delete
 */

const PATH = "admin/finance/fixed-expenses";
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const PAGE_SIZES = [10, 25, 50, 100];
const ACTIONS = new Set(["activate", "deactivate", "delete"]);

const FORM_FIELD = { effectiveFrom: "month" };

/** API field errors ({ field } or validation issues with path "values.amount") keyed by form field. */
function fail(error, fallback) {
  if (!(error instanceof ApiError)) return { ok: false, message: fallback };
  const fieldErrors = {};
  const issues = Array.isArray(error.details) ? error.details : error.details?.field ? [{ path: error.details.field, message: error.message }] : [];
  for (const issue of issues) {
    const key = String(issue.path ?? "").replace(/^values\./, "");
    if (key) fieldErrors[FORM_FIELD[key] ?? key] ??= issue.message;
  }
  return { ok: false, message: error.message, ...(Object.keys(fieldErrors).length ? { fieldErrors } : {}) };
}

const one = (v) => (Array.isArray(v) ? v[0] : v);

export async function getFixedExpenses(searchParams, user) {
  const month = String(one(searchParams.month) ?? "");
  const pageSize = Number(one(searchParams.pageSize));
  try {
    const { data } = await api(`${PATH}/overview`, {
      token: user.token,
      query: {
        month: month === "all" || MONTH.test(month) ? month : undefined,
        q: String(one(searchParams.q) ?? "").trim().slice(0, 120) || undefined,
        category: String(one(searchParams.category) ?? "").slice(0, 100) || undefined,
        page: Number.parseInt(one(searchParams.page), 10) > 0 ? Number.parseInt(one(searchParams.page), 10) : undefined,
        // The PHP page lists every row; 100 per page unless the viewer picks fewer.
        pageSize: PAGE_SIZES.includes(pageSize) ? pageSize : 100,
      },
    });
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: error instanceof ApiError ? error.message : "Could not load fixed expenses from the admin API." };
  }
}

/** values: { name, category, amount, recurrence, month, notes, status?, overrideParentId? } */
export async function saveFixedExpense(id, values, reason, user) {
  const isNew = id == null || id === "";
  if (!can(user, "finance.expenses", isNew ? "add" : "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  const recurrence = values.recurrence === "One month" ? "One month" : "Recurring";
  const body = {
    name: String(values.name ?? "").trim(),
    category: String(values.category ?? "").trim(),
    amount: values.amount,
    recurrence,
    effectiveFrom: recurrence === "One month" ? String(values.month ?? "").trim() : "",
    notes: String(values.notes ?? "").trim(),
    ...(values.status === "Active" || values.status === "Inactive" ? { status: values.status } : {}),
    ...(values.overrideParentId != null && values.overrideParentId !== "" ? { overrideParentId: Number(values.overrideParentId) } : {}),
  };
  try {
    await api(isNew ? PATH : `${PATH}/${encodeURIComponent(id)}`, { method: isNew ? "POST" : "PUT", token: user.token, body: { values: body, reason: reason || undefined } });
    if (body.overrideParentId) return { ok: true, message: `Adjustment for ${body.effectiveFrom} saved.` };
    if (!isNew) return { ok: true, message: "Expense updated successfully!" };
    return { ok: true, message: recurrence === "One month" ? `Month-specific expense for ${body.effectiveFrom} added successfully!` : "Recurring baseline expense added successfully (applies to every month)!" };
  } catch (error) {
    return fail(error, "Could not save the expense.");
  }
}

export async function runFixedExpenseAction(actionId, ids, reason, user) {
  if (!ACTIONS.has(actionId)) return { ok: false, message: "This action is not available." };
  if (!can(user, "finance.expenses", actionId === "delete" ? "delete" : "edit")) return { ok: false, message: "You do not have permission to perform this action." };
  const idList = ids.slice(0, 200);
  if (!idList.length) return { ok: false, message: "Select at least one row." };
  try {
    const { data } = await api(`${PATH}/actions/${actionId}`, { method: "POST", token: user.token, body: { ids: idList, reason: reason || undefined } });
    return { ok: true, message: data?.message || "Done." };
  } catch (error) {
    return fail(error, "The admin API could not complete that request.");
  }
}
