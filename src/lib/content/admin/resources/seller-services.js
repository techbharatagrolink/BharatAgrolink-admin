/**
 * Admin section "Seller Services": service charges and seller requests
 * (API: /admin/seller-services/charges and /admin/seller-services/requests). The seller panel's product listing price
 * is NRV + the charges of the seller's Active services. These screens are
 * separate from the NRV pricing calculator and product price summary, which
 * they do not change; payouts are not affected either.
 */
export const sellerServiceResources = {
  "sellerServices.charges": {
    title: "Seller Service Charges",
    description: "Charge for each seller service: % of NRV or a fixed ₹ per unit. Added to the seller's product listing price (NRV + charges) only while the seller's service is Active. Does not change the NRV pricing calculator, payouts or website prices.",
    permission: "sellerServices",
    collection: "sellerServiceCharges",
    api: "GET / POST / PUT /api/admin/seller-services/charges",
    search: "Search service",
    searchFields: ["name", "code"],
    filterFields: ["category", "chargeType", "status"],
    defaultSort: "id:asc",
    columns: [
      { key: "name", label: "Service", emphasis: true, sub: "code" },
      { key: "category", label: "Category" },
      { key: "charge", label: "Charge" },
      { key: "chargeType", label: "Type" },
      { key: "activeSellers", label: "Active sellers", type: "number" },
      { key: "notActiveSellers", label: "Not active", type: "number" },
      { key: "status", label: "Offered", type: "status" },
      { key: "updatedAt", label: "Updated", type: "date", sortable: true },
      { key: "updatedBy", label: "By" },
    ],
    // Click a service to see which sellers have it (and switch them on or off) in the requests list.
    rowHref: "/admin/seller-services/requests?service={name}",
    rowActions: [
      { id: "edit", label: "Edit charge", kind: "form", permission: "edit", sensitive: true },
      { id: "sellers", label: "View sellers", href: "/admin/seller-services/requests?service={name}" },
      {
        id: "activateAll",
        label: "Activate for all sellers",
        permission: "edit",
        when: { field: "status", in: ["Active"] },
        confirm: { title: "Activate this service for every seller?", description: "Every seller gets the service as Active, including sellers who ended or were rejected. Its charge is added to the listing price of products that select it.", confirmLabel: "Activate for all" },
      },
    ],
    form: {
      fields: [
        { name: "name", label: "Service name", type: "text", required: true, only: "new", maxLength: 120 },
        { name: "serviceCode", label: "Service code", type: "text", required: true, only: "new", maxLength: 40, help: "Lowercase with hyphens, e.g. soil-testing. Cannot be changed later." },
        { name: "category", label: "Category", type: "text", required: true, only: "new", maxLength: 40 },
        { name: "chargeType", label: "Charge type", type: "select", options: ["% of NRV", "₹ per unit"], required: true },
        { name: "chargeValue", label: "Charge (% or ₹ per unit)", type: "number", required: true, min: 0, step: "0.01" },
        { name: "status", label: "Offered to sellers", type: "select", options: ["Active", "Inactive"], required: true },
        { name: "notes", label: "Notes", type: "textarea", maxLength: 500 },
      ],
      requireReason: true,
    },
  },
  "sellerServices.requests": {
    title: "Seller Service Requests",
    description: "Sellers request services from their Services page. Approving makes the service Active: its charge is added to that seller's product listing price. Reject or end with a reason (the seller sees it).",
    permission: "sellerServices",
    collection: "sellerServiceRequests",
    api: "GET /api/admin/seller-services/requests · POST …/actions/approve|reject|end",
    search: "Search seller or service",
    searchFields: ["seller", "sellerCode", "service"],
    filterFields: ["status", "category"],
    filters: [
      { key: "service", label: "Service", optionsFrom: "lookup:seller-services" },
      { key: "category", label: "Category", options: ["Logistics", "Marketing", "Catalog Support", "Agronomist Support", "B2B Support"] },
    ],
    tabs: { field: "status", values: ["Active", "Requested", "Ended", "Rejected"] },
    defaultSort: "requestedAt:desc",
    dateField: "requestedAt",
    columns: [
      { key: "seller", label: "Seller", emphasis: true, sub: "sellerCode" },
      { key: "service", label: "Service", sub: "category" },
      { key: "charge", label: "Charge" },
      { key: "status", label: "Status", type: "status" },
      { key: "ticket", label: "Ticket", type: "mono" },
      { key: "requestedAt", label: "Requested", type: "date", sortable: true },
      { key: "decidedAt", label: "Decided", type: "date", sortable: true },
      { key: "note", label: "Note" },
    ],
    bulkActions: [
      { id: "approve", label: "Activate selected", permission: "edit", confirm: { title: "Activate the {count} selected sellers?", description: "Sellers who already have the service Active are skipped.", confirmLabel: "Activate" } },
    ],
    rowActions: [
      {
        id: "approve",
        label: "Activate (make Active)",
        permission: "edit",
        effect: { set: { status: "Active", note: "" } },
        when: { field: "status", in: ["Requested", "Ended", "Rejected", "Inactive"] },
        confirm: { title: "Make this service Active for this seller?", description: "Its charge is added to the seller's product listing price from now on." },
      },
      { id: "reject", label: "Reject", permission: "edit", tone: "danger", effect: { set: { status: "Rejected" } }, when: { field: "status", in: ["Requested"] }, confirm: { title: "Reject this request?", requireReason: true } },
      { id: "end", label: "Inactivate / End service", permission: "edit", tone: "danger", effect: { set: { status: "Ended" } }, when: { field: "status", in: ["Active"] }, confirm: { title: "Inactivate this service for this seller?", description: "This service will become inactive for this seller and stop being added to their listing price.", requireReason: true } },
    ],
  },
};
