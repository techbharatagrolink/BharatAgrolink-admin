"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, ChevronLeft, ChevronRight, Layers, Plus, Repeat, Sigma, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { StatCard, StatGrid } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/data-table/data-table";
import { useQueryState } from "@/components/data-table/use-query-state";
import { RecordFormDrawer } from "@/components/admin/resource/record-form";
import { fixedExpenseAction, saveFixedExpenseAction } from "@/lib/actions/admin/fixed-expenses";

// fixed_expenses.php category dropdown; categories already in use are added to it.
const PHP_CATEGORIES = [
  { value: "Salary", label: "Salary & Wages" },
  { value: "Recharge", label: "Mobile & Internet Recharge" },
  { value: "Tool Charge", label: "Software & Tool Charge" },
  { value: "Office Rent", label: "Office Rent" },
  { value: "Utilities", label: "Electricity & Utilities" },
  { value: "Software/SaaS", label: "Software / SaaS" },
  { value: "Marketing", label: "Marketing / Ads Ops" },
  { value: "Logistics Ops", label: "Logistics Ops" },
  { value: "Maintenance", label: "Repairs & Maintenance" },
  { value: "General", label: "General Expense" },
  { value: "Office Supply", label: "Office Supply" },
  { value: "tech Software", label: "Tech Software" },
  { value: "Other Office Expense", label: "Other Office Expense" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active (include in monthly expenses & P&L)" },
  { value: "Inactive", label: "Inactive (exclude from calculations)" },
];

const RECURRENCE_OPTIONS = [
  { value: "Recurring", label: "Every month (recurring baseline)" },
  { value: "One month", label: "Specific month only" },
];

const monthName = (ym, style = "long") => new Date(`${ym}-01T00:00:00Z`).toLocaleString("en-IN", { month: style, year: "numeric", timeZone: "UTC" });

const shiftMonth = (ym, by) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

// Same columns as the PHP table; the row menu is its Actions column.
const COLUMNS = [
  { key: "name", label: "Expense Name & Notes", emphasis: true, sub: "detail", wrap: true },
  { key: "category", label: "Category" },
  { key: "scopeLabel", label: "Scope / Applies To", wrap: true },
  { key: "amount", label: "Amount", type: "currency" },
  { key: "status", label: "Status", type: "status" },
];

/** fixed_expenses.php: month view with adjustments, the master recurring baseline, KPI cards and the year strip. */
export function FixedExpensesScreen({ view, canAdd, canEdit, canDelete }) {
  const router = useRouter();
  const { notify } = useToast();
  const { setParams } = useQueryState();
  const [form, setForm] = useState(null);
  const { monthMode, month, currentMonth, kpis, calendar } = view;
  const shortMonth = monthMode ? monthName(month, "short") : "";

  const rows = useMemo(
    () =>
      view.rows.map((row) => ({
        ...row,
        detail: [row.notes, row.adjustmentNotes].filter(Boolean).join(" · "),
        scopeLabel:
          row.kind === "override"
            ? `Override for ${shortMonth} (Base: ${formatINR(row.baseAmount)})`
            : row.kind === "monthly"
              ? `Only ${shortMonth}`
              : monthMode
                ? "Every Month (Recurring)"
                : "Every Month (Recurring Master)",
      })),
    [view.rows, shortMonth, monthMode],
  );

  const categoryOptions = useMemo(() => {
    const known = new Set(PHP_CATEGORIES.map((c) => c.value));
    return [...PHP_CATEGORIES, ...view.categories.filter((c) => !known.has(c)).map((c) => ({ value: c, label: c }))];
  }, [view.categories]);

  const baseFields = [
    { name: "name", label: "Expense name", type: "text", required: true, maxLength: 255 },
    { name: "category", label: "Category", type: "select", options: categoryOptions, required: true, default: "Salary" },
    { name: "amount", label: "Monthly amount (₹)", type: "number", required: true, min: 0 },
    { name: "notes", label: "Notes / purpose", type: "textarea", rows: 2, maxLength: 2000 },
    { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true, default: "Active" },
  ];
  const monthField = (required) => ({ name: "month", label: "Target month", type: "month", required, default: monthMode ? month : currentMonth, hint: required ? "This cost is only deducted in this month's P&L." : "Required for Specific month only." });

  const FORMS = {
    addRecurring: () => ({ title: "Add base recurring expense", description: "Repeats automatically every month.", fields: baseFields, fixed: { recurrence: "Recurring" } }),
    addMonth: () => ({ title: `Add expense for ${monthName(month)}`, description: "For one-time bonuses, seasonal costs and the like.", fields: [monthField(true), ...baseFields], fixed: { recurrence: "One month" } }),
    edit: (row) => ({
      title: row.kind === "override" ? `Edit ${shortMonth} adjustment` : "Edit expense item",
      description: row.kind === "override" ? `${row.name} · base ${formatINR(row.baseAmount)}` : undefined,
      fields: [{ name: "recurrence", label: "Frequency / scope", type: "select", options: RECURRENCE_OPTIONS, required: true }, monthField(false), ...baseFields],
      record: row.form,
      id: row.id,
      fixed: row.kind === "override" ? { overrideParentId: row.parentId } : {},
    }),
    adjust: (row) => ({
      title: `Adjust expense for ${monthName(month)}`,
      description: `${row.name} · base ${formatINR(row.amount)}. Other months keep the base amount.`,
      fields: [
        { name: "amount", label: `Amount for ${shortMonth} (₹)`, type: "number", required: true, min: 0 },
        { name: "notes", label: "Reason / notes for this month", type: "textarea", rows: 2, maxLength: 2000 },
      ],
      record: { amount: row.amount, notes: `Adjusted for ${month}` },
      fixed: { name: row.name, category: row.category, recurrence: "One month", month, status: "Active", overrideParentId: row.id },
    }),
  };

  const open = (kind, row) => setForm({ ...FORMS[kind](row), nonce: Date.now() });

  // `current` is the form the drawer was opened with; a late second submit after it closed is ignored.
  const save = async (current, values, reason) => {
    if (!current) return { ok: true };
    const result = await saveFixedExpenseAction(current.id ?? null, { ...values, ...current.fixed }, reason);
    if (result?.ok) {
      notify({ message: result.message, tone: "success" });
      setForm(null);
      router.refresh();
    }
    return result;
  };

  const rowActions = [
    monthMode && canAdd && { id: "adjust", label: `Adjust for ${shortMonth}`, kind: "form", when: { field: "kind", in: ["recurring"] } },
    canEdit && { id: "edit", label: "Edit", kind: "form" },
    canDelete && {
      id: "revert",
      label: "Revert to base",
      tone: "danger",
      when: { field: "kind", in: ["override"] },
      confirm: { title: `Remove the ${shortMonth} adjustment?`, description: "The base recurring amount applies to this month again." },
    },
    canDelete && {
      id: "delete",
      label: "Delete",
      tone: "danger",
      when: { field: "kind", notIn: ["override"] },
      confirm: { title: "Delete permanently?", description: "A recurring expense's month adjustments are deleted with it. This cannot be undone." },
    },
  ].filter(Boolean);

  const onAction = (actionId, ids) => fixedExpenseAction(actionId === "revert" ? "delete" : actionId, ids, "");
  const onCustomAction = (action, _ids, picked) => open(action.id, picked[0]);

  return (
    <>
      <Card className="mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">Active Period:</span>
          {monthMode ? (
            <>
              <Button size="sm" variant="secondary" onClick={() => setParams({ month: view.prevMonth })} aria-label="Previous month">
                <ChevronLeft className="size-4" aria-hidden /> Prev
              </Button>
              <span className="inline-flex h-8 items-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-brand-fg">{monthName(month)}</span>
              <Button size="sm" variant="secondary" onClick={() => setParams({ month: view.nextMonth })} aria-label="Next month">
                Next <ChevronRight className="size-4" aria-hidden />
              </Button>
              {month !== currentMonth && (
                <Button size="sm" variant="ghost" onClick={() => setParams({ month: "" })}>
                  Current Month
                </Button>
              )}
            </>
          ) : (
            <span className="inline-flex h-8 items-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-brand-fg">All Months (Recurring Master Baseline)</span>
          )}
          {/* PHP "Jump to Month": past 6 months, this month, next 6 months. */}
          <Select
            aria-label="Jump to Month"
            className="w-44"
            value=""
            placeholder="Jump to Month"
            options={Array.from({ length: 13 }, (_, i) => {
              const ym = shiftMonth(currentMonth, i - 6);
              return { value: ym, label: `${i === 6 ? "★ " : ""}${monthName(ym)}` };
            })}
            onChange={(e) => e.target.value && setParams({ month: e.target.value })}
          />
        </div>
        <div className="flex rounded-lg border border-line p-0.5" role="tablist" aria-label="View">
          {[
            { label: "Specific Month View", active: monthMode, month: monthMode ? month : "" },
            { label: "Master Recurring Baseline", active: !monthMode, month: "all" },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={tab.active}
              onClick={() => !tab.active && setParams({ month: tab.month })}
              className={cn("rounded-md px-3 py-1.5 text-[13px] font-medium", tab.active ? "bg-brand-600 text-brand-fg" : "text-ink-muted hover:bg-surface-muted hover:text-ink")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4 p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">{calendar[0]?.month.slice(0, 4)} Annual Fixed Expenses Calendar Overview</p>
          <p className="text-xs text-ink-muted uppercase">Click any month to inspect or customize</p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-12">
          {calendar.map((cal) => {
            const active = monthMode && cal.month === month;
            return (
              <button
                key={cal.month}
                type="button"
                onClick={() => setParams({ month: cal.month })}
                title={`${monthName(cal.month, "short")}: ${formatINR(cal.total)}`}
                className={cn(
                  "relative rounded-lg border px-2 py-1.5 text-center",
                  active ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line bg-surface hover:border-brand-200 hover:bg-surface-muted",
                )}
              >
                {cal.hasCustom && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-warning-ink" aria-label="Has month-specific items" />}
                <span className="block text-[13px] font-semibold">{new Date(`${cal.month}-01T00:00:00Z`).toLocaleString("en-IN", { month: "short", timeZone: "UTC" })}</span>
                <span className={cn("block text-xs tabular", active ? "text-brand-fg" : "text-ink-muted")}>{formatINR(cal.total, { compact: true })}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <StatGrid className="mb-4">
        <StatCard label="Total Fixed Cost" value={formatINR(kpis.total)} hint={monthMode ? `Effective total for ${monthName(month)}` : "Master baseline repeating monthly"} icon={Sigma} />
        <StatCard label="Base Recurring" value={formatINR(kpis.baseRecurring)} hint="Applies to all months automatically" icon={Repeat} tone="info" />
        <StatCard
          label="Month Adjustments"
          value={formatINR(kpis.monthAdjustments)}
          hint={`${kpis.monthItems} custom item(s) in ${monthMode ? shortMonth : "current month"}`}
          icon={SlidersHorizontal}
          tone={kpis.monthAdjustments > 0 ? "warning" : "neutral"}
        />
        <StatCard label="Active Expense Items" value={kpis.activeItems} hint="Deducted from Contribution Margin" icon={Layers} tone="neutral" />
      </StatGrid>

      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{monthMode ? `Effective Fixed Expenses for ${monthName(month)}` : "Master Recurring Fixed Expenses (All Months)"}</h2>
          <p className="text-sm text-ink-muted">Active expenses are included in Dashboard & Finance Net Profit calculation for this period.</p>
        </div>
        {canAdd && (
          <div className="flex flex-wrap gap-2">
            {monthMode && (
              <Button size="sm" variant="secondary" onClick={() => open("addMonth")}>
                <CalendarPlus className="size-4" aria-hidden /> Add {shortMonth} Expense
              </Button>
            )}
            <Button size="sm" variant="primary" onClick={() => open("addRecurring")}>
              <Plus className="size-4" aria-hidden /> Add Base Recurring Expense
            </Button>
          </div>
        )}
      </div>

      <DataTable
        id="finance.fixedExpenses"
        columns={COLUMNS}
        data={{ rows, total: view.total, page: view.page, pageSize: view.pageSize, pageCount: view.pageCount }}
        rowActions={rowActions}
        onAction={onAction}
        onCustomAction={onCustomAction}
        emptyTitle="No fixed expenses found"
        emptyDescription="Click above to add your first expense."
      />
      {/* PHP table footer: the period's effective total under the list. */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface-muted px-4 py-3">
        <span className="text-sm font-bold tracking-wide text-ink-soft uppercase">
          Total Effective Fixed Cost ({monthMode ? monthName(month) : "Monthly Baseline"}):
        </span>
        <span className="text-lg font-bold text-success-ink tabular">{formatINR(kpis.total)}</span>
      </div>

      {form && (
        <RecordFormDrawer
          key={form.nonce}
          open
          onClose={() => setForm(null)}
          title={form.title}
          description={form.description}
          fields={form.fields}
          record={form.record ?? null}
          requireReason
          onSubmit={(values, reason) => save(form, values, reason)}
        />
      )}
    </>
  );
}
