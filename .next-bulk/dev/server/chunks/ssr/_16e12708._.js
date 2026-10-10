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
"[project]/.next-internal/server/app/admin/(panel)/bulk-orders/quotations/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/admin/(panel)/bulk-orders/quotations/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002d2150522fbc8f145093f8f71c54ff678fb5f4ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f28$panel$292f$bulk$2d$orders$2f$quotations$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/(panel)/bulk-orders/quotations/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_16e12708._.js.map