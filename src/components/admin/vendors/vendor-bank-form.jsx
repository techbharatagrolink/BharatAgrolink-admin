"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { lookupIfscAction, saveVendorBankAction, verifyVendorBankAction } from "@/lib/actions/admin/vendors";

const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export function VendorBankForm({ vendorId, bank, canEdit }) {
  const { notify } = useToast();
  const [form, setForm] = useState({
    ifsc: bank.ifsc || "",
    bankName: bank.bankName || "",
    holderName: bank.holderName || "",
    accountNumber: bank.accountNumber || "",
    confirmAccountNumber: bank.accountNumber || "",
    address: bank.address || "",
  });
  const [verifiedIfsc, setVerifiedIfsc] = useState(Boolean(bank.ifsc));
  const [saved, setSaved] = useState(bank.exists);
  const [verified, setVerified] = useState(bank.verified);
  const [looking, startLookup] = useTransition();
  const [saving, startSaving] = useTransition();
  const [verifying, startVerify] = useTransition();

  const set = (name) => (event) => {
    const value = name === "ifsc" ? event.target.value.toUpperCase() : event.target.value;
    if (name === "ifsc") setVerifiedIfsc(false);
    setForm((current) => ({ ...current, [name]: value }));
  };

  function lookupIfsc() {
    const ifsc = form.ifsc.trim().toUpperCase();
    if (!IFSC.test(ifsc)) {
      notify({ message: "Please enter a valid IFSC Code (e.g., SBIN0005943).", tone: "error" });
      setForm((current) => ({ ...current, bankName: "", address: "" }));
      return;
    }
    startLookup(async () => {
      const result = await lookupIfscAction(ifsc);
      if (!result.ok) {
        notify({ message: result.message, tone: "error" });
        setVerifiedIfsc(false);
        setForm((current) => ({ ...current, bankName: "", address: "" }));
        return;
      }
      setVerifiedIfsc(true);
      setForm((current) => ({ ...current, ifsc: result.data.ifsc, bankName: result.data.bankName, address: result.data.address }));
    });
  }

  function save() {
    if (!verifiedIfsc) return notify({ message: "IFSC code is not verified.", tone: "error" });
    if (form.accountNumber !== form.confirmAccountNumber) return notify({ message: "Confirm Account number does not matched.", tone: "error" });
    startSaving(async () => {
      const result = await saveVendorBankAction(vendorId, { ...form, ifsc: form.ifsc.trim().toUpperCase() });
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        setSaved(true);
        setVerified(false);
      }
    });
  }

  function verify() {
    if (form.accountNumber !== form.confirmAccountNumber) return notify({ message: "Account No. and confirm Account no. Must Be same.", tone: "error" });
    startVerify(async () => {
      const result = await verifyVendorBankAction(vendorId);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) setVerified(true);
    });
  }

  const mismatch = form.confirmAccountNumber !== "" && form.accountNumber !== form.confirmAccountNumber;

  return (
    <div className="space-y-4">
      {saved && verified && <Notice tone="success">Account Number Verified</Notice>}
      {saved && !verified && <Notice tone="danger">Account Number Not Verify</Notice>}
      <div className="grid gap-4">
        <Field label="IFSC Code" required hint="We will auto-fill the bank details after you enter a valid IFSC code.">
          {({ id }) => (
            <Input id={id} value={form.ifsc} onChange={set("ifsc")} onBlur={lookupIfsc} placeholder="IFSC CODE" maxLength={11} className="uppercase" disabled={!canEdit || looking} />
          )}
        </Field>
        <Field label="Bank Name" required>
          {({ id }) => <Input id={id} value={form.bankName} onChange={set("bankName")} placeholder="Bank Name" maxLength={120} disabled={!canEdit} />}
        </Field>
        <Field label="Account Holder Name" required>
          {({ id }) => <Input id={id} value={form.holderName} onChange={set("holderName")} placeholder="Account Holder Name" maxLength={120} disabled={!canEdit} />}
        </Field>
        <Field label="Account Number" required>
          {({ id }) => <Input id={id} value={form.accountNumber} onChange={set("accountNumber")} placeholder="Account Number" maxLength={30} autoComplete="off" disabled={!canEdit} />}
        </Field>
        <Field label="Confirm Account Number" required error={mismatch ? "Account No. and confirm Account no. Must Be same." : undefined}>
          {({ id, invalid }) => <Input id={id} type="password" value={form.confirmAccountNumber} onChange={set("confirmAccountNumber")} placeholder="Confirm Account Number" maxLength={30} autoComplete="new-password" aria-invalid={invalid || undefined} disabled={!canEdit} />}
        </Field>
        <Field label="Address" required>
          {({ id }) => <Input id={id} value={form.address} onChange={set("address")} placeholder="Address" maxLength={250} disabled={!canEdit} />}
        </Field>
      </div>
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {!saved && <Button onClick={save} loading={saving} disabled={mismatch || looking}>Save</Button>}
          {saved && <Button onClick={save} loading={saving} disabled={mismatch || looking}>Update</Button>}
          {saved && !verified && <Button variant="secondary" onClick={verify} loading={verifying} disabled={mismatch}>Verify Now</Button>}
        </div>
      )}
    </div>
  );
}
