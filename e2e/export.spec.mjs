import { test, expect } from "@playwright/test";
import { csvText, csvCell, plainValue, exportFileName, exportMatrix } from "../src/lib/csv.js";

test.describe("Export Utilities Unit & Permission Checks", () => {
  test("plainValue and csvCell sanitize formula injections", () => {
    expect(csvCell("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(csvCell("@dangerous")).toBe("'@dangerous");
    expect(csvCell("+1234")).toBe("+1234");
    expect(csvCell("+cmd")).toBe("'+cmd");
    expect(csvCell("-cmd")).toBe("'-cmd");
  });

  test("csvText produces BOM and CRLF delimited rows", () => {
    const headers = ["ID", "Name", "Amount (₹)"];
    const rows = [
      ["1", "KrishiGold", 599],
      ["2", "Urea Special", 1200]
    ];
    const text = csvText(headers, rows);
    expect(text.startsWith("\uFEFF")).toBe(true);
    expect(text).toContain("ID,Name,Amount (₹)\r\n");
    expect(text).toContain("1,KrishiGold,599\r\n");
  });

  test("plainValue formats ISO dates and timestamps nicely", () => {
    const rawIso = "2026-11-25T08:00:00.000Z";
    const formatted = plainValue(rawIso);
    expect(formatted).not.toBe(rawIso);
    expect(formatted).toMatch(/\d{2} \w{3} \d{4}, \d{2}:\d{2}/);
  });

  test("exportFileName generates IST timestamps", () => {
    const csvName = exportFileName("test-orders", "csv");
    const xlsxName = exportFileName("test-orders", "xlsx");
    expect(csvName).toMatch(/^test-orders-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(xlsxName).toMatch(/^test-orders-\d{4}-\d{2}-\d{2}\.xlsx$/);
  });

  test("exportMatrix filters unexportable columns and formats values", () => {
    const columns = [
      { label: "ID", value: (r) => r.id },
      { label: "Actions", export: false, value: () => "action" },
      { label: "Active", value: (r) => r.active },
      { label: "Tags", value: (r) => r.tags },
    ];
    const rows = [
      { id: 101, active: true, tags: ["organic", "bulk"] }
    ];
    const matrix = exportMatrix(columns, rows);
    expect(matrix.headers).toEqual(["ID", "Active", "Tags"]);
    expect(matrix.rows[0]).toEqual([101, "Yes", "organic; bulk"]);
  });

  test("plainValue eliminates placeholder dashes and special characters in exports", () => {
    expect(plainValue("—")).toBe("");
    expect(plainValue("N/A")).toBe("");
    expect(plainValue("n/a")).toBe("");
    expect(plainValue(null)).toBe("");
    expect(plainValue(undefined)).toBe("");
    expect(csvCell("—")).toBe("");
    expect(csvCell("N/A")).toBe("");
  });

  test("csvCell protects dates with apostrophe so Excel does not overflow with ###", () => {
    const formattedDate = "25 Nov 2026, 13:45";
    const cell = csvCell(formattedDate);
    expect(cell).toBe(`"'${formattedDate}"`);
  });
});
