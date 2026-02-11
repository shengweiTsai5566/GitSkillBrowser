"use client";

import { SkillCard } from "@/components/features/SkillCard";
import { Skill } from "@/types/skill";
import Link from "next/link";
import { ArrowRight, Sparkles, Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/skills?sort=newest');
        if (res.ok) {
          const skills: Skill[] = await res.json();
          setFeaturedSkills(skills.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center gap-6 text-center pt-20 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full border-4 border-black bg-primary/10 px-6 py-2 text-sm font-black text-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4">
          <Sparkles className="h-4 w-4" />
          <span>{t.hero.badge}</span>
        </div>
        
        <h1 className="text-6xl font-black tracking-tighter sm:text-8xl md:text-9xl leading-[0.8] uppercase italic">
          {t.hero.title} <br />
          <span className="text-primary underline decoration-black decoration-[12px] underline-offset-[16px]">{t.hero.subtitle}</span>
        </h1>
        
        <p className="max-w-[800px] text-xl md:text-2xl font-bold text-slate-600 mt-12 leading-relaxed">
          {t.hero.description}
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <Link
            href="/skills"
            className="inline-flex h-16 items-center justify-center rounded-2xl border-4 border-black bg-black px-12 text-xl font-black text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2"
          >
            {t.hero.btn_explore}
          </Link>
          <Link
            href="/upload"
            className="inline-flex h-16 items-center justify-center rounded-2xl border-4 border-black bg-white px-12 text-xl font-black text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2"
          >
            <Plus className="mr-2 h-7 w-7 stroke-[4]" />
            {t.hero.btn_register}
          </Link>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b-8 border-black pb-8">
          <div>
            <h2 className="text-5xl font-black tracking-tight uppercase italic">Featured Skills</h2>
            <p className="text-lg font-bold text-slate-500 mt-2">Hand-picked capabilities for your agents.</p>
          </div>
          <Link href="/skills" className="group flex items-center gap-2 text-xl font-black hover:text-primary transition-colors uppercase italic underline decoration-4 underline-offset-8">
            View all <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-2 stroke-[3]" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-slate-300" />
          </div>
        ) : featuredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[3rem] border-8 border-dashed border-slate-200 bg-slate-50">
            <p className="text-2xl font-black text-slate-300 uppercase italic tracking-widest">The library is currently empty.</p>
          </div>
        )}
      </section>
    </div>
  );
}
