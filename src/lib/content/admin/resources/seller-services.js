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
    api: "GET / PUT /api/admin/seller-services/charges",
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
      { key: "status", label: "Offered", type: "status" },
      { key: "updatedAt", label: "Updated", type: "date", sortable: true },
      { key: "updatedBy", label: "By" },
    ],
    rowActions: [{ id: "edit", label: "Edit charge", kind: "form", permission: "edit", sensitive: true }],
    form: {
      fields: [
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
    tabs: { field: "status", values: ["Requested", "Active", "Rejected", "Ended"] },
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
    rowActions: [
      {
        id: "approve",
        label: "Approve (make Active)",
        permission: "edit",
        effect: { set: { status: "Active", note: "" } },
        when: { field: "status", in: ["Requested", "Ended", "Rejected"] },
        confirm: { title: "Make this service Active?", description: "Its charge is added to the seller's product listing price from now on." },
      },
      { id: "reject", label: "Reject", permission: "edit", tone: "danger", effect: { set: { status: "Rejected" } }, when: { field: "status", in: ["Requested"] }, confirm: { title: "Reject this request?", requireReason: true } },
      { id: "end", label: "End service", permission: "edit", tone: "danger", effect: { set: { status: "Ended" } }, when: { field: "status", in: ["Active"] }, confirm: { title: "End this service?", description: "Its charge stops being added to the seller's listing price.", requireReason: true } },
    ],
  },
};
