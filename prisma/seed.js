const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a default user if not exists
  const user = await prisma.user.upsert({
    where: { email: 'admin@skillbrowser.internal' },
    update: {},
    create: {
      email: 'admin@skillbrowser.internal',
      name: 'Admin User',
      provider: 'system',
    },
  });

  const skills = [
    {
      name: "pdf-parser-pro",
      description: "High-performance PDF extraction skill with OCR capabilities and table recognition.",
      repoUrl: "http://internal-git.local/git-server/ai-team/pdf-parser-pro",
      category: "Document Processing",
      tags: ["pdf", "ocr", "parsing"],
      ownerId: user.id,
    },
    {
      name: "jira-agent-connector",
      description: "Seamlessly integrate Agent actions with Jira for ticket management and status updates.",
      repoUrl: "http://internal-git.local/git-server/devops/jira-connector",
      category: "Integration",
      tags: ["jira", "productivity", "atlassian"],
      ownerId: user.id,
    },
    {
      name: "sql-query-generator",
      description: "Converts natural language questions into optimized SQL queries for PostgreSQL.",
      repoUrl: "http://internal-git.local/git-server/data/sql-gen",
      category: "Data",
      tags: ["sql", "postgres", "text-to-sql"],
      ownerId: user.id,
    }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
