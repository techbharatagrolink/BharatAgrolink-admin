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

  // Fresh items from the server (after a save / refresh) replace the local order.
  const [syncedItems, setSyncedItems] = useState(items);
  if (syncedItems !== items) {
    setSyncedItems(items);
    setOrder(items);
  }

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
            // Phones: picture + two lines (name with type badge, then link). Wider screens: one row as before.
            <div className="flex min-w-0 items-center gap-3">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary/preview URLs, not optimisable by next/image
                <img src={item.image} alt="" className="h-9 w-14 shrink-0 rounded border border-line object-contain sm:order-2 sm:h-10 sm:w-16" />
              ) : (
                <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded border border-dashed border-line text-micro text-ink-muted sm:order-2 sm:h-auto sm:w-16 sm:justify-start sm:border-0 sm:text-xs">Empty</span>
              )}
              <div className="min-w-0 flex-1 overflow-hidden sm:contents">
                <p className="truncate text-sm font-medium text-ink sm:order-1 sm:w-20 sm:shrink-0">Banner {index + 1}</p>
                <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-muted sm:order-3 sm:mt-0 sm:flex-1">
                  <span className="shrink-0 rounded bg-surface-muted px-1.5 text-micro sm:hidden">{item.type}</span>
                  <span className="min-w-0 truncate">{item.link || "No link"}</span>
                </p>
              </div>
              <span className="hidden shrink-0 text-xs text-ink-muted sm:order-4 sm:inline">{item.type}</span>
            </div>
          )}
        />
      </CardBody>
    </Card>
  );
}
