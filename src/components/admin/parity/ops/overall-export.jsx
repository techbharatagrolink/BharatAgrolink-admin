"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { exportAllAgentsAction, exportOverallAction } from "@/lib/actions/admin/parity/ops";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { downloadText } from "./delivered-config";

/** Export CSV / Export All Agents CSV of operations_team/overall_report.php for the loaded date range. */
export function OverallExport({ from, to }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState("");

  async function run(kind, action) {
    setBusy(kind);
    const result = await action({ from, to });
    setBusy("");
    if (!result.ok) return notify({ message: result.message, tone: "error" });
    downloadText(result.data.filename, result.data.csv);
  }

  return (
    <>
      <Button onClick={() => run("overall", exportOverallAction)} loading={busy === "overall"} disabled={Boolean(busy)}>
        <Download className="size-4" aria-hidden /> Export CSV
      </Button>
      <Button onClick={() => run("agents", exportAllAgentsAction)} loading={busy === "agents"} disabled={Boolean(busy)}>
        <Download className="size-4" aria-hidden /> Export All Agents CSV
      </Button>
    </>
  );
}
