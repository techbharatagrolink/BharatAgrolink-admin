"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { MiniTable } from "@/components/admin/dashboard/range-switch";
import { RecordFormDrawer } from "@/components/admin/resource/record-form";
import { resourceSaveAction } from "@/lib/actions/admin/resources";

const KEY = "operations.agentMaster";

/**
 * "1) Agent Master" of operations_team/setup.php: the agent list with Add
 * (pick an operations admin) and Edit (Active / Inactive), saved through the
 * operations.agentMaster resource.
 */
export function AgentMaster({ rows, unavailable, fields, optionSets, canAdd, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(null);

  const save = async (values, reason) => {
    const result = await resourceSaveAction(KEY, form?.record?.id ?? null, values, reason);
    if (result?.ok) {
      notify({ message: result.message, tone: "success" });
      setForm(null);
      router.refresh();
    }
    return result;
  };

  const columns = [
    { key: "name", label: "Agent", render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: "role", label: "Role" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  if (canEdit) {
    columns.push({
      key: "edit",
      label: "",
      align: "right",
      render: (r) => (
        <button type="button" onClick={() => setForm({ record: r, nonce: Date.now() })} className="text-[13px] font-medium text-brand-700 hover:underline">
          Edit
        </button>
      ),
    });
  }

  return (
    <Card className="mb-4">
      <CardHeader
        title="Agent master"
        description="Operations agents (role IDs 32, 57, 66)"
        actions={
          canAdd ? (
            <Button size="sm" variant="primary" onClick={() => setForm({ record: null, nonce: Date.now() })}>
              <Plus className="size-4" aria-hidden /> Add
            </Button>
          ) : null
        }
      />
      {unavailable ? <Notice tone="warning" className="m-4">{unavailable}</Notice> : <MiniTable columns={columns} rows={rows} empty="No agents added yet." />}
      {form && (
        <RecordFormDrawer
          key={form.nonce}
          open
          onClose={() => setForm(null)}
          title={form.record ? "Edit agent" : "Add agent"}
          description={form.record ? [form.record.name, form.record.role].filter(Boolean).join(" · ") : undefined}
          fields={fields}
          record={form.record}
          optionSets={optionSets}
          onSubmit={save}
        />
      )}
    </Card>
  );
}
