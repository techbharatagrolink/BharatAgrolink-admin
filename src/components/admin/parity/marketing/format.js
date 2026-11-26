const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STAMP = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/;

/** A raw DB stamp ("YYYY-MM-DD HH:mm:ss", already IST) shown as stored, with no timezone shift. */
export function formatStamp(value, { time = true } = {}) {
  const m = STAMP.exec(String(value ?? ""));
  if (!m) return value ? String(value) : "—";
  const date = `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  if (!time || m[4] == null) return date;
  const hour = Number(m[4]);
  return `${date}, ${String(hour % 12 || 12).padStart(2, "0")}:${m[5]} ${hour < 12 ? "AM" : "PM"}`;
}

export const rupees = (v, digits = 0) => `₹${(Number(v) || 0).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

/** "+12.5%" / "-3%" like the PHP dashboards print their change figures. */
export const signed = (v, suffix = "%") => `${Number(v) >= 0 ? "+" : ""}${Number(v) || 0}${suffix}`;

import { csvText as sharedCsvText, downloadCsv as sharedDownloadCsv, exportFileName } from "@/lib/csv";

export function csvText(headers, rows) {
  return sharedCsvText(headers, rows);
}

export function downloadText(filename, text) {
  sharedDownloadCsv(filename, text);
}

export function todayIso() {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  return date;
}
