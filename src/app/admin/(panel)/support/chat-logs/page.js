import { checkPermission } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { getChatConversation } from "@/lib/services/admin/parity/support-admin";
import { PageHeader } from "@/components/ui/page";
import { ApiUnavailable, PermissionDenied } from "@/components/ui/states";
import { ListScreen, firstParam } from "@/components/admin/parity/support-admin/list-screen";
import { QueryDialog } from "@/components/admin/parity/support-admin/query-dialog";
import { ChatConversation } from "@/components/admin/parity/support-admin/chat-conversation";

export const metadata = { title: "Chatbot Logs" };

export default async function ChatLogsPage({ searchParams }) {
  const params = await searchParams;
  const { user, allowed } = await checkPermission("support.chatLogs");
  if (!allowed) {
    return (
      <>
        <PageHeader title="Chatbot Logs" />
        <PermissionDenied module="chatbot logs" />
      </>
    );
  }

  const view = firstParam(params, "view");
  const detail = view ? await getChatConversation(view, user) : null;

  return (
    <ListScreen resourceKey="support.chatLogs" user={user} pathname="/admin/support/chat-logs" searchParams={params}>
      {detail?.data ? (
        <ChatConversation key={view} conversation={detail.data} canEdit={can(user, "support.chatLogs", "edit")} />
      ) : detail?.error ? (
        <QueryDialog title="Conversation Details">
          <ApiUnavailable error={detail.error} what="this conversation" />
        </QueryDialog>
      ) : null}
    </ListScreen>
  );
}
