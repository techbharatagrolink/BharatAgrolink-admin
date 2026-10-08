"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, Pencil, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import { deleteShopTopicAction, reorderShopTopicsAction } from "@/lib/actions/admin/parity/seller";
import { SortableList } from "./sortable-list";

/** shop_topics.php: drag to reorder the tiles, "Save All Changes", edit and delete. */
export function CropMenuList({ type, label, topics, canEdit, canDelete }) {
  const router = useRouter();
  const { notify } = useToast();
  const [items, setItems] = useState(topics);
  const [toDelete, setToDelete] = useState(null);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const dirty = items.some((t, i) => t.id !== topics[i]?.id);

  const save = () =>
    startSaving(async () => {
      const r = await reorderShopTopicsAction(items.map((t) => t.id));
      notify({ message: r.ok ? "Order saved successfully!" : r.message || "Something went wrong!", tone: r.ok ? "success" : "error" });
      if (r.ok) router.refresh();
    });

  const remove = () =>
    startDeleting(async () => {
      const r = await deleteShopTopicAction(toDelete.id);
      notify({ message: r.ok ? "Deleted successfully!" : r.message || "Failed to delete.", tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setItems((list) => list.filter((t) => t.id !== toDelete.id));
        setToDelete(null);
        router.refresh();
      }
    });

  return (
    <Card>
      <CardHeader
        title={`Manage & Reorder ${label} Tiles`}
        description={`${formatNumber(items.length)} items`}
        actions={
          canEdit && (
            <Button variant="primary" size="sm" onClick={save} loading={saving} disabled={!dirty || !items.length}>
              Save All Changes
            </Button>
          )
        }
      />
      <div className="space-y-3 p-4">
        {canEdit && (
          <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
            <Info className="size-4" aria-hidden /> Drag and drop tiles to change their display order, then save.
          </p>
        )}
        {items.length === 0 ? (
          <EmptyState title="No items found" description='Click "Add New" to create one.' />
        ) : (
          <SortableList
            items={items}
            getKey={(t) => t.id}
            onChange={setItems}
            disabled={!canEdit}
            renderItem={(t) => (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  {t.image ? <Image src={t.image} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 rounded-lg border border-line object-cover" /> : <span className="size-10 shrink-0 rounded-lg bg-neutral-bg" aria-hidden />}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {t.name}
                      {t.nameHi && <span className="ml-1.5 font-normal text-ink-muted">{t.nameHi}</span>}
                    </p>
                    <p className="text-xs text-ink-muted">
                      ({formatNumber(t.productCount)} Products){type === "disease" && ` · ${formatNumber(t.cropCount)} crops`} · /{t.slug}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <ButtonLink size="sm" href={`/admin/catalog/crop-menu?type=${type}&edit=${t.id}`}>
                    <Pencil className="size-3.5" aria-hidden /> {canEdit ? "Edit" : "View"}
                  </ButtonLink>
                  {canDelete && (
                    <Button size="sm" variant="danger" onClick={() => setToDelete(t)}>
                      <Trash2 className="size-3.5" aria-hidden /> Delete
                    </Button>
                  )}
                </div>
              </div>
            )}
          />
        )}
      </div>
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        loading={deleting}
        title="Confirm Deletion"
        description={toDelete ? `Are you sure you want to delete "${toDelete.name}"? This action cannot be undone.` : ""}
        confirmLabel="Yes, Delete"
      />
    </Card>
  );
}
