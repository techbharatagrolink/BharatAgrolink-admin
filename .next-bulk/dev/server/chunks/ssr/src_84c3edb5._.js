module.exports = [
"[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RBAC helpers shared by server and client.
 *
 * Mirrors the legacy model: `user_roles.permissions_json` =
 * { "<menu permission key>": ["view", "add", "edit", "delete"] } and
 * role_id 0 = super admin. Client checks only hide UI; every server action
 * re-checks with `assertPermission` and the real backend stays authoritative.
 */ __turbopack_context__.s([
    "ACTIONS",
    ()=>ACTIONS,
    "can",
    ()=>can,
    "canPage",
    ()=>canPage,
    "columnVisible",
    ()=>columnVisible,
    "filterNavigation",
    ()=>filterNavigation,
    "pageKey",
    ()=>pageKey,
    "toClientUser",
    ()=>toClientUser
]);
const ACTIONS = [
    "view",
    "add",
    "edit",
    "delete"
];
function can(user, permission, action = "view") {
    if (!user || !user.role) return false;
    if (user.role.superAdmin) return true;
    if (!permission) return true;
    const granted = user.role.permissions?.[permission];
    return Array.isArray(granted) && granted.includes(action);
}
function pageKey(link) {
    const value = String(link ?? "").trim();
    if (value.startsWith("#dashboard_")) return "dashboard.php";
    return value.split("/").pop();
}
function canPage(user, page, action = "view") {
    if (!user || !user.role) return false;
    if (user.role.superAdmin) return true;
    const granted = user.role.pages?.[pageKey(page)];
    return Array.isArray(granted) && granted.includes(action);
}
function showLeaf(user, leaf) {
    if (leaf.page) return canPage(user, leaf.page, "view") && (!leaf.action || canPage(user, leaf.page, leaf.action));
    return can(user, leaf.permission, "view") && (!leaf.action || can(user, leaf.permission, leaf.action));
}
function filterNavigation(tree, user) {
    return tree.map((section)=>({
            ...section,
            items: section.items.map((item)=>{
                if (!item.children) return showLeaf(user, item) ? item : null;
                const children = item.children.filter((child)=>showLeaf(user, child));
                return children.length ? {
                    ...item,
                    children
                } : null;
            }).filter(Boolean)
        })).filter((section)=>section.items.length > 0);
}
function columnVisible(user, column) {
    if (!column.requires) return true;
    if (user?.role?.superAdmin) return true;
    if (column.requires === "b2b.margin") return Boolean(user?.b2b?.canViewMargin);
    if (column.requires === "b2b.cost") return Boolean(user?.b2b?.canViewCost);
    return can(user, column.requires, "view");
}
function toClientUser(user) {
    if (!user) return null;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        designation: user.designation,
        b2b: user.b2b ? {
            canViewMargin: Boolean(user.b2b.canViewMargin),
            canViewCost: Boolean(user.b2b.canViewCost),
            maxDiscountPct: Number(user.b2b.maxDiscountPct) || 0
        } : null,
        role: {
            id: user.role.id,
            name: user.role.name,
            superAdmin: Boolean(user.role.superAdmin),
            permissions: user.role.permissions || {},
            pages: user.role.pages || {}
        }
    };
}
}),
"[project]/src/lib/api.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "api",
    ()=>api,
    "apiBase",
    ()=>apiBase,
    "apiDownload",
    ()=>apiDownload,
    "apiForm",
    ()=>apiForm
]);
const DEFAULT_API_URL = "http://localhost:5000/api/v1";
function apiBase() {
    const configured = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, "");
    if ("TURBOPACK compile-time truthy", 1) {
        // Computed keys so the runtime value is used, not one inlined at build time.
        const env = (name)=>process.env[name];
        return (env("API_URL") || env("NEXT_PUBLIC_API_URL") || DEFAULT_API_URL).replace(/\/$/, "");
    }
    //TURBOPACK unreachable
    ;
}
class ApiError extends Error {
    constructor(message, { code, status, details } = {}){
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
function resolveUrl(path, query) {
    const base = apiBase();
    const origin = ("TURBOPACK compile-time truthy", 1) ? "http://127.0.0.1" : "TURBOPACK unreachable";
    const absolute = /^https?:\/\//i.test(base) ? base : new URL(base, origin).href;
    const url = new URL(path.replace(/^\//, ""), absolute.endsWith("/") ? absolute : `${absolute}/`);
    if (query) {
        for (const [key, value] of Object.entries(query)){
            if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
        }
    }
    return url;
}
async function api(path, { token, method = "GET", body, query, signal } = {}) {
    const response = await fetch(resolveUrl(path, query), {
        method,
        signal,
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            ...body !== undefined ? {
                "Content-Type": "application/json"
            } : {},
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {}
        },
        body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    let payload = null;
    try {
        payload = text ? JSON.parse(text) : null;
    } catch  {
        payload = null;
    }
    if (!response.ok || payload?.success === false) {
        throw new ApiError(payload?.message || `Request failed (${response.status})`, {
            code: payload?.code,
            status: response.status,
            details: payload?.details
        });
    }
    return {
        data: payload?.data,
        meta: payload?.meta ?? null
    };
}
async function apiForm(path, { token, method = "POST", formData }) {
    const response = await fetch(resolveUrl(path), {
        method,
        cache: "no-store",
        headers: {
            Accept: "application/json",
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {}
        },
        body: formData
    });
    const text = await response.text();
    let payload = null;
    try {
        payload = text ? JSON.parse(text) : null;
    } catch  {
        payload = null;
    }
    if (!response.ok || payload?.success === false) {
        throw new ApiError(payload?.message || `Request failed (${response.status})`, {
            code: payload?.code,
            status: response.status,
            details: payload?.details
        });
    }
    return {
        data: payload?.data,
        meta: payload?.meta ?? null
    };
}
async function apiDownload(path, { token, query } = {}) {
    const response = await fetch(resolveUrl(path, query), {
        cache: "no-store",
        headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {}
        }
    });
    if (!response.ok) {
        const text = await response.text();
        let payload = null;
        try {
            payload = text ? JSON.parse(text) : null;
        } catch  {
            payload = null;
        }
        throw new ApiError(payload?.message || `Download failed (${response.status})`, {
            code: payload?.code,
            status: response.status,
            details: payload?.details
        });
    }
    return response.blob();
}
}),
"[project]/src/lib/content/admin/resources/parity/seller.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/marketing.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/crm.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/ops.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/support-admin.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/bulk.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/parity/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$seller$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/seller.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$marketing$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/marketing.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$crm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/crm.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$ops$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/ops.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$support$2d$admin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/support-admin.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/bulk.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
const groups = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$seller$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$marketing$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$crm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$ops$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$support$2d$admin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
];
const parityResources = Object.assign({}, ...groups.map((g)=>g.resources));
const parityRoutes = Object.assign({}, ...groups.map((g)=>g.routes));
const parityLive = Object.assign({}, ...groups.map((g)=>g.live));
const parityPages = Object.assign({}, ...groups.map((g)=>g.pages));
const parityLivePaths = groups.flatMap((g)=>g.livePaths);
}),
"[project]/src/lib/content/admin/resources/port/catalog.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/resources/port/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/port/catalog.js [app-rsc] (ecmascript)");
;
/**
 * Screens ported from the PHP admin after the parity pass (docs/php-port).
 * Each group exports resources, routes (admin path -> resource key), live
 * (resource key -> { path, page, permission }), pages (permission -> PHP pages
 * for custom screens) and livePaths, like the parity groups.
 */ const groups = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
];
const portResources = Object.assign({}, ...groups.map((g)=>g.resources));
const portRoutes = Object.assign({}, ...groups.map((g)=>g.routes));
const portLive = Object.assign({}, ...groups.map((g)=>g.live));
const portPages = Object.assign({}, ...groups.map((g)=>g.pages));
const portLivePaths = groups.flatMap((g)=>g.livePaths);
}),
"[project]/src/lib/services/admin/live-catalog.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/port/index.js [app-rsc] (ecmascript)");
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
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parityLive"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["portLive"]
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
    for (const [permission, pages] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parityPages"]))for (const page of pages)add(permission, page);
    for (const [permission, pages] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["portPages"]))for (const page of pages)add(permission, page);
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
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parityLivePaths"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["portLivePaths"]
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
"[project]/src/lib/auth/session.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SESSION_COOKIE",
    ()=>SESSION_COOKIE,
    "assertPermission",
    ()=>assertPermission,
    "checkPermission",
    ()=>checkPermission,
    "dropAdminProfile",
    ()=>dropAdminProfile,
    "getCurrentAdmin",
    ()=>getCurrentAdmin,
    "requireAdmin",
    ()=>requireAdmin,
    "sessionCookieOptions",
    ()=>sessionCookieOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/live-catalog.js [app-rsc] (ecmascript)");
;
;
;
;
;
const SESSION_COOKIE = "ba_admin_session";
const TOKEN_RE = /^[a-f0-9]{24}:[a-f0-9]{64}$/;
const sessionCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: ("TURBOPACK compile-time value", "development") === "production",
    path: "/",
    maxAge: 12 * 3600
};
function permissionsFrom(pages, superAdmin) {
    if (superAdmin) return {};
    const granted = pages || {};
    const permissions = {};
    for (const [permission, phpPages] of Object.entries((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["permissionPages"])())){
        const actions = new Set();
        for (const page of phpPages)for (const action of granted[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pageKey"])(page)] || [])actions.add(action);
        if (actions.size) permissions[permission] = [
            ...actions
        ];
    }
    return permissions;
}
function toUser(data, token) {
    return {
        id: data.admin.id,
        name: data.admin.name,
        email: data.admin.email,
        designation: data.role?.title || data.admin.company || "",
        token,
        // B2B cost / margin / discount visibility from the staff role (no separate B2B roles).
        b2b: data.b2b ?? {
            canViewMargin: Boolean(data.superAdmin),
            canViewCost: Boolean(data.superAdmin),
            maxDiscountPct: data.superAdmin ? 100 : 0,
            capabilities: []
        },
        role: {
            id: data.role?.id ?? data.admin.roleId,
            name: data.superAdmin ? "Super Admin" : data.role?.title || "Staff",
            superAdmin: Boolean(data.superAdmin),
            permissions: permissionsFrom(data.pages, data.superAdmin),
            pages: data.superAdmin ? {} : data.pages || {}
        }
    };
}
async function profileFor(token) {
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/me", {
        token
    });
    return toUser(data, token);
}
function dropAdminProfile() {}
async function getCurrentAdmin() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token || !TOKEN_RE.test(token)) return null;
    try {
        return await profileFor(token);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] && (error.status === 401 || error.status === 403)) return null;
        throw error;
    }
}
async function requireAdmin() {
    const user = await getCurrentAdmin();
    if (!user) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
    return user;
}
async function checkPermission(permission, action = "view") {
    const user = await requireAdmin();
    return {
        user,
        allowed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, permission, action)
    };
}
async function assertPermission(permission, action) {
    const user = await getCurrentAdmin();
    if (!user) return {
        ok: false,
        user: null,
        message: "Your session has expired. Please log in again."
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, permission, action)) return {
        ok: false,
        user,
        message: "You do not have permission to perform this action."
    };
    return {
        ok: true,
        user
    };
}
}),
"[project]/src/lib/services/admin/shell.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNavBadges",
    ()=>getNavBadges,
    "getNotifications",
    ()=>getNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
;
;
;
async function total(user, path, query) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, query.permission)) return 0;
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin${path}`, {
            token: user.token,
            query: {
                page: 1,
                pageSize: 10,
                ...query.params || {}
            }
        });
        return Number(data?.total ?? 0);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"]) return 0;
        return 0;
    }
}
async function getNavBadges(user) {
    const [pendingProducts, pendingShipments, pendingReturns, pendingVendors, openTickets, outOfStock] = await Promise.all([
        total(user, "/products/pending", {
            permission: "products.approval"
        }),
        total(user, "/shipments", {
            permission: "shipping",
            params: {
                status: "Ready to Ship"
            }
        }),
        total(user, "/returns", {
            permission: "returns",
            params: {
                status: "Pending"
            }
        }),
        total(user, "/vendors/verification", {
            permission: "vendors.verification",
            params: {
                status: "Pending"
            }
        }),
        total(user, "/support/tickets", {
            permission: "support",
            params: {
                status: "Open"
            }
        }),
        total(user, "/inventory", {
            permission: "products",
            params: {
                stockStatus: "Out of Stock"
            }
        })
    ]);
    const badges = {
        pendingProducts,
        pendingShipments,
        pendingReturns,
        pendingVendors,
        dueFollowUps: 0,
        openRfqs: 0,
        openEscalations: 0,
        openTickets,
        outOfStock
    };
    return badges;
}
async function getNotifications(user) {
    const badges = await getNavBadges(user);
    const items = [];
    if (badges.pendingProducts) items.push({
        id: "pp",
        title: `${badges.pendingProducts} products waiting for approval`,
        meta: "Catalog · Pending Products",
        href: "/admin/products/pending",
        tone: "warning"
    });
    if (badges.pendingReturns) items.push({
        id: "ret",
        title: `${badges.pendingReturns} return requests need a decision`,
        meta: "Returns & RTO",
        href: "/admin/returns?status=Pending",
        tone: "warning"
    });
    if (badges.openTickets) items.push({
        id: "tk",
        title: `${badges.openTickets} open support tickets`,
        meta: "Support",
        href: "/admin/support?status=Open",
        tone: "warning"
    });
    if (badges.outOfStock) items.push({
        id: "ls",
        title: `${badges.outOfStock} products are out of stock`,
        meta: "Catalog · Inventory",
        href: "/admin/inventory?stockStatus=Out+of+Stock",
        tone: "warning"
    });
    if (badges.pendingVendors) items.push({
        id: "vn",
        title: `${badges.pendingVendors} sellers waiting for approval`,
        meta: "Vendors",
        href: "/admin/vendors/verification?status=Pending",
        tone: "warning"
    });
    return items;
}
}),
"[project]/src/lib/content/admin/navigation.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/sidebar.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSidebar",
    ()=>buildSidebar,
    "notPortedHref",
    ()=>notPortedHref
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/navigation.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
;
;
/**
 * Builds the sidebar from the role's admin_menus tree (GET /admin/auth/menu),
 * the way header.php renderMenu() does, in the shape the Sidebar component
 * takes: sections (top-level menus) -> items (groups or links) -> children.
 *
 * navigation.js is the route map: a menu row's `menu_link` finds the Next
 * route of the leaf whose `page` is that link. Group icons come from the
 * navigation group with the same key as the row's "#hash" link. Next-only
 * screens (leaves without `page`) are added to the group they sit in there,
 * when the role has their permission.
 *
 * A menu link with no Next route yet opens /admin/not-ported, so nothing the
 * PHP sidebar shows goes missing.
 */ const norm = (link)=>String(link ?? "").trim().replace(/^\/+/, "");
const pathOf = (href)=>String(href ?? "").split(/[?#]/)[0];
/** Sidebar routes whose screen is not built yet (bulk orders, plan phase 10). Remove a route when its page lands. */ const PENDING_ROUTES = new Set([
    "/admin/bulk-orders/new"
]);
const leafByLink = new Map();
const groups = new Map();
const topLevelExtras = [];
for (const section of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["navigation"]){
    for (const item of section.items){
        if (item.children) {
            const extras = [];
            for (const child of item.children){
                if (child.page) leafByLink.set(norm(child.page), child);
                else extras.push(child);
            }
            groups.set(`#${item.key}`, {
                key: item.key,
                label: item.label,
                section: section.section,
                icon: item.icon,
                sensitive: Boolean(item.sensitive),
                extras
            });
        } else if (item.page) {
            leafByLink.set(norm(item.page), item);
        } else {
            topLevelExtras.push({
                section: section.section,
                item
            });
        }
    }
}
/** Font Awesome classes used in admin_menus -> lucide icon names (NavIcon). */ const FA_ICONS = [
    [
        /tachometer|chart-pie|dashboard/,
        "LayoutDashboard"
    ],
    [
        /chart-line|line-chart/,
        "TrendingUp"
    ],
    [
        /balance-scale|gavel/,
        "Gauge"
    ],
    [
        /store|user-tie/,
        "Store"
    ],
    [
        /users-cog|user-friends|users/,
        "Users"
    ],
    [
        /box|cubes|dolly|truck-loading/,
        "Boxes"
    ],
    [
        /sitemap|list/,
        "FolderTree"
    ],
    [
        /check-double|check-circle/,
        "BadgeCheck"
    ],
    [
        /percent|rupee|money|coins/,
        "IndianRupee"
    ],
    [
        /bullhorn/,
        "Megaphone"
    ],
    [
        /wallet|credit-card/,
        "Wallet"
    ],
    [
        /comments|comment/,
        "MessagesSquare"
    ],
    [
        /gift|tag/,
        "Tags"
    ],
    [
        /globe|window|image/,
        "LayoutTemplate"
    ],
    [
        /shopping-cart|cart/,
        "ShoppingCart"
    ],
    [
        /handshake|building/,
        "Building2"
    ],
    [
        /phone/,
        "Phone"
    ],
    [
        /bullseye/,
        "Target"
    ],
    [
        /truck|shipping/,
        "Truck"
    ],
    [
        /map/,
        "MapPin"
    ],
    [
        /cogs|cog|gear|sliders|wrench/,
        "Settings"
    ],
    [
        /laptop|code/,
        "Cpu"
    ],
    [
        /receipt|invoice|file/,
        "Receipt"
    ],
    [
        /shield/,
        "ShieldCheck"
    ],
    [
        /headset|life-ring/,
        "LifeBuoy"
    ],
    [
        /question/,
        "ClipboardList"
    ],
    [
        /star/,
        "Star"
    ],
    [
        /envelope/,
        "Mail"
    ],
    [
        /briefcase/,
        "Briefcase"
    ],
    [
        /undo/,
        "Undo2"
    ]
];
function faIcon(className) {
    const value = String(className ?? "");
    return FA_ICONS.find(([re])=>re.test(value))?.[1] ?? "Circle";
}
function routeFor(link) {
    const value = norm(link);
    return leafByLink.get(value) ?? leafByLink.get(value.split(/[?#]/)[0]) ?? null;
}
function notPortedHref(link, name) {
    const params = new URLSearchParams({
        link: String(link ?? ""),
        name: String(name ?? "")
    });
    return `/admin/not-ported?${params}`;
}
function toLeaf(node, label = node.name) {
    const route = routeFor(node.link);
    const ported = route && !PENDING_ROUTES.has(pathOf(route.href));
    return {
        key: `menu-${node.id}`,
        label,
        href: ported ? route.href : notPortedHref(node.link, node.name),
        page: node.link,
        icon: route?.icon ?? faIcon(node.icon),
        badge: route?.badge,
        permission: route?.permission
    };
}
/** Leaves under a group; deeper levels (PHP renders any depth) are listed with their parent's name. */ function leavesOf(nodes, prefix = "") {
    const out = [];
    for (const node of nodes){
        const label = prefix ? `${prefix} › ${node.name}` : node.name;
        const link = norm(node.link);
        if (link && (!link.startsWith("#") || link.startsWith("#dashboard_"))) out.push(toLeaf(node, label));
        if (node.children?.length) out.push(...leavesOf(node.children, label));
    }
    return out;
}
const visibleExtra = (user, leaf)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, leaf.permission, "view") && (!leaf.action || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, leaf.permission, leaf.action));
function uniqueByHref(leaves) {
    const seen = new Set();
    return leaves.filter((leaf)=>{
        if (seen.has(leaf.href)) return false;
        seen.add(leaf.href);
        return true;
    });
}
const FALLBACK = [
    {
        section: null,
        items: [
            {
                key: "menu-dashboard",
                label: "Dashboard",
                href: "/admin/dashboard",
                icon: "LayoutDashboard"
            }
        ]
    }
];
function buildSidebar(items, user) {
    const sections = [];
    const usedGroups = new Set();
    for (const top of items ?? []){
        if (!top.children?.length) {
            sections.push({
                section: null,
                items: [
                    toLeaf(top)
                ]
            });
            continue;
        }
        const sectionItems = [];
        for (const node of top.children){
            if (!node.children?.length) {
                sectionItems.push(toLeaf(node));
                continue;
            }
            const meta = groups.get(norm(node.link));
            if (meta) usedGroups.add(meta.key);
            const extras = (meta?.extras ?? []).filter((leaf)=>visibleExtra(user, leaf));
            const children = uniqueByHref([
                ...leavesOf(node.children),
                ...extras
            ]);
            if (children.length) sectionItems.push({
                key: `menu-${node.id}`,
                label: node.name,
                icon: meta?.icon ?? faIcon(node.icon),
                sensitive: meta?.sensitive || undefined,
                children
            });
        }
        if (sectionItems.length) sections.push({
            section: top.name,
            items: sectionItems
        });
    }
    // Next-only screens whose navigation group is not in this role's menu: keep them reachable.
    for (const meta of groups.values()){
        if (usedGroups.has(meta.key)) continue;
        const extras = meta.extras.filter((leaf)=>visibleExtra(user, leaf));
        if (!extras.length) continue;
        const group = {
            key: `nav-${meta.key}`,
            label: meta.label,
            icon: meta.icon,
            sensitive: meta.sensitive || undefined,
            children: extras
        };
        const section = sections.find((s)=>s.section === meta.section);
        if (section) section.items.push(group);
        else sections.push({
            section: meta.section,
            items: [
                group
            ]
        });
    }
    if (!sections.length) return FALLBACK;
    for (const { section, item } of topLevelExtras)if (visibleExtra(user, item)) sections.push({
        section,
        items: [
            item
        ]
    });
    return sections;
}
}),
"[project]/src/lib/services/admin/menu.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminMenu",
    ()=>getAdminMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/navigation.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$sidebar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/sidebar.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getAdminMenu(user) {
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/menu", {
            token: user.token
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$sidebar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildSidebar"])(Array.isArray(data?.items) ? data.items : [], user);
    } catch (error) {
        console.error(`[admin menu] using the static sidebar: ${error?.message ?? error}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["filterNavigation"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$navigation$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["navigation"], user);
    }
}
}),
"[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AdminShell",
    ()=>AdminShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AdminShell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AdminShell() from the server but AdminShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/shell/admin-shell.jsx <module evaluation>", "AdminShell");
}),
"[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "AdminShell",
    ()=>AdminShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AdminShell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AdminShell() from the server but AdminShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/shell/admin-shell.jsx", "AdminShell");
}),
"[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$admin$2d$shell$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$admin$2d$shell$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$admin$2d$shell$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/admin/(panel)/layout.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPanelLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/shell.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$menu$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/menu.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$admin$2d$shell$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/admin-shell.jsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function AdminPanelLayout({ children }) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireAdmin"])();
    const [menu, badges, notifications] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$menu$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminMenu"])(user),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNavBadges"])(user),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNotifications"])(user)
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$admin$2d$shell$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AdminShell"], {
        user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toClientUser"])(user),
        navigation: menu,
        badges: badges,
        notifications: notifications,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/admin/(panel)/layout.js",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_84c3edb5._.js.map