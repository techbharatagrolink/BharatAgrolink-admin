const longDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const valid = (iso) => iso !== null && iso !== undefined && iso !== "" && !Number.isNaN(new Date(iso).getTime());
export const formatLongDate = (iso) => (valid(iso) ? longDate.format(new Date(iso)) : "—");

export const agreementMeta = {
  title: "Seller SLA & Business Agreement",
  company: "Agrolink Manufacturing Private Limited",
  platform: "Bharat Agrolink (Agrolink Manufacturing Pvt. Ltd.)",
  effectiveDate: "2026-10-14",
  version: "2.0",
  fileName: "Bharat-AgroLink-Seller-SLA-Agreement-v2.0.pdf",
  footer: "Where Dreams Take Root | www.bharatagrolink.com | +91-9993051222 | bharatagroinkofficial@gmail.com",
};

const p = (text) => ({ type: "p", text });
const note = (text) => ({ type: "p", text, tone: "note" });
const em = (text) => ({ type: "p", text, tone: "em" });
const strong = (text) => ({ type: "p", text, tone: "strong" });
const list = (...items) => ({ type: "list", items });
const sub = (number, title) => ({ type: "sub", number, title });
const heading = (text) => ({ type: "heading", text });
const table = (head, ...rows) => ({ type: "table", head, rows });
const total = (...cells) => ({ total: true, cells });
const callout = (title, blocks, tone) => ({ type: "callout", title, blocks, tone });
const pageBreak = { type: "break" };

export const agreementSections = [
  {
    id: "parties",
    number: null,
    kind: "parties",
    title: "Parties to the Agreement",
    blocks: [
      p("We look forward to building a successful and long-term business relationship with you. This Agreement sets out simple, clear, and fair terms so that we can work together smoothly, serve our customers well, and grow together."),
    ],
  },
  {
    id: "purpose",
    number: 1,
    title: "Purpose of Agreement",
    blocks: [
      p("This Agreement is designed to ensure that both Bharat Agrolink and our Sellers operate with clarity, transparency, and mutual trust. It outlines the responsibilities of each party so there are no surprises — and we can focus on growing business together."),
    ],
  },
  {
    id: "relationship",
    number: 2,
    newPage: true,
    title: "Nature of Relationship",
    blocks: [
      p("Bharat Agrolink is an online marketplace that connects customers across India with quality sellers like you. Our role is to bring you orders, manage the platform, and ensure a smooth experience for your customers."),
      p("As a Seller on our platform, you are responsible for the following — and we are here to support you at every step:"),
      list("Product quality", "Legal compliance", "Inventory management", "Packaging", "Dispatch and fulfillment"),
    ],
  },
  {
    id: "listing-nrv",
    number: 3,
    key: "Listing & NRV Revision",
    title: "Product Listing Responsibility & NRV Revision Policy",
    blocks: [
      sub("3.1", "Product Listing Requirements"),
      p("To help customers make informed purchase decisions, please ensure every product listing includes:"),
      list("Correct product name", "Accurate specifications", "Proper MRP", "Batch details", "Manufacturing & expiry date", "Applicable licenses and approvals"),
      p("Accurate listings build customer trust and lead to better sales — any incorrect or misleading information will be the Seller's responsibility."),
      sub("3.2", "NRV Fixation at Listing"),
      p("The NRV you declare at the time of listing is the agreed price for that product on our platform. We request that this price remain stable once listed and approved, so that customer expectations are met consistently."),
      pageBreak,
      sub("3.3", "NRV Revision Process"),
      p("We completely understand that market conditions change. If you need to revise your NRV for any reason, simply follow this easy process and we will get it updated:"),
      list(
        "Send us your NRV revision request at least 7 days before the date you want the new price to go live",
        "Share it with us via the Seller WhatsApp Group or email to our Seller Support team",
        "Please include: Product Name, Current NRV, Revised NRV, Reason for Change, and Requested Effective Date",
        "We will review and confirm in writing — the new NRV goes live only after our approval",
        "Please do not update the NRV without our written confirmation — verbal or partial communication will not be treated as approved"
      ),
      sub("3.4", "Unauthorised NRV Revision — SLA Breach"),
      p("We urge all Sellers to follow the revision process above. An NRV change without prior written approval disrupts platform pricing and customer trust, and will be treated as an SLA breach:"),
      table(
        ["Occurrence", "Action by Platform", "Impact on Seller"],
        ["1st Instance", "Written warning issued. Unauthorised NRV reverted immediately.", "Performance score impacted"],
        ["2nd Instance", "Listing of affected product temporarily suspended.", "Suspension of product listing"],
        ["3rd Instance", "All listings suspended. Account placed under review.", "Full account suspension"],
        ["Repeated Breach", "Account deactivation. Agreement terminated.", "Permanent deactivation"]
      ),
      p("To protect our customers and platform integrity, we will immediately revert any unauthorised NRV change to the last approved value."),
    ],
  },
  {
    id: "pricing-payout",
    number: 4,
    newPage: true,
    key: "Pricing & Seller Payout",
    title: "Pricing Policy & Seller Payout",
    blocks: [
      callout("NRV (Net Realisable Value) — Definition & Seller Acknowledgement", [
        p("NRV (Net Realisable Value) is the price declared by the Seller for each listed product on the Bharat Agrolink platform, inclusive of applicable GST. This is the sole and exclusive basis on which the Seller's payout is calculated."),
        em("Once declared and accepted at the time of product listing, the NRV becomes the binding and agreed price between the Seller and Bharat Agrolink for that product."),
        heading("1. NRV ≠ Marketplace Display Price"),
        p("The price a customer sees on the marketplace is the Marketplace Display Price set by Bharat Agrolink — it is not the Seller's NRV. These are two entirely different values. The Seller's settlement is based solely on the NRV and never on the Marketplace Display Price."),
        heading("2. NRV is the Seller's Responsibility"),
        p("The NRV declared by the Seller must be competitive and accurate. It is the amount on which TCS and all applicable deductions are calculated, and the resulting net amount is credited to the Seller."),
        heading("3. Seller Has No Claim on the Marketplace Display Price"),
        p("The Marketplace Display Price includes platform additions determined solely by Bharat Agrolink, which are confidential and internal. The Seller has no right to request information about these additions or to raise any settlement claim based on the Marketplace Display Price."),
        strong("By signing this Agreement, the Seller confirms that they fully understand and accept that their payout shall always be based solely on the declared NRV — and no dispute or claim to the contrary shall be entertained thereafter."),
      ]),
      pageBreak,
      sub("4.1", "NRV & HSN / GST Declaration — Mandatory"),
      p("For every product listed on the Bharat Agrolink platform, please ensure the following details are declared at the time of onboarding or listing:"),
      table(
        ["Field", "NRV (Incl. GST) ₹", "HSN Code", "GST %", "MSP ₹", "MRP ₹", "Mandatory?"],
        ["Per product", "Seller to fill", "4 or 8 digit", "0/5/18% etc", "Min. Support Price", "Printed on pack", "Yes"],
        ["Seller Responsibility", "Competitive & Accurate", "As per GST Law", "As per HSN Slab", "For Reference", "For Reference", "Seller Liable"]
      ),
      list(
        "NRV (Incl. GST): Seller's competitive price inclusive of GST — this is the binding declared value",
        "HSN Code: 4-digit or 8-digit HSN code applicable to the product as per GST law",
        "GST %: The correct GST rate as per the product's HSN code (0%, 5%, 12%, 18%, or 28%)",
        "MSP (Minimum Support Price): Government declared MSP for the product, wherever applicable — for reference only",
        "MRP (Maximum Retail Price): MRP as printed on the product packaging — for reference only"
      ),
      p("We will use your declared HSN code and GST % for internal tax treatment. Please ensure these are accurate — any liability arising from incorrect HSN or GST declaration will rest with the Seller."),
      p("Products with incomplete NRV, HSN, or GST % will be put on hold until all details are correctly submitted — our team will reach out to help."),
      pageBreak,
      sub("4.2", "Competitive Pricing & Marketplace Ranking"),
      p("Bharat Agrolink operates a price-driven ranking system. The lower and more competitive the NRV declared by the Seller, the higher the product's visibility, search ranking, and priority on the marketplace."),
      p("The Marketplace Display Price is built on top of the Seller's NRV. A competitive NRV directly results in a competitive Display Price for the customer — which means better sales, higher order volumes, and greater earnings for the Seller. We therefore strongly encourage all Sellers to declare the most competitive NRV possible."),
      table(
        ["NRV Position vs Market", "Marketplace Ranking", "Platform Action"],
        ["Lowest / Most Competitive", "Top Priority — Rank #1", "Max visibility & promotion"],
        ["Competitive", "High Priority", "Good listing placement"],
        ["Average", "Standard Ranking", "Normal listing"],
        ["Above Market Price", "Reduced Visibility", "De-prioritised in search"],
        ["Uncompetitive / High NRV", "Listing Held / Suppressed", "Product may be delisted"]
      ),
      p("The Platform reserves the right to adjust product ranking, visibility, and promotional placement based on price competitiveness at any time without prior notice."),
      sub("4.3", "Marketplace Display Price"),
      p("The Marketplace Display Price is the final price visible to the customer on the platform. It is determined solely by Bharat Agrolink based on market conditions, competitive benchmarking, and platform pricing strategy. Bharat Agrolink reserves the right to adjust the Display Price at any time to ensure the platform remains competitive in the market."),
      list(
        "The Seller has no claim on the Marketplace Display Price or any component thereof",
        "The Display Price is not the basis for Seller payout or settlement",
        "Promotional pricing, seasonal discounts, or competitive price adjustments may be applied by Bharat Agrolink at its sole discretion — the Seller's NRV and payout shall not be affected by such adjustments"
      ),
      pageBreak,
      sub("4.4", "Seller Payout & Settlement Cycle"),
      p("Your payout starts from the Total Order Value paid by the customer. Service Charges are deducted first to arrive at your NRV, after which statutory and operational deductions apply:"),
      callout("Seller Payout — Illustrated Example | How Your Payout Is Calculated", [
        p("Two separate calculations apply — one builds up the Marketplace Display Price from the Seller NRV, and the second shows how the Seller Payout is derived. The Seller's payout is never based on the Marketplace Display Price."),
        heading("PART A — At Listing: How Display Price is Built from Your NRV →"),
        table(
          ["Component", "Amount (Example)", "Note"],
          ["Seller NRV", "₹ 682.00", "Seller declares at listing"],
          ["+ Platform Additions", "Confidential", "Determined by Bharat Agrolink"],
          total("= Marketplace Display Price", "₹ 1,118.82", "Final price shown to customer")
        ),
        heading("PART B — At Payment: How Your Payout is Derived from Display Price ←"),
        table(
          ["Component", "Amount (Example)", "Note"],
          ["Total Order Value (Display Price)", "₹ 1,118.82", "Amount paid by customer"],
          ["– Platform Deductions", "Confidential", "As per Seller Commercial Agreement"],
          total("= Seller NRV", "₹ 682.00", "Seller's declared price"),
          ["– TCS", "₹ 6.82", "As applicable — Income Tax Act"],
          ["– Penalty (if applicable)", "₹ 0.00", "As per Dispatch SLA — Section 7"],
          ["– Weight Discrepancy (if any)", "₹ 0.00", "As per Packaging clause — Section 9"],
          total("= Seller Payout", "₹ 675.18", "Net amount credited to Seller")
        ),
        note("Note: Marketplace Display Price and Seller Payout are two separate values. The Seller is entitled only to their declared NRV minus applicable deductions (TCS, penalty, discrepancy if any)."),
      ]),
      pageBreak,
      sub("4.4.1", "Payment Cycle"),
      p("Payouts are processed in two cycles every month. Orders are grouped by the fortnight in which they are completed, and payment is made in the corresponding fortnight of the following month."),
      table(
        ["Cycle", "Order Completion", "Payment Window", "Target Date", "Example"],
        ["Cycle 1", "1st – 15th of the month", "1st – 15th of next month", "By 10th", "Jun 1–15 → Jul 1–10"],
        ["Cycle 2", "16th – last day of month", "16th – last day of next month", "By 20th", "Jun 16–30 → Jul 16–20"]
      ),
      sub("4.5", "Service Charges — Definition"),
      p("Service Charges represent the variable cost incurred by Bharat Agrolink in supporting the Seller's business operations and ensuring successful order fulfilment from order placement to final customer delivery."),
      list(
        "Service Charges are deducted from the Total Order Value before arriving at the Seller NRV",
        "The applicable rate is confidential and communicated separately to the Seller",
        "Bharat Agrolink reserves the right to revise Service Charges with prior notice to the Seller"
      ),
    ],
  },
  {
    id: "gst-compliance",
    number: 5,
    newPage: true,
    key: "GST & Legal Compliance",
    title: "GST, Invoicing & Legal Compliance",
    blocks: [
      p("To ensure smooth operations and legal compliance, we request you to maintain the following. Please note that all GST tax invoices issued to customers shall be raised in the Seller's name and GSTIN — Bharat Agrolink facilitates the marketplace but the Seller is the supplier of record for all GST and invoicing purposes:"),
      list("Maintain valid GST registration", "Comply with all applicable laws", "Maintain necessary licenses for fertilizers, pesticides, seeds, and agriculture inputs"),
      p("Bharat Agrolink will always support you in staying compliant — however, legal liability arising from non-compliance will rest with the Seller."),
    ],
  },
  {
    id: "inventory-orders",
    number: 6,
    title: "Inventory Management, Order Acceptance & Processing",
    blocks: [
      sub("6.1", "Stock & Inventory Updation"),
      p("Keeping your stock levels updated ensures customers always see accurate availability — and you never miss a genuine order or receive one you cannot fulfil."),
      list(
        "If a product is out of stock, the Seller must immediately mark it as Unavailable / Out of Stock on the platform",
        "Please update stock levels in real time or as soon as a change occurs",
        "Selling season, high-demand periods, or bulk movements do not exempt the Seller from maintaining accurate stock status"
      ),
      sub("6.2", "Order Acceptance & Processing"),
      p("Every order that comes your way is a customer waiting — please accept and process all orders within the defined timelines so we can keep customers happy together."),
    ],
  },
  {
    id: "dispatch-sla",
    number: 7,
    key: "Dispatch SLA",
    title: "Dispatch SLA (Service Level Agreement)",
    blocks: [
      p("We want every customer to receive their order quickly. Sellers who dispatch early are rewarded with better rankings and priority order allocation:"),
      sub("7A.", "Marketplace Orders"),
      p("Standard individual orders placed by customers through the Bharat Agrolink marketplace:"),
      table(
        ["Dispatch Timeline", "Action / Penalty"],
        ["Within 24 Hours", "⭐ Early Dispatch Bonus – Priority Ranking"],
        ["24 to 48 Hours", "No Penalty"],
        ["48 to 60 Hours", "₹25 Penalty Per Order"],
        ["60 to 72 Hours", "₹50 Penalty Per Order"],
        ["After 72 Hours", "Order Auto Cancellation"]
      ),
      pageBreak,
      sub("7B.", "Bulk Orders"),
      p("Orders designated as Bulk Orders (high-quantity / institutional / B2B orders):"),
      table(
        ["Dispatch Timeline", "Action / Penalty"],
        ["Within 24 Hours", "⭐ Early Dispatch Bonus – Priority Ranking"],
        ["24 to 48 Hours", "₹25 Penalty Per Order"],
        ["48 to 72 Hours", "₹50 Penalty Per Order"],
        ["72 to 96 Hours", "₹100 Penalty Per Order"],
        ["After 96 Hours", "Order Auto Cancellation"]
      ),
      note("Note: Sellers dispatching within 24 hours (for both order types) will receive a Performance Boost and higher priority for future order allocation."),
    ],
  },
  {
    id: "penalties",
    number: 8,
    key: "Penalties & Deductions",
    title: "Penalty & Deduction Policy",
    blocks: [
      p("Penalties apply only when dispatch timelines are not met. If applicable, they will be auto-adjusted in your settlement — we always aim to keep these at zero."),
      list("Listing restrictions", "Temporary suspension", "Account deactivation"),
    ],
  },
  {
    id: "packaging",
    number: 9,
    newPage: true,
    key: "Packaging & Damage Liability",
    title: "Packaging Standards, Dimension Declaration & Damage Liability",
    blocks: [
      sub("9.1", "Packaging Quality Standards"),
      p("Please ensure every shipment is packed securely so it reaches the customer in perfect condition:"),
      list(
        "Strong, durable outer packaging appropriate to product weight",
        "Leakage-proof and tamper-evident packaging for liquids and agri-chemicals",
        "Adequate internal cushioning or padding to prevent damage during transit",
        "Correct and legible shipping labels on every package"
      ),
      sub("9.2", "Damage Liability — Seller vs. Shipping Partner"),
      table(
        ["Damage Scenario", "Liable Party", "Resolution"],
        ["Inadequate / flimsy packaging by seller", "Seller", "Deducted from seller settlement — SLA breach"],
        ["Wrong product dispatched by seller", "Seller", "Full loss borne by seller"],
        ["Expired product dispatched", "Seller", "Full loss borne by seller"],
        ["Damage caused by shipping partner", "Shipping Partner", "Handled internally by Bharat Agrolink"],
        ["Damage cause unclear / disputed", "Under Review", "Bharat Agrolink shall determine liability"]
      ),
    ],
  },
  {
    id: "logistics",
    number: 10,
    title: "Logistics & Shipment Management",
    blocks: [
      p("You have the flexibility to dispatch orders through either platform shipping partners or approved self-shipping methods with valid tracking IDs."),
    ],
  },
  {
    id: "returns-rto",
    number: 11,
    newPage: true,
    key: "Returns, RTO & Damage",
    title: "Return, RTO & Damage Liability",
    blocks: [
      p("In cases of wrong product dispatch, damaged packaging, expired products, or seller-caused delivery failures, the loss will be adjusted in settlement."),
    ],
  },
  {
    id: "service-charges",
    number: 13,
    key: "Service Charges & Settlement",
    title: "Service Charges & Settlement",
    blocks: [
      p("Your payments are released as per the agreed settlement cycle after deducting BAL Invoice Value, TCS/TDS, and any SLA adjustments."),
    ],
  },
  {
    id: "suspension",
    number: 16,
    key: "Suspension & Termination",
    title: "Suspension & Termination Rights",
    blocks: [
      p("Seller access may be suspended in cases of repeated SLA violations, non-compliance, fraud, or operational misconduct."),
    ],
  },
  {
    id: "disputes",
    number: 18,
    newPage: true,
    key: "Dispute Resolution",
    title: "Dispute Resolution & Jurisdiction",
    blocks: [
      p("Any unresolved matter shall be subject to the exclusive jurisdiction of the competent courts located in Bhopal, Madhya Pradesh."),
    ],
  },
  {
    id: "signatures",
    number: null,
    kind: "signatures",
    title: "Seller Details & Signatures",
    blocks: [],
  },
];

export const agreementPages = [];
for (const section of agreementSections) {
  if (section.newPage || !agreementPages.length) agreementPages.push({ number: agreementPages.length + 1, parts: [] });
  section.page = agreementPages.length;
  let part = { section, blocks: [], continued: false };
  agreementPages.at(-1).parts.push(part);
  for (const block of section.blocks) {
    if (block.type !== "break") {
      part.blocks.push(block);
      continue;
    }
    part = { section, blocks: [], continued: true };
    agreementPages.push({ number: agreementPages.length + 1, parts: [part] });
  }
}

export const agreementPageCount = agreementPages.length;
export const keySections = agreementSections.filter((section) => section.key);
export const sectionHeading = (section) => (section.number ? `${section.number}. ${section.title}` : section.title);

const BLANK = "______________________________";

export function agreementDetails(party = {}, acceptance = null) {
  const row = (label, text) => ({ label, value: text || BLANK });
  const name = acceptance?.name ?? (party.signatory?.trim() || party.signatoryName?.trim());
  const designation = acceptance?.designation ?? party.designation?.trim();
  const date = acceptance?.acceptedAt ?? party.date ?? null;
  const signedOn = date ? formatLongDate(date) : "";

  return {
    date,
    parties: [
      row("Seller / Vendor Name", party.vendorName || party.companyName),
      row("Vendor ID", party.vendorId || party.id),
      row("Address", party.address),
      row("GST Number", party.gstin),
    ],
    seller: [
      row("Company Name", party.vendorName || party.companyName),
      row("Vendor Code / ID", party.vendorId || party.id),
      row("GST Number", party.gstin),
      row("Address", party.address),
      row("Authorized Signatory", name && designation ? `${name} (${designation})` : name || BLANK),
      row("Contact Number", party.phone || party.mobile),
      row("Email ID", party.email),
      acceptance
        ? { label: "Signature & Stamp", value: "Digitally signed", signature: true, signed: true }
        : { label: "Signature & Stamp", value: "Pending acceptance", signature: true, signed: false },
      row("Accepted On", signedOn || "Pending"),
      row("IP Address", acceptance?.ipAddress || party.ipAddress || BLANK),
    ],
    platform: [
      row("Platform", "Bharat Agrolink (Agrolink Manufacturing Pvt. Ltd.)"),
      row("Designation", "Authorized Signatory"),
      { label: "Signature", value: "Digitally signed", signature: true, signed: true },
      row("Effective Date", "14 October 2026"),
    ],
  };
}
