"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { useToast } from "@/components/ui/toast";
import { CustomerReportDialog, LeadActionDialog, LeadReportsDialog, LeadTimelineDialog } from "./lead-dialogs";

const VIEW_ACTIONS = [
  { id: "customer", label: "Customer report", kind: "form" },
  { id: "reports", label: "View reports", kind: "form" },
  { id: "timeline", label: "View history", kind: "form" },
  { id: "copyName", label: "Copy lead name", kind: "form" },
  { id: "copyMobile", label: "Copy mobile number", kind: "form" },
];

/* Row and bulk buttons of each PHP lead page (beyond the shared view actions). */
const SCOPE_BUTTONS = {
  agent: { row: [{ id: "update", label: "Update", kind: "form" }], bulk: [{ id: "update", label: "Bulk Update", kind: "form" }] },
  unassigned: { row: [{ id: "manage", label: "Manage", kind: "form" }], bulk: [{ id: "manage", label: "Bulk Action", kind: "form" }] },
  dead: {
    row: [
      { id: "reassign", label: "Reassign", kind: "form" },
      { id: "ask_report", label: "Report", kind: "form", tone: "danger" },
    ],
    bulk: [
      { id: "reassign", label: "Reassign", kind: "form" },
      { id: "ask_report", label: "Ask Report", kind: "form" },
    ],
  },
  requested: { row: [], bulk: [{ id: "manage", label: "Bulk Action", kind: "form" }] },
};

/**
 * Lead list of the PHP lead pages: server-paginated table with the update /
 * manage modal, reports, timeline, customer report and copy buttons.
 */
export function LeadTable({ id, scope, permission, columns, data, agents = [], canEdit, filters = [], dateRange, search, toolbar, emptyTitle }) {
  const { notify } = useToast();
  const [dialog, setDialog] = useState(null);
  const buttons = canEdit ? SCOPE_BUTTONS[scope] : { row: [], bulk: [] };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text ?? ""));
      notify({ message: "Copied to clipboard!", tone: "success" });
    } catch {
      notify({ message: "Failed to copy to clipboard", tone: "error" });
    }
  };

  const onCustomAction = (action, ids, rows, clear) => {
    const row = rows[0];
    switch (action.id) {
      case "customer":
        return setDialog({ type: "customer", mobile: row.mobile });
      case "reports":
        return setDialog({ type: "reports", leadId: row.id });
      case "timeline":
        return setDialog({ type: "timeline", leadId: row.id });
      case "copyName":
        return copy(row.name);
      case "copyMobile":
        return copy(row.mobile);
      default:
        return setDialog({ type: "action", ids, bulk: ids.length > 1 || rows.length !== 1 || action.label.startsWith("Bulk"), preset: scope === "dead" ? action.id : undefined, clear });
    }
  };

  return (
    <>
      <DataTable
        id={id}
        columns={columns}
        data={data}
        search={search}
        filters={filters}
        dateRange={dateRange}
        rowActions={[...buttons.row, ...VIEW_ACTIONS]}
        bulkActions={buttons.bulk}
        onCustomAction={onCustomAction}
        toolbar={toolbar}
        emptyTitle={emptyTitle}
      />
      {dialog?.type === "action" && (
        <LeadActionDialog scope={scope} target={{ ids: dialog.ids, bulk: dialog.bulk, preset: dialog.preset }} agents={agents} onClose={() => setDialog(null)} onDone={dialog.clear} />
      )}
      {dialog?.type === "reports" && <LeadReportsDialog permission={permission} leadId={dialog.leadId} onClose={() => setDialog(null)} />}
      {dialog?.type === "timeline" && <LeadTimelineDialog permission={permission} leadId={dialog.leadId} onClose={() => setDialog(null)} />}
      {dialog?.type === "customer" && <CustomerReportDialog permission={permission} mobile={dialog.mobile} onClose={() => setDialog(null)} />}
    </>
  );
}
