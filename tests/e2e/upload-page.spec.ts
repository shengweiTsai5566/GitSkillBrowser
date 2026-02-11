import { test, expect } from '@playwright/test';

test.describe('Upload Page', () => {
  test('should render upload form correctly', async ({ page }) => {
    await page.goto('/upload');

    // Check Header
    await expect(page.getByRole('heading', { name: 'Share a Skill' })).toBeVisible();

    // Check Inputs
    await expect(page.getByLabel('Git Repository URL')).toBeVisible();
    await expect(page.getByLabel('Version / Tag')).toBeVisible();

    // Check Buttons
    await expect(page.getByRole('button', { name: 'Scan & Register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    // Check Info Box
    await expect(page.getByText('Before you continue')).toBeVisible();
    await expect(page.getByText('metadata.json')).toBeVisible();
  });
});
