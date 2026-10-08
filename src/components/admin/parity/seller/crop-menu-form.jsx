"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { createShopTopicAction, searchCropsAction, updateShopTopicAction } from "@/lib/actions/admin/parity/seller";
import { ProductPicker } from "./product-picker";
import { SortableList } from "./sortable-list";

/** get_crop_topics.php search feeding the ordered "Applicable Crops" list (disease topics only). */
function CropPicker({ value, onChange, disabled }) {
  const { notify } = useToast();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const search = (text) => {
    setTerm(text);
    clearTimeout(timer.current);
    if (!text.trim()) {
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      const r = await searchCropsAction(text);
      if (!r.ok) notify({ message: r.message, tone: "error" });
      setResults(r.ok ? r.data : []);
      setOpen(true);
    }, 300);
  };

  const add = (crop) => {
    setOpen(false);
    setTerm("");
    if (value.some((c) => c.id === crop.id)) {
      notify({ message: "Crop already added", tone: "error" });
      return;
    }
    onChange([...value, crop]);
  };

  return (
    <div className="space-y-2">
      {!disabled && (
        <div className="relative">
          <Input value={term} onChange={(e) => search(e.target.value)} onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Search crops by name..." aria-label="Add Crop" autoComplete="off" />
          {open && (
            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-surface py-1 text-[13px] shadow-lg">
              {results?.length ? (
                results.map((c) => (
                  <li key={c.id}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(c)} className="block w-full px-3 py-1.5 text-left text-ink-soft hover:bg-neutral-bg hover:text-ink">
                      {c.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-1.5 text-ink-muted">No crops found</li>
              )}
            </ul>
          )}
        </div>
      )}
      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Info className="size-3.5" aria-hidden /> Only crops added here will show this disease on WhatsApp.
      </p>
      {value.length > 0 && (
        <SortableList
          items={value}
          getKey={(c) => c.id}
          onChange={onChange}
          disabled={disabled}
          renderItem={(c) => (
            <div className="flex items-center justify-between gap-2 text-[13px] text-ink">
              {c.name}
              {!disabled && (
                <button type="button" onClick={() => onChange(value.filter((x) => x.id !== c.id))} className="rounded p-1 text-danger-ink hover:bg-danger-bg" aria-label={`Remove ${c.name}`}>
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
}

/** add_shop_topic.php / edit_shop_topic.php. */
export function CropMenuForm({ type, label, topic, canSave }) {
  const router = useRouter();
  const { notify } = useToast();
  const editing = Boolean(topic);
  const [form, setForm] = useState({ name: topic?.name ?? "", nameHi: topic?.nameHi ?? "", link: topic?.link ?? "" });
  const [products, setProducts] = useState(topic?.products ?? []);
  const [crops, setCrops] = useState(topic?.crops ?? []);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, startSaving] = useTransition();
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));
  const list = `/admin/catalog/crop-menu?type=${type}`;

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let problem = null;
    if (!form.name.trim()) problem = ["name", "Please enter a name"];
    else if (!editing && !data.get("topic_img")?.size) problem = ["topic_img", "Image is required"];
    if (problem) {
      setErrors({ [problem[0]]: problem[1] });
      notify({ message: problem[1], tone: "error" });
      return;
    }
    setErrors({});
    data.set("name", form.name.trim());
    data.set("nameHi", form.nameHi.trim());
    data.set("link", form.link.trim());
    data.set("products", products.map((p) => p.sku).join(","));
    data.set("cropIds", type === "disease" ? crops.map((c) => c.id).join(",") : "");
    if (!editing) data.set("type", type);
    startSaving(async () => {
      const result = editing ? await updateShopTopicAction(topic.id, data) : await createShopTopicAction(data);
      notify({ message: result.ok ? result.message || "Saved successfully!" : result.message || "Failed to save.", tone: result.ok ? "success" : "error" });
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.ok) router.push(list);
    });
  };

  const shown = preview || topic?.image;

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {!canSave && <Notice>You can view this item. Saving needs {editing ? "edit" : "add"} permission.</Notice>}
      <Card>
        <CardHeader title={`${label} Details`} />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label={`${label} Name (English)`} required error={errors.name}>
            {({ id, invalid }) => <Input id={id} value={form.name} onChange={set("name")} aria-invalid={invalid || undefined} maxLength={150} disabled={!canSave} />}
          </Field>
          <Field label="Name (Hindi)">
            {({ id }) => <Input id={id} value={form.nameHi} onChange={set("nameHi")} placeholder="(optional)" maxLength={150} disabled={!canSave} />}
          </Field>
          <Field label="Custom Link (optional)" className="sm:col-span-2" error={errors.link}>
            {({ id }) => <Input id={id} value={form.link} onChange={set("link")} placeholder="https://bharatagrolink.com/..." maxLength={500} disabled={!canSave} />}
          </Field>
        </CardBody>
      </Card>

      {type === "disease" && (
        <Card>
          <CardHeader title="Applicable Crops" />
          <CardBody>
            <CropPicker value={crops} onChange={setCrops} disabled={!canSave} />
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Icon Image" />
        <CardBody>
          <Field label="Image" required={!editing} error={errors.topic_img} hint="JPG, PNG or WEBP, 5 MB max.">
            {({ id, invalid, describedBy }) => (
              <div className="space-y-2">
                <Input
                  id={id}
                  type="file"
                  name="topic_img"
                  accept="image/jpeg,image/png,image/webp"
                  aria-invalid={invalid || undefined}
                  aria-describedby={describedBy}
                  className="h-auto py-1.5 sm:max-w-md"
                  disabled={!canSave}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setPreview((old) => {
                      if (old) URL.revokeObjectURL(old);
                      return file ? URL.createObjectURL(file) : null;
                    });
                  }}
                />
                {shown && <Image src={shown} alt="" width={120} height={120} unoptimized className="size-28 rounded-lg border border-line object-cover" />}
              </div>
            )}
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Assigned Products" description="Drag the handle to reorder products." />
        <CardBody>
          <ProductPicker value={products} onChange={setProducts} permission="catalog.cropMenu" disabled={!canSave} placeholder="Search by Product Name or SKU..." />
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        <ButtonLink href={list}>Cancel</ButtonLink>
        <Button type="submit" variant="primary" loading={saving} disabled={!canSave}>
          {editing ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
}
