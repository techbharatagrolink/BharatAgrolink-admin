"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Boxes, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, ClipboardCheck, ExternalLink, FileText, ImageIcon, ImagePlus, IndianRupee, Package, Plus, Search, Store, Trash2, Truck, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { effectiveStockStatus, STOCK_STATUSES, toStockStatus } from "@/lib/content/admin/stock";
import { createCatalogProductAction, deleteVariationAction, removeProductImageAction, saveProductAction, saveProductAttributesAction, saveVariationAction, setProductStatusAction, setVariationStatusAction, uploadProductImagesAction } from "@/lib/actions/admin/products";
import { ProductHtmlEditor } from "@/components/admin/products/product-html-editor";
import { toVariantGrams, VariantConfigurations } from "@/components/admin/products/variant-configurations";
import { PricingFactorsStep } from "@/components/admin/products/pricing-factors-step";
import { saveProductPricingAction } from "@/lib/actions/admin/pricing-factors";

const STEPS = [
  ["basic", "Basic Info", "Product details"],
  ["seller", "Seller & Variants", "Stock & options"],
  ["pricing", "Pricing & Tax", "NRV, GST & margin"],
  ["media", "Media", "Images & video"],
  ["shipping", "Shipping", "Weight & delivery"],
  ["details", "Product Details", "Description & specs"],
  ["seo", "SEO & Mapping", "Search & related"],
  ["review", "Review", "Check & publish"],
];

// Section header for each step (icon, title, one-line description).
const STEP_META = {
  basic: { icon: Package, title: "Basic Information", text: "Product type, name, brand, category and identifiers." },
  seller: { icon: Store, title: "Seller & Variants", text: "Who sells it, stock, costs and product variants." },
  pricing: { icon: IndianRupee, title: "Pricing & Tax", text: "MRP, NRV, GST and the price customers pay." },
  media: { icon: ImageIcon, title: "Media", text: "Featured image, gallery photos and video." },
  shipping: { icon: Truck, title: "Shipping", text: "Package weight, dimensions and delivery charges." },
  details: { icon: FileText, title: "Product Details", text: "Description, specifications, usage and FAQ." },
  seo: { icon: Search, title: "SEO & Mapping", text: "Offers, return policy and search engine meta." },
  review: { icon: ClipboardCheck, title: "Review", text: "Check everything before you save or publish." },
};

const PRODUCT_TYPES = [
  { value: "simple", label: "Simple Product", text: "One item with a single price and stock.", icon: Package },
  { value: "configure", label: "Configurable Product", text: "Has variants such as size or pack.", icon: Boxes },
];

const TOXICITY = [
  { value: "", label: "Select.." },
  { value: "poison_heavy", label: "Poison heavy" },
  { value: "poison_normal", label: "Poison normal" },
  { value: "caution", label: "Caution" },
  { value: "danger", label: "Danger" },
];

const emptyForm = {
  name: "", productType: "simple", brandId: "", categoryId: "", categoryIds: [], chemicalName: "", toxicity: "",
  countryOfOrigin: "India", webUrl: "", stock: "", stockStatus: "In Stock", mrp: "", nrv: "", gstPercent: "", hsn: "", salePrice: "",
  videoUrl: "", weightKg: "", lengthCm: "", widthCm: "", heightCm: "", shipping: "", heavy: false, description: "",
  details: "", usage: "", offerTitle: "", offerShort: "", returnPolicyId: "", purchaseLimit: "", relatedProducts: "",
  upsellProducts: "", commission: "", adExpense: "", officeExpense: "", profit: "", selfShip: false, chemicalFormula: "",
  courierZone: "", size: "", specifications: [], faqs: [], vendorId: "",
  unit: "", metaTitle: "", metaKeywords: "", metaDescription: "",
};

function imagesOf(product) {
  return [...new Set([product.featured, ...(product.images || [])].filter(Boolean))];
}

/** The PHP edit_product.php wizard: eight sections, preview, draft and publish. Create uses the same columns. */
export function ProductEditor({ product: source, options, vendorName, mode = "edit", pricingFactors = false, canEditPricing = true }) {
  const creating = mode === "create";
  const product = source || { id: "", sku: "", status: "New", statusCode: 0, variations: [], images: [], featured: "", vendor: "", name: "" };
  const router = useRouter();
  const { notify } = useToast();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState("basic");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(() => (creating ? emptyForm : {
    ...emptyForm,
    name: product.name || "",
    productType: product.productType === "configure" ? "configure" : "simple",
    brandId: product.brandId ? String(product.brandId) : "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    categoryIds: (product.categoryIds?.length ? product.categoryIds : (product.categoryId ? [product.categoryId] : [])).map(String),
    chemicalName: product.chemicalName || "",
    toxicity: product.toxicity && product.toxicity !== "null" ? product.toxicity : "",
    countryOfOrigin: product.countryOfOrigin || "India",
    webUrl: product.webUrl || "",
    stock: product.stock ?? "",
    stockStatus: toStockStatus(product.stockStatus),
    mrp: product.mrp ?? "",
    nrv: product.nrv ?? "",
    gstPercent: product.gstPercent ?? "",
    hsn: product.hsn || "",
    salePrice: product.display ?? "",
    videoUrl: product.videoUrl || "",
    weightKg: product.weightKg ?? "",
    lengthCm: product.lengthCm ?? "",
    widthCm: product.widthCm ?? "",
    heightCm: product.heightCm ?? "",
    shipping: product.shipping ?? "",
    heavy: Boolean(product.heavy),
    description: product.description || "",
    details: product.details || "",
    usage: product.usage || "",
    offerTitle: product.offerTitle || "",
    offerShort: product.offerShort || "",
    returnPolicyId: product.returnPolicyId ? String(product.returnPolicyId) : "",
    purchaseLimit: product.purchaseLimit ?? "",
    relatedProducts: product.relatedProducts || "",
    upsellProducts: product.upsellProducts || "",
    commission: product.commission ?? "",
    adExpense: product.adExpense ?? "",
    officeExpense: product.officeExpense ?? "",
    profit: product.profit ?? "",
    selfShip: Boolean(product.selfShip),
    chemicalFormula: typeof product.chemicalFormula === "string" ? product.chemicalFormula : "",
    courierZone: product.courierZone || "",
    size: product.size || "",
    specifications: Array.isArray(product.specifications) ? product.specifications.map((row) => ({ name: row.name || "", value: row.value || "" })) : [],
    faqs: Array.isArray(product.faqs) ? product.faqs.map((row) => ({ id: row.id, question: row.question || "", answer: row.answer || "" })) : [],
    unit: product.unit || "",
    metaTitle: product.metaTitle || "",
    metaKeywords: product.metaKeywords || "",
    metaDescription: product.metaDescription || "",
  }));
  const [draftVariations, setDraftVariations] = useState([]);
  const [attributeGroups, setAttributeGroups] = useState([]);
  const [draftImages, setDraftImages] = useState([]);
  const navRef = useRef(null);
  const stripRef = useRef(null);
  const stepButtons = useRef({});
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  // Stocking up from 0 starts as In Stock; the admin can still mark it Out of Stock.
  const setStock = (event) => {
    const stock = event.target.value;
    setForm((current) => ({ ...current, stock, stockStatus: Number(current.stock) > 0 ? current.stockStatus : "In Stock" }));
  };
  const pricingDraft = useRef(null);
  const [liveServices, setLiveServices] = useState(null);
  const onServices = useCallback((list) => setLiveServices(list), []);
  const [live, setLive] = useState(null);
  const onLive = useCallback((next) => setLive(next), []);
  const onPricingDraft = useCallback((next) => { pricingDraft.current = next; }, []);
  const onPriced = useCallback((priced) => setForm((current) => ({
    ...current,
    salePrice: priced.displayPrice ?? current.salePrice,
    mrp: priced.mrp ?? current.mrp,
    nrv: priced.nrv ?? current.nrv,
    gstPercent: priced.gstPercent == null ? current.gstPercent : String(priced.gstPercent),
    hsn: priced.hsn || current.hsn,
  })), []);
  const pricingParcel = useMemo(() => ({
    // The pricing preview's weightKg is a true kilogram override; the Shipping step's field is grams.
    weightKg: form.weightKg === "" || form.weightKg == null ? form.weightKg : Number(form.weightKg) / 1000,
    ...(creating ? { vendorId: form.vendorId } : {}),
    lengthCm: form.lengthCm,
    widthCm: form.widthCm,
    heightCm: form.heightCm,
    courierZone: form.courierZone,
  }), [creating, form.weightKg, form.vendorId, form.lengthCm, form.widthCm, form.heightCm, form.courierZone]);
  const hasStock = Number(form.stock) > 0;
  const stockStatus = effectiveStockStatus(form.stock, form.stockStatus);

  const categories = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (options.categories || []).filter((item) => !needle || item.label.toLowerCase().includes(needle));
  }, [options.categories, query]);
  const selectedCategory = (options.categories || []).filter((item) => form.categoryIds.includes(item.value));
  const photos = creating ? draftImages.map((item) => item.url) : imagesOf(product);
  const readiness = [
    form.name, form.brandId, form.categoryIds.length, creating ? form.vendorId : product.sku, form.mrp, form.nrv, form.stock, photos.length,
  ].filter((value) => value !== "" && value != null && value !== 0).length;
  const readyPct = Math.round((readiness / 8) * 100);

  const run = (work) => {
    startTransition(async () => {
      const result = await work();
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) router.refresh();
    });
  };

  const variationPayload = (row) => {
    const values = row.values?.length ? row.values : [row.label];
    return {
      label: values.join(" / ").slice(0, 240),
      values,
      variantName: (row.variantName || `${form.name.trim()}-${values.join("-")}`).slice(0, 300),
      stockStatus: row.stockStatus || "In Stock",
      mrp: row.mrp,
      nrv: row.nrv,
      display: row.display,
      gstPercent: row.gstPercent,
      stock: row.stock,
      weightKg: toVariantGrams(row.weightValue, row.weightUnit),
      lengthCm: row.lengthCm,
      widthCm: row.widthCm,
      heightCm: row.heightCm,
    };
  };

  const persistVariations = async (id) => {
    for (const row of draftVariations) {
      const added = await saveVariationAction(id, variationPayload(row));
      if (!added.ok) return added;
    }
    if (attributeGroups.length) {
      const linked = await saveProductAttributesAction(id, attributeGroups);
      if (!linked.ok) return linked;
    }
    setDraftVariations([]);
    setAttributeGroups([]);
    return { ok: true };
  };

  // Saves one pending variant row right away, without going through the page-level Save button.
  // Only possible once the product exists (not while still creating it).
  const saveDraftRow = async (row) => {
    const added = await saveVariationAction(product.id, variationPayload(row));
    if (added.ok) setDraftVariations((current) => current.filter((item) => item.key !== row.key));
    return added;
  };

  const report = (result) => {
    notify({ message: result.message, tone: result.ok ? "success" : "error" });
    if (result.ok) router.refresh();
    return result;
  };

  // Edits an already-saved variant. Fields the panel doesn't edit (price ex-GST, commission,
  // courier zone) are sent back unchanged so the update can't null them out. With pricing factors
  // on, the variant update ignores MRP / NRV / GST / display price; MRP and NRV changes go through
  // the pricing engine instead, which recomputes the display price for that variant.
  const saveEditedRow = async (row, edits) => {
    const base = {
      id: row.id,
      label: row.label,
      stockStatus: edits.stockStatus,
      stock: edits.stock,
      weightKg: edits.weightKg,
      lengthCm: edits.lengthCm,
      widthCm: edits.widthCm,
      heightCm: edits.heightCm,
      saleExGst: row.saleExGst,
      commission: row.commission,
      courier: row.courier,
    };
    const saved = await saveVariationAction(product.id, pricingFactors ? base : { ...base, mrp: edits.mrp, nrv: edits.nrv, display: edits.display, gstPercent: edits.gstPercent });
    if (!saved.ok || !pricingFactors) return report(saved);
    const priceChanged = String(edits.mrp ?? "") !== String(row.mrp ?? "") || String(edits.nrv ?? "") !== String(row.nrv ?? "");
    if (!priceChanged) return report(saved);
    const priced = await saveProductPricingAction(product.id, { variantId: row.id, mrp: edits.mrp, nrv: edits.nrv });
    if (!priced.ok) return report({ ok: false, message: `Stock and size saved, but pricing was not: ${priced.message}` });
    return report({ ok: true, message: `Variation updated. ${priced.message}` });
  };

  const toggleRowStatus = async (row) => report(await setVariationStatusAction(product.id, row.id, !row.active));

  const save = (publish) => {
    run(async () => {
      if (!creating) {
        const saved = await saveProductAction(product.id, form);
        if (!saved.ok) return saved;
        const variants = await persistVariations(product.id);
        if (!variants.ok) return variants;
        if (!publish) return saved;
        if (product.statusCode === 1) return saved;
        return setProductStatusAction(product.id, "approve", "Published from the product editor");
      }
      if (!form.name.trim()) return { ok: false, message: "Product name is required." };
      if (!form.vendorId) return { ok: false, message: "Choose a seller." };
      if (!form.categoryIds.length) return { ok: false, message: "Choose a category." };
      if (!form.brandId) return { ok: false, message: "Choose a brand." };
      if (pricingFactors) {
        const pendingPricing = pricingDraft.current;
        if (!pendingPricing?.ready) return { ok: false, message: pendingPricing?.message || "Open Pricing & Tax and enter MRP, NRV, GST and HSN." };
      } else if (!(Number(form.mrp) > 0)) return { ok: false, message: "Enter the MRP." };
      if (form.stock === "") return { ok: false, message: "Enter the available quantity." };
      const policy = (options.returnPolicyOptions || []).find((item) => item.value === form.returnPolicyId);
      const priceInput = pricingFactors ? pricingDraft.current?.body || {} : {};
      const created = await createCatalogProductAction({
        name: form.name,
        vendorId: form.vendorId,
        categoryId: form.categoryIds[0],
        brandId: form.brandId,
        hsn: priceInput.hsn ?? form.hsn,
        stock: form.stock,
        stockStatus,
        weightKg: form.weightKg,
        returnPolicy: policy?.label || "",
        mrp: priceInput.mrp ?? form.mrp,
        ...(pricingFactors ? { takeRate: priceInput.takeRate } : { salePrice: form.salePrice }),
        nrv: priceInput.nrv ?? form.nrv,
        gstPercent: priceInput.gstPercent ?? form.gstPercent,
      });
      if (!created.ok) return created;
      const saved = await saveProductAction(created.id, pricingFactors ? { ...form, hsn: priceInput.hsn || form.hsn } : form);
      let pricingNote = saved.ok ? "" : ` Some details were not saved: ${saved.message}`;
      if (pricingFactors && pricingDraft.current?.ready) {
        const priced = await saveProductPricingAction(created.id, pricingDraft.current.body);
        if (!priced.ok) pricingNote = ` Pricing was not saved: ${priced.message}`;
      }
      // The product already exists from here on. A failed variation/image step must not look like
      // "nothing saved" — that left admins on /new and a second click created a duplicate product.
      const variants = await persistVariations(created.id);
      if (!variants.ok) pricingNote += ` Variations were not saved: ${variants.message}`;
      if (draftImages.length) {
        const data = new FormData();
        const featured = draftImages.find((item) => item.featured);
        if (featured) data.append("featured", featured.file);
        for (const item of draftImages.filter((item) => !item.featured)) data.append("images", item.file);
        const uploaded = await uploadProductImagesAction(created.id, data);
        if (!uploaded.ok) pricingNote += ` Images were not uploaded: ${uploaded.message} Add them from the Media step.`;
      }
      if (publish) {
        const published = await setProductStatusAction(created.id, "approve", "Published from the product editor");
        router.push(`/admin/products/${created.id}`);
        if (!published.ok) return { ok: true, message: `Product created. It stays pending until it is approved.${pricingNote}` };
        return pricingNote ? { ...published, message: `${published.message || "Product published."}${pricingNote}` } : published;
      }
      router.push(`/admin/products/${created.id}`);
      return pricingNote ? { ...created, message: `${created.message || "Product created."}${pricingNote}` } : created;
    });
  };

  // ---- Presentation helpers (UI only; every value below is read from the same state as before) ----
  const [summaryOpen, setSummaryOpen] = useState(false);
  const stepIndex = STEPS.findIndex(([id]) => id === step);
  const meta = STEP_META[step];
  const StepIcon = meta.icon;
  const plainDetails = String(form.details || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  const filled = (value) => value !== "" && value != null && value !== 0;
  const stepDone = {
    basic: Boolean(form.name.trim() && form.brandId && form.categoryIds.length),
    seller: Boolean((creating ? form.vendorId : true) && filled(form.stock)),
    pricing: Number(form.mrp) > 0 && filled(form.nrv),
    media: photos.length > 0,
    details: Boolean(plainDetails),
  };
  const readinessItems = [
    ["Name", form.name, "basic"],
    ["Brand", form.brandId, "basic"],
    ["Category", form.categoryIds.length, "basic"],
    creating ? ["Seller", form.vendorId, "seller"] : ["SKU", product.sku, "basic"],
    ["MRP", form.mrp, "pricing"],
    ["NRV", form.nrv, "pricing"],
    ["Stock", form.stock, "seller"],
    ["Photo", photos.length, "media"],
  ];
  const missing = readinessItems.filter(([, value]) => !filled(value));
  const brandLabel = (options.brands || []).find((item) => item.value === form.brandId)?.label;
  const services = liveServices ?? product.services;
  const mediaItems = creating ? draftImages : photos.map((url) => ({ url }));
  const toggleCategory = (value) => setForm((current) => {
    const categoryIds = current.categoryIds.includes(value) ? current.categoryIds.filter((id) => id !== value) : [...current.categoryIds, value];
    return { ...current, categoryIds, categoryId: categoryIds[0] || "" };
  });
  const goTo = (id) => {
    setStep(id);
    setSummaryOpen(false);
    const strip = stripRef.current;
    const button = stepButtons.current[id];
    if (strip && button) strip.scrollTo({ left: button.offsetLeft - strip.clientWidth / 2 + button.offsetWidth / 2, behavior: "smooth" });
    const nav = navRef.current;
    if (nav) {
      const top = nav.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight) nav.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const prevStep = STEPS[stepIndex - 1];
  const nextStep = STEPS[stepIndex + 1];
  const seoTitle = form.metaTitle || form.name || "Product title";
  const seoDescription = form.metaDescription || "Add a meta description to control the text shown under the title in Google results.";
  const inStock = hasStock && stockStatus !== "Out of Stock";

  return (
    <div className="mx-auto min-w-0 max-w-[1400px] space-y-5">
      {/* Page header */}
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <ButtonLink href="/admin/products" variant="ghost" size="sm" className="mt-1 size-9 shrink-0 px-0 sm:hidden" aria-label="Back"><ArrowLeft className="size-5" aria-hidden /></ButtonLink>
          <div className="min-w-0">
            <p className="hidden text-label text-ink-muted sm:block">Catalog / Products / {creating ? "Add Product" : "Edit Product"}</p>
            <h1 className="flex flex-wrap items-center gap-2 break-words text-page-title font-semibold text-ink">
              {creating ? "Add Product" : "Edit Product"}
              {!creating && <StatusBadge status={product.status} />}
            </h1>
            <p className={cn("mt-0.5 break-words text-small text-ink-muted", creating && "hidden sm:block")}>{creating ? "Same fields as the product editor. SKU and URL are assigned when you save." : `${product.name}${product.sku ? ` · SKU ${product.sku}` : ""}`}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <ButtonLink href="/admin/products" variant="secondary" size="sm" className="hidden sm:inline-flex"><ArrowLeft className="size-4" aria-hidden /> Back</ButtonLink>
          {form.webUrl && <ButtonLink href={`https://bharatagrolink.com/product/${form.webUrl}`} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm"><ExternalLink className="size-4" aria-hidden /> <span className="hidden sm:inline">Preview</span><span className="sr-only sm:hidden">Preview</span></ButtonLink>}
        </div>
      </div>

      {/* Stepper */}
      <nav ref={navRef} aria-label="Product form steps" className="scroll-mt-28">
        {/* Phones and tablets: current step with arrows, a tappable 8-segment progress bar and the step's description. */}
        <div className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)] sm:p-4 2xl:hidden">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => prevStep && goTo(prevStep[0])} disabled={!prevStep} aria-label={prevStep ? `Previous step: ${prevStep[1]}` : "Previous step"} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-surface-muted disabled:opacity-35">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-micro font-medium tracking-wide text-ink-muted uppercase">Step {stepIndex + 1} of {STEPS.length} · {readyPct}% ready</p>
              <p className="flex items-center justify-center gap-1.5 truncate text-subheading font-semibold text-ink">
                {meta.title}
                {stepDone[step] && <CheckCircle2 className="size-4 shrink-0 text-success-ink" aria-label="Complete" />}
              </p>
            </div>
            <button type="button" onClick={() => nextStep && goTo(nextStep[0])} disabled={!nextStep} aria-label={nextStep ? `Next step: ${nextStep[1]}` : "Next step"} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-surface-muted disabled:opacity-35">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-8 gap-1">
            {STEPS.map(([id, label], index) => (
              <button key={id} type="button" onClick={() => goTo(id)} aria-current={id === step ? "step" : undefined} aria-label={`Step ${index + 1}: ${label}`} className="flex h-6 items-center">
                <span className={cn("h-1.5 w-full rounded-full transition-colors duration-300", id === step ? "bg-brand-600" : stepDone[id] ? "bg-success-ink/60" : "bg-line")} />
              </button>
            ))}
          </div>
          <p className="mt-1 text-center text-small text-ink-muted">{meta.text}</p>
        </div>

        <ol ref={stripRef} className="relative hidden snap-x gap-1 2xl:flex overflow-x-auto rounded-xl border border-line bg-surface p-1 shadow-[var(--shadow-card)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map(([id, label, hint], index) => {
            const active = id === step;
            const done = Boolean(stepDone[id]);
            return (
              <li key={id} className="shrink-0 snap-start xl:min-w-0 xl:flex-1">
                <button
                  ref={(node) => { stepButtons.current[id] = node; }}
                  type="button"
                  title={hint}
                  onClick={() => goTo(id)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-small font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:outline-none",
                    active ? "bg-brand-600 text-brand-fg shadow-sm" : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                  )}
                >
                  <span className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-micro font-semibold",
                    active ? "bg-white/20 text-brand-fg" : done ? "bg-success-bg text-success-ink" : "bg-surface-muted text-ink-muted",
                  )}>
                    {done && !active ? <Check className="size-3.5" aria-label="Complete" /> : index + 1}
                  </span>
                  <span className="xl:truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* Current step. Pricing & Tax keeps its original look: its own heading, plain p-4 card, no extra header/footer. */}
        <section className="-mx-3 min-w-0 border-y border-line bg-surface shadow-[var(--shadow-card)] sm:mx-0 sm:rounded-xl sm:border" aria-labelledby={step === "pricing" ? undefined : "product-step-title"} aria-label={step === "pricing" ? "Pricing & Tax" : undefined}>
          {step !== "pricing" && <header className="hidden items-start justify-between gap-3 px-7 pt-6 2xl:flex">
            <div className="flex min-w-0 items-start gap-3">
              <StepIcon className="mt-1 size-5 shrink-0 text-brand-600" aria-hidden />
              <div className="min-w-0">
                <h2 id="product-step-title" className="text-section font-semibold text-ink">{stepIndex + 1}. {meta.title}</h2>
                <p className="text-small text-ink-muted">{meta.text}</p>
              </div>
            </div>
            {stepDone[step] && <Badge tone="success" dot className="mt-1 shrink-0">Complete</Badge>}
          </header>}

          <div key={step} className={step === "pricing" ? "min-w-0 p-4" : "ui-stagger min-w-0 px-4 py-5 sm:px-7 sm:py-6"}>
            {step === "basic" && (
              <div className="space-y-7 sm:space-y-8">
                <div className="grid grid-cols-2 gap-2 sm:gap-3" role="group" aria-label="Product type">
                  {PRODUCT_TYPES.map(({ value, label, text, icon: TypeIcon }) => {
                    const on = form.productType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setForm((current) => ({ ...current, productType: value }))}
                        className={cn(
                          "relative flex min-w-0 flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all duration-200 active:scale-[0.98] sm:flex-row sm:items-center sm:gap-3 sm:px-4",
                          on ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-line hover:border-line-strong hover:bg-surface-muted/60",
                        )}
                      >
                        <TypeIcon className={cn("size-5 shrink-0", on ? "text-brand-600" : "text-ink-muted")} aria-hidden />
                        <span className="min-w-0 flex-1">
                          <span className={cn("block pr-6 text-small font-semibold sm:pr-0 sm:text-body", on ? "text-brand-700" : "text-ink")}>{label}</span>
                          <span className="hidden text-small text-ink-muted sm:block">{text}</span>
                        </span>
                        <span className={cn("absolute top-3 right-3 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:static", on ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line-strong")} aria-hidden>
                          {on && <Check className="size-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <FormGroup title="Product">
                  <Field label="Product Name" required>{({ id }) => <Input id={id} value={form.name} onChange={set("name")} required placeholder="e.g. Organic Neem Oil 1L" />}</Field>
                  <Field label="Brand" required>{({ id }) => <Select id={id} value={form.brandId} onChange={set("brandId")} placeholder="Select" options={options.brands || []} />}</Field>
                  <div className="sm:col-span-2">
                    <Field label="Category" required>
                      {() => (
                        <div className="rounded-xl border border-line">
                          <div className="space-y-2.5 p-3">
                            <div className="relative">
                              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
                              <Input className="min-w-0 pr-28 pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." aria-label="Search categories" />
                              <span className={cn("pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-label", selectedCategory.length ? "font-medium text-brand-700" : "text-ink-muted")}>{selectedCategory.length ? `${selectedCategory.length} selected` : "No category selected"}</span>
                            </div>
                            {selectedCategory.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {selectedCategory.map((item, index) => (
                                  <span key={item.value} className="ui-pop inline-flex max-w-full items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-label font-medium text-brand-700">
                                    <span className="truncate">{item.label}</span>
                                    {index === 0 && <span className="text-micro opacity-70">· Primary</span>}
                                    <button type="button" onClick={() => toggleCategory(item.value)} className="flex size-5 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-brand-600 hover:text-brand-fg" aria-label={`Remove ${item.label}`}>
                                      <X className="size-3.5" aria-hidden />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="max-h-56 overflow-auto border-t border-line p-1.5">
                            {categories.slice(0, 80).map((item) => {
                              const checked = form.categoryIds.includes(item.value);
                              return (
                                <label key={item.value} className={cn("flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-body transition-colors", checked ? "bg-brand-50/70 font-medium text-brand-700" : "text-ink hover:bg-surface-muted")}>
                                  <input type="checkbox" className="size-4 shrink-0 accent-brand-600" checked={checked} onChange={() => toggleCategory(item.value)} />
                                  <span className="min-w-0 break-words">{item.label}</span>
                                </label>
                              );
                            })}
                            {categories.length === 0 && <p className="px-3 py-6 text-center text-small text-ink-muted">No categories match “{query}”.</p>}
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                </FormGroup>

                <FormGroup title="Composition & origin">
                  <Field label="Technical / Chemical Name">{({ id }) => <Input id={id} value={form.chemicalName} onChange={set("chemicalName")} placeholder="Chemical Name" />}</Field>
                  <Field label="Toxicity Level">{({ id }) => <Select id={id} value={form.toxicity} onChange={set("toxicity")} options={TOXICITY} />}</Field>
                  <Field label="Country of Origin">{({ id }) => <Input id={id} value={form.countryOfOrigin} onChange={set("countryOfOrigin")} />}</Field>
                </FormGroup>

                <FormGroup title="Identifiers" text="Filled in automatically.">
                  <Field label="Product SKU" hint={creating ? "Assigned when the product is saved." : "The SKU can't be changed after the product is created."}>{({ id }) => <Input id={id} value={creating ? "" : (product.sku || "")} placeholder={creating ? "Assigned on save" : undefined} readOnly className="bg-surface-muted" />}</Field>
                  <Field label="URL Key">{({ id }) => <Input id={id} value={form.webUrl} onChange={set("webUrl")} placeholder={creating ? "Assigned on save" : undefined} readOnly className="bg-surface-muted" />}</Field>
                </FormGroup>
              </div>
            )}

            {step === "seller" && (
              <div className="space-y-7 sm:space-y-8">
                <FormGroup title="Seller & stock">
                  <Field label="Seller" required={creating}>{({ id }) => creating ? <Select id={id} value={form.vendorId} onChange={set("vendorId")} placeholder="Select seller" options={options.vendors || []} /> : <Input id={id} value={vendorName || product.vendor || ""} readOnly className="bg-surface-muted" />}</Field>
                  <Field label="Available Quantity" required>{({ id }) => <Input id={id} type="number" min="0" value={form.stock} onChange={setStock} />}</Field>
                  <Field label="Stock Status" hint={!hasStock ? "Quantity is 0, so the product is out of stock." : stockStatus === "Out of Stock" ? "Customers cannot buy it while it is out of stock." : undefined}>
                    {({ id, describedBy }) => <Select id={id} value={stockStatus} onChange={set("stockStatus")} disabled={!hasStock} options={STOCK_STATUSES} aria-describedby={describedBy} />}
                  </Field>
                  <Field label="Purchase limit">{({ id }) => <Input id={id} type="number" min="0" value={form.purchaseLimit} onChange={set("purchaseLimit")} />}</Field>
                </FormGroup>

                <FormGroup title="Costs & margin">
                  <Field label="Commission %">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.commission} onChange={set("commission")} />}</Field>
                  <Field label="Ad expense">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.adExpense} onChange={set("adExpense")} />}</Field>
                  <Field label="Office expense">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.officeExpense} onChange={set("officeExpense")} />}</Field>
                  <Field label="Profit">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.profit} onChange={set("profit")} />}</Field>
                </FormGroup>

                <FormGroup title="Mapping & delivery">
                  <Field label="Related product ids">{({ id }) => <Input id={id} value={form.relatedProducts} onChange={set("relatedProducts")} placeholder="Comma-separated" />}</Field>
                  <Field label="Upsell product ids">{({ id }) => <Input id={id} value={form.upsellProducts} onChange={set("upsellProducts")} placeholder="Comma-separated" />}</Field>
                  <Field label="Courier zone">{({ id }) => <Input id={id} value={form.courierZone} onChange={set("courierZone")} />}</Field>
                  <ToggleCard checked={form.selfShip} onChange={set("selfShip")} label="Self ship" text="The seller ships this product themselves." />
                </FormGroup>

                <div className="border-t border-line pt-7">
                  <VariantConfigurations
                    productName={form.name}
                    productType={form.productType}
                    attributes={options.attributes || []}
                    rows={draftVariations}
                    savedRows={creating ? [] : (product.variations || [])}
                    onRows={setDraftVariations}
                    onSaveRow={creating ? undefined : (row) => run(() => saveDraftRow(row))}
                    onEditRow={creating ? undefined : saveEditedRow}
                    onToggleStatus={creating ? undefined : toggleRowStatus}
                    priceLocked={pricingFactors}
                    onDeleteSaved={(variationId) => run(() => deleteVariationAction(product.id, variationId))}
                    onGroups={(groups) => setAttributeGroups((current) => {
                      const map = new Map(current.map((group) => [group.attributeId, new Set(group.values)]));
                      for (const group of groups) {
                        if (!map.has(group.attributeId)) map.set(group.attributeId, new Set());
                        for (const value of group.values) map.get(group.attributeId).add(value);
                      }
                      return [...map.entries()].map(([id, values]) => ({ attributeId: id, values: [...values] }));
                    })}
                    pending={pending}
                    size={form.size}
                    onSize={set("size")}
                  />
                </div>
              </div>
            )}

            {step === "pricing" && pricingFactors && (
              <PricingFactorsStep productId={creating ? undefined : product.id} canEdit={creating || canEditPricing} creating={creating} onPriced={onPriced} onDraft={onPricingDraft} onServices={onServices} onLive={onLive} parcel={pricingParcel} />
            )}

            {step === "pricing" && !pricingFactors && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <h2 className="text-sm font-semibold text-ink sm:col-span-2 lg:col-span-3">3. Pricing & Tax</h2>
                <Field label="MRP (₹)" hint="Maximum Retail Price.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.mrp} onChange={set("mrp")} />}</Field>
                <Field label="NRV (₹)" required hint="Net Realizable Value: what the vendor receives.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.nrv} onChange={set("nrv")} />}</Field>
                <Field label="GST %">{({ id }) => <Input id={id} type="number" min="0" max="100" step="0.01" value={form.gstPercent} onChange={set("gstPercent")} />}</Field>
                <Field label="Display price" hint="Customer price. Leave blank to keep the calculated price.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.salePrice} onChange={set("salePrice")} />}</Field>
                <Field label="HSN Code">{({ id }) => <Input id={id} value={form.hsn} onChange={set("hsn")} />}</Field>
              </div>
            )}

            {step === "media" && (
              <div className="space-y-7 sm:space-y-8">
                {mediaItems.length ? (
                  <div className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
                    {mediaItems.map((item, index) => {
                      const featured = creating ? item.featured : index === 0 && item.url === product.featured;
                      return (
                        <figure key={item.url} className="ui-pop group relative overflow-hidden rounded-xl bg-surface-muted ring-1 ring-line">
                          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/preview URLs, not optimisable by next/image */}
                          <img src={item.url} alt="" className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
                          {featured && <span className="absolute top-2 left-2 rounded-full bg-brand-600 px-2 py-0.5 text-micro font-semibold text-brand-fg shadow">Featured</span>}
                          <button
                            type="button"
                            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-surface/95 px-2 py-1 text-micro font-medium text-danger-ink shadow transition-opacity hover:bg-danger-bg focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                            disabled={pending}
                            onClick={() => {
                              if (creating) {
                                URL.revokeObjectURL(item.url);
                                setDraftImages((rows) => rows.filter((row) => row.url !== item.url));
                                return;
                              }
                              run(() => removeProductImageAction(product.id, item.url));
                            }}
                          >
                            <Trash2 className="size-3.5" aria-hidden /> Remove
                          </button>
                        </figure>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl bg-surface-muted/60 px-4 py-4">
                    <ImagePlus className="size-6 shrink-0 text-brand-600" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-body font-medium text-ink">No images yet</p>
                      <p className="text-small text-ink-muted">Pick a featured image and gallery photos below, then {creating ? "add them" : "upload them"}.</p>
                    </div>
                  </div>
                )}
                <form className="grid min-w-0 gap-x-5 gap-y-5 sm:grid-cols-2" onSubmit={(event) => {
                  event.preventDefault();
                  const featured = event.target.featured.files?.[0];
                  const gallery = [...(event.target.images.files ?? [])];
                  if (creating) {
                    const next = [];
                    if (featured) next.push({ file: featured, url: URL.createObjectURL(featured), featured: true });
                    for (const file of gallery) next.push({ file, url: URL.createObjectURL(file), featured: false });
                    if (next.length) setDraftImages((rows) => [...rows.filter((row) => !(featured && row.featured)), ...next]);
                    event.target.reset();
                    return;
                  }
                  const data = new FormData();
                  if (featured) data.append("featured", featured);
                  for (const file of gallery) data.append("images", file);
                  if ([...data.keys()].length) run(() => uploadProductImagesAction(product.id, data));
                  event.target.reset();
                }}>
                  <Field label="Featured image">{({ id }) => <FileInput id={id} name="featured" accept="image/jpeg,image/png,image/webp" hint="The main photo shown on the product card." />}</Field>
                  <Field label="Gallery">{({ id }) => <FileInput id={id} name="images" accept="image/jpeg,image/png,image/webp" multiple hint="Extra photos for the product page." />}</Field>
                  <Field label="Video URL" className="sm:col-span-2">{({ id }) => <Input id={id} value={form.videoUrl} onChange={set("videoUrl")} placeholder="https://youtube.com/…" />}</Field>
                  <div className="sm:col-span-2">
                    <Button type="submit" loading={pending} className="w-full sm:w-auto"><Upload className="size-4" aria-hidden /> {creating ? "Add images" : "Upload to Cloudflare R2"}</Button>
                  </div>
                </form>
              </div>
            )}

            {step === "shipping" && (
              <div className="space-y-7 sm:space-y-8">
                <FormGroup title="Package">
                  <Field label="Weight (g)">{({ id }) => <Input id={id} type="number" min="0" step="1" value={form.weightKg} onChange={set("weightKg")} />}</Field>
                  <Field label="Unit / pack size">{({ id }) => <Input id={id} value={form.unit} onChange={set("unit")} placeholder="e.g. 1 Kg, 500 ml, Pack of 5" />}</Field>
                </FormGroup>
                <FormGroup title="Dimensions" columns="grid-cols-3">
                  <Field label="Length (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.lengthCm} onChange={set("lengthCm")} />}</Field>
                  <Field label="Width (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.widthCm} onChange={set("widthCm")} />}</Field>
                  <Field label="Height (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.heightCm} onChange={set("heightCm")} />}</Field>
                </FormGroup>
                <FormGroup title="Delivery">
                  <Field label="Shipping charge">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.shipping} onChange={set("shipping")} />}</Field>
                  <ToggleCard checked={form.heavy} onChange={set("heavy")} label="Heavy product" text="Needs heavy-goods handling by the courier." />
                </FormGroup>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-7 sm:space-y-8">
                <div>
                  <p className="mb-2 text-label font-medium text-ink-soft">Product Full Details <span className="text-danger-ink">*</span></p>
                  <ProductHtmlEditor value={form.details} onChange={(details) => setForm((current) => ({ ...current, details }))} />
                </div>

                <div>
                  <SectionHead title="Specifications" text="Name / value rows for the specification table." action={<Button type="button" size="sm" variant="secondary" onClick={() => setForm((current) => ({ ...current, specifications: [...current.specifications, { name: "", value: "" }] }))}><Plus className="size-4" aria-hidden /> Add Attribute</Button>} />
                  <div className="space-y-2">
                    {form.specifications.length === 0 && <p className="rounded-lg bg-surface-muted/60 px-3 py-3 text-small text-ink-muted">No specifications yet.</p>}
                    {form.specifications.map((row, index) => (
                      <div key={index} className="ui-pop grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center">
                        <Input value={row.name} placeholder="Name" aria-label={`Specification ${index + 1} name`} onChange={(event) => setForm((current) => ({ ...current, specifications: current.specifications.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} />
                        <Input className="col-start-1 sm:col-start-auto" value={row.value} placeholder="Value" aria-label={`Specification ${index + 1} value`} onChange={(event) => setForm((current) => ({ ...current, specifications: current.specifications.map((item, i) => i === index ? { ...item, value: event.target.value } : item) }))} />
                        <button type="button" title="Remove" aria-label="Remove" className="col-start-2 row-span-2 row-start-1 flex size-9 items-center justify-center self-center rounded-md text-ink-muted transition-colors hover:bg-danger-bg hover:text-danger-ink sm:row-span-1 sm:col-start-auto sm:row-start-auto" onClick={() => setForm((current) => ({ ...current, specifications: current.specifications.filter((_, i) => i !== index) }))}>
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Product Usage">{({ id }) => <Textarea id={id} value={form.usage} onChange={set("usage")} rows={4} placeholder="Describe how to use this product" />}</Field>

                <div>
                  <SectionHead title="Frequently Asked Questions" text="Each question is followed by its answer." action={<Button type="button" size="sm" variant="secondary" onClick={() => setForm((current) => ({ ...current, faqs: [...current.faqs, { question: "", answer: "" }] }))}><Plus className="size-4" aria-hidden /> Add Question</Button>} />
                  <div className="space-y-3">
                    {form.faqs.length === 0 && <p className="rounded-lg bg-surface-muted/60 px-3 py-3 text-small text-ink-muted">No questions yet.</p>}
                    {form.faqs.map((row, index) => (
                      <div key={row.id || `new-${index}`} className="ui-pop flex gap-3">
                        <span className="mt-2 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-micro font-semibold text-brand-700">{index + 1}</span>
                        <div className="min-w-0 flex-1 space-y-2">
                          <Input value={row.question} placeholder="Enter your question here..." aria-label={`Question ${index + 1}`} onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, i) => i === index ? { ...item, question: event.target.value } : item) }))} />
                          <Textarea value={row.answer} rows={2} placeholder="Enter the answer here..." aria-label={`Answer ${index + 1}`} onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, i) => i === index ? { ...item, answer: event.target.value } : item) }))} />
                        </div>
                        <button type="button" title="Remove" aria-label="Remove" className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-bg hover:text-danger-ink" onClick={() => setForm((current) => ({ ...current, faqs: current.faqs.filter((_, i) => i !== index) }))}>
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "seo" && (
              <div className="space-y-7 sm:space-y-8">
                <FormGroup title="Offer & policy">
                  <Field label="Offer title">{({ id }) => <Input id={id} value={form.offerTitle} onChange={set("offerTitle")} />}</Field>
                  <Field label="Offer short description">{({ id }) => <Input id={id} value={form.offerShort} onChange={set("offerShort")} />}</Field>
                  <Field label="Return policy">{({ id }) => <Select id={id} value={form.returnPolicyId} onChange={set("returnPolicyId")} placeholder="None" options={options.returnPolicyOptions || []} />}</Field>
                  <Field label="URL Key">{({ id }) => <Input id={id} value={form.webUrl} readOnly className="bg-surface-muted" />}</Field>
                </FormGroup>

                <FormGroup title="Search engine meta" text="What shows up in Google results and the browser tab for this product's page.">
                  <Field label="Meta title" hint={`${form.metaTitle.length}/60 characters`}>{({ id }) => <Input id={id} value={form.metaTitle} onChange={set("metaTitle")} placeholder={form.name || "Defaults to the product name"} />}</Field>
                  <Field label="Meta keywords">{({ id }) => <Input id={id} value={form.metaKeywords} onChange={set("metaKeywords")} placeholder="Comma-separated" />}</Field>
                  <div className="sm:col-span-2">
                    <Field label="Meta description" hint={`${form.metaDescription.length}/160 characters`}>{({ id }) => <Textarea id={id} rows={3} value={form.metaDescription} onChange={set("metaDescription")} placeholder="Defaults to the product description" />}</Field>
                  </div>
                  <div className="rounded-xl bg-surface-muted/60 p-4 sm:col-span-2">
                    <p className="mb-1.5 text-micro font-semibold tracking-wide text-ink-muted uppercase">Google preview</p>
                    <p className="truncate text-small text-success-ink">bharatagrolink.com › product › {form.webUrl || "url-assigned-on-save"}</p>
                    <p className="truncate text-subheading font-medium text-info-ink">{seoTitle}</p>
                    <p className="line-clamp-2 text-small text-ink-soft">{seoDescription}</p>
                  </div>
                </FormGroup>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-5">
                <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3", readyPct === 100 ? "bg-success-bg text-success-ink" : "bg-warning-bg text-warning-ink")}>
                  {readyPct === 100 ? <CheckCircle2 className="size-5 shrink-0" aria-hidden /> : <CircleAlert className="size-5 shrink-0" aria-hidden />}
                  <p className="text-body font-medium">{readyPct === 100 ? "Everything needed for the listing is filled in." : `Listing is ${readyPct}% ready. Fill the items marked Missing before publishing.`}</p>
                </div>
                <div className="divide-y divide-line" role="list">
                  {[
                    ["Name", form.name, "basic"], ["Brand", brandLabel, "basic"],
                    ["Category", selectedCategory.map((item) => item.label).join(", "), "basic"], ["Type", form.productType, "basic"], ["MRP", form.mrp, "pricing"], ["NRV", form.nrv, "pricing"],
                    ["Display price", form.salePrice ? formatINR(form.salePrice) : (pricingFactors && creating ? "Set on Pricing & Tax" : ""), "pricing"],
                    ["Stock", form.stock, "seller"], ["Stock Status", stockStatus, "seller"], ["Images", photos.length, "media"],
                  ].map(([label, value, target]) => (
                    <button key={label} type="button" role="listitem" onClick={() => goTo(target)} className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-body transition-colors hover:bg-surface-muted/70">
                      <span className="w-28 shrink-0 text-ink-muted sm:w-40">{label}</span>
                      <span className="min-w-0 flex-1 break-words font-medium text-ink">{value || <Badge tone="warning">Missing</Badge>}</span>
                      <span className="flex shrink-0 items-center gap-0.5 text-label font-medium text-brand-700 opacity-70 transition-opacity group-hover:opacity-100">Edit <ChevronRight className="size-3.5" aria-hidden /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {step !== "pricing" && <footer className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-7 sm:py-4">
            {prevStep ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => goTo(prevStep[0])}><ChevronLeft className="size-4" aria-hidden /> {prevStep[1]}</Button>
            ) : <span />}
            {nextStep && (
              <Button type="button" size="sm" variant="secondary" onClick={() => goTo(nextStep[0])}><span className="hidden sm:inline">Next:</span> {nextStep[1]} <ChevronRight className="size-4" aria-hidden /></Button>
            )}
          </footer>}
        </section>

        {/* Summary panel: always shown beside the form on wide screens, tap-to-open below it elsewhere */}
        <aside className="min-w-0 xl:sticky xl:top-20 xl:self-start">
          <button
            type="button"
            onClick={() => setSummaryOpen((open) => !open)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-surface-muted/50 xl:hidden"
          >
            <ReadinessRing pct={readyPct} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block text-body font-semibold text-ink">Listing summary</span>
              <span className="block truncate text-small text-ink-muted">{missing.length ? `Missing: ${missing.map(([label]) => label).join(", ")}` : "Ready to publish"} · Preview & margins</span>
            </span>
            <ChevronDown className={cn("size-5 shrink-0 text-ink-muted transition-transform duration-200", summaryOpen && "rotate-180")} aria-hidden />
          </button>

          <div className={cn("mt-3 space-y-4 xl:mt-0 xl:block", summaryOpen ? "ui-pop block" : "hidden")}>
            {/* Product preview + listing readiness */}
            <div className="rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
              <p className="text-label font-semibold text-ink-muted">Product Preview</p>
              <div className="mt-3 flex gap-3">
                <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted ring-1 ring-line">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/preview URLs, not optimisable by next/image */}
                  {photos[0] ? <img src={photos[0]} alt="" className="size-full bg-white object-contain" /> : <div className="flex size-full flex-col items-center justify-center text-micro text-ink-muted"><ImageIcon className="mb-0.5 size-5" aria-hidden />No image</div>}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-2 break-words text-body font-semibold text-ink">{form.name || "Untitled product"}</p>
                  <p className="truncate text-label text-ink-muted">{selectedCategory[0]?.label || "No category"} · SKU {creating ? "assigned on save" : (product.sku || "—")}</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-subheading font-semibold text-ink tabular-nums">{form.salePrice ? formatINR(form.salePrice) : form.mrp ? formatINR(form.mrp) : "—"}</span>
                    {form.salePrice && Number(form.mrp) > Number(form.salePrice) ? <span className="text-label text-ink-muted line-through tabular-nums">{formatINR(form.mrp)}</span> : null}
                  </div>
                  <p className={cn("inline-flex items-center gap-1.5 text-label font-medium", inStock ? "text-success-ink" : "text-danger-ink")}>
                    <span className={cn("size-1.5 rounded-full", inStock ? "bg-success-ink" : "bg-danger-ink")} aria-hidden />
                    {hasStock ? `${stockStatus} · Qty ${form.stock}` : "Out of Stock"}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-line pt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-label font-semibold text-ink-muted">Listing Readiness</p>
                  <p className="text-subheading font-semibold text-ink tabular-nums">{readyPct}%</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden>
                  <div className={cn("h-full rounded-full transition-[width] duration-500", readyPct === 100 ? "bg-success-ink" : "bg-brand-600")} style={{ width: `${readyPct}%` }} />
                </div>
                <p className="mt-2 text-label text-ink-muted">Name, brand, category, SKU, MRP, NRV, stock and a photo.</p>
                {missing.length ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {missing.map(([label, , target]) => (
                      <button key={label} type="button" onClick={() => goTo(target)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-line-strong px-2.5 py-0.5 text-label text-ink-soft transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
                        <Plus className="size-3" aria-hidden /> {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-label font-medium text-success-ink"><CheckCircle2 className="size-4" aria-hidden /> All set</p>
                )}
              </div>
            </div>

            {/* Economics & Take Rate Alert, with the seller's selected services */}
            {(() => {
              const display = Number(form.salePrice) || Number(product.display) || 0;
              const nrv = Number(form.nrv) || Number(product.nrv) || 0;
              let takeRate = live ? Number(live.takeRate) : Number(product.takeRate);
              if ((!takeRate || Number.isNaN(takeRate)) && display > 0 && nrv > 0) {
                takeRate = Math.round(((display - nrv) / display) * 10000) / 100;
              }
              const isAlert = !Number.isNaN(takeRate) && takeRate > 0 && takeRate < 35;
              const cm = live ? Number(live.margin) || 0 : Number(product.contributionMargin) || 0;
              const serviceChargePct = live?.serviceChargeBps != null ? `${(live.serviceChargeBps / 100).toFixed(2)}%` : null;
              return (
                <div className="space-y-3 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
                  <p className="text-label font-semibold text-ink-muted">Economics & Margins</p>
                  {takeRate > 0 ? (
                    isAlert ? (
                      <div className="flex items-start gap-2 rounded-lg bg-danger-bg px-3 py-2 text-label text-danger-ink">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        <div>
                          <span className="font-bold">RED ALERT: Take Rate {takeRate}%</span>
                          <p className="text-micro font-normal">Below 35% minimum threshold!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-success-bg px-3 py-2 text-label font-semibold text-success-ink">
                        Take Rate: {takeRate}% (Healthy)
                      </div>
                    )
                  ) : null}
                  <dl className="space-y-1.5 text-label">
                    {serviceChargePct ? <Row label="Service charge of order value" value={serviceChargePct} strong /> : null}
                    <Row label="Contribution Margin" value={formatINR(cm)} strong tone={cm < 0 ? "text-danger-ink font-bold" : "text-success-ink"} />
                    <Row label="Shipping Cost" value={formatINR(live?.shipping != null ? Number(live.shipping) : product.shippingCost || 70)} />
                    <Row label="COD Handling" value={formatINR(live?.cod != null ? Number(live.cod) : product.codHandling || 30)} />
                    <Row label="TCS (1%)" value={formatINR(live?.tcs != null ? Number(live.tcs) : product.tcs || Math.round(display * 0.01))} />
                  </dl>
                  <div className="border-t border-line pt-3">
                    <p className="text-label font-semibold text-ink-muted">Seller Selected Services</p>
                    {services?.length ? (
                      <ul className="mt-1.5 divide-y divide-line">
                        {services.map((s, idx) => (
                          <li key={s.code ?? idx} className="flex items-baseline justify-between gap-2 py-1.5 text-label">
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-ink">{s.name}</span>
                              <span className="block truncate text-micro text-ink-muted">{s.category || "—"}</span>
                            </span>
                            <span className="shrink-0 text-ink tabular-nums">{s.chargeType === "FIXED_PER_UNIT" ? `₹${s.chargeValue}/unit` : `${s.chargeValue}%`}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-label text-ink-muted">No services selected.</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </aside>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-20 -mx-3 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4 sm:shadow-[var(--shadow-pop)]">
        <div className="flex items-center gap-2">
          <p className="hidden min-w-0 flex-1 truncate text-small text-ink-muted sm:block">
            <span className="font-medium text-ink">{STEPS[stepIndex][1]}</span> · Step {stepIndex + 1} of {STEPS.length} · {readyPct}% ready
          </p>
          <Button className="flex-1 sm:flex-none" loading={pending} onClick={() => save(false)}>Save as Draft</Button>
          <Button className="flex-1 sm:flex-none" variant="primary" loading={pending} onClick={() => save(true)}>Save & Publish</Button>
        </div>
      </div>
    </div>
  );
}

function FormGroup({ title, text, columns = "sm:grid-cols-2", children }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 w-full">
        <span className="block text-subheading font-semibold text-ink">{title}</span>
        {text && <span className="block text-small text-ink-muted">{text}</span>}
      </legend>
      <div className={cn("grid gap-x-5 gap-y-5", columns)}>{children}</div>
    </fieldset>
  );
}

function SectionHead({ title, text, action }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div className="min-w-0">
        <h3 className="text-subheading font-semibold text-ink">{title}</h3>
        <p className="text-small text-ink-muted">{text}</p>
      </div>
      {action}
    </div>
  );
}

function ToggleCard({ checked, onChange, label, text }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 self-end rounded-lg border px-3 py-2.5 transition-colors", checked ? "border-brand-600 bg-brand-50/60" : "border-line hover:bg-surface-muted/60")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 size-4 shrink-0 accent-brand-600" />
      <span className="min-w-0">
        <span className="block text-body font-medium text-ink">{label}</span>
        <span className="block text-label text-ink-muted">{text}</span>
      </span>
    </label>
  );
}

function Row({ label, value, strong = false, tone }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={cn("tabular-nums text-ink-soft", strong && "font-semibold", tone)}>{value}</dd>
    </div>
  );
}

function ReadinessRing({ pct, size = "md" }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const tone = pct === 100 ? "text-success-ink" : pct >= 50 ? "text-brand-600" : "text-warning-ink";
  const box = size === "sm" ? "size-11" : "size-16";
  return (
    <div className={cn("relative shrink-0", box)} role="img" aria-label={`${pct}% ready`}>
      <svg viewBox="0 0 64 64" className={cn("-rotate-90", box)}>
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-surface-muted" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" strokeLinecap="round" stroke="currentColor" className={cn("transition-[stroke-dashoffset] duration-500", tone)} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center font-semibold text-ink tabular-nums", size === "sm" ? "text-micro" : "text-subheading")}>{pct}%</span>
    </div>
  );
}
