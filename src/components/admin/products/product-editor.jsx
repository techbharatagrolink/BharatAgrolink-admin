"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { createCatalogProductAction, deleteVariationAction, removeProductImageAction, saveProductAction, saveProductAttributesAction, saveVariationAction, setProductStatusAction, uploadProductImagesAction } from "@/lib/actions/admin/products";
import { ProductHtmlEditor } from "@/components/admin/products/product-html-editor";
import { toVariantGrams, VariantConfigurations } from "@/components/admin/products/variant-configurations";

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

const TOXICITY = [
  { value: "", label: "Select.." },
  { value: "poison_heavy", label: "Poison heavy" },
  { value: "poison_normal", label: "Poison normal" },
  { value: "caution", label: "Caution" },
  { value: "danger", label: "Danger" },
];

const emptyForm = {
  name: "", productType: "simple", brandId: "", categoryId: "", categoryIds: [], chemicalName: "", toxicity: "",
  countryOfOrigin: "India", webUrl: "", stock: "", mrp: "", nrv: "", gstPercent: "", hsn: "", salePrice: "",
  videoUrl: "", weightKg: "", lengthCm: "", widthCm: "", heightCm: "", shipping: "", heavy: false, description: "",
  details: "", usage: "", offerTitle: "", offerShort: "", returnPolicyId: "", purchaseLimit: "", relatedProducts: "",
  upsellProducts: "", commission: "", adExpense: "", officeExpense: "", profit: "", selfShip: false, chemicalFormula: "",
  courierZone: "", size: "", specifications: [], faqs: [], vendorId: "",
};

function imagesOf(product) {
  return [...new Set([product.featured, ...(product.images || [])].filter(Boolean))];
}

/** The PHP edit_product.php wizard: eight sections, preview, draft and publish. Create uses the same columns. */
export function ProductEditor({ product: source, options, vendorName, mode = "edit" }) {
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
  }));
  const [draftVariations, setDraftVariations] = useState([]);
  const [attributeGroups, setAttributeGroups] = useState([]);
  const [draftImages, setDraftImages] = useState([]);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

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

  const persistVariations = async (id) => {
    for (const row of draftVariations) {
      const values = row.values?.length ? row.values : [row.label];
      const added = await saveVariationAction(id, {
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
      });
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
      if (!(Number(form.mrp) > 0)) return { ok: false, message: "Enter the MRP." };
      if (form.stock === "") return { ok: false, message: "Enter the available quantity." };
      const policy = (options.returnPolicyOptions || []).find((item) => item.value === form.returnPolicyId);
      const created = await createCatalogProductAction({
        name: form.name,
        vendorId: form.vendorId,
        categoryId: form.categoryIds[0],
        brandId: form.brandId,
        hsn: form.hsn,
        stock: form.stock,
        weightKg: form.weightKg,
        returnPolicy: policy?.label || "",
        mrp: form.mrp,
        salePrice: form.salePrice,
        nrv: form.nrv,
        gstPercent: form.gstPercent,
      });
      if (!created.ok) return created;
      const saved = await saveProductAction(created.id, form);
      if (!saved.ok) return saved;
      const variants = await persistVariations(created.id);
      if (!variants.ok) return variants;
      if (draftImages.length) {
        const data = new FormData();
        const featured = draftImages.find((item) => item.featured);
        if (featured) data.append("featured", featured.file);
        for (const item of draftImages.filter((item) => !item.featured)) data.append("images", item.file);
        const uploaded = await uploadProductImagesAction(created.id, data);
        if (!uploaded.ok) return uploaded;
      }
      if (publish) {
        const published = await setProductStatusAction(created.id, "approve", "Published from the product editor");
        router.push(`/admin/products/${created.id}`);
        return published.ok ? published : { ok: true, message: "Product created. It stays pending until it is approved." };
      }
      router.push(`/admin/products/${created.id}`);
      return created;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-ink-muted">Catalog / Products / {creating ? "Add Product" : "Edit Product"}</p>
          <h1 className="text-xl font-semibold text-ink">{creating ? "Add Product" : "Edit Product"} {!creating && <span className="ml-2 align-middle text-xs font-medium text-success-ink">{product.status}</span>}</h1>
          <p className="text-sm text-ink-muted">{creating ? "Same fields as the product editor. SKU and URL are assigned when you save." : `${product.name}${product.sku ? ` · SKU ${product.sku}` : ""}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/products" variant="secondary" size="sm">Back</ButtonLink>
          <Button size="sm" loading={pending} onClick={() => save(false)}>Save as Draft</Button>
          {form.webUrl && <ButtonLink href={`https://bharatagrolink.com/product/${form.webUrl}`} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">Preview</ButtonLink>}
          <Button size="sm" variant="primary" loading={pending} onClick={() => save(true)}>Save & Publish</Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STEPS.map(([id, label, hint], index) => (
          <button key={id} type="button" onClick={() => setStep(id)} className={`min-w-36 rounded-lg border px-3 py-2 text-left ${step === id ? "border-brand-600 bg-brand-50" : "border-line bg-surface"}`}>
            <span className="text-xs text-ink-muted">{index + 1}</span>
            <span className="block text-sm font-semibold text-ink">{label}</span>
            <span className="block text-xs text-ink-muted">{hint}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-line bg-surface p-4">
          {step === "basic" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <h2 className="sm:col-span-2 text-sm font-semibold text-ink">1. Basic Information</h2>
              <div className="sm:col-span-2 flex gap-2">
                {[["simple", "Simple Product"], ["configure", "Configurable Product"]].map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setForm((current) => ({ ...current, productType: value }))} className={`rounded-lg border px-3 py-2 text-sm ${form.productType === value ? "border-brand-600 bg-brand-50 font-semibold" : "border-line"}`}>{label}</button>
                ))}
              </div>
              <Field label="Product Name" required>{({ id }) => <Input id={id} value={form.name} onChange={set("name")} required />}</Field>
              <Field label="Brand" required>{({ id }) => <Select id={id} value={form.brandId} onChange={set("brandId")} placeholder="Select" options={options.brands || []} />}</Field>
              <div className="sm:col-span-2">
                <Field label="Category" required>
                  {() => (
                    <div className="rounded-lg border border-line">
                      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." />
                        <span className="shrink-0 text-xs text-ink-muted">{selectedCategory.length ? `${selectedCategory.length} selected` : "No category selected"}</span>
                      </div>
                      <div className="max-h-56 overflow-auto p-2">
                        {categories.slice(0, 80).map((item) => (
                          <label key={item.value} className="flex items-center gap-2 px-2 py-1 text-sm">
                            <input type="checkbox" checked={form.categoryIds.includes(item.value)} onChange={() => setForm((current) => { const categoryIds = current.categoryIds.includes(item.value) ? current.categoryIds.filter((id) => id !== item.value) : [...current.categoryIds, item.value]; return { ...current, categoryIds, categoryId: categoryIds[0] || "" }; })} />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </Field>
              </div>
              <Field label="Technical / Chemical Name">{({ id }) => <Input id={id} value={form.chemicalName} onChange={set("chemicalName")} placeholder="Chemical Name" />}</Field>
              <Field label="Toxicity Level">{({ id }) => <Select id={id} value={form.toxicity} onChange={set("toxicity")} options={TOXICITY} />}</Field>
              <Field label="Country of Origin">{({ id }) => <Input id={id} value={form.countryOfOrigin} onChange={set("countryOfOrigin")} />}</Field>
              <Field label="Product SKU" hint={creating ? "Assigned when the product is saved." : "The SKU can't be changed after the product is created."}>{({ id }) => <Input id={id} value={creating ? "" : (product.sku || "")} placeholder={creating ? "Assigned on save" : undefined} readOnly />}</Field>
              <Field label="URL Key">{({ id }) => <Input id={id} value={form.webUrl} onChange={set("webUrl")} placeholder={creating ? "Assigned on save" : undefined} readOnly />}</Field>
            </div>
          )}

          {step === "seller" && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-ink">2. Seller & Variants</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Seller" required={creating}>{({ id }) => creating ? <Select id={id} value={form.vendorId} onChange={set("vendorId")} placeholder="Select seller" options={options.vendors || []} /> : <Input id={id} value={vendorName || product.vendor || ""} readOnly />}</Field>
                <Field label="Available Quantity" required>{({ id }) => <Input id={id} type="number" min="0" value={form.stock} onChange={set("stock")} />}</Field>
                <Field label="Stock Status">{() => <Input value={Number(form.stock) > 0 ? "In Stock" : "Out of Stock"} readOnly />}</Field>
                <Field label="Purchase limit">{({ id }) => <Input id={id} type="number" min="0" value={form.purchaseLimit} onChange={set("purchaseLimit")} />}</Field>
                <Field label="Commission %">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.commission} onChange={set("commission")} />}</Field>
                <Field label="Ad expense">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.adExpense} onChange={set("adExpense")} />}</Field>
                <Field label="Office expense">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.officeExpense} onChange={set("officeExpense")} />}</Field>
                <Field label="Profit">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.profit} onChange={set("profit")} />}</Field>
                <Field label="Related product ids">{({ id }) => <Input id={id} value={form.relatedProducts} onChange={set("relatedProducts")} />}</Field>
                <Field label="Upsell product ids">{({ id }) => <Input id={id} value={form.upsellProducts} onChange={set("upsellProducts")} />}</Field>
                <Field label="Courier zone">{({ id }) => <Input id={id} value={form.courierZone} onChange={set("courierZone")} />}</Field>
                <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={form.selfShip} onChange={set("selfShip")} /> Self ship</label>
              </div>
              <VariantConfigurations
                productName={form.name}
                productType={form.productType}
                attributes={options.attributes || []}
                rows={draftVariations}
                savedRows={creating ? [] : (product.variations || [])}
                onRows={setDraftVariations}
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
          )}

          {step === "pricing" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <h2 className="sm:col-span-3 text-sm font-semibold text-ink">3. Pricing & Tax</h2>
              <Field label="MRP (₹)" hint="Maximum Retail Price.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.mrp} onChange={set("mrp")} />}</Field>
              <Field label="NRV (₹)" required hint="Net Realizable Value: what the vendor receives.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.nrv} onChange={set("nrv")} />}</Field>
              <Field label="GST %">{({ id }) => <Input id={id} type="number" min="0" max="100" step="0.01" value={form.gstPercent} onChange={set("gstPercent")} />}</Field>
              <Field label="Display price" hint="Customer price. Leave blank to keep the calculated price.">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.salePrice} onChange={set("salePrice")} />}</Field>
              <Field label="HSN Code">{({ id }) => <Input id={id} value={form.hsn} onChange={set("hsn")} />}</Field>
            </div>
          )}

          {step === "media" && (
            <div>
              <h2 className="text-sm font-semibold text-ink">4. Media</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(creating ? draftImages : photos.map((url) => ({ url }))).map((item) => (
                  <div key={item.url} className="w-28">
                    <img src={item.url} alt="" className="h-28 w-28 rounded-lg border object-cover" />
                    <button type="button" className="mt-1 text-xs text-danger-ink" disabled={pending} onClick={() => {
                      if (creating) {
                        URL.revokeObjectURL(item.url);
                        setDraftImages((rows) => rows.filter((row) => row.url !== item.url));
                        return;
                      }
                      run(() => removeProductImageAction(product.id, item.url));
                    }}>Remove</button>
                  </div>
                ))}
              </div>
              <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={(event) => {
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
                <Field label="Featured image">{({ id }) => <Input id={id} name="featured" type="file" accept="image/jpeg,image/png,image/webp" />}</Field>
                <Field label="Gallery">{({ id }) => <Input id={id} name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple />}</Field>
                <Field label="Video URL" className="sm:col-span-2">{({ id }) => <Input id={id} value={form.videoUrl} onChange={set("videoUrl")} />}</Field>
                <Button type="submit" loading={pending}>{creating ? "Add images" : "Upload to Cloudflare R2"}</Button>
              </form>
            </div>
          )}

          {step === "shipping" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <h2 className="sm:col-span-3 text-sm font-semibold text-ink">5. Shipping</h2>
              <Field label="Weight (kg)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.weightKg} onChange={set("weightKg")} />}</Field>
              <Field label="Length (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.lengthCm} onChange={set("lengthCm")} />}</Field>
              <Field label="Width (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.widthCm} onChange={set("widthCm")} />}</Field>
              <Field label="Height (cm)">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.heightCm} onChange={set("heightCm")} />}</Field>
              <Field label="Shipping charge">{({ id }) => <Input id={id} type="number" min="0" step="0.01" value={form.shipping} onChange={set("shipping")} />}</Field>
              <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={form.heavy} onChange={set("heavy")} /> Heavy product</label>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-ink">6. Product Details</h2>
                <p className="text-xs text-ink-muted">Description, specifications, usage and FAQ</p>
              </div>
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-ink-soft">Product Full Details <span className="text-danger-ink">*</span></p>
                <ProductHtmlEditor value={form.details} onChange={(details) => setForm((current) => ({ ...current, details }))} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Specifications</h3>
                    <p className="text-xs text-ink-muted">Name / value rows for the specification table.</p>
                  </div>
                  <Button type="button" size="sm" onClick={() => setForm((current) => ({ ...current, specifications: [...current.specifications, { name: "", value: "" }] }))}>Add Attribute</Button>
                </div>
                <div className="space-y-2">
                  {form.specifications.map((row, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2">
                      <Input value={row.name} placeholder="Name" onChange={(event) => setForm((current) => ({ ...current, specifications: current.specifications.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} />
                      <Input value={row.value} placeholder="Value" onChange={(event) => setForm((current) => ({ ...current, specifications: current.specifications.map((item, i) => i === index ? { ...item, value: event.target.value } : item) }))} />
                      <Button type="button" size="sm" variant="secondary" onClick={() => setForm((current) => ({ ...current, specifications: current.specifications.filter((_, i) => i !== index) }))}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>
              <Field label="Product Usage">{({ id }) => <Textarea id={id} value={form.usage} onChange={set("usage")} rows={4} placeholder="Describe how to use this product" />}</Field>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Frequently Asked Questions</h3>
                    <p className="text-xs text-ink-muted">Each question is followed by its answer.</p>
                  </div>
                  <Button type="button" size="sm" onClick={() => setForm((current) => ({ ...current, faqs: [...current.faqs, { question: "", answer: "" }] }))}>Add Question</Button>
                </div>
                <div className="space-y-3">
                  {form.faqs.map((row, index) => (
                    <div key={row.id || `new-${index}`} className="space-y-2 rounded-lg border border-line p-3">
                      <Input value={row.question} placeholder="Enter your question here..." onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, i) => i === index ? { ...item, question: event.target.value } : item) }))} />
                      <Textarea value={row.answer} rows={3} placeholder="Enter the answer here..." onChange={(event) => setForm((current) => ({ ...current, faqs: current.faqs.map((item, i) => i === index ? { ...item, answer: event.target.value } : item) }))} />
                      <div className="flex justify-end"><Button type="button" size="sm" variant="secondary" onClick={() => setForm((current) => ({ ...current, faqs: current.faqs.filter((_, i) => i !== index) }))}>Remove</Button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "seo" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <h2 className="sm:col-span-2 text-sm font-semibold text-ink">7. SEO & Mapping</h2>
              <Field label="Offer title">{({ id }) => <Input id={id} value={form.offerTitle} onChange={set("offerTitle")} />}</Field>
              <Field label="Offer short description">{({ id }) => <Input id={id} value={form.offerShort} onChange={set("offerShort")} />}</Field>
              <Field label="Return policy">{({ id }) => <Select id={id} value={form.returnPolicyId} onChange={set("returnPolicyId")} placeholder="None" options={options.returnPolicyOptions || []} />}</Field>
              <Field label="URL Key">{({ id }) => <Input id={id} value={form.webUrl} readOnly />}</Field>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-2 text-sm">
              <h2 className="text-sm font-semibold text-ink">8. Review</h2>
              {[
                ["Name", form.name], ["Brand", (options.brands || []).find((item) => item.value === form.brandId)?.label],
                ["Category", selectedCategory.map((item) => item.label).join(", ")], ["Type", form.productType], ["MRP", form.mrp], ["NRV", form.nrv],
                ["Stock", form.stock], ["Images", photos.length],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-line py-1.5"><span className="text-ink-muted">{label}</span><span className="font-medium text-ink">{value || "—"}</span></div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-3">
            <p className="text-xs font-semibold text-ink-muted">Product Preview</p>
            {photos[0] ? <img src={photos[0]} alt="" className="mt-2 h-40 w-full rounded-lg object-contain" /> : <div className="mt-2 flex h-40 items-center justify-center rounded-lg bg-surface-muted text-xs text-ink-muted">No image</div>}
            <p className="mt-2 text-sm font-semibold text-ink">{form.name || "Untitled product"}</p>
            <p className="text-xs text-ink-muted">{selectedCategory[0]?.label || "No category"} · SKU {creating ? "assigned on save" : (product.sku || "—")}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{form.salePrice ? formatINR(form.salePrice) : form.mrp ? formatINR(form.mrp) : "—"}</p>
            <p className="text-xs text-ink-muted">{Number(form.stock) > 0 ? `In stock · Qty ${form.stock}` : "Out of stock"}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-3">
            <p className="text-xs font-semibold text-ink-muted">Listing Readiness</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{readyPct}%</p>
            <p className="text-xs text-ink-muted">Name, brand, category, SKU, MRP, NRV, stock and a photo.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
