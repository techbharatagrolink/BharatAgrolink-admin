"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";

const MAX_COMBINATIONS = 300;
const UNITS = [
  { value: "gm", label: "GM" },
  { value: "kg", label: "KG" },
  { value: "ml", label: "ML" },
  { value: "liter", label: "Liter" },
];

function leadingNumber(value) {
  const match = String(value).match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function combinations(groups) {
  return groups.reduce((rows, group) => rows.flatMap((prefix) => group.values.map((value) => [...prefix, value])), [[]]);
}

function blankRow(productName, values) {
  return {
    key: values.join("\u0001"),
    label: values.join(" / "),
    values,
    variantName: `${productName}-${values.join("-")}`,
    mrp: "",
    nrv: "",
    display: "",
    gstPercent: "",
    stock: "",
    stockStatus: "In Stock",
    weightValue: "",
    weightUnit: "gm",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
  };
}

export function toVariantGrams(value, unit) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  const normalized = String(unit || "gm").toLowerCase();
  return normalized === "kg" || normalized === "liter" ? number * 1000 : number;
}

/** Configuration picker used by add_product.php: values come from Configuration Attributes. */
export function VariantConfigurations({ productName, productType, attributes = [], rows, savedRows = [], onRows, onDeleteSaved, onGroups, pending, size, onSize }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [attributeId, setAttributeId] = useState("all");
  const [picked, setPicked] = useState({});

  const sizeOptions = useMemo(() => {
    const sizeAttribute = attributes.find((item) => item.name.trim().toLowerCase() === "size");
    return sizeAttribute?.values?.map((item) => item.value) ?? [];
  }, [attributes]);

  const selectedCount = Object.values(picked).reduce((sum, values) => sum + values.length, 0);
  const needle = query.trim().toLowerCase().replace(/\s+/g, "");

  const visible = attributes
    .filter((item) => attributeId === "all" || String(item.id) === attributeId)
    .map((item) => ({
      ...item,
      values: item.values.filter((value) => {
        if (!needle) return true;
        const text = value.value.toLowerCase().replace(/\s+/g, "");
        return value.value.toLowerCase().includes(query.trim().toLowerCase()) || text.includes(needle);
      }),
    }))
    .filter((item) => item.values.length);

  const toggle = (id, value) => {
    setPicked((current) => {
      const list = current[id] ?? [];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [id]: next };
    });
  };

  const setVisible = (checked) => {
    setPicked((current) => {
      const next = { ...current };
      for (const item of visible) {
        const existing = new Set(next[item.id] ?? []);
        for (const value of item.values) {
          if (checked) existing.add(value.value);
          else existing.delete(value.value);
        }
        next[item.id] = [...existing];
      }
      return next;
    });
  };

  const addConfigurations = () => {
    if (!productName.trim()) {
      setNotice("Please enter Product Name first.");
      return;
    }
    const groups = attributes
      .map((item) => ({ attributeId: item.id, name: item.name, values: picked[item.id] ?? [] }))
      .filter((item) => item.values.length);
    if (!groups.length) {
      setNotice("Please select an attribute value.");
      return;
    }
    const combos = combinations(groups).sort((a, b) => leadingNumber(a[0]) - leadingNumber(b[0]) || String(a[0]).localeCompare(String(b[0])));
    if (combos.length > MAX_COMBINATIONS) {
      setNotice(`That selection makes ${combos.length} variants. Select fewer values (limit ${MAX_COMBINATIONS}).`);
      return;
    }
    const existing = new Set([
      ...rows.map((row) => row.key || row.label),
      ...savedRows.map((row) => row.label),
    ]);
    const next = combos
      .map((values) => blankRow(productName.trim(), values))
      .filter((row) => !existing.has(row.key) && !existing.has(row.label));
    onRows([...rows, ...next]);
    onGroups(groups.map(({ attributeId: id, values }) => ({ attributeId: id, values })));
    setNotice("");
    setOpen(false);
  };

  const patch = (index, key, value) => onRows(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  if (productType !== "configure") {
    return (
      <div className="space-y-3">
        <Field label="Size" hint="Pack size of this single SKU. Type or pick one from Configuration Attributes.">
          {({ id }) => (
            <>
              <Input id={id} value={size} onChange={onSize} list="product-size-options" maxLength={255} placeholder="e.g. 500 ml, 1 kg, Large" />
              <datalist id="product-size-options">
                {sizeOptions.map((value) => <option key={value} value={value} />)}
              </datalist>
            </>
          )}
        </Field>
        <p className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-soft">This is a simple product with one SKU. Choose Configurable Product under Basic Information to sell variants such as pack sizes.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3 rounded-lg border border-line p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Variant Configurations</p>
          <p className="text-xs text-ink-muted">Configurable products let customers choose an option (for example a pack size). Each option becomes its own SKU. Values come from Configuration Attributes.</p>
        </div>
        <Button type="button" size="sm" onClick={() => { if (!productName.trim()) { setNotice("Please enter Product Name first."); return; } setNotice(""); setOpen(true); }}>Add Variants</Button>
      </div>
      {notice && !open && <p className="text-sm text-danger-ink">{notice}</p>}

      {savedRows.length > 0 && (
        <ul className="space-y-2 md:hidden">
          {savedRows.map((row) => (
            <li key={row.id} className="rounded-lg border border-line p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 break-words font-medium text-ink">{row.label}</p>
                <button type="button" className="shrink-0 text-xs text-danger-ink" disabled={pending} onClick={() => onDeleteSaved(row.id)}>Delete</button>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div><dt className="text-ink-muted">SKU</dt><dd className="break-words text-ink">{row.sku || "—"}</dd></div>
                <div><dt className="text-ink-muted">MRP</dt><dd className="tabular-nums text-ink">{row.mrp ?? "—"}</dd></div>
                <div><dt className="text-ink-muted">NRV</dt><dd className="tabular-nums text-ink">{row.nrv ?? "—"}</dd></div>
                <div><dt className="text-ink-muted">Stock</dt><dd className="tabular-nums text-ink">{row.stock}</dd></div>
                <div><dt className="text-ink-muted">Weight</dt><dd className="text-ink">{row.weightKg ?? "—"}</dd></div>
                <div className="col-span-2"><dt className="text-ink-muted">L/W/H</dt><dd className="break-words text-ink">{[row.lengthCm, row.widthCm, row.heightCm].filter((value) => value != null && value !== "").join("×") || "—"}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      {savedRows.length > 0 && (
        <div className="hidden min-w-0 overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-ink-muted">
                <th className="py-2 pr-3">Name</th><th className="pr-3">SKU</th><th className="pr-3">MRP</th><th className="pr-3">NRV</th><th className="pr-3">L/W/H</th><th className="pr-3">Weight</th><th className="pr-3">Stock</th><th></th>
              </tr>
            </thead>
            <tbody>
              {savedRows.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="py-2 pr-3">{row.label}</td>
                  <td className="pr-3">{row.sku || "—"}</td>
                  <td className="pr-3">{row.mrp ?? "—"}</td>
                  <td className="pr-3">{row.nrv ?? "—"}</td>
                  <td className="pr-3">{[row.lengthCm, row.widthCm, row.heightCm].filter((value) => value != null && value !== "").join("×") || "—"}</td>
                  <td className="pr-3">{row.weightKg ?? "—"}</td>
                  <td className="pr-3">{row.stock}</td>
                  <td><button type="button" className="text-xs text-danger-ink" disabled={pending} onClick={() => onDeleteSaved(row.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > 0 && (
        <ul className="space-y-3 md:hidden">
          {rows.map((row, index) => (
            <li key={row.key} className="rounded-lg border border-line p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words font-medium text-ink">{row.variantName}</p>
                  <p className="text-xs text-ink-muted">SKU assigned on save</p>
                </div>
                <button type="button" className="shrink-0 text-xs text-danger-ink" onClick={() => onRows(rows.filter((_, i) => i !== index))}>Delete</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["lengthCm", "widthCm", "heightCm"].map((key) => (
                  <Field key={key} label={key === "lengthCm" ? "Length" : key === "widthCm" ? "Width" : "Height"}>
                    {({ id }) => <Input id={id} type="number" min="0" step="0.01" value={row[key]} onChange={(event) => patch(index, key, event.target.value)} />}
                  </Field>
                ))}
                <div className="col-span-2">
                  <Field label="Weight">
                    {({ id }) => (
                      <>
                        <div className="flex min-w-0 gap-1">
                          <Input id={id} className="min-w-0 flex-1" type="number" min="0" step="0.01" value={row.weightValue} onChange={(event) => patch(index, "weightValue", event.target.value)} />
                          <Select className="w-24 shrink-0" value={row.weightUnit} onChange={(event) => patch(index, "weightUnit", event.target.value)} options={UNITS} aria-label="Weight unit" />
                        </div>
                        <p className="mt-1 text-[11px] text-ink-muted">{toVariantGrams(row.weightValue, row.weightUnit) ? `${toVariantGrams(row.weightValue, row.weightUnit)} gm` : "0 gm"}</p>
                      </>
                    )}
                  </Field>
                </div>
                {[["mrp", "MRP"], ["nrv", "NRV"], ["gstPercent", "GST %"], ["stock", "Stock"]].map(([key, label]) => (
                  <Field key={key} label={label}>
                    {({ id }) => <Input id={id} type="number" min="0" step="0.01" value={row[key]} onChange={(event) => patch(index, key, event.target.value)} />}
                  </Field>
                ))}
                <div className="col-span-2">
                  <Field label="Status">
                    {({ id }) => <Select id={id} value={row.stockStatus} onChange={(event) => patch(index, "stockStatus", event.target.value)} options={[{ value: "In Stock", label: "In Stock" }, { value: "Out of Stock", label: "Out of Stock" }]} />}
                  </Field>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {rows.length > 0 && (
        <div className="hidden min-w-0 overflow-x-auto md:block">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-ink-muted">
                <th className="py-2 pr-2">Product</th>
                <th className="pr-2">Length</th>
                <th className="pr-2">Width</th>
                <th className="pr-2">Height</th>
                <th className="pr-2">Weight</th>
                <th className="pr-2">MRP</th>
                <th className="pr-2">NRV</th>
                <th className="pr-2">GST %</th>
                <th className="pr-2">Stock</th>
                <th className="pr-2">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.key} className="border-b align-top">
                  <td className="max-w-56 py-2 pr-2">
                    <p className="font-medium text-ink">{row.variantName}</p>
                    <p className="text-xs text-ink-muted">SKU assigned on save</p>
                  </td>
                  {["lengthCm", "widthCm", "heightCm"].map((key) => (
                    <td key={key} className="pr-2 py-2"><Input className="w-20" type="number" min="0" step="0.01" value={row[key]} onChange={(event) => patch(index, key, event.target.value)} /></td>
                  ))}
                  <td className="py-2 pr-2">
                    <div className="flex gap-1">
                      <Input className="w-20" type="number" min="0" step="0.01" value={row.weightValue} onChange={(event) => patch(index, "weightValue", event.target.value)} />
                      <Select className="w-20" value={row.weightUnit} onChange={(event) => patch(index, "weightUnit", event.target.value)} options={UNITS} />
                    </div>
                    <p className="mt-1 text-[11px] text-ink-muted">{toVariantGrams(row.weightValue, row.weightUnit) ? `${toVariantGrams(row.weightValue, row.weightUnit)} gm` : "0 gm"}</p>
                  </td>
                  {["mrp", "nrv", "gstPercent", "stock"].map((key) => (
                    <td key={key} className="pr-2 py-2"><Input className="w-20" type="number" min="0" step="0.01" value={row[key]} onChange={(event) => patch(index, key, event.target.value)} /></td>
                  ))}
                  <td className="py-2 pr-2">
                    <Select className="w-28" value={row.stockStatus} onChange={(event) => patch(index, "stockStatus", event.target.value)} options={[{ value: "In Stock", label: "In Stock" }, { value: "Out of Stock", label: "Out of Stock" }]} />
                  </td>
                  <td className="py-2"><button type="button" className="text-xs text-danger-ink" onClick={() => onRows(rows.filter((_, i) => i !== index))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="wide"
        title="Configurations"
        description={selectedCount ? `${selectedCount} selected` : "0 selected"}
        footer={(
          <>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
            <Button type="button" onClick={addConfigurations}>Add Configurations</Button>
          </>
        )}
      >
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search attribute values (e.g. 1kg, 500gm, Large)..." className="w-full min-w-0 sm:min-w-56 sm:flex-1" />
            <Select value={attributeId} onChange={(event) => setAttributeId(event.target.value)} options={[{ value: "all", label: "All Attributes" }, ...attributes.map((item) => ({ value: String(item.id), label: item.name }))]} className="w-full sm:w-44" />
            <Button type="button" size="sm" variant="secondary" onClick={() => setVisible(true)}>Select All</Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => setVisible(false)}>Deselect All</Button>
          </div>
          {notice && <p className="text-sm text-danger-ink">{notice}</p>}
          {!attributes.length && <p className="text-sm text-ink-muted">No configuration attributes yet. Add them on the Configuration Attributes page.</p>}
          {attributes.length > 0 && !visible.length && <p className="text-sm text-ink-muted">No values match this search.</p>}
          {visible.map((item) => (
            <section key={item.id} className="border-b border-line pb-3">
              <p className="mb-2 text-sm font-semibold text-ink">{item.name}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {item.values.map((value) => {
                  const checked = (picked[item.id] ?? []).includes(value.value);
                  return (
                    <label key={value.id || value.value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${checked ? "border-brand-600 bg-brand-50" : "border-line bg-surface-muted"}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggle(item.id, value.value)} />
                      {value.colour && <span className="inline-block size-4 rounded-full border border-line" style={{ backgroundColor: value.colour }} />}
                      <span className="break-words">{value.value}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Dialog>
    </div>
  );
}
