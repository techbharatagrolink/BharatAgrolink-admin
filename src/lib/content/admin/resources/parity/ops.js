/**
 * Screens for the ops PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */
export const resources = {
  "shipping.delhivery": {
    title: "Delhivery Orders",
    description: "Shipments booked on Delhivery. A cancelled_at date shows the shipment as Cancelled.",
    permission: "shipping.delhivery",
    search: "Waybill, order ID, invoice or vendor ID",
    dateRange: "Created",
    exportable: true,
    tabs: { field: "status", values: ["Accepted", "Pending", "Success", "Manifested", "Not Picked", "Dispatched", "In Transit", "Delivered", "RTO", "Fail", "Cancelled"] },
    defaultSort: "createdAt:desc",
    columns: [
      { key: "waybill", label: "Waybill", type: "mono", sortable: true, href: "https://www.delhivery.com/track/package/{waybill}" },
      { key: "orderId", label: "Order ID", type: "mono", sortable: true, href: "/admin/orders/{orderId}" },
      { key: "vendorId", label: "Vendor ID", type: "mono" },
      { key: "status", label: "Status", type: "status" },
      { key: "invoiceNumber", label: "Invoice", type: "mono" },
      { key: "warehouse", label: "Warehouse", wrap: true },
      { key: "freight", label: "Freight Charges", type: "currency", sortable: true },
      { key: "trackingUrl", label: "Tracking URL", hidden: true },
      { key: "createdAt", label: "Created", type: "datetime", sortable: true },
      { key: "cancelledAt", label: "Cancelled", type: "datetime", hidden: true },
    ],
    rowActions: [
      { id: "track", label: "Track", permission: "view", href: "/admin/shipping/delhivery/track/{id}" },
      { id: "label", label: "Label", permission: "view", href: "/admin/shipping/delhivery/label/{waybill}", when: { field: "status", notIn: ["Cancelled"] } },
      {
        id: "cancel",
        label: "Cancel shipment",
        permission: "edit",
        tone: "danger",
        effect: { run: "cancel" },
        when: { field: "status", notIn: ["Cancelled"] },
        confirm: { title: "Cancel this shipment?", description: "Delhivery is asked to cancel the waybill. On success the shipment is marked Cancelled and the order lines go back to Placed." },
      },
    ],
  },
  "shipping.pickupRequests": {
    title: "Pickup Update",
    description: "Vendor requests to change a pickup location. Reply with an approval or rejection; the reply is shown to the vendor.",
    permission: "shipping.pickupRequests",
    search: "Vendor company, name or vendor ID",
    dateRange: "Requested",
    exportable: true,
    tabs: { field: "status", values: ["Pending", "Approved", "Rejected"] },
    defaultSort: "createdAt:desc",
    columns: [
      { key: "pickupLocation", label: "Pickup location", emphasis: true, sub: "pickupLocationId", sortable: true },
      { key: "vendorName", label: "Vendor", sub: "vendorId", sortable: true },
      { key: "message", label: "Request message", wrap: true, width: 260 },
      { key: "status", label: "Status", type: "status" },
      { key: "adminReply", label: "Admin reply", wrap: true, width: 220 },
      { key: "repliedBy", label: "Replied by" },
      { key: "repliedAt", label: "Replied on", type: "datetime" },
      { key: "createdAt", label: "Requested on", type: "datetime", sortable: true },
    ],
    rowActions: [
      {
        id: "approve",
        label: "Approve",
        permission: "edit",
        effect: { set: { status: "Approved" } },
        when: { field: "status", in: ["Pending"] },
        confirm: { title: "Approve request?", description: "Write the reply the vendor will see.", requireReason: true, confirmLabel: "Submit reply" },
      },
      {
        id: "reject",
        label: "Reject",
        permission: "edit",
        tone: "danger",
        effect: { set: { status: "Rejected" } },
        when: { field: "status", in: ["Pending"] },
        confirm: { title: "Reject request?", description: "Write the reply the vendor will see.", requireReason: true, confirmLabel: "Submit reply" },
      },
    ],
  },
  "b2b.opsQueue": {
    title: "Operations Queue",
    description: "SLA-sorted work queue. Highest value and oldest first.",
    permission: "b2b.opsQueue",
    search: "Order no or buyer",
    exportable: true,
    filters: [{ key: "payment", label: "Payment", options: ["Paid", "Partial", "Pending"] }],
    tabs: { field: "status", values: ["Payment cleared / new", "Processing", "Packed", "Dispatched", "In transit"] },
    defaultSort: "queue:desc",
    columns: [
      { key: "orderNumber", label: "Order", type: "mono", href: "/admin/b2b/orders/{orderNumber}" },
      { key: "buyer", label: "Buyer", emphasis: true, sub: "businessName" },
      { key: "lines", label: "Lines", type: "number" },
      { key: "value", label: "Value", type: "currency", sortable: true },
      { key: "weightKg", label: "Weight (kg)", type: "number", sortable: true },
      { key: "dispatchBy", label: "Dispatch By", type: "date", sortable: true },
      { key: "payment", label: "Payment", type: "status" },
      { key: "status", label: "Stage", type: "status" },
      { key: "awb", label: "AWB", type: "mono", sub: "courier", href: "https://ship.bharatagrolink.com/track/{awb}" },
      { key: "createdAt", label: "Age", type: "datetime", sortable: true },
    ],
    rowActions: [
      { id: "view", label: "View order", permission: "view", href: "/admin/b2b/orders/{orderNumber}" },
      { id: "label", label: "Shipping label", permission: "view", href: "/admin/b2b/ops-queue/label/{orderNumber}" },
    ],
  },
  "b2b.logistics": {
    title: "B2B Logistics",
    description: "Shipments awaiting booking, pickup or in flight. Freight is reconciled estimate against actual.",
    permission: "b2b.logistics",
    search: "AWB/LR, carrier or order",
    exportable: true,
    filters: [{ key: "mode", label: "Mode", options: ["Courier", "Surface cargo", "PTL", "FTL", "Transporter"] }],
    tabs: { field: "status", values: ["Created", "Pickup scheduled", "Picked", "In transit", "Delayed", "Out for delivery", "Delivered", "RTO"] },
    defaultSort: "id:desc",
    columns: [
      { key: "orderNumber", label: "Order", type: "mono", href: "/admin/b2b/orders/{orderId}" },
      { key: "buyer", label: "Buyer", emphasis: true, sub: "businessName" },
      { key: "carrier", label: "Carrier" },
      { key: "mode", label: "Mode" },
      { key: "awb", label: "AWB / LR", type: "mono", href: "https://ship.bharatagrolink.com/track/{awb}" },
      { key: "chargeableKg", label: "Chg. kg", type: "number", sortable: true },
      { key: "freightEstimate", label: "Est. Freight", type: "currency", sortable: true },
      { key: "freightActual", label: "Actual", type: "currency", sortable: true },
      { key: "eta", label: "ETA", type: "datetime", sortable: true },
      { key: "status", label: "Status", type: "status" },
    ],
    rowActions: [{ id: "view", label: "View order", permission: "view", href: "/admin/b2b/orders/{orderId}" }],
  },
};

export const routes = {
  "/admin/shipping/delhivery": "shipping.delhivery",
  "/admin/shipping/pickup-requests": "shipping.pickupRequests",
  "/admin/b2b/ops-queue": "b2b.opsQueue",
  "/admin/b2b/logistics": "b2b.logistics",
};

export const live = {
  "shipping.delhivery": { path: "/shipping/delhivery-orders", page: "shipment_order_delhivery.php", permission: "shipping.delhivery" },
  "shipping.pickupRequests": { path: "/shipping/pickup-requests", page: "manage_pickup_requests.php", permission: "shipping.pickupRequests" },
  "b2b.opsQueue": { path: "/b2b/ops-queue", page: "b2b_orders/ops_queue.php", permission: "b2b.opsQueue" },
  "b2b.logistics": { path: "/b2b/logistics", page: "b2b_orders/logistics.php", permission: "b2b.logistics" },
};

export const pages = {
  "orders.delivered": ["master_delivered_orders.php"],
  "shipping.delhiveryPincodes": ["servicebilty_delhivery.php"],
  "shipping.pickupAddresses": ["pickup_addresses.php"],
  "operations.overall": ["operations_team/overall_report.php"],
};

export const livePaths = [
  "/admin/shipping/delhivery",
  "/admin/orders/delivered",
  "/admin/shipping/delhivery-serviceability",
  "/admin/shipping/pickup-addresses",
  "/admin/shipping/pickup-requests",
  "/admin/b2b/ops-queue",
  "/admin/b2b/logistics",
  "/admin/operations/team/overall",
];
