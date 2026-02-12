"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitBranch, Globe, Info, Loader2, AlertCircle, Search, Zap, Star, Download } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface GitRepo {
  id: string | null;
  name: string;
  fullName: string;
  description: string;
  descriptionZH: string | null;
  htmlUrl: string;
  updatedAt: string;
  isSkill: boolean;
  isRegistered: boolean;
  hasUpdate: boolean;
}

export default function UploadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [repoUrl, setRepoUrl] = useState("");
  const [ref, setRef] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(true);
  const [error, setError] = useState("");
  const [discoveredRepos, setDiscoveredRepos] = useState<GitRepo[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "registered" | "updates">("all");

  const discover = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch("/api/user/git-repos");
      if (res.ok) {
        const data = await res.json();
        setDiscoveredRepos(data);
      }
    } catch (err) {
      console.error("Discovery failed");
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredRepos = discoveredRepos.filter(repo => {
    if (filter === "new") return !repo.isRegistered;
    if (filter === "registered") return repo.isRegistered;
    if (filter === "updates") return repo.hasUpdate;
    return true;
  });

  useEffect(() => {
    discover();
  }, []);

  const handleUnregister = async (id: string) => {
    if (!confirm("Are you sure you want to unregister this skill? It will no longer be visible to others.")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        await discover(); // 重新整理清單
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to unregister");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, manualUrl?: string) => {
    if (e) e.preventDefault();
    const finalUrl = manualUrl || repoUrl;
    if (!finalUrl) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: finalUrl, ref }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register skill");
      router.push(`/skills/${data.skillId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-12 border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight uppercase italic">{t.upload.title}</h1>
          <p className="text-xl font-bold text-slate-500 mt-2">
            {t.upload.subtitle}
          </p>
        </div>
        
        <div className="flex gap-4">
          <a href="/api/template" download>
            <Button variant="outline" className="border-2 border-black font-black uppercase italic bg-white hover:bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
              <Download className="h-4 w-4 mr-2" />
              {t.upload.download_template}
            </Button>
          </a>
          <Button onClick={discover} variant="outline" className="border-2 border-black font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]" disabled={isDiscovering}>
            {isDiscovering ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
            {t.upload.refresh}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <AlertCircle className="h-8 w-8 stroke-[3]" />
          <p className="font-black text-lg">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2">
            <Search className="h-6 w-6 stroke-[3]" /> 
            {t.upload.git_projects} ({filteredRepos.length})
          </h2>
          
          <div className="flex bg-slate-200 p-1 rounded-xl border-2 border-black">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${filter === "all" ? "bg-black text-white" : "hover:bg-slate-300"}`}
            >
              {t.upload.filter_all}
            </button>
            <button 
              onClick={() => setFilter("new")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${filter === "new" ? "bg-yellow-400 text-black border-2 border-black -translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-slate-300"}`}
            >
              {t.upload.filter_new}
            </button>
            <button 
              onClick={() => setFilter("registered")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${filter === "registered" ? "bg-green-500 text-white border-2 border-black -translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "hover:bg-slate-300"}`}
            >
              {t.upload.filter_registered}
            </button>
            <button 
              onClick={() => setFilter("updates")}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${filter === "updates" ? "bg-blue-500 text-white border-2 border-black -translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse" : "hover:bg-slate-300"}`}
            >
              {t.upload.filter_updates}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border-4 border-black bg-slate-100 min-h-[500px] p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {isDiscovering ? (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary stroke-[3]" />
              <p className="font-black text-slate-500 uppercase tracking-widest text-sm">{t.upload.scanning}</p>
            </div>
          ) : filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRepos.map((repo) => (
                <div key={repo.fullName} className={`p-5 rounded-2xl border-4 border-black bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group relative flex flex-col ${repo.isRegistered ? 'bg-slate-50 opacity-90' : ''}`}>
                  
                  {/* Status Badges */}
                  <div className="absolute -top-3 -right-3 flex flex-col gap-2 items-end">
                    {repo.isRegistered && (
                      <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded border-2 border-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {t.upload.status_registered}
                      </span>
                    )}
                    {repo.hasUpdate && (
                      <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded border-2 border-black uppercase animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {t.upload.status_update}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-lg truncate pr-16" title={repo.name}>{repo.name}</h3>
                  </div>
                  
                  <p className="text-xs font-bold text-slate-500 line-clamp-3 mb-6 flex-grow min-h-[3rem]">
                    {repo.descriptionZH || repo.description || "No description provided."}
                  </p>

                  <div className="flex gap-2">
                    {repo.isRegistered ? (
                      <>
                        <Button 
                          className="flex-1 border-2 border-black font-black bg-blue-400 hover:bg-blue-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                          onClick={() => handleSubmit(undefined, repo.htmlUrl)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />} 
                          {repo.hasUpdate ? t.upload.btn_update : t.upload.btn_resync}
                        </Button>
                        <Button 
                          variant="destructive"
                          className="px-3 border-2 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                          onClick={() => handleUnregister(repo.id!)}
                          disabled={isLoading}
                          title="Unregister skill"
                        >
                          ✕
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full border-2 border-black font-black bg-yellow-400 hover:bg-yellow-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        onClick={() => handleSubmit(undefined, repo.htmlUrl)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2 fill-current" />} 
                        {t.upload.btn_sync}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 flex flex-col items-center gap-4 opacity-30">
              <Search className="h-16 w-12" />
              <p className="font-black uppercase italic">
                {filter === "all" ? t.upload.no_repos : `No repositories match the "${filter}" filter.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
