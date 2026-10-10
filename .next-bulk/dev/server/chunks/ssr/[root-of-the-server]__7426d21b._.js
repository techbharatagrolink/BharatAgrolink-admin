module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/icon.png.mjs { IMAGE => \"[project]/src/app/icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/icon.png.mjs { IMAGE => \"[project]/src/app/icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/apple-icon.png.mjs { IMAGE => \"[project]/src/app/apple-icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/apple-icon.png.mjs { IMAGE => \"[project]/src/app/apple-icon.png (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(panel)/layout.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(panel)/layout.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(panel)/error.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(panel)/error.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(panel)/loading.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(panel)/loading.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/admin/(panel)/not-found.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(panel)/not-found.js [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/format.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/content/admin/status.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Status → tone used by StatusBadge across every module. */ __turbopack_context__.s([
    "statusTone",
    ()=>statusTone
]);
const tones = {
    success: [
        "Active",
        "Approved",
        "Verified",
        "Delivered",
        "Paid",
        "Processed",
        "Refunded",
        "Completed",
        "Resolved",
        "Closed",
        "Published",
        "Reconciled",
        "Converted",
        "Accepted",
        "RTO Delivered",
        "Visible",
        "Sent",
        "Filed",
        "Scored",
        "completed",
        "delivered",
        "Settled",
        "Captured",
        "Recovered",
        "In Stock",
        "ok",
        "On track",
        "Connected",
        "Return Completed",
        "Auto-approved",
        "Auto-Closed",
        "RELEASED",
        "APPROVED",
        "Upcoming",
        "Order placed",
        "Interested",
        "Hot",
        "Published"
    ],
    warning: [
        "Pending",
        "Pending Pickup",
        "Placed",
        "Awaiting Pickup",
        "Awaiting Response",
        "Under Review",
        "Submitted",
        "Approval Pending",
        "Partially Reconciled",
        "Partial",
        "Due",
        "Low Stock",
        "below_target",
        "At risk",
        "Follow Up",
        "Requested",
        "Pending Manual Transfer",
        "On Hold",
        "Hold",
        "Processing",
        "Initiated",
        "Return Requested",
        "Negotiation",
        "Quotes Received",
        "Evidence Pending",
        "PENDING",
        "UNDER_REVIEW",
        "DEFERRED",
        "Acknowledged",
        "Scheduled",
        "Warm",
        "queued",
        "calling",
        "Draft",
        "Draft / Rejected",
        "Seller Sourcing",
        "Customer Quote Ready",
        "Called",
        "Raised by courier",
        "Eligible",
        "Medium",
        "Normal",
        "Call back",
        "Busy",
        "In Progress",
        "In-Progress",
        "Ready to Ship",
        "Documents Missing",
        "Partially Paid"
    ],
    danger: [
        "Rejected",
        "Cancelled",
        "Failed",
        "Suspended",
        "Blocked",
        "RTO",
        "RTO In Transit",
        "Undelivered",
        "Out of Stock",
        "loss",
        "below_floor",
        "Breached",
        "Overdue",
        "Lost",
        "Expired",
        "DISPUTED",
        "Disputed",
        "High",
        "Urgent",
        "Not Interested",
        "failed",
        "no-answer",
        "Dead",
        "Abandoned",
        "Not reachable",
        "Inactive",
        "cancelled",
        "returned",
        "Hidden",
        "Hidden (known issue: never shows)",
        "Open"
    ],
    info: [
        "Accepted",
        "Packed",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Replacement Shipped",
        "Confirmed",
        "New",
        "Viewed",
        "Order",
        "confirmed",
        "processing",
        "packed",
        "dispatched",
        "in_transit",
        "Engine",
        "Manual",
        "Cold",
        "Low",
        "Not Eligible"
    ]
};
const map = new Map();
for (const [tone, list] of Object.entries(tones)){
    for (const status of list)if (!map.has(status)) map.set(status, tone);
}
// Order matters for a few overloaded words.
map.set("Accepted", "info");
map.set("Open", "warning");
map.set("Inactive", "neutral");
map.set("Hidden", "neutral");
map.set("High", "danger");
map.set("overdue", "danger");
map.set("upcoming", "info");
function statusTone(status) {
    if (status == null) return "neutral";
    if (typeof status === "boolean") return status ? "success" : "neutral";
    return map.get(String(status)) || "neutral";
}
}),
"[project]/src/components/ui/badge.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/status.js [app-rsc] (ecmascript)");
;
;
;
const toneClasses = {
    success: "bg-success-bg text-success-ink",
    warning: "bg-warning-bg text-warning-ink",
    danger: "bg-danger-bg text-danger-ink",
    info: "bg-info-bg text-info-ink",
    neutral: "bg-neutral-bg text-neutral-ink",
    brand: "bg-brand-50 text-brand-700"
};
const dotClasses = {
    success: "bg-success-ink",
    warning: "bg-warning-ink",
    danger: "bg-danger-ink",
    info: "bg-info-ink",
    neutral: "bg-neutral-ink",
    brand: "bg-brand-600"
};
const variantTone = {
    default: "success",
    secondary: "neutral",
    destructive: "danger",
    outline: "neutral"
};
function Badge({ tone, variant, className, children, dot = false }) {
    const resolved = tone || variantTone[variant] || "neutral";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium leading-5 whitespace-nowrap", toneClasses[resolved], className),
        children: [
            dot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("size-1.5 shrink-0 rounded-full", dotClasses[resolved]),
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.jsx",
                lineNumber: 33,
                columnNumber: 15
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.jsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/badge.jsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
function StatusBadge({ status, label, className }) {
    if (status == null || status === "") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-ink-muted",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.jsx",
        lineNumber: 40,
        columnNumber: 47
    }, this);
    const text = label ?? (typeof status === "boolean" ? status ? "Yes" : "No" : String(status).replace(/_/g, " "));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["statusTone"])(status),
        dot: true,
        className: className,
        children: text
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.jsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/card.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardBody",
    ()=>CardBody,
    "CardContent",
    ()=>CardContent,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-rsc] (ecmascript)");
;
;
function Card({ className, as: Tag = "section", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("min-w-0 rounded-xl border border-line bg-surface shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
function CardHeader({ title, description, actions, className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-semibold text-ink",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/card.jsx",
                        lineNumber: 11,
                        columnNumber: 19
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-xs text-ink-muted",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/card.jsx",
                        lineNumber: 12,
                        columnNumber: 25
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/card.jsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/components/ui/card.jsx",
                lineNumber: 15,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
function CardBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 21,
        columnNumber: 10
    }, this);
}
function CardTitle({ className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold text-ink", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/page.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DescriptionList",
    ()=>DescriptionList,
    "LinkTabs",
    ()=>LinkTabs,
    "Notice",
    ()=>Notice,
    "PageHeader",
    ()=>PageHeader,
    "ProgressBar",
    ()=>ProgressBar,
    "StatCard",
    ()=>StatCard,
    "StatGrid",
    ()=>StatGrid,
    "Timeline",
    ()=>Timeline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-right.js [app-rsc] (ecmascript) <export default as ArrowDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-rsc] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-rsc] (ecmascript)");
;
;
;
;
function PageHeader({ title, description, actions, meta, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold tracking-tight text-ink sm:text-[22px]",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 max-w-3xl text-sm text-ink-muted",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 10,
                        columnNumber: 25
                    }, this),
                    meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex flex-wrap items-center gap-2",
                        children: meta
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 11,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 13,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function StatCard({ label, value, hint, delta, href, icon: Icon, tone = "brand", className }) {
    const toneBg = {
        brand: "bg-brand-50 text-brand-700",
        warning: "bg-warning-bg text-warning-ink",
        danger: "bg-danger-bg text-danger-ink",
        info: "bg-info-bg text-info-ink",
        neutral: "bg-neutral-bg text-neutral-ink"
    }[tone];
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12.5px] font-medium text-ink-muted",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("flex size-7 shrink-0 items-center justify-center rounded-lg", toneBg),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "size-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/page.jsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs",
                children: [
                    delta != null && Number.isFinite(delta) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success-ink" : "text-danger-ink"),
                        children: [
                            delta >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                className: "size-3.5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/page.jsx",
                                lineNumber: 34,
                                columnNumber: 27
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__["ArrowDownRight"], {
                                className: "size-3.5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/page.jsx",
                                lineNumber: 34,
                                columnNumber: 79
                            }, this),
                            Math.abs(delta).toFixed(1),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate text-ink-muted",
                        children: hint
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 38,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    const classes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("block min-w-0 rounded-xl border border-line bg-surface p-3.5", href && "transition-colors hover:border-brand-200 hover:bg-surface-muted", className);
    return href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: classes,
        children: content
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 44,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: content
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
function StatGrid({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
}
function DescriptionList({ items, columns = 2, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("grid gap-x-6 gap-y-3", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 1 ? "" : "sm:grid-cols-2", className),
        children: items.filter(Boolean).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                        className: "text-xs text-ink-muted",
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                        className: "mt-0.5 text-sm break-words text-ink",
                        children: item.value ?? "—"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this)
                ]
            }, item.label, true, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 60,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
function Timeline({ items }) {
    if (!items?.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-sm text-ink-muted",
        children: "No activity yet."
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 70,
        columnNumber: 30
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
        className: "relative space-y-4 border-l border-line pl-5",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("absolute top-1 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", item.tone === "danger" ? "bg-danger" : item.tone === "warning" ? "bg-warning-ink" : "bg-brand-600"),
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-ink",
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-ink-soft",
                        children: item.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 77,
                        columnNumber: 32
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-xs text-ink-muted",
                        children: item.meta
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this)
                ]
            }, item.id, true, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 74,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
function LinkTabs({ tabs, active }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "-mx-1 mb-4 overflow-x-auto scrollbar-thin",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex min-w-max gap-1 border-b border-line px-1",
            "aria-label": "Sections",
            children: tabs.map((tab)=>{
                const isActive = tab.value === active;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: tab.href,
                    scroll: false,
                    "aria-current": isActive ? "page" : undefined,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors", isActive ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink"),
                    children: [
                        tab.label,
                        tab.count != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "rounded-full bg-neutral-bg px-1.5 text-[11px] text-ink-soft tabular",
                            children: tab.count
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/page.jsx",
                            lineNumber: 103,
                            columnNumber: 37
                        }, this)
                    ]
                }, tab.value, true, {
                    fileName: "[project]/src/components/ui/page.jsx",
                    lineNumber: 92,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 88,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
function Notice({ tone = "info", title, children, className }) {
    const toneClass = {
        info: "border-info-ink/20 bg-info-bg text-info-ink",
        warning: "border-warning-ink/20 bg-warning-bg text-warning-ink",
        danger: "border-danger-ink/20 bg-danger-bg text-danger-ink",
        success: "border-success-ink/20 bg-success-bg text-success-ink"
    }[tone];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border px-3.5 py-2.5 text-sm", toneClass, className),
        role: tone === "danger" ? "alert" : undefined,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 116,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(title && "mt-0.5", "opacity-95"),
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
function ProgressBar({ value, max = 100, tone = "brand", className, label }) {
    const pct = Math.max(0, Math.min(100, value / max * 100));
    const toneClass = {
        brand: "bg-brand-600",
        warning: "bg-warning-ink",
        danger: "bg-danger",
        info: "bg-info-ink"
    }[tone];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("h-2 w-full overflow-hidden rounded-full bg-neutral-bg", className),
        role: "progressbar",
        "aria-valuenow": Math.round(pct),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("chart-grow-x h-full rounded-full", toneClass),
            style: {
                width: `${pct}%`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BulkOrderActions",
    ()=>BulkOrderActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BulkOrderActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BulkOrderActions() from the server but BulkOrderActions is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/parity/bulk/order-actions.jsx <module evaluation>", "BulkOrderActions");
}),
"[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "BulkOrderActions",
    ()=>BulkOrderActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BulkOrderActions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BulkOrderActions() from the server but BulkOrderActions is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/admin/parity/bulk/order-actions.jsx", "BulkOrderActions");
}),
"[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$order$2d$actions$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$order$2d$actions$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$order$2d$actions$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BulkOrderPage,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-rsc] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/parity/bulk.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/page.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/states.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$order$2d$actions$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/parity/bulk/order-actions.jsx [app-rsc] (ecmascript)");
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
;
;
async function generateMetadata({ params }) {
    const { orderId } = await params;
    return {
        title: `Bulk Order ${decodeURIComponent(orderId)}`
    };
}
const address = (a)=>[
        a.line1,
        a.line2,
        a.city,
        a.state,
        a.pincode
    ].filter(Boolean).join(", ") || "—";
async function BulkOrderPage({ params }) {
    const { orderId } = await params;
    const key = decodeURIComponent(orderId);
    const { user, allowed } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkPermission"])("bulk.orders");
    if (!allowed) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: "Bulk order"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 27,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PermissionDenied"], {
                module: "bulk orders"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 27,
                columnNumber: 60
            }, this)
        ]
    }, void 0, true);
    const result = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBulkOrder"])(key, user),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBulkOrderOptions"])(user)
    ]).then(([order, options])=>({
            order,
            options
        }), (error)=>({
            error
        }));
    if (result.error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] && result.error.status === 404) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    if (result.error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: `Order ${key}`
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 30,
                columnNumber: 31
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiUnavailable"], {
                error: result.error,
                what: "this bulk order"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 30,
                columnNumber: 68
            }, this)
        ]
    }, void 0, true);
    const { order: o, options } = result;
    const back = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: "/admin/bulk-orders/orders",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buttonClasses"])({
            size: "sm"
        }),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                className: "size-4",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            " All orders"
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
        lineNumber: 33,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageHeader"], {
                title: `Order ${o.orderId}`,
                description: `Placed ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateTime"])(o.orderDate)}${o.provider ? ` · ${o.provider}` : ""}`,
                meta: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatusBadge"], {
                            status: o.displayStatus || o.status
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                            lineNumber: 45,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            tone: o.totals.paymentStatus === "Paid" ? "success" : o.totals.paymentStatus === "Partial" ? "warning" : "neutral",
                            children: o.totals.paymentStatus
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                            lineNumber: 46,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true),
                actions: back
            }, void 0, false, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Customer & addresses"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 54,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardBody"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DescriptionList"], {
                                            items: [
                                                {
                                                    label: "Customer",
                                                    value: o.customer.name || "—"
                                                },
                                                {
                                                    label: "Phone",
                                                    value: [
                                                        o.customer.phone,
                                                        o.customer.alternate
                                                    ].filter(Boolean).join(" / ") || "—"
                                                },
                                                {
                                                    label: "Email",
                                                    value: o.customer.email || "—"
                                                },
                                                {
                                                    label: "Sales agent",
                                                    value: o.salesmanName || "—"
                                                },
                                                {
                                                    label: "Ship to",
                                                    value: `${o.shipTo.name ? `${o.shipTo.name}, ` : ""}${address(o.shipTo)}`
                                                },
                                                {
                                                    label: "Ship from",
                                                    value: `${o.shipFrom.name ? `${o.shipFrom.name}, ` : ""}${address(o.shipFrom)}`
                                                },
                                                {
                                                    label: "Invoice no.",
                                                    value: o.invoiceNumber || "—"
                                                },
                                                {
                                                    label: "PO no.",
                                                    value: o.poNo || "—"
                                                }
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 55,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Items",
                                        description: `${o.items.length} line${o.items.length === 1 ? "" : "s"}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "overflow-x-auto scrollbar-thin",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "w-full min-w-max text-left text-[13px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "border-b border-line text-xs text-ink-muted",
                                                        children: [
                                                            "Item",
                                                            "HSN",
                                                            "Qty",
                                                            "Rate",
                                                            "Taxable",
                                                            "GST %",
                                                            "Total"
                                                        ].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                scope: "col",
                                                                className: "px-3 py-2 font-semibold",
                                                                children: h
                                                            }, h, false, {
                                                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                lineNumber: 78,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                        lineNumber: 76,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                    lineNumber: 75,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: o.items.map((it)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-line last:border-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-medium text-ink",
                                                                            children: it.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                            lineNumber: 88,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        it.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-ink-muted",
                                                                            children: it.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                            lineNumber: 89,
                                                                            columnNumber: 44
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 87,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 font-mono text-xs",
                                                                    children: it.hsn || "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 91,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 tabular",
                                                                    children: [
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatNumber"])(it.quantity),
                                                                        " ",
                                                                        it.unit
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 92,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 tabular",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(it.rate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 95,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 tabular",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(it.taxable)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 96,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 tabular",
                                                                    children: [
                                                                        it.gstPercentage,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 97,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "px-3 py-2 tabular",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(it.total)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                                    lineNumber: 98,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, it.id, true, {
                                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                            lineNumber: 86,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                    lineNumber: 84,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardBody"], {
                                        className: "border-t border-line",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DescriptionList"], {
                                            columns: 3,
                                            items: [
                                                {
                                                    label: "Subtotal",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.totals.subtotal)
                                                },
                                                {
                                                    label: "GST",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.totals.gst)
                                                },
                                                {
                                                    label: "Grand total",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.totals.grandTotal)
                                                },
                                                {
                                                    label: "Advance paid",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.totals.advance)
                                                },
                                                {
                                                    label: "Balance",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.totals.balance)
                                                }
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Shipping"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardBody"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DescriptionList"], {
                                            columns: 3,
                                            items: [
                                                {
                                                    label: "Waybill",
                                                    value: o.shipping.waybillNo || "—"
                                                },
                                                {
                                                    label: "Shipment ID",
                                                    value: o.shipping.shipmentId || "—"
                                                },
                                                {
                                                    label: "Mode",
                                                    value: o.shipping.modeName || "—"
                                                },
                                                {
                                                    label: "Packages",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatNumber"])(o.shipping.packages)
                                                },
                                                {
                                                    label: "Weight (kg)",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatNumber"])(o.shipping.weight)
                                                },
                                                {
                                                    label: "COD",
                                                    value: o.shipping.isCod ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["inr"])(o.shipping.codAmount) : "No"
                                                },
                                                {
                                                    label: "E-way bill",
                                                    value: o.shipping.ewayBillNo || "—"
                                                },
                                                {
                                                    label: "Shipment status",
                                                    value: o.shipmentStatus || "—"
                                                },
                                                {
                                                    label: "Responsible",
                                                    value: o.responsible || "—"
                                                }
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 121,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Remarks",
                                        description: `${o.remarks.length} total`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardBody"], {
                                        children: o.remarks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-ink-muted",
                                            children: "No remarks yet."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 142,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                            className: "space-y-3",
                                            children: o.remarks.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "border-l-2 border-line pl-3 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-words text-ink",
                                                            children: r.remark
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                            lineNumber: 147,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-ink-muted",
                                                            children: [
                                                                r.added_by || "Unknown",
                                                                r.added_at ? ` · ${r.added_at}` : ""
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                            lineNumber: 148,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, r.id ?? i, true, {
                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                    lineNumber: 146,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            o.documents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Documents"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardBody"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-1 text-sm",
                                            children: o.documents.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: d.url,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        className: "break-all text-brand-700 hover:underline",
                                                        children: d.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                        lineNumber: 166,
                                                        columnNumber: 23
                                                    }, this)
                                                }, d.url, false, {
                                                    fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                            lineNumber: 163,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$order$2d$actions$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BulkOrderActions"], {
                        order: o,
                        options: options,
                        canEdit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, "bulk.orders", "edit")
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admin/(panel)/bulk-orders/orders/[orderId]/page.js [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7426d21b._.js.map