"use client";

import { Skill } from "@/types/skill";
import Link from "next/link";
import { Clock, User, Download } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const { locale } = useLanguage();

  return (
    <div className="group relative rounded-3xl border-4 border-black bg-white text-black transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-8 flex-1">
          <div className="flex items-start justify-between mb-6 gap-2">
          <div className="flex flex-wrap gap-2 relative z-10 min-h-[32px] items-center">
            {Array.isArray(skill.tags) && skill.tags.length > 0 ? (
              <>
                {skill.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-yellow-400 border-2 border-black px-2 py-1 rounded-lg h-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {tag}
                  </span>
                ))}
                {skill.tags.length > 3 && (
                  <span className="text-[10px] font-black text-slate-500 py-1">+{skill.tags.length - 3}</span>
                )}
              </>
            ) : (
              <span className="text-[10px] font-black text-slate-600 bg-slate-200 border-2 border-slate-400 px-3 py-1 rounded-lg uppercase tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]">
                No Tags Defined
              </span>
            )}
          </div>
            
            <div className="flex items-center gap-2 font-black text-sm min-w-fit" title="Downloads">
              <Download className="h-5 w-5 stroke-black stroke-[3]" />
              <span>{skill.downloadCount || 0}</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors uppercase italic">
            <Link href={`/skills/${skill.id}`}>
              <span className="absolute inset-0" aria-hidden="true" />
              {skill.name}
            </Link>
          </h3>
          
          <p className="text-base font-bold text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {locale === "zh" && skill.descriptionZH ? skill.descriptionZH : skill.description}
          </p>
        </div>

        <div className="border-t-4 border-black bg-slate-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full border-2 border-black bg-white flex items-center justify-center overflow-hidden">
              {skill.owner.image ? <img src={skill.owner.image} alt="" /> : <User className="h-3 w-3" />}
            </div>
            <span className="text-xs font-black truncate max-w-[100px]">
              {skill.owner.name || "Anon"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <Clock className="h-3 w-3" />
            {new Date(skill.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
