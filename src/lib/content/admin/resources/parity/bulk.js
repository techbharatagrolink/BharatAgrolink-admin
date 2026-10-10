/**
 * Screens for the bulk PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */
export const resources = {
  "bulk.products": {
    title: "Bulk Products",
    description: "Products offered on bulk quotations and orders, with their seller, prices, GST and stock.",
    permission: "bulk.products",
    search: "Product name, technical name or SKU",
    dateRange: "Created",
    exportable: true,
    filters: [{ key: "stockLevel", label: "Stock", options: ["In Stock", "Low Stock", "Out of Stock"] }],
    tabs: { field: "status", values: ["Active", "Inactive"] },
    defaultSort: "createdAt:desc",
    columns: [
      { key: "id", label: "ID", type: "number", sortable: true },
      { key: "productName", label: "Product", emphasis: true, sub: "technicalName", sortable: true, wrap: true, width: 260 },
      { key: "sku", label: "SKU", type: "mono", sortable: true },
      { key: "category", label: "Category", sortable: true },
      { key: "seller", label: "Seller", sortable: true, wrap: true },
      { key: "purchasePrice", label: "Purchase Price", type: "currency", sortable: true },
      { key: "mrp", label: "MRP", type: "currency", sortable: true },
      { key: "gstPercentage", label: "GST %", type: "number", sortable: true },
      { key: "stock", label: "Stock", type: "number", sub: "stockUnit", sortable: true },
      { key: "stockLevel", label: "Stock level", type: "status" },
      { key: "variantCount", label: "Variants", type: "number", sortable: true },
      { key: "status", label: "Status", type: "status" },
      { key: "createdAt", label: "Created", type: "datetime", sortable: true },
      { key: "updatedAt", label: "Updated", type: "datetime", sortable: true, hidden: true },
    ],
    rowActions: [
      {
        id: "delete",
        label: "Delete",
        permission: "delete",
        tone: "danger",
        effect: { remove: true },
        confirm: { title: "Delete this product?", description: "The product, its variants and its audit log are removed. Existing quotations and orders keep their copied lines." },
      },
    ],
  },
};

export const routes = {
  "/admin/bulk-orders/products": "bulk.products",
};

export const live = {
  "bulk.products": { path: "/bulk-orders/products", page: "bulk_orders/products.php", permission: "bulk.products" },
};

export const pages = {
  "bulk.dashboard": ["bulk_orders/index.php"],
  "bulk.orders": ["bulk_orders/orders.php"],
  "bulk.shipments": ["bulk_orders/shipments.php"],
  "bulk.quotations": ["bulk_orders/quotations.php"],
};

export const livePaths = [
  "/admin/bulk-orders/dashboard",
  "/admin/bulk-orders/orders",
  "/admin/bulk-orders/shipments",
  "/admin/bulk-orders/quotations",
  "/admin/bulk-orders/products",
];
