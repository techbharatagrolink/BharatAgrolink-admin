import { checkPermission } from "@/lib/auth/session";
import { getRequirement } from "@/lib/services/admin/parity/support-admin";
import { formatDateTime } from "@/lib/format";
import { DescriptionList, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ListScreen, firstParam } from "@/components/admin/parity/support-admin/list-screen";
import { QueryDialog } from "@/components/admin/parity/support-admin/query-dialog";

export const metadata = { title: "Requirement Requests" };

const block = (value) => <span className="whitespace-pre-wrap">{value || "N/A"}</span>;

export default async function RequirementRequestsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("support.requirements");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Requirement Requests" />
        <PermissionDenied module="requirement requests" />
      </>
    );
  }

  const view = firstParam(params, "view");
  const detail = view ? await getRequirement(view, user) : null;
  const row = detail?.data;

  return (
    <ListScreen resourceKey="support.requirements" user={user} pathname="/admin/support/requirements" searchParams={params}>
      {detail && (
        <QueryDialog title="Requirement Request Details" description={row ? `Request #${row.id}` : undefined}>
          {row ? (
            <DescriptionList
              columns={1}
              items={[
                { label: "Name", value: row.name || "N/A" },
                { label: "Mobile", value: row.mobile || "N/A" },
                { label: "Crop Problem", value: block(row.cropProblem) },
                { label: "Additional Requirement", value: block(row.additionalInfo) },
                { label: "Submitted Date", value: formatDateTime(row.createdAt) },
              ]}
            />
          ) : (
            <ApiUnavailable error={detail.error} what="this request" />
          )}
        </QueryDialog>
      )}
    </ListScreen>
  );
}
