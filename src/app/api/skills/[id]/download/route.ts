import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. 取得技能與版本資訊
    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!skill || !skill.versions[0]) {
      return new NextResponse("Skill or version not found", { status: 404 });
    }

    // 2. 取得目前使用者的 Git Token
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.gitToken) {
      return new NextResponse("Git Token not found. Please check your settings.", { status: 400 });
    }

    const userKey = (session.user as any).userKey;
    const decryptedToken = decrypt(user.gitToken, userKey);

    // 3. 構造 Gitea 的 Archive 網址
    const gitUrl = (process.env.INTERNAL_GIT_URL || "").replace(/\/$/, "");
    const urlParts = skill.repoUrl.replace(/\.git$/, "").split('/').filter(Boolean);
    const repoName = urlParts.pop();
    const owner = urlParts.pop();
    
    const dbBranch = skill.versions[0].commitHash || "master";
    
    // 嘗試的分支清單：優先使用資料庫存的，失敗則嘗試 master 或 main
    const branchesToTry = [dbBranch];
    if (dbBranch === "main") branchesToTry.push("master");
    else if (dbBranch === "master") branchesToTry.push("main");

    let giteaRes = null;
    let finalBranch = dbBranch;

    // 4. 嘗試下載
    for (const targetRef of branchesToTry) {
      const zipUrl = `${gitUrl}/${owner}/${repoName}/archive/${targetRef}.zip`;
      console.log(`[DOWNLOAD] Trying: ${zipUrl}`);

      const res = await fetch(zipUrl, {
        headers: { 'Authorization': `token ${decryptedToken}` },
        cache: 'no-store',
      });

      if (res.ok) {
        giteaRes = res;
        finalBranch = targetRef;
        console.log(`[DOWNLOAD] Success with branch: ${targetRef}`);
        break;
      } else {
        console.warn(`[DOWNLOAD] Failed branch ${targetRef}: ${res.status}`);
      }
    }

    if (!giteaRes) {
      return new NextResponse(`Could not find archive in branches: ${branchesToTry.join(', ')}`, { status: 404 });
    }

    // 5. 取得二進位數據並回傳
    const arrayBuffer = await giteaRes.arrayBuffer();
    const fileName = `${skill.name}-${finalBranch}.zip`;

    // 6. 增加下載次數 (等待完成以確保資料一致性)
    try {
      await prisma.skill.update({
        where: { id: params.id },
        data: { downloadCount: { increment: 1 } }
      });
      console.log(`[DOWNLOAD] Successfully incremented count for: ${params.id}`);
    } catch (dbErr: any) {
      console.error("[DOWNLOAD] Database Update Error:", dbErr.message);
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });

  } catch (error: any) {
    console.error("Internal Download Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
