import { PageHeader, Notice } from "@/components/ui/page";
import { ButtonLink } from "@/components/ui/button";

/** Shown when a label or tracking link cannot be resolved; the happy path redirects to the courier. */
export function LinkFailed({ title, message, backHref, backLabel }) {
  return (
    <>
      <PageHeader title={title} actions={<ButtonLink href={backHref}>{backLabel}</ButtonLink>} />
      <Notice tone="danger">{message}</Notice>
    </>
  );
}
