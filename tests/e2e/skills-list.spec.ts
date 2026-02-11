import { test, expect } from '@playwright/test';

test.describe('Skills Browsing Page', () => {
  test('should render skills list', async ({ page }) => {
    await page.goto('/skills');

    // Check header
    await expect(page.getByRole('heading', { name: 'Browse Skills' })).toBeVisible();

    // Check filter elements
    await expect(page.getByPlaceholder('Search skills...')).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible(); // Category select

    // Check list items
    const skillCards = page.locator('h3 > a');
    await expect(skillCards).toHaveCount(5); // We added 5 mock items
  });

  test('should display skill details in card', async ({ page }) => {
    await page.goto('/skills');
    
    // Check specific skill data
    await expect(page.getByText('sql-query-generator')).toBeVisible();
    await expect(page.getByText('Data', { exact: true })).toBeVisible(); // Category
    await expect(page.getByText('312')).toBeVisible(); // Stars
  });
});
