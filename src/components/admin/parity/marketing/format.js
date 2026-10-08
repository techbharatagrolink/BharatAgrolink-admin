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

export const rupees = (v, digits = 2) => `₹${(Number(v) || 0).toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

/** "+12.5%" / "-3%" like the PHP dashboards print their change figures. */
export const signed = (v, suffix = "%") => `${Number(v) >= 0 ? "+" : ""}${Number(v) || 0}${suffix}`;

export function csvText(headers, rows) {
  const cell = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return `\uFEFF${[headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n")}`;
}

export function downloadText(filename, text, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
