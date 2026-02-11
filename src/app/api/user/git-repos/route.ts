import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { gitToken: true }
    });

    if (!user?.gitToken) return NextResponse.json({ error: "Git token not found" }, { status: 400 });

    const userKey = (session.user as any).userKey;
    const decryptedToken = decrypt(user.gitToken, userKey);
    
    // 安全處理 URL 結尾
    const gitUrl = (process.env.INTERNAL_GIT_URL || "").split('/').filter(Boolean).join('/').replace(':/', '://');

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const res = await fetch(`${gitUrl}/api/v1/users/shengwei.tsai/repos?limit=100`, {
      headers: { "Authorization": `token ${decryptedToken}` },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error("Gitea error");

    const repos = await res.json();
    
    // 取得目前使用者在資料庫中已註冊的所有 Skill
    const registeredSkills = await prisma.skill.findMany({
      where: { owner: { email: session.user.email } },
      include: { 
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const myRepos = repos
      .filter((repo: any) => {
        const name = (repo.name || "").toLowerCase();
        const desc = (repo.description || "").toLowerCase();
        return name.includes("skill") || name.includes("agent") || 
               desc.includes("skill") || desc.includes("agent");
      })
      .map((repo: any) => {
        // 尋找是否已註冊
        const registered = registeredSkills.find(s => s.repoUrl === repo.html_url);
        const latestVersion = registered?.versions[0];
        
        // 判別是否有新版本 (簡單判別：Git 的更新時間晚於資料庫紀錄)
        // 這裡也可以改用 commit hash 比對，但目前 Gitea API 回傳的 repo 物件包含 updated_at
        const hasUpdate = registered && latestVersion ? new Date(repo.updated_at) > new Date(latestVersion.createdAt) : false;

        return {
          id: registered?.id || null,
          name: repo.name,
          fullName: repo.full_name,
          // 如果已註冊，優先使用資料庫中從 SKILL.md 擷取的描述
          description: registered?.description || repo.description || "Internal skill project",
          descriptionZH: registered?.descriptionZH || null,
          htmlUrl: repo.html_url,
          isSkill: true,
          isRegistered: !!registered,
          hasUpdate: hasUpdate,
          lastGitUpdate: repo.updated_at,
          localUpdate: latestVersion?.createdAt || null
        };
      });

    return NextResponse.json(myRepos);

    return NextResponse.json(myRepos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}