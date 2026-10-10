"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";

const COLUMNS = [
  { key: "name", label: "Product", emphasis: true, sub: "sku", width: 280 },
  { key: "category", label: "Category" },
  { key: "seller", label: "Seller" },
  { key: "technical", label: "Technical" },
  { key: "packaging", label: "Pack" },
];

function specLines(product) {
  return [
    ["Technical", product.technical],
    ["Pack", product.packaging],
    ["Usage", product.usage],
    ["Pests", product.pests],
    ["Dose", product.dose],
    ["Crops", product.crops],
  ].filter(([, value]) => value);
}

export function CatalogBatch({ products, total, page, pageSize, pageCount, vendors, totalActive, initialPreview }) {
  const [title, setTitle] = useState("Product Catalogue");
  const [subtitle, setSubtitle] = useState("Agriculture Products & Solutions");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [agent, setAgent] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(initialPreview);

  const groups = useMemo(() => {
    const map = new Map();
    for (const product of preview || []) {
      const key = product.category || "Uncategorised";
      const list = map.get(key) || [];
      list.push(product);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [preview]);

  const data = { rows: products, total, page, pageSize, pageCount };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Catalogue details" description={`${products.length} of ${totalActive} active products in this batch. Tick rows, then generate. Prices are left off the sheet.`} />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Subtitle"><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></Field>
          <Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Sales agent"><Input value={agent} onChange={(e) => setAgent(e.target.value)} /></Field>
          <Field label="Phone / WhatsApp"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        </CardBody>
      </Card>

      <DataTable
        id="catalog-batch"
        columns={COLUMNS}
        data={data}
        search="Search by name, SKU or category"
        filters={vendors.length ? [{ key: "seller", label: "Seller", options: vendors.map((vendor) => ({ value: String(vendor.id), label: vendor.name })) }] : []}
        pageSizes={[25, 50, 100, 250]}
        bulkActions={[{ id: "generate", label: "Generate catalogue", kind: "form" }]}
        onCustomAction={(_action, _ids, rows) => setPreview(rows)}
        onAction={async () => ({ ok: false, message: "Select products, then generate the catalogue." })}
        emptyTitle="No active products"
        emptyDescription="Nothing matches this search or seller."
        summary={initialPreview ? "Opened from a batch link. Generate catalogue uses the ticked rows; the preview started from that hand-picked set." : "Batch mode: tick products, then Generate catalogue. The sheet lists specifications only."}
      />

      {preview && (
        <Card id="catalog-preview">
          <CardHeader
            title={title || "Product Catalogue"}
            description={subtitle}
            actions={<Button size="sm" variant="secondary" onClick={() => window.print()}>Print / Save as PDF</Button>}
          />
          <CardBody className="space-y-6">
            <p className="text-sm text-ink-muted">
              {[date, agent, phone, email].filter(Boolean).join(" · ") || "No contact entered."} · {preview.length} products
            </p>
            {groups.map(([category, rows]) => (
              <section key={category}>
                <h3 className="mb-2 text-sm font-semibold text-ink">{category}</h3>
                <ul className="divide-y divide-line rounded-lg border border-line">
                  {rows.map((product) => (
                    <li key={product.id} className="px-3 py-3">
                      <p className="text-sm font-medium text-ink">{product.name}</p>
                      <p className="font-mono text-xs text-ink-muted">{product.sku}{product.seller ? ` · ${product.seller}` : ""}</p>
                      {specLines(product).length > 0 && (
                        <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                          {specLines(product).map(([label, value]) => (
                            <div key={label}>
                              <dt className="text-[11px] uppercase tracking-wide text-ink-muted">{label}</dt>
                              <dd className="text-sm text-ink-soft">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
