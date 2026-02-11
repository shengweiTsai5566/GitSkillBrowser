"use client";

import Link from "next/link";
import { Terminal, Languages } from "lucide-react";
import { UserNav } from "./UserNav";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white/80 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-black p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">
              Skill Browser
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-black uppercase italic">
            <Link href="/skills" className="transition-all hover:text-primary hover:underline underline-offset-8 decoration-4">
              {t.nav.library}
            </Link>
            <Link href="/upload" className="transition-all hover:text-primary hover:underline underline-offset-8 decoration-4">
              {t.nav.register}
            </Link>
            <Link href="/guide" className="transition-all hover:text-primary hover:underline underline-offset-8 decoration-4">
              {t.nav.guide}
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-black">
            <button 
              onClick={() => setLocale("zh")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${locale === "zh" ? "bg-black text-white" : "hover:bg-slate-300"}`}
            >
              ZH
            </button>
            <button 
              onClick={() => setLocale("en")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${locale === "en" ? "bg-black text-white" : "hover:bg-slate-300"}`}
            >
              EN
            </button>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
