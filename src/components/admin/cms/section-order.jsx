"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { SortableList } from "@/components/admin/parity/seller/sortable-list";
import { resetSectionOrderAction, saveSectionOrderAction } from "@/lib/actions/admin/home-editor";

/** Homepage section order: same drag handle and arrows as the hero slider. */
export function SectionOrder({ items, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [order, setOrder] = useState(items);
  const [seen, setSeen] = useState(items);
  const [busy, setBusy] = useState("");

  if (seen !== items) {
    setSeen(items);
    setOrder(items);
  }

  async function run(key, action) {
    setBusy(key);
    const result = await action();
    setBusy("");
    notify({
      message: result?.ok ? result.data?.message || "Saved." : result?.message || "The section order could not be saved.",
      tone: result?.ok ? "success" : "error",
    });
    if (result?.ok) router.refresh();
  }

  return (
    <Card className="mb-4">
      <CardHeader
        title="Section order"
        description="Drag a section, or use the arrows, to change its place on the homepage. Titles and products stay in the list below."
        actions={
          canEdit ? (
            <>
              <Button size="sm" onClick={() => run("reset", resetSectionOrderAction)} loading={busy === "reset"}>
                Reset to default
              </Button>
              <Button size="sm" variant="primary" onClick={() => run("save", () => saveSectionOrderAction(order.map((item) => item.key)))} loading={busy === "save"}>
                Save section order
              </Button>
            </>
          ) : null
        }
      />
      <CardBody>
        <SortableList
          items={order}
          getKey={(item) => item.key}
          disabled={!canEdit}
          onChange={setOrder}
          renderItem={(item, index) => (
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-24 shrink-0 whitespace-nowrap text-sm font-medium text-ink">Section {index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.title || item.catalogLabel || item.label}</span>
              <span className="hidden max-w-36 truncate text-xs text-ink-muted sm:inline-block">{item.key}</span>
            </div>
          )}
        />
      </CardBody>
    </Card>
  );
}
