"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { addSellerCitiesAction, addSellerStatesAction, createSellerAction, verifyGstAction } from "@/lib/actions/admin/parity/seller";

const OTHER = "other";
const EMAIL = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const FILES = [
  { name: "seller_logo", label: "Logo / Images 500x500 pixel" },
  { name: "pan_card", label: "Upload Pan card (max 5 MB)" },
  { name: "aadhar_card", label: "Upload Aadhar Card (max 5 MB)" },
  { name: "business_proof", label: "Upload GST Reg. Certificate Proof (max 5 MB)" },
];
const EMPTY = { sellerName: "", companyName: "", groupId: "", address: "", description: "", stateId: "", customState: "", cityId: "", customCity: "", pincode: "", phone: "", email: "", password: "", gst: "" };

/** add-seller.js checks, in the same order and with the same messages. */
function check(form, stateName, cityName) {
  if (!form.sellerName.trim()) return ["sellerName", "Seller name is empty"];
  if (!form.companyName.trim()) return ["companyName", "Business/ Company name is empty"];
  if (!form.groupId) return ["groupId", "Please select seller type"];
  if (!form.address.trim()) return ["address", "Business address is empty"];
  if (!form.description.trim()) return ["description", "Business description is empty"];
  if (!stateName) return ["state", "Please select or enter state"];
  if (!cityName) return ["city", "Please select or enter city"];
  if (!form.phone.trim()) return ["phone", "Phone number is empty"];
  if (!form.email.trim()) return ["email", "Email id is empty"];
  if (!EMAIL.test(form.email.trim())) return ["email", "Email id is invalid"];
  if (!form.password) return ["password", "Password is empty"];
  const p = form.password;
  if (p.length < 5 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return ["password", "Password Must contain 5 characters or more,lowercase and uppercase characters and contains digits."];
  if (!form.gst.trim()) return ["gst", "Please enter GST"];
  if (!/^\d{6}$/.test(form.pincode.trim())) return ["pincode", "Enter a 6-digit PIN Code."];
  return null;
}

export function AddSellerForm({ options, canAdd }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [countryId, setCountryId] = useState(options.countries[0] ? String(options.countries[0].id) : "");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [gstResult, setGstResult] = useState(null);
  const [verifying, startVerify] = useTransition();
  const [saving, startSaving] = useTransition();

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  useEffect(() => {
    let live = true;
    addSellerStatesAction(countryId).then((r) => {
      if (!live) return;
      if (!r.ok) notify({ message: r.message, tone: "error" });
      setStates(r.ok ? r.data : []);
    });
    return () => {
      live = false;
    };
  }, [countryId, notify]);

  useEffect(() => {
    let live = true;
    if (!form.stateId || form.stateId === OTHER) return undefined;
    addSellerCitiesAction(form.stateId).then((r) => {
      if (!live) return;
      if (!r.ok) notify({ message: r.message, tone: "error" });
      setCities(r.ok ? r.data : []);
    });
    return () => {
      live = false;
    };
  }, [form.stateId, notify]);

  const changeCountry = (e) => {
    setCountryId(e.target.value);
    setCities([]);
    setForm((f) => ({ ...f, stateId: "", cityId: "", customState: "", customCity: "" }));
  };
  const changeState = (e) => {
    const value = e.target.value;
    setCities([]);
    setForm((f) => ({ ...f, stateId: value, cityId: value === OTHER ? OTHER : "", customState: "", customCity: "" }));
  };
  const changeCity = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, cityId: value, customCity: value === OTHER ? f.customCity : "" }));
  };

  const stateOther = form.stateId === OTHER;
  const cityOther = stateOther || form.cityId === OTHER;
  const stateName = stateOther ? form.customState.trim() : states.find((s) => String(s.id) === form.stateId)?.name ?? "";
  const cityName = cityOther ? form.customCity.trim() : cities.find((c) => String(c.id) === form.cityId)?.name ?? "";

  const verify = () => {
    setGstResult(null);
    startVerify(async () => {
      const r = await verifyGstAction(form.gst);
      if (!r.ok) {
        notify({ message: r.message, tone: "error" });
        if (r.status !== 503) setGstResult({ active: false });
        return;
      }
      setGstResult(r.data);
    });
  };

  const submit = (event) => {
    event.preventDefault();
    const problem = check(form, stateName, cityName);
    if (problem) {
      setErrors({ [problem[0]]: problem[1] });
      notify({ message: problem[1], tone: "error" });
      return;
    }
    setErrors({});
    const data = new FormData(event.currentTarget);
    const values = {
      sellerName: form.sellerName.trim(),
      companyName: form.companyName.trim(),
      groupId: form.groupId,
      address: form.address.trim(),
      description: form.description.trim(),
      countryId,
      stateId: stateOther ? "" : form.stateId,
      state: stateName,
      cityId: cityOther ? "" : form.cityId,
      city: cityName,
      pincode: form.pincode.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password,
      website: "",
      gst: form.gst.trim(),
    };
    for (const [key, value] of Object.entries(values)) data.set(key, value);
    startSaving(async () => {
      const result = await createSellerAction(data);
      notify({ message: result.ok ? result.message || "Seller Added Successfully." : result.message, tone: result.ok ? "success" : "error" });
      if (result.fieldErrors) setErrors(result.fieldErrors);
      if (result.ok) router.push("/admin/vendors");
    });
  };

  // Zoho Books "New Vendor" layout: grouped sections, label-left rows (.ba-form-rows), sticky Save bar.
  // Same fields, checks and actions as before — only arranged differently.
  const section = (title, hint) => (
    <div className="mb-4 border-b border-line pb-2">
      <h2 className="text-section font-semibold text-ink">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
  const focusGst = () => document.getElementById("seller-gst-section")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    // No overflow-hidden on the card: it would stop the Save bar below from sticking while scrolling.
    <Card>
      <form onSubmit={submit} noValidate>
        <div className="flex flex-wrap items-center gap-2 rounded-t-xl border-b border-line bg-info-bg px-5 py-3 text-sm text-info-ink">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          <span>Have the seller&apos;s GSTIN? Verify it to confirm the registered business name and address.</span>
          <button type="button" onClick={focusGst} className="font-semibold text-brand-700 hover:underline">
            Go to GST &rsaquo;
          </button>
        </div>
        <CardBody className="space-y-8 px-5 py-6 sm:px-8">
          {!canAdd && <Notice>You can view this form. Adding sellers needs add permission.</Notice>}

          <section>
            {section("Business details")}
            <div className="ba-form-rows space-y-5">
            <Field label="Shop Name (Display Name)" required error={errors.sellerName}>
              {({ id, invalid }) => <Input id={id} value={form.sellerName} onChange={set("sellerName")} aria-invalid={invalid || undefined} placeholder="Full Name" maxLength={80} />}
            </Field>
            <Field label="Business Name" required error={errors.companyName}>
              {({ id, invalid }) => <Input id={id} value={form.companyName} onChange={set("companyName")} aria-invalid={invalid || undefined} placeholder="Business/ Company Name" maxLength={100} />}
            </Field>
            <Field label="Seller Type" required error={errors.groupId}>
              {({ id, invalid }) => (
                <Select id={id} value={form.groupId} onChange={set("groupId")} aria-invalid={invalid || undefined} placeholder="Select Seller type" options={options.groups.map((g) => ({ value: String(g.id), label: g.name }))} />
              )}
            </Field>
            <Field label="Business Description" required error={errors.description}>
              {({ id, invalid }) => <Textarea id={id} rows={5} value={form.description} onChange={set("description")} aria-invalid={invalid || undefined} placeholder="About your Business / Company..." maxLength={5000} />}
            </Field>
            </div>
          </section>

          <section>
            {section("Address", "The PIN code is checked against the selected state and city.")}
            <div className="ba-form-rows space-y-5">
            <Field label="Country" required>
              {({ id }) => <Select id={id} value={countryId} onChange={changeCountry} placeholder="Select Country" options={options.countries.map((c) => ({ value: String(c.id), label: c.name }))} />}
            </Field>
            <Field label="Business Address" required error={errors.address}>
              {({ id, invalid }) => <Textarea id={id} rows={4} value={form.address} onChange={set("address")} aria-invalid={invalid || undefined} placeholder="Business Address" maxLength={250} />}
            </Field>
            <Field label="State" required error={errors.state}>
              {({ id, invalid }) => (
                <div className="space-y-2">
                  <Select id={id} value={form.stateId} onChange={changeState} aria-invalid={invalid || undefined} placeholder="Select State" options={[...states.map((s) => ({ value: String(s.id), label: s.name })), { value: OTHER, label: "Other (State Not Found)" }]} />
                  {stateOther && <Input value={form.customState} onChange={set("customState")} placeholder="Enter State Name" aria-label="State name" maxLength={255} />}
                </div>
              )}
            </Field>
            <Field label="City" required error={errors.city}>
              {({ id, invalid }) => (
                <div className="space-y-2">
                  <Select
                    id={id}
                    value={form.cityId}
                    onChange={changeCity}
                    disabled={stateOther}
                    aria-invalid={invalid || undefined}
                    placeholder={stateOther ? undefined : "Select city"}
                    options={stateOther ? [{ value: OTHER, label: "Other (City Not Found)" }] : [...cities.map((c) => ({ value: String(c.id), label: c.name })), { value: OTHER, label: "Other (City Not Found)" }]}
                  />
                  {cityOther && <Input value={form.customCity} onChange={set("customCity")} placeholder="Enter City Name" aria-label="City name" maxLength={255} />}
                </div>
              )}
            </Field>
            <Field label="Pincode" required error={errors.pincode} hint="Checked against the selected state and city.">
              {({ id, invalid, describedBy }) => <Input id={id} value={form.pincode} onChange={set("pincode")} aria-invalid={invalid || undefined} aria-describedby={describedBy} placeholder="462026" inputMode="numeric" maxLength={6} />}
            </Field>
            </div>
          </section>

          <section>
            {section("Contact & login", "The seller signs in to the seller panel with this email and password.")}
            <div className="ba-form-rows space-y-5">
            <Field label="Phone" required error={errors.phone}>
              {({ id, invalid }) => <Input id={id} value={form.phone} onChange={set("phone")} aria-invalid={invalid || undefined} placeholder="** without country code" inputMode="tel" maxLength={10} />}
            </Field>
            <Field label="Email Id" required error={errors.email}>
              {({ id, invalid }) => <Input id={id} type="email" value={form.email} onChange={set("email")} aria-invalid={invalid || undefined} placeholder="email id" maxLength={60} autoComplete="off" />}
            </Field>
            <Field label="Password" required error={errors.password}>
              {({ id, invalid }) => <Input id={id} type="password" value={form.password} onChange={set("password")} aria-invalid={invalid || undefined} placeholder="Password" maxLength={100} autoComplete="new-password" />}
            </Field>
            </div>
          </section>

          <section id="seller-gst-section" className="scroll-mt-24">
            {section("Tax")}
            <div className="ba-form-rows space-y-5">
            <Field label="GST/VAT Number" required error={errors.gst}>
              {({ id, invalid }) => (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id={id}
                      value={form.gst}
                      onChange={(e) => {
                        setGstResult(null);
                        set("gst")(e);
                      }}
                      aria-invalid={invalid || undefined}
                      placeholder="Registered GST/VAT Number"
                      maxLength={20}
                    />
                    <Button onClick={verify} loading={verifying} disabled={!form.gst.trim() || !canAdd || !options.gstVerification} title={options.gstVerification ? undefined : "GST verification is not configured on the API."}>
                      Verify GST
                    </Button>
                  </div>
                  {gstResult?.active && (
                    <div className="space-y-0.5 text-small text-ink-soft">
                      <p>
                        Business Name: <b>{gstResult.legalName || "N/A"}</b>
                      </p>
                      <p>
                        Business Address: <b>{gstResult.address || "N/A"}</b>
                      </p>
                      <p className="inline-flex items-center gap-1 text-success-ink">
                        <CheckCircle2 className="size-4" aria-hidden /> GST Number Verified
                      </p>
                    </div>
                  )}
                  {gstResult && !gstResult.active && (
                    <p className="inline-flex items-center gap-1 text-small text-warning-ink">
                      <XCircle className="size-4" aria-hidden /> GST Number is invalid
                    </p>
                  )}
                </div>
              )}
            </Field>
            </div>
          </section>

          <section>
            {section("Documents", "Optional. JPG, PNG or WebP images.")}
            <div className="ba-form-rows space-y-5">
            {FILES.map((f) => (
              <Field key={f.name} label={f.label} error={errors[f.name]} hint="JPG, PNG or WebP.">
                {({ id, describedBy }) => <FileInput id={id} name={f.name} accept={IMAGE_ACCEPT} aria-describedby={describedBy} />}
              </Field>
            ))}
            </div>
          </section>
        </CardBody>
        {/* Sticky action bar, as in Zoho Books: always reachable while scrolling a long form. */}
        <div className="sticky bottom-0 z-10 flex items-center gap-2 rounded-b-xl border-t border-line bg-surface/95 px-5 py-3 backdrop-blur sm:px-8">
          <Button type="submit" variant="primary" loading={saving} disabled={!canAdd}>
            Save
          </Button>
          <ButtonLink href="/admin/vendors" variant="secondary">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </Card>
  );
}
