import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const rawEmail = req.nextUrl.searchParams.get("email");

  if (!rawEmail) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const email = rawEmail.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { gitToken: true, useUserKey: true }
  });

  return NextResponse.json({ 
    exists: !!user && !!user.gitToken,
    useUserKey: user?.useUserKey || false
  });
}
