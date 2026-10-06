import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Admin Controls & Settings</h1>
      </header>

      <Card>
        <CardHeader><CardTitle>Role & Access</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">Manage role based access for Super Admin / GM / Admin / Ops</p>
          <div className="flex flex-wrap gap-2">
            <Input placeholder="Role name" aria-label="Role name" />
            <Button>Add Role</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
        <CardContent>
          <Button>Generate API Key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Data Export</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>Export Orders</Button>
            <Button>Export Finance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
