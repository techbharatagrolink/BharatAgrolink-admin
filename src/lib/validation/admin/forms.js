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
  const value = typeof raw === "string" ? raw.trim() : raw;
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
    default: {
      const text = String(value);
      const max = field.maxLength ?? (field.type === "textarea" ? 4000 : 200);
      if (text.length > max) return { value: text, error: `${field.label} must be ${max} characters or fewer.` };
      if (field.pattern && !new RegExp(field.pattern).test(text)) return { value: text, error: field.patternMessage || `${field.label} is not in the right format.` };
      return { value: text, error: null };
    }
  }
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

export function validateReason(reason, required) {
  const text = typeof reason === "string" ? reason.trim() : "";
  if (required && text.length < 5) return { ok: false, reason: text, error: "Please give a reason (at least 5 characters)." };
  return { ok: true, reason: text.slice(0, 500), error: null };
}
