"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bot, User, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Switch, Textarea } from "@/components/ui/form";
import { DescriptionList } from "@/components/ui/page";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/format";
import { saveChatReviewAction } from "@/lib/actions/admin/parity/support-admin";
import { ChatMarkdown } from "./chat-markdown";
import { QueryDialog } from "./query-dialog";

function Bubble({ who, intent, at, text, onImage }) {
  const user = who === "user";
  return (
    <div className={user ? "rounded-xl border border-line bg-surface-muted p-3" : "rounded-xl border border-brand-100 bg-brand-50/50 p-3"}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
          {user ? <User className="size-3.5" aria-hidden /> : <Bot className="size-3.5" aria-hidden />}
          {user ? "User" : "Assistant"}
          {intent ? <Badge tone="info">{intent}</Badge> : null}
        </span>
        <span>{formatDateTime(at)}</span>
      </div>
      <div className="text-sm text-ink">
        <ChatMarkdown text={text} onImage={onImage} />
      </div>
    </div>
  );
}

/** chat_logs.php conversation modal: session info, review (Conversation + feedback) and messages, newest first. */
export function ChatConversation({ conversation, canEdit }) {
  const router = useRouter();
  const { notify } = useToast();
  const [active, setActive] = useState(conversation.conversation);
  const [feedback, setFeedback] = useState(conversation.feedback ?? "");
  const [image, setImage] = useState(null);
  const [saving, startSaving] = useTransition();

  const save = () =>
    startSaving(async () => {
      const result = await saveChatReviewAction(conversation.sessionId, active, feedback);
      notify({ message: result.message, tone: result.ok ? "success" : "error" });
      if (result.ok) router.refresh();
    });

  return (
    <QueryDialog title="Conversation Details" size="xl">
      <div className="space-y-4">
        <DescriptionList
          columns={3}
          items={[
            { label: "Session ID", value: <span className="font-mono text-[12.5px]">{conversation.sessionId}</span> },
            { label: "Region", value: conversation.region || "N/A" },
            { label: "Total Messages", value: conversation.total },
            { label: "Session Started", value: formatDateTime(conversation.startedAt) },
          ]}
        />
        <div className="space-y-3 rounded-xl border border-line p-3.5">
          <p className="text-sm font-semibold text-ink">Conversation Review</p>
          <Switch checked={active} onChange={setActive} disabled={!canEdit || saving} label={`Conversation: ${active ? "Yes" : "No"}`} />
          <Field label="Feedback">
            {({ id }) => <Textarea id={id} rows={3} value={feedback} disabled={!canEdit || saving} maxLength={65535} onChange={(e) => setFeedback(e.target.value)} placeholder="Add your feedback / notes about this conversation..." />}
          </Field>
          {canEdit && (
            <div className="flex justify-end">
              <Button variant="primary" size="sm" loading={saving} onClick={save}>
                Save
              </Button>
            </div>
          )}
        </div>
        {conversation.messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">This session has no conversation history.</p>
        ) : (
          <div className="space-y-4">
            {conversation.messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <Bubble who="user" at={m.createdAt} text={m.userMessage} onImage={setImage} />
                <Bubble who="assistant" intent={m.intent} at={m.createdAt} text={m.assistantReply} onImage={setImage} />
              </div>
            ))}
          </div>
        )}
      </div>
      {image && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" onClick={() => setImage(null)} role="presentation">
          <button type="button" className="absolute top-4 right-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25" onClick={() => setImage(null)} aria-label="Close image">
            <X className="size-5" />
          </button>
          <Image src={image} alt="Expanded image" width={1200} height={900} unoptimized className="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-lg object-contain" />
        </div>
      )}
    </QueryDialog>
  );
}
