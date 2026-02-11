"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, ShieldCheck, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (status === "loading") return <div className="p-8 text-center">Loading settings...</div>;
  if (status === "unauthenticated") return <div className="p-8 text-center text-destructive">Please sign in to access settings.</div>;

  const handleUpdateToken = async () => {
    setIsSaving(true);
    // TODO: 實作更新 Token 的 API 呼叫 (Phase 3)
    alert("Token management logic will be fully integrated in Phase 3. Your current token from login has been saved to the DB.");
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and Git integration.</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Git Integration</h2>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-md bg-green-500/10 p-4 flex items-start gap-3 border border-green-500/20">
              <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Connected to Gitea</p>
                <p className="text-xs text-green-700">The platform has your access token and can clone your repositories.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-token">Update Access Token</Label>
              <Input 
                id="new-token" 
                type="password" 
                placeholder="Paste new token here" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Gitea tokens only appear once. If you lost yours, generate a new one in Gitea Settings.
              </p>
            </div>

            <Button onClick={handleUpdateToken} disabled={isSaving || !token}>
              {isSaving ? "Saving..." : "Update Token"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-6 bg-card border-destructive/20">
          <div className="flex items-center gap-2 mb-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Security Note</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your token is stored in our database to allow automated skill indexing. 
            We recommend using a token with <strong>read-only</strong> permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
