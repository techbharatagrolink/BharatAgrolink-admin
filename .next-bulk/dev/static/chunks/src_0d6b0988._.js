(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/components/ui/dialog.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfirmDialog",
    ()=>ConfirmDialog,
    "Dialog",
    ()=>Dialog,
    "Drawer",
    ()=>Drawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function useModalBehaviour(open, onClose, panelRef) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be";
    }
    let t0;
    let t1;
    if ($[1] !== onClose || $[2] !== open || $[3] !== panelRef) {
        t0 = ({
            "useModalBehaviour[useEffect()]": ()=>{
                if (!open) {
                    return;
                }
                const previous = document.activeElement;
                const { overflow } = document.body.style;
                document.body.style.overflow = "hidden";
                const focusable = {
                    "useModalBehaviour[useEffect() > focusable]": ()=>panelRef.current?.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])")
                }["useModalBehaviour[useEffect() > focusable]"];
                const first = focusable()?.[0];
                (first || panelRef.current)?.focus();
                const onKey = {
                    "useModalBehaviour[useEffect() > onKey]": (event)=>{
                        if (event.key === "Escape") {
                            onClose?.();
                        }
                        if (event.key === "Tab") {
                            const nodes = focusable();
                            if (!nodes?.length) {
                                return;
                            }
                            const firstNode = nodes[0];
                            const lastNode = nodes[nodes.length - 1];
                            if (event.shiftKey && document.activeElement === firstNode) {
                                event.preventDefault();
                                lastNode.focus();
                            } else {
                                if (!event.shiftKey && document.activeElement === lastNode) {
                                    event.preventDefault();
                                    firstNode.focus();
                                }
                            }
                        }
                    }
                }["useModalBehaviour[useEffect() > onKey]"];
                document.addEventListener("keydown", onKey);
                return ()=>{
                    document.body.style.overflow = overflow;
                    document.removeEventListener("keydown", onKey);
                    previous?.focus?.();
                };
            }
        })["useModalBehaviour[useEffect()]"];
        t1 = [
            open,
            onClose,
            panelRef
        ];
        $[1] = onClose;
        $[2] = open;
        $[3] = panelRef;
        $[4] = t0;
        $[5] = t1;
    } else {
        t0 = $[4];
        t1 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
}
_s(useModalBehaviour, "OD7bBpZva5O2jO+Puf00hKivP7c=");
function Portal({ children }) {
    if (typeof document === "undefined") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(children, document.body);
}
_c = Portal;
function Dialog(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(50);
    if ($[0] !== "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be") {
        for(let $i = 0; $i < 50; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be";
    }
    const { open, onClose, title, description, children, footer, size: t1 } = t0;
    const size = t1 === undefined ? "md" : t1;
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    useModalBehaviour(open, onClose, panelRef);
    if (!open) {
        return null;
    }
    let T0;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[1] !== onClose || $[2] !== size || $[3] !== titleId) {
        const widths = {
            sm: "max-w-md",
            md: "max-w-lg",
            lg: "max-w-2xl",
            xl: "max-w-4xl",
            wide: "max-w-[92vw]"
        };
        T0 = Portal;
        t8 = "fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4";
        if ($[13] !== onClose) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40",
                onClick: onClose,
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.jsx",
                lineNumber: 130,
                columnNumber: 12
            }, this);
            $[13] = onClose;
            $[14] = t9;
        } else {
            t9 = $[14];
        }
        t2 = panelRef;
        t3 = "dialog";
        t4 = "true";
        t5 = titleId;
        t6 = -1;
        t7 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-surface shadow-xl sm:rounded-2xl", widths[size]);
        $[1] = onClose;
        $[2] = size;
        $[3] = titleId;
        $[4] = T0;
        $[5] = t2;
        $[6] = t3;
        $[7] = t4;
        $[8] = t5;
        $[9] = t6;
        $[10] = t7;
        $[11] = t8;
        $[12] = t9;
    } else {
        T0 = $[4];
        t2 = $[5];
        t3 = $[6];
        t4 = $[7];
        t5 = $[8];
        t6 = $[9];
        t7 = $[10];
        t8 = $[11];
        t9 = $[12];
    }
    let t10;
    if ($[15] !== title || $[16] !== titleId) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            id: titleId,
            className: "text-base font-semibold text-ink",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[15] = title;
        $[16] = titleId;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] !== description) {
        t11 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 text-sm text-ink-muted",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 176,
            columnNumber: 26
        }, this);
        $[18] = description;
        $[19] = t11;
    } else {
        t11 = $[19];
    }
    let t12;
    if ($[20] !== t10 || $[21] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0",
            children: [
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 184,
            columnNumber: 11
        }, this);
        $[20] = t10;
        $[21] = t11;
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 193,
            columnNumber: 11
        }, this);
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    let t14;
    if ($[24] !== onClose) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "icon-sm",
            onClick: onClose,
            "aria-label": "Close dialog",
            children: t13
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 200,
            columnNumber: 11
        }, this);
        $[24] = onClose;
        $[25] = t14;
    } else {
        t14 = $[25];
    }
    let t15;
    if ($[26] !== t12 || $[27] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
            children: [
                t12,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 208,
            columnNumber: 11
        }, this);
        $[26] = t12;
        $[27] = t14;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] !== children) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 217,
            columnNumber: 11
        }, this);
        $[29] = children;
        $[30] = t16;
    } else {
        t16 = $[30];
    }
    let t17;
    if ($[31] !== footer) {
        t17 = footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3",
            children: footer
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 225,
            columnNumber: 21
        }, this);
        $[31] = footer;
        $[32] = t17;
    } else {
        t17 = $[32];
    }
    let t18;
    if ($[33] !== t15 || $[34] !== t16 || $[35] !== t17 || $[36] !== t2 || $[37] !== t3 || $[38] !== t4 || $[39] !== t5 || $[40] !== t6 || $[41] !== t7) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: t2,
            role: t3,
            "aria-modal": t4,
            "aria-labelledby": t5,
            tabIndex: t6,
            className: t7,
            children: [
                t15,
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 233,
            columnNumber: 11
        }, this);
        $[33] = t15;
        $[34] = t16;
        $[35] = t17;
        $[36] = t2;
        $[37] = t3;
        $[38] = t4;
        $[39] = t5;
        $[40] = t6;
        $[41] = t7;
        $[42] = t18;
    } else {
        t18 = $[42];
    }
    let t19;
    if ($[43] !== t18 || $[44] !== t8 || $[45] !== t9) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            children: [
                t9,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 249,
            columnNumber: 11
        }, this);
        $[43] = t18;
        $[44] = t8;
        $[45] = t9;
        $[46] = t19;
    } else {
        t19 = $[46];
    }
    let t20;
    if ($[47] !== T0 || $[48] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            children: t19
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 259,
            columnNumber: 11
        }, this);
        $[47] = T0;
        $[48] = t19;
        $[49] = t20;
    } else {
        t20 = $[49];
    }
    return t20;
}
_s1(Dialog, "Q1uHBcQrc9ayg99kZzVw4AA+1XQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        useModalBehaviour
    ];
});
_c1 = Dialog;
function Drawer(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(32);
    if ($[0] !== "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be") {
        for(let $i = 0; $i < 32; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be";
    }
    const { open, onClose, title, description, children, footer, width: t1 } = t0;
    const width = t1 === undefined ? "max-w-xl" : t1;
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    useModalBehaviour(open, onClose, panelRef);
    if (!open) {
        return null;
    }
    let t2;
    if ($[1] !== onClose) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 bg-black/40",
            onClick: onClose,
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 294,
            columnNumber: 10
        }, this);
        $[1] = onClose;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    let t3;
    if ($[3] !== width) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-y-0 right-0 flex w-full flex-col border-l border-line bg-surface shadow-xl", width);
        $[3] = width;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== title || $[6] !== titleId) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            id: titleId,
            className: "truncate text-base font-semibold text-ink",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 310,
            columnNumber: 10
        }, this);
        $[5] = title;
        $[6] = titleId;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== description) {
        t5 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 text-sm text-ink-muted",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 319,
            columnNumber: 25
        }, this);
        $[8] = description;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== t4 || $[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 327,
            columnNumber: 10
        }, this);
        $[10] = t4;
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 336,
            columnNumber: 10
        }, this);
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== onClose) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "ghost",
            size: "icon-sm",
            onClick: onClose,
            "aria-label": "Close panel",
            children: t7
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 343,
            columnNumber: 10
        }, this);
        $[14] = onClose;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t6 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4",
            children: [
                t6,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 351,
            columnNumber: 10
        }, this);
        $[16] = t6;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== children) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-0 flex-1 overflow-y-auto px-5 py-4",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 360,
            columnNumber: 11
        }, this);
        $[19] = children;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] !== footer) {
        t11 = footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3",
            children: footer
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 368,
            columnNumber: 21
        }, this);
        $[21] = footer;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    let t12;
    if ($[23] !== t10 || $[24] !== t11 || $[25] !== t3 || $[26] !== t9 || $[27] !== titleId) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            ref: panelRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": titleId,
            tabIndex: -1,
            className: t3,
            children: [
                t9,
                t10,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 376,
            columnNumber: 11
        }, this);
        $[23] = t10;
        $[24] = t11;
        $[25] = t3;
        $[26] = t9;
        $[27] = titleId;
        $[28] = t12;
    } else {
        t12 = $[28];
    }
    let t13;
    if ($[29] !== t12 || $[30] !== t2) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Portal, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[60]",
                children: [
                    t2,
                    t12
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.jsx",
                lineNumber: 388,
                columnNumber: 19
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 388,
            columnNumber: 11
        }, this);
        $[29] = t12;
        $[30] = t2;
        $[31] = t13;
    } else {
        t13 = $[31];
    }
    return t13;
}
_s2(Drawer, "Q1uHBcQrc9ayg99kZzVw4AA+1XQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"],
        useModalBehaviour
    ];
});
_c2 = Drawer;
function ConfirmDialog(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(55);
    if ($[0] !== "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be") {
        for(let $i = 0; $i < 55; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a42b117bdb3589b5b21ea8fc238bdb70d3a7312ca80399133fb42beb1ef036be";
    }
    const { open, onClose, onConfirm, title, description, confirmLabel: t1, tone: t2, requireReason: t3, reasonOptions, loading: t4 } = t0;
    const confirmLabel = t1 === undefined ? "Confirm" : t1;
    const tone = t2 === undefined ? "danger" : t2;
    const requireReason = t3 === undefined ? false : t3;
    const loading = t4 === undefined ? false : t4;
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [touched, setTouched] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pick = Array.isArray(reasonOptions) && reasonOptions.length > 0;
    let t5;
    if ($[1] !== pick || $[2] !== reason || $[3] !== requireReason) {
        t5 = requireReason && (pick ? !reason.trim() : reason.trim().length < 5);
        $[1] = pick;
        $[2] = reason;
        $[3] = requireReason;
        $[4] = t5;
    } else {
        t5 = $[4];
    }
    const invalid = t5;
    let t6;
    if ($[5] !== onClose) {
        t6 = ({
            "ConfirmDialog[close]": ()=>{
                setReason("");
                setTouched(false);
                onClose?.();
            }
        })["ConfirmDialog[close]"];
        $[5] = onClose;
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    const close = t6;
    let t7;
    if ($[7] !== close || $[8] !== loading) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "secondary",
            onClick: close,
            disabled: loading,
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 458,
            columnNumber: 10
        }, this);
        $[7] = close;
        $[8] = loading;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    const t8 = tone === "danger" ? "danger" : "primary";
    let t9;
    if ($[10] !== invalid || $[11] !== onConfirm || $[12] !== reason) {
        t9 = ({
            "ConfirmDialog[<Button>.onClick]": ()=>{
                setTouched(true);
                if (invalid) {
                    return;
                }
                onConfirm?.(reason.trim());
            }
        })["ConfirmDialog[<Button>.onClick]"];
        $[10] = invalid;
        $[11] = onConfirm;
        $[12] = reason;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] !== confirmLabel || $[15] !== loading || $[16] !== t8 || $[17] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: t8,
            loading: loading,
            onClick: t9,
            children: confirmLabel
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 486,
            columnNumber: 11
        }, this);
        $[14] = confirmLabel;
        $[15] = loading;
        $[16] = t8;
        $[17] = t9;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== t10 || $[20] !== t7) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t7,
                t10
            ]
        }, void 0, true);
        $[19] = t10;
        $[20] = t7;
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    const t12 = tone === "danger" ? "bg-danger-bg text-danger-ink" : "bg-warning-bg text-warning-ink";
    let t13;
    if ($[22] !== t12) {
        t13 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full", t12);
        $[22] = t12;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    let t14;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
            className: "size-4.5",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 515,
            columnNumber: 11
        }, this);
        $[24] = t14;
    } else {
        t14 = $[24];
    }
    let t15;
    if ($[25] !== t13) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t13,
            children: t14
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 522,
            columnNumber: 11
        }, this);
        $[25] = t13;
        $[26] = t15;
    } else {
        t15 = $[26];
    }
    let t16;
    if ($[27] !== description) {
        t16 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-ink-soft",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 530,
            columnNumber: 26
        }, this);
        $[27] = description;
        $[28] = t16;
    } else {
        t16 = $[28];
    }
    let t17;
    if ($[29] !== invalid || $[30] !== pick || $[31] !== reason || $[32] !== reasonOptions || $[33] !== requireReason || $[34] !== touched) {
        t17 = requireReason && pick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
            label: "Reject reason",
            required: true,
            error: touched && invalid ? "Please select a reason." : null,
            children: (t18)=>{
                const { id, invalid: bad, describedBy } = t18;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    id: id,
                    value: reason,
                    onChange: {
                        "ConfirmDialog[<anonymous> > <Select>.onChange]": (e)=>setReason(e.target.value)
                    }["ConfirmDialog[<anonymous> > <Select>.onChange]"],
                    "aria-invalid": bad || undefined,
                    "aria-describedby": describedBy,
                    options: reasonOptions,
                    placeholder: "Select Reject Reason"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 544,
                    columnNumber: 16
                }, this);
            }
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 538,
            columnNumber: 36
        }, this);
        $[29] = invalid;
        $[30] = pick;
        $[31] = reason;
        $[32] = reasonOptions;
        $[33] = requireReason;
        $[34] = touched;
        $[35] = t17;
    } else {
        t17 = $[35];
    }
    let t18;
    if ($[36] !== invalid || $[37] !== pick || $[38] !== reason || $[39] !== requireReason || $[40] !== touched) {
        t18 = requireReason && !pick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
            label: "Reason (saved in the audit log)",
            required: true,
            error: touched && invalid ? "Please enter a reason of at least 5 characters." : null,
            children: (t19)=>{
                const { id: id_0, invalid: bad_0, describedBy: describedBy_0 } = t19;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                    id: id_0,
                    value: reason,
                    onChange: {
                        "ConfirmDialog[<anonymous> > <Textarea>.onChange]": (e_0)=>setReason(e_0.target.value)
                    }["ConfirmDialog[<anonymous> > <Textarea>.onChange]"],
                    "aria-invalid": bad_0 || undefined,
                    "aria-describedby": describedBy_0,
                    rows: 3,
                    placeholder: "Why is this change being made?"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/dialog.jsx",
                    lineNumber: 566,
                    columnNumber: 16
                }, this);
            }
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 560,
            columnNumber: 37
        }, this);
        $[36] = invalid;
        $[37] = pick;
        $[38] = reason;
        $[39] = requireReason;
        $[40] = touched;
        $[41] = t18;
    } else {
        t18 = $[41];
    }
    let t19;
    if ($[42] !== t16 || $[43] !== t17 || $[44] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0 flex-1 space-y-3",
            children: [
                t16,
                t17,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 581,
            columnNumber: 11
        }, this);
        $[42] = t16;
        $[43] = t17;
        $[44] = t18;
        $[45] = t19;
    } else {
        t19 = $[45];
    }
    let t20;
    if ($[46] !== t15 || $[47] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                t15,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 591,
            columnNumber: 11
        }, this);
        $[46] = t15;
        $[47] = t19;
        $[48] = t20;
    } else {
        t20 = $[48];
    }
    let t21;
    if ($[49] !== close || $[50] !== open || $[51] !== t11 || $[52] !== t20 || $[53] !== title) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dialog, {
            open: open,
            onClose: close,
            title: title,
            size: "sm",
            footer: t11,
            children: t20
        }, void 0, false, {
            fileName: "[project]/src/components/ui/dialog.jsx",
            lineNumber: 600,
            columnNumber: 11
        }, this);
        $[49] = close;
        $[50] = open;
        $[51] = t11;
        $[52] = t20;
        $[53] = title;
        $[54] = t21;
    } else {
        t21 = $[54];
    }
    return t21;
}
_s3(ConfirmDialog, "BP2F59WdjAJTDKTZeDOjUc6FEFI=");
_c3 = ConfirmDialog;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Portal");
__turbopack_context__.k.register(_c1, "Dialog");
__turbopack_context__.k.register(_c2, "Drawer");
__turbopack_context__.k.register(_c3, "ConfirmDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/lib/content/admin/status.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/status.js [app-client] (ecmascript)");
;
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
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "19f52a79b80090ec3d77ff241ad332c0c58e2d5f4ddb5c62b5409e4def7fc577") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "19f52a79b80090ec3d77ff241ad332c0c58e2d5f4ddb5c62b5409e4def7fc577";
    }
    const { tone, variant, className, children, dot: t1 } = t0;
    const dot = t1 === undefined ? false : t1;
    const resolved = tone || variantTone[variant] || "neutral";
    const t2 = toneClasses[resolved];
    let t3;
    if ($[1] !== className || $[2] !== t2) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium leading-5 whitespace-nowrap", t2, className);
        $[1] = className;
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== dot || $[5] !== resolved) {
        t4 = dot && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("size-1.5 shrink-0 rounded-full", dotClasses[resolved]),
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/ui/badge.jsx",
            lineNumber: 55,
            columnNumber: 17
        }, this);
        $[4] = dot;
        $[5] = resolved;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== children) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "truncate",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/badge.jsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t3 || $[10] !== t4 || $[11] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t3,
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/badge.jsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[9] = t3;
        $[10] = t4;
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    return t6;
}
_c = Badge;
function StatusBadge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "19f52a79b80090ec3d77ff241ad332c0c58e2d5f4ddb5c62b5409e4def7fc577") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "19f52a79b80090ec3d77ff241ad332c0c58e2d5f4ddb5c62b5409e4def7fc577";
    }
    const { status, label, className } = t0;
    if (status == null || status === "") {
        let t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-ink-muted",
                children: "—"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/badge.jsx",
                lineNumber: 98,
                columnNumber: 12
            }, this);
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        return t1;
    }
    let t1;
    if ($[2] !== label || $[3] !== status) {
        t1 = label ?? (typeof status === "boolean" ? status ? "Yes" : "No" : String(status).replace(/_/g, " "));
        $[2] = label;
        $[3] = status;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const text = t1;
    let t2;
    if ($[5] !== status) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$status$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["statusTone"])(status);
        $[5] = status;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== className || $[8] !== t2 || $[9] !== text) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
            tone: t2,
            dot: true,
            className: className,
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/ui/badge.jsx",
            lineNumber: 125,
            columnNumber: 10
        }, this);
        $[7] = className;
        $[8] = t2;
        $[9] = text;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    return t3;
}
_c1 = StatusBadge;
var _c, _c1;
__turbopack_context__.k.register(_c, "Badge");
__turbopack_context__.k.register(_c1, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/content/admin/order-status-color.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-table/status-dot-select.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusDot",
    ()=>StatusDot,
    "StatusDotSelect",
    ()=>StatusDotSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content/admin/order-status-color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function StatusDot(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "a5885eabe2ccd74fe616a53987adaea123e71060e8b6f8030a05b026b0d0d8f5") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a5885eabe2ccd74fe616a53987adaea123e71060e8b6f8030a05b026b0d0d8f5";
    }
    const { color, status } = t0;
    let t1;
    if ($[1] !== color || $[2] !== status) {
        t1 = color || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusColor"])(status);
        $[1] = color;
        $[2] = status;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const resolved = t1;
    let t2;
    if ($[4] !== resolved) {
        t2 = {
            backgroundColor: resolved
        };
        $[4] = resolved;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    let t3;
    if ($[6] !== resolved || $[7] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-block size-3.5 shrink-0 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
            style: t2,
            "data-status-dot": resolved,
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/status-dot-select.jsx",
            lineNumber: 50,
            columnNumber: 10
        }, this);
        $[6] = resolved;
        $[7] = t2;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    return t3;
}
_c = StatusDot;
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
function StatusDotSelect(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "a5885eabe2ccd74fe616a53987adaea123e71060e8b6f8030a05b026b0d0d8f5") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a5885eabe2ccd74fe616a53987adaea123e71060e8b6f8030a05b026b0d0d8f5";
    }
    const { value, options: t1, onChange, "aria-label": ariaLabel, title, className, disabled, iconOnly: t2 } = t0;
    const options = t1 === undefined ? [] : t1;
    const iconOnly = t2 === undefined ? false : t2;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const current = String(value ?? "");
    const items = options.map(_StatusDotSelectOptionsMap);
    let t3;
    if ($[1] !== current) {
        t3 = ({
            "StatusDotSelect[items.find()]": (item)=>item.value === current
        })["StatusDotSelect[items.find()]"];
        $[1] = current;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    const selected = items.find(t3);
    const label = selected?.label || current || "\u2014";
    let t4;
    let t5;
    if ($[3] !== open) {
        t4 = ({
            "StatusDotSelect[useLayoutEffect()]": ()=>{
                if (!open || !buttonRef.current || !menuRef.current) {
                    return;
                }
                const update = {
                    "StatusDotSelect[useLayoutEffect() > update]": ()=>placeMenu(buttonRef.current, menuRef.current)
                }["StatusDotSelect[useLayoutEffect() > update]"];
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
            }
        })["StatusDotSelect[useLayoutEffect()]"];
        t5 = [
            open
        ];
        $[3] = open;
        $[4] = t4;
        $[5] = t5;
    } else {
        t4 = $[4];
        t5 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])(t4, t5);
    let t6;
    let t7;
    if ($[6] !== open) {
        t6 = ({
            "StatusDotSelect[useEffect()]": ()=>{
                if (!open) {
                    return;
                }
                const onDown = {
                    "StatusDotSelect[useEffect() > onDown]": (event)=>{
                        const target = event.target;
                        if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
                            return;
                        }
                        setOpen(false);
                    }
                }["StatusDotSelect[useEffect() > onDown]"];
                const onKey = {
                    "StatusDotSelect[useEffect() > onKey]": (event_0)=>{
                        if (event_0.key === "Escape") {
                            setOpen(false);
                        }
                    }
                }["StatusDotSelect[useEffect() > onKey]"];
                document.addEventListener("mousedown", onDown);
                document.addEventListener("keydown", onKey);
                return ()=>{
                    document.removeEventListener("mousedown", onDown);
                    document.removeEventListener("keydown", onKey);
                };
            }
        })["StatusDotSelect[useEffect()]"];
        t7 = [
            open
        ];
        $[6] = open;
        $[7] = t6;
        $[8] = t7;
    } else {
        t6 = $[7];
        t7 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t6, t7);
    let t8;
    if ($[9] !== current || $[10] !== onChange) {
        t8 = ({
            "StatusDotSelect[pick]": (next)=>{
                setOpen(false);
                if (next !== current) {
                    onChange?.({
                        target: {
                            value: next
                        }
                    });
                }
            }
        })["StatusDotSelect[pick]"];
        $[9] = current;
        $[10] = onChange;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    const pick = t8;
    const t9 = iconOnly ? "relative inline-flex" : "relative min-w-0";
    let t10;
    if ($[12] !== className || $[13] !== t9) {
        t10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(t9, className);
        $[12] = className;
        $[13] = t9;
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] !== iconOnly) {
        t11 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(iconOnly ? "inline-flex size-6 items-center justify-center rounded-full hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(control, "flex h-9 items-center gap-2 pr-8 text-left"));
        $[15] = iconOnly;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "StatusDotSelect[<button>.onClick]": ()=>setOpen(_StatusDotSelectButtonOnClickSetOpen)
        })["StatusDotSelect[<button>.onClick]"];
        $[17] = t12;
    } else {
        t12 = $[17];
    }
    let t13;
    if ($[18] !== current) {
        t13 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusColor"])(current);
        $[18] = current;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusDot, {
            color: t13
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/status-dot-select.jsx",
            lineNumber: 244,
            columnNumber: 11
        }, this);
        $[20] = t13;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] !== iconOnly) {
        t15 = iconOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-muted",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/status-dot-select.jsx",
            lineNumber: 252,
            columnNumber: 29
        }, this);
        $[22] = iconOnly;
        $[23] = t15;
    } else {
        t15 = $[23];
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: t10,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                type: "button",
                className: t11,
                "aria-label": ariaLabel || label,
                title: title || label,
                "aria-haspopup": "listbox",
                "aria-expanded": open,
                "aria-controls": open ? listId : undefined,
                disabled: disabled,
                onClick: t12,
                children: [
                    t14,
                    iconOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                        lineNumber: 258,
                        columnNumber: 285
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                lineNumber: 258,
                columnNumber: 31
            }, this),
            t15,
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: menuRef,
                id: listId,
                role: "listbox",
                "aria-label": ariaLabel,
                className: "fixed z-50 overflow-y-auto rounded-lg border border-line-strong bg-surface py-1 shadow-xl",
                children: items.map({
                    "StatusDotSelect[items.map()]": (item_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            role: "option",
                            "aria-selected": item_0.value === current,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink hover:bg-surface-muted", item_0.value === current && "bg-brand-50"),
                            onClick: {
                                "StatusDotSelect[items.map() > <button>.onClick]": ()=>pick(item_0.value)
                            }["StatusDotSelect[items.map() > <button>.onClick]"],
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusDot, {
                                    color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2f$admin$2f$order$2d$status$2d$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderStatusColor"])(item_0.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                                    lineNumber: 261,
                                    columnNumber: 63
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "truncate",
                                    children: item_0.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                                    lineNumber: 261,
                                    columnNumber: 115
                                }, this)
                            ]
                        }, item_0.value, true, {
                            fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                            lineNumber: 259,
                            columnNumber: 51
                        }, this)
                }["StatusDotSelect[items.map()]"])
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/status-dot-select.jsx",
                lineNumber: 258,
                columnNumber: 363
            }, this), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/status-dot-select.jsx",
        lineNumber: 258,
        columnNumber: 10
    }, this);
}
_s(StatusDotSelect, "ueJlJli8ZXjxhmxwFQbsJ9T57xo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c1 = StatusDotSelect;
function _StatusDotSelectButtonOnClickSetOpen(value_0) {
    return !value_0;
}
function _StatusDotSelectOptionsMap(option) {
    return {
        value: String(optionValue(option) ?? ""),
        label: String(optionLabel(option) ?? "")
    };
}
var _c, _c1;
__turbopack_context__.k.register(_c, "StatusDot");
__turbopack_context__.k.register(_c1, "StatusDotSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-table/cells.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Cell",
    ()=>Cell,
    "formatCellValue",
    ()=>formatCellValue,
    "resolveHref",
    ()=>resolveHref
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/status-dot-select.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatINR"])(value);
        case "number":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(value);
        case "percent":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPercent"])(value);
        case "date":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(value);
        case "datetime":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTime"])(value);
        case "boolean":
            return value ? "Yes" : "No";
        case "mobile":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maskMobile"])(value);
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
    const formatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTime"])(normalized);
    return formatted === "—" ? String(value) : formatted;
}
function RemarkNote(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594";
    }
    const { item } = t0;
    let t1;
    if ($[1] !== item.at) {
        t1 = remarkWhen(item.at);
        $[1] = item.at;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const when = t1;
    let t2;
    if ($[3] !== item.text) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "break-words whitespace-pre-wrap text-ink",
            children: item.text
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 97,
            columnNumber: 10
        }, this);
        $[3] = item.text;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const t3 = item.by || "Unknown";
    const t4 = when ? ` · ${when}` : "";
    let t5;
    if ($[5] !== t3 || $[6] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[11px] text-ink-muted",
            children: [
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 107,
            columnNumber: 10
        }, this);
        $[5] = t3;
        $[6] = t4;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    let t6;
    if ($[8] !== t2 || $[9] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t2,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 116,
            columnNumber: 10
        }, this);
        $[8] = t2;
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    return t6;
}
_c = RemarkNote;
function RemarksCell(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(37);
    if ($[0] !== "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594";
    }
    const { remarks, orderId } = t0;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let T0;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[1] !== open || $[2] !== orderId || $[3] !== remarks) {
        t9 = Symbol.for("react.early_return_sentinel");
        bb0: {
            const list = Array.isArray(remarks) ? remarks : [];
            if (!list.length) {
                let t10;
                if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
                    t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-ink-muted",
                        children: "—"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 155,
                        columnNumber: 17
                    }, this);
                    $[14] = t10;
                } else {
                    t10 = $[14];
                }
                t9 = t10;
                break bb0;
            }
            const newestFirst = [
                ...list
            ].reverse();
            const latest = newestFirst[0];
            const count = list.length;
            const t10 = count > 1 ? `Show all ${count} remarks` : "Show remark";
            let t11;
            let t12;
            if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
                t11 = ({
                    "RemarksCell[<button>.onClick]": (event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        setOpen(true);
                    }
                })["RemarksCell[<button>.onClick]"];
                t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                    className: "size-3.5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 177,
                    columnNumber: 15
                }, this);
                $[15] = t11;
                $[16] = t12;
            } else {
                t11 = $[15];
                t12 = $[16];
            }
            let t13;
            if ($[17] !== count) {
                t13 = count > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[11px] font-semibold tabular text-brand-700",
                    children: count
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 186,
                    columnNumber: 27
                }, this) : null;
                $[17] = count;
                $[18] = t13;
            } else {
                t13 = $[18];
            }
            let t14;
            if ($[19] !== t10 || $[20] !== t13) {
                t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-1.5 text-ink-soft hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30",
                    "aria-label": t10,
                    onClick: t11,
                    children: [
                        t12,
                        t13
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 194,
                    columnNumber: 15
                }, this);
                $[19] = t10;
                $[20] = t13;
                $[21] = t14;
            } else {
                t14 = $[21];
            }
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full min-w-0 items-center gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "min-w-0 flex-1 truncate",
                        title: latest.text,
                        children: latest.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 201,
                        columnNumber: 70
                    }, this),
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 201,
                columnNumber: 12
            }, this);
            T0 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"];
            t3 = open;
            if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
                t4 = ({
                    "RemarksCell[<Dialog>.onClose]": ()=>setOpen(false)
                })["RemarksCell[<Dialog>.onClose]"];
                $[22] = t4;
            } else {
                t4 = $[22];
            }
            t5 = "Remarks";
            t6 = orderId ? `Order ${orderId}` : "Every note on this order";
            t7 = "md";
            t1 = "divide-y divide-line";
            t2 = newestFirst.map(_RemarksCellNewestFirstMap);
        }
        $[1] = open;
        $[2] = orderId;
        $[3] = remarks;
        $[4] = T0;
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
        $[8] = t4;
        $[9] = t5;
        $[10] = t6;
        $[11] = t7;
        $[12] = t8;
        $[13] = t9;
    } else {
        T0 = $[4];
        t1 = $[5];
        t2 = $[6];
        t3 = $[7];
        t4 = $[8];
        t5 = $[9];
        t6 = $[10];
        t7 = $[11];
        t8 = $[12];
        t9 = $[13];
    }
    if (t9 !== Symbol.for("react.early_return_sentinel")) {
        return t9;
    }
    let t10;
    if ($[23] !== t1 || $[24] !== t2) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 248,
            columnNumber: 11
        }, this);
        $[23] = t1;
        $[24] = t2;
        $[25] = t10;
    } else {
        t10 = $[25];
    }
    let t11;
    if ($[26] !== T0 || $[27] !== t10 || $[28] !== t3 || $[29] !== t4 || $[30] !== t5 || $[31] !== t6 || $[32] !== t7) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            open: t3,
            onClose: t4,
            title: t5,
            description: t6,
            size: t7,
            children: t10
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[26] = T0;
        $[27] = t10;
        $[28] = t3;
        $[29] = t4;
        $[30] = t5;
        $[31] = t6;
        $[32] = t7;
        $[33] = t11;
    } else {
        t11 = $[33];
    }
    let t12;
    if ($[34] !== t11 || $[35] !== t8) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t8,
                t11
            ]
        }, void 0, true);
        $[34] = t11;
        $[35] = t8;
        $[36] = t12;
    } else {
        t12 = $[36];
    }
    return t12;
}
_s(RemarksCell, "xG1TONbKtDWtdOTrXaTAsNhPg/Q=");
_c1 = RemarksCell;
function _RemarksCellNewestFirstMap(item, index) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "py-3 first:pt-0 last:pb-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RemarkNote, {
            item: item
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 281,
            columnNumber: 91
        }, this)
    }, item.id || `${item.at}-${index}`, false, {
        fileName: "[project]/src/components/data-table/cells.jsx",
        lineNumber: 281,
        columnNumber: 10
    }, this);
}
function LineStatusCell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594";
    }
    const { row, activeLineId, onPickLine } = t0;
    let t1;
    if ($[1] !== row.lines) {
        t1 = Array.isArray(row.lines) ? row.lines : [];
        $[1] = row.lines;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const lines = t1;
    if (!lines.length) {
        const status = row.status;
        if (!status) {
            let t2;
            if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
                t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-ink-muted",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 310,
                    columnNumber: 14
                }, this);
                $[3] = t2;
            } else {
                t2 = $[3];
            }
            return t2;
        }
        const t2 = String(status);
        let t3;
        if ($[4] !== status) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusDot"], {
                status: status
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 320,
                columnNumber: 12
            }, this);
            $[4] = status;
            $[5] = t3;
        } else {
            t3 = $[5];
        }
        let t4;
        if ($[6] !== t2 || $[7] !== t3) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex size-6 items-center justify-center",
                title: t2,
                children: t3
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 328,
                columnNumber: 12
            }, this);
            $[6] = t2;
            $[7] = t3;
            $[8] = t4;
        } else {
            t4 = $[8];
        }
        return t4;
    }
    let t2;
    if ($[9] !== activeLineId || $[10] !== lines || $[11] !== onPickLine || $[12] !== row.id) {
        let t3;
        if ($[14] !== activeLineId || $[15] !== onPickLine || $[16] !== row.id) {
            t3 = ({
                "LineStatusCell[lines.map()]": (line)=>{
                    const current = line.status || "Placed";
                    const label = line.productName || "Item";
                    const awb = line.trackingId || "none";
                    const active = String(activeLineId) === String(line.id);
                    const title = [
                        label,
                        line.invoiceNumber,
                        current,
                        `AWB ${awb}`
                    ].filter(Boolean).join(" \xB7 ");
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: title,
                        "aria-pressed": active,
                        "aria-label": `Show ${label}, status ${current}, AWB ${awb}`,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex size-6 items-center justify-center rounded-full", active && "ring-2 ring-brand-600 ring-offset-1"),
                        onClick: {
                            "LineStatusCell[lines.map() > <button>.onClick]": (event)=>{
                                event.preventDefault();
                                event.stopPropagation();
                                onPickLine?.(row.id, line);
                            }
                        }["LineStatusCell[lines.map() > <button>.onClick]"],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$status$2d$dot$2d$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusDot"], {
                            status: current
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-table/cells.jsx",
                            lineNumber: 354,
                            columnNumber: 64
                        }, this)
                    }, line.id, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 348,
                        columnNumber: 18
                    }, this);
                }
            })["LineStatusCell[lines.map()]"];
            $[14] = activeLineId;
            $[15] = onPickLine;
            $[16] = row.id;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        t2 = lines.map(t3);
        $[9] = activeLineId;
        $[10] = lines;
        $[11] = onPickLine;
        $[12] = row.id;
        $[13] = t2;
    } else {
        t2 = $[13];
    }
    let t3;
    if ($[18] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-1",
            children: t2
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 375,
            columnNumber: 10
        }, this);
        $[18] = t2;
        $[19] = t3;
    } else {
        t3 = $[19];
    }
    return t3;
}
_c2 = LineStatusCell;
function Cell(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(46);
    if ($[0] !== "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594") {
        for(let $i = 0; $i < 46; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2d3eedbb533e5c7f9523805316f80a6442347601b7c0c60b763a58546fbd4594";
    }
    const { column, row, activeLineId, onPickLine } = t0;
    const value = row[column.key];
    const sub = column.sub ? row[column.sub] : null;
    let content;
    if (column.type === "lineStatus") {
        let t1;
        if ($[1] !== activeLineId || $[2] !== onPickLine || $[3] !== row) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LineStatusCell, {
                row: row,
                activeLineId: activeLineId,
                onPickLine: onPickLine
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/cells.jsx",
                lineNumber: 403,
                columnNumber: 12
            }, this);
            $[1] = activeLineId;
            $[2] = onPickLine;
            $[3] = row;
            $[4] = t1;
        } else {
            t1 = $[4];
        }
        content = t1;
    } else {
        if (column.type === "remarks") {
            let t1;
            if ($[5] !== row.id || $[6] !== value) {
                t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RemarksCell, {
                    remarks: value,
                    orderId: row.id
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/cells.jsx",
                    lineNumber: 416,
                    columnNumber: 14
                }, this);
                $[5] = row.id;
                $[6] = value;
                $[7] = t1;
            } else {
                t1 = $[7];
            }
            content = t1;
        } else {
            if (column.type === "image") {
                let t1;
                if ($[8] !== value) {
                    t1 = value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: value,
                        alt: "",
                        loading: "lazy",
                        className: "h-12 w-auto max-w-[96px] rounded border border-line object-contain"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 428,
                        columnNumber: 24
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-ink-muted",
                        children: "—"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/cells.jsx",
                        lineNumber: 428,
                        columnNumber: 147
                    }, this);
                    $[8] = value;
                    $[9] = t1;
                } else {
                    t1 = $[9];
                }
                content = t1;
            } else {
                if (column.type === "link") {
                    let t1;
                    if ($[10] !== column.linkLabel || $[11] !== value) {
                        t1 = value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: value,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "font-medium text-brand-700 hover:underline",
                            children: column.linkLabel || "Open"
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-table/cells.jsx",
                            lineNumber: 439,
                            columnNumber: 26
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-ink-muted",
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-table/cells.jsx",
                            lineNumber: 439,
                            columnNumber: 174
                        }, this);
                        $[10] = column.linkLabel;
                        $[11] = value;
                        $[12] = t1;
                    } else {
                        t1 = $[12];
                    }
                    content = t1;
                } else {
                    if (column.type === "status") {
                        const t1 = column.labels?.[value];
                        let t2;
                        if ($[13] !== t1 || $[14] !== value) {
                            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                status: value,
                                label: t1
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/cells.jsx",
                                lineNumber: 452,
                                columnNumber: 20
                            }, this);
                            $[13] = t1;
                            $[14] = value;
                            $[15] = t2;
                        } else {
                            t2 = $[15];
                        }
                        content = t2;
                    } else {
                        if (column.type === "boolean") {
                            const t1 = Boolean(value);
                            const t2 = value ? column.trueLabel || "Yes" : column.falseLabel || "No";
                            let t3;
                            if ($[16] !== t1 || $[17] !== t2) {
                                t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusBadge"], {
                                    status: t1,
                                    label: t2
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/cells.jsx",
                                    lineNumber: 466,
                                    columnNumber: 22
                                }, this);
                                $[16] = t1;
                                $[17] = t2;
                                $[18] = t3;
                            } else {
                                t3 = $[18];
                            }
                            content = t3;
                        } else {
                            let t1;
                            if ($[19] !== column || $[20] !== row) {
                                t1 = formatCellValue(column, row);
                                $[19] = column;
                                $[20] = row;
                                $[21] = t1;
                            } else {
                                t1 = $[21];
                            }
                            const text = t1;
                            let danger;
                            let href;
                            let t2;
                            if ($[22] !== column.dangerKey || $[23] !== column.href || $[24] !== row) {
                                href = resolveHref(column.href, row);
                                danger = column.dangerKey && Boolean(Number(row[column.dangerKey]) || row[column.dangerKey] === true);
                                t2 = href && /^https?:\/\//i.test(href);
                                $[22] = column.dangerKey;
                                $[23] = column.href;
                                $[24] = row;
                                $[25] = danger;
                                $[26] = href;
                                $[27] = t2;
                            } else {
                                danger = $[25];
                                href = $[26];
                                t2 = $[27];
                            }
                            const external = t2;
                            let t3;
                            if ($[28] !== column.emphasis || $[29] !== column.type || $[30] !== danger || $[31] !== external || $[32] !== href || $[33] !== text) {
                                t3 = href ? external ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: href,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "font-medium text-brand-700 hover:underline",
                                    children: text
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/cells.jsx",
                                    lineNumber: 506,
                                    columnNumber: 40
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: href,
                                    className: "font-medium text-brand-700 hover:underline",
                                    children: text
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/cells.jsx",
                                    lineNumber: 506,
                                    columnNumber: 165
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(column.type === "mono" && "font-mono text-[12.5px]", column.emphasis && "font-medium text-ink", danger && "inline-flex items-center gap-1 font-bold text-danger-ink"),
                                    children: [
                                        text,
                                        danger && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "size-3.5",
                                            "aria-label": "Overdue"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/data-table/cells.jsx",
                                            lineNumber: 506,
                                            columnNumber: 458
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/data-table/cells.jsx",
                                    lineNumber: 506,
                                    columnNumber: 254
                                }, this);
                                $[28] = column.emphasis;
                                $[29] = column.type;
                                $[30] = danger;
                                $[31] = external;
                                $[32] = href;
                                $[33] = text;
                                $[34] = t3;
                            } else {
                                t3 = $[34];
                            }
                            content = t3;
                        }
                    }
                }
            }
        }
    }
    const t1 = column.wrap ? "whitespace-normal" : "truncate";
    let t2;
    if ($[35] !== t1) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-0", t1);
        $[35] = t1;
        $[36] = t2;
    } else {
        t2 = $[36];
    }
    let t3;
    if ($[37] !== column.sub || $[38] !== column.subType || $[39] !== row || $[40] !== sub) {
        t3 = sub != null && sub !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "truncate text-xs text-ink-muted",
            children: column.subType ? formatCellValue({
                type: column.subType,
                key: column.sub
            }, row) : String(sub)
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 535,
            columnNumber: 39
        }, this);
        $[37] = column.sub;
        $[38] = column.subType;
        $[39] = row;
        $[40] = sub;
        $[41] = t3;
    } else {
        t3 = $[41];
    }
    let t4;
    if ($[42] !== content || $[43] !== t2 || $[44] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            children: [
                content,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/cells.jsx",
            lineNumber: 549,
            columnNumber: 10
        }, this);
        $[42] = content;
        $[43] = t2;
        $[44] = t3;
        $[45] = t4;
    } else {
        t4 = $[45];
    }
    return t4;
}
_c3 = Cell;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "RemarkNote");
__turbopack_context__.k.register(_c1, "RemarksCell");
__turbopack_context__.k.register(_c2, "LineStatusCell");
__turbopack_context__.k.register(_c3, "Cell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-table/use-query-state.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useQueryState",
    ()=>useQueryState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function useQueryState() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "4c87bad1158d4ef81141e02cd8a9caa537a01606b6297530ffe757dfe3cdccc8") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4c87bad1158d4ef81141e02cd8a9caa537a01606b6297530ffe757dfe3cdccc8";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [pending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    let t0;
    if ($[1] !== pathname || $[2] !== router || $[3] !== searchParams) {
        t0 = ({
            "useQueryState[setParams]": (updates, t1)=>{
                const { resetPage: t2 } = t1 === undefined ? {} : t1;
                const resetPage = t2 === undefined ? true : t2;
                const params = new URLSearchParams(searchParams.toString());
                for (const [key, value] of Object.entries(updates)){
                    if (value == null || value === "") {
                        params.delete(key);
                    } else {
                        params.set(key, String(value));
                    }
                }
                if (resetPage && !("page" in updates)) {
                    params.delete("page");
                }
                const qs = params.toString();
                if (qs !== searchParams.toString()) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRouteProgress"])();
                }
                startTransition({
                    "useQueryState[setParams > startTransition()]": ()=>router.replace(qs ? `${pathname}?${qs}` : pathname, {
                            scroll: false
                        })
                }["useQueryState[setParams > startTransition()]"]);
            }
        })["useQueryState[setParams]"];
        $[1] = pathname;
        $[2] = router;
        $[3] = searchParams;
        $[4] = t0;
    } else {
        t0 = $[4];
    }
    const setParams = t0;
    let t1;
    if ($[5] !== searchParams) {
        t1 = ({
            "useQueryState[get]": (key_0)=>searchParams.get(key_0) || ""
        })["useQueryState[get]"];
        $[5] = searchParams;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    const get = t1;
    let t2;
    if ($[7] !== get || $[8] !== pending || $[9] !== searchParams || $[10] !== setParams) {
        t2 = {
            get,
            setParams,
            pending,
            searchParams
        };
        $[7] = get;
        $[8] = pending;
        $[9] = searchParams;
        $[10] = setParams;
        $[11] = t2;
    } else {
        t2 = $[11];
    }
    return t2;
}
_s(useQueryState, "lC6fAE326ZevuJSmnAbBm2wmsNo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-table/filter-bar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-range.js [app-client] (ecmascript) <export default as CalendarRange>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/use-query-state.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
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
function SearchInput(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65";
    }
    const { placeholder: t1, className } = t0;
    const placeholder = t1 === undefined ? "Search\u2026" : t1;
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"])();
    let t2;
    if ($[1] !== get) {
        t2 = get("q");
        $[1] = get;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const urlValue = t2;
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(urlValue);
    const [lastUrl, setLastUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(urlValue);
    if (lastUrl !== urlValue) {
        setLastUrl(urlValue);
        setValue(urlValue);
    }
    const timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t3;
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "SearchInput[useEffect()]": ()=>()=>clearTimeout(timer.current)
        })["SearchInput[useEffect()]"];
        t4 = [];
        $[3] = t3;
        $[4] = t4;
    } else {
        t3 = $[3];
        t4 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[5] !== setParams) {
        t5 = ({
            "SearchInput[onChange]": (next)=>{
                setValue(next);
                clearTimeout(timer.current);
                timer.current = setTimeout({
                    "SearchInput[onChange > setTimeout()]": ()=>setParams({
                            q: next.trim()
                        })
                }["SearchInput[onChange > setTimeout()]"], 350);
            }
        })["SearchInput[onChange]"];
        $[5] = setParams;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    const onChange = t5;
    let t6;
    if ($[7] !== className) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative min-w-0", className);
        $[7] = className;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
            className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 174,
            columnNumber: 10
        }, this);
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== onChange) {
        t8 = ({
            "SearchInput[<input>.onChange]": (e)=>onChange(e.target.value)
        })["SearchInput[<input>.onChange]"];
        $[10] = onChange;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== placeholder || $[13] !== t8 || $[14] !== value) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "search",
            value: value,
            onChange: t8,
            placeholder: placeholder,
            "aria-label": placeholder,
            className: "h-9 w-full rounded-lg border border-line-strong bg-surface pr-8 pl-9 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none"
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 191,
            columnNumber: 10
        }, this);
        $[12] = placeholder;
        $[13] = t8;
        $[14] = value;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== onChange || $[17] !== value) {
        t10 = value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: {
                "SearchInput[<button>.onClick]": ()=>onChange("")
            }["SearchInput[<button>.onClick]"],
            className: "absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink",
            "aria-label": "Clear search",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                className: "size-3.5"
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/filter-bar.jsx",
                lineNumber: 203,
                columnNumber: 165
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 201,
            columnNumber: 20
        }, this);
        $[16] = onChange;
        $[17] = value;
        $[18] = t10;
    } else {
        t10 = $[18];
    }
    let t11;
    if ($[19] !== t10 || $[20] !== t6 || $[21] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: [
                t7,
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 212,
            columnNumber: 11
        }, this);
        $[19] = t10;
        $[20] = t6;
        $[21] = t9;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    return t11;
}
_s(SearchInput, "8/FQuiakQJR09Bmu6Tkycm+CfNg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"]
    ];
});
_c = SearchInput;
function DateRangeFilter(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65";
    }
    const { label: t1 } = t0;
    const label = t1 === undefined ? "Date" : t1;
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"])();
    let t2;
    if ($[1] !== get) {
        t2 = get("range") || (get("from") || get("to") ? "custom" : "");
        $[1] = get;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const preset = t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$range$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarRange$3e$__["CalendarRange"], {
            className: "pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-ink-muted",
            "aria-hidden": true
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 249,
            columnNumber: 10
        }, this);
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const t4 = `${label} range`;
    const t5 = `${label}: all time`;
    let t6;
    if ($[4] !== setParams) {
        t6 = ({
            "DateRangeFilter[<Select>.onChange]": (e)=>{
                const value = e.target.value;
                if (!value) {
                    return setParams({
                        range: "",
                        from: "",
                        to: ""
                    });
                }
                if (value === "custom") {
                    return setParams({
                        range: "custom"
                    });
                }
                const r = presetRange(value);
                setParams({
                    range: value,
                    from: r.from,
                    to: r.to
                });
            }
        })["DateRangeFilter[<Select>.onChange]"];
        $[4] = setParams;
        $[5] = t6;
    } else {
        t6 = $[5];
    }
    let t7;
    if ($[6] !== preset || $[7] !== t4 || $[8] !== t5 || $[9] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    "aria-label": t4,
                    className: "w-44 [&_select]:pl-8",
                    value: preset,
                    placeholder: t5,
                    options: DATE_PRESETS,
                    onChange: t6
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 288,
                    columnNumber: 40
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 288,
            columnNumber: 10
        }, this);
        $[6] = preset;
        $[7] = t4;
        $[8] = t5;
        $[9] = t6;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== get || $[12] !== preset || $[13] !== setParams) {
        t8 = preset === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "date",
                    "aria-label": "From date",
                    value: get("from"),
                    onChange: {
                        "DateRangeFilter[<input>.onChange]": (e_0)=>setParams({
                                from: e_0.target.value
                            })
                    }["DateRangeFilter[<input>.onChange]"],
                    className: "h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 299,
                    columnNumber: 76
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-ink-muted",
                    children: "to"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 303,
                    columnNumber: 135
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "date",
                    "aria-label": "To date",
                    value: get("to"),
                    min: get("from") || undefined,
                    onChange: {
                        "DateRangeFilter[<input>.onChange]": (e_1)=>setParams({
                                to: e_1.target.value
                            })
                    }["DateRangeFilter[<input>.onChange]"],
                    className: "h-9 rounded-lg border border-line-strong bg-surface px-2 text-sm text-ink"
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 303,
                    columnNumber: 185
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 299,
            columnNumber: 33
        }, this);
        $[11] = get;
        $[12] = preset;
        $[13] = setParams;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t7 || $[16] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-w-0 flex-wrap items-center gap-2",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 317,
            columnNumber: 10
        }, this);
        $[15] = t7;
        $[16] = t8;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    return t9;
}
_s1(DateRangeFilter, "7/eMULqBqgjlUoNCMi31PWTx0G8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"]
    ];
});
_c1 = DateRangeFilter;
function SelectFilter(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65";
    }
    const { name, label, options } = t0;
    const { get, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"])();
    let t1;
    if ($[1] !== get || $[2] !== name) {
        t1 = get(name);
        $[1] = get;
        $[2] = name;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const t2 = `${label}: all`;
    let t3;
    if ($[4] !== name || $[5] !== setParams) {
        t3 = ({
            "SelectFilter[<Select>.onChange]": (e)=>setParams({
                    [name]: e.target.value
                })
        })["SelectFilter[<Select>.onChange]"];
        $[4] = name;
        $[5] = setParams;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== label || $[8] !== options || $[9] !== t1 || $[10] !== t2 || $[11] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
            "aria-label": label,
            className: "w-full sm:w-44",
            value: t1,
            placeholder: t2,
            options: options,
            onChange: t3
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 368,
            columnNumber: 10
        }, this);
        $[7] = label;
        $[8] = options;
        $[9] = t1;
        $[10] = t2;
        $[11] = t3;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    return t4;
}
_s2(SelectFilter, "7/eMULqBqgjlUoNCMi31PWTx0G8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"]
    ];
});
_c2 = SelectFilter;
function FilterBar(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b2df6fafd4951820f5b963484886bbc5eff8e1bc54cdd07d52f5c93830431d65";
    }
    const { search, filters: t1, dateRange, children, className } = t0;
    let t2;
    if ($[1] !== t1) {
        t2 = t1 === undefined ? [] : t1;
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const filters = t2;
    const { searchParams, setParams } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"])();
    const active = [
        ...searchParams.keys()
    ].some(_FilterBarAnonymous);
    let t3;
    if ($[3] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center", className);
        $[3] = className;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    let t4;
    if ($[5] !== search) {
        t4 = search && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchInput, {
            placeholder: search,
            className: "lg:w-72"
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 421,
            columnNumber: 20
        }, this);
        $[5] = search;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== filters) {
        t5 = filters.map(_FilterBarFiltersMap);
        $[7] = filters;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center",
            children: t5
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 437,
            columnNumber: 10
        }, this);
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== dateRange) {
        t7 = dateRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DateRangeFilter, {
            label: typeof dateRange === "string" ? dateRange : "Date"
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 445,
            columnNumber: 23
        }, this);
        $[11] = dateRange;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== active || $[14] !== searchParams || $[15] !== setParams) {
        t8 = active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: {
                "FilterBar[<button>.onClick]": ()=>{
                    const reset = {};
                    for (const k_0 of searchParams.keys()){
                        if (![
                            "tab"
                        ].includes(k_0)) {
                            reset[k_0] = "";
                        }
                    }
                    setParams(reset);
                }
            }["FilterBar[<button>.onClick]"],
            className: "inline-flex h-9 items-center gap-1 self-start rounded-lg px-2.5 text-[13px] font-medium text-ink-muted hover:bg-neutral-bg hover:text-ink lg:self-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "size-3.5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/filter-bar.jsx",
                    lineNumber: 463,
                    columnNumber: 202
                }, this),
                " Clear filters"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 453,
            columnNumber: 20
        }, this);
        $[13] = active;
        $[14] = searchParams;
        $[15] = setParams;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== children || $[18] !== t3 || $[19] !== t4 || $[20] !== t6 || $[21] !== t7 || $[22] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: [
                t4,
                t6,
                t7,
                children,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/data-table/filter-bar.jsx",
            lineNumber: 473,
            columnNumber: 10
        }, this);
        $[17] = children;
        $[18] = t3;
        $[19] = t4;
        $[20] = t6;
        $[21] = t7;
        $[22] = t8;
        $[23] = t9;
    } else {
        t9 = $[23];
    }
    return t9;
}
_s3(FilterBar, "UCY7ZFa2ChpPHRdWrANb3/P2/Es=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"]
    ];
});
_c3 = FilterBar;
function _FilterBarFiltersMap(f) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectFilter, {
        name: f.key,
        label: f.label,
        options: f.options
    }, f.key, false, {
        fileName: "[project]/src/components/data-table/filter-bar.jsx",
        lineNumber: 487,
        columnNumber: 10
    }, this);
}
function _FilterBarAnonymous(k) {
    return ![
        "page",
        "pageSize",
        "sort",
        "tab"
    ].includes(k);
}
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SearchInput");
__turbopack_context__.k.register(_c1, "DateRangeFilter");
__turbopack_context__.k.register(_c2, "SelectFilter");
__turbopack_context__.k.register(_c3, "FilterBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/data-table/data-table.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/shell/route-progress.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/columns-3.js [app-client] (ecmascript) <export default as Columns3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/states.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/popover.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/cells.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$filter$2d$bar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/filter-bar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/use-query-state.js [app-client] (ecmascript)");
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
    const body = rows.map((row)=>columns.map((c)=>escape(c.type === "status" || c.type === "mono" || !c.type ? row[c.key] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCellValue"])(c, row))).join(","));
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
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { notify } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { get, setParams, pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"])();
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [picks, setPicks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DataTable.useState": ()=>columns.filter({
                "DataTable.useState": (c)=>c.hidden
            }["DataTable.useState"]).map({
                "DataTable.useState": (c_0)=>c_0.key
            }["DataTable.useState"])
    }["DataTable.useState"]);
    const [confirm, setConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [running, startRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [exporting, setExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const visible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DataTable.useMemo[visible]": ()=>columns.filter({
                "DataTable.useMemo[visible]": (c_1)=>!hidden.includes(c_1.key)
            }["DataTable.useMemo[visible]"])
    }["DataTable.useMemo[visible]"], [
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
        const line_0 = picks[row[rowKey]];
        if (!line_0) return row;
        return {
            ...row,
            trackingId: line_0.trackingId || "",
            trackingUrl: line_0.trackingUrl || "",
            productName: line_0.productName || row.productName,
            invoiceNumber: line_0.invoiceNumber || "",
            status: line_0.status || row.status
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
    const trigger = (action_0, ids_0)=>{
        if (action_0.href) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$shell$2f$route$2d$progress$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRouteProgress"])();
            return router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveHref"])(action_0.href, rows.find((r_0)=>r_0[rowKey] === ids_0[0]) || {}));
        }
        if ((action_0.kind === "form" || action_0.assign) && onCustomAction) {
            return onCustomAction(action_0, ids_0, rows.filter((r_1)=>ids_0.includes(r_1[rowKey])), ()=>setSelected([]));
        }
        if (action_0.confirm) setConfirm({
            action: action_0,
            ids: ids_0
        });
        else runAction(action_0, ids_0);
    };
    const exportCsv = async ()=>{
        setExporting(true);
        try {
            if (onExport) {
                const result_0 = await onExport(Object.fromEntries(new URLSearchParams(window.location.search)));
                if (!result_0?.ok) throw new Error(result_0?.message);
                download(`${exportName || id}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(columns, result_0.rows));
                notify({
                    message: `Exported ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(result_0.rows.length)} rows.`
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
    const sortable = visible.filter((c_2)=>c_2.sortable);
    const sortOptions = sortable.flatMap((c_3)=>[
            {
                value: `${c_3.key}:desc`,
                label: `${c_3.label} ↓`
            },
            {
                value: `${c_3.key}:asc`,
                label: `${c_3.label} ↑`
            }
        ]);
    const actionsMenu = (key, actions)=>actions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
            label: `Actions for ${key}`,
            panelClassName: "w-52",
            trigger: ({ toggle, props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon-sm",
                    onClick: toggle,
                    ...props,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/data-table/data-table.jsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "py-1",
                children: actions.map((action_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-close": true,
                            onClick: ()=>trigger(action_1, [
                                    key
                                ]),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full px-3.5 py-2 text-left text-sm hover:bg-surface-muted", action_1.tone === "danger" ? "text-danger-ink" : "text-ink"),
                            children: action_1.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 190,
                            columnNumber: 15
                        }, this)
                    }, action_1.id, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 189,
                        columnNumber: 36
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 188,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/data-table/data-table.jsx",
            lineNumber: 182,
            columnNumber: 63
        }, this);
    const from = data.total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
    const to = Math.min(data.total, data.page * data.pageSize);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 rounded-xl border border-line bg-surface shadow-sm",
        children: [
            (search || filters.length > 0 || dateRange || toolbar || onExport !== undefined) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 border-b border-line p-3 xl:flex-row xl:items-start xl:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$filter$2d$bar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilterBar"], {
                        search: search,
                        filters: filters,
                        dateRange: dateRange,
                        className: "min-w-0 flex-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 flex-wrap items-center gap-2",
                        children: [
                            toolbar,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$popover$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
                                label: "Choose columns",
                                panelClassName: "w-56",
                                trigger: ({ toggle: toggle_0, props: props_0 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        onClick: toggle_0,
                                        ...props_0,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$columns$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Columns3$3e$__["Columns3"], {
                                                className: "size-4",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 207,
                                                columnNumber: 19
                                            }, void 0),
                                            " Columns"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, void 0),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-h-72 space-y-1.5 overflow-y-auto p-3",
                                    children: columns.map((c_4)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            label: c_4.label,
                                            checked: !hidden.includes(c_4.key),
                                            onChange: (e)=>setHidden((h)=>e.target.checked ? h.filter((k)=>k !== c_4.key) : [
                                                        ...h,
                                                        c_4.key
                                                    ]),
                                            className: "flex"
                                        }, c_4.key, false, {
                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                            lineNumber: 210,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            onExport !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                onClick: exportCsv,
                                loading: exporting,
                                children: [
                                    !exporting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "size-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 214,
                                        columnNumber: 32
                                    }, this),
                                    " Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 213,
                                columnNumber: 40
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 199,
                columnNumber: 92
            }, this),
            summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-line bg-surface-muted px-3 py-2 text-xs text-ink-soft",
                children: summary
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 219,
                columnNumber: 19
            }, this),
            showSelection && selected.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2 border-b border-line bg-brand-50 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[13px] font-medium text-brand-800",
                        children: [
                            selected.length,
                            " selected"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this),
                    bulkActions.map((action_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "xs",
                            variant: action_2.tone === "danger" ? "danger-outline" : "secondary",
                            onClick: ()=>trigger(action_2, selected),
                            disabled: running,
                            children: action_2.label
                        }, action_2.id, false, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 223,
                            columnNumber: 40
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        size: "xs",
                        variant: "ghost",
                        onClick: ()=>setSelected([]),
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 221,
                columnNumber: 48
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    pending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 z-10 flex justify-center pt-10",
                        "aria-live": "polite",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "size-3.5 animate-spin",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 234,
                                    columnNumber: 15
                                }, this),
                                " Loading…"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 232,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hidden max-h-[70vh] overflow-auto scrollbar-thin md:block", pending && "opacity-55"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full min-w-max border-separate border-spacing-0 text-left text-[13px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                scope: "col",
                                                className: "sticky top-0 z-10 w-10 border-b border-line bg-surface-muted px-3 py-2.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                    "aria-label": "Select all rows on this page",
                                                    checked: allChecked,
                                                    onChange: (e_0)=>setSelected(e_0.target.checked ? [
                                                            ...new Set([
                                                                ...selected,
                                                                ...pageIds
                                                            ])
                                                        ] : selected.filter((sid_0)=>!pageIds.includes(sid_0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 242,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 241,
                                                columnNumber: 35
                                            }, this),
                                            visible.map((column_0, index)=>{
                                                const active = sortField === column_0.key;
                                                const SortIcon = !active ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"] : sortDir === "asc" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    scope: "col",
                                                    "aria-sort": active ? sortDir === "asc" ? "ascending" : "descending" : undefined,
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("sticky top-0 z-10 border-b border-line bg-surface-muted px-3 py-2.5 text-xs font-semibold whitespace-nowrap text-ink-muted", index === 0 && "left-0 z-20", [
                                                        "currency",
                                                        "number",
                                                        "percent"
                                                    ].includes(column_0.type) && "text-right", column_0.align === "right" && "text-right"),
                                                    style: column_0.width ? {
                                                        width: column_0.width,
                                                        maxWidth: column_0.width
                                                    } : undefined,
                                                    children: column_0.sortable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>sortBy(column_0),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-1 hover:text-ink", active && "text-ink"),
                                                        children: [
                                                            column_0.label,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                                className: "size-3.5",
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 253,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 251,
                                                        columnNumber: 44
                                                    }, this) : column_0.label
                                                }, column_0.key, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 247,
                                                    columnNumber: 24
                                                }, this);
                                            }),
                                            hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                scope: "col",
                                                className: "sticky top-0 z-10 w-12 border-b border-line bg-surface-muted px-3 py-2.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "Actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 258,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 257,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: rows.map((row_0)=>{
                                        const key_0 = row_0[rowKey];
                                        const view = viewOf(row_0);
                                        const href = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveHref"])(rowHref, row_0);
                                        const actions_0 = rowActions.filter((a)=>matchesWhen(a, row_0));
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b border-line last:border-0 hover:bg-surface-muted", selected.includes(key_0) && "bg-brand-50/60"),
                                            children: [
                                                showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-line px-3 py-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                        "aria-label": `Select ${key_0}`,
                                                        checked: selected.includes(key_0),
                                                        onChange: (e_1)=>setSelected((s)=>e_1.target.checked ? [
                                                                    ...s,
                                                                    key_0
                                                                ] : s.filter((x)=>x !== key_0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 270,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 269,
                                                    columnNumber: 39
                                                }, this),
                                                visible.map((column_1, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b border-line bg-surface px-3 align-middle text-ink-soft", dense ? "py-2" : "py-3", ci === 0 && "sticky left-0 z-[1]", [
                                                            "currency",
                                                            "number",
                                                            "percent"
                                                        ].includes(column_1.type) && "text-right tabular", column_1.align === "right" && "text-right"),
                                                        style: {
                                                            maxWidth: column_1.width || 320
                                                        },
                                                        children: ci === 0 && href && !column_1.href && column_1.type !== "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: href,
                                                            className: "block truncate font-medium text-brand-700 hover:underline",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCellValue"])(column_1, view),
                                                                column_1.sub && view[column_1.sub] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block truncate text-xs font-normal text-ink-muted",
                                                                    children: view[column_1.sub]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 277,
                                                                    columnNumber: 68
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 275,
                                                            columnNumber: 92
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                            column: column_1,
                                                            row: view,
                                                            activeLineId: picks[key_0]?.id,
                                                            onPickLine: pickLine
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 278,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, column_1.key, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 272,
                                                        columnNumber: 52
                                                    }, this)),
                                                hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-b border-line px-3 py-2 text-right",
                                                    children: actionsMenu(key_0, actions_0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                    lineNumber: 280,
                                                    columnNumber: 39
                                                }, this)
                                            ]
                                        }, key_0, true, {
                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                            lineNumber: 268,
                                            columnNumber: 22
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/data-table/data-table.jsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("md:hidden", pending && "opacity-55"),
                        children: [
                            (showSelection || sortOptions.length > 0) && rows.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 border-b border-line bg-surface-muted px-3 py-2",
                                children: [
                                    showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                        label: "Select all",
                                        checked: allChecked,
                                        onChange: (e_2)=>setSelected(e_2.target.checked ? [
                                                ...new Set([
                                                    ...selected,
                                                    ...pageIds
                                                ])
                                            ] : selected.filter((sid_1)=>!pageIds.includes(sid_1)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 289,
                                        columnNumber: 33
                                    }, this),
                                    sortOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        "aria-label": "Sort by",
                                        className: "ml-auto w-auto max-w-[60%]",
                                        value: sortField && sortDir ? `${sortField}:${sortDir}` : "",
                                        options: sortOptions,
                                        placeholder: "Sort: default",
                                        onChange: (e_3)=>setParams({
                                                sort: e_3.target.value
                                            }, {
                                                resetPage: false
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 290,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 288,
                                columnNumber: 76
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "divide-y divide-line",
                                children: rows.map((row_1)=>{
                                    const key_1 = row_1[rowKey];
                                    const view_0 = viewOf(row_1);
                                    const href_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveHref"])(rowHref, row_1);
                                    const actions_1 = rowActions.filter((a_0)=>matchesWhen(a_0, row_1));
                                    const [lead, ...rest] = visible;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-3 py-3", selected.includes(key_1) && "bg-brand-50/60"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2.5",
                                                children: [
                                                    showSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                        className: "mt-0.5",
                                                        "aria-label": `Select ${key_1}`,
                                                        checked: selected.includes(key_1),
                                                        onChange: (e_4)=>setSelected((s_0)=>e_4.target.checked ? [
                                                                    ...s_0,
                                                                    key_1
                                                                ] : s_0.filter((x_0)=>x_0 !== key_1))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 305,
                                                        columnNumber: 39
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0 flex-1 text-sm",
                                                        children: lead && (href_0 && !lead.href && lead.type !== "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: href_0,
                                                            className: "block font-medium break-words text-brand-700 hover:underline",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCellValue"])(lead, view_0),
                                                                lead.sub && view_0[lead.sub] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block text-xs font-normal text-ink-muted",
                                                                    children: view_0[lead.sub]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 307,
                                                            columnNumber: 81
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-ink",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                column: lead,
                                                                row: view_0,
                                                                activeLineId: picks[key_1]?.id,
                                                                onPickLine: pickLine
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 311,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/data-table/data-table.jsx",
                                                            lineNumber: 310,
                                                            columnNumber: 37
                                                        }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 306,
                                                        columnNumber: 21
                                                    }, this),
                                                    hasRowActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "-mt-1 -mr-1 shrink-0",
                                                        children: actionsMenu(key_1, actions_1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 314,
                                                        columnNumber: 39
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 304,
                                                columnNumber: 19
                                            }, this),
                                            rest.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]", showSelection && "pl-7"),
                                                children: rest.map((column_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-0", column_2.wrap && "col-span-2"),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                                className: "text-[11px] font-medium tracking-wide text-ink-muted uppercase",
                                                                children: column_2.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 318,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                                className: "mt-0.5 min-w-0 break-words text-ink-soft [&_.truncate]:whitespace-normal",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$cells$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                    column: column_2,
                                                                    row: view_0,
                                                                    activeLineId: picks[key_1]?.id,
                                                                    onPickLine: pickLine
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                    lineNumber: 320,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                                lineNumber: 319,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, column_2.key, true, {
                                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                                        lineNumber: 317,
                                                        columnNumber: 45
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                                lineNumber: 316,
                                                columnNumber: 39
                                            }, this)
                                        ]
                                    }, key_1, true, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 303,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this),
                    rows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$states$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
                        title: emptyTitle,
                        description: emptyDescription
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 328,
                        columnNumber: 31
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 border-t border-line px-3 py-2.5 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "tabular",
                        children: data.total === 0 ? "No results" : `Showing ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(from)}–${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(to)} of ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNumber"])(data.total)}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "hidden items-center gap-2 sm:flex",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Rows"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        "aria-label": "Rows per page",
                                        className: "w-20",
                                        value: String(data.pageSize),
                                        options: pageSizes.map(String),
                                        onChange: (e_5)=>setParams({
                                                pageSize: e_5.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/data-table/data-table.jsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "icon-sm",
                                onClick: ()=>setParams({
                                        page: data.page - 1
                                    }, {
                                        resetPage: false
                                    }),
                                disabled: data.page <= 1 || pending,
                                "aria-label": "Previous page",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "min-w-20 text-center tabular",
                                children: [
                                    "Page ",
                                    data.page,
                                    " / ",
                                    data.pageCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "icon-sm",
                                onClick: ()=>setParams({
                                        page: data.page + 1
                                    }, {
                                        resetPage: false
                                    }),
                                disabled: data.page >= data.pageCount || pending,
                                "aria-label": "Next page",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/data-table/data-table.jsx",
                                    lineNumber: 357,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/data-table/data-table.jsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/data-table/data-table.jsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: Boolean(confirm),
                onClose: ()=>setConfirm(null),
                onConfirm: (reason_0)=>runAction(confirm?.action, confirm?.ids, reason_0),
                title: confirm?.action.confirm?.title || confirm?.action.label,
                description: confirm ? (confirm.action.confirm?.description || "").replace("{count}", String(confirm.ids.length)) : "",
                confirmLabel: confirm?.action.confirm?.confirmLabel || confirm?.action.label,
                tone: confirm?.action.tone === "danger" ? "danger" : "warning",
                requireReason: confirm?.action.confirm?.requireReason,
                reasonOptions: confirm?.action.confirm?.reasonOptions,
                loading: running
            }, void 0, false, {
                fileName: "[project]/src/components/data-table/data-table.jsx",
                lineNumber: 362,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/data-table/data-table.jsx",
        lineNumber: 198,
        columnNumber: 10
    }, this);
}
_s(DataTable, "G4dZcc9NPjElh04yZt611hgR71c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$use$2d$query$2d$state$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = DataTable;
var _c;
__turbopack_context__.k.register(_c, "DataTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/admin/data:f8f48b [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"7cad3989db32f5192c1e8820c765efb8e468c33851":"resourceActionAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceActionAction",
    ()=>resourceActionAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var resourceActionAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("7cad3989db32f5192c1e8820c765efb8e468c33851", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceActionAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiZ1RBcUJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/admin/data:bf1ff0 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60a4533fe49135e174d981ba6cedbc7f8cfe11a44d":"resourceExportAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceExportAction",
    ()=>resourceExportAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var resourceExportAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60a4533fe49135e174d981ba6cedbc7f8cfe11a44d", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceExportAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiZ1RBOEJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/admin/data:951541 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"78e08031f1f9ecdc54b14c9e27902fa61444ff4069":"resourceSaveAction"},"src/lib/actions/admin/resources.js",""] */ __turbopack_context__.s([
    "resourceSaveAction",
    ()=>resourceSaveAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var resourceSaveAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("78e08031f1f9ecdc54b14c9e27902fa61444ff4069", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "resourceSaveAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcmVzb3VyY2VzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tIFwiQC9saWIvY29udGVudC9hZG1pbi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHsgZ2V0Q3VycmVudEFkbWluIH0gZnJvbSBcIkAvbGliL2F1dGgvc2Vzc2lvblwiO1xyXG5pbXBvcnQgeyBleHBvcnRSZXNvdXJjZSwgcnVuUmVzb3VyY2VBY3Rpb24sIHNhdmVSZXNvdXJjZVJlY29yZCB9IGZyb20gXCJAL2xpYi9zZXJ2aWNlcy9hZG1pbi9yZXNvdXJjZXNcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuXHJcbmZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIGdldFJlc291cmNlKGtleSkgPyBrZXkgOiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMpIHtcclxuICBpZiAoIXBhcmFtcyB8fCB0eXBlb2YgcGFyYW1zICE9PSBcIm9iamVjdFwiKSByZXR1cm4ge307XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocGFyYW1zKSkge1xyXG4gICAgaWYgKHR5cGVvZiBrID09PSBcInN0cmluZ1wiICYmIGsubGVuZ3RoIDw9IDQwICYmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpIG91dFtrXSA9IFN0cmluZyh2KS5zbGljZSgwLCAxMjApO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VBY3Rpb25BY3Rpb24oa2V5LCBhY3Rpb25JZCwgaWRzLCByZWFzb24sIHZhbHVlKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkgfHwgdHlwZW9mIGFjdGlvbklkICE9PSBcInN0cmluZ1wiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgaWRMaXN0ID0gQXJyYXkuaXNBcnJheShpZHMpID8gaWRzLmZpbHRlcigoaWQpID0+IHR5cGVvZiBpZCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpIDogW107XHJcbiAgcmV0dXJuIHJ1blJlc291cmNlQWN0aW9uKHJlc291cmNlS2V5LCBhY3Rpb25JZCwgaWRMaXN0LCB1c2VyLCB0eXBlb2YgcmVhc29uID09PSBcInN0cmluZ1wiID8gcmVhc29uIDogXCJcIiwgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdmFsdWUgOiBcIlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc291cmNlRXhwb3J0QWN0aW9uKGtleSwgcGFyYW1zKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgcmVzb3VyY2VLZXkgPSBjbGVhbktleShrZXkpO1xyXG4gIGlmICghcmVzb3VyY2VLZXkpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJJbnZhbGlkIHJlcXVlc3QuXCIgfTtcclxuICByZXR1cm4gZXhwb3J0UmVzb3VyY2UocmVzb3VyY2VLZXksIGNsZWFuUGFyYW1zKHBhcmFtcyksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVzb3VyY2VTYXZlQWN0aW9uKGtleSwgaWQsIGlucHV0LCByZWFzb24pIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCByZXNvdXJjZUtleSA9IGNsZWFuS2V5KGtleSk7XHJcbiAgaWYgKCFyZXNvdXJjZUtleSB8fCAhaW5wdXQgfHwgdHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiSW52YWxpZCByZXF1ZXN0LlwiIH07XHJcbiAgY29uc3QgcmVjb3JkSWQgPSB0eXBlb2YgaWQgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGlkID09PSBcIm51bWJlclwiID8gaWQgOiBudWxsO1xyXG4gIHJldHVybiBzYXZlUmVzb3VyY2VSZWNvcmQocmVzb3VyY2VLZXksIHJlY29yZElkLCBpbnB1dCwgdXNlciwgdHlwZW9mIHJlYXNvbiA9PT0gXCJzdHJpbmdcIiA/IHJlYXNvbiA6IFwiXCIpO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOFNBc0NzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/actions/admin/data:a6d49c [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40cf0200efaf3e9e090c0b87a402115b45d86827ee":"syncVisibleOrdersAction"},"src/lib/actions/admin/shipping.js",""] */ __turbopack_context__.s([
    "syncVisibleOrdersAction",
    ()=>syncVisibleOrdersAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var syncVisibleOrdersAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40cf0200efaf3e9e090c0b87a402115b45d86827ee", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "syncVisibleOrdersAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vc2hpcHBpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCI7XHJcblxyXG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCI7XHJcbmltcG9ydCB7IGdldEN1cnJlbnRBZG1pbiB9IGZyb20gXCJAL2xpYi9hdXRoL3Nlc3Npb25cIjtcclxuaW1wb3J0IHtcclxuICBhdmFpbGFibGVDb3VyaWVycyxcclxuICBidWxrQ291cmllcnMsXHJcbiAgYnVsa0NyZWF0ZSxcclxuICBjYW5jZWxTaGlwbWVudHMsXHJcbiAgY3JlYXRlU2hpcG1lbnQsXHJcbiAgbWFya0NhbmNlbGxlZCxcclxuICBvcGVuTGFiZWwsXHJcbiAgcmVnZW5lcmF0ZUxhYmVsLFxyXG4gIHNoaXByb2NrZXREb2N1bWVudCxcclxuICBzeW5jU3RhdHVzLFxyXG4gIHVwZGF0ZVNoaXByb2NrZXRPcmRlcixcclxuICBjYW5jZWxTaGlwcm9ja2V0T3JkZXJzLFxyXG4gIGNhbmNlbFNoaXByb2NrZXRTaGlwbWVudHMsXHJcbiAgc2hpcHJvY2tldE9yZGVyRGV0YWlscyxcclxuICBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnQsXHJcbiAgdHJhY2tTaGlwcm9ja2V0QXdicyxcclxuICB0cmFja1NoaXByb2NrZXRTaGlwbWVudCxcclxufSBmcm9tIFwiQC9saWIvc2VydmljZXMvYWRtaW4vc2hpcHBpbmdcIjtcclxuXHJcbmNvbnN0IGV4cGlyZWQgPSB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJZb3VyIHNlc3Npb24gaGFzIGV4cGlyZWQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uXCIgfTtcclxuY29uc3QgaW52YWxpZCA9IHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIkludmFsaWQgcmVxdWVzdC5cIiB9O1xyXG5jb25zdCBDT01QQU5JRVMgPSBuZXcgU2V0KFtcIm5pbWJ1c1wiLCBcInNoaXByb2NrZXRcIiwgXCJkZWxoaXZlcnlcIl0pO1xyXG5jb25zdCBET0NTID0gbmV3IFNldChbXCJtYW5pZmVzdFwiLCBcInBpY2t1cFwiLCBcImludm9pY2VcIl0pO1xyXG5cclxuY29uc3Qgc3RyID0gKHYsIG1heCA9IDEwMCkgPT4gKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB2ID09PSBcIm51bWJlclwiID8gU3RyaW5nKHYpLnRyaW0oKS5zbGljZSgwLCBtYXgpIDogXCJcIik7XHJcbmNvbnN0IGlkcyA9IChsaXN0LCBtYXgpID0+IChBcnJheS5pc0FycmF5KGxpc3QpID8gWy4uLm5ldyBTZXQobGlzdC5tYXAoKHYpID0+IHN0cih2KSkuZmlsdGVyKEJvb2xlYW4pKV0uc2xpY2UoMCwgbWF4KSA6IFtdKTtcclxuY29uc3QgY291cmllcnMgPSAobWFwKSA9PiB7XHJcbiAgY29uc3Qgb3V0ID0ge307XHJcbiAgaWYgKG1hcCAmJiB0eXBlb2YgbWFwID09PSBcIm9iamVjdFwiKSBmb3IgKGNvbnN0IFt2ZW5kb3JJZCwgY291cmllcl0gb2YgT2JqZWN0LmVudHJpZXMobWFwKSkgaWYgKGNvdXJpZXIgJiYgdHlwZW9mIGNvdXJpZXIgPT09IFwib2JqZWN0XCIpIG91dFtzdHIodmVuZG9ySWQpXSA9IGNvdXJpZXI7XHJcbiAgcmV0dXJuIG91dDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJlZnJlc2gob3JkZXJJZHMgPSBbXSkge1xyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2FkbWluL3NoaXBwaW5nXCIpO1xyXG4gIGZvciAoY29uc3QgaWQgb2Ygb3JkZXJJZHMpIHJldmFsaWRhdGVQYXRoKGAvYWRtaW4vb3JkZXJzLyR7aWR9YCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhdmFpbGFibGVDb3VyaWVyc0FjdGlvbihvcmRlcklkLCBjb21wYW55KSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgaWYgKCFzdHIob3JkZXJJZCkgfHwgIUNPTVBBTklFUy5oYXMoY29tcGFueSkpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBhdmFpbGFibGVDb3VyaWVycyhzdHIob3JkZXJJZCksIGNvbXBhbnksIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2hpcG1lbnRBY3Rpb24ob3JkZXJJZCwgaW5wdXQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBpZCA9IHN0cihvcmRlcklkKTtcclxuICBpZiAoIWlkIHx8ICFpbnB1dCB8fCAhQ09NUEFOSUVTLmhhcyhpbnB1dC5jb21wYW55KSkgcmV0dXJuIGludmFsaWQ7XHJcbiAgY29uc3QgcGlja3VwRGF0ZSA9IC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLy50ZXN0KGlucHV0LnBpY2t1cERhdGUgPz8gXCJcIikgPyBpbnB1dC5waWNrdXBEYXRlIDogdW5kZWZpbmVkO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNyZWF0ZVNoaXBtZW50KGlkLCB7IGNvbXBhbnk6IGlucHV0LmNvbXBhbnksIHNlbGVjdGVkQ291cmllcnM6IGNvdXJpZXJzKGlucHV0LnNlbGVjdGVkQ291cmllcnMpLCBleGNsdWRlZFZlbmRvcnM6IGlkcyhpbnB1dC5leGNsdWRlZFZlbmRvcnMsIDUwKSwgLi4uKHBpY2t1cERhdGUgPyB7IHBpY2t1cERhdGUgfSA6IHt9KSB9LCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtpZF0pO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTaGlwcm9ja2V0T3JkZXJBY3Rpb24ob3JkZXJJZCkge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGlmICghc3RyKG9yZGVySWQpKSByZXR1cm4gaW52YWxpZDtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCB1cGRhdGVTaGlwcm9ja2V0T3JkZXIoc3RyKG9yZGVySWQpLCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtzdHIob3JkZXJJZCldKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVsa0NvdXJpZXJzQWN0aW9uKG9yZGVySWRzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhvcmRlcklkcywgNTApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIG9yZGVyLlwiIH07XHJcbiAgcmV0dXJuIGJ1bGtDb3VyaWVycyhsaXN0LCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1bGtDcmVhdGVBY3Rpb24ob3JkZXJzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IEFycmF5LmlzQXJyYXkob3JkZXJzKSA/IG9yZGVycy5zbGljZSgwLCA1MCkubWFwKChvKSA9PiAoeyBvcmRlcklkOiBzdHIobz8ub3JkZXJJZCksIHNlbGVjdGVkQ291cmllcnM6IGNvdXJpZXJzKG8/LnNlbGVjdGVkQ291cmllcnMpIH0pKS5maWx0ZXIoKG8pID0+IG8ub3JkZXJJZCkgOiBbXTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiU2VsZWN0IGF0IGxlYXN0IG9uZSBvcmRlci5cIiB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGJ1bGtDcmVhdGUobGlzdCwgdXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaChsaXN0Lm1hcCgobykgPT4gby5vcmRlcklkKSk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5MYWJlbEFjdGlvbihvcmRlcklkLCB2ZW5kb3JJZCkge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGlmICghc3RyKG9yZGVySWQpKSByZXR1cm4gaW52YWxpZDtcclxuICByZXR1cm4gb3BlbkxhYmVsKHN0cihvcmRlcklkKSwgc3RyKHZlbmRvcklkKSB8fCB1bmRlZmluZWQsIHVzZXIpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVnZW5lcmF0ZUxhYmVsQWN0aW9uKG9yZGVySWQsIGF3YiwgdmVuZG9ySWQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBpZiAoIXN0cihvcmRlcklkKSB8fCAhc3RyKGF3YikpIHJldHVybiBpbnZhbGlkO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlZ2VuZXJhdGVMYWJlbChzdHIob3JkZXJJZCksIHN0cihhd2IpLCBzdHIodmVuZG9ySWQpLCB1c2VyKTtcclxuICBpZiAocmVzdWx0Lm9rKSByZWZyZXNoKFtzdHIob3JkZXJJZCldKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hpcHJvY2tldERvY3VtZW50QWN0aW9uKG9yZGVySWQsIHZlbmRvcklkLCBkb2MpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBpZiAoIXN0cihvcmRlcklkKSB8fCAhc3RyKHZlbmRvcklkKSB8fCAhRE9DUy5oYXMoZG9jKSkgcmV0dXJuIGludmFsaWQ7XHJcbiAgcmV0dXJuIHNoaXByb2NrZXREb2N1bWVudChzdHIob3JkZXJJZCksIHN0cih2ZW5kb3JJZCksIGRvYywgdXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYW5jZWxTaGlwbWVudHNBY3Rpb24oYXdicywgb3JkZXJJZHMpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gaWRzKGF3YnMsIDIwMDApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIHNoaXBtZW50IHdpdGggYW4gQVdCLlwiIH07XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2FuY2VsU2hpcG1lbnRzKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goaWRzKG9yZGVySWRzLCAyMDApKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFya0NhbmNlbGxlZEFjdGlvbihhd2JzLCBvcmRlcklkcykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMoYXdicywgMjAwMCk7XHJcbiAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIlNlbGVjdCBhdCBsZWFzdCBvbmUgc2hpcG1lbnQgd2l0aCBhbiBBV0IuXCIgfTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBtYXJrQ2FuY2VsbGVkKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goaWRzKG9yZGVySWRzLCAyMDApKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKiBTaGlwcm9ja2V0IG9yZGVycyByZXBvcnQgKHNoaXByb2NrZXRfb3JkZXJzX3JlcG9ydC5waHApLiBJZHMgYXJlIFNoaXByb2NrZXQncyBvd24gb3JkZXIgLyBzaGlwbWVudCBpZHMuICovXHJcblxyXG5jb25zdCBTUl9ET0NTID0gbmV3IFNldChbXCJsYWJlbFwiLCBcIm1hbmlmZXN0XCIsIFwiaW52b2ljZVwiXSk7XHJcbmNvbnN0IHNySWRzID0gKGxpc3QsIG1heCkgPT4gaWRzKGxpc3QsIG1heCkuZmlsdGVyKCh2KSA9PiAvXlxcZHsxLDIwfSQvLnRlc3QodikpO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoaXByb2NrZXRPcmRlckFjdGlvbihzck9yZGVySWQpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBbaWRdID0gc3JJZHMoW3NyT3JkZXJJZF0sIDEpO1xyXG4gIGlmICghaWQpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBzaGlwcm9ja2V0T3JkZXJEZXRhaWxzKGlkLCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYWNrU2hpcHJvY2tldEFjdGlvbihzaGlwbWVudElkKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgW2lkXSA9IHNySWRzKFtzaGlwbWVudElkXSwgMSk7XHJcbiAgaWYgKCFpZCkgcmV0dXJuIGludmFsaWQ7XHJcbiAgcmV0dXJuIHRyYWNrU2hpcHJvY2tldFNoaXBtZW50KGlkLCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYWNrU2hpcHJvY2tldEF3YnNBY3Rpb24oYXdicykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMoYXdicywgNTEpO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJObyBzaGlwbWVudHMgd2l0aCBBV0IgY29kZXMgc2VsZWN0ZWQuIFBsZWFzZSBzZWxlY3Qgc2hpcG1lbnRzIHRoYXQgaGF2ZSBBV0IgY29kZXMuXCIgfTtcclxuICBpZiAobGlzdC5sZW5ndGggPiA1MCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIk1heGltdW0gNTAgc2hpcG1lbnRzIHdpdGggQVdCIGNvZGVzIGNhbiBiZSB0cmFja2VkIGF0IG9uY2UuIFBsZWFzZSBzZWxlY3QgNTAgb3IgZmV3ZXIgc2hpcG1lbnRzLlwiIH07XHJcbiAgcmV0dXJuIHRyYWNrU2hpcHJvY2tldEF3YnMobGlzdCwgdXNlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnRBY3Rpb24oZG9jLCBpZExpc3QpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gc3JJZHMoaWRMaXN0LCAyMDApO1xyXG4gIGlmICghU1JfRE9DUy5oYXMoZG9jKSB8fCAhbGlzdC5sZW5ndGgpIHJldHVybiBpbnZhbGlkO1xyXG4gIHJldHVybiBzaGlwcm9ja2V0UmVwb3J0RG9jdW1lbnQoZG9jLCBsaXN0LCB1c2VyKTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbmNlbFNoaXByb2NrZXRPcmRlcnNBY3Rpb24ob3JkZXJJZHMpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudEFkbWluKCk7XHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gZXhwaXJlZDtcclxuICBjb25zdCBsaXN0ID0gc3JJZHMob3JkZXJJZHMsIDIwMCk7XHJcbiAgaWYgKCFsaXN0Lmxlbmd0aCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBtZXNzYWdlOiBcIk5vIHZhbGlkIG9yZGVyIElEcyBmb3VuZCBpbiBzZWxlY3RlZCBzaGlwbWVudHMuXCIgfTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYW5jZWxTaGlwcm9ja2V0T3JkZXJzKGxpc3QsIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2goKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FuY2VsU2hpcHJvY2tldFNoaXBtZW50c0FjdGlvbihhd2JzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhhd2JzLCAyMDAxKTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogZmFsc2UsIG1lc3NhZ2U6IFwiTm8gdmFsaWQgQVdCIGNvZGVzIGZvdW5kIGluIHNlbGVjdGVkIHNoaXBtZW50cy5cIiB9O1xyXG4gIGlmIChsaXN0Lmxlbmd0aCA+IDIwMDApIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJNYXhpbXVtIDIwMDAgc2hpcG1lbnRzIGNhbiBiZSBjYW5jZWxsZWQgYXQgb25jZS4gUGxlYXNlIHNlbGVjdCAyMDAwIG9yIGZld2VyIHNoaXBtZW50cy5cIiB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbmNlbFNoaXByb2NrZXRTaGlwbWVudHMobGlzdCwgdXNlcik7XHJcbiAgaWYgKHJlc3VsdC5vaykgcmVmcmVzaCgpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jU3RhdHVzQWN0aW9uKG9yZGVySWRzKSB7XHJcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRBZG1pbigpO1xyXG4gIGlmICghdXNlcikgcmV0dXJuIGV4cGlyZWQ7XHJcbiAgY29uc3QgbGlzdCA9IGlkcyhvcmRlcklkcywgNTApO1xyXG4gIGlmICghbGlzdC5sZW5ndGgpIHJldHVybiB7IG9rOiBmYWxzZSwgbWVzc2FnZTogXCJTZWxlY3QgYXQgbGVhc3Qgb25lIG9yZGVyLlwiIH07XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3luY1N0YXR1cyh7IG9yZGVySWRzOiBsaXN0IH0sIHVzZXIpO1xyXG4gIGlmIChyZXN1bHQub2spIHJlZnJlc2gobGlzdCk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqIG1hbmFnZV9vcmRlcnMucGhwIHN5bmNWaXNpYmxlQ291cmllclN0YXR1c2VzOiB0aGUgb3JkZXJzIGN1cnJlbnRseSBvbiBzY3JlZW4sIGF0IG1vc3QgMjAuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzeW5jVmlzaWJsZU9yZGVyc0FjdGlvbihvcmRlcklkcykge1xyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRDdXJyZW50QWRtaW4oKTtcclxuICBpZiAoIXVzZXIpIHJldHVybiBleHBpcmVkO1xyXG4gIGNvbnN0IGxpc3QgPSBpZHMob3JkZXJJZHMsIDIwKTtcclxuICBpZiAoIWxpc3QubGVuZ3RoKSByZXR1cm4geyBvazogdHJ1ZSwgY2hhbmdlZDogMCB9O1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN5bmNTdGF0dXMoeyBvcmRlcklkczogbGlzdCB9LCB1c2VyKTtcclxuICBjb25zdCB1cGRhdGVzID0gQXJyYXkuaXNBcnJheShyZXN1bHQuZGF0YT8udXBkYXRlcykgPyByZXN1bHQuZGF0YS51cGRhdGVzIDogW107XHJcbiAgY29uc3QgbmltYnVzID0gQXJyYXkuaXNBcnJheShyZXN1bHQuZGF0YT8ubmltYnVzPy51cGRhdGVkKSA/IHJlc3VsdC5kYXRhLm5pbWJ1cy51cGRhdGVkIDogW107XHJcbiAgY29uc3QgY2hhbmdlZCA9IHVwZGF0ZXMubGVuZ3RoICsgbmltYnVzLmxlbmd0aDtcclxuICBpZiAocmVzdWx0Lm9rICYmIGNoYW5nZWQgPiAwKSB7XHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9vcmRlcnNcIik7XHJcbiAgICByZWZyZXNoKGxpc3QpO1xyXG4gIH1cclxuICByZXR1cm4geyBvazogcmVzdWx0Lm9rLCBjaGFuZ2VkLCBtZXNzYWdlOiByZXN1bHQubWVzc2FnZSB9O1xyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoia1RBd01zQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-right.js [app-client] (ecmascript) <export default as ArrowDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.js [app-client] (ecmascript)");
;
;
;
;
;
function PageHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { title, description, actions, meta, className } = t0;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== title) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-xl font-semibold tracking-tight text-ink sm:text-[22px]",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 30,
            columnNumber: 10
        }, this);
        $[3] = title;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[5] !== description) {
        t3 = description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1 max-w-3xl text-sm text-ink-muted",
            children: description
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 38,
            columnNumber: 25
        }, this);
        $[5] = description;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== meta) {
        t4 = meta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-2 flex flex-wrap items-center gap-2",
            children: meta
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 46,
            columnNumber: 18
        }, this);
        $[7] = meta;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== t2 || $[10] !== t3 || $[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-w-0",
            children: [
                t2,
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 54,
            columnNumber: 10
        }, this);
        $[9] = t2;
        $[10] = t3;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== actions) {
        t6 = actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-2",
            children: actions
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 64,
            columnNumber: 21
        }, this);
        $[13] = actions;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] !== t1 || $[16] !== t5 || $[17] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[15] = t1;
        $[16] = t5;
        $[17] = t6;
        $[18] = t7;
    } else {
        t7 = $[18];
    }
    return t7;
}
_c = PageHeader;
function StatCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { label, value, hint, delta, href, icon: Icon, tone: t1, className } = t0;
    const tone = t1 === undefined ? "brand" : t1;
    let t2;
    if ($[1] !== Icon || $[2] !== label || $[3] !== tone) {
        const toneBg = {
            brand: "bg-brand-50 text-brand-700",
            warning: "bg-warning-bg text-warning-ink",
            danger: "bg-danger-bg text-danger-ink",
            info: "bg-info-bg text-info-ink",
            neutral: "bg-neutral-bg text-neutral-ink"
        }[tone];
        let t3;
        if ($[5] !== label) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12.5px] font-medium text-ink-muted",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 112,
                columnNumber: 12
            }, this);
            $[5] = label;
            $[6] = t3;
        } else {
            t3 = $[6];
        }
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-start justify-between gap-2",
            children: [
                t3,
                Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex size-7 shrink-0 items-center justify-center rounded-lg", toneBg),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "size-4",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 118,
                        columnNumber: 171
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/page.jsx",
                    lineNumber: 118,
                    columnNumber: 79
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 118,
            columnNumber: 10
        }, this);
        $[1] = Icon;
        $[2] = label;
        $[3] = tone;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let t3;
    if ($[7] !== value) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "mt-1.5 truncate text-[22px] font-semibold tracking-tight text-ink tabular",
            children: value
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 128,
            columnNumber: 10
        }, this);
        $[7] = value;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== delta) {
        t4 = delta != null && Number.isFinite(delta) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success-ink" : "text-danger-ink"),
            children: [
                delta >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                    className: "size-3.5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/page.jsx",
                    lineNumber: 136,
                    columnNumber: 189
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__["ArrowDownRight"], {
                    className: "size-3.5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/page.jsx",
                    lineNumber: 136,
                    columnNumber: 248
                }, this),
                Math.abs(delta).toFixed(1),
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 136,
            columnNumber: 53
        }, this);
        $[9] = delta;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== hint) {
        t5 = hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "truncate text-ink-muted",
            children: hint
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 144,
            columnNumber: 18
        }, this);
        $[11] = hint;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== t4 || $[14] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 152,
            columnNumber: 10
        }, this);
        $[13] = t4;
        $[14] = t5;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    let t7;
    if ($[16] !== t2 || $[17] !== t3 || $[18] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t2,
                t3,
                t6
            ]
        }, void 0, true);
        $[16] = t2;
        $[17] = t3;
        $[18] = t6;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    const content = t7;
    const t8 = href && "transition-colors hover:border-brand-200 hover:bg-surface-muted";
    let t9;
    if ($[20] !== className || $[21] !== t8) {
        t9 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block min-w-0 rounded-xl border border-line bg-surface p-3.5", t8, className);
        $[20] = className;
        $[21] = t8;
        $[22] = t9;
    } else {
        t9 = $[22];
    }
    const classes = t9;
    let t10;
    if ($[23] !== classes || $[24] !== content || $[25] !== href) {
        t10 = href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: classes,
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 183,
            columnNumber: 18
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: classes,
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 183,
            columnNumber: 75
        }, this);
        $[23] = classes;
        $[24] = content;
        $[25] = href;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    return t10;
}
_c1 = StatCard;
function StatGrid(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { children, className } = t0;
    let t1;
    if ($[1] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4", className);
        $[1] = className;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== children || $[4] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 215,
            columnNumber: 10
        }, this);
        $[3] = children;
        $[4] = t1;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    return t2;
}
_c2 = StatGrid;
function DescriptionList(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { items, columns: t1, className } = t0;
    const columns = t1 === undefined ? 2 : t1;
    const t2 = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : columns === 1 ? "" : "sm:grid-cols-2";
    let t3;
    if ($[1] !== className || $[2] !== t2) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-x-6 gap-y-3", t2, className);
        $[1] = className;
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== items) {
        t4 = items.filter(Boolean).map(_DescriptionListAnonymous);
        $[4] = items;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] !== t3 || $[7] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
            className: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 258,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t4;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    return t5;
}
_c3 = DescriptionList;
function _DescriptionListAnonymous(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                className: "text-xs text-ink-muted",
                children: item.label
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 268,
                columnNumber: 52
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: "mt-0.5 text-sm break-words text-ink",
                children: item.value ?? "\u2014"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 268,
                columnNumber: 108
            }, this)
        ]
    }, item.label, true, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 268,
        columnNumber: 10
    }, this);
}
function Timeline(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { items } = t0;
    if (!items?.length) {
        let t1;
        if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
            t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ink-muted",
                children: "No activity yet."
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 284,
                columnNumber: 12
            }, this);
            $[1] = t1;
        } else {
            t1 = $[1];
        }
        return t1;
    }
    let t1;
    if ($[2] !== items) {
        t1 = items.map(_TimelineItemsMap);
        $[2] = items;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "relative space-y-4 border-l border-line pl-5",
            children: t1
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 301,
            columnNumber: 10
        }, this);
        $[4] = t1;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    return t2;
}
_c4 = Timeline;
function _TimelineItemsMap(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute top-1 -left-[25px] size-2.5 rounded-full ring-4 ring-surface", item.tone === "danger" ? "bg-danger" : item.tone === "warning" ? "bg-warning-ink" : "bg-brand-600"),
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 310,
                columnNumber: 49
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-medium text-ink",
                children: item.title
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 310,
                columnNumber: 264
            }, this),
            item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ink-soft",
                children: item.description
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 310,
                columnNumber: 345
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-xs text-ink-muted",
                children: item.meta
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 310,
                columnNumber: 405
            }, this)
        ]
    }, item.id, true, {
        fileName: "[project]/src/components/ui/page.jsx",
        lineNumber: 310,
        columnNumber: 10
    }, this);
}
function LinkTabs(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { tabs, active } = t0;
    let t1;
    if ($[1] !== active || $[2] !== tabs) {
        let t2;
        if ($[4] !== active) {
            t2 = ({
                "LinkTabs[tabs.map()]": (tab)=>{
                    const isActive = tab.value === active;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: tab.href,
                        scroll: false,
                        "aria-current": isActive ? "page" : undefined,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 px-3 text-sm font-medium transition-colors", isActive ? "border-brand-600 text-brand-700" : "border-transparent text-ink-muted hover:text-ink"),
                        children: [
                            tab.label,
                            tab.count != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-neutral-bg px-1.5 text-[11px] text-ink-soft tabular",
                                children: tab.count
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/page.jsx",
                                lineNumber: 331,
                                columnNumber: 364
                            }, this)
                        ]
                    }, tab.value, true, {
                        fileName: "[project]/src/components/ui/page.jsx",
                        lineNumber: 331,
                        columnNumber: 18
                    }, this);
                }
            })["LinkTabs[tabs.map()]"];
            $[4] = active;
            $[5] = t2;
        } else {
            t2 = $[5];
        }
        t1 = tabs.map(t2);
        $[1] = active;
        $[2] = tabs;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[6] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "-mx-1 mb-4 overflow-x-auto scrollbar-thin",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex min-w-max gap-1 border-b border-line px-1",
                "aria-label": "Sections",
                children: t1
            }, void 0, false, {
                fileName: "[project]/src/components/ui/page.jsx",
                lineNumber: 348,
                columnNumber: 69
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 348,
            columnNumber: 10
        }, this);
        $[6] = t1;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    return t2;
}
_c5 = LinkTabs;
function Notice(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { tone: t1, title, children, className } = t0;
    const tone = t1 === undefined ? "info" : t1;
    let t2;
    if ($[1] !== className || $[2] !== tone) {
        const toneClass = {
            info: "border-info-ink/20 bg-info-bg text-info-ink",
            warning: "border-warning-ink/20 bg-warning-bg text-warning-ink",
            danger: "border-danger-ink/20 bg-danger-bg text-danger-ink",
            success: "border-success-ink/20 bg-success-bg text-success-ink"
        }[tone];
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border px-3.5 py-2.5 text-sm", toneClass, className);
        $[1] = className;
        $[2] = tone;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const t3 = tone === "danger" ? "alert" : undefined;
    let t4;
    if ($[4] !== title) {
        t4 = title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-semibold",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 389,
            columnNumber: 19
        }, this);
        $[4] = title;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const t5 = title && "mt-0.5";
    let t6;
    if ($[6] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(t5, "opacity-95");
        $[6] = t5;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] !== children || $[9] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 406,
            columnNumber: 10
        }, this);
        $[8] = children;
        $[9] = t6;
        $[10] = t7;
    } else {
        t7 = $[10];
    }
    let t8;
    if ($[11] !== t2 || $[12] !== t3 || $[13] !== t4 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            role: t3,
            children: [
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 415,
            columnNumber: 10
        }, this);
        $[11] = t2;
        $[12] = t3;
        $[13] = t4;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    return t8;
}
_c6 = Notice;
function ProgressBar(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(29);
    if ($[0] !== "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383") {
        for(let $i = 0; $i < 29; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c50938f3b5cf344ab975902e6a070a19d8616e2b76a335714d70edaaf1abe383";
    }
    const { value, max: t1, tone: t2, className, label } = t0;
    const max = t1 === undefined ? 100 : t1;
    const tone = t2 === undefined ? "brand" : t2;
    const pct = Math.max(0, Math.min(100, value / max * 100));
    let t3;
    let t4;
    let t5;
    let t6;
    let t7;
    let t8;
    let t9;
    if ($[1] !== className || $[2] !== label || $[3] !== pct || $[4] !== tone) {
        const toneClass = {
            brand: "bg-brand-600",
            warning: "bg-warning-ink",
            danger: "bg-danger",
            info: "bg-info-ink"
        }[tone];
        if ($[12] !== className) {
            t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-2 w-full overflow-hidden rounded-full bg-neutral-bg", className);
            $[12] = className;
            $[13] = t4;
        } else {
            t4 = $[13];
        }
        t5 = "progressbar";
        if ($[14] !== pct) {
            t6 = Math.round(pct);
            $[14] = pct;
            $[15] = t6;
        } else {
            t6 = $[15];
        }
        t7 = 0;
        t8 = 100;
        t9 = label;
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("chart-grow-x h-full rounded-full", toneClass);
        $[1] = className;
        $[2] = label;
        $[3] = pct;
        $[4] = tone;
        $[5] = t3;
        $[6] = t4;
        $[7] = t5;
        $[8] = t6;
        $[9] = t7;
        $[10] = t8;
        $[11] = t9;
    } else {
        t3 = $[5];
        t4 = $[6];
        t5 = $[7];
        t6 = $[8];
        t7 = $[9];
        t8 = $[10];
        t9 = $[11];
    }
    const t10 = `${pct}%`;
    let t11;
    if ($[16] !== t10) {
        t11 = {
            width: t10
        };
        $[16] = t10;
        $[17] = t11;
    } else {
        t11 = $[17];
    }
    let t12;
    if ($[18] !== t11 || $[19] !== t3) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            style: t11
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 510,
            columnNumber: 11
        }, this);
        $[18] = t11;
        $[19] = t3;
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    let t13;
    if ($[21] !== t12 || $[22] !== t4 || $[23] !== t5 || $[24] !== t6 || $[25] !== t7 || $[26] !== t8 || $[27] !== t9) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            role: t5,
            "aria-valuenow": t6,
            "aria-valuemin": t7,
            "aria-valuemax": t8,
            "aria-label": t9,
            children: t12
        }, void 0, false, {
            fileName: "[project]/src/components/ui/page.jsx",
            lineNumber: 519,
            columnNumber: 11
        }, this);
        $[21] = t12;
        $[22] = t4;
        $[23] = t5;
        $[24] = t6;
        $[25] = t7;
        $[26] = t8;
        $[27] = t9;
        $[28] = t13;
    } else {
        t13 = $[28];
    }
    return t13;
}
_c7 = ProgressBar;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "PageHeader");
__turbopack_context__.k.register(_c1, "StatCard");
__turbopack_context__.k.register(_c2, "StatGrid");
__turbopack_context__.k.register(_c3, "DescriptionList");
__turbopack_context__.k.register(_c4, "Timeline");
__turbopack_context__.k.register(_c5, "LinkTabs");
__turbopack_context__.k.register(_c6, "Notice");
__turbopack_context__.k.register(_c7, "ProgressBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/products/product-html-editor.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductHtmlEditor",
    ()=>ProductHtmlEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
function ProductHtmlEditor(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(31);
    if ($[0] !== "29d33e8d767e9f8a663586005365401120d0b0cf75bec73a842282a7a406d940") {
        for(let $i = 0; $i < 31; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "29d33e8d767e9f8a663586005365401120d0b0cf75bec73a842282a7a406d940";
    }
    const { value, onChange } = t0;
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [html, setHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value || "");
    let t1;
    if ($[1] !== html || $[2] !== source) {
        t1 = ({
            "ProductHtmlEditor[useEffect()]": ()=>{
                if (!source && ref.current) {
                    ref.current.innerHTML = html;
                }
            }
        })["ProductHtmlEditor[useEffect()]"];
        $[1] = html;
        $[2] = source;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== source) {
        t2 = [
            source
        ];
        $[4] = source;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[6] !== onChange) {
        t3 = ({
            "ProductHtmlEditor[publish]": (next)=>{
                setHtml(next);
                onChange(next);
            }
        })["ProductHtmlEditor[publish]"];
        $[6] = onChange;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    const publish = t3;
    let command;
    let t4;
    let t5;
    let t6;
    if ($[8] !== publish) {
        command = ({
            "ProductHtmlEditor[command]": (name, arg)=>{
                ref.current?.focus();
                document.execCommand(name, false, arg);
                publish(ref.current?.innerHTML || "");
            }
        })["ProductHtmlEditor[command]"];
        t6 = "overflow-hidden rounded-lg border border-line bg-surface";
        t4 = "flex flex-wrap items-center gap-1 border-b border-line bg-surface-muted px-2 py-1.5";
        t5 = TOOLS.map({
            "ProductHtmlEditor[TOOLS.map()]": (t7)=>{
                const [name_0, label, title] = t7;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    title: title,
                    className: "rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface",
                    onMouseDown: _ProductHtmlEditorTOOLSMapButtonOnMouseDown,
                    onClick: {
                        "ProductHtmlEditor[TOOLS.map() > <button>.onClick]": ()=>command(name_0)
                    }["ProductHtmlEditor[TOOLS.map() > <button>.onClick]"],
                    children: label
                }, name_0, false, {
                    fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
                    lineNumber: 78,
                    columnNumber: 16
                }, this);
            }
        }["ProductHtmlEditor[TOOLS.map()]"]);
        $[8] = publish;
        $[9] = command;
        $[10] = t4;
        $[11] = t5;
        $[12] = t6;
    } else {
        command = $[9];
        t4 = $[10];
        t5 = $[11];
        t6 = $[12];
    }
    let t7;
    if ($[13] !== command) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            title: "Link",
            className: "rounded px-2 py-1 text-xs font-semibold text-ink hover:bg-surface",
            onMouseDown: _ProductHtmlEditorButtonOnMouseDown,
            onClick: {
                "ProductHtmlEditor[<button>.onClick]": ()=>{
                    const url = window.prompt("Link URL");
                    if (url) {
                        command("createLink", url);
                    }
                }
            }["ProductHtmlEditor[<button>.onClick]"],
            children: "Link"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 96,
            columnNumber: 10
        }, this);
        $[13] = command;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    const t8 = `ml-auto rounded px-2 py-1 text-xs font-semibold ${source ? "bg-ink text-white" : "text-ink hover:bg-surface"}`;
    let t9;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = ({
            "ProductHtmlEditor[<button>.onClick]": ()=>setSource(_ProductHtmlEditorButtonOnClickSetSource)
        })["ProductHtmlEditor[<button>.onClick]"];
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== t8) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            className: t8,
            onClick: t9,
            children: "Source"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 121,
            columnNumber: 11
        }, this);
        $[16] = t8;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] !== t10 || $[19] !== t4 || $[20] !== t5 || $[21] !== t7) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t4,
            children: [
                t5,
                t7,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 129,
            columnNumber: 11
        }, this);
        $[18] = t10;
        $[19] = t4;
        $[20] = t5;
        $[21] = t7;
        $[22] = t11;
    } else {
        t11 = $[22];
    }
    let t12;
    if ($[23] !== html || $[24] !== publish || $[25] !== source) {
        t12 = source ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
            className: "min-h-72 w-full resize-y bg-surface p-3 font-mono text-xs text-ink outline-none",
            value: html,
            onChange: {
                "ProductHtmlEditor[<textarea>.onChange]": (event_1)=>publish(event_1.target.value)
            }["ProductHtmlEditor[<textarea>.onChange]"]
        }, void 0, false, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 140,
            columnNumber: 20
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: ref,
            contentEditable: true,
            role: "textbox",
            "aria-multiline": "true",
            "aria-label": "Product full details",
            className: "min-h-72 px-3 py-2 text-sm text-ink outline-none [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1 [&_ul]:list-disc [&_ul]:pl-5",
            onInput: {
                "ProductHtmlEditor[<div>.onInput]": ()=>publish(ref.current?.innerHTML || "")
            }["ProductHtmlEditor[<div>.onInput]"]
        }, void 0, false, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 142,
            columnNumber: 55
        }, this);
        $[23] = html;
        $[24] = publish;
        $[25] = source;
        $[26] = t12;
    } else {
        t12 = $[26];
    }
    let t13;
    if ($[27] !== t11 || $[28] !== t12 || $[29] !== t6) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t6,
            children: [
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/products/product-html-editor.jsx",
            lineNumber: 154,
            columnNumber: 11
        }, this);
        $[27] = t11;
        $[28] = t12;
        $[29] = t6;
        $[30] = t13;
    } else {
        t13 = $[30];
    }
    return t13;
}
_s(ProductHtmlEditor, "/ENyJhiZ49di6+teZ6TI5p+Dv+U=");
_c = ProductHtmlEditor;
function _ProductHtmlEditorButtonOnClickSetSource(current) {
    return !current;
}
function _ProductHtmlEditorButtonOnMouseDown(event_0) {
    return event_0.preventDefault();
}
function _ProductHtmlEditorTOOLSMapButtonOnMouseDown(event) {
    return event.preventDefault();
}
var _c;
__turbopack_context__.k.register(_c, "ProductHtmlEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/validation/admin/forms.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/resource/record-form.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecordFormDrawer",
    ()=>RecordFormDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/page.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$products$2f$product$2d$html$2d$editor$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/products/product-html-editor.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validation/admin/forms.js [app-client] (ecmascript)");
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
function RecordFormDrawer(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(71);
    if ($[0] !== "82adfe214c7adead70b5fdc14afa2e8424dbdb3ada782c59a07774b0b530fa8f") {
        for(let $i = 0; $i < 71; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "82adfe214c7adead70b5fdc14afa2e8424dbdb3ada782c59a07774b0b530fa8f";
    }
    const { open, onClose, title, description, fields: allFields, record, optionSets: t1, requireReason, onSubmit } = t0;
    let t2;
    if ($[1] !== t1) {
        t2 = t1 === undefined ? {} : t1;
        $[1] = t1;
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const optionSets = t2;
    const t3 = !record;
    let t4;
    if ($[3] !== allFields || $[4] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formFieldsFor"])(allFields, t3);
        $[3] = allFields;
        $[4] = t3;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const fields = t4;
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    let t5;
    if ($[6] !== fields || $[7] !== query || $[8] !== record) {
        t5 = ({
            "RecordFormDrawer[useState()]": ()=>initialValues(fields, record, query)
        })["RecordFormDrawer[useState()]"];
        $[6] = fields;
        $[7] = query;
        $[8] = record;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t5);
    let t6;
    if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = {};
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t6);
    let t7;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {};
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t7);
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saving, startSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    let t8;
    if ($[12] !== errors) {
        t8 = ({
            "RecordFormDrawer[set]": (name, value)=>{
                setValues({
                    "RecordFormDrawer[set > setValues()]": (v)=>({
                            ...v,
                            [name]: value
                        })
                }["RecordFormDrawer[set > setValues()]"]);
                if (errors[name]) {
                    setErrors({
                        "RecordFormDrawer[set > setErrors()]": (e)=>({
                                ...e,
                                [name]: undefined
                            })
                    }["RecordFormDrawer[set > setErrors()]"]);
                }
            }
        })["RecordFormDrawer[set]"];
        $[12] = errors;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    const set = t8;
    let t9;
    if ($[14] !== errors) {
        t9 = ({
            "RecordFormDrawer[pickFile]": (field, file)=>{
                if (file && field.maxBytes && file.size > field.maxBytes) {
                    setErrors({
                        "RecordFormDrawer[pickFile > setErrors()]": (e_0)=>({
                                ...e_0,
                                [field.name]: `File must be ${Math.round(field.maxBytes / 1024 / 1024)} MB or smaller.`
                            })
                    }["RecordFormDrawer[pickFile > setErrors()]"]);
                    return;
                }
                setFiles({
                    "RecordFormDrawer[pickFile > setFiles()]": (f)=>({
                            ...f,
                            [field.name]: file || undefined
                        })
                }["RecordFormDrawer[pickFile > setFiles()]"]);
                if (errors[field.name]) {
                    setErrors({
                        "RecordFormDrawer[pickFile > setErrors()]": (e_1)=>({
                                ...e_1,
                                [field.name]: undefined
                            })
                    }["RecordFormDrawer[pickFile > setErrors()]"]);
                }
            }
        })["RecordFormDrawer[pickFile]"];
        $[14] = errors;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    const pickFile = t9;
    let t10;
    if ($[16] !== fields || $[17] !== files || $[18] !== values) {
        t10 = ({
            "RecordFormDrawer[payload]": ()=>{
                if (!fields.some(_RecordFormDrawerPayloadFieldsSome)) {
                    return values;
                }
                const body = new FormData();
                body.set("__values", JSON.stringify(values));
                for (const [name_0, file_0] of Object.entries(files)){
                    if (file_0) {
                        body.set(name_0, file_0, file_0.name);
                    }
                }
                return body;
            }
        })["RecordFormDrawer[payload]"];
        $[16] = fields;
        $[17] = files;
        $[18] = values;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    const payload = t10;
    let t11;
    if ($[20] !== fields || $[21] !== files || $[22] !== onSubmit || $[23] !== optionSets || $[24] !== payload || $[25] !== reason || $[26] !== record || $[27] !== requireReason || $[28] !== values) {
        t11 = ({
            "RecordFormDrawer[submit]": (event)=>{
                event.preventDefault();
                const check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2f$admin$2f$forms$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateForm"])(fields, values, optionSets);
                const nextErrors = {
                    ...check.errors
                };
                for (const f_1 of fields){
                    if (f_1.type === "file" && f_1.required && !files[f_1.name] && !record?.[f_1.name]) {
                        nextErrors[f_1.name] = `${f_1.label} is required.`;
                    }
                }
                if (requireReason && reason.trim().length < 5) {
                    nextErrors.__reason = "Please give a reason (at least 5 characters).";
                }
                setErrors(nextErrors);
                const hiddenError = fields.find({
                    "RecordFormDrawer[submit > fields.find()]": (f_2)=>f_2.type === "hidden" && nextErrors[f_2.name]
                }["RecordFormDrawer[submit > fields.find()]"]);
                if (hiddenError) {
                    setFormError(`${hiddenError.label} is missing. Open this list from its parent page.`);
                }
                if (Object.keys(nextErrors).length) {
                    return;
                }
                startSaving({
                    "RecordFormDrawer[submit > startSaving()]": async ()=>{
                        const result = await onSubmit(payload(), reason.trim());
                        if (result?.ok) {
                            return;
                        }
                        setFormError(result?.message || "Could not save.");
                        if (result?.fieldErrors) {
                            setErrors(result.fieldErrors);
                        }
                    }
                }["RecordFormDrawer[submit > startSaving()]"]);
            }
        })["RecordFormDrawer[submit]"];
        $[20] = fields;
        $[21] = files;
        $[22] = onSubmit;
        $[23] = optionSets;
        $[24] = payload;
        $[25] = reason;
        $[26] = record;
        $[27] = requireReason;
        $[28] = values;
        $[29] = t11;
    } else {
        t11 = $[29];
    }
    const submit = t11;
    let t12;
    if ($[30] !== onClose || $[31] !== saving) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "secondary",
            onClick: onClose,
            disabled: saving,
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 242,
            columnNumber: 11
        }, this);
        $[30] = onClose;
        $[31] = saving;
        $[32] = t12;
    } else {
        t12 = $[32];
    }
    let t13;
    if ($[33] !== saving) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            type: "submit",
            variant: "primary",
            form: "record-form",
            loading: saving,
            children: "Save"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 251,
            columnNumber: 11
        }, this);
        $[33] = saving;
        $[34] = t13;
    } else {
        t13 = $[34];
    }
    let t14;
    if ($[35] !== t12 || $[36] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t12,
                t13
            ]
        }, void 0, true);
        $[35] = t12;
        $[36] = t13;
        $[37] = t14;
    } else {
        t14 = $[37];
    }
    let t15;
    if ($[38] !== formError) {
        t15 = formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$page$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Notice"], {
            tone: "danger",
            children: formError
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 268,
            columnNumber: 24
        }, this);
        $[38] = formError;
        $[39] = t15;
    } else {
        t15 = $[39];
    }
    let t16;
    if ($[40] !== errors || $[41] !== fields || $[42] !== optionSets || $[43] !== pickFile || $[44] !== record || $[45] !== set || $[46] !== values) {
        let t17;
        if ($[48] !== errors || $[49] !== optionSets || $[50] !== pickFile || $[51] !== record || $[52] !== set || $[53] !== values) {
            t17 = ({
                "RecordFormDrawer[fields.map()]": (field_0)=>{
                    if (field_0.type === "hidden") {
                        return null;
                    }
                    const options = optionSets[field_0.name] ?? field_0.options ?? [];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
                        label: field_0.label,
                        required: field_0.required,
                        error: errors[field_0.name],
                        hint: field_0.hint,
                        children: (t18)=>{
                            const { id, invalid, describedBy } = t18;
                            const common = {
                                id,
                                name: field_0.name,
                                value: values[field_0.name],
                                "aria-invalid": invalid || undefined,
                                "aria-describedby": describedBy
                            };
                            if (field_0.type === "select") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    ...common,
                                    options: options,
                                    placeholder: "Select\u2026",
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <Select>.onChange]": (e_2)=>set(field_0.name, e_2.target.value)
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <Select>.onChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 298,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "multiselect") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    ...common,
                                    multiple: true,
                                    size: Math.min(8, Math.max(3, options.length)),
                                    className: "w-full rounded-lg border border-line bg-surface px-2 py-1 text-sm",
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <select>.onChange]": (e_3)=>set(field_0.name, [
                                                ...e_3.target.selectedOptions
                                            ].map(_RecordFormDrawerFieldsMapAnonymousSelectOnChangeAnonymous))
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <select>.onChange]"],
                                    children: options.map(_RecordFormDrawerFieldsMapAnonymousOptionsMap)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 303,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "textarea") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                    ...common,
                                    rows: field_0.rows ?? 4,
                                    maxLength: field_0.maxLength,
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <Textarea>.onChange]": (e_4)=>set(field_0.name, e_4.target.value)
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <Textarea>.onChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 308,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "html") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$products$2f$product$2d$html$2d$editor$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductHtmlEditor"], {
                                    value: values[field_0.name],
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <ProductHtmlEditor>.onChange]": (html)=>set(field_0.name, html)
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <ProductHtmlEditor>.onChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 313,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "checkbox") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                    id: id,
                                    label: field_0.checkboxLabel ?? field_0.label,
                                    checked: values[field_0.name] === "1",
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <Checkbox>.onChange]": (e_5)=>set(field_0.name, e_5.target.checked ? "1" : "")
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <Checkbox>.onChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 318,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "color") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    ...common,
                                    type: "color",
                                    className: "h-9 w-20 p-1",
                                    onChange: {
                                        "RecordFormDrawer[fields.map() > <anonymous> > <Input>.onChange]": (e_6)=>set(field_0.name, e_6.target.value)
                                    }["RecordFormDrawer[fields.map() > <anonymous> > <Input>.onChange]"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 323,
                                    columnNumber: 24
                                }, this);
                            }
                            if (field_0.type === "file") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        record?.[field_0.name] && field_0.accept?.startsWith("image") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: record[field_0.name],
                                            alt: "",
                                            className: "h-16 w-auto rounded border border-line object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                            lineNumber: 328,
                                            columnNumber: 116
                                        }, this) : record?.[field_0.name] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: record[field_0.name],
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-xs text-brand-700 hover:underline",
                                            children: "Current file"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                            lineNumber: 328,
                                            columnNumber: 251
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: id,
                                            type: "file",
                                            accept: field_0.accept,
                                            "aria-describedby": describedBy,
                                            className: "block w-full text-sm",
                                            onChange: {
                                                "RecordFormDrawer[fields.map() > <anonymous> > <input>.onChange]": (e_7)=>pickFile(field_0, e_7.target.files?.[0])
                                            }["RecordFormDrawer[fields.map() > <anonymous> > <input>.onChange]"]
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                            lineNumber: 328,
                                            columnNumber: 399
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                    lineNumber: 328,
                                    columnNumber: 24
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                ...common,
                                type: field_0.type === "number" ? "number" : field_0.type === "date" ? "date" : field_0.type === "email" ? "email" : field_0.type === "password" ? "password" : "text",
                                inputMode: field_0.type === "number" ? "decimal" : undefined,
                                min: field_0.min,
                                max: field_0.max,
                                step: field_0.type === "number" ? "any" : undefined,
                                maxLength: field_0.maxLength,
                                onChange: {
                                    "RecordFormDrawer[fields.map() > <anonymous> > <Input>.onChange]": (e_8)=>set(field_0.name, e_8.target.value)
                                }["RecordFormDrawer[fields.map() > <anonymous> > <Input>.onChange]"]
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/resource/record-form.jsx",
                                lineNumber: 332,
                                columnNumber: 22
                            }, this);
                        }
                    }, field_0.name, false, {
                        fileName: "[project]/src/components/admin/resource/record-form.jsx",
                        lineNumber: 284,
                        columnNumber: 18
                    }, this);
                }
            })["RecordFormDrawer[fields.map()]"];
            $[48] = errors;
            $[49] = optionSets;
            $[50] = pickFile;
            $[51] = record;
            $[52] = set;
            $[53] = values;
            $[54] = t17;
        } else {
            t17 = $[54];
        }
        t16 = fields.map(t17);
        $[40] = errors;
        $[41] = fields;
        $[42] = optionSets;
        $[43] = pickFile;
        $[44] = record;
        $[45] = set;
        $[46] = values;
        $[47] = t16;
    } else {
        t16 = $[47];
    }
    let t17;
    if ($[55] !== errors || $[56] !== reason || $[57] !== requireReason) {
        t17 = requireReason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
            label: "Reason for change (saved in the audit log)",
            required: true,
            error: errors.__reason,
            children: (t18)=>{
                const { id: id_0, invalid: invalid_0, describedBy: describedBy_0 } = t18;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                    id: id_0,
                    rows: 2,
                    value: reason,
                    onChange: {
                        "RecordFormDrawer[<anonymous> > <Textarea>.onChange]": (e_9)=>setReason(e_9.target.value)
                    }["RecordFormDrawer[<anonymous> > <Textarea>.onChange]"],
                    "aria-invalid": invalid_0 || undefined,
                    "aria-describedby": describedBy_0
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/record-form.jsx",
                    lineNumber: 368,
                    columnNumber: 16
                }, this);
            }
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 362,
            columnNumber: 28
        }, this);
        $[55] = errors;
        $[56] = reason;
        $[57] = requireReason;
        $[58] = t17;
    } else {
        t17 = $[58];
    }
    let t18;
    if ($[59] !== submit || $[60] !== t15 || $[61] !== t16 || $[62] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            id: "record-form",
            onSubmit: submit,
            className: "space-y-4",
            noValidate: true,
            children: [
                t15,
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 381,
            columnNumber: 11
        }, this);
        $[59] = submit;
        $[60] = t15;
        $[61] = t16;
        $[62] = t17;
        $[63] = t18;
    } else {
        t18 = $[63];
    }
    let t19;
    if ($[64] !== description || $[65] !== onClose || $[66] !== open || $[67] !== t14 || $[68] !== t18 || $[69] !== title) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawer"], {
            open: open,
            onClose: onClose,
            title: title,
            description: description,
            footer: t14,
            children: t18
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/record-form.jsx",
            lineNumber: 392,
            columnNumber: 11
        }, this);
        $[64] = description;
        $[65] = onClose;
        $[66] = open;
        $[67] = t14;
        $[68] = t18;
        $[69] = title;
        $[70] = t19;
    } else {
        t19 = $[70];
    }
    return t19;
}
_s(RecordFormDrawer, "C/CBQ0/6DAAViUsGzocswrpxmmo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = RecordFormDrawer;
function _RecordFormDrawerFieldsMapAnonymousOptionsMap(o_0) {
    const value_0 = typeof o_0 === "object" ? String(o_0.value) : String(o_0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: value_0,
        children: typeof o_0 === "object" ? o_0.label : o_0
    }, value_0, false, {
        fileName: "[project]/src/components/admin/resource/record-form.jsx",
        lineNumber: 407,
        columnNumber: 10
    }, this);
}
function _RecordFormDrawerFieldsMapAnonymousSelectOnChangeAnonymous(o) {
    return o.value;
}
function _RecordFormDrawerPayloadFieldsSome(f_0) {
    return f_0.type === "file";
}
var _c;
__turbopack_context__.k.register(_c, "RecordFormDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/resource/resource-table.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResourceTable",
    ()=>ResourceTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/form.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$data$2d$table$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/data-table/data-table.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:f8f48b [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$bf1ff0__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:bf1ff0 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$951541__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:951541 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$a6d49c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/lib/actions/admin/data:a6d49c [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$resource$2f$record$2d$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/resource/record-form.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function AssignDialog(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "543f4827d1e22f6df1dddb2fa369e530d053ed04fcdea35f11cf269a317b5bc0") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "543f4827d1e22f6df1dddb2fa369e530d053ed04fcdea35f11cf269a317b5bc0";
    }
    const { state, onClose, onDone } = t0;
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [running, startRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const { action, ids } = state;
    const t1 = action.confirm?.title || action.label;
    const t2 = action.confirm?.description;
    let t3;
    if ($[1] !== onClose || $[2] !== running) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "secondary",
            onClick: onClose,
            disabled: running,
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 39,
            columnNumber: 10
        }, this);
        $[1] = onClose;
        $[2] = running;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const t4 = !value;
    let t5;
    if ($[4] !== onDone || $[5] !== value) {
        t5 = ({
            "AssignDialog[<Button>.onClick]": ()=>startRunning({
                    "AssignDialog[<Button>.onClick > startRunning()]": ()=>onDone(value)
                }["AssignDialog[<Button>.onClick > startRunning()]"])
        })["AssignDialog[<Button>.onClick]"];
        $[4] = onDone;
        $[5] = value;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== ids.length || $[8] !== running || $[9] !== t4 || $[10] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            variant: "primary",
            loading: running,
            disabled: t4,
            onClick: t5,
            children: [
                "Assign ",
                ids.length
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 62,
            columnNumber: 10
        }, this);
        $[7] = ids.length;
        $[8] = running;
        $[9] = t4;
        $[10] = t5;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] !== t3 || $[13] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t3,
                t6
            ]
        }, void 0, true);
        $[12] = t3;
        $[13] = t6;
        $[14] = t7;
    } else {
        t7 = $[14];
    }
    let t8;
    if ($[15] !== action.assign.options || $[16] !== value) {
        t8 = (t9)=>{
            const { id } = t9;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                id: id,
                value: value,
                onChange: {
                    "AssignDialog[<anonymous> > <Select>.onChange]": (e)=>setValue(e.target.value)
                }["AssignDialog[<anonymous> > <Select>.onChange]"],
                options: action.assign.options,
                placeholder: "Select\u2026"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                lineNumber: 86,
                columnNumber: 14
            }, this);
        };
        $[15] = action.assign.options;
        $[16] = value;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    let t9;
    if ($[18] !== action.assign.label || $[19] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Field"], {
            label: action.assign.label,
            required: true,
            children: t8
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 98,
            columnNumber: 10
        }, this);
        $[18] = action.assign.label;
        $[19] = t8;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== onClose || $[22] !== t1 || $[23] !== t2 || $[24] !== t7 || $[25] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
            open: true,
            onClose: onClose,
            size: "sm",
            title: t1,
            description: t2,
            footer: t7,
            children: t9
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 107,
            columnNumber: 11
        }, this);
        $[21] = onClose;
        $[22] = t1;
        $[23] = t2;
        $[24] = t7;
        $[25] = t9;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    return t10;
}
_s(AssignDialog, "i8oKkRZlrWiXr9jtxsfqAarneQU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = AssignDialog;
function ResourceTable(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(66);
    if ($[0] !== "543f4827d1e22f6df1dddb2fa369e530d053ed04fcdea35f11cf269a317b5bc0") {
        for(let $i = 0; $i < 66; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "543f4827d1e22f6df1dddb2fa369e530d053ed04fcdea35f11cf269a317b5bc0";
    }
    const { resourceKey, resource, data, canAdd, rowActions, bulkActions, optionSets } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { notify } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assign, setAssign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t1;
    if ($[1] !== resourceKey) {
        t1 = ({
            "ResourceTable[onAction]": (actionId, ids, t2)=>{
                const { reason } = t2 === undefined ? {} : t2;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceActionAction"])(resourceKey, actionId, ids, reason ?? "");
            }
        })["ResourceTable[onAction]"];
        $[1] = resourceKey;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const onAction = t1;
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "ResourceTable[onCustomAction]": (action, ids_0, rows, clearSelection)=>{
                if (action.assign) {
                    setAssign({
                        action,
                        ids: ids_0,
                        clearSelection
                    });
                } else {
                    if (action.kind === "form") {
                        setForm({
                            record: rows[0] ?? null,
                            nonce: Date.now()
                        });
                    }
                }
            }
        })["ResourceTable[onCustomAction]"];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const onCustomAction = t2;
    let t3;
    if ($[4] !== form?.record?.id || $[5] !== notify || $[6] !== resourceKey || $[7] !== router) {
        t3 = ({
            "ResourceTable[save]": async (values, reason_0)=>{
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$951541__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceSaveAction"])(resourceKey, form?.record?.id ?? null, values, reason_0);
                if (result?.ok) {
                    notify({
                        message: result.message,
                        tone: "success"
                    });
                    setForm(null);
                    router.refresh();
                }
                return result;
            }
        })["ResourceTable[save]"];
        $[4] = form?.record?.id;
        $[5] = notify;
        $[6] = resourceKey;
        $[7] = router;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const save = t3;
    let t4;
    if ($[9] !== assign || $[10] !== notify || $[11] !== resourceKey || $[12] !== router) {
        t4 = ({
            "ResourceTable[runAssign]": async (value)=>{
                const result_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$f8f48b__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceActionAction"])(resourceKey, assign?.action?.id, assign?.ids, "", value);
                if (result_0?.ok) {
                    notify({
                        message: result_0.message,
                        tone: "success"
                    });
                    assign?.clearSelection();
                    setAssign(null);
                    router.refresh();
                } else {
                    notify({
                        message: result_0?.message || "Action failed.",
                        tone: "error"
                    });
                }
            }
        })["ResourceTable[runAssign]"];
        $[9] = assign;
        $[10] = notify;
        $[11] = resourceKey;
        $[12] = router;
        $[13] = t4;
    } else {
        t4 = $[13];
    }
    const runAssign = t4;
    let t5;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = new Set();
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    const synced = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t5);
    let t6;
    if ($[15] !== data?.rows || $[16] !== resourceKey) {
        t6 = resourceKey === "orders" ? (data?.rows ?? []).map(_ResourceTableAnonymous).join("|") : "";
        $[15] = data?.rows;
        $[16] = resourceKey;
        $[17] = t6;
    } else {
        t6 = $[17];
    }
    const pageKey = t6;
    let t7;
    if ($[18] !== data?.rows || $[19] !== pageKey || $[20] !== resourceKey || $[21] !== router) {
        t7 = ({
            "ResourceTable[useEffect()]": ()=>{
                if (resourceKey !== "orders" || !pageKey) {
                    return;
                }
                const pending = (data?.rows ?? []).filter(_ResourceTableUseEffectAnonymous).map(_ResourceTableUseEffectAnonymous2).filter({
                    "ResourceTable[useEffect() > (anonymous)()]": (id)=>!synced.current.has(id)
                }["ResourceTable[useEffect() > (anonymous)()]"]).slice(0, 20);
                if (!pending.length) {
                    return;
                }
                for (const id_0 of pending){
                    synced.current.add(id_0);
                }
                let cancelled = false;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$a6d49c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["syncVisibleOrdersAction"])(pending).then({
                    "ResourceTable[useEffect() > (anonymous)()]": (result_1)=>{
                        if (!cancelled && result_1?.ok && result_1.changed > 0) {
                            router.refresh();
                        }
                    }
                }["ResourceTable[useEffect() > (anonymous)()]"]).catch(_ResourceTableUseEffectAnonymous3);
                return ()=>{
                    cancelled = true;
                };
            }
        })["ResourceTable[useEffect()]"];
        $[18] = data?.rows;
        $[19] = pageKey;
        $[20] = resourceKey;
        $[21] = router;
        $[22] = t7;
    } else {
        t7 = $[22];
    }
    let t8;
    if ($[23] !== data || $[24] !== pageKey || $[25] !== resourceKey || $[26] !== router) {
        t8 = [
            resourceKey,
            pageKey,
            data,
            router
        ];
        $[23] = data;
        $[24] = pageKey;
        $[25] = resourceKey;
        $[26] = router;
        $[27] = t8;
    } else {
        t8 = $[27];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t7, t8);
    const formConfig = resource.form;
    const t9 = resource.columns;
    const t10 = resource.searchFields?.length ? resource.search || "Search\u2026" : undefined;
    let t11;
    if ($[28] !== resource.filters) {
        t11 = resource.filters ?? [];
        $[28] = resource.filters;
        $[29] = t11;
    } else {
        t11 = $[29];
    }
    const t12 = resource.dateRange;
    const t13 = resource.rowHref;
    let t14;
    if ($[30] !== resource.exportable || $[31] !== resourceKey) {
        t14 = resource.exportable ? (params)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2f$admin$2f$data$3a$bf1ff0__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["resourceExportAction"])(resourceKey, params) : undefined;
        $[30] = resource.exportable;
        $[31] = resourceKey;
        $[32] = t14;
    } else {
        t14 = $[32];
    }
    let t15;
    if ($[33] !== resourceKey) {
        let t16;
        if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
            t16 = /\./g;
            $[35] = t16;
        } else {
            t16 = $[35];
        }
        t15 = resourceKey.replace(t16, "-");
        $[33] = resourceKey;
        $[34] = t15;
    } else {
        t15 = $[34];
    }
    let t16;
    if ($[36] !== canAdd || $[37] !== formConfig) {
        t16 = canAdd && formConfig ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            size: "sm",
            variant: "primary",
            onClick: {
                "ResourceTable[<Button>.onClick]": ()=>setForm({
                        record: null,
                        nonce: Date.now()
                    })
            }["ResourceTable[<Button>.onClick]"],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                    className: "size-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/resource/resource-table.jsx",
                    lineNumber: 354,
                    columnNumber: 43
                }, this),
                " Add"
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 349,
            columnNumber: 34
        }, this) : null;
        $[36] = canAdd;
        $[37] = formConfig;
        $[38] = t16;
    } else {
        t16 = $[38];
    }
    let t17;
    if ($[39] !== bulkActions || $[40] !== data || $[41] !== onAction || $[42] !== resource.columns || $[43] !== resource.dateRange || $[44] !== resource.rowHref || $[45] !== resourceKey || $[46] !== rowActions || $[47] !== t10 || $[48] !== t11 || $[49] !== t14 || $[50] !== t15 || $[51] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$data$2d$table$2f$data$2d$table$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTable"], {
            id: resourceKey,
            columns: t9,
            data: data,
            search: t10,
            filters: t11,
            dateRange: t12,
            rowHref: t13,
            rowActions: rowActions,
            bulkActions: bulkActions,
            onAction: onAction,
            onCustomAction: onCustomAction,
            onExport: t14,
            exportName: t15,
            toolbar: t16
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 363,
            columnNumber: 11
        }, this);
        $[39] = bulkActions;
        $[40] = data;
        $[41] = onAction;
        $[42] = resource.columns;
        $[43] = resource.dateRange;
        $[44] = resource.rowHref;
        $[45] = resourceKey;
        $[46] = rowActions;
        $[47] = t10;
        $[48] = t11;
        $[49] = t14;
        $[50] = t15;
        $[51] = t16;
        $[52] = t17;
    } else {
        t17 = $[52];
    }
    let t18;
    if ($[53] !== form || $[54] !== formConfig || $[55] !== optionSets || $[56] !== resource.title || $[57] !== save) {
        t18 = form && formConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$resource$2f$record$2d$form$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RecordFormDrawer"], {
            open: true,
            onClose: {
                "ResourceTable[<RecordFormDrawer>.onClose]": ()=>setForm(null)
            }["ResourceTable[<RecordFormDrawer>.onClose]"],
            title: form.record ? `Edit ${formConfig.title || resource.title}` : formConfig.title || `Add to ${resource.title}`,
            description: form.record ? `Record ${form.record.id}` : undefined,
            fields: formConfig.fields,
            record: form.record,
            optionSets: optionSets,
            requireReason: formConfig.requireReason,
            onSubmit: save
        }, form.nonce, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 383,
            columnNumber: 33
        }, this);
        $[53] = form;
        $[54] = formConfig;
        $[55] = optionSets;
        $[56] = resource.title;
        $[57] = save;
        $[58] = t18;
    } else {
        t18 = $[58];
    }
    let t19;
    if ($[59] !== assign || $[60] !== runAssign) {
        t19 = assign && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssignDialog, {
            state: assign,
            onClose: {
                "ResourceTable[<AssignDialog>.onClose]": ()=>setAssign(null)
            }["ResourceTable[<AssignDialog>.onClose]"],
            onDone: runAssign
        }, void 0, false, {
            fileName: "[project]/src/components/admin/resource/resource-table.jsx",
            lineNumber: 397,
            columnNumber: 21
        }, this);
        $[59] = assign;
        $[60] = runAssign;
        $[61] = t19;
    } else {
        t19 = $[61];
    }
    let t20;
    if ($[62] !== t17 || $[63] !== t18 || $[64] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t17,
                t18,
                t19
            ]
        }, void 0, true);
        $[62] = t17;
        $[63] = t18;
        $[64] = t19;
        $[65] = t20;
    } else {
        t20 = $[65];
    }
    return t20;
}
_s1(ResourceTable, "q2hrJw1L6y0l1JtbIG3uLy/yVcc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = ResourceTable;
function _ResourceTableUseEffectAnonymous3() {}
function _ResourceTableUseEffectAnonymous2(row_1) {
    return String(row_1.id);
}
function _ResourceTableUseEffectAnonymous(row_0) {
    return row_0?.id && !COURIER_FINAL.has(String(row_0.status ?? ""));
}
function _ResourceTableAnonymous(row) {
    return row.id;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "AssignDialog");
__turbopack_context__.k.register(_c1, "ResourceTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0d6b0988._.js.map