"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createPickupAddressAction } from "@/lib/actions/admin/parity/ops";
import { formatNumber } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Drawer } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { MiniTable } from "@/components/admin/dashboard/range-switch";

const SIZES = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
  { value: "all", label: "All" },
];

const BLANK = { pickupLocation: "", name: "", email: "", phone: "", address: "", address2: "", city: "", state: "", country: "India", pinCode: "", lat: "", long: "", addressType: "", vendorName: "", gstin: "" };

const FIELDS = [
  { key: "pickupLocation", label: "Pickup Location", required: true, maxLength: 36, placeholder: "Enter Vendor Company Name" },
  { key: "name", label: "Name", required: true, maxLength: 100 },
  { key: "email", label: "Email", required: true, type: "email", maxLength: 100 },
  { key: "phone", label: "Phone", required: true, inputMode: "numeric", maxLength: 12 },
  { key: "address", label: "Address", required: true, maxLength: 80, wide: true },
  { key: "address2", label: "Address 2", maxLength: 80, wide: true },
  { key: "city", label: "City", required: true, maxLength: 60 },
  { key: "state", label: "State", required: true, maxLength: 60 },
  { key: "country", label: "Country", required: true, maxLength: 60 },
  { key: "pinCode", label: "Pin Code", required: true, inputMode: "numeric", maxLength: 6 },
  { key: "lat", label: "Latitude", maxLength: 20 },
  { key: "long", label: "Longitude", maxLength: 20 },
  { key: "vendorName", label: "Vendor Name", maxLength: 100 },
  { key: "gstin", label: "GSTIN", maxLength: 15 },
];

function AddAddressDrawer({ open, onClose }) {
  const router = useRouter();
  const { notify } = useToast();
  const [values, setValues] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await createPickupAddressAction(values);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    notify({ message: "Pickup address added." });
    setValues(BLANK);
    onClose();
    router.refresh();
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Pickup Address"
      description="Creates the warehouse on the shipping service. Addresses cannot be edited afterwards."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" form="pickup-address-form" variant="primary" loading={busy}>
            Add Address
          </Button>
        </>
      }
    >
      <form id="pickup-address-form" onSubmit={submit} className="grid grid-cols-2 gap-3">
        {error && <Notice tone="danger" className="col-span-2">{error}</Notice>}
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label} required={f.required} className={f.wide ? "col-span-2" : undefined}>
            {({ id }) => (
              <Input
                id={id}
                type={f.type ?? "text"}
                inputMode={f.inputMode}
                maxLength={f.maxLength}
                placeholder={f.placeholder}
                required={f.required}
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
          </Field>
        ))}
        <Field label="Address Type">
          {({ id }) => <Select id={id} value={values.addressType} onChange={(e) => setValues((v) => ({ ...v, addressType: e.target.value }))} placeholder="Select type" options={[{ value: "vendor", label: "Vendor" }]} />}
        </Field>
      </form>
    </Drawer>
  );
}

/** pickup_addresses.php: shipping-service warehouses with client-side paging and an add form. */
export function PickupAddresses({ rows, canAdd }) {
  const [size, setSize] = useState("10");
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const perPage = size === "all" ? Math.max(1, rows.length) : Number(size);
  const pages = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pages);
  const start = (current - 1) * perPage;
  const shown = rows.slice(start, start + perPage);

  return (
    <Card>
      <CardHeader
        title="Pickup Addresses"
        description={rows.length ? `Showing ${formatNumber(start + 1)} to ${formatNumber(start + shown.length)} of ${formatNumber(rows.length)} entries` : "No pickup addresses yet."}
        actions={
          <div className="flex items-center gap-2">
            <Select
              aria-label="Entries per page"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setPage(1);
              }}
              options={SIZES}
              className="w-20"
            />
            {canAdd && (
              <Button size="sm" variant="primary" onClick={() => setAdding(true)}>
                <Plus className="size-4" aria-hidden /> Add Address
              </Button>
            )}
          </div>
        }
      />
      <MiniTable
        empty="No pickup addresses found."
        columns={[
          { key: "pickupLocation", label: "Pickup Location", render: (r) => <span className="font-medium text-ink">{r.pickupLocation}</span> },
          { key: "name", label: "Name" },
          {
            key: "address",
            label: "Address",
            render: (r) => (
              <div className="max-w-xs whitespace-normal">
                {[r.address, r.address2].filter(Boolean).join(", ")}
                <span className="block text-xs text-ink-muted">{[r.city, r.state].filter(Boolean).join(", ")}</span>
              </div>
            ),
          },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "pinCode", label: "Pin Code" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "active", label: "Status", render: (r) => <Badge tone={r.active ? "success" : "neutral"}>{r.active ? "Active" : "Inactive"}</Badge> },
          { key: "primary", label: "Primary", render: (r) => (r.primary ? <Badge tone="brand">Primary</Badge> : "—") },
        ]}
        rows={shown}
      />
      {pages > 1 && (
        <div className="flex items-center justify-end gap-1.5 border-t border-line px-4 py-3">
          <Button size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>
            Previous
          </Button>
          <span className="px-2 text-[13px] text-ink-muted">
            Page {current} of {pages}
          </span>
          <Button size="sm" disabled={current >= pages} onClick={() => setPage(current + 1)}>
            Next
          </Button>
        </div>
      )}
      {canAdd && <AddAddressDrawer open={adding} onClose={() => setAdding(false)} />}
    </Card>
  );
}
