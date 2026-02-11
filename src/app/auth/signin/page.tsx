"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Key, ArrowRight, Loader2, Mail, ShieldCheck, Lock, Unlock } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [userKey, setUserKey] = useState(""); // 使用者自訂密碼
  const [step, setStep] = useState<"email" | "auth">("email");
  const [needToken, setNeedToken] = useState(false);
  const [usePersonalKey, setUsePersonalKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email.trim().toLowerCase())}&t=${Date.now()}`);
      const data = await res.json();
      
      setNeedToken(!data.exists);
      setUsePersonalKey(data.useUserKey || false);
      setStep("auth");
    } catch (err) {
      setError("Failed to check user status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const result = await signIn("internal-auth", {
      email,
      token,
      userKey: usePersonalKey ? userKey : "", // 只有勾選或舊有啟用時才傳送
      callbackUrl: "/",
      redirect: false,
    });

    if (result?.error) {
      setNeedToken(true);
      setError("Sign in failed. The token or personal key might be wrong.");
      setIsLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full border-4 border-black bg-primary/10 p-3 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Terminal className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Sign In</h1>
          <p className="font-bold text-slate-500 mt-2">Access the Skill Marketplace</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border-2 border-black font-bold text-sm text-center animate-in shake-in duration-300">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleCheckEmail} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-black uppercase text-xs tracking-widest">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 pl-10 border-2 border-black rounded-xl font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full h-12 bg-black text-white border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 hover:bg-slate-800" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="p-3 border-2 border-black rounded-xl bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-sm truncate max-w-[200px]">{email}</span>
              <button type="button" onClick={() => setStep("email")} className="text-[10px] font-black uppercase underline">Change</button>
            </div>

            {needToken ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="token" className="font-black uppercase text-xs tracking-widest text-primary">New Git Token</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="token"
                      type="password"
                      className="h-12 pl-10 border-2 border-black rounded-xl font-bold"
                      placeholder="Paste your Git token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 border-2 border-black rounded-xl bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="font-black text-xs uppercase">Double Protection</span>
                    </div>
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 border-2 border-black rounded cursor-pointer accent-primary"
                      checked={usePersonalKey}
                      onChange={(e) => setUsePersonalKey(e.target.checked)}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">
                    Add a personal password to encrypt your token. <strong>We will never store this password.</strong>
                  </p>
                  
                  {usePersonalKey && (
                    <div className="pt-2 animate-in zoom-in-95 duration-200">
                      <Input 
                        type="password" 
                        placeholder="Choose a personal password" 
                        className="h-10 border-2 border-black rounded-lg font-bold bg-white"
                        value={userKey}
                        onChange={(e) => setUserKey(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border-2 border-black flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2 font-black text-xs uppercase">
                    <ShieldCheck className="h-5 w-5 stroke-[3]" /> Stored Token Found
                  </div>
                  <button type="button" onClick={() => setNeedToken(true)} className="text-[10px] font-black underline">Update?</button>
                </div>

                {usePersonalKey && (
                  <div className="space-y-2">
                    <Label htmlFor="userKey" className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <Unlock className="h-3 w-3" /> Enter Personal Password
                    </Label>
                    <Input 
                      id="userKey"
                      type="password" 
                      placeholder="Your personal decryption key" 
                      className="h-12 border-2 border-black rounded-xl font-bold"
                      value={userKey}
                      onChange={(e) => setUserKey(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            <Button className="w-full h-12 bg-black text-white border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sign In Now"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}