"use client";

import { SkillCard } from "@/components/features/SkillCard";
import { SkillFilter } from "@/components/features/SkillFilter";
import { Skill } from "@/types/skill";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Loader2 } from "lucide-react";

function SkillsContent() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchSkills() {
      setIsLoading(true);
      const query = new URLSearchParams(searchParams.toString());
      try {
        const res = await fetch(`/api/skills?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSkills(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSkills();
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-12 pb-20 pt-10">
      <div className="border-b-8 border-black pb-8">
        <h1 className="text-6xl font-black tracking-tight uppercase italic">{t.skills.title}</h1>
        <p className="text-xl font-bold text-slate-500 mt-2">
          {t.skills.count.replace('{count}', skills.length.toString())}
        </p>
      </div>
      
      <div className="bg-slate-100 p-8 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        <SkillFilter />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-slate-300" />
        </div>
      ) : skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-8 border-dashed border-slate-200 rounded-[3rem] bg-slate-50">
          <p className="text-2xl font-black text-slate-300 uppercase italic tracking-widest">{t.skills.no_results}</p>
        </div>
      )}
    </div>
  );
}

export default function SkillsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-slate-300" />
      </div>
    }>
      <SkillsContent />
    </Suspense>
  );
}
