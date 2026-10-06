"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi, useAuth } from "@/components/auth-provider";
import { errorMessage } from "@/lib/format";

export function ProfileView() {
  const request = useApi();
  const { session, replaceToken } = useAuth();
  const [profile, setProfile] = useState(session?.profile || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancel = false;
    request("admin/auth/me")
      .then((result) => {
        if (!cancel) setProfile(result.data);
      })
      .catch((err) => {
        if (!cancel) setError(errorMessage(err));
      });
    return () => {
      cancel = true;
    };
  }, [request]);

  const admin = profile?.admin;
  const initials = String(admin?.name || "A")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    try {
      const result = await request("admin/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      replaceToken(result.data.token, result.data.expiresAt);
      setCurrentPassword("");
      setNewPassword("");
      setNotice("Password updated. Other sessions were signed out.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback>{initials || "A"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{admin?.name || "—"}</p>
          <p className="text-sm text-muted-foreground">{admin?.email || "—"}</p>
          <p className="text-sm text-muted-foreground">{profile?.role?.title || (profile?.superAdmin ? "Super Admin" : "")}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <p>Phone: {admin?.phone || "—"}</p>
        <p>Company: {admin?.company || "—"}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="current-password">Current password</Label>
          <Input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
        </div>
        <div>
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={40} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          <p className="mt-1 text-xs text-muted-foreground">At least 8 characters, with letters and numbers.</p>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Change password"}
        </Button>
      </form>
    </div>
  );
}
