import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { scanContent } from "@/lib/security";
import { decrypt } from "@/lib/encryption";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

function extractMetadata(content: string, defaultName: string) {
  const cleanContent = content.trim();
  const metadata: any = { name: defaultName, description: "", tags: [], category: "General" };
  const yamlMatch = cleanContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (yamlMatch) {
    yamlMatch[1].split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        if (key === 'name') metadata.name = value;
        if (key === 'description') metadata.description = value;
        if (key === 'category') metadata.category = value;
        if (key === 'tags') {
          metadata.tags = value.replace(/[ Get ]/g, '').split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    });
  }

  if (metadata.name === defaultName) {
    const titleMatch = cleanContent.match(/^#\s+(.*)$/m);
    if (titleMatch) metadata.name = titleMatch[1].trim();
  }

  if (!metadata.description) {
    const body = cleanContent
      .replace(/^---[\s\S]*?---/, "") 
      .replace(/^#+.*/gm, "")       
      .trim();
    const paragraphs = body.split(/\n\s*\n/);
    for (const p of paragraphs) {
      const text = p.trim().replace(/\n/g, " ");
      if (text && text.length > 10 && !text.startsWith("![")) {
        metadata.description = text.slice(0, 250);
        break;
      }
    }
  }

  if (!metadata.description) metadata.description = "Skill indexed from documentation.";
  return metadata;
}

async function fetchGiteaFile(url: string, token: string) {
  console.log(`[DEBUG] Sync attempting: ${url}`);
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const res = await fetch(url, {
      headers: { "Authorization": `token ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const text = await res.text();
      console.log(`[DEBUG] Sync success! File length: ${text.length}`);
      return text;
    }
    console.warn(`[DEBUG] Sync failed: ${res.status} for ${url}`);
    return null;
  } catch (e: any) {
    console.error(`[DEBUG] Sync Network Error: ${e.message}`);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { repoUrl, version = "1.0.0", ref = "main" } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.gitToken) return NextResponse.json({ error: "Token not found" }, { status: 400 });

    const userKey = (session.user as any).userKey;
    const decryptedToken = decrypt(user.gitToken, userKey);
    
    // 重要：取得 Gitea 基礎網址
    const gitUrl = (process.env.INTERNAL_GIT_URL || "").replace(/\/$/, "");
    
    // 解析 owner 和 repo
    const urlParts = repoUrl.replace(/\.git$/, "").split('/').filter(Boolean);
    const repoName = urlParts.pop();
    const owner = urlParts.pop();

    if (!owner || !repoName) throw new Error("Could not parse owner/repo from URL");

    let readmeZH = null;
    let readmeEN = null;
    let actualRef = ref; // 記錄實際找到的分支
    
    // 嘗試的分支清單
    const branchesToTry = [ref];
    if (ref === "main") branchesToTry.push("master");
    else if (ref === "master") branchesToTry.push("main");

    // 1. 嘗試抓取中文版
    const zhFiles = ["SKILL.ZH.md", "SKILL.zh.md"];
    outerZH:
    for (const targetRef of branchesToTry) {
      for (const f of zhFiles) {
        const fullUrl = `${gitUrl}/${owner}/${repoName}/raw/branch/${targetRef}/${f}`;
        readmeZH = await fetchGiteaFile(fullUrl, decryptedToken);
        if (readmeZH) {
          actualRef = targetRef; // 更新為成功的分支
          break outerZH;
        }
      }
    }

    // 2. 嘗試抓取英文版 (或通用版)
    const enFiles = ["SKILL.MD", "SKILL.md", "README.md"];
    outerEN:
    for (const targetRef of branchesToTry) {
      for (const f of enFiles) {
        const fullUrl = `${gitUrl}/${owner}/${repoName}/raw/branch/${targetRef}/${f}`;
        readmeEN = await fetchGiteaFile(fullUrl, decryptedToken);
        if (readmeEN) {
          // 如果中文沒找到，以英文版的分支為準
          if (!readmeZH) actualRef = targetRef;
          break outerEN;
        }
      }
    }

    if (!readmeZH && !readmeEN) {
      console.error(`[DEBUG] No documentation found in branches: ${branchesToTry.join(', ')}`);
      return NextResponse.json({ error: "No documentation found" }, { status: 400 });
    }

    const metadata = extractMetadata(readmeEN || readmeZH || "", repoName);
    const metadataZH = readmeZH ? extractMetadata(readmeZH, repoName) : null;
    const scan = scanContent(readmeEN || readmeZH || "");

    console.log(`[DEBUG] Metadata Extracted - EN Desc: ${metadata.description?.slice(0, 30)}...`);
    console.log(`[DEBUG] Metadata Extracted - ZH Desc: ${metadataZH?.description?.slice(0, 30)}...`);

    const skill = await prisma.skill.upsert({
      where: { name: metadata.name },
      update: {
        description: metadata.description,
        descriptionZH: metadataZH?.description || null,
        repoUrl,
        category: metadata.category,
        tags: metadata.tags,
        ownerId: user.id,
      },
      create: {
        name: metadata.name,
        description: metadata.description,
        descriptionZH: metadataZH?.description || null,
        repoUrl,
        category: metadata.category,
        tags: metadata.tags,
        ownerId: user.id,
      },
    });

    await prisma.skillVersion.upsert({
      where: { skillId_version: { skillId: skill.id, version } },
      update: { 
        readmeContent: readmeEN || "", 
        readmeContentZH: readmeZH, 
        metadata, 
        securityStatus: scan.isSafe ? "safe" : "warn", 
        commitHash: actualRef // 存儲實際找到的分支
      },
      create: { 
        skillId: skill.id, 
        version, 
        readmeContent: readmeEN || "", 
        readmeContentZH: readmeZH, 
        metadata, 
        securityStatus: scan.isSafe ? "safe" : "warn", 
        commitHash: actualRef // 存儲實際找到的分支
      },
    });

    return NextResponse.json({ success: true, skillId: skill.id });
  } catch (error: any) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const sort = searchParams.get("sort") || "newest";
    
    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionZH: { contains: query, mode: "insensitive" } },
        { tags: { has: query } }
      ];
    }

    const orderBy: any = {};
    if (sort === "downloads") {
      orderBy.downloadCount = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy,
      include: { owner: { select: { name: true, image: true } }, _count: { select: { versions: true } } },
    });
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error("GET Skills Error:", error.message);
    return NextResponse.json({ error: "Error fetching skills" }, { status: 500 });
  }
}