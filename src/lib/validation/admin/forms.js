/**
 * Field-level validation shared by the browser (instant feedback) and the
 * server (authoritative). Only fields declared in the form config are read,
 * so unknown keys sent by a client are dropped.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function optionValues(options = []) {
  return options.map((o) => (typeof o === "object" ? String(o.value) : String(o)));
}

export function validateField(field, raw, { options } = {}) {
  if (field.type === "checkbox") {
    const on = raw === true || raw === "1" || raw === "true" || raw === "on";
    return { value: on, error: field.required && !on ? `${field.label} is required.` : null };
  }
  if (field.type === "multiselect") {
    const list = (Array.isArray(raw) ? raw : typeof raw === "string" && raw ? raw.split(",") : []).map((v) => String(v).trim()).filter(Boolean);
    const allowed = optionValues(options ?? field.options);
    if (field.required && !list.length) return { value: list, error: `${field.label} is required.` };
    const bad = allowed.length ? list.find((v) => !allowed.includes(v)) : null;
    return { value: list, error: bad ? `Choose valid ${field.label.toLowerCase()}.` : null };
  }
  if (field.type === "file") return { value: null, error: null };
  const value = typeof raw === "string" ? (field.type === "html" ? raw : raw.trim()) : raw;
  const empty = value == null || value === "";
  if (empty) return { value: field.type === "number" ? null : "", error: field.required ? `${field.label} is required.` : null };

  switch (field.type) {
    case "number": {
      const n = Number(value);
      if (!Number.isFinite(n)) return { value: null, error: `${field.label} must be a number.` };
      if (field.min != null && n < field.min) return { value: n, error: `${field.label} must be at least ${field.min}.` };
      if (field.max != null && n > field.max) return { value: n, error: `${field.label} must be at most ${field.max}.` };
      return { value: n, error: null };
    }
    case "email":
      return { value: String(value).toLowerCase(), error: EMAIL.test(value) ? null : "Enter a valid email address." };
    case "date":
      return { value, error: DATE.test(value) && !Number.isNaN(new Date(value).getTime()) ? null : "Enter a valid date." };
    case "select": {
      const allowed = optionValues(options ?? field.options);
      return { value: String(value), error: allowed.includes(String(value)) ? null : `Choose a valid ${field.label.toLowerCase()}.` };
    }
    case "color":
      return { value: String(value), error: /^#[0-9a-fA-F]{6}$/.test(String(value)) ? null : `${field.label} must be a colour like #1a2b3c.` };
    default: {
      const text = String(value);
      const max = field.maxLength ?? (field.type === "html" ? 200000 : field.type === "textarea" ? 4000 : 200);
      if (text.length > max) return { value: text, error: `${field.label} must be ${max} characters or fewer.` };
      if (field.pattern && !new RegExp(field.pattern).test(text)) return { value: text, error: field.patternMessage || `${field.label} is not in the right format.` };
      return { value: text, error: null };
    }
  }
}

/** Fields shown on a new record vs an edit (`only: "new" | "edit"`). */
export function formFieldsFor(fields = [], isNew) {
  return fields.filter((f) => !f.only || (f.only === "new" ? isNew : !isNew));
}

/**
 * @param fields form field configs
 * @param input plain object of submitted values
 * @param optionSets resolved `optionsFrom` lists keyed by field name
 */
export function validateForm(fields, input = {}, optionSets = {}) {
  const values = {};
  const errors = {};
  for (const field of fields) {
    const { value, error } = validateField(field, input[field.name], { options: optionSets[field.name] });
    values[field.name] = value;
    if (error) errors[field.name] = error;
  }
  return { ok: Object.keys(errors).length === 0, values, errors };
}

/** `min` is 1 for reasons picked from a predefined list (reject reasons), 5 for free text. */
export function validateReason(reason, required, min = 5) {
  const text = typeof reason === "string" ? reason.trim() : "";
  if (required && text.length < min) return { ok: false, reason: text, error: min > 1 ? "Please give a reason (at least 5 characters)." : "Please select a reason." };
  return { ok: true, reason: text.slice(0, 500), error: null };
}
