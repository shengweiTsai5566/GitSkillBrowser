import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { scanContent } from "@/lib/security";
import { decrypt } from "@/lib/encryption";
import { gitClient } from "@/lib/git-client";

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { repoUrl, version = "1.0.0", ref = "main", customTags = [] } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user?.gitToken) return NextResponse.json({ error: "Token not found" }, { status: 400 });

    const userKey = (session.user as any).userKey;
    const decryptedToken = decrypt(user.gitToken, userKey);
    
    // 解析 repoName (僅用於 metadata default name)
    const urlParts = repoUrl.replace(/\.git$/, "").split('/').filter(Boolean);
    const repoName = urlParts.pop() || "unknown-skill";

    let readmeZH = null;
    let readmeEN = null;
    let actualRef = ref;
    
    // 嘗試的分支清單
    const branchesToTry = [ref];
    if (ref === "main") branchesToTry.push("master");
    else if (ref === "master") branchesToTry.push("main");

    // 1. 嘗試抓取中文版
    const zhFiles = ["SKILL.ZH.md", "SKILL.zh.md"];
    outerZH:
    for (const targetRef of branchesToTry) {
      for (const f of zhFiles) {
        readmeZH = await gitClient.getRawContent(repoUrl, targetRef, f, decryptedToken);
        if (readmeZH) {
          actualRef = targetRef;
          break outerZH;
        }
      }
    }

    // 2. 嘗試抓取英文版 (或通用版)
    const enFiles = ["SKILL.MD", "SKILL.md", "README.md"];
    outerEN:
    for (const targetRef of branchesToTry) {
      for (const f of enFiles) {
        readmeEN = await gitClient.getRawContent(repoUrl, targetRef, f, decryptedToken);
        if (readmeEN) {
          if (!readmeZH) actualRef = targetRef;
          break outerEN;
        }
      }
    }

    if (!readmeZH && !readmeEN) {
      return NextResponse.json({ error: "No documentation found (SKILL.md or README.md)" }, { status: 400 });
    }

    const metadata = extractMetadata(readmeEN || readmeZH || "", repoName);
    const metadataZH = readmeZH ? extractMetadata(readmeZH, repoName) : null;
    const scan = scanContent(readmeEN || readmeZH || "");

    // DEBUG LOGS
    console.log("[DEBUG] Received customTags:", customTags);
    console.log("[DEBUG] Metadata tags:", metadata.tags);

    // Merge tags: Metadata Tags + Custom Tags
    const finalTags = Array.from(new Set([...metadata.tags, ...customTags])).filter(Boolean);
    console.log("[DEBUG] Final Tags to Save:", finalTags);

    const skill = await prisma.skill.upsert({
      where: { name: metadata.name },
      update: {
        description: metadata.description,
        descriptionZH: metadataZH?.description || null,
        repoUrl,
        category: metadata.category,
        tags: finalTags, // FIXED: Use finalTags instead of metadata.tags
        ownerId: user.id,
      },
      create: {
        name: metadata.name,
        description: metadata.description,
        descriptionZH: metadataZH?.description || null,
        repoUrl,
        category: metadata.category,
        tags: finalTags, // FIXED: Use finalTags instead of metadata.tags
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
        commitHash: actualRef 
      },
      create: { 
        skillId: skill.id, 
        version, 
        readmeContent: readmeEN || "", 
        readmeContentZH: readmeZH, 
        metadata, 
        securityStatus: scan.isSafe ? "safe" : "warn", 
        commitHash: actualRef 
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
    const tagsParam = searchParams.get("tags");
    const sort = searchParams.get("sort") || "newest";
    
    const where: any = {};
    
    // Text Search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionZH: { contains: query, mode: "insensitive" } },
        // We can keep tag search in text query too, or rely on specific filter
        { tags: { has: query } } 
      ];
    }

    // Tag Filter (OR logic: hasSome)
    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean);
      if (tags.length > 0) {
        // If text query exists, we need to combine them with AND
        // Prisma implicit AND: just add another property to `where`
        where.tags = { hasSome: tags };
      }
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