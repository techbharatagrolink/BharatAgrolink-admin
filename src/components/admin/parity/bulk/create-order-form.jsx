"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  checkBulkServiceabilityAction,
  createBulkCustomerAction,
  createBulkOrderAction,
  lookupBulkPincodeAction,
  searchBulkCustomersAction,
  searchBulkProductsAction,
} from "@/lib/actions/admin/parity/bulk";
import { formatINR } from "@/lib/format";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Dialog } from "@/components/ui/dialog";
import { Notice, ProgressBar } from "@/components/ui/page";

const LAND_UNITS = ["Square Feet", "Bigha", "Acre", "Hectare", "Guntha", "Biswa"];
const SOILS = ["Sandy", "Clay", "Loamy", "Black", "Red", "Other"];
const WATERS = ["Canal", "Borewell", "Rainwater", "Drip Irrigation", "Tank", "Other"];
const MOBILE = /^[6-9]\d{9}$/;

const mobile10 = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const emptyAddress = () => ({
  warehouseName: "",
  address1: "",
  postOffice: "",
  pincode: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  contactName: "",
  email: "",
  phone: "",
  altPhone: "",
  vendorId: "",
  vendorGst: "",
  vendorCompany: "",
});

function addressFromQuotation(quotation, side) {
  const base = emptyAddress();
  if (!quotation) return base;
  const sender = side === "source";
  return {
    ...base,
    warehouseName: quotation[`${side}_warehouse_name`] || "",
    address1: quotation[`${side}_address_line1`] || "",
    postOffice: quotation[`${side}_address_line2`] || "",
    pincode: quotation[`${side}_pincode`] || "",
    city: quotation[`${side}_city`] || "",
    state: quotation[`${side}_state`] || "",
    contactName: quotation[sender ? "sender_contact_person_name" : "recipient_contact_person_name"] || "",
    email: quotation[sender ? "sender_contact_person_email" : "recipient_contact_person_email"] || "",
    phone: mobile10(quotation[sender ? "sender_contact_person_contact_no" : "recipient_contact_person_contact_no"]),
    altPhone: sender ? "" : mobile10(quotation.recipient_alternate_contact_no),
    vendorId: sender ? quotation.vendor_id || "" : "",
    vendorGst: sender ? quotation.vendor_gst_no || "" : "",
    vendorCompany: sender ? quotation.vendor_company_name || "" : "",
  };
}

function linesFromQuotation(quotation) {
  return (quotation?.products || []).map((item, index) => ({
    key: `q-${index}`,
    name: item.item_name || "",
    sku: item.sku || "",
    quantity: item.quantity || 1,
    price: item.rate || 0,
    gst: item.gst_percentage || 0,
    weightGrams: 0,
    length: 0,
    width: 0,
    height: 0,
  }));
}

function packagesFromQuotation(quotation) {
  const rows = quotation?.packaging_unit_details || [];
  if (!rows.length) return [{ units: 1, weight: "", length: "", width: "", height: "" }];
  return rows.map((row) => ({
    units: row.units || 1,
    weight: row.weight || "",
    length: row.length || "",
    width: row.width || "",
    height: row.height || "",
  }));
}

function lineMoney(line) {
  const taxable = (Number(line.price) || 0) * (Number(line.quantity) || 0);
  const gstAmount = (taxable * (Number(line.gst) || 0)) / 100;
  return { taxable, gstAmount, total: taxable + gstAmount };
}

function productChoices(product) {
  const parent = {
    key: `p-${product.id}`,
    name: product.name,
    sku: product.sku,
    salePrice: product.salePrice,
    gstPercentage: product.gstPercentage,
    stock: product.stock,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    stockUnit: product.stockUnit,
  };
  const variants = (product.variants || []).map((variant) => ({
    key: `v-${variant.id}`,
    name: `${product.name} — ${variant.name}`,
    sku: variant.sku,
    salePrice: variant.salePrice,
    gstPercentage: variant.gstPercentage,
    stock: variant.stock,
    weight: variant.weight,
    length: variant.length,
    width: variant.width,
    height: variant.height,
    stockUnit: product.stockUnit,
  }));
  return variants.length ? variants : [parent];
}

const blankCustomer = () => ({
  fullname: "",
  email: "",
  phone: "",
  alternatePhone: "",
  landHoldingValue: "",
  landHoldingUnit: "Bigha",
  season: "",
  crop: "",
  soil: "",
  water: "",
  fulladdress: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  addresstype: "Home",
});

export function CreateBulkOrderForm({ options, quotation }) {
  const requestId = useRef(typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`);
  const [provider, setProvider] = useState("shiprocket");
  const [customerQuery, setCustomerQuery] = useState(quotation?.customer_name || "");
  const [customers, setCustomers] = useState([]);
  const [customerSearched, setCustomerSearched] = useState(false);
  const [customer, setCustomer] = useState(() => (
    quotation?.customer_name
      ? { id: quotation.id, fullname: quotation.customer_name, email: quotation.customer_email || "", phone: quotation.customer_mobile || "", fromQuotation: true }
      : null
  ));
  const [customerOpen, setCustomerOpen] = useState(false);
  const [draft, setDraft] = useState(blankCustomer);
  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productSearched, setProductSearched] = useState(false);
  const [lines, setLines] = useState(() => linesFromQuotation(quotation));
  const [source, setSource] = useState(() => addressFromQuotation(quotation, "source"));
  const [dest, setDest] = useState(() => addressFromQuotation(quotation, "destination"));
  const [sourceOffices, setSourceOffices] = useState([]);
  const [destOffices, setDestOffices] = useState([]);
  const [packages, setPackages] = useState(() => packagesFromQuotation(quotation));
  const [packageEdited, setPackageEdited] = useState(Boolean(quotation?.packaging_unit_details?.length));
  const [noOfPackages, setNoOfPackages] = useState(quotation?.no_of_packages ? String(quotation.no_of_packages) : "1");
  const [approxWeight, setApproxWeight] = useState(quotation?.approx_weight ? String(quotation.approx_weight) : "");
  const [invoiceValue, setInvoiceValue] = useState(quotation?.invoice_value ? String(quotation.invoice_value) : "");
  const [invoiceEdited, setInvoiceEdited] = useState(Boolean(quotation?.invoice_value));
  const [advance, setAdvance] = useState(quotation?.advance_payment != null ? String(quotation.advance_payment) : "");
  const [modeName, setModeName] = useState(quotation?.mode_name || "surface");
  const [insured, setInsured] = useState(Boolean(quotation?.is_insured));
  const [partners, setPartners] = useState([]);
  const [partnerKey, setPartnerKey] = useState("");
  const [serviceNote, setServiceNote] = useState("");
  const [cod, setCod] = useState(Boolean(quotation?.is_cod));
  const [codAmount, setCodAmount] = useState(quotation?.cod_amount != null ? String(quotation.cod_amount) : "");
  const [codEdited, setCodEdited] = useState(quotation?.cod_amount != null);
  const [autoShip, setAutoShip] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(options.invoiceDate || "");
  const [pickupAt, setPickupAt] = useState("");
  const [eway, setEway] = useState("");
  const [remarks, setRemarks] = useState(quotation?.remarks || "");
  const [docText, setDocText] = useState((quotation?.supporting_docs || []).join("\n"));
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [searchingCustomers, startCustomers] = useTransition();
  const [searchingProducts, startProducts] = useTransition();
  const [savingCustomer, startSaveCustomer] = useTransition();
  const [checking, startCheck] = useTransition();
  const [saving, startSave] = useTransition();

  const totals = useMemo(() => lines.reduce((sum, line) => {
    const money = lineMoney(line);
    return { taxable: sum.taxable + money.taxable, gst: sum.gst + money.gst, total: sum.total + money.total, units: sum.units + (Number(line.quantity) || 0), grams: sum.grams + (Number(line.weightGrams) || 0) * (Number(line.quantity) || 0) };
  }, { taxable: 0, gst: 0, total: 0, units: 0, grams: 0 }), [lines]);

  const invoice = Number(invoiceValue) || totals.total;
  const advanceAmount = advance === "" ? invoice : Number(advance) || 0;
  const codBalance = Math.max(0, invoice - advanceAmount);
  const needsPartner = provider === "shiprocket" || provider === "domestic";
  const selectedPartner = partners.find((item) => item.optionName === partnerKey) || null;
  const done = [Boolean(customer || quotation), lines.length > 0, source.pincode && dest.pincode, packages.some((row) => Number(row.weight) > 0), !needsPartner || Boolean(selectedPartner)].filter(Boolean).length;

  function applyProductTotals(nextLines) {
    const next = nextLines.reduce((sum, line) => {
      const money = lineMoney(line);
      return {
        total: sum.total + money.total,
        units: sum.units + (Number(line.quantity) || 0),
        grams: sum.grams + (Number(line.weightGrams) || 0) * (Number(line.quantity) || 0),
        length: Math.max(sum.length, Number(line.length) || 0),
        width: Math.max(sum.width, Number(line.width) || 0),
        height: Math.max(sum.height, Number(line.height) || 0),
      };
    }, { total: 0, units: 0, grams: 0, length: 0, width: 0, height: 0 });
    if (!invoiceEdited && next.total > 0) setInvoiceValue(next.total.toFixed(2));
    if (!packageEdited && next.units > 0) {
      setPackages((rows) => {
        const first = rows[0] || { units: 1, weight: "", length: "", width: "", height: "" };
        return [{
          ...first,
          units: next.units,
          weight: next.grams > 0 ? (next.grams / 1000).toFixed(2) : first.weight,
          length: next.length > 0 ? Math.ceil(next.length) : first.length,
          width: next.width > 0 ? Math.ceil(next.width) : first.width,
          height: next.height > 0 ? Math.ceil(next.height) : first.height,
        }, ...rows.slice(1)];
      });
      setNoOfPackages(String(next.units));
      if (next.grams > 0) setApproxWeight(String(Math.round(next.grams)));
    }
  }

  function searchCustomers() {
    setCustomerSearched(false);
    if (customerQuery.trim().length < 2) {
      setCustomers([]);
      setError("Enter at least 2 characters to search customers.");
      return;
    }
    setError("");
    startCustomers(async () => {
      const found = await searchBulkCustomersAction(customerQuery.trim());
      setCustomerSearched(true);
      setCustomers(found.ok ? found.customers : []);
      if (!found.ok) setError(found.message);
    });
  }

  function chooseCustomer(row) {
    setCustomer(row);
    setCustomers([]);
    setCustomerQuery(row.fullname || "");
    const address = row.address || {};
    setDest((prev) => ({
      ...prev,
      warehouseName: row.fullname || prev.warehouseName,
      contactName: row.fullname || "",
      email: row.email || "",
      phone: mobile10(row.phone),
      altPhone: mobile10(row.alternatePhone),
      address1: address.fulladdress || prev.address1,
      city: address.city || prev.city,
      district: address.district || address.city || prev.district,
      state: address.state || prev.state,
      country: address.country || "India",
      pincode: address.pincode || prev.pincode,
    }));
    if (/^\d{6}$/.test(String(address.pincode || ""))) loadPincode("dest", address.pincode);
  }

  function searchProducts() {
    setProductSearched(false);
    if (productQuery.trim().length < 2) {
      setProducts([]);
      setError("Enter at least 2 characters to search products.");
      return;
    }
    setError("");
    startProducts(async () => {
      const found = await searchBulkProductsAction(productQuery.trim());
      setProductSearched(true);
      setProducts(found.ok ? found.products : []);
      if (!found.ok) setError(found.message);
    });
  }

  function addProduct(choice) {
    const next = [...lines, {
      key: choice.key + Date.now(),
      name: choice.name,
      sku: choice.sku || "",
      quantity: 1,
      price: choice.salePrice || 0,
      gst: choice.gstPercentage || 0,
      weightGrams: choice.weight || 0,
      length: choice.length || 0,
      width: choice.width || 0,
      height: choice.height || 0,
    }];
    setLines(next);
    applyProductTotals(next);
    setProducts([]);
    setProductQuery("");
  }

  function updateLine(key, patch) {
    const next = lines.map((line) => (line.key === key ? { ...line, ...patch } : line));
    setLines(next);
    applyProductTotals(next);
  }

  function removeLine(key) {
    const next = lines.filter((line) => line.key !== key);
    setLines(next);
    applyProductTotals(next);
  }

  async function loadPincode(side, pin) {
    const result = await lookupBulkPincodeAction(pin);
    if (!result.ok) return;
    const apply = side === "source" ? setSource : setDest;
    (side === "source" ? setSourceOffices : setDestOffices)(result.data?.postOffices || []);
    apply((prev) => ({
      ...prev,
      city: prev.city || result.data?.city || "",
      district: result.data?.city || prev.district,
      state: prev.state || result.data?.state || "",
    }));
  }

  function applyPlace(side, place) {
    const patch = {
      warehouseName: place.name || place.company || "",
      address1: place.addressLine1 || place.address || "",
      pincode: place.pincode || "",
      city: place.city || "",
      state: place.state || "",
      contactName: place.contactName || place.name || "",
      email: place.contactEmail || place.email || "",
      phone: mobile10(place.contactNo || place.phone),
    };
    if (side === "source" && place.id && place.gst !== undefined) {
      patch.vendorId = place.id;
      patch.vendorGst = place.gst || "";
      patch.vendorCompany = place.company || place.name || "";
      if (!patch.warehouseName) patch.warehouseName = place.company || place.name || "";
    }
    (side === "source" ? setSource : setDest)((prev) => ({ ...prev, ...patch }));
    if (/^\d{6}$/.test(String(patch.pincode || ""))) loadPincode(side, patch.pincode);
  }

  function editPackage(index, patch) {
    setPackageEdited(true);
    setPackages((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function checkRates() {
    setError("");
    setServiceNote("");
    if (!/^\d{6}$/.test(source.pincode) || !/^\d{6}$/.test(dest.pincode)) {
      setError("Enter pickup and delivery pincodes before checking rates.");
      return;
    }
    if (!packages.length || packages.some((row) => !(Number(row.weight) > 0))) {
      setError("Add at least one package with a weight before checking rates.");
      return;
    }
    const actualKg = packages.reduce((sum, row) => sum + (Number(row.weight) || 0) * (Number(row.units) || 1), 0);
    const volumetricKg = packages.reduce((sum, row) => sum + (((Number(row.length) || 1) * (Number(row.width) || 1) * (Number(row.height) || 1)) / 5000) * (Number(row.units) || 1), 0);
    const grams = Math.max(actualKg, volumetricKg) > 0 ? Math.max(actualKg, volumetricKg) * 1000 : (Number(approxWeight) || 500);
    startCheck(async () => {
      const checked = await checkBulkServiceabilityAction({
        provider,
        from_pincode: source.pincode,
        from_city: source.city,
        from_state: source.state,
        to_pincode: dest.pincode,
        to_city: dest.city,
        to_state: dest.state,
        quantity: Number(noOfPackages) || 1,
        invoice_value: invoice,
        weight: grams,
        cod_amount: cod ? Number(codAmount || codBalance) || 0 : 0,
        packaging_unit_details: packages.map((row) => ({
          units: Number(row.units) || 1,
          weight: Number(row.weight) || 0,
          length: Number(row.length) || 1,
          width: Number(row.width) || 1,
          height: Number(row.height) || 1,
          unit: "cm",
        })),
      });
      if (!checked.ok) {
        setError(checked.message);
        setPartners([]);
        return;
      }
      const list = checked.data?.partners || [];
      setPartners(list);
      setPartnerKey("");
      setServiceNote(list.length ? "Select a delivery partner." : (checked.data?.error || "No delivery partners are available for this route."));
    });
  }

  function saveCustomer(event) {
    event.preventDefault();
    setError("");
    startSaveCustomer(async () => {
      const saved = await createBulkCustomerAction(draft);
      if (!saved.ok) {
        setError(saved.message);
        return;
      }
      setCustomerOpen(false);
      setDraft(blankCustomer());
      if (saved.data?.customer) chooseCustomer(saved.data.customer);
    });
  }

  function validate() {
    if (!customer && !quotation) return "Select or create a customer before creating the order.";
    if (!lines.length) return "Add at least one product.";
    if (lines.some((line) => !(Number(line.quantity) > 0) || Number(line.price) < 0)) return "Each product needs a quantity and a price.";
    for (const [label, row, offices] of [["Pickup", source, sourceOffices], ["Delivery", dest, destOffices]]) {
      if (!row.warehouseName || !row.address1 || !row.city || !row.district || !row.state) return `${label} warehouse name, address, city, district and state are required.`;
      if (!/^\d{6}$/.test(row.pincode)) return `${label} pincode must be 6 digits.`;
      if (!row.contactName || !row.email.includes("@") || !MOBILE.test(row.phone)) return `${label} contact name, email and a 10-digit mobile are required.`;
      if (label === "Delivery" && offices.length && !row.postOffice) return "Choose the delivery post office.";
      if (row.altPhone && !MOBILE.test(row.altPhone)) return "Alternate contact must be a 10-digit mobile number.";
    }
    if (!(Number(noOfPackages) > 0)) return "Number of packages is required.";
    if (!(Number(approxWeight) > 0)) return "Approximate weight (grams) is required.";
    if (!(invoice > 0)) return "Invoice value is required.";
    if (!packages.length || packages.some((row) => !(Number(row.units) > 0) || !(Number(row.weight) > 0) || !(Number(row.length) > 0) || !(Number(row.width) > 0) || !(Number(row.height) > 0))) {
      return "Each package needs units, weight (kg) and length, width and height in cm.";
    }
    if (needsPartner && !selectedPartner) return "Check serviceability and select a delivery partner.";
    if (autoShip && (!options.invoiceNumber || !invoiceDate || !pickupAt)) return "Invoice number, invoice date and pickup date are required to create the shipment automatically.";
    if (autoShip && invoice > 50000 && !eway.trim()) return "E-way bill number is required when the invoice value is over ₹50,000.";
    const docs = docText.split("\n").map((line) => line.trim()).filter(Boolean);
    if (docs.some((line) => !/^https?:\/\//i.test(line))) return "Supporting documents must be http or https URLs, one per line.";
    return "";
  }

  function submit(event) {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    const docs = docText.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 5);
    const payload = {
      provider,
      client_request_id: requestId.current,
      quotation_id: quotation?.id || null,
      no_of_packages: Number(noOfPackages),
      invoice_value: invoice,
      advance_payment: advance === "" ? invoice : Number(advance) || 0,
      approx_weight: Number(approxWeight),
      is_insured: insured,
      is_cod: cod,
      cod_amount: cod ? Number(codAmount === "" ? codBalance : codAmount) || 0 : null,
      is_to_pay: false,
      to_pay_amount: null,
      is_appointment_taken: false,
      source_warehouse_name: source.warehouseName,
      source_address_line1: source.address1,
      source_address_line2: source.postOffice || "",
      source_pincode: source.pincode,
      source_city: source.city,
      source_state: source.state,
      vendor_id: source.vendorId || null,
      vendor_gst_no: source.vendorGst || null,
      vendor_company_name: source.vendorCompany || null,
      sender_contact_person_name: source.contactName,
      sender_contact_person_email: source.email,
      sender_contact_person_contact_no: source.phone,
      destination_warehouse_name: dest.warehouseName,
      destination_address_line1: dest.address1,
      destination_address_line2: dest.postOffice || "",
      destination_pincode: dest.pincode,
      destination_city: dest.city,
      destination_state: dest.state,
      recipient_contact_person_name: dest.contactName,
      recipient_contact_person_email: dest.email,
      recipient_contact_person_contact_no: dest.phone,
      recipient_alternate_contact_no: dest.altPhone || null,
      client_id: Number(options.clientId) || undefined,
      packaging_unit_details: packages.map((row) => ({
        units: Number(row.units) || 1,
        weight: Number(row.weight) || 0,
        length: Number(row.length) || 1,
        height: Number(row.height) || 1,
        width: Number(row.width) || 1,
        unit: "cm",
      })),
      products: lines.map((line, index) => {
        const money = lineMoney(line);
        return {
          item_number: index + 1,
          item_name: line.name,
          sku: line.sku,
          quantity: Number(line.quantity) || 1,
          rate: Number(line.price) || 0,
          gst_percentage: Number(line.gst) || 0,
          taxable_amount: money.taxable,
          total_amount: money.total,
        };
      }),
      mode_name: selectedPartner?.modeName || modeName || "surface",
      mode_id: provider === "shiprocket" ? selectedPartner?.modeId ?? null : null,
      delivery_partner_id: needsPartner ? selectedPartner?.deliveryPartnerId ?? null : null,
      courier_company_id: provider === "domestic" ? selectedPartner?.courierCompanyId ?? selectedPartner?.deliveryPartnerId ?? null : null,
      delivery_rate: needsPartner ? selectedPartner?.rate ?? null : null,
      courier_freight_charge: needsPartner ? selectedPartner?.freightCharge ?? selectedPartner?.rate ?? null : null,
      courier_cod_charges: needsPartner ? selectedPartner?.codCharges ?? 0 : null,
      courier_other_charges: needsPartner ? selectedPartner?.otherCharges ?? 0 : null,
      selected_partner_mode_name: selectedPartner?.modeName || modeName || "surface",
      auto_create_shipment: autoShip,
      invoice_number: options.invoiceNumber || "",
      invoice_date: invoiceDate,
      pickup_date_time: pickupAt,
      eway_bill_no: eway.trim() || null,
      remarks: remarks || "Shipment created with order",
      supporting_docs: docs,
      source: "API",
    };
    startSave(async () => {
      const saved = await createBulkOrderAction(payload);
      if (!saved.ok) {
        setError(saved.message);
        return;
      }
      setResult(saved.data);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <Notice tone="danger" title="Check the form">{error}</Notice>}
      {result && (
        <Notice tone={result.savedAsDraft || result.shipmentError ? "warning" : "success"} title={result.message || "Order created"}>
          <p>Order ID: <Link className="font-semibold underline" href={`/admin/bulk-orders/orders/${encodeURIComponent(result.orderNumber)}`}>{result.orderNumber}</Link></p>
          {result.shipment?.waybillNo && <p>Waybill: {result.shipment.waybillNo}</p>}
          {result.shipmentError && <p>{typeof result.shipmentError === "string" ? result.shipmentError : "Shipment was not created. The order is saved — do not create it again."}</p>}
        </Notice>
      )}

      <Card>
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">Form completion</p>
            <p className="text-xs text-ink-muted">Step {Math.min(done + 1, 5)} of 5</p>
          </div>
          <ProgressBar value={done} max={5} label="Create order progress" />
          <Field label="Shipping mode / provider" required hint="Shiprocket Cargo and Delhivery are for heavy freight. Domestic couriers suit lighter parcels.">
            <Select
              value={provider}
              onChange={(event) => { setProvider(event.target.value); setPartners([]); setPartnerKey(""); }}
              options={options.providers || []}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="1. Customer" description="Search by name or phone, or create a customer. The delivery address is filled from the selection." actions={<Button type="button" size="sm" onClick={() => setCustomerOpen(true)}>Create customer</Button>} />
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Select customer" required className="min-w-0 flex-1">
              <Input value={customerQuery} onChange={(event) => setCustomerQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); searchCustomers(); } }} placeholder="Search customer by name or phone" autoComplete="off" />
            </Field>
            <Button type="button" onClick={searchCustomers} loading={searchingCustomers}>Search</Button>
          </div>
          {customerSearched && customers.length === 0 && <p className="text-xs text-ink-muted">No matching customers.</p>}
          {customers.length > 0 && (
            <ul className="max-h-48 overflow-auto rounded-lg border border-line">
              {customers.map((row) => (
                <li key={row.id}>
                  <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => chooseCustomer(row)}>
                    <span className="font-medium text-ink">{row.fullname}</span>
                    <span className="block text-xs text-ink-muted">{row.email || "No email"} · {row.phone || "No phone"} · {row.totalOrders} orders</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {customer && (
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm">
              <div>
                <p className="font-medium text-ink">{customer.fullname}</p>
                <p className="text-xs text-ink-muted">{customer.email || "No email"} · {customer.phone || "No phone"}</p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => { setCustomer(null); setCustomerQuery(""); }}>Clear</Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="2. Products" description="Search by name or SKU. Quantity, unit price and GST can be edited. Invoice value follows the line totals until you change it." />
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Search products" className="min-w-0 flex-1">
              <Input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); searchProducts(); } }} placeholder="Search products by name or SKU" autoComplete="off" />
            </Field>
            <Button type="button" onClick={searchProducts} loading={searchingProducts}>Search</Button>
          </div>
          {productSearched && products.length === 0 && <p className="text-xs text-ink-muted">No products found.</p>}
          {products.length > 0 && (
            <ul className="max-h-56 overflow-auto rounded-lg border border-line">
              {products.flatMap(productChoices).map((choice) => (
                <li key={choice.key} className="flex items-center justify-between gap-3 border-b border-line px-3 py-2 last:border-b-0">
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium text-ink">{choice.name}</p>
                    <p className="text-xs text-ink-muted">{choice.sku} · {formatINR(choice.salePrice)} · GST {choice.gstPercentage}% · stock {choice.stock} {choice.stockUnit || ""}</p>
                  </div>
                  <Button type="button" size="sm" variant="secondary" onClick={() => addProduct(choice)}>Add</Button>
                </li>
              ))}
            </ul>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs text-ink-muted">
                <tr>
                  <th className="py-2 pr-2 font-medium">Product</th>
                  <th className="py-2 pr-2 font-medium">SKU</th>
                  <th className="py-2 pr-2 font-medium">Qty</th>
                  <th className="py-2 pr-2 font-medium">Unit price</th>
                  <th className="py-2 pr-2 font-medium">GST %</th>
                  <th className="py-2 pr-2 font-medium">Taxable</th>
                  <th className="py-2 pr-2 font-medium">GST</th>
                  <th className="py-2 pr-2 font-medium">Total</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 && (
                  <tr><td colSpan={9} className="py-6 text-center text-ink-muted">No products selected. Search and add products above.</td></tr>
                )}
                {lines.map((line) => {
                  const money = lineMoney(line);
                  return (
                    <tr key={line.key} className="border-t border-line">
                      <td className="py-2 pr-2">{line.name}</td>
                      <td className="py-2 pr-2 text-ink-muted">{line.sku}</td>
                      <td className="py-2 pr-2"><Input type="number" min="1" className="w-20" value={line.quantity} onChange={(event) => updateLine(line.key, { quantity: event.target.value })} /></td>
                      <td className="py-2 pr-2"><Input type="number" min="0" step="0.01" className="w-24" value={line.price} onChange={(event) => updateLine(line.key, { price: event.target.value })} /></td>
                      <td className="py-2 pr-2"><Input type="number" min="0" step="0.01" className="w-20" value={line.gst} onChange={(event) => updateLine(line.key, { gst: event.target.value })} /></td>
                      <td className="py-2 pr-2">{formatINR(money.taxable)}</td>
                      <td className="py-2 pr-2">{formatINR(money.gstAmount)}</td>
                      <td className="py-2 pr-2">{formatINR(money.total)}</td>
                      <td className="py-2"><Button type="button" variant="danger-outline" size="sm" onClick={() => removeLine(line.key)}>Remove</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {lines.length > 0 && <p className="text-sm text-ink-soft">Lines {formatINR(totals.total)} · {totals.units} units · {(totals.grams / 1000).toFixed(2)} kg</p>}
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <AddressCard
          title="3. Pickup warehouse"
          hint={options.warehousesMessage || "Select a vendor or saved warehouse, or type the address."}
          value={source}
          onChange={(patch) => setSource((prev) => ({ ...prev, ...patch }))}
          offices={sourceOffices}
          onPincode={() => loadPincode("source", source.pincode)}
          vendors={options.vendors || []}
          warehouses={options.warehouses || []}
          onVendor={(id) => { const row = (options.vendors || []).find((item) => String(item.id) === id); if (row) applyPlace("source", row); }}
          onWarehouse={(index) => { const row = (options.warehouses || [])[Number(index)]; if (row) applyPlace("source", row); }}
        />
        <AddressCard
          title="Delivery warehouse"
          hint="Filled when you select a customer. Post office is stored as address line 2."
          value={dest}
          onChange={(patch) => setDest((prev) => ({ ...prev, ...patch }))}
          offices={destOffices}
          onPincode={() => loadPincode("dest", dest.pincode)}
          showAlt
          requireOffice
        />
      </div>

      <Card>
        <CardHeader title="4. Order and packages" description="Package weight is in kilograms. Approximate weight is in grams, the same as the PHP form." />
        <CardBody className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Number of packages" required><Input type="number" min="1" value={noOfPackages} onChange={(event) => setNoOfPackages(event.target.value)} /></Field>
            <Field label="Approx weight (grams)" required><Input type="number" min="1" value={approxWeight} onChange={(event) => setApproxWeight(event.target.value)} /></Field>
            <Field label="Invoice value (₹)" required className="sm:col-span-2"><Input type="number" min="1" step="0.01" value={invoiceValue} onChange={(event) => { setInvoiceEdited(true); setInvoiceValue(event.target.value); }} /></Field>
            <Field label="Advance payment (₹)" hint="Leave blank to use the invoice value." className="sm:col-span-2"><Input type="number" min="0" step="0.01" value={advance} onChange={(event) => setAdvance(event.target.value)} placeholder="Same as invoice value" /></Field>
            <Field label="Mode" required><Select value={modeName} onChange={(event) => setModeName(event.target.value)} options={[{ value: "surface", label: "Surface" }, { value: "air", label: "Air" }]} /></Field>
            <Field label="Client ID" required><Input value={String(options.clientId || "")} readOnly /></Field>
            <Checkbox label="Insure this shipment" checked={insured} onChange={(event) => setInsured(event.target.checked)} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">Package dimensions</p>
              <Button type="button" size="sm" variant="secondary" onClick={() => setPackages((rows) => [...rows, { units: 1, weight: "", length: "", width: "", height: "" }])}>Add package</Button>
            </div>
            {packages.map((row, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border border-line p-3 sm:grid-cols-5">
                <Field label="Units"><Input type="number" min="1" value={row.units} onChange={(event) => editPackage(index, { units: event.target.value })} /></Field>
                <Field label="Kg"><Input type="number" min="0.1" step="0.01" value={row.weight} onChange={(event) => editPackage(index, { weight: event.target.value })} /></Field>
                <Field label="L cm"><Input type="number" min="1" value={row.length} onChange={(event) => editPackage(index, { length: event.target.value })} /></Field>
                <Field label="W cm"><Input type="number" min="1" value={row.width} onChange={(event) => editPackage(index, { width: event.target.value })} /></Field>
                <Field label="H cm"><Input type="number" min="1" value={row.height} onChange={(event) => editPackage(index, { height: event.target.value })} /></Field>
                {packages.length > 1 && <Button type="button" variant="danger-outline" size="sm" className="col-span-2 sm:col-span-5" onClick={() => { setPackageEdited(true); setPackages((rows) => rows.filter((_, i) => i !== index)); }}>Remove package</Button>}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="5. Delivery partner" description={needsPartner ? "Check rates, then choose a partner. Shiprocket Cargo and domestic couriers need one." : "Delhivery B2B does not need a partner pick. You can still check the rate."} />
        <CardBody className="space-y-3">
          <Button type="button" onClick={checkRates} loading={checking}>Check serviceability and rates</Button>
          {serviceNote && <p className="text-sm text-ink-soft">{serviceNote}</p>}
          <div className="grid gap-2">
            {partners.map((partner) => (
              <label key={partner.optionName} className="flex cursor-pointer items-start gap-3 rounded-lg border border-line px-3 py-2 text-sm hover:bg-surface-muted">
                <input type="radio" name="partner" className="mt-1" checked={partnerKey === partner.optionName} onChange={() => { setPartnerKey(partner.optionName); if (partner.modeName) setModeName(partner.modeName); }} />
                <span>
                  <span className="font-medium text-ink">{partner.name}</span>
                  {partner.isCheapest && <span className="ml-2 rounded bg-success-bg px-1.5 text-[10px] font-semibold text-success-ink">Cheapest</span>}
                  <span className="block text-xs text-ink-muted">{partner.modeName || "surface"} · {partner.rate == null ? "Rate unavailable" : formatINR(partner.rate)}{partner.tat != null ? ` · ${partner.tat} days` : ""}</span>
                </span>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Shipment and payment" description="Invoice number is generated the same way as the PHP screen. COD amount defaults to invoice minus advance." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Invoice number"><Input value={options.invoiceNumber || ""} readOnly /></Field>
          <Field label="Invoice date"><Input type="date" value={invoiceDate} onChange={(event) => setInvoiceDate(event.target.value)} /></Field>
          <Field label="Pickup date and time" hint="Required only when a shipment is created with the order."><Input type="datetime-local" value={pickupAt} onChange={(event) => setPickupAt(event.target.value)} /></Field>
          <Field label="E-way bill" hint="Required if the invoice is over ₹50,000 and a shipment is created now."><Input value={eway} onChange={(event) => setEway(event.target.value)} /></Field>
          <Field label="Remarks" className="sm:col-span-2"><Input value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional shipment remarks" /></Field>
          <Checkbox label="Automatically create shipment after the order" checked={autoShip} onChange={(event) => setAutoShip(event.target.checked)} />
          <Checkbox label="Cash on delivery" checked={cod} onChange={(event) => { setCod(event.target.checked); if (event.target.checked && !codEdited) setCodAmount(codBalance.toFixed(2)); }} />
          {cod && (
            <Field label="COD amount (₹)" hint="Balance of invoice value minus advance. Edit if the amount should differ.">
              <Input type="number" min="0" step="0.01" value={codAmount} onChange={(event) => { setCodEdited(true); setCodAmount(event.target.value); }} />
            </Field>
          )}
          <Field label="Supporting document URLs" hint="Optional. One http(s) URL per line, up to 5." className="sm:col-span-2 lg:col-span-3">
            <Textarea value={docText} onChange={(event) => setDocText(event.target.value)} placeholder="https://..." />
          </Field>
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" loading={saving} disabled={Boolean(result)}>Create order</Button>
        <ButtonLink href="/admin/bulk-orders/shipments" variant="secondary">Go to shipments</ButtonLink>
      </div>

      <Dialog open={customerOpen} onClose={() => setCustomerOpen(false)} title="Add customer" description="Saved to the customer list and the address book, the same as the PHP create-order screen." size="lg">
        <form id="new-bulk-customer" onSubmit={saveCustomer} className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" required className="sm:col-span-2"><Input value={draft.fullname} onChange={(event) => setDraft({ ...draft, fullname: event.target.value })} required /></Field>
          <Field label="Email"><Input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></Field>
          <Field label="Phone" required><Input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} required /></Field>
          <Field label="Alternative phone"><Input value={draft.alternatePhone} onChange={(event) => setDraft({ ...draft, alternatePhone: event.target.value.replace(/\D/g, "").slice(0, 10) })} /></Field>
          <Field label="Land holding"><Input value={draft.landHoldingValue} onChange={(event) => setDraft({ ...draft, landHoldingValue: event.target.value })} /></Field>
          <Field label="Unit"><Select value={draft.landHoldingUnit} onChange={(event) => setDraft({ ...draft, landHoldingUnit: event.target.value })} options={LAND_UNITS} /></Field>
          <Field label="Season"><Input value={draft.season} onChange={(event) => setDraft({ ...draft, season: event.target.value })} /></Field>
          <Field label="Crop"><Input value={draft.crop} onChange={(event) => setDraft({ ...draft, crop: event.target.value })} /></Field>
          <Field label="Soil"><Select value={draft.soil} onChange={(event) => setDraft({ ...draft, soil: event.target.value })} placeholder="Select soil type" options={SOILS} /></Field>
          <Field label="Water source"><Select value={draft.water} onChange={(event) => setDraft({ ...draft, water: event.target.value })} placeholder="Select water source" options={WATERS} /></Field>
          <Field label="Address" required className="sm:col-span-2"><Input value={draft.fulladdress} onChange={(event) => setDraft({ ...draft, fulladdress: event.target.value })} required /></Field>
          <Field label="City"><Input value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} /></Field>
          <Field label="District"><Input value={draft.district} onChange={(event) => setDraft({ ...draft, district: event.target.value })} /></Field>
          <Field label="State"><Input value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value })} /></Field>
          <Field label="Pincode"><Input value={draft.pincode} onChange={(event) => setDraft({ ...draft, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })} /></Field>
          <Field label="Address type"><Input value={draft.addresstype} onChange={(event) => setDraft({ ...draft, addresstype: event.target.value })} /></Field>
        </form>
        <div className="mt-4 flex justify-end">
          <Button type="submit" form="new-bulk-customer" loading={savingCustomer}>Save customer</Button>
        </div>
      </Dialog>
    </form>
  );
}

function AddressCard({ title, hint, value, onChange, offices, onPincode, vendors, warehouses, onVendor, onWarehouse, showAlt, requireOffice }) {
  const [warehouseKey, setWarehouseKey] = useState("");
  const officeNames = value.postOffice && !offices.includes(value.postOffice) ? [value.postOffice, ...offices] : offices;
  return (
    <Card>
      <CardHeader title={title} description={hint} />
      <CardBody className="grid gap-3 sm:grid-cols-2">
        {vendors && (
          <Field label="Vendor" hint="Stores GST and company on the order and fills the fields below." className="sm:col-span-2">
            <Select value={String(value.vendorId || "")} onChange={(event) => onVendor(event.target.value)} placeholder="Select a vendor (optional)" options={vendors.map((row) => ({ value: String(row.id), label: row.label }))} />
          </Field>
        )}
        {warehouses && (
          <Field label="Saved warehouse" className="sm:col-span-2">
            <Select value={warehouseKey} onChange={(event) => { setWarehouseKey(event.target.value); onWarehouse(event.target.value); }} placeholder="Select a warehouse to auto-fill" options={warehouses.map((row, index) => ({ value: String(index), label: [row.name, row.city].filter(Boolean).join(" — ") }))} />
          </Field>
        )}
        <Field label="Warehouse name" required className="sm:col-span-2"><Input value={value.warehouseName} onChange={(event) => onChange({ warehouseName: event.target.value })} /></Field>
        <Field label="Address line 1" required className="sm:col-span-2"><Input value={value.address1} onChange={(event) => onChange({ address1: event.target.value })} /></Field>
        <Field label="Pincode" required><Input value={value.pincode} maxLength={6} onChange={(event) => onChange({ pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })} onBlur={onPincode} /></Field>
        <Field label="Post office" required={requireOffice && offices.length > 0}>
          <Select value={value.postOffice} onChange={(event) => onChange({ postOffice: event.target.value })} placeholder="Choose post office" options={officeNames.map((name) => ({ value: name, label: name }))} />
        </Field>
        <Field label="City" required><Input value={value.city} onChange={(event) => onChange({ city: event.target.value })} /></Field>
        <Field label="District" required><Input value={value.district} onChange={(event) => onChange({ district: event.target.value })} /></Field>
        <Field label="State" required><Input value={value.state} onChange={(event) => onChange({ state: event.target.value })} /></Field>
        <Field label="Country" required><Input value={value.country} onChange={(event) => onChange({ country: event.target.value })} /></Field>
        <Field label="Contact person" required className="sm:col-span-2"><Input value={value.contactName} onChange={(event) => onChange({ contactName: event.target.value })} /></Field>
        <Field label="Email" required><Input type="email" value={value.email} onChange={(event) => onChange({ email: event.target.value })} /></Field>
        <Field label="Contact no" required><Input value={value.phone} onChange={(event) => onChange({ phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} /></Field>
        {showAlt && <Field label="Alternate contact"><Input value={value.altPhone} onChange={(event) => onChange({ altPhone: event.target.value.replace(/\D/g, "").slice(0, 10) })} /></Field>}
      </CardBody>
    </Card>
  );
}
