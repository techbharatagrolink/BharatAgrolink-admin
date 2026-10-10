"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { updateBulkWaybillAction } from "@/lib/actions/admin/parity/bulk";
import { inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { BulkPager } from "./bulk-list";

/** shipments.php grid (newest 1000 orders) with the "Update waybill" modal. */
export function BulkShipmentsTable({ result, query, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [editing, setEditing] = useState(null);
  const [waybill, setWaybill] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await updateBulkWaybillAction(editing.orderId, waybill);
    setSaving(false);
    notify({ message: res.ok ? res.data.message : res.message, tone: res.ok ? "success" : "error" });
    if (res.ok) {
      setEditing(null);
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader title="Shipments" />
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-max text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-xs text-ink-muted">
              {["Order ID", "Waybill", "Customer", "From", "To", "Partner", "Invoice", "Status", "Label", ""].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-ink-muted">
                  No shipments match the filters.
                </td>
              </tr>
            )}
            {result.rows.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2 font-mono text-xs">
                  <Link href={`/admin/bulk-orders/orders/${encodeURIComponent(s.orderId)}`} className="text-brand-700 hover:underline">
                    {s.orderId}
                  </Link>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{s.waybillNo || "—"}</td>
                <td className="px-3 py-2">{s.customerName || "—"}</td>
                <td className="max-w-48 truncate px-3 py-2" title={s.from}>
                  {s.from || "—"}
                </td>
                <td className="max-w-48 truncate px-3 py-2" title={s.to}>
                  {s.to || "—"}
                </td>
                <td className="px-3 py-2">{s.partner || "—"}</td>
                <td className="px-3 py-2 tabular">{inr(s.invoiceValue)}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-3 py-2">
                  {s.labelUrl ? (
                    <a href={s.labelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                      Label <ExternalLink className="size-3" aria-hidden />
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  {canEdit && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Update waybill of ${s.orderId}`}
                      onClick={() => {
                        setWaybill(s.waybillNo ?? "");
                        setEditing(s);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BulkPager result={result} query={query} />
      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Update waybill number"
        description={editing?.orderId}
        footer={
          <>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={saving} disabled={!waybill.trim()}>
              Save
            </Button>
          </>
        }
      >
        <Input aria-label="Waybill number" value={waybill} onChange={(e) => setWaybill(e.target.value)} placeholder="Waybill number" />
      </Dialog>
    </Card>
  );
}
