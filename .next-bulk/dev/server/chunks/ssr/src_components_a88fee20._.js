module.exports = [
"[project]/src/components/ui/states.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/octagon-alert.js [app-ssr] (ecmascript) <export default as AlertOctagon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.js [app-ssr] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
;
;
;
;
function EmptyState({ title = "Nothing here yet", description, action, icon: Icon = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"], className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center px-6 py-12 text-center", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mb-3 flex size-11 items-center justify-center rounded-full bg-neutral-bg text-ink-muted",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "size-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-semibold text-ink",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 max-w-sm text-sm text-ink-muted",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 12,
                columnNumber: 23
            }, this),
            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: action
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 13,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function ErrorState({ title = "Something went wrong", description = "We could not load this data. Please try again.", onRetry, action, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center px-6 py-12 text-center", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mb-3 flex size-11 items-center justify-center rounded-full bg-danger-bg text-danger-ink",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__["AlertOctagon"], {
                    className: "size-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-semibold text-ink",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 max-w-sm text-sm text-ink-muted",
                children: description
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            (onRetry || action) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex flex-wrap items-center justify-center gap-2",
                children: [
                    onRetry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRetry,
                        className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-line-strong bg-surface px-3 text-[13px] font-medium text-ink hover:bg-surface-muted",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "size-3.5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/states.jsx",
                                lineNumber: 30,
                                columnNumber: 15
                            }, this),
                            " Try again"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 29,
                        columnNumber: 13
                    }, this),
                    action
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 27,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function ApiUnavailable({ error, what = "this data" }) {
    const status = error?.status;
    const description = status ? `The admin API could not load ${what} (${error.message}). Refresh the page to try again.` : `The admin API is not reachable right now, so ${what} could not be loaded. Refresh the page in a moment.`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ErrorState, {
        title: "Not connected",
        description: description,
        className: "rounded-2xl border border-line bg-surface"
    }, void 0, false, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
function PermissionDenied({ module = "this page" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto mt-6 max-w-lg rounded-xl border border-line bg-surface",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center px-6 py-12 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "mb-3 flex size-12 items-center justify-center rounded-full bg-warning-bg text-warning-ink",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                        className: "size-5",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-base font-semibold text-ink",
                    children: [
                        "You don't have access to ",
                        module
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 max-w-sm text-sm text-ink-muted",
                    children: "Your role does not include view permission for this module. Ask a Super Admin to update your role under Staff & Roles."
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/admin/dashboard",
                    className: "mt-5 inline-flex h-9 items-center rounded-lg bg-brand-600 px-3.5 text-sm font-medium text-brand-fg hover:bg-brand-700",
                    children: "Go to dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/states.jsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/states.jsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
function Skeleton({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-neutral-bg", className),
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 66,
        columnNumber: 10
    }, this);
}
function PageSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        "aria-busy": "true",
        "aria-label": "Loading",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-6 w-56"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-4 w-80 max-w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
                children: Array.from({
                    length: 4
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-24 rounded-xl"
                    }, i, false, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-line bg-surface p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "mb-4 h-9 w-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/states.jsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    Array.from({
                        length: 8
                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "mb-2 h-8 w-full"
                        }, i, false, {
                            fileName: "[project]/src/components/ui/states.jsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/states.jsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/states.jsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/charts/interactive.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart",
    ()=>BarChart,
    "DonutChart",
    ()=>DonutChart,
    "LineChart",
    ()=>LineChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-line.js [app-ssr] (ecmascript) <export default as ChartLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/states.jsx [app-ssr] (ecmascript)");
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
function ChartEmpty({ className, message = "No data for this period." }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EmptyState"], {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartLine$3e$__["ChartLine"],
        title: message,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-h-[180px] rounded-md bg-surface-muted py-8", className)
    }, void 0, false, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
const isMoney = (s)=>s.format === "inr" || /₹/.test(s.label);
const formatValue = (s, v)=>isMoney(s) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatINR"])(v) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(v);
const colorOf = (s, i)=>s.color || palette[i % palette.length];
/** Pointer/keyboard index tracking shared by the cartesian charts. */ function useActiveIndex(count, toIndex) {
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fromPointer = (e)=>{
        const rect = svgRef.current.getBoundingClientRect();
        setActive(toIndex((e.clientX - rect.left) / rect.width));
    };
    const onKeyDown = (e)=>{
        if (e.key === "ArrowRight") setActive((a)=>Math.min(count - 1, (a ?? -1) + 1));
        else if (e.key === "ArrowLeft") setActive((a)=>Math.max(0, (a ?? count) - 1));
        else if (e.key === "Escape") setActive(null);
        else return;
        e.preventDefault();
    };
    return {
        active,
        svgProps: {
            ref: svgRef,
            tabIndex: 0,
            onPointerMove: fromPointer,
            onPointerDown: fromPointer,
            onPointerLeave: (e)=>e.pointerType === "mouse" && setActive(null),
            onKeyDown,
            onBlur: ()=>setActive(null)
        }
    };
}
function Tooltip({ leftPct, title, rows }) {
    const left = Math.min(82, Math.max(18, leftPct));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none absolute top-1 z-10 min-w-32 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-2 text-xs shadow-lg transition-[left] duration-100",
        style: {
            left: `${left}%`
        },
        role: "status",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1 font-semibold text-ink",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            rows.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "flex items-center justify-between gap-3 text-ink-soft",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "size-2 rounded-sm",
                                    style: {
                                        background: r.color
                                    },
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                r.label
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-ink tabular",
                            children: r.value
                        }, void 0, false, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, r.label, true, {
                    fileName: "[project]/src/components/charts/interactive.jsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
function Legend({ series, hidden, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
        className: "mt-2 flex flex-wrap gap-x-1 gap-y-1",
        children: series.map((s, i)=>{
            const off = hidden.includes(s.key);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onToggle(s.key),
                "aria-pressed": !off,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs text-ink-muted transition-opacity hover:bg-surface-muted hover:text-ink", off && "opacity-45 line-through"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "h-2 w-3 rounded-sm",
                        style: {
                            background: colorOf(s, i)
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 96,
                        columnNumber: 13
                    }, this),
                    s.label
                ]
            }, s.key, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 89,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
function useHiddenSeries(series) {
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggle = (key)=>setHidden((h)=>h.includes(key) ? h.filter((k)=>k !== key) : h.length < series.length - 1 ? [
                ...h,
                key
            ] : h);
    return [
        hidden,
        toggle
    ];
}
function LineChart({ data, series, height = 220, className, label, empty }) {
    const width = 640;
    const pad = {
        top: 12,
        right: 12,
        bottom: 26,
        left: 44
    };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const [hidden, toggle] = useHiddenSeries(series);
    const shown = series.filter((s)=>!hidden.includes(s.key));
    const max = niceMax(Math.max(1, ...data.flatMap((d)=>shown.map((s)=>d[s.key] || 0))));
    const x = (i)=>pad.left + (data.length <= 1 ? innerW / 2 : i / (data.length - 1) * innerW);
    const y = (v)=>pad.top + innerH - v / max * innerH;
    const ticks = [
        0,
        0.25,
        0.5,
        0.75,
        1
    ].map((t)=>t * max);
    const labelEvery = Math.ceil(data.length / 8);
    const { active, svgProps } = useActiveIndex(data.length, (f)=>{
        const i = Math.round((f * width - pad.left) / innerW * (data.length - 1));
        return Math.max(0, Math.min(data.length - 1, i));
    });
    if (!data.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartEmpty, {
        className: className,
        message: empty
    }, void 0, false, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 127,
        columnNumber: 28
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative w-full", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: `0 0 ${width} ${height}`,
                className: "h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                role: "img",
                "aria-label": `${label}. Use arrow keys to read values.`,
                ...svgProps,
                children: [
                    ticks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: pad.left,
                                    x2: width - pad.right,
                                    y1: y(t),
                                    y2: y(t),
                                    stroke: "var(--line)",
                                    strokeDasharray: t === 0 ? "" : "3 4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: pad.left - 6,
                                    y: y(t) + 4,
                                    textAnchor: "end",
                                    fontSize: "10",
                                    fill: "var(--ink-muted)",
                                    children: shortNumber(t)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, t, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)),
                    data.map((d, i)=>i % labelEvery === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: x(i),
                            y: height - 8,
                            textAnchor: "middle",
                            fontSize: "10",
                            fill: active === i ? "var(--ink)" : "var(--ink-muted)",
                            children: d.label
                        }, i, false, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this) : null),
                    active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: x(active),
                        x2: x(active),
                        y1: pad.top,
                        y2: y(0),
                        stroke: "var(--ink-muted)",
                        strokeDasharray: "3 3",
                        opacity: "0.6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 143,
                        columnNumber: 28
                    }, this),
                    series.map((s, si)=>{
                        if (hidden.includes(s.key)) return null;
                        const color = colorOf(s, si);
                        const points = data.map((d, i)=>`${x(i)},${y(d[s.key] || 0)}`).join(" ");
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                si === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                    className: "chart-fade",
                                    points: `${x(0)},${y(0)} ${points} ${x(data.length - 1)},${y(0)}`,
                                    fill: color,
                                    opacity: "0.08"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 150,
                                    columnNumber: 28
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
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
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this),
                                active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: x(active),
                                    cy: y(data[active][s.key] || 0),
                                    r: "4.5",
                                    fill: "var(--surface)",
                                    stroke: color,
                                    strokeWidth: "2.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 152,
                                    columnNumber: 34
                                }, this)
                            ]
                        }, `${s.key}-${max}`, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                leftPct: x(active) / width * 100,
                title: data[active].label,
                rows: shown.map((s)=>({
                        label: s.label,
                        color: colorOf(s, series.indexOf(s)),
                        value: formatValue(s, data[active][s.key] || 0)
                    }))
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 158,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Legend, {
                series: series,
                hidden: hidden,
                onToggle: toggle
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function BarChart({ data, series, height = 220, className, label, stacked = false, empty }) {
    const width = 640;
    const pad = {
        top: 12,
        right: 8,
        bottom: 26,
        left: 44
    };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const [hidden, toggle] = useHiddenSeries(series);
    const shown = series.filter((s)=>!hidden.includes(s.key));
    const totals = data.map((d)=>stacked ? shown.reduce((s, ser)=>s + (d[ser.key] || 0), 0) : Math.max(...shown.map((ser)=>d[ser.key] || 0)));
    const max = niceMax(Math.max(1, ...totals));
    const band = innerW / Math.max(1, data.length);
    const barW = stacked ? band * 0.6 : band * 0.7 / shown.length;
    const y = (v)=>pad.top + innerH - v / max * innerH;
    const ticks = [
        0,
        0.5,
        1
    ].map((t)=>t * max);
    const labelEvery = Math.ceil(data.length / 10);
    const { active, svgProps } = useActiveIndex(data.length, (f)=>Math.max(0, Math.min(data.length - 1, Math.floor((f * width - pad.left) / band))));
    if (!data.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartEmpty, {
        className: className,
        message: empty
    }, void 0, false, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 180,
        columnNumber: 28
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative w-full", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: `0 0 ${width} ${height}`,
                className: "h-auto w-full touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                role: "img",
                "aria-label": `${label}. Use arrow keys to read values.`,
                ...svgProps,
                children: [
                    ticks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: pad.left,
                                    x2: width - pad.right,
                                    y1: y(t),
                                    y2: y(t),
                                    stroke: "var(--line)",
                                    strokeDasharray: t === 0 ? "" : "3 4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: pad.left - 6,
                                    y: y(t) + 4,
                                    textAnchor: "end",
                                    fontSize: "10",
                                    fill: "var(--ink-muted)",
                                    children: shortNumber(t)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, t, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)),
                    active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: pad.left + active * band,
                        y: pad.top,
                        width: band,
                        height: innerH,
                        fill: "var(--neutral-bg)",
                        opacity: "0.7",
                        rx: "3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 191,
                        columnNumber: 28
                    }, this),
                    data.map((d, i)=>{
                        const bx = pad.left + i * band + (band - (stacked ? barW : barW * shown.length)) / 2;
                        let acc = 0;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    className: "chart-grow-y",
                                    style: {
                                        animationDelay: `${Math.min(i * 18, 400)}ms`,
                                        opacity: active == null || active === i ? 1 : 0.45,
                                        transition: "opacity 150ms"
                                    },
                                    children: shown.map((s, si)=>{
                                        const v = d[s.key] || 0;
                                        const color = colorOf(s, series.indexOf(s));
                                        if (stacked) {
                                            const top = y(acc + v);
                                            const h = y(acc) - top;
                                            acc += v;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: bx,
                                                y: top,
                                                width: barW,
                                                height: Math.max(0, h),
                                                fill: color,
                                                rx: "2"
                                            }, s.key, false, {
                                                fileName: "[project]/src/components/charts/interactive.jsx",
                                                lineNumber: 205,
                                                columnNumber: 28
                                            }, this);
                                        }
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: bx + si * barW,
                                            y: y(v),
                                            width: Math.max(1, barW - 2),
                                            height: Math.max(0, y(0) - y(v)),
                                            fill: color,
                                            rx: "2"
                                        }, s.key, false, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 207,
                                            columnNumber: 26
                                        }, this);
                                    })
                                }, `${hidden.join()}-${max}`, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                i % labelEvery === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: pad.left + i * band + band / 2,
                                    y: height - 8,
                                    textAnchor: "middle",
                                    fontSize: "10",
                                    fill: active === i ? "var(--ink)" : "var(--ink-muted)",
                                    children: d.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 211,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            active != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                leftPct: (pad.left + active * band + band / 2) / width * 100,
                title: data[active].label,
                rows: [
                    ...shown.map((s)=>({
                            label: s.label,
                            color: colorOf(s, series.indexOf(s)),
                            value: formatValue(s, data[active][s.key] || 0)
                        })),
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
                lineNumber: 218,
                columnNumber: 9
            }, this),
            series.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Legend, {
                series: series,
                hidden: hidden,
                onToggle: toggle
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 227,
                columnNumber: 29
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
function DonutChart({ data, size = 160, className, label, centerLabel, centerValue }) {
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const total = data.reduce((s, d)=>s + d.value, 0) || 1;
    const r = 60;
    const c = 2 * Math.PI * r;
    const segments = data.map((d, i)=>{
        const len = d.value / total * c;
        const start = data.slice(0, i).reduce((s, x)=>s + x.value / total * c, 0);
        return {
            ...d,
            len,
            start,
            color: d.color || palette[i % palette.length]
        };
    });
    const a = active != null ? segments[active] : null;
    const pct = (v)=>`${(v / total * 100).toFixed(0)}%`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-4 sm:flex-row sm:items-center", className),
        onPointerLeave: (e)=>e.pointerType === "mouse" && setActive(null),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 160 160",
                width: size,
                height: size,
                role: "img",
                "aria-label": label,
                className: "shrink-0 overflow-visible",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "80",
                        cy: "80",
                        r: r,
                        fill: "none",
                        stroke: "var(--neutral-bg)",
                        strokeWidth: "20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    segments.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "chart-donut cursor-pointer",
                            cx: "80",
                            cy: "80",
                            r: r,
                            fill: "none",
                            stroke: s.color,
                            strokeWidth: active === i ? 26 : 20,
                            strokeDasharray: `${s.len} ${c - s.len}`,
                            strokeDashoffset: -s.start,
                            transform: "rotate(-90 80 80)",
                            pointerEvents: "stroke",
                            opacity: active == null || active === i ? 1 : 0.35,
                            style: {
                                "--c": c,
                                animationDelay: `${i * 70}ms`,
                                transition: "stroke-width 150ms, opacity 150ms"
                            },
                            onPointerEnter: ()=>setActive(i),
                            onPointerDown: ()=>setActive(i)
                        }, s.label, false, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "80",
                        y: "78",
                        textAnchor: "middle",
                        fontSize: a ? 18 : 20,
                        fontWeight: "600",
                        fill: "var(--ink)",
                        children: a ? a.display ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(a.value) : centerValue
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: "80",
                        y: "96",
                        textAnchor: "middle",
                        fontSize: "10",
                        fill: "var(--ink-muted)",
                        children: a ? `${a.label.length > 16 ? `${a.label.slice(0, 15)}…` : a.label} · ${pct(a.value)}` : centerLabel
                    }, void 0, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "w-full min-w-0 space-y-0.5",
                children: segments.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onPointerEnter: ()=>setActive(i),
                            onFocus: ()=>setActive(i),
                            onBlur: ()=>setActive(null),
                            onClick: ()=>setActive(active === i ? null : i),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center justify-between gap-3 rounded-md px-1.5 py-1 text-left text-sm transition-colors", active === i ? "bg-surface-muted" : "hover:bg-surface-muted", active != null && active !== i && "opacity-55"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex min-w-0 items-center gap-2 text-ink-soft",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "size-2.5 shrink-0 rounded-sm",
                                            style: {
                                                background: d.color
                                            },
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 288,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: d.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 font-medium text-ink tabular",
                                    children: [
                                        d.display ?? d.value,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-normal text-ink-muted",
                                            children: [
                                                "(",
                                                pct(d.value),
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/charts/interactive.jsx",
                                            lineNumber: 292,
                                            columnNumber: 40
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/charts/interactive.jsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/charts/interactive.jsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this)
                    }, d.label, false, {
                        fileName: "[project]/src/components/charts/interactive.jsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/charts/interactive.jsx",
                lineNumber: 276,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/charts/interactive.jsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "ButtonLink",
    ()=>ButtonLink,
    "buttonClasses",
    ()=>buttonClasses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors select-none", "disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-auto aria-disabled:cursor-not-allowed aria-disabled:opacity-55", variants[variant], sizes[size], className);
}
function Button({ asChild = false, variant, size, className, loading = false, disabled, children, type = "button", ...props }) {
    const classNameValue = buttonClasses({
        variant,
        size,
        className
    });
    if (asChild) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"], {
            className: classNameValue,
            "aria-busy": loading || undefined,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/button.jsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: classNameValue,
        disabled: disabled || loading,
        "aria-busy": loading || undefined,
        ...props,
        children: [
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "size-4 animate-spin",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/button.jsx",
                lineNumber: 46,
                columnNumber: 18
            }, this) : null,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/button.jsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
function ButtonLink({ variant, size, className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        className: buttonClasses({
            variant,
            size,
            className
        }),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.jsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const controlBase = "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger aria-invalid:ring-danger/15";
function Input({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(controlBase, "h-9", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 11,
        columnNumber: 10
    }, this);
}
function Textarea({ className, rows = 3, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        rows: rows,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(controlBase, "py-2 leading-relaxed", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
function Select({ className, options = [], placeholder, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative min-w-0", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(controlBase, "h-9 appearance-none pr-8"),
                ...props,
                children: [
                    placeholder != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: placeholder
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/form.jsx",
                        lineNumber: 22,
                        columnNumber: 33
                    }, this),
                    options.map((option)=>{
                        const value = typeof option === "object" ? option.value : option;
                        const label = typeof option === "object" ? option.label : option;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: value,
                            children: label
                        }, value, false, {
                            fileName: "[project]/src/components/ui/form.jsx",
                            lineNumber: 27,
                            columnNumber: 13
                        }, this);
                    }),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                className: "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function Field({ label, hint, error, required, children, className, htmlFor }) {
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const id = htmlFor || autoId;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0 space-y-1.5", className),
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: id,
                className: "block text-[13px] font-medium text-ink-soft",
                children: [
                    label,
                    required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-0.5 text-danger-ink",
                        "aria-hidden": true,
                        children: "*"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/form.jsx",
                        lineNumber: 47,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 45,
                columnNumber: 9
            }, this),
            typeof children === "function" ? children({
                id,
                invalid: Boolean(error),
                describedBy: error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }) : children,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: `${id}-error`,
                className: "text-xs text-danger-ink",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 52,
                columnNumber: 9
            }, this) : hint ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                id: `${id}-hint`,
                className: "text-xs text-ink-muted",
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 56,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function Checkbox({ className, label, ...props }) {
    const input = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 rounded border-line-strong accent-brand-600 disabled:cursor-not-allowed", !label && className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
    if (!label) return input;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft", className),
        children: [
            input,
            label
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function Switch({ checked, onChange, label, disabled, id, description }) {
    const autoId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const switchId = id || autoId;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start justify-between gap-4",
        children: [
            (label || description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: switchId,
                className: "min-w-0 cursor-pointer",
                children: [
                    label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-sm font-medium text-ink",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/form.jsx",
                        lineNumber: 88,
                        columnNumber: 21
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block text-xs text-ink-muted",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/form.jsx",
                        lineNumber: 89,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 87,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: switchId,
                type: "button",
                role: "switch",
                "aria-checked": Boolean(checked),
                disabled: disabled,
                onClick: ()=>onChange?.(!checked),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", checked ? "bg-brand-600" : "bg-line-strong"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-block size-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-4.5" : "translate-x-0.5")
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/form.jsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/form.jsx",
                lineNumber: 92,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/form.jsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/dashboard/dashboard-filters.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardFilters",
    ()=>DashboardFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-ssr] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-ssr] (ecmascript)");
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
function DashboardFilters({ values, options, label }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(values);
    const [lastValues, setLastValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(values);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    if (lastValues !== values) {
        setLastValues(values);
        setDraft(values);
    }
    const set = (key, value)=>setDraft((d)=>({
                ...d,
                [key]: value
            }));
    const sticky = {
        vendor: values.vendor,
        type: values.type,
        season: values.season,
        cycle: values.cycle
    };
    const dateError = draft.from && draft.to && draft.to < draft.from ? "End date is before start date." : draft.from && !draft.to || !draft.from && draft.to ? "Choose both dates." : null;
    const extraCount = [
        "fy",
        "season",
        "cycle",
        "type"
    ].filter((k)=>draft[k] && !(k === "type" && draft[k] === "all")).length;
    const apply = (event)=>{
        event.preventDefault();
        if (dateError) return;
        const custom = draft.from && draft.to;
        const next = {
            ...draft,
            preset: custom || draft.fy ? "" : draft.preset,
            fy: custom ? "" : draft.fy
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRouteProgress"])();
        router.push(`${pathname}${query(next)}`, {
            scroll: false
        });
    };
    const reset = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRouteProgress"])();
        router.push(pathname, {
            scroll: false
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: apply,
        className: "mb-4 rounded-xl border border-line bg-surface p-3 sm:p-4",
        "aria-label": "Dashboard filters",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                        label: "Seller",
                        className: "col-span-2 md:col-span-1",
                        children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                id: id,
                                value: draft.vendor,
                                onChange: (e)=>set("vendor", e.target.value),
                                options: options.vendors,
                                placeholder: "All sellers"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 53,
                                columnNumber: 24
                            }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        className: "col-span-2 min-w-0 md:col-span-2 xl:col-span-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                className: "mb-1.5 text-[13px] font-medium text-ink-soft",
                                children: "Date range"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "date",
                                        "aria-label": "From date",
                                        value: draft.from,
                                        max: draft.to || undefined,
                                        onChange: (e)=>set("from", e.target.value),
                                        className: "min-w-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "shrink-0 text-xs text-ink-muted",
                                        children: "to"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "date",
                                        "aria-label": "To date",
                                        value: draft.to,
                                        min: draft.from || undefined,
                                        onChange: (e)=>set("to", e.target.value),
                                        className: "min-w-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            dateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-xs text-danger-ink",
                                role: "alert",
                                children: dateError
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 62,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("col-span-2 grid grid-cols-2 gap-3 md:col-span-3 md:grid-cols-4 xl:col-span-4", !expanded && "hidden md:grid"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                                label: "Financial year",
                                children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        id: id,
                                        value: draft.fy,
                                        onChange: (e)=>set("fy", e.target.value),
                                        options: options.financialYears,
                                        placeholder: "Any year"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 66,
                                        columnNumber: 26
                                    }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                                label: "Season",
                                children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        id: id,
                                        value: draft.season,
                                        onChange: (e)=>set("season", e.target.value),
                                        options: options.seasons,
                                        placeholder: "All seasons"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 69,
                                        columnNumber: 26
                                    }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                                label: "Payout cycle",
                                children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        id: id,
                                        value: draft.cycle,
                                        onChange: (e)=>set("cycle", e.target.value),
                                        options: options.cycles,
                                        placeholder: "Any cycle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 72,
                                        columnNumber: 26
                                    }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                                label: "Order type",
                                children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        id: id,
                                        value: draft.type,
                                        onChange: (e)=>set("type", e.target.value),
                                        options: options.orderTypes
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 75,
                                        columnNumber: 26
                                    }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex flex-col gap-3 border-t border-line pt-3 lg:flex-row lg:items-center lg:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "-mx-1 overflow-x-auto px-1 scrollbar-thin",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            "aria-label": "Date presets",
                            className: "flex min-w-max items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mr-1 text-[11px] font-semibold tracking-wide text-ink-muted uppercase",
                                    children: "Presets"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                options.presets.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `${pathname}${query({
                                            ...sticky,
                                            preset: p.value
                                        })}`,
                                        scroll: false,
                                        "aria-current": values.preset === p.value ? "true" : undefined,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors", values.preset === p.value ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line text-ink-soft hover:border-brand-200 hover:bg-brand-50"),
                                        children: p.label
                                    }, p.value, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                variant: "ghost",
                                className: "md:hidden",
                                onClick: ()=>setExpanded((v)=>!v),
                                "aria-expanded": expanded,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                        className: "size-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    expanded ? "Fewer filters" : `More filters${extraCount ? ` (${extraCount})` : ""}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                variant: "ghost",
                                onClick: reset,
                                className: "ml-auto lg:ml-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                        className: "size-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    " Reset"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                size: "sm",
                                variant: "primary",
                                disabled: Boolean(dateError),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "size-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    " Apply filter"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-xs text-ink-muted",
                "aria-live": "polite",
                children: [
                    "Showing: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-ink-soft",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                        lineNumber: 113,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/dashboard/dashboard-filters.jsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/dashboard/dashboard-accordion.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardAccordion",
    ()=>DashboardAccordion,
    "DashboardSection",
    ()=>DashboardSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDownUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-down-up.js [app-ssr] (ecmascript) <export default as ChevronsDownUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-up-down.js [app-ssr] (ecmascript) <export default as ChevronsUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AccordionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function DashboardAccordion({ sections, defaultOpen = [], children }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Set(defaultOpen));
    const allOpen = sections.every((key)=>open.has(key));
    const toggle = (key)=>setOpen((current)=>{
            const next = new Set(current);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionContext.Provider, {
        value: {
            open,
            toggle
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2 flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>setOpen(allOpen ? new Set() : new Set(sections)),
                    className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-brand-700 hover:bg-brand-50",
                    children: [
                        allOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$down$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsDownUp$3e$__["ChevronsDownUp"], {
                            className: "size-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                            lineNumber: 28,
                            columnNumber: 22
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsUpDown$3e$__["ChevronsUpDown"], {
                            className: "size-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                            lineNumber: 28,
                            columnNumber: 74
                        }, this),
                        allOpen ? "Collapse all" : "Expand all"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
function DashboardSection({ id, index, title, note, summary, action, children }) {
    const { open, toggle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AccordionContext);
    const isOpen = open.has(id);
    const panelId = `dash-panel-${id}`;
    const headingId = `dash-heading-${id}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border bg-surface transition-colors", isOpen ? "border-line" : "border-line hover:border-brand-200"),
        "aria-labelledby": headingId,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 pr-2 sm:pr-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: headingId,
                        className: "min-w-0 flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>toggle(id),
                            "aria-expanded": isOpen,
                            "aria-controls": panelId,
                            className: "flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left sm:px-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular", isOpen ? "bg-brand-600 text-brand-fg" : "bg-brand-50 text-brand-700"),
                                    children: index
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[13.5px] font-semibold text-ink",
                                            children: [
                                                title,
                                                note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-1.5 hidden text-xs font-normal text-ink-muted sm:inline",
                                                    children: [
                                                        "(",
                                                        note,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                                    lineNumber: 58,
                                                    columnNumber: 26
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-xs text-ink-muted",
                                            children: summary
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                            lineNumber: 60,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-4 shrink-0 text-ink-muted transition-transform duration-200", isOpen && "rotate-180"),
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden shrink-0 sm:block",
                        children: action
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                        lineNumber: 65,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: panelId,
                    className: "min-h-0 overflow-hidden",
                    inert: !isOpen,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-line p-3 sm:p-4",
                        children: [
                            children,
                            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 sm:hidden",
                                children: action
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                                lineNumber: 71,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/dashboard/dashboard-accordion.jsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_a88fee20._.js.map