"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveB2bOrder, searchB2bOrderBuyers, searchB2bOrderProducts, startB2bOrderPayment } from "@/lib/actions/admin/b2b-screens";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { formatINR } from "@/lib/format";

const emptyLine = { productId: 0, variantId: 0, sku: "", name: "", quantity: 1, unitPrice: 0, gstPct: 0, stock: 0 };

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

export function OrderForm({ options }) {
  const router = useRouter();
  const [buyerQuery, setBuyerQuery] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [buyerSearched, setBuyerSearched] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [productSearched, setProductSearched] = useState(false);
  const [customerId, setCustomerId] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [customerTypeId, setCustomerTypeId] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [paymentMode, setPaymentMode] = useState("Prepaid");
  const [advancePct, setAdvancePct] = useState("20");
  const [lines, setLines] = useState([]);
  const [shippingCost, setShippingCost] = useState("0");
  const [freightMode, setFreightMode] = useState("auto");
  const [handlingCharges, setHandlingCharges] = useState("0");
  const [pgCharges, setPgCharges] = useState("0");
  const [otherCharges, setOtherCharges] = useState("0");
  const [claimsRisk, setClaimsRisk] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [searchingBuyers, startBuyers] = useTransition();
  const [searchingProducts, startProducts] = useTransition();
  const [paying, setPaying] = useState(false);
  const [saving, startSave] = useTransition();

  const type = options.customerTypes.find((item) => String(item.id) === String(customerTypeId));
  const subtotal = lines.reduce((sum, line) => sum + (Number(line.unitPrice) || 0) * (Number(line.quantity) || 0), 0);
  const gst = lines.reduce((sum, line) => sum + ((Number(line.unitPrice) || 0) * (Number(line.quantity) || 0) * (Number(line.gstPct) || 0)) / 100, 0);
  const charges = (Number(handlingCharges) || 0) + (Number(pgCharges) || 0) + (Number(otherCharges) || 0);
  const payable = subtotal + gst + charges;
  const advance = Math.min(99, Math.max(0, Number(advancePct) || 0));
  const due = paymentMode === "Prepaid" ? payable : (payable * advance) / 100;
  const paid = Boolean(payment?.razorpayPaymentId);

  function payload(extra = {}) {
    return {
      customerId,
      customerTypeId: Number(customerTypeId) || 0,
      customerName,
      customerMobile,
      businessName,
      gstin,
      paymentMode,
      creditDays: 0,
      advancePct: paymentMode === "Partial Advance" ? advance : 0,
      pincode,
      state,
      district,
      villageCity: district,
      deliveryAddress,
      addressLine2,
      shippingCost: Number(shippingCost) || 0,
      freightMode,
      freightCarrier: "",
      freightSource: "",
      freightChargeableKg: 0,
      handlingCharges: Number(handlingCharges) || 0,
      pgCharges: Number(pgCharges) || 0,
      otherCharges: Number(otherCharges) || 0,
      claimsRiskAmount: Number(claimsRisk) || 0,
      remarks,
      lines: lines.filter((line) => line.productId > 0).map((line) => ({
        productId: line.productId,
        variantId: line.variantId || 0,
        sku: line.sku || "",
        quantity: Number(line.quantity) || 0,
        unitPrice: Number(line.unitPrice) || 0,
      })),
      razorpayOrderId: extra.razorpayOrderId || payment?.razorpayOrderId || "",
      razorpayPaymentId: extra.razorpayPaymentId || payment?.razorpayPaymentId || "",
      razorpaySignature: extra.razorpaySignature || payment?.razorpaySignature || "",
      pendingOrderId: extra.pendingOrderId || payment?.pendingOrderId || "",
    };
  }

  function lookupBuyers(value) {
    setBuyerQuery(value);
    setBuyerSearched(false);
    if (value.trim().length < 2) {
      setBuyers([]);
      return;
    }
    startBuyers(async () => {
      const result = await searchB2bOrderBuyers(value.trim());
      setBuyers(result.ok ? result.buyers : []);
      setBuyerSearched(true);
      if (!result.ok) setError(result.message);
    });
  }

  function chooseBuyer(buyer) {
    setCustomerId(buyer.id);
    setBuyerQuery(buyer.businessName ? `${buyer.businessName} (${buyer.name})` : buyer.name);
    setBuyers([]);
    setBuyerSearched(false);
    setCustomerName(buyer.name || "");
    setCustomerMobile(buyer.mobile || "");
    setBusinessName(buyer.businessName || "");
    setGstin(buyer.gstin || "");
    setPincode(buyer.pincode || "");
    setDistrict(buyer.district || "");
    setState(buyer.state || "");
    setDeliveryAddress(buyer.address || "");
    if (buyer.customerTypeId) setCustomerTypeId(String(buyer.customerTypeId));
  }

  function lookupProducts(value) {
    setProductQuery(value);
    setProductSearched(false);
    if (value.trim().length < 2) {
      setProducts([]);
      return;
    }
    startProducts(async () => {
      const result = await searchB2bOrderProducts(value.trim());
      setProducts(result.ok ? result.products : []);
      setProductSearched(true);
      if (!result.ok) setError(result.message);
    });
  }

  function addProduct(product) {
    setLines((current) => {
      if (current.some((line) => line.productId === product.productId && line.variantId === product.variantId)) return current;
      return [...current, { ...emptyLine, ...product, quantity: Math.max(1, type?.minMoqBoxes || 1) }];
    });
    setProductQuery("");
    setProducts([]);
    setProductSearched(false);
    setPayment(null);
  }

  function updateLine(index, patch) {
    setPayment(null);
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  function localProblems() {
    if (!customerTypeId) return "Customer Type is mandatory. Please select a Customer Type.";
    if (!customerName.trim()) return "Customer / contact name is required.";
    if (!customerMobile.trim()) return "Customer mobile is required.";
    if (!deliveryAddress.trim() || !pincode.trim() || !district.trim() || !state.trim()) return "Delivery address, pincode, district and state are required.";
    if (!lines.length) return "Add at least one product line before booking the order.";
    return "";
  }

  function book(extra) {
    const problem = localProblems();
    if (problem) {
      setError(problem);
      setDetails([]);
      return;
    }
    setError("");
    setDetails([]);
    startSave(async () => {
      const result = await saveB2bOrder(payload(extra));
      if (!result.ok) {
        setError(result.message || "The order could not be booked.");
        setDetails(result.details || []);
        return;
      }
      router.push(`/admin/b2b/orders/${encodeURIComponent(result.orderNumber || result.id)}`);
    });
  }

  async function payNow() {
    const problem = localProblems();
    if (problem) {
      setError(problem);
      setDetails([]);
      return;
    }
    if (due <= 0) {
      setError("There is nothing to collect for this order.");
      return;
    }
    setPaying(true);
    setError("");
    setDetails([]);
    const started = await startB2bOrderPayment(payload());
    if (!started?.ok || !started.razorpayOrderId) {
      setPaying(false);
      setError(started?.message || "Could not start the payment.");
      setDetails(started?.details || []);
      return;
    }
    try {
      await loadRazorpay();
    } catch (loadError) {
      setPaying(false);
      setError(loadError.message);
      return;
    }
    const checkout = new window.Razorpay({
      key: started.keyId,
      amount: started.amountPaise,
      currency: started.currency || "INR",
      name: "Bharat Agro Link",
      description: paymentMode === "Prepaid" ? "B2B Order — Full Payment" : "B2B Order — Advance",
      order_id: started.razorpayOrderId,
      prefill: { name: customerName, contact: customerMobile },
      notes: { pending_order_id: started.pendingOrderId, source: "b2b_order" },
      theme: { color: "#4f46e5" },
      handler: (response) => {
        const captured = {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          pendingOrderId: started.pendingOrderId,
        };
        setPayment(captured);
        setPaying(false);
        book(captured);
      },
      modal: { ondismiss: () => setPaying(false) },
    });
    checkout.on("payment.failed", (response) => {
      setPaying(false);
      setError(response?.error?.description || "Payment failed. You can retry.");
    });
    checkout.open();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (paid) book();
      }}
      className="space-y-4"
    >
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger-ink" role="alert">
          <p>{error}</p>
          {details.length > 1 && (
            <ul className="mt-1 list-disc pl-5">
              {details.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </div>
      )}

      <Card>
        <CardHeader title="Buyer and delivery" description="Search a registered buyer, then set the customer type and the shipping address stored on the order." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Search buyer" className="sm:col-span-2 lg:col-span-3">
            <Input value={buyerQuery} onChange={(e) => lookupBuyers(e.target.value)} placeholder="Name, mobile or pincode" autoComplete="off" />
            {searchingBuyers && <p className="text-xs text-ink-muted">Searching…</p>}
            {!searchingBuyers && buyerSearched && buyers.length === 0 && <p className="text-xs text-ink-muted">No matching buyers.</p>}
            {buyers.length > 0 && (
              <ul className="max-h-48 overflow-auto rounded-lg border border-line bg-surface">
                {buyers.map((buyer) => (
                  <li key={buyer.id}>
                    <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => chooseBuyer(buyer)}>
                      <span className="font-medium text-ink">{buyer.businessName || buyer.name}</span>
                      <span className="block text-xs text-ink-muted">{buyer.name} · {buyer.mobile} · {buyer.pincode}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
          <Field label="Customer name" required><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required /></Field>
          <Field label="Customer phone" required><Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} inputMode="numeric" required /></Field>
          <Field label="Customer type" required>
            <Select value={customerTypeId} onChange={(e) => setCustomerTypeId(e.target.value)} placeholder="Select customer type" options={options.customerTypes.map((item) => ({ value: String(item.id), label: `${item.name} (Min ₹${Math.round(item.minOrderValue)})` }))} required />
          </Field>
          <Field label="Business name"><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></Field>
          <Field label="GSTIN"><Input value={gstin} onChange={(e) => setGstin(e.target.value)} maxLength={15} /></Field>
          <Field label="Delivery pincode" required><Input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" required /></Field>
          <Field label="Address line 1" required className="sm:col-span-2"><Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="House/shop no., building, street" required /></Field>
          <Field label="Address line 2"><Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Area, landmark" /></Field>
          <Field label="District / city" required><Input value={district} onChange={(e) => setDistrict(e.target.value)} required /></Field>
          <Field label="State" required>
            {options.states?.length ? (
              <Select value={state} onChange={(e) => setState(e.target.value)} placeholder="Select state" options={options.states.map((name) => ({ value: name, label: name }))} required />
            ) : (
              <Input value={state} onChange={(e) => setState(e.target.value)} required />
            )}
          </Field>
          <Field label="Payment terms" required>
            <Select
              value={paymentMode}
              onChange={(e) => {
                setPaymentMode(e.target.value);
                setPayment(null);
              }}
              options={(options.paymentModes || ["Prepaid", "Partial Advance"]).map((mode) => ({ value: mode, label: mode }))}
            />
          </Field>
          {paymentMode === "Partial Advance" && (
            <Field label="Advance payment %"><Input type="number" min="1" max="99" step="0.01" value={advancePct} onChange={(e) => { setAdvancePct(e.target.value); setPayment(null); }} /></Field>
          )}
          {type && <p className="sm:col-span-2 lg:col-span-3 text-xs text-ink-muted">Minimum order value {formatINR(type.minOrderValue)}. Current product subtotal {formatINR(subtotal)}. {type.moqDescription || `MOQ ${type.minMoqBoxes}`}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Line items" description="Active catalogue products. Quantity and unit rate (excl. GST) are what the order stores. Out-of-stock lines are rejected." />
        <CardBody className="space-y-3">
          <Field label="Search product">
            <Input value={productQuery} onChange={(e) => lookupProducts(e.target.value)} placeholder="Product name, SKU or technical name" autoComplete="off" />
            {searchingProducts && <p className="text-xs text-ink-muted">Searching…</p>}
            {!searchingProducts && productSearched && products.length === 0 && <p className="text-xs text-ink-muted">No matching products.</p>}
            {products.length > 0 && (
              <ul className="max-h-56 overflow-auto rounded-lg border border-line bg-surface">
                {products.map((product) => (
                  <li key={`${product.productId}-${product.variantId}`}>
                    <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted" onClick={() => addProduct(product)}>
                      <span className="font-medium text-ink">{product.name}</span>
                      <span className="block text-xs text-ink-muted">{product.sku} · {product.category} · stock {product.stock} · {formatINR(product.unitPrice)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
          {lines.length === 0 ? (
            <p className="text-sm text-ink-muted">No products selected yet. Search above to add a line.</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs text-ink-muted">
                      <th className="py-2 pr-3 font-medium">Product</th>
                      <th className="py-2 pr-3 font-medium">Stock</th>
                      <th className="py-2 pr-3 font-medium">Qty</th>
                      <th className="py-2 pr-3 font-medium">Unit rate excl. GST</th>
                      <th className="py-2 pr-3 font-medium">GST %</th>
                      <th className="py-2 font-medium"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line, index) => (
                      <tr key={`${line.productId}-${line.variantId}`} className="border-b border-line">
                        <td className="py-2 pr-3">
                          <span className="font-medium text-ink">{line.name}</span>
                          <span className="block font-mono text-xs text-ink-muted">{line.sku}</span>
                        </td>
                        <td className="py-2 pr-3 tabular-nums">{line.stock}</td>
                        <td className="py-2 pr-3"><Input type="number" min="1" className="w-24" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} /></td>
                        <td className="py-2 pr-3"><Input type="number" min="0" step="0.01" className="w-32" value={line.unitPrice} onChange={(e) => updateLine(index, { unitPrice: e.target.value })} /></td>
                        <td className="py-2 pr-3 tabular-nums">{line.gstPct}</td>
                        <td className="py-2"><Button type="button" size="xs" variant="ghost" onClick={() => { setPayment(null); setLines((current) => current.filter((_, i) => i !== index)); }}>Remove</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 xl:hidden">
                {lines.map((line, index) => (
                  <div key={`${line.productId}-${line.variantId}`} className="space-y-3 rounded-lg border border-line p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{line.name}</p>
                        <p className="font-mono text-xs text-ink-muted">{line.sku}</p>
                      </div>
                      <Button type="button" size="xs" variant="ghost" onClick={() => { setPayment(null); setLines((current) => current.filter((_, i) => i !== index)); }}>Remove</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">Stock</p>
                        <p className="text-sm text-ink tabular-nums">{line.stock}</p>
                      </div>
                      <div>
                        <p className="text-[10.5px] font-medium tracking-wide text-ink-muted uppercase">GST %</p>
                        <p className="text-sm text-ink tabular-nums">{line.gstPct}</p>
                      </div>
                      <Field label="Qty"><Input type="number" min="1" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} /></Field>
                      <Field label="Unit rate excl. GST" className="col-span-2 sm:col-span-1"><Input type="number" min="0" step="0.01" value={line.unitPrice} onChange={(e) => updateLine(index, { unitPrice: e.target.value })} /></Field>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Freight and charges" description="Freight is stored for contribution and is not added to the payable. Carrier rate shopping is not run from this screen." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Shipping mode">
            <Select value={freightMode} onChange={(e) => setFreightMode(e.target.value)} options={[{ value: "auto", label: "Auto (by weight)" }, { value: "courier", label: "Courier / parcel" }, { value: "cargo", label: "Cargo / LTL" }]} />
          </Field>
          <Field label="Shipping cost (stored)">
            <Input type="number" min="0" step="0.01" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} />
          </Field>
          <Field label="Handling charges"><Input type="number" min="0" step="0.01" value={handlingCharges} onChange={(e) => { setHandlingCharges(e.target.value); setPayment(null); }} /></Field>
          <Field label="Payment gateway"><Input type="number" min="0" step="0.01" value={pgCharges} onChange={(e) => { setPgCharges(e.target.value); setPayment(null); }} /></Field>
          <Field label="Other charges"><Input type="number" min="0" step="0.01" value={otherCharges} onChange={(e) => { setOtherCharges(e.target.value); setPayment(null); }} /></Field>
          <Field label="Claims / risk"><Input type="number" min="0" step="0.01" value={claimsRisk} onChange={(e) => setClaimsRisk(e.target.value)} /></Field>
          <Field label="Remarks" className="sm:col-span-2 lg:col-span-4"><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} /></Field>
          <div className="sm:col-span-2 lg:col-span-4 text-sm text-ink">
            <p>Subtotal {formatINR(subtotal)} · GST {formatINR(gst)} · Payable {formatINR(payable)}</p>
            <p className="text-xs text-ink-muted">Freight {formatINR(Number(shippingCost) || 0)} is in the product price and is not charged again. {paymentMode === "Prepaid" ? "Full amount" : `Advance of ${advance}% (${formatINR(due)})`} is collected before booking.</p>
            {paid && <p className="text-xs text-ink">Payment verified ({payment.razorpayPaymentId}).</p>}
            {!options.razorpayEnabled && <p className="text-xs text-ink-muted">Online payment is not available right now, so this order cannot be booked.</p>}
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink href="/admin/b2b/orders" variant="secondary">Cancel</ButtonLink>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" loading={paying} disabled={saving || !options.razorpayEnabled || paid} onClick={payNow}>
            {paymentMode === "Prepaid" ? `Pay now ${formatINR(due)}` : `Pay advance ${formatINR(due)}`}
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={!paid || paying}>Book B2B order</Button>
        </div>
      </div>
    </form>
  );
}
