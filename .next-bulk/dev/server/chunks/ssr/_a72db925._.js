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
"[project]/src/lib/mock/admin/seed.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Deterministic pseudo-random helpers so demo data is stable across reloads. */ __turbopack_context__.s([
    "DAY",
    ()=>DAY,
    "NOW",
    ()=>NOW,
    "couriers",
    ()=>couriers,
    "createRandom",
    ()=>createRandom,
    "daysAgo",
    ()=>daysAgo,
    "financialYear",
    ()=>financialYear,
    "firstNames",
    ()=>firstNames,
    "lastNames",
    ()=>lastNames,
    "mobile",
    ()=>mobile,
    "pad",
    ()=>pad,
    "personName",
    ()=>personName,
    "places",
    ()=>places
]);
function createRandom(seed = 20260105) {
    let state = seed >>> 0;
    const next = ()=>{
        state = state + 0x6d2b79f5 >>> 0;
        let t = state;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    const int = (min, max)=>Math.floor(next() * (max - min + 1)) + min;
    const pick = (list)=>list[Math.floor(next() * list.length)];
    const weighted = (entries)=>{
        const total = entries.reduce((sum, [, w])=>sum + w, 0);
        let roll = next() * total;
        for (const [value, w] of entries){
            roll -= w;
            if (roll <= 0) return value;
        }
        return entries[entries.length - 1][0];
    };
    const money = (min, max)=>Math.round((next() * (max - min) + min) * 100) / 100;
    const chance = (p)=>next() < p;
    return {
        next,
        int,
        pick,
        weighted,
        money,
        chance
    };
}
const NOW = new Date("2026-10-05T09:00:00.000Z").getTime();
const DAY = 86400000;
function daysAgo(days, rand) {
    const jitter = rand ? rand.int(0, 86399) * 1000 : 0;
    return new Date(NOW - days * DAY - jitter).toISOString();
}
function pad(value, size) {
    return String(value).padStart(size, "0");
}
const firstNames = [
    "Ramesh",
    "Suresh",
    "Mahesh",
    "Rajesh",
    "Sunita",
    "Anita",
    "Vikas",
    "Pooja",
    "Arjun",
    "Kavita",
    "Manoj",
    "Deepak",
    "Neha",
    "Sanjay",
    "Priya",
    "Ravi",
    "Geeta",
    "Amit",
    "Rekha",
    "Santosh",
    "Lakhan",
    "Bhagwan",
    "Harish",
    "Kiran",
    "Mohan",
    "Savita",
    "Prakash",
    "Ajay",
    "Seema",
    "Dinesh"
];
const lastNames = [
    "Patel",
    "Yadav",
    "Sharma",
    "Verma",
    "Singh",
    "Kushwaha",
    "Patidar",
    "Choudhary",
    "Meena",
    "Rathore",
    "Jat",
    "Gupta",
    "Tiwari",
    "Dhakad",
    "Lodhi",
    "Mishra",
    "Thakur",
    "Pawar",
    "Rajput",
    "Sahu"
];
const places = [
    {
        city: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462042",
        zone: "within_state"
    },
    {
        city: "Indore",
        state: "Madhya Pradesh",
        pincode: "452001",
        zone: "within_state"
    },
    {
        city: "Vidisha",
        state: "Madhya Pradesh",
        pincode: "464001",
        zone: "within_state"
    },
    {
        city: "Sehore",
        state: "Madhya Pradesh",
        pincode: "466001",
        zone: "within_city"
    },
    {
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302001",
        zone: "rest_of_india"
    },
    {
        city: "Kota",
        state: "Rajasthan",
        pincode: "324001",
        zone: "rest_of_india"
    },
    {
        city: "Nagpur",
        state: "Maharashtra",
        pincode: "440001",
        zone: "rest_of_india"
    },
    {
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        zone: "metro_to_metro"
    },
    {
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001",
        zone: "rest_of_india"
    },
    {
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: "380001",
        zone: "metro_to_metro"
    },
    {
        city: "Raipur",
        state: "Chhattisgarh",
        pincode: "492001",
        zone: "rest_of_india"
    },
    {
        city: "Guwahati",
        state: "Assam",
        pincode: "781001",
        zone: "north_east_jk"
    },
    {
        city: "Ludhiana",
        state: "Punjab",
        pincode: "141001",
        zone: "rest_of_india"
    },
    {
        city: "Patna",
        state: "Bihar",
        pincode: "800001",
        zone: "rest_of_india"
    }
];
const couriers = [
    "NimbusPost",
    "Shiprocket",
    "Delhivery"
];
function personName(rand) {
    return `${rand.pick(firstNames)} ${rand.pick(lastNames)}`;
}
function mobile(rand) {
    return `${rand.pick([
        "6",
        "7",
        "8",
        "9"
    ])}${pad(rand.int(0, 999999999), 9)}`;
}
function financialYear(iso) {
    const d = new Date(iso);
    const y = d.getUTCFullYear();
    const start = d.getUTCMonth() >= 3 ? y : y - 1;
    return `${String(start).slice(2)}${String(start + 1).slice(2)}`;
}
}),
"[project]/src/lib/content/admin/resources/core.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "coreResources",
    ()=>coreResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2f$admin$2f$seed$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock/admin/seed.js [app-rsc] (ecmascript)");
;
/** manage_orders.php status tabs. "Pickup" is every pickup or manifested line; the rest match a line status that contains the word. */ const orderStatuses = [
    "Placed",
    "Accepted",
    {
        value: "Pickup",
        label: "Pending pickup"
    },
    "Rejected",
    "Packed",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Undelivered",
    "RTO",
    "RTO Delivered",
    {
        value: "Return",
        label: "Return"
    },
    "Return Completed",
    "Cancelled"
];
const manualStatuses = [
    "Placed",
    "Accepted",
    "Rejected",
    "Packed",
    "Ready To Ship",
    "Manifested",
    "Pending Pickup",
    "Pickup Scheduled",
    "Pickup Generated",
    "Pickup Exception",
    "Picked Up",
    "Shipped",
    "In Transit",
    "Dispatched",
    "Out for Delivery",
    "Delivered",
    "Undelivered",
    "RTO",
    "Cancelled",
    "Return Accepted",
    "Return Cancelled",
    "Return Completed"
];
const responsibleParties = [
    {
        value: "user",
        label: "User / Customer"
    },
    {
        value: "vendor",
        label: "Vendor / Seller"
    },
    {
        value: "operation",
        label: "Operation / Admin"
    },
    {
        value: "courier",
        label: "Courier"
    }
];
const couriers = [
    "NimbusPost",
    "Shiprocket",
    "Delhivery"
];
const categories = [
    "Seeds",
    "Fertilizers",
    "Crop Protection",
    "Irrigation",
    "Farm Equipment",
    "Garden"
];
const verdictLabels = {
    ok: "Healthy",
    below_target: "Below target CM",
    below_floor: "Below floor CM",
    loss: "Loss-making"
};
const coreResources = {
    orders: {
        title: "All Orders",
        description: "One row per order. Click a line-status dot to show that sub-order’s product, invoice and AWB on the row. Status is updated by the courier sync, the same way manage orders does. The status filter matches a product line the same way the PHP tabs do.",
        permission: "orders",
        collection: "orders",
        api: "GET /api/admin/orders",
        search: "Search order, customer, product, invoice or AWB",
        searchFields: [
            "id",
            "customer",
            "mobile",
            "email",
            "platformInvoice",
            "invoiceNumber",
            "paymentId",
            "productName",
            "trackingId"
        ],
        filterFields: [
            "status",
            "paymentMode",
            "channel",
            "dateOn"
        ],
        filters: [
            {
                key: "status",
                label: "Status",
                options: orderStatuses
            },
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            },
            {
                key: "channel",
                label: "Channel",
                options: [
                    "Website",
                    "Website Guest",
                    "WhatsApp",
                    "Manual (Admin)"
                ]
            },
            {
                key: "dateOn",
                label: "Date field",
                options: [
                    {
                        value: "created",
                        label: "Order date"
                    },
                    {
                        value: "delivered",
                        label: "Delivery date"
                    },
                    {
                        value: "rto",
                        label: "RTO date"
                    }
                ]
            }
        ],
        dateField: "createdAt",
        dateRange: "Date",
        defaultSort: "createdAt:desc",
        rowHref: "/admin/orders/{id}",
        exportable: true,
        headerActions: [
            {
                label: "Create order",
                href: "/admin/orders/new",
                action: "add",
                primary: true
            }
        ],
        columns: [
            {
                key: "id",
                label: "Order",
                type: "mono"
            },
            {
                key: "customer",
                label: "Customer",
                sub: "city"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mono",
                hidden: true
            },
            {
                key: "email",
                label: "Email",
                hidden: true
            },
            {
                key: "channel",
                label: "Channel"
            },
            {
                key: "paymentMode",
                label: "Payment",
                sub: "paymentId"
            },
            {
                key: "platformInvoice",
                label: "Invoice"
            },
            {
                key: "items",
                label: "Lines",
                type: "number"
            },
            {
                key: "vendors",
                label: "Vendors",
                type: "number",
                hidden: true
            },
            {
                key: "total",
                label: "Total",
                type: "currency",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Placed",
                type: "datetime",
                sortable: true
            },
            {
                key: "image",
                label: "Product",
                type: "image"
            },
            {
                key: "productName",
                label: "Product name",
                width: 220,
                sortable: true
            },
            {
                key: "invoiceNumber",
                label: "Seller invoice",
                type: "mono",
                sortable: true
            },
            {
                key: "salesAgent",
                label: "Sales agent",
                width: 180,
                sortable: true
            },
            {
                key: "trackingId",
                label: "AWB",
                type: "mono",
                href: "{trackingUrl}",
                sortable: true
            },
            {
                key: "deliveryDate",
                label: "Delivered",
                type: "datetime",
                sortable: true
            },
            {
                key: "rtoDate",
                label: "RTO date",
                type: "datetime",
                sortable: true
            },
            {
                key: "prepaidDiscount",
                label: "Prepaid discount",
                type: "currency",
                sortable: true
            },
            {
                key: "advanceAmount",
                label: "Advance",
                type: "currency",
                sortable: true
            },
            {
                key: "splitSummary",
                label: "Line status",
                type: "lineStatus",
                width: 140,
                wrap: true,
                options: manualStatuses
            },
            {
                key: "weightIssue",
                label: "Warning",
                type: "status"
            },
            {
                key: "remarks",
                label: "Remarks",
                type: "remarks",
                width: 240
            },
            {
                key: "verification",
                label: "Verification",
                type: "status"
            },
            {
                key: "state",
                label: "State"
            },
            {
                key: "pincode",
                label: "Pincode",
                type: "mono"
            },
            {
                key: "district",
                label: "District",
                hidden: true
            },
            {
                key: "landHolding",
                label: "Land holding",
                hidden: true
            },
            {
                key: "season",
                label: "Season",
                hidden: true
            },
            {
                key: "crop",
                label: "Crop",
                hidden: true
            },
            {
                key: "soil",
                label: "Soil",
                hidden: true
            },
            {
                key: "water",
                label: "Water",
                hidden: true
            },
            {
                key: "callMain",
                label: "Call status",
                hidden: true
            },
            {
                key: "callAlt",
                label: "Alt. call",
                hidden: true
            },
            {
                key: "whatsappSent",
                label: "WhatsApp sent",
                hidden: true
            },
            {
                key: "smsSent",
                label: "SMS sent",
                hidden: true
            },
            {
                key: "processNote",
                label: "Process note",
                width: 220,
                wrap: true,
                hidden: true
            }
        ],
        rowActions: [
            {
                id: "remark",
                label: "Add remark",
                permission: "edit",
                effect: {
                    append: true
                },
                confirm: {
                    title: "Add a remark?",
                    description: "Saved on the order with your name and the time.",
                    requireReason: true
                }
            },
            {
                id: "responsible",
                label: "Set responsible",
                permission: "edit",
                assign: {
                    label: "Responsible party",
                    options: responsibleParties,
                    run: true
                },
                confirm: {
                    title: "Who is responsible?",
                    description: "Used for cancellation, RTO and rejection scoring."
                }
            },
            {
                id: "salesAgent",
                label: "Set sales agent",
                permission: "edit",
                adminOnly: true,
                assign: {
                    label: "Sales agent",
                    optionsFrom: "lookup:sales-agents",
                    run: true
                },
                confirm: {
                    title: "Credit this order to a sales agent?",
                    description: "Only a super admin can change the sales agent."
                }
            }
        ]
    },
    products: {
        title: "All Products",
        description: "Every product listing with pricing, stock and listing-economics verdict. Prices are derived from NRV on the server.",
        permission: "products",
        collection: "products",
        api: "GET /api/admin/products",
        search: "Search name, SKU, brand or vendor",
        searchFields: [
            "name",
            "sku",
            "brand",
            "vendor",
            "id",
            "uniqueId"
        ],
        filterFields: [
            "parentCategory",
            "stockStatus",
            "verdict",
            "vendorId"
        ],
        filters: [
            {
                key: "parentCategory",
                label: "Category",
                options: categories
            },
            {
                key: "stockStatus",
                label: "Stock",
                options: [
                    "In Stock",
                    "Low Stock",
                    "Out of Stock"
                ]
            },
            {
                key: "verdict",
                label: "Economics",
                options: [
                    {
                        value: "ok",
                        label: "Healthy"
                    },
                    {
                        value: "below_target",
                        label: "Below target CM"
                    },
                    {
                        value: "below_floor",
                        label: "Below floor CM"
                    },
                    {
                        value: "loss",
                        label: "Loss-making"
                    }
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Pending",
                "Draft / Rejected"
            ]
        },
        defaultSort: "updatedAt:desc",
        rowHref: "/admin/products/{id}",
        exportable: true,
        headerActions: [
            {
                label: "Bulk import",
                href: "/admin/products/import",
                permission: "products.import",
                action: "add"
            },
            {
                label: "Add product",
                href: "/admin/products/new",
                action: "add",
                primary: true
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
                label: "Product",
                width: 300,
                sub: "sku",
                href: "/admin/products/{id}"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 180
            },
            {
                key: "category",
                label: "Category",
                sub: "parentCategory"
            },
            {
                key: "mrp",
                label: "MRP",
                type: "currency",
                sortable: true
            },
            {
                key: "display",
                label: "Display price",
                type: "currency",
                sortable: true
            },
            {
                key: "nrv",
                label: "NRV",
                type: "currency",
                hidden: true
            },
            {
                key: "takeRate",
                label: "Take rate",
                type: "percent",
                hidden: true
            },
            {
                key: "gst",
                label: "GST %",
                type: "number"
            },
            {
                key: "hsn",
                label: "HSN"
            },
            {
                key: "commission",
                label: "Commission",
                type: "number",
                hidden: true
            },
            {
                key: "stock",
                label: "Stock",
                type: "number",
                sortable: true
            },
            {
                key: "verdict",
                label: "Economics",
                type: "status",
                labels: verdictLabels
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "updatedAt",
                label: "Updated",
                type: "date",
                sortable: true,
                hidden: true
            }
        ],
        rowActions: [
            {
                id: "deactivate",
                label: "Deactivate listing",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        statusCode: 2,
                        status: "Pending"
                    }
                },
                when: {
                    field: "statusCode",
                    in: [
                        1
                    ]
                },
                confirm: {
                    title: "Deactivate this listing?",
                    description: "It is hidden from the storefront and goes back to the approval queue.",
                    requireReason: true
                }
            }
        ]
    },
    inventory: {
        title: "Inventory",
        description: "Live and rejected listings (status 1, 3) by stock level: out of stock = 0, low = 1–9, in stock = 10+. Open a product to adjust stock with a reason.",
        permission: "products",
        collection: "products",
        baseFilter: {
            statusCode: [
                1,
                3
            ]
        },
        decorate: (p)=>({
                ...p,
                reorder: p.stock > 0 && p.stock < 50 ? "below50" : "ok"
            }),
        api: "vendor_product.product_stock → GET /api/admin/inventory",
        search: "Search name, SKU or vendor",
        searchFields: [
            "name",
            "sku",
            "vendor",
            "brand",
            "id"
        ],
        filterFields: [
            "parentCategory",
            "vendor",
            "reorder"
        ],
        filters: [
            {
                key: "parentCategory",
                label: "Category",
                options: categories
            },
            {
                key: "reorder",
                label: "Reorder alert",
                options: [
                    {
                        value: "below50",
                        label: "Below 50 units"
                    },
                    {
                        value: "ok",
                        label: "50 units or more / out"
                    }
                ]
            }
        ],
        tabs: {
            field: "stockStatus",
            values: [
                "Out of Stock",
                "Low Stock",
                "In Stock"
            ]
        },
        defaultSort: "stock:asc",
        rowHref: "/admin/products/{id}",
        exportable: true,
        headerActions: [
            {
                label: "Stock history",
                href: "/admin/inventory/history"
            }
        ],
        columns: [
            {
                key: "name",
                label: "Product",
                width: 300,
                sub: "sku"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 180
            },
            {
                key: "category",
                label: "Category",
                sub: "parentCategory"
            },
            {
                key: "stock",
                label: "Stock",
                type: "number",
                sortable: true,
                emphasis: true
            },
            {
                key: "stockStatus",
                label: "Level",
                type: "status"
            },
            {
                key: "display",
                label: "Display price",
                type: "currency",
                sortable: true
            },
            {
                key: "status",
                label: "Listing",
                type: "status"
            },
            {
                key: "updatedAt",
                label: "Updated",
                type: "date",
                sortable: true
            }
        ]
    },
    "inventory.history": {
        title: "Stock History",
        description: "Every stock change with before/after, source and reason. Manual adjustments always carry a reason.",
        permission: "products",
        collection: "stockMovements",
        api: "GET /api/admin/inventory/movements",
        search: "Search product, SKU, vendor or order",
        searchFields: [
            "product",
            "sku",
            "vendor",
            "reference",
            "actor"
        ],
        filterFields: [
            "type"
        ],
        filters: [
            {
                key: "type",
                label: "Source",
                options: [
                    "Order placed",
                    "Seller restock",
                    "Return received",
                    "Manual adjustment"
                ]
            }
        ],
        dateField: "at",
        dateRange: true,
        defaultSort: "at:desc",
        exportable: true,
        headerActions: [
            {
                label: "Inventory",
                href: "/admin/inventory"
            }
        ],
        columns: [
            {
                key: "at",
                label: "When",
                type: "datetime",
                sortable: true
            },
            {
                key: "product",
                label: "Product",
                width: 260,
                sub: "sku",
                href: "/admin/products/{productId}"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 160
            },
            {
                key: "type",
                label: "Source"
            },
            {
                key: "before",
                label: "Before",
                type: "number"
            },
            {
                key: "change",
                label: "Change",
                type: "number",
                emphasis: true
            },
            {
                key: "after",
                label: "After",
                type: "number"
            },
            {
                key: "reference",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{reference}"
            },
            {
                key: "reason",
                label: "Reason",
                wrap: true
            },
            {
                key: "actor",
                label: "By"
            }
        ]
    },
    "products.pending": {
        title: "Pending Products",
        description: "New and edited listings waiting for catalog approval. Approving makes the product live (status 1).",
        permission: "products.approval",
        collection: "products",
        baseFilter: {
            statusCode: [
                0,
                2
            ]
        },
        api: "GET /api/admin/products?status=pending · POST /api/admin/products/{id}/approve|reject",
        search: "Search name, SKU or vendor",
        searchFields: [
            "name",
            "sku",
            "vendor",
            "brand"
        ],
        filterFields: [
            "parentCategory",
            "verdict"
        ],
        filters: [
            {
                key: "parentCategory",
                label: "Category",
                options: categories
            },
            {
                key: "verdict",
                label: "Economics",
                options: [
                    {
                        value: "ok",
                        label: "Healthy"
                    },
                    {
                        value: "below_target",
                        label: "Below target CM"
                    },
                    {
                        value: "below_floor",
                        label: "Below floor CM"
                    },
                    {
                        value: "loss",
                        label: "Loss-making"
                    }
                ]
            }
        ],
        defaultSort: "createdAt:desc",
        rowHref: "/admin/products/{id}",
        columns: [
            {
                key: "image",
                label: "Image",
                type: "image"
            },
            {
                key: "name",
                label: "Name",
                width: 260,
                href: "/admin/products/{id}"
            },
            {
                key: "id",
                label: "Product ID",
                type: "mono"
            },
            {
                key: "sku",
                label: "SKU",
                type: "mono"
            },
            {
                key: "brand",
                label: "Brand"
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "description",
                label: "Description",
                wrap: true,
                width: 220
            },
            {
                key: "hsn",
                label: "HSN"
            },
            {
                key: "mrp",
                label: "MRP",
                type: "currency"
            },
            {
                key: "display",
                label: "Sale price",
                type: "currency"
            },
            {
                key: "stock",
                label: "Stock",
                type: "number"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 160
            },
            {
                key: "weight",
                label: "Weight"
            },
            {
                key: "dimensions",
                label: "Dimensions"
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
            }
        ],
        rowActions: [
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        statusCode: 1,
                        status: "Active"
                    }
                },
                confirm: {
                    title: "Approve product?",
                    description: "The product goes live on the storefront.",
                    confirmLabel: "Approve"
                }
            },
            {
                id: "reject",
                label: "Reject",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        statusCode: 3,
                        status: "Draft / Rejected"
                    }
                },
                confirm: {
                    title: "Reject product?",
                    description: "The vendor is notified with your reason and can edit and resubmit.",
                    requireReason: true
                }
            }
        ],
        bulkActions: [
            {
                id: "approve",
                label: "Approve selected",
                permission: "edit",
                effect: {
                    set: {
                        statusCode: 1,
                        status: "Active"
                    }
                },
                confirm: {
                    title: "Approve {count} products?",
                    description: "All selected products go live on the storefront.",
                    confirmLabel: "Approve"
                }
            }
        ]
    },
    vendors: {
        title: "All Vendors",
        description: "Sellers on the marketplace with KYC status, performance score and GMV.",
        permission: "vendors",
        collection: "vendors",
        api: "GET /api/admin/vendors",
        search: "Search firm, owner, GSTIN or ID",
        searchFields: [
            "name",
            "owner",
            "gstin",
            "id",
            "city"
        ],
        filterFields: [
            "kyc",
            "state"
        ],
        filters: [
            {
                key: "kyc",
                label: "KYC",
                options: [
                    "Verified",
                    "Submitted",
                    "Under Review",
                    "Documents Missing",
                    "Rejected"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Pending",
                "Suspended",
                "Rejected"
            ]
        },
        defaultSort: "gmv:desc",
        rowHref: "/admin/vendors/{id}",
        exportable: true,
        columns: [
            {
                key: "name",
                label: "Vendor",
                width: 240,
                sub: "id"
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "city",
                label: "City",
                sub: "state"
            },
            {
                key: "products",
                label: "Products",
                type: "number",
                sortable: true
            },
            {
                key: "orders",
                label: "Order lines",
                type: "number",
                sortable: true
            },
            {
                key: "gmv",
                label: "Delivered GMV",
                type: "currency",
                sortable: true
            },
            {
                key: "score",
                label: "Score",
                type: "number",
                sortable: true
            },
            {
                key: "kyc",
                label: "KYC",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "suspend",
                label: "Suspend vendor",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Suspended"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                },
                confirm: {
                    title: "Suspend vendor?",
                    description: "Their listings are hidden and payouts paused until reactivated.",
                    requireReason: true
                }
            },
            {
                id: "reactivate",
                label: "Reactivate",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Suspended"
                    ]
                },
                confirm: {
                    title: "Reactivate vendor?",
                    requireReason: true
                }
            },
            {
                id: "verifyBank",
                label: "Verify bank",
                permission: "edit",
                when: {
                    field: "kyc",
                    in: [
                        "Partial",
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Mark bank details approved?"
                }
            },
            {
                id: "verifyGst",
                label: "Verify GST",
                permission: "edit",
                when: {
                    field: "kyc",
                    in: [
                        "Partial",
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Mark GST certificate approved?"
                }
            },
            {
                id: "verifyPan",
                label: "Verify PAN",
                permission: "edit",
                when: {
                    field: "kyc",
                    in: [
                        "Partial",
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Mark PAN card approved?"
                }
            }
        ]
    },
    "vendors.scores": {
        title: "Top 10 Dashboard",
        description: "Vendor score = (fulfilment × 25 + dispatch × 20 + revenue × 20 + tenure × 15) / 80 − RTO/cancel penalty × 20%. Recomputed on the server.",
        permission: "vendors.scores",
        collection: "vendors",
        baseFilter: {
            status: [
                "Active"
            ]
        },
        api: "GET /api/admin/vendors/scores",
        search: "Search vendor",
        searchFields: [
            "name",
            "id"
        ],
        defaultSort: "score:desc",
        rowHref: "/admin/vendors/{id}",
        exportable: true,
        columns: [
            {
                key: "name",
                label: "Vendor",
                width: 240,
                sub: "id"
            },
            {
                key: "score",
                label: "Score",
                type: "number",
                sortable: true
            },
            {
                key: "orders",
                label: "Order lines",
                type: "number",
                sortable: true
            },
            {
                key: "gmv",
                label: "Delivered GMV",
                type: "currency",
                sortable: true
            },
            {
                key: "dispatchSlaHours",
                label: "Dispatch SLA (h)",
                type: "number"
            },
            {
                key: "city",
                label: "City"
            }
        ]
    },
    customers: {
        title: "Manage All User",
        description: "App users with login method, order count, land holding and account status.",
        permission: "customers",
        collection: "customers",
        api: "GET /api/admin/customers",
        search: "Search name, mobile, email or ID",
        searchFields: [
            "name",
            "mobile",
            "email",
            "id",
            "userId",
            "city"
        ],
        filterFields: [
            "loginMethod",
            "state"
        ],
        filters: [
            {
                key: "loginMethod",
                label: "Login",
                options: [
                    {
                        value: "general",
                        label: "General"
                    },
                    {
                        value: "guest",
                        label: "Guest"
                    },
                    {
                        value: "google",
                        label: "Google"
                    },
                    {
                        value: "facebook",
                        label: "Facebook"
                    },
                    {
                        value: "Model Login",
                        label: "Model Login"
                    }
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Inactive",
                "Blocked"
            ]
        },
        defaultSort: "createdAt:desc",
        rowHref: "/admin/customers/{id}",
        exportable: true,
        columns: [
            {
                key: "name",
                label: "Name",
                sub: "userId"
            },
            {
                key: "mobile",
                label: "Phone",
                type: "mobile"
            },
            {
                key: "loginMethod",
                label: "Login Method"
            },
            {
                key: "createdBy",
                label: "Created By"
            },
            {
                key: "orders",
                label: "No of Orders",
                type: "number",
                sortable: true
            },
            {
                key: "email",
                label: "Email"
            },
            {
                key: "landValue",
                label: "Land Value"
            },
            {
                key: "landUnit",
                label: "Land Unit"
            },
            {
                key: "city",
                label: "City",
                sub: "state"
            },
            {
                key: "createdAt",
                label: "Created Date",
                type: "datetime",
                sortable: true
            },
            {
                key: "lifetimeValue",
                label: "Lifetime value",
                type: "currency",
                sortable: true
            },
            {
                key: "walletBalance",
                label: "Wallet",
                type: "currency"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "block",
                label: "Block customer",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Blocked"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                },
                confirm: {
                    title: "Block customer?",
                    description: "They will not be able to log in or place orders.",
                    requireReason: true
                }
            },
            {
                id: "deactivate",
                label: "Mark inactive",
                permission: "edit",
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                },
                confirm: {
                    title: "Mark this customer inactive?"
                }
            },
            {
                id: "unblock",
                label: "Unblock",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Blocked",
                        "Inactive"
                    ]
                },
                confirm: {
                    title: "Activate customer?",
                    requireReason: true
                }
            }
        ]
    },
    shipping: {
        title: "Shipping Queue",
        description: "Vendor shipments by order line. Ready-to-ship lines need a courier booking (NimbusPost primary, Shiprocket/Delhivery fallback).",
        permission: "shipping",
        collection: "shipments",
        api: "GET /api/admin/shipments",
        search: "Search order, AWB, vendor or pincode",
        searchFields: [
            "orderId",
            "awb",
            "vendor",
            "customer",
            "pincode"
        ],
        filterFields: [
            "courier",
            "paymentMode",
            "zone"
        ],
        filters: [
            {
                key: "courier",
                label: "Courier",
                options: couriers
            },
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Ready to Ship",
                "Pending Pickup",
                "Shipped",
                "In Transit",
                "Out for Delivery",
                "Delivered",
                "Undelivered",
                "RTO"
            ]
        },
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 200
            },
            {
                key: "customer",
                label: "Customer",
                sub: "pincode"
            },
            {
                key: "zone",
                label: "Zone"
            },
            {
                key: "weightKg",
                label: "Weight (kg)",
                type: "number"
            },
            {
                key: "collectAmount",
                label: "COD collect",
                type: "currency"
            },
            {
                key: "courier",
                label: "Courier",
                sub: "awb"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "slaDue",
                label: "Dispatch SLA",
                type: "datetime",
                sortable: true
            }
        ]
    },
    returns: {
        title: "Returns",
        description: "Customer return requests per order line. Refund = item price + GST (+ shipping if refunded) − platform fee if deducted, computed on the server.",
        permission: "returns",
        collection: "returns",
        api: "GET /api/admin/returns",
        search: "Search return, order, product or customer",
        searchFields: [
            "returnId",
            "orderId",
            "product",
            "customer",
            "vendor",
            "mobile",
            "trackingId"
        ],
        filterFields: [
            "reason",
            "paymentMode"
        ],
        filters: [
            {
                key: "reason",
                label: "Reason",
                options: [
                    "Wrong Product",
                    "Damaged in Transit",
                    "Customer Didn't Like",
                    "Exchange Requested",
                    "Quality Issue",
                    "Other"
                ]
            },
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Awaiting Pickup",
                "In Transit",
                "Received",
                "Refunded",
                "Replacement Shipped",
                "Completed",
                "Rejected"
            ]
        },
        dateField: "createdAt",
        dateRange: "Requested",
        defaultSort: "createdAt:desc",
        rowHref: "/admin/returns/{id}",
        exportable: true,
        columns: [
            {
                key: "returnId",
                label: "Return",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "product",
                label: "Product",
                width: 240
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mono"
            },
            // In the CSV export like the PHP grid's Payment column; shown from "Columns".
            {
                key: "paymentMode",
                label: "Payment",
                hidden: true
            },
            {
                key: "reason",
                label: "Reason"
            },
            {
                key: "refundAmount",
                label: "Refund",
                type: "currency",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "trackingId",
                label: "AWB / Tracking",
                type: "mono"
            },
            {
                key: "createdAt",
                label: "Requested",
                type: "datetime",
                sortable: true
            }
        ],
        // The manage_returns.php grid "Actions" menu.
        rowActions: [
            {
                id: "process",
                label: "Process Return/Refund",
                href: "/admin/returns/{id}",
                permission: "view"
            },
            {
                id: "shipment",
                label: "Create Return Shipment",
                href: "/admin/returns/{id}?shipment=1",
                permission: "edit",
                when: {
                    field: "status",
                    in: [
                        "Pending",
                        "Awaiting Pickup"
                    ]
                }
            }
        ],
        bulkActions: [
            {
                id: "approve",
                label: "Bulk approve",
                permission: "edit",
                confirm: {
                    title: "Approve the selected returns?",
                    description: "Pending returns among the {count} selected move to Awaiting Pickup. Others are skipped.",
                    confirmLabel: "Approve"
                }
            },
            {
                id: "picked",
                label: "Bulk mark as picked",
                permission: "edit",
                confirm: {
                    title: "Mark the selected returns as picked?",
                    description: "Returns awaiting pickup among the {count} selected move to In Transit with today's pickup date. Others are skipped.",
                    confirmLabel: "Mark as picked"
                }
            }
        ]
    },
    refunds: {
        title: "Refunds",
        description: "Razorpay refunds for prepaid orders and manual bank transfers for COD returns.",
        permission: "refunds",
        collection: "refunds",
        api: "GET /api/admin/refunds",
        search: "Search refund, return, order or customer",
        searchFields: [
            "id",
            "returnId",
            "orderId",
            "customer"
        ],
        filterFields: [
            "method"
        ],
        filters: [
            {
                key: "method",
                label: "Method",
                options: [
                    "Razorpay refund",
                    "Bank transfer (manual)"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Initiated",
                "Pending Manual Transfer",
                "Processed"
            ]
        },
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "id",
                label: "Refund",
                type: "mono"
            },
            {
                key: "returnId",
                label: "Return",
                type: "mono",
                href: "/admin/returns/{returnId}"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "amount",
                label: "Amount",
                type: "currency",
                sortable: true
            },
            {
                key: "method",
                label: "Method"
            },
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
        rowActions: [
            {
                id: "processed",
                label: "Mark transfer done",
                permission: "edit",
                effect: {
                    set: {
                        status: "Processed"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending Manual Transfer"
                    ]
                },
                confirm: {
                    title: "Confirm bank transfer completed?",
                    description: "Enter the bank UTR / reference in the reason. This is recorded in the audit log.",
                    requireReason: true,
                    confirmLabel: "Mark processed"
                }
            }
        ]
    },
    rto: {
        title: "RTO",
        description: "Return-to-origin shipments. Forward + reverse shipping is booked to the RTO ledger when the parcel reaches the vendor.",
        permission: "rto",
        collection: "rto",
        api: "GET /api/admin/rto",
        search: "Search order, AWB, vendor",
        searchFields: [
            "orderId",
            "awb",
            "vendor",
            "customer",
            "product"
        ],
        filterFields: [
            "courier",
            "reason",
            "paymentMode"
        ],
        filters: [
            {
                key: "courier",
                label: "Courier",
                options: couriers
            },
            {
                key: "reason",
                label: "Reason",
                options: [
                    "Customer refused",
                    "Address not found",
                    "Customer not reachable",
                    "COD amount not ready",
                    "Fake order"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "RTO In Transit",
                "RTO Delivered"
            ]
        },
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "product",
                label: "Product",
                width: 220
            },
            {
                key: "vendor",
                label: "Vendor"
            },
            {
                key: "courier",
                label: "Courier",
                sub: "awb"
            },
            {
                key: "reason",
                label: "Reason"
            },
            {
                key: "value",
                label: "Value",
                type: "currency"
            },
            {
                key: "forwardShipping",
                label: "Fwd ship",
                type: "currency"
            },
            {
                key: "reverseShipping",
                label: "Rev ship",
                type: "currency"
            },
            {
                key: "ledgerRecorded",
                label: "Ledger",
                type: "boolean",
                trueLabel: "Recorded",
                falseLabel: "Pending"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "ledger",
                label: "Record in RTO ledger",
                permission: "edit",
                effect: {
                    set: {
                        ledgerRecorded: true
                    }
                },
                when: {
                    field: "ledgerRecorded",
                    in: [
                        false
                    ]
                },
                confirm: {
                    title: "Record RTO cost?",
                    description: "Forward and reverse shipping are booked as an RTO expense (idempotent per AWB on the server)."
                }
            }
        ]
    },
    payouts: {
        title: "Payout Cycles",
        description: "Vendor payouts grouped by cycle (1st–15th, 16th–month end). Paid only after a transaction ID and proof are recorded.",
        permission: "payouts",
        collection: "payouts",
        api: "GET /api/payout/* → /api/admin/payouts",
        search: "Search payout, vendor or UTR",
        searchFields: [
            "id",
            "vendor",
            "vendorId",
            "transactionId"
        ],
        filterFields: [
            "cycle"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "On Hold",
                "Paid"
            ]
        },
        defaultSort: "cycleIndex:desc",
        rowHref: "/admin/payouts/{id}",
        exportable: true,
        columns: [
            {
                key: "id",
                label: "Payout",
                type: "mono"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 220,
                sub: "vendorId"
            },
            {
                key: "cycle",
                label: "Cycle"
            },
            {
                key: "items",
                label: "Lines",
                type: "number"
            },
            {
                key: "gross",
                label: "Gross",
                type: "currency"
            },
            {
                key: "tcs",
                label: "TCS",
                type: "currency"
            },
            {
                key: "bsa",
                label: "Payable (BSA)",
                type: "currency",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "transactionId",
                label: "UTR",
                type: "mono"
            }
        ]
    },
    support: {
        title: "Support Tickets",
        description: "Customer and vendor helpdesk. SLA depends on priority and category; internal notes are never shown to the requester.",
        permission: "support",
        collection: "tickets",
        api: "GET /api/admin/support/tickets",
        search: "Search ticket, subject, requester or order",
        searchFields: [
            "id",
            "subject",
            "user",
            "orderId"
        ],
        filterFields: [
            "userType",
            "priority",
            "department",
            "category"
        ],
        filters: [
            {
                key: "userType",
                label: "Requester",
                options: [
                    {
                        value: "customer",
                        label: "Customer"
                    },
                    {
                        value: "vendor",
                        label: "Vendor"
                    }
                ]
            },
            {
                key: "priority",
                label: "Priority",
                options: [
                    "Urgent",
                    "Normal"
                ]
            },
            {
                key: "department",
                label: "Department",
                options: [
                    "Finance",
                    "Logistics",
                    "Tech",
                    "Vendor Support",
                    "Unassigned"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Open",
                "In-Progress",
                "Awaiting Response",
                "Resolved",
                "Closed",
                "Rejected"
            ]
        },
        defaultSort: "createdAt:desc",
        rowHref: "/admin/support/{id}",
        // Same columns as the PHP grid (support/admin_dashboard.php); SLA due turns red once overdue.
        columns: [
            {
                key: "id",
                label: "ID",
                type: "mono",
                sortable: true
            },
            {
                key: "userType",
                label: "Type",
                type: "status",
                labels: {
                    Seller: "Vendor"
                }
            },
            {
                key: "subject",
                label: "Subject",
                width: 260,
                emphasis: true
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "priority",
                label: "Priority",
                type: "status"
            },
            {
                key: "slaDeadline",
                label: "SLA Due",
                type: "datetime",
                sortable: true,
                dangerKey: "slaOverdue"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "user",
                label: "Requester",
                hidden: true
            },
            {
                key: "department",
                label: "Department",
                hidden: true
            },
            {
                key: "createdAt",
                label: "Created",
                type: "datetime",
                sortable: true,
                hidden: true
            }
        ]
    },
    "crm.followUps": {
        title: "Follow-ups",
        description: "Leads with a scheduled follow-up, most overdue first. Executives see only their own.",
        permission: "crm.leads",
        collection: "leads",
        ownerField: "assignedTo",
        baseFilter: (row)=>Boolean(row.nextFollowUp),
        api: "GET /api/crm_leads/followups",
        search: "Search name, mobile or crop",
        searchFields: [
            "name",
            "mobile",
            "crop"
        ],
        filterFields: [
            "assignedTo",
            "priority",
            "due"
        ],
        filters: [
            {
                key: "due",
                label: "Due",
                options: [
                    {
                        value: "overdue",
                        label: "Overdue"
                    },
                    {
                        value: "upcoming",
                        label: "Upcoming"
                    }
                ]
            },
            {
                key: "priority",
                label: "Priority",
                options: [
                    "Hot",
                    "Warm",
                    "Cold"
                ]
            }
        ],
        decorate: (row)=>({
                ...row,
                due: new Date(row.nextFollowUp).getTime() <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2f$admin$2f$seed$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NOW"] ? "overdue" : "upcoming"
            }),
        defaultSort: "nextFollowUp:asc",
        rowHref: "/admin/crm/leads/{id}",
        columns: [
            {
                key: "name",
                label: "Lead",
                sub: "id"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mobile"
            },
            {
                key: "crop",
                label: "Crop"
            },
            {
                key: "priority",
                label: "Priority",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "assignedTo",
                label: "Executive"
            },
            {
                key: "due",
                label: "Due",
                type: "status",
                labels: {
                    overdue: "Overdue",
                    upcoming: "Upcoming"
                }
            },
            {
                key: "nextFollowUp",
                label: "Follow-up at",
                type: "datetime",
                sortable: true
            }
        ]
    }
};
}),
"[project]/src/lib/content/admin/resources/catalog.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "catalogResources",
    ()=>catalogResources
]);
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
const masterStatus = [
    "Pending",
    "Active",
    "Deactive"
];
const IMAGE = "image/png,image/jpeg,image/jpg,image/gif,image/webp";
const catalogResources = {
    "catalog.categories": {
        title: "Category",
        description: "One level at a time: View sub category opens the children. Categories with products are deleted after moving their products to another category.",
        permission: "catalog.categories",
        search: "Search category",
        searchFields: [
            "name",
            "slug"
        ],
        defaultSort: "order:asc",
        headerActions: [
            {
                href: "/admin/catalog/categories/pending",
                label: "Pending Category"
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
                key: "name",
                label: "Category",
                sortable: true,
                emphasis: true,
                sub: "slug"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "children",
                label: "Sub categories",
                type: "number"
            },
            {
                key: "products",
                label: "Products",
                type: "number",
                sortable: true
            },
            {
                key: "commissionFees",
                label: "Commission %",
                type: "number",
                hidden: true
            },
            {
                key: "gst",
                label: "GST %",
                type: "number",
                hidden: true
            },
            {
                key: "createdAt",
                label: "Created",
                type: "date",
                hidden: true
            }
        ],
        rowActions: [
            {
                id: "children",
                label: "View sub category",
                permission: "view",
                href: "/admin/catalog/categories?parentId={id}",
                when: {
                    field: "children",
                    notIn: [
                        0
                    ]
                }
            },
            {
                id: "commission",
                label: "Commission (Add/View)",
                permission: "view",
                href: "/admin/catalog/category-commission?categoryId={id}"
            },
            {
                id: "timeline",
                label: "View History",
                permission: "view",
                href: "/admin/catalog/categories/timeline?categoryId={id}"
            },
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            {
                ...deleteAction,
                when: {
                    field: "products",
                    in: [
                        0
                    ]
                }
            },
            {
                id: "reassign",
                label: "Assign products & delete",
                permission: "delete",
                tone: "danger",
                when: {
                    field: "products",
                    notIn: [
                        0
                    ]
                },
                assign: {
                    label: "Assign the products to",
                    optionsFrom: "lookup:categories",
                    run: true
                },
                confirm: {
                    title: "Assign Category",
                    description: "This category has products. Choose the category they move to; then it is deleted."
                }
            }
        ],
        form: {
            title: "Category",
            fields: [
                {
                    name: "parentId",
                    label: "Parent category",
                    type: "select",
                    optionsFrom: "lookup:categories",
                    options: [
                        {
                            value: "0",
                            label: "— Make it a parent category —"
                        }
                    ],
                    fromQuery: "parentId",
                    default: "0",
                    required: true,
                    only: "new"
                },
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 0,
                    only: "edit"
                },
                {
                    name: "name",
                    label: "Category Name",
                    type: "text",
                    required: true,
                    maxLength: 80
                },
                {
                    name: "commissionFees",
                    label: "Commission",
                    type: "number",
                    min: 0,
                    max: 100
                },
                {
                    name: "gst",
                    label: "GST",
                    type: "number",
                    min: 0,
                    max: 100
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: [
                        "Active",
                        "Inactive",
                        "Pending"
                    ],
                    required: true,
                    only: "edit"
                },
                {
                    name: "image",
                    label: "Image",
                    type: "file",
                    accept: IMAGE,
                    maxBytes: 5 * 1024 * 1024
                },
                {
                    name: "adImage",
                    label: "Advertisement Image",
                    type: "file",
                    accept: IMAGE,
                    maxBytes: 5 * 1024 * 1024,
                    only: "edit"
                },
                {
                    name: "adLink",
                    label: "Advertisement Link",
                    type: "text",
                    maxLength: 500,
                    only: "edit"
                },
                {
                    name: "metaTitle",
                    label: "Meta Title",
                    type: "text",
                    maxLength: 500
                },
                {
                    name: "metaDescription",
                    label: "Meta Description",
                    type: "text",
                    maxLength: 2000
                },
                {
                    name: "metaKeywords",
                    label: "Meta Keywords",
                    type: "text",
                    maxLength: 2000
                },
                {
                    name: "pageDescription",
                    label: "Page Description",
                    type: "html"
                }
            ]
        }
    },
    "catalog.brands": {
        title: "Brand",
        description: "Brands with SEO details. Brands used by products are deleted after moving their products to another brand.",
        permission: "catalog.brands",
        search: "Search brand",
        searchFields: [
            "name",
            "slug"
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Deactive"
            ]
        },
        filters: [
            {
                key: "popularLabel",
                label: "Popular",
                options: [
                    "Yes",
                    "No"
                ]
            }
        ],
        defaultSort: "name:asc",
        headerActions: [
            {
                href: "/admin/catalog/brands/pending",
                label: "Pending Brand"
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
                key: "name",
                label: "Brand Name",
                sortable: true,
                emphasis: true,
                sub: "slug"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "popular",
                label: "Popular",
                type: "boolean"
            },
            {
                key: "products",
                label: "Products",
                type: "number",
                sortable: true
            },
            {
                key: "siteUrl",
                label: "Website",
                hidden: true
            },
            {
                key: "metaTitle",
                label: "Meta Title",
                hidden: true
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
                ...deleteAction,
                when: {
                    field: "products",
                    in: [
                        0
                    ]
                }
            },
            {
                id: "reassign",
                label: "Assign products & delete",
                permission: "delete",
                tone: "danger",
                when: {
                    field: "products",
                    notIn: [
                        0
                    ]
                },
                assign: {
                    label: "Assign the products to",
                    optionsFrom: "lookup:brands",
                    run: true
                },
                confirm: {
                    title: "Assign Brand",
                    description: "This brand is used by products. Choose the brand they move to; then it is deleted."
                }
            }
        ],
        form: {
            title: "Brand",
            fields: [
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 0,
                    only: "edit"
                },
                {
                    name: "name",
                    label: "Brand Name",
                    type: "text",
                    required: true,
                    maxLength: 100
                },
                {
                    name: "nameAr",
                    label: "Brand Name (Arabic)",
                    type: "text",
                    maxLength: 100
                },
                {
                    name: "siteUrl",
                    label: "Website Link",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: masterStatus,
                    required: true,
                    only: "edit"
                },
                {
                    name: "popular",
                    label: "Popular Brand",
                    type: "checkbox"
                },
                {
                    name: "image",
                    label: "Brand Image",
                    type: "file",
                    accept: IMAGE,
                    maxBytes: 5 * 1024 * 1024,
                    required: true
                },
                {
                    name: "slug",
                    label: "Brand Slug (URL)",
                    type: "text",
                    maxLength: 255,
                    hint: "Leave empty to build it from the name."
                },
                {
                    name: "description",
                    label: "Brand Description",
                    type: "textarea",
                    rows: 5,
                    maxLength: 20000
                },
                {
                    name: "metaTitle",
                    label: "Meta Title",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "metaDescription",
                    label: "Meta Description",
                    type: "textarea",
                    rows: 3,
                    maxLength: 5000
                },
                {
                    name: "metaKeywords",
                    label: "Meta Keywords",
                    type: "text",
                    maxLength: 2000
                },
                {
                    name: "manufacturingLocation",
                    label: "Manufacturing Location",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "certifications",
                    label: "Certifications",
                    type: "textarea",
                    rows: 3,
                    maxLength: 5000
                },
                {
                    name: "cropsCovered",
                    label: "Crops Covered",
                    type: "textarea",
                    rows: 3,
                    maxLength: 5000
                },
                {
                    name: "whyChoose",
                    label: "Why Choose This Brand",
                    type: "textarea",
                    rows: 4,
                    maxLength: 5000
                }
            ]
        }
    },
    "catalog.attributes": {
        title: "Configuration Attributes",
        description: "Attributes used for product variants. View lists an attribute's values.",
        permission: "catalog.attributes",
        search: "Search attribute",
        searchFields: [
            "name",
            "values"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Active"
            ]
        },
        defaultSort: "name:asc",
        headerActions: [
            {
                href: "/admin/catalog/attributes/pending",
                label: "Pending Attributes"
            },
            {
                href: "/admin/catalog/attribute-sets/pending",
                label: "Pending Attribute Sets"
            }
        ],
        columns: [
            {
                key: "name",
                label: "Attributes",
                emphasis: true,
                sortable: true
            },
            {
                key: "values",
                label: "Values",
                wrap: true,
                width: 320
            },
            {
                key: "valueCount",
                label: "No. of values",
                type: "number",
                sortable: true
            },
            {
                key: "products",
                label: "Products",
                type: "number",
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
                id: "values",
                label: "View",
                permission: "view",
                href: "/admin/catalog/attribute-values?attributeId={id}"
            },
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    run: "approve"
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                }
            },
            deleteAction
        ],
        form: {
            title: "Attribute",
            fields: [
                {
                    name: "name",
                    label: "Attributes",
                    type: "text",
                    required: true,
                    maxLength: 200
                },
                {
                    name: "nameAr",
                    label: "Attributes (Arabic)",
                    type: "text",
                    maxLength: 255
                }
            ]
        }
    },
    "catalog.tax": {
        title: "Tax Class",
        description: "Active and deactivated tax classes. Seller requests wait under Pending Tax Class.",
        permission: "catalog.tax",
        search: "Search tax label",
        searchFields: [
            "name"
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Deactive"
            ]
        },
        defaultSort: "rate:asc",
        headerActions: [
            {
                href: "/admin/catalog/tax-classes/pending",
                label: "Pending Tax Class"
            }
        ],
        columns: [
            {
                key: "name",
                label: "Tax Label",
                emphasis: true,
                sortable: true
            },
            {
                key: "rate",
                label: "Tax Class (%)",
                type: "number",
                sortable: true
            },
            {
                key: "products",
                label: "Seller offers",
                type: "number"
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
                ...deleteAction,
                confirm: {
                    title: "Delete this tax class?",
                    description: "Seller offers using it are reset to no tax class."
                }
            }
        ],
        form: {
            title: "Tax Class",
            fields: [
                {
                    name: "name",
                    label: "Tax Label",
                    type: "text",
                    required: true,
                    maxLength: 50
                },
                {
                    name: "rate",
                    label: "Tax Class (%)",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 100
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: masterStatus,
                    required: true,
                    only: "edit"
                }
            ]
        }
    },
    "catalog.hsn": {
        title: "HSN Code",
        description: "HSN codes sellers can pick. A code used by a product cannot be deleted.",
        permission: "catalog.hsn",
        search: "Search HSN code",
        searchFields: [
            "code"
        ],
        defaultSort: "id:asc",
        columns: [
            {
                key: "code",
                label: "HSN Code",
                type: "mono",
                sortable: true,
                emphasis: true
            },
            {
                key: "products",
                label: "Products",
                type: "number"
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
            deleteAction
        ],
        form: {
            title: "HSN Code",
            fields: [
                {
                    name: "code",
                    label: "HSN Code",
                    type: "text",
                    required: true,
                    pattern: "^[0-9]+$",
                    patternMessage: "Digits only."
                }
            ]
        }
    },
    "catalog.returnPolicies": {
        title: "Return Policy",
        description: "Active and deactivated return policies. Seller requests wait under Pending Return Policy.",
        permission: "catalog.returnPolicies",
        search: "Search policy",
        searchFields: [
            "name",
            "policy"
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Deactive"
            ]
        },
        defaultSort: "name:asc",
        headerActions: [
            {
                href: "/admin/catalog/return-policies/pending",
                label: "Pending Return Policy"
            }
        ],
        columns: [
            {
                key: "name",
                label: "Return Policy",
                emphasis: true,
                sortable: true
            },
            {
                key: "validityDays",
                label: "Validity(Days)",
                type: "number",
                sortable: true
            },
            {
                key: "type",
                label: "Type Accepted"
            },
            {
                key: "products",
                label: "Products",
                type: "number"
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
                ...deleteAction,
                confirm: {
                    title: "Delete this return policy?",
                    description: "Products using it are left without a return policy."
                }
            }
        ],
        form: {
            title: "Return Policy",
            fields: [
                {
                    name: "name",
                    label: "Policy title",
                    type: "text",
                    required: true,
                    maxLength: 500
                },
                {
                    name: "validityDays",
                    label: "Validity(Days)",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 3650
                },
                {
                    name: "refundAllowed",
                    label: "Refund",
                    type: "checkbox"
                },
                {
                    name: "replaceAllowed",
                    label: "Replace",
                    type: "checkbox"
                },
                {
                    name: "exchangeAllowed",
                    label: "Exchange",
                    type: "checkbox"
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: masterStatus,
                    required: true,
                    only: "edit"
                },
                {
                    name: "policy",
                    label: "Policy content",
                    type: "html"
                }
            ]
        }
    },
    "pricing.masterNrv": {
        title: "Master NRV",
        description: "Net receivable values imported from the master sheet. Selling prices are derived from NRV on the server.",
        permission: "pricing.masterNrv",
        collection: "masterNrv",
        api: "GET /api/admin/pricing/master-nrv · POST /api/admin/pricing/master-nrv/import",
        search: "Search SKU, product or vendor",
        searchFields: [
            "sku",
            "product",
            "vendor"
        ],
        defaultSort: "effectiveFrom:desc",
        dateField: "effectiveFrom",
        exportable: true,
        columns: [
            {
                key: "sku",
                label: "SKU",
                type: "mono",
                sortable: true
            },
            {
                key: "product",
                label: "Product",
                width: 300,
                emphasis: true,
                sub: "vendor"
            },
            {
                key: "nrv",
                label: "NRV",
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
                key: "effectiveFrom",
                label: "Effective from",
                type: "date",
                sortable: true
            },
            {
                key: "uploadedBy",
                label: "Uploaded by"
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit NRV",
                kind: "form",
                permission: "edit",
                sensitive: true
            }
        ],
        form: {
            fields: [
                {
                    name: "nrv",
                    label: "NRV (₹)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "mrp",
                    label: "MRP (₹)",
                    type: "number",
                    required: true,
                    min: 301
                }
            ],
            requireReason: true
        }
    },
    "pricing.commission": {
        title: "Seller Commission",
        description: "Price-range commission rules. Seller-specific beats general; exact category beats list; if ad + office + profit > 0 the commission is their sum.",
        permission: "pricing.commission",
        collection: "commissionRules",
        api: "GET /api/admin/pricing/commission-rules",
        search: "Search category or seller",
        searchFields: [
            "category",
            "seller"
        ],
        filterFields: [
            "seller"
        ],
        defaultSort: "priceFrom:asc",
        columns: [
            {
                key: "priceFrom",
                label: "Price from",
                type: "currency",
                sortable: true
            },
            {
                key: "priceTo",
                label: "Price to",
                type: "currency"
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "seller",
                label: "Seller"
            },
            {
                key: "commission",
                label: "Commission %",
                type: "percent",
                sortable: true
            },
            {
                key: "adExpense",
                label: "Ad %",
                type: "percent"
            },
            {
                key: "officeExpense",
                label: "Office %",
                type: "percent"
            },
            {
                key: "profit",
                label: "Profit %",
                type: "percent"
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
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "priceFrom",
                    label: "Price from (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "priceTo",
                    label: "Price to (₹)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "category",
                    label: "Category",
                    type: "text",
                    required: true
                },
                {
                    name: "seller",
                    label: "Seller (blank = General)",
                    type: "text"
                },
                {
                    name: "commission",
                    label: "Commission %",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 60
                },
                {
                    name: "adExpense",
                    label: "Ad expense %",
                    type: "number",
                    min: 0,
                    max: 30
                },
                {
                    name: "officeExpense",
                    label: "Office expense %",
                    type: "number",
                    min: 0,
                    max: 30
                },
                {
                    name: "profit",
                    label: "Profit %",
                    type: "number",
                    min: 0,
                    max: 40
                }
            ],
            defaults: {
                status: "Active",
                seller: "General",
                adExpense: 0,
                officeExpense: 0,
                profit: 0
            },
            requireReason: true
        }
    },
    "pricing.costConfig": {
        title: "Listing Economics",
        description: "Contribution guard-rails resolved product → seller → category → global. Listings below floor only show a warning.",
        permission: "pricing.costConfig",
        collection: "costConfig",
        api: "GET /api/admin/pricing/cost-config",
        searchFields: [
            "target",
            "scope"
        ],
        filterFields: [
            "scope"
        ],
        filters: [
            {
                key: "scope",
                label: "Scope",
                options: [
                    "Global",
                    "Category",
                    "Seller",
                    "Product"
                ]
            }
        ],
        columns: [
            {
                key: "scope",
                label: "Scope",
                type: "status"
            },
            {
                key: "target",
                label: "Applies to",
                emphasis: true
            },
            {
                key: "takeRateMin",
                label: "Take rate min",
                type: "percent"
            },
            {
                key: "takeRateMax",
                label: "Take rate max",
                type: "percent"
            },
            {
                key: "floorPct",
                label: "Floor CM",
                type: "percent"
            },
            {
                key: "targetPct",
                label: "Target CM",
                type: "percent"
            },
            {
                key: "marketingPct",
                label: "Marketing",
                type: "percent"
            },
            {
                key: "packagingPct",
                label: "Packaging",
                type: "percent"
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "takeRateMin",
                    label: "Take rate min %",
                    type: "number",
                    min: 25,
                    max: 45,
                    required: true
                },
                {
                    name: "takeRateMax",
                    label: "Take rate max %",
                    type: "number",
                    min: 25,
                    max: 45,
                    required: true
                },
                {
                    name: "floorPct",
                    label: "Floor contribution %",
                    type: "number",
                    min: 0,
                    max: 30,
                    required: true
                },
                {
                    name: "targetPct",
                    label: "Target contribution %",
                    type: "number",
                    min: 0,
                    max: 30,
                    required: true
                }
            ],
            requireReason: true
        }
    }
};
}),
"[project]/src/lib/content/admin/resources/orders.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orderResources",
    ()=>orderResources
]);
const deleteAction = {
    id: "delete",
    label: "Delete",
    permission: "delete",
    tone: "danger",
    effect: {
        remove: true
    },
    confirm: {
        title: "Delete permanently?",
        description: "This cannot be undone."
    }
};
const activeToggle = [
    {
        id: "activate",
        label: "Activate",
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
        id: "deactivate",
        label: "Deactivate",
        permission: "edit",
        tone: "danger",
        effect: {
            set: {
                status: "Inactive"
            }
        },
        when: {
            field: "status",
            in: [
                "Active"
            ]
        },
        confirm: {
            title: "Deactivate?",
            description: "The rule stops applying at checkout immediately."
        }
    }
];
const zones = [
    "within_city",
    "within_state",
    "metro_to_metro",
    "rest_of_india",
    "north_east_jk"
];
const orderResources = {
    "orders.invoices": {
        title: "Invoices",
        description: "Seller invoices (INV-…) per order line and the platform invoice (BAL-{FY}-…). PDFs are generated on the server after a login and Orders permission check.",
        permission: "orders.invoices",
        collection: "orderItems",
        api: "GET /api/admin/invoices · GET /api/admin/invoices/{id}/pdf",
        search: "Search invoice, order ID or vendor",
        searchFields: [
            "sellerInvoice",
            "platformInvoice",
            "orderId",
            "vendor",
            "customer"
        ],
        filterFields: [
            "paymentMode"
        ],
        filters: [
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            }
        ],
        dateField: "createdAt",
        dateRange: "Invoice date",
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "sellerInvoice",
                label: "Seller invoice",
                type: "mono"
            },
            {
                key: "platformInvoice",
                label: "Platform invoice",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 200
            },
            {
                key: "taxable",
                label: "Taxable",
                type: "currency",
                sortable: true
            },
            {
                key: "cgst",
                label: "CGST",
                type: "currency"
            },
            {
                key: "sgst",
                label: "SGST",
                type: "currency"
            },
            {
                key: "igst",
                label: "IGST",
                type: "currency"
            },
            {
                key: "price",
                label: "Total",
                type: "currency",
                sortable: true
            },
            {
                key: "createdAt",
                label: "Date",
                type: "date",
                sortable: true
            }
        ]
    },
    "orders.transactions": {
        title: "Date-wise Transactions",
        description: "Every order line with its tax, commission and seller settlement split, for reconciliation.",
        permission: "orders.transactions",
        collection: "orderItems",
        api: "GET /api/admin/reports/transactions",
        search: "Search order, vendor or SKU",
        searchFields: [
            "orderId",
            "vendor",
            "sku",
            "productName"
        ],
        filterFields: [
            "status",
            "paymentMode"
        ],
        filters: [
            {
                key: "status",
                label: "Status",
                options: [
                    "Delivered",
                    "In Transit",
                    "RTO",
                    "Cancelled",
                    "Return Completed"
                ]
            },
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            }
        ],
        dateField: "createdAt",
        dateRange: "Order date",
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "createdAt",
                label: "Date",
                type: "date",
                sortable: true
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "productName",
                label: "Product",
                width: 240,
                sub: "vendor"
            },
            {
                key: "qty",
                label: "Qty",
                type: "number"
            },
            {
                key: "price",
                label: "Gross",
                type: "currency",
                sortable: true
            },
            {
                key: "taxable",
                label: "Taxable",
                type: "currency"
            },
            {
                key: "gst",
                label: "GST",
                type: "currency"
            },
            {
                key: "commission",
                label: "Commission",
                type: "currency",
                sortable: true
            },
            {
                key: "tcs",
                label: "TCS",
                type: "currency"
            },
            {
                key: "nrv",
                label: "NRV",
                type: "currency"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    },
    "orders.whatsapp": {
        title: "WhatsApp Orders",
        description: "Orders placed through the WhatsApp commerce bot (flow v2).",
        permission: "orders.whatsapp",
        collection: "whatsappOrders",
        api: "GET /api/admin/orders?channel=whatsapp",
        search: "Search order or customer",
        searchFields: [
            "id",
            "customer"
        ],
        filterFields: [
            "paymentMode",
            "status"
        ],
        filters: [
            {
                key: "paymentMode",
                label: "Payment",
                options: [
                    "COD",
                    "Prepaid",
                    "Partial"
                ]
            }
        ],
        dateField: "createdAt",
        dateRange: true,
        defaultSort: "createdAt:desc",
        rowHref: "/admin/orders/{id}",
        columns: [
            {
                key: "id",
                label: "Order ID",
                type: "mono"
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "items",
                label: "Items",
                type: "number"
            },
            {
                key: "total",
                label: "Total",
                type: "currency",
                sortable: true
            },
            {
                key: "paymentMode",
                label: "Payment"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Placed",
                type: "datetime",
                sortable: true
            }
        ]
    },
    "orders.srCheckout": {
        title: "Shiprocket Checkout",
        description: "Orders and abandoned carts captured through the Shiprocket SR Checkout module.",
        permission: "orders.srCheckout",
        collection: "srCheckout",
        api: "GET /api/admin/sr-checkout",
        searchFields: [
            "id",
            "customer"
        ],
        filterFields: [
            "type",
            "status"
        ],
        filters: [
            {
                key: "type",
                label: "Type",
                options: [
                    "Order",
                    "Abandoned cart"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Captured",
                "Pending",
                "Recovered",
                "Abandoned"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Reference",
                type: "mono"
            },
            {
                key: "type",
                label: "Type",
                type: "status"
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "value",
                label: "Value",
                type: "currency",
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
            }
        ]
    },
    "shipping.courierSlabs": {
        title: "Courier Slab Rates",
        description: "Weight-slab freight by zone. Lookup order: variant → product → vendor → global. Total = (ship + COD handling + RTO) × 1.18.",
        permission: "shipping.rates",
        collection: "courierSlabs",
        api: "GET /api/admin/shipping/courier-slabs",
        columns: [
            {
                key: "slab",
                label: "Weight slab",
                emphasis: true
            },
            {
                key: "scope",
                label: "Scope"
            },
            ...zones.map((z)=>({
                    key: z,
                    label: z.replace(/_/g, " "),
                    type: "currency"
                })),
            {
                key: "additional",
                label: "Additional / step",
                type: "currency"
            },
            {
                key: "totalRestOfIndia",
                label: "Total (RoI, incl. RTO+GST)",
                type: "currency"
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit rates",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                ...zones.map((z)=>({
                        name: z,
                        label: `${z.replace(/_/g, " ")} (₹)`,
                        type: "number",
                        required: true,
                        min: 0
                    })),
                {
                    name: "additional",
                    label: "Additional per step (₹)",
                    type: "number",
                    min: 0,
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "shipping.slabs": {
        title: "Shipping Slabs",
        description: "COD shipping and handling by order value. Prepaid and partial orders pay no shipping or handling.",
        permission: "shipping.rates",
        collection: "shippingSlabs",
        api: "GET /api/admin/shipping/slabs",
        defaultSort: "orderValueFrom:asc",
        columns: [
            {
                key: "paymentMode",
                label: "Payment mode"
            },
            {
                key: "orderValueFrom",
                label: "Order value from",
                type: "currency",
                sortable: true
            },
            {
                key: "orderValueTo",
                label: "Order value to",
                type: "currency"
            },
            {
                key: "shipping",
                label: "Shipping fee",
                type: "currency"
            },
            {
                key: "codHandling",
                label: "COD handling",
                type: "currency"
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
            ...activeToggle,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "orderValueFrom",
                    label: "Order value from (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "orderValueTo",
                    label: "Order value to (₹)",
                    type: "number",
                    min: 0
                },
                {
                    name: "shipping",
                    label: "Shipping fee (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "codHandling",
                    label: "COD handling (₹)",
                    type: "number",
                    required: true,
                    min: 0
                }
            ],
            defaults: {
                paymentMode: "cod",
                status: "Active"
            },
            requireReason: true
        }
    },
    "shipping.codRules": {
        title: "COD State Rule",
        description: "COD availability per state. When “state match required” is on, multi-seller orders across states cannot use COD.",
        permission: "shipping.rules",
        collection: "codRules",
        api: "GET /api/admin/shipping/cod-rules",
        search: "Search state",
        searchFields: [
            "state"
        ],
        columns: [
            {
                key: "state",
                label: "State",
                emphasis: true,
                sortable: true
            },
            {
                key: "codEnabled",
                label: "COD enabled",
                type: "boolean"
            },
            {
                key: "stateMatchRequired",
                label: "State match required",
                type: "boolean"
            },
            {
                key: "notes",
                label: "Notes",
                width: 260
            }
        ],
        rowActions: [
            {
                id: "enable",
                label: "Enable COD",
                permission: "edit",
                effect: {
                    set: {
                        codEnabled: true
                    }
                },
                when: {
                    field: "codEnabled",
                    in: [
                        false
                    ]
                }
            },
            {
                id: "disable",
                label: "Disable COD",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        codEnabled: false
                    }
                },
                when: {
                    field: "codEnabled",
                    in: [
                        true
                    ]
                },
                confirm: {
                    title: "Disable COD for this state?",
                    description: "Customers in this state will only see prepaid options.",
                    requireReason: true
                }
            }
        ]
    },
    "shipping.otherCharges": {
        title: "Other Charges",
        description: "Price-range packaging and shipping cost table. LBH weight = L×B×H / 5000 × 1000; RTO % = shipping × 2% × 25.",
        permission: "shipping.rates",
        collection: "otherCharges",
        api: "GET /api/get_other_charges.php → /api/admin/shipping/other-charges",
        filterFields: [
            "status"
        ],
        filters: [
            {
                key: "status",
                label: "Status",
                options: [
                    "Active",
                    "Inactive"
                ]
            }
        ],
        defaultSort: "priceMin:asc",
        columns: [
            {
                key: "priceMin",
                label: "Price min",
                type: "currency",
                sortable: true
            },
            {
                key: "priceMax",
                label: "Price max",
                type: "currency"
            },
            {
                key: "length",
                label: "L (cm)",
                type: "number"
            },
            {
                key: "breadth",
                label: "B (cm)",
                type: "number"
            },
            {
                key: "height",
                label: "H (cm)",
                type: "number"
            },
            {
                key: "weightGrams",
                label: "Weight (g)",
                type: "number"
            },
            {
                key: "lbhWeight",
                label: "LBH weight (g)",
                type: "number"
            },
            {
                key: "shippingCost",
                label: "Shipping",
                type: "currency"
            },
            {
                key: "codHandling",
                label: "COD",
                type: "currency"
            },
            {
                key: "rtoPercent",
                label: "RTO",
                type: "currency"
            },
            {
                key: "total",
                label: "Total",
                type: "currency"
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
            ...activeToggle,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "priceMin",
                    label: "Price min (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "priceMax",
                    label: "Price max (₹)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "length",
                    label: "Length (cm)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "breadth",
                    label: "Breadth (cm)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "height",
                    label: "Height (cm)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "weightGrams",
                    label: "Weight after packaging (g)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "shippingCost",
                    label: "Shipping cost (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "codHandling",
                    label: "COD handling (₹)",
                    type: "number",
                    required: true,
                    min: 0
                }
            ],
            defaults: {
                status: "Active"
            },
            derive: "otherCharges"
        }
    },
    "shipping.boxes": {
        title: "Package Boxes",
        description: "Vendor box sizes. The smallest approved box that fits is chosen when creating a shipment.",
        permission: "shipping.boxes",
        collection: "packageBoxes",
        api: "GET /api/admin/shipping/package-boxes",
        search: "Search vendor or box code",
        searchFields: [
            "vendor",
            "code"
        ],
        tabs: {
            field: "status",
            values: [
                "Approved",
                "Pending",
                "Rejected"
            ]
        },
        columns: [
            {
                key: "code",
                label: "Box",
                type: "mono"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 220
            },
            {
                key: "length",
                label: "L",
                type: "number"
            },
            {
                key: "breadth",
                label: "B",
                type: "number"
            },
            {
                key: "height",
                label: "H",
                type: "number"
            },
            {
                key: "maxWeightKg",
                label: "Max kg",
                type: "number"
            },
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
                    set: {
                        status: "Approved"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
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
                    title: "Reject box?",
                    description: "The vendor will be asked to submit a new size.",
                    requireReason: true
                }
            }
        ],
        bulkActions: [
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Approved"
                    }
                }
            }
        ]
    },
    "shipping.weight": {
        title: "Weight Discrepancy",
        description: "Read-only view from the shipping microservice. The legacy system has no dispute workflow.",
        permission: "shipping.weight",
        collection: "weightDiscrepancies",
        api: "GET ship.bharatagrolink.com/weight-discrepancy (proxied)",
        search: "Search AWB, order or vendor",
        searchFields: [
            "awb",
            "orderId",
            "vendor"
        ],
        filterFields: [
            "courier",
            "status"
        ],
        filters: [
            {
                key: "courier",
                label: "Courier",
                options: [
                    "NimbusPost",
                    "Shiprocket",
                    "Delhivery"
                ]
            }
        ],
        defaultSort: "extraCharge:desc",
        columns: [
            {
                key: "awb",
                label: "AWB",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "courier",
                label: "Courier"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 200
            },
            {
                key: "declaredKg",
                label: "Declared kg",
                type: "number"
            },
            {
                key: "chargedKg",
                label: "Charged kg",
                type: "number"
            },
            {
                key: "extraCharge",
                label: "Extra charge",
                type: "currency",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    },
    "shipping.pincodes": {
        title: "Pincode Serviceability",
        description: "Serviceable pincodes, zone, COD availability and courier coverage.",
        permission: "shipping.pincodes",
        collection: "pincodes",
        api: "GET /api/admin/shipping/pincodes",
        search: "Search pincode, city or state",
        searchFields: [
            "pincode",
            "city",
            "state"
        ],
        filterFields: [
            "zone"
        ],
        filters: [
            {
                key: "zone",
                label: "Zone",
                options: zones
            }
        ],
        columns: [
            {
                key: "pincode",
                label: "Pincode",
                type: "mono",
                sortable: true
            },
            {
                key: "city",
                label: "City",
                sortable: true
            },
            {
                key: "state",
                label: "State"
            },
            {
                key: "zone",
                label: "Zone"
            },
            {
                key: "cod",
                label: "COD",
                type: "boolean"
            },
            {
                key: "couriers",
                label: "Couriers"
            },
            {
                key: "tatDays",
                label: "TAT (days)",
                type: "number"
            }
        ]
    },
    "returns.reasons": {
        title: "Return Reasons",
        description: "Reasons offered when creating a return request.",
        permission: "returns",
        collection: "returnReasonRows",
        api: "GET /api/admin/returns/reasons",
        columns: [
            {
                key: "reason",
                label: "Reason",
                emphasis: true
            },
            {
                key: "count",
                label: "Returns",
                type: "number",
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
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "reason",
                    label: "Reason",
                    type: "text",
                    required: true,
                    maxLength: 80
                }
            ],
            defaults: {
                status: "Active",
                count: 0
            }
        }
    },
    "payouts.items": {
        title: "Payout Items",
        description: "Delivered order lines copied into vendor payouts. BSA = NRV − TCS (1% of taxable) is the amount paid to the seller.",
        permission: "payouts",
        collection: "payoutItems",
        api: "GET /api/payout/* → /api/admin/payouts/items",
        search: "Search order, vendor or product",
        searchFields: [
            "orderId",
            "vendor",
            "product",
            "payoutId"
        ],
        filterFields: [
            "status",
            "cycle"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "On Hold",
                "Paid"
            ]
        },
        dateField: "deliveryDate",
        dateRange: "Delivered",
        defaultSort: "deliveryDate:desc",
        exportable: true,
        columns: [
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "product",
                label: "Product",
                width: 240,
                sub: "vendor"
            },
            {
                key: "cycle",
                label: "Cycle"
            },
            {
                key: "gross",
                label: "Gross",
                type: "currency",
                sortable: true
            },
            {
                key: "taxable",
                label: "Taxable",
                type: "currency"
            },
            {
                key: "nrv",
                label: "NRV",
                type: "currency"
            },
            {
                key: "tcs",
                label: "TCS",
                type: "currency"
            },
            {
                key: "bsa",
                label: "BSA (payable)",
                type: "currency",
                sortable: true
            },
            {
                key: "payoutId",
                label: "Payout",
                type: "mono",
                href: "/admin/payouts/{payoutId}"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "hold",
                label: "Put on hold",
                permission: "edit",
                effect: {
                    set: {
                        status: "On Hold"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Hold this item?",
                    description: "It will be excluded from payment until released.",
                    requireReason: true
                }
            },
            {
                id: "release",
                label: "Release hold",
                permission: "edit",
                effect: {
                    set: {
                        status: "Pending"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "On Hold"
                    ]
                },
                confirm: {
                    title: "Release hold?",
                    description: "The item becomes payable in its cycle.",
                    requireReason: true
                }
            }
        ]
    },
    "payouts.access": {
        title: "Payout Access Settings",
        description: "Controls whether each vendor can see the payout page in the seller panel.",
        permission: "payouts.access",
        collection: "vendors",
        api: "GET/PATCH /api/admin/vendors/{id}/payout-access",
        search: "Search vendor",
        searchFields: [
            "name",
            "id"
        ],
        filterFields: [
            "status"
        ],
        columns: [
            {
                key: "name",
                label: "Vendor",
                emphasis: true,
                sub: "id"
            },
            {
                key: "status",
                label: "Vendor status",
                type: "status"
            },
            {
                key: "payoutAccess",
                label: "Payout page access",
                type: "boolean",
                trueLabel: "Enabled",
                falseLabel: "Disabled"
            }
        ],
        rowActions: [
            {
                id: "enable",
                label: "Enable access",
                permission: "edit",
                effect: {
                    set: {
                        payoutAccess: true
                    }
                },
                when: {
                    field: "payoutAccess",
                    in: [
                        false
                    ]
                }
            },
            {
                id: "disable",
                label: "Disable access",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        payoutAccess: false
                    }
                },
                when: {
                    field: "payoutAccess",
                    in: [
                        true
                    ]
                },
                confirm: {
                    title: "Disable payout access?",
                    description: "The vendor will no longer see payouts in the seller panel.",
                    requireReason: true
                }
            }
        ],
        bulkActions: [
            {
                id: "enable",
                label: "Enable access",
                permission: "edit",
                effect: {
                    set: {
                        payoutAccess: true
                    }
                }
            }
        ]
    },
    "payouts.legacy": {
        title: "Legacy Payments",
        description: "Read-only weekly payments from the old payment_cron system (seller_pay = price × qty − TCS − admin profit − 18% GST on profit). Superseded by payout cycles.",
        permission: "payouts",
        collection: "legacyPayments",
        api: "GET /api/admin/payouts/legacy",
        searchFields: [
            "vendor"
        ],
        columns: [
            {
                key: "id",
                label: "Payment",
                type: "mono"
            },
            {
                key: "vendor",
                label: "Vendor"
            },
            {
                key: "week",
                label: "Week"
            },
            {
                key: "sellerPay",
                label: "Seller pay",
                type: "currency"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    }
};
}),
"[project]/src/lib/content/admin/resources/finance.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "financeResources",
    ()=>financeResources
]);
const deleteAction = {
    id: "delete",
    label: "Delete",
    permission: "delete",
    tone: "danger",
    effect: {
        remove: true
    },
    confirm: {
        title: "Delete permanently?",
        description: "This cannot be undone."
    }
};
const financeResources = {
    "vendors.verification": {
        title: "Vendor Verification",
        description: "New sellers awaiting KYC, GST and bank verification before they can list products.",
        permission: "vendors.verification",
        collection: "vendors",
        baseFilter: {
            status: [
                "Pending",
                "Rejected"
            ]
        },
        api: "GET /api/admin/vendors?status=pending",
        search: "Search firm, owner, GSTIN",
        searchFields: [
            "name",
            "owner",
            "gstin",
            "id"
        ],
        filterFields: [
            "kyc"
        ],
        filters: [
            {
                key: "kyc",
                label: "KYC",
                options: [
                    "Submitted",
                    "Under Review",
                    "Documents Missing",
                    "Rejected"
                ]
            }
        ],
        rowHref: "/admin/vendors/{id}",
        defaultSort: "onboardedAt:desc",
        columns: [
            {
                key: "name",
                label: "Vendor",
                sub: "id"
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "city",
                label: "City",
                sub: "state"
            },
            {
                key: "gstin",
                label: "GSTIN",
                type: "mono"
            },
            {
                key: "kyc",
                label: "KYC",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "onboardedAt",
                label: "Applied",
                type: "date",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "verify",
                label: "Verify & activate",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active",
                        kyc: "Verified"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Activate vendor?",
                    description: "KYC will be marked verified and the vendor can list products.",
                    confirmLabel: "Activate"
                }
            },
            {
                id: "reject",
                label: "Reject",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Rejected",
                        kyc: "Rejected"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                },
                confirm: {
                    title: "Reject application?",
                    description: "The vendor will be notified with your reason.",
                    requireReason: true
                }
            }
        ]
    },
    "vendors.reports": {
        title: "Vendor Reports",
        description: "Vendor-wise orders, delivered GMV and RTO for performance reviews.",
        permission: "vendors.reports",
        collection: "vendorReportRows",
        api: "GET /api/admin/reports/vendors",
        search: "Search vendor",
        searchFields: [
            "vendor"
        ],
        defaultSort: "gmv:desc",
        exportable: true,
        columns: [
            {
                key: "vendor",
                label: "Vendor",
                emphasis: true,
                sub: "id"
            },
            {
                key: "orders",
                label: "Order lines",
                type: "number",
                sortable: true
            },
            {
                key: "delivered",
                label: "Delivered",
                type: "number",
                sortable: true
            },
            {
                key: "rto",
                label: "RTO",
                type: "number",
                sortable: true
            },
            {
                key: "rtoPct",
                label: "RTO %",
                type: "percent",
                sortable: true
            },
            {
                key: "gmv",
                label: "Delivered GMV",
                type: "currency",
                sortable: true
            },
            {
                key: "bsa",
                label: "Seller payable (BSA)",
                type: "currency",
                sortable: true
            }
        ]
    },
    "finance.ledger": {
        title: "Ledger Management",
        description: "Customer, vendor and wallet ledgers built from hold-ledger notes, settlements and wallet movements.",
        permission: "finance.ledger",
        collection: "ledger",
        api: "GET /api/admin/finance/ledger?type=",
        search: "Search party or reference",
        searchFields: [
            "party",
            "reference",
            "narration"
        ],
        filterFields: [
            "ledger"
        ],
        tabs: {
            field: "ledger",
            values: [
                "Customer",
                "Vendor",
                "Wallet"
            ]
        },
        dateField: "createdAt",
        dateRange: true,
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "createdAt",
                label: "Date",
                type: "date",
                sortable: true
            },
            {
                key: "ledger",
                label: "Ledger",
                type: "status"
            },
            {
                key: "party",
                label: "Party",
                emphasis: true
            },
            {
                key: "reference",
                label: "Reference",
                type: "mono"
            },
            {
                key: "narration",
                label: "Narration",
                width: 240
            },
            {
                key: "debit",
                label: "Debit",
                type: "currency",
                sortable: true
            },
            {
                key: "credit",
                label: "Credit",
                type: "currency",
                sortable: true
            }
        ]
    },
    "finance.holdLedger": {
        title: "Hold Ledger (CN/DN)",
        description: "Credit and debit notes for customers, vendors, internal and logistics parties. Total = taxable + CGST + SGST + IGST. Every action is written to hold_ledger_audit.",
        permission: "finance.holdLedger",
        collection: "holdLedger",
        api: "GET/POST /api/admin/finance/hold-ledger",
        search: "Search note, party or order",
        searchFields: [
            "id",
            "partyName",
            "orderId",
            "reason"
        ],
        filterFields: [
            "party",
            "type",
            "status"
        ],
        filters: [
            {
                key: "party",
                label: "Party",
                options: [
                    "CUSTOMER",
                    "VENDOR",
                    "BAL_INTERNAL",
                    "LOGISTICS"
                ]
            },
            {
                key: "type",
                label: "Type",
                options: [
                    "Credit Note",
                    "Debit Note"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "PENDING",
                "UNDER_REVIEW",
                "APPROVED",
                "RELEASED",
                "DISPUTED",
                "DEFERRED"
            ]
        },
        dateField: "createdAt",
        dateRange: true,
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "id",
                label: "Note",
                type: "mono"
            },
            {
                key: "type",
                label: "Type"
            },
            {
                key: "party",
                label: "Party",
                sub: "partyName"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "reason",
                label: "Reason",
                width: 200
            },
            {
                key: "taxable",
                label: "Taxable",
                type: "currency"
            },
            {
                key: "total",
                label: "Total",
                type: "currency",
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
                type: "date",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "review",
                label: "Move to review",
                permission: "edit",
                effect: {
                    set: {
                        status: "UNDER_REVIEW"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "PENDING",
                        "DEFERRED"
                    ]
                }
            },
            {
                id: "approve",
                label: "Approve",
                permission: "edit",
                effect: {
                    set: {
                        status: "APPROVED"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "UNDER_REVIEW"
                    ]
                },
                confirm: {
                    title: "Approve note?",
                    description: "Approved notes can be released to the party.",
                    requireReason: true
                }
            },
            {
                id: "release",
                label: "Release",
                permission: "edit",
                effect: {
                    set: {
                        status: "RELEASED"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "APPROVED"
                    ]
                },
                confirm: {
                    title: "Release note?",
                    description: "Customer credit notes released as BAL Wallet Credit credit the wallet once (idempotent on the server).",
                    requireReason: true
                }
            },
            {
                id: "dispute",
                label: "Mark disputed",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "DISPUTED"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "RELEASED",
                        "DISPUTED"
                    ]
                },
                confirm: {
                    title: "Mark as disputed?",
                    description: "The note is frozen until the dispute is resolved.",
                    requireReason: true
                }
            },
            {
                id: "defer",
                label: "Defer",
                permission: "edit",
                effect: {
                    set: {
                        status: "DEFERRED"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "PENDING",
                        "UNDER_REVIEW"
                    ]
                },
                confirm: {
                    title: "Defer note?",
                    requireReason: true
                }
            },
            {
                id: "reopen",
                label: "Reopen",
                permission: "edit",
                effect: {
                    set: {
                        status: "PENDING"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "DISPUTED",
                        "RELEASED"
                    ]
                },
                confirm: {
                    title: "Reopen note?",
                    requireReason: true
                }
            }
        ],
        form: {
            title: "New credit / debit note",
            fields: [
                {
                    name: "type",
                    label: "Type",
                    type: "select",
                    options: [
                        "Credit Note",
                        "Debit Note"
                    ],
                    required: true
                },
                {
                    name: "party",
                    label: "Party",
                    type: "select",
                    options: [
                        "CUSTOMER",
                        "VENDOR",
                        "BAL_INTERNAL",
                        "LOGISTICS"
                    ],
                    required: true
                },
                {
                    name: "partyName",
                    label: "Party name",
                    type: "text",
                    required: true
                },
                {
                    name: "orderId",
                    label: "Order ID",
                    type: "text"
                },
                {
                    name: "reason",
                    label: "Reason",
                    type: "text",
                    required: true
                },
                {
                    name: "taxable",
                    label: "Taxable value (₹)",
                    type: "number",
                    required: true,
                    min: 1,
                    max: 1000000
                },
                {
                    name: "supply",
                    label: "Supply",
                    type: "select",
                    options: [
                        "Intra-state (CGST + SGST)",
                        "Inter-state (IGST)"
                    ],
                    required: true
                }
            ],
            defaults: {
                status: "PENDING"
            },
            derive: "holdLedger",
            requireReason: true
        }
    },
    "finance.cod": {
        title: "COD Reconciliation",
        description: "Courier COD remittances: expected vs received, pending by courier.",
        permission: "finance",
        collection: "codRecon",
        api: "GET /api/admin/finance/cod-reconciliation",
        filterFields: [
            "courier",
            "status"
        ],
        filters: [
            {
                key: "courier",
                label: "Courier",
                options: [
                    "NimbusPost",
                    "Shiprocket",
                    "Delhivery"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Partially Reconciled",
                "Reconciled"
            ]
        },
        defaultSort: "remittanceDate:desc",
        exportable: true,
        columns: [
            {
                key: "id",
                label: "Remittance",
                type: "mono"
            },
            {
                key: "courier",
                label: "Courier"
            },
            {
                key: "remittanceDate",
                label: "Date",
                type: "date",
                sortable: true
            },
            {
                key: "shipments",
                label: "Shipments",
                type: "number"
            },
            {
                key: "expected",
                label: "Expected",
                type: "currency",
                sortable: true
            },
            {
                key: "received",
                label: "Received",
                type: "currency"
            },
            {
                key: "pending",
                label: "Pending",
                type: "currency",
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
                id: "reconcile",
                label: "Mark reconciled",
                permission: "edit",
                effect: {
                    set: {
                        status: "Reconciled"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Reconciled"
                    ]
                },
                confirm: {
                    title: "Mark remittance reconciled?",
                    description: "Confirm the bank credit matches the courier statement.",
                    requireReason: true
                }
            }
        ]
    },
    "finance.tax": {
        title: "GST & TCS",
        description: "Monthly output GST, input credit, net liability, TCS collected and TDS deducted.",
        permission: "finance.tax",
        collection: "gstMonthly",
        api: "GET /api/admin/finance/gst-summary",
        exportable: true,
        columns: [
            {
                key: "month",
                label: "Month",
                emphasis: true
            },
            {
                key: "taxableSales",
                label: "Taxable sales",
                type: "currency"
            },
            {
                key: "cgst",
                label: "CGST",
                type: "currency"
            },
            {
                key: "sgst",
                label: "SGST",
                type: "currency"
            },
            {
                key: "igst",
                label: "IGST",
                type: "currency"
            },
            {
                key: "outputGst",
                label: "Output GST",
                type: "currency"
            },
            {
                key: "inputCredit",
                label: "Input credit",
                type: "currency"
            },
            {
                key: "netLiability",
                label: "Net liability",
                type: "currency"
            },
            {
                key: "tcsCollected",
                label: "TCS",
                type: "currency"
            },
            {
                key: "tdsDeducted",
                label: "TDS",
                type: "currency"
            },
            {
                key: "status",
                label: "Return",
                type: "status"
            }
        ]
    },
    "finance.fixedExpenses": {
        title: "Fixed Expenses",
        description: "Recurring fixed costs with monthly overrides, pro-rated by days in the P&L and expense-limit dashboard.",
        permission: "finance.expenses",
        collection: "fixedExpenses",
        api: "GET/POST /api/admin/finance/fixed-expenses",
        searchFields: [
            "name",
            "category"
        ],
        filterFields: [
            "category"
        ],
        filters: [
            {
                key: "category",
                label: "Category",
                options: [
                    "Rent",
                    "Salaries",
                    "Technology",
                    "Professional fees",
                    "Utilities"
                ]
            }
        ],
        defaultSort: "amount:desc",
        columns: [
            {
                key: "name",
                label: "Expense",
                emphasis: true
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "amount",
                label: "Monthly amount",
                type: "currency",
                sortable: true
            },
            {
                key: "recurrence",
                label: "Recurrence"
            },
            {
                key: "effectiveFrom",
                label: "Effective from",
                type: "date"
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
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "name",
                    label: "Expense name",
                    type: "text",
                    required: true
                },
                {
                    name: "category",
                    label: "Category",
                    type: "select",
                    options: [
                        "Rent",
                        "Salaries",
                        "Technology",
                        "Professional fees",
                        "Utilities"
                    ],
                    required: true
                },
                {
                    name: "amount",
                    label: "Monthly amount (₹)",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "effectiveFrom",
                    label: "Effective from",
                    type: "date",
                    required: true
                }
            ],
            defaults: {
                recurrence: "Monthly",
                status: "Active"
            },
            requireReason: true
        }
    },
    "finance.wallet": {
        title: "Wallet Withdrawals",
        description: "Customer wallet withdrawal requests (₹1–25). The balance is debited when the request is raised; finance marks it paid.",
        permission: "finance.wallet",
        collection: "walletWithdrawals",
        api: "GET /api/admin/finance/wallet-withdrawals",
        searchFields: [
            "id",
            "customer"
        ],
        tabs: {
            field: "status",
            values: [
                "Requested",
                "Paid",
                "Rejected"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Request",
                type: "mono"
            },
            {
                key: "customer",
                label: "Customer",
                href: "/admin/customers/{customerId}"
            },
            {
                key: "amount",
                label: "Amount",
                type: "currency"
            },
            {
                key: "balanceAfter",
                label: "Balance after",
                type: "currency"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Requested",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "paid",
                label: "Mark paid",
                permission: "edit",
                effect: {
                    set: {
                        status: "Paid"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Requested"
                    ]
                },
                confirm: {
                    title: "Mark withdrawal paid?",
                    description: "Confirm the bank transfer to the customer is complete.",
                    requireReason: true
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
                        "Requested"
                    ]
                },
                confirm: {
                    title: "Reject withdrawal?",
                    description: "The amount is credited back to the wallet by the server.",
                    requireReason: true
                }
            }
        ]
    },
    "customers.coupons": {
        title: "Coupons",
        description: "Checkout coupons: user type (new / old / all), cart value range, percentage or flat.",
        permission: "customers.coupons",
        collection: "coupons",
        api: "GET/POST /api/admin/coupons",
        search: "Search coupon code",
        searchFields: [
            "code"
        ],
        filterFields: [
            "status",
            "userType"
        ],
        filters: [
            {
                key: "userType",
                label: "User type",
                options: [
                    "New",
                    "Existing",
                    "All"
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
        columns: [
            {
                key: "code",
                label: "Code",
                type: "mono",
                emphasis: true
            },
            {
                key: "type",
                label: "Type"
            },
            {
                key: "value",
                label: "Value",
                type: "number"
            },
            {
                key: "userType",
                label: "User type"
            },
            {
                key: "minPrice",
                label: "Min cart",
                type: "currency"
            },
            {
                key: "applyType",
                label: "Applies to"
            },
            {
                key: "used",
                label: "Used",
                type: "number",
                sortable: true
            },
            {
                key: "expiresAt",
                label: "Expires",
                type: "date",
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
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            {
                id: "activate",
                label: "Activate",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Inactive"
                    ]
                }
            },
            {
                id: "deactivate",
                label: "Deactivate",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Inactive"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                },
                confirm: {
                    title: "Deactivate coupon?",
                    description: "Customers can no longer apply it."
                }
            },
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "code",
                    label: "Coupon code",
                    type: "text",
                    required: true,
                    pattern: "^[A-Z0-9]{4,15}$",
                    patternMessage: "4–15 uppercase letters or numbers."
                },
                {
                    name: "type",
                    label: "Discount type",
                    type: "select",
                    options: [
                        "Percent",
                        "Flat"
                    ],
                    required: true
                },
                {
                    name: "value",
                    label: "Value",
                    type: "number",
                    required: true,
                    min: 1
                },
                {
                    name: "userType",
                    label: "User type",
                    type: "select",
                    options: [
                        "All",
                        "New",
                        "Existing"
                    ],
                    required: true
                },
                {
                    name: "minPrice",
                    label: "Minimum cart (₹)",
                    type: "number",
                    min: 0,
                    required: true
                },
                {
                    name: "expiresAt",
                    label: "Expires on",
                    type: "date",
                    required: true
                }
            ],
            defaults: {
                status: "Active",
                used: 0,
                applyType: "range",
                maxPrice: 50000
            }
        }
    },
    "customers.reviews": {
        title: "Product Reviews",
        description: "Customer reviews awaiting moderation before they appear on product pages.",
        permission: "customers.reviews",
        collection: "reviews",
        api: "GET /api/admin/reviews",
        search: "Search product or customer",
        searchFields: [
            "product",
            "customer",
            "comment"
        ],
        filterFields: [
            "rating"
        ],
        filters: [
            {
                key: "rating",
                label: "Rating",
                options: [
                    "5",
                    "4",
                    "3",
                    "2",
                    "1"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Published",
                "Hidden"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "product",
                label: "Product",
                width: 260,
                href: "/admin/products/{productId}"
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "rating",
                label: "Rating",
                type: "number",
                sortable: true
            },
            {
                key: "comment",
                label: "Comment",
                width: 300,
                wrap: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Date",
                type: "date",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "publish",
                label: "Publish",
                permission: "edit",
                effect: {
                    set: {
                        status: "Published"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Published"
                    ]
                }
            },
            {
                id: "hide",
                label: "Hide",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Hidden"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Hidden"
                    ]
                },
                confirm: {
                    title: "Hide review?",
                    description: "It will no longer show on the product page."
                }
            }
        ],
        bulkActions: [
            {
                id: "publish",
                label: "Publish",
                permission: "edit",
                effect: {
                    set: {
                        status: "Published"
                    }
                }
            }
        ]
    }
};
}),
"[project]/src/lib/content/admin/resources/crm.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "crmResources",
    ()=>crmResources
]);
const deleteAction = {
    id: "delete",
    label: "Delete",
    permission: "delete",
    tone: "danger",
    effect: {
        remove: true
    },
    confirm: {
        title: "Delete permanently?",
        description: "This cannot be undone."
    }
};
const execs = [
    "Rupesh Kumar",
    "Anjali Verma",
    "Imran Khan",
    "Sneha Patidar",
    "Vivek Rathore",
    "Kajal Meena"
];
const months = [
    {
        value: "2026-10",
        label: "Oct 2026"
    }
];
const crmResources = {
    "crm.leads": {
        title: "CRM Lead Sheet",
        description: "One lead per mobile. Leads are auto-assigned by telecom circle to the executive with the fewest live leads. Executives see only their own leads.",
        permission: "crm.leads",
        collection: "leads",
        ownerField: "assignedTo",
        api: "GET /api/crm_leads/* → /api/admin/crm/leads",
        search: "Search name, mobile, crop or city",
        searchFields: [
            "name",
            "mobile",
            "crop",
            "city",
            "id",
            "code",
            "productInterest"
        ],
        filterFields: [
            "status",
            "priority",
            "source",
            "assignedTo",
            "customerType"
        ],
        filters: [
            {
                key: "priority",
                label: "Priority",
                options: [
                    "Hot",
                    "Warm",
                    "Cold"
                ]
            },
            {
                key: "customerType",
                label: "Customer type",
                options: [
                    "Farmer",
                    "Retailer",
                    "Distributor"
                ]
            },
            {
                key: "source",
                label: "Source",
                options: [
                    "CRM",
                    "AiSensy WhatsApp",
                    "WhatsApp",
                    "Website Engagement",
                    "Bulk Inquiry",
                    "CSV Import",
                    "AI Call (VAPI)",
                    "Missed Call"
                ]
            },
            {
                key: "assignedTo",
                label: "Executive",
                options: execs
            }
        ],
        tabs: {
            field: "status",
            values: [
                "New",
                "Called",
                "Interested",
                "Follow Up",
                "Not Interested",
                "Converted"
            ]
        },
        dateField: "createdAt",
        dateRange: "Created",
        defaultSort: "createdAt:desc",
        rowHref: "/admin/crm/leads/{id}",
        exportable: true,
        columns: [
            {
                key: "code",
                label: "Lead ID",
                type: "mono",
                sub: "id"
            },
            {
                key: "createdAt",
                label: "Date",
                type: "datetime",
                sortable: true
            },
            {
                key: "name",
                label: "Customer",
                width: 180
            },
            {
                key: "customerType",
                label: "Customer type"
            },
            {
                key: "mobile",
                label: "WhatsApp No.",
                type: "mono"
            },
            {
                key: "assignedTo",
                label: "Agent"
            },
            {
                key: "attempts",
                label: "Call attempts",
                type: "number",
                sortable: true
            },
            {
                key: "lastCallDate",
                label: "Last call",
                type: "date",
                sortable: true
            },
            {
                key: "lastNote",
                label: "Last discussion",
                width: 220,
                wrap: true
            },
            {
                key: "nextFollowUp",
                label: "Next follow-up",
                type: "date",
                sortable: true
            },
            {
                key: "city",
                label: "Location",
                width: 180
            },
            {
                key: "crop",
                label: "Current crop"
            },
            {
                key: "season",
                label: "Season"
            },
            {
                key: "nextSeasonCrop",
                label: "Next season crop"
            },
            {
                key: "productInterest",
                label: "Product interest",
                width: 180,
                wrap: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "stage",
                label: "Stage"
            },
            {
                key: "priority",
                label: "Priority",
                type: "status"
            },
            {
                key: "actionType",
                label: "Action type"
            },
            {
                key: "scheduledCallDate",
                label: "Scheduled call",
                type: "date"
            },
            {
                key: "scheduledCallTime",
                label: "Call time",
                type: "mono"
            },
            {
                key: "agentNotes",
                label: "Agent notes",
                width: 220,
                wrap: true
            },
            {
                key: "orderValue",
                label: "Order value",
                type: "currency",
                sortable: true
            },
            {
                key: "systemStatus",
                label: "System status",
                type: "status"
            },
            {
                key: "source",
                label: "Source"
            }
        ],
        rowActions: [
            {
                id: "hot",
                label: "Mark Hot",
                permission: "edit",
                effect: {
                    set: {
                        priority: "Hot"
                    }
                },
                when: {
                    field: "priority",
                    notIn: [
                        "Hot"
                    ]
                }
            },
            {
                id: "notInterested",
                label: "Mark Not Interested",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Not Interested",
                        nextFollowUp: null
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Converted",
                        "Not Interested"
                    ]
                },
                confirm: {
                    title: "Close lead as Not Interested?",
                    description: "Follow-ups for this lead will stop."
                }
            }
        ],
        bulkActions: [
            {
                id: "reassign",
                label: "Reassign…",
                permission: "edit",
                assign: {
                    field: "assignedTo",
                    label: "Assign to executive",
                    options: execs
                },
                confirm: {
                    title: "Reassign selected leads?",
                    description: "Leads move to the chosen executive's sheet."
                }
            }
        ],
        form: {
            title: "Add lead",
            fields: [
                {
                    name: "name",
                    label: "Farmer name",
                    type: "text",
                    required: true
                },
                {
                    name: "mobile",
                    label: "Mobile",
                    type: "text",
                    required: true,
                    pattern: "^[6-9][0-9]{9}$",
                    patternMessage: "Enter a 10-digit Indian mobile number."
                },
                {
                    name: "crop",
                    label: "Crop",
                    type: "text",
                    required: true
                },
                {
                    name: "acreage",
                    label: "Acreage",
                    type: "number",
                    min: 0,
                    max: 1000
                },
                {
                    name: "city",
                    label: "District / city",
                    type: "text"
                },
                {
                    name: "source",
                    label: "Source",
                    type: "select",
                    options: [
                        "Missed Call",
                        "WhatsApp",
                        "Website Engagement",
                        "Bulk Inquiry",
                        "CSV Import"
                    ],
                    required: true
                },
                {
                    name: "priority",
                    label: "Priority",
                    type: "select",
                    options: [
                        "Hot",
                        "Warm",
                        "Cold"
                    ],
                    required: true
                }
            ],
            defaults: {
                status: "New",
                attempts: 0,
                orderValue: 0,
                assignedTo: "Auto-assign by circle"
            },
            unique: "mobile"
        }
    },
    "crm.legacy": {
        title: "All Leads (Legacy)",
        description: "Leads from the older manager/agent lead pages. Kept read-only for history; new work happens in the CRM Lead Sheet.",
        permission: "crm.legacy",
        collection: "legacyLeads",
        api: "GET /api/admin/crm/legacy-leads",
        search: "Search name or mobile",
        searchFields: [
            "name",
            "mobile"
        ],
        filterFields: [
            "agent",
            "status",
            "circle"
        ],
        filters: [
            {
                key: "agent",
                label: "Agent",
                options: execs
            },
            {
                key: "status",
                label: "Status",
                options: [
                    "Call Scheduled",
                    "Call Done",
                    "In Progress",
                    "Requirement Shared",
                    "Order Generated",
                    "Dead",
                    "Done"
                ]
            }
        ],
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "name",
                label: "Lead",
                sub: "id"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mobile"
            },
            {
                key: "circle",
                label: "Circle"
            },
            {
                key: "agent",
                label: "Agent"
            },
            {
                key: "source",
                label: "Source"
            },
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
        ]
    },
    "crm.whatsapp": {
        title: "WhatsApp Leads",
        description: "WhatsApp bot sessions. Synced sessions become CRM leads.",
        permission: "crm.whatsapp",
        collection: "whatsappLeads",
        api: "GET /api/admin/crm/whatsapp-sessions",
        search: "Search name or mobile",
        searchFields: [
            "name",
            "mobile",
            "lastMessage"
        ],
        filterFields: [
            "state",
            "language"
        ],
        filters: [
            {
                key: "state",
                label: "Bot state",
                options: [
                    "main_menu",
                    "crop_problem",
                    "browse_products",
                    "cart",
                    "checkout",
                    "track_order",
                    "expert"
                ]
            },
            {
                key: "language",
                label: "Language",
                options: [
                    "Hindi",
                    "English"
                ]
            }
        ],
        defaultSort: "lastActiveAt:desc",
        columns: [
            {
                key: "name",
                label: "Contact",
                sub: "id"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mobile"
            },
            {
                key: "language",
                label: "Language"
            },
            {
                key: "state",
                label: "Bot state"
            },
            {
                key: "lastMessage",
                label: "Last message",
                width: 260
            },
            {
                key: "syncedToCrm",
                label: "In CRM",
                type: "boolean"
            },
            {
                key: "lastActiveAt",
                label: "Last active",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "sync",
                label: "Create CRM lead",
                permission: "edit",
                effect: {
                    set: {
                        syncedToCrm: true
                    }
                },
                when: {
                    field: "syncedToCrm",
                    in: [
                        false
                    ]
                }
            }
        ],
        bulkActions: [
            {
                id: "sync",
                label: "Create CRM leads",
                permission: "edit",
                effect: {
                    set: {
                        syncedToCrm: true
                    }
                }
            }
        ]
    },
    "crm.aiCalls": {
        title: "AI Calls (VAPI)",
        description: "Leads dispatched to the VAPI AI calling agent through n8n.",
        permission: "crm.aiCalls",
        collection: "aiCalls",
        api: "GET /api/vapi/* → /api/admin/crm/ai-calls",
        searchFields: [
            "lead",
            "mobile",
            "id"
        ],
        tabs: {
            field: "status",
            values: [
                "queued",
                "calling",
                "completed",
                "no-answer",
                "failed"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Call",
                type: "mono"
            },
            {
                key: "lead",
                label: "Lead"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mobile"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "durationSec",
                label: "Duration (s)",
                type: "number",
                sortable: true
            },
            {
                key: "outcome",
                label: "Outcome"
            },
            {
                key: "createdAt",
                label: "Queued",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "requeue",
                label: "Re-queue call",
                permission: "edit",
                effect: {
                    set: {
                        status: "queued"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "failed",
                        "no-answer"
                    ]
                }
            }
        ]
    },
    "crm.callAudit": {
        title: "AI Call Audit",
        description: "Telesales recordings transcribed and scored against the 8-stage, 37-checkpoint script. Scores are computed on the server, not by the model.",
        permission: "crm.callAudit",
        collection: "callAudits",
        api: "GET /api/call_audit/data.php → /api/admin/crm/call-audits",
        search: "Search executive or farmer",
        searchFields: [
            "executive",
            "farmer",
            "id"
        ],
        filterFields: [
            "executive",
            "grade",
            "language"
        ],
        filters: [
            {
                key: "executive",
                label: "Executive",
                options: execs
            },
            {
                key: "grade",
                label: "Grade",
                options: [
                    "A",
                    "B",
                    "C",
                    "D"
                ]
            },
            {
                key: "language",
                label: "Language",
                options: [
                    "hi",
                    "hi-en",
                    "mr",
                    "gu",
                    "bho"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Scored",
                "Processing",
                "Failed"
            ]
        },
        defaultSort: "callDate:desc",
        columns: [
            {
                key: "id",
                label: "Audit",
                type: "mono"
            },
            {
                key: "executive",
                label: "Executive"
            },
            {
                key: "farmer",
                label: "Farmer"
            },
            {
                key: "callDate",
                label: "Call date",
                type: "date",
                sortable: true
            },
            {
                key: "language",
                label: "Language"
            },
            {
                key: "overall",
                label: "Score",
                type: "number",
                sortable: true
            },
            {
                key: "compliance",
                label: "Compliance %",
                type: "percent",
                sortable: true
            },
            {
                key: "grade",
                label: "Grade"
            },
            {
                key: "outcome",
                label: "Outcome"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "retry",
                label: "Retry audit",
                permission: "edit",
                effect: {
                    set: {
                        status: "Processing"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Failed"
                    ]
                }
            }
        ]
    },
    "crm.circles": {
        title: "Circle Assignment",
        description: "Mobile prefix → telecom circle → sales executives. Used for automatic lead assignment.",
        permission: "crm.circles",
        collection: "circles",
        api: "GET /api/admin/crm/circles",
        searchFields: [
            "prefix",
            "circle"
        ],
        columns: [
            {
                key: "prefix",
                label: "Mobile prefix",
                type: "mono"
            },
            {
                key: "circle",
                label: "Circle",
                emphasis: true
            },
            {
                key: "agents",
                label: "Executives covering",
                width: 320
            }
        ],
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "prefix",
                    label: "Prefix (4 digits)",
                    type: "text",
                    required: true,
                    pattern: "^[6-9][0-9]{3}$",
                    patternMessage: "4 digits starting 6–9."
                },
                {
                    name: "circle",
                    label: "Circle",
                    type: "text",
                    required: true
                }
            ],
            defaults: {
                agents: "Unassigned"
            }
        }
    },
    "sales.targets": {
        title: "Targets",
        description: "Monthly targets per executive, manager, or combined team. Daily target = monthly / days + yesterday's shortfall.",
        permission: "sales.targets",
        collection: "salesTargets",
        api: "POST /api/sales_targets/targets_data.php → /api/admin/sales/targets",
        searchFields: [
            "person"
        ],
        filterFields: [
            "targetType",
            "month"
        ],
        filters: [
            {
                key: "targetType",
                label: "Type",
                options: [
                    "sales_executive",
                    "sales_manager",
                    "overall_executive",
                    "overall_manager"
                ]
            },
            {
                key: "month",
                label: "Month",
                options: months
            }
        ],
        columns: [
            {
                key: "person",
                label: "Sales person",
                emphasis: true
            },
            {
                key: "targetType",
                label: "Target type"
            },
            {
                key: "experience",
                label: "Experience"
            },
            {
                key: "month",
                label: "Month"
            },
            {
                key: "target",
                label: "Target",
                type: "currency",
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
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            },
            deleteAction
        ],
        form: {
            title: "Assign target",
            fields: [
                {
                    name: "person",
                    label: "Sales person",
                    type: "select",
                    options: [
                        ...execs,
                        "Nitin Sharma",
                        "Pallavi Joshi",
                        "All executives",
                        "All managers"
                    ],
                    required: true
                },
                {
                    name: "targetType",
                    label: "Target type",
                    type: "select",
                    options: [
                        "sales_executive",
                        "sales_manager",
                        "overall_executive",
                        "overall_manager"
                    ],
                    required: true
                },
                {
                    name: "month",
                    label: "Month (YYYY-MM)",
                    type: "text",
                    required: true,
                    pattern: "^20[0-9]{2}-(0[1-9]|1[0-2])$",
                    patternMessage: "Use YYYY-MM."
                },
                {
                    name: "target",
                    label: "Target amount (₹)",
                    type: "number",
                    required: true,
                    min: 1000
                }
            ],
            defaults: {
                status: "Active",
                experience: "—"
            }
        }
    },
    "sales.salary": {
        title: "Salary Structure",
        description: "Fixed salary, variable pay (paid only when target met) and incentive (on excess achievement), with effective dates.",
        permission: "sales.salary",
        collection: "salaryStructures",
        api: "POST /api/sales_targets/salary_structure_data.php → /api/admin/sales/salary-structures",
        searchFields: [
            "person"
        ],
        filterFields: [
            "role"
        ],
        filters: [
            {
                key: "role",
                label: "Role",
                options: [
                    "Sales Executive",
                    "Sales Manager"
                ]
            }
        ],
        columns: [
            {
                key: "person",
                label: "Sales person",
                emphasis: true,
                sub: "role"
            },
            {
                key: "fixedSalary",
                label: "Fixed",
                type: "currency",
                sortable: true
            },
            {
                key: "variableValue",
                label: "Variable % of target",
                type: "percent"
            },
            {
                key: "incentiveValue",
                label: "Incentive % of excess",
                type: "percent"
            },
            {
                key: "effectiveFrom",
                label: "Effective from",
                type: "date"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "fixedSalary",
                    label: "Fixed monthly salary (₹)",
                    type: "number",
                    required: true,
                    min: 0
                },
                {
                    name: "variableValue",
                    label: "Variable pay % of target",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 20
                },
                {
                    name: "incentiveValue",
                    label: "Incentive % of excess",
                    type: "number",
                    required: true,
                    min: 0,
                    max: 20
                },
                {
                    name: "effectiveFrom",
                    label: "Effective from",
                    type: "date",
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "sales.achievements": {
        title: "Achievements",
        description: "Monthly achievement = delivered, non-returned line amounts by orders.salesman_id (calculated on the server).",
        permission: "sales.targets",
        collection: "achievements",
        api: "POST /api/sales_targets/achievements_data.php?action=calculate",
        searchFields: [
            "person"
        ],
        filterFields: [
            "role"
        ],
        defaultSort: "percent:desc",
        columns: [
            {
                key: "person",
                label: "Sales person",
                emphasis: true,
                sub: "role"
            },
            {
                key: "month",
                label: "Month"
            },
            {
                key: "target",
                label: "Target",
                type: "currency"
            },
            {
                key: "achieved",
                label: "Achieved",
                type: "currency",
                sortable: true
            },
            {
                key: "percent",
                label: "Achievement %",
                type: "percent",
                sortable: true
            },
            {
                key: "prepaidShare",
                label: "Prepaid share %",
                type: "percent",
                sortable: true
            },
            {
                key: "orders",
                label: "Orders",
                type: "number"
            }
        ]
    },
    "sales.payouts": {
        title: "Sales Payouts",
        description: "Fixed + variable (if target met) + incentive (if exceeded) + prepaid incentive. Managers get variable only if their team met target.",
        permission: "sales.payouts",
        collection: "salesPayouts",
        api: "POST /api/sales_targets/payouts_data.php",
        searchFields: [
            "person"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Processed",
                "Paid",
                "Cancelled"
            ]
        },
        exportable: true,
        columns: [
            {
                key: "person",
                label: "Sales person",
                emphasis: true,
                sub: "role"
            },
            {
                key: "month",
                label: "Month"
            },
            {
                key: "fixed",
                label: "Fixed",
                type: "currency"
            },
            {
                key: "variable",
                label: "Variable",
                type: "currency"
            },
            {
                key: "incentive",
                label: "Incentive",
                type: "currency"
            },
            {
                key: "prepaidIncentive",
                label: "Prepaid incentive",
                type: "currency"
            },
            {
                key: "total",
                label: "Total",
                type: "currency",
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
                id: "process",
                label: "Mark processed",
                permission: "edit",
                effect: {
                    set: {
                        status: "Processed"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                }
            },
            {
                id: "paid",
                label: "Mark paid",
                permission: "edit",
                effect: {
                    set: {
                        status: "Paid"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Processed"
                    ]
                },
                confirm: {
                    title: "Mark salary payout paid?",
                    description: "Confirm the payment has been made.",
                    requireReason: true
                }
            },
            {
                id: "cancel",
                label: "Cancel",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Cancelled"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending",
                        "Processed"
                    ]
                },
                confirm: {
                    title: "Cancel payout?",
                    requireReason: true
                }
            }
        ]
    },
    "sales.prepaid": {
        title: "Prepaid Incentive Setup",
        description: "Executives with prepaid share ≥ threshold earn a % of their prepaid amount; managers earn a % of all executives' prepaid amount.",
        permission: "sales.salary",
        collection: "prepaidConfig",
        api: "GET/POST /api/admin/sales/prepaid-incentive-config",
        columns: [
            {
                key: "role",
                label: "Role",
                emphasis: true
            },
            {
                key: "thresholdPercent",
                label: "Prepaid threshold",
                type: "percent"
            },
            {
                key: "incentivePercent",
                label: "Incentive %",
                type: "percent"
            },
            {
                key: "basis",
                label: "Basis"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "thresholdPercent",
                    label: "Prepaid share threshold %",
                    type: "number",
                    min: 0,
                    max: 100,
                    required: true
                },
                {
                    name: "incentivePercent",
                    label: "Incentive %",
                    type: "number",
                    min: 0,
                    max: 10,
                    required: true
                }
            ],
            requireReason: true
        }
    }
};
}),
"[project]/src/lib/content/admin/resources/b2b-ops.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "b2bOpsResources",
    ()=>b2bOpsResources
]);
const execs = [
    "Rupesh Kumar",
    "Anjali Verma",
    "Imran Khan",
    "Sneha Patidar",
    "Vivek Rathore",
    "Kajal Meena"
];
const agents = [
    "Pankaj Lodhi",
    "Ritu Sahu",
    "Ashish Pawar",
    "Megha Tiwari"
];
const b2bOpsResources = {
    "b2b.buyers": {
        title: "Buyers / Leads",
        description: "Retailers, dealers, distributors, FPOs and institutions with segment, owner, credit and next action.",
        permission: "b2b.buyers",
        collection: "b2bBuyers",
        ownerField: "owner",
        api: "GET/POST /api/b2b/buyers",
        search: "Search firm, contact, GSTIN",
        searchFields: [
            "firm",
            "contact",
            "gstin",
            "id",
            "district"
        ],
        filterFields: [
            "type",
            "segment",
            "owner"
        ],
        filters: [
            {
                key: "type",
                label: "Buyer type",
                options: [
                    "Retailer",
                    "Dealer",
                    "Distributor",
                    "FPO",
                    "Institution"
                ]
            },
            {
                key: "segment",
                label: "Segment",
                options: [
                    "B0 Lead",
                    "B1 Qualified",
                    "B2 Trial",
                    "B3 Active",
                    "B4 Repeat",
                    "B5 High Value",
                    "B6 Key Account"
                ]
            },
            {
                key: "owner",
                label: "Owner",
                options: execs
            }
        ],
        rowHref: "/admin/b2b/buyers/{id}",
        defaultSort: "lifetimeGmv:desc",
        columns: [
            {
                key: "firm",
                label: "Buyer",
                sub: "id"
            },
            {
                key: "type",
                label: "Type"
            },
            {
                key: "district",
                label: "Location",
                sub: "state"
            },
            {
                key: "segment",
                label: "Segment"
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "lifetimeGmv",
                label: "Lifetime GMV",
                type: "currency",
                sortable: true
            },
            {
                key: "outstanding",
                label: "Outstanding",
                type: "currency",
                sortable: true
            },
            {
                key: "nextFollowUp",
                label: "Next follow-up",
                type: "date",
                sortable: true
            }
        ],
        form: {
            title: "Add buyer",
            fields: [
                {
                    name: "firm",
                    label: "Firm name",
                    type: "text",
                    required: true
                },
                {
                    name: "contact",
                    label: "Contact person",
                    type: "text",
                    required: true
                },
                {
                    name: "mobile",
                    label: "Mobile",
                    type: "text",
                    required: true,
                    pattern: "^[6-9][0-9]{9}$",
                    patternMessage: "10-digit mobile number."
                },
                {
                    name: "type",
                    label: "Buyer type",
                    type: "select",
                    options: [
                        "Retailer",
                        "Dealer",
                        "Distributor",
                        "FPO",
                        "Institution"
                    ],
                    required: true
                },
                {
                    name: "gstin",
                    label: "GSTIN",
                    type: "text",
                    pattern: "^[0-9]{2}[A-Z0-9]{13}$",
                    patternMessage: "15-character GSTIN."
                },
                {
                    name: "district",
                    label: "District",
                    type: "text",
                    required: true
                },
                {
                    name: "state",
                    label: "State",
                    type: "text",
                    required: true
                }
            ],
            defaults: {
                segment: "B0 Lead",
                creditLimit: 0,
                outstanding: 0,
                lifetimeGmv: 0,
                status: "Active"
            }
        }
    },
    "b2b.rfqs": {
        title: "RFQs",
        description: "Buyer requirements with a 15–30 minute quote SLA. Flow: created → seller matching → seller quotes → landed cost → commercial engine → customer quote → negotiation → PO / lost.",
        permission: "b2b.rfqs",
        collection: "rfqs",
        ownerField: "owner",
        api: "GET/POST /api/b2b/rfqs",
        search: "Search RFQ or buyer",
        searchFields: [
            "id",
            "buyer"
        ],
        filterFields: [
            "status",
            "owner",
            "buyerType"
        ],
        filters: [
            {
                key: "owner",
                label: "Owner",
                options: execs
            },
            {
                key: "buyerType",
                label: "Buyer type",
                options: [
                    "Retailer",
                    "Dealer",
                    "Distributor",
                    "FPO",
                    "Institution"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Open",
                "Seller Sourcing",
                "Quotes Received",
                "Customer Quote Ready",
                "Sent",
                "Negotiation",
                "Converted",
                "Lost",
                "Expired"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "RFQ",
                type: "mono"
            },
            {
                key: "buyer",
                label: "Buyer",
                href: "/admin/b2b/buyers/{buyerId}",
                sub: "buyerType"
            },
            {
                key: "lines",
                label: "Lines",
                type: "number"
            },
            {
                key: "estValue",
                label: "Est. value",
                type: "currency",
                sortable: true
            },
            {
                key: "paymentMode",
                label: "Payment"
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "slaDueAt",
                label: "Quote SLA",
                type: "datetime"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "lostReason",
                label: "Lost reason"
            }
        ],
        rowActions: [
            {
                id: "sourcing",
                label: "Start seller sourcing",
                permission: "edit",
                effect: {
                    set: {
                        status: "Seller Sourcing"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Draft",
                        "Open"
                    ]
                }
            },
            {
                id: "lost",
                label: "Mark lost",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Lost"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Converted",
                        "Lost",
                        "Expired"
                    ]
                },
                confirm: {
                    title: "Mark RFQ lost?",
                    description: "A lost reason code is mandatory (High Price, Credit, Stock, Competitor, Shipping, Delay…).",
                    requireReason: true
                }
            }
        ]
    },
    "b2b.quotations": {
        title: "Quotations",
        description: "Commercial values come from the server engine. Quotes with expected CM below 5% or net shipping above 5% need manager approval.",
        permission: "b2b.quotations",
        headerActions: [
            {
                label: "Create quotation",
                href: "/admin/b2b/quotations/new",
                permission: "b2b.quotations",
                action: "add",
                primary: true
            }
        ],
        collection: "quotations",
        ownerField: "owner",
        api: "POST /api/b2b/quotations/{id}/recalculate|request-approval|send|convert",
        search: "Search quotation, RFQ or buyer",
        searchFields: [
            "id",
            "rfqId",
            "buyer"
        ],
        filterFields: [
            "status",
            "approval",
            "owner"
        ],
        filters: [
            {
                key: "approval",
                label: "Approval",
                options: [
                    "Approval Pending",
                    "Auto-approved",
                    "Approved"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Draft",
                "Approval Pending",
                "Approved",
                "Sent",
                "Viewed",
                "Negotiation",
                "Accepted",
                "Rejected",
                "Converted"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Quotation",
                type: "mono"
            },
            {
                key: "rfqId",
                label: "RFQ",
                type: "mono"
            },
            {
                key: "buyer",
                label: "Buyer"
            },
            {
                key: "value",
                label: "Value",
                type: "currency",
                sortable: true
            },
            {
                key: "takeRate",
                label: "Take rate",
                type: "percent",
                requires: "b2b.margin"
            },
            {
                key: "cmPercent",
                label: "Expected CM",
                type: "percent",
                sortable: true,
                requires: "b2b.margin"
            },
            {
                key: "netShippingPercent",
                label: "Net shipping",
                type: "percent"
            },
            {
                key: "approval",
                label: "Approval",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "validTill",
                label: "Valid till",
                type: "date"
            }
        ],
        rowActions: [
            {
                id: "approve",
                label: "Approve (manager)",
                permission: "edit",
                capability: "quotation.approve",
                effect: {
                    set: {
                        status: "Approved",
                        approval: "Approved"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Approval Pending",
                        "Draft"
                    ]
                },
                confirm: {
                    title: "Approve quotation below guard-rails?",
                    description: "Low-CM or high-shipping approvals are audited with your reason.",
                    requireReason: true
                }
            },
            {
                id: "send",
                label: "Send to buyer",
                permission: "edit",
                effect: {
                    set: {
                        status: "Sent"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Approved"
                    ]
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
                    notIn: [
                        "Converted",
                        "Rejected"
                    ]
                },
                confirm: {
                    title: "Reject quotation?",
                    requireReason: true
                }
            }
        ]
    },
    "b2b.orders": {
        title: "B2B Orders",
        description: "Order numbers BAL-B2B-xxxxx. Status: confirmed → processing → packed → dispatched → in_transit → delivered (cancel/return need a reason).",
        permission: "b2b.orders",
        collection: "b2bOrders",
        ownerField: "owner",
        api: "GET/PATCH /api/b2b/orders/{id}",
        search: "Search order, buyer or seller",
        searchFields: [
            "id",
            "buyer",
            "seller",
            "awb"
        ],
        filterFields: [
            "status",
            "paymentStatus"
        ],
        filters: [
            {
                key: "paymentStatus",
                label: "Payment",
                options: [
                    "Pending",
                    "Partial",
                    "Paid",
                    "Overdue"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "confirmed",
                "processing",
                "packed",
                "dispatched",
                "in_transit",
                "delivered",
                "returned",
                "cancelled"
            ]
        },
        rowHref: "/admin/b2b/orders/{id}",
        defaultSort: "createdAt:desc",
        exportable: true,
        columns: [
            {
                key: "id",
                label: "Order",
                type: "mono"
            },
            {
                key: "buyer",
                label: "Buyer",
                href: "/admin/b2b/buyers/{buyerId}"
            },
            {
                key: "seller",
                label: "Seller",
                width: 200
            },
            {
                key: "value",
                label: "Order value",
                type: "currency",
                sortable: true
            },
            {
                key: "contribution",
                label: "Contribution",
                type: "currency",
                sortable: true,
                requires: "b2b.margin"
            },
            {
                key: "paymentStatus",
                label: "Payment",
                type: "status"
            },
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
        ]
    },
    "b2b.payments": {
        title: "Payments & Credit",
        description: "Buyer collections, credit usage and overdue payments. Sales cannot approve credit; Finance only.",
        permission: "b2b.finance",
        collection: "b2bPayments",
        api: "GET/POST /api/b2b/orders/{id}/payments · /api/b2b/credit",
        searchFields: [
            "id",
            "orderId",
            "buyer",
            "reference"
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "Partial",
                "Paid",
                "Overdue"
            ]
        },
        defaultSort: "dueDate:asc",
        columns: [
            {
                key: "id",
                label: "Payment",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/b2b/orders/{orderId}"
            },
            {
                key: "buyer",
                label: "Buyer"
            },
            {
                key: "amount",
                label: "Amount",
                type: "currency",
                sortable: true
            },
            {
                key: "mode",
                label: "Mode"
            },
            {
                key: "reference",
                label: "Reference",
                type: "mono"
            },
            {
                key: "dueDate",
                label: "Due",
                type: "date",
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
                id: "paid",
                label: "Record full payment",
                permission: "edit",
                effect: {
                    set: {
                        status: "Paid"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Paid"
                    ]
                },
                confirm: {
                    title: "Record payment as received?",
                    description: "The server allocates the payment against the order and recalculates outstanding.",
                    requireReason: true
                }
            }
        ]
    },
    "b2b.settlements": {
        title: "Settlements",
        description: "Seller payable less deductions. Settlement is held while claims or disputes are open.",
        permission: "b2b.finance",
        collection: "b2bSettlements",
        api: "GET/POST /api/b2b/settlements",
        searchFields: [
            "id",
            "orderId",
            "seller"
        ],
        tabs: {
            field: "status",
            values: [
                "Not Eligible",
                "Eligible",
                "Hold",
                "Processing",
                "Paid"
            ]
        },
        columns: [
            {
                key: "id",
                label: "Settlement",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/b2b/orders/{orderId}"
            },
            {
                key: "seller",
                label: "Seller"
            },
            {
                key: "grossPayable",
                label: "Gross payable",
                type: "currency"
            },
            {
                key: "deductions",
                label: "Deductions",
                type: "currency"
            },
            {
                key: "netPayable",
                label: "Net payable",
                type: "currency",
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
                id: "process",
                label: "Start processing",
                permission: "edit",
                effect: {
                    set: {
                        status: "Processing"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Eligible"
                    ]
                }
            },
            {
                id: "hold",
                label: "Hold",
                permission: "edit",
                effect: {
                    set: {
                        status: "Hold"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Eligible",
                        "Processing"
                    ]
                },
                confirm: {
                    title: "Hold settlement?",
                    requireReason: true
                }
            },
            {
                id: "paid",
                label: "Mark paid",
                permission: "edit",
                effect: {
                    set: {
                        status: "Paid"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Processing"
                    ]
                },
                confirm: {
                    title: "Mark settlement paid?",
                    requireReason: true
                }
            }
        ]
    },
    "b2b.claims": {
        title: "Returns / Claims",
        description: "Damage, shortage and wrong-item claims with evidence and resolution.",
        permission: "b2b.orders",
        collection: "claims",
        api: "GET/POST /api/b2b/claims",
        searchFields: [
            "id",
            "orderId",
            "buyer"
        ],
        filterFields: [
            "type",
            "owner"
        ],
        filters: [
            {
                key: "type",
                label: "Type",
                options: [
                    "Damage",
                    "Shortage",
                    "Wrong item"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Open",
                "Evidence Pending",
                "Under Review",
                "Approved",
                "Rejected",
                "Settled"
            ]
        },
        columns: [
            {
                key: "id",
                label: "Claim",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/b2b/orders/{orderId}"
            },
            {
                key: "buyer",
                label: "Buyer"
            },
            {
                key: "type",
                label: "Type"
            },
            {
                key: "amount",
                label: "Amount",
                type: "currency",
                sortable: true
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Raised",
                type: "date",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "approve",
                label: "Approve claim",
                permission: "edit",
                effect: {
                    set: {
                        status: "Approved"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Open",
                        "Evidence Pending",
                        "Under Review"
                    ]
                },
                confirm: {
                    title: "Approve claim?",
                    requireReason: true
                }
            },
            {
                id: "reject",
                label: "Reject claim",
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
                        "Open",
                        "Evidence Pending",
                        "Under Review"
                    ]
                },
                confirm: {
                    title: "Reject claim?",
                    requireReason: true
                }
            }
        ]
    },
    "b2b.alerts": {
        title: "Alerts",
        description: "SLA, pricing, margin, payment and exception alerts from the B2B alert engine.",
        permission: "b2b",
        collection: "b2bAlerts",
        api: "GET/PATCH /api/b2b/alerts",
        searchFields: [
            "type",
            "entity",
            "assignedTo"
        ],
        filterFields: [
            "severity",
            "type"
        ],
        filters: [
            {
                key: "severity",
                label: "Severity",
                options: [
                    "High",
                    "Medium",
                    "Low"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Open",
                "Acknowledged",
                "Resolved"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "type",
                label: "Alert",
                emphasis: true,
                sub: "trigger"
            },
            {
                key: "severity",
                label: "Severity",
                type: "status"
            },
            {
                key: "entity",
                label: "Entity",
                type: "mono"
            },
            {
                key: "assignedTo",
                label: "Assigned to"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Raised",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "ack",
                label: "Acknowledge",
                permission: "view",
                effect: {
                    set: {
                        status: "Acknowledged"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Open"
                    ]
                }
            },
            {
                id: "resolve",
                label: "Resolve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Resolved"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Resolved"
                    ]
                }
            }
        ]
    },
    bulk: {
        title: "Bulk Inquiries",
        description: "Older bulk-order module (legacy b2b_orders table, Shiprocket Cargo). Service charge = line total − NRV, ex-GST.",
        permission: "bulk",
        collection: "bulkInquiries",
        api: "GET /api/admin/bulk-orders/inquiries",
        search: "Search buyer, product or city",
        searchFields: [
            "buyer",
            "product",
            "city",
            "id"
        ],
        tabs: {
            field: "status",
            values: [
                "New",
                "Quoted",
                "Converted",
                "Closed"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Inquiry",
                type: "mono"
            },
            {
                key: "buyer",
                label: "Buyer"
            },
            {
                key: "mobile",
                label: "Mobile",
                type: "mobile"
            },
            {
                key: "product",
                label: "Product",
                width: 260
            },
            {
                key: "quantity",
                label: "Quantity"
            },
            {
                key: "city",
                label: "City"
            },
            {
                key: "serviceCharge",
                label: "Service charge",
                type: "currency"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "createdAt",
                label: "Received",
                type: "date",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "quote",
                label: "Mark quoted",
                permission: "edit",
                effect: {
                    set: {
                        status: "Quoted"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "New"
                    ]
                }
            },
            {
                id: "close",
                label: "Close",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Closed"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Closed",
                        "Converted"
                    ]
                },
                confirm: {
                    title: "Close inquiry?",
                    requireReason: true
                }
            }
        ]
    },
    "bulk.warehouses": {
        title: "Warehouses",
        description: "Pickup warehouses registered for bulk / cargo shipments.",
        permission: "bulk",
        collection: "warehouses",
        api: "GET /api/admin/bulk-orders/warehouses",
        searchFields: [
            "name",
            "vendor",
            "city"
        ],
        columns: [
            {
                key: "name",
                label: "Warehouse",
                emphasis: true
            },
            {
                key: "vendor",
                label: "Vendor"
            },
            {
                key: "city",
                label: "City"
            },
            {
                key: "pincode",
                label: "Pincode",
                type: "mono"
            },
            {
                key: "contact",
                label: "Contact"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    },
    "operations.ndr": {
        title: "NDR Register",
        description: "Keyed by AWB + attempt (not invoice) so multi-vendor orders keep separate NDRs.",
        permission: "operations.center",
        headerActions: [
            {
                label: "Escalations",
                href: "/admin/operations/escalations"
            }
        ],
        collection: "ndr",
        ownerField: "owner",
        api: "GET/POST operations_center/api/ndr.php → /api/admin/operations/ndr",
        search: "Search order or AWB",
        searchFields: [
            "id",
            "orderId",
            "awb"
        ],
        filterFields: [
            "courier",
            "owner",
            "status"
        ],
        filters: [
            {
                key: "courier",
                label: "Courier",
                options: [
                    "NimbusPost",
                    "Shiprocket",
                    "Delhivery"
                ]
            },
            {
                key: "owner",
                label: "Agent",
                options: agents
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Pending",
                "In Progress",
                "Resolved"
            ]
        },
        defaultSort: "raisedAt:desc",
        columns: [
            {
                key: "id",
                label: "NDR",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "awb",
                label: "AWB",
                type: "mono",
                sub: "courier"
            },
            {
                key: "attempt",
                label: "Attempt",
                type: "number"
            },
            {
                key: "reason",
                label: "NDR reason",
                width: 200
            },
            {
                key: "customerResponse",
                label: "Customer response"
            },
            {
                key: "nextAction",
                label: "Next action"
            },
            {
                key: "owner",
                label: "Agent"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "reattempt",
                label: "Request reattempt",
                permission: "edit",
                effect: {
                    set: {
                        status: "In Progress",
                        nextAction: "Reattempt"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Pending"
                    ]
                }
            },
            {
                id: "resolve",
                label: "Resolve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Resolved"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Resolved"
                    ]
                },
                confirm: {
                    title: "Resolve NDR?",
                    requireReason: true,
                    description: "Add the resolution note for the action trail."
                }
            },
            {
                id: "rto",
                label: "Mark for RTO",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Resolved",
                        nextAction: "Mark RTO"
                    }
                },
                when: {
                    field: "status",
                    notIn: [
                        "Resolved"
                    ]
                },
                confirm: {
                    title: "Mark for RTO?",
                    description: "The parcel will return to the vendor; an RTO ledger row is written by the server.",
                    requireReason: true
                }
            }
        ]
    },
    "operations.escalations": {
        title: "Escalations",
        description: "Raised by the 30-minute rule engine (de-duplicated) or manually. Cleared conditions auto-close.",
        permission: "operations.center",
        headerActions: [
            {
                label: "NDR register",
                href: "/admin/operations/ndr"
            }
        ],
        collection: "escalations",
        ownerField: "owner",
        api: "operations_center/api/escalations.php → /api/admin/operations/escalations",
        searchFields: [
            "id",
            "orderId",
            "rule",
            "title"
        ],
        filterFields: [
            "severity",
            "owner",
            "source"
        ],
        filters: [
            {
                key: "severity",
                label: "Severity",
                options: [
                    "High",
                    "Medium",
                    "Low"
                ]
            },
            {
                key: "owner",
                label: "Agent",
                options: agents
            },
            {
                key: "source",
                label: "Source",
                options: [
                    "Engine",
                    "Manual"
                ]
            }
        ],
        tabs: {
            field: "status",
            values: [
                "Open",
                "Acknowledged",
                "Resolved",
                "Auto-Closed"
            ]
        },
        defaultSort: "firstSeenAt:desc",
        columns: [
            {
                key: "id",
                label: "Escalation",
                type: "mono"
            },
            {
                key: "title",
                label: "Issue",
                width: 260,
                sub: "rule"
            },
            {
                key: "severity",
                label: "Severity",
                type: "status"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "owner",
                label: "Owner"
            },
            {
                key: "source",
                label: "Source",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "firstSeenAt",
                label: "First seen",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "ack",
                label: "Acknowledge",
                permission: "edit",
                effect: {
                    set: {
                        status: "Acknowledged"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Open"
                    ]
                }
            },
            {
                id: "resolve",
                label: "Resolve",
                permission: "edit",
                effect: {
                    set: {
                        status: "Resolved"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Open",
                        "Acknowledged"
                    ]
                },
                confirm: {
                    title: "Resolve escalation?",
                    requireReason: true
                }
            }
        ],
        bulkActions: [
            {
                id: "ack",
                label: "Acknowledge",
                permission: "edit",
                effect: {
                    set: {
                        status: "Acknowledged"
                    }
                }
            }
        ]
    },
    "operations.recordings": {
        title: "Call Recordings",
        description: "Every recorded customer call from the Command Center (≤ 25 MB per file).",
        permission: "operations.center",
        collection: "recordings",
        api: "operations_center/api/calls.php?action=recordings",
        searchFields: [
            "id",
            "orderId",
            "agent"
        ],
        filterFields: [
            "agent",
            "direction",
            "status"
        ],
        filters: [
            {
                key: "agent",
                label: "Agent",
                options: agents
            },
            {
                key: "direction",
                label: "Direction",
                options: [
                    "Outbound",
                    "Inbound"
                ]
            }
        ],
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "id",
                label: "Recording",
                type: "mono"
            },
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "agent",
                label: "Agent"
            },
            {
                key: "direction",
                label: "Direction"
            },
            {
                key: "status",
                label: "Call status",
                type: "status"
            },
            {
                key: "durationSec",
                label: "Duration (s)",
                type: "number",
                sortable: true
            },
            {
                key: "sizeMb",
                label: "Size (MB)",
                type: "number"
            },
            {
                key: "createdAt",
                label: "Recorded",
                type: "datetime",
                sortable: true
            }
        ]
    },
    "operations.rules": {
        title: "Escalation Rules",
        description: "Thresholds read by the escalation engine on every run. Only full admins can change them.",
        permission: "operations.rules",
        headerActions: [
            {
                label: "SLA clocks",
                href: "/admin/operations/sla"
            }
        ],
        collection: "escalationRules",
        api: "operations_center/api/settings.php?action=save_rule",
        columns: [
            {
                key: "code",
                label: "Rule code",
                type: "mono"
            },
            {
                key: "description",
                label: "Fires when",
                width: 280
            },
            {
                key: "thresholdHours",
                label: "Hours",
                type: "number"
            },
            {
                key: "thresholdCount",
                label: "Count",
                type: "number"
            },
            {
                key: "severity",
                label: "Severity",
                type: "status"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit threshold",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "thresholdHours",
                    label: "Threshold hours",
                    type: "number",
                    min: 0,
                    max: 720
                },
                {
                    name: "thresholdCount",
                    label: "Threshold count",
                    type: "number",
                    min: 0,
                    max: 20
                },
                {
                    name: "severity",
                    label: "Severity",
                    type: "select",
                    options: [
                        "High",
                        "Medium",
                        "Low"
                    ],
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "operations.sla": {
        title: "SLA Clocks",
        description: "Stage SLA in hours. Tracker shows “at risk” at the warn % and “breached” past the clock.",
        permission: "operations.rules",
        headerActions: [
            {
                label: "Escalation rules",
                href: "/admin/operations/rules"
            }
        ],
        collection: "slaConfig",
        api: "operations_center/api/settings.php?action=save_sla",
        columns: [
            {
                key: "name",
                label: "Stage",
                emphasis: true,
                sub: "code"
            },
            {
                key: "slaHours",
                label: "SLA (hours)",
                type: "number"
            },
            {
                key: "warnPercent",
                label: "Warn at",
                type: "percent"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "slaHours",
                    label: "SLA hours",
                    type: "number",
                    min: 1,
                    max: 720,
                    required: true
                },
                {
                    name: "warnPercent",
                    label: "Warn at %",
                    type: "number",
                    min: 50,
                    max: 99,
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "operations.assignments": {
        title: "Order Assignment",
        description: "Order lines (order + invoice grain) assigned to operations agents. Auto-assign gives work to the least-loaded agent.",
        permission: "operations.team",
        collection: "opsTracker",
        ownerField: "agent",
        api: "operations_team/api/assign_orders.php → /api/admin/operations/assignments",
        search: "Search order, invoice or vendor",
        searchFields: [
            "orderId",
            "invoice",
            "vendor",
            "customer",
            "awb"
        ],
        filterFields: [
            "agent",
            "stage",
            "slaState"
        ],
        filters: [
            {
                key: "agent",
                label: "Agent",
                options: agents
            },
            {
                key: "slaState",
                label: "SLA",
                options: [
                    "On track",
                    "At risk",
                    "Breached"
                ]
            }
        ],
        tabs: {
            field: "stage",
            values: [
                "pending",
                "processing",
                "packed",
                "shipped",
                "ndr",
                "rto",
                "delivered",
                "cancelled"
            ]
        },
        defaultSort: "createdAt:desc",
        columns: [
            {
                key: "orderId",
                label: "Order",
                type: "mono",
                href: "/admin/orders/{orderId}"
            },
            {
                key: "invoice",
                label: "Invoice",
                type: "mono"
            },
            {
                key: "vendor",
                label: "Vendor",
                width: 180
            },
            {
                key: "customer",
                label: "Customer"
            },
            {
                key: "status",
                label: "Line status",
                type: "status"
            },
            {
                key: "agent",
                label: "Agent"
            },
            {
                key: "slaState",
                label: "SLA",
                type: "status"
            },
            {
                key: "value",
                label: "Value",
                type: "currency",
                sortable: true
            },
            {
                key: "createdAt",
                label: "Placed",
                type: "datetime",
                sortable: true
            }
        ],
        bulkActions: [
            {
                id: "assign",
                label: "Assign to agent…",
                permission: "edit",
                assign: {
                    field: "agent",
                    label: "Assign to agent",
                    options: agents
                },
                confirm: {
                    title: "Assign selected order lines?",
                    description: "The agent sees these lines in their queue."
                }
            }
        ]
    },
    /** Agent Master card on the setup page (no route of its own; see operations/team/setup/page.js). */ "operations.agentMaster": {
        title: "Agent Master",
        permission: "operations.setup",
        api: "operations_team/setup → /api/admin/operations/agent-master",
        columns: [
            {
                key: "name",
                label: "Agent",
                emphasis: true
            },
            {
                key: "role",
                label: "Role"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        form: {
            title: "Agent",
            fields: [
                {
                    name: "userId",
                    label: "Agent",
                    type: "select",
                    optionsFrom: "lookup:ops-agent-candidates",
                    required: true,
                    only: "new"
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: [
                        "Active",
                        "Inactive"
                    ],
                    default: "Active",
                    required: true
                }
            ]
        }
    },
    "operations.setup": {
        title: "Agents & KPI Targets",
        description: "Agent master (role IDs 32, 57, 66) and KPI targets / KRI thresholds.",
        permission: "operations.setup",
        collection: "kpiTargets",
        api: "operations_team/setup → /api/admin/operations/kpi-targets",
        columns: [
            {
                key: "name",
                label: "KPI",
                emphasis: true
            },
            {
                key: "target",
                label: "Target",
                type: "percent"
            },
            {
                key: "kri",
                label: "KRI threshold",
                type: "percent"
            },
            {
                key: "actual",
                label: "Actual (MTD)",
                type: "percent"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "target",
                    label: "Target %",
                    type: "number",
                    min: 0,
                    max: 100,
                    required: true
                },
                {
                    name: "kri",
                    label: "KRI threshold %",
                    type: "number",
                    min: 0,
                    max: 100,
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "support.sla": {
        title: "Departments & SLA",
        description: "Ticket SLA by priority and category, and the owning department.",
        permission: "support.settings",
        collection: "supportSla",
        api: "GET/PATCH /api/admin/support/sla",
        columns: [
            {
                key: "rule",
                label: "Rule",
                emphasis: true
            },
            {
                key: "department",
                label: "Department"
            },
            {
                key: "slaHours",
                label: "SLA (hours)",
                type: "number"
            }
        ],
        noAdd: true,
        rowActions: [
            {
                id: "edit",
                label: "Edit",
                kind: "form",
                permission: "edit"
            }
        ],
        form: {
            fields: [
                {
                    name: "department",
                    label: "Department",
                    type: "select",
                    options: [
                        "Vendor Support",
                        "Logistics",
                        "Finance",
                        "Tech",
                        "All"
                    ],
                    required: true
                },
                {
                    name: "slaHours",
                    label: "SLA hours",
                    type: "number",
                    min: 1,
                    max: 240,
                    required: true
                }
            ],
            requireReason: true
        }
    }
};
}),
"[project]/src/lib/content/admin/resources/admin.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminResources",
    ()=>adminResources
]);
const deleteAction = {
    id: "delete",
    label: "Delete",
    permission: "delete",
    tone: "danger",
    effect: {
        remove: true
    },
    confirm: {
        title: "Delete permanently?",
        description: "This cannot be undone."
    }
};
const HOME_PRODUCT_SECTIONS = [
    "prod_section_1",
    "prod_section_2",
    "prod_section_3",
    ...Array.from({
        length: 13
    }, (_, i)=>`prod_section_${i + 10}`)
];
const HOME_BANNER_IMAGE = "image/jpeg,image/png,image/webp,image/gif";
const editAction = {
    id: "edit",
    label: "Edit",
    kind: "form",
    permission: "edit"
};
const toggle = (field, on, off)=>[
        {
            id: "enable",
            label: `Set ${on}`,
            permission: "edit",
            effect: {
                set: {
                    [field]: on
                }
            },
            when: {
                field,
                notIn: [
                    on
                ]
            }
        },
        {
            id: "disable",
            label: `Set ${off}`,
            permission: "edit",
            tone: "danger",
            effect: {
                set: {
                    [field]: off
                }
            },
            when: {
                field,
                in: [
                    on
                ]
            },
            confirm: {
                title: `Set to ${off}?`,
                description: "Visitors will no longer see this item."
            }
        }
    ];
const adminResources = {
    "cms.banners": {
        title: "Banners",
        description: "Hero and strip banners on the storefront and app, with placement, order and schedule.",
        permission: "cms",
        collection: "banners",
        api: "GET/POST /api/admin/cms/banners",
        searchFields: [
            "title",
            "placement"
        ],
        filterFields: [
            "placement",
            "status"
        ],
        filters: [
            {
                key: "placement",
                label: "Placement",
                options: [
                    "Horizontal big product",
                    "2x2 grid",
                    "3x1 grid",
                    "Vertical",
                    "Small banner",
                    "Small banner with background",
                    "Big banner",
                    "Horizontal small category",
                    "Horizontal with background",
                    "Category",
                    "Product",
                    "Custom Search"
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
        defaultSort: "order:asc",
        columns: [
            {
                key: "title",
                label: "Banner",
                emphasis: true,
                sub: "link"
            },
            {
                key: "placement",
                label: "Placement"
            },
            {
                key: "order",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "startsAt",
                label: "Starts",
                type: "date"
            },
            {
                key: "endsAt",
                label: "Ends",
                type: "date"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            title: "Banner",
            fields: [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true,
                    maxLength: 255
                },
                {
                    name: "placement",
                    label: "Layout or click type",
                    type: "select",
                    options: [
                        "Horizontal big product",
                        "2x2 grid",
                        "3x1 grid",
                        "Vertical",
                        "Small banner",
                        "Small banner with background",
                        "Big banner",
                        "Horizontal small category",
                        "Horizontal with background",
                        "Category",
                        "Product",
                        "Custom Search"
                    ],
                    required: true
                },
                {
                    name: "link",
                    label: "Target (category id, product id, or search text)",
                    type: "text",
                    required: false,
                    maxLength: 255
                },
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 0,
                    max: 9999,
                    required: true
                },
                {
                    name: "image",
                    label: "Image path (app banners)",
                    type: "text",
                    required: false,
                    maxLength: 500
                }
            ],
            defaults: {
                status: "Active"
            }
        }
    },
    "cms.homeSections": {
        title: "Home Sections",
        description: "Order of the homepage blocks, and the title stored for each product section. Banners and the products inside a section are on the other tabs.",
        permission: "cms",
        collection: "homeSections",
        api: "GET/PATCH /api/admin/cms/home-sections",
        search: "Search section",
        searchFields: [
            "name",
            "key"
        ],
        defaultSort: "order:asc",
        columns: [
            {
                key: "name",
                label: "Section",
                emphasis: true,
                sub: "key"
            },
            {
                key: "order",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "items",
                label: "Items",
                type: "number"
            }
        ],
        noAdd: true,
        rowActions: [
            editAction
        ],
        form: {
            title: "Section",
            fields: [
                {
                    name: "name",
                    label: "Section title",
                    type: "text",
                    required: true,
                    maxLength: 200,
                    hint: "Saved for product sections. Other sections keep their built-in name."
                },
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 1,
                    max: 40,
                    required: true
                }
            ]
        }
    },
    "cms.homeBanners": {
        title: "Homepage Banners",
        description: "Hero, offer, square and promo banners from the homepage editor. Deleting a slot clears its image. Deleting a promo row removes it.",
        permission: "cms",
        collection: "homeBanners",
        api: "GET/POST /api/admin/cms/home-sections/banners",
        search: "Search slot, section or link",
        searchFields: [
            "slot",
            "section",
            "link",
            "imageUrl"
        ],
        filterFields: [
            "kind"
        ],
        filters: [
            {
                key: "kind",
                label: "Kind",
                options: [
                    "Slot",
                    "Promo",
                    "Title"
                ]
            }
        ],
        defaultSort: "section:asc",
        columns: [
            {
                key: "slot",
                label: "Slot",
                emphasis: true,
                sub: "section"
            },
            {
                key: "section",
                label: "Section",
                sortable: true
            },
            {
                key: "kind",
                label: "Kind"
            },
            {
                key: "image",
                label: "Image",
                type: "image"
            },
            {
                key: "imageUrl",
                label: "Image or title"
            },
            {
                key: "link",
                label: "Link"
            },
            {
                key: "imageMobile",
                label: "Mobile image",
                type: "image"
            },
            {
                key: "linkMobile",
                label: "Mobile link"
            },
            {
                key: "categoryId",
                label: "Category",
                type: "number"
            }
        ],
        rowActions: [
            editAction,
            {
                id: "delete",
                label: "Delete",
                permission: "delete",
                tone: "danger",
                effect: {
                    remove: true
                },
                when: {
                    field: "kind",
                    notIn: [
                        "Title"
                    ]
                },
                confirm: {
                    title: "Delete this banner?",
                    description: "A slot banner keeps its place and the image is cleared. A promo image row is removed."
                }
            }
        ],
        form: {
            title: "Banner",
            fields: [
                {
                    name: "kind",
                    label: "Kind",
                    type: "select",
                    options: [
                        "Slot",
                        "Promo"
                    ],
                    required: true,
                    only: "new",
                    hint: "Promo adds a row to the 1×1 banner list. Slot fills a homepage banner place."
                },
                {
                    name: "slot",
                    label: "Slot",
                    type: "text",
                    maxLength: 100,
                    hint: "Required for a slot. Examples: top1, bottom1, sec6, section_four_banner1."
                },
                {
                    name: "section",
                    label: "Section",
                    type: "text",
                    maxLength: 100,
                    hint: "Required for a slot. Examples: section1, section8, section6, section_four_banner, top_notification."
                },
                {
                    name: "link",
                    label: "Link",
                    type: "text",
                    maxLength: 2000
                },
                {
                    name: "linkMobile",
                    label: "Mobile link",
                    type: "text",
                    maxLength: 300
                },
                {
                    name: "imageUrl",
                    label: "Image URL or title text",
                    type: "text",
                    maxLength: 4000,
                    hint: "Used when you do not upload a file. Title rows store the heading here."
                },
                {
                    name: "image",
                    label: "Desktop image",
                    type: "file",
                    accept: HOME_BANNER_IMAGE,
                    maxBytes: 15 * 1024 * 1024
                },
                {
                    name: "imageMobileUrl",
                    label: "Mobile image URL",
                    type: "text",
                    maxLength: 500
                },
                {
                    name: "imageMobile",
                    label: "Mobile image",
                    type: "file",
                    accept: HOME_BANNER_IMAGE,
                    maxBytes: 15 * 1024 * 1024
                },
                {
                    name: "categoryId",
                    label: "Category id",
                    type: "number",
                    min: 0,
                    max: 1000000000,
                    hint: "Used by category tiles. Leave empty for other banners."
                }
            ]
        }
    },
    "cms.homeSectionItems": {
        title: "Section Items",
        description: "Products placed in a homepage product section. A section shows at most 18 live products.",
        permission: "cms",
        collection: "homeSectionItems",
        api: "GET/POST /api/admin/cms/home-sections/items",
        search: "Search product, id or SKU",
        searchFields: [
            "name",
            "productId",
            "sku",
            "section"
        ],
        filterFields: [
            "section",
            "status"
        ],
        filters: [
            {
                key: "section",
                label: "Section",
                options: HOME_PRODUCT_SECTIONS
            },
            {
                key: "status",
                label: "On homepage",
                options: [
                    "Active",
                    "Not on homepage"
                ]
            }
        ],
        defaultSort: "section:asc",
        columns: [
            {
                key: "image",
                label: "Image",
                type: "image"
            },
            {
                key: "name",
                label: "Product",
                emphasis: true,
                sub: "productId"
            },
            {
                key: "section",
                label: "Section",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            title: "Section item",
            fields: [
                {
                    name: "section",
                    label: "Section",
                    type: "select",
                    options: HOME_PRODUCT_SECTIONS,
                    required: true
                },
                {
                    name: "productId",
                    label: "Product",
                    type: "text",
                    required: true,
                    maxLength: 200,
                    hint: "Product id or the exact product name. The product must be live."
                }
            ]
        }
    },
    "cms.blogs": {
        title: "Blogs",
        description: "Agronomy articles shown on the storefront.",
        permission: "cms",
        collection: "blogs",
        api: "GET/POST /api/admin/cms/blogs",
        search: "Search title",
        searchFields: [
            "title",
            "author",
            "category"
        ],
        filterFields: [
            "status"
        ],
        tabs: {
            field: "status",
            values: [
                "Published",
                "Draft"
            ]
        },
        defaultSort: "publishedAt:desc",
        columns: [
            {
                key: "title",
                label: "Title",
                emphasis: true,
                width: 320
            },
            {
                key: "author",
                label: "Author"
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "publishedAt",
                label: "Date",
                type: "date",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            ...toggle("status", "Published", "Draft"),
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true,
                    maxLength: 255
                },
                {
                    name: "slug",
                    label: "Slug",
                    type: "text",
                    maxLength: 200,
                    hint: "Leave blank to build it from the title. It stays unique."
                },
                {
                    name: "category",
                    label: "Category",
                    type: "text",
                    maxLength: 100,
                    default: "Agriculture",
                    hint: "For example Crop Protection, Irrigation, Seeds."
                },
                {
                    name: "excerpt",
                    label: "Short description",
                    type: "textarea",
                    required: true,
                    maxLength: 500,
                    rows: 3
                },
                {
                    name: "body",
                    label: "Content",
                    type: "html",
                    required: true,
                    maxLength: 500000
                },
                {
                    name: "image",
                    label: "Featured image",
                    type: "file",
                    accept: "image/jpeg,image/png,image/webp,image/gif"
                },
                {
                    name: "imageAlt",
                    label: "Image alt text",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "tags",
                    label: "Tags",
                    type: "text",
                    maxLength: 255,
                    hint: "Comma-separated."
                },
                {
                    name: "metaTitle",
                    label: "Meta title",
                    type: "text",
                    maxLength: 255,
                    hint: "Uses the title when left blank."
                },
                {
                    name: "metaDescription",
                    label: "Meta description",
                    type: "textarea",
                    maxLength: 255,
                    rows: 2,
                    hint: "Uses the short description when left blank."
                },
                {
                    name: "metaKeywords",
                    label: "Meta keywords",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "canonicalUrl",
                    label: "Canonical URL",
                    type: "text",
                    maxLength: 255
                },
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: [
                        "Published",
                        "Draft"
                    ],
                    required: true,
                    default: "Draft"
                },
                {
                    name: "publishedAt",
                    label: "Published date",
                    type: "date",
                    hint: "Published posts without a date go live now."
                },
                {
                    name: "featured",
                    label: "Featured",
                    type: "select",
                    options: [
                        "Yes",
                        "No"
                    ],
                    required: true,
                    default: "No"
                }
            ]
        }
    },
    "cms.events": {
        title: "Events",
        description: "Kisan melas, field demos and FPO meets.",
        permission: "cms",
        collection: "events",
        api: "GET/POST /api/admin/cms/events",
        tabs: {
            field: "status",
            values: [
                "Upcoming",
                "Completed"
            ]
        },
        defaultSort: "date:desc",
        columns: [
            {
                key: "title",
                label: "Event",
                emphasis: true
            },
            {
                key: "city",
                label: "City"
            },
            {
                key: "date",
                label: "Date",
                type: "date",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true
                },
                {
                    name: "city",
                    label: "City",
                    type: "text",
                    required: true
                },
                {
                    name: "date",
                    label: "Date",
                    type: "date",
                    required: true
                }
            ],
            defaults: {
                status: "Upcoming"
            }
        }
    },
    "cms.faqs": {
        title: "FAQs",
        description: "Help-centre questions grouped by category.",
        permission: "cms",
        collection: "faqs",
        api: "GET/POST /api/admin/cms/faqs",
        search: "Search question",
        searchFields: [
            "question"
        ],
        filterFields: [
            "category"
        ],
        filters: [
            {
                key: "category",
                label: "Category",
                options: [
                    "Orders",
                    "Payments",
                    "Returns",
                    "Sellers"
                ]
            }
        ],
        defaultSort: "order:asc",
        columns: [
            {
                key: "question",
                label: "Question",
                emphasis: true,
                width: 360
            },
            {
                key: "category",
                label: "Category"
            },
            {
                key: "order",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "question",
                    label: "Question",
                    type: "text",
                    required: true
                },
                {
                    name: "answer",
                    label: "Answer",
                    type: "textarea",
                    required: true
                },
                {
                    name: "category",
                    label: "Category",
                    type: "select",
                    options: [
                        "Orders",
                        "Payments",
                        "Returns",
                        "Sellers"
                    ],
                    required: true
                },
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 1,
                    max: 100,
                    required: true
                }
            ],
            defaults: {
                status: "Active"
            }
        }
    },
    "cms.pages": {
        title: "Pages",
        description: "Policy and information pages. Changes to legal pages are audited.",
        permission: "cms.pages",
        collection: "pages",
        api: "GET/PATCH /api/admin/cms/pages",
        searchFields: [
            "title",
            "slug"
        ],
        defaultSort: "updatedAt:desc",
        columns: [
            {
                key: "title",
                label: "Page",
                emphasis: true,
                sub: "slug"
            },
            {
                key: "updatedBy",
                label: "Updated by"
            },
            {
                key: "updatedAt",
                label: "Updated",
                type: "date",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        noAdd: true,
        rowActions: [
            editAction
        ],
        form: {
            fields: [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true
                },
                {
                    name: "body",
                    label: "Content",
                    type: "textarea",
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "cms.footer": {
        title: "Footer Links",
        description: "Footer columns and links.",
        permission: "cms",
        collection: "footerLinks",
        api: "GET/POST /api/admin/cms/footer",
        filterFields: [
            "column"
        ],
        filters: [
            {
                key: "column",
                label: "Column",
                options: [
                    "Company",
                    "Help",
                    "Policies",
                    "Sell"
                ]
            }
        ],
        defaultSort: "order:asc",
        columns: [
            {
                key: "column",
                label: "Column"
            },
            {
                key: "label",
                label: "Label",
                emphasis: true
            },
            {
                key: "url",
                label: "URL",
                type: "mono"
            },
            {
                key: "order",
                label: "Order",
                type: "number",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "column",
                    label: "Column",
                    type: "select",
                    options: [
                        "Company",
                        "Help",
                        "Policies",
                        "Sell"
                    ],
                    required: true
                },
                {
                    name: "label",
                    label: "Label",
                    type: "text",
                    required: true
                },
                {
                    name: "url",
                    label: "URL (path)",
                    type: "text",
                    required: true,
                    pattern: "^/[a-z0-9/-]*$",
                    patternMessage: "Use a site path like /returns."
                },
                {
                    name: "order",
                    label: "Order",
                    type: "number",
                    min: 1,
                    max: 50,
                    required: true
                }
            ],
            defaults: {
                status: "Active"
            }
        }
    },
    "cms.notifications": {
        title: "Push Notifications",
        description: "App push campaigns. Sending is queued on the server; the browser never holds FCM keys.",
        permission: "cms.notifications",
        collection: "pushNotifications",
        api: "POST /api/admin/notifications/push",
        tabs: {
            field: "status",
            values: [
                "Saved"
            ]
        },
        defaultSort: "sentAt:desc",
        columns: [
            {
                key: "title",
                label: "Notification",
                emphasis: true
            },
            {
                key: "audience",
                label: "Audience"
            },
            {
                key: "sentAt",
                label: "Sent",
                type: "datetime",
                sortable: true
            },
            {
                key: "reach",
                label: "Reach",
                type: "number"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            {
                id: "cancel",
                label: "Delete",
                permission: "delete",
                tone: "danger",
                effect: {
                    remove: true
                },
                when: {
                    field: "status",
                    in: [
                        "Saved"
                    ]
                },
                confirm: {
                    title: "Delete this notification?"
                }
            }
        ],
        form: {
            title: "New push notification",
            fields: [
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                    required: true,
                    maxLength: 255
                },
                {
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    required: true,
                    maxLength: 2000
                },
                {
                    name: "audience",
                    label: "Click type",
                    type: "select",
                    options: [
                        "Home",
                        "Product",
                        "Category",
                        "Search"
                    ],
                    required: true
                },
                {
                    name: "productId",
                    label: "Product id (click type Product)",
                    type: "text",
                    required: false,
                    maxLength: 50
                },
                {
                    name: "categoryId",
                    label: "Category id (click type Category)",
                    type: "text",
                    required: false,
                    maxLength: 50
                },
                {
                    name: "search",
                    label: "Search text (click type Search)",
                    type: "text",
                    required: false,
                    maxLength: 200
                }
            ],
            defaults: {
                status: "Saved",
                reach: 0,
                sentAt: null,
                audience: "Home"
            },
            requireReason: true
        }
    },
    users: {
        title: "Staff Users",
        description: "Admin panel accounts. Each user has exactly one role; role permissions decide what they can see and do.",
        permission: "users",
        collection: "staff",
        api: "GET/POST /api/admin/users",
        search: "Search name or email",
        searchFields: [
            "name",
            "email",
            "id"
        ],
        filterFields: [
            "roleName",
            "status"
        ],
        tabs: {
            field: "status",
            values: [
                "Active",
                "Inactive"
            ]
        },
        columns: [
            {
                key: "name",
                label: "Name",
                emphasis: true,
                sub: "id"
            },
            {
                key: "email",
                label: "Email"
            },
            {
                key: "roleName",
                label: "Role"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            },
            {
                key: "lastLoginAt",
                label: "Last login",
                type: "datetime",
                sortable: true
            }
        ],
        rowActions: [
            {
                id: "editRole",
                label: "Change role",
                kind: "form",
                permission: "edit"
            },
            {
                id: "deactivate",
                label: "Deactivate",
                permission: "edit",
                tone: "danger",
                effect: {
                    set: {
                        status: "Inactive"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Active"
                    ]
                },
                confirm: {
                    title: "Deactivate user?",
                    description: "Their sessions stop working on the next request.",
                    requireReason: true
                }
            },
            {
                id: "activate",
                label: "Activate",
                permission: "edit",
                effect: {
                    set: {
                        status: "Active"
                    }
                },
                when: {
                    field: "status",
                    in: [
                        "Inactive"
                    ]
                },
                confirm: {
                    title: "Re-activate user?",
                    requireReason: true
                }
            }
        ],
        form: {
            title: "Staff user",
            fields: [
                {
                    name: "name",
                    label: "Full name",
                    type: "text",
                    required: true
                },
                {
                    name: "email",
                    label: "Work email",
                    type: "email",
                    required: true
                },
                {
                    name: "phone",
                    label: "Mobile",
                    type: "text",
                    required: false
                },
                {
                    name: "password",
                    label: "Password (required for a new user)",
                    type: "password",
                    required: false
                },
                {
                    name: "roleId",
                    label: "Role",
                    type: "select",
                    optionsFrom: "roles",
                    required: true
                }
            ],
            defaults: {
                status: "Active",
                lastLoginAt: null
            },
            derive: "staff",
            requireReason: true,
            unique: "email"
        }
    },
    audit: {
        title: "Audit Log",
        description: "Every sensitive change made in the Admin Panel: who, what, when, from where and why. Read-only.",
        permission: "audit",
        collection: "auditLog",
        api: "GET /api/admin/audit-log",
        search: "Search actor, action or entity",
        searchFields: [
            "actor",
            "action",
            "entity",
            "reason"
        ],
        filterFields: [
            "module"
        ],
        filters: [
            {
                key: "module",
                label: "Module",
                options: [
                    "Auth",
                    "Products",
                    "Orders",
                    "Payouts",
                    "Refunds",
                    "Roles",
                    "Users",
                    "Vendors",
                    "Finance",
                    "Settings",
                    "Catalog",
                    "Pricing",
                    "Shipping",
                    "CRM",
                    "B2B",
                    "Operations",
                    "Support",
                    "CMS",
                    "Masters"
                ]
            }
        ],
        dateField: "at",
        dateRange: true,
        defaultSort: "at:desc",
        exportable: true,
        columns: [
            {
                key: "at",
                label: "When",
                type: "datetime",
                sortable: true
            },
            {
                key: "actor",
                label: "Actor",
                sub: "actorId"
            },
            {
                key: "module",
                label: "Module"
            },
            {
                key: "action",
                label: "Action",
                emphasis: true
            },
            {
                key: "entity",
                label: "Entity",
                type: "mono"
            },
            {
                key: "reason",
                label: "Reason",
                width: 220
            },
            {
                key: "ip",
                label: "IP",
                type: "mono"
            }
        ]
    },
    "masters.geography": {
        title: "Country / State / City",
        description: "Location masters used by addresses, pincodes and shipping zones.",
        permission: "masters",
        collection: "geography",
        api: "GET/POST /api/admin/masters/geography",
        search: "Search name or code",
        searchFields: [
            "name",
            "code",
            "parent"
        ],
        tabs: {
            field: "type",
            values: [
                "Country",
                "State",
                "City"
            ]
        },
        columns: [
            {
                key: "name",
                label: "Name",
                emphasis: true
            },
            {
                key: "type",
                label: "Type"
            },
            {
                key: "parent",
                label: "Parent"
            },
            {
                key: "code",
                label: "Code",
                type: "mono"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            ...toggle("status", "Active", "Inactive")
        ],
        form: {
            fields: [
                {
                    name: "type",
                    label: "Type",
                    type: "select",
                    options: [
                        "State",
                        "City"
                    ],
                    required: true
                },
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    required: true
                },
                {
                    name: "parent",
                    label: "Parent (country/state)",
                    type: "text",
                    required: true
                },
                {
                    name: "code",
                    label: "Code",
                    type: "text",
                    required: true
                }
            ],
            defaults: {
                status: "Active"
            }
        }
    },
    "masters.rejectReasons": {
        title: "Reject Reasons",
        description: "Standard reasons used when rejecting products, sellers and shipments.",
        permission: "masters",
        collection: "rejectReasons",
        api: "GET/POST /api/admin/masters/reject-reasons",
        tabs: {
            field: "type",
            values: [
                "Product",
                "Seller",
                "Shipment"
            ]
        },
        columns: [
            {
                key: "type",
                label: "Applies to"
            },
            {
                key: "reason",
                label: "Reason",
                emphasis: true,
                width: 360
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: [
            editAction,
            deleteAction
        ],
        form: {
            fields: [
                {
                    name: "type",
                    label: "Applies to",
                    type: "select",
                    options: [
                        "Product",
                        "Seller",
                        "Shipment"
                    ],
                    required: true
                },
                {
                    name: "reason",
                    label: "Reason",
                    type: "text",
                    required: true,
                    maxLength: 120
                }
            ],
            defaults: {
                status: "Active"
            }
        }
    },
    "masters.currency": {
        title: "Currency",
        description: "The marketplace runs in Indian Rupees only.",
        permission: "masters",
        collection: "currencies",
        api: "GET /api/admin/masters/currency",
        columns: [
            {
                key: "code",
                label: "Code",
                type: "mono"
            },
            {
                key: "name",
                label: "Name",
                emphasis: true
            },
            {
                key: "symbol",
                label: "Symbol"
            },
            {
                key: "default",
                label: "Default",
                type: "boolean"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    },
    "settings.emailTemplates": {
        title: "Email Templates",
        description: "Transactional email templates for customers and sellers.",
        permission: "settings",
        collection: "emailTemplates",
        api: "GET/PATCH /api/admin/settings/email-templates",
        searchFields: [
            "name",
            "subject"
        ],
        tabs: {
            field: "audience",
            values: [
                "Customer",
                "Seller"
            ]
        },
        columns: [
            {
                key: "name",
                label: "Template",
                emphasis: true
            },
            {
                key: "subject",
                label: "Subject",
                width: 320
            },
            {
                key: "audience",
                label: "Audience"
            },
            {
                key: "updatedAt",
                label: "Updated",
                type: "date",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        noAdd: true,
        rowActions: [
            editAction
        ],
        form: {
            fields: [
                {
                    name: "subject",
                    label: "Subject",
                    type: "text",
                    required: true
                },
                {
                    name: "body",
                    label: "Body",
                    type: "textarea",
                    required: true
                }
            ],
            requireReason: true
        }
    },
    "settings.languages": {
        title: "Languages",
        description: "Storefront and app languages with translated phrase counts.",
        permission: "settings",
        collection: "languages",
        api: "GET/PATCH /api/admin/settings/languages",
        columns: [
            {
                key: "name",
                label: "Language",
                emphasis: true
            },
            {
                key: "code",
                label: "Code",
                type: "mono"
            },
            {
                key: "phrases",
                label: "Phrases",
                type: "number"
            },
            {
                key: "default",
                label: "Default",
                type: "boolean"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ],
        rowActions: toggle("status", "Active", "Inactive")
    },
    "sales.team": {
        title: "Sales Team",
        description: "Sales executives (role 56) and managers (role 59) with circles and reporting manager.",
        permission: "sales",
        collection: "salesTeam",
        api: "GET /api/admin/sales/team",
        searchFields: [
            "name",
            "circles"
        ],
        filterFields: [
            "role"
        ],
        filters: [
            {
                key: "role",
                label: "Role",
                options: [
                    "Sales Executive",
                    "Sales Manager"
                ]
            }
        ],
        columns: [
            {
                key: "name",
                label: "Name",
                emphasis: true,
                sub: "id"
            },
            {
                key: "role",
                label: "Role"
            },
            {
                key: "experience",
                label: "Experience"
            },
            {
                key: "circles",
                label: "Circles"
            },
            {
                key: "manager",
                label: "Manager"
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    },
    "operations.agents": {
        title: "Agent Performance",
        description: "Per-agent load and KPI performance for the current month.",
        permission: "operations.team",
        collection: "opsAgents",
        api: "operations_team/api/team_performance.php",
        defaultSort: "assigned:desc",
        columns: [
            {
                key: "name",
                label: "Agent",
                emphasis: true,
                sub: "id"
            },
            {
                key: "roleId",
                label: "Role ID",
                type: "number"
            },
            {
                key: "assigned",
                label: "Assigned lines",
                type: "number",
                sortable: true
            },
            {
                key: "confirmedPct",
                label: "Confirmation",
                type: "percent",
                sortable: true
            },
            {
                key: "dispatch24Pct",
                label: "Dispatch ≤ 24h",
                type: "percent",
                sortable: true
            },
            {
                key: "ndrResolutionPct",
                label: "NDR resolution",
                type: "percent",
                sortable: true
            },
            {
                key: "calls",
                label: "Calls",
                type: "number",
                sortable: true
            },
            {
                key: "status",
                label: "Status",
                type: "status"
            }
        ]
    }
};
}),
"[project]/src/lib/content/admin/resources/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getResource",
    ()=>getResource,
    "getResourceByPath",
    ()=>getResourceByPath,
    "resourceRoutes",
    ()=>resourceRoutes,
    "resources",
    ()=>resources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/core.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/catalog.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$orders$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/orders.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$finance$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/finance.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$crm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/crm.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$b2b$2d$ops$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/b2b-ops.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$admin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/admin.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/parity/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/port/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const resources = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$core$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["coreResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["catalogResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$orders$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["orderResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$finance$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["financeResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$crm$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["crmResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$b2b$2d$ops$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["b2bOpsResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$admin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["adminResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parityResources"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["portResources"]
};
const resourceRoutes = {
    "/admin/orders": "orders",
    "/admin/products": "products",
    "/admin/products/pending": "products.pending",
    "/admin/vendors": "vendors",
    "/admin/vendors/scores": "vendors.scores",
    "/admin/customers": "customers",
    "/admin/shipping": "shipping",
    "/admin/returns": "returns",
    "/admin/refunds": "refunds",
    "/admin/rto": "rto",
    "/admin/payouts": "payouts",
    "/admin/support": "support",
    "/admin/crm/follow-ups": "crm.followUps",
    "/admin/catalog/categories": "catalog.categories",
    "/admin/catalog/brands": "catalog.brands",
    "/admin/catalog/attributes": "catalog.attributes",
    "/admin/catalog/tax-classes": "catalog.tax",
    "/admin/catalog/hsn-codes": "catalog.hsn",
    "/admin/catalog/return-policies": "catalog.returnPolicies",
    "/admin/pricing/master-nrv": "pricing.masterNrv",
    "/admin/pricing/commission": "pricing.commission",
    "/admin/pricing/cost-config": "pricing.costConfig",
    "/admin/orders/invoices": "orders.invoices",
    "/admin/orders/transactions": "orders.transactions",
    "/admin/orders/whatsapp": "orders.whatsapp",
    "/admin/orders/sr-checkout": "orders.srCheckout",
    "/admin/shipping/courier-slabs": "shipping.courierSlabs",
    "/admin/shipping/slabs": "shipping.slabs",
    "/admin/shipping/cod-rules": "shipping.codRules",
    "/admin/shipping/other-charges": "shipping.otherCharges",
    "/admin/shipping/package-boxes": "shipping.boxes",
    "/admin/shipping/weight-discrepancy": "shipping.weight",
    "/admin/shipping/pincodes": "shipping.pincodes",
    "/admin/returns/reasons": "returns.reasons",
    "/admin/vendors/verification": "vendors.verification",
    "/admin/vendors/reports": "vendors.reports",
    "/admin/payouts/items": "payouts.items",
    "/admin/payouts/access": "payouts.access",
    "/admin/payouts/legacy": "payouts.legacy",
    "/admin/finance/ledger": "finance.ledger",
    "/admin/finance/hold-ledger": "finance.holdLedger",
    "/admin/finance/cod": "finance.cod",
    "/admin/finance/gst": "finance.tax",
    "/admin/finance/fixed-expenses": "finance.fixedExpenses",
    "/admin/finance/wallet-withdrawals": "finance.wallet",
    "/admin/customers/coupons": "customers.coupons",
    "/admin/customers/reviews": "customers.reviews",
    "/admin/crm/leads": "crm.leads",
    "/admin/crm/legacy-leads": "crm.legacy",
    "/admin/crm/whatsapp": "crm.whatsapp",
    "/admin/crm/ai-calls": "crm.aiCalls",
    "/admin/crm/call-audit": "crm.callAudit",
    "/admin/crm/circles": "crm.circles",
    "/admin/sales/targets": "sales.targets",
    "/admin/sales/salary": "sales.salary",
    "/admin/sales/achievements": "sales.achievements",
    "/admin/sales/payouts": "sales.payouts",
    "/admin/sales/prepaid-incentive": "sales.prepaid",
    "/admin/sales/team": "sales.team",
    "/admin/b2b/buyers": "b2b.buyers",
    "/admin/b2b/rfqs": "b2b.rfqs",
    "/admin/b2b/quotations": "b2b.quotations",
    "/admin/b2b/orders": "b2b.orders",
    "/admin/b2b/payments": "b2b.payments",
    "/admin/b2b/settlements": "b2b.settlements",
    "/admin/b2b/claims": "b2b.claims",
    "/admin/b2b/alerts": "b2b.alerts",
    "/admin/bulk-orders": "bulk",
    "/admin/bulk-orders/warehouses": "bulk.warehouses",
    "/admin/inventory": "inventory",
    "/admin/inventory/history": "inventory.history",
    "/admin/operations/ndr": "operations.ndr",
    "/admin/operations/escalations": "operations.escalations",
    "/admin/operations/recordings": "operations.recordings",
    "/admin/operations/rules": "operations.rules",
    "/admin/operations/sla": "operations.sla",
    "/admin/operations/team/assignments": "operations.assignments",
    "/admin/operations/team/agents": "operations.agents",
    "/admin/operations/team/setup": "operations.setup",
    "/admin/support/sla": "support.sla",
    "/admin/cms/banners": "cms.banners",
    "/admin/cms/home-sections": "cms.homeSections",
    "/admin/cms/blogs": "cms.blogs",
    "/admin/cms/events": "cms.events",
    "/admin/cms/faqs": "cms.faqs",
    "/admin/cms/pages": "cms.pages",
    "/admin/cms/footer": "cms.footer",
    "/admin/cms/notifications": "cms.notifications",
    "/admin/users": "users",
    "/admin/audit": "audit",
    "/admin/masters/geography": "masters.geography",
    "/admin/masters/reject-reasons": "masters.rejectReasons",
    "/admin/masters/currency": "masters.currency",
    "/admin/settings/email-templates": "settings.emailTemplates",
    "/admin/settings/languages": "settings.languages",
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$parity$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parityRoutes"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$port$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["portRoutes"]
};
function getResource(key) {
    return resources[key] ?? null;
}
function getResourceByPath(pathname) {
    const key = resourceRoutes[pathname];
    return key ? {
        key,
        resource: resources[key]
    } : null;
}
}),
"[project]/src/lib/validation/admin/forms.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Field-level validation shared by the browser (instant feedback) and the
 * server (authoritative). Only fields declared in the form config are read,
 * so unknown keys sent by a client are dropped.
 */ __turbopack_context__.s([
    "formFieldsFor",
    ()=>formFieldsFor,
    "optionValues",
    ()=>optionValues,
    "validateField",
    ()=>validateField,
    "validateForm",
    ()=>validateForm,
    "validateReason",
    ()=>validateReason
]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
function optionValues(options = []) {
    return options.map((o)=>typeof o === "object" ? String(o.value) : String(o));
}
function validateField(field, raw, { options } = {}) {
    if (field.type === "checkbox") {
        const on = raw === true || raw === "1" || raw === "true" || raw === "on";
        return {
            value: on,
            error: field.required && !on ? `${field.label} is required.` : null
        };
    }
    if (field.type === "multiselect") {
        const list = (Array.isArray(raw) ? raw : typeof raw === "string" && raw ? raw.split(",") : []).map((v)=>String(v).trim()).filter(Boolean);
        const allowed = optionValues(options ?? field.options);
        if (field.required && !list.length) return {
            value: list,
            error: `${field.label} is required.`
        };
        const bad = allowed.length ? list.find((v)=>!allowed.includes(v)) : null;
        return {
            value: list,
            error: bad ? `Choose valid ${field.label.toLowerCase()}.` : null
        };
    }
    if (field.type === "file") return {
        value: null,
        error: null
    };
    const value = typeof raw === "string" ? field.type === "html" ? raw : raw.trim() : raw;
    const empty = value == null || value === "";
    if (empty) return {
        value: field.type === "number" ? null : "",
        error: field.required ? `${field.label} is required.` : null
    };
    switch(field.type){
        case "number":
            {
                const n = Number(value);
                if (!Number.isFinite(n)) return {
                    value: null,
                    error: `${field.label} must be a number.`
                };
                if (field.min != null && n < field.min) return {
                    value: n,
                    error: `${field.label} must be at least ${field.min}.`
                };
                if (field.max != null && n > field.max) return {
                    value: n,
                    error: `${field.label} must be at most ${field.max}.`
                };
                return {
                    value: n,
                    error: null
                };
            }
        case "email":
            return {
                value: String(value).toLowerCase(),
                error: EMAIL.test(value) ? null : "Enter a valid email address."
            };
        case "date":
            return {
                value,
                error: DATE.test(value) && !Number.isNaN(new Date(value).getTime()) ? null : "Enter a valid date."
            };
        case "select":
            {
                const allowed = optionValues(options ?? field.options);
                return {
                    value: String(value),
                    error: allowed.includes(String(value)) ? null : `Choose a valid ${field.label.toLowerCase()}.`
                };
            }
        case "color":
            return {
                value: String(value),
                error: /^#[0-9a-fA-F]{6}$/.test(String(value)) ? null : `${field.label} must be a colour like #1a2b3c.`
            };
        default:
            {
                const text = String(value);
                const max = field.maxLength ?? (field.type === "html" ? 200000 : field.type === "textarea" ? 4000 : 200);
                if (text.length > max) return {
                    value: text,
                    error: `${field.label} must be ${max} characters or fewer.`
                };
                if (field.pattern && !new RegExp(field.pattern).test(text)) return {
                    value: text,
                    error: field.patternMessage || `${field.label} is not in the right format.`
                };
                return {
                    value: text,
                    error: null
                };
            }
    }
}
function formFieldsFor(fields = [], isNew) {
    return fields.filter((f)=>!f.only || (f.only === "new" ? isNew : !isNew));
}
function validateForm(fields, input = {}, optionSets = {}) {
    const values = {};
    const errors = {};
    for (const field of fields){
        const { value, error } = validateField(field, input[field.name], {
            options: optionSets[field.name]
        });
        values[field.name] = value;
        if (error) errors[field.name] = error;
    }
    return {
        ok: Object.keys(errors).length === 0,
        values,
        errors
    };
}
function validateReason(reason, required, min = 5) {
    const text = typeof reason === "string" ? reason.trim() : "";
    if (required && text.length < min) return {
        ok: false,
        reason: text,
        error: min > 1 ? "Please give a reason (at least 5 characters)." : "Please select a reason."
    };
    return {
        ok: true,
        reason: text.slice(0, 500),
        error: null
    };
}
}),
"[project]/src/lib/services/admin/_query.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PAGE_SIZE",
    ()=>DEFAULT_PAGE_SIZE,
    "PAGE_SIZES",
    ()=>PAGE_SIZES,
    "countBy",
    ()=>countBy,
    "mockLatency",
    ()=>mockLatency,
    "parseListParams",
    ()=>parseListParams,
    "queryRows",
    ()=>queryRows,
    "sum",
    ()=>sum
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-rsc] (ecmascript)");
;
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZES = [
    10,
    25,
    50,
    100
];
async function mockLatency(ms = 120) {
    if ("TURBOPACK compile-time truthy", 1) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sleep"])(ms);
}
function parseListParams(searchParams = {}) {
    const get = (key)=>{
        const value = searchParams[key];
        return Array.isArray(value) ? value[0] : value;
    };
    const pageSize = PAGE_SIZES.includes(Number(get("pageSize"))) ? Number(get("pageSize")) : DEFAULT_PAGE_SIZE;
    const page = Math.max(1, Number.parseInt(get("page") || "1", 10) || 1);
    const filters = {};
    for (const [key, value] of Object.entries(searchParams)){
        if ([
            "page",
            "pageSize",
            "q",
            "sort",
            "from",
            "to"
        ].includes(key)) continue;
        const v = Array.isArray(value) ? value[0] : value;
        if (v != null && v !== "") filters[key] = String(v).slice(0, 120);
    }
    return {
        page,
        pageSize,
        q: (get("q") || "").toString().trim().slice(0, 120),
        sort: (get("sort") || "").toString(),
        from: get("from") || "",
        to: get("to") || "",
        filters
    };
}
function compare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), "en-IN", {
        numeric: true
    });
}
function queryRows(rows, params, { searchFields = [], filterFields = [], dateField, defaultSort } = {}) {
    let result = rows;
    if (params.q) {
        const needle = params.q.toLowerCase();
        result = result.filter((row)=>searchFields.some((field)=>String(row[field] ?? "").toLowerCase().includes(needle)));
    }
    for (const field of filterFields){
        const value = params.filters?.[field];
        if (value == null || value === "") continue;
        result = result.filter((row)=>String(row[field]) === value);
    }
    if (dateField && (params.from || params.to)) {
        const from = params.from ? new Date(`${params.from}T00:00:00+05:30`).getTime() : -Infinity;
        const to = params.to ? new Date(`${params.to}T23:59:59+05:30`).getTime() : Infinity;
        result = result.filter((row)=>{
            const t = new Date(row[dateField]).getTime();
            return t >= from && t <= to;
        });
    }
    const [sortField, sortDir] = (params.sort || defaultSort || "").split(":");
    if (sortField) {
        result = [
            ...result
        ].sort((a, b)=>(sortDir === "asc" ? 1 : -1) * compare(a[sortField], b[sortField]));
    }
    const total = result.length;
    const pageCount = Math.max(1, Math.ceil(total / params.pageSize));
    const page = Math.min(params.page, pageCount);
    const start = (page - 1) * params.pageSize;
    return {
        rows: result.slice(start, start + params.pageSize),
        total,
        page,
        pageSize: params.pageSize,
        pageCount,
        all: result
    };
}
function countBy(rows, field) {
    const counts = {};
    for (const row of rows)counts[row[field]] = (counts[row[field]] || 0) + 1;
    return counts;
}
function sum(rows, field) {
    return Math.round(rows.reduce((s, r)=>s + (Number(r[field]) || 0), 0) * 100) / 100;
}
}),
"[project]/src/lib/services/admin/live-fragments/cms-settings.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Live admin paths for CMS lists, settings, roles, minimums, expense caps and the NRV calculator.
 * Merge `resources` into LIVE_RESOURCES and `livePaths` into LIVE_ADMIN_PATHS.
 * cms.pages is not a second writer: the list service adapts /admin/custom-pages.
 */ __turbopack_context__.s([
    "livePaths",
    ()=>livePaths,
    "resources",
    ()=>resources
]);
const resources = {
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
    }
};
const livePaths = [
    "/admin/cms/banners",
    "/admin/cms/home-sections",
    "/admin/cms/pages",
    "/admin/cms/notifications",
    "/admin/roles",
    "/admin/settings",
    "/admin/settings/smtp",
    "/admin/settings/sms",
    "/admin/settings/integrations",
    "/admin/shipping/minimums",
    "/admin/finance/expense-limits",
    "/admin/pricing"
];
}),
"[project]/src/lib/services/admin/resources.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportResource",
    ()=>exportResource,
    "listResource",
    ()=>listResource,
    "lookupOptions",
    ()=>lookupOptions,
    "rejectReasonOptions",
    ()=>rejectReasonOptions,
    "resolveFormOptions",
    ()=>resolveFormOptions,
    "runResourceAction",
    ()=>runResourceAction,
    "saveResourceRecord",
    ()=>saveResourceRecord,
    "withReasonOptions",
    ()=>withReasonOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validation/admin/forms.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$_query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/_query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/live-catalog.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$fragments$2f$cms$2d$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/live-fragments/cms-settings.js [app-rsc] (ecmascript)");
;
;
;
;
;
/** Whether a MIME type matches an `accept` list such as "image/*,.pdf". */ function accepts(accept, type) {
    return String(accept).split(",").map((a)=>a.trim()).some((a)=>!a || a.startsWith(".") || (a.endsWith("/*") ? String(type).startsWith(a.slice(0, -1)) : a === type));
}
;
;
;
/**
 * Generic resource service. Lists, exports, row actions and forms call the
 * admin API resource engine. Screens without an endpoint return a clear gap
 * instead of the in-memory demo store.
 */ const MAX_BULK = 200;
function liveSpec(key) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$fragments$2f$cms$2d$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resources"][key] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$live$2d$catalog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIVE_RESOURCES"][key] ?? null;
}
function pageCount(total, pageSize) {
    return Math.max(1, Math.ceil(total / pageSize));
}
/** pages_custom.php is already served by /admin/custom-pages. Shape it like a resource list. */ async function listCustomPages(searchParams, user) {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$_query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseListParams"])(searchParams);
    const { data, meta } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/custom-pages", {
        token: user.token,
        query: {
            page: params.page,
            limit: params.pageSize,
            q: params.q || undefined
        }
    });
    const items = Array.isArray(data) ? data : [];
    const detailed = await Promise.all(items.map(async (item)=>{
        try {
            const { data: full } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin/custom-pages/${item.id}`, {
                token: user.token
            });
            return full || item;
        } catch  {
            return item;
        }
    }));
    const total = meta?.total ?? detailed.length;
    return {
        rows: detailed.map((row)=>({
                id: row.id,
                title: row.title ?? "",
                slug: row.slug ?? "",
                body: row.content ?? "",
                updatedBy: "",
                updatedAt: row.updatedAt ?? row.createdAt ?? null,
                status: "Published"
            })),
        total,
        page: meta?.page ?? params.page,
        pageSize: params.pageSize,
        pageCount: pageCount(total, params.pageSize),
        tabCounts: null
    };
}
async function saveCustomPage(id, values, user) {
    const { data: current } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin/custom-pages/${encodeURIComponent(id)}`, {
        token: user.token
    });
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin/custom-pages/${encodeURIComponent(id)}`, {
        method: "PUT",
        token: user.token,
        body: {
            title: values.title,
            slug: current.slug,
            content: values.body ?? current.content ?? "",
            metaTitle: current.metaTitle ?? "",
            metaDescription: current.metaDescription ?? "",
            metaKeywords: current.metaKeywords ?? ""
        }
    });
    return data;
}
function listQuery(searchParams) {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$_query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseListParams"])(searchParams);
    return {
        page: params.page,
        pageSize: params.pageSize,
        q: params.q || undefined,
        sort: params.sort || undefined,
        from: params.from || undefined,
        to: params.to || undefined,
        ...params.filters
    };
}
function emptyList(message) {
    return {
        rows: [],
        total: 0,
        page: 1,
        pageSize: 25,
        pageCount: 1,
        tabCounts: null,
        unavailable: message
    };
}
function fail(error) {
    const field = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.details?.field : undefined;
    const message = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "The admin API could not complete that request.";
    return {
        ok: false,
        message,
        fieldErrors: field ? {
            [field]: message
        } : undefined
    };
}
const NOT_CONNECTED = "This screen is not connected to the admin API yet.";
async function resolveFormOptions(resource, user) {
    const sets = {};
    for (const field of resource.form?.fields ?? []){
        if (typeof field.optionsFrom === "string" && field.optionsFrom.startsWith("lookup:") && user?.token) {
            sets[field.name] = [
                ...field.options ?? [],
                ...await lookupOptions(field.optionsFrom, user)
            ];
            continue;
        }
        if (field.optionsFrom === "roles" && user?.token) {
            try {
                const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])("admin/auth/roles", {
                    token: user.token
                });
                sets[field.name] = (data || []).map((role)=>({
                        value: String(role.id),
                        label: role.name
                    }));
            } catch  {
                sets[field.name] = [];
            }
        }
    }
    return sets;
}
async function lookupOptions(spec, user) {
    const [name, qs = ""] = String(spec).replace(/^lookup:/, "").split("?");
    if (!/^[a-z-]+$/.test(name)) return [];
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin/port/lookups/${name}`, {
            token: user.token,
            query: Object.fromEntries(new URLSearchParams(qs))
        });
        return (data || []).map((o)=>({
                value: String(o.value),
                label: o.label
            }));
    } catch  {
        return [];
    }
}
const rejectReasonOptions = (type, user)=>lookupOptions(`lookup:reject-reasons?type=${encodeURIComponent(String(type ?? ""))}`, user);
async function withReasonOptions(actions = [], user) {
    return Promise.all(actions.map(async (a)=>{
        let next = a;
        if (a.confirm?.reasonType != null) next = {
            ...next,
            confirm: {
                ...next.confirm,
                reasonOptions: await rejectReasonOptions(a.confirm.reasonType, user)
            }
        };
        if (a.assign?.optionsFrom) next = {
            ...next,
            assign: {
                ...next.assign,
                options: await lookupOptions(a.assign.optionsFrom, user)
            }
        };
        return next;
    }));
}
async function listResource(key, searchParams, user) {
    const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResource"])(key);
    if (!resource) throw new Error(`Unknown resource ${key}`);
    const spec = liveSpec(key);
    if (!spec) return emptyList(NOT_CONNECTED);
    if (!user?.token) return emptyList("Your session has expired. Please log in again.");
    if (key === "cms.pages") {
        try {
            return await listCustomPages(searchParams, user);
        } catch (error) {
            return emptyList(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "Could not load custom pages.");
        }
    }
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin${spec.path}`, {
            token: user.token,
            query: listQuery(searchParams)
        });
        return data;
    } catch (error) {
        return emptyList(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"] ? error.message : "Could not load this list from the admin API.");
    }
}
async function exportResource(key, searchParams, user) {
    const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResource"])(key);
    if (!resource?.exportable) return {
        ok: false,
        message: "Export is not available for this list."
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, resource.permission, "view")) return {
        ok: false,
        message: "You do not have permission to export this list."
    };
    const spec = liveSpec(key);
    if (!spec) return {
        ok: false,
        message: NOT_CONNECTED
    };
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin${spec.path}/export`, {
            token: user.token,
            query: listQuery(searchParams)
        });
        return {
            ok: true,
            rows: data?.rows || []
        };
    } catch (error) {
        return fail(error);
    }
}
async function runResourceAction(key, actionId, ids, user, rawReason, rawValue) {
    const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResource"])(key);
    if (!resource) return {
        ok: false,
        message: "Unknown list."
    };
    const found = [
        ...resource.rowActions ?? [],
        ...resource.bulkActions ?? []
    ].find((a)=>a.id === actionId && (a.effect || a.assign));
    if (!found) return {
        ok: false,
        message: "This action is not available."
    };
    let action = found;
    if (found.assign) {
        const options = found.assign.optionsFrom ? await lookupOptions(found.assign.optionsFrom, user) : found.assign.options;
        const raw = String(rawValue ?? "");
        const sep = raw.indexOf("\u001e");
        const token = sep === -1 ? raw : raw.slice(0, sep).trim();
        const invoice = sep === -1 ? "" : raw.slice(sep + 1).trim();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["optionValues"])(options).includes(token) || sep !== -1 && actionId !== "status") {
            return {
                ok: false,
                message: `Choose a valid option for “${found.assign.label}”.`
            };
        }
        if (sep !== -1 && !invoice) return {
            ok: false,
            message: "This line has no seller invoice, so its status cannot be set."
        };
        // assign.run: the API action takes the picked value; otherwise the value is written to assign.field.
        action = found.assign.run ? found : {
            ...found,
            label: `${found.assign.label}: ${rawValue}`,
            effect: {
                set: {
                    [found.assign.field]: rawValue
                }
            }
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, resource.permission, action.permission ?? "edit")) return {
        ok: false,
        message: "You do not have permission to perform this action."
    };
    const idList = Array.isArray(ids) ? ids.slice(0, MAX_BULK) : [];
    if (!idList.length) return {
        ok: false,
        message: "Select at least one row."
    };
    const needsReason = Boolean(action.confirm?.requireReason);
    const reasonCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateReason"])(rawReason, needsReason, action.confirm?.reasonType != null ? 1 : 5);
    if (!reasonCheck.ok) return {
        ok: false,
        message: reasonCheck.error
    };
    const spec = liveSpec(key);
    if (!spec) return {
        ok: false,
        message: NOT_CONNECTED
    };
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(`admin${spec.path}/actions/${encodeURIComponent(actionId)}`, {
            method: "POST",
            token: user.token,
            body: {
                ids: idList,
                reason: reasonCheck.reason || undefined,
                value: rawValue || undefined
            }
        });
        return {
            ok: true,
            message: data?.message || `${action.label} completed.`
        };
    } catch (error) {
        return fail(error);
    }
}
async function saveResourceRecord(key, id, input, user, rawReason) {
    const resource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResource"])(key);
    if (!resource?.form) return {
        ok: false,
        message: "This list cannot be edited."
    };
    const isNew = id == null || id === "";
    const permissionAction = isNew ? "add" : "edit";
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, resource.permission, permissionAction)) return {
        ok: false,
        message: "You do not have permission to perform this action."
    };
    const reasonCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateReason"])(rawReason, Boolean(resource.form.requireReason));
    if (!reasonCheck.ok) return {
        ok: false,
        message: reasonCheck.error,
        fieldErrors: {
            __reason: reasonCheck.error
        }
    };
    const spec = liveSpec(key);
    if (!spec) return {
        ok: false,
        message: NOT_CONNECTED
    };
    const optionSets = await resolveFormOptions(resource, user);
    const fields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formFieldsFor"])(resource.form.fields, isNew);
    // Forms with file fields arrive as FormData: values as JSON in __values, files by field name.
    const files = [];
    let raw = input;
    if (typeof FormData !== "undefined" && input instanceof FormData) {
        try {
            raw = JSON.parse(String(input.get("__values") || "{}"));
        } catch  {
            return {
                ok: false,
                message: "The form could not be read."
            };
        }
        for (const field of fields.filter((f)=>f.type === "file")){
            const file = input.get(field.name);
            if (!file || typeof file !== "object" || !file.size) continue;
            if (field.maxBytes && file.size > field.maxBytes) return {
                ok: false,
                message: `${field.label} is too large.`,
                fieldErrors: {
                    [field.name]: `${field.label} is too large.`
                }
            };
            if (field.accept && !accepts(field.accept, file.type)) return {
                ok: false,
                message: `${field.label}: this file type is not allowed.`,
                fieldErrors: {
                    [field.name]: "This file type is not allowed."
                }
            };
            files.push([
                field.name,
                file
            ]);
        }
    }
    const { ok, values, errors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateForm"])(fields, raw, optionSets);
    if (!ok) return {
        ok: false,
        message: "Please fix the highlighted fields.",
        fieldErrors: errors
    };
    const payload = {
        ...values
    };
    for (const field of fields)if (field.type === "file") delete payload[field.name];
    if (isNew && payload.password === "") delete payload.password;
    if (key === "cms.pages") {
        if (isNew) return {
            ok: false,
            message: "New custom pages are added from the existing custom-pages API. This screen edits pages that already exist."
        };
        try {
            const data = await saveCustomPage(id, payload, user);
            return {
                ok: true,
                message: `${resource.title}: changes saved.`,
                id: data?.id ?? id
            };
        } catch (error) {
            return fail(error);
        }
    }
    try {
        const path = isNew ? `admin${spec.path}` : `admin${spec.path}/${encodeURIComponent(id)}`;
        let data;
        if (files.length) {
            const form = new FormData();
            form.set("values", JSON.stringify(payload));
            if (reasonCheck.reason) form.set("reason", reasonCheck.reason);
            for (const [name, file] of files)form.set(name, file, file.name || name);
            ({ data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apiForm"])(path, {
                token: user.token,
                method: isNew ? "POST" : "PUT",
                formData: form
            }));
        } else {
            ({ data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(path, {
                method: isNew ? "POST" : "PUT",
                token: user.token,
                body: {
                    values: payload,
                    reason: reasonCheck.reason || undefined
                }
            }));
        }
        return {
            ok: true,
            message: isNew ? `${resource.title}: record created.` : `${resource.title}: changes saved.`,
            id: data?.id ?? id
        };
    } catch (error) {
        return fail(error);
    }
}
}),
"[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a4533fe49135e174d981ba6cedbc7f8cfe11a44d":"resourceExportAction","78e08031f1f9ecdc54b14c9e27902fa61444ff4069":"resourceSaveAction","7cad3989db32f5192c1e8820c765efb8e468c33851":"resourceActionAction"},"",""] */ __turbopack_context__.s([
    "resourceActionAction",
    ()=>resourceActionAction,
    "resourceExportAction",
    ()=>resourceExportAction,
    "resourceSaveAction",
    ()=>resourceSaveAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/resources/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/resources.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const expired = {
    ok: false,
    message: "Your session has expired. Please log in again."
};
function cleanKey(key) {
    return typeof key === "string" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$resources$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getResource"])(key) ? key : null;
}
function cleanParams(params) {
    if (!params || typeof params !== "object") return {};
    const out = {};
    for (const [k, v] of Object.entries(params)){
        if (typeof k === "string" && k.length <= 40 && (typeof v === "string" || typeof v === "number")) out[k] = String(v).slice(0, 120);
    }
    return out;
}
async function resourceActionAction(key, actionId, ids, reason, value) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const resourceKey = cleanKey(key);
    if (!resourceKey || typeof actionId !== "string") return {
        ok: false,
        message: "Invalid request."
    };
    const idList = Array.isArray(ids) ? ids.filter((id)=>typeof id === "string" || typeof id === "number") : [];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runResourceAction"])(resourceKey, actionId, idList, user, typeof reason === "string" ? reason : "", typeof value === "string" ? value : "");
}
async function resourceExportAction(key, params) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const resourceKey = cleanKey(key);
    if (!resourceKey) return {
        ok: false,
        message: "Invalid request."
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exportResource"])(resourceKey, cleanParams(params), user);
}
async function resourceSaveAction(key, id, input, reason) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const resourceKey = cleanKey(key);
    if (!resourceKey || !input || typeof input !== "object") return {
        ok: false,
        message: "Invalid request."
    };
    const recordId = typeof id === "string" || typeof id === "number" ? id : null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveResourceRecord"])(resourceKey, recordId, input, user, typeof reason === "string" ? reason : "");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    resourceActionAction,
    resourceExportAction,
    resourceSaveAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resourceActionAction, "7cad3989db32f5192c1e8820c765efb8e468c33851", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resourceExportAction, "60a4533fe49135e174d981ba6cedbc7f8cfe11a44d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resourceSaveAction, "78e08031f1f9ecdc54b14c9e27902fa61444ff4069", null);
}),
"[project]/src/lib/services/admin/shipping.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COURIER_COMPANIES",
    ()=>COURIER_COMPANIES,
    "SHIPMENT_TABS",
    ()=>SHIPMENT_TABS,
    "SHIPROCKET_PAGE_SIZES",
    ()=>SHIPROCKET_PAGE_SIZES,
    "availableCouriers",
    ()=>availableCouriers,
    "bulkCouriers",
    ()=>bulkCouriers,
    "bulkCreate",
    ()=>bulkCreate,
    "canShip",
    ()=>canShip,
    "cancelShipments",
    ()=>cancelShipments,
    "cancelShiprocketOrders",
    ()=>cancelShiprocketOrders,
    "cancelShiprocketShipments",
    ()=>cancelShiprocketShipments,
    "createShipment",
    ()=>createShipment,
    "listShipments",
    ()=>listShipments,
    "listShiprocketOrders",
    ()=>listShiprocketOrders,
    "markCancelled",
    ()=>markCancelled,
    "openLabel",
    ()=>openLabel,
    "orderShipments",
    ()=>orderShipments,
    "regenerateLabel",
    ()=>regenerateLabel,
    "shiprocketDocument",
    ()=>shiprocketDocument,
    "shiprocketOrderDetails",
    ()=>shiprocketOrderDetails,
    "shiprocketReportDocument",
    ()=>shiprocketReportDocument,
    "syncStatus",
    ()=>syncStatus,
    "trackShiprocketAwbs",
    ()=>trackShiprocketAwbs,
    "trackShiprocketShipment",
    ()=>trackShiprocketShipment,
    "updateShiprocketOrder",
    ()=>updateShiprocketOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/permissions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.js [app-rsc] (ecmascript)");
;
;
;
const SHIPMENT_TABS = [
    {
        value: "to_ship",
        label: "To ship"
    },
    {
        value: "in_transit",
        label: "In transit"
    },
    {
        value: "delivered",
        label: "Delivered"
    },
    {
        value: "rto",
        label: "RTO"
    },
    {
        value: "cancelled",
        label: "Cancelled"
    },
    {
        value: "all",
        label: "All"
    },
    {
        value: "shiprocket",
        label: "Shiprocket"
    }
];
const SHIPROCKET_PAGE_SIZES = [
    "10",
    "20",
    "50",
    "100"
];
const COURIER_COMPANIES = [
    {
        value: "nimbus",
        label: "NimbusPost"
    },
    {
        value: "shiprocket",
        label: "Shiprocket"
    },
    {
        value: "delhivery",
        label: "Delhivery"
    }
];
function canShip(user, action = "view") {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, "shipping", action) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$permissions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["can"])(user, "orders", action);
}
const denied = {
    ok: false,
    message: "You do not have permission to do this."
};
const noSession = {
    ok: false,
    message: "Your session has expired. Please log in again."
};
async function call(user, action, path, options = {}) {
    if (!user?.token) return noSession;
    if (!canShip(user, action)) return denied;
    try {
        const { data, meta } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["api"])(path, {
            token: user.token,
            ...options
        });
        return {
            ok: true,
            data,
            meta
        };
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ApiError"]) return {
            ok: false,
            message: error.message,
            code: error.code,
            status: error.status
        };
        return {
            ok: false,
            message: "The shipping service could not be reached."
        };
    }
}
const enc = encodeURIComponent;
function listShipments({ tab, q, dateFrom, dateTo, page, limit }, user) {
    return call(user, "view", "admin/shipping/shipments", {
        query: {
            tab,
            q,
            dateFrom,
            dateTo,
            page,
            limit
        }
    });
}
function orderShipments(orderId, user) {
    return call(user, "view", `admin/shipping/orders/${enc(orderId)}/shipments`);
}
function availableCouriers(orderId, company, user) {
    return call(user, "view", `admin/shipping/orders/${enc(orderId)}/couriers`, {
        query: {
            company
        }
    });
}
function createShipment(orderId, body, user) {
    return call(user, "add", `admin/shipping/orders/${enc(orderId)}/shipments`, {
        method: "POST",
        body
    });
}
function updateShiprocketOrder(orderId, user) {
    return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/shiprocket-update`, {
        method: "POST",
        body: {}
    });
}
function openLabel(orderId, vendorId, user) {
    return call(user, "view", `admin/shipping/orders/${enc(orderId)}/label`, {
        query: {
            vendorId
        }
    });
}
function regenerateLabel(orderId, awb, vendorId, user) {
    return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/label`, {
        method: "POST",
        body: {
            awb,
            ...vendorId ? {
                vendorId
            } : {}
        }
    });
}
function shiprocketDocument(orderId, vendorId, doc, user) {
    return call(user, "edit", `admin/shipping/orders/${enc(orderId)}/documents/${enc(doc)}`, {
        method: "POST",
        body: {
            vendorId
        }
    });
}
function bulkCouriers(orderIds, user) {
    return call(user, "view", "admin/shipping/bulk/couriers", {
        method: "POST",
        body: {
            orderIds
        }
    });
}
function bulkCreate(orders, user) {
    return call(user, "add", "admin/shipping/bulk/shipments", {
        method: "POST",
        body: {
            orders
        }
    });
}
function cancelShipments(awbs, user) {
    return call(user, "edit", "admin/shipping/cancel", {
        method: "POST",
        body: {
            awbs
        }
    });
}
function markCancelled(awbs, user) {
    return call(user, "edit", "admin/shipping/mark-cancelled", {
        method: "POST",
        body: {
            awbs
        }
    });
}
function syncStatus({ orderIds = [], awbs = [] }, user) {
    return call(user, "edit", "admin/shipping/sync", {
        method: "POST",
        body: {
            orderIds,
            awbs
        }
    });
}
function listShiprocketOrders({ page, perPage, from, to, search, status, pickupLocation, sort }, user) {
    return call(user, "view", "admin/shipping/shiprocket/orders", {
        query: {
            page,
            perPage,
            from,
            to,
            search,
            status,
            pickupLocation,
            sort
        }
    });
}
function shiprocketOrderDetails(srOrderId, user) {
    return call(user, "view", `admin/shipping/shiprocket/orders/${enc(srOrderId)}`);
}
function trackShiprocketShipment(shipmentId, user) {
    return call(user, "view", `admin/shipping/shiprocket/tracking/${enc(shipmentId)}`);
}
function trackShiprocketAwbs(awbs, user) {
    return call(user, "view", "admin/shipping/shiprocket/tracking", {
        method: "POST",
        body: {
            awbs
        }
    });
}
function shiprocketReportDocument(doc, ids, user) {
    return call(user, "edit", `admin/shipping/shiprocket/documents/${enc(doc)}`, {
        method: "POST",
        body: {
            ids
        }
    });
}
function cancelShiprocketOrders(orderIds, user) {
    return call(user, "edit", "admin/shipping/shiprocket/cancel/orders", {
        method: "POST",
        body: {
            orderIds
        }
    });
}
function cancelShiprocketShipments(awbs, user) {
    return call(user, "edit", "admin/shipping/shiprocket/cancel/shipments", {
        method: "POST",
        body: {
            awbs
        }
    });
}
}),
"[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404c3e5b3540ffd41dacfcfb0ac698eeae876fd716":"updateShiprocketOrderAction","40738e81484955400130c58352058a044f53508a1e":"syncStatusAction","40a863252406bc315e63684176d4c302e076b89528":"trackShiprocketAction","40aa631ac7117565dab497880b44510425f3494898":"bulkCouriersAction","40cf0200efaf3e9e090c0b87a402115b45d86827ee":"syncVisibleOrdersAction","40dc3b781cc9b179d020ea765826ff7b7642778ab9":"bulkCreateAction","40e10d0a176fc133fdd6e9788fc8bc5c6f88de230d":"cancelShiprocketShipmentsAction","40f110b076736316a44fc1c71527f54b42ea393924":"shiprocketOrderAction","40f26c31c2f044f4cee2f9ebdd2adca2773308731a":"trackShiprocketAwbsAction","40fcb66fec331a323aa5f47aceae5af01139aa3852":"cancelShiprocketOrdersAction","609b872a2c9eff38c029bb45ddcced93bff7c39b77":"markCancelledAction","60b991d80057df39c85e39b8d886320a70dc496c60":"shiprocketReportDocumentAction","60bf3d98e4cc25cde9c6f2d1741d54023e4b2df07f":"cancelShipmentsAction","60d2b67f42afdf0c24508c1f2030d9d91d9e21d1b0":"createShipmentAction","60d47db8fb2e96c15a3b7a4c03b434271d0e51a746":"availableCouriersAction","60e7ff8ee8565a6e27f7cf35c3da19314bc677f21d":"openLabelAction","708842680ad2f30a9e4e1258e5fbc20008d89cf699":"regenerateLabelAction","70eca5387429ba896248625762fef3620405ed7ab3":"shiprocketDocumentAction"},"",""] */ __turbopack_context__.s([
    "availableCouriersAction",
    ()=>availableCouriersAction,
    "bulkCouriersAction",
    ()=>bulkCouriersAction,
    "bulkCreateAction",
    ()=>bulkCreateAction,
    "cancelShipmentsAction",
    ()=>cancelShipmentsAction,
    "cancelShiprocketOrdersAction",
    ()=>cancelShiprocketOrdersAction,
    "cancelShiprocketShipmentsAction",
    ()=>cancelShiprocketShipmentsAction,
    "createShipmentAction",
    ()=>createShipmentAction,
    "markCancelledAction",
    ()=>markCancelledAction,
    "openLabelAction",
    ()=>openLabelAction,
    "regenerateLabelAction",
    ()=>regenerateLabelAction,
    "shiprocketDocumentAction",
    ()=>shiprocketDocumentAction,
    "shiprocketOrderAction",
    ()=>shiprocketOrderAction,
    "shiprocketReportDocumentAction",
    ()=>shiprocketReportDocumentAction,
    "syncStatusAction",
    ()=>syncStatusAction,
    "syncVisibleOrdersAction",
    ()=>syncVisibleOrdersAction,
    "trackShiprocketAction",
    ()=>trackShiprocketAction,
    "trackShiprocketAwbsAction",
    ()=>trackShiprocketAwbsAction,
    "updateShiprocketOrderAction",
    ()=>updateShiprocketOrderAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/admin/shipping.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const expired = {
    ok: false,
    message: "Your session has expired. Please log in again."
};
const invalid = {
    ok: false,
    message: "Invalid request."
};
const COMPANIES = new Set([
    "nimbus",
    "shiprocket",
    "delhivery"
]);
const DOCS = new Set([
    "manifest",
    "pickup",
    "invoice"
]);
const str = (v, max = 100)=>typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "";
const ids = (list, max)=>Array.isArray(list) ? [
        ...new Set(list.map((v)=>str(v)).filter(Boolean))
    ].slice(0, max) : [];
const couriers = (map)=>{
    const out = {};
    if (map && typeof map === "object") {
        for (const [vendorId, courier] of Object.entries(map))if (courier && typeof courier === "object") out[str(vendorId)] = courier;
    }
    return out;
};
function refresh(orderIds = []) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/shipping");
    for (const id of orderIds)(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/orders/${id}`);
}
async function availableCouriersAction(orderId, company) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    if (!str(orderId) || !COMPANIES.has(company)) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["availableCouriers"])(str(orderId), company, user);
}
async function createShipmentAction(orderId, input) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const id = str(orderId);
    if (!id || !input || !COMPANIES.has(input.company)) return invalid;
    const pickupDate = /^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate ?? "") ? input.pickupDate : undefined;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createShipment"])(id, {
        company: input.company,
        selectedCouriers: couriers(input.selectedCouriers),
        excludedVendors: ids(input.excludedVendors, 50),
        ...pickupDate ? {
            pickupDate
        } : {}
    }, user);
    if (result.ok) refresh([
        id
    ]);
    return result;
}
async function updateShiprocketOrderAction(orderId) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    if (!str(orderId)) return invalid;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateShiprocketOrder"])(str(orderId), user);
    if (result.ok) refresh([
        str(orderId)
    ]);
    return result;
}
async function bulkCouriersAction(orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(orderIds, 50);
    if (!list.length) return {
        ok: false,
        message: "Select at least one order."
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkCouriers"])(list, user);
}
async function bulkCreateAction(orders) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = Array.isArray(orders) ? orders.slice(0, 50).map((o)=>({
            orderId: str(o?.orderId),
            selectedCouriers: couriers(o?.selectedCouriers)
        })).filter((o)=>o.orderId) : [];
    if (!list.length) return {
        ok: false,
        message: "Select at least one order."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkCreate"])(list, user);
    if (result.ok) refresh(list.map((o)=>o.orderId));
    return result;
}
async function openLabelAction(orderId, vendorId) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    if (!str(orderId)) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["openLabel"])(str(orderId), str(vendorId) || undefined, user);
}
async function regenerateLabelAction(orderId, awb, vendorId) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    if (!str(orderId) || !str(awb)) return invalid;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["regenerateLabel"])(str(orderId), str(awb), str(vendorId), user);
    if (result.ok) refresh([
        str(orderId)
    ]);
    return result;
}
async function shiprocketDocumentAction(orderId, vendorId, doc) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    if (!str(orderId) || !str(vendorId) || !DOCS.has(doc)) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["shiprocketDocument"])(str(orderId), str(vendorId), doc, user);
}
async function cancelShipmentsAction(awbs, orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(awbs, 2000);
    if (!list.length) return {
        ok: false,
        message: "Select at least one shipment with an AWB."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelShipments"])(list, user);
    if (result.ok) refresh(ids(orderIds, 200));
    return result;
}
async function markCancelledAction(awbs, orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(awbs, 2000);
    if (!list.length) return {
        ok: false,
        message: "Select at least one shipment with an AWB."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markCancelled"])(list, user);
    if (result.ok) refresh(ids(orderIds, 200));
    return result;
}
/* Shiprocket orders report (shiprocket_orders_report.php). Ids are Shiprocket's own order / shipment ids. */ const SR_DOCS = new Set([
    "label",
    "manifest",
    "invoice"
]);
const srIds = (list, max)=>ids(list, max).filter((v)=>/^\d{1,20}$/.test(v));
async function shiprocketOrderAction(srOrderId) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const [id] = srIds([
        srOrderId
    ], 1);
    if (!id) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["shiprocketOrderDetails"])(id, user);
}
async function trackShiprocketAction(shipmentId) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const [id] = srIds([
        shipmentId
    ], 1);
    if (!id) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["trackShiprocketShipment"])(id, user);
}
async function trackShiprocketAwbsAction(awbs) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(awbs, 51);
    if (!list.length) return {
        ok: false,
        message: "No shipments with AWB codes selected. Please select shipments that have AWB codes."
    };
    if (list.length > 50) return {
        ok: false,
        message: "Maximum 50 shipments with AWB codes can be tracked at once. Please select 50 or fewer shipments."
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["trackShiprocketAwbs"])(list, user);
}
async function shiprocketReportDocumentAction(doc, idList) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = srIds(idList, 200);
    if (!SR_DOCS.has(doc) || !list.length) return invalid;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["shiprocketReportDocument"])(doc, list, user);
}
async function cancelShiprocketOrdersAction(orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = srIds(orderIds, 200);
    if (!list.length) return {
        ok: false,
        message: "No valid order IDs found in selected shipments."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelShiprocketOrders"])(list, user);
    if (result.ok) refresh();
    return result;
}
async function cancelShiprocketShipmentsAction(awbs) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(awbs, 2001);
    if (!list.length) return {
        ok: false,
        message: "No valid AWB codes found in selected shipments."
    };
    if (list.length > 2000) return {
        ok: false,
        message: "Maximum 2000 shipments can be cancelled at once. Please select 2000 or fewer shipments."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelShiprocketShipments"])(list, user);
    if (result.ok) refresh();
    return result;
}
async function syncStatusAction(orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(orderIds, 50);
    if (!list.length) return {
        ok: false,
        message: "Select at least one order."
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncStatus"])({
        orderIds: list
    }, user);
    if (result.ok) refresh(list);
    return result;
}
async function syncVisibleOrdersAction(orderIds) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentAdmin"])();
    if (!user) return expired;
    const list = ids(orderIds, 20);
    if (!list.length) return {
        ok: true,
        changed: 0
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncStatus"])({
        orderIds: list
    }, user);
    const updates = Array.isArray(result.data?.updates) ? result.data.updates : [];
    const nimbus = Array.isArray(result.data?.nimbus?.updated) ? result.data.nimbus.updated : [];
    const changed = updates.length + nimbus.length;
    if (result.ok && changed > 0) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/orders");
        refresh(list);
    }
    return {
        ok: result.ok,
        changed,
        message: result.message
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    availableCouriersAction,
    createShipmentAction,
    updateShiprocketOrderAction,
    bulkCouriersAction,
    bulkCreateAction,
    openLabelAction,
    regenerateLabelAction,
    shiprocketDocumentAction,
    cancelShipmentsAction,
    markCancelledAction,
    shiprocketOrderAction,
    trackShiprocketAction,
    trackShiprocketAwbsAction,
    shiprocketReportDocumentAction,
    cancelShiprocketOrdersAction,
    cancelShiprocketShipmentsAction,
    syncStatusAction,
    syncVisibleOrdersAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(availableCouriersAction, "60d47db8fb2e96c15a3b7a4c03b434271d0e51a746", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createShipmentAction, "60d2b67f42afdf0c24508c1f2030d9d91d9e21d1b0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateShiprocketOrderAction, "404c3e5b3540ffd41dacfcfb0ac698eeae876fd716", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkCouriersAction, "40aa631ac7117565dab497880b44510425f3494898", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkCreateAction, "40dc3b781cc9b179d020ea765826ff7b7642778ab9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(openLabelAction, "60e7ff8ee8565a6e27f7cf35c3da19314bc677f21d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(regenerateLabelAction, "708842680ad2f30a9e4e1258e5fbc20008d89cf699", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(shiprocketDocumentAction, "70eca5387429ba896248625762fef3620405ed7ab3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelShipmentsAction, "60bf3d98e4cc25cde9c6f2d1741d54023e4b2df07f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markCancelledAction, "609b872a2c9eff38c029bb45ddcced93bff7c39b77", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(shiprocketOrderAction, "40f110b076736316a44fc1c71527f54b42ea393924", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(trackShiprocketAction, "40a863252406bc315e63684176d4c302e076b89528", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(trackShiprocketAwbsAction, "40f26c31c2f044f4cee2f9ebdd2adca2773308731a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(shiprocketReportDocumentAction, "60b991d80057df39c85e39b8d886320a70dc496c60", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelShiprocketOrdersAction, "40fcb66fec331a323aa5f47aceae5af01139aa3852", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelShiprocketShipmentsAction, "40e10d0a176fc133fdd6e9788fc8bc5c6f88de230d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncStatusAction, "40738e81484955400130c58352058a044f53508a1e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncVisibleOrdersAction, "40cf0200efaf3e9e090c0b87a402115b45d86827ee", null);
}),
"[project]/.next-internal/server/app/admin/(panel)/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/.next-internal/server/app/admin/(panel)/[...slug]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002d2150522fbc8f145093f8f71c54ff678fb5f4ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "40cf0200efaf3e9e090c0b87a402115b45d86827ee",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["syncVisibleOrdersAction"],
    "60a4533fe49135e174d981ba6cedbc7f8cfe11a44d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resourceExportAction"],
    "78e08031f1f9ecdc54b14c9e27902fa61444ff4069",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resourceSaveAction"],
    "7cad3989db32f5192c1e8820c765efb8e468c33851",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resourceActionAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f28$panel$292f5b2e2e2e$slug$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/(panel)/[...slug]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$resources$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/resources.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$shipping$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/shipping.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_a72db925._.js.map