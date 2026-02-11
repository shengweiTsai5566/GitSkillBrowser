"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function SkillFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    
    startTransition(() => {
      router.push(`/skills?${params.toString()}`);
    });
  };

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    
    startTransition(() => {
      router.push(`/skills?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-[600px]">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 stroke-[3] ${isPending ? 'animate-pulse text-primary' : ''}`} />
        <Input
          type="search"
          placeholder={t.skills.search_placeholder}
          className="pl-14 h-14 rounded-2xl border-4 border-black font-bold text-lg focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <select 
          className="h-14 rounded-2xl border-4 border-black bg-white px-6 py-2 text-base font-black uppercase italic ring-offset-background focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] appearance-none cursor-pointer hover:bg-slate-50 transition-all"
          defaultValue={searchParams.get("sort")?.toString() || "newest"}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="newest">{t.skills.sort_latest}</option>
          <option value="downloads">{t.skills.sort_popular}</option>
        </select>
      </div>
    </div>
  );
}
