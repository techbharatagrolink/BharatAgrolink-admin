"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { generateB2bCatalogue } from "@/lib/actions/admin/b2b-catalog-generator";
import {
  LANGUAGES,
  PRODUCTS_PER_PAGE,
  SCRIPT_FONT,
  createProductPlaceholder,
  createVendorPlaceholder,
  formatCatalogDate,
  renderCatalogue,
  todayIso,
} from "./catalog-render";
import { createCatalogTranslate } from "./catalog-translate";
import { CatalogueSendDialog } from "./catalog-send";

/*
 * b2b_orders/catalog_generator.php. The control panel uses the admin form
 * components; the catalogue itself renders inside a same-origin frame with the
 * PHP stylesheet (public/catalog-generator/catalog_generator.css), so the A4
 * pages, print output and Google Translate behave exactly as on the PHP page.
 */

const PAGE_WIDTH_PX = 793.7; // 210mm
const MODE_HINT = {
  product: "One product per catalogue. Pick a single SKU below.",
  vendor: "Every active SKU for the chosen seller.",
  batch: "Hand-pick any set of products across sellers.",
};
const MODES = [["product", "Product"], ["batch", "Batch"], ["vendor", "Vendor"]];

const FRAME_DOC = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/catalog-generator/catalog_generator.css">
<style>@media screen{.preview-pane__inner{zoom:var(--cg-zoom,1)}}</style>
</head><body><main class="preview-pane" aria-label="Catalogue preview"><div class="preview-pane__inner" id="catalogPreview"></div></main></body></html>`;

const EMPTY_STATE = `<div class="empty-state" id="emptyState">
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="7" y="5" width="26" height="30" rx="2" stroke="currentColor" stroke-width="1.6"/>
    <path d="M13 14H27M13 20H27M13 26H21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  </svg>
  <h3>No products selected</h3>
  <p>Select products from the panel on the left, then generate your B2B catalogue.</p>
</div>`;

/** Relative settings values point into the PHP page folder (b2b_orders/), served here from /catalog-generator/. */
function assetUrl(value) {
  const v = String(value || "").trim();
  if (!v || /^(https?:|data:|blob:|\/)/i.test(v)) return v;
  return `/catalog-generator/${v.replace(/^\.?\//, "")}`;
}

/** Selection preset for a mode. Batch is left alone - it is the manual case. */
function presetSelection(mode, vendorId, selected, products) {
  if (mode === "vendor") {
    return new Set(products.filter((p) => !vendorId || String(p.vendorId) === String(vendorId)).map((p) => p.id));
  }
  if (mode === "product") {
    const first = selected.values().next();
    return new Set(first.done ? [] : [first.value]);
  }
  return selected;
}

function loadScriptFont(doc, lang, loaded) {
  const family = SCRIPT_FONT[lang];
  const root = doc.documentElement;
  if (!family) {
    root.style.setProperty("--font-indic", "");
    return Promise.resolve();
  }
  root.style.setProperty("--font-indic", JSON.stringify(family));
  if (loaded.has(family)) return doc.fonts?.ready ?? Promise.resolve();
  return new Promise((resolve) => {
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=" + family.replace(/ /g, "+") + ":wght@400;600;700&display=swap";
    link.addEventListener("load", () => {
      loaded.add(family);
      (doc.fonts?.ready ?? Promise.resolve()).then(resolve, resolve);
    });
    link.addEventListener("error", () => resolve(false));
    doc.head.appendChild(link);
  });
}

function ProductRow({ product, vendor, selected, onToggle }) {
  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={() => onToggle(product.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(product.id);
        }
      }}
      className={cn(
        "grid cursor-pointer grid-cols-[46px_minmax(0,1fr)_18px] items-center gap-2.5 rounded-lg border p-2 transition-colors",
        selected ? "border-brand-600 bg-brand-50" : "border-line bg-surface hover:border-line-strong hover:bg-surface-muted",
      )}
    >
      <div className="size-[46px] overflow-hidden rounded-md bg-surface-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={product.image || createProductPlaceholder(product)} className="size-full object-contain" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = createProductPlaceholder(product); }} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-ink">{product.name}</p>
        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11.5px] text-ink-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {vendor && <img alt="" src={vendor.logo || createVendorPlaceholder(vendor)} className="size-3.5 shrink-0 rounded-[3px] object-cover" />}
          <span className="truncate">{vendor ? vendor.name : "Vendor information unavailable"}</span>
        </p>
        <p className="mt-0.5 truncate text-[11px] text-ink-muted/80">{product.sku} · {product.category}</p>
      </div>
      <span className={cn("flex size-[18px] items-center justify-center rounded border-[1.5px]", selected ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong")} aria-hidden>
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
    </div>
  );
}

export function CatalogGenerator({ boot }) {
  const { notify } = useToast();
  const vendors = useMemo(() => boot.vendors || [], [boot.vendors]);
  const [products, setProducts] = useState(() => boot.products || []);
  const vendorById = useMemo(() => new Map(vendors.map((v) => [v.id, v])), [vendors]);

  const initialVendor = vendors.some((v) => v.id === boot.vendorId) ? boot.vendorId : "";
  const initialMode = MODE_HINT[boot.mode] ? boot.mode : "batch";
  const [mode, setModeState] = useState(initialMode);
  const [vendorId, setVendorId] = useState(initialVendor);
  const [selected, setSelected] = useState(() =>
    initialMode === "vendor"
      ? presetSelection("vendor", initialVendor, new Set(), boot.products || [])
      : new Set(boot.preselectedIds || []),
  );
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("en");
  const [perPageInput, setPerPageInput] = useState(String(PRODUCTS_PER_PAGE));
  const [perPage, setPerPage] = useState(PRODUCTS_PER_PAGE);
  const [title, setTitle] = useState(boot.defaultTitle || "Product Catalogue");
  const [subtitle, setSubtitle] = useState(boot.defaultSubtitle || "Agriculture Products & Solutions");
  const [date, setDate] = useState(() => todayIso());
  const [agentName, setAgentName] = useState(boot.salesAgent?.name || "");
  const [agentPhone, setAgentPhone] = useState(boot.salesAgent?.phone || "");
  const [agentEmail, setAgentEmail] = useState(boot.salesAgent?.email || "");
  const [translateStatus, setTranslateStatus] = useState("");
  const [frameReady, setFrameReady] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const frameRef = useRef(null);
  const translateRef = useRef(null);
  const fontsRef = useRef(new Set());

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      if (vendorId && String(p.vendorId) !== String(vendorId)) return false;
      if (!term) return true;
      const v = vendorById.get(p.vendorId);
      return [p.name, p.sku, p.brand, p.category, v ? v.name : ""].join(" ").toLowerCase().includes(term);
    });
  }, [products, search, vendorId, vendorById]);

  const selectedProducts = useMemo(() => products.filter((p) => selected.has(p.id)), [products, selected]);
  const vendorOptions = useMemo(
    () => [
      { value: "", label: `All sellers (${products.length})` },
      ...vendors.map((v) => ({ value: v.id, label: `${v.name} (${products.filter((p) => String(p.vendorId) === String(v.id)).length})` })),
    ],
    [vendors, products],
  );

  const frameDoc = () => frameRef.current?.contentDocument || null;

  // Fit the A4 pages to the frame width on screen; print and PDF use the real size.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !frameReady) return undefined;
    const fit = () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      const zoom = Math.min(1, Math.max(0.3, (frame.clientWidth - 24) / PAGE_WIDTH_PX));
      doc.documentElement.style.setProperty("--cg-zoom", String(Math.round(zoom * 1000) / 1000));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameReady]);

  const draw = (list) => {
    const doc = frameDoc();
    if (!doc) return 0;
    const root = doc.getElementById("catalogPreview");
    if (!root) return 0;
    if (!list.length) {
      root.innerHTML = EMPTY_STATE;
      return 0;
    }
    return renderCatalogue(
      {
        doc,
        branding: boot.branding,
        salesAgent: {
          name: agentName.trim() || boot.salesAgent?.name || "",
          phone: agentPhone.trim(),
          whatsapp: agentPhone.trim(),
          email: agentEmail.trim(),
        },
        settings: {
          title: title.trim() || "Product Catalogue",
          subtitle: subtitle.trim() || "Agriculture Products & Solutions",
          date: formatCatalogDate(date || todayIso(), language),
        },
        boot: { coverTagline: boot.coverTagline, coverImage: assetUrl(boot.coverImage) },
        language,
        perPage,
        vendors,
      },
      root,
      list,
    );
  };

  // Live preview: the catalogue redraws on every selection, text or layout change.
  useEffect(() => {
    if (!frameReady) return;
    draw(selectedProducts);
    translateRef.current?.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameReady, selectedProducts, title, subtitle, date, agentName, agentPhone, agentEmail, perPage, language]);

  // Language: script font, watermark and Google Translate inside the frame.
  useEffect(() => {
    if (!frameReady) return;
    const doc = frameDoc();
    const win = frameRef.current?.contentWindow;
    if (!doc || !win) return;
    doc.documentElement.lang = "en";
    doc.documentElement.dataset.script = language !== "en" && SCRIPT_FONT[language] ? "indic" : "latin";
    if (boot.watermark) doc.documentElement.style.setProperty("--watermark", "url(" + JSON.stringify(assetUrl(boot.watermark)) + ")");
    if (!translateRef.current) {
      translateRef.current = createCatalogTranslate(win, { onUnavailable: (message) => notify({ tone: "error", message }) });
    }
    let cancelled = false;
    loadScriptFont(doc, language, fontsRef.current).then((ok) => {
      if (ok === false) notify({ tone: "error", message: `Could not load the ${SCRIPT_FONT[language]} webfont - the catalogue may print in a fallback face.` });
      if (cancelled) return;
      translateRef.current.setLanguage(language);
      translateRef.current.refresh();
      setTranslateStatus(language === "en" ? "" : "Translated by Google Translate.");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameReady, language]);

  const applyMode = (next, preserve = false) => {
    const m = MODE_HINT[next] ? next : "batch";
    setModeState(m);
    if (!preserve || m === "vendor") setSelected((current) => presetSelection(m, vendorId, current, products));
  };

  const onVendorChange = (value) => {
    setVendorId(value);
    if (mode === "vendor") setSelected((current) => presetSelection("vendor", value, current, products));
  };

  const toggle = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else {
        if (mode === "product") next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const bulk = (action) => {
    setSelected((current) => {
      const next = new Set(current);
      if (action === "select-all") products.forEach((p) => next.add(p.id));
      if (action === "clear-all") next.clear();
      if (action === "select-all-visible") visible.forEach((p) => next.add(p.id));
      if (action === "clear-visible") visible.forEach((p) => next.delete(p.id));
      return next;
    });
  };

  const onPerPage = () => {
    const val = parseInt(perPageInput, 10);
    const next = Number.isFinite(val) && val > 0 ? val : PRODUCTS_PER_PAGE;
    setPerPage(next);
    setPerPageInput(String(next));
  };

  const generate = async () => {
    if (!selected.size) {
      notify({ tone: "error", message: "Please select at least one product." });
      return;
    }
    setGenerating(true);
    const res = await generateB2bCatalogue({ mode, ids: [...selected], vendorId, perPage, language });
    setGenerating(false);
    if (!res.ok) {
      notify({ tone: "error", message: res.message });
      return;
    }
    const fresh = new Map(res.products.map((p) => [p.id, p]));
    const nextProducts = products.map((p) => fresh.get(p.id) || p);
    setProducts(nextProducts);
    const list = nextProducts.filter((p) => fresh.has(p.id));
    const pages = draw(list);
    translateRef.current?.refresh();
    notify({ message: `Catalogue generated — ${list.length} products across ${pages} pages.` });
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const print = async () => {
    if (!selected.size) {
      notify({ tone: "error", message: "Generate a catalogue before printing." });
      return;
    }
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    try {
      await translateRef.current?.settled();
      await win.document.fonts?.ready;
    } catch {
      /* a browser without the Font Loading API still prints */
    }
    win.focus();
    win.print();
  };

  const count = selected.size;
  const waButton = ({ size = "sm", className } = {}) => (
    <Button size={size} className={cn("border-[#25d366] bg-[#25d366] text-white hover:border-[#1da851] hover:bg-[#1da851]", className)} onClick={() => setSendOpen(true)}>
      Send on WhatsApp
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Catalogue Generator"
        description={`${boot.branding?.name || "Bharat Agrolink"} · B2B Sales Tool`}
        actions={
          <>
            <Select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} options={LANGUAGES.map(([value, label]) => ({ value, label }))} className="w-44" />
            <Badge tone="neutral">{count} product{count === 1 ? "" : "s"} selected</Badge>
            <ButtonLink href="/admin/b2b/catalog" size="sm">Back to Catalog</ButtonLink>
            <Button size="sm" variant="primary" onClick={print}>Print / Save as PDF</Button>
            {waButton()}
          </>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-8rem)] lg:w-[320px] lg:overflow-y-auto xl:w-[380px]" aria-label="Catalogue controls">
          <Card>
            <CardHeader title="Catalogue type" />
            <CardBody className="space-y-3">
              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Catalogue generation mode">
                {MODES.map(([value, label]) => (
                  <Button key={value} size="sm" variant={mode === value ? "primary" : "secondary"} aria-pressed={mode === value} onClick={() => applyMode(value)}>
                    {label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-ink-muted">{MODE_HINT[mode]}</p>
              <Field label="Seller">
                {({ id }) => <Select id={id} value={vendorId} onChange={(e) => onVendorChange(e.target.value)} options={vendorOptions} />}
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Catalogue details" />
            <CardBody className="space-y-3">
              <Field label="Title">{({ id }) => <Input id={id} value={title} onChange={(e) => setTitle(e.target.value)} />}</Field>
              <Field label="Subtitle">{({ id }) => <Input id={id} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />}</Field>
              <Field label="Date">{({ id }) => <Input id={id} type="date" value={date} onChange={(e) => setDate(e.target.value)} />}</Field>
              {translateStatus && <p className="text-xs text-brand-700">{translateStatus}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Contact on this catalogue" />
            <CardBody className="space-y-3">
              <Field label="Sales agent">{({ id }) => <Input id={id} value={agentName} onChange={(e) => setAgentName(e.target.value)} />}</Field>
              <Field label="Phone / WhatsApp">{({ id }) => <Input id={id} type="tel" placeholder="+91 98765 43210" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} />}</Field>
              <Field label="Email">{({ id }) => <Input id={id} type="email" value={agentEmail} onChange={(e) => setAgentEmail(e.target.value)} />}</Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Find products" />
            <CardBody>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
                <Input type="text" aria-label="Search products" placeholder="Search by name, SKU, vendor…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Products" actions={<Badge tone="brand">{count} selected</Badge>} />
            <CardBody className="space-y-3">
              <div className="flex flex-wrap gap-x-3.5 gap-y-1">
                {[["select-all-visible", "Select visible"], ["clear-visible", "Clear visible"], ["select-all", "Select all"], ["clear-all", "Clear all"]].map(([action, label]) => (
                  <Button key={action} variant="link" size="xs" onClick={() => bulk(action)}>{label}</Button>
                ))}
              </div>
              <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto lg:max-h-none lg:overflow-visible" role="list">
                {visible.length === 0 ? (
                  <p className="py-8 text-center text-sm text-ink-muted">No products found</p>
                ) : (
                  visible.map((p) => <ProductRow key={p.id} product={p} vendor={vendorById.get(p.vendorId) || null} selected={selected.has(p.id)} onToggle={toggle} />)
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="sticky bottom-0 z-[3] shadow-md">
            <CardBody className="space-y-2">
              <label className="flex items-center justify-between gap-3 text-xs font-semibold text-ink-muted">
                Products per page
                <Input type="number" min={2} max={12} step={1} value={perPageInput} onChange={(e) => setPerPageInput(e.target.value)} onBlur={onPerPage} onKeyDown={(e) => e.key === "Enter" && onPerPage()} className="h-8 w-16 text-center" />
              </label>
              <Button variant="primary" className="w-full" loading={generating} onClick={generate}>Generate catalogue</Button>
              <Button variant="secondary" className="w-full" onClick={print}>Print / Save as PDF</Button>
              {waButton({ className: "w-full", size: "md" })}
            </CardBody>
          </Card>
        </aside>

        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-line">
          <iframe
            ref={frameRef}
            title="Catalogue preview"
            srcDoc={FRAME_DOC}
            onLoad={() => setFrameReady(true)}
            className="block h-[calc(100vh-8rem)] min-h-[560px] w-full bg-[#EEF0EA]"
          />
        </div>
      </div>

      <CatalogueSendDialog open={sendOpen} onClose={() => setSendOpen(false)} getFrameWindow={() => frameRef.current?.contentWindow || null} notify={notify} />
    </>
  );
}
