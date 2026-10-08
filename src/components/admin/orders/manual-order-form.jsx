"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Minus, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  createManualCustomerAction,
  createManualOrderAction,
  lookupManualLeadAction,
  lookupManualPincodeAction,
  quoteManualOrderAction,
  searchManualCustomersAction,
  searchManualProductsAction,
  startManualPaymentAction,
} from "@/lib/actions/admin/orders";

const EMPTY_QUOTE = {
  lines: [],
  subtotal: 0,
  shippingFee: 0,
  handlingFee: 0,
  tax: 0,
  paymentDiscount: 0,
  coupon: null,
  wallet: { balance: 0, applied: 0 },
  total: 0,
  minimumAdvance: 0,
  advanceAmount: 0,
  balance: 0,
  minimumOrderValue: 500,
  minimumCodValue: 500,
  cod: { available: true, reason: "" },
  couriers: [],
  serviceable: null,
  serviceMessage: "",
  razorpayEnabled: false,
};

const LAND_UNITS = ["Square Feet", "Bigha", "Acre", "Hectare", "Guntha", "Biswa"];
const SOILS = ["Sandy", "Clay", "Loamy", "Black", "Red", "Other"];
const WATERS = ["Canal", "Borewell", "Rainwater", "Drip Irrigation", "Tank", "Other"];

const digits = (value, max) => String(value || "").replace(/\D/g, "").slice(0, max);

function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the payment window."));
    document.body.appendChild(script);
  });
}

export function ManualOrderForm({ leadCode = "" }) {
  const { notify } = useToast();
  const [customerQuery, setCustomerQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [lead, setLead] = useState(leadCode);
  const [shipping, setShipping] = useState({
    name: "", address1: "", address2: "", pincode: "", postOffice: "", city: "", state: "", phone: "", alternateMobile: "",
  });
  const [offices, setOffices] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productOpen, setProductOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("partial");
  const [advance, setAdvance] = useState("");
  const [advanceEdited, setAdvanceEdited] = useState(false);
  const [advanceNote, setAdvanceNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [courierId, setCourierId] = useState("");
  const [quote, setQuote] = useState(EMPTY_QUOTE);
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [createdId, setCreatedId] = useState("");
  const [customerModal, setCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState(blankCustomer);

  const payload = useMemo(() => ({
    customerId: customer?.id,
    userUniqueId: customer?.userUniqueId || "",
    phone: shipping.phone || customer?.phone || "",
    paymentMode,
    items: items.map((item) => ({ productId: item.productId, qty: item.qty })),
    shipping,
    leadCode: lead,
    couponCode: appliedCoupon,
    walletAmount: useWallet ? Number(walletAmount) || 0 : 0,
    advanceAmount: paymentMode === "partial" ? Number(advance) || undefined : undefined,
    advanceNote,
  }), [customer, shipping, paymentMode, items, lead, appliedCoupon, useWallet, walletAmount, advance, advanceNote]);

  useEffect(() => {
    if (!leadCode) return;
    lookupManualLeadAction(leadCode).then((data) => {
      if (!data || data.ok === false || !data.found) return;
      if (data.userFound && data.user?.phone) {
        setCustomerQuery(data.user.phone);
        searchManualCustomersAction(data.user.phone).then((rows) => {
          const match = (rows || []).find((row) => String(row.id) === String(data.user.id)) || rows?.[0];
          if (match) chooseCustomer(match);
        });
      } else {
        setNewCustomer((form) => ({ ...form, fullname: data.leadName || "", phone: digits(data.mobile, 10) }));
        setCustomerModal(true);
      }
    });
    // The lead is only read once, from the URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadCode]);

  useEffect(() => {
    if (customerQuery.trim().length < 2) {
      setCustomers([]);
      return undefined;
    }
    const timer = setTimeout(() => {
      searchManualCustomersAction(customerQuery.trim()).then((rows) => {
        setCustomers(Array.isArray(rows) ? rows : []);
        setCustomerOpen(true);
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [customerQuery]);

  useEffect(() => {
    if (productQuery.trim().length < 2) {
      setProducts([]);
      return undefined;
    }
    const timer = setTimeout(() => {
      searchManualProductsAction(productQuery.trim()).then((rows) => {
        setProducts(Array.isArray(rows) ? rows : []);
        setProductOpen(true);
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [productQuery]);

  useEffect(() => {
    const pin = shipping.pincode;
    if (pin.length !== 6) return undefined;
    const timer = setTimeout(() => {
      lookupManualPincodeAction(pin).then((data) => {
        if (!data || data.ok === false) return;
        setOffices(data.postOffices || []);
        setShipping((current) => ({
          ...current,
          city: current.city || data.district || "",
          state: current.state || data.state || "",
          postOffice: current.postOffice || data.postOffices?.[0] || "",
        }));
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [shipping.pincode]);

  useEffect(() => {
    if (!items.length) {
      setQuote(EMPTY_QUOTE);
      return undefined;
    }
    const timer = setTimeout(() => {
      quoteManualOrderAction(payload).then((data) => {
        if (!data || data.ok === false) {
          if (data?.message) setFormError(data.message);
          return;
        }
        setQuote(data);
        if (paymentMode === "partial" && !advanceEdited) setAdvance(String(data.minimumAdvance || 0));
        if (data.cod && !data.cod.available && paymentMode === "cod") setPaymentMode("prepaid");
        setCourierId((current) => {
          if (data.couriers?.some((courier) => courier.id === current)) return current;
          const cheapest = [...(data.couriers || [])].sort((a, b) => a.charges - b.charges)[0];
          return cheapest?.id || "";
        });
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [payload, items.length, paymentMode, advanceEdited]);

  function chooseCustomer(row) {
    const address = row.address || {};
    setCustomer(row);
    setCustomerQuery(`${row.fullname}${row.phone ? ` · ${row.phone}` : ""}`);
    setCustomerOpen(false);
    setUseWallet(false);
    setWalletAmount("");
    setShipping({
      name: row.fullname || "",
      address1: address.address1 || address.fulladdress || "",
      address2: address.address2 || "",
      pincode: digits(address.pincode, 6),
      postOffice: address.post_office || "",
      city: address.city || address.district || row.city || "",
      state: address.state || row.state || "",
      phone: digits(row.phone, 10),
      alternateMobile: digits(row.alternatePhone, 10),
    });
  }

  function addProduct(product) {
    if (!product.stock) {
      setFormError(`${product.name} is out of stock.`);
      return;
    }
    setFormError("");
    setProductOpen(false);
    setProductQuery("");
    setItems((list) => {
      const existing = list.find((item) => item.sku === product.sku);
      if (existing) return list.map((item) => (item.sku === product.sku ? { ...item, qty: Math.min(item.qty + 1, product.stock || 50) } : item));
      return [...list, { productId: product.id, name: product.name, sku: product.sku, price: product.price, qty: 1, stock: product.stock, sellerId: product.sellerId, sellerName: product.sellerName }];
    });
  }

  function setQty(sku, qty) {
    setItems((list) => list.map((item) => (item.sku === sku ? { ...item, qty: Math.max(1, Math.min(Number(qty) || 1, item.stock || 50)) } : item)));
  }

  function validate() {
    if (!customer) return "Select a customer.";
    if (!items.length) return "Add at least one product.";
    if (!shipping.name.trim() || !shipping.address1.trim() || !shipping.city.trim() || !shipping.state.trim()) return "Fill the shipping name, address, district and state.";
    if (shipping.pincode.length !== 6) return "Enter a valid shipping pincode (6 digits).";
    if (shipping.phone.length !== 10) return "Enter a 10-digit shipping mobile.";
    if (quote.serviceable === false) return quote.serviceMessage || "No couriers available for this pincode.";
    if (quote.couriers.length && !courierId) return "Select a shipping courier.";
    if (paymentMode === "cod" && quote.cod && !quote.cod.available) return quote.cod.reason || "COD is not available.";
    if (paymentMode === "cod" && quote.total > 0 && quote.total < quote.minimumCodValue) return `Minimum COD order value is ₹${quote.minimumCodValue}.`;
    if (paymentMode !== "prepaid" && paymentMode !== "partial" && quote.total > 0 && quote.total < quote.minimumOrderValue) return `Minimum order value is ₹${quote.minimumOrderValue}.`;
    if (paymentMode === "partial") {
      const amount = Number(advance) || 0;
      if (amount < quote.minimumAdvance) return `Partial advance must be at least Rs. ${quote.minimumAdvance.toFixed(2)}.`;
      if (amount > quote.total) return `Partial advance cannot be more than Rs. ${quote.total.toFixed(2)}.`;
      if (amount > quote.minimumAdvance && !advanceNote.trim()) return "Add a note when the advance is above 10%.";
    }
    return "";
  }

  async function place(payment) {
    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }
    setBusy(true);
    setFormError("");
    const result = await createManualOrderAction({ ...payload, courier: courierOf(quote.couriers, courierId), payment });
    setBusy(false);
    if (result?.ok) {
      notify({ message: result.message, tone: "success" });
      setCreatedId(result.id);
    } else {
      setFormError(result?.message || "Could not create the order.");
    }
  }

  async function payOnline() {
    const problem = validate();
    if (problem) {
      setFormError(problem);
      return;
    }
    if (quote.total <= 0.01) {
      place();
      return;
    }
    setBusy(true);
    setFormError("");
    const started = await startManualPaymentAction(payload);
    if (!started || started.ok === false || !started.razorpayOrderId) {
      setBusy(false);
      setFormError(started?.message || "Could not start the payment.");
      return;
    }
    try {
      await loadRazorpay();
    } catch (error) {
      setBusy(false);
      setFormError(error.message);
      return;
    }
    const checkout = new window.Razorpay({
      key: started.keyId,
      amount: started.amountPaise,
      currency: "INR",
      name: "Bharat AgroLink",
      description: paymentMode === "partial" ? "Partial advance" : "Prepaid order",
      order_id: started.razorpayOrderId,
      prefill: { name: shipping.name, contact: shipping.phone, email: customer?.email || "" },
      handler: (response) => {
        place({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    checkout.on("payment.failed", (response) => {
      setBusy(false);
      setFormError(response?.error?.description || "Payment failed. You can retry.");
    });
    checkout.open();
  }

  async function saveCustomer(event) {
    event.preventDefault();
    setBusy(true);
    const result = await createManualCustomerAction(newCustomer);
    setBusy(false);
    if (!result?.ok) {
      setFormError(result?.message || "Could not save the customer.");
      return;
    }
    notify({ message: result.message, tone: "success" });
    setCustomerModal(false);
    if (result.leadCode) setLead(result.leadCode);
    const saved = result.customer;
    if (saved) {
      chooseCustomer({
        id: saved.id,
        userUniqueId: saved.userUniqueId,
        fullname: saved.fullname,
        email: saved.email,
        phone: saved.phone,
        alternatePhone: saved.alternatePhone,
        address: saved.address,
      });
    }
    setNewCustomer(blankCustomer());
  }

  if (createdId) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardBody className="space-y-3 py-10 text-center">
          <p className="text-lg font-semibold text-success-ink">Order created</p>
          <p className="text-sm text-ink-muted">Manual order <span className="font-mono text-ink">{createdId}</span> is placed.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" variant="primary" onClick={() => window.location.reload()}>Create another order</Button>
            <ButtonLink href={`/admin/orders/${encodeURIComponent(createdId)}`} variant="secondary">Open this order</ButtonLink>
            <ButtonLink href="/admin/orders" variant="secondary">View all orders</ButtonLink>
          </div>
        </CardBody>
      </Card>
    );
  }

  const online = paymentMode === "prepaid" || paymentMode === "partial";
  const walletCovers = online && quote.wallet.applied > 0 && quote.total <= 0.01;
  const payLabel = paymentMode === "partial" ? `Pay advance ${formatINR(Number(advance) || quote.advanceAmount || 0)}` : `Pay ${formatINR(quote.total)}`;
  const selectedCourier = courierOf(quote.couriers, courierId);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="primary" size="sm" onClick={() => setCustomerModal(true)}><UserPlus className="size-3.5" /> New customer</Button>
      </div>
      {formError && <Notice tone="danger">{formError}</Notice>}

      <Card>
        <CardHeader title="1. Customer information and shipping address" />
        <CardBody className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Select customer" required className="md:col-span-2">
              {({ id }) => (
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
                  <Input id={id} className="pl-9" value={customerQuery} autoComplete="off" placeholder="Search by name, email or phone" onChange={(event) => { setCustomerQuery(event.target.value); setCustomerOpen(true); }} onFocus={() => customers.length && setCustomerOpen(true)} />
                  {customerOpen && customers.length > 0 && (
                    <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-line bg-surface shadow-lg">
                      {customers.map((row) => (
                        <li key={row.id}>
                          <button type="button" className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => chooseCustomer(row)}>
                            <span className="font-medium text-ink">{row.fullname}</span>
                            <span className="text-xs text-ink-muted">{row.phone}{row.email ? ` · ${row.email}` : ""} · {row.orders} orders</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Field>
            <Field label="Lead code">
              {({ id }) => <Input id={id} value={lead} placeholder="Lead code" onChange={(event) => setLead(event.target.value)} />}
            </Field>
          </div>

          {customer && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2 text-sm">
              <div>
                <span className="font-medium text-ink">{customer.fullname}</span>
                <span className="text-ink-muted"> · {customer.phone}{customer.email ? ` · ${customer.email}` : ""} · {customer.orders} orders</span>
              </div>
              <Link href={`/admin/customers/${customer.id}`} className="text-[13px] font-medium text-brand-700 hover:underline">View customer</Link>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Full name" required>{({ id }) => <Input id={id} value={shipping.name} onChange={(event) => patchShipping(setShipping, { name: event.target.value })} />}</Field>
            <Field label="Address line 1" required className="sm:col-span-1 lg:col-span-3">{({ id }) => <Input id={id} value={shipping.address1} onChange={(event) => patchShipping(setShipping, { address1: event.target.value })} />}</Field>
            <Field label="Address line 2" className="sm:col-span-2 lg:col-span-4">{({ id }) => <Input id={id} value={shipping.address2} onChange={(event) => patchShipping(setShipping, { address2: event.target.value })} />}</Field>
            <Field label="Pincode" required>
              {({ id }) => <Input id={id} inputMode="numeric" value={shipping.pincode} placeholder="6-digit pincode" onChange={(event) => patchShipping(setShipping, { pincode: digits(event.target.value, 6), postOffice: "" })} />}
            </Field>
            <Field label="Post office" required>
              {({ id }) => (
                <Select id={id} value={shipping.postOffice} onChange={(event) => patchShipping(setShipping, { postOffice: event.target.value })} options={offices.map((name) => ({ value: name, label: name }))} placeholder="Choose post office" />
              )}
            </Field>
            <Field label="District" required>{({ id }) => <Input id={id} value={shipping.city} onChange={(event) => patchShipping(setShipping, { city: event.target.value })} />}</Field>
            <Field label="State" required>{({ id }) => <Input id={id} value={shipping.state} onChange={(event) => patchShipping(setShipping, { state: event.target.value })} />}</Field>
            <Field label="Primary mobile" required>{({ id }) => <Input id={id} inputMode="numeric" value={shipping.phone} onChange={(event) => patchShipping(setShipping, { phone: digits(event.target.value, 10) })} />}</Field>
            <Field label="Alternate mobile">{({ id }) => <Input id={id} inputMode="numeric" value={shipping.alternateMobile} onChange={(event) => patchShipping(setShipping, { alternateMobile: digits(event.target.value, 10) })} />}</Field>
            <Field label="Country">{({ id }) => <Select id={id} value="India" options={[{ value: "India", label: "India" }]} onChange={() => {}} />}</Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="2. Product selection" />
        <CardBody className="space-y-3">
          <Field label="Search products" required>
            {({ id }) => (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-muted" />
                <Input id={id} className="pl-9" value={productQuery} autoComplete="off" placeholder="Search products by name or SKU" onChange={(event) => { setProductQuery(event.target.value); setProductOpen(true); }} onFocus={() => products.length && setProductOpen(true)} />
                {productOpen && products.length > 0 && (
                  <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-line bg-surface shadow-lg">
                    {products.map((product) => (
                      <li key={`${product.id}-${product.sku}`} className="flex items-center gap-3 border-b border-line px-3 py-2 last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-ink-muted">SKU: {product.sku} · {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}{product.sellerName ? ` · ${product.sellerName}` : ""}</p>
                        </div>
                        <span className="text-sm font-semibold tabular">{formatINR(product.price)}</span>
                        <Button type="button" size="xs" onClick={() => addProduct(product)}><Plus className="size-3.5" /> Add</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Field>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-muted">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium">SKU</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 font-medium">Price</th>
                  <th className="py-2 font-medium">Subtotal</th>
                  <th className="py-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-ink-muted">No products selected yet</td></tr>
                )}
                {items.map((item) => {
                  const priced = quote.lines.find((line) => line.productId === item.productId) || item;
                  return (
                    <tr key={item.sku} className="border-b border-line">
                      <td className="py-2 pr-2">
                        <p className="font-medium text-ink">{item.name}</p>
                        <p className="mt-1 flex flex-wrap gap-2 text-xs">
                          <Link href={`/admin/products/${item.productId}`} className="text-brand-700 hover:underline">Product</Link>
                          {item.sellerId && <Link href={`/admin/vendors/${item.sellerId}`} className="text-brand-700 hover:underline">{item.sellerName || "Vendor"}</Link>}
                        </p>
                      </td>
                      <td className="py-2 font-mono text-xs text-ink-muted">{item.sku}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          <Button type="button" size="icon-sm" variant="secondary" aria-label="Decrease quantity" onClick={() => setQty(item.sku, item.qty - 1)}><Minus className="size-3.5" /></Button>
                          <Input className="h-8 w-14 text-center" type="number" min={1} value={item.qty} onChange={(event) => setQty(item.sku, event.target.value)} />
                          <Button type="button" size="icon-sm" variant="secondary" aria-label="Increase quantity" onClick={() => setQty(item.sku, item.qty + 1)}><Plus className="size-3.5" /></Button>
                        </div>
                      </td>
                      <td className="py-2 tabular">{formatINR(priced.price)}</td>
                      <td className="py-2 font-semibold tabular">{formatINR(priced.subtotal ?? priced.price * item.qty)}</td>
                      <td className="py-2"><Button type="button" variant="ghost" size="icon-sm" aria-label="Remove product" onClick={() => setItems((list) => list.filter((row) => row.sku !== item.sku))}><Trash2 className="size-4" /></Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="3. Shipping and payment options" />
        <CardBody className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Shipping courier" required hint={selectedCourier?.edd ? `Estimated delivery: ${selectedCourier.edd}` : quote.serviceMessage}>
              {({ id }) => (
                <Select
                  id={id}
                  value={courierId}
                  onChange={(event) => setCourierId(event.target.value)}
                  placeholder={quote.couriers.length ? "Select shipping" : "Enter a pincode and add products"}
                  options={quote.couriers.map((courier) => ({ value: courier.id, label: `${courier.name}${courier.charges ? ` (${formatINR(courier.charges)})` : ""}` }))}
                />
              )}
            </Field>
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-ink-soft">Payment method <span className="text-danger-ink">*</span></p>
              <div className="grid grid-cols-3 gap-2">
                <PayOption mode="prepaid" current={paymentMode} title="Prepaid" badge="3% OFF" onSelect={setPaymentMode} />
                <PayOption mode="partial" current={paymentMode} title="Partial" badge="1% OFF" onSelect={setPaymentMode} />
                <PayOption mode="cod" current={paymentMode} title="COD" disabled={quote.cod && !quote.cod.available} onSelect={setPaymentMode} />
              </div>
              {quote.cod && !quote.cod.available && <p className="mt-1 text-xs text-danger-ink">{quote.cod.reason}</p>}
            </div>
          </div>

          {paymentMode === "partial" && (
            <div className="grid gap-3 rounded-lg border border-line bg-surface-muted p-3 md:grid-cols-2">
              <Field label="Advance amount" hint={`Min 10%: ${formatINR(quote.minimumAdvance)} · Balance ${formatINR(Math.max(0, quote.total - (Number(advance) || 0)))}`}>
                {({ id }) => <Input id={id} inputMode="decimal" value={advance} onChange={(event) => { setAdvanceEdited(true); setAdvance(event.target.value.replace(/[^0-9.]/g, "")); }} />}
              </Field>
              <Field label="Advance note" hint="Required if the advance is above 10%">
                {({ id }) => <Textarea id={id} rows={2} maxLength={500} value={advanceNote} onChange={(event) => setAdvanceNote(event.target.value)} />}
              </Field>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Coupon code">
              {({ id }) => (
                <div className="flex gap-2">
                  <Input id={id} value={couponCode} placeholder="Enter coupon code" onChange={(event) => setCouponCode(event.target.value)} />
                  <Button type="button" variant="secondary" onClick={() => setAppliedCoupon(couponCode.trim())}>Apply</Button>
                </div>
              )}
            </Field>
            {customer && (
              <div className="rounded-lg border border-line p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">CN wallet credit</span>
                  <span className="font-semibold text-success-ink">{formatINR(quote.wallet.balance)}</span>
                </div>
                <Checkbox label="Use CN wallet in this order" checked={useWallet} onChange={(event) => { setUseWallet(event.target.checked); if (event.target.checked && !walletAmount) setWalletAmount(String(quote.wallet.balance || "")); }} />
                <div className="mt-2 flex gap-2">
                  <Input inputMode="decimal" disabled={!useWallet} value={walletAmount} placeholder="Amount to use" onChange={(event) => setWalletAmount(event.target.value.replace(/[^0-9.]/g, ""))} />
                  <Button type="button" variant="secondary" disabled={!useWallet} onClick={() => { setUseWallet(true); setWalletAmount(String(quote.wallet.balance || 0)); }}>Use max</Button>
                </div>
                {quote.coupon && <p className={cn("mt-2 text-xs", quote.coupon.valid ? "text-success-ink" : "text-danger-ink")}>{quote.coupon.message}</p>}
              </div>
            )}
          </div>
          {quote.coupon && !customer && <p className={cn("text-xs", quote.coupon.valid ? "text-success-ink" : "text-danger-ink")}>{quote.coupon.message}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Live order summary" actions={<span className="rounded bg-success-bg px-2 py-0.5 text-[11px] font-semibold text-success-ink">LIVE</span>} />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs text-ink-muted"><th className="py-1">Item</th><th>Qty</th><th className="text-right">Price</th><th className="text-right">Total</th></tr></thead>
                <tbody>
                  {(quote.lines.length ? quote.lines : items).map((line) => (
                    <tr key={line.sku || line.productId} className="border-t border-line">
                      <td className="max-w-[180px] truncate py-1.5">{line.name}</td>
                      <td>{line.qty}</td>
                      <td className="text-right tabular">{formatINR(line.price)}</td>
                      <td className="text-right font-medium tabular">{formatINR(line.subtotal ?? line.price * line.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-1.5 rounded-lg bg-surface-muted p-3 text-sm md:col-span-2">
              <Row label="Items subtotal" value={quote.subtotal} />
              <Row label="Shipping charges" value={quote.shippingFee} />
              {quote.handlingFee > 0 && <Row label="Handling fee" value={quote.handlingFee} />}
              <Row label="Tax" value={quote.tax} />
              {quote.coupon?.valid && <Row label="Coupon discount" value={-quote.coupon.discount} />}
              {quote.paymentDiscount > 0 && <Row label="Prepaid/partial discount" value={-quote.paymentDiscount} />}
              {quote.wallet.applied > 0 && <Row label="CN wallet used" value={-quote.wallet.applied} />}
              <div className="flex items-center justify-between border-t border-line pt-2 text-base font-semibold">
                <span>{online && !walletCovers && paymentMode === "prepaid" ? "Payable total" : "Grand total"}</span>
                <span className="tabular">{formatINR(quote.total)}</span>
              </div>
              {paymentMode !== "prepaid" && paymentMode !== "partial" && quote.total > 0 && quote.total < quote.minimumOrderValue && (
                <p className="text-xs text-warning-ink">Minimum order value is {formatINR(quote.minimumOrderValue)}. Add more products.</p>
              )}
              {paymentMode === "cod" && quote.total > 0 && quote.total < quote.minimumCodValue && (
                <p className="text-xs text-danger-ink">Minimum COD order value is {formatINR(quote.minimumCodValue)}.</p>
              )}
              {walletCovers || !online ? (
                <Button type="button" variant="primary" className="mt-2 w-full" loading={busy} onClick={() => place()}>Create order</Button>
              ) : (
                <Button type="button" variant="primary" className="mt-2 w-full" loading={busy} onClick={payOnline}><CreditCard className="size-4" /> {payLabel}</Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Dialog
        open={customerModal}
        onClose={() => setCustomerModal(false)}
        title="Add customer"
        size="lg"
        footer={<Button type="submit" form="new-customer-form" variant="primary" loading={busy}>Save</Button>}
      >
        <form id="new-customer-form" className="grid gap-3 sm:grid-cols-2" onSubmit={saveCustomer}>
          <Field label="Full name" required>{({ id }) => <Input id={id} required value={newCustomer.fullname} onChange={(event) => setNewCustomer((form) => ({ ...form, fullname: event.target.value }))} />}</Field>
          <Field label="Email address">{({ id }) => <Input id={id} type="email" value={newCustomer.email} onChange={(event) => setNewCustomer((form) => ({ ...form, email: event.target.value }))} />}</Field>
          <Field label="Phone" required>{({ id }) => <Input id={id} required inputMode="numeric" value={newCustomer.phone} onChange={(event) => setNewCustomer((form) => ({ ...form, phone: digits(event.target.value, 10) }))} />}</Field>
          <Field label="Alternative phone">{({ id }) => <Input id={id} inputMode="numeric" value={newCustomer.alternatePhone} onChange={(event) => setNewCustomer((form) => ({ ...form, alternatePhone: digits(event.target.value, 10) }))} />}</Field>
          <Field label="Land holding area">
            {({ id }) => <Input id={id} value={newCustomer.landHoldingValue} onChange={(event) => setNewCustomer((form) => ({ ...form, landHoldingValue: event.target.value }))} />}
          </Field>
          <Field label="Unit">
            {({ id }) => <Select id={id} value={newCustomer.landHoldingUnit} placeholder="Select unit" options={LAND_UNITS} onChange={(event) => setNewCustomer((form) => ({ ...form, landHoldingUnit: event.target.value }))} />}
          </Field>
          <Field label="Season">{({ id }) => <Input id={id} value={newCustomer.season} onChange={(event) => setNewCustomer((form) => ({ ...form, season: event.target.value }))} />}</Field>
          <Field label="Crop">{({ id }) => <Input id={id} value={newCustomer.crop} onChange={(event) => setNewCustomer((form) => ({ ...form, crop: event.target.value }))} />}</Field>
          <Field label="Soil type">{({ id }) => <Select id={id} value={newCustomer.soil} placeholder="Select soil type" options={SOILS} onChange={(event) => setNewCustomer((form) => ({ ...form, soil: event.target.value }))} />}</Field>
          <Field label="Water source">{({ id }) => <Select id={id} value={newCustomer.water} placeholder="Select water source" options={WATERS} onChange={(event) => setNewCustomer((form) => ({ ...form, water: event.target.value }))} />}</Field>
          <Field label="Address line 1" required className="sm:col-span-2">{({ id }) => <Input id={id} required value={newCustomer.address1} onChange={(event) => setNewCustomer((form) => ({ ...form, address1: event.target.value }))} />}</Field>
          <Field label="Address line 2" className="sm:col-span-2">{({ id }) => <Input id={id} value={newCustomer.address2} onChange={(event) => setNewCustomer((form) => ({ ...form, address2: event.target.value }))} />}</Field>
          <PincodeFields form={newCustomer} setForm={setNewCustomer} />
          <Field label="Address type">{({ id }) => <Select id={id} value={newCustomer.addressType} options={["Home", "Work", "Other"]} onChange={(event) => setNewCustomer((form) => ({ ...form, addressType: event.target.value }))} />}</Field>
        </form>
      </Dialog>
    </div>
  );
}

function blankCustomer() {
  return {
    fullname: "", email: "", phone: "", alternatePhone: "", landHoldingValue: "", landHoldingUnit: "",
    season: "", crop: "", soil: "", water: "", address1: "", address2: "", pincode: "", postOffice: "",
    city: "", state: "", addressType: "Home",
  };
}

function patchShipping(setShipping, patch) {
  setShipping((current) => ({ ...current, ...patch }));
}

function courierOf(couriers, id) {
  const courier = (couriers || []).find((row) => row.id === id);
  return courier ? { id: courier.id, name: courier.name } : undefined;
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium tabular">{formatINR(value)}</span>
    </div>
  );
}

function PayOption({ mode, current, title, badge, disabled, onSelect }) {
  const active = current === mode;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(mode)}
      className={cn(
        "rounded-lg border px-2 py-3 text-center text-sm disabled:cursor-not-allowed disabled:opacity-50",
        active ? "border-brand-600 bg-brand-50 font-semibold text-brand-700" : "border-line bg-surface text-ink",
      )}
    >
      <span className="block">{title}</span>
      {badge && <span className="mt-1 inline-block rounded bg-success-bg px-1.5 text-[10px] font-semibold text-success-ink">{badge}</span>}
    </button>
  );
}

function PincodeFields({ form, setForm }) {
  const [offices, setOffices] = useState([]);
  useEffect(() => {
    if (form.pincode.length !== 6) return undefined;
    const timer = setTimeout(() => {
      lookupManualPincodeAction(form.pincode).then((data) => {
        if (!data || data.ok === false) return;
        setOffices(data.postOffices || []);
        setForm((current) => ({
          ...current,
          city: current.city || data.district || "",
          state: current.state || data.state || "",
          postOffice: current.postOffice || data.postOffices?.[0] || "",
        }));
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [form.pincode, setForm]);

  return (
    <>
      <Field label="Pincode" required>{({ id }) => <Input id={id} required inputMode="numeric" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: digits(event.target.value, 6), postOffice: "" }))} />}</Field>
      <Field label="Post office">{({ id }) => <Select id={id} value={form.postOffice} placeholder="Choose post office" options={offices.map((name) => ({ value: name, label: name }))} onChange={(event) => setForm((current) => ({ ...current, postOffice: event.target.value }))} />}</Field>
      <Field label="District" required>{({ id }) => <Input id={id} required value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />}</Field>
      <Field label="State" required>{({ id }) => <Input id={id} required value={form.state} onChange={(event) => setForm((current) => ({ ...current, state: event.target.value }))} />}</Field>
    </>
  );
}
