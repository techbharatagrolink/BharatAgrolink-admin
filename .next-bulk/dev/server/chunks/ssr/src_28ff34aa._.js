module.exports = [
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
"[project]/src/components/admin/parity/bulk/bulk-list.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BulkFilters",
    ()=>BulkFilters,
    "BulkPager",
    ()=>BulkPager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function BulkFilters({ fields, values }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Object.fromEntries(fields.map((f)=>[
                f.key,
                values[f.key] ?? ""
            ])));
    const active = fields.some((f)=>values[f.key]);
    function apply(event) {
        event.preventDefault();
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(draft))if (String(value).trim()) params.set(key, String(value).trim());
        if (values.pageSize) params.set("pageSize", values.pageSize);
        router.push(params.size ? `${pathname}?${params}` : pathname);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: apply,
        className: "grid grid-cols-1 gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]",
        children: [
            fields.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "min-w-0 text-xs font-medium text-ink-muted",
                    children: [
                        f.label,
                        f.type === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                            className: "mt-1 w-full",
                            value: draft[f.key],
                            onChange: (e)=>setDraft((d)=>({
                                        ...d,
                                        [f.key]: e.target.value
                                    })),
                            options: [
                                {
                                    value: "",
                                    label: f.all ?? "All"
                                },
                                ...f.options
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                            lineNumber: 32,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            className: "mt-1 w-full",
                            type: f.type === "date" ? "date" : "text",
                            value: draft[f.key],
                            placeholder: f.placeholder,
                            onChange: (e)=>setDraft((d)=>({
                                        ...d,
                                        [f.key]: e.target.value
                                    }))
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this)
                    ]
                }, f.key, true, {
                    fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        variant: "primary",
                        size: "sm",
                        className: "h-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "size-4",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            " Filter"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: pathname,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClasses"])({
                            size: "sm",
                            className: "h-9"
                        }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "size-4",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                                lineNumber: 44,
                                columnNumber: 13
                            }, this),
                            " Clear"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
function BulkPager({ result, query }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const href = (page)=>{
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query))if (value && key !== "page") params.set(key, value);
        if (page > 1) params.set("page", String(page));
        return params.size ? `${pathname}?${params}` : pathname;
    };
    const last = Math.max(1, result.pageCount);
    const link = (page, label, disabled)=>disabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClasses"])({
                size: "sm",
                className: "pointer-events-none opacity-50"
            }),
            "aria-disabled": true,
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
            lineNumber: 64,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: href(page),
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClasses"])({
                size: "sm"
            }),
            children: label
        }, void 0, false, {
            fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
            lineNumber: 68,
            columnNumber: 7
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[13px] text-ink-muted",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(result.total),
                    " records · page ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(result.page),
                    " of ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(last)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1.5",
                children: [
                    link(1, "First", result.page <= 1),
                    link(result.page - 1, "Prev", result.page <= 1),
                    link(result.page + 1, "Next", result.page >= last),
                    link(last, "Last", result.page >= last)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/parity/bulk/bulk-list.jsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/actions/admin/parity/data:7148bb [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40180c25f4ad9d763ab21f0063257be7c91510e12c":"convertBulkQuotationAction"},"src/lib/actions/admin/parity/bulk.js",""] */ __turbopack_context__.s([
    "convertBulkQuotationAction",
    ()=>convertBulkQuotationAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var convertBulkQuotationAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40180c25f4ad9d763ab21f0063257be7c91510e12c", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "convertBulkQuotationAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYnVsay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIjtcclxuaW1wb3J0IHsgYXNzZXJ0UGVybWlzc2lvbiB9IGZyb20gXCJAL2xpYi9hdXRoL3Nlc3Npb25cIjtcclxuaW1wb3J0IHtcclxuICBhZGRCdWxrT3JkZXJSZW1hcmssXHJcbiAgY29udmVydEJ1bGtRdW90YXRpb24sXHJcbiAgZGVsZXRlQnVsa09yZGVyLFxyXG4gIGRlbGV0ZUJ1bGtRdW90YXRpb24sXHJcbiAgZXhwb3J0QnVsa09yZGVycyxcclxuICBnZXRCdWxrT3JkZXJMYWJlbCxcclxuICBnZXRCdWxrT3JkZXJUcmFja2luZyxcclxuICB1cGRhdGVCdWxrT3JkZXJBZ2VudCxcclxuICB1cGRhdGVCdWxrT3JkZXJTdGF0dXMsXHJcbiAgdXBkYXRlQnVsa1dheWJpbGwsXHJcbn0gZnJvbSBcIkAvbGliL3NlcnZpY2VzL2FkbWluL3Bhcml0eS9idWxrXCI7XHJcblxyXG5jb25zdCBpbnZhbGlkID0gKG1lc3NhZ2UgPSBcIkludmFsaWQgcmVxdWVzdC5cIikgPT4gKHsgb2s6IGZhbHNlLCBtZXNzYWdlIH0pO1xyXG5jb25zdCBzdHIgPSAodiwgbWF4ID0gMTIwKSA9PiAodHlwZW9mIHYgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHYgPT09IFwibnVtYmVyXCIgPyBTdHJpbmcodikudHJpbSgpLnNsaWNlKDAsIG1heCkgOiBcIlwiKTtcclxuY29uc3QgWU1EID0gL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvO1xyXG5jb25zdCBSRVNQT05TSUJMRSA9IFtcIlwiLCBcImN1c3RvbWVyXCIsIFwidmVuZG9yXCIsIFwiYWRtaW5cIiwgXCJjb3VyaWVyXCJdO1xyXG5jb25zdCBPUkRFUl9TVEFUVVNFUyA9IFtcImNyZWF0ZWRcIiwgXCJjb25maXJtZWRcIiwgXCJwcm9jZXNzaW5nXCIsIFwic2hpcHBlZFwiLCBcImRlbGl2ZXJlZFwiLCBcImNhbmNlbGxlZFwiLCBcInJlamVjdGVkXCIsIFwicmV0dXJuZWRcIiwgXCJydG9cIl07XHJcblxyXG5mdW5jdGlvbiByZWZyZXNoKG9yZGVySWQpIHtcclxuICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9idWxrLW9yZGVycy9vcmRlcnNcIik7XHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvc2hpcG1lbnRzXCIpO1xyXG4gIGlmIChvcmRlcklkKSByZXZhbGlkYXRlUGF0aChgL2FkbWluL2J1bGstb3JkZXJzL29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChvcmRlcklkKX1gKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4cG9ydEJ1bGtPcmRlcnNBY3Rpb24oZmlsdGVycykge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJ2aWV3XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3QgcXVlcnkgPSB7fTtcclxuICBmb3IgKGNvbnN0IGtleSBvZiBbXCJvcmRlcklkXCIsIFwiY3VzdG9tZXJcIiwgXCJzdGF0dXNcIl0pIGlmIChzdHIoZmlsdGVycz8uW2tleV0pKSBxdWVyeVtrZXldID0gc3RyKGZpbHRlcnNba2V5XSk7XHJcbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZnJvbVwiLCBcInRvXCJdKSBpZiAoWU1ELnRlc3Qoc3RyKGZpbHRlcnM/LltrZXldLCAxMCkpKSBxdWVyeVtrZXldID0gc3RyKGZpbHRlcnNba2V5XSwgMTApO1xyXG4gIHJldHVybiBleHBvcnRCdWxrT3JkZXJzKHF1ZXJ5LCBhdXRoLnVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa09yZGVyVHJhY2tpbmdBY3Rpb24ob3JkZXJJZCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJ2aWV3XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgaWYgKCFzdHIob3JkZXJJZCkpIHJldHVybiBpbnZhbGlkKFwiT3JkZXIgSUQgaXMgcmVxdWlyZWQuXCIpO1xyXG4gIHJldHVybiBnZXRCdWxrT3JkZXJUcmFja2luZyhzdHIob3JkZXJJZCksIGF1dGgudXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrT3JkZXJMYWJlbEFjdGlvbihvcmRlcklkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcInZpZXdcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cihvcmRlcklkKSkgcmV0dXJuIGludmFsaWQoXCJPcmRlciBJRCBpcyByZXF1aXJlZC5cIik7XHJcbiAgcmV0dXJuIGdldEJ1bGtPcmRlckxhYmVsKHN0cihvcmRlcklkKSwgYXV0aC51c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUJ1bGtPcmRlclN0YXR1c0FjdGlvbihvcmRlcklkLCBpbnB1dCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJlZGl0XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3Qgc3RhdHVzID0gc3RyKGlucHV0Py5zdGF0dXMsIDMwKTtcclxuICBjb25zdCByZXNwb25zaWJsZSA9IHN0cihpbnB1dD8ucmVzcG9uc2libGUsIDIwKTtcclxuICBpZiAoIU9SREVSX1NUQVRVU0VTLmluY2x1ZGVzKHN0YXR1cykpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgdmFsaWQgc3RhdHVzLlwiKTtcclxuICBpZiAoIVJFU1BPTlNJQkxFLmluY2x1ZGVzKHJlc3BvbnNpYmxlKSkgcmV0dXJuIGludmFsaWQoXCJDaG9vc2UgYSB2YWxpZCByZXNwb25zaWJsZSBwYXJ0eS5cIik7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXBkYXRlQnVsa09yZGVyU3RhdHVzKHN0cihvcmRlcklkKSwgeyBzdGF0dXMsIHJlc3BvbnNpYmxlIH0sIGF1dGgudXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaChzdHIob3JkZXJJZCkpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVCdWxrT3JkZXJBZ2VudEFjdGlvbihvcmRlcklkLCBzYWxlc21hbklkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cihzYWxlc21hbklkLCA0MCkpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgc2FsZXMgYWdlbnQuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVwZGF0ZUJ1bGtPcmRlckFnZW50KHN0cihvcmRlcklkKSwgc3RyKHNhbGVzbWFuSWQsIDQwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKHN0cihvcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEJ1bGtPcmRlclJlbWFya0FjdGlvbihvcmRlcklkLCBpbnB1dCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJlZGl0XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3QgcmVtYXJrID0gc3RyKGlucHV0Py5yZW1hcmssIDEwMDApO1xyXG4gIGNvbnN0IHJlc3BvbnNpYmxlID0gc3RyKGlucHV0Py5yZXNwb25zaWJsZSwgMjApO1xyXG4gIGlmICghcmVtYXJrKSByZXR1cm4gaW52YWxpZChcIlJlbWFyayBpcyByZXF1aXJlZC5cIik7XHJcbiAgaWYgKCFSRVNQT05TSUJMRS5pbmNsdWRlcyhyZXNwb25zaWJsZSkpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgdmFsaWQgcmVzcG9uc2libGUgcGFydHkuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFkZEJ1bGtPcmRlclJlbWFyayhzdHIob3JkZXJJZCksIHsgcmVtYXJrLCByZXNwb25zaWJsZSB9LCBhdXRoLnVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goc3RyKG9yZGVySWQpKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQnVsa09yZGVyQWN0aW9uKGlkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcImRlbGV0ZVwiKTtcclxuICBpZiAoIWF1dGgub2spIHJldHVybiBhdXRoO1xyXG4gIGlmICghL15cXGQrJC8udGVzdChzdHIoaWQsIDIwKSkpIHJldHVybiBpbnZhbGlkKFwiSW52YWxpZCBvcmRlci5cIik7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGVsZXRlQnVsa09yZGVyKHN0cihpZCwgMjApLCBhdXRoLnVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnVsa1dheWJpbGxBY3Rpb24ob3JkZXJJZCwgd2F5YmlsbE5vKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLnNoaXBtZW50c1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cih3YXliaWxsTm8sIDEwMCkpIHJldHVybiBpbnZhbGlkKFwiV2F5YmlsbCBudW1iZXIgaXMgcmVxdWlyZWQuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVwZGF0ZUJ1bGtXYXliaWxsKHN0cihvcmRlcklkKSwgc3RyKHdheWJpbGxObywgMTAwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKHN0cihvcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUJ1bGtRdW90YXRpb25BY3Rpb24oaWQpIHtcclxuICBjb25zdCBhdXRoID0gYXdhaXQgYXNzZXJ0UGVybWlzc2lvbihcImJ1bGsucXVvdGF0aW9uc1wiLCBcImRlbGV0ZVwiKTtcclxuICBpZiAoIWF1dGgub2spIHJldHVybiBhdXRoO1xyXG4gIGlmICghL15cXGQrJC8udGVzdChzdHIoaWQsIDIwKSkpIHJldHVybiBpbnZhbGlkKFwiSW52YWxpZCBxdW90YXRpb24uXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRlbGV0ZUJ1bGtRdW90YXRpb24oc3RyKGlkLCAyMCksIGF1dGgudXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvcXVvdGF0aW9uc1wiKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29udmVydEJ1bGtRdW90YXRpb25BY3Rpb24oaWQpIHtcclxuICBjb25zdCBhdXRoID0gYXdhaXQgYXNzZXJ0UGVybWlzc2lvbihcImJ1bGsucXVvdGF0aW9uc1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIS9eXFxkKyQvLnRlc3Qoc3RyKGlkLCAyMCkpKSByZXR1cm4gaW52YWxpZChcIkludmFsaWQgcXVvdGF0aW9uLlwiKTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb252ZXJ0QnVsa1F1b3RhdGlvbihzdHIoaWQsIDIwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9idWxrLW9yZGVycy9xdW90YXRpb25zXCIpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvb3JkZXJzXCIpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoid1RBZ0hzQiJ9
}),
"[project]/src/lib/actions/admin/parity/data:2d9b2b [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40a6da0a542a5a94d5b2c4d758bbce6db049793f42":"deleteBulkQuotationAction"},"src/lib/actions/admin/parity/bulk.js",""] */ __turbopack_context__.s([
    "deleteBulkQuotationAction",
    ()=>deleteBulkQuotationAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var deleteBulkQuotationAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40a6da0a542a5a94d5b2c4d758bbce6db049793f42", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteBulkQuotationAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYnVsay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcclxuXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIjtcclxuaW1wb3J0IHsgYXNzZXJ0UGVybWlzc2lvbiB9IGZyb20gXCJAL2xpYi9hdXRoL3Nlc3Npb25cIjtcclxuaW1wb3J0IHtcclxuICBhZGRCdWxrT3JkZXJSZW1hcmssXHJcbiAgY29udmVydEJ1bGtRdW90YXRpb24sXHJcbiAgZGVsZXRlQnVsa09yZGVyLFxyXG4gIGRlbGV0ZUJ1bGtRdW90YXRpb24sXHJcbiAgZXhwb3J0QnVsa09yZGVycyxcclxuICBnZXRCdWxrT3JkZXJMYWJlbCxcclxuICBnZXRCdWxrT3JkZXJUcmFja2luZyxcclxuICB1cGRhdGVCdWxrT3JkZXJBZ2VudCxcclxuICB1cGRhdGVCdWxrT3JkZXJTdGF0dXMsXHJcbiAgdXBkYXRlQnVsa1dheWJpbGwsXHJcbn0gZnJvbSBcIkAvbGliL3NlcnZpY2VzL2FkbWluL3Bhcml0eS9idWxrXCI7XHJcblxyXG5jb25zdCBpbnZhbGlkID0gKG1lc3NhZ2UgPSBcIkludmFsaWQgcmVxdWVzdC5cIikgPT4gKHsgb2s6IGZhbHNlLCBtZXNzYWdlIH0pO1xyXG5jb25zdCBzdHIgPSAodiwgbWF4ID0gMTIwKSA9PiAodHlwZW9mIHYgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHYgPT09IFwibnVtYmVyXCIgPyBTdHJpbmcodikudHJpbSgpLnNsaWNlKDAsIG1heCkgOiBcIlwiKTtcclxuY29uc3QgWU1EID0gL15cXGR7NH0tXFxkezJ9LVxcZHsyfSQvO1xyXG5jb25zdCBSRVNQT05TSUJMRSA9IFtcIlwiLCBcImN1c3RvbWVyXCIsIFwidmVuZG9yXCIsIFwiYWRtaW5cIiwgXCJjb3VyaWVyXCJdO1xyXG5jb25zdCBPUkRFUl9TVEFUVVNFUyA9IFtcImNyZWF0ZWRcIiwgXCJjb25maXJtZWRcIiwgXCJwcm9jZXNzaW5nXCIsIFwic2hpcHBlZFwiLCBcImRlbGl2ZXJlZFwiLCBcImNhbmNlbGxlZFwiLCBcInJlamVjdGVkXCIsIFwicmV0dXJuZWRcIiwgXCJydG9cIl07XHJcblxyXG5mdW5jdGlvbiByZWZyZXNoKG9yZGVySWQpIHtcclxuICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9idWxrLW9yZGVycy9vcmRlcnNcIik7XHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvc2hpcG1lbnRzXCIpO1xyXG4gIGlmIChvcmRlcklkKSByZXZhbGlkYXRlUGF0aChgL2FkbWluL2J1bGstb3JkZXJzL29yZGVycy8ke2VuY29kZVVSSUNvbXBvbmVudChvcmRlcklkKX1gKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4cG9ydEJ1bGtPcmRlcnNBY3Rpb24oZmlsdGVycykge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJ2aWV3XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3QgcXVlcnkgPSB7fTtcclxuICBmb3IgKGNvbnN0IGtleSBvZiBbXCJvcmRlcklkXCIsIFwiY3VzdG9tZXJcIiwgXCJzdGF0dXNcIl0pIGlmIChzdHIoZmlsdGVycz8uW2tleV0pKSBxdWVyeVtrZXldID0gc3RyKGZpbHRlcnNba2V5XSk7XHJcbiAgZm9yIChjb25zdCBrZXkgb2YgW1wiZnJvbVwiLCBcInRvXCJdKSBpZiAoWU1ELnRlc3Qoc3RyKGZpbHRlcnM/LltrZXldLCAxMCkpKSBxdWVyeVtrZXldID0gc3RyKGZpbHRlcnNba2V5XSwgMTApO1xyXG4gIHJldHVybiBleHBvcnRCdWxrT3JkZXJzKHF1ZXJ5LCBhdXRoLnVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa09yZGVyVHJhY2tpbmdBY3Rpb24ob3JkZXJJZCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJ2aWV3XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgaWYgKCFzdHIob3JkZXJJZCkpIHJldHVybiBpbnZhbGlkKFwiT3JkZXIgSUQgaXMgcmVxdWlyZWQuXCIpO1xyXG4gIHJldHVybiBnZXRCdWxrT3JkZXJUcmFja2luZyhzdHIob3JkZXJJZCksIGF1dGgudXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWxrT3JkZXJMYWJlbEFjdGlvbihvcmRlcklkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcInZpZXdcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cihvcmRlcklkKSkgcmV0dXJuIGludmFsaWQoXCJPcmRlciBJRCBpcyByZXF1aXJlZC5cIik7XHJcbiAgcmV0dXJuIGdldEJ1bGtPcmRlckxhYmVsKHN0cihvcmRlcklkKSwgYXV0aC51c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUJ1bGtPcmRlclN0YXR1c0FjdGlvbihvcmRlcklkLCBpbnB1dCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJlZGl0XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3Qgc3RhdHVzID0gc3RyKGlucHV0Py5zdGF0dXMsIDMwKTtcclxuICBjb25zdCByZXNwb25zaWJsZSA9IHN0cihpbnB1dD8ucmVzcG9uc2libGUsIDIwKTtcclxuICBpZiAoIU9SREVSX1NUQVRVU0VTLmluY2x1ZGVzKHN0YXR1cykpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgdmFsaWQgc3RhdHVzLlwiKTtcclxuICBpZiAoIVJFU1BPTlNJQkxFLmluY2x1ZGVzKHJlc3BvbnNpYmxlKSkgcmV0dXJuIGludmFsaWQoXCJDaG9vc2UgYSB2YWxpZCByZXNwb25zaWJsZSBwYXJ0eS5cIik7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXBkYXRlQnVsa09yZGVyU3RhdHVzKHN0cihvcmRlcklkKSwgeyBzdGF0dXMsIHJlc3BvbnNpYmxlIH0sIGF1dGgudXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaChzdHIob3JkZXJJZCkpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVCdWxrT3JkZXJBZ2VudEFjdGlvbihvcmRlcklkLCBzYWxlc21hbklkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cihzYWxlc21hbklkLCA0MCkpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgc2FsZXMgYWdlbnQuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVwZGF0ZUJ1bGtPcmRlckFnZW50KHN0cihvcmRlcklkKSwgc3RyKHNhbGVzbWFuSWQsIDQwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKHN0cihvcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFkZEJ1bGtPcmRlclJlbWFya0FjdGlvbihvcmRlcklkLCBpbnB1dCkge1xyXG4gIGNvbnN0IGF1dGggPSBhd2FpdCBhc3NlcnRQZXJtaXNzaW9uKFwiYnVsay5vcmRlcnNcIiwgXCJlZGl0XCIpO1xyXG4gIGlmICghYXV0aC5vaykgcmV0dXJuIGF1dGg7XHJcbiAgY29uc3QgcmVtYXJrID0gc3RyKGlucHV0Py5yZW1hcmssIDEwMDApO1xyXG4gIGNvbnN0IHJlc3BvbnNpYmxlID0gc3RyKGlucHV0Py5yZXNwb25zaWJsZSwgMjApO1xyXG4gIGlmICghcmVtYXJrKSByZXR1cm4gaW52YWxpZChcIlJlbWFyayBpcyByZXF1aXJlZC5cIik7XHJcbiAgaWYgKCFSRVNQT05TSUJMRS5pbmNsdWRlcyhyZXNwb25zaWJsZSkpIHJldHVybiBpbnZhbGlkKFwiQ2hvb3NlIGEgdmFsaWQgcmVzcG9uc2libGUgcGFydHkuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFkZEJ1bGtPcmRlclJlbWFyayhzdHIob3JkZXJJZCksIHsgcmVtYXJrLCByZXNwb25zaWJsZSB9LCBhdXRoLnVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goc3RyKG9yZGVySWQpKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQnVsa09yZGVyQWN0aW9uKGlkKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLm9yZGVyc1wiLCBcImRlbGV0ZVwiKTtcclxuICBpZiAoIWF1dGgub2spIHJldHVybiBhdXRoO1xyXG4gIGlmICghL15cXGQrJC8udGVzdChzdHIoaWQsIDIwKSkpIHJldHVybiBpbnZhbGlkKFwiSW52YWxpZCBvcmRlci5cIik7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZGVsZXRlQnVsa09yZGVyKHN0cihpZCwgMjApLCBhdXRoLnVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQnVsa1dheWJpbGxBY3Rpb24ob3JkZXJJZCwgd2F5YmlsbE5vKSB7XHJcbiAgY29uc3QgYXV0aCA9IGF3YWl0IGFzc2VydFBlcm1pc3Npb24oXCJidWxrLnNoaXBtZW50c1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIXN0cih3YXliaWxsTm8sIDEwMCkpIHJldHVybiBpbnZhbGlkKFwiV2F5YmlsbCBudW1iZXIgaXMgcmVxdWlyZWQuXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVwZGF0ZUJ1bGtXYXliaWxsKHN0cihvcmRlcklkKSwgc3RyKHdheWJpbGxObywgMTAwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKHN0cihvcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUJ1bGtRdW90YXRpb25BY3Rpb24oaWQpIHtcclxuICBjb25zdCBhdXRoID0gYXdhaXQgYXNzZXJ0UGVybWlzc2lvbihcImJ1bGsucXVvdGF0aW9uc1wiLCBcImRlbGV0ZVwiKTtcclxuICBpZiAoIWF1dGgub2spIHJldHVybiBhdXRoO1xyXG4gIGlmICghL15cXGQrJC8udGVzdChzdHIoaWQsIDIwKSkpIHJldHVybiBpbnZhbGlkKFwiSW52YWxpZCBxdW90YXRpb24uXCIpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRlbGV0ZUJ1bGtRdW90YXRpb24oc3RyKGlkLCAyMCksIGF1dGgudXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvcXVvdGF0aW9uc1wiKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29udmVydEJ1bGtRdW90YXRpb25BY3Rpb24oaWQpIHtcclxuICBjb25zdCBhdXRoID0gYXdhaXQgYXNzZXJ0UGVybWlzc2lvbihcImJ1bGsucXVvdGF0aW9uc1wiLCBcImVkaXRcIik7XHJcbiAgaWYgKCFhdXRoLm9rKSByZXR1cm4gYXV0aDtcclxuICBpZiAoIS9eXFxkKyQvLnRlc3Qoc3RyKGlkLCAyMCkpKSByZXR1cm4gaW52YWxpZChcIkludmFsaWQgcXVvdGF0aW9uLlwiKTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb252ZXJ0QnVsa1F1b3RhdGlvbihzdHIoaWQsIDIwKSwgYXV0aC51c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSB7XHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9idWxrLW9yZGVycy9xdW90YXRpb25zXCIpO1xyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvYWRtaW4vYnVsay1vcmRlcnMvb3JkZXJzXCIpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoidVRBdUdzQiJ9
}),
"[project]/src/lib/content/admin/status.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/ui/badge.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/status.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium leading-5 whitespace-nowrap", toneClasses[resolved], className),
        children: [
            dot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("size-1.5 shrink-0 rounded-full", dotClasses[resolved]),
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.jsx",
                lineNumber: 33,
                columnNumber: 15
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    if (status == null || status === "") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-ink-muted",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.jsx",
        lineNumber: 40,
        columnNumber: 47
    }, this);
    const text = label ?? (typeof status === "boolean" ? status ? "Yes" : "No" : String(status).replace(/_/g, " "));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
        tone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["statusTone"])(status),
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
"[project]/src/components/ui/card.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
;
;
function Card({ className, as: Tag = "section", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0 rounded-xl border border-line bg-surface shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
function CardHeader({ title, description, actions, className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-semibold text-ink",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/card.jsx",
                        lineNumber: 11,
                        columnNumber: 19
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 21,
        columnNumber: 10
    }, this);
}
function CardTitle({ className, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold text-ink", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 25,
        columnNumber: 10
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.jsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmDialog",
    ()=>ConfirmDialog,
    "Dialog",
    ()=>Dialog,
    "Drawer",
    ()=>Drawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function useModalBehaviour(open, onClose, panelRef) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const previous = document.activeElement;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        const focusable = ()=>panelRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = focusable()?.[0];
        (first || panelRef.current)?.focus();
        const onKey = (event)=>{
            if (event.key === "Escape") onClose?.();
            if (event.key === "Tab") {
                const nodes = focusable();
                if (!nodes?.length) return;
                const firstNode = nodes[0];
                const lastNode = nodes[nodes.length - 1];
                if (event.shiftKey && document.activeElement === firstNode) {
                    event.preventDefault();
                    lastNode.focus();
                } else if (!event.shiftKey && document.activeElement === lastNode) {
                    event.preventDefault();
                    firstNode.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        return ()=>{
            document.body.style.overflow = overflow;
            document.removeEventListener("keydown", onKey);
            previous?.focus?.();
        };
    }, [
        open,
        onClose,
        panelRef
    ]);
}
function Portal({ children }) {
    if (typeof document === "undefined") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(children, document.body);
}
function Dialog({ open, onClose, title, description, children, footer, size = "md" }) {
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    useModalBehaviour(open, onClose, panelRef);
    if (!open) return null;
    const widths = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        wide: "max-w-[92vw]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-black/40",
                    onClick: onClose,
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: panelRef,
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": titleId,
                    tabIndex: -1,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-xl sm:rounded-2xl", widths[size]),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            id: titleId,
                                            className: "text-base font-semibold text-ink",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/dialog.jsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this),
                                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-ink-muted",
                                            children: description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/dialog.jsx",
                                            lineNumber: 72,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon-sm",
                                    onClick: onClose,
                                    "aria-label": "Close dialog",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/dialog.jsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3",
                            children: footer
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 79,
                            columnNumber: 22
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.jsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
function Drawer({ open, onClose, title, description, children, footer, width = "max-w-xl" }) {
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    useModalBehaviour(open, onClose, panelRef);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Portal, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[60]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-black/40",
                    onClick: onClose,
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    ref: panelRef,
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": titleId,
                    tabIndex: -1,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-surface shadow-xl", width),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            id: titleId,
                                            className: "truncate text-base font-semibold text-ink",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/dialog.jsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-ink-muted",
                                            children: description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/dialog.jsx",
                                            lineNumber: 108,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon-sm",
                                    onClick: onClose,
                                    "aria-label": "Close panel",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/dialog.jsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3",
                            children: footer
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 115,
                            columnNumber: 22
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 93,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.jsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", tone = "danger", requireReason = false, reasonOptions, loading = false }) {
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [touched, setTouched] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pick = Array.isArray(reasonOptions) && reasonOptions.length > 0;
    const invalid = requireReason && (pick ? !reason.trim() : reason.trim().length < 5);
    const close = ()=>{
        setReason("");
        setTouched(false);
        onClose?.();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
        open: open,
        onClose: close,
        title: title,
        size: "sm",
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "secondary",
                    onClick: close,
                    disabled: loading,
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 145,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: tone === "danger" ? "danger" : "primary",
                    loading: loading,
                    onClick: ()=>{
                        setTouched(true);
                        if (invalid) return;
                        onConfirm?.(reason.trim());
                    },
                    children: confirmLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", tone === "danger" ? "bg-danger-bg text-danger-ink" : "bg-warning-bg text-warning-ink"),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        className: "size-4.5",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/dialog.jsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1 space-y-3",
                    children: [
                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-ink-soft",
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 167,
                            columnNumber: 27
                        }, this),
                        requireReason && pick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                            label: "Reject reason",
                            required: true,
                            error: touched && invalid ? "Please select a reason." : null,
                            children: ({ id, invalid: bad, describedBy })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                    id: id,
                                    value: reason,
                                    onChange: (e)=>setReason(e.target.value),
                                    "aria-invalid": bad || undefined,
                                    "aria-describedby": describedBy,
                                    options: reasonOptions,
                                    placeholder: "Select Reject Reason"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 169,
                            columnNumber: 13
                        }, this),
                        requireReason && !pick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                            label: "Reason (saved in the audit log)",
                            required: true,
                            error: touched && invalid ? "Please enter a reason of at least 5 characters." : null,
                            children: ({ id, invalid: bad, describedBy })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                    id: id,
                                    value: reason,
                                    onChange: (e)=>setReason(e.target.value),
                                    "aria-invalid": bad || undefined,
                                    "aria-describedby": describedBy,
                                    rows: 3,
                                    placeholder: "Why is this change being made?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/dialog.jsx",
                                    lineNumber: 178,
                                    columnNumber: 17
                                }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/dialog.jsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 162,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.jsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/parity/bulk/quotations-table.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BulkQuotationsTable",
    ()=>BulkQuotationsTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-ssr] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$data$3a$7148bb__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/parity/data:7148bb [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$data$3a$2d9b2b__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/parity/data:2d9b2b [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$bulk$2d$list$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/parity/bulk/bulk-list.jsx [app-ssr] (ecmascript)");
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
function BulkQuotationsTable({ result, query, canEdit, canDelete }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { notify } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    async function confirm() {
        setBusy(true);
        const res = pending.kind === "delete" ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$data$3a$2d9b2b__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteBulkQuotationAction"])(pending.row.id) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$parity$2f$data$3a$7148bb__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["convertBulkQuotationAction"])(pending.row.id);
        setBusy(false);
        setPending(null);
        notify({
            message: res.ok ? res.data.message ?? "Done." : res.message,
            tone: res.ok ? "success" : "error"
        });
        if (res.ok) router.refresh();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                title: "Quotations"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto scrollbar-thin",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full min-w-max text-left text-[13px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-line text-xs text-ink-muted",
                                children: [
                                    "Quotation #",
                                    "Date",
                                    "Customer",
                                    "Mobile",
                                    "Email",
                                    "Company",
                                    "Invoice",
                                    "Packages",
                                    "Status",
                                    "Converted",
                                    "Valid Until",
                                    ""
                                ].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        scope: "col",
                                        className: "px-3 py-2 font-semibold",
                                        children: h
                                    }, h, false, {
                                        fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                        lineNumber: 40,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: [
                                result.rows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 12,
                                        className: "px-4 py-8 text-center text-ink-muted",
                                        children: "No quotations match the filters."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                        lineNumber: 49,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this),
                                result.rows.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-b border-line last:border-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 font-mono text-xs",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/admin/bulk-orders/quotations/${q.id}`,
                                                    className: "text-brand-700 hover:underline",
                                                    children: q.quotationNumber
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 57,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 56,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-xs",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(q.quotationDate)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 61,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 font-medium text-ink",
                                                children: q.customerName || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: q.customerMobile || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 63,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: q.customerEmail || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 64,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: q.customerCompany || "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 65,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 tabular",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inr"])(q.invoiceValue)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 66,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 tabular",
                                                children: q.noOfPackages
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                                    status: q.status
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 69,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 68,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: q.converted ? q.orderId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/admin/bulk-orders/orders/${encodeURIComponent(q.orderId)}`,
                                                    className: "text-brand-700 hover:underline",
                                                    children: q.orderId
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 74,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    tone: "success",
                                                    children: "Converted"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 78,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    tone: "neutral",
                                                    children: "No"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 81,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 71,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2 text-xs",
                                                children: q.validUntil ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(q.validUntil) : "—"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 84,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/admin/bulk-orders/quotations/${q.id}`,
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonClasses"])({
                                                                size: "icon-sm",
                                                                variant: "ghost"
                                                            }),
                                                            "aria-label": `View ${q.quotationNumber}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "size-4",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                                lineNumber: 88,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                            lineNumber: 87,
                                                            columnNumber: 21
                                                        }, this),
                                                        canEdit && !q.converted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "icon-sm",
                                                            variant: "ghost",
                                                            onClick: ()=>setPending({
                                                                    kind: "convert",
                                                                    row: q
                                                                }),
                                                            "aria-label": `Convert ${q.quotationNumber} to order`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"], {
                                                                className: "size-4",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                                lineNumber: 92,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                            lineNumber: 91,
                                                            columnNumber: 23
                                                        }, this),
                                                        canDelete && !q.converted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "icon-sm",
                                                            variant: "ghost",
                                                            onClick: ()=>setPending({
                                                                    kind: "delete",
                                                                    row: q
                                                                }),
                                                            "aria-label": `Delete ${q.quotationNumber}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "size-4 text-danger-ink",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                                lineNumber: 97,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                            lineNumber: 96,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                                lineNumber: 85,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, q.id, true, {
                                        fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$parity$2f$bulk$2f$bulk$2d$list$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BulkPager"], {
                result: result,
                query: query
            }, void 0, false, {
                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: Boolean(pending),
                onClose: ()=>setPending(null),
                onConfirm: confirm,
                loading: busy,
                tone: pending?.kind === "delete" ? "danger" : "primary",
                title: pending?.kind === "delete" ? `Delete quotation ${pending?.row.quotationNumber}?` : `Convert ${pending?.row.quotationNumber ?? ""} to an order?`,
                description: pending?.kind === "delete" ? "The quotation, its items and packages are removed." : "A Shiprocket Cargo order is created from this quotation with its saved courier partner and mode.",
                confirmLabel: pending?.kind === "delete" ? "Delete" : "Convert"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
                lineNumber: 108,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/parity/bulk/quotations-table.jsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_28ff34aa._.js.map