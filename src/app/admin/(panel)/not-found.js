import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";

export default function PanelNotFound() {
  return (
    <div className="rounded-xl border border-line bg-surface">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="This page does not exist or the record was removed."
        action={<ButtonLink href="/admin/dashboard">Go to dashboard</ButtonLink>}
      />
    </div>
  );
}
