"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, MapPin } from "lucide-react";
import { addBulkOrderRemarkAction, bulkOrderLabelAction, bulkOrderTrackingAction, updateBulkOrderAgentAction, updateBulkOrderStatusAction } from "@/lib/actions/admin/parity/bulk";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";

const RESPONSIBLE = [
  { value: "", label: "Not set" },
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Operation (admin)" },
  { value: "courier", label: "Courier" },
];
const label = (s) => (s === "rto" ? "RTO" : s.charAt(0).toUpperCase() + s.slice(1));

function useRun() {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(null);
  return {
    busy,
    async run(id, fn, { refresh = true } = {}) {
      setBusy(id);
      const res = await fn();
      setBusy(null);
      if (!res.ok) notify({ message: res.message, tone: "error" });
      else if (res.data?.message) notify({ message: res.data.message, tone: "success" });
      if (res.ok && refresh) router.refresh();
      return res;
    },
  };
}

/** view_order.php side panel: status / sales agent (admins only), remarks, tracking and label. */
export function BulkOrderActions({ order, options, canEdit }) {
  const { busy, run } = useRun();
  const [status, setStatus] = useState(String(order.status ?? "created").toLowerCase());
  const [responsible, setResponsible] = useState(order.responsible ?? "");
  const [agent, setAgent] = useState(order.salesmanId);
  const [remark, setRemark] = useState("");
  const [tracking, setTracking] = useState(null);

  async function track() {
    const res = await run("track", () => bulkOrderTrackingAction(order.orderId), { refresh: false });
    if (res.ok) setTracking(res.data);
  }

  async function openLabel() {
    const res = await run("label", () => bulkOrderLabelAction(order.orderId), { refresh: false });
    if (res.ok && res.data.labelUrl) window.open(res.data.labelUrl, "_blank", "noopener");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Shipment" />
        <CardBody className="flex flex-wrap gap-2">
          <Button size="sm" onClick={track} loading={busy === "track"}>
            <MapPin className="size-4" aria-hidden /> Track
          </Button>
          <Button size="sm" onClick={openLabel} loading={busy === "label"}>
            <FileText className="size-4" aria-hidden /> Label
          </Button>
        </CardBody>
      </Card>

      {canEdit && order.canEditStatus && (
        <Card>
          <CardHeader title="Order status" />
          <CardBody className="space-y-2">
            <Select aria-label="Order status" value={status} onChange={(e) => setStatus(e.target.value)} options={options.statuses.map((s) => ({ value: s, label: label(s) }))} />
            <Select aria-label="Responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)} options={RESPONSIBLE} />
            <Button size="sm" variant="primary" loading={busy === "status"} onClick={() => run("status", () => updateBulkOrderStatusAction(order.orderId, { status, responsible }))}>
              Update status
            </Button>
          </CardBody>
        </Card>
      )}

      {canEdit && order.canEditAgent && (
        <Card>
          <CardHeader title="Sales agent" />
          <CardBody className="space-y-2">
            <Select aria-label="Sales agent" value={agent} onChange={(e) => setAgent(e.target.value)} placeholder="Select agent" options={options.salesAgents} />
            <Button size="sm" variant="primary" disabled={!agent} loading={busy === "agent"} onClick={() => run("agent", () => updateBulkOrderAgentAction(order.orderId, agent))}>
              Save agent
            </Button>
          </CardBody>
        </Card>
      )}

      {canEdit && (
        <Card>
          <CardHeader title="Add remark" />
          <CardBody className="space-y-2">
            <Textarea aria-label="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Remark for the order history" />
            <Select aria-label="Responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)} options={RESPONSIBLE} />
            <Button
              size="sm"
              variant="primary"
              disabled={!remark.trim()}
              loading={busy === "remark"}
              onClick={async () => {
                const res = await run("remark", () => addBulkOrderRemarkAction(order.orderId, { remark, responsible }));
                if (res.ok) setRemark("");
              }}
            >
              Add remark
            </Button>
          </CardBody>
        </Card>
      )}

      <Dialog open={Boolean(tracking)} onClose={() => setTracking(null)} title={`Tracking ${tracking?.waybillNo ?? ""}`} description={tracking?.courierName || tracking?.carrier}>
        {tracking?.message && <p className="mb-2 text-sm text-ink-muted">{tracking.message}</p>}
        {tracking?.status && <p className="mb-3 text-sm font-medium text-ink">Status: {tracking.status}</p>}
        <ol className="max-h-80 space-y-2 overflow-y-auto text-sm">
          {(tracking?.events ?? []).map((e, i) => (
            <li key={i} className="border-l-2 border-line pl-3">
              <div className="font-medium text-ink">{e.status ?? e.activity ?? e.description ?? "Update"}</div>
              <div className="text-xs text-ink-muted">
                {[e.location, e.date ? formatDateTime(e.date) : e.time].filter(Boolean).join(" · ")}
              </div>
            </li>
          ))}
        </ol>
      </Dialog>
    </div>
  );
}
