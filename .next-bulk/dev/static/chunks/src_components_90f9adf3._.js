(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/states.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiUnavailable",
    ()=>ApiUnavailable,
    "EmptyState",
    ()=>EmptyState,
    "ErrorState",
    ()=>ErrorState,
    "PageSkeleton",
    ()=>PageSkeleton,
    "PermissionDenied",
    ()=>PermissionDenied,
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/octagon-alert.js [app-client] (ecmascript) <export default as AlertOctagon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.js [app-client] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
;
;
;
;
function EmptyState(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    const { title: t1, description, action, icon: t2, className } = t0;
    const title = t1 === undefined ? "Nothing here yet" : t1;
    const Icon = t2 === undefined ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"] : t2;
    let t3;
    if ($[1] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center px-6 py-12 text-center", className);
        $[1] = className;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    let t4;
    if ($[3] !== Icon) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "mb-3 flex size-11 items-center justify-center rounded-full bg-neutral-bg text-ink-muted",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "size-5",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 32,
                columnNumber: 116
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 32,
            columnNumber: 10
        }, this);
        $[3] = Icon;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] !== title) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm font-semibold text-ink",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[5] = title;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== description) {
        t6 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 max-w-sm text-sm text-ink-muted",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 48,
            columnNumber: 25
        }, this);
        $[7] = description;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] !== action) {
        t7 = action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-4",
            children: action
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 56,
            columnNumber: 20
        }, this);
        $[9] = action;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== t3 || $[12] !== t4 || $[13] !== t5 || $[14] !== t6 || $[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: [
                t4,
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[11] = t3;
        $[12] = t4;
        $[13] = t5;
        $[14] = t6;
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    return t8;
}
_c = EmptyState;
function ErrorState(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    const { title: t1, description: t2, onRetry, action, className } = t0;
    const title = t1 === undefined ? "Something went wrong" : t1;
    const description = t2 === undefined ? "We could not load this data. Please try again." : t2;
    let t3;
    if ($[1] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center px-6 py-12 text-center", className);
        $[1] = className;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "mb-3 flex size-11 items-center justify-center rounded-full bg-danger-bg text-danger-ink",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__["AlertOctagon"], {
                className: "size-5",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 103,
                columnNumber: 116
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 103,
            columnNumber: 10
        }, this);
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    let t5;
    if ($[4] !== title) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm font-semibold text-ink",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 110,
            columnNumber: 10
        }, this);
        $[4] = title;
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] !== description) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 max-w-sm text-sm text-ink-muted",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 118,
            columnNumber: 10
        }, this);
        $[6] = description;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] !== action || $[9] !== onRetry) {
        t7 = (onRetry || action) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-4 flex flex-wrap items-center justify-center gap-2",
            children: [
                onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onRetry,
                    className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3 text-[13px] font-medium text-ink hover:bg-surface-muted",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                            className: "size-3.5",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/states.jsx",
                            lineNumber: 126,
                            columnNumber: 314
                        }, this),
                        " Try again"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 126,
                    columnNumber: 116
                }, this),
                action
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 126,
            columnNumber: 33
        }, this);
        $[8] = action;
        $[9] = onRetry;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== t3 || $[12] !== t5 || $[13] !== t6 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "alert",
            className: t3,
            children: [
                t4,
                t5,
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 135,
            columnNumber: 10
        }, this);
        $[11] = t3;
        $[12] = t5;
        $[13] = t6;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    return t8;
}
_c1 = ErrorState;
function ApiUnavailable(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    const { error, what: t1 } = t0;
    const what = t1 === undefined ? "this data" : t1;
    const status = error?.status;
    const description = status ? `The admin API could not load ${what} (${error.message}). Refresh the page to try again.` : `The admin API is not reachable right now, so ${what} could not be loaded. Refresh the page in a moment.`;
    let t2;
    if ($[1] !== description) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorState, {
            title: "Not connected",
            description: description,
            className: "rounded-2xl border border-line bg-surface"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 163,
            columnNumber: 10
        }, this);
        $[1] = description;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    return t2;
}
_c2 = ApiUnavailable;
function PermissionDenied(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    const { module: t1 } = t0;
    const module = t1 === undefined ? "this page" : t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "mb-3 flex size-12 items-center justify-center rounded-full bg-warning-bg text-warning-ink",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                className: "size-5",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 185,
                columnNumber: 118
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 185,
            columnNumber: 10
        }, this);
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    let t3;
    if ($[2] !== module) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-base font-semibold text-ink",
            children: [
                "You don't have access to ",
                module
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 192,
            columnNumber: 10
        }, this);
        $[2] = module;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    let t5;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 max-w-sm text-sm text-ink-muted",
            children: "Your role does not include view permission for this module. Ask a Super Admin to update your role under Staff & Roles."
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 201,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/admin/dashboard",
            className: "mt-5 inline-flex h-9 items-center rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-brand-fg hover:bg-brand-700",
            children: "Go to dashboard"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 202,
            columnNumber: 10
        }, this);
        $[4] = t4;
        $[5] = t5;
    } else {
        t4 = $[4];
        t5 = $[5];
    }
    let t6;
    if ($[6] !== t3) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto mt-6 max-w-lg rounded-xl border border-line bg-surface",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center px-6 py-12 text-center",
                children: [
                    t2,
                    t3,
                    t4,
                    t5
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 211,
                columnNumber: 90
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 211,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    return t6;
}
_c3 = PermissionDenied;
function Skeleton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    const { className } = t0;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-neutral-bg", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 240,
            columnNumber: 10
        }, this);
        $[3] = t1;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    return t2;
}
_c4 = Skeleton;
function PageSkeleton() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "bf242f672716338bb208174cf2900ab0a0ac6e36f571082b2e8546bb78938276";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                    className: "h-6 w-56"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 258,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                    className: "h-4 w-80 max-w-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 258,
                    columnNumber: 70
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 258,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
            children: Array.from({
                length: 4
            }).map(_PageSkeletonAnonymous)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 265,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-5",
            "aria-busy": "true",
            "aria-label": "Loading",
            children: [
                t0,
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-line bg-surface p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "mb-4 h-9 w-full"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/states.jsx",
                            lineNumber: 274,
                            columnNumber: 145
                        }, this),
                        Array.from({
                            length: 8
                        }).map(_PageSkeletonAnonymous2)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 274,
                    columnNumber: 83
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 274,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c5 = PageSkeleton;
function _PageSkeletonAnonymous2(__0, i_0) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
        className: "mb-2 h-8 w-full"
    }, i_0, false, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 284,
        columnNumber: 10
    }, this);
}
function _PageSkeletonAnonymous(_, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
        className: "h-24 rounded-xl"
    }, i, false, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 287,
        columnNumber: 10
    }, this);
}
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "EmptyState");
__turbopack_context__.k.register(_c1, "ErrorState");
__turbopack_context__.k.register(_c2, "ApiUnavailable");
__turbopack_context__.k.register(_c3, "PermissionDenied");
__turbopack_context__.k.register(_c4, "Skeleton");
__turbopack_context__.k.register(_c5, "PageSkeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/charts/interactive.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart",
    ()=>BarChart,
    "DonutChart",
    ()=>DonutChart,
    "LineChart",
    ()=>LineChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-client] (ecmascript) <export default as ChartLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/states.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)"
];
function niceMax(value) {
    if (value <= 0) return 1;
    const pow = Math.pow(10, Math.floor(Math.log10(value)));
    return Math.ceil(value / pow) * pow;
}
function shortNumber(n) {
    if (Math.abs(n) >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
    if (Math.abs(n) >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
    if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
}
function ChartEmpty(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { className, message: t1 } = t0;
    const message = t1 === undefined ? "No data for this period." : t1;
    let t2;
    if ($[1] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-h-[180px] rounded-md bg-surface-muted py-8", className);
        $[1] = className;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== message || $[4] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartLine$3e$__["ChartLine"],
            title: message,
            className: t2
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 44,
            columnNumber: 10
        }, this);
        $[3] = message;
        $[4] = t2;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_c = ChartEmpty;
const isMoney = (s)=>s.format === "inr" || /₹/.test(s.label);
const formatValue = (s, v)=>isMoney(s) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatINR"])(v) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(v);
const colorOf = (s, i)=>s.color || palette[i % palette.length];
/** Pointer/keyboard index tracking shared by the cartesian charts. */ function useActiveIndex(count, toIndex) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t0;
    if ($[1] !== toIndex) {
        t0 = ({
            "useActiveIndex[fromPointer]": (e)=>{
                const rect = svgRef.current.getBoundingClientRect();
                setActive(toIndex((e.clientX - rect.left) / rect.width));
            }
        })["useActiveIndex[fromPointer]"];
        $[1] = toIndex;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const fromPointer = t0;
    let t1;
    if ($[3] !== count) {
        t1 = ({
            "useActiveIndex[onKeyDown]": (e_0)=>{
                if (e_0.key === "ArrowRight") {
                    setActive({
                        "useActiveIndex[onKeyDown > setActive()]": (a)=>Math.min(count - 1, (a ?? -1) + 1)
                    }["useActiveIndex[onKeyDown > setActive()]"]);
                } else {
                    if (e_0.key === "ArrowLeft") {
                        setActive({
                            "useActiveIndex[onKeyDown > setActive()]": (a_0)=>Math.max(0, (a_0 ?? count) - 1)
                        }["useActiveIndex[onKeyDown > setActive()]"]);
                    } else {
                        if (e_0.key === "Escape") {
                            setActive(null);
                        } else {
                            return;
                        }
                    }
                }
                e_0.preventDefault();
            }
        })["useActiveIndex[onKeyDown]"];
        $[3] = count;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const onKeyDown = t1;
    let t2;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = (e_1)=>e_1.pointerType === "mouse" && setActive(null);
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ()=>setActive(null);
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== fromPointer || $[8] !== onKeyDown) {
        t4 = {
            ref: svgRef,
            tabIndex: 0,
            onPointerMove: fromPointer,
            onPointerDown: fromPointer,
            onPointerLeave: t2,
            onKeyDown,
            onBlur: t3
        };
        $[7] = fromPointer;
        $[8] = onKeyDown;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== active || $[11] !== t4) {
        t5 = {
            active,
            svgProps: t4
        };
        $[10] = active;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    return t5;
}
_s(useActiveIndex, "45GsiKx/X1OO/1QWkCdsiAHoHvc=");
function Tooltip(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { leftPct, title, rows } = t0;
    const left = Math.min(82, Math.max(18, leftPct));
    const t1 = `${left}%`;
    let t2;
    if ($[1] !== t1) {
        t2 = {
            left: t1
        };
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== title) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mb-1 font-semibold text-ink",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 184,
            columnNumber: 10
        }, this);
        $[3] = title;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== rows) {
        t4 = rows.map(_TooltipRowsMap);
        $[5] = rows;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== t2 || $[8] !== t3 || $[9] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pointer-events-none absolute top-1 z-10 min-w-32 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-2 text-xs shadow-lg transition-[left] duration-100",
            style: t2,
            role: "status",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 200,
            columnNumber: 10
        }, this);
        $[7] = t2;
        $[8] = t3;
        $[9] = t4;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    return t5;
}
_c1 = Tooltip;
function _TooltipRowsMap(r) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "flex items-center justify-between gap-3 text-ink-soft",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "size-2 rounded-sm",
                        style: {
                            background: r.color
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 211,
                        columnNumber: 144
                    }, this),
                    r.label
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 211,
                columnNumber: 93
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium text-ink tabular",
                children: r.value
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 213,
                columnNumber: 47
            }, this)
        ]
    }, r.label, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 211,
        columnNumber: 10
    }, this);
}
function Legend(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { series, hidden, onToggle } = t0;
    let t1;
    if ($[1] !== hidden || $[2] !== onToggle || $[3] !== series) {
        let t2;
        if ($[5] !== hidden || $[6] !== onToggle) {
            t2 = ({
                "Legend[series.map()]": (s, i)=>{
                    const off = hidden.includes(s.key);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: {
                            "Legend[series.map() > <button>.onClick]": ()=>onToggle(s.key)
                        }["Legend[series.map() > <button>.onClick]"],
                        "aria-pressed": !off,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs text-ink-muted transition-opacity hover:bg-surface-muted hover:text-ink", off && "opacity-45 line-through"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-2 w-3 rounded-sm",
                                style: {
                                    background: colorOf(s, i)
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 237,
                                columnNumber: 267
                            }, this),
                            s.label
                        ]
                    }, s.key, true, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 235,
                        columnNumber: 18
                    }, this);
                }
            })["Legend[series.map()]"];
            $[5] = hidden;
            $[6] = onToggle;
            $[7] = t2;
        } else {
            t2 = $[7];
        }
        t1 = series.map(t2);
        $[1] = hidden;
        $[2] = onToggle;
        $[3] = series;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    let t2;
    if ($[8] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
            className: "mt-2 flex flex-wrap gap-x-1 gap-y-1",
            children: t1
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 258,
            columnNumber: 10
        }, this);
        $[8] = t1;
        $[9] = t2;
    } else {
        t2 = $[9];
    }
    return t2;
}
_c2 = Legend;
function useHiddenSeries(series) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    let t1;
    if ($[2] !== series) {
        t1 = ({
            "useHiddenSeries[toggle]": (key)=>setHidden({
                    "useHiddenSeries[toggle > setHidden()]": (h)=>h.includes(key) ? h.filter({
                            "useHiddenSeries[toggle > setHidden() > h.filter()]": (k)=>k !== key
                        }["useHiddenSeries[toggle > setHidden() > h.filter()]"]) : h.length < series.length - 1 ? [
                            ...h,
                            key
                        ] : h
                }["useHiddenSeries[toggle > setHidden()]"])
        })["useHiddenSeries[toggle]"];
        $[2] = series;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const toggle = t1;
    let t2;
    if ($[4] !== hidden || $[5] !== toggle) {
        t2 = [
            hidden,
            toggle
        ];
        $[4] = hidden;
        $[5] = toggle;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    return t2;
}
_s1(useHiddenSeries, "NKuYFE4dPF8k9u/5Af1NguHWEhU=");
function LineChart(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(63);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 63; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { data, series, height: t1, className, label, empty } = t0;
    const height = t1 === undefined ? 220 : t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            top: 12,
            right: 12,
            bottom: 26,
            left: 44
        };
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    const pad = t2;
    const innerW = 640 - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const [hidden, toggle] = useHiddenSeries(series);
    let t3;
    if ($[2] !== hidden) {
        t3 = ({
            "LineChart[series.filter()]": (s)=>!hidden.includes(s.key)
        })["LineChart[series.filter()]"];
        $[2] = hidden;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const shown = series.filter(t3);
    const max = niceMax(Math.max(1, ...data.flatMap({
        "LineChart[data.flatMap()]": (d)=>shown.map({
                "LineChart[data.flatMap() > shown.map()]": (s_0)=>d[s_0.key] || 0
            }["LineChart[data.flatMap() > shown.map()]"])
    }["LineChart[data.flatMap()]"])));
    let t4;
    if ($[4] !== data.length) {
        t4 = ({
            "LineChart[x]": (i)=>pad.left + (data.length <= 1 ? innerW / 2 : i / (data.length - 1) * innerW)
        })["LineChart[x]"];
        $[4] = data.length;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const x = t4;
    let t5;
    if ($[6] !== innerH || $[7] !== max) {
        t5 = ({
            "LineChart[y]": (v)=>pad.top + innerH - v / max * innerH
        })["LineChart[y]"];
        $[6] = innerH;
        $[7] = max;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    const y = t5;
    const ticks = [
        0,
        0.25,
        0.5,
        0.75,
        1
    ].map({
        "LineChart[(anonymous)()]": (t)=>t * max
    }["LineChart[(anonymous)()]"]);
    const labelEvery = Math.ceil(data.length / 8);
    let t6;
    if ($[9] !== data.length) {
        t6 = ({
            "LineChart[useActiveIndex()]": (f)=>{
                const i_0 = Math.round((f * 640 - pad.left) / innerW * (data.length - 1));
                return Math.max(0, Math.min(data.length - 1, i_0));
            }
        })["LineChart[useActiveIndex()]"];
        $[9] = data.length;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    const { active, svgProps } = useActiveIndex(data.length, t6);
    if (!data.length) {
        let t7;
        if ($[11] !== className || $[12] !== empty) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartEmpty, {
                className: className,
                message: empty
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 404,
                columnNumber: 12
            }, this);
            $[11] = className;
            $[12] = empty;
            $[13] = t7;
        } else {
            t7 = $[13];
        }
        return t7;
    }
    let t7;
    if ($[14] !== className) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full", className);
        $[14] = className;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    const t8 = `0 0 ${640} ${height}`;
    const t9 = "h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500";
    const t10 = "img";
    const t11 = `${label}. Use arrow keys to read values.`;
    const t12 = ticks.map({
        "LineChart[ticks.map()]": (t_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: pad.left,
                        x2: 640 - pad.right,
                        y1: y(t_0),
                        y2: y(t_0),
                        stroke: "var(--line)",
                        strokeDasharray: t_0 === 0 ? "" : "3 4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 426,
                        columnNumber: 51
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: pad.left - 6,
                        y: y(t_0) + 4,
                        textAnchor: "end",
                        fontSize: "10",
                        fill: "var(--ink-muted)",
                        children: shortNumber(t_0)
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 426,
                        columnNumber: 180
                    }, this)
                ]
            }, t_0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 426,
                columnNumber: 38
            }, this)
    }["LineChart[ticks.map()]"]);
    let t13;
    if ($[16] !== active || $[17] !== data || $[18] !== height || $[19] !== labelEvery || $[20] !== x) {
        let t14;
        if ($[22] !== active || $[23] !== height || $[24] !== labelEvery || $[25] !== x) {
            t14 = ({
                "LineChart[data.map()]": (d_0, i_1)=>i_1 % labelEvery === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: x(i_1),
                        y: height - 8,
                        textAnchor: "middle",
                        fontSize: "10",
                        fill: active === i_1 ? "var(--ink)" : "var(--ink-muted)",
                        children: d_0.label
                    }, i_1, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 433,
                        columnNumber: 73
                    }, this) : null
            })["LineChart[data.map()]"];
            $[22] = active;
            $[23] = height;
            $[24] = labelEvery;
            $[25] = x;
            $[26] = t14;
        } else {
            t14 = $[26];
        }
        t13 = data.map(t14);
        $[16] = active;
        $[17] = data;
        $[18] = height;
        $[19] = labelEvery;
        $[20] = x;
        $[21] = t13;
    } else {
        t13 = $[21];
    }
    let t14;
    if ($[27] !== active || $[28] !== x || $[29] !== y) {
        t14 = active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
            x1: x(active),
            x2: x(active),
            y1: pad.top,
            y2: y(0),
            stroke: "var(--ink-muted)",
            strokeDasharray: "3 3",
            opacity: "0.6"
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 455,
            columnNumber: 29
        }, this);
        $[27] = active;
        $[28] = x;
        $[29] = y;
        $[30] = t14;
    } else {
        t14 = $[30];
    }
    let t15;
    if ($[31] !== active || $[32] !== data || $[33] !== hidden || $[34] !== max || $[35] !== series || $[36] !== x || $[37] !== y) {
        let t16;
        if ($[39] !== active || $[40] !== data || $[41] !== hidden || $[42] !== max || $[43] !== x || $[44] !== y) {
            t16 = ({
                "LineChart[series.map()]": (s_1, si)=>{
                    if (hidden.includes(s_1.key)) {
                        return null;
                    }
                    const color = colorOf(s_1, si);
                    const points = data.map({
                        "LineChart[series.map() > data.map()]": (d_1, i_2)=>`${x(i_2)},${y(d_1[s_1.key] || 0)}`
                    }["LineChart[series.map() > data.map()]"]).join(" ");
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        children: [
                            si === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                className: "chart-fade",
                                points: `${x(0)},${y(0)} ${points} ${x(data.length - 1)},${y(0)}`,
                                fill: color,
                                opacity: "0.08"
                            }, void 0, false, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 476,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                className: "chart-draw",
                                pathLength: "1",
                                points: points,
                                fill: "none",
                                stroke: color,
                                strokeWidth: "2",
                                strokeLinejoin: "round",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 476,
                                columnNumber: 190
                            }, this),
                            active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: x(active),
                                cy: y(data[active][s_1.key] || 0),
                                r: "4.5",
                                fill: "var(--surface)",
                                stroke: color,
                                strokeWidth: "2.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 476,
                                columnNumber: 363
                            }, this)
                        ]
                    }, `${s_1.key}-${max}`, true, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 476,
                        columnNumber: 18
                    }, this);
                }
            })["LineChart[series.map()]"];
            $[39] = active;
            $[40] = data;
            $[41] = hidden;
            $[42] = max;
            $[43] = x;
            $[44] = y;
            $[45] = t16;
        } else {
            t16 = $[45];
        }
        t15 = series.map(t16);
        $[31] = active;
        $[32] = data;
        $[33] = hidden;
        $[34] = max;
        $[35] = series;
        $[36] = x;
        $[37] = y;
        $[38] = t15;
    } else {
        t15 = $[38];
    }
    let t16;
    if ($[46] !== svgProps || $[47] !== t11 || $[48] !== t12 || $[49] !== t13 || $[50] !== t14 || $[51] !== t15 || $[52] !== t8) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: t8,
            className: t9,
            role: t10,
            "aria-label": t11,
            ...svgProps,
            children: [
                t12,
                t13,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 503,
            columnNumber: 11
        }, this);
        $[46] = svgProps;
        $[47] = t11;
        $[48] = t12;
        $[49] = t13;
        $[50] = t14;
        $[51] = t15;
        $[52] = t8;
        $[53] = t16;
    } else {
        t16 = $[53];
    }
    const t17 = active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
        leftPct: x(active) / 640 * 100,
        title: data[active].label,
        rows: shown.map({
            "LineChart[shown.map()]": (s_2)=>({
                    label: s_2.label,
                    color: colorOf(s_2, series.indexOf(s_2)),
                    value: formatValue(s_2, data[active][s_2.key] || 0)
                })
        }["LineChart[shown.map()]"])
    }, void 0, false, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 515,
        columnNumber: 33
    }, this);
    let t18;
    if ($[54] !== hidden || $[55] !== series || $[56] !== toggle) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Legend, {
            series: series,
            hidden: hidden,
            onToggle: toggle
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 524,
            columnNumber: 11
        }, this);
        $[54] = hidden;
        $[55] = series;
        $[56] = toggle;
        $[57] = t18;
    } else {
        t18 = $[57];
    }
    let t19;
    if ($[58] !== t16 || $[59] !== t17 || $[60] !== t18 || $[61] !== t7) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
            className: t7,
            children: [
                t16,
                t17,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 534,
            columnNumber: 11
        }, this);
        $[58] = t16;
        $[59] = t17;
        $[60] = t18;
        $[61] = t7;
        $[62] = t19;
    } else {
        t19 = $[62];
    }
    return t19;
}
_s2(LineChart, "fgWxYLJLu2eBHUcWYjlfRRJsCpU=", false, function() {
    return [
        useHiddenSeries,
        useActiveIndex
    ];
});
_c3 = LineChart;
function BarChart(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { data, series, height: t1, className, label, stacked: t2, empty } = t0;
    const height = t1 === undefined ? 220 : t1;
    const stacked = t2 === undefined ? false : t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            top: 12,
            right: 8,
            bottom: 26,
            left: 44
        };
        $[1] = t3;
    } else {
        t3 = $[1];
    }
    const pad = t3;
    const innerW = 640 - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const [hidden, toggle] = useHiddenSeries(series);
    let t4;
    if ($[2] !== hidden) {
        t4 = ({
            "BarChart[series.filter()]": (s)=>!hidden.includes(s.key)
        })["BarChart[series.filter()]"];
        $[2] = hidden;
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    const shown = series.filter(t4);
    const totals = data.map({
        "BarChart[data.map()]": (d)=>stacked ? shown.reduce({
                "BarChart[data.map() > shown.reduce()]": (s_0, ser)=>s_0 + (d[ser.key] || 0)
            }["BarChart[data.map() > shown.reduce()]"], 0) : Math.max(...shown.map({
                "BarChart[data.map() > shown.map()]": (ser_0)=>d[ser_0.key] || 0
            }["BarChart[data.map() > shown.map()]"]))
    }["BarChart[data.map()]"]);
    const max = niceMax(Math.max(1, ...totals));
    const band = innerW / Math.max(1, data.length);
    const barW = stacked ? band * 0.6 : band * 0.7 / shown.length;
    let t5;
    if ($[4] !== innerH || $[5] !== max) {
        t5 = ({
            "BarChart[y]": (v)=>pad.top + innerH - v / max * innerH
        })["BarChart[y]"];
        $[4] = innerH;
        $[5] = max;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    const y = t5;
    const ticks = [
        0,
        0.5,
        1
    ].map({
        "BarChart[(anonymous)()]": (t)=>t * max
    }["BarChart[(anonymous)()]"]);
    const labelEvery = Math.ceil(data.length / 10);
    let t6;
    if ($[7] !== band || $[8] !== data.length) {
        t6 = ({
            "BarChart[useActiveIndex()]": (f)=>Math.max(0, Math.min(data.length - 1, Math.floor((f * 640 - pad.left) / band)))
        })["BarChart[useActiveIndex()]"];
        $[7] = band;
        $[8] = data.length;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    const { active, svgProps } = useActiveIndex(data.length, t6);
    if (!data.length) {
        let t7;
        if ($[10] !== className || $[11] !== empty) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartEmpty, {
                className: className,
                message: empty
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 635,
                columnNumber: 12
            }, this);
            $[10] = className;
            $[11] = empty;
            $[12] = t7;
        } else {
            t7 = $[12];
        }
        return t7;
    }
    let t7;
    if ($[13] !== className) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full", className);
        $[13] = className;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== active || $[16] !== band || $[17] !== innerH) {
        t8 = active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: pad.left + active * band,
            y: pad.top,
            width: band,
            height: innerH,
            fill: "var(--neutral-bg)",
            opacity: "0.7",
            rx: "3"
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 654,
            columnNumber: 28
        }, this);
        $[15] = active;
        $[16] = band;
        $[17] = innerH;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== hidden || $[20] !== series || $[21] !== toggle) {
        t9 = series.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Legend, {
            series: series,
            hidden: hidden,
            onToggle: toggle
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 664,
            columnNumber: 31
        }, this);
        $[19] = hidden;
        $[20] = series;
        $[21] = toggle;
        $[22] = t9;
    } else {
        t9 = $[22];
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: t7,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: `0 0 ${640} ${height}`,
                className: "h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                role: "img",
                "aria-label": `${label}. Use arrow keys to read values.`,
                ...svgProps,
                children: [
                    ticks.map({
                        "BarChart[ticks.map()]": (t_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: pad.left,
                                        x2: 640 - pad.right,
                                        y1: y(t_0),
                                        y2: y(t_0),
                                        stroke: "var(--line)",
                                        strokeDasharray: t_0 === 0 ? "" : "3 4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/charts/interactive.jsx",
                                        lineNumber: 673,
                                        columnNumber: 54
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: pad.left - 6,
                                        y: y(t_0) + 4,
                                        textAnchor: "end",
                                        fontSize: "10",
                                        fill: "var(--ink-muted)",
                                        children: shortNumber(t_0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/charts/interactive.jsx",
                                        lineNumber: 673,
                                        columnNumber: 183
                                    }, this)
                                ]
                            }, t_0, true, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 673,
                                columnNumber: 41
                            }, this)
                    }["BarChart[ticks.map()]"]),
                    t8,
                    data.map({
                        "BarChart[data.map()]": (d_0, i)=>{
                            const bx = pad.left + i * band + (band - (stacked ? barW : barW * shown.length)) / 2;
                            let acc = 0;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        className: "chart-grow-y",
                                        style: {
                                            animationDelay: `${Math.min(i * 18, 400)}ms`,
                                            opacity: active == null || active === i ? 1 : 0.45,
                                            transition: "opacity 150ms"
                                        },
                                        children: shown.map({
                                            "BarChart[data.map() > shown.map()]": (s_1, si)=>{
                                                const v_0 = d_0[s_1.key] || 0;
                                                const color = colorOf(s_1, series.indexOf(s_1));
                                                if (stacked) {
                                                    const top = y(acc + v_0);
                                                    const h = y(acc) - top;
                                                    acc = acc + v_0;
                                                    acc;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: bx,
                                                        y: top,
                                                        width: barW,
                                                        height: Math.max(0, h),
                                                        fill: color,
                                                        rx: "2"
                                                    }, s_1.key, false, {
                                                        fileName: "[project]/src/components/charts/interactive.jsx",
                                                        lineNumber: 691,
                                                        columnNumber: 28
                                                    }, this);
                                                }
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                    x: bx + si * barW,
                                                    y: y(v_0),
                                                    width: Math.max(1, barW - 2),
                                                    height: Math.max(0, y(0) - y(v_0)),
                                                    fill: color,
                                                    rx: "2"
                                                }, s_1.key, false, {
                                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                                    lineNumber: 693,
                                                    columnNumber: 26
                                                }, this);
                                            }
                                        }["BarChart[data.map() > shown.map()]"])
                                    }, `${hidden.join()}-${max}`, false, {
                                        fileName: "[project]/src/components/charts/interactive.jsx",
                                        lineNumber: 678,
                                        columnNumber: 29
                                    }, this),
                                    i % labelEvery === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                        x: pad.left + i * band + band / 2,
                                        y: height - 8,
                                        textAnchor: "middle",
                                        fontSize: "10",
                                        fill: active === i ? "var(--ink)" : "var(--ink-muted)",
                                        children: d_0.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/charts/interactive.jsx",
                                        lineNumber: 695,
                                        columnNumber: 85
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/charts/interactive.jsx",
                                lineNumber: 678,
                                columnNumber: 18
                            }, this);
                        }
                    }["BarChart[data.map()]"])
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 672,
                columnNumber: 33
            }, this),
            active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                leftPct: (pad.left + active * band + band / 2) / 640 * 100,
                title: data[active].label,
                rows: [
                    ...shown.map({
                        "BarChart[shown.map()]": (s_2)=>({
                                label: s_2.label,
                                color: colorOf(s_2, series.indexOf(s_2)),
                                value: formatValue(s_2, data[active][s_2.key] || 0)
                            })
                    }["BarChart[shown.map()]"]),
                    ...stacked && shown.length > 1 ? [
                        {
                            label: "Total",
                            color: "transparent",
                            value: formatValue(shown[0], totals[active])
                        }
                    ] : []
                ]
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 697,
                columnNumber: 59
            }, this),
            t9
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 672,
        columnNumber: 10
    }, this);
}
_s3(BarChart, "fgWxYLJLu2eBHUcWYjlfRRJsCpU=", false, function() {
    return [
        useHiddenSeries,
        useActiveIndex
    ];
});
_c4 = BarChart;
function DonutChart(t0) {
    _s4();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "210f815db89c0ca1cd3af6ea4a9df3c4a8621c54e1ec446e3a8809b0888f8751";
    }
    const { data, size: t1, className, label, centerLabel, centerValue } = t0;
    const size = t1 === undefined ? 160 : t1;
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t2;
    if ($[1] !== data) {
        t2 = data.reduce(_DonutChartDataReduce, 0) || 1;
        $[1] = data;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const total = t2;
    const c = 2 * Math.PI * 60;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    if ($[3] !== active || $[4] !== centerLabel || $[5] !== centerValue || $[6] !== className || $[7] !== data || $[8] !== label || $[9] !== size || $[10] !== total) {
        let t8;
        if ($[16] !== data || $[17] !== total) {
            t8 = ({
                "DonutChart[data.map()]": (d_0, i)=>{
                    const len = d_0.value / total * c;
                    const start = data.slice(0, i).reduce({
                        "DonutChart[data.map() > (anonymous)()]": (s_0, x)=>s_0 + x.value / total * c
                    }["DonutChart[data.map() > (anonymous)()]"], 0);
                    return {
                        ...d_0,
                        len,
                        start,
                        color: d_0.color || palette[i % palette.length]
                    };
                }
            })["DonutChart[data.map()]"];
            $[16] = data;
            $[17] = total;
            $[18] = t8;
        } else {
            t8 = $[18];
        }
        const segments = data.map(t8);
        const a = active != null ? segments[active] : null;
        let t9;
        if ($[19] !== total) {
            t9 = ({
                "DonutChart[pct]": (v)=>`${(v / total * 100).toFixed(0)}%`
            })["DonutChart[pct]"];
            $[19] = total;
            $[20] = t9;
        } else {
            t9 = $[20];
        }
        const pct = t9;
        if ($[21] !== className) {
            t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-4 sm:flex-row sm:items-center", className);
            $[21] = className;
            $[22] = t5;
        } else {
            t5 = $[22];
        }
        if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = ({
                "DonutChart[<figure>.onPointerLeave]": (e)=>e.pointerType === "mouse" && setActive(null)
            })["DonutChart[<figure>.onPointerLeave]"];
            $[23] = t6;
        } else {
            t6 = $[23];
        }
        let t10;
        if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "80",
                cy: "80",
                r: 60,
                fill: "none",
                stroke: "var(--neutral-bg)",
                strokeWidth: "20"
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 795,
                columnNumber: 13
            }, this);
            $[24] = t10;
        } else {
            t10 = $[24];
        }
        let t11;
        if ($[25] !== active) {
            t11 = ({
                "DonutChart[segments.map()]": (s_1, i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: "chart-donut cursor-pointer",
                        cx: "80",
                        cy: "80",
                        r: 60,
                        fill: "none",
                        stroke: s_1.color,
                        strokeWidth: active === i_0 ? 26 : 20,
                        strokeDasharray: `${s_1.len} ${c - s_1.len}`,
                        strokeDashoffset: -s_1.start,
                        transform: "rotate(-90 80 80)",
                        pointerEvents: "stroke",
                        opacity: active == null || active === i_0 ? 1 : 0.35,
                        style: {
                            "--c": c,
                            animationDelay: `${i_0 * 70}ms`,
                            transition: "stroke-width 150ms, opacity 150ms"
                        },
                        onPointerEnter: {
                            "DonutChart[segments.map() > <circle>.onPointerEnter]": ()=>setActive(i_0)
                        }["DonutChart[segments.map() > <circle>.onPointerEnter]"],
                        onPointerDown: {
                            "DonutChart[segments.map() > <circle>.onPointerDown]": ()=>setActive(i_0)
                        }["DonutChart[segments.map() > <circle>.onPointerDown]"]
                    }, s_1.label, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 803,
                        columnNumber: 53
                    }, this)
            })["DonutChart[segments.map()]"];
            $[25] = active;
            $[26] = t11;
        } else {
            t11 = $[26];
        }
        const t12 = a ? `${a.label.length > 16 ? `${a.label.slice(0, 15)}…` : a.label} · ${pct(a.value)}` : centerLabel;
        let t13;
        if ($[27] !== t12) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: "80",
                y: "96",
                textAnchor: "middle",
                fontSize: "10",
                fill: "var(--ink-muted)",
                children: t12
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 821,
                columnNumber: 13
            }, this);
            $[27] = t12;
            $[28] = t13;
        } else {
            t13 = $[28];
        }
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 160 160",
            width: size,
            height: size,
            role: "img",
            "aria-label": label,
            className: "shrink-0 overflow-visible",
            children: [
                t10,
                segments.map(t11),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: "80",
                    y: "78",
                    textAnchor: "middle",
                    fontSize: a ? 18 : 20,
                    fontWeight: "600",
                    fill: "var(--ink)",
                    children: a ? a.display ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(a.value) : centerValue
                }, void 0, false, {
                    fileName: "[project]/src/components/charts/interactive.jsx",
                    lineNumber: 827,
                    columnNumber: 156
                }, this),
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 827,
            columnNumber: 10
        }, this);
        t3 = "w-full min-w-0 space-y-0.5";
        let t14;
        if ($[29] !== active || $[30] !== pct) {
            t14 = ({
                "DonutChart[segments.map()]": (d_1, i_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onPointerEnter: {
                                "DonutChart[segments.map() > <button>.onPointerEnter]": ()=>setActive(i_1)
                            }["DonutChart[segments.map() > <button>.onPointerEnter]"],
                            onFocus: {
                                "DonutChart[segments.map() > <button>.onFocus]": ()=>setActive(i_1)
                            }["DonutChart[segments.map() > <button>.onFocus]"],
                            onBlur: {
                                "DonutChart[segments.map() > <button>.onBlur]": ()=>setActive(null)
                            }["DonutChart[segments.map() > <button>.onBlur]"],
                            onClick: {
                                "DonutChart[segments.map() > <button>.onClick]": ()=>setActive(active === i_1 ? null : i_1)
                            }["DonutChart[segments.map() > <button>.onClick]"],
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center justify-between gap-3 rounded-md px-1.5 py-1 text-left text-sm transition-colors", active === i_1 ? "bg-surface-muted" : "hover:bg-surface-muted", active != null && active !== i_1 && "opacity-55"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex min-w-0 items-center gap-2 text-ink-soft",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "size-2.5 shrink-0 rounded-sm",
                                            style: {
                                                background: d_1.color
                                            },
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 840,
                                            columnNumber: 365
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: d_1.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 842,
                                            columnNumber: 39
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 840,
                                    columnNumber: 301
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 font-medium text-ink tabular",
                                    children: [
                                        d_1.display ?? d_1.value,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-normal text-ink-muted",
                                            children: [
                                                "(",
                                                pct(d_1.value),
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 842,
                                            columnNumber: 174
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 842,
                                    columnNumber: 91
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 832,
                            columnNumber: 73
                        }, this)
                    }, d_1.label, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 832,
                        columnNumber: 53
                    }, this)
            })["DonutChart[segments.map()]"];
            $[29] = active;
            $[30] = pct;
            $[31] = t14;
        } else {
            t14 = $[31];
        }
        t4 = segments.map(t14);
        $[3] = active;
        $[4] = centerLabel;
        $[5] = centerValue;
        $[6] = className;
        $[7] = data;
        $[8] = label;
        $[9] = size;
        $[10] = total;
        $[11] = t3;
        $[12] = t4;
        $[13] = t5;
        $[14] = t6;
        $[15] = t7;
    } else {
        t3 = $[11];
        t4 = $[12];
        t5 = $[13];
        t6 = $[14];
        t7 = $[15];
    }
    let t8;
    if ($[32] !== t3 || $[33] !== t4) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 873,
            columnNumber: 10
        }, this);
        $[32] = t3;
        $[33] = t4;
        $[34] = t8;
    } else {
        t8 = $[34];
    }
    let t9;
    if ($[35] !== t5 || $[36] !== t6 || $[37] !== t7 || $[38] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
            className: t5,
            onPointerLeave: t6,
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/charts/interactive.jsx",
            lineNumber: 882,
            columnNumber: 10
        }, this);
        $[35] = t5;
        $[36] = t6;
        $[37] = t7;
        $[38] = t8;
        $[39] = t9;
    } else {
        t9 = $[39];
    }
    return t9;
}
_s4(DonutChart, "UiziKGcot5E8nbuQQ2ZlRLdhk5k=");
_c5 = DonutChart;
function _DonutChartDataReduce(s, d) {
    return s + d.value;
}
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ChartEmpty");
__turbopack_context__.k.register(_c1, "Tooltip");
__turbopack_context__.k.register(_c2, "Legend");
__turbopack_context__.k.register(_c3, "LineChart");
__turbopack_context__.k.register(_c4, "BarChart");
__turbopack_context__.k.register(_c5, "DonutChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/button.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "ButtonLink",
    ()=>ButtonLink,
    "buttonClasses",
    ()=>buttonClasses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
;
;
;
;
;
const variants = {
    primary: "bg-brand-600 text-brand-fg hover:bg-brand-700 active:bg-brand-800 border border-transparent",
    secondary: "bg-surface text-ink border border-line-strong hover:bg-surface-muted active:bg-neutral-bg",
    ghost: "bg-transparent text-ink-soft border border-transparent hover:bg-neutral-bg hover:text-ink",
    outline: "bg-surface text-ink border border-line-strong hover:bg-surface-muted active:bg-neutral-bg",
    danger: "bg-danger text-white border border-transparent hover:brightness-95 active:brightness-90",
    "danger-outline": "bg-surface text-danger-ink border border-line-strong hover:bg-danger-bg",
    link: "bg-transparent text-brand-700 border border-transparent hover:underline px-0"
};
const sizes = {
    xs: "h-7 px-2 text-xs gap-1 rounded-md",
    sm: "h-8 px-3 text-[13px] gap-1.5 rounded-md",
    md: "h-9 px-3.5 text-sm gap-2 rounded-lg",
    lg: "h-10 px-4 text-sm gap-2 rounded-lg",
    icon: "h-9 w-9 rounded-lg justify-center",
    "icon-sm": "h-8 w-8 rounded-md justify-center"
};
function buttonClasses({ variant = "secondary", size = "md", className } = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors select-none", "disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-auto aria-disabled:cursor-not-allowed aria-disabled:opacity-55", variants[variant], sizes[size], className);
}
function Button(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(30);
    if ($[0] !== "7e519d5930ca57083b27145be6884371704c1b6912e7fce5c69918bc2d6db52c") {
        for(let $i = 0; $i < 30; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7e519d5930ca57083b27145be6884371704c1b6912e7fce5c69918bc2d6db52c";
    }
    let children;
    let className;
    let disabled;
    let props;
    let size;
    let t1;
    let t2;
    let t3;
    let variant;
    if ($[1] !== t0) {
        ({ asChild: t1, variant, size, className, loading: t2, disabled, children, type: t3, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = disabled;
        $[5] = props;
        $[6] = size;
        $[7] = t1;
        $[8] = t2;
        $[9] = t3;
        $[10] = variant;
    } else {
        children = $[2];
        className = $[3];
        disabled = $[4];
        props = $[5];
        size = $[6];
        t1 = $[7];
        t2 = $[8];
        t3 = $[9];
        variant = $[10];
    }
    const asChild = t1 === undefined ? false : t1;
    const loading = t2 === undefined ? false : t2;
    const type = t3 === undefined ? "button" : t3;
    let t4;
    if ($[11] !== className || $[12] !== size || $[13] !== variant) {
        t4 = buttonClasses({
            variant,
            size,
            className
        });
        $[11] = className;
        $[12] = size;
        $[13] = variant;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    const classNameValue = t4;
    if (asChild) {
        const t5 = loading || undefined;
        let t6;
        if ($[15] !== children || $[16] !== classNameValue || $[17] !== props || $[18] !== t5) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"], {
                className: classNameValue,
                "aria-busy": t5,
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/button.jsx",
                lineNumber: 102,
                columnNumber: 12
            }, this);
            $[15] = children;
            $[16] = classNameValue;
            $[17] = props;
            $[18] = t5;
            $[19] = t6;
        } else {
            t6 = $[19];
        }
        return t6;
    }
    const t5 = disabled || loading;
    const t6 = loading || undefined;
    let t7;
    if ($[20] !== loading) {
        t7 = loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            className: "size-4 animate-spin",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/button.jsx",
            lineNumber: 117,
            columnNumber: 20
        }, this) : null;
        $[20] = loading;
        $[21] = t7;
    } else {
        t7 = $[21];
    }
    let t8;
    if ($[22] !== children || $[23] !== classNameValue || $[24] !== props || $[25] !== t5 || $[26] !== t6 || $[27] !== t7 || $[28] !== type) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: type,
            className: classNameValue,
            disabled: t5,
            "aria-busy": t6,
            ...props,
            children: [
                t7,
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/button.jsx",
            lineNumber: 125,
            columnNumber: 10
        }, this);
        $[22] = children;
        $[23] = classNameValue;
        $[24] = props;
        $[25] = t5;
        $[26] = t6;
        $[27] = t7;
        $[28] = type;
        $[29] = t8;
    } else {
        t8 = $[29];
    }
    return t8;
}
_c = Button;
function ButtonLink(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "7e519d5930ca57083b27145be6884371704c1b6912e7fce5c69918bc2d6db52c") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7e519d5930ca57083b27145be6884371704c1b6912e7fce5c69918bc2d6db52c";
    }
    let children;
    let className;
    let props;
    let size;
    let variant;
    if ($[1] !== t0) {
        ({ variant, size, className, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = size;
        $[6] = variant;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        size = $[5];
        variant = $[6];
    }
    let t1;
    if ($[7] !== className || $[8] !== size || $[9] !== variant) {
        t1 = buttonClasses({
            variant,
            size,
            className
        });
        $[7] = className;
        $[8] = size;
        $[9] = variant;
        $[10] = t1;
    } else {
        t1 = $[10];
    }
    let t2;
    if ($[11] !== children || $[12] !== props || $[13] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            className: t1,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/button.jsx",
            lineNumber: 189,
            columnNumber: 10
        }, this);
        $[11] = children;
        $[12] = props;
        $[13] = t1;
        $[14] = t2;
    } else {
        t2 = $[14];
    }
    return t2;
}
_c1 = ButtonLink;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button");
__turbopack_context__.k.register(_c1, "ButtonLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/form.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox,
    "Field",
    ()=>Field,
    "Input",
    ()=>Input,
    "Select",
    ()=>Select,
    "Switch",
    ()=>Switch,
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const controlBase = "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger aria-invalid:ring-danger/15";
function Input(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(controlBase, "h-9", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c = Input;
function Textarea(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, rows: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
    }
    const rows = t1 === undefined ? 3 : t1;
    let t2;
    if ($[5] !== className) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(controlBase, "py-2 leading-relaxed", className);
        $[5] = className;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== rows || $[9] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            rows: rows,
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 86,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = rows;
        $[9] = t2;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    return t3;
}
_c1 = Textarea;
function Select(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(25);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 25; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    let children;
    let className;
    let placeholder;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ className, options: t1, placeholder, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = placeholder;
        $[5] = props;
        $[6] = t1;
    } else {
        children = $[2];
        className = $[3];
        placeholder = $[4];
        props = $[5];
        t1 = $[6];
    }
    let t2;
    if ($[7] !== t1) {
        t2 = t1 === undefined ? [] : t1;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    const options = t2;
    let t3;
    if ($[9] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative min-w-0", className);
        $[9] = className;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    let t4;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(controlBase, "h-9 appearance-none pr-8");
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== placeholder) {
        t5 = placeholder != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "",
            children: placeholder
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 156,
            columnNumber: 33
        }, this);
        $[12] = placeholder;
        $[13] = t5;
    } else {
        t5 = $[13];
    }
    let t6;
    if ($[14] !== options) {
        t6 = options.map(_SelectOptionsMap);
        $[14] = options;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== children || $[17] !== props || $[18] !== t5 || $[19] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            className: t4,
            ...props,
            children: [
                t5,
                t6,
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 172,
            columnNumber: 10
        }, this);
        $[16] = children;
        $[17] = props;
        $[18] = t5;
        $[19] = t6;
        $[20] = t7;
    } else {
        t7 = $[20];
    }
    let t8;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 183,
            columnNumber: 10
        }, this);
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    let t9;
    if ($[22] !== t3 || $[23] !== t7) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 190,
            columnNumber: 10
        }, this);
        $[22] = t3;
        $[23] = t7;
        $[24] = t9;
    } else {
        t9 = $[24];
    }
    return t9;
}
_c2 = Select;
function _SelectOptionsMap(option) {
    const value = typeof option === "object" ? option.value : option;
    const label = typeof option === "object" ? option.label : option;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: value,
        children: label
    }, value, false, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 202,
        columnNumber: 10
    }, this);
}
function Field(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(21);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 21; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    const { label, hint, error, required, children, className, htmlFor } = t0;
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const id = htmlFor || autoId;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-0 space-y-1.5", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== id || $[4] !== label || $[5] !== required) {
        t2 = label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: id,
            className: "block text-[13px] font-medium text-ink-soft",
            children: [
                label,
                required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-0.5 text-danger-ink",
                    "aria-hidden": true,
                    children: "*"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/form.jsx",
                    lineNumber: 233,
                    columnNumber: 115
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 233,
            columnNumber: 19
        }, this);
        $[3] = id;
        $[4] = label;
        $[5] = required;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== children || $[8] !== error || $[9] !== hint || $[10] !== id) {
        t3 = typeof children === "function" ? children({
            id,
            invalid: Boolean(error),
            describedBy: error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }) : children;
        $[7] = children;
        $[8] = error;
        $[9] = hint;
        $[10] = id;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== error || $[13] !== hint || $[14] !== id) {
        t4 = error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: `${id}-error`,
            className: "text-xs text-danger-ink",
            role: "alert",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 258,
            columnNumber: 18
        }, this) : hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            id: `${id}-hint`,
            className: "text-xs text-ink-muted",
            children: hint
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 258,
            columnNumber: 110
        }, this) : null;
        $[12] = error;
        $[13] = hint;
        $[14] = id;
        $[15] = t4;
    } else {
        t4 = $[15];
    }
    let t5;
    if ($[16] !== t1 || $[17] !== t2 || $[18] !== t3 || $[19] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: [
                t2,
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 268,
            columnNumber: 10
        }, this);
        $[16] = t1;
        $[17] = t2;
        $[18] = t3;
        $[19] = t4;
        $[20] = t5;
    } else {
        t5 = $[20];
    }
    return t5;
}
_s(Field, "c30GLqU4NaAI3XCSCLfDXteiTN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c3 = Field;
function Checkbox(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    let className;
    let label;
    let props;
    if ($[1] !== t0) {
        ({ className, label, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = label;
        $[4] = props;
    } else {
        className = $[2];
        label = $[3];
        props = $[4];
    }
    const t1 = !label && className;
    let t2;
    if ($[5] !== t1) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 rounded border-line-strong accent-brand-600 disabled:cursor-not-allowed", t1);
        $[5] = t1;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 316,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    const input = t3;
    if (!label) {
        return input;
    }
    let t4;
    if ($[10] !== className) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft", className);
        $[10] = className;
        $[11] = t4;
    } else {
        t4 = $[11];
    }
    let t5;
    if ($[12] !== input || $[13] !== label || $[14] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: t4,
            children: [
                input,
                label
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 337,
            columnNumber: 10
        }, this);
        $[12] = input;
        $[13] = label;
        $[14] = t4;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    return t5;
}
_c4 = Checkbox;
function Switch(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9bf693bd240d38fe0b63982b8da8827732c050fa879c3614a0691551d3e9882f";
    }
    const { checked, onChange, label, disabled, id, description } = t0;
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const switchId = id || autoId;
    let t1;
    if ($[1] !== description || $[2] !== label || $[3] !== switchId) {
        t1 = (label || description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: switchId,
            className: "min-w-0 cursor-pointer",
            children: [
                label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-sm font-medium text-ink",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/form.jsx",
                    lineNumber: 367,
                    columnNumber: 107
                }, this),
                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block text-xs text-ink-muted",
                    children: description
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/form.jsx",
                    lineNumber: 367,
                    columnNumber: 191
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 367,
            columnNumber: 36
        }, this);
        $[1] = description;
        $[2] = label;
        $[3] = switchId;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const t2 = Boolean(checked);
    let t3;
    if ($[5] !== checked || $[6] !== onChange) {
        t3 = ({
            "Switch[<button>.onClick]": ()=>onChange?.(!checked)
        })["Switch[<button>.onClick]"];
        $[5] = checked;
        $[6] = onChange;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const t4 = checked ? "bg-brand-600" : "bg-line-strong";
    let t5;
    if ($[8] !== t4) {
        t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", t4);
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const t6 = checked ? "translate-x-4.5" : "translate-x-0.5";
    let t7;
    if ($[10] !== t6) {
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-block size-4 rounded-full bg-white shadow transition-transform", t6);
        $[10] = t6;
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t7
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 407,
            columnNumber: 10
        }, this);
        $[12] = t7;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== disabled || $[15] !== switchId || $[16] !== t2 || $[17] !== t3 || $[18] !== t5 || $[19] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            id: switchId,
            type: "button",
            role: "switch",
            "aria-checked": t2,
            disabled: disabled,
            onClick: t3,
            className: t5,
            children: t8
        }, void 0, false, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 415,
            columnNumber: 10
        }, this);
        $[14] = disabled;
        $[15] = switchId;
        $[16] = t2;
        $[17] = t3;
        $[18] = t5;
        $[19] = t8;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== t1 || $[22] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-4",
            children: [
                t1,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/form.jsx",
            lineNumber: 428,
            columnNumber: 11
        }, this);
        $[21] = t1;
        $[22] = t9;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    return t10;
}
_s1(Switch, "c30GLqU4NaAI3XCSCLfDXteiTN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c5 = Switch;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Input");
__turbopack_context__.k.register(_c1, "Textarea");
__turbopack_context__.k.register(_c2, "Select");
__turbopack_context__.k.register(_c3, "Field");
__turbopack_context__.k.register(_c4, "Checkbox");
__turbopack_context__.k.register(_c5, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/dashboard/dashboard-filters.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const query = (values)=>{
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values))if (v && !(k === "type" && v === "all")) params.set(k, v);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
};
function DashboardFilters(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(123);
    if ($[0] !== "2a6b13ea6bb57cf551ab258a2ecb359b0565198aee0ec70c782d050eadda8786") {
        for(let $i = 0; $i < 123; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2a6b13ea6bb57cf551ab258a2ecb359b0565198aee0ec70c782d050eadda8786";
    }
    const { values, options, label } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(values);
    const [lastValues, setLastValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(values);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (lastValues !== values) {
        setLastValues(values);
        setDraft(values);
    }
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "DashboardFilters[set]": (key, value)=>setDraft({
                    "DashboardFilters[set > setDraft()]": (d)=>({
                            ...d,
                            [key]: value
                        })
                }["DashboardFilters[set > setDraft()]"])
        })["DashboardFilters[set]"];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const set = t1;
    let dateError;
    let extraCount;
    let reset;
    let t10;
    let t11;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[2] !== draft || $[3] !== expanded || $[4] !== options.cycles || $[5] !== options.financialYears || $[6] !== options.orderTypes || $[7] !== options.presets || $[8] !== options.seasons || $[9] !== options.vendors || $[10] !== pathname || $[11] !== router || $[12] !== values.cycle || $[13] !== values.preset || $[14] !== values.season || $[15] !== values.type || $[16] !== values.vendor) {
        const sticky = {
            vendor: values.vendor,
            type: values.type,
            season: values.season,
            cycle: values.cycle
        };
        dateError = draft.from && draft.to && draft.to < draft.from ? "End date is before start date." : draft.from && !draft.to || !draft.from && draft.to ? "Choose both dates." : null;
        let t12;
        if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
            t12 = [
                "fy",
                "season",
                "cycle",
                "type"
            ];
            $[30] = t12;
        } else {
            t12 = $[30];
        }
        let t13;
        if ($[31] !== draft) {
            t13 = t12.filter({
                "DashboardFilters[(anonymous)()]": (k)=>draft[k] && !(k === "type" && draft[k] === "all")
            }["DashboardFilters[(anonymous)()]"]);
            $[31] = draft;
            $[32] = t13;
        } else {
            t13 = $[32];
        }
        extraCount = t13.length;
        let t14;
        if ($[33] !== dateError || $[34] !== draft || $[35] !== pathname || $[36] !== router) {
            t14 = ({
                "DashboardFilters[apply]": (event)=>{
                    event.preventDefault();
                    if (dateError) {
                        return;
                    }
                    const custom = draft.from && draft.to;
                    const next = {
                        ...draft,
                        preset: custom || draft.fy ? "" : draft.preset,
                        fy: custom ? "" : draft.fy
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRouteProgress"])();
                    router.push(`${pathname}${query(next)}`, {
                        scroll: false
                    });
                }
            })["DashboardFilters[apply]"];
            $[33] = dateError;
            $[34] = draft;
            $[35] = pathname;
            $[36] = router;
            $[37] = t14;
        } else {
            t14 = $[37];
        }
        const apply = t14;
        let t15;
        if ($[38] !== pathname || $[39] !== router) {
            t15 = ({
                "DashboardFilters[reset]": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRouteProgress"])();
                    router.push(pathname, {
                        scroll: false
                    });
                }
            })["DashboardFilters[reset]"];
            $[38] = pathname;
            $[39] = router;
            $[40] = t15;
        } else {
            t15 = $[40];
        }
        reset = t15;
        t8 = apply;
        t9 = "mb-4 rounded-xl border border-line bg-surface p-3 sm:p-4";
        t10 = "Dashboard filters";
        let t16;
        if ($[41] !== draft.vendor || $[42] !== options.vendors) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                label: "Seller",
                className: "col-span-2 md:col-span-1",
                children: (t17)=>{
                    const { id } = t17;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        id: id,
                        value: draft.vendor,
                        onChange: {
                            "DashboardFilters[<anonymous> > <Select>.onChange]": (e)=>set("vendor", e.target.value)
                        }["DashboardFilters[<anonymous> > <Select>.onChange]"],
                        options: options.vendors,
                        placeholder: "All sellers"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 149,
                        columnNumber: 18
                    }, this);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 145,
                columnNumber: 13
            }, this);
            $[41] = draft.vendor;
            $[42] = options.vendors;
            $[43] = t16;
        } else {
            t16 = $[43];
        }
        let t17;
        if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                className: "mb-1.5 text-[13px] font-medium text-ink-soft",
                children: "Date range"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 161,
                columnNumber: 13
            }, this);
            $[44] = t17;
        } else {
            t17 = $[44];
        }
        const t18 = draft.to || undefined;
        let t19;
        if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
            t19 = ({
                "DashboardFilters[<Input>.onChange]": (e_0)=>set("from", e_0.target.value)
            })["DashboardFilters[<Input>.onChange]"];
            $[45] = t19;
        } else {
            t19 = $[45];
        }
        let t20;
        if ($[46] !== draft.from || $[47] !== t18) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                type: "date",
                "aria-label": "From date",
                value: draft.from,
                max: t18,
                onChange: t19,
                className: "min-w-0"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 178,
                columnNumber: 13
            }, this);
            $[46] = draft.from;
            $[47] = t18;
            $[48] = t20;
        } else {
            t20 = $[48];
        }
        let t21;
        if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-xs text-ink-muted",
                children: "to"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 187,
                columnNumber: 13
            }, this);
            $[49] = t21;
        } else {
            t21 = $[49];
        }
        const t22 = draft.from || undefined;
        let t23;
        if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
            t23 = ({
                "DashboardFilters[<Input>.onChange]": (e_1)=>set("to", e_1.target.value)
            })["DashboardFilters[<Input>.onChange]"];
            $[50] = t23;
        } else {
            t23 = $[50];
        }
        let t24;
        if ($[51] !== draft.to || $[52] !== t22) {
            t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                type: "date",
                "aria-label": "To date",
                value: draft.to,
                min: t22,
                onChange: t23,
                className: "min-w-0"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 204,
                columnNumber: 13
            }, this);
            $[51] = draft.to;
            $[52] = t22;
            $[53] = t24;
        } else {
            t24 = $[53];
        }
        let t25;
        if ($[54] !== t20 || $[55] !== t24) {
            t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    t20,
                    t21,
                    t24
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 213,
                columnNumber: 13
            }, this);
            $[54] = t20;
            $[55] = t24;
            $[56] = t25;
        } else {
            t25 = $[56];
        }
        let t26;
        if ($[57] !== dateError) {
            t26 = dateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-xs text-danger-ink",
                role: "alert",
                children: dateError
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 222,
                columnNumber: 26
            }, this);
            $[57] = dateError;
            $[58] = t26;
        } else {
            t26 = $[58];
        }
        let t27;
        if ($[59] !== t25 || $[60] !== t26) {
            t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                className: "col-span-2 min-w-0 md:col-span-2 xl:col-span-1",
                children: [
                    t17,
                    t25,
                    t26
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 230,
                columnNumber: 13
            }, this);
            $[59] = t25;
            $[60] = t26;
            $[61] = t27;
        } else {
            t27 = $[61];
        }
        const t28 = !expanded && "hidden md:grid";
        let t29;
        if ($[62] !== t28) {
            t29 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-span-2 grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-4 xl:col-span-4", t28);
            $[62] = t28;
            $[63] = t29;
        } else {
            t29 = $[63];
        }
        let t30;
        if ($[64] !== draft.fy || $[65] !== options.financialYears) {
            t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                label: "Financial year",
                children: (t31)=>{
                    const { id: id_0 } = t31;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        id: id_0,
                        value: draft.fy,
                        onChange: {
                            "DashboardFilters[<anonymous> > <Select>.onChange]": (e_2)=>set("fy", e_2.target.value)
                        }["DashboardFilters[<anonymous> > <Select>.onChange]"],
                        options: options.financialYears,
                        placeholder: "Any year"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 252,
                        columnNumber: 18
                    }, this);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 248,
                columnNumber: 13
            }, this);
            $[64] = draft.fy;
            $[65] = options.financialYears;
            $[66] = t30;
        } else {
            t30 = $[66];
        }
        let t31;
        if ($[67] !== draft.season || $[68] !== options.seasons) {
            t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                label: "Season",
                children: (t32)=>{
                    const { id: id_1 } = t32;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        id: id_1,
                        value: draft.season,
                        onChange: {
                            "DashboardFilters[<anonymous> > <Select>.onChange]": (e_3)=>set("season", e_3.target.value)
                        }["DashboardFilters[<anonymous> > <Select>.onChange]"],
                        options: options.seasons,
                        placeholder: "All seasons"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 268,
                        columnNumber: 18
                    }, this);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 264,
                columnNumber: 13
            }, this);
            $[67] = draft.season;
            $[68] = options.seasons;
            $[69] = t31;
        } else {
            t31 = $[69];
        }
        let t32;
        if ($[70] !== draft.cycle || $[71] !== options.cycles) {
            t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                label: "Payout cycle",
                children: (t33)=>{
                    const { id: id_2 } = t33;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        id: id_2,
                        value: draft.cycle,
                        onChange: {
                            "DashboardFilters[<anonymous> > <Select>.onChange]": (e_4)=>set("cycle", e_4.target.value)
                        }["DashboardFilters[<anonymous> > <Select>.onChange]"],
                        options: options.cycles,
                        placeholder: "Any cycle"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 284,
                        columnNumber: 18
                    }, this);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 280,
                columnNumber: 13
            }, this);
            $[70] = draft.cycle;
            $[71] = options.cycles;
            $[72] = t32;
        } else {
            t32 = $[72];
        }
        let t33;
        if ($[73] !== draft.type || $[74] !== options.orderTypes) {
            t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                label: "Order type",
                children: (t34)=>{
                    const { id: id_3 } = t34;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        id: id_3,
                        value: draft.type,
                        onChange: {
                            "DashboardFilters[<anonymous> > <Select>.onChange]": (e_5)=>set("type", e_5.target.value)
                        }["DashboardFilters[<anonymous> > <Select>.onChange]"],
                        options: options.orderTypes
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 300,
                        columnNumber: 18
                    }, this);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 296,
                columnNumber: 13
            }, this);
            $[73] = draft.type;
            $[74] = options.orderTypes;
            $[75] = t33;
        } else {
            t33 = $[75];
        }
        let t34;
        if ($[76] !== t29 || $[77] !== t30 || $[78] !== t31 || $[79] !== t32 || $[80] !== t33) {
            t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: t29,
                children: [
                    t30,
                    t31,
                    t32,
                    t33
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 312,
                columnNumber: 13
            }, this);
            $[76] = t29;
            $[77] = t30;
            $[78] = t31;
            $[79] = t32;
            $[80] = t33;
            $[81] = t34;
        } else {
            t34 = $[81];
        }
        if ($[82] !== t16 || $[83] !== t27 || $[84] !== t34) {
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]",
                children: [
                    t16,
                    t27,
                    t34
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 323,
                columnNumber: 13
            }, this);
            $[82] = t16;
            $[83] = t27;
            $[84] = t34;
            $[85] = t11;
        } else {
            t11 = $[85];
        }
        t7 = "mt-3 flex flex-col gap-3 border-t border-line pt-3 lg:flex-row lg:items-center lg:justify-between";
        t6 = "-mx-1 overflow-x-auto px-1 scrollbar-thin";
        t2 = "Date presets";
        t3 = "flex min-w-max items-center gap-1.5";
        if ($[86] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mr-1 text-[11px] font-semibold tracking-wide text-ink-muted uppercase",
                children: "Presets"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 336,
                columnNumber: 12
            }, this);
            $[86] = t4;
        } else {
            t4 = $[86];
        }
        t5 = options.presets.map({
            "DashboardFilters[options.presets.map()]": (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `${pathname}${query({
                        ...sticky,
                        preset: p.value
                    })}`,
                    scroll: false,
                    "aria-current": values.preset === p.value ? "true" : undefined,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors", values.preset === p.value ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line text-ink-soft hover:border-brand-200 hover:bg-brand-50"),
                    children: p.label
                }, p.value, false, {
                    fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                    lineNumber: 342,
                    columnNumber: 55
                }, this)
        }["DashboardFilters[options.presets.map()]"]);
        $[2] = draft;
        $[3] = expanded;
        $[4] = options.cycles;
        $[5] = options.financialYears;
        $[6] = options.orderTypes;
        $[7] = options.presets;
        $[8] = options.seasons;
        $[9] = options.vendors;
        $[10] = pathname;
        $[11] = router;
        $[12] = values.cycle;
        $[13] = values.preset;
        $[14] = values.season;
        $[15] = values.type;
        $[16] = values.vendor;
        $[17] = dateError;
        $[18] = extraCount;
        $[19] = reset;
        $[20] = t10;
        $[21] = t11;
        $[22] = t2;
        $[23] = t3;
        $[24] = t4;
        $[25] = t5;
        $[26] = t6;
        $[27] = t7;
        $[28] = t8;
        $[29] = t9;
    } else {
        dateError = $[17];
        extraCount = $[18];
        reset = $[19];
        t10 = $[20];
        t11 = $[21];
        t2 = $[22];
        t3 = $[23];
        t4 = $[24];
        t5 = $[25];
        t6 = $[26];
        t7 = $[27];
        t8 = $[28];
        t9 = $[29];
    }
    let t12;
    if ($[87] !== t2 || $[88] !== t3 || $[89] !== t4 || $[90] !== t5) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            "aria-label": t2,
            className: t3,
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 392,
            columnNumber: 11
        }, this);
        $[87] = t2;
        $[88] = t3;
        $[89] = t4;
        $[90] = t5;
        $[91] = t12;
    } else {
        t12 = $[91];
    }
    let t13;
    if ($[92] !== t12 || $[93] !== t6) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: t12
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 403,
            columnNumber: 11
        }, this);
        $[92] = t12;
        $[93] = t6;
        $[94] = t13;
    } else {
        t13 = $[94];
    }
    let t14;
    if ($[95] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = ({
            "DashboardFilters[<Button>.onClick]": ()=>setExpanded(_DashboardFiltersButtonOnClickSetExpanded)
        })["DashboardFilters[<Button>.onClick]"];
        $[95] = t14;
    } else {
        t14 = $[95];
    }
    let t15;
    if ($[96] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
            className: "size-4",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 421,
            columnNumber: 11
        }, this);
        $[96] = t15;
    } else {
        t15 = $[96];
    }
    const t16 = expanded ? "Fewer filters" : `More filters${extraCount ? ` (${extraCount})` : ""}`;
    let t17;
    if ($[97] !== expanded || $[98] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "button",
            size: "sm",
            variant: "ghost",
            className: "md:hidden",
            onClick: t14,
            "aria-expanded": expanded,
            children: [
                t15,
                " ",
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 429,
            columnNumber: 11
        }, this);
        $[97] = expanded;
        $[98] = t16;
        $[99] = t17;
    } else {
        t17 = $[99];
    }
    let t18;
    if ($[100] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
            className: "size-4",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 438,
            columnNumber: 11
        }, this);
        $[100] = t18;
    } else {
        t18 = $[100];
    }
    let t19;
    if ($[101] !== reset) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "button",
            size: "sm",
            variant: "ghost",
            onClick: reset,
            className: "ml-auto lg:ml-0",
            children: [
                t18,
                " Reset"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 445,
            columnNumber: 11
        }, this);
        $[101] = reset;
        $[102] = t19;
    } else {
        t19 = $[102];
    }
    const t20 = Boolean(dateError);
    let t21;
    if ($[103] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
            className: "size-4",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 454,
            columnNumber: 11
        }, this);
        $[103] = t21;
    } else {
        t21 = $[103];
    }
    let t22;
    if ($[104] !== t20) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "submit",
            size: "sm",
            variant: "primary",
            disabled: t20,
            children: [
                t21,
                " Apply filter"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 461,
            columnNumber: 11
        }, this);
        $[104] = t20;
        $[105] = t22;
    } else {
        t22 = $[105];
    }
    let t23;
    if ($[106] !== t17 || $[107] !== t19 || $[108] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t17,
                t19,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 469,
            columnNumber: 11
        }, this);
        $[106] = t17;
        $[107] = t19;
        $[108] = t22;
        $[109] = t23;
    } else {
        t23 = $[109];
    }
    let t24;
    if ($[110] !== t13 || $[111] !== t23 || $[112] !== t7) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t7,
            children: [
                t13,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 479,
            columnNumber: 11
        }, this);
        $[110] = t13;
        $[111] = t23;
        $[112] = t7;
        $[113] = t24;
    } else {
        t24 = $[113];
    }
    let t25;
    if ($[114] !== label) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-2 text-xs text-ink-muted",
            "aria-live": "polite",
            children: [
                "Showing: ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium text-ink-soft",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                    lineNumber: 489,
                    columnNumber: 82
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 489,
            columnNumber: 11
        }, this);
        $[114] = label;
        $[115] = t25;
    } else {
        t25 = $[115];
    }
    let t26;
    if ($[116] !== t10 || $[117] !== t11 || $[118] !== t24 || $[119] !== t25 || $[120] !== t8 || $[121] !== t9) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: t8,
            className: t9,
            "aria-label": t10,
            children: [
                t11,
                t24,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
            lineNumber: 497,
            columnNumber: 11
        }, this);
        $[116] = t10;
        $[117] = t11;
        $[118] = t24;
        $[119] = t25;
        $[120] = t8;
        $[121] = t9;
        $[122] = t26;
    } else {
        t26 = $[122];
    }
    return t26;
}
_s(DashboardFilters, "Empaiiye379wa+fiOwDyGphn8d0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = DashboardFilters;
function _DashboardFiltersButtonOnClickSetExpanded(v) {
    return !v;
}
var _c;
__turbopack_context__.k.register(_c, "DashboardFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/dashboard/dashboard-accordion.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardAccordion",
    ()=>DashboardAccordion,
    "DashboardSection",
    ()=>DashboardSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDownUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-down-up.js [app-client] (ecmascript) <export default as ChevronsDownUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-client] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const AccordionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function DashboardAccordion(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "3f29a30777908346a205262932889e7e9ad249f782ff0a1f6e860eac1ededdf3") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3f29a30777908346a205262932889e7e9ad249f782ff0a1f6e860eac1ededdf3";
    }
    const { sections, defaultOpen: t1, children } = t0;
    let t2;
    if ($[1] !== t1) {
        t2 = t1 === undefined ? [] : t1;
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const defaultOpen = t2;
    let t3;
    if ($[3] !== defaultOpen) {
        t3 = ({
            "DashboardAccordion[useState()]": ()=>new Set(defaultOpen)
        })["DashboardAccordion[useState()]"];
        $[3] = defaultOpen;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    let t4;
    if ($[5] !== open || $[6] !== sections) {
        let t5;
        if ($[8] !== open) {
            t5 = ({
                "DashboardAccordion[sections.every()]": (key)=>open.has(key)
            })["DashboardAccordion[sections.every()]"];
            $[8] = open;
            $[9] = t5;
        } else {
            t5 = $[9];
        }
        t4 = sections.every(t5);
        $[5] = open;
        $[6] = sections;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const allOpen = t4;
    let t5;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "DashboardAccordion[toggle]": (key_0)=>setOpen({
                    "DashboardAccordion[toggle > setOpen()]": (current)=>{
                        const next = new Set(current);
                        if (next.has(key_0)) {
                            next.delete(key_0);
                        } else {
                            next.add(key_0);
                        }
                        return next;
                    }
                }["DashboardAccordion[toggle > setOpen()]"])
        })["DashboardAccordion[toggle]"];
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    const toggle = t5;
    let t6;
    if ($[11] !== open) {
        t6 = {
            open,
            toggle
        };
        $[11] = open;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== allOpen || $[14] !== sections) {
        t7 = ({
            "DashboardAccordion[<button>.onClick]": ()=>setOpen(allOpen ? new Set() : new Set(sections))
        })["DashboardAccordion[<button>.onClick]"];
        $[13] = allOpen;
        $[14] = sections;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== allOpen) {
        t8 = allOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDownUp$3e$__["ChevronsDownUp"], {
            className: "size-4",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 105,
            columnNumber: 20
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
            className: "size-4",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 105,
            columnNumber: 79
        }, this);
        $[16] = allOpen;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    const t9 = allOpen ? "Collapse all" : "Expand all";
    let t10;
    if ($[18] !== t7 || $[19] !== t8 || $[20] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-2 flex justify-end",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: t7,
                className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-brand-700 hover:bg-brand-50",
                children: [
                    t8,
                    t9
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 114,
                columnNumber: 50
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 114,
            columnNumber: 11
        }, this);
        $[18] = t7;
        $[19] = t8;
        $[20] = t9;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== children) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 124,
            columnNumber: 11
        }, this);
        $[22] = children;
        $[23] = t11;
    } else {
        t11 = $[23];
    }
    let t12;
    if ($[24] !== t10 || $[25] !== t11 || $[26] !== t6) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionContext.Provider, {
            value: t6,
            children: [
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 132,
            columnNumber: 11
        }, this);
        $[24] = t10;
        $[25] = t11;
        $[26] = t6;
        $[27] = t12;
    } else {
        t12 = $[27];
    }
    return t12;
}
_s(DashboardAccordion, "D5vcGpTqiUL79ZJiWECrPfDRJO0=");
_c = DashboardAccordion;
function DashboardSection(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(85);
    if ($[0] !== "3f29a30777908346a205262932889e7e9ad249f782ff0a1f6e860eac1ededdf3") {
        for(let $i = 0; $i < 85; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3f29a30777908346a205262932889e7e9ad249f782ff0a1f6e860eac1ededdf3";
    }
    const { id, index, title, note, summary, action, children } = t0;
    const { open, toggle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AccordionContext);
    let T0;
    let isOpen;
    let panelId;
    let t1;
    let t10;
    let t11;
    let t12;
    let t13;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[1] !== id || $[2] !== index || $[3] !== note || $[4] !== open || $[5] !== summary || $[6] !== title || $[7] !== toggle) {
        isOpen = open.has(id);
        panelId = `dash-panel-${id}`;
        const headingId = `dash-heading-${id}`;
        const t14 = isOpen ? "border-line" : "border-line hover:border-brand-200";
        if ($[24] !== t14) {
            t12 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-surface transition-colors", t14);
            $[24] = t14;
            $[25] = t12;
        } else {
            t12 = $[25];
        }
        t13 = headingId;
        t11 = "flex items-center gap-2 pr-2 sm:pr-3";
        t9 = headingId;
        t10 = "min-w-0 flex-1";
        t2 = "button";
        if ($[26] !== id || $[27] !== toggle) {
            t3 = ({
                "DashboardSection[<button>.onClick]": ()=>toggle(id)
            })["DashboardSection[<button>.onClick]"];
            $[26] = id;
            $[27] = toggle;
            $[28] = t3;
        } else {
            t3 = $[28];
        }
        t4 = isOpen;
        t5 = panelId;
        t6 = "flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left sm:px-4";
        const t15 = isOpen ? "bg-brand-600 text-brand-fg" : "bg-brand-50 text-brand-700";
        let t16;
        if ($[29] !== t15) {
            t16 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular", t15);
            $[29] = t15;
            $[30] = t16;
        } else {
            t16 = $[30];
        }
        if ($[31] !== index || $[32] !== t16) {
            t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: t16,
                children: index
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 219,
                columnNumber: 12
            }, this);
            $[31] = index;
            $[32] = t16;
            $[33] = t7;
        } else {
            t7 = $[33];
        }
        let t17;
        if ($[34] !== note) {
            t17 = note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-1.5 hidden text-xs font-normal text-ink-muted sm:inline",
                children: [
                    "(",
                    note,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 228,
                columnNumber: 21
            }, this);
            $[34] = note;
            $[35] = t17;
        } else {
            t17 = $[35];
        }
        let t18;
        if ($[36] !== t17 || $[37] !== title) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block truncate text-[13.5px] font-semibold text-ink",
                children: [
                    title,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 236,
                columnNumber: 13
            }, this);
            $[36] = t17;
            $[37] = title;
            $[38] = t18;
        } else {
            t18 = $[38];
        }
        let t19;
        if ($[39] !== summary) {
            t19 = summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "block truncate text-xs text-ink-muted",
                children: summary
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 245,
                columnNumber: 24
            }, this);
            $[39] = summary;
            $[40] = t19;
        } else {
            t19 = $[40];
        }
        if ($[41] !== t18 || $[42] !== t19) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    t18,
                    t19
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 252,
                columnNumber: 12
            }, this);
            $[41] = t18;
            $[42] = t19;
            $[43] = t8;
        } else {
            t8 = $[43];
        }
        T0 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"];
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 text-ink-muted transition-transform duration-200", isOpen && "rotate-180");
        $[1] = id;
        $[2] = index;
        $[3] = note;
        $[4] = open;
        $[5] = summary;
        $[6] = title;
        $[7] = toggle;
        $[8] = T0;
        $[9] = isOpen;
        $[10] = panelId;
        $[11] = t1;
        $[12] = t10;
        $[13] = t11;
        $[14] = t12;
        $[15] = t13;
        $[16] = t2;
        $[17] = t3;
        $[18] = t4;
        $[19] = t5;
        $[20] = t6;
        $[21] = t7;
        $[22] = t8;
        $[23] = t9;
    } else {
        T0 = $[8];
        isOpen = $[9];
        panelId = $[10];
        t1 = $[11];
        t10 = $[12];
        t11 = $[13];
        t12 = $[14];
        t13 = $[15];
        t2 = $[16];
        t3 = $[17];
        t4 = $[18];
        t5 = $[19];
        t6 = $[20];
        t7 = $[21];
        t8 = $[22];
        t9 = $[23];
    }
    let t14;
    if ($[44] !== T0 || $[45] !== t1) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            className: t1,
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[44] = T0;
        $[45] = t1;
        $[46] = t14;
    } else {
        t14 = $[46];
    }
    let t15;
    if ($[47] !== t14 || $[48] !== t2 || $[49] !== t3 || $[50] !== t4 || $[51] !== t5 || $[52] !== t6 || $[53] !== t7 || $[54] !== t8) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: t2,
            onClick: t3,
            "aria-expanded": t4,
            "aria-controls": t5,
            className: t6,
            children: [
                t7,
                t8,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 313,
            columnNumber: 11
        }, this);
        $[47] = t14;
        $[48] = t2;
        $[49] = t3;
        $[50] = t4;
        $[51] = t5;
        $[52] = t6;
        $[53] = t7;
        $[54] = t8;
        $[55] = t15;
    } else {
        t15 = $[55];
    }
    let t16;
    if ($[56] !== t10 || $[57] !== t15 || $[58] !== t9) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            id: t9,
            className: t10,
            children: t15
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[56] = t10;
        $[57] = t15;
        $[58] = t9;
        $[59] = t16;
    } else {
        t16 = $[59];
    }
    let t17;
    if ($[60] !== action) {
        t17 = action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden shrink-0 sm:block",
            children: action
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 338,
            columnNumber: 21
        }, this);
        $[60] = action;
        $[61] = t17;
    } else {
        t17 = $[61];
    }
    let t18;
    if ($[62] !== t11 || $[63] !== t16 || $[64] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t11,
            children: [
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 346,
            columnNumber: 11
        }, this);
        $[62] = t11;
        $[63] = t16;
        $[64] = t17;
        $[65] = t18;
    } else {
        t18 = $[65];
    }
    const t19 = isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]";
    let t20;
    if ($[66] !== t19) {
        t20 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid transition-[grid-template-rows] duration-200 ease-out", t19);
        $[66] = t19;
        $[67] = t20;
    } else {
        t20 = $[67];
    }
    const t21 = !isOpen;
    let t22;
    if ($[68] !== action) {
        t22 = action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-3 sm:hidden",
            children: action
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 366,
            columnNumber: 21
        }, this);
        $[68] = action;
        $[69] = t22;
    } else {
        t22 = $[69];
    }
    let t23;
    if ($[70] !== children || $[71] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "border-t border-line p-3 sm:p-4",
            children: [
                children,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 374,
            columnNumber: 11
        }, this);
        $[70] = children;
        $[71] = t22;
        $[72] = t23;
    } else {
        t23 = $[72];
    }
    let t24;
    if ($[73] !== panelId || $[74] !== t21 || $[75] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            id: panelId,
            className: "min-h-0 overflow-hidden",
            inert: t21,
            children: t23
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 383,
            columnNumber: 11
        }, this);
        $[73] = panelId;
        $[74] = t21;
        $[75] = t23;
        $[76] = t24;
    } else {
        t24 = $[76];
    }
    let t25;
    if ($[77] !== t20 || $[78] !== t24) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t20,
            children: t24
        }, void 0, false, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 393,
            columnNumber: 11
        }, this);
        $[77] = t20;
        $[78] = t24;
        $[79] = t25;
    } else {
        t25 = $[79];
    }
    let t26;
    if ($[80] !== t12 || $[81] !== t13 || $[82] !== t18 || $[83] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: t12,
            "aria-labelledby": t13,
            children: [
                t18,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
            lineNumber: 402,
            columnNumber: 11
        }, this);
        $[80] = t12;
        $[81] = t13;
        $[82] = t18;
        $[83] = t25;
        $[84] = t26;
    } else {
        t26 = $[84];
    }
    return t26;
}
_s1(DashboardSection, "CihUgK4Gm6JUw0nqBqAJDONV+fE=");
_c1 = DashboardSection;
var _c, _c1;
__turbopack_context__.k.register(_c, "DashboardAccordion");
__turbopack_context__.k.register(_c1, "DashboardSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_90f9adf3._.js.map