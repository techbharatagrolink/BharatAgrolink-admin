"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useQueryState } from "@/components/data-table/use-query-state";
import { cn } from "@/lib/utils";
import { saveZonesAction } from "@/lib/actions/admin/parity/crm";

/** sales_agent_leads.php status buttons ("All" hides Dead / Done / RTO / Return). */
export function AgentStatusFilter({ filters }) {
  const { get, setParams, pending } = useQueryState();
  const active = get("status") || "all";
  return (
    <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Lead status">
      {[{ value: "all", label: "All" }, ...filters].map((f) => (
        <button
          key={f.value}
          type="button"
          disabled={pending}
          aria-pressed={active === f.value}
          onClick={() => setParams({ status: f.value === "all" ? "" : f.value })}
          className={cn(
            "h-8 rounded-full border px-3 text-[13px] font-medium transition-colors",
            active === f.value ? "border-brand-600 bg-brand-600 text-brand-fg" : "border-line-strong bg-surface text-ink-soft hover:bg-surface-muted",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

/** "Select Zone" modal: telecom circles the agent receives auto-assigned leads from. */
export function ZonePicker({ zones, myZones }) {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState(myZones);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!picked.length) return notify({ message: "Select at least one Zone", tone: "error" });
    startTransition(async () => {
      const result = await saveZonesAction(picked);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) {
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <>
      <Button size="sm" variant="primary" onClick={() => (setPicked(myZones), setOpen(true))}>
        <MapPin className="size-4" aria-hidden /> Select Zone
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Select Your Zones"
        description="Select the telecom circles you want to receive leads from."
        size="lg"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={pending}>
              Save Zones
            </Button>
          </>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {zones.map((z) => (
            <Checkbox
              key={z.value}
              label={`${z.label} (${z.value})`}
              checked={picked.includes(z.value)}
              onChange={(e) => setPicked((p) => (e.target.checked ? [...p, z.value] : p.filter((v) => v !== z.value)))}
            />
          ))}
        </div>
      </Dialog>
    </>
  );
}
