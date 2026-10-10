module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/content/admin/resources/parity/seller.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Screens for the seller PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const resources = {};
const routes = {};
const live = {};
const pages = {
    "vendors.add": [
        "add_seller.php"
    ],
    "catalog.featureCategories": [
        "feature_category.php"
    ],
    "catalog.cropMenu": [
        "shop_topics.php"
    ],
    "dashboard.productOverview": [
        "product_dashboard.php"
    ],
    "b2b.catalog": [
        "b2b_orders/catalog.php"
    ],
    "b2b.approvals": [
        "b2b_orders/approvals.php"
    ],
    "b2b.reports": [
        "b2b_orders/reports.php"
    ]
};
const livePaths = [
    "/admin/vendors/new",
    "/admin/catalog/feature-categories",
    "/admin/catalog/crop-menu",
    "/admin/dashboards/product-overview",
    "/admin/b2b/catalog",
    "/admin/b2b/approvals",
    "/admin/b2b/reports"
];
}),
"[project]/src/lib/content/admin/resources/parity/marketing.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Screens for the marketing PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const resources = {};
const routes = {};
const live = {};
const pages = {
    marketing: [
        "social_media_dashboard.php"
    ],
    "marketing.expenses": [
        "marketing_expenses.php"
    ],
    "marketing.engagement": [
        "engagement_panel.php"
    ],
    "dashboard.ceo": [
        "ceo_decision_matrix.php"
    ],
    "dashboard.business": [
        "main_dashboard.php"
    ],
    "finance.fraud": [
        "fraud_analysis_dashboard.php"
    ],
    "cms.seo": [
        "meta.php"
    ]
};
const livePaths = [
    "/admin/marketing",
    "/admin/marketing/expenses",
    "/admin/marketing/engagement",
    "/admin/ceo-matrix",
    "/admin/dashboards/business",
    "/admin/finance/fraud",
    "/admin/cms/seo"
];
}),
"[project]/src/lib/content/admin/resources/parity/crm.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Screens for the crm PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const resources = {};
const routes = {};
const live = {};
const pages = {
    "crm.addLead": [
        "add_lead.php"
    ],
    "crm.convert": [
        "manage_engagement_leads.php"
    ],
    "crm.agentLeads": [
        "sales_agent_leads.php"
    ],
    "crm.unassigned": [
        "pending_leads.php"
    ],
    "crm.dead": [
        "dead_leads.php"
    ],
    "crm.tracking": [
        "customer_search_tracking.php"
    ],
    "crm.requested": [
        "report_requested_leads.php"
    ],
    "sales.myPerformance": [
        "my_sales_performance.php"
    ],
    "sales.teamPerformance": [
        "sales_performance_report.php"
    ]
};
const livePaths = [
    "/admin/crm/add-lead",
    "/admin/crm/convert",
    "/admin/crm/agent-leads",
    "/admin/crm/unassigned",
    "/admin/crm/dead",
    "/admin/crm/customer-tracking",
    "/admin/crm/requested",
    "/admin/sales/my-performance",
    "/admin/sales/team-performance"
];
}),
"[project]/src/lib/content/admin/resources/parity/ops.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Screens for the ops PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const resources = {
    "shipping.delhivery": {
        title: "Delhivery Orders",
        description: "Shipments booked on Delhivery. A cancelled_at date shows the shipment as Cancelled.",
        permission: "shipping.delhivery",
        search: "Waybill, order ID, invoice or vendor ID",
        dateRange: "Created",
        exportable: true,
        tabs: {
            field: "status",
            values: [
                "Accepted",
                "Pending",
                "Success",
                "Manifested",
                "Not Picked",
                "Dispatched",
                "In Transit",
                "Delivered",
                "RTO",
                "Fail",
                "Cancelled"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "waybill",
                label: "Waybill",
                type: "mono",
                sortable: true,
                href: "https://www.delhivery.com/track/package/{waybill}"
            },
            {
                key: "orderId",
                label: "Order ID",
                type: "mono",
                sortable: true,
                href: "/admin/orders/{orderId}"
            },
            {
                key: "vendorId",
                label: "Vendor ID",
                type: "mono"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "invoiceNumber",
                label: "Invoice",
                type: "mono"
            },
            {
                key: "warehouse",
                label: "Warehouse",
                wrap: true
            },
            {
                key: "freight",
                label: "Freight Charges",
                type: "currency",
                sortable: true
            },
            {
                key: "trackingUrl",
                label: "Tracking URL",
                hidden: true
            },
            {
                key: "createdAt",
                label: "Created",
                type: "datetime",
                sortable: true
            },
            {
                key: "cancelledAt",
                label: "Cancelled",
                type: "datetime",
                hidden: true
            }
        ],
        rowActions: [
            {
                id: "track",
                label: "Track",
                permission: "view",
                href: "/admin/shipping/delhivery/track/{id}"
            },
            {
                id: "label",
                label: "Label",
                permission: "view",
                href: "/admin/shipping/delhivery/label/{waybill}",
                when: {
                    field: "status",
                    notIn: [
                        "Cancelled"
                    ]
                }
            },
            {
                id: "cancel",
                label: "Cancel shipment",
                permission: "edit",
                tone: "danger",
                effect: {
                    run: "cancel"
                },
                when: {
                    field: "status",
                    notIn: [
                        "Cancelled"
                    ]
                },
                confirm: {
                    title: "Cancel this shipment?",
                    description: "Delhivery is asked to cancel the waybill. On success the shipment is marked Cancelled and the order lines go back to Placed."
                }
            }
        ]
    },
    "shipping.pickupRequests": {
        title: "Pickup Update",
        description: "Vendor requests to change a pickup location. Reply with an approval or rejection; the reply is shown to the vendor.",
        permission: "shipping.pickupRequests",
        search: "Vendor company, name or vendor ID",
        dateRange: "Requested",
        exportable: true,
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Approved",
                "Rejected"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "pickupLocation",
                label: "Pickup location",
                emphasis: true,
                sub: "pickupLocationId",
                sortable: true
            },
            {
                key: "vendorName",
                label: "Vendor",
                sub: "vendorId",
                sortable: true
            },
            {
                key: "message",
                label: "Request message",
                wrap: true,
                width: 260
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "adminReply",
                label: "Admin reply",
                wrap: true,
                width: 220
            },
            {
                key: "repliedBy",
                label: "Replied by"
            },
            {
                key: "repliedAt",
                label: "Replied on",
                type: "datetime"
            },
            {
                key: "createdAt",
                label: "Requested on",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Approved"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Approve request?",
                    description: "Write the reply the vendor will see.",
                    requireReason: true,
                    confirmLabel: "Submit reply"
                }
            },
            {
                id: "reject",
                label: "Reject",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Rejected"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Reject request?",
                    description: "Write the reply the vendor will see.",
                    requireReason: true,
                    confirmLabel: "Submit reply"
                }
            }
        ]
    },
    "b2b.opsQueue": {
        title: "Operations Queue",
        description: "SLA-sorted work queue. Highest value and oldest first.",
        permission: "b2b.opsQueue",
        search: "Order no or buyer",
        exportable: true,
        filters: [
            {
                key: "payment",
                label: "Payment",
                options: [
                    "Paid",
                    "Partial",
                    "Pending"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Payment cleared / new",
                "Processing",
                "Packed",
                "Dispatched",
                "In transit"
            ]
        },
        defaultSort: "queue:desc",
        columns: [
            {
                key: "orderNumber",
                label: "Order",
                type: "mono",
                href: "/admin/b2b/orders/{orderNumber}"
            },
            {
                key: "buyer",
                label: "Buyer",
                emphasis: true,
                sub: "businessName"
            },
            {
                key: "lines",
                label: "Lines",
                type: "number"
            },
            {
                key: "value",
                label: "Value",
                type: "currency",
                sortable: true
            },
            {
                key: "weightKg",
                label: "Weight (kg)",
                type: "number",
                sortable: true
            },
            {
                key: "dispatchBy",
                label: "Dispatch By",
                type: "date",
                sortable: true
            },
            {
                key: "payment",
                label: "Payment",
                type: "status"
            },
            {
                key: "status",
                label: "Stage",
                type: "status"
            },
            {
                key: "awb",
                label: "AWB",
                type: "mono",
                sub: "courier",
                href: "https://ship.bharatagrolink.com/track/{awb}"
            },
            {
                key: "createdAt",
                label: "Age",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View order",
                permission: "view",
                href: "/admin/b2b/orders/{orderNumber}"
            },
            {
                id: "label",
                label: "Shipping label",
                permission: "view",
                href: "/admin/b2b/ops-queue/label/{orderNumber}"
            }
        ]
    },
    "b2b.logistics": {
        title: "B2B Logistics",
        description: "Shipments awaiting booking, pickup or in flight. Freight is reconciled estimate against actual.",
        permission: "b2b.logistics",
        search: "AWB/LR, carrier or order",
        exportable: true,
        filters: [
            {
                key: "mode",
                label: "Mode",
                options: [
                    "Courier",
                    "Surface cargo",
                    "PTL",
                    "FTL",
                    "Transporter"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Created",
                "Pickup scheduled",
                "Picked",
                "In transit",
                "Delayed",
                "Out for delivery",
                "Delivered",
                "RTO"
            ]
        },
        defaultSort: "id:desc",
        columns: [
            {
                key: "orderNumber",
                label: "Order",
                type: "mono",
                href: "/admin/b2b/orders/{orderId}"
            },
            {
                key: "buyer",
                label: "Buyer",
                emphasis: true,
                sub: "businessName"
            },
            {
                key: "carrier",
                label: "Carrier"
            },
            {
                key: "mode",
                label: "Mode"
            },
            {
                key: "awb",
                label: "AWB / LR",
                type: "mono",
                href: "https://ship.bharatagrolink.com/track/{awb}"
            },
            {
                key: "chargeableKg",
                label: "Chg. kg",
                type: "number",
                sortable: true
            },
            {
                key: "freightEstimate",
                label: "Est. Freight",
                type: "currency",
                sortable: true
            },
            {
                key: "freightActual",
                label: "Actual",
                type: "currency",
                sortable: true
            },
            {
                key: "eta",
                label: "ETA",
                type: "datetime",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View order",
                permission: "view",
                href: "/admin/b2b/orders/{orderId}"
            }
        ]
    }
};
const routes = {
    "/admin/shipping/delhivery": "shipping.delhivery",
    "/admin/shipping/pickup-requests": "shipping.pickupRequests",
    "/admin/b2b/ops-queue": "b2b.opsQueue",
    "/admin/b2b/logistics": "b2b.logistics"
};
const live = {
    "shipping.delhivery": {
        path: "/shipping/delhivery-orders",
        page: "shipment_order_delhivery.php",
        permission: "shipping.delhivery"
    },
    "shipping.pickupRequests": {
        path: "/shipping/pickup-requests",
        page: "manage_pickup_requests.php",
        permission: "shipping.pickupRequests"
    },
    "b2b.opsQueue": {
        path: "/b2b/ops-queue",
        page: "b2b_orders/ops_queue.php",
        permission: "b2b.opsQueue"
    },
    "b2b.logistics": {
        path: "/b2b/logistics",
        page: "b2b_orders/logistics.php",
        permission: "b2b.logistics"
    }
};
const pages = {
    "orders.delivered": [
        "master_delivered_orders.php"
    ],
    "shipping.delhiveryPincodes": [
        "servicebilty_delhivery.php"
    ],
    "shipping.pickupAddresses": [
        "pickup_addresses.php"
    ],
    "operations.overall": [
        "operations_team/overall_report.php"
    ]
};
const livePaths = [
    "/admin/shipping/delhivery",
    "/admin/orders/delivered",
    "/admin/shipping/delhivery-serviceability",
    "/admin/shipping/pickup-addresses",
    "/admin/shipping/pickup-requests",
    "/admin/b2b/ops-queue",
    "/admin/b2b/logistics",
    "/admin/operations/team/overall"
];
}),
"[project]/src/lib/content/admin/resources/parity/support-admin.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Support / hiring / staff parity screens (chat_logs.php, requirement_requests.php,
 * product_review.php, vacancies.php, vacancy_applications.php, add-staff.php,
 * signup_modal_settings.php, script_settings.php).
 */ __turbopack_context__.s([
    "APPLICATION_STATUSES",
    ()=>APPLICATION_STATUSES,
    "BADGE_COLORS",
    ()=>BADGE_COLORS,
    "DEPARTMENTS",
    ()=>DEPARTMENTS,
    "JOB_TYPES",
    ()=>JOB_TYPES,
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const DEPARTMENTS = [
    {
        value: "Sales",
        label: "Sales"
    },
    {
        value: "Marketing",
        label: "Marketing"
    },
    {
        value: "Advisory",
        label: "Agriculture / Advisory"
    },
    {
        value: "Technology",
        label: "Technology & Engineering"
    },
    {
        value: "Operations",
        label: "Operations & Supply Chain"
    },
    {
        value: "Customer Support",
        label: "Customer Support"
    },
    {
        value: "Human Resources",
        label: "Human Resources (HR)"
    },
    {
        value: "Finance & Accounts",
        label: "Finance & Accounts"
    },
    {
        value: "Product & Design",
        label: "Product & Design"
    }
];
const JOB_TYPES = [
    "Full Time",
    "Part Time",
    "Remote",
    "Hybrid",
    "Contract",
    "Internship"
];
const BADGE_COLORS = [
    {
        value: "sales",
        label: "Sales (green)"
    },
    {
        value: "marketing",
        label: "Marketing (orange)"
    },
    {
        value: "advisory",
        label: "Advisory (teal)"
    },
    {
        value: "technology",
        label: "Technology (blue)"
    },
    {
        value: "operations",
        label: "Operations (purple)"
    },
    {
        value: "info",
        label: "General (blue)"
    }
];
const APPLICATION_STATUSES = [
    "New",
    "Reviewed",
    "Shortlisted",
    "Interviewed",
    "Selected",
    "Rejected"
];
const deleteAction = {
    id: "delete",
    label: "Delete",
    permission: "delete",
    tone: "danger",
    effect: {
        remove: true
    },
    confirm: {
        title: "Are you sure want to delete?",
        description: "This cannot be undone."
    }
};
const resources = {
    "support.chatLogs": {
        title: "Chatbot Logs",
        description: "Chatbot conversations grouped by session. Open a session to read the messages and record a review.",
        permission: "support.chatLogs",
        search: "Type to filter the selected column…",
        dateRange: true,
        exportable: true,
        columns: [
            {
                key: "sessionId",
                label: "Session ID",
                type: "mono",
                sortable: true,
                sub: "region",
                width: 260
            },
            {
                key: "messages",
                label: "Messages",
                type: "number",
                sortable: true
            },
            {
                key: "firstIntent",
                label: "First Intent",
                sortable: true
            },
            {
                key: "lastMessageAt",
                label: "Last Message",
                type: "datetime",
                sortable: true
            },
            {
                key: "startedAt",
                label: "Session Started",
                type: "datetime",
                sortable: true
            },
            {
                key: "conversation",
                label: "Conversation",
                type: "status"
            },
            {
                key: "feedback",
                label: "Feedback",
                wrap: true,
                width: 280
            }
        ],
        filters: [
            {
                key: "conversation",
                label: "Conversation",
                options: [
                    "Yes",
                    "No"
                ]
            },
            {
                key: "column",
                label: "Column",
                options: [
                    "Session ID",
                    "Region",
                    "First Intent"
                ]
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View conversation",
                permission: "view",
                href: "/admin/support/chat-logs?view={id}"
            }
        ]
    },
    "support.requirements": {
        title: "Requirement Requests",
        description: "Requirement forms submitted from the website.",
        permission: "support.requirements",
        search: "Search name, mobile, crop problem…",
        dateRange: true,
        exportable: true,
        columns: [
            {
                key: "id",
                label: "ID",
                type: "number",
                sortable: true
            },
            {
                key: "name",
                label: "Name",
                sortable: true
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mono"
            },
            {
                key: "cropProblem",
                label: "Crop Problem",
                wrap: true,
                width: 280
            },
            {
                key: "additionalInfo",
                label: "Additional Info",
                wrap: true,
                width: 280
            },
            {
                key: "createdAt",
                label: "Submitted Date",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View details",
                permission: "view",
                href: "/admin/support/requirements?view={id}"
            }
        ]
    },
    "customers.pendingReviews": {
        title: "Pending Reviews",
        description: "Product reviews waiting for approval. Approving recalculates the product rating.",
        permission: "customers.pendingReviews",
        search: "Search customer, product, title…",
        dateRange: true,
        exportable: true,
        columns: [
            {
                key: "customer",
                label: "User Name",
                sortable: true
            },
            {
                key: "product",
                label: "Product",
                sortable: true,
                wrap: true,
                width: 280
            },
            {
                key: "title",
                label: "Title",
                wrap: true,
                width: 240
            },
            {
                key: "rating",
                label: "Rating",
                type: "number",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Submitted",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View review",
                permission: "view",
                href: "/admin/customers/reviews/pending?view={id}"
            },
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                confirm: {
                    title: "Are you sure want to approve?",
                    description: "The review goes live and the product rating is recalculated."
                }
            },
            deleteAction
        ],
        bulkActions: [
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                confirm: {
                    title: "Are you sure want to approve?",
                    description: "The selected reviews go live and product ratings are recalculated."
                }
            },
            deleteAction
        ]
    },
    "hiring.vacancies": {
        title: "Hiring Vacancies",
        description: "Job openings shown on the Careers page. Active openings are listed first, then by display order.",
        permission: "hiring.vacancies",
        search: "Search title, location, description…",
        exportable: true,
        columns: [
            {
                key: "displayOrder",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "title",
                label: "Job Title",
                sortable: true,
                sub: "slug",
                width: 280
            },
            {
                key: "departmentLabel",
                label: "Department",
                sortable: true
            },
            {
                key: "location",
                label: "Location / Mode"
            },
            {
                key: "jobType",
                label: "Type",
                sub: "experience"
            },
            {
                key: "openings",
                label: "Openings",
                type: "number",
                sortable: true
            },
            {
                key: "applications",
                label: "Applications",
                type: "number",
                sortable: true,
                href: "/admin/hiring/applications?vacancyId={id}"
            },
            {
                key: "status",
                label: "Status",
                type: "status",
                labels: {
                    Active: "Active (Hiring)",
                    Closed: "Closed (Hidden)"
                }
            }
        ],
        filters: [
            {
                key: "department",
                label: "Department",
                options: DEPARTMENTS
            },
            {
                key: "status",
                label: "Status",
                options: [
                    "Active",
                    "Closed"
                ]
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                permission: "edit",
                kind: "form"
            },
            {
                id: "activate",
                label: "Mark Active (Hiring)",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Active"
                    ]
                }
            },
            {
                id: "close",
                label: "Mark Closed (Hidden)",
                permission: "edit",
                effect: {
                    set: {
                        status: "Closed"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                }
            },
            {
                ...deleteAction,
                confirm: {
                    title: "Are you sure want to delete this vacancy?",
                    description: "Applications already received are kept."
                }
            }
        ],
        form: {
            title: "Vacancy",
            fields: [
                {
                    name: "title",
                    label: "Job Title",
                    type: "text",
                    required: true,
                    maxLength: 255
                },
                {
                    name: "department",
                    label: "Department",
                    type: "select",
                    required: true,
                    options: DEPARTMENTS
                },
                {
                    name: "location",
                    label: "Location / Work Mode",
                    type: "text",
                    required: true,
                    maxLength: 255
                },
                {
                    name: "jobType",
                    label: "Job Type",
                    type: "select",
                    required: true,
                    options: JOB_TYPES
                },
                {
                    name: "experience",
                    label: "Experience Required",
                    type: "text",
                    maxLength: 100
                },
                {
                    name: "openings",
                    label: "Number of Openings",
                    type: "number",
                    min: 1
                },
                {
                    name: "badgeColor",
                    label: "Badge Color (empty = from department)",
                    type: "select",
                    options: BADGE_COLORS
                },
                {
                    name: "iconClass",
                    label: "Icon Class (Font Awesome)",
                    type: "text",
                    maxLength: 100
                },
                {
                    name: "summaryPoints",
                    label: "Card Bullet Highlights (one per line)",
                    type: "textarea",
                    required: true,
                    maxLength: 65535
                },
                {
                    name: "description",
                    label: "Detailed Job Description",
                    type: "textarea",
                    maxLength: 1000000
                },
                {
                    name: "requirements",
                    label: "Requirements (one per line)",
                    type: "textarea",
                    maxLength: 65535
                },
                {
                    name: "salaryRange",
                    label: "Salary Range",
                    type: "text",
                    maxLength: 100
                },
                {
                    name: "contactEmail",
                    label: "Contact Email",
                    type: "email",
                    maxLength: 255
                },
                {
                    name: "displayOrder",
                    label: "Display Order",
                    type: "number"
                },
                {
                    name: "statusCode",
                    label: "Status",
                    type: "select",
                    required: true,
                    options: [
                        {
                            value: "1",
                            label: "Active (Hiring)"
                        },
                        {
                            value: "0",
                            label: "Closed (Hidden)"
                        }
                    ]
                }
            ]
        }
    },
    "hiring.applications": {
        title: "Job Applications",
        description: "Resumes and candidate details submitted from the Careers page.",
        permission: "hiring.applications",
        search: "Name, Email, Phone, Title…",
        exportable: true,
        noAdd: true,
        columns: [
            {
                key: "id",
                label: "#",
                type: "number",
                sortable: true
            },
            {
                key: "fullName",
                label: "Applicant",
                sortable: true,
                sub: "email",
                width: 240
            },
            {
                key: "phone",
                label: "Phone",
                type: "mono"
            },
            {
                key: "jobTitle",
                label: "Applied For",
                sortable: true,
                sub: "vacancyTitle",
                width: 240
            },
            {
                key: "experience",
                label: "Experience / Location",
                sub: "currentLocation"
            },
            {
                key: "resume",
                label: "Resume",
                href: "{resumeUrl}"
            },
            {
                key: "createdAt",
                label: "Applied Date",
                type: "datetime",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status",
                sortable: true
            }
        ],
        filters: [
            {
                key: "vacancyId",
                label: "Role / Vacancy",
                options: []
            },
            {
                key: "status",
                label: "Status",
                options: APPLICATION_STATUSES
            }
        ],
        rowActions: [
            {
                id: "view",
                label: "View application",
                permission: "view",
                href: "/admin/hiring/applications?view={id}"
            },
            {
                id: "edit",
                label: "Update status",
                permission: "edit",
                kind: "form"
            },
            {
                ...deleteAction,
                confirm: {
                    title: "Are you sure want to delete this application?",
                    description: "The uploaded resume file is deleted as well."
                }
            }
        ],
        form: {
            title: "Application status",
            fields: [
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    required: true,
                    options: APPLICATION_STATUSES
                },
                {
                    name: "adminNotes",
                    label: "Admin Notes",
                    type: "textarea",
                    maxLength: 65535
                }
            ]
        }
    }
};
const routes = {
    "/admin/support/chat-logs": "support.chatLogs",
    "/admin/support/requirements": "support.requirements",
    "/admin/customers/reviews/pending": "customers.pendingReviews",
    "/admin/hiring/vacancies": "hiring.vacancies",
    "/admin/hiring/applications": "hiring.applications"
};
const live = {
    "support.chatLogs": {
        path: "/parity/support-admin/chat-logs",
        page: "chat_logs.php",
        permission: "support.chatLogs"
    },
    "support.requirements": {
        path: "/support-desk/requirements",
        page: "requirement_requests.php",
        permission: "support.requirements"
    },
    "customers.pendingReviews": {
        path: "/reviews/pending",
        page: "product_review.php",
        permission: "customers.pendingReviews"
    },
    "hiring.vacancies": {
        path: "/hiring/vacancies",
        page: "vacancies.php",
        permission: "hiring.vacancies"
    },
    "hiring.applications": {
        path: "/hiring/applications",
        page: "vacancy_applications.php",
        permission: "hiring.applications"
    }
};
const pages = {
    "users.add": [
        "add-staff.php"
    ],
    "settings.loginModal": [
        "signup_modal_settings.php"
    ],
    "settings.scripts": [
        "script_settings.php"
    ]
};
const livePaths = [
    "/admin/support/chat-logs",
    "/admin/support/requirements",
    "/admin/customers/reviews/pending",
    "/admin/hiring/vacancies",
    "/admin/hiring/applications",
    "/admin/users/new",
    "/admin/settings/login-modal",
    "/admin/settings/scripts"
];
}),
"[project]/src/lib/content/admin/resources/parity/bulk.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Screens for the bulk PHP menu pages that had no Next page.
 * resources: list definitions rendered by ResourcePage.
 * routes: admin path -> resource key. live: resource key -> { path, page, permission }.
 * pages: permission key -> PHP menu links (for custom pages). livePaths: routes backed by the API.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const resources = {
    "bulk.products": {
        title: "Bulk Products",
        description: "Products offered on bulk quotations and orders, with their seller, prices, GST and stock.",
        permission: "bulk.products",
        search: "Product name, technical name or SKU",
        dateRange: "Created",
        exportable: true,
        filters: [
            {
                key: "stockLevel",
                label: "Stock",
                options: [
                    "In Stock",
                    "Low Stock",
                    "Out of Stock"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Inactive"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "ID",
                type: "number",
                sortable: true
            },
            {
                key: "productName",
                label: "Product",
                emphasis: true,
                sub: "technicalName",
                sortable: true,
                wrap: true,
                width: 260
            },
            {
                key: "sku",
                label: "SKU",
                type: "mono",
                sortable: true
            },
            {
                key: "category",
                label: "Category",
                sortable: true
            },
            {
                key: "seller",
                label: "Seller",
                sortable: true,
                wrap: true
            },
            {
                key: "purchasePrice",
                label: "Purchase Price",
                type: "currency",
                sortable: true
            },
            {
                key: "mrp",
                label: "MRP",
                type: "currency",
                sortable: true
            },
            {
                key: "gstPercentage",
                label: "GST %",
                type: "number",
                sortable: true
            },
            {
                key: "stock",
                label: "Stock",
                type: "number",
                sub: "stockUnit",
                sortable: true
            },
            {
                key: "stockLevel",
                label: "Stock level",
                type: "status"
            },
            {
                key: "variantCount",
                label: "Variants",
                type: "number",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Created",
                type: "datetime",
                sortable: true
            },
            {
                key: "updatedAt",
                label: "Updated",
                type: "datetime",
                sortable: true,
                hidden: true
            }
        ],
        rowActions: [
            {
                id: "delete",
                label: "Delete",
                permission: "delete",
                tone: "danger",
                effect: {
                    remove: true
                },
                confirm: {
                    title: "Delete this product?",
                    description: "The product, its variants and its audit log are removed. Existing quotations and orders keep their copied lines."
                }
            }
        ]
    }
};
const routes = {
    "/admin/bulk-orders/products": "bulk.products"
};
const live = {
    "bulk.products": {
        path: "/bulk-orders/products",
        page: "bulk_orders/products.php",
        permission: "bulk.products"
    }
};
const pages = {
    "bulk.dashboard": [
        "bulk_orders/index.php"
    ],
    "bulk.orders": [
        "bulk_orders/orders.php"
    ],
    "bulk.shipments": [
        "bulk_orders/shipments.php"
    ],
    "bulk.quotations": [
        "bulk_orders/quotations.php"
    ]
};
const livePaths = [
    "/admin/bulk-orders/dashboard",
    "/admin/bulk-orders/orders",
    "/admin/bulk-orders/shipments",
    "/admin/bulk-orders/quotations",
    "/admin/bulk-orders/products"
];
}),
"[project]/src/lib/content/admin/resources/parity/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parityLive",
    ()=>parityLive,
    "parityLivePaths",
    ()=>parityLivePaths,
    "parityPages",
    ()=>parityPages,
    "parityResources",
    ()=>parityResources,
    "parityRoutes",
    ()=>parityRoutes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$seller$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/seller.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$marketing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/marketing.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$crm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/crm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$ops$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/ops.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$support$2d$admin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/support-admin.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$bulk$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/bulk.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
const groups = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$seller$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$marketing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$crm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$ops$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$support$2d$admin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$bulk$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
];
const parityResources = Object.assign({}, ...groups.map((g)=>g.resources));
const parityRoutes = Object.assign({}, ...groups.map((g)=>g.routes));
const parityLive = Object.assign({}, ...groups.map((g)=>g.live));
const parityPages = Object.assign({}, ...groups.map((g)=>g.pages));
const parityLivePaths = groups.flatMap((g)=>g.livePaths);
}),
"[project]/src/lib/content/admin/resources/port/catalog.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Catalog screens ported from PHP (docs/php-port):
 * pending_tax.php, pending_return_policy.php, pending_attribute_conf.php,
 * pending_attribute_set.php and manage_conf_attributes_val.php.
 */ __turbopack_context__.s([
    "live",
    ()=>live,
    "livePaths",
    ()=>livePaths,
    "pages",
    ()=>pages,
    "resources",
    ()=>resources,
    "routes",
    ()=>routes
]);
const queueActions = (noun, reasonType)=>[
        {
            id: "approve",
            label: "Approve",
            permission: "edit",
            effect: {
                run: "approve"
            },
            when: {
                field: "status",
                notIn: [
                    "Active"
                ]
            },
            confirm: {
                title: `Approve ${noun}?`,
                description: "The seller who requested it is notified."
            }
        },
        {
            id: "reject",
            label: "Reject",
            permission: "edit",
            tone: "danger",
            effect: {
                run: "reject"
            },
            confirm: {
                title: `Reject ${noun}?`,
                description: "The seller is notified with the reason and the request is deleted.",
                requireReason: true,
                reasonType
            }
        }
    ];
const seller = {
    key: "seller",
    label: "Requested by",
    sub: "sellerId"
};
const resources = {
    "catalog.pendingTax": {
        title: "Pending Tax Class",
        description: "Tax classes sellers asked for. Approve makes them available; reject deletes the request.",
        permission: "catalog.tax",
        search: "Search tax class or seller",
        searchFields: [
            "name",
            "seller"
        ],
        defaultSort: "name:asc",
        columns: [
            {
                key: "name",
                label: "Tax Label",
                sortable: true,
                emphasis: true
            },
            {
                key: "rate",
                label: "Tax Class (%)",
                type: "number",
                sortable: true
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Requested",
                type: "date",
                sortable: true
            }
        ],
        rowActions: queueActions("tax class", "")
    },
    "catalog.pendingReturnPolicies": {
        title: "Pending Return Policy",
        description: "Return policies sellers asked for.",
        permission: "catalog.returnPolicies",
        search: "Search policy or seller",
        searchFields: [
            "title",
            "policy",
            "seller"
        ],
        defaultSort: "title:asc",
        columns: [
            {
                key: "title",
                label: "Policy Title",
                sortable: true,
                emphasis: true
            },
            {
                key: "policy",
                label: "Return Policy",
                wrap: true,
                width: 360
            },
            {
                key: "validity",
                label: "Validity (days)",
                type: "number"
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: queueActions("return policy", "")
    },
    "catalog.pendingAttributes": {
        title: "Pending Attributes",
        description: "Configuration attributes, with the ones sellers requested under Pending.",
        permission: "catalog.attributes",
        search: "Search attribute or seller",
        searchFields: [
            "name",
            "seller"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Active",
                "Inactive"
            ]
        },
        defaultSort: "name:asc",
        columns: [
            {
                key: "name",
                label: "Attribute",
                sortable: true,
                emphasis: true
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Created",
                type: "date",
                sortable: true
            }
        ],
        rowActions: queueActions("attribute", "8")
    },
    "catalog.pendingAttributeSets": {
        title: "Pending Attribute Sets",
        description: "Attribute sets sellers requested.",
        permission: "catalog.attributes",
        search: "Search attribute set",
        searchFields: [
            "name",
            "seller"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Active",
                "Inactive"
            ]
        },
        defaultSort: "name:asc",
        columns: [
            {
                key: "name",
                label: "Attribute",
                sortable: true,
                emphasis: true
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Created",
                type: "date",
                sortable: true
            }
        ],
        rowActions: queueActions("attribute set", "7")
    },
    "catalog.attributeValues": {
        title: "Attribute Values",
        description: "Values of a configuration attribute. Renaming a value also renames it on the products that use it; a value used by a product cannot be deleted.",
        permission: "catalog.attributes",
        search: "Search value",
        searchFields: [
            "value"
        ],
        defaultSort: "value:asc",
        headerActions: [
            {
                href: "/admin/catalog/attributes",
                label: "Back",
                action: "view"
            }
        ],
        columns: [
            {
                key: "attribute",
                label: "Main Attributes"
            },
            {
                key: "value",
                label: "Attributes",
                sortable: true,
                emphasis: true
            },
            {
                key: "colourCode",
                label: "Colour",
                hidden: true
            },
            {
                key: "products",
                label: "Used by products",
                type: "number"
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            {
                id: "delete",
                label: "Delete",
                permission: "delete",
                tone: "danger",
                effect: {
                    remove: true
                },
                confirm: {
                    title: "Delete this value?",
                    description: "A value used by a product cannot be deleted."
                }
            }
        ],
        form: {
            title: "Attribute Value",
            fields: [
                {
                    name: "attributeId",
                    label: "Attribute",
                    type: "hidden",
                    fromQuery: "attributeId",
                    required: true
                },
                {
                    name: "value",
                    label: "Attributes",
                    type: "text",
                    required: true,
                    maxLength: 500
                }
            ]
        }
    }
};
Object.assign(resources, {
    "catalog.pendingCategories": {
        title: "Pending Category",
        description: "Categories sellers asked for. Approve makes them live; reject notifies the seller and deletes the request.",
        permission: "catalog.categories",
        search: "Search category",
        searchFields: [
            "name"
        ],
        defaultSort: "order:asc",
        headerActions: [
            {
                href: "/admin/catalog/categories",
                label: "Back to categories"
            }
        ],
        columns: [
            {
                key: "order",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "image",
                label: "Image",
                type: "image"
            },
            {
                key: "path",
                label: "Category",
                emphasis: true,
                wrap: true
            },
            {
                key: "hsnCode",
                label: "HSN",
                type: "mono"
            },
            {
                key: "gst",
                label: "GST",
                type: "number"
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    run: "approve"
                },
                confirm: {
                    title: "Are you sure want to approve category?"
                }
            },
            {
                id: "reject",
                label: "Reject",
                permission: "edit",
                tone: "danger",
                effect: {
                    run: "reject"
                },
                confirm: {
                    title: "Are you sure want to reject category?",
                    description: "The seller is notified with the reason and the category is deleted.",
                    requireReason: true,
                    reasonType: "3"
                }
            }
        ]
    },
    "catalog.pendingBrands": {
        title: "Pending Brand",
        description: "Brands sellers asked for.",
        permission: "catalog.brands",
        search: "Search brand",
        searchFields: [
            "name"
        ],
        defaultSort: "name:asc",
        headerActions: [
            {
                href: "/admin/catalog/brands",
                label: "Back to brands"
            }
        ],
        columns: [
            {
                key: "image",
                label: "Image",
                type: "image"
            },
            {
                key: "name",
                label: "Brand",
                emphasis: true,
                sortable: true
            },
            {
                key: "document",
                label: "Brand Document",
                type: "link",
                linkLabel: "View document"
            },
            seller,
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: queueActions("brand", "4")
    },
    "catalog.categoryCommission": {
        title: "Category Commission",
        description: "Commission by price range for one category, optionally for chosen sellers. Total Commission = Ad Expense + Office Expense + Profit. Changes are written to the category timeline.",
        permission: "catalog.categories",
        search: "Search seller",
        searchFields: [
            "sellers"
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Deactive"
            ]
        },
        defaultSort: "id:asc",
        headerActions: [
            {
                href: "/admin/catalog/categories",
                label: "Back to categories"
            }
        ],
        columns: [
            {
                key: "category",
                label: "Category",
                hidden: true
            },
            {
                key: "priceFrom",
                label: "Price From",
                type: "currency",
                sortable: true
            },
            {
                key: "priceTo",
                label: "Price TO",
                type: "currency",
                sortable: true
            },
            {
                key: "commission",
                label: "Total Commission (%)",
                type: "number",
                sortable: true
            },
            {
                key: "adExpense",
                label: "Ad Expense (%)",
                type: "number"
            },
            {
                key: "officeExpense",
                label: "Office Expense (%)",
                type: "number"
            },
            {
                key: "profit",
                label: "Profit (%)",
                type: "number"
            },
            {
                key: "sellers",
                label: "Seller",
                wrap: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            {
                id: "delete",
                label: "Delete",
                permission: "delete",
                tone: "danger",
                effect: {
                    remove: true
                },
                confirm: {
                    title: "Are you sure want to delete?"
                }
            }
        ],
        form: {
            title: "Commission",
            fields: [
                {
                    name: "categoryId",
                    label: "Category",
                    type: "hidden",
                    fromQuery: "categoryId",
                    required: true
                },
                {
                    name: "priceFrom",
                    label: "Price Range From",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "priceTo",
                    label: "Price Range TO",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "adExpense",
                    label: "Ad Expense",
                    type: "number",
                    min: 0
                },
                {
                    name: "officeExpense",
                    label: "Office Expense",
                    type: "number",
                    min: 0
                },
                {
                    name: "profit",
                    label: "Profit",
                    type: "number",
                    min: 0,
                    hint: "Total Commission = Ad Expense + Office Expense + Profit."
                },
                {
                    name: "sellerIds",
                    label: "Seller",
                    type: "multiselect",
                    optionsFrom: "lookup:sellers",
                    hint: "Leave empty for every seller."
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: [
                        "Active",
                        "Deactive"
                    ],
                    required: true,
                    only: "edit"
                }
            ]
        }
    },
    "catalog.categoryTimeline": {
        title: "Category Timeline",
        description: "Every change to the category and its commission.",
        permission: "catalog.categories",
        search: "Search changes",
        searchFields: [
            "summary"
        ],
        tabs: {
            field: "group",
            values: [
                "Commission",
                "Status",
                "Subcategory",
                "General",
                "Meta"
            ]
        },
        defaultSort: "createdAt:desc",
        headerActions: [
            {
                href: "/admin/catalog/categories",
                label: "Back to categories"
            }
        ],
        columns: [
            {
                key: "createdAt",
                label: "When",
                type: "datetime",
                sortable: true
            },
            {
                key: "action",
                label: "Action",
                type: "status"
            },
            {
                key: "summary",
                label: "Change",
                wrap: true,
                width: 480
            },
            {
                key: "group",
                label: "Type"
            },
            {
                key: "importance",
                label: "Importance",
                type: "status"
            },
            {
                key: "user",
                label: "By"
            }
        ]
    }
});
const routes = {
    "/admin/catalog/tax-classes/pending": "catalog.pendingTax",
    "/admin/catalog/return-policies/pending": "catalog.pendingReturnPolicies",
    "/admin/catalog/attributes/pending": "catalog.pendingAttributes",
    "/admin/catalog/attribute-sets/pending": "catalog.pendingAttributeSets",
    "/admin/catalog/attribute-values": "catalog.attributeValues",
    "/admin/catalog/categories/pending": "catalog.pendingCategories",
    "/admin/catalog/brands/pending": "catalog.pendingBrands",
    "/admin/catalog/category-commission": "catalog.categoryCommission",
    "/admin/catalog/categories/timeline": "catalog.categoryTimeline"
};
const live = {
    "catalog.pendingTax": {
        path: "/catalog/pending-tax",
        page: "pending_tax.php",
        permission: "catalog.tax"
    },
    "catalog.pendingReturnPolicies": {
        path: "/catalog/pending-return-policies",
        page: "pending_return_policy.php",
        permission: "catalog.returnPolicies"
    },
    "catalog.pendingAttributes": {
        path: "/catalog/pending-attributes",
        page: "pending_attribute_conf.php",
        permission: "catalog.attributes"
    },
    "catalog.pendingAttributeSets": {
        path: "/catalog/pending-attribute-sets",
        page: "pending_attribute_set.php",
        permission: "catalog.attributes"
    },
    "catalog.attributeValues": {
        path: "/catalog/attribute-values",
        page: "manage_conf_attributes_val.php",
        permission: "catalog.attributes"
    },
    "catalog.pendingCategories": {
        path: "/catalog/pending-categories",
        page: "pending_category.php",
        permission: "catalog.categories"
    },
    "catalog.pendingBrands": {
        path: "/catalog/pending-brands",
        page: "pending_brand.php",
        permission: "catalog.brands"
    },
    "catalog.categoryCommission": {
        path: "/catalog/category-commission",
        page: "commission.php",
        permission: "catalog.categories"
    },
    "catalog.categoryTimeline": {
        path: "/catalog/category-timeline",
        page: "category.php",
        permission: "catalog.categories"
    }
};
const pages = {};
const livePaths = Object.keys(routes);
}),
"[project]/src/lib/content/admin/resources/port/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "portLive",
    ()=>portLive,
    "portLivePaths",
    ()=>portLivePaths,
    "portPages",
    ()=>portPages,
    "portResources",
    ()=>portResources,
    "portRoutes",
    ()=>portRoutes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$catalog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/port/catalog.js [app-ssr] (ecmascript)");
;
/**
 * Screens ported from the PHP admin after the parity pass (docs/php-port).
 * Each group exports resources, routes (admin path -> resource key), live
 * (resource key -> { path, page, permission }), pages (permission -> PHP pages
 * for custom screens) and livePaths, like the parity groups.
 */ const groups = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$catalog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
];
const portResources = Object.assign({}, ...groups.map((g)=>g.resources));
const portRoutes = Object.assign({}, ...groups.map((g)=>g.routes));
const portLive = Object.assign({}, ...groups.map((g)=>g.live));
const portPages = Object.assign({}, ...groups.map((g)=>g.pages));
const portLivePaths = groups.flatMap((g)=>g.livePaths);
}),
"[project]/src/lib/services/admin/live-catalog.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LIVE_ADMIN_PATHS",
    ()=>LIVE_ADMIN_PATHS,
    "LIVE_RESOURCES",
    ()=>LIVE_RESOURCES,
    "isLiveAdminPath",
    ()=>isLiveAdminPath,
    "permissionPages",
    ()=>permissionPages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/port/index.js [app-ssr] (ecmascript)");
;
;
const LIVE_RESOURCES = {
    orders: {
        path: "/lists/orders",
        page: "manage_orders.php",
        permission: "orders"
    },
    products: {
        path: "/lists/products",
        page: "manage_product.php",
        permission: "products"
    },
    inventory: {
        path: "/inventory",
        page: "manage_product.php",
        permission: "products"
    },
    "inventory.history": {
        path: "/inventory/movements",
        page: "manage_product.php",
        permission: "products"
    },
    "products.pending": {
        path: "/products/pending",
        page: "pending_products.php",
        permission: "products.approval"
    },
    "orders.invoices": {
        path: "/invoices",
        page: "manage_orders.php",
        permission: "orders.invoices"
    },
    "orders.transactions": {
        path: "/reports/transactions",
        page: "orders_report.php",
        permission: "orders.transactions"
    },
    "orders.whatsapp": {
        path: "/orders-whatsapp",
        page: "whatsapp_orders.php",
        permission: "orders.whatsapp"
    },
    "orders.srCheckout": {
        path: "/sr-checkout",
        page: "manage_orders.php",
        permission: "orders.srCheckout"
    },
    "vendors.scores": {
        path: "/vendors/scores",
        page: "score_management.php",
        permission: "vendors.scores"
    },
    "vendors.reports": {
        path: "/reports/vendors",
        page: "seller.php",
        permission: "vendors.reports"
    },
    shipping: {
        path: "/shipments",
        page: "shiprocket_orders_report.php",
        permission: "shipping"
    },
    "shipping.codRules": {
        path: "/shipping/cod-rules",
        page: "manage_cod_state_rule.php",
        permission: "shipping.rules"
    },
    returns: {
        path: "/returns",
        page: "manage_returns.php",
        permission: "returns"
    },
    "returns.reasons": {
        path: "/returns/reasons",
        page: "reject-reason.php",
        permission: "returns"
    },
    refunds: {
        path: "/refunds",
        page: "returns_refunds_report.php",
        permission: "refunds"
    },
    rto: {
        path: "/rto",
        page: "manage_orders.php",
        permission: "rto"
    },
    customers: {
        path: "/customers",
        page: "app-user.php",
        permission: "customers"
    },
    vendors: {
        path: "/vendors",
        page: "seller.php",
        permission: "vendors"
    },
    "vendors.verification": {
        path: "/vendors/verification",
        page: "seller.php",
        permission: "vendors.verification"
    },
    "customers.coupons": {
        path: "/coupons",
        page: "coupon.php",
        permission: "customers.coupons"
    },
    "customers.reviews": {
        path: "/reviews",
        page: "manage_review.php",
        permission: "customers.reviews"
    },
    users: {
        path: "/users",
        page: "manage-staff.php",
        permission: "users"
    },
    audit: {
        path: "/audit-log",
        page: "manage-role.php",
        permission: "audit"
    },
    support: {
        path: "/support/tickets",
        page: "admin_dashboard.php",
        permission: "support"
    },
    "finance.wallet": {
        path: "/finance/wallet-withdrawals",
        page: "finance_payout_dashboard.php",
        permission: "finance.wallet"
    },
    "cms.blogs": {
        path: "/cms/blogs",
        page: "blogs.php",
        permission: "cms"
    },
    "cms.faqs": {
        path: "/cms/faqs",
        page: "manage_product.php",
        permission: "cms"
    },
    "cms.footer": {
        path: "/cms/footer",
        page: "system_settings.php",
        permission: "cms"
    },
    "cms.events": {
        path: "/cms/events",
        page: "blogs.php",
        permission: "cms"
    },
    "settings.emailTemplates": {
        path: "/settings/email-templates",
        page: "email_template.php",
        permission: "settings"
    },
    "settings.languages": {
        path: "/settings/languages",
        page: "language_settings.php",
        permission: "settings"
    },
    "masters.currency": {
        path: "/masters/currency",
        page: "currency_settings.php",
        permission: "masters"
    },
    "masters.geography": {
        path: "/masters/geography",
        page: "system_settings.php",
        permission: "masters"
    },
    "masters.rejectReasons": {
        path: "/masters/reject-reasons",
        page: "reject-reason.php",
        permission: "masters"
    },
    "crm.circles": {
        path: "/crm/circles",
        page: "crm_leads.php",
        permission: "crm.circles"
    },
    "finance.fixedExpenses": {
        path: "/finance/fixed-expenses",
        page: "fixed_expenses.php",
        permission: "finance.expenses"
    },
    "pricing.masterNrv": {
        path: "/pricing/master-nrv",
        page: "add_master_nrv.php",
        permission: "pricing.masterNrv"
    },
    "pricing.commission": {
        path: "/pricing/commission-rules",
        page: "product_cost_management.php",
        permission: "pricing.commission"
    },
    "pricing.costConfig": {
        path: "/pricing/cost-config",
        page: "product_cost_management.php",
        permission: "pricing.costConfig"
    },
    "shipping.courierSlabs": {
        path: "/shipping/courier-slabs",
        page: "courier_cost_slab_master.php",
        permission: "shipping.rates"
    },
    "shipping.slabs": {
        path: "/shipping/slabs",
        page: "manage_shipping_slabs.php",
        permission: "shipping.rates"
    },
    "shipping.otherCharges": {
        path: "/shipping/other-charges",
        page: "courier_cost_slab_master.php",
        permission: "shipping.rates"
    },
    "shipping.boxes": {
        path: "/shipping/package-boxes",
        page: "vendor_package_boxes.php",
        permission: "shipping.boxes"
    },
    "shipping.weight": {
        path: "/shipping/weight-discrepancies",
        page: "weight_discrapancy.php",
        permission: "shipping.weight"
    },
    "shipping.pincodes": {
        path: "/shipping/pincodes",
        page: "courier_serviceability.php",
        permission: "shipping.pincodes"
    },
    "catalog.categories": {
        path: "/catalog/categories",
        page: "category.php",
        permission: "catalog.categories"
    },
    "catalog.brands": {
        path: "/catalog/brands",
        page: "brand.php",
        permission: "catalog.brands"
    },
    "catalog.attributes": {
        path: "/catalog/attributes",
        page: "manage_conf_attributes.php",
        permission: "catalog.attributes"
    },
    "catalog.tax": {
        path: "/catalog/tax-classes",
        page: "manage_tax_class.php",
        permission: "catalog.tax"
    },
    "catalog.hsn": {
        path: "/catalog/hsn-codes",
        page: "manage_hsncode.php",
        permission: "catalog.hsn"
    },
    "catalog.returnPolicies": {
        path: "/catalog/return-policies",
        page: "manage_return_policy.php",
        permission: "catalog.returnPolicies"
    },
    "payouts.items": {
        path: "/payouts/items",
        page: "payout_new.php",
        permission: "payouts"
    },
    payouts: {
        path: "/payouts",
        page: "payout_new.php",
        permission: "payouts"
    },
    "payouts.access": {
        path: "/payouts/access",
        page: "vendor_payout_access_settings.php",
        permission: "payouts.access"
    },
    "payouts.legacy": {
        path: "/payouts/legacy",
        page: "payout_new.php",
        permission: "payouts"
    },
    "finance.ledger": {
        path: "/finance/ledger",
        page: "payout_finance.php",
        permission: "finance.ledger"
    },
    "finance.holdLedger": {
        path: "/finance/hold-ledger",
        page: "hold_ledger.php",
        permission: "finance.holdLedger"
    },
    "finance.cod": {
        path: "/finance/cod-reconciliation",
        page: "payout_finance.php",
        permission: "finance"
    },
    "finance.tax": {
        path: "/finance/gst-summary",
        page: "payout_finance.php",
        permission: "finance.tax"
    },
    "crm.leads": {
        path: "/crm/leads",
        page: "crm_leads.php",
        permission: "crm.leads"
    },
    "crm.followUps": {
        path: "/crm/follow-ups",
        page: "crm_leads.php",
        permission: "crm.leads"
    },
    "crm.legacy": {
        path: "/crm/legacy-leads",
        page: "manager_all_leads.php",
        permission: "crm.legacy"
    },
    "crm.whatsapp": {
        path: "/crm/whatsapp-sessions",
        page: "whatsapp_leads.php",
        permission: "crm.whatsapp"
    },
    "crm.aiCalls": {
        path: "/crm/ai-calls",
        page: "vapi_calls.php",
        permission: "crm.aiCalls"
    },
    "crm.callAudit": {
        path: "/crm/call-audits",
        page: "call_audit.php",
        permission: "crm.callAudit"
    },
    "sales.targets": {
        path: "/sales/targets",
        page: "sales_target_management.php",
        permission: "sales.targets"
    },
    "sales.salary": {
        path: "/sales/salary-structures",
        page: "sales_target_management.php",
        permission: "sales.salary"
    },
    "sales.achievements": {
        path: "/sales/achievements",
        page: "sales_target_management.php",
        permission: "sales.targets"
    },
    "sales.payouts": {
        path: "/sales/payouts",
        page: "sales_target_management.php",
        permission: "sales.payouts"
    },
    "sales.prepaid": {
        path: "/sales/prepaid-incentive-config",
        page: "sales_prepaid_incentive_setup.php",
        permission: "sales.salary"
    },
    "sales.team": {
        path: "/sales/team",
        page: "sales_target_management.php",
        permission: "sales"
    },
    "b2b.buyers": {
        path: "/b2b/buyers",
        page: "b2b_orders/buyers.php",
        permission: "b2b.buyers"
    },
    "b2b.rfqs": {
        path: "/b2b/rfqs",
        page: "b2b_orders/rfqs.php",
        permission: "b2b.rfqs"
    },
    "b2b.quotations": {
        path: "/b2b/quotations",
        page: "b2b_orders/b2b_quotations.php",
        permission: "b2b.quotations"
    },
    "b2b.orders": {
        path: "/b2b/orders",
        page: "b2b_orders/b2b_order_list.php",
        permission: "b2b.orders"
    },
    "b2b.payments": {
        path: "/b2b/payments",
        page: "b2b_orders/payments.php",
        permission: "b2b.finance"
    },
    "b2b.settlements": {
        path: "/b2b/settlements",
        page: "b2b_orders/settlements.php",
        permission: "b2b.finance"
    },
    "b2b.claims": {
        path: "/b2b/claims",
        page: "b2b_orders/claims.php",
        permission: "b2b.orders"
    },
    "b2b.alerts": {
        path: "/b2b/alerts",
        page: "b2b_orders/alerts.php",
        permission: "b2b"
    },
    bulk: {
        path: "/bulk-orders/inquiries",
        page: "bulk_orders/bulk_inquiry.php",
        permission: "bulk"
    },
    "bulk.warehouses": {
        path: "/bulk-orders/warehouses",
        page: "bulk_orders/warehouses.php",
        permission: "bulk"
    },
    "operations.ndr": {
        path: "/operations/ndr",
        page: "operations_center/ndr_escalations.php",
        permission: "operations.center"
    },
    "operations.escalations": {
        path: "/operations/escalations",
        page: "operations_center/ndr_escalations.php",
        permission: "operations.center"
    },
    "operations.recordings": {
        path: "/operations/recordings",
        page: "operations_center/index.php",
        permission: "operations.center"
    },
    "operations.rules": {
        path: "/operations/rules",
        page: "operations_center/settings.php",
        permission: "operations.rules"
    },
    "operations.sla": {
        path: "/operations/sla",
        page: "operations_center/settings.php",
        permission: "operations.rules"
    },
    "operations.assignments": {
        path: "/operations/assignments",
        page: "operations_team/agent_orders.php",
        permission: "operations.team"
    },
    "operations.agents": {
        path: "/operations/agents",
        page: "operations_team/agent_report.php",
        permission: "operations.team"
    },
    "operations.agentMaster": {
        path: "/operations/agent-master",
        page: "operations_team/setup.php",
        permission: "operations.setup"
    },
    "operations.setup": {
        path: "/operations/kpi-targets",
        page: "operations_team/setup.php",
        permission: "operations.setup"
    },
    "cms.banners": {
        path: "/cms/banners",
        page: "newhomepage_website.php",
        permission: "cms"
    },
    "cms.homeSections": {
        path: "/cms/home-sections",
        page: "newhomepage_website.php",
        permission: "cms"
    },
    "cms.homeBanners": {
        path: "/cms/home-sections/banners",
        page: "newhomepage_website.php",
        permission: "cms"
    },
    "cms.homeSectionItems": {
        path: "/cms/home-sections/items",
        page: "newhomepage_website.php",
        permission: "cms"
    },
    "cms.pages": {
        path: "/custom-pages",
        page: "pages_custom.php",
        permission: "cms.pages"
    },
    "cms.notifications": {
        path: "/cms/notifications",
        page: "notification.php",
        permission: "cms.notifications"
    },
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parityLive"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["portLive"]
};
/** PHP pages for sidebar items that are not a resource list yet. */ const EXTRA_PAGES = {
    "dashboard.main": [
        "dashboard.php",
        "main_dashboard.php"
    ],
    "dashboard.orders": [
        "order_management_dashboard.php"
    ],
    "dashboard.products": [
        "product_management_dashboard.php",
        "product_dashboard.php"
    ],
    "dashboard.logistics": [
        "logistics_operations_dashboard.php"
    ],
    "dashboard.finance": [
        "finance_payout_dashboard.php"
    ],
    "dashboard.sellers": [
        "seller_dashboard.php"
    ],
    "products.approval": [
        "verfiy_pending_products.php",
        "pending_products.php"
    ],
    "products.import": [
        "import_products_excel.php"
    ],
    pricing: [
        "price_calculator.php"
    ],
    finance: [
        "finance.php",
        "payout_finance.php"
    ],
    "finance.expenses": [
        "expense_limit_dashboard.php",
        "fixed_expenses.php"
    ],
    crm: [
        "lead_dashboard.php",
        "crm_leads.php"
    ],
    "crm.leads": [
        "crm_leads.php"
    ],
    "crm.legacy": [
        "manager_all_leads.php",
        "sales_agent_leads.php"
    ],
    "crm.whatsapp": [
        "whatsapp_leads.php"
    ],
    "crm.aiCalls": [
        "vapi_calls.php"
    ],
    "crm.callAudit": [
        "call_audit.php"
    ],
    sales: [
        "sales_target_management.php"
    ],
    "sales.targets": [
        "sales_target_management.php"
    ],
    "sales.salary": [
        "sales_prepaid_incentive_setup.php"
    ],
    "sales.payouts": [
        "sales_target_management.php"
    ],
    roles: [
        "manage-role.php",
        "manage_roles.php"
    ],
    "roles.menus": [
        "menu-master.php"
    ],
    reports: [
        "reports.php",
        "orders_report.php"
    ],
    settings: [
        "system_settings.php",
        "smtp_settings.php",
        "sms_settings.php"
    ],
    "cms.pages": [
        "pages_custom.php",
        "meta.php"
    ],
    "cms.notifications": [
        "notification.php",
        "notification_list.php"
    ],
    "operations.center": [
        "ndr_escalations.php"
    ],
    "support.settings": [
        "admin_dashboard.php"
    ]
};
function permissionPages() {
    const map = {};
    const add = (permission, page)=>{
        if (!permission || !page) return;
        (map[permission] ??= new Set()).add(page);
    };
    for (const spec of Object.values(LIVE_RESOURCES))add(spec.permission, spec.page);
    for (const [permission, pages] of Object.entries(EXTRA_PAGES))for (const page of pages)add(permission, page);
    for (const [permission, pages] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parityPages"]))for (const page of pages)add(permission, page);
    for (const [permission, pages] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["portPages"]))for (const page of pages)add(permission, page);
    return Object.fromEntries(Object.entries(map).map(([key, pages])=>[
            key,
            [
                ...pages
            ]
        ]));
}
const LIVE_ADMIN_PATHS = new Set([
    "/admin/dashboard",
    "/admin/dashboards/orders",
    "/admin/dashboards/products",
    "/admin/dashboards/logistics",
    "/admin/dashboards/finance",
    "/admin/dashboards/sellers",
    "/admin/finance",
    "/admin/orders",
    "/admin/orders/new",
    "/admin/products/new",
    "/admin/products/import",
    "/admin/products",
    "/admin/products/pending",
    "/admin/vendors",
    "/admin/vendors/scores",
    "/admin/vendors/verification",
    "/admin/vendors/reports",
    "/admin/customers",
    "/admin/customers/coupons",
    "/admin/customers/reviews",
    "/admin/shipping",
    "/admin/shipping/courier-slabs",
    "/admin/shipping/slabs",
    "/admin/shipping/cod-rules",
    "/admin/shipping/other-charges",
    "/admin/shipping/package-boxes",
    "/admin/shipping/weight-discrepancy",
    "/admin/shipping/pincodes",
    "/admin/returns",
    "/admin/returns/reasons",
    "/admin/refunds",
    "/admin/rto",
    "/admin/payouts",
    "/admin/payouts/items",
    "/admin/payouts/access",
    "/admin/payouts/legacy",
    "/admin/orders/invoices",
    "/admin/orders/transactions",
    "/admin/orders/whatsapp",
    "/admin/orders/sr-checkout",
    "/admin/inventory",
    "/admin/inventory/history",
    "/admin/finance/ledger",
    "/admin/finance/hold-ledger",
    "/admin/finance/cod",
    "/admin/finance/gst",
    "/admin/finance/fixed-expenses",
    "/admin/finance/wallet-withdrawals",
    "/admin/catalog/categories",
    "/admin/catalog/brands",
    "/admin/catalog/attributes",
    "/admin/catalog/tax-classes",
    "/admin/catalog/hsn-codes",
    "/admin/catalog/return-policies",
    "/admin/pricing/master-nrv",
    "/admin/pricing/commission",
    "/admin/pricing/cost-config",
    "/admin/crm",
    "/admin/crm/leads",
    "/admin/crm/follow-ups",
    "/admin/crm/legacy-leads",
    "/admin/crm/whatsapp",
    "/admin/crm/ai-calls",
    "/admin/crm/call-audit",
    "/admin/crm/circles",
    "/admin/sales",
    "/admin/sales/targets",
    "/admin/sales/salary",
    "/admin/sales/achievements",
    "/admin/sales/payouts",
    "/admin/sales/prepaid-incentive",
    "/admin/sales/team",
    "/admin/cms/blogs",
    "/admin/cms/events",
    "/admin/cms/faqs",
    "/admin/cms/footer",
    "/admin/users",
    "/admin/audit",
    "/admin/masters/geography",
    "/admin/masters/reject-reasons",
    "/admin/masters/currency",
    "/admin/settings/email-templates",
    "/admin/settings/languages",
    "/admin/support",
    "/admin/b2b",
    "/admin/b2b/quotations/new",
    "/admin/b2b/catalog/generate",
    "/admin/b2b/buyers",
    "/admin/b2b/rfqs",
    "/admin/b2b/quotations",
    "/admin/b2b/orders",
    "/admin/b2b/payments",
    "/admin/b2b/settlements",
    "/admin/b2b/claims",
    "/admin/b2b/alerts",
    "/admin/bulk-orders",
    "/admin/bulk-orders/warehouses",
    "/admin/operations",
    "/admin/operations/ndr",
    "/admin/operations/escalations",
    "/admin/operations/recordings",
    "/admin/operations/rules",
    "/admin/operations/sla",
    "/admin/operations/team",
    "/admin/operations/team/assignments",
    "/admin/operations/team/agents",
    "/admin/operations/team/setup",
    "/admin/cms/banners",
    "/admin/cms/home-sections",
    "/admin/cms/pages",
    "/admin/cms/notifications",
    "/admin/roles",
    "/admin/roles/menus",
    "/admin/settings",
    "/admin/settings/smtp",
    "/admin/settings/sms",
    "/admin/settings/integrations",
    "/admin/shipping/minimums",
    "/admin/finance/expense-limits",
    "/admin/pricing",
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parityLivePaths"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["portLivePaths"]
]);
function isLiveAdminPath(pathname) {
    if (LIVE_ADMIN_PATHS.has(pathname)) return true;
    const path = pathname || "";
    if (path.startsWith("/admin/dashboard/cards/")) return true;
    if (/^\/admin\/orders\/(?!new$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/crm\/leads\/\d+$/.test(path)) return true;
    if (/^\/admin\/products\/(?!new$|import$|pending$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/vendors\/(?!verification$|scores$|reports$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/vendors\/(?!verification$|scores$|reports$)[^/]+\/bank$/.test(path)) return true;
    if (/^\/admin\/customers\/(?!coupons$|reviews$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/returns\/(?!reasons$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/payouts\/(?!items$|access$|legacy$)[^/]+$/.test(path)) return true;
    if (/^\/admin\/support\/[^/]+$/.test(path)) return true;
    if (/^\/admin\/b2b\/buyers\/[^/]+$/.test(path)) return true;
    if (/^\/admin\/b2b\/orders\/[^/]+$/.test(path)) return true;
    return /^\/admin\/roles\/(?!menus$)[^/]+$/.test(path);
}
}),
"[project]/src/lib/site.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "demoMode",
    ()=>demoMode,
    "site",
    ()=>site
]);
const site = {
    name: "Bharat AgroLink",
    panelName: "Admin Panel",
    company: "Agrolink Manufacturing Private Limited",
    supportEmail: "admin-support@bharatagrolink.com",
    url: process.env["NEXT_PUBLIC_SITE_URL"] || "http://localhost:3000"
};
const demoMode = false;
}),
"[project]/src/components/ui/brand-logo.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrandLogo",
    ()=>BrandLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site.js [app-ssr] (ecmascript)");
;
;
;
;
function BrandLogo({ variant = "full", className, priority = false }) {
    if (variant === "icon") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            src: "/brand/logo-icon.png",
            alt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["site"].name,
            width: 64,
            height: 64,
            priority: priority,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-8 object-contain", className)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/brand-logo.jsx",
            lineNumber: 8,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        src: "/brand/logo-full.png",
        alt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["site"].name,
        width: 315,
        height: 100,
        priority: priority,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-9 w-auto object-contain", className)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/brand-logo.jsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/admin/shell/icons.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavIcon",
    ()=>NavIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/badge-check.js [app-ssr] (ecmascript) <export default as BadgeCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/boxes.js [app-ssr] (ecmascript) <export default as Boxes>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-ssr] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as CircleHelp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$contact$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Contact$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/contact.js [app-ssr] (ecmascript) <export default as Contact>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.js [app-ssr] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-chart-column-increasing.js [app-ssr] (ecmascript) <export default as FileBarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.js [app-ssr] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-ssr] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-ssr] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/landmark.js [app-ssr] (ecmascript) <export default as Landmark>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-ssr] (ecmascript) <export default as LayoutTemplate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-ssr] (ecmascript) <export default as LifeBuoy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/megaphone.js [app-ssr] (ecmascript) <export default as Megaphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$messages$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessagesSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/messages-square.js [app-ssr] (ecmascript) <export default as MessagesSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio-tower.js [app-ssr] (ecmascript) <export default as RadioTower>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt.js [app-ssr] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-ssr] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tags$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tags$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tags.js [app-ssr] (ecmascript) <export default as Tags>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-ssr] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-ssr] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users-round.js [app-ssr] (ecmascript) <export default as UsersRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-ssr] (ecmascript) <export default as Circle>");
;
;
const icons = {
    BadgeCheck: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__["BadgeCheck"],
    Boxes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__["Boxes"],
    Briefcase: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
    Building2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
    CircleHelp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"],
    ClipboardList: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"],
    Contact: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$contact$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Contact$3e$__["Contact"],
    Cpu: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
    Database: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
    FileBarChart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$chart$2d$column$2d$increasing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileBarChart$3e$__["FileBarChart"],
    FolderTree: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
    Gauge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    IndianRupee: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"],
    Landmark: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$landmark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Landmark$3e$__["Landmark"],
    LayoutDashboard: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
    LayoutTemplate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__["LayoutTemplate"],
    LifeBuoy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__["LifeBuoy"],
    Mail: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"],
    MapPin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
    Megaphone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__["Megaphone"],
    MessagesSquare: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$messages$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessagesSquare$3e$__["MessagesSquare"],
    Package: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
    Phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"],
    RadioTower: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2d$tower$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioTower$3e$__["RadioTower"],
    Receipt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"],
    Settings: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
    ShieldAlert: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"],
    ShieldCheck: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"],
    ShoppingCart: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    Star: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
    Store: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
    Tags: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tags$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tags$3e$__["Tags"],
    Target: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
    TrendingUp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
    Truck: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"],
    Undo2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"],
    Users: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
    UsersRound: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersRound$3e$__["UsersRound"],
    Wallet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"]
};
function NavIcon({ name, className }) {
    const Icon = icons[name] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
        className: className,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/icons.js",
        lineNumber: 88,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/admin/shell/sidebar.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-left.js [app-ssr] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-ssr] (ecmascript) <export default as ChevronsRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$brand$2d$logo$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/brand-logo.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/icons.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const pathOf = (href)=>(href || "").split(/[?#]/)[0];
function isActive(pathname, href) {
    if (!href) return false;
    return pathname === href;
}
function groupContains(pathname, item) {
    return (item.children || []).some((child)=>pathname === child.href || child.href !== "/admin/dashboard" && pathname.startsWith(`${child.href}/`));
}
function activeChildKey(pathname, children) {
    const exact = children.find((c)=>c.href === pathname);
    if (exact) return exact.key;
    return children.filter((c)=>pathname.startsWith(`${pathOf(c.href)}/`)).sort((a, b)=>pathOf(b.href).length - pathOf(a.href).length)[0]?.key;
}
function Badge({ value }) {
    if (!value) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "ml-auto min-w-[20px] rounded-full bg-accent px-1.5 text-center text-[10.5px] leading-[18px] font-semibold text-accent-fg tabular shadow-sm",
        children: value > 99 ? "99+" : value
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function Sidebar({ navigation, badges = {}, rail, onToggleRail, mobileOpen, onCloseMobile }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const activeGroupKey = ()=>{
        for (const section of navigation)for (const item of section.items)if (item.children && groupContains(pathname, item)) return item.key;
        return null;
    };
    const [openKey, setOpenKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(activeGroupKey);
    const [lastPath, setLastPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        const key = activeGroupKey();
        if (key) setOpenKey(key);
    }
    const toggleGroup = (key)=>setOpenKey((current)=>current === key ? null : key);
    const openFromRail = (key)=>{
        setOpenKey(key);
        onToggleRail?.();
    };
    const compact = rail && !mobileOpen;
    const closeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mobileOpen) return;
        const previous = document.activeElement;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        const onKey = (event)=>event.key === "Escape" && onCloseMobile?.();
        document.addEventListener("keydown", onKey);
        return ()=>{
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
            previous?.focus?.();
        };
    }, [
        mobileOpen,
        onCloseMobile
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40 bg-black/45 md:hidden",
                onClick: onCloseMobile,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                lineNumber: 79,
                columnNumber: 22
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed inset-y-0 left-0 z-50 flex flex-col bg-nav text-nav-ink duration-200", compact ? "w-16" : "w-[264px]", mobileOpen ? "translate-x-0 transition-[width,transform]" : "-translate-x-full transition-[width,transform,visibility] max-md:invisible md:translate-x-0"),
                "aria-label": "Admin navigation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-14 shrink-0 items-center gap-2.5 border-b border-nav-line", compact ? "justify-center px-2" : "px-4"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/admin/dashboard",
                                className: "flex min-w-0 items-center gap-2.5",
                                "aria-label": `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["site"].name} admin home`,
                                children: compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$brand$2d$logo$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrandLogo"], {
                                        variant: "icon",
                                        className: "size-7",
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                        lineNumber: 92,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex h-10 shrink-0 items-center rounded-lg bg-white px-2 py-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$brand$2d$logo$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrandLogo"], {
                                                className: "h-8",
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                lineNumber: 97,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate text-[11px] font-medium tracking-wide text-nav-muted uppercase",
                                            children: "Admin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                ref: closeRef,
                                type: "button",
                                onClick: onCloseMobile,
                                className: "ml-auto rounded-md p-1.5 text-nav-muted hover:bg-white/10 hover:text-white md:hidden",
                                "aria-label": "Close menu",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "size-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "nav-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain py-3",
                        children: navigation.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3",
                                children: [
                                    compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-4 mb-2 border-t border-nav-line",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this) : section.section && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "px-5 pb-1.5 text-[10.5px] font-semibold tracking-[0.08em] text-nav-muted/80 uppercase",
                                        children: section.section
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                        lineNumber: 116,
                                        columnNumber: 36
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-0.5 px-2.5",
                                        children: section.items.map((item)=>{
                                            if (!item.children) {
                                                const active = isActive(pathname, item.href) || pathname.startsWith(`${item.href}/`);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        title: compact ? item.label : undefined,
                                                        "aria-label": compact ? item.label : undefined,
                                                        "aria-current": active ? "page" : undefined,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors", active ? "bg-nav-active text-nav-active-ink" : "text-nav-ink/90 hover:bg-white/8 hover:text-white", compact && "justify-center px-0"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIcon"], {
                                                                name: item.icon,
                                                                className: "size-[18px] shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                lineNumber: 135,
                                                                columnNumber: 27
                                                            }, this),
                                                            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "truncate",
                                                                children: item.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                lineNumber: 136,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                        lineNumber: 124,
                                                        columnNumber: 25
                                                    }, this)
                                                }, item.key, false, {
                                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                    lineNumber: 123,
                                                    columnNumber: 23
                                                }, this);
                                            }
                                            const containsActive = groupContains(pathname, item);
                                            const open = openKey === item.key;
                                            const activeKey = activeChildKey(pathname, item.children);
                                            const groupBadge = item.children.reduce((sum, c)=>sum + (c.badge ? badges[c.badge] || 0 : 0), 0);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>compact ? openFromRail(item.key) : toggleGroup(item.key),
                                                        title: compact ? item.label : undefined,
                                                        "aria-expanded": compact ? undefined : open,
                                                        "aria-controls": compact ? undefined : `nav-${item.key}`,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13.5px] font-medium transition-colors", compact ? containsActive ? "bg-nav-active text-nav-active-ink" : "text-nav-ink/90 hover:bg-white/8 hover:text-white" : open ? "bg-white/10 text-white before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-accent" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hover:bg-white/8 hover:text-white", containsActive ? "text-white" : "text-nav-ink/90"), compact && "justify-center px-0"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIcon"], {
                                                                name: item.icon,
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-[18px] shrink-0", !compact && (open || containsActive) && "text-accent")
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                lineNumber: 165,
                                                                columnNumber: 25
                                                            }, this),
                                                            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        children: item.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 168,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    item.sensitive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                        className: "size-3 shrink-0 text-nav-muted",
                                                                        "aria-label": "Sensitive module"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 169,
                                                                        columnNumber: 48
                                                                    }, this),
                                                                    !open && groupBadge > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                        value: groupBadge
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 170,
                                                                        columnNumber: 56
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "ml-auto"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 170,
                                                                        columnNumber: 87
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 transition-transform duration-200", open ? "rotate-180 text-white/80" : "text-nav-muted"),
                                                                        "aria-hidden": true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 171,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true),
                                                            compact && groupBadge > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute top-1.5 right-2 size-2 rounded-full bg-accent ring-2 ring-nav",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                lineNumber: 174,
                                                                columnNumber: 55
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                        lineNumber: 147,
                                                        columnNumber: 23
                                                    }, this),
                                                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("grid transition-[grid-template-rows,opacity] duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
                                                        inert: !open,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-h-0 overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                id: `nav-${item.key}`,
                                                                className: "mt-0.5 mb-1 ml-[21px] space-y-0.5 border-l border-white/15 pl-3",
                                                                children: item.children.map((child)=>{
                                                                    const active = child.key === activeKey;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            href: child.href,
                                                                            "aria-current": active ? "page" : undefined,
                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] transition-colors", active ? "bg-nav-active font-medium text-nav-active-ink" : "text-nav-muted hover:bg-white/8 hover:text-white"),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    children: child.label
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                                    lineNumber: 192,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                                                                    value: child.badge ? badges[child.badge] : 0
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                                    lineNumber: 193,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                            lineNumber: 184,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, child.key, false, {
                                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                        lineNumber: 183,
                                                                        columnNumber: 35
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                                lineNumber: 179,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                            lineNumber: 178,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                        lineNumber: 177,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, item.key, true, {
                                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                                lineNumber: 146,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, section.section ?? section.items[0]?.key, true, {
                                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden shrink-0 border-t border-nav-line p-2.5 md:block",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onToggleRail,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-[13px] text-nav-muted hover:bg-white/8 hover:text-white", compact && "justify-center px-0"),
                            "aria-label": compact ? "Expand sidebar" : "Collapse sidebar",
                            children: [
                                compact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                    lineNumber: 217,
                                    columnNumber: 24
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                    lineNumber: 217,
                                    columnNumber: 63
                                }, this),
                                !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Collapse sidebar"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                                    lineNumber: 218,
                                    columnNumber: 26
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/sidebar.jsx",
                lineNumber: 80,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/lib/content/admin/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin sidebar and route map.
 *
 * Sections, groups, labels and order mirror the legacy AMPL.BAadmin sidebar
 * (`admin_menus`, active rows, by menu_order). Each leaf `page` is the
 * `admin_menus.menu_link` it stands for: the sidebar shows a leaf when the
 * role grants view on that link (see lib/auth/permissions.js), the same rule
 * header.php uses. Leaves without `page` are Next-only screens; they are
 * gated by `permission` and kept in the closest PHP group.
 *
 * `permission` is the key pages check with checkPermission() and the role
 * matrix lists (lib/services/admin/live-catalog.js maps keys to PHP pages).
 * A section with `section: null` is a top-level PHP link with no header.
 */ __turbopack_context__.s([
    "findNavItem",
    ()=>findNavItem,
    "flattenNavigation",
    ()=>flattenNavigation,
    "getBreadcrumbs",
    ()=>getBreadcrumbs,
    "getPermissionCatalog",
    ()=>getPermissionCatalog,
    "hiddenRoutes",
    ()=>hiddenRoutes,
    "navigation",
    ()=>navigation
]);
const navigation = [
    {
        section: "Overview",
        items: [
            {
                key: "founder-dashboard",
                label: "Founder Dashboard",
                icon: "LayoutDashboard",
                children: [
                    {
                        key: "dashboard-main",
                        label: "Overview",
                        href: "/admin/dashboard",
                        page: "dashboard.php",
                        permission: "dashboard.main"
                    },
                    {
                        key: "dashboard-business",
                        label: "Business Dashboard",
                        href: "/admin/dashboards/business",
                        page: "main_dashboard.php",
                        permission: "dashboard.business"
                    },
                    {
                        key: "dashboard-ceo",
                        label: "CEO Decision Matrix",
                        href: "/admin/ceo-matrix",
                        page: "ceo_decision_matrix.php",
                        permission: "dashboard.ceo"
                    }
                ]
            },
            {
                key: "biz-performance",
                label: "Business Performance",
                icon: "TrendingUp",
                children: [
                    {
                        key: "biz-sales",
                        label: "Sales Overview",
                        href: "/admin/dashboard#dashboard_sales_overview",
                        page: "#dashboard_sales_overview",
                        permission: "dashboard.main"
                    },
                    {
                        key: "biz-orders",
                        label: "Orders Overview",
                        href: "/admin/dashboard#dashboard_orders_overview",
                        page: "#dashboard_orders_overview",
                        permission: "dashboard.main"
                    },
                    {
                        key: "biz-shipping",
                        label: "Shipping Overview",
                        href: "/admin/dashboard#dashboard_logistics_overview",
                        page: "#dashboard_logistics_overview",
                        permission: "dashboard.main"
                    },
                    {
                        key: "biz-products",
                        label: "Product & Location Overview",
                        href: "/admin/dashboard#dashboard_products_overview",
                        page: "#dashboard_products_overview",
                        permission: "dashboard.main"
                    }
                ]
            },
            {
                key: "decision-control",
                label: "Decision & Control",
                icon: "Gauge",
                children: [
                    {
                        key: "vendors-scores",
                        label: "Score Management",
                        href: "/admin/vendors/scores",
                        page: "score_management.php",
                        permission: "vendors.scores"
                    },
                    {
                        key: "reports",
                        label: "Reports",
                        href: "/admin/reports",
                        permission: "reports"
                    }
                ]
            }
        ]
    },
    {
        section: "Seller",
        items: [
            {
                key: "seller-dashboard",
                label: "Seller Dashboard",
                icon: "LayoutDashboard",
                children: [
                    {
                        key: "dashboard-sellers",
                        label: "Seller Overview",
                        href: "/admin/dashboards/sellers",
                        page: "seller_dashboard.php",
                        permission: "dashboard.sellers"
                    }
                ]
            },
            {
                key: "seller-mgmt",
                label: "Seller Management",
                icon: "Store",
                children: [
                    {
                        key: "vendors-all",
                        label: "All Sellers",
                        href: "/admin/vendors",
                        page: "seller.php",
                        permission: "vendors"
                    },
                    {
                        key: "vendors-new",
                        label: "Add Seller",
                        href: "/admin/vendors/new",
                        page: "add_seller.php",
                        permission: "vendors.add"
                    },
                    {
                        key: "vendors-verification",
                        label: "Seller Approval",
                        href: "/admin/vendors/verification",
                        page: "seller.php?status=pending",
                        permission: "vendors.verification",
                        badge: "pendingVendors"
                    },
                    {
                        key: "vendors-reports",
                        label: "Vendor Reports",
                        href: "/admin/vendors/reports",
                        permission: "vendors.reports"
                    }
                ]
            },
            {
                key: "seller-catalog",
                label: "Seller Catalog",
                icon: "Package",
                children: [
                    {
                        key: "products-new",
                        label: "Add Product",
                        href: "/admin/products/new",
                        page: "add_product.php",
                        permission: "products",
                        action: "add"
                    },
                    {
                        key: "products-all",
                        label: "Manage Product",
                        href: "/admin/products",
                        page: "manage_product.php",
                        permission: "products"
                    },
                    {
                        key: "pricing-cost-config",
                        label: "Cost & Margin Management",
                        href: "/admin/pricing/cost-config",
                        page: "product_cost_management.php",
                        permission: "pricing.costConfig"
                    },
                    {
                        key: "products-pending",
                        label: "Pending Products",
                        href: "/admin/products/pending",
                        page: "pending_products.php",
                        permission: "products.approval",
                        badge: "pendingProducts"
                    },
                    {
                        key: "products-import",
                        label: "Bulk Import / Update",
                        href: "/admin/products/import",
                        permission: "products.import"
                    },
                    {
                        key: "products-inventory",
                        label: "Inventory",
                        href: "/admin/inventory",
                        permission: "products",
                        badge: "outOfStock"
                    },
                    {
                        key: "products-stock-history",
                        label: "Stock History",
                        href: "/admin/inventory/history",
                        permission: "products"
                    }
                ]
            },
            {
                key: "catalog-master",
                label: "Catalog Master",
                icon: "FolderTree",
                children: [
                    {
                        key: "catalog-categories",
                        label: "Category",
                        href: "/admin/catalog/categories",
                        page: "category.php",
                        permission: "catalog.categories"
                    },
                    {
                        key: "catalog-brands",
                        label: "Brand",
                        href: "/admin/catalog/brands",
                        page: "brand.php",
                        permission: "catalog.brands"
                    },
                    {
                        key: "catalog-feature-categories",
                        label: "Feature Category",
                        href: "/admin/catalog/feature-categories",
                        page: "feature_category.php",
                        permission: "catalog.featureCategories"
                    },
                    {
                        key: "catalog-crop-menu",
                        label: "Crop Menu",
                        href: "/admin/catalog/crop-menu",
                        page: "shop_topics.php",
                        permission: "catalog.cropMenu"
                    },
                    {
                        key: "catalog-attributes",
                        label: "Configuration Attributes",
                        href: "/admin/catalog/attributes",
                        page: "manage_conf_attributes.php",
                        permission: "catalog.attributes"
                    }
                ]
            },
            {
                key: "product-compliance",
                label: "Product Compliance",
                icon: "BadgeCheck",
                children: [
                    {
                        key: "catalog-hsn",
                        label: "HSN Code",
                        href: "/admin/catalog/hsn-codes",
                        page: "manage_hsncode.php",
                        permission: "catalog.hsn"
                    },
                    {
                        key: "catalog-tax",
                        label: "Tax Class",
                        href: "/admin/catalog/tax-classes",
                        page: "manage_tax_class.php",
                        permission: "catalog.tax"
                    },
                    {
                        key: "catalog-return-policies",
                        label: "Return Policy",
                        href: "/admin/catalog/return-policies",
                        page: "manage_return_policy.php",
                        permission: "catalog.returnPolicies"
                    }
                ]
            },
            {
                key: "pricing-margin",
                label: "Pricing & Margin",
                icon: "IndianRupee",
                children: [
                    {
                        key: "pricing-master-nrv",
                        label: "Master NRV",
                        href: "/admin/pricing/master-nrv",
                        page: "add_master_nrv.php",
                        permission: "pricing.masterNrv"
                    },
                    {
                        key: "pricing-calculator",
                        label: "NRV Price Calculator",
                        href: "/admin/pricing",
                        permission: "pricing"
                    },
                    {
                        key: "pricing-commission",
                        label: "Seller Commission",
                        href: "/admin/pricing/commission",
                        permission: "pricing.commission"
                    }
                ]
            },
            {
                key: "packaging",
                label: "Packaging",
                icon: "Boxes",
                children: [
                    {
                        key: "shipping-boxes",
                        label: "Vendor Package Boxes",
                        href: "/admin/shipping/package-boxes",
                        page: "vendor_package_boxes.php",
                        permission: "shipping.boxes"
                    }
                ]
            },
            {
                key: "seller-reports",
                label: "Seller Reports",
                icon: "FileBarChart",
                children: [
                    {
                        key: "dashboard-product-overview",
                        label: "Product Dashboard",
                        href: "/admin/dashboards/product-overview",
                        page: "product_dashboard.php",
                        permission: "dashboard.productOverview"
                    },
                    {
                        key: "dashboard-products",
                        label: "Product Management Dashboard",
                        href: "/admin/dashboards/products",
                        page: "product_management_dashboard.php",
                        permission: "dashboard.products"
                    }
                ]
            }
        ]
    },
    {
        section: "Marketing",
        items: [
            {
                key: "mktg-dashboard",
                label: "Marketing Dashboard",
                icon: "Megaphone",
                children: [
                    {
                        key: "marketing",
                        label: "Marketing Management",
                        href: "/admin/marketing",
                        page: "social_media_dashboard.php",
                        permission: "marketing"
                    }
                ]
            },
            {
                key: "spend-budget",
                label: "Spend & Budget",
                icon: "Wallet",
                children: [
                    {
                        key: "marketing-expenses",
                        label: "Marketing Expenses",
                        href: "/admin/marketing/expenses",
                        page: "marketing_expenses.php",
                        permission: "marketing.expenses"
                    }
                ]
            },
            {
                key: "engagement",
                label: "Engagement",
                icon: "Users",
                children: [
                    {
                        key: "marketing-engagement",
                        label: "Engagement Panel",
                        href: "/admin/marketing/engagement",
                        page: "engagement_panel.php",
                        permission: "marketing.engagement"
                    }
                ]
            },
            {
                key: "offers-promo",
                label: "Offers & Promotions",
                icon: "Tags",
                children: [
                    {
                        key: "customers-coupons",
                        label: "Offer & Coupon",
                        href: "/admin/customers/coupons",
                        page: "coupon.php",
                        permission: "customers.coupons"
                    }
                ]
            },
            {
                key: "website-content",
                label: "Website Content",
                icon: "LayoutTemplate",
                children: [
                    {
                        key: "cms-home-sections",
                        label: "Home Banner",
                        href: "/admin/cms/home-sections",
                        page: "newhomepage_website.php",
                        permission: "cms"
                    },
                    {
                        key: "cms-blogs",
                        label: "Blogs",
                        href: "/admin/cms/blogs",
                        page: "blogs.php",
                        permission: "cms"
                    },
                    {
                        key: "cms-seo",
                        label: "Custom Page",
                        href: "/admin/cms/seo",
                        page: "meta.php",
                        permission: "cms.seo"
                    },
                    {
                        key: "cms-pages",
                        label: "Custom Add Pages",
                        href: "/admin/cms/pages",
                        page: "pages_custom.php",
                        permission: "cms.pages"
                    },
                    {
                        key: "cms-banners",
                        label: "Banners",
                        href: "/admin/cms/banners",
                        permission: "cms"
                    },
                    {
                        key: "cms-events",
                        label: "Events",
                        href: "/admin/cms/events",
                        permission: "cms"
                    },
                    {
                        key: "cms-faqs",
                        label: "FAQs",
                        href: "/admin/cms/faqs",
                        permission: "cms"
                    },
                    {
                        key: "cms-footer",
                        label: "Footer Links",
                        href: "/admin/cms/footer",
                        permission: "cms"
                    },
                    {
                        key: "cms-notifications",
                        label: "Push Notifications",
                        href: "/admin/cms/notifications",
                        permission: "cms.notifications"
                    }
                ]
            }
        ]
    },
    {
        section: "Sales",
        items: [
            {
                key: "sales-overview",
                label: "Sales Overview",
                icon: "LayoutDashboard",
                children: [
                    {
                        key: "dashboard-orders",
                        label: "Sales Dashboard",
                        href: "/admin/dashboards/orders",
                        page: "order_management_dashboard.php",
                        permission: "dashboard.orders"
                    }
                ]
            },
            {
                key: "b2c-sales",
                label: "B2C Sales",
                icon: "ShoppingCart",
                children: [
                    {
                        key: "orders-all",
                        label: "B2C Orders",
                        href: "/admin/orders",
                        page: "manage_orders.php",
                        permission: "orders"
                    },
                    {
                        key: "orders-whatsapp",
                        label: "WhatsApp Orders",
                        href: "/admin/orders/whatsapp",
                        page: "whatsapp_orders.php",
                        permission: "orders.whatsapp"
                    },
                    {
                        key: "orders-new",
                        label: "Create Order",
                        href: "/admin/orders/new",
                        page: "create_order.php",
                        permission: "orders",
                        action: "add"
                    },
                    {
                        key: "orders-invoices",
                        label: "Invoices",
                        href: "/admin/orders/invoices",
                        permission: "orders.invoices"
                    },
                    {
                        key: "orders-transactions",
                        label: "Date-wise Transactions",
                        href: "/admin/orders/transactions",
                        permission: "orders.transactions"
                    },
                    {
                        key: "orders-report",
                        label: "Order Reports",
                        href: "/admin/orders/report",
                        page: "orders_report.php",
                        permission: "orders.transactions"
                    },
                    {
                        key: "orders-sr-checkout",
                        label: "Shiprocket Checkout",
                        href: "/admin/orders/sr-checkout",
                        permission: "orders.srCheckout"
                    },
                    {
                        key: "orders-insights",
                        label: "Order Insights",
                        href: "/admin/orders/insights",
                        permission: "orders"
                    }
                ]
            },
            {
                key: "b2b-sales",
                label: "B2B Sales",
                icon: "Building2",
                children: [
                    {
                        key: "b2b-dashboard",
                        label: "B2B Dashboard",
                        href: "/admin/b2b",
                        page: "b2b_orders/index.php",
                        permission: "b2b"
                    },
                    {
                        key: "b2b-buyers",
                        label: "Buyers",
                        href: "/admin/b2b/buyers",
                        page: "b2b_orders/buyers.php",
                        permission: "b2b.buyers"
                    },
                    {
                        key: "b2b-rfqs",
                        label: "RFQs",
                        href: "/admin/b2b/rfqs",
                        page: "b2b_orders/rfqs.php",
                        permission: "b2b.rfqs",
                        badge: "openRfqs"
                    },
                    {
                        key: "b2b-quotations",
                        label: "B2B Quotations",
                        href: "/admin/b2b/quotations",
                        page: "b2b_orders/b2b_quotations.php",
                        permission: "b2b.quotations"
                    },
                    {
                        key: "b2b-quote-new",
                        label: "Create Quotation",
                        href: "/admin/b2b/quotations/new",
                        page: "b2b_orders/b2b_quotations.php",
                        permission: "b2b.quotations",
                        action: "add"
                    },
                    {
                        key: "b2b-catalog",
                        label: "Catalog / Products",
                        href: "/admin/b2b/catalog",
                        page: "b2b_orders/catalog.php",
                        permission: "b2b.catalog"
                    },
                    {
                        key: "b2b-catalog-generate",
                        label: "Generate Catalogue",
                        href: "/admin/b2b/catalog/generate",
                        page: "b2b_orders/catalog.php",
                        permission: "b2b.catalog"
                    },
                    {
                        key: "b2b-orders",
                        label: "B2B Orders List",
                        href: "/admin/b2b/orders",
                        page: "b2b_orders/b2b_order_list.php",
                        permission: "b2b.orders"
                    },
                    {
                        key: "b2b-approvals",
                        label: "Approvals",
                        href: "/admin/b2b/approvals",
                        page: "b2b_orders/approvals.php",
                        permission: "b2b.approvals"
                    },
                    {
                        key: "b2b-reports",
                        label: "B2B Reports",
                        href: "/admin/b2b/reports",
                        page: "b2b_orders/reports.php",
                        permission: "b2b.reports"
                    },
                    {
                        key: "b2b-payments",
                        label: "Payments & Credit",
                        href: "/admin/b2b/payments",
                        permission: "b2b.finance"
                    },
                    {
                        key: "b2b-claims",
                        label: "Returns / Claims",
                        href: "/admin/b2b/claims",
                        permission: "b2b.orders"
                    },
                    {
                        key: "b2b-alerts",
                        label: "Alerts",
                        href: "/admin/b2b/alerts",
                        permission: "b2b"
                    }
                ]
            },
            {
                key: "bulk-sales",
                label: "Bulk Sales",
                icon: "Boxes",
                children: [
                    {
                        key: "bulk-dashboard",
                        label: "Bulk Order Dashboard",
                        href: "/admin/bulk-orders/dashboard",
                        page: "bulk_orders/index.php",
                        permission: "bulk.dashboard"
                    },
                    {
                        key: "bulk-inquiries",
                        label: "Bulk Inquiry",
                        href: "/admin/bulk-orders",
                        page: "bulk_orders/bulk_inquiry.php",
                        permission: "bulk"
                    },
                    {
                        key: "bulk-quotations",
                        label: "Quotations",
                        href: "/admin/bulk-orders/quotations",
                        page: "bulk_orders/quotations.php",
                        permission: "bulk.quotations"
                    },
                    {
                        key: "bulk-create",
                        label: "Create Order",
                        href: "/admin/bulk-orders/new",
                        page: "bulk_orders/create_order.php",
                        permission: "bulk.create"
                    },
                    {
                        key: "bulk-orders",
                        label: "All Orders",
                        href: "/admin/bulk-orders/orders",
                        page: "bulk_orders/orders.php",
                        permission: "bulk.orders"
                    },
                    {
                        key: "bulk-products",
                        label: "Products",
                        href: "/admin/bulk-orders/products",
                        page: "bulk_orders/products.php",
                        permission: "bulk.products"
                    },
                    {
                        key: "bulk-warehouses",
                        label: "Warehouses",
                        href: "/admin/bulk-orders/warehouses",
                        permission: "bulk"
                    }
                ]
            },
            {
                key: "crm-leads",
                label: "CRM & Leads",
                icon: "Contact",
                children: [
                    {
                        key: "crm-dashboard",
                        label: "Lead Dashboard",
                        href: "/admin/crm",
                        page: "lead_dashboard.php",
                        permission: "crm"
                    },
                    {
                        key: "crm-add-lead",
                        label: "Add Lead",
                        href: "/admin/crm/add-lead",
                        page: "add_lead.php",
                        permission: "crm.addLead"
                    },
                    {
                        key: "crm-convert",
                        label: "Convert to Leads",
                        href: "/admin/crm/convert",
                        page: "manage_engagement_leads.php",
                        permission: "crm.convert"
                    },
                    {
                        key: "crm-agent-leads",
                        label: "Sales Agent Leads",
                        href: "/admin/crm/agent-leads",
                        page: "sales_agent_leads.php",
                        permission: "crm.agentLeads"
                    },
                    {
                        key: "crm-legacy",
                        label: "Manage All Leads",
                        href: "/admin/crm/legacy-leads",
                        page: "manager_all_leads.php",
                        permission: "crm.legacy"
                    },
                    {
                        key: "crm-unassigned",
                        label: "Unassigned Leads",
                        href: "/admin/crm/unassigned",
                        page: "pending_leads.php",
                        permission: "crm.unassigned"
                    },
                    {
                        key: "crm-dead",
                        label: "Dead Leads",
                        href: "/admin/crm/dead",
                        page: "dead_leads.php",
                        permission: "crm.dead"
                    },
                    {
                        key: "crm-leads",
                        label: "CRM Lead Sheet",
                        href: "/admin/crm/leads",
                        page: "crm_leads.php",
                        permission: "crm.leads"
                    },
                    {
                        key: "crm-tracking",
                        label: "Customer Tracking",
                        href: "/admin/crm/customer-tracking",
                        page: "customer_search_tracking.php",
                        permission: "crm.tracking"
                    },
                    {
                        key: "crm-requested",
                        label: "Requested Leads",
                        href: "/admin/crm/requested",
                        page: "report_requested_leads.php",
                        permission: "crm.requested"
                    },
                    {
                        key: "crm-follow-ups",
                        label: "Follow-ups",
                        href: "/admin/crm/follow-ups",
                        permission: "crm.leads",
                        badge: "dueFollowUps"
                    },
                    {
                        key: "crm-whatsapp",
                        label: "WhatsApp Leads",
                        href: "/admin/crm/whatsapp",
                        permission: "crm.whatsapp"
                    },
                    {
                        key: "crm-circles",
                        label: "Circle Assignment",
                        href: "/admin/crm/circles",
                        permission: "crm.circles"
                    }
                ]
            },
            {
                key: "telesales",
                label: "Telesales",
                icon: "Phone",
                children: [
                    {
                        key: "crm-ai-calls",
                        label: "AI Calling Agent",
                        href: "/admin/crm/ai-calls",
                        page: "vapi_calls.php",
                        permission: "crm.aiCalls"
                    },
                    {
                        key: "crm-call-audit",
                        label: "AI Call Audit",
                        href: "/admin/crm/call-audit",
                        permission: "crm.callAudit"
                    }
                ]
            },
            {
                key: "target-performance",
                label: "Target & Performance",
                icon: "Target",
                children: [
                    {
                        key: "sales-dashboard",
                        label: "Sales Target Management",
                        href: "/admin/sales",
                        page: "sales_target_management.php",
                        permission: "sales"
                    },
                    {
                        key: "sales-my-performance",
                        label: "My Sales Performance",
                        href: "/admin/sales/my-performance",
                        page: "my_sales_performance.php",
                        permission: "sales.myPerformance"
                    },
                    {
                        key: "sales-team-performance",
                        label: "Team Performance",
                        href: "/admin/sales/team-performance",
                        page: "sales_performance_report.php",
                        permission: "sales.teamPerformance"
                    },
                    {
                        key: "sales-targets",
                        label: "Targets",
                        href: "/admin/sales/targets",
                        permission: "sales.targets"
                    },
                    {
                        key: "sales-salary",
                        label: "Salary Structure",
                        href: "/admin/sales/salary",
                        permission: "sales.salary"
                    },
                    {
                        key: "sales-achievements",
                        label: "Achievements",
                        href: "/admin/sales/achievements",
                        permission: "sales.targets"
                    },
                    {
                        key: "sales-payouts",
                        label: "Sales Payouts",
                        href: "/admin/sales/payouts",
                        permission: "sales.payouts"
                    },
                    {
                        key: "sales-prepaid",
                        label: "Prepaid Incentive Setup",
                        href: "/admin/sales/prepaid-incentive",
                        permission: "sales.salary"
                    }
                ]
            }
        ]
    },
    {
        section: "Operation",
        items: [
            {
                key: "ops-control",
                label: "Operations Control",
                icon: "RadioTower",
                children: [
                    {
                        key: "ops-team-dashboard",
                        label: "Operations Dashboard",
                        href: "/admin/operations/team",
                        page: "operations_team/dashboard.php",
                        permission: "operations.team"
                    },
                    {
                        key: "ops-command",
                        label: "Operations Center",
                        href: "/admin/operations",
                        page: "operations_center/index.php",
                        permission: "operations.center"
                    },
                    {
                        key: "ops-team-setup",
                        label: "Setup",
                        href: "/admin/operations/team/setup",
                        page: "operations_team/setup.php",
                        permission: "operations.setup"
                    },
                    {
                        key: "ops-team-assign",
                        label: "My Orders",
                        href: "/admin/operations/team/assignments",
                        page: "operations_team/agent_orders.php",
                        permission: "operations.team"
                    },
                    {
                        key: "ops-ndr",
                        label: "NDR & Escalations",
                        href: "/admin/operations/ndr",
                        permission: "operations.center",
                        badge: "openEscalations"
                    },
                    {
                        key: "ops-recordings",
                        label: "Call Recordings",
                        href: "/admin/operations/recordings",
                        permission: "operations.center"
                    },
                    {
                        key: "ops-rules",
                        label: "Rules & SLA",
                        href: "/admin/operations/rules",
                        permission: "operations.rules"
                    }
                ]
            },
            {
                key: "order-fulfilment",
                label: "Order Fulfilment",
                icon: "ShoppingCart",
                children: [
                    {
                        key: "ops-orders",
                        label: "Manage Orders",
                        href: "/admin/orders",
                        page: "manage_orders.php",
                        permission: "orders"
                    }
                ]
            },
            {
                key: "shipments",
                label: "Shipments",
                icon: "Truck",
                children: [
                    {
                        key: "shipping-shipments",
                        label: "Shiprocket Orders",
                        href: "/admin/shipping",
                        page: "shiprocket_orders_report.php",
                        permission: "shipping",
                        badge: "pendingShipments"
                    },
                    {
                        key: "shipping-delhivery",
                        label: "Delhivery Orders",
                        href: "/admin/shipping/delhivery",
                        page: "shipment_order_delhivery.php",
                        permission: "shipping.delhivery"
                    },
                    {
                        key: "shipping-weight",
                        label: "Weight Discrepancy",
                        href: "/admin/shipping/weight-discrepancy",
                        page: "weight_discrapancy.php",
                        permission: "shipping.weight"
                    },
                    {
                        key: "returns-all",
                        label: "Return Shipments",
                        href: "/admin/returns",
                        page: "manage_returns.php",
                        permission: "returns",
                        badge: "pendingReturns"
                    },
                    {
                        key: "orders-delivered",
                        label: "Master Delivered Orders",
                        href: "/admin/orders/delivered",
                        page: "master_delivered_orders.php",
                        permission: "orders.delivered"
                    },
                    {
                        key: "returns-rto",
                        label: "RTO Ledger",
                        href: "/admin/rto",
                        permission: "rto"
                    },
                    {
                        key: "orders-rto-analysis",
                        label: "RTO Analysis",
                        href: "/admin/orders/insights#rto-analysis",
                        permission: "orders"
                    },
                    {
                        key: "returns-reasons",
                        label: "Return Reasons",
                        href: "/admin/returns/reasons",
                        permission: "returns"
                    }
                ]
            },
            {
                key: "courier-serviceability",
                label: "Courier & Serviceability",
                icon: "MapPin",
                children: [
                    {
                        key: "shipping-pincodes",
                        label: "Shiprocket Serviceability",
                        href: "/admin/shipping/pincodes",
                        page: "courier_serviceability.php",
                        permission: "shipping.pincodes"
                    },
                    {
                        key: "shipping-delhivery-pincodes",
                        label: "Delhivery Serviceability",
                        href: "/admin/shipping/delhivery-serviceability",
                        page: "servicebilty_delhivery.php",
                        permission: "shipping.delhiveryPincodes"
                    },
                    {
                        key: "shipping-courier-slabs",
                        label: "Courier Cost Slab",
                        href: "/admin/shipping/courier-slabs",
                        page: "courier_cost_slab_master.php",
                        permission: "shipping.rates"
                    },
                    {
                        key: "shipping-other-charges",
                        label: "Other Charges",
                        href: "/admin/shipping/other-charges",
                        permission: "shipping.rates"
                    }
                ]
            },
            {
                key: "pickup",
                label: "Pickup",
                icon: "Package",
                children: [
                    {
                        key: "shipping-pickup-addresses",
                        label: "Pickup Addresses",
                        href: "/admin/shipping/pickup-addresses",
                        page: "pickup_addresses.php",
                        permission: "shipping.pickupAddresses"
                    },
                    {
                        key: "shipping-pickup-requests",
                        label: "Pickup Update",
                        href: "/admin/shipping/pickup-requests",
                        page: "manage_pickup_requests.php",
                        permission: "shipping.pickupRequests"
                    }
                ]
            },
            {
                key: "b2b-ops",
                label: "B2B Operations",
                icon: "Building2",
                children: [
                    {
                        key: "b2b-ops-queue",
                        label: "Operations Queue",
                        href: "/admin/b2b/ops-queue",
                        page: "b2b_orders/ops_queue.php",
                        permission: "b2b.opsQueue"
                    },
                    {
                        key: "b2b-logistics",
                        label: "B2B Logistics",
                        href: "/admin/b2b/logistics",
                        page: "b2b_orders/logistics.php",
                        permission: "b2b.logistics"
                    }
                ]
            },
            {
                key: "bulk-ops",
                label: "Bulk Operations",
                icon: "Boxes",
                children: [
                    {
                        key: "bulk-shipments",
                        label: "Bulk Shipments",
                        href: "/admin/bulk-orders/shipments",
                        page: "bulk_orders/shipments.php",
                        permission: "bulk.shipments"
                    }
                ]
            },
            {
                key: "ops-reports",
                label: "Operations Reports",
                icon: "FileBarChart",
                children: [
                    {
                        key: "ops-team-overall",
                        label: "Overall Report",
                        href: "/admin/operations/team/overall",
                        page: "operations_team/overall_report.php",
                        permission: "operations.overall"
                    },
                    {
                        key: "ops-team-agents",
                        label: "Agent Report",
                        href: "/admin/operations/team/agents",
                        page: "operations_team/agent_report.php",
                        permission: "operations.team"
                    },
                    {
                        key: "dashboard-logistics",
                        label: "Logistics Operations Dashboard",
                        href: "/admin/dashboards/logistics",
                        page: "logistics_operations_dashboard.php",
                        permission: "dashboard.logistics"
                    }
                ]
            }
        ]
    },
    {
        section: "Tech",
        items: [
            {
                key: "tech-settings",
                label: "Technical Settings",
                icon: "Cpu",
                sensitive: true,
                children: [
                    {
                        key: "settings-scripts",
                        label: "Script Settings",
                        href: "/admin/settings/scripts",
                        page: "script_settings.php",
                        permission: "settings.scripts"
                    },
                    {
                        key: "settings-smtp",
                        label: "SMTP Settings",
                        href: "/admin/settings/smtp",
                        page: "smtp_settings.php",
                        permission: "settings"
                    },
                    {
                        key: "settings-sms",
                        label: "SMS Settings",
                        href: "/admin/settings/sms",
                        page: "sms_settings.php",
                        permission: "settings"
                    },
                    {
                        key: "settings-integrations",
                        label: "Integrations",
                        href: "/admin/settings/integrations",
                        permission: "settings"
                    }
                ]
            }
        ]
    },
    {
        section: "Finance",
        items: [
            {
                key: "finance-dashboard",
                label: "Finance Dashboard",
                icon: "Landmark",
                sensitive: true,
                children: [
                    {
                        key: "finance-pnl",
                        label: "Finance Dashboard",
                        href: "/admin/finance",
                        page: "finance.php",
                        permission: "finance"
                    }
                ]
            },
            {
                key: "rev-profit",
                label: "Revenue & Profitability",
                icon: "TrendingUp",
                sensitive: true,
                children: [
                    {
                        key: "finance-gmv-booked",
                        label: "Booked GMV",
                        href: "/admin/finance#gmv_booked",
                        page: "finance.php#gmv_booked",
                        permission: "finance"
                    },
                    {
                        key: "finance-gmv-delivered",
                        label: "Delivered GMV",
                        href: "/admin/finance#gmv_delivered",
                        page: "finance.php#gmv_delivered",
                        permission: "finance"
                    },
                    {
                        key: "finance-platform-revenue",
                        label: "Platform Revenue / Take Rate",
                        href: "/admin/finance#platform_revenue",
                        page: "finance.php#platform_revenue",
                        permission: "finance"
                    },
                    {
                        key: "finance-cm-margin",
                        label: "Contribution Margin / CM %",
                        href: "/admin/finance#cm_margin",
                        page: "finance.php#cm_margin",
                        permission: "finance"
                    },
                    {
                        key: "finance-net-profit",
                        label: "Fixed Cost / Net Profit",
                        href: "/admin/finance#net_profit",
                        page: "finance.php#net_profit",
                        permission: "finance"
                    }
                ]
            },
            {
                key: "expenses",
                label: "Expenses",
                icon: "Receipt",
                children: [
                    {
                        key: "finance-fixed-expenses",
                        label: "Fixed Expenses",
                        href: "/admin/finance/fixed-expenses",
                        page: "fixed_expenses.php",
                        permission: "finance.expenses"
                    },
                    {
                        key: "finance-expense-limits",
                        label: "Expense Limit Dashboard",
                        href: "/admin/finance/expense-limits",
                        page: "expense_limit_dashboard.php",
                        permission: "finance.expenses"
                    }
                ]
            },
            {
                key: "seller-settlement",
                label: "Seller Settlement",
                icon: "Wallet",
                sensitive: true,
                children: [
                    {
                        key: "payouts-cycles",
                        label: "Payout Vendor",
                        href: "/admin/payouts",
                        page: "payout_new.php",
                        permission: "payouts"
                    },
                    {
                        key: "finance-hold-ledger",
                        label: "Hold Ledger",
                        href: "/admin/finance/hold-ledger",
                        page: "hold_ledger.php",
                        permission: "finance.holdLedger"
                    },
                    {
                        key: "b2b-settlements",
                        label: "B2B Settlements",
                        href: "/admin/b2b/settlements",
                        page: "b2b_orders/settlements.php",
                        permission: "b2b.finance"
                    },
                    {
                        key: "payouts-items",
                        label: "Payout Items",
                        href: "/admin/payouts/items",
                        permission: "payouts"
                    },
                    {
                        key: "payouts-access",
                        label: "Payout Access Settings",
                        href: "/admin/payouts/access",
                        permission: "payouts.access"
                    },
                    {
                        key: "payouts-legacy",
                        label: "Legacy Payments",
                        href: "/admin/payouts/legacy",
                        permission: "payouts"
                    }
                ]
            },
            {
                key: "payment-refund",
                label: "Payment & Refund",
                icon: "Undo2",
                children: [
                    {
                        key: "returns-refunds",
                        label: "Refund Return Report",
                        href: "/admin/refunds",
                        page: "returns_refunds_report.php",
                        permission: "refunds"
                    }
                ]
            },
            {
                key: "accts-reports",
                label: "Accounts & Reports",
                icon: "FileBarChart",
                sensitive: true,
                children: [
                    {
                        key: "dashboard-finance",
                        label: "Finance Payout Dashboard",
                        href: "/admin/dashboards/finance",
                        page: "finance_payout_dashboard.php",
                        permission: "dashboard.finance"
                    },
                    {
                        key: "finance-ledger",
                        label: "Ledger Management",
                        href: "/admin/finance/ledger",
                        permission: "finance.ledger"
                    },
                    {
                        key: "finance-cod",
                        label: "COD Reconciliation",
                        href: "/admin/finance/cod",
                        permission: "finance"
                    },
                    {
                        key: "finance-gst",
                        label: "GST & TCS",
                        href: "/admin/finance/gst",
                        permission: "finance.tax"
                    },
                    {
                        key: "finance-wallet",
                        label: "Wallet Withdrawals",
                        href: "/admin/finance/wallet-withdrawals",
                        permission: "finance.wallet"
                    }
                ]
            },
            {
                key: "fin-risk",
                label: "Risk",
                icon: "ShieldAlert",
                children: [
                    {
                        key: "finance-fraud",
                        label: "Fraud Analysis Dashboard",
                        href: "/admin/finance/fraud",
                        page: "fraud_analysis_dashboard.php",
                        permission: "finance.fraud"
                    }
                ]
            }
        ]
    },
    {
        section: null,
        items: [
            {
                key: "hiring-applications",
                label: "Job Applications",
                icon: "Briefcase",
                href: "/admin/hiring/applications",
                page: "vacancy_applications.php",
                permission: "hiring.applications"
            }
        ]
    },
    {
        section: "Support",
        items: [
            {
                key: "support-dashboard",
                label: "Support Dashboard",
                icon: "LifeBuoy",
                children: [
                    {
                        key: "support-tickets",
                        label: "Helpdesk / Support",
                        href: "/admin/support",
                        page: "support/admin_dashboard.php",
                        permission: "support",
                        badge: "openTickets"
                    },
                    {
                        key: "support-sla",
                        label: "Departments & SLA",
                        href: "/admin/support/sla",
                        permission: "support.settings"
                    }
                ]
            },
            {
                key: "communication",
                label: "Communication",
                icon: "MessagesSquare",
                children: [
                    {
                        key: "support-chat-logs",
                        label: "Chatbot Logs",
                        href: "/admin/support/chat-logs",
                        page: "chat_logs.php",
                        permission: "support.chatLogs"
                    }
                ]
            },
            {
                key: "requests",
                label: "Requests",
                icon: "ClipboardList",
                children: [
                    {
                        key: "support-requirements",
                        label: "Requirement Requests",
                        href: "/admin/support/requirements",
                        page: "requirement_requests.php",
                        permission: "support.requirements"
                    }
                ]
            },
            {
                key: "reviews",
                label: "Reviews",
                icon: "Star",
                children: [
                    {
                        key: "customers-pending-reviews",
                        label: "Pending Reviews",
                        href: "/admin/customers/reviews/pending",
                        page: "product_review.php",
                        permission: "customers.pendingReviews"
                    },
                    {
                        key: "customers-reviews",
                        label: "Manage Reviews",
                        href: "/admin/customers/reviews",
                        page: "manage_review.php",
                        permission: "customers.reviews"
                    }
                ]
            }
        ]
    },
    {
        section: "Admin",
        items: [
            {
                key: "user-staff",
                label: "User & Staff",
                icon: "Users",
                children: [
                    {
                        key: "customers-all",
                        label: "Manage All User",
                        href: "/admin/customers",
                        page: "app-user.php",
                        permission: "customers"
                    },
                    {
                        key: "users-new",
                        label: "Add Staff",
                        href: "/admin/users/new",
                        page: "add-staff.php",
                        permission: "users.add"
                    },
                    {
                        key: "access-users",
                        label: "Staff User",
                        href: "/admin/users",
                        page: "manage-staff.php",
                        permission: "users"
                    }
                ]
            },
            {
                key: "roles-permissions",
                label: "Roles & Permissions",
                icon: "ShieldCheck",
                sensitive: true,
                children: [
                    {
                        key: "access-roles",
                        label: "Manage Role",
                        href: "/admin/roles",
                        page: "manage-role.php",
                        permission: "roles"
                    },
                    {
                        key: "access-menus",
                        label: "Menu Master",
                        href: "/admin/roles/menus",
                        page: "menu-master.php",
                        permission: "roles.menus"
                    },
                    {
                        key: "access-audit",
                        label: "Audit Log",
                        href: "/admin/audit",
                        permission: "audit"
                    }
                ]
            },
            {
                key: "business-rules",
                label: "Business Rules",
                icon: "Settings",
                children: [
                    {
                        key: "masters-reject-reasons",
                        label: "Manage Reject Reason",
                        href: "/admin/masters/reject-reasons",
                        page: "reject-reason.php",
                        permission: "masters"
                    },
                    {
                        key: "shipping-slabs",
                        label: "Manage Shipping Slabs",
                        href: "/admin/shipping/slabs",
                        page: "manage_shipping_slabs.php",
                        permission: "shipping.rates"
                    },
                    {
                        key: "shipping-min-order",
                        label: "Manage Minimum Order",
                        href: "/admin/shipping/minimums#minimum-order",
                        page: "manage_minimum_order.php",
                        permission: "shipping.rules"
                    },
                    {
                        key: "shipping-min-cod",
                        label: "Manage Minimum COD",
                        href: "/admin/shipping/minimums#minimum-cod",
                        page: "manage_minimum_cod.php",
                        permission: "shipping.rules"
                    },
                    {
                        key: "shipping-cod-rules",
                        label: "Manage COD State Rule",
                        href: "/admin/shipping/cod-rules",
                        page: "manage_cod_state_rule.php",
                        permission: "shipping.rules"
                    }
                ]
            },
            {
                key: "general-settings",
                label: "General Settings",
                icon: "Settings",
                sensitive: true,
                children: [
                    {
                        key: "settings-system",
                        label: "General Settings",
                        href: "/admin/settings",
                        page: "system_settings.php",
                        permission: "settings"
                    },
                    {
                        key: "settings-languages",
                        label: "Language Settings",
                        href: "/admin/settings/languages",
                        page: "language_settings.php",
                        permission: "settings"
                    },
                    {
                        key: "masters-currency",
                        label: "Currency Settings",
                        href: "/admin/masters/currency",
                        page: "currency_settings.php",
                        permission: "masters"
                    },
                    {
                        key: "masters-geography",
                        label: "Country / State / City",
                        href: "/admin/masters/geography",
                        permission: "masters"
                    }
                ]
            },
            {
                key: "templates",
                label: "Templates",
                icon: "Mail",
                children: [
                    {
                        key: "settings-email-templates",
                        label: "Email Template",
                        href: "/admin/settings/email-templates",
                        page: "email_template.php",
                        permission: "settings"
                    }
                ]
            },
            {
                key: "ui-website-settings",
                label: "UI / Website Settings",
                icon: "LayoutTemplate",
                children: [
                    {
                        key: "settings-login-modal",
                        label: "Login Modal",
                        href: "/admin/settings/login-modal",
                        page: "signup_modal_settings.php",
                        permission: "settings.loginModal"
                    }
                ]
            }
        ]
    },
    {
        section: null,
        items: [
            {
                key: "hiring-vacancies",
                label: "Hiring Vacancies",
                icon: "Briefcase",
                href: "/admin/hiring/vacancies",
                page: "vacancies.php",
                permission: "hiring.vacancies"
            }
        ]
    },
    {
        section: "Help",
        items: [
            {
                key: "help",
                label: "Help & Guide",
                icon: "CircleHelp",
                href: "/admin/help"
            }
        ]
    }
];
const hiddenRoutes = [
    {
        pattern: /^\/admin\/orders\/[^/]+$/,
        label: "Order Details",
        parent: "/admin/orders"
    },
    {
        pattern: /^\/admin\/products\/[^/]+$/,
        label: "Product Details",
        parent: "/admin/products"
    },
    {
        pattern: /^\/admin\/vendors\/[^/]+\/bank$/,
        label: "Bank Details",
        parent: "/admin/vendors"
    },
    {
        pattern: /^\/admin\/vendors\/[^/]+$/,
        label: "Vendor Details",
        parent: "/admin/vendors"
    },
    {
        pattern: /^\/admin\/customers\/[^/]+$/,
        label: "Customer Details",
        parent: "/admin/customers"
    },
    {
        pattern: /^\/admin\/returns\/[^/]+$/,
        label: "Return Details",
        parent: "/admin/returns"
    },
    {
        pattern: /^\/admin\/payouts\/[^/]+$/,
        label: "Payout Details",
        parent: "/admin/payouts"
    },
    {
        pattern: /^\/admin\/support\/[^/]+$/,
        label: "Ticket Details",
        parent: "/admin/support"
    },
    {
        pattern: /^\/admin\/crm\/leads\/[^/]+$/,
        label: "Lead Details",
        parent: "/admin/crm/leads"
    },
    {
        pattern: /^\/admin\/b2b\/buyers\/[^/]+$/,
        label: "Buyer 360",
        parent: "/admin/b2b/buyers"
    },
    {
        pattern: /^\/admin\/b2b\/orders\/[^/]+$/,
        label: "B2B Order Details",
        parent: "/admin/b2b/orders"
    },
    {
        pattern: /^\/admin\/roles\/[^/]+$/,
        label: "Edit Role",
        parent: "/admin/roles"
    },
    {
        pattern: /^\/admin\/account$/,
        label: "My Account"
    }
];
const pathOf = (href)=>(href || "").split(/[?#]/)[0];
function flattenNavigation(tree = navigation) {
    const rows = [];
    for (const section of tree){
        for (const item of section.items){
            if (item.href) rows.push({
                ...item,
                section: section.section,
                group: null
            });
            for (const child of item.children || []){
                rows.push({
                    ...child,
                    section: section.section,
                    group: item
                });
            }
        }
    }
    return rows;
}
function findNavItem(pathname) {
    const leaves = flattenNavigation().filter((item)=>item.href);
    const exact = leaves.find((item)=>pathOf(item.href) === pathname);
    if (exact) return exact;
    return leaves.filter((item)=>pathname.startsWith(`${pathOf(item.href)}/`)).sort((a, b)=>pathOf(b.href).length - pathOf(a.href).length)[0];
}
function getBreadcrumbs(pathname) {
    const crumbs = [
        {
            label: "Admin",
            href: "/admin/dashboard"
        }
    ];
    const exact = flattenNavigation().find((item)=>item.href && pathOf(item.href) === pathname);
    if (exact) {
        if (exact.group) crumbs.push({
            label: exact.group.label
        });
        crumbs.push({
            label: exact.label,
            href: pathOf(exact.href)
        });
        return crumbs;
    }
    const hidden = hiddenRoutes.find((route)=>route.pattern.test(pathname));
    if (hidden) {
        const parent = hidden.parent && flattenNavigation().find((item)=>item.href === hidden.parent);
        if (parent?.group) crumbs.push({
            label: parent.group.label
        });
        if (parent) crumbs.push({
            label: parent.label,
            href: parent.href
        });
        crumbs.push({
            label: hidden.label
        });
        return crumbs;
    }
    const nearest = findNavItem(pathname);
    if (nearest) {
        if (nearest.group) crumbs.push({
            label: nearest.group.label
        });
        crumbs.push({
            label: nearest.label,
            href: pathOf(nearest.href)
        });
    }
    return crumbs;
}
function getPermissionCatalog() {
    const seen = new Map();
    for (const section of navigation){
        for (const item of section.items){
            const leaves = item.children || [
                item
            ];
            for (const leaf of leaves){
                if (!leaf.permission || seen.has(leaf.permission)) continue;
                seen.set(leaf.permission, {
                    key: leaf.permission,
                    label: leaf.action ? item.label : leaf.label,
                    group: item.children ? item.label : section.section || leaf.label,
                    section: section.section || leaf.label,
                    sensitive: Boolean(item.sensitive)
                });
            }
        }
    }
    return [
        ...seen.values()
    ];
}
}),
"[project]/src/lib/format.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorMessage",
    ()=>errorMessage,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatINR",
    ()=>formatINR,
    "formatNumber",
    ()=>formatNumber,
    "formatPercent",
    ()=>formatPercent,
    "formatPhpDate",
    ()=>formatPhpDate,
    "formatRelative",
    ()=>formatRelative,
    "formatWhen",
    ()=>formatWhen,
    "initials",
    ()=>initials,
    "inr",
    ()=>inr,
    "localIso",
    ()=>localIso,
    "maskAccount",
    ()=>maskAccount,
    "maskEmail",
    ()=>maskEmail,
    "maskMobile",
    ()=>maskMobile,
    "presentOrder",
    ()=>presentOrder,
    "statusVariant",
    ()=>statusVariant
]);
const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
});
const inrCompactFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1
});
const numberFormatter = new Intl.NumberFormat("en-IN");
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
});
const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
});
function formatINR(value, { compact = false } = {}) {
    if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
    return (compact ? inrCompactFormatter : inrFormatter).format(Number(value));
}
function formatNumber(value) {
    if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
    return numberFormatter.format(Number(value));
}
function formatPercent(value, digits = 1) {
    if (value == null || value === "" || Number.isNaN(Number(value))) return "—";
    return `${Number(value).toFixed(digits)}%`;
}
function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}
function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}
const phpDateParts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Kolkata"
});
function formatPhpDate(value, pattern) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const p = Object.fromEntries(phpDateParts.formatToParts(date).map(({ type, value: v })=>[
            type,
            v
        ]));
    const tokens = {
        d: p.day,
        M: p.month,
        Y: p.year,
        H: p.hour,
        i: p.minute,
        a: Number(p.hour) < 12 ? "am" : "pm"
    };
    return pattern.replace(/[dMYHia]/g, (c)=>tokens[c]);
}
function formatRelative(value, now = Date.now()) {
    if (!value) return "—";
    const diff = Math.round((new Date(value).getTime() - now) / 60000);
    const abs = Math.abs(diff);
    const suffix = diff < 0 ? "ago" : "from now";
    if (abs < 1) return "just now";
    if (abs < 60) return `${abs} min ${suffix}`;
    if (abs < 60 * 24) return `${Math.round(abs / 60)} h ${suffix}`;
    return `${Math.round(abs / 1440)} d ${suffix}`;
}
function maskMobile(value) {
    if (!value) return "—";
    const digits = String(value).replace(/\D/g, "");
    if (digits.length < 4) return "••••";
    return `${"•".repeat(Math.max(digits.length - 4, 2))}${digits.slice(-4)}`;
}
function maskEmail(value) {
    if (!value || !String(value).includes("@")) return "—";
    const [name, domain] = String(value).split("@");
    return `${name.slice(0, 2)}${"•".repeat(Math.max(name.length - 2, 2))}@${domain}`;
}
function maskAccount(value) {
    if (!value) return "—";
    const str = String(value);
    return `•••• ${str.slice(-4)}`;
}
function inr(value) {
    return formatINR(value);
}
function formatWhen(value) {
    return formatDateTime(value);
}
function errorMessage(error) {
    if (!error) return "Something went wrong.";
    if (typeof error === "string") return error;
    return error.message || "Something went wrong.";
}
function localIso(date) {
    const value = date instanceof Date ? date : new Date(date);
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
}
function statusVariant(status) {
    const value = String(status || "").toLowerCase();
    if (/(deliver|active|paid|verified|completed|resolved|success)/.test(value)) return "default";
    if (/(rto|cancel|reject|fail|refund)/.test(value)) return "destructive";
    if (/(pending|partial|progress|hold)/.test(value)) return "secondary";
    return "outline";
}
function presentOrder(order) {
    const lines = Array.isArray(order?.items) ? order.items : [];
    const tracked = lines.find((line)=>line?.trackingUrl) || lines.find((line)=>line?.courier) || lines[0] || {};
    const customer = order?.customer;
    const name = typeof customer === "string" ? customer : customer?.name;
    const invoices = [
        ...new Set(lines.map((line)=>line?.invoiceNumber).filter(Boolean))
    ];
    const pickup = lines.map((line)=>String(line?.pickupType || "").toLowerCase());
    const shipping = !lines.length ? "—" : pickup.some((type)=>type === "self") ? "Self Shipping" : "Ship By Bharat Agrolink";
    return {
        id: order?.orderId ?? order?.id ?? "—",
        createdAt: formatDateTime(order?.createdAt),
        customer: name || "—",
        courier: tracked.courier || tracked.carrier || "—",
        invoice: invoices.join(", ") || "—",
        items: order?.itemCount ?? lines.length,
        shipping,
        payment: typeof order?.payment === "string" ? order.payment : order?.payment?.mode || "—",
        status: order?.status || "—",
        amount: formatINR(order?.totalAmount ?? order?.amount),
        responsible: order?.responsible || "—",
        trackingUrl: tracked.trackingUrl || ""
    };
}
function initials(name) {
    if (!name) return "?";
    return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((part)=>part[0].toUpperCase()).join("");
}
}),
"[project]/src/components/ui/popover.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function Popover({ id: idProp, trigger, children, align = "right", className, panelClassName, label }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const id = idProp ?? autoId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const onDown = (event)=>{
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event)=>event.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return ()=>{
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [
        open
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative", className),
        children: [
            trigger({
                open,
                toggle: ()=>setOpen((value)=>!value),
                props: {
                    "aria-expanded": open,
                    "aria-controls": id,
                    "aria-haspopup": "true",
                    "aria-label": label
                }
            }),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: id,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute top-full z-50 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-line bg-surface shadow-xl", align === "right" ? "right-0" : "left-0", panelClassName),
                onClick: (event)=>{
                    if (event.target.closest("a,[data-close]")) setOpen(false);
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/popover.jsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/popover.jsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/actions/admin/data:5ce620 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"002d2150522fbc8f145093f8f71c54ff678fb5f4ca":"logoutAction"},"src/lib/actions/admin/auth.js",""] */ __turbopack_context__.s([
    "logoutAction",
    ()=>logoutAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var logoutAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("002d2150522fbc8f145093f8f71c54ff678fb5f4ca", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "logoutAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYXV0aC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIjtcclxuaW1wb3J0IHsgcmVkaXJlY3QgfSBmcm9tIFwibmV4dC9uYXZpZ2F0aW9uXCI7XHJcbmltcG9ydCB7IGFwaSwgQXBpRXJyb3IgfSBmcm9tIFwiQC9saWIvYXBpXCI7XHJcbmltcG9ydCB7IFNFU1NJT05fQ09PS0lFLCBzZXNzaW9uQ29va2llT3B0aW9ucywgZHJvcEFkbWluUHJvZmlsZSB9IGZyb20gXCJAL2xpYi9hdXRoL3Nlc3Npb25cIjtcclxuXHJcbi8qKiBTYW1lLW9yaWdpbiBwYXRocyBvbmx5LiBPbGQgY29uc29sZSBwYXRocyAoZS5nLiAvb3JkZXJzIGZyb20gL2xvZ2luP25leHQ9KSBhcmUgcmVkaXJlY3RlZCB0byAvYWRtaW4gYnkgbmV4dC5jb25maWcuICovXHJcbmZ1bmN0aW9uIHNhZmVOZXh0KG5leHQpIHtcclxuICByZXR1cm4gdHlwZW9mIG5leHQgPT09IFwic3RyaW5nXCIgJiYgL15cXC8oPyFbL1xcXFxdKS8udGVzdChuZXh0KSAmJiAhL1tcXHJcXG5dLy50ZXN0KG5leHQpICYmIG5leHQgIT09IFwiL2FkbWluL2xvZ2luXCIgPyBuZXh0IDogXCIvYWRtaW4vZGFzaGJvYXJkXCI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTdGFmZiBsb2dpbiBhZ2FpbnN0IFBPU1QgL2FkbWluL2F1dGgvbG9naW4uIFRoZSBiZWFyZXIgdG9rZW4gaXMgc3RvcmVkIGluXHJcbiAqIGFuIGh0dHBPbmx5IGNvb2tpZTsgdGhlIEFQSSBjaGVja3MgdGhlIHNhbWUgcGFzc3dvcmQgYXMgdGhlIFBIUCBhZG1pbi5cclxuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbkFjdGlvbihfcHJldiwgZm9ybURhdGEpIHtcclxuICBjb25zdCBlbWFpbCA9IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJlbWFpbFwiKSB8fCBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICBjb25zdCBwYXNzd29yZCA9IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJwYXNzd29yZFwiKSB8fCBcIlwiKTtcclxuICBjb25zdCBuZXh0ID0gc2FmZU5leHQoZm9ybURhdGEuZ2V0KFwibmV4dFwiKSk7XHJcbiAgaWYgKCFlbWFpbCB8fCAhcGFzc3dvcmQpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJFbnRlciB5b3VyIGVtYWlsIGFuZCBwYXNzd29yZC5cIiB9O1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkoXCJhZG1pbi9hdXRoL2xvZ2luXCIsIHsgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogeyBlbWFpbCwgcGFzc3dvcmQgfSB9KTtcclxuICAgIGNvbnN0IGphciA9IGF3YWl0IGNvb2tpZXMoKTtcclxuICAgIGphci5zZXQoU0VTU0lPTl9DT09LSUUsIGRhdGEudG9rZW4sIHsgLi4uc2Vzc2lvbkNvb2tpZU9wdGlvbnMsIG1heEFnZTogY29va2llTWF4QWdlKGRhdGEuZXhwaXJlc0F0KSB9KTtcclxuICAgIGRyb3BBZG1pblByb2ZpbGUoZGF0YS50b2tlbik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEFwaUVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiQ291bGQgbm90IHJlYWNoIHRoZSBhZG1pbiBBUEkuXCI7XHJcbiAgICByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2UgfTtcclxuICB9XHJcbiAgcmVkaXJlY3QobmV4dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvb2tpZU1heEFnZShleHBpcmVzQXQpIHtcclxuICByZXR1cm4gZXhwaXJlc0F0ID8gTWF0aC5tYXgoNjAsIE1hdGguZmxvb3IoKG5ldyBEYXRlKGV4cGlyZXNBdCkuZ2V0VGltZSgpIC0gRGF0ZS5ub3coKSkgLyAxMDAwKSkgOiBzZXNzaW9uQ29va2llT3B0aW9ucy5tYXhBZ2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQT1NUIC9hZG1pbi9hdXRoL2NoYW5nZS1wYXNzd29yZC4gVGhlIEFQSSBlbmRzIGV2ZXJ5IGxvZ2luIG9mIHRoaXMgYWRtaW5cclxuICogYW5kIHJldHVybnMgYSBuZXcgdG9rZW4gZm9yIHRoaXMgZGV2aWNlLCB3aGljaCByZXBsYWNlcyB0aGUgc2Vzc2lvbiBjb29raWUuXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmRBY3Rpb24oX3ByZXYsIGZvcm1EYXRhKSB7XHJcbiAgY29uc3QgY3VycmVudFBhc3N3b3JkID0gU3RyaW5nKGZvcm1EYXRhLmdldChcImN1cnJlbnRQYXNzd29yZFwiKSB8fCBcIlwiKTtcclxuICBjb25zdCBuZXdQYXNzd29yZCA9IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJuZXdQYXNzd29yZFwiKSB8fCBcIlwiKTtcclxuICBjb25zdCBjb25maXJtUGFzc3dvcmQgPSBTdHJpbmcoZm9ybURhdGEuZ2V0KFwiY29uZmlybVBhc3N3b3JkXCIpIHx8IFwiXCIpO1xyXG4gIGlmICghY3VycmVudFBhc3N3b3JkIHx8ICFuZXdQYXNzd29yZCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIkVudGVyIHlvdXIgY3VycmVudCBhbmQgbmV3IHBhc3N3b3JkLlwiIH07XHJcbiAgaWYgKG5ld1Bhc3N3b3JkICE9PSBjb25maXJtUGFzc3dvcmQpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJUaGUgbmV3IHBhc3N3b3JkcyBkbyBub3QgbWF0Y2guXCIsIGZpZWxkRXJyb3JzOiB7IGNvbmZpcm1QYXNzd29yZDogXCJEb2VzIG5vdCBtYXRjaCB0aGUgbmV3IHBhc3N3b3JkLlwiIH0gfTtcclxuXHJcbiAgY29uc3QgamFyID0gYXdhaXQgY29va2llcygpO1xyXG4gIGNvbnN0IHRva2VuID0gamFyLmdldChTRVNTSU9OX0NPT0tJRSk/LnZhbHVlO1xyXG4gIGlmICghdG9rZW4pIHJlZGlyZWN0KFwiL2FkbWluL2xvZ2luXCIpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGFwaShcImFkbWluL2F1dGgvY2hhbmdlLXBhc3N3b3JkXCIsIHsgbWV0aG9kOiBcIlBPU1RcIiwgdG9rZW4sIGJvZHk6IHsgY3VycmVudFBhc3N3b3JkLCBuZXdQYXNzd29yZCB9IH0pO1xyXG4gICAgamFyLnNldChTRVNTSU9OX0NPT0tJRSwgZGF0YS50b2tlbiwgeyAuLi5zZXNzaW9uQ29va2llT3B0aW9ucywgbWF4QWdlOiBjb29raWVNYXhBZ2UoZGF0YS5leHBpcmVzQXQpIH0pO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYWNjb3VudFwiKTtcclxuICAgIHJldHVybiB7IG9rOiB0cnVlLCBtZXNzYWdlOiBcIlBhc3N3b3JkIHVwZGF0ZWQuIFlvdXIgb3RoZXIgc2Vzc2lvbnMgd2VyZSBzaWduZWQgb3V0LlwiIH07XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEFwaUVycm9yICYmIGVycm9yLnN0YXR1cyA9PT0gNDAxKSByZWRpcmVjdChcIi9hZG1pbi9sb2dpblwiKTtcclxuICAgIGNvbnN0IGZpZWxkID0gZXJyb3IgaW5zdGFuY2VvZiBBcGlFcnJvciA/IGVycm9yLmRldGFpbHM/LmZpZWxkIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEFwaUVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiQ291bGQgbm90IHJlYWNoIHRoZSBhZG1pbiBBUEkuXCIsIGZpZWxkRXJyb3JzOiBmaWVsZCA/IHsgW2ZpZWxkXTogZXJyb3IubWVzc2FnZSB9IDogdW5kZWZpbmVkIH07XHJcbiAgfVxyXG59XHJcblxyXG4vKiogUE9TVCAvYWRtaW4vYXV0aC9sb2dvdXQtYWxsIHsga2VlcEN1cnJlbnQ6IHRydWUgfSAtIHNpZ25zIG91dCBldmVyeSBvdGhlciBkZXZpY2UuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXRPdGhlclNlc3Npb25zQWN0aW9uKCkge1xyXG4gIGNvbnN0IGphciA9IGF3YWl0IGNvb2tpZXMoKTtcclxuICBjb25zdCB0b2tlbiA9IGphci5nZXQoU0VTU0lPTl9DT09LSUUpPy52YWx1ZTtcclxuICBpZiAoIXRva2VuKSByZWRpcmVjdChcIi9hZG1pbi9sb2dpblwiKTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBhcGkoXCJhZG1pbi9hdXRoL2xvZ291dC1hbGxcIiwgeyBtZXRob2Q6IFwiUE9TVFwiLCB0b2tlbiwgYm9keTogeyBrZWVwQ3VycmVudDogdHJ1ZSB9IH0pO1xyXG4gICAgY29uc3QgZW5kZWQgPSBkYXRhPy5zZXNzaW9uc0VuZGVkID8/IDA7XHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9hY2NvdW50XCIpO1xyXG4gICAgcmV0dXJuIHsgb2s6IHRydWUsIG1lc3NhZ2U6IGBFbmRlZCAke2VuZGVkfSBvdGhlciBzZXNzaW9uJHtlbmRlZCA9PT0gMSA/IFwiXCIgOiBcInNcIn0uYCB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBBcGlFcnJvciAmJiBlcnJvci5zdGF0dXMgPT09IDQwMSkgcmVkaXJlY3QoXCIvYWRtaW4vbG9naW5cIik7XHJcbiAgICByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgQXBpRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJDb3VsZCBub3QgcmVhY2ggdGhlIGFkbWluIEFQSS5cIiB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ291dEFjdGlvbigpIHtcclxuICBjb25zdCBqYXIgPSBhd2FpdCBjb29raWVzKCk7XHJcbiAgY29uc3QgdG9rZW4gPSBqYXIuZ2V0KFNFU1NJT05fQ09PS0lFKT8udmFsdWU7XHJcbiAgaWYgKHRva2VuKSB7XHJcbiAgICBkcm9wQWRtaW5Qcm9maWxlKHRva2VuKTtcclxuICAgIGF3YWl0IGFwaShcImFkbWluL2F1dGgvbG9nb3V0XCIsIHsgbWV0aG9kOiBcIlBPU1RcIiwgdG9rZW4gfSkuY2F0Y2goKCkgPT4ge30pO1xyXG4gIH1cclxuICBqYXIuZGVsZXRlKFNFU1NJT05fQ09PS0lFKTtcclxuICByZWRpcmVjdChcIi9hZG1pbi9sb2dpblwiKTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Im1TQWlGc0IifQ==
}),
"[project]/src/components/admin/shell/route-progress.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RouteProgress",
    ()=>RouteProgress,
    "startRouteProgress",
    ()=>startRouteProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const START_EVENT = "ba-admin-nav-start";
function startRouteProgress() {
    window.dispatchEvent(new Event(START_EVENT));
}
function isInternalNavigation(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || anchor.target && anchor.target !== "_self" || anchor.hasAttribute("download")) return false;
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname !== window.location.pathname || url.search !== window.location.search;
}
function Bar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])().toString();
    const routeKey = `${pathname}?${search}`;
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [lastKey, setLastKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(routeKey);
    if (lastKey !== routeKey) {
        setLastKey(routeKey);
        if (phase === "loading") setPhase("done");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const start = ()=>setPhase("loading");
        const onClick = (event)=>{
            if (isInternalNavigation(event)) start();
        };
        document.addEventListener("click", onClick, true);
        window.addEventListener(START_EVENT, start);
        return ()=>{
            document.removeEventListener("click", onClick, true);
            window.removeEventListener(START_EVENT, start);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (phase === "idle") return;
        const timer = setTimeout(()=>setPhase(phase === "done" ? "idle" : "done"), phase === "done" ? 350 : 12000);
        return ()=>clearTimeout(timer);
    }, [
        phase
    ]);
    if (phase === "idle") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden",
        role: "progressbar",
        "aria-label": "Loading page",
        "aria-busy": phase === "loading",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-full origin-left bg-brand-600 shadow-[0_0_8px_var(--color-brand-500)]", phase === "loading" ? "route-progress-run" : "route-progress-done")
        }, void 0, false, {
            fileName: "[project]/src/components/admin/shell/route-progress.jsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/route-progress.jsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
function RouteProgress() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: null,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Bar, {}, void 0, false, {
            fileName: "[project]/src/components/admin/shell/route-progress.jsx",
            lineNumber: 69,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/route-progress.jsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/shell/header.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-ssr] (ecmascript) <export default as CircleHelp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/corner-down-left.js [app-ssr] (ecmascript) <export default as CornerDownLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/keyboard.js [app-ssr] (ecmascript) <export default as Keyboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-ssr] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.js [app-ssr] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-ssr] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/site.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/popover.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$5ce620__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:5ce620 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/icons.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
function Breadcrumbs({ wide = false }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const crumbs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBreadcrumbs"])(pathname);
    const isAncestor = (i)=>i < crumbs.length - 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Breadcrumb",
        className: "min-w-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "flex min-w-0 items-center gap-1 text-[13px] text-ink-muted",
            children: crumbs.map((crumb, i)=>{
                const last = i === crumbs.length - 1;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-w-0 items-center gap-1", isAncestor(i) && (wide ? "hidden 2xl:flex" : "hidden sm:flex"), last ? "font-medium text-ink" : "shrink-0"),
                    children: [
                        i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-3.5 shrink-0 text-ink-muted/60", isAncestor(i - 1) && (wide ? "hidden 2xl:block" : "hidden sm:block")),
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 27,
                            columnNumber: 25
                        }, this),
                        crumb.href && !last ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: crumb.href,
                            className: "hover:text-ink hover:underline",
                            children: crumb.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 29,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 truncate",
                            "aria-current": last ? "page" : undefined,
                            title: last ? crumb.label : undefined,
                            children: crumb.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 33,
                            columnNumber: 17
                        }, this)
                    ]
                }, `${crumb.label}-${i}`, true, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 26,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/admin/shell/header.jsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
function flattenRoutes(navigation) {
    const routes = [];
    for (const section of navigation){
        for (const item of section.items){
            if (item.href) routes.push({
                key: item.key,
                label: item.label,
                href: item.href,
                trail: section.section || "",
                icon: item.icon
            });
            for (const child of item.children || [])routes.push({
                key: child.key,
                label: child.label,
                href: child.href,
                trail: item.label || "",
                icon: item.icon
            });
        }
    }
    return routes;
}
function matchRoutes(routes, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return routes.map((route)=>{
        const label = route.label.toLowerCase();
        const haystack = `${label} ${route.trail.toLowerCase()}`;
        if (!terms.every((t)=>haystack.includes(t))) return null;
        return {
            route,
            score: label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2
        };
    }).filter(Boolean).sort((a, b)=>a.score - b.score || a.route.label.localeCompare(b.route.label)).slice(0, 8).map((m)=>m.route);
}
function GlobalSearch({ navigation }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const routes = flattenRoutes(navigation);
    const pages = matchRoutes(routes, query);
    const q = query.trim();
    const options = [
        ...pages.map((page)=>({
                type: "page",
                ...page
            })),
        ...q.length >= 2 ? [
            {
                type: "search",
                key: "__search",
                label: q
            }
        ] : []
    ];
    const showList = open && options.length > 0;
    const current = Math.min(activeIndex, options.length - 1);
    const choose = (option)=>{
        if (!option) return;
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRouteProgress"])();
        router.push(option.type === "page" ? option.href : `/admin/search?q=${encodeURIComponent(option.label)}`);
    };
    const onKeyDown = (event)=>{
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (!options.length) return;
            event.preventDefault();
            setOpen(true);
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActiveIndex((current + step + options.length) % options.length);
        } else if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            if (showList) choose(options[current]);
            else if (q.length >= 2) choose({
                type: "search",
                label: q
            });
        } else if (event.key === "Escape") {
            if (showList) {
                event.preventDefault();
                setOpen(false);
            } else {
                inputRef.current?.blur();
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKey = (event)=>{
            const typing = [
                "INPUT",
                "TEXTAREA",
                "SELECT"
            ].includes(document.activeElement?.tagName);
            if (event.key === "k" && (event.metaKey || event.ctrlKey) || event.key === "/" && !typing) {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return ()=>document.removeEventListener("keydown", onKey);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        role: "search",
        className: "relative w-full max-w-xl",
        onSubmit: (event)=>{
            event.preventDefault();
            if (showList) choose(options[current]);
            else if (q.length >= 2) choose({
                type: "search",
                label: q
            });
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "admin-global-search",
                className: "sr-only",
                children: "Search pages, orders, products, vendors, customers, leads and tickets"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                id: "admin-global-search",
                role: "combobox",
                "aria-expanded": showList,
                "aria-controls": "admin-global-search-list",
                "aria-autocomplete": "list",
                "aria-activedescendant": showList ? `gs-opt-${options[current].key}` : undefined,
                value: query,
                onChange: (e)=>{
                    setQuery(e.target.value);
                    setActiveIndex(0);
                    setOpen(true);
                },
                onFocus: ()=>setOpen(true),
                onBlur: ()=>setOpen(false),
                onKeyDown: onKeyDown,
                placeholder: "Search pages, order ID, AWB, product, vendor…",
                className: "h-9 w-full rounded-lg border border-line bg-surface-muted pr-12 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:bg-surface focus:ring-2 focus:ring-brand-600/20 focus:outline-none",
                autoComplete: "off"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                className: "pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line bg-surface px-1.5 text-[10px] text-ink-muted lg:block",
                children: "Ctrl K"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            showList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: "admin-global-search-list",
                role: "listbox",
                "aria-label": "Search suggestions",
                className: "absolute inset-x-0 top-full z-50 mt-1.5 max-h-[min(70vh,26rem)] overflow-y-auto rounded-xl border border-line bg-surface py-1.5 shadow-lg",
                onMouseDown: (e)=>e.preventDefault(),
                children: [
                    pages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "presentation",
                        className: "px-3 pt-1 pb-1.5 text-[10.5px] font-semibold tracking-wide text-ink-muted uppercase",
                        children: "Pages"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 173,
                        columnNumber: 32
                    }, this),
                    options.map((option, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            id: `gs-opt-${option.key}`,
                            role: "option",
                            "aria-selected": i === current,
                            onMouseEnter: ()=>setActiveIndex(i),
                            onClick: ()=>choose(option),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mx-1.5 flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm", i === current ? "bg-brand-50 text-ink" : "text-ink-soft", option.type === "search" && pages.length > 0 && "mt-1"),
                            children: option.type === "page" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NavIcon"], {
                                            name: option.icon,
                                            className: "size-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/header.jsx",
                                            lineNumber: 191,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 190,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate font-medium text-ink",
                                                children: option.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                                lineNumber: 194,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-xs text-ink-muted",
                                                children: option.trail
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                                lineNumber: 195,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 193,
                                        columnNumber: 19
                                    }, this),
                                    i === current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__["CornerDownLeft"], {
                                        className: "size-3.5 shrink-0 text-ink-muted",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 197,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink-muted",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "size-4",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/header.jsx",
                                            lineNumber: 202,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 201,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1 truncate",
                                        children: [
                                            "Search records for ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-ink",
                                                children: [
                                                    "“",
                                                    option.label,
                                                    "”"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                                lineNumber: 205,
                                                columnNumber: 40
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 204,
                                        columnNumber: 19
                                    }, this),
                                    i === current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$corner$2d$down$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CornerDownLeft$3e$__["CornerDownLeft"], {
                                        className: "size-3.5 shrink-0 text-ink-muted",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/shell/header.jsx",
                                        lineNumber: 207,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true)
                        }, option.key, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 175,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 166,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function ThemeToggle({ className }) {
    const toggle = ()=>{
        const dark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", dark);
        try {
            localStorage.setItem("ba-admin-theme", dark ? "dark" : "light");
        } catch  {}
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: toggle,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink", className),
        "aria-label": "Switch light or dark mode",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                className: "hidden size-[18px] dark:block",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 228,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                className: "size-[18px] dark:hidden",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 229,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
function Notifications({ items }) {
    const count = items.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
        id: "admin-notifications-panel",
        label: `Notifications${count ? `, ${count} need attention` : ""}`,
        panelClassName: "w-80",
        trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: toggle,
                ...props,
                className: "relative flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        className: "size-[18px]",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 243,
                        columnNumber: 11
                    }, void 0),
                    count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9.5px] font-bold text-accent-fg ring-2 ring-surface",
                        children: count > 9 ? "9+" : count
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 244,
                        columnNumber: 25
                    }, void 0)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 242,
                columnNumber: 9
            }, void 0),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-line px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-ink",
                        children: "Needs attention"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-ink-muted",
                        children: "Queues filtered to what your role can access."
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            count === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-4 py-6 text-center text-sm text-ink-muted",
                children: "You're all caught up."
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 253,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "max-h-80 overflow-y-auto py-1",
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: "flex gap-3 px-4 py-2.5 hover:bg-surface-muted",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-1.5 size-2 shrink-0 rounded-full", item.tone === "danger" ? "bg-danger" : "bg-warning-ink"),
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 259,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-sm text-ink",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/header.jsx",
                                            lineNumber: 261,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-xs text-ink-muted",
                                            children: item.meta
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/shell/header.jsx",
                                            lineNumber: 262,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 260,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 258,
                            columnNumber: 15
                        }, this)
                    }, item.id, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 257,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 255,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 237,
        columnNumber: 5
    }, this);
}
function Help() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
        id: "admin-help-panel",
        label: "Help",
        trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: toggle,
                ...props,
                className: "hidden size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink sm:flex",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"], {
                    className: "size-[18px]",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 280,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 279,
                columnNumber: 9
            }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-4 pt-1.5 pb-2 text-xs font-semibold tracking-wide text-ink-muted uppercase",
                    children: "Help"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 285,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/admin/help",
                    className: "flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                            className: "size-4 text-ink-muted",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 287,
                            columnNumber: 11
                        }, this),
                        " Admin guide & module map"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 286,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: `mailto:${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["site"].supportEmail}`,
                    className: "flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                            className: "size-4 text-ink-muted",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 290,
                            columnNumber: 11
                        }, this),
                        " Contact tech support"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 289,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-1 border-t border-line px-4 pt-2.5 pb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1.5 flex items-center gap-2 text-xs font-medium text-ink-soft",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$keyboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Keyboard$3e$__["Keyboard"], {
                                    className: "size-3.5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this),
                                " Shortcuts"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 293,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "flex justify-between text-xs text-ink-muted",
                            children: [
                                "Focus search ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "rounded border border-line px-1",
                                    children: "/"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 297,
                                    columnNumber: 26
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 296,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 292,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/shell/header.jsx",
            lineNumber: 284,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 275,
        columnNumber: 5
    }, this);
}
function AccountMenu({ user }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
        id: "admin-account-panel",
        label: "Account menu",
        panelClassName: "w-64",
        trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: toggle,
                ...props,
                className: "flex items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 hover:bg-neutral-bg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex size-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-brand-fg",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initials"])(user.name)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, void 0),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden min-w-0 text-left leading-tight xl:block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block max-w-36 truncate text-[13px] font-medium text-ink",
                                children: user.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, void 0),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block max-w-36 truncate text-[11px] text-ink-muted",
                                children: user.role.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 316,
                                columnNumber: 13
                            }, void 0)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, void 0)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 312,
                columnNumber: 9
            }, void 0),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-line px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate text-sm font-semibold text-ink",
                        children: user.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "truncate text-xs text-ink-muted",
                        children: user.email
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700",
                        children: user.role.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin/account",
                        className: "flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-surface-muted",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                                className: "size-4 text-ink-muted",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 328,
                                columnNumber: 11
                            }, this),
                            " My account"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        action: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$5ce620__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["logoutAction"],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-danger-ink hover:bg-danger-bg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    className: "size-4",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this),
                                " Log out"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 331,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 326,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 307,
        columnNumber: 5
    }, this);
}
function Header({ user, navigation = [], notifications, rail, onToggleRail, onOpenMobile }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center lg:min-w-0 lg:flex-1 lg:basis-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onOpenMobile,
                                className: "flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg md:hidden",
                                "aria-label": "Open menu",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "size-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onToggleRail,
                                className: "mr-1 hidden size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-neutral-bg hover:text-ink md:flex",
                                "aria-label": rail ? "Expand sidebar" : "Collapse sidebar",
                                title: rail ? "Expand sidebar" : "Collapse sidebar",
                                children: rail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                                    className: "size-[18px]",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 355,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                    className: "size-[18px]",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 355,
                                    columnNumber: 77
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden min-w-0 lg:block",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Breadcrumbs, {
                                    wide: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/header.jsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 flex-1 justify-center lg:w-[min(36rem,32vw)] lg:flex-none",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobalSearch, {
                            navigation: navigation
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/shell/header.jsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center justify-end gap-0.5 lg:flex-1 lg:basis-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Notifications, {
                                items: notifications
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Help, {}, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeToggle, {
                                className: "hidden sm:flex"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AccountMenu, {
                                user: user
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/shell/header.jsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/shell/header.jsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 343,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 border-t border-line px-3 py-2 sm:px-5 lg:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Breadcrumbs, {}, void 0, false, {
                    fileName: "[project]/src/components/admin/shell/header.jsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RouteProgress"], {}, void 0, false, {
                fileName: "[project]/src/components/admin/shell/header.jsx",
                lineNumber: 374,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/header.jsx",
        lineNumber: 342,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/shell/admin-shell.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminShell",
    ()=>AdminShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/live-catalog.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$sidebar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/sidebar.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$header$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/header.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const TABLET_QUERY = "(max-width: 1023px)";
const RAIL_KEY = "ba-admin-rail";
const RAIL_EVENT = "ba-admin-rail-change";
function subscribe(callback) {
    const mq = window.matchMedia(TABLET_QUERY);
    mq.addEventListener("change", callback);
    return ()=>mq.removeEventListener("change", callback);
}
function subscribeRail(callback) {
    window.addEventListener(RAIL_EVENT, callback);
    window.addEventListener("storage", callback);
    return ()=>{
        window.removeEventListener(RAIL_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}
function readRail() {
    try {
        return localStorage.getItem(RAIL_KEY) === "1";
    } catch  {
        return false;
    }
}
function saveRail(value) {
    try {
        localStorage.setItem(RAIL_KEY, value ? "1" : "0");
    } catch  {}
    window.dispatchEvent(new Event(RAIL_EVENT));
}
function AdminShell({ user, navigation, badges, notifications, children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const showGap = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLiveAdminPath"])(pathname) && pathname !== "/admin/not-ported";
    const isTablet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, ()=>window.matchMedia(TABLET_QUERY).matches, ()=>false);
    const desktopRail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeRail, readRail, ()=>false);
    const [tabletRail, setTabletRail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const closeMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setMobileOpen(false), []);
    const [lastPath, setLastPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setMobileOpen(false);
        if (isTablet) setTabletRail(true);
    }
    const rail = isTablet ? tabletRail : desktopRail;
    const toggleRail = ()=>isTablet ? setTabletRail(!rail) : saveRail(!rail);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-dvh",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "#admin-main",
                className: "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm",
                children: "Skip to content"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$sidebar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
                navigation: navigation,
                badges: badges,
                rail: rail,
                onToggleRail: toggleRail,
                mobileOpen: mobileOpen,
                onCloseMobile: closeMobile
            }, void 0, false, {
                fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-h-dvh min-w-0 flex-col transition-[padding] duration-200", rail ? "md:pl-16" : "md:pl-[264px]"),
                inert: mobileOpen || undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$header$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Header"], {
                        user: user,
                        navigation: navigation,
                        notifications: notifications,
                        rail: rail,
                        onToggleRail: toggleRail,
                        onOpenMobile: ()=>setMobileOpen(true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    showGap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-warning-ink/15 bg-warning-bg px-3 py-1.5 text-[12.5px] text-warning-ink sm:px-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mx-auto flex max-w-[1600px] items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                    className: "size-3.5 shrink-0",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                                    lineNumber: 74,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "This page is not connected to the admin API yet."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        id: "admin-main",
                        className: "mx-auto w-full max-w-[1600px] min-w-0 flex-1 px-3 py-5 sm:px-5 lg:px-6",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/shell/admin-shell.jsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__540d61e4._.js.map