import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should render hero section correctly', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Agent Skill Browser/);

    // Check hero text
    await expect(page.getByRole('heading', { name: /Discover & Share/i })).toBeVisible();
    await expect(page.getByText(/The central hub for internal agent capabilities/i)).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole('link', { name: 'Browse Skills' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Share a Skill' })).toBeVisible();
  });

  test('should render featured skills', async ({ page }) => {
    await page.goto('/');

    // Check section header
    await expect(page.getByRole('heading', { name: 'Featured Skills' })).toBeVisible();

    // Check that at least one skill card is present
    const skillCards = page.locator('h3 > a');
    await expect(skillCards).toHaveCount(3);

    // Check specific mock data
    await expect(page.getByText('pdf-parser-pro')).toBeVisible();
    await expect(page.getByText('jira-agent-connector')).toBeVisible();
  });

  test('should navigate to browse page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Browse Skills');
    await expect(page).toHaveURL(/\/skills/);
  });
});
