"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { searchProductsAction } from "@/lib/actions/admin/parity/seller";
import { SortableList } from "./sortable-list";

/** get_feature_products.php search box feeding an ordered SKU list. */
export function ProductPicker({ id, value, onChange, permission, disabled = false, invalid, placeholder = "Search by Product Name..." }) {
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
      const r = await searchProductsAction(text, permission);
      if (!r.ok) notify({ message: r.message, tone: "error" });
      setResults(r.ok ? r.data : []);
      setOpen(true);
    }, 300);
  };

  const add = (product) => {
    setOpen(false);
    setTerm("");
    if (value.some((p) => p.sku === product.sku)) {
      notify({ message: "Product already added", tone: "error" });
      return;
    }
    onChange([...value, { sku: product.sku, name: product.name }]);
  };

  return (
    <div className="space-y-2">
      {!disabled && (
        <div className="relative">
          <Input id={id} value={term} onChange={(e) => search(e.target.value)} onBlur={() => setTimeout(() => setOpen(false), 150)} onFocus={() => results && term && setOpen(true)} placeholder={placeholder} aria-invalid={invalid || undefined} autoComplete="off" />
          {open && (
            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-surface py-1 text-[13px] shadow-lg">
              {results?.length ? (
                results.map((p) => (
                  <li key={p.sku}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(p)} className="block w-full px-3 py-1.5 text-left text-ink-soft hover:bg-neutral-bg hover:text-ink">
                      {p.name} <span className="text-ink-muted">({p.sku})</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-1.5 text-ink-muted">No products found</li>
              )}
            </ul>
          )}
        </div>
      )}
      {value.length > 0 ? (
        <SortableList
          items={value}
          getKey={(p) => p.sku}
          onChange={onChange}
          disabled={disabled}
          renderItem={(p) => (
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <span className="min-w-0 truncate text-ink">
                {p.name !== p.sku && <span>{p.name} </span>}
                <span className="font-mono text-xs text-ink-muted">{p.sku}</span>
              </span>
              {!disabled && (
                <button type="button" onClick={() => onChange(value.filter((x) => x.sku !== p.sku))} className="rounded p-1 text-danger-ink hover:bg-danger-bg" aria-label={`Remove ${p.sku}`}>
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          )}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-line px-3 py-3 text-center text-[13px] text-ink-muted">No products added yet.</p>
      )}
    </div>
  );
}
