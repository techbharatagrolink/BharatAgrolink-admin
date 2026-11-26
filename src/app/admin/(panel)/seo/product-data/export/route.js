import { assertExport } from "@/lib/auth/session";
import { apiBase } from "@/lib/api";

/** Export of product data issues (CSV & Excel); super admins only. */
export async function GET(request) {
  const auth = await assertExport();
  if (!auth.ok) return new Response(auth.status === 401 ? "Sign in to download this list." : auth.message, { status: auth.status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const { user } = auth;
  const incoming = new URL(request.url).searchParams;
  const format = incoming.get("format") || "csv";
  const params = new URLSearchParams();
  for (const key of ["rule", "severity", "category", "status"]) {
    const value = incoming.get(key);
    if (value) params.set(key, value);
  }
  const response = await fetch(`${apiBase()}/admin/seo/product-quality.csv?${params}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const message = (await response.json().catch(() => null))?.message || "The list could not be created.";
    return new Response(message, { status: response.status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const rawCsv = await response.text();

  if (format === "xlsx") {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(rawCsv, { type: "string" });
    const sheetName = wb.SheetNames[0] || "Issues";
    const ws = wb.Sheets[sheetName];
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
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="product-data-issues.xlsx"',
        "Cache-Control": "private, no-store",
      },
    });
  }

  return new Response(rawCsv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="product-data-issues.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
