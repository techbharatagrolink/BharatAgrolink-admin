"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { saveInvoiceProfileAction } from "@/lib/actions/admin/monetization";

/*
 * Supplier block of BAN invoices. Saved values are copied into each invoice when it is issued, so a
 * change affects new invoices only. GSTIN and state are fixed: they decide CGST + SGST vs IGST.
 */
export function InvoiceProfileEditor({ profile, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [v, setV] = useState({
    legalName: profile.legalName ?? "",
    // Only the overrides: empty = admin System Settings (Address / Email / Phone).
    address: profile.overrides?.address ?? "",
    email: profile.overrides?.email ?? "",
    phone: profile.overrides?.phone ?? "",
    pan: profile.pan ?? "",
    cin: profile.cin ?? "",
    defaultSac: profile.defaultSac ?? "998365",
  });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveInvoiceProfileAction(v);
      notify(res.ok ? { message: "Invoice details saved. New invoices will use them." } : { tone: "error", message: res.message });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)} disabled={!canEdit}>
        Edit invoice details
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Invoice details"
        description="Printed as the supplier on every new BAN invoice. Invoices already issued keep what they printed."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="invoice-profile" variant="primary" loading={pending}>
              Save
            </Button>
          </>
        }
      >
        <form id="invoice-profile" onSubmit={submit} className="space-y-4">
          <Field label="Legal name" required>
            <Input value={v.legalName} onChange={set("legalName")} maxLength={150} />
          </Field>
          <Field
            label="Registered address (only to override)"
            hint={`Leave empty to use Settings → System Settings → Address${profile.sources?.address === "system-settings" ? ` (now "${profile.address}")` : ""}. It must be the GST registered address with its PIN code.`}
          >
            <Textarea rows={3} value={v.address} onChange={set("address")} maxLength={500} placeholder="Empty = System Settings address" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="GSTIN" hint="Fixed: decides CGST + SGST or IGST.">
              <Input value={profile.gstin} disabled />
            </Field>
            <Field label="State" hint="Fixed.">
              <Input value={`${profile.state} (${profile.stateCode})`} disabled />
            </Field>
            <Field label="PAN" required>
              <Input value={v.pan} onChange={(e) => setV((s) => ({ ...s, pan: e.target.value.toUpperCase() }))} maxLength={10} />
            </Field>
            <Field label="CIN">
              <Input value={v.cin} onChange={(e) => setV((s) => ({ ...s, cin: e.target.value.toUpperCase() }))} maxLength={21} />
            </Field>
            <Field label="Email" hint="Empty = System Settings email.">
              <Input type="email" value={v.email} onChange={set("email")} maxLength={150} placeholder={profile.sources?.email === "system-settings" ? profile.email : ""} />
            </Field>
            <Field label="Phone" hint="Empty = System Settings phone.">
              <Input value={v.phone} onChange={set("phone")} maxLength={30} placeholder={profile.sources?.phone === "system-settings" ? profile.phone : ""} />
            </Field>
            <Field label="Default SAC code" required hint="998365 = sale of Internet advertising space. A package's own SAC wins.">
              <Input inputMode="numeric" value={v.defaultSac} onChange={(e) => setV((s) => ({ ...s, defaultSac: e.target.value.replace(/\D/g, "") }))} maxLength={6} />
            </Field>
          </div>
        </form>
      </Drawer>
    </>
  );
}
