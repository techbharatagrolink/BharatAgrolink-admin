import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getHiringSummary } from "@/lib/services/admin/parity/support-admin";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page";
import { PermissionDenied } from "@/components/ui/states";
import { ListScreen } from "@/components/admin/parity/support-admin/list-screen";

export const metadata = { title: "Hiring Vacancies" };

export default async function VacanciesPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("hiring.vacancies");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Hiring Vacancies" />
        <PermissionDenied module="hiring vacancies" />
      </>
    );
  }

  const { data: summary } = await getHiringSummary(user);

  return (
    <ListScreen
      resourceKey="hiring.vacancies"
      user={user}
      pathname="/admin/hiring/vacancies"
      searchParams={params}
      viewable={false}
      actions={
        <>
          {can(user, "hiring.applications") && (
            <ButtonLink href="/admin/hiring/applications" size="sm" variant="secondary">
              Applications{summary ? ` (${summary.totalApplications})` : ""}
            </ButtonLink>
          )}
          {summary?.careersUrl && (
            <ButtonLink href={summary.careersUrl} target="_blank" rel="noopener noreferrer" size="sm" variant="secondary">
              View Live Page
            </ButtonLink>
          )}
        </>
      }
    />
  );
}
