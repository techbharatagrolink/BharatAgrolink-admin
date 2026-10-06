import { createRandom, daysAgo, pad, places, couriers, personName, mobile, NOW, DAY } from "./seed";
import { courierSlabTotal } from "./engines";

export function buildBackoffice(commerce) {
  const rand = createRandom(97531);
  const { orders, orderItems, vendors, customers, products } = commerce;

  /* ---------- Finance ---------- */
  const holdLedger = Array.from({ length: 34 }, (_, i) => {
    const party = rand.pick(["CUSTOMER", "VENDOR", "BAL_INTERNAL", "LOGISTICS"]);
    const taxable = rand.int(150, 9000);
    const intra = rand.chance(0.5);
    const cgst = intra ? Math.round(taxable * 0.09) : 0;
    const igst = intra ? 0 : Math.round(taxable * 0.18);
    return {
      id: `${rand.chance(0.6) ? "CN" : "DN"}-2627-${pad(i + 1, 4)}`,
      type: null,
      party,
      partyName: party === "CUSTOMER" ? rand.pick(customers).name : party === "VENDOR" ? rand.pick(vendors).name : party === "LOGISTICS" ? rand.pick(couriers) : "Bharat AgroLink",
      orderId: rand.pick(orders).id,
      reason: rand.pick(["Damaged in transit", "Price difference", "Short supply", "Weight discrepancy", "Goodwill credit"]),
      taxable,
      cgst,
      sgst: cgst,
      igst,
      total: taxable + cgst * 2 + igst,
      status: rand.weighted([["PENDING", 30], ["UNDER_REVIEW", 20], ["APPROVED", 18], ["RELEASED", 20], ["DISPUTED", 7], ["DEFERRED", 5]]),
      createdAt: daysAgo(rand.int(0, 90), rand),
    };
  }).map((r) => ({ ...r, type: r.id.startsWith("CN") ? "Credit Note" : "Debit Note" }));

  const ledger = [];
  for (let i = 0; i < 90; i++) {
    const kind = rand.weighted([["Customer", 40], ["Vendor", 35], ["Wallet", 25]]);
    const debit = rand.chance(0.5);
    const amount = rand.int(50, 15000);
    ledger.push({
      id: `LED-${pad(i + 1, 5)}`,
      ledger: kind,
      party: kind === "Vendor" ? rand.pick(vendors).name : rand.pick(customers).name,
      reference: kind === "Wallet" ? `WTX-${rand.int(10000, 99999)}` : rand.pick(orders).id,
      narration: kind === "Vendor" ? rand.pick(["Payout settlement", "Hold ledger DN", "TCS deducted"]) : kind === "Wallet" ? rand.pick(["Credit note credit", "Wallet used at checkout", "Withdrawal"]) : rand.pick(["Order payment", "Refund", "Credit note"]),
      debit: debit ? amount : 0,
      credit: debit ? 0 : amount,
      createdAt: daysAgo(rand.int(0, 120), rand),
    });
  }

  const codRecon = couriers.flatMap((courier) =>
    Array.from({ length: 6 }, (_, k) => {
      const expected = rand.int(40000, 260000);
      const received = Math.round(expected * rand.money(0.82, 1));
      return { id: `COD-${courier.slice(0, 3).toUpperCase()}-${k + 1}`, courier, remittanceDate: daysAgo(k * 7 + rand.int(0, 3), rand), shipments: rand.int(40, 320), expected, received, pending: expected - received, status: expected === received ? "Reconciled" : received / expected > 0.97 ? "Partially Reconciled" : "Pending" };
    }),
  );

  const months = ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"];
  const gstMonthly = months.map((month, i) => {
    const outputGst = rand.int(180000, 420000) + i * 15000;
    const input = Math.round(outputGst * rand.money(0.12, 0.22));
    return { id: month, month, taxableSales: outputGst * 6, cgst: Math.round(outputGst * 0.3), sgst: Math.round(outputGst * 0.3), igst: Math.round(outputGst * 0.4), outputGst, inputCredit: input, netLiability: outputGst - input, tcsCollected: Math.round(outputGst * 0.055), tdsDeducted: Math.round(outputGst * 0.055), status: i < 5 ? "Filed" : "Due" };
  });

  const fixedExpenses = [
    ["Office rent - Bhopal", "Rent", 85000],
    ["Warehouse rent - Mandideep", "Rent", 120000],
    ["Salaries - Core team", "Salaries", 640000],
    ["Cloud & hosting", "Technology", 42000],
    ["Accounting & legal retainer", "Professional fees", 35000],
    ["Internet & telephony", "Utilities", 18000],
    ["Electricity", "Utilities", 22000],
  ].map(([name, category, amount], i) => ({ id: `FX-${i + 1}`, name, category, amount, recurrence: "Monthly", effectiveFrom: "2026-04-01", status: "Active" }));

  const expenseCaps = [
    { id: "shipping", label: "Shipping cost", capPercent: 10, actualPercent: 8.6 },
    { id: "fixed", label: "Fixed cost", capPercent: 8, actualPercent: 9.4 },
    { id: "marketing", label: "Marketing (incl. coupons)", capPercent: 5, actualPercent: 3.1 },
  ];

  const walletWithdrawals = Array.from({ length: 18 }, (_, i) => {
    const c = rand.pick(customers);
    return { id: `WD-${pad(i + 1, 4)}`, customerId: c.id, customer: c.name, amount: rand.int(1, 25), balanceAfter: rand.int(0, 300), status: rand.weighted([["Requested", 40], ["Paid", 50], ["Rejected", 10]]), createdAt: daysAgo(rand.int(0, 40), rand) };
  });

  /* ---------- Shipping masters ---------- */
  const zones = ["within_city", "within_state", "metro_to_metro", "rest_of_india", "north_east_jk"];
  const courierSlabs = ["500g-5kg", "5-10kg", "10-20kg", "20kg+"].map((slab, i) => {
    const base = [38, 120, 210, 380][i];
    const row = { id: i + 1, slab, scope: "Global", additional: [18, 30, 45, 60][i], status: "Active" };
    zones.forEach((z, k) => (row[z] = base + k * [6, 12, 18, 30][i]));
    row.totalRestOfIndia = courierSlabTotal({ ship: row.rest_of_india });
    return row;
  });
  const shippingSlabs = [[0, 499, 79], [500, 999, 99], [1000, 1499, 149], [1500, 1999, 199], [2000, 2499, 249], [2500, 2999, 299], [3000, null, 0]].map(([from, to, fee], i) => ({ id: i + 1, paymentMode: "cod", orderValueFrom: from, orderValueTo: to, shipping: fee, codHandling: from >= 3000 ? 0 : 30, status: "Active" }));
  const codRules = [...new Set(places.map((p) => p.state))].map((state, i) => ({ id: i + 1, state, codEnabled: state !== "Assam", stateMatchRequired: true, notes: state === "Assam" ? "High RTO corridor" : "" }));
  const otherCharges = [[0, 499, 20, 15, 10, 250, 55, 25], [500, 999, 25, 18, 12, 600, 65, 30], [1000, 2999, 30, 22, 15, 1200, 85, 30], [3000, 9999, 40, 30, 25, 5200, 140, 0]].map(([min, max, l, b, h, w, ship, cod], i) => ({ id: i + 1, priceMin: min, priceMax: max, length: l, breadth: b, height: h, weightGrams: w, lbhWeight: Math.round(((l * b * h) / 5000) * 1000), shippingCost: ship, codHandling: cod, rtoPercent: Math.round(ship * 0.02 * 25 * 100) / 100, total: Math.round((ship + cod + ship * 0.02 * 25) * 100) / 100, status: "Active" }));
  const packageBoxes = Array.from({ length: 14 }, (_, i) => {
    const v = rand.pick(vendors);
    const l = rand.pick([20, 25, 30, 40]);
    return { id: i + 1, vendor: v.name, vendorId: v.id, code: `BX-${i + 1}`, length: l, breadth: l - 5, height: rand.pick([10, 15, 20]), maxWeightKg: rand.pick([2, 5, 10, 20]), status: rand.weighted([["Approved", 70], ["Pending", 30]]) };
  });
  const weightDiscrepancies = orderItems.filter((l) => l.awb).slice(0, 26).map((l, i) => {
    const charged = Math.round((l.weightKg + rand.money(0.2, 2)) * 100) / 100;
    return { id: i + 1, awb: l.awb, orderId: l.orderId, courier: l.courier, vendor: l.vendor, declaredKg: l.weightKg, chargedKg: charged, extraCharge: Math.round((charged - l.weightKg) * 42), status: rand.pick(["Raised by courier", "Accepted", "Auto-accepted"]), createdAt: l.statusDate };
  });
  const pincodes = places.map((p, i) => ({ id: i + 1, pincode: p.pincode, city: p.city, state: p.state, zone: p.zone, prepaid: true, cod: p.state !== "Assam", couriers: couriers.filter(() => rand.chance(0.8)).join(", ") || "NimbusPost", tatDays: p.zone === "within_city" ? 1 : p.zone === "within_state" ? 2 : p.zone === "north_east_jk" ? 7 : 4 }));

  /* ---------- Pricing masters ---------- */
  const masterNrv = products.slice(0, 40).map((p, i) => ({ id: i + 1, sku: p.sku, product: p.name, vendor: p.vendor, nrv: p.nrv, mrp: p.mrp, effectiveFrom: daysAgo(rand.int(5, 120), rand), uploadedBy: rand.pick(["Catalog Team", "Super Admin"]) }));
  const commissionRules = [[0, 500, 18], [501, 1500, 15], [1501, 3000, 12], [3001, 100000, 10]].flatMap(([from, to, base], i) => [
    { id: i * 2 + 1, priceFrom: from, priceTo: to, category: "All categories", seller: "General", commission: base, adExpense: 0, officeExpense: 0, profit: 0, status: "Active" },
    { id: i * 2 + 2, priceFrom: from, priceTo: to, category: rand.pick(["Crop Protection", "Seeds", "Fertilizers"]), seller: i % 2 ? rand.pick(vendors).name : "General", commission: base + 2, adExpense: 4, officeExpense: 3, profit: base - 5, status: "Active" },
  ]);
  const costConfig = [
    { id: 1, scope: "Global", target: "All listings", takeRateMin: 25, takeRateMax: 45, floorPct: 8, targetPct: 11, marketingPct: 6, packagingPct: 2, incentivePct: 1 },
    { id: 2, scope: "Category", target: "Crop Protection", takeRateMin: 28, takeRateMax: 45, floorPct: 8, targetPct: 12, marketingPct: 6, packagingPct: 2, incentivePct: 1 },
    { id: 3, scope: "Category", target: "Farm Equipment", takeRateMin: 25, takeRateMax: 35, floorPct: 6, targetPct: 9, marketingPct: 4, packagingPct: 3, incentivePct: 1 },
    { id: 4, scope: "Seller", target: vendors[0].name, takeRateMin: 25, takeRateMax: 40, floorPct: 8, targetPct: 11, marketingPct: 5, packagingPct: 2, incentivePct: 1 },
  ];

  /* ---------- Customers extras ---------- */
  const coupons = [["KISAN10", "Percentage", 10, "all", 499], ["FIRST50", "Flat", 50, "new", 299], ["MONSOON", "Percentage", 8, "all", 999], ["SEEDS100", "Flat", 100, "old", 1499], ["DRIP5", "Percentage", 5, "all", 4999]].map(([code, type, value, userType, min], i) => ({ id: i + 1, code, type, value, userType, minPrice: min, maxPrice: 50000, applyType: i === 4 ? "products" : "range", expiresAt: new Date(NOW + (i + 1) * 20 * DAY).toISOString(), status: i === 3 ? "Inactive" : "Active", used: rand.int(0, 240) }));
  const reviews = Array.from({ length: 30 }, (_, i) => {
    const p = rand.pick(products);
    return { id: i + 1, product: p.name, productId: p.id, customer: rand.pick(customers).name, rating: rand.weighted([[5, 45], [4, 30], [3, 12], [2, 7], [1, 6]]), comment: rand.pick(["Good result in my soybean field", "Delivery was late", "Genuine product, will order again", "Packaging was leaking", "Price is better than local shop"]), status: rand.weighted([["Published", 70], ["Pending", 22], ["Hidden", 8]]), createdAt: daysAgo(rand.int(0, 90), rand) };
  });

  /* ---------- Staff, roles ---------- */
  const salesExecs = ["Rupesh Kumar", "Anjali Verma", "Imran Khan", "Sneha Patidar", "Vivek Rathore", "Kajal Meena"];
  const salesTeam = [
    ...salesExecs.map((name, i) => ({ id: `ST-${i + 1}`, name, roleId: 56, role: "Sales Executive", experience: rand.pick(["junior", "intermediate", "senior"]), circles: rand.pick(["MP & CG", "Rajasthan", "Maharashtra & Goa", "UP East"]), status: "Active", manager: i < 3 ? "Nitin Sharma" : "Pallavi Joshi" })),
    { id: "ST-7", name: "Nitin Sharma", roleId: 59, role: "Sales Manager", experience: "senior", circles: "MP & CG, Rajasthan", status: "Active", manager: "—" },
    { id: "ST-8", name: "Pallavi Joshi", roleId: 59, role: "Sales Manager", experience: "senior", circles: "Maharashtra & Goa, UP East", status: "Active", manager: "—" },
  ];

  /* ---------- CRM ---------- */
  const leadStatuses = ["New", "Called", "Interested", "Follow Up", "Not Interested", "Converted"];
  const leadSources = ["WhatsApp", "Website Engagement", "Bulk Inquiry", "CSV Import", "AI Call (VAPI)", "Missed Call"];
  const crops = ["Soybean", "Wheat", "Chilli", "Tomato", "Cotton", "Paddy", "Onion", "Garlic"];
  const leads = Array.from({ length: 120 }, (_, i) => {
    const place = rand.pick(places);
    const status = rand.weighted([["New", 22], ["Called", 18], ["Interested", 16], ["Follow Up", 20], ["Not Interested", 12], ["Converted", 12]]);
    const exec = rand.pick(salesTeam.filter((s) => s.roleId === 56));
    return {
      id: `LD-${pad(5000 + i, 5)}`,
      name: personName(rand),
      mobile: mobile(rand),
      city: place.city,
      state: place.state,
      crop: rand.pick(crops),
      acreage: rand.int(1, 40),
      source: rand.pick(leadSources),
      status,
      priority: rand.weighted([["Hot", 25], ["Warm", 45], ["Cold", 30]]),
      assignedTo: exec.name,
      attempts: status === "New" ? 0 : rand.int(1, 6),
      lastCallAt: status === "New" ? null : daysAgo(rand.int(0, 20), rand),
      nextFollowUp: status === "Follow Up" || status === "Interested" ? new Date(NOW + rand.int(-3, 5) * DAY).toISOString() : null,
      orderValue: status === "Converted" ? rand.int(800, 18000) : 0,
      createdAt: daysAgo(rand.int(0, 60), rand),
    };
  });
  const leadActivities = leads.slice(0, 60).flatMap((lead) =>
    Array.from({ length: rand.int(1, 3) }, (_, k) => ({ id: `${lead.id}-A${k}`, leadId: lead.id, type: "Call", disposition: rand.pick(["Connected - Interested", "Not reachable", "Call back later", "Requirement shared", "Switched off", "Order placed"]), durationSec: rand.int(0, 420), note: rand.pick(["Asked for dose for 5 acre soybean", "Will decide after rain", "Wants COD only", "Shared photos of leaf curl"]), by: lead.assignedTo, at: daysAgo(rand.int(0, 20) + k, rand) })),
  );
  const legacyLeads = Array.from({ length: 40 }, (_, i) => ({ id: `LL-${pad(i + 1, 4)}`, name: personName(rand), mobile: mobile(rand), circle: rand.pick(["MP & CG", "Rajasthan", "Maharashtra & Goa", "UP East"]), agent: rand.pick(salesExecs), status: rand.pick(["Call Scheduled", "Call Done", "In Progress", "Requirement Shared", "Order Generated", "Dead", "Done"]), source: rand.pick(["CSV import", "Engagement", "Bulk inquiry", "WhatsApp"]), createdAt: daysAgo(rand.int(30, 300), rand) }));
  const whatsappLeads = Array.from({ length: 36 }, (_, i) => ({ id: `WA-${pad(i + 1, 4)}`, mobile: mobile(rand), name: rand.chance(0.7) ? personName(rand) : "—", language: rand.pick(["Hindi", "English"]), state: rand.pick(["main_menu", "crop_problem", "browse_products", "cart", "checkout", "track_order", "expert"]), lastMessage: rand.pick(["Product dekhna", "Mere tamatar me patte mud rahe hain", "COD", "Order track karna hai", "Expert se baat"]), syncedToCrm: rand.chance(0.6), lastActiveAt: daysAgo(rand.int(0, 10), rand) }));
  const aiCalls = Array.from({ length: 30 }, (_, i) => ({ id: `VAPI-${pad(i + 1, 4)}`, lead: rand.pick(leads).name, mobile: mobile(rand), status: rand.weighted([["completed", 55], ["no-answer", 20], ["queued", 10], ["calling", 5], ["failed", 10]]), durationSec: rand.int(0, 380), outcome: rand.pick(["Interested", "Call back", "Not interested", "Wrong number", "—"]), createdAt: daysAgo(rand.int(0, 14), rand) }));
  const callAudits = Array.from({ length: 24 }, (_, i) => {
    const overall = rand.int(38, 94);
    return { id: `AUD-${pad(i + 1, 4)}`, executive: rand.pick(salesExecs), farmer: personName(rand), callDate: daysAgo(rand.int(0, 30), rand), language: rand.pick(["hi", "hi-en", "mr", "gu", "bho"]), overall, compliance: rand.pick([50, 67, 83, 100]), grade: overall >= 85 ? "A" : overall >= 70 ? "B" : overall >= 55 ? "C" : "D", outcome: rand.pick(["Order placed", "Follow-up set", "No decision", "Lost"]), status: rand.weighted([["Scored", 85], ["Processing", 10], ["Failed", 5]]) };
  });
  const circles = [["6260", "MP & CG"], ["7000", "MP & CG"], ["9414", "Rajasthan"], ["9829", "Rajasthan"], ["9822", "Maharashtra & Goa"], ["9415", "UP East"], ["7505", "UP East"], ["9898", "Gujarat"]].map(([prefix, circle], i) => ({ id: i + 1, prefix, circle, agents: salesTeam.filter((s) => s.circles.includes(circle.split(" ")[0])).map((s) => s.name).join(", ") || "Unassigned" }));

  /* ---------- Sales ---------- */
  const monthKey = "2026-10";
  const salesTargets = salesTeam.map((s, i) => ({ id: i + 1, person: s.name, targetType: s.roleId === 59 ? "sales_manager" : "sales_executive", experience: s.experience, month: monthKey, target: s.roleId === 59 ? 900000 : rand.pick([250000, 300000, 350000]), status: "Active" }));
  salesTargets.push({ id: 99, person: "All executives", targetType: "overall_executive", experience: "—", month: monthKey, target: 1800000, status: "Active" });
  const salaryStructures = salesTeam.map((s, i) => ({ id: i + 1, person: s.name, role: s.role, fixedSalary: s.roleId === 59 ? 45000 : rand.pick([16000, 18000, 22000]), variableType: "percentage", variableValue: s.roleId === 59 ? 1 : 2, incentiveType: "percentage", incentiveValue: 3, effectiveFrom: "2026-04-01", effectiveTo: null, status: "Active" }));
  const achievements = salesTeam.map((s, i) => {
    const target = salesTargets[i].target;
    const achieved = Math.round(target * rand.money(0.45, 1.3));
    return { id: i + 1, person: s.name, role: s.role, month: monthKey, target, achieved, percent: Math.round((achieved / target) * 1000) / 10, prepaidShare: rand.int(20, 62), orders: rand.int(20, 160) };
  });
  const salesPayouts = achievements.map((a, i) => {
    const s = salaryStructures[i];
    const met = a.achieved >= a.target;
    const variable = met ? Math.round((a.target * s.variableValue) / 100) : 0;
    const incentive = met ? Math.round(((a.achieved - a.target) * s.incentiveValue) / 100) : 0;
    const prepaidIncentive = a.role === "Sales Executive" && a.prepaidShare >= 40 ? Math.round(a.achieved * (a.prepaidShare / 100) * 0.02) : a.role === "Sales Manager" ? Math.round(1800000 * 0.4 * 0.0025) : 0;
    return { id: i + 1, person: a.person, role: a.role, month: monthKey, fixed: s.fixedSalary, variable, incentive, prepaidIncentive, total: s.fixedSalary + variable + incentive + prepaidIncentive, status: rand.pick(["Pending", "Processed"]) };
  });
  const prepaidConfig = [
    { id: 1, role: "Sales Executive", thresholdPercent: 40, incentivePercent: 2, basis: "Own prepaid order amount", status: "Active" },
    { id: 2, role: "Sales Manager", thresholdPercent: 0, incentivePercent: 0.25, basis: "All executives' prepaid amount", status: "Active" },
  ];

  /* ---------- B2B ---------- */
  const buyerTypes = ["Retailer", "Dealer", "Distributor", "FPO", "Institution"];
  const segments = ["B0 Lead", "B1 Qualified", "B2 Trial", "B3 Active", "B4 Repeat", "B5 High Value", "B6 Key Account"];
  const b2bBuyers = Array.from({ length: 30 }, (_, i) => {
    const place = rand.pick(places);
    return { id: `BYR-${pad(i + 1, 4)}`, firm: `${rand.pick(["Kisan", "Shiv", "Narmada", "Malwa", "Satpura", "Ganga"])} ${rand.pick(["Agro Centre", "Krishi Seva Kendra", "FPO Ltd", "Traders", "Beej Bhandar"])}`, contact: personName(rand), mobile: mobile(rand), type: rand.pick(buyerTypes), gstin: rand.chance(0.7) ? `23AAB${pad(rand.int(1000, 9999), 4)}C1Z${rand.int(1, 9)}` : null, district: place.city, state: place.state, segment: rand.pick(segments), owner: rand.pick(salesExecs), creditLimit: rand.chance(0.4) ? rand.pick([50000, 100000, 200000]) : 0, outstanding: rand.chance(0.4) ? rand.int(5000, 90000) : 0, lifetimeGmv: rand.int(0, 1800000), nextFollowUp: new Date(NOW + rand.int(-2, 7) * DAY).toISOString(), status: "Active" };
  });
  const rfqStatuses = ["Draft", "Open", "Seller Sourcing", "Quotes Received", "Customer Quote Ready", "Sent", "Negotiation", "Converted", "Lost", "Expired"];
  const rfqs = Array.from({ length: 28 }, (_, i) => {
    const buyer = rand.pick(b2bBuyers);
    const created = daysAgo(rand.int(0, 25), rand);
    return { id: `RFQ-${pad(i + 1, 5)}`, buyerId: buyer.id, buyer: buyer.firm, buyerType: buyer.type, pincode: rand.pick(places).pincode, lines: rand.int(1, 6), estValue: rand.int(10000, 600000), paymentMode: rand.pick(["Prepaid", "Partial advance", "Credit requested"]), status: rand.pick(rfqStatuses), owner: buyer.owner, slaDueAt: new Date(new Date(created).getTime() + 30 * 60000).toISOString(), lostReason: null, createdAt: created };
  });
  rfqs.forEach((r) => { if (r.status === "Lost") r.lostReason = rand.pick(["High Price", "Credit", "Stock", "Competitor", "Shipping", "Delay"]); });
  const quotations = rfqs.filter((r) => !["Draft", "Open", "Seller Sourcing"].includes(r.status)).map((r, i) => {
    const value = r.estValue;
    const cm = rand.money(2.5, 11);
    return { id: `QT-${pad(10001 + i, 5)}`, rfqId: r.id, buyer: r.buyer, value, takeRate: rand.money(8, 15), cmPercent: cm, netShippingPercent: rand.money(1.5, 6.5), approval: cm < 5 ? "Approval Pending" : "Auto-approved", status: rand.pick(["Draft", "Approval Pending", "Approved", "Sent", "Viewed", "Negotiation", "Accepted", "Rejected", "Converted"]), validTill: new Date(NOW + rand.int(-2, 10) * DAY).toISOString(), owner: r.owner, createdAt: r.createdAt };
  });
  const b2bOrderStatuses = ["confirmed", "processing", "packed", "dispatched", "in_transit", "delivered", "returned", "cancelled"];
  const b2bOrders = Array.from({ length: 22 }, (_, i) => {
    const buyer = rand.pick(b2bBuyers);
    const value = rand.int(10000, 450000);
    const seller = rand.pick(vendors);
    return { id: `BAL-B2B-${pad(i + 1, 5)}`, buyerId: buyer.id, buyer: buyer.firm, seller: seller.name, quotationId: quotations[i % quotations.length]?.id ?? null, value, sellerCost: Math.round(value * 0.86), platformRevenue: Math.round(value * 0.12), contribution: Math.round(value * rand.money(0.03, 0.09)), paymentStatus: rand.pick(["Pending", "Partial", "Paid", "Overdue"]), status: rand.pick(b2bOrderStatuses), awb: rand.chance(0.6) ? `LR${rand.int(1000000, 9999999)}` : null, owner: buyer.owner, createdAt: daysAgo(rand.int(0, 60), rand) };
  });
  const b2bPayments = b2bOrders.map((o, i) => ({ id: `B2BPAY-${pad(i + 1, 4)}`, orderId: o.id, buyer: o.buyer, amount: o.paymentStatus === "Paid" ? o.value : Math.round(o.value * rand.money(0.1, 0.6)), mode: rand.pick(["Bank transfer", "Razorpay", "Credit"]), reference: `UTR${rand.int(100000000, 999999999)}`, status: o.paymentStatus, dueDate: new Date(NOW + rand.int(-10, 15) * DAY).toISOString() }));
  const b2bSettlements = b2bOrders.filter((o) => ["delivered", "in_transit", "dispatched"].includes(o.status)).map((o, i) => ({ id: `B2BSET-${pad(i + 1, 4)}`, orderId: o.id, seller: o.seller, grossPayable: o.sellerCost, deductions: Math.round(o.sellerCost * rand.money(0, 0.03)), netPayable: 0, status: rand.pick(["Not Eligible", "Eligible", "Hold", "Processing", "Paid"]) })).map((s) => ({ ...s, netPayable: s.grossPayable - s.deductions }));
  const claims = b2bOrders.slice(0, 7).map((o, i) => ({ id: `CLM-${pad(i + 1, 4)}`, orderId: o.id, buyer: o.buyer, type: rand.pick(["Damage", "Shortage", "Wrong item"]), amount: rand.int(800, 22000), owner: rand.pick(["Operations", "Logistics", "Finance"]), status: rand.pick(["Open", "Evidence Pending", "Under Review", "Approved", "Rejected", "Settled"]), createdAt: daysAgo(rand.int(0, 30), rand) }));
  const b2bAlerts = [
    ["RFQ SLA", "RFQ > 30 min without customer quote", "High"],
    ["Low CM", "Expected CM below 5% on quotation", "High"],
    ["High Shipping", "Net shipping above 5%", "Medium"],
    ["Payment Overdue", "Buyer payment past due date", "High"],
    ["Dispatch Breach", "Not dispatched within SLA", "Medium"],
    ["Repeat Due", "Expected purchase cycle reached", "Low"],
    ["Credit Limit Exceeded", "New order exceeds available limit", "High"],
  ].flatMap(([type, trigger, severity], k) => Array.from({ length: rand.int(1, 3) }, (_, j) => ({ id: `ALR-${k}${j}`, type, trigger, severity, entity: rand.pick([...rfqs.map((r) => r.id), ...b2bOrders.map((o) => o.id)]), assignedTo: rand.pick(salesExecs), status: rand.pick(["Open", "Open", "Acknowledged", "Resolved"]), createdAt: daysAgo(rand.int(0, 7), rand) })));
  const bulkInquiries = Array.from({ length: 18 }, (_, i) => ({ id: `BLK-${pad(i + 1, 4)}`, buyer: personName(rand), mobile: mobile(rand), product: rand.pick(products).name, quantity: `${rand.int(10, 400)} units`, city: rand.pick(places).city, status: rand.pick(["New", "Quoted", "Converted", "Closed"]), serviceCharge: rand.int(500, 9000), createdAt: daysAgo(rand.int(0, 90), rand) }));
  const warehouses = vendors.slice(0, 10).map((v, i) => ({ id: i + 1, name: `${v.name} Warehouse`, vendor: v.name, city: v.city, pincode: v.pincode, contact: v.owner, status: rand.chance(0.85) ? "Active" : "Inactive" }));

  /* ---------- Operations ---------- */
  const opsAgents = ["Pankaj Lodhi", "Ritu Sahu", "Ashish Pawar", "Megha Tiwari"].map((name, i) => ({ id: `OA-${i + 1}`, name, roleId: [32, 57, 66, 32][i], status: "Active", assigned: 0, confirmedPct: rand.int(82, 99), dispatch24Pct: rand.int(70, 97), ndrResolutionPct: rand.int(60, 95), calls: rand.int(40, 220) }));
  const stageOf = (s) => (s === "Delivered" ? "delivered" : s.startsWith("RTO") ? "rto" : s.startsWith("Return") ? "returns" : ["Cancelled", "Rejected"].includes(s) ? "cancelled" : s === "Undelivered" ? "ndr" : ["Shipped", "In Transit", "Out for Delivery"].includes(s) ? "shipped" : ["Packed", "Pending Pickup"].includes(s) ? "packed" : s === "Accepted" ? "processing" : "pending");
  const opsTracker = orderItems.map((l) => {
    const agent = opsAgents[l.id % opsAgents.length];
    agent.assigned++;
    const stage = stageOf(l.status);
    const ageHours = (NOW - new Date(l.createdAt).getTime()) / 3600000;
    const sla = { pending: 4, processing: 24, packed: 24, shipped: 72, ndr: 48 }[stage];
    return { id: `${l.orderId}#${l.id}`, lineId: l.id, orderId: l.orderId, invoice: l.sellerInvoice, vendor: l.vendor, customer: l.customer, courier: l.courier, awb: l.awb, stage, status: l.status, agent: agent.name, paymentMode: l.paymentMode, value: l.price, slaState: !sla ? "—" : ageHours > sla ? "Breached" : ageHours > sla * 0.8 ? "At risk" : "On track", createdAt: l.createdAt };
  });
  const ndr = orderItems.filter((l) => l.status === "Undelivered" || l.status.startsWith("RTO")).map((l, i) => ({ id: `NDR-${pad(i + 1, 4)}`, orderId: l.orderId, awb: l.awb, courier: l.courier, attempt: rand.int(1, 3), reason: rand.pick(["Customer not available", "Address incomplete", "Customer refused", "COD amount not ready", "Area not serviceable"]), customerResponse: rand.pick(["Reattempt tomorrow", "Not reachable", "Wants to cancel", "—"]), nextAction: rand.pick(["Reattempt", "Update address", "Mark RTO", "Call customer"]), status: rand.pick(["Pending", "In Progress", "Resolved"]), owner: rand.pick(opsAgents).name, raisedAt: l.statusDate }));
  const escalationRules = [
    ["order_pending_24h", "Order placed, never confirmed", 24, null, "High"],
    ["vendor_no_response_48h", "Vendor accepted but never dispatched", 48, null, "High"],
    ["failed_calls_3", "Every call attempt failed", null, 3, "High"],
    ["ndr_open_48h", "NDR still Pending/In Progress", 48, null, "High"],
    ["shipment_stuck_72h", "In transit, no courier movement", 72, null, "Medium"],
    ["edd_breached", "Past promised delivery date", 0, null, "Medium"],
    ["followup_overdue", "Scheduled follow-up passed", 24, null, "Low"],
    ["rto_initiated", "RTO started; needs retention call", null, null, "Medium"],
  ].map(([code, description, hours, count, severity], i) => ({ id: i + 1, code, name: code.replace(/_/g, " "), description, thresholdHours: hours, thresholdCount: count, severity, status: "Active" }));
  const escalations = Array.from({ length: 22 }, (_, i) => {
    const rule = rand.pick(escalationRules);
    const line = rand.pick(orderItems);
    return { id: `ESC-${pad(i + 1, 4)}`, rule: rule.code, severity: rule.severity, orderId: line.orderId, invoice: line.sellerInvoice, title: rule.description, owner: rand.pick(opsAgents).name, status: rand.weighted([["Open", 40], ["Acknowledged", 25], ["Resolved", 20], ["Auto-Closed", 15]]), source: rand.chance(0.85) ? "Engine" : "Manual", firstSeenAt: daysAgo(rand.int(0, 6), rand) };
  });
  const slaConfig = [["confirmation", "Order confirmation", 4], ["verification", "Verification", 8], ["vendor_acceptance", "Vendor acceptance", 24], ["invoicing", "Invoicing", 24], ["pickup", "Pickup", 24], ["transit", "Transit", 72], ["ndr_resolution", "NDR resolution", 48], ["escalation", "Escalation response", 24], ["return_pickup", "Return pickup", 72]].map(([code, name, hours], i) => ({ id: i + 1, code, name, slaHours: hours, warnPercent: 80 }));
  const recordings = Array.from({ length: 20 }, (_, i) => ({ id: `REC-${pad(i + 1, 4)}`, orderId: rand.pick(orders).id, agent: rand.pick(opsAgents).name, direction: rand.pick(["Outbound", "Inbound"]), status: rand.pick(["Connected", "Not reachable", "Busy"]), durationSec: rand.int(20, 400), sizeMb: rand.money(0.3, 6), createdAt: daysAgo(rand.int(0, 20), rand) }));
  const kpiTargets = [["Confirmation %", 95, 90], ["Verification %", 95, 90], ["Dispatch within 24h %", 95, 90], ["Dispatch within 48h %", 95, 90], ["EDD Accuracy %", 95, 90], ["OFD Success %", 95, 90], ["NDR Resolution %", 95, 90], ["RTO % (max cap)", 15, 18]].map(([name, target, kri], i) => ({ id: i + 1, name, target, kri, actual: name.startsWith("RTO") ? rand.money(9, 19) : rand.money(78, 99) }));

  /* ---------- Support ---------- */
  const ticketCategories = { customer: ["Refund", "Quality", "Delivery", "Order status"], vendor: ["Payment", "Technical", "Listing", "Pickup"] };
  const tickets = Array.from({ length: 40 }, (_, i) => {
    const userType = rand.chance(0.55) ? "customer" : "vendor";
    const category = rand.pick(ticketCategories[userType]);
    const priority = rand.chance(0.2) ? "Urgent" : "Normal";
    const created = daysAgo(rand.int(0, 20), rand);
    const slaHours = priority === "Urgent" ? 6 : userType === "customer" ? (category === "Refund" ? 48 : category === "Quality" ? 72 : 24) : category === "Payment" ? 48 : 72;
    const dept = { Refund: "Finance", Payment: "Finance", Delivery: "Logistics", Pickup: "Logistics", Technical: "Tech", Listing: "Vendor Support" }[category] ?? "Unassigned";
    return { id: `TKT-${pad(1001 + i, 5)}`, userType, user: userType === "customer" ? rand.pick(customers).name : rand.pick(vendors).name, category, subject: rand.pick(["Refund not received", "Product quality issue", "Order not delivered yet", "Payout pending for last cycle", "Unable to upload images", "Pickup not done", "Wrong product received"]), priority, status: rand.weighted([["Open", 30], ["In-Progress", 25], ["Awaiting Response", 15], ["Resolved", 18], ["Closed", 10], ["Rejected", 2]]), department: dept, assignee: dept === "Unassigned" ? null : rand.pick(["Kunal (Support)", "Ayesha (Support)", "Finance Desk", "Logistics Desk"]), slaDeadline: new Date(new Date(created).getTime() + slaHours * 3600000).toISOString(), createdAt: created, orderId: rand.chance(0.6) ? rand.pick(orders).id : null };
  });
  const ticketMessages = tickets.flatMap((t) => [
    { id: `${t.id}-1`, ticketId: t.id, senderType: t.userType, sender: t.user, message: `${t.subject}. Please help at the earliest.`, internal: false, at: t.createdAt },
    ...(t.status !== "Open" ? [{ id: `${t.id}-2`, ticketId: t.id, senderType: "admin", sender: t.assignee || "Support", message: "We have checked your request and are coordinating with the team.", internal: false, at: new Date(new Date(t.createdAt).getTime() + 2 * 3600000).toISOString() }, { id: `${t.id}-3`, ticketId: t.id, senderType: "admin", sender: t.assignee || "Support", message: "Courier confirms attempt failed; follow up with vendor.", internal: true, at: new Date(new Date(t.createdAt).getTime() + 3 * 3600000).toISOString() }] : []),
  ]);
  const supportSla = [["Urgent (any)", "All", 6], ["Customer · Refund", "Finance", 48], ["Customer · Quality", "Vendor Support", 72], ["Customer · Other", "Logistics", 24], ["Vendor · Payment", "Finance", 48], ["Vendor · Technical / Listing", "Tech", 72]].map(([rule, department, hours], i) => ({ id: i + 1, rule, department, slaHours: hours }));

  /* ---------- CMS ---------- */
  const banners = ["Monsoon Kharif Sale", "Drip Irrigation Week", "Seeds Booking Open", "Free Agronomist Call", "Organic Range"].map((title, i) => ({ id: i + 1, title, placement: rand.pick(["Home hero", "Home strip", "Category top"]), link: `/shop/${title.toLowerCase().replace(/\s+/g, "-")}`, order: i + 1, startsAt: daysAgo(10 - i, rand), endsAt: new Date(NOW + (i + 1) * 9 * DAY).toISOString(), status: i === 4 ? "Inactive" : "Active" }));
  const homeSections = ["Hero banners", "Shop by crop", "Best sellers", "Sponsored products", "Shop by topics", "Featured categories", "Popular brands", "Farmer stories"].map((name, i) => ({ id: i + 1, name, order: i + 1, items: rand.int(4, 16), status: i === 5 ? "Hidden (known issue: never shows)" : "Visible" }));
  const blogs = ["Soybean yellow mosaic: early signs", "Right NPK dose for wheat", "Drip irrigation subsidy guide", "Chilli leaf curl management", "Safe pesticide handling"].map((title, i) => ({ id: i + 1, title, author: rand.pick(["Agronomy Team", "Dr. S. Verma"]), category: rand.pick(["Crop care", "Schemes", "Irrigation"]), status: rand.pick(["Published", "Draft"]), publishedAt: daysAgo(rand.int(1, 90), rand) }));
  const events = ["Kisan Mela Vidisha", "Drip demo - Sehore", "FPO meet Indore"].map((title, i) => ({ id: i + 1, title, city: ["Vidisha", "Sehore", "Indore"][i], date: new Date(NOW + (i * 8 - 4) * DAY).toISOString(), status: i === 0 ? "Completed" : "Upcoming" }));
  const faqs = ["How do I track my order?", "Is COD available?", "How do returns work?", "When will I get my refund?", "How can I sell on Bharat AgroLink?"].map((q, i) => ({ id: i + 1, question: q, category: rand.pick(["Orders", "Payments", "Returns", "Sellers"]), order: i + 1, status: "Active" }));
  const pages = ["About Us", "Privacy Policy", "Terms & Conditions", "Shipping Policy", "Return Policy", "Seller Terms"].map((title, i) => ({ id: i + 1, title, slug: title.toLowerCase().replace(/[^a-z]+/g, "-"), updatedBy: rand.pick(["Super Admin", "Content Team"]), status: "Published", updatedAt: daysAgo(rand.int(5, 200), rand) }));
  const footerLinks = [["Company", "About Us"], ["Company", "Careers"], ["Help", "Track Order"], ["Help", "Returns"], ["Policies", "Privacy Policy"], ["Policies", "Terms"], ["Sell", "Sell on Bharat AgroLink"]].map(([column, label], i) => ({ id: i + 1, column, label, url: `/${label.toLowerCase().replace(/[^a-z]+/g, "-")}`, order: i + 1, status: "Active" }));
  const pushNotifications = ["Monsoon offers are live", "Your crop advisory for this week", "Seeds booking closing soon"].map((title, i) => ({ id: i + 1, title, audience: rand.pick(["All app users", "Customers with orders", "Inactive 30 days"]), sentAt: i === 2 ? null : daysAgo(i * 6 + 1, rand), status: i === 2 ? "Scheduled" : "Sent", reach: i === 2 ? 0 : rand.int(800, 4200) }));

  /* ---------- Masters ---------- */
  const states = [...new Set(places.map((p) => p.state))];
  const geography = [
    { id: "c-1", type: "Country", name: "India", parent: "—", code: "IN", status: "Active" },
    ...states.map((s, i) => ({ id: `s-${i + 1}`, type: "State", name: s, parent: "India", code: s.slice(0, 2).toUpperCase(), status: "Active" })),
    ...places.map((p, i) => ({ id: `ct-${i + 1}`, type: "City", name: p.city, parent: p.state, code: p.pincode, status: "Active" })),
  ];
  const rejectReasons = [["Product", "Images do not match product label"], ["Product", "Missing CIB registration for pesticide"], ["Product", "MRP not visible"], ["Seller", "GSTIN mismatch"], ["Seller", "Bank proof unclear"], ["Shipment", "Package not ready at pickup"]].map(([type, reason], i) => ({ id: i + 1, type, reason, status: "Active" }));
  const currencies = [{ id: 1, code: "INR", symbol: "₹", name: "Indian Rupee", default: true, status: "Active" }];

  /* ---------- Settings ---------- */
  const emailTemplates = ["Order placed", "Order shipped", "Order delivered", "Return approved", "Refund processed", "Seller payout processed", "Seller product approved", "Seller product rejected"].map((name, i) => ({ id: i + 1, name, subject: `${name} – Bharat AgroLink`, audience: name.startsWith("Seller") ? "Seller" : "Customer", updatedAt: daysAgo(rand.int(10, 300), rand), status: "Active" }));
  const languages = [{ id: 1, name: "English", code: "en", phrases: 1240, default: true, status: "Active" }, { id: 2, name: "हिंदी (Hindi)", code: "hi", phrases: 1012, default: false, status: "Active" }, { id: 3, name: "Arabic (legacy)", code: "ar", phrases: 410, default: false, status: "Inactive" }];

  /* ---------- Customer extras: wallet / whatsapp orders / sr checkout ---------- */
  const whatsappOrders = orders.filter((o) => o.channel === "WhatsApp").map((o) => ({ id: o.id, customer: o.customer, items: o.items, total: o.total, paymentMode: o.paymentMode, status: o.status, flow: "v2", createdAt: o.createdAt }));
  const srCheckout = Array.from({ length: 16 }, (_, i) => ({ id: `SRC-${pad(i + 1, 4)}`, type: rand.chance(0.6) ? "Order" : "Abandoned cart", customer: personName(rand), value: rand.int(300, 6000), status: rand.pick(["Captured", "Pending", "Recovered", "Abandoned"]), createdAt: daysAgo(rand.int(0, 20), rand) }));
  const legacyPayments = vendors.slice(0, 12).map((v, i) => ({ id: `PAY-${pad(i + 1, 4)}`, vendor: v.name, week: `Week ${30 + i}, 2026`, sellerPay: rand.int(4000, 60000), status: rand.pick(["Paid", "Paid", "Pending"]) }));

  return {
    holdLedger, ledger, codRecon, gstMonthly, fixedExpenses, expenseCaps, walletWithdrawals,
    courierSlabs, shippingSlabs, codRules, otherCharges, packageBoxes, weightDiscrepancies, pincodes,
    masterNrv, commissionRules, costConfig, coupons, reviews,
    salesTeam, leads, leadActivities, legacyLeads, whatsappLeads, aiCalls, callAudits, circles,
    salesTargets, salaryStructures, achievements, salesPayouts, prepaidConfig,
    b2bBuyers, rfqs, quotations, b2bOrders, b2bPayments, b2bSettlements, claims, b2bAlerts, bulkInquiries, warehouses,
    opsAgents, opsTracker, ndr, escalationRules, escalations, slaConfig, recordings, kpiTargets,
    tickets, ticketMessages, supportSla,
    banners, homeSections, blogs, events, faqs, pages, footerLinks, pushNotifications,
    geography, rejectReasons, currencies, emailTemplates, languages,
    whatsappOrders, srCheckout, legacyPayments,
  };
}
