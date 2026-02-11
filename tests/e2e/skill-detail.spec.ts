import { test, expect } from '@playwright/test';

test.describe('Skill Detail Page', () => {
  test('should render skill details correctly', async ({ page }) => {
    // Navigate to a mock skill page
    await page.goto('/skills/1');

    // Check Header
    await expect(page.getByRole('heading', { name: 'pdf-parser-pro' })).toBeVisible();
    await expect(page.getByText('High-performance PDF extraction')).toBeVisible();

    // Check Metadata
    await expect(page.getByText('ai-team')).toBeVisible();
    await expect(page.getByText('128 stars')).toBeVisible();

    // Check Actions
    await expect(page.getByRole('button', { name: 'Install Skill' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Repo' })).toBeVisible();
  });

  test('should render README content', async ({ page }) => {
    await page.goto('/skills/1');

    // Check README header
    await expect(page.getByRole('heading', { name: 'README.md' })).toBeVisible();
    
    // Check content inside the pre/article
    await expect(page.getByText('# PDF Parser Pro')).toBeVisible();
    await expect(page.getByText('Features')).toBeVisible();
  });

  test('should render tags', async ({ page }) => {
    await page.goto('/skills/1');
    // Scope to the tags container (assuming it's visually distinct or structured)
    // For now, using exact match which should help, but ideally scoped to a container.
    // Let's use text=pdf with exact: true
    await expect(page.getByText('pdf', { exact: true })).toBeVisible();
    await expect(page.getByText('ocr', { exact: true })).toBeVisible();
  });
});
