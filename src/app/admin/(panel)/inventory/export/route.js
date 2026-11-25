import { assertExport } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/* Stock export (CSV & Excel) with the admin session token, for All Stock filters. Super admins only. */
const ALLOWED = ["status", "search", "category", "pool", "sellerId", "sort"];
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request) {
  const auth = await assertExport();
  if (!auth.ok) return text(auth.status === 401 ? "Sign in to download this file." : auth.message, auth.status);
  const { user } = auth;
  const incoming = new URL(request.url).searchParams;
  const format = incoming.get("format") || "csv";
  const query = new URLSearchParams(ALLOWED.filter((k) => incoming.get(k)).map((k) => [k, incoming.get(k)]));
  const response = await fetch(`${apiBase()}/admin/stock/export.csv?${query}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }

  const rawCsv = await response.text();

  if (format === "xlsx") {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(rawCsv, { type: "string" });
    const sheetName = wb.SheetNames[0] || "Stock";
    const ws = wb.Sheets[sheetName];

    // Auto-fit column widths so date/number columns never display as '###' in Excel
    if (ws["!ref"]) {
      const range = XLSX.utils.decode_range(ws["!ref"]);
      const colWidths = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxLen = 10;
        let isDateCol = false;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell && cell.v != null) {
            const str = String(cell.v);
            if (R === range.s.r && /date|updated|created|time/i.test(str)) isDateCol = true;
            if (str.length > maxLen) maxLen = str.length;
          }
        }
        colWidths.push({ wch: Math.min(Math.max(maxLen + 4, isDateCol ? 22 : 12), 50) });
      }
      ws["!cols"] = colWidths;
    }

    const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    return new Response(xlsxBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="inventory.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  }

  const out = new Headers({ "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "no-store" });
  out.set("Content-Disposition", 'attachment; filename="inventory.csv"');
  return new Response(rawCsv, { status: 200, headers: out });
}
