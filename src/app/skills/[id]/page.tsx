"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, User, Calendar, Globe, Box, BookOpen, Lightbulb, ShieldCheck, AlertTriangle, Languages, Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  const [skill, setSkill] = useState<any>(null);
  const { locale, t } = useLanguage();
  const [lang, setLang] = useState<"EN" | "ZH">(locale === "en" ? "EN" : "ZH");
  const [isLoading, setIsLoading] = useState(true);

  // Sync tab with global locale on mount or change
  useEffect(() => {
    setLang(locale === "en" ? "EN" : "ZH");
  }, [locale]);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/skills/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setSkill(data);
          // Auto-fallback if ZH is not available
          if (!data.versions?.[0]?.readmeContentZH && lang === "ZH") {
            setLang("EN");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [params.id]);

  if (isLoading) return <div className="p-20 text-center font-black uppercase italic text-2xl tracking-widest animate-pulse">Loading Skill...</div>;
  if (!skill) return <div className="p-20 text-center font-black uppercase italic text-destructive text-2xl tracking-widest">Skill Not Found</div>;

  const latestVersion = skill.versions?.[0];
  const hasZH = !!latestVersion?.readmeContentZH;
  const hasEN = !!latestVersion?.readmeContent;
  
  // Content selection
  const activeContent = lang === "ZH" 
    ? (latestVersion?.readmeContentZH || latestVersion?.readmeContent) 
    : latestVersion?.readmeContent;

  return (
    <div className="flex flex-col gap-12 pb-20 pt-10">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link href="/skills" className="text-lg font-black text-slate-500 hover:text-primary flex items-center gap-2 w-fit uppercase italic underline decoration-4 underline-offset-8">
          <ArrowLeft className="h-5 w-5 stroke-[4]" /> {t.detail.back}
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tight uppercase italic">{skill.name}</h1>
            {latestVersion?.securityStatus === "warn" && (
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl border-4 border-black text-xs font-black uppercase tracking-widest mb-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <AlertTriangle className="h-4 w-4 stroke-[3]" /> Security Warning
              </div>
            )}
            <p className="text-2xl font-bold text-slate-600 max-w-4xl leading-relaxed">
              {lang === "ZH" && skill.descriptionZH ? skill.descriptionZH : skill.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a href={skill.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-16 items-center justify-center rounded-2xl border-4 border-black bg-white px-10 text-xl font-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Globe className="mr-3 h-6 w-6 stroke-[3]" /> {t.detail.repo}
            </a>
            <a 
              href={`/api/skills/${skill.id}/download`}
              className="inline-flex h-16 items-center justify-center rounded-2xl border-4 border-black bg-yellow-400 px-10 text-xl font-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Download className="mr-3 h-6 w-6 stroke-[3]" /> {t.detail.install}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-10 order-2 lg:order-1">
          <div className="p-8 rounded-[2.5rem] border-4 border-black bg-slate-100 shadow-[8px_8px_0_0_rgba(0,0,0,1)] space-y-6">
            <h3 className="font-black text-xl uppercase italic flex items-center gap-3 border-b-2 border-black pb-2">
              <Box className="h-6 w-6" /> {t.detail.details}
            </h3>
            <div className="space-y-4 font-bold text-base text-slate-600">
              <div className="flex items-center gap-3"><User className="h-5 w-5" /> {skill.owner.name}</div>
              <div className="flex items-center gap-3"><Calendar className="h-5 w-5" /> {new Date(skill.updatedAt).toLocaleDateString()}</div>
              <div className="flex items-center gap-2 font-mono bg-white border-2 border-black px-3 py-1.5 rounded-lg w-fit text-xs text-black uppercase shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                {latestVersion?.version || "v1.0.0"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-xl uppercase italic border-b-2 border-black pb-2">{t.detail.tags}</h3>
            <div className="flex flex-wrap gap-3">
              {skill.tags.map((tag: string) => (
                <span key={tag} className="bg-white border-2 border-black px-4 py-2 text-xs font-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          <div className="rounded-[3rem] border-4 border-black bg-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] overflow-hidden">
            {/* Language Switcher Tabs */}
            <div className="border-b-4 border-black bg-slate-50 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasZH && (
                  <button 
                    onClick={() => setLang("ZH")}
                    className={`px-6 py-2 text-sm font-black uppercase rounded-xl border-2 transition-all ${lang === "ZH" ? 'bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-200'}`}
                  >
                    中文版 (ZH)
                  </button>
                )}
                {hasEN && (
                  <button 
                    onClick={() => setLang("EN")}
                    className={`px-6 py-2 text-sm font-black uppercase rounded-xl border-2 transition-all ${lang === "EN" ? 'bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-200'}`}
                  >
                    English (EN)
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase italic">
                <Languages className="h-5 w-5" /> {t.detail.documentation}
              </div>
            </div>

            <div className="p-10 md:p-16 min-h-[600px]">
              <article className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-pre:bg-slate-900 prose-pre:border-4 prose-pre:border-black prose-pre:shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeContent || ""}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
