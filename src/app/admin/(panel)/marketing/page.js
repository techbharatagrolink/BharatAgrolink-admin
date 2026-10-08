import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getCalendarEvents, getLatestTrendReport, getLatestVideoScript, getTrendReportHistory, getVideoScriptHistory } from "@/lib/services/admin/parity/marketing";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { SocialDashboard } from "@/components/admin/parity/marketing/social-dashboard";

export const metadata = { title: "Social Media Dashboard" };

/** social_media_dashboard.php */
export default async function SocialMediaDashboardPage() {
  const { user, allowed } = await checkPermission("marketing");
  if (!allowed) return (<><PageHeader title="Social Media Dashboard" /><PermissionDenied module="the social media dashboard" /></>);
  const result = await Promise.all([getLatestTrendReport(user), getTrendReportHistory(user), getLatestVideoScript(user), getVideoScriptHistory(user), getCalendarEvents(user)]).then(
    ([latestReport, reports, latestScript, scripts, events]) => ({ data: { latestReport, reports, latestScript, scripts, events } }),
    (error) => ({ error }),
  );
  if (result.error) return (<><PageHeader title="Social Media Dashboard" /><ApiUnavailable error={result.error} what="the social media dashboard" /></>);
  const { events, ...initial } = result.data;

  return (
    <>
      <PageHeader title="Social Media Dashboard" description="AI trend reports, the content calendar and video scripts." meta={<span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-brand-700">AGRI-INTELLIGENCE</span>} />
      <SocialDashboard initial={initial} events={events} can={{ add: can(user, "marketing", "add"), edit: can(user, "marketing", "edit"), delete: can(user, "marketing", "delete") }} />
    </>
  );
}
