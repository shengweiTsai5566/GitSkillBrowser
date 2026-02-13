"use client";

import { Input } from "@/components/ui/input";
import { Search, Tag, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface TagStat {
  tag: string;
  count: number;
}

export function SkillFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();
  
  // 'keyword' | 'tags'
  const [mode, setMode] = useState<'keyword' | 'tags'>('keyword');
  const [availableTags, setAllTags] = useState<TagStat[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [tagFilter, setTagFilter] = useState(""); // Filter the tag list itself

  // Initialize selected tags from URL
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  // Load tags on mount or mode switch
  useEffect(() => {
    if (mode === 'tags' && availableTags.length === 0) {
      setIsLoadingTags(true);
      fetch('/api/tags')
        .then(res => res.json())
        .then(data => setAllTags(data))
        .finally(() => setIsLoadingTags(false));
    }
  }, [mode]);

  // Sync mode with URL params presence
  useEffect(() => {
    if (searchParams.has("tags") && !searchParams.has("query")) {
      setMode("tags");
    }
  }, []);

  const updateParams = (newQuery?: string, newTags?: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Handle Keyword
    if (newQuery !== undefined) {
      if (newQuery) params.set("query", newQuery);
      else params.delete("query");
    }

    // Handle Tags
    if (newTags !== undefined) {
      if (newTags.length > 0) params.set("tags", newTags.join(","));
      else params.delete("tags");
    }

    startTransition(() => {
      router.push(`/skills?${params.toString()}`);
    });
  };

  const handleModeChange = (newMode: 'keyword' | 'tags') => {
    setMode(newMode);
    // Optional: Clear the other filter when switching? 
    // Let's clear to keep it simple and focused.
    if (newMode === 'keyword') {
      updateParams(undefined, []); // Clear tags
      setSelectedTags([]);
    } else {
      updateParams("", undefined); // Clear query
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateParams(undefined, newTags);
  };

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set("sort", sort);
    else params.delete("sort");
    startTransition(() => router.push(`/skills?${params.toString()}`));
  };

  // Filter visible tags in the cloud
  const visibleTags = availableTags.filter(t => 
    t.tag.toLowerCase().includes(tagFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Mode Switcher & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-200 p-1.5 rounded-2xl border-2 border-black">
          <button
            onClick={() => handleModeChange('keyword')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black uppercase transition-all ${mode === 'keyword' ? 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black border-2 border-black' : 'text-slate-500 hover:bg-slate-300'}`}
          >
            <Search className="h-4 w-4 stroke-[3]" />
            Keyword
          </button>
          <button
            onClick={() => handleModeChange('tags')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black uppercase transition-all ${mode === 'tags' ? 'bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black border-2 border-black' : 'text-slate-500 hover:bg-slate-300'}`}
          >
            <Tag className="h-4 w-4 stroke-[3]" />
            By Tags
          </button>
        </div>

        <select 
          className="h-12 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase italic shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all"
          defaultValue={searchParams.get("sort")?.toString() || "newest"}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="newest">{t.skills.sort_latest}</option>
          <option value="downloads">{t.skills.sort_popular}</option>
        </select>
      </div>

      {/* Mode Content */}
      <div className="min-h-[80px]">
        {mode === 'keyword' ? (
          <div className="relative w-full">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 stroke-[3] ${isPending ? 'animate-pulse text-primary' : ''}`} />
            <Input
              type="search"
              placeholder={t.skills.search_placeholder}
              className="pl-14 h-16 rounded-2xl border-4 border-black font-bold text-lg focus-visible:ring-0 focus-visible:border-primary shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all"
              defaultValue={searchParams.get("query")?.toString()}
              onChange={(e) => updateParams(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Tag Search Filter */}
            <div className="relative w-full md:w-1/3">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Filter tags..." 
                className="pl-9 h-10 rounded-xl border-2 border-black font-bold text-sm bg-white"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
            </div>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-3 p-6 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              {isLoadingTags ? (
                <div className="w-full text-center py-4 text-slate-400 font-black animate-pulse">Loading Tags...</div>
              ) : visibleTags.length > 0 ? (
                visibleTags.map(({ tag, count }) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all flex items-center gap-2
                        ${isSelected 
                          ? 'bg-black text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] -translate-y-1' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-black hover:bg-white'}
                      `}
                    >
                      {tag}
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-white text-black' : 'bg-slate-200 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="w-full text-center py-4 text-slate-400 italic font-bold">No matching tags found.</div>
              )}
            </div>
            
            {/* Selected Summary */}
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <span>Active Filters:</span>
                {selectedTags.map(tag => (
                  <span key={tag} className="bg-yellow-200 text-black px-2 py-0.5 rounded border border-black text-xs flex items-center gap-1">
                    {tag}
                    <button onClick={() => toggleTag(tag)}><X className="h-3 w-3"/></button>
                  </span>
                ))}
                <button 
                  onClick={() => { setSelectedTags([]); updateParams(undefined, []); }}
                  className="text-xs text-red-500 underline ml-2 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}