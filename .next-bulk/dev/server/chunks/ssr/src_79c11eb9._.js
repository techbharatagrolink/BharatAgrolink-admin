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
"[project]/src/lib/content/admin/order-status-color.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Order-status colors from C:\xampp\htdocs\AMPL.BAadmin\manage_orders.php.
 *
 * Named statuses use the `.status-*` colors (the Order Status text colors).
 * Every other status uses `getDotColorClass` in the same order as the PHP:
 * delivered / return completed → green, shipped / transit / picked up /
 * dispatched → blue, out for delivery / pickup / manifested / packed / ready
 * → yellow, cancel / reject / rto → red, otherwise gray.
 *
 * "Undelivered" contains "delivered", so the PHP dot check would paint it green.
 * That select treats Undelivered as the red failure dot so it is not shown as delivered.
 */ __turbopack_context__.s([
    "orderStatusColor",
    ()=>orderStatusColor
]);
const named = {
    placed: "#0d6efd",
    accepted: "#198754",
    rejected: "#842029",
    packed: "#6f42c1",
    "out for delivery": "#fd7e14",
    delivered: "#ffc107",
    cancelled: "#dc3545"
};
const dot = {
    green: "#10b981",
    blue: "#3b82f6",
    yellow: "#f59e0b",
    red: "#ef4444",
    gray: "#6b7280"
};
function orderStatusColor(status) {
    const text = String(status ?? "").trim().toLowerCase();
    if (!text) return dot.gray;
    if (named[text]) return named[text];
    if (text.includes("undelivered")) return dot.red;
    if (text.includes("delivered") || text.includes("return completed")) return dot.green;
    if (text.includes("shipped") || text.includes("transit") || text.includes("picked up") || text.includes("dispatched")) return dot.blue;
    if (text.includes("out for delivery") || text.includes("pickup") || text.includes("manifested") || text.includes("packed") || text.includes("ready")) return dot.yellow;
    if (text.includes("cancel") || text.includes("reject") || text.includes("rto")) return dot.red;
    return dot.gray;
}
}),
"[project]/src/components/data-table/status-dot-select.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusDot",
    ()=>StatusDot,
    "StatusDotSelect",
    ()=>StatusDotSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/order-status-color.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const control = "w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink transition-colors hover:border-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-surface-muted disabled:text-ink-muted";
function optionValue(option) {
    return typeof option === "object" ? option.value : option;
}
function optionLabel(option) {
    return typeof option === "object" ? option.label : option;
}
function StatusDot({ color, status }) {
    const resolved = color || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColor"])(status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-block size-3.5 shrink-0 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        style: {
            backgroundColor: resolved
        },
        "data-status-dot": resolved,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
function placeMenu(button, menu) {
    const rect = button.getBoundingClientRect();
    const gap = 4;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(288, openUp ? spaceAbove : spaceBelow));
    const width = Math.max(rect.width, 196);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = openUp ? Math.max(8, rect.top - gap - maxHeight) : rect.bottom + gap;
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.width = `${width}px`;
    menu.style.maxHeight = `${maxHeight}px`;
}
function StatusDotSelect({ value, options = [], onChange, "aria-label": ariaLabel, title, className, disabled, iconOnly = false }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const current = String(value ?? "");
    const items = options.map((option)=>({
            value: String(optionValue(option) ?? ""),
            label: String(optionLabel(option) ?? "")
        }));
    const selected = items.find((item)=>item.value === current);
    const label = selected?.label || current || "—";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        if (!open || !buttonRef.current || !menuRef.current) return;
        const update = ()=>placeMenu(buttonRef.current, menuRef.current);
        update();
        const selectedNode = menuRef.current.querySelector("[aria-selected='true']");
        selectedNode?.scrollIntoView({
            block: "nearest"
        });
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return ()=>{
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [
        open
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const onDown = (event)=>{
            const target = event.target;
            if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (event)=>{
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return ()=>{
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [
        open
    ]);
    const pick = (next)=>{
        setOpen(false);
        if (next !== current) onChange?.({
            target: {
                value: next
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(iconOnly ? "relative inline-flex" : "relative min-w-0", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                type: "button",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(iconOnly ? "inline-flex size-6 items-center justify-center rounded-full hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(control, "flex h-9 items-center gap-2 pr-8 text-left")),
                "aria-label": ariaLabel || label,
                title: title || label,
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                "aria-controls": open ? listId : undefined,
                disabled: disabled,
                onClick: ()=>setOpen((value)=>!value),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusDot, {
                        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColor"])(current)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    iconOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                        lineNumber: 110,
                        columnNumber: 28
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            iconOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                className: "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                lineNumber: 112,
                columnNumber: 26
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: menuRef,
                id: listId,
                role: "listbox",
                "aria-label": ariaLabel,
                className: "fixed z-50 overflow-y-auto rounded-lg border border-line-strong bg-surface py-1 shadow-xl",
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "option",
                        "aria-selected": item.value === current,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink hover:bg-surface-muted", item.value === current && "bg-brand-50"),
                        onClick: ()=>pick(item.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusDot, {
                                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderStatusColor"])(item.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                                lineNumber: 131,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                                lineNumber: 132,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.value, true, {
                        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                        lineNumber: 123,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                lineNumber: 115,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/data-table/cells.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Cell",
    ()=>Cell,
    "formatCellValue",
    ()=>formatCellValue,
    "resolveHref",
    ()=>resolveHref
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/status-dot-select.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
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
function hrefToken(value) {
    const text = String(value ?? "");
    // A stored path or absolute URL is already an address. Encoding it turns
    // "/admin/orders/BAO 1" into a relative slug and the card route swallows it.
    if (text.startsWith("/") || /^https?:\/\//i.test(text)) return text;
    return encodeURIComponent(text);
}
function resolveHref(pattern, row) {
    if (!pattern) return null;
    let missing = false;
    const href = pattern.replace(/\{(\w+)\}/g, (_, key)=>{
        const value = row[key];
        if (value == null || value === "") missing = true;
        return hrefToken(value);
    });
    return missing ? null : href;
}
function formatCellValue(column, row) {
    const value = row[column.key];
    switch(column.type){
        case "currency":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatINR"])(value);
        case "number":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(value);
        case "percent":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPercent"])(value);
        case "date":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(value);
        case "datetime":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(value);
        case "boolean":
            return value ? "Yes" : "No";
        case "mobile":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["maskMobile"])(value);
        case "status":
            return value == null || value === "" ? "—" : column.labels?.[value] ?? String(value).replace(/_/g, " ");
        case "image":
            return value ? String(value) : "";
        case "lineStatus":
            {
                const lines = Array.isArray(row.lines) ? row.lines : [];
                const summary = value == null || value === "" ? "" : String(value);
                const detail = lines.map((line)=>`${line.productName || "Item"} (${line.invoiceNumber || "no invoice"}): ${line.status}`).join("; ");
                return [
                    summary,
                    detail
                ].filter(Boolean).join(" — ") || "—";
            }
        case "remarks":
            {
                const list = Array.isArray(value) ? value : [];
                if (!list.length) return "—";
                const body = [
                    ...list
                ].reverse().map((item)=>`${item.text} (${[
                        item.by || "Unknown",
                        item.at
                    ].filter(Boolean).join(", ")})`).join(" | ");
                return list.length > 1 ? `${body} +${list.length - 1}` : body;
            }
        default:
            return value == null || value === "" ? "—" : String(value);
    }
}
function remarkWhen(value) {
    if (!value) return "";
    const normalized = String(value).includes("T") ? String(value) : String(value).replace(" ", "T");
    const formatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(normalized);
    return formatted === "—" ? String(value) : formatted;
}
function RemarkNote({ item }) {
    const when = remarkWhen(item.at);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "break-words whitespace-pre-wrap text-ink",
                children: item.text
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-ink-muted",
                children: [
                    item.by || "Unknown",
                    when ? ` · ${when}` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
function RemarksCell({ remarks, orderId }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const list = Array.isArray(remarks) ? remarks : [];
    if (!list.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-ink-muted",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 94,
        columnNumber: 28
    }, this);
    const newestFirst = [
        ...list
    ].reverse();
    const latest = newestFirst[0];
    const count = list.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full min-w-0 items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        title: latest.text,
                        children: latest.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-1.5 text-ink-soft hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30",
                        "aria-label": count > 1 ? `Show all ${count} remarks` : "Show remark",
                        onClick: (event)=>{
                            event.preventDefault();
                            event.stopPropagation();
                            setOpen(true);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                className: "size-3.5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/cells.jsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            count > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold tabular text-brand-700",
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/cells.jsx",
                                lineNumber: 115,
                                columnNumber: 24
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: open,
                onClose: ()=>setOpen(false),
                title: "Remarks",
                description: orderId ? `Order ${orderId}` : "Every note on this order",
                size: "md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "divide-y divide-line",
                    children: newestFirst.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "py-3 first:pt-0 last:pb-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RemarkNote, {
                                item: item
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/cells.jsx",
                                lineNumber: 122,
                                columnNumber: 15
                            }, this)
                        }, item.id || `${item.at}-${index}`, false, {
                            fileName: "[project]/src/components/data-table/cells.jsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function LineStatusCell({ row, activeLineId, onPickLine }) {
    const lines = Array.isArray(row.lines) ? row.lines : [];
    if (!lines.length) {
        const status = row.status;
        if (!status) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-ink-muted",
            children: "—"
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 135,
            columnNumber: 25
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex size-6 items-center justify-center",
            title: String(status),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusDot"], {
                status: status
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 137,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center gap-1",
        children: lines.map((line)=>{
            const current = line.status || "Placed";
            const label = line.productName || "Item";
            const awb = line.trackingId || "none";
            const active = String(activeLineId) === String(line.id);
            const title = [
                label,
                line.invoiceNumber,
                current,
                `AWB ${awb}`
            ].filter(Boolean).join(" · ");
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                title: title,
                "aria-pressed": active,
                "aria-label": `Show ${label}, status ${current}, AWB ${awb}`,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex size-6 items-center justify-center rounded-full", active && "ring-2 ring-brand-600 ring-offset-1"),
                onClick: (event)=>{
                    event.preventDefault();
                    event.stopPropagation();
                    onPickLine?.(row.id, line);
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusDot"], {
                    status: current
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 165,
                    columnNumber: 13
                }, this)
            }, line.id, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 152,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
function Cell({ column, row, activeLineId, onPickLine }) {
    const value = row[column.key];
    const sub = column.sub ? row[column.sub] : null;
    let content;
    if (column.type === "lineStatus") content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStatusCell, {
        row: row,
        activeLineId: activeLineId,
        onPickLine: onPickLine
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 177,
        columnNumber: 47
    }, this);
    else if (column.type === "remarks") content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RemarksCell, {
        remarks: value,
        orderId: row.id
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 178,
        columnNumber: 49
    }, this);
    else if (column.type === "image") content = value ? // eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: value,
        alt: "",
        loading: "lazy",
        className: "h-12 w-auto max-w-[96px] rounded border border-line object-contain"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 182,
        columnNumber: 7
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-ink-muted",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 184,
        columnNumber: 7
    }, this);
    else if (column.type === "link") content = value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: value,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "font-medium text-brand-700 hover:underline",
        children: column.linkLabel || "Open"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 188,
        columnNumber: 7
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-ink-muted",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 192,
        columnNumber: 7
    }, this);
    else if (column.type === "status") content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
        status: value,
        label: column.labels?.[value]
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 194,
        columnNumber: 48
    }, this);
    else if (column.type === "boolean") content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusBadge"], {
        status: Boolean(value),
        label: value ? column.trueLabel || "Yes" : column.falseLabel || "No"
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 195,
        columnNumber: 49
    }, this);
    else {
        const text = formatCellValue(column, row);
        const href = resolveHref(column.href, row);
        // dangerKey: another field of the row that, when truthy, flags this value (e.g. an overdue SLA).
        const danger = column.dangerKey && Boolean(Number(row[column.dangerKey]) || row[column.dangerKey] === true);
        const external = href && /^https?:\/\//i.test(href);
        content = href ? external ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "font-medium text-brand-700 hover:underline",
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 207,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "font-medium text-brand-700 hover:underline",
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 211,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(column.type === "mono" && "font-mono text-[12.5px]", column.emphasis && "font-medium text-ink", danger && "inline-flex items-center gap-1 font-bold text-danger-ink"),
            children: [
                text,
                danger && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "size-3.5",
                    "aria-label": "Overdue"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 218,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 216,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0", column.wrap ? "whitespace-normal" : "truncate"),
        children: [
            content,
            sub != null && sub !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "truncate text-xs text-ink-muted",
                children: column.subType ? formatCellValue({
                    type: column.subType,
                    key: column.sub
                }, row) : String(sub)
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 225,
                columnNumber: 37
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/data-table/use-query-state.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQueryState",
    ()=>useQueryState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function useQueryState() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const setParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updates, { resetPage = true } = {})=>{
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)){
            if (value == null || value === "") params.delete(key);
            else params.set(key, String(value));
        }
        if (resetPage && !("page" in updates)) params.delete("page");
        const qs = params.toString();
        if (qs !== searchParams.toString()) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRouteProgress"])();
        startTransition(()=>router.replace(qs ? `${pathname}?${qs}` : pathname, {
                scroll: false
            }));
    }, [
        pathname,
        router,
        searchParams
    ]);
    const get = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key)=>searchParams.get(key) || "", [
        searchParams
    ]);
    return {
        get,
        setParams,
        pending,
        searchParams
    };
}
}),
"[project]/src/components/data-table/filter-bar.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateRangeFilter",
    ()=>DateRangeFilter,
    "FilterBar",
    ()=>FilterBar,
    "SearchInput",
    ()=>SearchInput,
    "SelectFilter",
    ()=>SelectFilter,
    "presetRange",
    ()=>presetRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-range.js [app-ssr] (ecmascript) <export default as CalendarRange>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/use-query-state.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const DATE_PRESETS = [
    {
        value: "today",
        label: "Today"
    },
    {
        value: "yesterday",
        label: "Yesterday"
    },
    {
        value: "7d",
        label: "Last 7 days"
    },
    {
        value: "30d",
        label: "Last 30 days"
    },
    {
        value: "mtd",
        label: "Month to date"
    },
    {
        value: "prev-month",
        label: "Previous month"
    },
    {
        value: "cycle-1",
        label: "Payout cycle 1–15"
    },
    {
        value: "cycle-2",
        label: "Payout cycle 16–end"
    },
    {
        value: "custom",
        label: "Custom range"
    }
];
function iso(d) {
    const local = new Date(d.getTime() + 5.5 * 3600000);
    return local.toISOString().slice(0, 10);
}
function presetRange(preset, now = new Date()) {
    const today = new Date(now);
    const day = 86400000;
    const y = today.getUTCFullYear();
    const m = today.getUTCMonth();
    switch(preset){
        case "today":
            return {
                from: iso(today),
                to: iso(today)
            };
        case "yesterday":
            return {
                from: iso(new Date(today - day)),
                to: iso(new Date(today - day))
            };
        case "7d":
            return {
                from: iso(new Date(today - 7 * day)),
                to: iso(today)
            };
        case "30d":
            return {
                from: iso(new Date(today - 30 * day)),
                to: iso(today)
            };
        case "mtd":
            return {
                from: `${y}-${String(m + 1).padStart(2, "0")}-01`,
                to: iso(today)
            };
        case "prev-month":
            {
                const start = new Date(Date.UTC(y, m - 1, 1));
                const end = new Date(Date.UTC(y, m, 0));
                return {
                    from: start.toISOString().slice(0, 10),
                    to: end.toISOString().slice(0, 10)
                };
            }
        case "cycle-1":
            return {
                from: `${y}-${String(m + 1).padStart(2, "0")}-01`,
                to: `${y}-${String(m + 1).padStart(2, "0")}-15`
            };
        case "cycle-2":
            {
                const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
                return {
                    from: `${y}-${String(m + 1).padStart(2, "0")}-16`,
                    to: `${y}-${String(m + 1).padStart(2, "0")}-${last}`
                };
            }
        default:
            return null;
    }
}
function SearchInput({ placeholder = "Search…", className }) {
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryState"])();
    const urlValue = get("q");
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(urlValue);
    const [lastUrl, setLastUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(urlValue);
    if (lastUrl !== urlValue) {
        setLastUrl(urlValue);
        setValue(urlValue);
    }
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>clearTimeout(timer.current), []);
    const onChange = (next)=>{
        setValue(next);
        clearTimeout(timer.current);
        timer.current = setTimeout(()=>setParams({
                q: next.trim()
            }), 350);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative min-w-0", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "search",
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                "aria-label": placeholder,
                className: "h-9 w-full rounded-lg border border-line-strong bg-surface pr-8 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onChange(""),
                className: "absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink",
                "aria-label": "Clear search",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "size-3.5"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 87,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/filter-bar.jsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
function DateRangeFilter({ label = "Date" }) {
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryState"])();
    const preset = get("range") || (get("from") || get("to") ? "custom" : "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-w-0 flex-wrap items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__["CalendarRange"], {
                        className: "pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-ink-muted",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        "aria-label": `${label} range`,
                        className: "w-44 [&_select]:pl-8",
                        value: preset,
                        placeholder: `${label}: all time`,
                        options: DATE_PRESETS,
                        onChange: (e)=>{
                            const value = e.target.value;
                            if (!value) return setParams({
                                range: "",
                                from: "",
                                to: ""
                            });
                            if (value === "custom") return setParams({
                                range: "custom"
                            });
                            const r = presetRange(value);
                            setParams({
                                range: value,
                                from: r.from,
                                to: r.to
                            });
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            preset === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        "aria-label": "From date",
                        value: get("from"),
                        onChange: (e)=>setParams({
                                from: e.target.value
                            }),
                        className: "h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-ink-muted",
                        children: "to"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "date",
                        "aria-label": "To date",
                        value: get("to"),
                        min: get("from") || undefined,
                        onChange: (e)=>setParams({
                                to: e.target.value
                            }),
                        className: "h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/filter-bar.jsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
function SelectFilter({ name, label, options }) {
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryState"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
        "aria-label": label,
        className: "w-full sm:w-44",
        value: get(name),
        placeholder: `${label}: all`,
        options: options,
        onChange: (e)=>setParams({
                [name]: e.target.value
            })
    }, void 0, false, {
        fileName: "[project]/src/components/data-table/filter-bar.jsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function FilterBar({ search, filters = [], dateRange, children, className }) {
    const { searchParams, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryState"])();
    const active = [
        ...searchParams.keys()
    ].some((k)=>![
            "page",
            "pageSize",
            "sort",
            "tab"
        ].includes(k));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center", className),
        children: [
            search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchInput, {
                placeholder: search,
                className: "lg:w-72"
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 147,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center",
                children: filters.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectFilter, {
                        name: f.key,
                        label: f.label,
                        options: f.options
                    }, f.key, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            dateRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DateRangeFilter, {
                label: typeof dateRange === "string" ? dateRange : "Date"
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 153,
                columnNumber: 21
            }, this),
            children,
            active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>{
                    const reset = {};
                    for (const k of searchParams.keys())if (![
                        "tab"
                    ].includes(k)) reset[k] = "";
                    setParams(reset);
                },
                className: "inline-flex h-9 items-center gap-1 self-start rounded-lg px-2.5 text-[13px] font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink lg:self-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        className: "size-3.5",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/filter-bar.jsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    " Clear filters"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 156,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/filter-bar.jsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/data-table/data-table.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-ssr] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-ssr] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.js [app-ssr] (ecmascript) <export default as Columns3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/states.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/popover.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/cells.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$filter$2d$bar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/filter-bar.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/use-query-state.js [app-ssr] (ecmascript)");
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
;
;
;
;
const PAGE_SIZES = [
    10,
    25,
    50,
    100
];
function matchesWhen(action, row) {
    if (!action.when) return true;
    const value = row[action.when.field];
    if (action.when.in) return action.when.in.includes(value);
    if (action.when.notIn) return !action.when.notIn.includes(value);
    return true;
}
function toCsv(columns, rows) {
    const escape = (v)=>`"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = columns.map((c)=>escape(c.label)).join(",");
    const body = rows.map((row)=>columns.map((c)=>escape(c.type === "status" || c.type === "mono" || !c.type ? row[c.key] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCellValue"])(c, row))).join(","));
    return [
        header,
        ...body
    ].join("\n");
}
function download(filename, text) {
    const blob = new Blob([
        "\ufeff",
        text
    ], {
        type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function DataTable({ id = "table", columns, data, rowKey = "id", search, filters = [], dateRange, rowHref, rowActions = [], bulkActions = [], onAction, onCustomAction, onExport, exportName, emptyTitle = "No records found", emptyDescription = "Try changing the search or filters.", toolbar, summary, dense = true, pageSizes = PAGE_SIZES }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { notify } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const { get, setParams, pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryState"])();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [picks, setPicks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>columns.filter((c)=>c.hidden).map((c)=>c.key));
    const [confirm, setConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [running, startRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const [exporting, setExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const visible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>columns.filter((c)=>!hidden.includes(c.key)), [
        columns,
        hidden
    ]);
    const rows = data.rows;
    const pageIds = rows.map((r)=>r[rowKey]);
    const selectedOnPage = selected.filter((sid)=>pageIds.includes(sid));
    const allChecked = rows.length > 0 && selectedOnPage.length === rows.length;
    const [sortField, sortDir] = (get("sort") || "").split(":");
    const showSelection = bulkActions.length > 0;
    const hasRowActions = rowActions.length > 0;
    const pickLine = (orderId, line)=>setPicks((current)=>({
                ...current,
                [orderId]: line
            }));
    const viewOf = (row)=>{
        const line = picks[row[rowKey]];
        if (!line) return row;
        return {
            ...row,
            trackingId: line.trackingId || "",
            trackingUrl: line.trackingUrl || "",
            productName: line.productName || row.productName,
            invoiceNumber: line.invoiceNumber || "",
            status: line.status || row.status
        };
    };
    const runAction = (action, ids, reason)=>{
        startRunning(async ()=>{
            const result = await onAction(action.id, ids, reason ? {
                reason
            } : {});
            setConfirm(null);
            if (result?.ok) {
                notify({
                    message: result.message || "Done.",
                    tone: "success"
                });
                setSelected([]);
                router.refresh();
            } else notify({
                message: result?.message || "Action failed.",
                tone: "error"
            });
        });
    };
    const trigger = (action, ids)=>{
        if (action.href) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startRouteProgress"])();
            return router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveHref"])(action.href, rows.find((r)=>r[rowKey] === ids[0]) || {}));
        }
        if ((action.kind === "form" || action.assign) && onCustomAction) {
            return onCustomAction(action, ids, rows.filter((r)=>ids.includes(r[rowKey])), ()=>setSelected([]));
        }
        if (action.confirm) setConfirm({
            action,
            ids
        });
        else runAction(action, ids);
    };
    const exportCsv = async ()=>{
        setExporting(true);
        try {
            if (onExport) {
                const result = await onExport(Object.fromEntries(new URLSearchParams(window.location.search)));
                if (!result?.ok) throw new Error(result?.message);
                download(`${exportName || id}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(columns, result.rows));
                notify({
                    message: `Exported ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(result.rows.length)} rows.`
                });
            } else {
                download(`${exportName || id}-page.csv`, toCsv(columns, rows));
            }
        } catch (error) {
            notify({
                message: error.message || "Export failed.",
                tone: "error"
            });
        } finally{
            setExporting(false);
        }
    };
    const sortBy = (column)=>{
        if (!column.sortable) return;
        const next = sortField !== column.key ? "desc" : sortDir === "desc" ? "asc" : "";
        setParams({
            sort: next ? `${column.key}:${next}` : ""
        }, {
            resetPage: false
        });
    };
    const sortable = visible.filter((c)=>c.sortable);
    const sortOptions = sortable.flatMap((c)=>[
            {
                value: `${c.key}:desc`,
                label: `${c.label} ↓`
            },
            {
                value: `${c.key}:asc`,
                label: `${c.label} ↑`
            }
        ]);
    const actionsMenu = (key, actions)=>actions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
            label: `Actions for ${key}`,
            panelClassName: "w-52",
            trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon-sm",
                    onClick: toggle,
                    ...props,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 168,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/data-table.jsx",
                    lineNumber: 167,
                    columnNumber: 11
                }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "py-1",
                children: actions.map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-close": true,
                            onClick: ()=>trigger(action, [
                                    key
                                ]),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted", action.tone === "danger" ? "text-danger-ink" : "text-ink"),
                            children: action.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 175,
                            columnNumber: 15
                        }, this)
                    }, action.id, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 174,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 172,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/data-table.jsx",
            lineNumber: 163,
            columnNumber: 7
        }, this);
    const from = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
    const to = Math.min(data.total, data.page * data.pageSize);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 rounded-xl border border-line bg-surface shadow-sm",
        children: [
            (search || filters.length > 0 || dateRange || toolbar || onExport !== undefined) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 border-b border-line p-3 xl:flex-row xl:items-start xl:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$filter$2d$bar$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FilterBar"], {
                        search: search,
                        filters: filters,
                        dateRange: dateRange,
                        className: "min-w-0 flex-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 flex-wrap items-center gap-2",
                        children: [
                            toolbar,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"], {
                                label: "Choose columns",
                                panelClassName: "w-56",
                                trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        onClick: toggle,
                                        ...props,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                                                className: "size-4",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 204,
                                                columnNumber: 19
                                            }, void 0),
                                            " Columns"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 203,
                                        columnNumber: 17
                                    }, void 0),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-72 space-y-1.5 overflow-y-auto p-3",
                                    children: columns.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            label: c.label,
                                            checked: !hidden.includes(c.key),
                                            onChange: (e)=>setHidden((h)=>e.target.checked ? h.filter((k)=>k !== c.key) : [
                                                        ...h,
                                                        c.key
                                                    ]),
                                            className: "flex"
                                        }, c.key, false, {
                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                            lineNumber: 210,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 199,
                                columnNumber: 13
                            }, this),
                            onExport !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                onClick: exportCsv,
                                loading: exporting,
                                children: [
                                    !exporting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "size-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 222,
                                        columnNumber: 32
                                    }, this),
                                    " Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 195,
                columnNumber: 9
            }, this),
            summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft",
                children: summary
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 229,
                columnNumber: 19
            }, this),
            showSelection && selected.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2 border-b border-line bg-brand-50 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[13px] font-medium text-brand-800",
                        children: [
                            selected.length,
                            " selected"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    bulkActions.map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            size: "xs",
                            variant: action.tone === "danger" ? "danger-outline" : "secondary",
                            onClick: ()=>trigger(action, selected),
                            disabled: running,
                            children: action.label
                        }, action.id, false, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 235,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        size: "xs",
                        variant: "ghost",
                        onClick: ()=>setSelected([]),
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 239,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 z-10 flex justify-center pt-10",
                        "aria-live": "polite",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "size-3.5 animate-spin",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this),
                                " Loading…"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hidden max-h-[70vh] overflow-auto scrollbar-thin md:block", pending && "opacity-55"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full min-w-max border-separate border-spacing-0 text-left text-[13px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                scope: "col",
                                                className: "sticky top-0 z-10 w-10 border-b border-line bg-surface-muted px-3 py-2.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                    "aria-label": "Select all rows on this page",
                                                    checked: allChecked,
                                                    onChange: (e)=>setSelected(e.target.checked ? [
                                                            ...new Set([
                                                                ...selected,
                                                                ...pageIds
                                                            ])
                                                        ] : selected.filter((sid)=>!pageIds.includes(sid)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 258,
                                                columnNumber: 19
                                            }, this),
                                            visible.map((column, index)=>{
                                                const active = sortField === column.key;
                                                const SortIcon = !active ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"] : sortDir === "asc" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    "aria-sort": active ? sortDir === "asc" ? "ascending" : "descending" : undefined,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("sticky top-0 z-10 border-b border-line bg-surface-muted px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-ink-muted", index === 0 && "left-0 z-20", [
                                                        "currency",
                                                        "number",
                                                        "percent"
                                                    ].includes(column.type) && "text-right", column.align === "right" && "text-right"),
                                                    style: column.width ? {
                                                        width: column.width,
                                                        maxWidth: column.width
                                                    } : undefined,
                                                    children: column.sortable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>sortBy(column),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-1 hover:text-ink", active && "text-ink"),
                                                        children: [
                                                            column.label,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                className: "size-3.5",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 276,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 274,
                                                        columnNumber: 25
                                                    }, this) : column.label
                                                }, column.key, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 266,
                                                    columnNumber: 21
                                                }, this);
                                            }),
                                            hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                scope: "col",
                                                className: "sticky top-0 z-10 w-12 border-b border-line bg-surface-muted px-3 py-2.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 286,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 285,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: rows.map((row)=>{
                                        const key = row[rowKey];
                                        const view = viewOf(row);
                                        const href = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveHref"])(rowHref, row);
                                        const actions = rowActions.filter((a)=>matchesWhen(a, row));
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border-b border-line last:border-0 hover:bg-surface-muted", selected.includes(key) && "bg-brand-50/60"),
                                            children: [
                                                showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-line px-3 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                        "aria-label": `Select ${key}`,
                                                        checked: selected.includes(key),
                                                        onChange: (e)=>setSelected((s)=>e.target.checked ? [
                                                                    ...s,
                                                                    key
                                                                ] : s.filter((x)=>x !== key))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 301,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 300,
                                                    columnNumber: 23
                                                }, this),
                                                visible.map((column, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border-b border-line bg-surface px-3 align-middle text-ink-soft", dense ? "py-2" : "py-3", ci === 0 && "sticky left-0 z-[1]", [
                                                            "currency",
                                                            "number",
                                                            "percent"
                                                        ].includes(column.type) && "text-right tabular", column.align === "right" && "text-right"),
                                                        style: {
                                                            maxWidth: column.width || 320
                                                        },
                                                        children: ci === 0 && href && !column.href && column.type !== "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: href,
                                                            className: "block truncate font-medium text-brand-700 hover:underline",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCellValue"])(column, view),
                                                                column.sub && view[column.sub] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block truncate text-xs font-normal text-ink-muted",
                                                                    children: view[column.sub]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 313,
                                                                    columnNumber: 64
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 311,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                            column: column,
                                                            row: view,
                                                            activeLineId: picks[key]?.id,
                                                            onPickLine: pickLine
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 316,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, column.key, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 305,
                                                        columnNumber: 23
                                                    }, this)),
                                                hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-line px-3 py-2 text-right",
                                                    children: actionsMenu(key, actions)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 320,
                                                    columnNumber: 39
                                                }, this)
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                            lineNumber: 298,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("md:hidden", pending && "opacity-55"),
                        children: [
                            (showSelection || sortOptions.length > 0) && rows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 border-b border-line bg-surface-muted px-3 py-2",
                                children: [
                                    showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                        label: "Select all",
                                        checked: allChecked,
                                        onChange: (e)=>setSelected(e.target.checked ? [
                                                ...new Set([
                                                    ...selected,
                                                    ...pageIds
                                                ])
                                            ] : selected.filter((sid)=>!pageIds.includes(sid)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 332,
                                        columnNumber: 17
                                    }, this),
                                    sortOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        "aria-label": "Sort by",
                                        className: "ml-auto w-auto max-w-[60%]",
                                        value: sortField && sortDir ? `${sortField}:${sortDir}` : "",
                                        options: sortOptions,
                                        placeholder: "Sort: default",
                                        onChange: (e)=>setParams({
                                                sort: e.target.value
                                            }, {
                                                resetPage: false
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "divide-y divide-line",
                                children: rows.map((row)=>{
                                    const key = row[rowKey];
                                    const view = viewOf(row);
                                    const href = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveHref"])(rowHref, row);
                                    const actions = rowActions.filter((a)=>matchesWhen(a, row));
                                    const [lead, ...rest] = visible;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-3 py-3", selected.includes(key) && "bg-brand-50/60"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2.5",
                                                children: [
                                                    showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                        className: "mt-0.5",
                                                        "aria-label": `Select ${key}`,
                                                        checked: selected.includes(key),
                                                        onChange: (e)=>setSelected((s)=>e.target.checked ? [
                                                                    ...s,
                                                                    key
                                                                ] : s.filter((x)=>x !== key))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 357,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0 flex-1 text-sm",
                                                        children: lead && (href && !lead.href && lead.type !== "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: href,
                                                            className: "block font-medium break-words text-brand-700 hover:underline",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCellValue"])(lead, view),
                                                                lead.sub && view[lead.sub] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block text-xs font-normal text-ink-muted",
                                                                    children: view[lead.sub]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 60
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 362,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-ink",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                column: lead,
                                                                row: view,
                                                                activeLineId: picks[key]?.id,
                                                                onPickLine: pickLine
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 368,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 367,
                                                            columnNumber: 27
                                                        }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 359,
                                                        columnNumber: 21
                                                    }, this),
                                                    hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "-mt-1 -mr-1 shrink-0",
                                                        children: actionsMenu(key, actions)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 372,
                                                        columnNumber: 39
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 355,
                                                columnNumber: 19
                                            }, this),
                                            rest.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]", showSelection && "pl-7"),
                                                children: rest.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-w-0", column.wrap && "col-span-2"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                className: "text-[11px] font-medium tracking-wide text-ink-muted uppercase",
                                                                children: column.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 378,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                className: "mt-0.5 min-w-0 break-words text-ink-soft [&_.truncate]:whitespace-normal",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                    column: column,
                                                                    row: view,
                                                                    activeLineId: picks[key]?.id,
                                                                    onPickLine: pickLine
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 380,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 379,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, column.key, true, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 377,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 375,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 346,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    rows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EmptyState"], {
                        title: emptyTitle,
                        description: emptyDescription
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 391,
                        columnNumber: 31
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 border-t border-line px-3 py-2.5 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "tabular",
                        children: data.total === 0 ? "No results" : `Showing ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(from)}–${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(to)} of ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(data.total)}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "hidden items-center gap-2 sm:flex",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Rows"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        "aria-label": "Rows per page",
                                        className: "w-20",
                                        value: String(data.pageSize),
                                        options: pageSizes.map(String),
                                        onChange: (e)=>setParams({
                                                pageSize: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "icon-sm",
                                onClick: ()=>setParams({
                                        page: data.page - 1
                                    }, {
                                        resetPage: false
                                    }),
                                disabled: data.page <= 1 || pending,
                                "aria-label": "Previous page",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-20 text-center tabular",
                                children: [
                                    "Page ",
                                    data.page,
                                    " / ",
                                    data.pageCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "icon-sm",
                                onClick: ()=>setParams({
                                        page: data.page + 1
                                    }, {
                                        resetPage: false
                                    }),
                                disabled: data.page >= data.pageCount || pending,
                                "aria-label": "Next page",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 410,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: Boolean(confirm),
                onClose: ()=>setConfirm(null),
                onConfirm: (reason)=>runAction(confirm?.action, confirm?.ids, reason),
                title: confirm?.action.confirm?.title || confirm?.action.label,
                description: confirm ? (confirm.action.confirm?.description || "").replace("{count}", String(confirm.ids.length)) : "",
                confirmLabel: confirm?.action.confirm?.confirmLabel || confirm?.action.label,
                tone: confirm?.action.tone === "danger" ? "danger" : "warning",
                requireReason: confirm?.action.confirm?.requireReason,
                reasonOptions: confirm?.action.confirm?.reasonOptions,
                loading: running
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 415,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/data-table.jsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/actions/admin/data:f8f48b [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"7cad3989db32f5192c1e8820c765efb8e468c33851":"resourceActionAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceActionAction",
    ()=>resourceActionAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var resourceActionAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("7cad3989db32f5192c1e8820c765efb8e468c33851", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceActionAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiZ1RBcUJzQiJ9
}),
"[project]/src/lib/actions/admin/data:bf1ff0 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a4533fe49135e174d981ba6cedbc7f8cfe11a44d":"resourceExportAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceExportAction",
    ()=>resourceExportAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var resourceExportAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60a4533fe49135e174d981ba6cedbc7f8cfe11a44d", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceExportAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiZ1RBOEJzQiJ9
}),
"[project]/src/lib/actions/admin/data:951541 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"78e08031f1f9ecdc54b14c9e27902fa61444ff4069":"resourceSaveAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceSaveAction",
    ()=>resourceSaveAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var resourceSaveAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("78e08031f1f9ecdc54b14c9e27902fa61444ff4069", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceSaveAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOFNBc0NzQiJ9
}),
"[project]/src/lib/actions/admin/data:a6d49c [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40cf0200efaf3e9e090c0b87a402115b45d86827ee":"syncVisibleOrdersAction"},"src/lib/actions/admin/shipping.js",""] */ __turbopack_context__.s([
    "syncVisibleOrdersAction",
    ()=>syncVisibleOrdersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var syncVisibleOrdersAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40cf0200efaf3e9e090c0b87a402115b45d86827ee", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "syncVisibleOrdersAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc2hpcHBpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCI7XHJcbmltcG9ydCB7IGdldEN1cnJlbnRBZG1pbiB9IGZyb20gXCJAL2xpYi9hdXRoL3Nlc3Npb25cIjtcclxuaW1wb3J0IHtcclxuICBhdmFpbGFibGVDb3VyaWVycyxcclxuICBidWxrQ291cmllcnMsXHJcbiAgYnVsa0NyZWF0ZSxcclxuICBjYW5jZWxTaGlwbWVudHMsXHJcbiAgY3JlYXRlU2hpcG1lbnQsXHJcbiAgbWFya0NhbmNlbGxlZCxcclxuICBvcGVuTGFiZWwsXHJcbiAgcmVnZW5lcmF0ZUxhYmVsLFxyXG4gIHNoaXByb2NrZXREb2N1bWVudCxcclxuICBzeW5jU3RhdHVzLFxyXG4gIHVwZGF0ZVNoaXByb2NrZXRPcmRlcixcclxuICBjYW5jZWxTaGlwcm9ja2V0T3JkZXJzLFxyXG4gIGNhbmNlbFNoaXByb2NrZXRTaGlwbWVudHMsXHJcbiAgc2hpcHJvY2tldE9yZGVyRGV0YWlscyxcclxuICBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnQsXHJcbiAgdHJhY2tTaGlwcm9ja2V0QXdicyxcclxuICB0cmFja1NoaXByb2NrZXRTaGlwbWVudCxcclxufSBmcm9tIFwiQC9saWIvc2VydmljZXMvYWRtaW4vc2hpcHBpbmdcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuY29uc3QgaW52YWxpZCA9IHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdC5cIiB9O1xyXG5jb25zdCBDT01QQU5JRVMgPSBuZXcgU2V0KFtcIm5pbWJ1c1wiLCBcInNoaXByb2NrZXRcIiwgXCJkZWxoaXZlcnlcIl0pO1xyXG5jb25zdCBET0NTID0gbmV3IFNldChbXCJtYW5pZmVzdFwiLCBcInBpY2t1cFwiLCBcImludm9pY2VcIl0pO1xyXG5cclxuY29uc3Qgc3RyID0gKHYsIG1heCA9IDEwMCkgPT4gKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB2ID09PSBcIm51bWJlclwiID8gU3RyaW5nKHYpLnRyaW0oKS5zbGljZSgwLCBtYXgpIDogXCJcIik7XHJcbmNvbnN0IGlkcyA9IChsaXN0LCBtYXgpID0+IChBcnJheS5pc0FycmF5KGxpc3QpID8gWy4uLm5ldyBTZXQobGlzdC5tYXAoKHYpID0+IHN0cih2KSkuZmlsdGVyKEJvb2xlYW4pKV0uc2xpY2UoMCwgbWF4KSA6IFtdKTtcclxuY29uc3QgY291cmllcnMgPSAobWFwKSA9PiB7XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgaWYgKG1hcCAmJiB0eXBlb2YgbWFwID09PSBcIm9iamVjdFwiKSBmb3IgKGNvbnN0IFt2ZW5kb3JJZCwgY291cmllcl0gb2YgT2JqZWN0LmVudHJpZXMobWFwKSkgaWYgKGNvdXJpZXIgJiYgdHlwZW9mIGNvdXJpZXIgPT09IFwib2JqZWN0XCIpIG91dFtzdHIodmVuZG9ySWQpXSA9IGNvdXJpZXI7XHJcbiAgcmV0dXJuIG91dDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlZnJlc2gob3JkZXJJZHMgPSBbXSkge1xyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2FkbWluL3NoaXBwaW5nXCIpO1xyXG4gIGZvciAoY29uc3QgaWQgb2Ygb3JkZXJJZHMpIHJldmFsaWRhdGVQYXRoKGAvYWRtaW4vb3JkZXJzLyR7aWR9YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhdmFpbGFibGVDb3VyaWVyc0FjdGlvbihvcmRlcklkLCBjb21wYW55KSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgaWYgKCFzdHIob3JkZXJJZCkgfHwgIUNPTVBBTklFUy5oYXMoY29tcGFueSkpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBhdmFpbGFibGVDb3VyaWVycyhzdHIob3JkZXJJZCksIGNvbXBhbnksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2hpcG1lbnRBY3Rpb24ob3JkZXJJZCwgaW5wdXQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBpZCA9IHN0cihvcmRlcklkKTtcclxuICBpZiAoIWlkIHx8ICFpbnB1dCB8fCAhQ09NUEFOSUVTLmhhcyhpbnB1dC5jb21wYW55KSkgcmV0dXJuIGludmFsaWQ7XHJcbiAgY29uc3QgcGlja3VwRGF0ZSA9IC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KGlucHV0LnBpY2t1cERhdGUgPz8gXCJcIikgPyBpbnB1dC5waWNrdXBEYXRlIDogdW5kZWZpbmVkO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNyZWF0ZVNoaXBtZW50KGlkLCB7IGNvbXBhbnk6IGlucHV0LmNvbXBhbnksIHNlbGVjdGVkQ291cmllcnM6IGNvdXJpZXJzKGlucHV0LnNlbGVjdGVkQ291cmllcnMpLCBleGNsdWRlZFZlbmRvcnM6IGlkcyhpbnB1dC5leGNsdWRlZFZlbmRvcnMsIDUwKSwgLi4uKHBpY2t1cERhdGUgPyB7IHBpY2t1cERhdGUgfSA6IHt9KSB9LCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtpZF0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTaGlwcm9ja2V0T3JkZXJBY3Rpb24ob3JkZXJJZCkge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGlmICghc3RyKG9yZGVySWQpKSByZXR1cm4gaW52YWxpZDtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCB1cGRhdGVTaGlwcm9ja2V0T3JkZXIoc3RyKG9yZGVySWQpLCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtzdHIob3JkZXJJZCldKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0NvdXJpZXJzQWN0aW9uKG9yZGVySWRzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhvcmRlcklkcywgNTApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIG9yZGVyLlwiIH07XHJcbiAgcmV0dXJuIGJ1bGtDb3VyaWVycyhsaXN0LCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtDcmVhdGVBY3Rpb24ob3JkZXJzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IEFycmF5LmlzQXJyYXkob3JkZXJzKSA/IG9yZGVycy5zbGljZSgwLCA1MCkubWFwKChvKSA9PiAoeyBvcmRlcklkOiBzdHIobz8ub3JkZXJJZCksIHNlbGVjdGVkQ291cmllcnM6IGNvdXJpZXJzKG8/LnNlbGVjdGVkQ291cmllcnMpIH0pKS5maWx0ZXIoKG8pID0+IG8ub3JkZXJJZCkgOiBbXTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBvcmRlci5cIiB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGJ1bGtDcmVhdGUobGlzdCwgdXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaChsaXN0Lm1hcCgobykgPT4gby5vcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5MYWJlbEFjdGlvbihvcmRlcklkLCB2ZW5kb3JJZCkge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGlmICghc3RyKG9yZGVySWQpKSByZXR1cm4gaW52YWxpZDtcclxuICByZXR1cm4gb3BlbkxhYmVsKHN0cihvcmRlcklkKSwgc3RyKHZlbmRvcklkKSB8fCB1bmRlZmluZWQsIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnZW5lcmF0ZUxhYmVsQWN0aW9uKG9yZGVySWQsIGF3YiwgdmVuZG9ySWQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBpZiAoIXN0cihvcmRlcklkKSB8fCAhc3RyKGF3YikpIHJldHVybiBpbnZhbGlkO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlZ2VuZXJhdGVMYWJlbChzdHIob3JkZXJJZCksIHN0cihhd2IpLCBzdHIodmVuZG9ySWQpLCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtzdHIob3JkZXJJZCldKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hpcHJvY2tldERvY3VtZW50QWN0aW9uKG9yZGVySWQsIHZlbmRvcklkLCBkb2MpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBpZiAoIXN0cihvcmRlcklkKSB8fCAhc3RyKHZlbmRvcklkKSB8fCAhRE9DUy5oYXMoZG9jKSkgcmV0dXJuIGludmFsaWQ7XHJcbiAgcmV0dXJuIHNoaXByb2NrZXREb2N1bWVudChzdHIob3JkZXJJZCksIHN0cih2ZW5kb3JJZCksIGRvYywgdXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYW5jZWxTaGlwbWVudHNBY3Rpb24oYXdicywgb3JkZXJJZHMpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gaWRzKGF3YnMsIDIwMDApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIHNoaXBtZW50IHdpdGggYW4gQVdCLlwiIH07XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2FuY2VsU2hpcG1lbnRzKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goaWRzKG9yZGVySWRzLCAyMDApKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0NhbmNlbGxlZEFjdGlvbihhd2JzLCBvcmRlcklkcykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMoYXdicywgMjAwMCk7XHJcbiAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgc2hpcG1lbnQgd2l0aCBhbiBBV0IuXCIgfTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBtYXJrQ2FuY2VsbGVkKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goaWRzKG9yZGVySWRzLCAyMDApKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKiBTaGlwcm9ja2V0IG9yZGVycyByZXBvcnQgKHNoaXByb2NrZXRfb3JkZXJzX3JlcG9ydC5waHApLiBJZHMgYXJlIFNoaXByb2NrZXQncyBvd24gb3JkZXIgLyBzaGlwbWVudCBpZHMuICovXHJcblxyXG5jb25zdCBTUl9ET0NTID0gbmV3IFNldChbXCJsYWJlbFwiLCBcIm1hbmlmZXN0XCIsIFwiaW52b2ljZVwiXSk7XHJcbmNvbnN0IHNySWRzID0gKGxpc3QsIG1heCkgPT4gaWRzKGxpc3QsIG1heCkuZmlsdGVyKCh2KSA9PiAvXlxcZHsxLDIwfSQvLnRlc3QodikpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoaXByb2NrZXRPcmRlckFjdGlvbihzck9yZGVySWQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBbaWRdID0gc3JJZHMoW3NyT3JkZXJJZF0sIDEpO1xyXG4gIGlmICghaWQpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBzaGlwcm9ja2V0T3JkZXJEZXRhaWxzKGlkLCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYWNrU2hpcHJvY2tldEFjdGlvbihzaGlwbWVudElkKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgW2lkXSA9IHNySWRzKFtzaGlwbWVudElkXSwgMSk7XHJcbiAgaWYgKCFpZCkgcmV0dXJuIGludmFsaWQ7XHJcbiAgcmV0dXJuIHRyYWNrU2hpcHJvY2tldFNoaXBtZW50KGlkLCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYWNrU2hpcHJvY2tldEF3YnNBY3Rpb24oYXdicykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMoYXdicywgNTEpO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJObyBzaGlwbWVudHMgd2l0aCBBV0IgY29kZXMgc2VsZWN0ZWQuIFBsZWFzZSBzZWxlY3Qgc2hpcG1lbnRzIHRoYXQgaGF2ZSBBV0IgY29kZXMuXCIgfTtcclxuICBpZiAobGlzdC5sZW5ndGggPiA1MCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIk1heGltdW0gNTAgc2hpcG1lbnRzIHdpdGggQVdCIGNvZGVzIGNhbiBiZSB0cmFja2VkIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgNTAgb3IgZmV3ZXIgc2hpcG1lbnRzLlwiIH07XHJcbiAgcmV0dXJuIHRyYWNrU2hpcHJvY2tldEF3YnMobGlzdCwgdXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnRBY3Rpb24oZG9jLCBpZExpc3QpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gc3JJZHMoaWRMaXN0LCAyMDApO1xyXG4gIGlmICghU1JfRE9DUy5oYXMoZG9jKSB8fCAhbGlzdC5sZW5ndGgpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnQoZG9jLCBsaXN0LCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbmNlbFNoaXByb2NrZXRPcmRlcnNBY3Rpb24ob3JkZXJJZHMpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gc3JJZHMob3JkZXJJZHMsIDIwMCk7XHJcbiAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIk5vIHZhbGlkIG9yZGVyIElEcyBmb3VuZCBpbiBzZWxlY3RlZCBzaGlwbWVudHMuXCIgfTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYW5jZWxTaGlwcm9ja2V0T3JkZXJzKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FuY2VsU2hpcHJvY2tldFNoaXBtZW50c0FjdGlvbihhd2JzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhhd2JzLCAyMDAxKTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiTm8gdmFsaWQgQVdCIGNvZGVzIGZvdW5kIGluIHNlbGVjdGVkIHNoaXBtZW50cy5cIiB9O1xyXG4gIGlmIChsaXN0Lmxlbmd0aCA+IDIwMDApIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJNYXhpbXVtIDIwMDAgc2hpcG1lbnRzIGNhbiBiZSBjYW5jZWxsZWQgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCAyMDAwIG9yIGZld2VyIHNoaXBtZW50cy5cIiB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbmNlbFNoaXByb2NrZXRTaGlwbWVudHMobGlzdCwgdXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaCgpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jU3RhdHVzQWN0aW9uKG9yZGVySWRzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhvcmRlcklkcywgNTApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIG9yZGVyLlwiIH07XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3luY1N0YXR1cyh7IG9yZGVySWRzOiBsaXN0IH0sIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2gobGlzdCk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqIG1hbmFnZV9vcmRlcnMucGhwIHN5bmNWaXNpYmxlQ291cmllclN0YXR1c2VzOiB0aGUgb3JkZXJzIGN1cnJlbnRseSBvbiBzY3JlZW4sIGF0IG1vc3QgMjAuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jVmlzaWJsZU9yZGVyc0FjdGlvbihvcmRlcklkcykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMob3JkZXJJZHMsIDIwKTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogdHJ1ZSwgY2hhbmdlZDogMCB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN5bmNTdGF0dXMoeyBvcmRlcklkczogbGlzdCB9LCB1c2VyKTtcclxuICBjb25zdCB1cGRhdGVzID0gQXJyYXkuaXNBcnJheShyZXN1bHQuZGF0YT8udXBkYXRlcykgPyByZXN1bHQuZGF0YS51cGRhdGVzIDogW107XHJcbiAgY29uc3QgbmltYnVzID0gQXJyYXkuaXNBcnJheShyZXN1bHQuZGF0YT8ubmltYnVzPy51cGRhdGVkKSA/IHJlc3VsdC5kYXRhLm5pbWJ1cy51cGRhdGVkIDogW107XHJcbiAgY29uc3QgY2hhbmdlZCA9IHVwZGF0ZXMubGVuZ3RoICsgbmltYnVzLmxlbmd0aDtcclxuICBpZiAocmVzdWx0Lm9rICYmIGNoYW5nZWQgPiAwKSB7XHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9vcmRlcnNcIik7XHJcbiAgICByZWZyZXNoKGxpc3QpO1xyXG4gIH1cclxuICByZXR1cm4geyBvazogcmVzdWx0Lm9rLCBjaGFuZ2VkLCBtZXNzYWdlOiByZXN1bHQubWVzc2FnZSB9O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoia1RBd01zQiJ9
}),
"[project]/src/components/ui/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-right.js [app-ssr] (ecmascript) <export default as ArrowDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-ssr] (ecmascript)");
;
;
;
;
function PageHeader({ title, description, actions, meta, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold tracking-tight text-ink sm:text-[22px]",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 max-w-3xl text-sm text-ink-muted",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 10,
                        columnNumber: 25
                    }, this),
                    meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12.5px] font-medium text-ink-muted",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex size-7 shrink-0 items-center justify-center rounded-lg", toneBg),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs",
                children: [
                    delta != null && Number.isFinite(delta) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success-ink" : "text-danger-ink"),
                        children: [
                            delta >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                className: "size-3.5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/page.jsx",
                                lineNumber: 34,
                                columnNumber: 27
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__["ArrowDownRight"], {
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
                    hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    const classes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("block min-w-0 rounded-xl border border-line bg-surface p-3.5", href && "transition-colors hover:border-brand-200 hover:bg-surface-muted", className);
    return href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: classes,
        children: content
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 44,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: content
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
function StatGrid({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 53,
        columnNumber: 10
    }, this);
}
function DescriptionList({ items, columns = 2, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("grid gap-x-6 gap-y-3", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 1 ? "" : "sm:grid-cols-2", className),
        children: items.filter(Boolean).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                        className: "text-xs text-ink-muted",
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
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
    if (!items?.length) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-sm text-ink-muted",
        children: "No activity yet."
    }, void 0, false, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 70,
        columnNumber: 30
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
        className: "relative space-y-4 border-l border-line pl-5",
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute top-1 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", item.tone === "danger" ? "bg-danger" : item.tone === "warning" ? "bg-warning-ink" : "bg-brand-600"),
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-ink",
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-ink-soft",
                        children: item.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 77,
                        columnNumber: 32
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "-mx-1 mb-4 overflow-x-auto scrollbar-thin",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "flex min-w-max gap-1 border-b border-line px-1",
            "aria-label": "Sections",
            children: tabs.map((tab)=>{
                const isActive = tab.value === active;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: tab.href,
                    scroll: false,
                    "aria-current": isActive ? "page" : undefined,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors", isActive ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink"),
                    children: [
                        tab.label,
                        tab.count != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border px-3.5 py-2.5 text-sm", toneClass, className),
        role: tone === "danger" ? "alert" : undefined,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-semibold",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 116,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(title && "mt-0.5", "opacity-95"),
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-2 w-full overflow-hidden rounded-full bg-neutral-bg", className),
        role: "progressbar",
        "aria-valuenow": Math.round(pct),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-label": label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("chart-grow-x h-full rounded-full", toneClass),
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
"[project]/src/components/admin/products/product-html-editor.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductHtmlEditor",
    ()=>ProductHtmlEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const TOOLS = [
    [
        "bold",
        "B",
        "Bold"
    ],
    [
        "italic",
        "I",
        "Italic"
    ],
    [
        "underline",
        "U",
        "Underline"
    ],
    [
        "insertUnorderedList",
        "• List",
        "Bulleted list"
    ],
    [
        "insertOrderedList",
        "1. List",
        "Numbered list"
    ]
];
function ProductHtmlEditor({ value, onChange }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [html, setHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value || "");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!source && ref.current) ref.current.innerHTML = html;
    }, [
        source
    ]);
    const publish = (next)=>{
        setHtml(next);
        onChange(next);
    };
    const command = (name, arg)=>{
        ref.current?.focus();
        document.execCommand(name, false, arg);
        publish(ref.current?.innerHTML || "");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-lg border border-line bg-surface",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-1 border-b border-line bg-surface-muted px-2 py-1.5",
                children: [
                    TOOLS.map(([name, label, title])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            title: title,
                            className: "rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface",
                            onMouseDown: (event)=>event.preventDefault(),
                            onClick: ()=>command(name),
                            children: label
                        }, name, false, {
                            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: "Link",
                        className: "rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface",
                        onMouseDown: (event)=>event.preventDefault(),
                        onClick: ()=>{
                            const url = window.prompt("Link URL");
                            if (url) command("createLink", url);
                        },
                        children: "Link"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `ml-auto rounded px-2 py-1 text-xs font-semibold ${source ? "bg-ink text-white" : "text-ink hover:bg-surface"}`,
                        onClick: ()=>setSource((current)=>!current),
                        children: "Source"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            source ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: "min-h-72 w-full resize-y bg-surface p-3 font-mono text-xs text-ink outline-none",
                value: html,
                onChange: (event)=>publish(event.target.value)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                lineNumber: 55,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ref,
                contentEditable: true,
                role: "textbox",
                "aria-multiline": "true",
                "aria-label": "Product full details",
                className: "min-h-72 px-3 py-2 text-sm text-ink outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1 [&_ul]:list-disc [&_ul]:pl-5",
                onInput: ()=>publish(ref.current?.innerHTML || "")
            }, void 0, false, {
                fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                lineNumber: 57,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/validation/admin/forms.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/components/admin/resource/record-form.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecordFormDrawer",
    ()=>RecordFormDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/page.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$products$2f$product$2d$html$2d$editor$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/products/product-html-editor.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validation/admin/forms.js [app-ssr] (ecmascript)");
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
/** `hidden` fields with `fromQuery` take their value from the page URL (e.g. ?attributeId=12) when the record has none. */ function initialValues(fields, record, query) {
    const values = {};
    for (const field of fields){
        const raw = record?.[field.name] ?? (field.fromQuery ? query?.get(field.fromQuery) : null);
        if (field.type === "checkbox") values[field.name] = raw === true || raw === 1 || raw === "1" ? "1" : record ? "" : field.default ? "1" : "";
        else if (field.type === "multiselect") values[field.name] = Array.isArray(raw) ? raw.map(String) : typeof raw === "string" && raw ? raw.split(",").map((s)=>s.trim()) : [];
        else if (field.type === "file") values[field.name] = null;
        else if (raw == null) values[field.name] = field.default != null && !record ? String(field.default) : "";
        else if (field.type === "date") values[field.name] = String(raw).slice(0, 10);
        else values[field.name] = String(raw);
    }
    return values;
}
function RecordFormDrawer({ open, onClose, title, description, fields: allFields, record, optionSets = {}, requireReason, onSubmit }) {
    const fields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formFieldsFor"])(allFields, !record);
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>initialValues(fields, record, query));
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, startSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const set = (name, value)=>{
        setValues((v)=>({
                ...v,
                [name]: value
            }));
        if (errors[name]) setErrors((e)=>({
                ...e,
                [name]: undefined
            }));
    };
    const pickFile = (field, file)=>{
        if (file && field.maxBytes && file.size > field.maxBytes) {
            setErrors((e)=>({
                    ...e,
                    [field.name]: `File must be ${Math.round(field.maxBytes / 1024 / 1024)} MB or smaller.`
                }));
            return;
        }
        setFiles((f)=>({
                ...f,
                [field.name]: file || undefined
            }));
        if (errors[field.name]) setErrors((e)=>({
                ...e,
                [field.name]: undefined
            }));
    };
    /** With file fields the values travel as JSON in a FormData next to the files. */ const payload = ()=>{
        if (!fields.some((f)=>f.type === "file")) return values;
        const body = new FormData();
        body.set("__values", JSON.stringify(values));
        for (const [name, file] of Object.entries(files))if (file) body.set(name, file, file.name);
        return body;
    };
    const submit = (event)=>{
        event.preventDefault();
        const check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateForm"])(fields, values, optionSets);
        const nextErrors = {
            ...check.errors
        };
        for (const f of fields)if (f.type === "file" && f.required && !files[f.name] && !record?.[f.name]) nextErrors[f.name] = `${f.label} is required.`;
        if (requireReason && reason.trim().length < 5) nextErrors.__reason = "Please give a reason (at least 5 characters).";
        setErrors(nextErrors);
        const hiddenError = fields.find((f)=>f.type === "hidden" && nextErrors[f.name]);
        if (hiddenError) setFormError(`${hiddenError.label} is missing. Open this list from its parent page.`);
        if (Object.keys(nextErrors).length) return;
        startSaving(async ()=>{
            const result = await onSubmit(payload(), reason.trim());
            if (result?.ok) return;
            setFormError(result?.message || "Could not save.");
            if (result?.fieldErrors) setErrors(result.fieldErrors);
        });
    };
    const formId = "record-form";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Drawer"], {
        open: open,
        onClose: onClose,
        title: title,
        description: description,
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "secondary",
                    onClick: onClose,
                    disabled: saving,
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    type: "submit",
                    variant: "primary",
                    form: formId,
                    loading: saving,
                    children: "Save"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                    lineNumber: 94,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            id: formId,
            onSubmit: submit,
            className: "space-y-4",
            noValidate: true,
            children: [
                formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Notice"], {
                    tone: "danger",
                    children: formError
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                    lineNumber: 101,
                    columnNumber: 23
                }, this),
                fields.map((field)=>{
                    if (field.type === "hidden") return null;
                    const options = optionSets[field.name] ?? field.options ?? [];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                        label: field.label,
                        required: field.required,
                        error: errors[field.name],
                        hint: field.hint,
                        children: ({ id, invalid, describedBy })=>{
                            const common = {
                                id,
                                name: field.name,
                                value: values[field.name],
                                "aria-invalid": invalid || undefined,
                                "aria-describedby": describedBy
                            };
                            if (field.type === "select") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                ...common,
                                options: options,
                                placeholder: "Select…",
                                onChange: (e)=>set(field.name, e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 109,
                                columnNumber: 53
                            }, this);
                            if (field.type === "multiselect") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                ...common,
                                multiple: true,
                                size: Math.min(8, Math.max(3, options.length)),
                                className: "w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm",
                                onChange: (e)=>set(field.name, [
                                        ...e.target.selectedOptions
                                    ].map((o)=>o.value)),
                                children: options.map((o)=>{
                                    const value = typeof o === "object" ? String(o.value) : String(o);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: value,
                                        children: typeof o === "object" ? o.label : o
                                    }, value, false, {
                                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                        lineNumber: 122,
                                        columnNumber: 27
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this);
                            if (field.type === "textarea") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                ...common,
                                rows: field.rows ?? 4,
                                maxLength: field.maxLength,
                                onChange: (e)=>set(field.name, e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 129,
                                columnNumber: 55
                            }, this);
                            if (field.type === "html") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$products$2f$product$2d$html$2d$editor$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductHtmlEditor"], {
                                value: values[field.name],
                                onChange: (html)=>set(field.name, html)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 130,
                                columnNumber: 51
                            }, this);
                            if (field.type === "checkbox") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                id: id,
                                label: field.checkboxLabel ?? field.label,
                                checked: values[field.name] === "1",
                                onChange: (e)=>set(field.name, e.target.checked ? "1" : "")
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 131,
                                columnNumber: 55
                            }, this);
                            if (field.type === "color") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                ...common,
                                type: "color",
                                className: "h-9 w-20 p-1",
                                onChange: (e)=>set(field.name, e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 132,
                                columnNumber: 52
                            }, this);
                            if (field.type === "file") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    record?.[field.name] && field.accept?.startsWith("image") ? // eslint-disable-next-line @next/next/no-img-element
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: record[field.name],
                                        alt: "",
                                        className: "h-16 w-auto rounded border border-line object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                        lineNumber: 138,
                                        columnNumber: 25
                                    }, this) : record?.[field.name] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: record[field.name],
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-xs text-brand-700 hover:underline",
                                        children: "Current file"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                        lineNumber: 140,
                                        columnNumber: 25
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: id,
                                        type: "file",
                                        accept: field.accept,
                                        "aria-describedby": describedBy,
                                        className: "block w-full text-sm",
                                        onChange: (e)=>pickFile(field, e.target.files?.[0])
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                        lineNumber: 142,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 135,
                                columnNumber: 21
                            }, this);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                ...common,
                                type: field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "password" ? "password" : "text",
                                inputMode: field.type === "number" ? "decimal" : undefined,
                                min: field.min,
                                max: field.max,
                                step: field.type === "number" ? "any" : undefined,
                                maxLength: field.maxLength,
                                onChange: (e)=>set(field.name, e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 146,
                                columnNumber: 19
                            }, this);
                        }
                    }, field.name, false, {
                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                        lineNumber: 106,
                        columnNumber: 13
                    }, this);
                }),
                requireReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
                    label: "Reason for change (saved in the audit log)",
                    required: true,
                    error: errors.__reason,
                    children: ({ id, invalid, describedBy })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                            id: id,
                            rows: 2,
                            value: reason,
                            onChange: (e)=>setReason(e.target.value),
                            "aria-invalid": invalid || undefined,
                            "aria-describedby": describedBy
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/resource/record-form.jsx",
                            lineNumber: 164,
                            columnNumber: 15
                        }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                    lineNumber: 162,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 100,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/resource/record-form.jsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/admin/resource/resource-table.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResourceTable",
    ()=>ResourceTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$data$2d$table$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/data-table.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:f8f48b [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$bf1ff0__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:bf1ff0 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$951541__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:951541 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$a6d49c__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:a6d49c [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$resource$2f$record$2d$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/resource/record-form.jsx [app-ssr] (ecmascript)");
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
const COURIER_FINAL = new Set([
    "Delivered",
    "Cancelled",
    "Rejected",
    "Return Accepted",
    "Return Cancelled",
    "Return Completed"
]);
function AssignDialog({ state, onClose, onDone }) {
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [running, startRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransition"])();
    const { action, ids } = state;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
        open: true,
        onClose: onClose,
        size: "sm",
        title: action.confirm?.title || action.label,
        description: action.confirm?.description,
        footer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "secondary",
                    onClick: onClose,
                    disabled: running,
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                    lineNumber: 30,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "primary",
                    loading: running,
                    disabled: !value,
                    onClick: ()=>startRunning(()=>onDone(value)),
                    children: [
                        "Assign ",
                        ids.length
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                    lineNumber: 33,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Field"], {
            label: action.assign.label,
            required: true,
            children: ({ id })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                    id: id,
                    value: value,
                    onChange: (e)=>setValue(e.target.value),
                    options: action.assign.options,
                    placeholder: "Select…"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                    lineNumber: 40,
                    columnNumber: 22
                }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/resource/resource-table.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
function ResourceTable({ resourceKey, resource, data, canAdd, rowActions, bulkActions, optionSets }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { notify } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assign, setAssign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const onAction = (actionId, ids, { reason } = {})=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceActionAction"])(resourceKey, actionId, ids, reason ?? "");
    const onCustomAction = (action, ids, rows, clearSelection)=>{
        if (action.assign) setAssign({
            action,
            ids,
            clearSelection
        });
        else if (action.kind === "form") setForm({
            record: rows[0] ?? null,
            nonce: Date.now()
        });
    };
    const save = async (values, reason)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$951541__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceSaveAction"])(resourceKey, form?.record?.id ?? null, values, reason);
        if (result?.ok) {
            notify({
                message: result.message,
                tone: "success"
            });
            setForm(null);
            router.refresh();
        }
        return result;
    };
    const runAssign = async (value)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceActionAction"])(resourceKey, assign?.action?.id, assign?.ids, "", value);
        if (result?.ok) {
            notify({
                message: result.message,
                tone: "success"
            });
            assign?.clearSelection();
            setAssign(null);
            router.refresh();
        } else notify({
            message: result?.message || "Action failed.",
            tone: "error"
        });
    };
    const synced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const pageKey = resourceKey === "orders" ? (data?.rows ?? []).map((row)=>row.id).join("|") : "";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (resourceKey !== "orders" || !pageKey) return;
        const pending = (data?.rows ?? []).filter((row)=>row?.id && !COURIER_FINAL.has(String(row.status ?? ""))).map((row)=>String(row.id)).filter((id)=>!synced.current.has(id)).slice(0, 20);
        if (!pending.length) return;
        for (const id of pending)synced.current.add(id);
        let cancelled = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$a6d49c__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["syncVisibleOrdersAction"])(pending).then((result)=>{
            if (!cancelled && result?.ok && result.changed > 0) router.refresh();
        }).catch(()=>{});
        return ()=>{
            cancelled = true;
        };
    }, [
        resourceKey,
        pageKey,
        data,
        router
    ]);
    const formConfig = resource.form;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$data$2d$table$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTable"], {
                id: resourceKey,
                columns: resource.columns,
                data: data,
                search: resource.searchFields?.length ? resource.search || "Search…" : undefined,
                filters: resource.filters ?? [],
                dateRange: resource.dateRange,
                rowHref: resource.rowHref,
                rowActions: rowActions,
                bulkActions: bulkActions,
                onAction: onAction,
                onCustomAction: onCustomAction,
                onExport: resource.exportable ? (params)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$bf1ff0__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceExportAction"])(resourceKey, params) : undefined,
                exportName: resourceKey.replace(/\./g, "-"),
                toolbar: canAdd && formConfig ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    variant: "primary",
                    onClick: ()=>setForm({
                            record: null,
                            nonce: Date.now()
                        }),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "size-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                            lineNumber: 123,
                            columnNumber: 15
                        }, void 0),
                        " Add"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                    lineNumber: 122,
                    columnNumber: 13
                }, void 0) : null
            }, void 0, false, {
                fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            form && formConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$resource$2f$record$2d$form$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RecordFormDrawer"], {
                open: true,
                onClose: ()=>setForm(null),
                title: form.record ? `Edit ${formConfig.title || resource.title}` : formConfig.title || `Add to ${resource.title}`,
                description: form.record ? `Record ${form.record.id}` : undefined,
                fields: formConfig.fields,
                record: form.record,
                optionSets: optionSets,
                requireReason: formConfig.requireReason,
                onSubmit: save
            }, form.nonce, false, {
                fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                lineNumber: 129,
                columnNumber: 9
            }, this),
            assign && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AssignDialog, {
                state: assign,
                onClose: ()=>setAssign(null),
                onDone: runAssign
            }, void 0, false, {
                fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                lineNumber: 142,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=src_79c11eb9._.js.map