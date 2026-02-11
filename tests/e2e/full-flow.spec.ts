import { test, expect } from '@playwright/test';

test.describe('Full Integration Flow', () => {
  test('should handle complete flow: Login -> Register -> Detail -> List', async ({ page }) => {
    // 1. Login via Dev Mode
    await page.goto('/auth/signin');
    await page.fill('input[type="email"]', 'tester@example.com');
    await page.click('button:has-text("Next")');
    
    // It should move to auth step
    await expect(page.getByText('tester@example.com')).toBeVisible();
    await page.click('button:has-text("Sign In")');
    
    await expect(page).toHaveURL('/');
    // Check user info in Navbar
    await expect(page.locator('header')).toContainText('tester@example.com');

    // 2. Navigate to Upload (Register Skill)
    await page.click('text=Register Skill');
    await expect(page).toHaveURL('/upload');

    // 3. Mock the POST API response
    await page.route('/api/skills', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, skillId: 'mock-skill-id' }),
      });
    });

    // 4. Mock the Detail API response
    await page.route('/api/skills/mock-skill-id', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-skill-id',
          name: 'E2E Test Skill',
          description: 'A skill created during E2E testing',
          repoUrl: 'http://internal-git.local/git-server/test/e2e-skill',
          category: 'Testing',
          tags: ['test', 'playwright'],
          owner: { name: 'E2E Tester', image: null },
          updatedAt: new Date().toISOString(),
          versions: [
            {
              version: '1.0.0',
              readmeContent: '# E2E Test Skill\nThis is a mocked skill for testing.',
              metadata: {},
              createdAt: new Date().toISOString()
            }
          ]
        }),
      });
    });

    // 5. Fill registration form
    await page.fill('#repo-url', 'http://internal-git.local/git-server/test/e2e-skill');
    await page.click('button:has-text("Initialize Indexing")');

    // 6. Verify redirect to Detail Page
    await expect(page).toHaveURL(/\/skills\/mock-skill-id/);
    await expect(page.getByRole('heading', { name: 'E2E Test Skill' })).toBeVisible();
    await expect(page.getByText('SKILL.md')).toBeVisible();
    
    // 7. Navigate back to List
    await page.click('text=Back to Skills');
    await expect(page).toHaveURL('/skills');
  });
});