"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { convertBulkAction, convertEngagementAction } from "@/lib/actions/admin/parity/crm";
import { UrlInput } from "./url-input";

const TYPE_LABELS = { cart: "Cart Tracking", viewed: "Recently Viewed" };

const ENGAGEMENT_COLUMNS = [
  { key: "type", label: "Type", type: "status", labels: TYPE_LABELS },
  { key: "userName", label: "User Name", emphasis: true },
  { key: "phone", label: "Phone" },
  { key: "productName", label: "Product Name", wrap: true, width: 280 },
  { key: "date", label: "Date", type: "datetime" },
];

const BULK_COLUMNS = [
  { key: "createdAt", label: "Date", type: "datetime" },
  { key: "name", label: "Customer Name", emphasis: true },
  { key: "phone", label: "Phone" },
  { key: "state", label: "State" },
  { key: "productName", label: "Product Name", sub: "productId", wrap: true, width: 280 },
  { key: "qty", label: "Quantity", type: "number" },
];

const convertConfirm = (one) => ({
  title: "Convert to leads",
  description: one ? `Are you sure you want to convert this ${one} to a lead?` : "Are you sure you want to convert {count} item(s) to leads?",
  confirmLabel: "Convert",
});

/** Cart / recently-viewed activity (newest per phone) not yet converted to an Engagement lead. */
export function EngagementTable({ data, canConvert }) {
  const onAction = (_action, keys) =>
    convertEngagementAction(
      keys.map((key) => {
        const [type, id] = String(key).split(":");
        return { type, id: Number(id) };
      }),
    );
  return (
    <DataTable
      id="crm-engagement"
      rowKey="key"
      columns={ENGAGEMENT_COLUMNS}
      data={data}
      search="Search by name, phone, product..."
      filters={[{ key: "type", label: "Type", options: Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })) }]}
      dateRange="Date"
      rowActions={canConvert ? [{ id: "convert", label: "Convert", confirm: convertConfirm("engagement") }] : []}
      bulkActions={canConvert ? [{ id: "convert", label: "Convert Selected to Leads", confirm: convertConfirm() }] : []}
      onAction={onAction}
      emptyTitle="No engagement data found"
    />
  );
}

/** Bulk inquiries not yet converted; convert with circle auto-assignment or assign an agent explicitly. */
export function BulkInquiryTable({ data, agents, canConvert }) {
  const router = useRouter();
  const { notify } = useToast();
  const [assign, setAssign] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [pending, startTransition] = useTransition();

  const submitAssign = () => {
    if (!agentId) return notify({ message: "Please select an agent", tone: "error" });
    startTransition(async () => {
      const result = await convertBulkAction(assign.ids, agentId);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        assign.clear?.();
        setAssign(null);
        router.refresh();
      }
    });
  };

  return (
    <>
      <DataTable
        id="crm-bulk-inquiry"
        columns={BULK_COLUMNS}
        data={data}
        search="Search by name, phone, product..."
        dateRange="Date"
        toolbar={<UrlInput name="state" label="State" placeholder="Search state" className="h-8 w-40" />}
        rowActions={
          canConvert
            ? [
                { id: "convert", label: "Convert", confirm: convertConfirm("bulk inquiry") },
                { id: "assign", label: "Assign", kind: "form" },
              ]
            : []
        }
        bulkActions={
          canConvert
            ? [
                { id: "convert", label: "Convert to Leads", confirm: convertConfirm() },
                { id: "assign", label: "Assign & Convert", kind: "form" },
              ]
            : []
        }
        onAction={(_action, ids) => convertBulkAction(ids)}
        onCustomAction={(_action, ids, _rows, clear) => (setAgentId(""), setAssign({ ids, clear }))}
        emptyTitle="No bulk inquiries found"
      />
      <Dialog
        open={Boolean(assign)}
        onClose={() => setAssign(null)}
        title="Assign Agent"
        description={assign ? `Convert ${assign.ids.length} item(s) to leads assigned to the chosen agent.` : undefined}
        size="sm"
        footer={
          <>
            <Button onClick={() => setAssign(null)}>Cancel</Button>
            <Button variant="primary" onClick={submitAssign} loading={pending}>
              Assign & Convert
            </Button>
          </>
        }
      >
        <Field label="Select Agent" required>
          {({ id }) => <Select id={id} value={agentId} onChange={(e) => setAgentId(e.target.value)} options={agents} placeholder="Select Agent" />}
        </Field>
      </Dialog>
    </>
  );
}
