import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 使用 Raw SQL 進行高效聚合
    // 注意：unnest 是 PostgreSQL 特有語法
    const tags = await prisma.$queryRaw`
      SELECT unnest(tags) as tag, count(*)::int as count 
      FROM "Skill" 
      GROUP BY tag 
      ORDER BY count DESC, tag ASC
    `;

    // 處理 BigInt 問題 (Prisma queryRaw 回傳的 count 可能是 BigInt)
    const formatted = (tags as any[]).map(t => ({
      tag: t.tag,
      count: Number(t.count)
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("GET Tags Error:", error.message);
    // Fallback: 如果 Raw SQL 失敗 (例如非 Postgres 環境)，改用應用層聚合
    try {
      const allSkills = await prisma.skill.findMany({ select: { tags: true } });
      const tagMap = new Map<string, number>();
      
      allSkills.forEach(skill => {
        skill.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      });

      const fallbackResult = Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json(fallbackResult);
    } catch (e) {
      return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }
  }
}
