import { createRandom, daysAgo, pad, places, couriers, personName, mobile, financialYear, NOW, DAY } from "./seed";
import { nrvPricing, listingEconomics, payoutBreakdown, payoutCycle, refundAmount, stockStatus, LOW_STOCK_MAX } from "./engines";

const categoryTree = [
  { name: "Seeds", children: ["Vegetable Seeds", "Field Crop Seeds", "Hybrid Paddy"] },
  { name: "Fertilizers", children: ["Water Soluble", "Micronutrients", "Bio Fertilizers"] },
  { name: "Crop Protection", children: ["Insecticides", "Fungicides", "Herbicides"] },
  { name: "Irrigation", children: ["Drip Kits", "Sprinklers"] },
  { name: "Farm Equipment", children: ["Sprayers", "Hand Tools"] },
  { name: "Garden", children: ["Pots & Planters", "Potting Mix"] },
];

const brandNames = ["KrishiGold", "Harit Shakti", "AgroNova", "Bhoomi Plus", "Kisan Raja", "GreenField", "Annadata Seeds", "JalDhara", "Fasal Rakshak", "SoilPro", "Mitti Mitra", "Ankur Agro"];

const productStems = {
  "Vegetable Seeds": ["Tomato Hybrid Seeds", "Chilli F1 Seeds", "Bhindi Seeds", "Cauliflower Seeds"],
  "Field Crop Seeds": ["Soybean JS-9560", "Wheat HD-2967", "Moong Seeds"],
  "Hybrid Paddy": ["Paddy Hybrid 6444", "Basmati 1121 Seeds"],
  "Water Soluble": ["NPK 19:19:19", "NPK 0:52:34", "Calcium Nitrate"],
  Micronutrients: ["Zinc EDTA 12%", "Boron 20%", "Micronutrient Mix"],
  "Bio Fertilizers": ["Mycorrhiza Granules", "PSB Liquid", "Seaweed Extract"],
  Insecticides: ["Emamectin Benzoate 5% SG", "Chlorantraniliprole 18.5% SC", "Imidacloprid 17.8% SL"],
  Fungicides: ["Azoxystrobin 23% SC", "Mancozeb 75% WP", "Tebuconazole 25.9% EC"],
  Herbicides: ["Glyphosate 41% SL", "Pendimethalin 30% EC"],
  "Drip Kits": ["Drip Irrigation Kit 1 Acre", "Inline Drip Pipe 16mm"],
  Sprinklers: ["Rain Gun Sprinkler", "Mini Sprinkler Set"],
  Sprayers: ["Battery Sprayer 16L", "Knapsack Sprayer"],
  "Hand Tools": ["Garden Khurpi Set", "Pruning Secateur"],
  "Pots & Planters": ["Grow Bags Pack of 10", "HDPE Planter 12in"],
  "Potting Mix": ["Cocopeat Block 5kg", "Vermicompost 25kg"],
};

const packs = ["100 ml", "250 ml", "500 ml", "1 L", "250 g", "1 kg", "5 kg", "10 Kg", "25 kg", "1 unit"];
const PACK_FAMILIES = [
  { attribute: "Volume", packs: ["100 ml", "250 ml", "500 ml", "1 L"] },
  { attribute: "Weight", packs: ["250 g", "1 kg", "5 kg", "10 Kg", "25 kg"] },
];
const VARIATION_FACTORS = [1.8, 3.1, 4.5];

/** Deterministic sibling pack sizes, so seeding variations does not shift the random sequence. */
function attachVariations(p, index) {
  const pack = packs.find((pk) => p.name.endsWith(` ${pk}`)) ?? "1 unit";
  const family = PACK_FAMILIES.find((f) => f.packs.includes(pack));
  const siblings = family ? family.packs.filter((pk) => pk !== pack) : ["Pack of 2", "Pack of 5", "Pack of 10"];
  p.variationAttribute = p.variants > 1 ? (family?.attribute ?? "Pack size") : null;
  p.baseLabel = p.variants > 1 ? pack : null;
  p.variations = siblings.slice(0, p.variants - 1).map((label, i) => {
    const factor = VARIATION_FACTORS[i];
    const mrp = Math.round(p.mrp * factor);
    const nrv = Math.round(p.nrv * factor);
    const price = nrvPricing({ nrv, mrp, gstPercent: p.gstPercent, takeRate: p.takeRate });
    const stock = (index * 37 + i * 53) % 260;
    return {
      id: `${p.id}-V${i + 1}`, label, sku: `${p.sku}-V${i + 1}`, mrp, nrv, display: price.display, sale: price.sale,
      stock, stockStatus: stockStatus(stock), weightKg: Math.round(p.weightKg * factor * 100) / 100,
    };
  });
  p.variants = 1 + p.variations.length;
}

export const LINE_STATUSES = ["Placed", "Accepted", "Packed", "Pending Pickup", "Shipped", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Rejected", "Undelivered", "RTO", "RTO Delivered", "Return Requested", "Return Completed"];

export const statusPriority = ["Placed", "Accepted", "Packed", "Pending Pickup", "Shipped", "In Transit", "Out for Delivery", "Undelivered", "RTO", "RTO Delivered", "Return Requested", "Return Completed", "Delivered", "Rejected", "Cancelled"];

export function buildCommerce() {
  const rand = createRandom(424242);

  const categories = [];
  let catId = 1;
  for (const parent of categoryTree) {
    const parentId = catId++;
    categories.push({ id: parentId, name: parent.name, parent: null, parentId: null, level: 1, products: 0, status: "Active", approval: "Approved", createdAt: daysAgo(rand.int(300, 900), rand) });
    for (const child of parent.children) {
      categories.push({ id: catId++, name: child, parent: parent.name, parentId, level: 2, products: 0, status: "Active", approval: rand.chance(0.1) ? "Pending" : "Approved", createdAt: daysAgo(rand.int(100, 700), rand) });
    }
  }

  const brands = brandNames.map((name, i) => ({
    id: i + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    products: 0,
    status: rand.chance(0.9) ? "Active" : "Inactive",
    approval: i > 9 ? "Pending" : "Approved",
    seoTitle: `${name} agri products online`,
    createdAt: daysAgo(rand.int(60, 800), rand),
  }));

  const vendors = Array.from({ length: 36 }, (_, i) => {
    const place = rand.pick(places);
    const owner = personName(rand);
    const firm = `${rand.pick(["Shree", "Jai", "Maa", "Kisan", "Navkar", "Om", "Gayatri", "Sai"])} ${rand.pick(["Agro", "Krishi", "Beej", "Agritech", "Traders", "Fertichem"])} ${rand.pick(["Kendra", "Agencies", "Pvt Ltd", "Enterprises", "Bhandar"])}`;
    const status = i < 28 ? "Active" : rand.pick(["Pending", "Pending", "Suspended", "Rejected"]);
    const kyc = status === "Active" ? "Verified" : status === "Pending" ? rand.pick(["Submitted", "Under Review", "Documents Missing"]) : rand.pick(["Verified", "Rejected"]);
    return {
      id: `SEL${pad(1001 + i, 5)}`,
      name: firm,
      owner,
      mobile: mobile(rand),
      email: `${firm.split(" ")[0].toLowerCase()}${i}@example.com`,
      city: place.city,
      state: place.state,
      pincode: place.pincode,
      gstin: `${pad(rand.int(10, 36), 2)}ABCDE${pad(rand.int(1000, 9999), 4)}F1Z${rand.int(1, 9)}`,
      pan: `ABCDE${pad(rand.int(1000, 9999), 4)}F`,
      bankAccount: `${rand.int(10000000, 99999999)}${rand.int(1000, 9999)}`,
      ifsc: `SBIN000${rand.int(1000, 9999)}`,
      status,
      kyc,
      onboardedAt: daysAgo(rand.int(i < 28 ? 40 : 1, i < 28 ? 720 : 30), rand),
      dispatchSlaHours: rand.pick([24, 48, 48, 72]),
      payoutAccess: rand.chance(0.85),
      products: 0,
      orders: 0,
      gmv: 0,
      score: null,
    };
  });
  const activeVendors = vendors.filter((v) => v.status === "Active");

  const leafCategories = categories.filter((c) => c.level === 2);
  const products = [];
  let pid = 1;
  for (const cat of leafCategories) {
    for (const stem of productStems[cat.name] || []) {
      const count = rand.int(1, 3);
      for (let k = 0; k < count; k++) {
        const brand = rand.pick(brands);
        const vendor = rand.pick(activeVendors);
        const pack = rand.pick(packs);
        const mrp = rand.pick([349, 450, 599, 749, 899, 1199, 1499, 1899, 2450, 3299, 4999]);
        const gstPercent = cat.parent === "Seeds" ? 0 : rand.pick([5, 12, 18, 18]);
        const takeRate = rand.pick([28, 30, 32, 35, 35, 38]);
        const nrv = Math.round(mrp * (1 - takeRate / 100) * rand.next() * 0.25 + mrp * 0.45);
        const price = nrvPricing({ nrv, mrp, gstPercent, takeRate });
        const econ = listingEconomics({ display: price.display, nrv, gstPercent });
        const statusCode = rand.weighted([[1, 78], [0, 9], [2, 5], [3, 8]]);
        const stock = rand.chance(0.08) ? 0 : rand.chance(0.14) ? rand.int(1, LOW_STOCK_MAX) : rand.int(10, 600);
        const created = daysAgo(rand.int(1, 500), rand);
        products.push({
          id: `P${pad(pid, 5)}`,
          uniqueId: `BAP${pad(pid * 37, 7)}`,
          name: `${brand.name} ${stem} ${pack}`,
          sku: `BA-${cat.name.slice(0, 3).toUpperCase()}-${pad(pid, 4)}`,
          brand: brand.name,
          brandId: brand.id,
          category: cat.name,
          parentCategory: cat.parent,
          categoryId: cat.id,
          vendorId: vendor.id,
          vendor: vendor.name,
          statusCode,
          status: statusCode === 1 ? "Active" : statusCode === 3 ? "Draft / Rejected" : "Pending",
          mrp,
          display: price.display,
          sale: price.sale,
          nrv,
          bsa: price.bsa,
          tcs: price.tcs,
          gstPercent,
          takeRate,
          commissionPercent: price.commissionPercent,
          contributionPct: econ.contributionPct,
          verdict: econ.verdict,
          stock,
          stockStatus: stockStatus(stock),
          hsn: rand.pick(["38089199", "31052000", "12099190", "84248100", "39173290"]),
          weightKg: rand.pick([0.25, 0.5, 1, 1.2, 5.5, 10.5, 25.5]),
          variants: rand.int(1, 4),
          returnPolicy: rand.pick(["7 days refund", "No return", "10 days replacement"]),
          toxicity: cat.parent === "Crop Protection" ? rand.pick(["caution", "danger", "poison_normal"]) : null,
          createdAt: created,
          updatedAt: daysAgo(rand.int(0, 30), rand),
          rejectReason: statusCode === 3 && rand.chance(0.5) ? "Images do not match product label" : null,
        });
        pid++;
      }
    }
  }
  products.forEach(attachVariations);
  for (const p of products) {
    categories.find((c) => c.id === p.categoryId).products++;
    categories.find((c) => c.name === p.parentCategory).products++;
    brands.find((b) => b.id === p.brandId).products++;
    vendors.find((v) => v.id === p.vendorId).products++;
  }
  const liveProducts = products.filter((p) => p.statusCode === 1);

  const customers = Array.from({ length: 140 }, (_, i) => {
    const place = rand.pick(places);
    const name = personName(rand);
    return {
      id: `CUS${pad(3000 + i, 5)}`,
      name,
      mobile: mobile(rand),
      email: rand.chance(0.6) ? `${name.split(" ")[0].toLowerCase()}${i}@example.com` : null,
      city: place.city,
      state: place.state,
      pincode: place.pincode,
      loginMethod: rand.weighted([["general", 70], ["guest", 15], ["google", 15]]),
      status: rand.chance(0.96) ? "Active" : "Blocked",
      walletBalance: rand.chance(0.3) ? rand.int(10, 600) : 0,
      orders: 0,
      lifetimeValue: 0,
      score: rand.int(18, 96),
      createdAt: daysAgo(rand.int(1, 700), rand),
      lastOrderAt: null,
    };
  });

  const salesmen = ["Rupesh Kumar", "Anjali Verma", "Imran Khan", "Sneha Patidar"];
  const orders = [];
  const orderItems = [];
  let lineId = 1;
  const invoiceCounters = {};
  for (let i = 0; i < 260; i++) {
    const customer = rand.pick(customers);
    const created = daysAgo(Math.floor(Math.pow(rand.next(), 1.6) * 120), rand);
    const fy = financialYear(created);
    const orderId = `BAO-${rand.int(1000, 9999)}-${fy}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i / 26) | 0) % 26)}${pad(1 + i, 4)}`;
    const paymentMode = rand.weighted([["COD", 52], ["Prepaid", 36], ["Partial", 12]]);
    const channel = rand.weighted([["Website", 60], ["WhatsApp", 18], ["Manual (Admin)", 12], ["Website Guest", 10]]);
    const lineCount = rand.weighted([[1, 60], [2, 28], [3, 12]]);
    const ageDays = (NOW - new Date(created).getTime()) / DAY;
    const platformInvoice = `BAL-${fy}-${pad(10000000 + i * 7, 8)}`;
    const lines = [];
    for (let l = 0; l < lineCount; l++) {
      const product = rand.pick(liveProducts);
      const vendor = vendors.find((v) => v.id === product.vendorId);
      const qty = rand.weighted([[1, 70], [2, 20], [3, 7], [5, 3]]);
      const price = product.display * qty;
      const taxable = (price * 100) / (100 + product.gstPercent);
      const gst = price - taxable;
      const intra = vendor.state === customer.state;
      let status;
      if (ageDays < 1) status = rand.weighted([["Placed", 60], ["Accepted", 30], ["Cancelled", 10]]);
      else if (ageDays < 3) status = rand.weighted([["Accepted", 25], ["Packed", 20], ["Pending Pickup", 25], ["Shipped", 20], ["Cancelled", 10]]);
      else if (ageDays < 8) status = rand.weighted([["In Transit", 35], ["Out for Delivery", 15], ["Delivered", 30], ["Undelivered", 10], ["RTO", 5], ["Cancelled", 5]]);
      else status = rand.weighted([["Delivered", 72], ["RTO", 8], ["RTO Delivered", 6], ["Return Requested", 4], ["Return Completed", 3], ["Cancelled", 5], ["Rejected", 2]]);
      invoiceCounters[vendor.id] = (invoiceCounters[vendor.id] || 0) + 1;
      const shipped = !["Placed", "Accepted", "Packed", "Cancelled", "Rejected"].includes(status);
      const nrvTotal = product.nrv * qty;
      const commission = (taxable * product.commissionPercent) / 100;
      const item = {
        id: lineId++,
        orderId,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        vendorId: vendor.id,
        vendor: vendor.name,
        qty,
        price: Math.round(price * 100) / 100,
        taxable: Math.round(taxable * 100) / 100,
        gst: Math.round(gst * 100) / 100,
        gstPercent: product.gstPercent,
        cgst: intra ? Math.round((gst / 2) * 100) / 100 : 0,
        sgst: intra ? Math.round((gst / 2) * 100) / 100 : 0,
        igst: intra ? 0 : Math.round(gst * 100) / 100,
        tcs: Math.round(taxable * 0.01 * 100) / 100,
        tds: Math.round(taxable * 0.01 * 100) / 100,
        nrv: nrvTotal,
        commission: Math.round(commission * 100) / 100,
        status,
        sellerInvoice: `INV-${vendor.name.slice(0, 2).toUpperCase()}-${fy}-000${invoiceCounters[vendor.id]}`,
        platformInvoice,
        courier: shipped ? rand.pick(couriers) : null,
        awb: shipped ? `${rand.pick(["NMB", "SR", "DLV"])}${rand.int(100000000, 999999999)}` : null,
        weightKg: Math.round(product.weightKg * qty * 100) / 100,
        createdAt: created,
        statusDate: new Date(Math.min(NOW, new Date(created).getTime() + rand.int(1, 6) * DAY)).toISOString(),
        deliveryDate: ["Delivered", "Return Requested", "Return Completed"].includes(status) ? new Date(new Date(created).getTime() + rand.int(3, 7) * DAY).toISOString() : null,
        returnLastDate: null,
        paymentMode,
        customerId: customer.id,
        customer: customer.name,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        zone: places.find((p) => p.city === customer.city)?.zone ?? "rest_of_india",
      };
      if (item.deliveryDate) item.returnLastDate = new Date(new Date(item.deliveryDate).getTime() + 7 * DAY).toISOString();
      lines.push(item);
      orderItems.push(item);
      vendor.orders++;
      if (status === "Delivered") vendor.gmv += item.price;
    }
    const total = lines.reduce((s, l) => s + l.price, 0);
    const shippingFee = paymentMode === "COD" ? (total < 3000 ? rand.pick([79, 99, 149]) : 0) : 0;
    const handling = paymentMode === "COD" && total < 3000 ? 30 : 0;
    const discount = paymentMode === "Prepaid" ? Math.round(total * 0.03) : paymentMode === "Partial" ? Math.round(total * 0.01) : 0;
    const parentStatus = statusPriority.find((s) => lines.some((l) => l.status === s)) ?? lines[0].status;
    const order = {
      id: orderId,
      customerId: customer.id,
      customer: customer.name,
      mobile: customer.mobile,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      channel,
      paymentMode,
      paymentId: paymentMode === "COD" ? null : `pay_${rand.int(10000000, 99999999)}${rand.int(1000, 9999)}`,
      advance: paymentMode === "Partial" ? Math.round((total - discount) * (total >= 10000 ? 0.15 : 0.1)) : 0,
      status: parentStatus,
      items: lines.length,
      vendors: new Set(lines.map((l) => l.vendorId)).size,
      subtotal: Math.round(total * 100) / 100,
      shippingFee,
      handling,
      discount,
      total: Math.round((total - discount + shippingFee + handling) * 100) / 100,
      couponCode: rand.chance(0.12) ? rand.pick(["KISAN10", "FIRST50", "MONSOON"]) : null,
      salesman: channel === "Manual (Admin)" || rand.chance(0.15) ? rand.pick(salesmen) : null,
      platformInvoice,
      createdAt: created,
    };
    orders.push(order);
    customer.orders++;
    customer.lifetimeValue += order.total;
    if (!customer.lastOrderAt || customer.lastOrderAt < created) customer.lastOrderAt = created;
  }
  orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const shipments = orderItems
    .filter((l) => l.awb || ["Accepted", "Packed"].includes(l.status))
    .map((l) => ({
      id: `SHP-${l.id}`,
      orderId: l.orderId,
      lineId: l.id,
      vendorId: l.vendorId,
      vendor: l.vendor,
      customer: l.customer,
      pincode: l.pincode,
      zone: l.zone,
      courier: l.courier,
      awb: l.awb,
      weightKg: l.weightKg,
      paymentMode: l.paymentMode,
      collectAmount: l.paymentMode === "Prepaid" ? 0 : l.price,
      status: l.awb ? l.status : "Ready to Ship",
      createdAt: l.statusDate,
      slaDue: new Date(new Date(l.createdAt).getTime() + 48 * 3600000).toISOString(),
    }));

  const returnReasons = ["Damaged product", "Wrong product delivered", "Product expired", "Quality not as expected", "Leakage in packaging", "Missing quantity"];
  const returns = orderItems
    .filter((l) => ["Return Requested", "Return Completed"].includes(l.status) || (l.status === "Delivered" && rand.chance(0.04)))
    .map((l, i) => {
      const status = l.status === "Return Completed" ? rand.pick(["Refunded", "Completed", "Replacement Shipped"]) : l.status === "Return Requested" ? rand.pick(["Pending", "Pending", "Awaiting Pickup", "In Transit"]) : rand.pick(["Pending", "Rejected"]);
      const refund = refundAmount({ price: l.taxable, gst: l.gst, shipping: 0, refundShipping: false, deductPlatformFee: rand.chance(0.3) });
      return {
        id: `RET-2026-${pad(i + 1, 4)}`,
        orderId: l.orderId,
        lineId: l.id,
        product: l.productName,
        vendor: l.vendor,
        vendorId: l.vendorId,
        customer: l.customer,
        customerId: l.customerId,
        qty: l.qty,
        reason: rand.pick(returnReasons),
        status,
        pickupService: status === "Pending" ? null : rand.pick(["Delhivery Pickup", "BlueDart Pickup", "Internal Courier (Manual)"]),
        paymentMode: l.paymentMode,
        refundAmount: refund,
        refundMethod: l.paymentMode === "COD" ? "Bank transfer (manual)" : "Razorpay refund",
        createdAt: new Date(new Date(l.deliveryDate || l.statusDate).getTime() + rand.int(1, 5) * DAY).toISOString(),
        notes: rand.chance(0.3) ? "Customer shared photos on WhatsApp" : "",
      };
    });

  const refunds = returns
    .filter((r) => ["Refunded", "Completed", "Awaiting Pickup", "In Transit"].includes(r.status))
    .map((r, i) => ({
      id: r.refundMethod.startsWith("Bank") ? `BANK-TRF-${pad(5000 + i, 6)}` : `rfnd_${pad(880000 + i * 13, 8)}`,
      returnId: r.id,
      orderId: r.orderId,
      customer: r.customer,
      amount: r.refundAmount,
      method: r.refundMethod,
      status: r.status === "Refunded" || r.status === "Completed" ? "Processed" : r.refundMethod.startsWith("Bank") ? "Pending Manual Transfer" : "Initiated",
      createdAt: r.createdAt,
    }));

  const rto = orderItems
    .filter((l) => l.status.startsWith("RTO"))
    .map((l) => ({
      id: `RTO-${l.id}`,
      orderId: l.orderId,
      lineId: l.id,
      product: l.productName,
      vendor: l.vendor,
      customer: l.customer,
      courier: l.courier,
      awb: l.awb,
      paymentMode: l.paymentMode,
      value: l.price,
      forwardShipping: Math.round(rand.money(60, 140)),
      reverseShipping: Math.round(rand.money(60, 140)),
      reason: rand.pick(["Customer refused", "Address not found", "Customer not reachable", "COD amount not ready", "Fake order"]),
      status: l.status === "RTO Delivered" ? "RTO Delivered" : "RTO In Transit",
      ledgerRecorded: rand.chance(0.7),
      createdAt: l.statusDate,
    }));

  const payoutItems = orderItems
    .filter((l) => l.status === "Delivered")
    .map((l) => {
      const breakdown = payoutBreakdown({ gross: l.price, taxable: l.taxable, nrv: l.nrv });
      const cycle = payoutCycle(l.deliveryDate);
      const old = (NOW - new Date(l.deliveryDate).getTime()) / DAY > 20;
      return {
        id: `PI-${l.id}`,
        lineId: l.id,
        orderId: l.orderId,
        vendorId: l.vendorId,
        vendor: l.vendor,
        product: l.productName,
        qty: l.qty,
        gross: l.price,
        taxable: l.taxable,
        nrv: l.nrv,
        tcs: breakdown.tcs,
        bsa: breakdown.bsa,
        serviceExGst: breakdown.serviceExGst,
        cycle: cycle.label,
        cycleIndex: cycle.index,
        deliveryDate: l.deliveryDate,
        status: old ? (rand.chance(0.85) ? "Paid" : "On Hold") : "Pending",
        transactionId: null,
      };
    });
  const payouts = [];
  const groupKey = (i) => `${i.vendorId}|${i.cycleIndex}`;
  const groups = new Map();
  for (const item of payoutItems) {
    if (!groups.has(groupKey(item))) groups.set(groupKey(item), []);
    groups.get(groupKey(item)).push(item);
  }
  let payoutId = 1;
  for (const items of groups.values()) {
    const first = items[0];
    const allPaid = items.every((i) => i.status === "Paid");
    const anyHold = items.some((i) => i.status === "On Hold");
    const id = `PO-${pad(payoutId++, 5)}`;
    const txn = allPaid ? `UTR${rand.int(100000000, 999999999)}` : null;
    items.forEach((i) => {
      i.payoutId = id;
      if (i.status === "Paid") i.transactionId = txn;
    });
    payouts.push({
      id,
      vendorId: first.vendorId,
      vendor: first.vendor,
      cycle: first.cycle,
      cycleIndex: first.cycleIndex,
      orders: new Set(items.map((i) => i.orderId)).size,
      items: items.length,
      gross: Math.round(items.reduce((s, i) => s + i.gross, 0) * 100) / 100,
      tcs: Math.round(items.reduce((s, i) => s + i.tcs, 0) * 100) / 100,
      bsa: Math.round(items.reduce((s, i) => s + i.bsa, 0) * 100) / 100,
      serviceExGst: Math.round(items.reduce((s, i) => s + i.serviceExGst, 0) * 100) / 100,
      status: allPaid ? "Paid" : anyHold ? "On Hold" : "Pending",
      transactionId: txn,
      paidAt: allPaid ? daysAgo(rand.int(1, 40), rand) : null,
    });
  }
  payouts.sort((a, b) => b.cycleIndex - a.cycleIndex);

  for (const v of vendors) {
    if (v.status !== "Active" || v.orders === 0) continue;
    const lines = orderItems.filter((l) => l.vendorId === v.id);
    const delivered = lines.filter((l) => l.status === "Delivered").length;
    const rtoCount = lines.filter((l) => l.status.startsWith("RTO") || ["Cancelled", "Rejected"].includes(l.status)).length;
    const settled = lines.filter((l) => !["Placed", "Accepted", "Packed", "Pending Pickup", "Shipped", "In Transit", "Out for Delivery"].includes(l.status)).length || 1;
    const fulfillment = (delivered / settled) * 100;
    const dispatch = rand.int(55, 98);
    const revenue = Math.min(100, (v.gmv / 20000) * 100);
    const tenure = Math.min(100, ((NOW - new Date(v.onboardedAt).getTime()) / DAY / 730) * 100);
    const penaltyRate = (rtoCount / lines.length) * 100;
    v.score = Math.max(0, Math.round(((fulfillment * 25 + dispatch * 20 + revenue * 20 + tenure * 15) / 80 - (penaltyRate * 20) / 100) * 10) / 10);
    v.scoreParts = { fulfillment: Math.round(fulfillment), dispatch, revenue: Math.round(revenue), tenure: Math.round(tenure), penaltyRate: Math.round(penaltyRate) };
  }

  return { categories, brands, vendors, products, customers, orders, orderItems, shipments, returns, refunds, rto, payoutItems, payouts, returnReasons };
}
