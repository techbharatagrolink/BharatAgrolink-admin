import { getCurrentAdmin } from "@/lib/auth/session";
import { canExport, EXPORT_DENIED } from "@/lib/auth/permissions";
import { apiBase } from "@/lib/api";

/*
 * 301 URL Redirects CSV files with the admin session token:
 *   /admin/cms/redirects/download?file=export  -> every rule (PHP redirects_process.php?action=export)
 *   /admin/cms/redirects/download?file=sample  -> import template (action=sample)
 */
const FILES = { export: "export", sample: "sample" };
const text = (message, status) => new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function GET(request) {
  const user = await getCurrentAdmin();
  if (!user) return text("Sign in to download this file.", 401);
  const file = FILES[new URL(request.url).searchParams.get("file")];
  if (!file) return text("Unknown file.", 404);
  // Every rule as a file is a data export (super admins only); the import template stays open.
  if (file === "export" && !canExport(user)) return text(EXPORT_DENIED, 403);

  const response = await fetch(`${apiBase()}/admin/cms/redirects/${file}`, { headers: { Authorization: `Bearer ${user.token}` }, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return text(payload?.message || `The file could not be created (${response.status}).`, response.status);
  }

  const format = new URL(request.url).searchParams.get("format") || "csv";
  if (file === "export" && format === "xlsx") {
    const rawCsv = await response.text();
    const XLSX = await import("xlsx");
    const wb = XLSX.read(rawCsv, { type: "string" });
    const sheetName = wb.SheetNames[0] || "Redirects";
    const ws = wb.Sheets[sheetName];
    if (ws["!ref"]) {
      const range = XLSX.utils.decode_range(ws["!ref"]);
      const colWidths = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxLen = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
          if (cell && cell.v != null) {
            const str = String(cell.v);
            if (str.length > maxLen) maxLen = str.length;
          }
        }
        colWidths.push({ wch: Math.min(Math.max(maxLen + 4, 12), 60) });
      }
      ws["!cols"] = colWidths;
    }
    const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    return new Response(xlsxBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="redirects.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  }

  const out = new Headers({ "Content-Type": response.headers.get("content-type") || "text/csv; charset=utf-8", "Cache-Control": "no-store" });
  const disposition = response.headers.get("content-disposition");
  if (disposition) out.set("Content-Disposition", disposition);
  return new Response(await response.arrayBuffer(), { status: 200, headers: out });
}
