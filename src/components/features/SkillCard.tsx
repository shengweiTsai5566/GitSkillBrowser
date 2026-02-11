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
          <div className="flex items-center justify-between mb-6">
            <span className="bg-slate-100 border-2 border-black text-xs font-black uppercase px-3 py-1 rounded-lg">
              {skill.category}
            </span>
            <div className="flex items-center gap-2 font-black text-sm" title="Downloads">
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
          
          <p className="text-base font-bold text-slate-600 line-clamp-3 leading-relaxed">
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
