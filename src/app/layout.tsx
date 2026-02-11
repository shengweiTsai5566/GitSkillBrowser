import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Skill Browser",
  description: "Discover and share AI Agent skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={cn(inter.className, "min-h-screen bg-slate-50 font-sans antialiased flex flex-col")}>
        <NextAuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 container py-8">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
