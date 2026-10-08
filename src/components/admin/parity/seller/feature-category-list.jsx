"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import { deleteFeatureCategoryAction, reorderFeatureCategoriesAction } from "@/lib/actions/admin/parity/seller";
import { SortableList } from "./sortable-list";

/** feature_category.php: drag to reorder, "Save All Changes", edit and delete. */
export function FeatureCategoryList({ categories, canEdit, canDelete }) {
  const router = useRouter();
  const { notify } = useToast();
  const [items, setItems] = useState(categories);
  const [toDelete, setToDelete] = useState(null);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const dirty = items.some((c, i) => c.id !== categories[i]?.id);

  const save = () =>
    startSaving(async () => {
      const r = await reorderFeatureCategoriesAction(items.map((c) => c.id));
      notify({ message: r.ok ? "Category order saved successfully!" : r.message || "Something went wrong!", tone: r.ok ? "success" : "error" });
      if (r.ok) router.refresh();
    });

  const remove = () =>
    startDeleting(async () => {
      const r = await deleteFeatureCategoryAction(toDelete.id);
      notify({ message: r.ok ? "Category Deleted successfully!" : r.message || "Failed to Delete.", tone: r.ok ? "success" : "error" });
      if (r.ok) {
        setItems((list) => list.filter((c) => c.id !== toDelete.id));
        setToDelete(null);
        router.refresh();
      }
    });

  return (
    <Card>
      <CardHeader
        title="Manage & Reorder Categories"
        description={`${formatNumber(items.length)} categories`}
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
            <Info className="size-4" aria-hidden /> Drag and drop categories to change their display order, then save.
          </p>
        )}
        {items.length === 0 ? (
          <EmptyState title="No categories found" />
        ) : (
          <SortableList
            items={items}
            getKey={(c) => c.id}
            onChange={setItems}
            disabled={!canEdit}
            renderItem={(c) => (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  {c.image ? <Image src={c.image} alt="" width={36} height={36} unoptimized className="size-9 shrink-0 rounded-md border border-line object-cover" /> : <span className="size-9 shrink-0 rounded-md bg-neutral-bg" aria-hidden />}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-ink-muted">
                      ({formatNumber(c.productCount)} Products) · /{c.slug}
                    </p>
                  </div>
                  <Badge tone={c.type === "Simple" ? "neutral" : "info"}>{c.type}</Badge>
                </div>
                <div className="flex gap-1.5">
                  <ButtonLink size="sm" href={`/admin/catalog/feature-categories?edit=${c.id}`}>
                    <Pencil className="size-3.5" aria-hidden /> {canEdit ? "Edit" : "View"}
                  </ButtonLink>
                  {canDelete && (
                    <Button size="sm" variant="danger" onClick={() => setToDelete(c)}>
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
        description={toDelete ? `Are you sure you want to delete the category "${toDelete.name}"? This action cannot be undone.` : ""}
        confirmLabel="Yes, Delete"
      />
    </Card>
  );
}
