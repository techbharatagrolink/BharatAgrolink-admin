/**
 * CSV helpers shared by every admin export (server and browser).
 *
 * - Numbers stay plain numbers (no ₹, digit grouping or rounding) so Excel can sum them.
 * - The file starts with a UTF-8 BOM so Excel shows Hindi names and ₹ correctly.
 * - Text that a spreadsheet would run as a formula (=, @, +/- followed by a letter) gets a leading
 *   apostrophe, so customer-entered text cannot execute when the file is opened.
 */

/** Most rows one export returns; matches the admin API resource engine's export cap. */
export const EXPORT_MAX_ROWS = 5000;

const FORMULA = /^(?:[=@\t\r]|[+-][^\d.\s])/;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

/** Formats ISO dates or timestamps into clean, human-readable date/time string so Excel doesn't display ### */
export function formatExportDate(val) {
  if (!val) return "";
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return String(val);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Kolkata",
  }).format(d);
}

/** Plain text of a React node (strings, numbers, elements and arrays), for exports built from rendered cells. */
export function textOf(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (typeof node === "object" && node.props) {
    const { children, label, status, value, title } = node.props;
    const inner = textOf(children);
    if (inner) return inner;
    for (const candidate of [label, status, value, title]) if (typeof candidate === "string" || typeof candidate === "number") return String(candidate);
  }
  return "";
}

/** One value as a spreadsheet cell: numbers as numbers, lists joined, objects by name/label. */
export function plainValue(value) {
  if (value == null) return "";
  if (typeof value === "number") return Number.isFinite(value) ? value : "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return formatExportDate(value);
  if (Array.isArray(value)) return value.map((item) => plainValue(item)).filter((item) => item !== "").join("; ");
  if (typeof value === "object") {
    if (value.props) return textOf(value);
    for (const key of ["name", "label", "title", "text", "value", "id"]) if (value[key] != null && typeof value[key] !== "object") return String(value[key]);
    return "";
  }
  const str = String(value);
  if (str === "—" || str === "N/A" || str === "n/a" || str === "null" || str === "undefined") return "";
  if (ISO_DATE.test(str) && (str.includes("T") || str.includes(":") || str.includes("-"))) {
    const parsed = new Date(str);
    if (!Number.isNaN(parsed.getTime())) return formatExportDate(parsed);
  }
  return str;
}

export function csvCell(value) {
  const plain = plainValue(value);
  if (typeof plain === "number") return String(plain);
  let text = plain === "—" || plain === "N/A" || plain === "n/a" ? "" : plain;
  // Prefix dates and formula-like strings with ' so Excel treats them as clean text and never displays '###' or executes formulas
  if (FORMULA.test(text) || (/^\d{2}\s[A-Za-z]{3}\s\d{4}/.test(text))) text = `'${text}`;
  return /[",\r\n]|^\s|\s$/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** CSV text (with BOM) from a header row and rows of values. */
export function csvText(headers, rows) {
  return `﻿${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

/**
 * Header + value rows from export columns `[{ label, value(row, index) }]`.
 * Columns with `export: false` (checkboxes, action buttons) are skipped.
 */
export function exportMatrix(columns, rows) {
  const used = columns.filter((column) => column.export !== false && column.value);
  return {
    headers: used.map((column) => column.label),
    rows: (rows ?? []).map((row, index) => used.map((column) => plainValue(column.value(row, index)))),
  };
}

/** "orders" -> "orders-2026-11-24.csv" or .xlsx (the date in IST). */
export function exportFileName(base, ext = "csv") {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const cleanExt = ext.replace(/^\./, "");
  return `${String(base || "export").replace(/[^\w.-]+/g, "-")}-${date}.${cleanExt}`;
}

/** Browser only: saves `text` as a CSV file. */
export function downloadCsv(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Browser only: generates and downloads native Excel (.xlsx) file using dynamic import. */
export async function downloadXlsx(filename, headers, rows) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Calculate auto column widths so text like dates/names never display as '###' in Excel
  const colWidths = headers.map((header, colIdx) => {
    let maxLen = String(header ?? "").length;
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const val = rows[rowIdx]?.[colIdx];
      const len = val != null ? String(val).length : 0;
      if (len > maxLen) maxLen = len;
    }
    const isDateCol = /date|updated|created|time|at/i.test(String(header ?? ""));
    const minWidth = isDateCol ? 22 : 12;
    return { wch: Math.min(Math.max(maxLen + 4, minWidth), 50) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
