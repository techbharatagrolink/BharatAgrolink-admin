/**
 * Support / hiring / staff parity screens (chat_logs.php, requirement_requests.php,
 * product_review.php, vacancies.php, vacancy_applications.php, add-staff.php,
 * signup_modal_settings.php, script_settings.php).
 */

export const DEPARTMENTS = [
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Advisory", label: "Agriculture / Advisory" },
  { value: "Technology", label: "Technology & Engineering" },
  { value: "Operations", label: "Operations & Supply Chain" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Human Resources", label: "Human Resources (HR)" },
  { value: "Finance & Accounts", label: "Finance & Accounts" },
  { value: "Product & Design", label: "Product & Design" },
];

export const JOB_TYPES = ["Full Time", "Part Time", "Remote", "Hybrid", "Contract", "Internship"];

export const BADGE_COLORS = [
  { value: "sales", label: "Sales (green)" },
  { value: "marketing", label: "Marketing (orange)" },
  { value: "advisory", label: "Advisory (teal)" },
  { value: "technology", label: "Technology (blue)" },
  { value: "operations", label: "Operations (purple)" },
  { value: "info", label: "General (blue)" },
];

export const APPLICATION_STATUSES = ["New", "Reviewed", "Shortlisted", "Interviewed", "Selected", "Rejected"];

const deleteAction = { id: "delete", label: "Delete", permission: "delete", tone: "danger", effect: { remove: true }, confirm: { title: "Are you sure want to delete?", description: "This cannot be undone." } };

export const resources = {
  "support.chatLogs": {
    title: "Chatbot Logs",
    description: "Chatbot conversations grouped by session. Open a session to read the messages and record a review.",
    permission: "support.chatLogs",
    search: "Type to filter the selected column…",
    dateRange: true,
    exportable: true,
    columns: [
      { key: "sessionId", label: "Session ID", type: "mono", sortable: true, sub: "region", width: 260 },
      { key: "messages", label: "Messages", type: "number", sortable: true },
      { key: "firstIntent", label: "First Intent", sortable: true },
      { key: "lastMessageAt", label: "Last Message", type: "datetime", sortable: true },
      { key: "startedAt", label: "Session Started", type: "datetime", sortable: true },
      { key: "conversation", label: "Conversation", type: "status" },
      { key: "feedback", label: "Feedback", wrap: true, width: 280 },
    ],
    filters: [
      { key: "conversation", label: "Conversation", options: ["Yes", "No"] },
      { key: "column", label: "Column", options: ["Session ID", "Region", "First Intent"] },
    ],
    rowActions: [{ id: "view", label: "View conversation", permission: "view", href: "/admin/support/chat-logs?view={id}" }],
  },

  "support.requirements": {
    title: "Requirement Requests",
    description: "Requirement forms submitted from the website.",
    permission: "support.requirements",
    search: "Search name, mobile, crop problem…",
    dateRange: true,
    exportable: true,
    columns: [
      { key: "id", label: "ID", type: "number", sortable: true },
      { key: "name", label: "Name", sortable: true },
      { key: "mobile", label: "Mobile", type: "mono" },
      { key: "cropProblem", label: "Crop Problem", wrap: true, width: 280 },
      { key: "additionalInfo", label: "Additional Info", wrap: true, width: 280 },
      { key: "createdAt", label: "Submitted Date", type: "datetime", sortable: true },
    ],
    rowActions: [{ id: "view", label: "View details", permission: "view", href: "/admin/support/requirements?view={id}" }],
  },

  "customers.pendingReviews": {
    title: "Pending Reviews",
    description: "Product reviews waiting for approval. Approving recalculates the product rating.",
    permission: "customers.pendingReviews",
    search: "Search customer, product, title…",
    dateRange: true,
    exportable: true,
    columns: [
      { key: "customer", label: "User Name", sortable: true },
      { key: "product", label: "Product", sortable: true, wrap: true, width: 280 },
      { key: "title", label: "Title", wrap: true, width: 240 },
      { key: "rating", label: "Rating", type: "number", sortable: true },
      { key: "status", label: "Status", type: "status" },
      { key: "createdAt", label: "Submitted", type: "datetime", sortable: true },
    ],
    rowActions: [
      { id: "view", label: "View review", permission: "view", href: "/admin/customers/reviews/pending?view={id}" },
      { id: "approve", label: "Approve", permission: "edit", effect: { set: { status: "Active" } }, confirm: { title: "Are you sure want to approve?", description: "The review goes live and the product rating is recalculated." } },
      deleteAction,
    ],
    bulkActions: [
      { id: "approve", label: "Approve", permission: "edit", effect: { set: { status: "Active" } }, confirm: { title: "Are you sure want to approve?", description: "The selected reviews go live and product ratings are recalculated." } },
      deleteAction,
    ],
  },

  "hiring.vacancies": {
    title: "Hiring Vacancies",
    description: "Job openings shown on the Careers page. Active openings are listed first, then by display order.",
    permission: "hiring.vacancies",
    search: "Search title, location, description…",
    exportable: true,
    columns: [
      { key: "displayOrder", label: "Order", type: "number", sortable: true },
      { key: "title", label: "Job Title", sortable: true, sub: "slug", width: 280 },
      { key: "departmentLabel", label: "Department", sortable: true },
      { key: "location", label: "Location / Mode" },
      { key: "jobType", label: "Type", sub: "experience" },
      { key: "openings", label: "Openings", type: "number", sortable: true },
      { key: "applications", label: "Applications", type: "number", sortable: true, href: "/admin/hiring/applications?vacancyId={id}" },
      { key: "status", label: "Status", type: "status", labels: { Active: "Active (Hiring)", Closed: "Closed (Hidden)" } },
    ],
    filters: [
      { key: "department", label: "Department", options: DEPARTMENTS },
      { key: "status", label: "Status", options: ["Active", "Closed"] },
    ],
    rowActions: [
      { id: "edit", label: "Edit", permission: "edit", kind: "form" },
      { id: "activate", label: "Mark Active (Hiring)", permission: "edit", effect: { set: { status: "Active" } }, when: { field: "status", notIn: ["Active"] } },
      { id: "close", label: "Mark Closed (Hidden)", permission: "edit", effect: { set: { status: "Closed" } }, when: { field: "status", in: ["Active"] } },
      { ...deleteAction, confirm: { title: "Are you sure want to delete this vacancy?", description: "Applications already received are kept." } },
    ],
    form: {
      title: "Vacancy",
      fields: [
        { name: "title", label: "Job Title", type: "text", required: true, maxLength: 255 },
        { name: "department", label: "Department", type: "select", required: true, options: DEPARTMENTS },
        { name: "location", label: "Location / Work Mode", type: "text", required: true, maxLength: 255 },
        { name: "jobType", label: "Job Type", type: "select", required: true, options: JOB_TYPES },
        { name: "experience", label: "Experience Required", type: "text", maxLength: 100 },
        { name: "openings", label: "Number of Openings", type: "number", min: 1 },
        { name: "badgeColor", label: "Badge Color (empty = from department)", type: "select", options: BADGE_COLORS },
        { name: "iconClass", label: "Icon Class (Font Awesome)", type: "text", maxLength: 100 },
        { name: "summaryPoints", label: "Card Bullet Highlights (one per line)", type: "textarea", required: true, maxLength: 65535 },
        { name: "description", label: "Detailed Job Description", type: "textarea", maxLength: 1000000 },
        { name: "requirements", label: "Requirements (one per line)", type: "textarea", maxLength: 65535 },
        { name: "salaryRange", label: "Salary Range", type: "text", maxLength: 100 },
        { name: "contactEmail", label: "Contact Email", type: "email", maxLength: 255 },
        { name: "displayOrder", label: "Display Order", type: "number" },
        { name: "statusCode", label: "Status", type: "select", required: true, options: [{ value: "1", label: "Active (Hiring)" }, { value: "0", label: "Closed (Hidden)" }] },
      ],
    },
  },

  "hiring.applications": {
    title: "Job Applications",
    description: "Resumes and candidate details submitted from the Careers page.",
    permission: "hiring.applications",
    search: "Name, Email, Phone, Title…",
    exportable: true,
    noAdd: true,
    columns: [
      { key: "id", label: "#", type: "number", sortable: true },
      { key: "fullName", label: "Applicant", sortable: true, sub: "email", width: 240 },
      { key: "phone", label: "Phone", type: "mono" },
      { key: "jobTitle", label: "Applied For", sortable: true, sub: "vacancyTitle", width: 240 },
      { key: "experience", label: "Experience / Location", sub: "currentLocation" },
      { key: "resume", label: "Resume", href: "{resumeUrl}" },
      { key: "createdAt", label: "Applied Date", type: "datetime", sortable: true },
      { key: "status", label: "Status", type: "status", sortable: true },
    ],
    filters: [
      { key: "vacancyId", label: "Role / Vacancy", options: [] },
      { key: "status", label: "Status", options: APPLICATION_STATUSES },
    ],
    rowActions: [
      { id: "view", label: "View application", permission: "view", href: "/admin/hiring/applications?view={id}" },
      { id: "edit", label: "Update status", permission: "edit", kind: "form" },
      { ...deleteAction, confirm: { title: "Are you sure want to delete this application?", description: "The uploaded resume file is deleted as well." } },
    ],
    form: {
      title: "Application status",
      fields: [
        { name: "status", label: "Status", type: "select", required: true, options: APPLICATION_STATUSES },
        { name: "adminNotes", label: "Admin Notes", type: "textarea", maxLength: 65535 },
      ],
    },
  },
};

export const routes = {
  "/admin/support/chat-logs": "support.chatLogs",
  "/admin/support/requirements": "support.requirements",
  "/admin/customers/reviews/pending": "customers.pendingReviews",
  "/admin/hiring/vacancies": "hiring.vacancies",
  "/admin/hiring/applications": "hiring.applications",
};

export const live = {
  "support.chatLogs": { path: "/parity/support-admin/chat-logs", page: "chat_logs.php", permission: "support.chatLogs" },
  "support.requirements": { path: "/support-desk/requirements", page: "requirement_requests.php", permission: "support.requirements" },
  "customers.pendingReviews": { path: "/reviews/pending", page: "product_review.php", permission: "customers.pendingReviews" },
  "hiring.vacancies": { path: "/hiring/vacancies", page: "vacancies.php", permission: "hiring.vacancies" },
  "hiring.applications": { path: "/hiring/applications", page: "vacancy_applications.php", permission: "hiring.applications" },
};

export const pages = {
  "users.add": ["add-staff.php"],
  "settings.loginModal": ["signup_modal_settings.php"],
  "settings.scripts": ["script_settings.php"],
};

export const livePaths = [
  "/admin/support/chat-logs",
  "/admin/support/requirements",
  "/admin/customers/reviews/pending",
  "/admin/hiring/vacancies",
  "/admin/hiring/applications",
  "/admin/users/new",
  "/admin/settings/login-modal",
  "/admin/settings/scripts",
];
