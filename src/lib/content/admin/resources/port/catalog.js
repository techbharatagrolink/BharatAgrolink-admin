/**
 * Catalog screens ported from PHP (docs/php-port):
 * pending_tax.php, pending_return_policy.php, pending_attribute_conf.php,
 * pending_attribute_set.php and manage_conf_attributes_val.php.
 */

const queueActions = (noun, reasonType) => [
  { id: "approve", label: "Approve", permission: "edit", effect: { run: "approve" }, when: { field: "status", notIn: ["Active"] }, confirm: { title: `Approve ${noun}?`, description: "The seller who requested it is notified." } },
  {
    id: "reject",
    label: "Reject",
    permission: "edit",
    tone: "danger",
    effect: { run: "reject" },
    confirm: { title: `Reject ${noun}?`, description: "The seller is notified with the reason and the request is deleted.", requireReason: true, reasonType },
  },
];

const seller = { key: "seller", label: "Requested by", sub: "sellerId" };

export const resources = {
  "catalog.pendingTax": {
    title: "Pending Tax Class",
    description: "Tax classes sellers asked for. Approve makes them available; reject deletes the request.",
    permission: "catalog.tax",
    search: "Search tax class or seller",
    searchFields: ["name", "seller"],
    defaultSort: "name:asc",
    columns: [
      { key: "name", label: "Tax Label", sortable: true, emphasis: true },
      { key: "rate", label: "Tax Class (%)", type: "number", sortable: true },
      seller,
      { key: "status", label: "Status", type: "status" },
      { key: "createdAt", label: "Requested", type: "date", sortable: true },
    ],
    rowActions: queueActions("tax class", ""),
  },
  "catalog.pendingReturnPolicies": {
    title: "Pending Return Policy",
    description: "Return policies sellers asked for.",
    permission: "catalog.returnPolicies",
    search: "Search policy or seller",
    searchFields: ["title", "policy", "seller"],
    defaultSort: "title:asc",
    columns: [
      { key: "title", label: "Policy Title", sortable: true, emphasis: true },
      { key: "policy", label: "Return Policy", wrap: true, width: 360 },
      { key: "validity", label: "Validity (days)", type: "number" },
      seller,
      { key: "status", label: "Status", type: "status" },
    ],
    rowActions: queueActions("return policy", ""),
  },
  "catalog.pendingAttributes": {
    title: "Pending Attributes",
    description: "Configuration attributes, with the ones sellers requested under Pending.",
    permission: "catalog.attributes",
    search: "Search attribute or seller",
    searchFields: ["name", "seller"],
    tabs: { field: "status", values: ["Pending", "Active", "Inactive"] },
    defaultSort: "name:asc",
    columns: [
      { key: "name", label: "Attribute", sortable: true, emphasis: true },
      seller,
      { key: "status", label: "Status", type: "status" },
      { key: "createdAt", label: "Created", type: "date", sortable: true },
    ],
    rowActions: queueActions("attribute", "8"),
  },
  "catalog.pendingAttributeSets": {
    title: "Pending Attribute Sets",
    description: "Attribute sets sellers requested.",
    permission: "catalog.attributes",
    search: "Search attribute set",
    searchFields: ["name", "seller"],
    tabs: { field: "status", values: ["Pending", "Active", "Inactive"] },
    defaultSort: "name:asc",
    columns: [
      { key: "name", label: "Attribute", sortable: true, emphasis: true },
      seller,
      { key: "status", label: "Status", type: "status" },
      { key: "createdAt", label: "Created", type: "date", sortable: true },
    ],
    rowActions: queueActions("attribute set", "7"),
  },
  "catalog.attributeValues": {
    title: "Attribute Values",
    description: "Values of a configuration attribute. Renaming a value also renames it on the products that use it; a value used by a product cannot be deleted.",
    permission: "catalog.attributes",
    search: "Search value",
    searchFields: ["value"],
    defaultSort: "value:asc",
    headerActions: [{ href: "/admin/catalog/attributes", label: "Back", action: "view" }],
    columns: [
      { key: "attribute", label: "Main Attributes" },
      { key: "value", label: "Attributes", sortable: true, emphasis: true },
      { key: "colourCode", label: "Colour", hidden: true },
      { key: "products", label: "Used by products", type: "number" },
    ],
    rowActions: [
      { id: "edit", label: "Edit", kind: "form", permission: "edit" },
      { id: "delete", label: "Delete", permission: "delete", tone: "danger", effect: { remove: true }, confirm: { title: "Delete this value?", description: "A value used by a product cannot be deleted." } },
    ],
    form: {
      title: "Attribute Value",
      fields: [
        { name: "attributeId", label: "Attribute", type: "hidden", fromQuery: "attributeId", required: true },
        { name: "value", label: "Attributes", type: "text", required: true, maxLength: 500 },
      ],
    },
  },
};

Object.assign(resources, {
  "catalog.pendingCategories": {
    title: "Pending Category",
    description: "Categories sellers asked for. Approve makes them live; reject notifies the seller and deletes the request.",
    permission: "catalog.categories",
    search: "Search category",
    searchFields: ["name"],
    defaultSort: "order:asc",
    headerActions: [{ href: "/admin/catalog/categories", label: "Back to categories" }],
    columns: [
      { key: "order", label: "Order", type: "number", sortable: true },
      { key: "image", label: "Image", type: "image" },
      { key: "path", label: "Category", emphasis: true, wrap: true },
      { key: "hsnCode", label: "HSN", type: "mono" },
      { key: "gst", label: "GST", type: "number" },
      seller,
      { key: "status", label: "Status", type: "status" },
    ],
    rowActions: [
      { id: "approve", label: "Approve", permission: "edit", effect: { run: "approve" }, confirm: { title: "Are you sure want to approve category?" } },
      { id: "reject", label: "Reject", permission: "edit", tone: "danger", effect: { run: "reject" }, confirm: { title: "Are you sure want to reject category?", description: "The seller is notified with the reason and the category is deleted.", requireReason: true, reasonType: "3" } },
    ],
  },
  "catalog.pendingBrands": {
    title: "Pending Brand",
    description: "Brands sellers asked for.",
    permission: "catalog.brands",
    search: "Search brand",
    searchFields: ["name"],
    defaultSort: "name:asc",
    headerActions: [{ href: "/admin/catalog/brands", label: "Back to brands" }],
    columns: [
      { key: "image", label: "Image", type: "image" },
      { key: "name", label: "Brand", emphasis: true, sortable: true },
      { key: "document", label: "Brand Document", type: "link", linkLabel: "View document" },
      seller,
      { key: "status", label: "Status", type: "status" },
    ],
    rowActions: queueActions("brand", "4"),
  },
  "catalog.categoryCommission": {
    title: "Category Commission",
    description: "Commission by price range for one category, optionally for chosen sellers. Total Commission = Ad Expense + Office Expense + Profit. Changes are written to the category timeline.",
    permission: "catalog.categories",
    search: "Search seller",
    searchFields: ["sellers"],
    tabs: { field: "status", values: ["Active", "Deactive"] },
    defaultSort: "id:asc",
    headerActions: [{ href: "/admin/catalog/categories", label: "Back to categories" }],
    columns: [
      { key: "category", label: "Category", hidden: true },
      { key: "priceFrom", label: "Price From", type: "currency", sortable: true },
      { key: "priceTo", label: "Price TO", type: "currency", sortable: true },
      { key: "commission", label: "Total Commission (%)", type: "number", sortable: true },
      { key: "adExpense", label: "Ad Expense (%)", type: "number" },
      { key: "officeExpense", label: "Office Expense (%)", type: "number" },
      { key: "profit", label: "Profit (%)", type: "number" },
      { key: "sellers", label: "Seller", wrap: true },
      { key: "status", label: "Status", type: "status" },
    ],
    rowActions: [
      { id: "edit", label: "Edit", kind: "form", permission: "edit" },
      { id: "delete", label: "Delete", permission: "delete", tone: "danger", effect: { remove: true }, confirm: { title: "Are you sure want to delete?" } },
    ],
    form: {
      title: "Commission",
      fields: [
        { name: "categoryId", label: "Category", type: "hidden", fromQuery: "categoryId", required: true },
        { name: "priceFrom", label: "Price Range From", type: "number", required: true, min: 0 },
        { name: "priceTo", label: "Price Range TO", type: "number", required: true, min: 0 },
        { name: "adExpense", label: "Ad Expense", type: "number", min: 0 },
        { name: "officeExpense", label: "Office Expense", type: "number", min: 0 },
        { name: "profit", label: "Profit", type: "number", min: 0, hint: "Total Commission = Ad Expense + Office Expense + Profit." },
        { name: "sellerIds", label: "Seller", type: "multiselect", optionsFrom: "lookup:sellers", hint: "Leave empty for every seller." },
        { name: "status", label: "Status", type: "select", options: ["Active", "Deactive"], required: true, only: "edit" },
      ],
    },
  },
  "catalog.categoryTimeline": {
    title: "Category Timeline",
    description: "Every change to the category and its commission.",
    permission: "catalog.categories",
    search: "Search changes",
    searchFields: ["summary"],
    tabs: { field: "group", values: ["Commission", "Status", "Subcategory", "General", "Meta"] },
    defaultSort: "createdAt:desc",
    headerActions: [{ href: "/admin/catalog/categories", label: "Back to categories" }],
    columns: [
      { key: "createdAt", label: "When", type: "datetime", sortable: true },
      { key: "action", label: "Action", type: "status" },
      { key: "summary", label: "Change", wrap: true, width: 480 },
      { key: "group", label: "Type" },
      { key: "importance", label: "Importance", type: "status" },
      { key: "user", label: "By" },
    ],
  },
});

export const routes = {
  "/admin/catalog/tax-classes/pending": "catalog.pendingTax",
  "/admin/catalog/return-policies/pending": "catalog.pendingReturnPolicies",
  "/admin/catalog/attributes/pending": "catalog.pendingAttributes",
  "/admin/catalog/attribute-sets/pending": "catalog.pendingAttributeSets",
  "/admin/catalog/attribute-values": "catalog.attributeValues",
  "/admin/catalog/categories/pending": "catalog.pendingCategories",
  "/admin/catalog/brands/pending": "catalog.pendingBrands",
  "/admin/catalog/category-commission": "catalog.categoryCommission",
  "/admin/catalog/categories/timeline": "catalog.categoryTimeline",
};

export const live = {
  "catalog.pendingTax": { path: "/catalog/pending-tax", page: "pending_tax.php", permission: "catalog.tax" },
  "catalog.pendingReturnPolicies": { path: "/catalog/pending-return-policies", page: "pending_return_policy.php", permission: "catalog.returnPolicies" },
  "catalog.pendingAttributes": { path: "/catalog/pending-attributes", page: "pending_attribute_conf.php", permission: "catalog.attributes" },
  "catalog.pendingAttributeSets": { path: "/catalog/pending-attribute-sets", page: "pending_attribute_set.php", permission: "catalog.attributes" },
  "catalog.attributeValues": { path: "/catalog/attribute-values", page: "manage_conf_attributes_val.php", permission: "catalog.attributes" },
  "catalog.pendingCategories": { path: "/catalog/pending-categories", page: "pending_category.php", permission: "catalog.categories" },
  "catalog.pendingBrands": { path: "/catalog/pending-brands", page: "pending_brand.php", permission: "catalog.brands" },
  "catalog.categoryCommission": { path: "/catalog/category-commission", page: "commission.php", permission: "catalog.categories" },
  "catalog.categoryTimeline": { path: "/catalog/category-timeline", page: "category.php", permission: "catalog.categories" },
};

export const pages = {};

export const livePaths = Object.keys(routes);
