module.exports = [
"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0010732e0de4588a62f91b017a0c5cd35a43c50c7c":"logoutOtherSessionsAction","002d2150522fbc8f145093f8f71c54ff678fb5f4ca":"logoutAction","601703f5f4a69fa9824e728b14862dcdc9e6a96165":"changePasswordAction","6040e9173eea3c77ffda34a26ffa7987578a8120f9":"loginAction"},"",""] */ __turbopack_context__.s([
    "changePasswordAction",
    ()=>changePasswordAction,
    "loginAction",
    ()=>loginAction,
    "logoutAction",
    ()=>logoutAction,
    "logoutOtherSessionsAction",
    ()=>logoutOtherSessionsAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
/** Same-origin paths only. Old console paths (e.g. /orders from /login?next=) are redirected to /admin by next.config. */ function safeNext(next) {
    return typeof next === "string" && /^\/(?![/\\])/.test(next) && !/[\r\n]/.test(next) && next !== "/admin/login" ? next : "/admin/dashboard";
}
async function loginAction(_prev, formData) {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const next = safeNext(formData.get("next"));
    if (!email || !password) return {
        ok: false,
        message: "Enter your email and password."
    };
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/login", {
            method: "POST",
            body: {
                email,
                password
            }
        });
        const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        jar.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"], data.token, {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sessionCookieOptions"],
            maxAge: cookieMaxAge(data.expiresAt)
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dropAdminProfile"])(data.token);
    } catch (error) {
        const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "Could not reach the admin API.";
        return {
            ok: false,
            message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(next);
}
function cookieMaxAge(expiresAt) {
    return expiresAt ? Math.max(60, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sessionCookieOptions"].maxAge;
}
async function changePasswordAction(_prev, formData) {
    const currentPassword = String(formData.get("currentPassword") || "");
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    if (!currentPassword || !newPassword) return {
        ok: false,
        message: "Enter your current and new password."
    };
    if (newPassword !== confirmPassword) return {
        ok: false,
        message: "The new passwords do not match.",
        fieldErrors: {
            confirmPassword: "Does not match the new password."
        }
    };
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"])?.value;
    if (!token) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/change-password", {
            method: "POST",
            token,
            body: {
                currentPassword,
                newPassword
            }
        });
        jar.set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"], data.token, {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sessionCookieOptions"],
            maxAge: cookieMaxAge(data.expiresAt)
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/account");
        return {
            ok: true,
            message: "Password updated. Your other sessions were signed out."
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] && error.status === 401) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
        const field = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.details?.field : undefined;
        return {
            ok: false,
            message: error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "Could not reach the admin API.",
            fieldErrors: field ? {
                [field]: error.message
            } : undefined
        };
    }
}
async function logoutOtherSessionsAction() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"])?.value;
    if (!token) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/logout-all", {
            method: "POST",
            token,
            body: {
                keepCurrent: true
            }
        });
        const ended = data?.sessionsEnded ?? 0;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/account");
        return {
            ok: true,
            message: `Ended ${ended} other session${ended === 1 ? "" : "s"}.`
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] && error.status === 401) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
        return {
            ok: false,
            message: error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "Could not reach the admin API."
        };
    }
}
async function logoutAction() {
    const jar = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = jar.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"])?.value;
    if (token) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dropAdminProfile"])(token);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/logout", {
            method: "POST",
            token
        }).catch(()=>{});
    }
    jar.delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SESSION_COOKIE"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin/login");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    changePasswordAction,
    logoutOtherSessionsAction,
    logoutAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "6040e9173eea3c77ffda34a26ffa7987578a8120f9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(changePasswordAction, "601703f5f4a69fa9824e728b14862dcdc9e6a96165", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutOtherSessionsAction, "0010732e0de4588a62f91b017a0c5cd35a43c50c7c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAction, "002d2150522fbc8f145093f8f71c54ff678fb5f4ca", null);
}),
"[project]/src/lib/services/admin/parity/bulk.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addBulkOrderRemark",
    ()=>addBulkOrderRemark,
    "convertBulkQuotation",
    ()=>convertBulkQuotation,
    "deleteBulkOrder",
    ()=>deleteBulkOrder,
    "deleteBulkQuotation",
    ()=>deleteBulkQuotation,
    "exportBulkOrders",
    ()=>exportBulkOrders,
    "getBulkDashboard",
    ()=>getBulkDashboard,
    "getBulkOrder",
    ()=>getBulkOrder,
    "getBulkOrderLabel",
    ()=>getBulkOrderLabel,
    "getBulkOrderOptions",
    ()=>getBulkOrderOptions,
    "getBulkOrderTracking",
    ()=>getBulkOrderTracking,
    "getBulkOrders",
    ()=>getBulkOrders,
    "getBulkQuotation",
    ()=>getBulkQuotation,
    "getBulkQuotations",
    ()=>getBulkQuotations,
    "getBulkShipments",
    ()=>getBulkShipments,
    "updateBulkOrderAgent",
    ()=>updateBulkOrderAgent,
    "updateBulkOrderStatus",
    ()=>updateBulkOrderStatus,
    "updateBulkWaybill",
    ()=>updateBulkWaybill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
;
;
/**
 * Bulk order screens ported from PHP bulk_orders/ (API /admin/parity/bulk):
 *   dashboard, all orders + order view, bulk shipments, quotations.
 * The products list is the bulk.products resource (/admin/bulk-orders/products).
 */ const BASE = "admin/parity/bulk";
async function get(path, user, query) {
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`${BASE}/${path}`, {
        token: user.token,
        query
    });
    return data;
}
async function send(path, user, method, body) {
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`${BASE}/${path}`, {
        token: user.token,
        method,
        body
    });
    return data;
}
/** For mutations and on-demand reads called from server actions: never throws. */ async function attempt(fn) {
    try {
        return {
            ok: true,
            data: await fn()
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"]) return {
            ok: false,
            message: error.message,
            status: error.status
        };
        return {
            ok: false,
            message: "The bulk orders service could not be reached."
        };
    }
}
const enc = encodeURIComponent;
const getBulkDashboard = (range, user)=>get("dashboard", user, range);
const getBulkOrders = (filters, user)=>get("orders", user, filters);
const getBulkOrderOptions = (user)=>get("orders/options", user);
const getBulkOrder = (orderId, user)=>get(`orders/${enc(orderId)}`, user);
const exportBulkOrders = (filters, user)=>attempt(()=>get("orders/export", user, filters));
const getBulkOrderTracking = (orderId, user)=>attempt(()=>get(`orders/${enc(orderId)}/tracking`, user));
const getBulkOrderLabel = (orderId, user)=>attempt(()=>get(`orders/${enc(orderId)}/label`, user));
const updateBulkOrderStatus = (orderId, input, user)=>attempt(()=>send(`orders/${enc(orderId)}/status`, user, "PATCH", input));
const updateBulkOrderAgent = (orderId, salesmanId, user)=>attempt(()=>send(`orders/${enc(orderId)}/sales-agent`, user, "PATCH", {
            salesmanId
        }));
const addBulkOrderRemark = (orderId, input, user)=>attempt(()=>send(`orders/${enc(orderId)}/remarks`, user, "POST", input));
const deleteBulkOrder = (id, user)=>attempt(()=>send(`orders/${enc(id)}`, user, "DELETE"));
const getBulkShipments = (filters, user)=>get("shipments", user, filters);
const updateBulkWaybill = (orderId, waybillNo, user)=>attempt(()=>send(`shipments/${enc(orderId)}/waybill`, user, "PATCH", {
            waybillNo
        }));
const getBulkQuotations = (filters, user)=>get("quotations", user, filters);
const getBulkQuotation = (id, user)=>get(`quotations/${enc(id)}`, user);
const deleteBulkQuotation = (id, user)=>attempt(()=>send(`quotations/${enc(id)}`, user, "DELETE"));
const convertBulkQuotation = (id, user)=>attempt(()=>send(`quotations/${enc(id)}/convert`, user, "POST", {}));
}),
"[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40180c25f4ad9d763ab21f0063257be7c91510e12c":"convertBulkQuotationAction","4098284c6eaef2d5848ce0b4171609280552320d50":"exportBulkOrdersAction","40a6da0a542a5a94d5b2c4d758bbce6db049793f42":"deleteBulkQuotationAction","40a831a744d7b9d1b9b543f8e3b7136d4d98416286":"bulkOrderLabelAction","40aad625e1d644a81cb54928b93163cbcbf213a6ba":"deleteBulkOrderAction","40cca4c30135a34fc732777437751e43f58f9f9fdb":"bulkOrderTrackingAction","604410326d5958bbd3e31239adfd8b082feacf67d2":"updateBulkOrderAgentAction","6083f783b39758819649578482d4ee0ef391fe6e43":"updateBulkOrderStatusAction","608bbaa7560f183bd3a08b4f07588d0dd6273e55d0":"updateBulkWaybillAction","60bfee930bafc0ee866d98126c35b1d9234959911c":"addBulkOrderRemarkAction"},"",""] */ __turbopack_context__.s([
    "addBulkOrderRemarkAction",
    ()=>addBulkOrderRemarkAction,
    "bulkOrderLabelAction",
    ()=>bulkOrderLabelAction,
    "bulkOrderTrackingAction",
    ()=>bulkOrderTrackingAction,
    "convertBulkQuotationAction",
    ()=>convertBulkQuotationAction,
    "deleteBulkOrderAction",
    ()=>deleteBulkOrderAction,
    "deleteBulkQuotationAction",
    ()=>deleteBulkQuotationAction,
    "exportBulkOrdersAction",
    ()=>exportBulkOrdersAction,
    "updateBulkOrderAgentAction",
    ()=>updateBulkOrderAgentAction,
    "updateBulkOrderStatusAction",
    ()=>updateBulkOrderStatusAction,
    "updateBulkWaybillAction",
    ()=>updateBulkWaybillAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/parity/bulk.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const invalid = (message = "Invalid request.")=>({
        ok: false,
        message
    });
const str = (v, max = 120)=>typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "";
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const RESPONSIBLE = [
    "",
    "customer",
    "vendor",
    "admin",
    "courier"
];
const ORDER_STATUSES = [
    "created",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "rejected",
    "returned",
    "rto"
];
function refresh(orderId) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/bulk-orders/orders");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/bulk-orders/shipments");
    if (orderId) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/bulk-orders/orders/${encodeURIComponent(orderId)}`);
}
async function exportBulkOrdersAction(filters) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "view");
    if (!auth.ok) return auth;
    const query = {};
    for (const key of [
        "orderId",
        "customer",
        "status"
    ])if (str(filters?.[key])) query[key] = str(filters[key]);
    for (const key of [
        "from",
        "to"
    ])if (YMD.test(str(filters?.[key], 10))) query[key] = str(filters[key], 10);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exportBulkOrders"])(query, auth.user);
}
async function bulkOrderTrackingAction(orderId) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "view");
    if (!auth.ok) return auth;
    if (!str(orderId)) return invalid("Order ID is required.");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBulkOrderTracking"])(str(orderId), auth.user);
}
async function bulkOrderLabelAction(orderId) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "view");
    if (!auth.ok) return auth;
    if (!str(orderId)) return invalid("Order ID is required.");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBulkOrderLabel"])(str(orderId), auth.user);
}
async function updateBulkOrderStatusAction(orderId, input) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "edit");
    if (!auth.ok) return auth;
    const status = str(input?.status, 30);
    const responsible = str(input?.responsible, 20);
    if (!ORDER_STATUSES.includes(status)) return invalid("Choose a valid status.");
    if (!RESPONSIBLE.includes(responsible)) return invalid("Choose a valid responsible party.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBulkOrderStatus"])(str(orderId), {
        status,
        responsible
    }, auth.user);
    if (result.ok) refresh(str(orderId));
    return result;
}
async function updateBulkOrderAgentAction(orderId, salesmanId) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "edit");
    if (!auth.ok) return auth;
    if (!str(salesmanId, 40)) return invalid("Choose a sales agent.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBulkOrderAgent"])(str(orderId), str(salesmanId, 40), auth.user);
    if (result.ok) refresh(str(orderId));
    return result;
}
async function addBulkOrderRemarkAction(orderId, input) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "edit");
    if (!auth.ok) return auth;
    const remark = str(input?.remark, 1000);
    const responsible = str(input?.responsible, 20);
    if (!remark) return invalid("Remark is required.");
    if (!RESPONSIBLE.includes(responsible)) return invalid("Choose a valid responsible party.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addBulkOrderRemark"])(str(orderId), {
        remark,
        responsible
    }, auth.user);
    if (result.ok) refresh(str(orderId));
    return result;
}
async function deleteBulkOrderAction(id) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.orders", "delete");
    if (!auth.ok) return auth;
    if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid order.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteBulkOrder"])(str(id, 20), auth.user);
    if (result.ok) refresh();
    return result;
}
async function updateBulkWaybillAction(orderId, waybillNo) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.shipments", "edit");
    if (!auth.ok) return auth;
    if (!str(waybillNo, 100)) return invalid("Waybill number is required.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBulkWaybill"])(str(orderId), str(waybillNo, 100), auth.user);
    if (result.ok) refresh(str(orderId));
    return result;
}
async function deleteBulkQuotationAction(id) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.quotations", "delete");
    if (!auth.ok) return auth;
    if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid quotation.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteBulkQuotation"])(str(id, 20), auth.user);
    if (result.ok) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/bulk-orders/quotations");
    return result;
}
async function convertBulkQuotationAction(id) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertPermission"])("bulk.quotations", "edit");
    if (!auth.ok) return auth;
    if (!/^\d+$/.test(str(id, 20))) return invalid("Invalid quotation.");
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["convertBulkQuotation"])(str(id, 20), auth.user);
    if (result.ok) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/bulk-orders/quotations");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/bulk-orders/orders");
    }
    return result;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    exportBulkOrdersAction,
    bulkOrderTrackingAction,
    bulkOrderLabelAction,
    updateBulkOrderStatusAction,
    updateBulkOrderAgentAction,
    addBulkOrderRemarkAction,
    deleteBulkOrderAction,
    updateBulkWaybillAction,
    deleteBulkQuotationAction,
    convertBulkQuotationAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(exportBulkOrdersAction, "4098284c6eaef2d5848ce0b4171609280552320d50", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkOrderTrackingAction, "40cca4c30135a34fc732777437751e43f58f9f9fdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkOrderLabelAction, "40a831a744d7b9d1b9b543f8e3b7136d4d98416286", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBulkOrderStatusAction, "6083f783b39758819649578482d4ee0ef391fe6e43", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBulkOrderAgentAction, "604410326d5958bbd3e31239adfd8b082feacf67d2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addBulkOrderRemarkAction, "60bfee930bafc0ee866d98126c35b1d9234959911c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteBulkOrderAction, "40aad625e1d644a81cb54928b93163cbcbf213a6ba", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBulkWaybillAction, "608bbaa7560f183bd3a08b4f07588d0dd6273e55d0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteBulkQuotationAction, "40a6da0a542a5a94d5b2c4d758bbce6db049793f42", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(convertBulkQuotationAction, "40180c25f4ad9d763ab21f0063257be7c91510e12c", null);
}),
"[project]/.next-internal/server/app/admin/(panel)/bulk-orders/orders/[orderId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/admin/(panel)/bulk-orders/orders/[orderId]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002d2150522fbc8f145093f8f71c54ff678fb5f4ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "40a831a744d7b9d1b9b543f8e3b7136d4d98416286",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkOrderLabelAction"],
    "40cca4c30135a34fc732777437751e43f58f9f9fdb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkOrderTrackingAction"],
    "604410326d5958bbd3e31239adfd8b082feacf67d2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBulkOrderAgentAction"],
    "6083f783b39758819649578482d4ee0ef391fe6e43",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBulkOrderStatusAction"],
    "60bfee930bafc0ee866d98126c35b1d9234959911c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addBulkOrderRemarkAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f28$panel$292f$bulk$2d$orders$2f$orders$2f5b$orderId$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/(panel)/bulk-orders/orders/[orderId]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$bulk$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/parity/bulk.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_60ffcec9._.js.map