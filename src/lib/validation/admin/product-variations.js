import { validateForm } from "./forms";

export const VARIATION_ATTRIBUTES = ["Pack size", "Weight", "Volume", "Size", "Colour", "Other"];
export const MAX_VARIATIONS = 10;

const headFields = [
  { name: "attribute", label: "Variation type", type: "select", options: VARIATION_ATTRIBUTES, required: true },
  { name: "baseLabel", label: "Base product variation", type: "text", required: true, maxLength: 40 },
];

export const variationRowFields = [
  { name: "label", label: "Variation", type: "text", required: true, maxLength: 40 },
  { name: "mrp", label: "MRP (₹)", type: "number", required: true, min: 1, max: 1000000 },
  { name: "nrv", label: "NRV (₹)", type: "number", required: true, min: 1, max: 1000000 },
  { name: "stock", label: "Stock", type: "number", required: true, min: 0, max: 100000 },
  { name: "weightKg", label: "Weight (kg)", type: "number", required: true, min: 0.01, max: 100 },
];

/**
 * Validates the variations block of the create-product form. Field errors are
 * keyed `attribute`, `baseLabel`, `variations` and `variations.{i}.{field}`.
 */
export function validateVariations(input) {
  if (!input?.enabled) return { ok: true, values: null, errors: {} };
  const head = validateForm(headFields, input);
  const errors = { ...head.errors };
  const rows = Array.isArray(input.rows) ? input.rows : [];
  if (!rows.length) errors.variations = "Add at least one variation, or turn variations off.";
  if (rows.length > MAX_VARIATIONS) errors.variations = `You can add up to ${MAX_VARIATIONS} variations.`;

  const seen = new Set([String(head.values.baseLabel).toLowerCase()]);
  const values = rows.slice(0, MAX_VARIATIONS).map((row, i) => {
    const r = validateForm(variationRowFields, row);
    for (const [key, message] of Object.entries(r.errors)) errors[`variations.${i}.${key}`] = message;
    if (r.values.stock != null && !Number.isInteger(r.values.stock)) errors[`variations.${i}.stock`] = "Stock must be a whole number.";
    const name = String(r.values.label).toLowerCase();
    if (name && seen.has(name)) errors[`variations.${i}.label`] = "Each variation needs a different name from the base product and the others.";
    seen.add(name);
    return r.values;
  });

  return { ok: Object.keys(errors).length === 0, values: { attribute: head.values.attribute, baseLabel: head.values.baseLabel, rows: values }, errors };
}
