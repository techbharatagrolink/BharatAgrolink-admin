import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComingSoon({ title, description, backHref, backLabel }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          {backHref && (
            <Button asChild variant="outline">
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
