import { PrismaClient } from '@prisma/client';
import { describe, it, expect } from 'vitest';

const prisma = new PrismaClient();

describe('Database Models', () => {
  it('should have User model available', async () => {
    // This should fail if the migration hasn't been run or DB is not connected
    const userCount = await prisma.user.count();
    expect(userCount).toBeGreaterThanOrEqual(0);
  });

  it('should have Skill model available', async () => {
    const skillCount = await prisma.skill.count();
    expect(skillCount).toBeGreaterThanOrEqual(0);
  });
});
