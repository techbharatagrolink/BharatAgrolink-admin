"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { SortableList } from "@/components/admin/parity/seller/sortable-list";
import { resetHeroOrderAction, saveHeroOrderAction } from "@/lib/actions/admin/home-editor";

/** newhomepage_website.php hero slider: drag or arrows, then save. Slots stay top1..top8. */
export function HeroOrder({ items, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [order, setOrder] = useState(items);
  const [busy, setBusy] = useState("");

  useEffect(() => setOrder(items), [items]);

  async function run(key, action) {
    setBusy(key);
    const result = await action();
    setBusy("");
    notify({
      message: result?.ok ? result.data?.message || "Saved." : result?.message || "The banner order could not be saved.",
      tone: result?.ok ? "success" : "error",
    });
    if (result?.ok) router.refresh();
  }

  return (
    <Card className="mb-4">
      <CardHeader
        title="Hero slider order"
        description="Drag a banner, or use the arrows, to change its place in the homepage slider. Desktop 2048×640, mobile 768×556. Upload and delete stay on the banner row."
        actions={
          canEdit ? (
            <>
              <Button size="sm" onClick={() => run("reset", resetHeroOrderAction)} loading={busy === "reset"}>
                Reset to default
              </Button>
              <Button size="sm" variant="primary" onClick={() => run("save", () => saveHeroOrderAction(order.map((item) => item.type)))} loading={busy === "save"}>
                Save banner order
              </Button>
            </>
          ) : null
        }
      />
      <CardBody>
        <SortableList
          items={order}
          getKey={(item) => item.type}
          disabled={!canEdit}
          onChange={setOrder}
          renderItem={(item, index) => (
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-medium text-ink">Banner {index + 1}</span>
              {item.image ? (
                <img src={item.image} alt="" className="h-10 w-16 shrink-0 rounded border border-line object-contain" />
              ) : (
                <span className="w-16 shrink-0 text-xs text-ink-muted">Empty</span>
              )}
              <span className="min-w-0 flex-1 truncate text-xs text-ink-muted">{item.link || "No link"}</span>
              <span className="shrink-0 text-xs text-ink-muted">{item.type}</span>
            </div>
          )}
        />
      </CardBody>
    </Card>
  );
}
