/** Master delivered orders: table columns, CSV layout and URL -> API query parsing (shared by server and client). */

export const DELIVERED_COLUMNS = [
  { key: "order_id", label: "Order ID", on: true },
  { key: "order_type", label: "Type", on: true, badge: true },
  { key: "order_date", label: "Order Date", on: true, date: true },
  { key: "delivered_date", label: "Delivered", on: true, date: true },
  { key: "vendor_name", label: "Vendor", on: true },
  { key: "vendor_id", label: "Vendor ID" },
  { key: "product_name", label: "Product", on: true },
  { key: "product_sku", label: "SKU" },
  { key: "category_name", label: "Category", on: true },
  { key: "qty", label: "Qty", on: true, number: true },
  { key: "taxable_amount", label: "Taxable", on: true, money: true },
  { key: "gst_percent", label: "GST %", number: true },
  { key: "cgst", label: "CGST", money: true },
  { key: "sgst", label: "SGST", money: true },
  { key: "igst", label: "IGST", money: true },
  { key: "gst_amount", label: "GST Amount", on: true, money: true },
  { key: "gross_amount", label: "Order Total", on: true, money: true },
  { key: "discount", label: "Discount", money: true },
  { key: "shipping", label: "Shipping", money: true },
  { key: "pg_charges", label: "PG Charges", money: true },
  { key: "commission_percent", label: "Comm %", number: true },
  { key: "commission_amount", label: "Commission", on: true, money: true },
  { key: "net_revenue", label: "Net Revenue", on: true, money: true },
  { key: "vendor_payout", label: "Vendor Payout", money: true },
  { key: "payment_mode", label: "Payment Mode", on: true, upper: true },
  { key: "payout_status", label: "Payout Status" },
  { key: "courier_name", label: "Courier" },
  { key: "tracking_id", label: "Tracking" },
  { key: "delivery_state", label: "State", on: true },
  { key: "order_status", label: "Status" },
  { key: "customer_name", label: "Customer", on: true },
  { key: "customer_mobile", label: "Mobile" },
  { key: "company_name", label: "Company" },
  { key: "gstin", label: "GSTIN" },
  { key: "po_number", label: "PO Number" },
];

export const EXPORT_COLUMNS = [
  ["order_id", "Order ID"],
  ["order_type", "Order Type"],
  ["order_date", "Order Date"],
  ["delivered_date", "Delivered Date"],
  ["vendor_id", "Vendor ID"],
  ["vendor_name", "Vendor Name"],
  ["product_name", "Product"],
  ["product_sku", "SKU"],
  ["category_name", "Category"],
  ["qty", "Qty"],
  ["taxable_amount", "Taxable Amount"],
  ["gst_percent", "GST %"],
  ["cgst", "CGST"],
  ["sgst", "SGST"],
  ["igst", "IGST"],
  ["gst_amount", "GST Amount"],
  ["gross_amount", "Order Total (Gross)"],
  ["discount", "Discount"],
  ["shipping", "Shipping"],
  ["tcs", "TCS"],
  ["commission_percent", "Commission %"],
  ["commission_amount", "Commission Amount"],
  ["gst_on_commission", "GST on Commission"],
  ["net_revenue", "Net Revenue (Platform)"],
  ["vendor_payout", "Vendor Payout"],
  ["payment_mode", "Payment Mode"],
  ["payout_status", "Payout Status"],
  ["courier_name", "Courier"],
  ["tracking_id", "Tracking ID"],
  ["customer_name", "Customer / Contact"],
  ["customer_mobile", "Customer Mobile"],
  ["delivery_state", "Delivery State"],
  ["company_name", "Company Name"],
  ["gstin", "GSTIN"],
  ["po_number", "PO Number"],
  ["order_status", "Status"],
];

export const PER_PAGE = [25, 50, 100];
const SORTABLE = new Set(DELIVERED_COLUMNS.map((c) => c.key));
const YMD = /^\d{4}-\d{2}-\d{2}$/;

function one(params, key) {
  const value = params?.[key];
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" ? v.trim().slice(0, 120) : "";
}

const amount = (v) => (v !== "" && Number.isFinite(Number(v)) ? v : "");

/** URL search params -> API query. No dates means Lifetime, the PHP page's default preset. */
export function deliveredQuery(params) {
  const from = YMD.test(one(params, "from")) ? one(params, "from") : "";
  const to = YMD.test(one(params, "to")) ? one(params, "to") : "";
  const orderType = ["B2C", "B2B"].includes(one(params, "orderType")) ? one(params, "orderType") : "ALL";
  const perPage = PER_PAGE.includes(Number(one(params, "perPage"))) ? Number(one(params, "perPage")) : 50;
  const sort = SORTABLE.has(one(params, "sort")) ? one(params, "sort") : "delivered_date";
  const order = one(params, "order").toUpperCase() === "ASC" ? "ASC" : "DESC";
  return {
    lifetime: from || to ? "" : "1",
    from,
    to,
    orderType,
    vendorId: one(params, "vendorId"),
    categoryId: /^\d+$/.test(one(params, "categoryId")) ? one(params, "categoryId") : "",
    state: one(params, "state"),
    paymentMode: ["cod", "prepaid", "partial", "credit"].includes(one(params, "paymentMode")) ? one(params, "paymentMode") : "",
    search: one(params, "search"),
    minValue: amount(one(params, "minValue")),
    maxValue: amount(one(params, "maxValue")),
    page: Math.max(1, Number.parseInt(one(params, "page"), 10) || 1),
    perPage,
    sort,
    order,
  };
}

function cell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r\t \\]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** fputcsv-style CSV with a UTF-8 BOM, as the PHP export writes it. */
export function deliveredCsv(rows) {
  const lines = [EXPORT_COLUMNS.map(([, label]) => cell(label)).join(",")];
  for (const row of rows) lines.push(EXPORT_COLUMNS.map(([key]) => cell(row[key])).join(","));
  return `\uFEFF${lines.join("\n")}\n`;
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
