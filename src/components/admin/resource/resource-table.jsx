"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Select } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { DataTable } from "@/components/data-table/data-table";
import { resourceActionAction, resourceExportAction, resourceSaveAction } from "@/lib/actions/admin/resources";
import { RecordFormDrawer } from "./record-form";

function AssignDialog({ state, onClose, onDone }) {
  const [value, setValue] = useState("");
  const [running, startRunning] = useTransition();
  const { action, ids } = state;
  return (
    <Dialog
      open
      onClose={onClose}
      size="sm"
      title={action.confirm?.title || action.label}
      description={action.confirm?.description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={running}>
            Cancel
          </Button>
          <Button variant="primary" loading={running} disabled={!value} onClick={() => startRunning(() => onDone(value))}>
            Assign {ids.length}
          </Button>
        </>
      }
    >
      <Field label={action.assign.label} required>
        {({ id }) => <Select id={id} value={value} onChange={(e) => setValue(e.target.value)} options={action.assign.options} placeholder="Select…" />}
      </Field>
    </Dialog>
  );
}

/**
 * Client half of a registry resource: wires DataTable to the resource server
 * actions and hosts the add/edit drawer and assign dialog.
 */
export function ResourceTable({ resourceKey, resource, data, canAdd, rowActions, bulkActions, optionSets }) {
  const router = useRouter();
  const { notify } = useToast();
  const [form, setForm] = useState(null);
  const [assign, setAssign] = useState(null);

  const onAction = (actionId, ids, { reason } = {}) => resourceActionAction(resourceKey, actionId, ids, reason ?? "");

  const onCustomAction = (action, ids, rows, clearSelection) => {
    if (action.assign) setAssign({ action, ids, clearSelection });
    else if (action.kind === "form") setForm({ record: rows[0] ?? null, nonce: Date.now() });
  };

  const save = async (values, reason) => {
    const result = await resourceSaveAction(resourceKey, form?.record?.id ?? null, values, reason);
    if (result?.ok) {
      notify({ message: result.message, tone: "success" });
      setForm(null);
      router.refresh();
    }
    return result;
  };

  const runAssign = async (value) => {
    const result = await resourceActionAction(resourceKey, assign?.action?.id, assign?.ids, "", value);
    if (result?.ok) {
      notify({ message: result.message, tone: "success" });
      assign?.clearSelection();
      setAssign(null);
      router.refresh();
    } else notify({ message: result?.message || "Action failed.", tone: "error" });
  };

  const formConfig = resource.form;
  return (
    <>
      <DataTable
        id={resourceKey}
        columns={resource.columns}
        data={data}
        search={resource.searchFields?.length ? resource.search || "Search…" : undefined}
        filters={resource.filters ?? []}
        dateRange={resource.dateRange}
        rowHref={resource.rowHref}
        rowActions={rowActions}
        bulkActions={bulkActions}
        onAction={onAction}
        onCustomAction={onCustomAction}
        onExport={resource.exportable ? (params) => resourceExportAction(resourceKey, params) : undefined}
        exportName={resourceKey.replace(/\./g, "-")}
        toolbar={
          canAdd && formConfig ? (
            <Button size="sm" variant="primary" onClick={() => setForm({ record: null, nonce: Date.now() })}>
              <Plus className="size-4" aria-hidden /> Add
            </Button>
          ) : null
        }
      />
      {form && formConfig && (
        <RecordFormDrawer
          key={form.nonce}
          open
          onClose={() => setForm(null)}
          title={form.record ? `Edit ${formConfig.title || resource.title}` : formConfig.title || `Add to ${resource.title}`}
          description={form.record ? `Record ${form.record.id}` : undefined}
          fields={formConfig.fields}
          record={form.record}
          optionSets={optionSets}
          requireReason={formConfig.requireReason}
          onSubmit={save}
        />
      )}
      {assign && <AssignDialog state={assign} onClose={() => setAssign(null)} onDone={runAssign} />}
    </>
  );
}
