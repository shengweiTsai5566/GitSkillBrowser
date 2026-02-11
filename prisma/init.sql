-- Manual initialization SQL for SkillBrowser

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Skill table
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- Create SkillVersion table
CREATE TABLE "SkillVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "commitHash" TEXT NOT NULL,
    "readmeContent" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "securityStatus" TEXT NOT NULL DEFAULT 'safe',
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillVersion_pkey" PRIMARY KEY ("id")
);

-- Create indices
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
CREATE INDEX "Skill_category_idx" ON "Skill"("category");
CREATE INDEX "Skill_ownerId_idx" ON "Skill"("ownerId");
CREATE INDEX "SkillVersion_skillId_idx" ON "SkillVersion"("skillId");
CREATE UNIQUE INDEX "SkillVersion_skillId_version_key" ON "SkillVersion"("skillId", "version");

-- Add foreign keys
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SkillVersion" ADD CONSTRAINT "SkillVersion_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
