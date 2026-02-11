"use client";

import { BookOpen, Zap, Search, Download, Languages, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function GuidePage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-24">
      <div className="mb-16 border-b-8 border-black pb-8">
        <h1 className="text-6xl font-black tracking-tight uppercase italic flex items-center gap-4">
          <BookOpen className="h-12 w-12 stroke-[3]" /> {t.guide.title}
        </h1>
        <p className="text-xl font-bold text-slate-500 mt-4">
          {t.guide.subtitle}
        </p>
      </div>

      <div className="space-y-16">
        {/* Section 0: Authentication & Security */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 bg-purple-500 p-4 rounded-2xl border-4 border-black w-fit shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-white">
            <ShieldCheck className="h-8 w-8" />
            <h2 className="text-2xl font-black uppercase">{t.guide.sec0.title}</h2>
          </div>
          <div className="pl-6 border-l-8 border-slate-200 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-black italic underline decoration-purple-200 underline-offset-4">{t.guide.sec0.a_title}</h3>
              <p className="font-bold text-slate-600 leading-relaxed">{t.guide.sec0.a_desc}</p>
              <ul className="list-disc pl-6 space-y-2 font-bold text-slate-600 text-sm">
                <li>{t.guide.sec0.a_li1}</li>
                <li>{t.guide.sec0.a_li2}</li>
                <li>{t.guide.sec0.a_li3}</li>
                <li>{t.guide.sec0.a_li4}</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-black italic underline decoration-purple-200 underline-offset-4">{t.guide.sec0.b_title}</h3>
              <p className="font-bold text-slate-600 leading-relaxed">{t.guide.sec0.b_desc}</p>
              <ol className="list-decimal pl-6 space-y-2 font-bold text-slate-600 text-sm">
                <li>{t.guide.sec0.b_li1}</li>
                <li>{t.guide.sec0.b_li2}</li>
                <li>{t.guide.sec0.b_li3}</li>
                <li>{t.guide.sec0.b_li4}</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black italic underline decoration-purple-200 underline-offset-4">{t.guide.sec0.c_title}</h3>
              <p className="font-bold text-slate-600 leading-relaxed">{t.guide.sec0.c_desc}</p>
              <div className="bg-slate-50 p-6 rounded-[2rem] border-4 border-black space-y-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
                <div className="flex gap-4">
                  <div className="bg-black text-white px-3 py-1 rounded-lg h-fit font-black text-xs">1</div>
                  <p className="font-bold text-sm">{t.guide.sec0.c_step1}</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-lg h-fit font-black text-xs">2</div>
                  <p className="font-bold text-sm">{t.guide.sec0.c_step2}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Registering Skills */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 bg-yellow-400 p-4 rounded-2xl border-4 border-black w-fit shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <Zap className="h-8 w-8 fill-current" />
            <h2 className="text-2xl font-black uppercase">{t.guide.sec1.title}</h2>
          </div>
          <div className="pl-6 border-l-8 border-slate-200 space-y-4">
            <p className="font-bold text-xl leading-relaxed text-slate-700">{t.guide.sec1.desc}</p>
            <ul className="list-disc pl-6 space-y-2 font-bold text-slate-600">
              <li>{t.guide.sec1.li1}</li>
              <li>{t.guide.sec1.li2}</li>
              <li>{t.guide.sec1.li3}</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="mt-24 p-16 bg-primary/5 rounded-[4rem] border-8 border-dashed border-black flex flex-col items-center text-center gap-8">
        <h3 className="text-4xl font-black uppercase italic">{t.guide.cta}</h3>
        <Link href="/upload" className="inline-flex h-20 items-center justify-center rounded-3xl border-4 border-black bg-black px-12 text-2xl font-black text-white shadow-[12px_12px_0_0_rgba(0,0,0,0.3)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
          {t.guide.btn} <ArrowRight className="ml-3 h-8 w-8 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
