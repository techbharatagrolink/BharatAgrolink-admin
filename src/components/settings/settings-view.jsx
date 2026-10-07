"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourceTable } from "@/components/resource-table";
import { useApi, useAuth } from "@/components/auth-provider";
import { apiDownload } from "@/lib/api";
import { errorMessage, formatWhen } from "@/lib/format";

export function SettingsView() {
  const request = useApi();
  const { session } = useAuth();
  const [profile, setProfile] = useState(session?.profile || null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    let cancel = false;
    Promise.all([request("admin/auth/me"), request("admin/auth/sessions")])
      .then(([me, listed]) => {
        if (cancel) return;
        setProfile(me.data);
        setSessions(listed.data || []);
      })
      .catch((err) => {
        if (!cancel) setError(errorMessage(err));
      });
    return () => {
      cancel = true;
    };
  }, [request]);

  async function exportOrders() {
    setExporting(true);
    setError("");
    try {
      const blob = await apiDownload("admin/orders/export.csv", { token: session?.token, query: { limit: 5000 } });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  async function endOtherSessions() {
    setEnding(true);
    setError("");
    setNotice("");
    try {
      const result = await request("admin/auth/logout-all", { method: "POST", body: { keepCurrent: true } });
      setNotice(`Ended ${result.data?.sessionsEnded ?? 0} other session${result.data?.sessionsEnded === 1 ? "" : "s"}.`);
      const listed = await request("admin/auth/sessions");
      setSessions(listed.data || []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setEnding(false);
    }
  }

  const roleTitle = profile?.role?.title || (profile?.superAdmin ? "Super Admin" : "Unknown role");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Admin Controls & Settings</h1>
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Role & Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Signed in as <span className="font-medium">{profile?.admin?.name || "—"}</span> · {roleTitle}
          </p>
          <p className="text-sm text-muted-foreground">Role definitions are not a separate endpoint. Staff accounts for this panel are listed below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceTable
            path="/users"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "roleName", label: "Role" },
              { key: "status", label: "Status", badge: true },
            ]}
            emptyLabel="No staff accounts."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unavailable. The admin API does not manage API keys.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={exportOrders} disabled={exporting}>
              {exporting ? "Exporting…" : "Export Orders"}
            </Button>
            <Button type="button" variant="outline" disabled>
              Export Finance
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Ledger CSV export stays in the PHP finance ledger screens. This page does not rebuild that report.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-sm">
            {sessions.length === 0 ? <li className="text-muted-foreground">No active sessions loaded.</li> : null}
            {sessions.map((item) => (
              <li key={item.id} className="border-b pb-2">
                <span className="font-medium">{item.current ? "This device" : "Other device"}</span>
                {item.ipAddress ? ` · ${item.ipAddress}` : ""}
                <span className="block text-muted-foreground">Last used {formatWhen(item.lastUsedAt || item.createdAt)}</span>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" onClick={endOtherSessions} disabled={ending}>
            {ending ? "Ending…" : "Log out other sessions"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
