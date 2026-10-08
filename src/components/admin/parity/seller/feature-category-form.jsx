"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { createFeatureCategoryAction, updateFeatureCategoryAction } from "@/lib/actions/admin/parity/seller";
import { ProductPicker } from "./product-picker";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const PERMISSION = "catalog.featureCategories";

function ImageInput({ name, label, current, required, error }) {
  const [preview, setPreview] = useState(null);
  const shown = preview || current;
  return (
    <Field label={label} required={required} error={error} hint="JPG, PNG or WebP, 5 MB max.">
      {({ id, invalid, describedBy }) => (
        <div className="space-y-2">
          <Input
            id={id}
            type="file"
            name={name}
            accept={IMAGE_ACCEPT}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className="h-auto py-1.5"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
          {shown && <Image src={shown} alt="" width={160} height={90} unoptimized className="h-20 w-auto rounded-md border border-line object-contain" />}
        </div>
      )}
    </Field>
  );
}

/** The add_feature_category.php category tree: only leaf categories can be ticked, one at a time. */
function CategoryTree({ categories, value, onChange, disabled }) {
  const [filter, setFilter] = useState("");
  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? categories.filter((c) => c.name.toLowerCase().includes(q)) : categories;
  }, [categories, filter]);
  return (
    <div className="space-y-2">
      {!disabled && <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search for names.." aria-label="Search categories" />}
      <ul className="max-h-72 overflow-y-auto rounded-lg border border-line p-2 text-[13px]">
        {shown.map((c) => (
          <li key={c.id} style={{ paddingLeft: filter ? 0 : c.depth * 16 }} className="py-0.5">
            {c.selectable ? (
              <Checkbox label={c.name} checked={value === String(c.id)} disabled={disabled} onChange={(e) => onChange(e.target.checked ? String(c.id) : "")} />
            ) : (
              <span className="font-semibold text-ink">{c.name}</span>
            )}
          </li>
        ))}
        {!shown.length && <li className="py-1 text-ink-muted">No categories match.</li>}
      </ul>
    </div>
  );
}

const toForm = (c) => ({
  name: c?.name ?? "",
  description: c?.description ?? "",
  catType: c?.catType ?? "",
  mainCategory: c?.mainCategory === "1",
  parentCategory: c?.parentCategory ? String(c.parentCategory) : "",
  categoryId: c?.otherCatId ? String(c.otherCatId) : "",
  chemicalFormulaTitle: c?.chemicalFormulaTitle ?? "",
  metaTitle: c?.metaTitle ?? "",
  metaKeywords: c?.metaKeywords ?? "",
  metaDescription: c?.metaDescription ?? "",
});

export function FeatureCategoryForm({ category, options, canSave }) {
  const router = useRouter();
  const { notify } = useToast();
  const editing = Boolean(category);
  const [form, setForm] = useState(() => toForm(category));
  const [products, setProducts] = useState(category?.products ?? []);
  const [formulaProducts, setFormulaProducts] = useState(category?.chemicalFormulaProducts ?? []);
  const [errors, setErrors] = useState({});
  const [saving, startSaving] = useTransition();
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const multi = form.catType === "2";
  const parent = multi && form.mainCategory;
  const locked = editing || !canSave;

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let problem = null;
    if (!form.name.trim()) problem = ["name", "Please enter category name"];
    else if (!products.length) problem = ["products", "Please Add Product."];
    else if (!editing && !form.catType) problem = ["catType", "Select a category type."];
    else if (!editing && !form.categoryId) problem = ["categoryId", "Please Select atleast one Category."];
    else if (!editing) {
      for (const [name, label] of [["cat_img", "Category Image"], ["banner_img_desktop", "Desktop View Image"], ["banner_img_mobile", "Mobile View Image"]]) {
        if (!data.get(name)?.size) {
          problem = [name, `${label} is required.`];
          break;
        }
      }
    }
    if (problem) {
      setErrors({ [problem[0]]: problem[1] });
      notify({ message: problem[1], tone: "error" });
      return;
    }
    setErrors({});
    data.set("name", form.name.trim());
    data.set("description", form.description.trim());
    data.set("products", products.map((p) => p.sku).join(","));
    data.set("metaTitle", form.metaTitle);
    data.set("metaKeywords", form.metaKeywords);
    data.set("metaDescription", form.metaDescription);
    if (!editing) {
      data.set("catType", form.catType);
      data.set("mainCategory", multi && form.mainCategory ? "1" : "");
      data.set("parentCategory", multi && !form.mainCategory ? form.parentCategory : "");
      data.set("categoryId", form.categoryId);
      data.set("chemicalFormulaTitle", parent ? form.chemicalFormulaTitle : "");
      data.set("chemicalFormulaProducts", parent ? formulaProducts.map((p) => p.sku).join(",") : "");
    }
    startSaving(async () => {
      const result = editing ? await updateFeatureCategoryAction(category.id, data) : await createFeatureCategoryAction(data);
      notify({ message: result.ok ? "Category saved successfully!" : result.message || "Failed to save category", tone: result.ok ? "success" : "error" });
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.ok) router.push("/admin/catalog/feature-categories");
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {!canSave && <Notice>You can view this category. Saving needs {editing ? "edit" : "add"} permission.</Notice>}
      <Card>
        <CardHeader title="Category Details" />
        <CardBody className="space-y-4">
          <Field label="Category Name" required error={errors.name}>
            {({ id, invalid }) => <Input id={id} value={form.name} onChange={set("name")} aria-invalid={invalid || undefined} placeholder="e.g., Electronics" maxLength={255} disabled={!canSave} />}
          </Field>
          <Field label="Category Description">
            {({ id }) => <Textarea id={id} rows={4} value={form.description} onChange={set("description")} placeholder="A brief description of the category..." maxLength={5000} disabled={!canSave} />}
          </Field>
          {editing && <Notice>The category type, parent, category set and chemical formula products are fixed once the category is created.</Notice>}
          <fieldset className="space-y-2" disabled={locked}>
            <legend className="text-[13px] font-medium text-ink-soft">
              Select Category Type<span className="ml-0.5 text-danger-ink">*</span>
            </legend>
            <div className="flex flex-wrap gap-4">
              {[
                ["1", "Simple Category"],
                ["2", "Multi Category"],
              ].map(([value, label]) => (
                <label key={value} className="inline-flex items-center gap-2 text-sm text-ink-soft">
                  <input type="radio" name="catTypeChoice" value={value} checked={form.catType === value} onChange={() => setForm((f) => ({ ...f, catType: value }))} className="accent-brand-600" />
                  {label}
                </label>
              ))}
            </div>
            {errors.catType && <p className="text-xs text-danger-ink">{errors.catType}</p>}
          </fieldset>
          {multi && (
            <div className="space-y-3 rounded-lg border border-line p-3">
              <p className="text-[13px] font-medium text-ink-soft">Select Multi Category Details</p>
              <Checkbox label="Main Category" checked={form.mainCategory} disabled={locked} onChange={(e) => setForm((f) => ({ ...f, mainCategory: e.target.checked }))} />
              {!form.mainCategory && (
                <Field label="or map with Parent Category">
                  {({ id }) => <Select id={id} value={form.parentCategory} onChange={set("parentCategory")} disabled={locked} placeholder="Select Parent Category" options={options.parents.map((p) => ({ value: String(p.id), label: p.name }))} className="sm:max-w-sm" />}
                </Field>
              )}
              {parent && (
                <>
                  <Field label="add Chemical Formula Product">
                    {({ id }) => <Input id={id} value={form.chemicalFormulaTitle} onChange={set("chemicalFormulaTitle")} disabled={locked} placeholder="Chemical Formula Title" maxLength={500} />}
                  </Field>
                  <ProductPicker value={formulaProducts} onChange={setFormulaProducts} permission={PERMISSION} disabled={locked} placeholder="Map Same Chemical Formula Product" />
                  {!editing && (
                    <Field label="Promotion Images" hint="One or more images (JPG, PNG or WebP).">
                      {({ id, describedBy }) => <Input id={id} type="file" name="product_image" multiple accept={IMAGE_ACCEPT} aria-describedby={describedBy} className="h-auto py-1.5" />}
                    </Field>
                  )}
                  {editing && category.promotionImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.promotionImages.map((src) => (
                        <Image key={src} src={src} alt="Promotion image" width={120} height={80} unoptimized className="h-20 w-auto rounded-md border border-line object-contain" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Category Images" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <ImageInput name="cat_img" label="Category Image" current={category?.catImg} required={!editing} error={errors.cat_img} />
          <ImageInput name="banner_img_desktop" label="Desktop View Image" current={category?.bannerDesktop} required={!editing} error={errors.banner_img_desktop} />
          <ImageInput name="banner_img_mobile" label="Mobile View Image" current={category?.bannerMobile} required={!editing} error={errors.banner_img_mobile} />
          {parent && !editing && (
            <>
              <ImageInput name="banner_img_desktop2" label="Other Desktop Image" />
              <ImageInput name="banner_img_mobile2" label="Other Mobile Image" />
            </>
          )}
          {parent && editing && (
            <>
              {category.bannerDesktop2 && (
                <Field label="Other Desktop Image">
                  <Image src={category.bannerDesktop2} alt="" width={160} height={90} unoptimized className="h-20 w-auto rounded-md border border-line object-contain" />
                </Field>
              )}
              {category.bannerMobile2 && (
                <Field label="Other Mobile Image">
                  <Image src={category.bannerMobile2} alt="" width={160} height={90} unoptimized className="h-20 w-auto rounded-md border border-line object-contain" />
                </Field>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Assigned Products" description="Drag the handle to reorder products." />
        <CardBody className="space-y-4">
          <Field label="Add Product" required error={errors.products}>
            {({ id, invalid }) => <ProductPicker id={id} value={products} onChange={setProducts} permission={PERMISSION} disabled={!canSave} invalid={invalid} />}
          </Field>
          <Field label="Category Set" required={!editing} error={errors.categoryId} className={cn(editing && "opacity-80")}>
            {() => <CategoryTree categories={options.categories} value={form.categoryId} onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))} disabled={locked} />}
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="SEO Settings" />
        <CardBody className="space-y-4">
          <Field label="Meta Title">
            {({ id }) => <Input id={id} value={form.metaTitle} onChange={set("metaTitle")} maxLength={500} disabled={!canSave} />}
          </Field>
          <Field label="Meta Keywords" hint="Comma-separated keywords.">
            {({ id, describedBy }) => <Input id={id} value={form.metaKeywords} onChange={set("metaKeywords")} aria-describedby={describedBy} maxLength={1000} disabled={!canSave} />}
          </Field>
          <Field label="Meta Description">
            {({ id }) => <Textarea id={id} rows={3} value={form.metaDescription} onChange={set("metaDescription")} maxLength={2000} disabled={!canSave} />}
          </Field>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        <ButtonLink href="/admin/catalog/feature-categories">Cancel</ButtonLink>
        <Button type="submit" variant="primary" loading={saving} disabled={!canSave}>
          {editing ? "Update Category" : "Save Category"}
        </Button>
      </div>
    </form>
  );
}
