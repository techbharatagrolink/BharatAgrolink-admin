import Image from "next/image";
import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getResource } from "@/lib/content/admin/resources";
import { getPendingReview } from "@/lib/services/admin/parity/support-admin";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { DescriptionList, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ListScreen, firstParam } from "@/components/admin/parity/support-admin/list-screen";
import { QueryDialog, RecordActions } from "@/components/admin/parity/support-admin/query-dialog";

export const metadata = { title: "Pending Reviews" };

const KEY = "customers.pendingReviews";

export default async function PendingReviewsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission(KEY);
  if (!allowed) {
    return (
      <>
        <PageHeader title="Pending Reviews" />
        <PermissionDenied module="pending reviews" />
      </>
    );
  }

  const view = firstParam(params, "view");
  const detail = view ? await getPendingReview(view, user) : null;
  const review = detail?.data;
  const images = review ? [review.image1, review.image2, review.image3, review.image4].filter(Boolean) : [];
  const actions = getResource(KEY)
    .rowActions.filter((a) => a.effect && can(user, KEY, a.permission))
    .map(({ id, label, tone, confirm }) => ({ id, label, tone, confirm }));

  return (
    <ListScreen resourceKey={KEY} user={user} pathname="/admin/customers/reviews/pending" searchParams={params}>
      {detail && (
        <QueryDialog title="Product Review" footer={review && actions.length ? <RecordActions resourceKey={KEY} id={review.id} actions={actions} /> : null}>
          {review ? (
            <div className="space-y-4">
              <DescriptionList
                items={[
                  { label: "User Name", value: review.customer || "N/A" },
                  { label: "Product", value: review.product },
                  { label: "Rating", value: `${review.rating} / 5` },
                  { label: "Status", value: <StatusBadge status={review.status} /> },
                  { label: "Submitted", value: formatDateTime(review.createdAt) },
                  { label: "Title", value: review.title || "N/A" },
                ]}
              />
              <div>
                <p className="text-xs text-ink-muted">Comment</p>
                <p className="mt-0.5 text-sm whitespace-pre-wrap text-ink">{review.comment || "N/A"}</p>
              </div>
              {images.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs text-ink-muted">Images</p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((src) =>
                      /^https?:\/\//i.test(src) ? (
                        <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border border-line">
                          <Image src={src} alt="Review image" width={120} height={120} unoptimized className="size-28 object-cover" />
                        </a>
                      ) : (
                        <span key={src} className="rounded-lg border border-line px-2 py-1 font-mono text-xs text-ink-muted">
                          {src}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ApiUnavailable error={detail.error} what="this review" />
          )}
        </QueryDialog>
      )}
    </ListScreen>
  );
}
