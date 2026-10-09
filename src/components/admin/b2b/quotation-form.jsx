"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveB2bQuotation, searchB2bBuyers, searchB2bQuoteProducts } from "@/lib/actions/admin/b2b-screens";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { formatINR } from "@/lib/format";

const emptyLine = { productId: 0, variantId: 0, sku: "", name: "", quantity: 1, unitPrice: 0, gstPct: 0, stock: 0 };

export function QuotationForm({ options }) {
  const [buyerQuery, setBuyerQuery] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState([]);
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
  const [paymentMode, setPaymentMode] = useState("Prepaid");
  const [advancePct, setAdvancePct] = useState("0");
  const [creditDays, setCreditDays] = useState("0");
  const [validUntil, setValidUntil] = useState(options.validUntil || "");
  const [lines, setLines] = useState([]);
  const [shippingCost, setShippingCost] = useState("0");
  const [shippingManual, setShippingManual] = useState(false);
  const [handlingCharges, setHandlingCharges] = useState("0");
  const [pgCharges, setPgCharges] = useState("0");
  const [claimsRisk, setClaimsRisk] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [details, setDetails] = useState([]);
  const [saved, setSaved] = useState(null);
  const [searchingBuyers, startBuyers] = useTransition();
  const [searchingProducts, startProducts] = useTransition();
  const [saving, startSave] = useTransition();

  const type = options.customerTypes.find((item) => String(item.id) === String(customerTypeId));
  const subtotal = lines.reduce((sum, line) => sum + (Number(line.unitPrice) || 0) * (Number(line.quantity) || 0), 0);

  function lookupBuyers(value) {
    setBuyerQuery(value);
    if (value.trim().length < 2) {
      setBuyers([]);
      return;
    }
    startBuyers(async () => {
      const result = await searchB2bBuyers(value.trim());
      setBuyers(result.ok ? result.buyers : []);
      if (!result.ok) setError(result.message);
    });
  }

  function chooseBuyer(buyer) {
    setCustomerId(buyer.id);
    setBuyerQuery(buyer.businessName ? `${buyer.businessName} (${buyer.name})` : buyer.name);
    setBuyers([]);
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
    if (value.trim().length < 2) {
      setProducts([]);
      return;
    }
    startProducts(async () => {
      const result = await searchB2bQuoteProducts(value.trim());
      setProducts(result.ok ? result.products : []);
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
  }

  function updateLine(index, patch) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    setDetails([]);
    setSaved(null);
    startSave(async () => {
      const result = await saveB2bQuotation({
        customerId,
        customerTypeId: Number(customerTypeId) || 0,
        customerName,
        customerMobile,
        businessName,
        gstin,
        paymentMode,
        creditDays: Number(creditDays) || 0,
        advancePct: Number(advancePct) || 0,
        pincode,
        state,
        district,
        deliveryAddress,
        shippingCost: Number(shippingCost) || 0,
        shippingCostManual: shippingManual,
        handlingCharges: Number(handlingCharges) || 0,
        pgCharges: Number(pgCharges) || 0,
        claimsRiskAmount: Number(claimsRisk) || 0,
        otherCharges: 0,
        validUntil,
        remarks,
        lines: lines.filter((line) => line.productId > 0).map((line) => ({
          productId: line.productId,
          variantId: line.variantId || 0,
          sku: line.sku || "",
          quantity: Number(line.quantity) || 0,
          unitPrice: Number(line.unitPrice) || 0,
        })),
      });
      if (!result.ok) {
        setError(result.message || "The quotation could not be saved.");
        setDetails(result.details || []);
        return;
      }
      setSaved(result);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
      {saved && (
        <div className="rounded-lg border border-line bg-surface-muted px-3 py-2 text-sm text-ink">
          {saved.message} {saved.quotationNumber && <span className="font-mono">{saved.quotationNumber}</span>}{" "}
          <Link href="/admin/b2b/quotations" className="font-medium text-brand-700 hover:underline">Back to quotations</Link>
        </div>
      )}

      <Card>
        <CardHeader title="Buyer and delivery" description="Search a registered buyer, then set the customer type and delivery fields the quotation stores." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Search buyer" required className="sm:col-span-2 lg:col-span-3">
            <Input value={buyerQuery} onChange={(e) => lookupBuyers(e.target.value)} placeholder="Name, mobile or pincode" autoComplete="off" />
            {searchingBuyers && <p className="text-xs text-ink-muted">Searching…</p>}
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
          <Field label="Customer name"><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></Field>
          <Field label="Customer phone" required><Input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} /></Field>
          <Field label="Customer type" required>
            <Select value={customerTypeId} onChange={(e) => setCustomerTypeId(e.target.value)} placeholder="Select customer type" options={options.customerTypes.map((item) => ({ value: String(item.id), label: `${item.name} (Min ₹${Math.round(item.minOrderValue)})` }))} />
          </Field>
          <Field label="Business name"><Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></Field>
          <Field label="GSTIN"><Input value={gstin} onChange={(e) => setGstin(e.target.value)} /></Field>
          <Field label="Delivery pincode" required><Input value={pincode} onChange={(e) => setPincode(e.target.value)} /></Field>
          <Field label="City / district"><Input value={district} onChange={(e) => setDistrict(e.target.value)} /></Field>
          <Field label="State">
            {options.states?.length ? (
              <Select value={state} onChange={(e) => setState(e.target.value)} placeholder="Select state" options={options.states.map((name) => ({ value: name, label: name }))} />
            ) : (
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            )}
          </Field>
          <Field label="Delivery address" required className="sm:col-span-2 lg:col-span-3"><Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} /></Field>
          <Field label="Payment terms">
            <Select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} options={options.paymentModes.map((mode) => ({ value: mode, label: mode }))} />
          </Field>
          {paymentMode === "Partial Advance" && (
            <Field label="Advance payment %"><Input type="number" min="0" max="100" step="0.01" value={advancePct} onChange={(e) => setAdvancePct(e.target.value)} /></Field>
          )}
          <Field label="Credit days"><Input type="number" min="0" value={creditDays} onChange={(e) => setCreditDays(e.target.value)} /></Field>
          <Field label="Valid until"><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></Field>
          {type && <p className="sm:col-span-2 lg:col-span-3 text-xs text-ink-muted">Minimum order value {formatINR(type.minOrderValue)}. Current product subtotal {formatINR(subtotal)}. {type.moqDescription || `MOQ ${type.minMoqBoxes}`}</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Line items" description="Active catalogue products. Quantity and unit rate (excl. GST) are what the quotation stores." />
        <CardBody className="space-y-3">
          <Field label="Search product">
            <Input value={productQuery} onChange={(e) => lookupProducts(e.target.value)} placeholder="Product name, SKU or technical name" autoComplete="off" />
            {searchingProducts && <p className="text-xs text-ink-muted">Searching…</p>}
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
            <p className="text-sm text-ink-muted">No products yet. Search above to add a line.</p>
          ) : (
            <div className="overflow-x-auto">
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
                      <td className="py-2 pr-3 tabular">{line.stock}</td>
                      <td className="py-2 pr-3"><Input type="number" min="1" className="w-24" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} /></td>
                      <td className="py-2 pr-3"><Input type="number" min="0" step="0.01" className="w-32" value={line.unitPrice} onChange={(e) => updateLine(index, { unitPrice: e.target.value })} /></td>
                      <td className="py-2 pr-3 tabular">{line.gstPct}</td>
                      <td className="py-2"><Button type="button" size="xs" variant="ghost" onClick={() => setLines((current) => current.filter((_, i) => i !== index))}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Freight and remarks" description="Shipping cost is stored as entered. A typed amount is a manual override. Approval still uses the contribution floor." />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Shipping cost">
            <Input type="number" min="0" step="0.01" value={shippingCost} onChange={(e) => { setShippingManual(true); setShippingCost(e.target.value); }} />
          </Field>
          <Field label="Handling charges"><Input type="number" min="0" step="0.01" value={handlingCharges} onChange={(e) => setHandlingCharges(e.target.value)} /></Field>
          <Field label="PG / collection"><Input type="number" min="0" step="0.01" value={pgCharges} onChange={(e) => setPgCharges(e.target.value)} /></Field>
          <Field label="Claims / risk"><Input type="number" min="0" step="0.01" value={claimsRisk} onChange={(e) => setClaimsRisk(e.target.value)} /></Field>
          <Field label="Remarks" className="sm:col-span-2 lg:col-span-4"><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} /></Field>
          <p className="sm:col-span-2 lg:col-span-4 text-xs text-ink-muted">CM floor {options.minCmPct}%. Quotes under that floor are saved as approval pending.</p>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <ButtonLink href="/admin/b2b/quotations" variant="secondary">Cancel</ButtonLink>
        <Button type="submit" variant="primary" loading={saving} disabled={!customerId || lines.length === 0}>Create quotation</Button>
      </div>
    </form>
  );
}
