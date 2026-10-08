import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getResource } from "@/lib/content/admin/resources";
import { getApplication, getHiringSummary } from "@/lib/services/admin/parity/support-admin";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { DescriptionList, PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ListScreen, firstParam } from "@/components/admin/parity/support-admin/list-screen";
import { QueryDialog, RecordActions } from "@/components/admin/parity/support-admin/query-dialog";

export const metadata = { title: "Job Applications" };

const KEY = "hiring.applications";

const external = (href, label) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium break-all text-brand-700 hover:underline">
      {label ?? href}
    </a>
  ) : (
    "N/A"
  );

export default async function ApplicationsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission(KEY);
  if (!allowed) {
    return (
      <>
        <PageHeader title="Job Applications" />
        <PermissionDenied module="job applications" />
      </>
    );
  }

  const view = firstParam(params, "view");
  const [{ data: summary }, detail] = await Promise.all([getHiringSummary(user), view ? getApplication(view, user) : null]);
  const resource = getResource(KEY);
  const filters = resource.filters.map((f) => (f.key === "vacancyId" ? { ...f, options: (summary?.vacancies ?? []).map((v) => ({ value: String(v.id), label: v.title })) } : f));
  const app = detail?.data;
  const deleteAction = resource.rowActions.find((a) => a.id === "delete");

  return (
    <ListScreen
      resourceKey={KEY}
      user={user}
      pathname="/admin/hiring/applications"
      searchParams={params}
      filters={filters}
      actions={
        <>
          {can(user, "hiring.vacancies") && (
            <ButtonLink href="/admin/hiring/vacancies" size="sm" variant="secondary">
              Manage Vacancies
            </ButtonLink>
          )}
          {summary?.careersUrl && (
            <ButtonLink href={summary.careersUrl} target="_blank" rel="noopener noreferrer" size="sm" variant="primary">
              Careers Page
            </ButtonLink>
          )}
        </>
      }
    >
      {detail && (
        <QueryDialog
          title="Application Details"
          description={app ? `#${app.id} · applied ${formatDateTime(app.createdAt)}` : undefined}
          footer={app && can(user, KEY, "delete") ? <RecordActions resourceKey={KEY} id={app.id} actions={[{ id: deleteAction.id, label: deleteAction.label, tone: deleteAction.tone, confirm: deleteAction.confirm }]} /> : null}
        >
          {app ? (
            <div className="space-y-4">
              <DescriptionList
                items={[
                  { label: "Full Name", value: app.fullName },
                  { label: "Status", value: <StatusBadge status={app.status} /> },
                  { label: "Email", value: external(`mailto:${app.email}`, app.email) },
                  { label: "Phone", value: external(`tel:${app.phone}`, app.phone) },
                  { label: "Applied For", value: app.jobTitle },
                  { label: "Vacancy", value: app.vacancyTitle ? `${app.vacancyTitle}${app.vacancyDepartment ? ` (${app.vacancyDepartment})` : ""}` : "Not linked / removed" },
                  { label: "Experience", value: app.experience || "N/A" },
                  { label: "Current Location", value: app.currentLocation || "N/A" },
                  { label: "Resume", value: external(app.resumeUrl, "Download resume") },
                  { label: "Portfolio / LinkedIn", value: /^https?:\/\//i.test(app.portfolioUrl) ? external(app.portfolioUrl) : app.portfolioUrl || "N/A" },
                ]}
              />
              <div>
                <p className="text-xs text-ink-muted">Cover Message</p>
                <p className="mt-0.5 text-sm whitespace-pre-wrap text-ink">{app.message || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Admin Notes</p>
                <p className="mt-0.5 text-sm whitespace-pre-wrap text-ink">{app.adminNotes || "N/A"}</p>
              </div>
              {can(user, KEY, "edit") && <p className="text-xs text-ink-muted">Use “Update status” in the row menu to change the status or admin notes.</p>}
            </div>
          ) : (
            <ApiUnavailable error={detail.error} what="this application" />
          )}
        </QueryDialog>
      )}
    </ListScreen>
  );
}
