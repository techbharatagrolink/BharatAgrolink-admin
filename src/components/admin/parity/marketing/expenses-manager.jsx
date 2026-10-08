"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Gauge, Lock, Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteMarketingExpenseAction, saveMarketingExpenseAction } from "@/lib/actions/admin/parity/marketing";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { rupees } from "./format";

const EMPTY = { bucket: "", amount: "", spendDate: "", campaignName: "", vendorName: "", invoiceNumber: "", notes: "" };

function monthBounds(month) {
  const [y, m] = month.split("-").map(Number);
  return { min: `${month}-01`, max: `${month}-${String(new Date(y, m, 0).getDate()).padStart(2, "0")}` };
}

/** marketing_expenses.php: month picker, totals by category (coupon spend computed), entries with add / edit / remove. */
export function ExpensesManager({ data, can }) {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);
  const { month, buckets, totals, rows, pagination } = data;
  const bounds = monthBounds(month);

  function go(params) {
    const sp = new URLSearchParams({ month, ...params });
    router.push(`${pathname}?${sp.toString()}`);
  }

  function open(row) {
    setForm(row ? { bucket: row.bucket, amount: String(row.amount), spendDate: row.spendDate || "", campaignName: row.campaignName || "", vendorName: row.vendorName || "", invoiceNumber: row.invoiceNumber || "", notes: row.notes || "" } : EMPTY);
    setEditing(row ? row.id : "new");
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    if (!form.bucket) return notify({ title: "Category required", message: "Choose which kind of marketing spend this is.", tone: "error" });
    if (!(Number(form.amount) > 0)) return notify({ title: "Amount required", message: "Enter an amount greater than zero.", tone: "error" });
    setSaving(true);
    const result = await saveMarketingExpenseAction(editing === "new" ? null : editing, { ...form, month, amount: Number(form.amount) });
    setSaving(false);
    if (!result.ok) return notify({ title: "Could not save", message: result.message, tone: "error" });
    notify({ title: "Saved", message: result.data?.message ?? "Entry saved.", tone: "success" });
    setEditing(null);
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    const result = await deleteMarketingExpenseAction(removing);
    setBusy(false);
    setRemoving(null);
    if (!result.ok) return notify({ title: "Could not remove", message: result.message, tone: "error" });
    notify({ title: "Removed", message: result.data?.message ?? "Entry removed.", tone: "success" });
    router.refresh();
  }

  const cards = totals.buckets.filter((b) => b.amount > 0 || b.auto);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <Input type="month" aria-label="Month" value={month} onChange={(e) => e.target.value && go({ month: e.target.value })} className="h-8 w-44" />
        <ButtonLink href={`/admin/finance/expense-limits?month=${encodeURIComponent(month)}`} size="sm" variant="outline">
          <Gauge className="size-4" aria-hidden />
          Limit Dashboard
        </ButtonLink>
        {can.add && (
          <Button size="sm" variant="primary" onClick={() => open(null)}>
            <Plus className="size-4" aria-hidden />
            Add spend
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title={<span className="inline-flex items-center gap-2"><Megaphone className="size-4" aria-hidden />Total marketing cost</span>} actions={<span className="text-xs text-ink-muted">{month}</span>} />
        <div className="space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((b) => (
              <div key={b.bucket} className={cn("rounded-lg border border-line px-3.5 py-3", b.auto && "border-dashed bg-surface-muted")}>
                <p className="text-[11px] font-bold tracking-wide text-ink-muted uppercase">
                  {b.label}
                  {b.auto && <Lock className="ml-1 inline size-3" aria-label="calculated automatically" />}
                </p>
                <p className="mt-1 text-lg font-extrabold text-ink tabular">{rupees(b.amount)}</p>
              </div>
            ))}
            <div className="rounded-lg border border-[#10a450] px-3.5 py-3">
              <p className="text-[11px] font-bold tracking-wide text-ink-muted uppercase">Total marketing cost</p>
              <p className="mt-1 text-lg font-extrabold text-[#10a450] tabular">{rupees(totals.total)}</p>
            </div>
          </div>
          <p className="rounded-lg border border-dashed border-line bg-surface-muted px-3.5 py-2.5 text-[12.5px] text-ink-muted">
            <Lock className="mr-1 inline size-3.5" aria-hidden />
            <strong>Coupon / discount funded by Bharat Agrolink</strong> is calculated automatically from delivered, non-returned orders that used a company coupon. It cannot be entered by hand, so it is never double-counted.
          </p>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Entries" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Marketing spend entries for {month}</caption>
            <thead className="border-b border-line text-left text-[11px] font-bold tracking-wide text-ink-muted uppercase">
              <tr>
                <th scope="col" className="w-28 px-3 py-2">Date</th>
                <th scope="col" className="px-3 py-2">Category</th>
                <th scope="col" className="px-3 py-2">Campaign / Vendor</th>
                <th scope="col" className="px-3 py-2">Invoice</th>
                <th scope="col" className="w-36 px-3 py-2 text-right">Amount</th>
                <th scope="col" className="w-24 px-3 py-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const who = [r.campaignName, r.vendorName].filter(Boolean).join(" · ");
                return (
                  <tr key={r.id}>
                    <td className="px-3 py-2 whitespace-nowrap">{r.spendDate || "—"}</td>
                    <td className="px-3 py-2">{r.bucketLabel}</td>
                    <td className="px-3 py-2">{who || <span className="text-ink-muted">—</span>}</td>
                    <td className="px-3 py-2">{r.invoiceNumber || <span className="text-ink-muted">—</span>}</td>
                    <td className="px-3 py-2 text-right tabular">{rupees(r.amount)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {can.edit && (
                        <Button size="icon-sm" variant="ghost" onClick={() => open(r)} aria-label="Edit" title="Edit">
                          <Pencil className="size-4" aria-hidden />
                        </Button>
                      )}
                      {can.delete && (
                        <Button size="icon-sm" variant="ghost" className="text-danger-ink" onClick={() => setRemoving(r.id)} aria-label="Remove" title="Remove">
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-ink-muted">
                    No marketing spend recorded for this month yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-xs text-ink-muted">
            <span>
              Page {pagination.page} of {pagination.pages} · {pagination.total} entries
            </span>
            <div className="flex gap-1">
              <Button size="xs" variant="ghost" disabled={pagination.page <= 1} onClick={() => go({ page: pagination.page - 1 })}>Previous</Button>
              <Button size="xs" variant="ghost" disabled={pagination.page >= pagination.pages} onClick={() => go({ page: pagination.page + 1 })}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog
        open={editing != null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add marketing spend" : "Edit marketing spend"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button variant="primary" type="submit" form="marketing-expense-form" loading={saving}>Save</Button>
          </>
        }
      >
        <form id="marketing-expense-form" onSubmit={save} className="grid grid-cols-2 gap-3">
          <Field label="Category" required className="col-span-2">
            {({ id }) => <Select id={id} value={form.bucket} onChange={set("bucket")} placeholder="— choose —" options={buckets} />}
          </Field>
          <Field label="Amount (₹)" required>
            {({ id }) => <Input id={id} type="number" step="0.01" min="0.01" value={form.amount} onChange={set("amount")} />}
          </Field>
          <Field label="Spend date" hint="Must fall inside the selected month.">
            {({ id, describedBy }) => <Input id={id} type="date" min={bounds.min} max={bounds.max} value={form.spendDate} onChange={set("spendDate")} aria-describedby={describedBy} />}
          </Field>
          <Field label="Campaign">{({ id }) => <Input id={id} maxLength={255} value={form.campaignName} onChange={set("campaignName")} />}</Field>
          <Field label="Vendor / agency">{({ id }) => <Input id={id} maxLength={255} value={form.vendorName} onChange={set("vendorName")} />}</Field>
          <Field label="Invoice number" className="col-span-2">{({ id }) => <Input id={id} maxLength={100} value={form.invoiceNumber} onChange={set("invoiceNumber")} />}</Field>
          <Field label="Notes" className="col-span-2">{({ id }) => <Textarea id={id} rows={2} value={form.notes} onChange={set("notes")} />}</Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={removing != null}
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        loading={busy}
        title="Remove this entry?"
        description="It stops counting towards the marketing limit."
        confirmLabel="Remove"
      />
    </>
  );
}
